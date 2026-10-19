import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import { createServer } from 'vite';
import puppeteer from 'puppeteer';

test('agenda: cards responsivos, filtros, histórico, busca e detalhe', { timeout: 120000 }, async () => {
  const server = await createServer({server:{host:'127.0.0.1',port:0}});
  let browser;
  try {
    await server.listen();
    const base = `http://127.0.0.1:${server.httpServer.address().port}`;
    browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    await page.evaluateOnNewDocument(() => {
      const OriginalDate = Date;
      window.Date = class extends OriginalDate {
        constructor(...args) { super(...(args.length ? args : ['2026-10-14T15:00:00Z'])); }
        static now() { return new OriginalDate('2026-10-14T15:00:00Z').getTime(); }
      };
    });
    await page.setRequestInterception(true);
    page.on('request', request => new URL(request.url()).hostname === '127.0.0.1' ? request.continue() : request.abort());
    await page.setViewport({width:1440,height:1000});
    await page.goto(`${base}/eventos/`);
    await page.waitForSelector('[data-event-card]');
    assert.equal(await page.$$eval('[data-event-card]', els=>els.length),16);
    assert.equal(await page.$$eval('link[rel=canonical]', els=>els.length),1);
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.textContent==='Recusar')?.click());
    await fs.mkdir('artifacts/agenda',{recursive:true});
    for (const width of [1440,1920,768,390]) {
      await page.setViewport({width,height:1000});
      const boxes=await page.$$eval('#proximos [data-event-artwork]', els=>els.slice(0,3).map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));
      assert.ok(boxes.every(r=>Math.abs(r.w/r.h-1.5)<0.02));
      if(width>=1024) {assert.equal(boxes[0].y,boxes[1].y);assert.ok(boxes[0].w>=580&&boxes[0].w<=620);assert.ok(boxes[2].y>boxes[0].y);}
      else assert.ok(boxes[1].y>boxes[0].y);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      await page.screenshot({path:`artifacts/agenda/agenda-${width}.png`,fullPage:false});
      await page.$eval('#proximos',el=>el.scrollIntoView({behavior:'instant'}));
      await page.screenshot({path:`artifacts/agenda/cards-${width}.png`});
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    }
    await page.click('button[aria-controls="mobile-navigation"]');
    await page.waitForFunction(()=>{const menu=document.querySelector('#mobile-navigation');const contact=menu.querySelector('a[href="/contato/"]');return contact.getBoundingClientRect().bottom<=menu.getBoundingClientRect().bottom;});
    await page.click('button[aria-controls="mobile-navigation"]');
    await page.select('select','esportes');
    assert.equal(await page.$$eval('[data-event-card]',els=>els.length),1);
    await page.select('select','');
    await page.$eval('#anteriores a', el=>el.click());
    await page.waitForSelector('#event-about');
    assert.match(await page.evaluate(()=>document.body.innerText),/Evento encerrado/);
    assert.equal(await page.$$eval('link[rel=canonical]',els=>els.length),1);
    await page.goBack();
    await page.waitForSelector('#proximos');
    await page.goto(base);
    await page.waitForSelector('[data-events-highlight]');
    assert.equal(await page.$$eval('[data-events-highlight] [data-event-card]',els=>els.length),4);
    await page.setViewport({width:1440,height:1000});
    await page.$eval('[data-events-highlight]',el=>el.scrollIntoView({behavior:'instant'}));
    await page.screenshot({path:'artifacts/agenda/home.png'});
    await page.evaluate(()=>document.querySelector('[data-events-highlight]').nextElementSibling.scrollIntoView({behavior:'instant',block:'center'}));
    await page.waitForSelector('.search-input');
    await page.type('input','Kirpputori');
    await page.waitForFunction(()=>document.body.innerText.includes('Resultados da Busca'));
    assert.equal(await page.$$eval('section:not([data-events-highlight]) [data-event-card]',els=>els.length),3);
    await page.goto(`${base}/eventos/nao-existe/`);
    await page.waitForFunction(()=>document.title.includes('não encontrado'));
    assert.match(await page.$eval('meta[name=robots]',el=>el.content),/noindex/);
  } finally { if(browser) await browser.close(); await server.close(); }
});

