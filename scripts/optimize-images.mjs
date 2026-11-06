// Génère les images WebP optimisées du portfolio à partir des originaux.
// Usage : node scripts/optimize-images.mjs
//
// Chaque source produit une ou plusieurs largeurs (srcset) dans
// public/assets/images/paintings/<slug>-<largeur>.webp
// Les originaux lourds ne sont pas servis : ils restent dans scripts/originals/
// (ignoré par le build) pour pouvoir régénérer au besoin.

import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'scripts/originals';
const OUT = 'public/assets/images/paintings';

const IMAGES = [
  { src: 'fallen_angel.jpg', slug: 'cabanel-ange-dechu', widths: [680] },
  { src: 'Leighton-God_Speed!.jpg', slug: 'leighton-god-speed', widths: [800, 1100, 1400] },
  { src: 'Jan_Matejko,_Stańczyk.jpg', slug: 'matejko-stanczyk', widths: [800, 1100, 1400] },
  { src: 'John_Martin_Le_Pandemonium_Louvre.jpg', slug: 'martin-pandemonium', widths: [800, 1100, 1400] },
  { src: 'europeana-84R6ipsqaxo-unsplash.jpg', slug: 'van-utrecht-nature-morte', widths: [800, 1100, 1400] },
  { src: 'Arnold_Boecklin-fiedelnder_Tod.jpg', slug: 'boecklin-autoportrait', widths: [800, 1100, 1400] },
  { src: 'europeana-TjegK_z-0j8-unsplash.jpg', slug: 'van-de-velde-coup-de-canon', widths: [700, 1200] },
];

await mkdir(OUT, { recursive: true });

for (const img of IMAGES) {
  for (const width of img.widths) {
    const dest = path.join(OUT, `${img.slug}-${width}.webp`);
    await sharp(path.join(SRC, img.src))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 74, effort: 6 })
      .toFile(dest);
    const { size } = await stat(dest);
    console.log(`${dest}  ${(size / 1024).toFixed(0)} Ko`);
  }
}
