export const BASE_URL = 'https://vemprapenedo.com.br';

export const DEFAULT_SEO = {
  title: 'Vem Pra Penedo | Guia Oficial de Turismo e Viagem de Penedo RJ',
  description: 'Descubra o melhor de Penedo RJ. Encontre pousadas charmosas, hotéis aconchegantes, restaurantes saborosos e passeios imperdíveis no guia turístico oficial.',
  image: `${BASE_URL}/assets/imagens/logo-google.png`,
  type: 'website',
  robots: 'index, follow',
  keywords: 'penedo, penedo rj, guia penedo, hoteis penedo, pousadas penedo, restaurantes penedo, turismo penedo, penedo turismo, o que fazer em penedo, onde ficar em penedo'
};

export const CATEGORY_METADATA: Record<string, { title: string; description: string }> = {
  'o-que-fazer': {
    title: 'O Que Fazer em Penedo RJ | Atrações e Passeios Turísticos',
    description: 'Conheça o que fazer em Penedo RJ. Roteiro completo com as principais cachoeiras, trilhas, passeios de quadriciclo e a famosa Pequena Finlândia.'
  },
  'onde-ficar': {
    title: 'Onde Ficar em Penedo RJ | Pousadas, Chalés e Hotéis de Charme',
    description: 'Guia completo de onde ficar em Penedo RJ. Encontre chalés com lareira, hotéis com piscina no centro e pousadas românticas perfeitas para casais.'
  },
  'gastronomia': {
    title: 'Gastronomia em Penedo RJ | Restaurantes e Chocolates Artesanais',
    description: 'Descubra onde comer em Penedo RJ. O melhor guia de restaurantes de trutas, fondues deliciosos, massas finas e as tradicionais fábricas de chocolate.'
  },
  'compras': {
    title: 'Compras em Penedo RJ | Lojas, Artesanato e Pequena Finlândia',
    description: 'Guia de compras em Penedo RJ. Saiba onde comprar chocolates artesanais finos, roupas de frio, lembranças, artesanato e presentes na Pequena Finlândia.'
  },
  'contato': {
    title: 'Contato | Anuncie ou Fale Conosco | Vem Pra Penedo',
    description: 'Fale com a equipe do Vem Pra Penedo. Dúvidas sobre turismo, sugestões de conteúdo ou anúncios para divulgar seu estabelecimento no guia oficial.'
  },
  'blog': {
    title: 'Blog de Penedo RJ | Dicas de Viagem, Roteiros e Pousadas',
    description: 'Acompanhe as melhores dicas de viagem de Penedo RJ no blog oficial. Roteiros de fim de semana, novidades locais e guias práticos para sua viagem.'
  }
};

export const FAQ_DATA: Record<string, { question: string; answer: string }[]> = {
  'o-que-fazer': [
    {
      question: 'Quais são as cachoeiras de mais fácil acesso em Penedo RJ?',
      answer: 'As Três Cachoeiras possuem acesso imediato à beira da estrada, ideais para famílias e idosos. A Cachoeira de Deus exige uma caminhada de 10 minutos.'
    },
    {
      question: 'É preciso pagar taxa para entrar nas cachoeiras de Penedo?',
      answer: 'Não, as principais quedas d\'água públicas (Três Cachoeiras, Cachoeira de Deus, Poço das Esmeraldas) são totalmente gratuitas e de livre acesso.'
    },
    {
      question: 'Qual a melhor época para fazer trilhas na região de Penedo?',
      answer: 'Os meses de outono e inverno (maio a setembro) são ideais para trilhas e cachoeiras, pois chove muito menos e o clima fica ameno.'
    }
  ],
  'onde-ficar': [
    {
      question: 'Quais as melhores regiões para se hospedar em Penedo RJ?',
      answer: 'O Centro (perto da Pequena Finlândia) é excelente para fazer tudo a pé. O Alto Penedo é recomendado para quem busca silêncio, lareira e contato com a natureza.'
    },
    {
      question: 'Os hotéis e pousadas em Penedo costumam ser pet-friendly?',
      answer: 'Muitas pousadas e chalés na região aceitam animais de estimação. Recomenda-se confirmar a política pet do local antes de efetuar a reserva.'
    },
    {
      question: 'Qual a antecedência necessária para reservar pousadas na alta temporada?',
      answer: 'Para finais de semana de inverno (junho a agosto) e feriados prolongados como o Natal de Luz, o ideal é reservar com 2 a 3 meses de antecedência.'
    }
  ],
  'gastronomia': [
    {
      question: 'Qual é o prato típico mais famoso de Penedo RJ?',
      answer: 'A truta fresca (servida com molhos variados) e o clássico rodízio de fondue (queijo, carne e chocolate) são os pratos mais famosos da cidade.'
    },
    {
      question: 'Preciso reservar mesa nos restaurantes de Penedo no final de semana?',
      answer: 'Nos finais de semana e alta temporada, as filas no centro são comuns. Para restaurantes concorridos como o Jardim Secreto, reservas são muito recomendadas.'
    },
    {
      question: 'Onde ficam as principais fábricas de chocolate em Penedo?',
      answer: 'A maioria dos estabelecimentos de chocolate artesanal localiza-se na Av. das Mangueiras e dentro do shopping Pequena Finlândia.'
    }
  ],
  'compras': [
    {
      question: 'Quais são os shoppings e centros de compras mais famosos de Penedo?',
      answer: 'A Pequena Finlândia (shopping temático escandinavo a céu aberto) e o Vale dos Duendes são os principais polos comerciais da região.'
    },
    {
      question: 'O que vale a pena comprar de lembrança em Penedo RJ?',
      answer: 'Chocolates artesanais, compotas e geleias locais, peças de artesanato em madeira, malhas de frio e velas decorativas fabricadas na região.'
    },
    {
      question: 'As lojinhas do centro de Penedo funcionam de segunda a segunda?',
      answer: 'O comércio abre diariamente, mas o funcionamento total ocorre de quinta a domingo. Segundas e terças-feiras costumam ter horários reduzidos.'
    }
  ]
};
