import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, Clock, MapPin, Sparkles, CheckCircle2, Ticket, Heart, Camera, ChevronRight, X } from 'lucide-react';
import SEO from './SEO';
import { generateSEO } from '../seo';

const ARTICLE_ID = 'natal-luz-penedo';
const MAIN_IMAGE = '/assets/imagens/eventos/natal-luz-penedo-tunel-de-luz.webp';
const CASA_IMAGE = '/assets/imagens/eventos/natal-luz-penedo-casa-papai-noel.webp';
const PAPAI_NOEL_IMAGE = '/assets/imagens/eventos/natal-luz-penedo-papai-noel-pequena-finlandia.webp';
const PONTE_IMAGE = '/assets/imagens/eventos/natal-luz-penedo-ponte-coracao.webp';
const ESTRELA_IMAGE = '/assets/imagens/eventos/natal-luz-penedo-estrela.webp';

interface NatalLuzArticleProps {
  onOpenDetail?: (item: any) => void;
  onNavigate?: (page: any, premiumSlug?: string | null) => void;
}

export const NatalLuzArticle: React.FC<NatalLuzArticleProps> = ({ onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const openModal = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <article className="bg-white text-gray-800">
      <SEO
        {...generateSEO('article', {
          slug: 'natal-luz-penedo',
          title: 'Natal Luz em Penedo 2026/2027: Guia Completo, Datas e Atrações',
          description: 'Descubra a magia do Natal Luz em Penedo 2026/2027. Programação de 28 de novembro até o Carnaval, Túnel de Luz gigante, Casa do Papai Noel e dicas de viagem.',
          image: MAIN_IMAGE,
          datePublished: '2026-11-19',
          keywords: [
            'natal luz penedo',
            'natal luz penedo 2026',
            'tunel de luz penedo',
            'pequena finlandia natal',
            'o que fazer em penedo no natal',
            'programacao natal luz penedo'
          ]
        })}
      />

      {/* Barra de Navegação Superior */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3.5 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/blog/"
            className="inline-flex items-center gap-2 text-sm font-bold text-penedo-forest hover:text-penedo-emerald transition-colors"
          >
            <ArrowRight className="rotate-180" size={18} /> Voltar para o Blog
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-penedo-gold bg-penedo-forest px-3 py-1 rounded-full">
            Temporada 2026/2027
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="relative bg-penedo-forest text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={MAIN_IMAGE}
            alt="Túnel de luz decorado no Natal Luz em Penedo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-penedo-forest via-penedo-forest/80 to-transparent z-1"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-penedo-gold font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={14} /> Especial Fim de Ano
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
            Natal Luz em Penedo 2026/2027: <span className="text-penedo-gold">A Magia da Serra</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8">
            Tudo o que você precisa saber para viver a temporada mais encantadora da Colônia Finlandesa: datas, o Túnel de Luz gigante, atrações e dicas exclusivas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Calendar size={15} className="text-penedo-gold" /> 19 de Novembro de 2026</span>
            <span className="text-penedo-gold/50">•</span>
            <span className="flex items-center gap-1.5"><Clock size={15} className="text-penedo-gold" /> 6 min de leitura</span>
            <span className="text-penedo-gold/50">•</span>
            <span className="flex items-center gap-1.5"><MapPin size={15} className="text-penedo-gold" /> Penedo — Itatiaia / RJ</span>
          </div>
        </div>
      </header>

      {/* Card Resumo Rápido */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-penedo-mint rounded-xl text-penedo-forest shrink-0">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Período Oficial</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">28/11/2026 a 09/02/2027</p>
              <p className="text-xs text-gray-500">Até o Carnaval (74 dias)</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-penedo-mint rounded-xl text-penedo-forest shrink-0">
              <Ticket size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Entrada</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">Gratuita</p>
              <p className="text-xs text-gray-500">Principais áreas públicas</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-penedo-mint rounded-xl text-penedo-forest shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Local Principal</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">Colônia Finlandesa</p>
              <p className="text-xs text-gray-500">Av. das Mangueiras & Velas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Artigo */}
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        
        {/* Seção 1: Introdução */}
        <section className="mb-12">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-serif italic mb-6 border-l-4 border-penedo-gold pl-5">
            “Quando as luzes de Natal se acendem ao entardecer na Serra da Mantiqueira, Penedo se transforma em uma vila nórdica saída de um conto de fadas.”
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-5">
            Sendo a única colônia finlandesa do Brasil, Penedo guarda uma relação especialíssima com o Natal. Afinal, a Lapônia — lar oficial do Papai Noel — fica exatamente na Finlândia. É por isso que, todos os anos, o distrito de Itatiaia recebe visitantes de todo o país para o aguardado <strong>Natal Luz</strong>.
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Em 2026/2027, a celebração será ainda mais especial: com abertura oficial no dia <strong>28 de novembro de 2026</strong>, a iluminação e as decorações natalinas foram estendidas para permanecer ativas durante todo o Réveillon e o mês de janeiro, estendendo-se até o <strong>Carnaval (09 de fevereiro de 2027)</strong>. São 74 dias para você subir a serra e curtir essa atmosfera única.
          </p>
        </section>

        {/* Foto de Destaque 1: Túnel de Luz */}
        <figure className="my-10">
          <div
            className="overflow-hidden rounded-2xl shadow-lg border border-gray-100 cursor-zoom-in group"
            onClick={() => openModal(MAIN_IMAGE, 'O espetacular Túnel de Luz na Avenida das Mangueiras em Penedo')}
          >
            <img
              src={MAIN_IMAGE}
              alt="O espetacular Túnel de Luz na Avenida das Mangueiras em Penedo"
              className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <figcaption className="text-xs text-gray-500 text-center mt-2.5 flex items-center justify-center gap-1.5">
            <Camera size={14} /> O Túnel de Luz dourado iluminando a Avenida das Mangueiras em Penedo.
          </figcaption>
        </figure>

        {/* Seção 2: Principais Atrações */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-penedo-forest mb-6 tracking-tight">
            As Principais Atrações do Natal Luz
          </h2>

          <div className="space-y-8">
            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-penedo-mint text-penedo-forest flex items-center justify-center text-sm font-black">1</span>
                O Grandioso Túnel de Luz
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Montado ao longo do centro turístico, o túnel é composto por milhares de micro-lâmpadas douradas que cobrem a rua como uma abóbada brilhante. À noite, passear a pé por dentro do túnel dá a sensação mágica de estar debaixo de uma chuva de estrelas. É o cenário fotográfico mais disputado do evento!
              </p>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-penedo-mint text-penedo-forest flex items-center justify-center text-sm font-black">2</span>
                A Pequena Finlândia & Casa do Papai Noel
              </h3>
              <p className="text-gray-700 leading-relaxed">
                O shopping a céu aberto mais famoso de Penedo ganha árvores de Natal decoradas, música temática e eventos especiais. É aqui que fica a tradicional <strong>Casa do Papai Noel</strong>, onde crianças e adultos podem conhecer o bom velhinho pessoalmente em um chalé de madeira típico com muita diversão.
              </p>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-penedo-mint text-penedo-forest flex items-center justify-center text-sm font-black">3</span>
                A Ponte do Coração e Iluminação Fluvial
              </h3>
              <p className="text-gray-700 leading-relaxed">
                As pontes de madeira que cruzam os cursos d’água da Colônia Finlandesa recebem arcos em formato de coração e cordões luminosos. Um dos locais favoritos de casais para fotos românticas de recordação.
              </p>
            </div>
          </div>
        </section>

        {/* Galeria de Fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
          <div
            className="overflow-hidden rounded-2xl shadow-md border border-gray-100 cursor-zoom-in group h-64"
            onClick={() => openModal(CASA_IMAGE, 'Casa do Papai Noel na Pequena Finlândia')}
          >
            <img
              src={CASA_IMAGE}
              alt="Casa do Papai Noel na Pequena Finlândia"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div
            className="overflow-hidden rounded-2xl shadow-md border border-gray-100 cursor-zoom-in group h-64"
            onClick={() => openModal(PONTE_IMAGE, 'Ponte do Coração iluminada no Natal Luz')}
          >
            <img
              src={PONTE_IMAGE}
              alt="Ponte do Coração iluminada no Natal Luz"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Seção 3: Dicas Práticas */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-penedo-forest mb-6 tracking-tight">
            Dicas Práticas para o seu Passeio
          </h2>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-penedo-emerald shrink-0 mt-1" />
              <p className="text-gray-700 leading-relaxed">
                <strong>Melhor horário para ver as luzes:</strong> O acendimento acontece ao entardecer, geralmente por volta das 18h30 às 19h00. Chegue por volta das 17h para estacionar com calma e tomar um café colonial antes da noite cair.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-penedo-emerald shrink-0 mt-1" />
              <p className="text-gray-700 leading-relaxed">
                <strong>Como se locomover:</strong> Deixe o carro estacionado na pousada ou em um dos bolsões centrais. O centro de Penedo é plano e muito gostoso de percorrer a pé.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-penedo-emerald shrink-0 mt-1" />
              <p className="text-gray-700 leading-relaxed">
                <strong>Clima de serra:</strong> Mesmo nos meses de verão, a brisa da serra à noite pode ser fresca. Leve um agasalho leve ou casaquinho para passear confortavelmente após o jantar.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-penedo-emerald shrink-0 mt-1" />
              <p className="text-gray-700 leading-relaxed">
                <strong>Gastronomia temática:</strong> Aproveite a visita para provar os sorvetes finlandeses, chocolates artesanais natalinos, trutas frescas da Mantiqueira e fondues especiais servidos nos restaurantes locais.
              </p>
            </li>
          </ul>
        </section>

        {/* Card CTA de Hospedagem e Gastronomia */}
        <div className="bg-gradient-to-br from-penedo-forest to-penedo-forest-dark text-white rounded-3xl p-8 md:p-10 my-12 shadow-xl relative overflow-hidden text-center">
          <div className="relative z-10 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black mb-4">
              Planejando sua viagem para o Natal Luz?
            </h3>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6">
              Como a procura por hospedagem é alta durante a temporada de fim de ano e férias de verão, recomendamos reservar sua pousada ou hotel com antecedência.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/onde-ficar/"
                className="px-6 py-3.5 rounded-full bg-penedo-gold text-penedo-forest font-bold text-sm uppercase tracking-wider hover:bg-white transition-all shadow-md"
              >
                Onde Ficar em Penedo
              </Link>
              <Link
                to="/gastronomia/"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider border border-white/20 transition-all"
              >
                Restaurantes & Cafés
              </Link>
            </div>
          </div>
        </div>

        {/* Seção FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-penedo-forest mb-6 tracking-tight">
            Perguntas Frequentes sobre o Natal Luz
          </h2>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 text-base mb-2">Quanto custa para entrar no Natal Luz em Penedo?</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                A entrada na cidade e o acesso às principais atrações decoradas, como o Túnel de Luz na Avenida das Mangueiras e as praças da Colônia, são <strong>100% gratuitos</strong>. Apenas atrações específicas privadas (como a entrada na Casa do Papai Noel na Pequena Finlândia) têm bilheteria própria.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 text-base mb-2">Até quando vai a decoração de Natal em Penedo?</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nesta edição de 2026/2027, o Natal Luz permanece ativo de <strong>28 de novembro de 2026 até o Carnaval (09 de fevereiro de 2027)</strong>, oferecendo uma temporada prolongada para turistas durante todas as férias de verão.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 text-base mb-2">O evento é acessível e pet-friendly?</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sim! As ruas centrais são planas e asfaltadas, permitindo fácil circulação de carrinhos de bebê e cadeirantes. Penedo é amplamente pet-friendly, permitindo que você passeie pelo túnel de luz acompanhado do seu pet na coleira.
              </p>
            </div>
          </div>
        </section>

        {/* Rodapé do Artigo */}
        <footer className="border-t border-gray-200 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/blog/"
            className="inline-flex items-center gap-2 text-sm font-bold text-penedo-forest hover:text-penedo-emerald transition-colors"
          >
            <ArrowRight className="rotate-180" size={16} /> Ver todos os artigos do Blog
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Compartilhe no Instagram:</span>
            <span className="text-xs font-bold text-penedo-forest">@vemprapenedo</span>
          </div>
        </footer>

      </div>

      {/* Modal de Zoom de Imagens */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-white hover:text-penedo-gold transition-colors p-2"
              aria-label="Fechar ampliação"
            >
              <X size={32} />
            </button>
            <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full object-contain max-h-[80vh] rounded-2xl"
              />
              <p className="text-white text-sm text-center mt-3 font-medium">{selectedImage.alt}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
