import fs from 'fs';
import path from 'path';

const dir = './attached_assets/generated_videos';
const files = fs.readdirSync(dir);

files.forEach(file => {
    const stats = fs.statSync(path.join(dir, file));
    console.log(`${file}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
});
