import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  robots?: string;
  schema?: object | object[];
}

export default function SEO({
  title = 'Vem Pra Penedo | Guia Completo de Penedo RJ - Hotéis, Restaurantes, Passeios e Eventos',
  description = 'Descubra os melhores hotéis, pousadas, restaurantes, passeios, eventos e atrações de Penedo RJ. Planeje sua viagem com o Vem Pra Penedo.',
  canonical = 'https://vemprapenedo.com.br/',
  image = 'https://vemprapenedo.com.br/assets/imagens/logo-google.png',
  url = 'https://vemprapenedo.com.br/',
  type = 'website',
  keywords = 'penedo, penedo rj, guia penedo, hoteis penedo, pousadas penedo, restaurantes penedo, turismo penedo, penedo turismo, o que fazer em penedo, onde ficar em penedo',
  robots = 'index, follow',
  schema,
}: SEOProps) {
  const finalCanonical = canonical || url;
  const testHostnames = [
    'vemprapenedo.com',
    'www.vemprapenedo.com',
    'homologacao.vemprapenedo.com',
    'homologacao.vemprapenedo.com.br',
  ];
  const [effectiveRobots, setEffectiveRobots] = useState(robots);

  useEffect(() => {
    setEffectiveRobots(
      testHostnames.includes(window.location.hostname)
        ? 'noindex, nofollow, noarchive'
        : robots
    );
  }, [robots]);

  const isLogoImage = image.includes('logo-google.png');
  const imgWidth = isLogoImage ? "512" : "800";
  const imgHeight = isLogoImage ? "512" : "600";
  const imagePath = image.split('?')[0].toLowerCase();
  const imgType = imagePath.endsWith('.png')
    ? 'image/png'
    : imagePath.endsWith('.webp')
      ? 'image/webp'
      : imagePath.endsWith('.avif')
        ? 'image/avif'
        : 'image/jpeg';
  const imgAlt = isLogoImage ? "Logo Vem Pra Penedo" : `Imagem representativa de ${title}`;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={effectiveRobots} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={imgWidth} />
      <meta property="og:image:height" content={imgHeight} />
      <meta property="og:image:type" content={imgType} />
      <meta property="og:image:alt" content={imgAlt} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content="Vem Pra Penedo" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imgAlt} />

      {/* JSON-LD Structured Data Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
