import { visit } from 'unist-util-visit';

/**
 * Plugin remark para añadir automáticamente atributos alt a las imágenes
 * Convierte ![texto](ruta) a <img src="ruta" alt="texto" title="texto" />
 */
export function remarkImageAlt() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      // Si no tiene alt, usar el nombre del archivo
      if (!node.alt || node.alt.trim() === '') {
        const filename = node.url.split('/').pop().split('.')[0];
        node.alt = filename.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      
      // Convertir a nodo HTML img
      node.type = 'html';
      node.value = `<img src="${node.url}" alt="${node.alt}" title="${node.alt}" loading="lazy" decoding="async" />`;
    });
  };
}
