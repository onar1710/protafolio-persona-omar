#!/usr/bin/env python3
import re

def fix_article_titles(file_path):
    """Elimina H3: y H2: de todos los títulos del artículo"""
    
    # Leer el archivo
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Reemplazar H3: por ###
    content = re.sub(r'### H3:', '###', content)
    
    # Reemplazar H2: por ##
    content = re.sub(r'## H2:', '##', content)
    
    # Guardar el archivo
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Archivo {file_path} corregido!")
    print("✅ Todos los H3: y H2: han sido eliminados")

if __name__ == "__main__":
    file_path = "src/content/blog/diseno-web-seo.md"
    fix_article_titles(file_path)
