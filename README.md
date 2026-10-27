# SMAUMU (SMA UntukMu) — Frontend Web Platform (React.js)

Platform transparansi kuota penerimaan peserta didik baru (PPDB) SMAN real-time bagi siswa kelas 9 dan orang tua, dibangun menggunakan **React (Vite)**, **React Router**, dan **Tailwind CSS**. Siap di-deploy langsung ke **GitHub Pages**.

---

## 🎨 Color Palette & Typography

- **Primary**: `#800020` (`smaumu-primary`)
- **Accent**: `#D45060` (`smaumu-accent`)
- **Surface**: `#F3E6D5` (`smaumu-surface`)
- **Base Background**: `#FFF9F2` (`smaumu-base`)

### Typography:
- **Headings (h1, h2, h3) & Brand & Buttons**: Google Font **'Plus Jakarta Sans'** (`font-heading`)
- **Body, Inputs, Tables & Numeric Quota Data**: Google Font **'Inter'** (`font-body`)

---

## 🚀 Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka browser di `http://localhost:5173`.

---

## 📦 Build untuk GitHub Pages

```bash
npm run build
```

Hasil build berada di folder `dist/` dengan path relatif (`base: './'`), siap langsung diunggah ke GitHub Pages branch `gh-pages` atau via GitHub Actions.

### Deployment otomatis via GitHub Actions (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🔄 Cara Menghubungkan ke Firebase / Supabase

Mock data service berada di [`src/services/dataService.js`](src/services/dataService.js). Setiap metode dibuat *asynchronous* (`Promise`), sehingga tinggal mengganti implementasi internalnya:

### Contoh Swap ke Firebase Firestore:
```javascript
import { db } from './firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export const dataService = {
  async getSchools() {
    const snapshot = await getDocs(collection(db, 'schools'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  async updateFilledSeats(schoolId, filledSeats) {
    const ref = doc(db, 'schools', schoolId);
    await updateDoc(ref, { 'quota.filledSeats': Number(filledSeats) });
  }
  // ...
};
```

### Contoh Swap ke Supabase:
```javascript
import { supabase } from './supabaseClient';

export const dataService = {
  async getSchools() {
    const { data, error } = await supabase.from('schools').select('*, quota(*), announcements(*)');
    if (error) throw error;
    return data;
  },
  async updateFilledSeats(schoolId, filledSeats) {
    const { error } = await supabase.from('schools').update({ filled_seats: filledSeats }).eq('id', schoolId);
    if (error) throw error;
  }
  // ...
};
```

---

## 🔑 Akun Demo Admin Sekolah

Gunakan tombol demo pada halaman `/login`:
- `admin_sman1` / `password123` (SMAN 1 Jakarta)
- `admin_sman8` / `password123` (SMAN 8 Jakarta)
- `admin_sman3` / `password123` (SMAN 3 Bandung)
