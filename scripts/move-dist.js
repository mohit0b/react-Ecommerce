import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'ecommerce-frontend', 'dist');
const dest = path.join(process.cwd(), 'ecommerce-backend', 'dist');

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}

function moveDist() {
  try {
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    if (fs.existsSync(src)) {
        copyFolderSync(src, dest);
        console.log('Successfully moved frontend dist to backend directory.');
    } else {
        console.error('Frontend dist folder not found. Did you run npm run build:frontend?');
    }
  } catch (err) {
    console.error('Error moving dist folder:', err);
  }
}

moveDist();
