#!/usr/bin/env python3
import re

def fix_pros_contras(file_path):
    """Separa correctamente todos los Pros y Contras del artículo"""
    
    # Leer el archivo
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Patrón para encontrar Pros, Contras y Beneficio SEO juntos
    pattern = r'(Pros:.*?)\s+(Contras:.*?)\s+(Beneficio SEO:.*?)'
    
    def replace_func(match):
        pros = match.group(1).strip()
        contras = match.group(2).strip()
        beneficio = match.group(3).strip()
        
        return f"{pros}\n\n{contras}\n\n{beneficio}"
    
    # Reemplazar todas las ocurrencias
    content = re.sub(pattern, replace_func, content, flags=re.DOTALL)
    
    # Guardar el archivo
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Archivo {file_path} corregido!")
    print("✅ Todos los Pros y Contras están separados correctamente")

if __name__ == "__main__":
    file_path = "src/content/blog/diseno-web-seo.md"
    fix_pros_contras(file_path)
