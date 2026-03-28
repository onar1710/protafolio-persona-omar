#!/usr/bin/env python3
"""
Script para analizar y evaluar imágenes descargadas
para determinar su idoneidad para artículos de blog.
"""

import os
import json
from pathlib import Path
from PIL import Image, ImageStat
import hashlib

class ImageAnalyzer:
    def __init__(self):
        self.eval_dir = Path("src/assets/blog/descarga-imagen-evaluacion")
        self.results = []
    
    def get_image_info(self, image_path):
        """Obtiene información técnica de una imagen"""
        try:
            with Image.open(image_path) as img:
                info = {
                    'filename': image_path.name,
                    'size_bytes': image_path.stat().st_size,
                    'dimensions': img.size,
                    'format': img.format,
                    'mode': img.mode,
                    'aspect_ratio': img.size[0] / img.size[1],
                    'megapixels': (img.size[0] * img.size[1]) / 1000000
                }
                
                # Análisis de calidad
                stat = ImageStat.Stat(img.convert('L'))
                info['brightness'] = stat.mean[0] / 255  # 0-1
                info['contrast'] = stat.stddev[0] / 255  # 0-1
                
                return info
        except Exception as e:
            return {'error': str(e)}
    
    def calculate_quality_score(self, image_info):
        """Calcula una puntuación de calidad (0-100)"""
        score = 0
        factors = []
        
        # Resolución (máximo 30 puntos)
        mp = image_info.get('megapixels', 0)
        if mp >= 2:
            score += 30
            factors.append("Resolución alta (2MP+)")
        elif mp >= 1:
            score += 20
            factors.append("Resolución media (1-2MP)")
        else:
            score += 10
            factors.append("Resolución baja (<1MP)")
        
        # Relación de aspecto (máximo 15 puntos)
        aspect = image_info.get('aspect_ratio', 0)
        if 1.3 <= aspect <= 2.0:  # 4:3 a 2:1
            score += 15
            factors.append("Relación de aspecto ideal")
        elif 1.0 <= aspect <= 2.5:
            score += 10
            factors.append("Relación de aspecto aceptable")
        else:
            factors.append("Relación de aspecto inusual")
        
        # Brillo (máximo 20 puntos)
        brightness = image_info.get('brightness', 0)
        if 0.3 <= brightness <= 0.7:
            score += 20
            factors.append("Brillo óptimo")
        elif 0.2 <= brightness <= 0.8:
            score += 15
            factors.append("Brillo aceptable")
        else:
            score += 5
            factors.append("Brillo extremo")
        
        # Contraste (máximo 20 puntos)
        contrast = image_info.get('contrast', 0)
        if contrast >= 0.3:
            score += 20
            factors.append("Contraste bueno")
        elif contrast >= 0.2:
            score += 15
            factors.append("Contraste aceptable")
        else:
            score += 5
            factors.append("Contraste bajo")
        
        # Tamaño de archivo (máximo 15 puntos)
        size_mb = image_info.get('size_bytes', 0) / (1024 * 1024)
        if 0.1 <= size_mb <= 2:
            score += 15
            factors.append("Tamaño óptimo")
        elif size_mb <= 5:
            score += 10
            factors.append("Tamaño aceptable")
        else:
            score += 5
            factors.append("Archivo grande")
        
        return score, factors
    
    def evaluate_suitability(self, score, image_info, metadata=None):
        """Evalúa la idoneidad para blog"""
        if score >= 80:
            return "Excelente", "Ideal para uso profesional"
        elif score >= 65:
            return "Buena", "Adecuada para blog"
        elif score >= 50:
            return "Regular", "Usable con mejoras"
        else:
            return "Pobre", "No recomendada"
    
    def analyze_images(self, topic_filter=None):
        """Analiza todas las imágenes en el directorio"""
        print("🔍 Analizando imágenes descargadas...")
        
        if not self.eval_dir.exists():
            print("❌ Directorio de evaluación no encontrado")
            return
        
        # Buscar archivos de imagen
        image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
        image_files = []
        
        for ext in image_extensions:
            image_files.extend(self.eval_dir.glob(f"*{ext}"))
        
        if not image_files:
            print("❌ No se encontraron imágenes para analizar")
            return
        
        print(f"📊 Encontradas {len(image_files)} imágenes")
        
        # Analizar cada imagen
        for img_path in image_files:
            print(f"\n🖼️  Analizando: {img_path.name}")
            
            # Información técnica
            tech_info = self.get_image_info(img_path)
            
            if 'error' in tech_info:
                print(f"❌ Error: {tech_info['error']}")
                continue
            
            # Puntuación de calidad
            score, factors = self.calculate_quality_score(tech_info)
            
            # Evaluación de idoneidad
            suitability, recommendation = self.evaluate_suitability(score, tech_info)
            
            # Buscar metadatos si existen
            metadata = self.find_metadata(img_path)
            
            analysis = {
                'filename': img_path.name,
                'technical_info': tech_info,
                'quality_score': score,
                'quality_factors': factors,
                'suitability': suitability,
                'recommendation': recommendation,
                'metadata': metadata
            }
            
            self.results.append(analysis)
            
            # Mostrar resumen
            print(f"   📊 Puntuación: {score}/100 ({suitability})")
            print(f"   💡 {recommendation}")
            print(f"   📏 Dimensiones: {tech_info['dimensions']}")
            print(f"   💾 Tamaño: {tech_info['size_bytes']/1024/1024:.2f} MB")
        
        # Guardar análisis completo
        self.save_analysis_report()
        
        # Mostrar ranking
        self.show_ranking()
    
    def find_metadata(self, image_path):
        """Busca metadatos correspondientes a una imagen"""
        base_name = image_path.stem.split('-')[:-2]  # Quitar fuente y número
        metadata_pattern = '-'.join(base_name) + '-metadata.json'
        
        metadata_file = self.eval_dir / metadata_pattern
        if metadata_file.exists():
            try:
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        
        return None
    
    def save_analysis_report(self):
        """Guarda el informe completo de análisis"""
        report_file = self.eval_dir / "analysis-report.json"
        
        report = {
            'analysis_date': str(Path.cwd()),
            'total_images': len(self.results),
            'average_score': sum(r['quality_score'] for r in self.results) / len(self.results) if self.results else 0,
            'images': self.results
        }
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Informe guardado: {report_file}")
    
    def show_ranking(self):
        """Muestra ranking de mejores imágenes"""
        if not self.results:
            return
        
        # Ordenar por puntuación
        sorted_results = sorted(self.results, key=lambda x: x['quality_score'], reverse=True)
        
        print("\n🏆 RANKING DE IMÁGENES")
        print("=" * 60)
        
        for i, result in enumerate(sorted_results[:10], 1):
            print(f"{i:2d}. {result['filename']}")
            print(f"     Puntuación: {result['quality_score']}/100 ({result['suitability']})")
            print(f"     Dimensiones: {result['technical_info']['dimensions']}")
            print(f"     Tamaño: {result['technical_info']['size_bytes']/1024/1024:.2f} MB")
            print()

def main():
    """Función principal"""
    analyzer = ImageAnalyzer()
    
    print("🎯 Analizador de Imágenes para Blog")
    print("=" * 40)
    
    analyzer.analyze_images()

if __name__ == "__main__":
    main()
