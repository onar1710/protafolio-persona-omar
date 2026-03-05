import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';

import imageSizePkg from 'image-size';

const imageSize = typeof imageSizePkg === 'function' ? imageSizePkg : imageSizePkg?.imageSize;

export function rehypeImgDimensions() {
  return (tree, file) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;

      const props = node.properties ?? {};
      const srcRaw = props.src;
      if (typeof srcRaw !== 'string') return;

      if (!srcRaw.startsWith('/assets/blog/')) return;

      let decodedSrc = srcRaw;
      try {
        decodedSrc = decodeURIComponent(srcRaw);
      } catch {
        // ignore decode errors and keep raw
      }

      const relPath = decodedSrc.replace(/^\//, '');
      const absPath = path.resolve(process.cwd(), 'public', relPath);

      if (!fs.existsSync(absPath)) return;

      try {
        if (typeof imageSize !== 'function') return;
        const buf = fs.readFileSync(absPath);
        const { width, height } = imageSize(buf);

        if (typeof width === 'number' && typeof height === 'number') {
          if (!props.width) props.width = width;
          if (!props.height) props.height = height;
        }

        node.properties = props;
      } catch (err) {
        if (file?.message) {
          file.message(`rehype-img-dimensions: failed for ${srcRaw}: ${String(err)}`);
        }
      }
    });
  };
}
