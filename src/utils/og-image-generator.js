/**
 * Utilidad para generar URLs de imágenes OG (Open Graph) automáticamente
 */

export function generateOGImage({
  title,
  description,
  image,
  siteName = 'Omar Fuentes',
  baseUrl = 'https://omarfuentes.com'
}) {
  // Si ya hay una imagen, usarla
  if (image) {
    return new URL(image, baseUrl).toString();
  }

  // Generar imagen OG dinámica con parámetros
  const params = new URLSearchParams({
    title: title || '',
    description: description || '',
    siteName,
    theme: 'dark',
    fontSize: '72',
    fontWeight: 'bold'
  });

  // Usar un servicio de generación de imágenes OG (puedes cambiar esto)
  return `https://og-image-generator.vercel.app/api/generate?${params.toString()}`;
}

/**
 * Genera metadatos completos para redes sociales
 */
export function generateSocialMeta({
  title,
  description,
  image,
  url,
  type = 'article',
  siteName = 'Omar Fuentes',
  author = 'Omar Fuentes',
  publishedTime,
  modifiedTime,
  tags = []
}) {
  const ogImage = generateOGImage({ title, description, image, siteName });

  return {
    // Open Graph (Facebook, LinkedIn)
    'og:type': type,
    'og:title': title,
    'og:description': description,
    'og:image': ogImage,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': title,
    'og:url': url,
    'og:site_name': siteName,
    'og:locale': 'es_ES',

    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': ogImage,
    'twitter:image:alt': title,
    'twitter:creator': '@omarfuentes052',
    'twitter:site': '@omarfuentes052',

    // Article specific
    ...(type === 'article' && {
      'article:author': author,
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      ...(tags.length > 0 && tags.map(tag => ({ 'article:tag': tag })))
    })
  };
}
