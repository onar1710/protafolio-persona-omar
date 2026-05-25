#!/usr/bin/env node

/**
 * EJEMPLO DE USO PROGRAMÁTICO
 * Este archivo muestra cómo usar el linker como módulo en tus propios scripts
 */

const { readArticle, insertLinks, scanContentDirectory } = require('./seo-internal-linker');

// Ejemplo 1: Procesar un solo artículo
async function procesarUnArticulo() {
  const rutaArticulo = 'src/content/blog/mi-articulo.md';
  
  console.log('📝 Procesando artículo:', rutaArticulo);
  
  const content = readArticle(rutaArticulo);
  const articulos = scanContentDirectory(rutaArticulo);
  
  console.log(`Encontrados ${articulos.length} artículos en el proyecto`);
  
  // Aquí llamarías a la IA para obtener sugerencias
  // const sugerencias = await callAI(content, articulos);
  
  // Y luego insertar los enlaces
  // const contenidoModificado = insertLinks(content, sugerencias.links);
}

// Ejemplo 2: Procesar múltiples artículos en lote
async function procesarVariosArticulos() {
  const articulos = [
    'src/content/blog/articulo-1.md',
    'src/content/blog/articulo-2.md',
    'src/content/blog/articulo-3.md'
  ];
  
  for (const articulo of articulos) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Procesando: ${articulo}`);
    console.log('='.repeat(60));
    
    // Aquí iría tu lógica de procesamiento
    // await procesarUnArticulo(articulo);
  }
}

// Ejemplo 3: Integración con workflow automatizado
async function workflowAutomatizado() {
  // 1. Escanear todos los artículos
  const todosLosArticulos = scanContentDirectory('src/content/blog');
  
  // 2. Filtrar artículos sin enlaces internos
  const articulosSinEnlaces = todosLosArticulos.filter(articulo => {
    const content = readArticle(articulo.path);
    const enlaces = (content.match(/\[.*?\]\(\/blog\/.*?\)/g) || []);
    return enlaces.length < 3; // Menos de 3 enlaces internos
  });
  
  console.log(`📊 Artículos que necesitan enlaces: ${articulosSinEnlaces.length}`);
  
  // 3. Procesar cada uno
  for (const articulo of articulosSinEnlaces) {
    console.log(`\n🔗 Procesando: ${articulo.title}`);
    // await procesarUnArticulo(articulo.path);
  }
}

// Ejemplo 4: Análisis de estructura de enlaces del sitio
function analizarEstructuraDeEnlaces() {
  const articulos = scanContentDirectory('src/content/blog');
  
  const estadisticas = articulos.map(articulo => {
    const content = readArticle(articulo.path);
    const enlaces = (content.match(/\[.*?\]\(\/blog\/.*?\)/g) || []);
    
    return {
      titulo: articulo.title,
      slug: articulo.slug,
      cantidadEnlaces: enlaces.length,
      enlaces: enlaces
    };
  });
  
  console.log('\n📊 ANÁLISIS DE ENLACES INTERNOS\n');
  console.log('Artículo'.padEnd(50), 'Enlaces');
  console.log('-'.repeat(60));
  
  estadisticas.forEach(stat => {
    console.log(
      stat.titulo.substring(0, 47).padEnd(50), 
      stat.cantidadEnlaces
    );
  });
  
  const promedio = estadisticas.reduce((sum, s) => sum + s.cantidadEnlaces, 0) / estadisticas.length;
  console.log('-'.repeat(60));
  console.log(`Promedio de enlaces por artículo: ${promedio.toFixed(2)}`);
  
  return estadisticas;
}

// Ejemplo 5: Detectar oportunidades de enlazado
function detectarOportunidades() {
  const articulos = scanContentDirectory('src/content/blog');
  
  // Crear un mapa de temas/keywords por artículo
  const mapaKeywords = articulos.map(articulo => {
    const content = readArticle(articulo.path).toLowerCase();
    
    // Keywords comunes de SEO (personaliza según tu nicho)
    const keywords = [
      'seo', 'posicionamiento', 'google', 'enlaces', 'contenido',
      'keywords', 'backlinks', 'optimización', 'tráfico', 'ranking'
    ];
    
    const encontradas = keywords.filter(kw => content.includes(kw));
    
    return {
      articulo: articulo.title,
      slug: articulo.slug,
      keywords: encontradas
    };
  });
  
  console.log('\n🔍 OPORTUNIDADES DE ENLAZADO\n');
  
  // Encontrar artículos que mencionan keywords de otros artículos
  articulos.forEach(articuloActual => {
    const contentActual = readArticle(articuloActual.path).toLowerCase();
    
    const oportunidades = mapaKeywords.filter(mapa => 
      mapa.slug !== articuloActual.slug && 
      mapa.keywords.some(kw => contentActual.includes(kw))
    );
    
    if (oportunidades.length > 0) {
      console.log(`\n📄 ${articuloActual.title}`);
      console.log('   Podría enlazar a:');
      oportunidades.slice(0, 5).forEach(op => {
        console.log(`   → ${op.articulo} (${op.keywords.join(', ')})`);
      });
    }
  });
}

// MENÚ INTERACTIVO
function mostrarMenu() {
  console.log('\n' + '='.repeat(60));
  console.log('🔗 SEO INTERNAL LINKER - EJEMPLOS DE USO');
  console.log('='.repeat(60));
  console.log('\n1. Procesar un solo artículo');
  console.log('2. Procesar varios artículos en lote');
  console.log('3. Workflow automatizado');
  console.log('4. Analizar estructura de enlaces');
  console.log('5. Detectar oportunidades de enlazado');
  console.log('0. Salir\n');
}

// EJECUCIÓN
async function main() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  mostrarMenu();
  
  readline.question('Selecciona una opción: ', async (opcion) => {
    switch(opcion) {
      case '1':
        await procesarUnArticulo();
        break;
      case '2':
        await procesarVariosArticulos();
        break;
      case '3':
        await workflowAutomatizado();
        break;
      case '4':
        analizarEstructuraDeEnlaces();
        break;
      case '5':
        detectarOportunidades();
        break;
      case '0':
        console.log('👋 ¡Hasta luego!');
        break;
      default:
        console.log('❌ Opción no válida');
    }
    
    readline.close();
  });
}

if (require.main === module) {
  main();
}

module.exports = {
  procesarUnArticulo,
  procesarVariosArticulos,
  workflowAutomatizado,
  analizarEstructuraDeEnlaces,
  detectarOportunidades
};
