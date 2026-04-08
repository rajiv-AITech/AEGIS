# In your local AEGIS repo on the v2 branch
# Replace vite.config.ts with this content:

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: { port: 3000 },
  build: { outDir: 'dist', sourcemap: false },
});
EOF

git add vite.config.ts
git commit -m "fix: ESM-compatible __dirname in vite.config"
git push origin v2
