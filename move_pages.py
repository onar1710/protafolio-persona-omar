#!/usr/bin/env python3
"""
Script para mover todo el contenido de src/pages/[lang]/ a src/pages/
para eliminar el prefijo /es/ de las URLs.
"""

import shutil
from pathlib import Path

# Rutas
src = Path("src/pages/[lang]")
dst = Path("src/pages")

def move_all():
    if not src.exists():
        print(f"❌ No existe la carpeta: {src}")
        return

    print(f"📁 Moviendo contenido de {src} a {dst}")
    
    # Mover archivos y carpetas recursivamente
    for item in src.glob("*"):
        try:
            if item.is_file():
                shutil.move(str(item), str(dst / item.name))
                print(f"📄 Movido archivo: {item.name}")
            elif item.is_dir():
                # Si la carpeta ya existe en destino, mover su contenido
                dst_dir = dst / item.name
                dst_dir.mkdir(exist_ok=True)
                for subitem in item.glob("*"):
                    if subitem.is_file():
                        shutil.move(str(subitem), str(dst_dir / subitem.name))
                        print(f"📄 Movido archivo: {item.name}/{subitem.name}")
                    elif subitem.is_dir():
                        shutil.move(str(subitem), str(dst_dir / subitem.name))
                        print(f"📁 Movida carpeta: {item.name}/{subitem.name}")
                print(f"📁 Movida carpeta: {item.name}")
        except Exception as e:
            print(f"❌ Error moviendo {item}: {e}")

    print("✅ Movimiento completado.")

if __name__ == "__main__":
    move_all()
