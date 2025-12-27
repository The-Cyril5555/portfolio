from PIL import Image
import os
import sys

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Configuration
input_dir = "public/assets/images/paintings"
quality = 85  # Qualité JPEG (0-100, 85 est un bon compromis)
max_width = 1920  # Largeur maximale en pixels

count = 0
# Parcourir tous les fichiers JPG
for filename in os.listdir(input_dir):
    if filename.lower().endswith('.jpg'):
        filepath = os.path.join(input_dir, filename)

        # Ouvrir l'image
        img = Image.open(filepath)

        # Redimensionner si trop large
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

        # Sauvegarder avec compression
        img.save(filepath, 'JPEG', quality=quality, optimize=True)
        count += 1
        print(f"[OK] Optimise: {filename}")

print(f"\nOptimisation terminee! {count} images optimisees.")