test('agenda atualiza ao virar o dia, mantém rascunhos ocultos e recupera imagem ausente', { timeout: 60000 }, async () => {
  const event = {id:'fixture',slug:'fixture',title:'Evento de teste',summary:'Registro isolado',description:['Teste isolado.'],category:'cultura',published:true,startDate:'2026-10-14',locationName:'Penedo',image:'/assets/cartaz-inexistente-teste.png'};
  const fixtures=[event,{...event,id:'draft',slug:'draft',title:'Rascunho oculto',published:false}];
  const server=await createServer({plugins:[{name:'events-fixture',enforce:'pre',load(id){if(id.replaceAll('\\','/').endsWith('/src/data/events.json'))return JSON.stringify(fixtures);}}],server:{host:'127.0.0.1',port:0}});
  let browser;
  try {
    await server.listen();
    browser=await puppeteer.launch({headless:true});
    const page=await browser.newPage();
    await page.evaluateOnNewDocument(()=>{
      const OriginalDate=Date;window.eventTestNow='2026-10-15T02:59:59Z';
      window.Date=class extends OriginalDate {constructor(...args){super(...(args.length?args:[window.eventTestNow]));}static now(){return new OriginalDate(window.eventTestNow).getTime();}};
    });
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/eventos/`);
    await page.waitForSelector('#proximos [data-event-card]');
    assert.equal(await page.$$eval('[data-event-card]',els=>els.length),1);
    await page.waitForSelector('[data-event-artwork] [role=img]');
    await page.evaluate(()=>{window.eventTestNow='2026-10-15T03:00:01Z';window.dispatchEvent(new Event('focus'));});
    await page.waitForSelector('#anteriores [data-event-card]');
    assert.equal(await page.$('#proximos'),null);
    assert.doesNotMatch(await page.evaluate(()=>document.body.innerText),/Rascunho oculto/);
  } finally {if(browser)await browser.close();await server.close();}
});

test('carrossel permite setas, indicadores e teclado sem acionar o link do card', {timeout:60000}, async()=>{
  const images=[{src:'/assets/imagens/eventos/temporada-da-truta-2026-horizontal.webp',alt:'Primeira imagem'},{src:'/assets/imagens/eventos/agenda-penedo-hero.webp',alt:'Segunda imagem',caption:'Foto da edição de 2026'},{src:'/assets/imagem-ausente-teste.webp',alt:'Terceira imagem'}];
  const event={id:'galeria',slug:'galeria',title:'Evento com galeria',summary:'Teste',description:['Teste'],category:'cultura',published:true,startDate:'2099-01-01',images};
  const server=await createServer({plugins:[{name:'gallery-fixture',enforce:'pre',load(id){if(id.replaceAll('\\','/').endsWith('/src/data/events.json'))return JSON.stringify([event]);}}],server:{host:'127.0.0.1',port:0}});
  let browser;
  try {
    await server.listen();browser=await puppeteer.launch({headless:true});const page=await browser.newPage();
    const base=`http://127.0.0.1:${server.httpServer.address().port}`;
    for(const route of ['/eventos/','/eventos/galeria/','/']){
      await page.setViewport({width:390,height:844});await page.goto(base+route,{waitUntil:'domcontentloaded'});
      await page.waitForSelector('[aria-label="Próxima imagem"]');
      await page.$eval('[data-event-artwork]',e=>e.scrollIntoView({behavior:'instant',block:'center'}));
      await page.click('[aria-label="Próxima imagem"]');
      await page.waitForSelector('img[alt="Segunda imagem"]');assert.equal(new URL(page.url()).pathname,route);
      assert.match(await page.$eval('[data-event-artwork]',e=>e.innerText),/Foto da edição de 2026/);
      assert.equal(await page.$eval('[aria-label="Próxima imagem"]',e=>e.closest('a')===null),true);
      await page.focus('[aria-label="Imagem anterior"]');await page.keyboard.press('Enter');await page.waitForSelector('img[alt="Primeira imagem"]');
      await page.click('[aria-label="Ver imagem 2"]');await page.waitForSelector('img[alt="Segunda imagem"]');
      await page.click('[aria-label="Próxima imagem"]');await page.waitForSelector('[data-event-artwork] [role=img]');
      await page.click('[aria-label="Próxima imagem"]');await page.waitForSelector('img[alt="Primeira imagem"]');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
    await page.goto(base+'/eventos/');await page.waitForSelector('[data-event-artwork] a');await page.$eval('[data-event-artwork] a',e=>e.click());await page.waitForSelector('#event-about');assert.equal(new URL(page.url()).pathname,'/eventos/galeria/');
  } finally {if(browser)await browser.close();await server.close();}
});
