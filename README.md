# 🔒 GTPS Lock Store

Website jual beli lock GTPS — monochrome brutalist design.
Deploy ke Vercel dalam hitungan menit.

---

## 📁 Struktur File

```
gtps-store/
├── index.html              ← Halaman utama
├── config.js               ← ⚙️ SEMUA KONFIGURASI DI SINI
├── vercel.json             ← Konfigurasi Vercel
├── data/
│   ├── testimonials.json   ← Data testimoni pembeli
│   └── gtps.json           ← Data GTPS + harga lock
├── css/
│   └── style.css           ← Stylesheet
├── js/
│   └── main.js             ← Logic JS
└── assets/
    ├── video/
    │   ├── banner.mp4      ← Video banner loop (ganti ini)
    │   └── poster.jpg      ← Thumbnail video
    ├── music/
    │   ├── track1.mp3      ← Musik widget
    │   ├── cover1.jpg      ← Cover art track 1
    │   ├── track2.mp3
    │   └── cover2.jpg
    ├── gtps/
    │   ├── gtps1.jpg       ← Gambar GTPS 1
    │   ├── gtps2.jpg
    │   └── gtps3.jpg
    └── testi/
        ├── testi1.jpg      ← Screenshot testimoni 1
        ├── testi2.jpg
        └── ...
```

---

## ⚙️ Konfigurasi (`config.js`)

Buka `config.js` dan ubah:

| Field                    | Keterangan                              |
|--------------------------|-----------------------------------------|
| `store.waNumber`         | Nomor WA kamu (tanpa +, contoh: `6281xxx`) |
| `store.name`             | Nama toko                               |
| `banner.videoPath`       | Path video banner                       |
| `music.playlist`         | Daftar lagu widget musik                |
| `stats`                  | 4 kartu statistik                       |
| `faq`                    | Pertanyaan & jawaban FAQ                |
| `otherProducts`          | Produk selain lock                      |

---

## 📋 Data JSON

### `data/gtps.json`
Tambah/edit GTPS baru:
```json
{
  "id": 4,
  "name": "Nama Server",
  "image": "assets/gtps/gtps4.jpg",
  "ownerName": "NamaOwner",
  "playerCount": "300+",
  "description": "Deskripsi singkat server.",
  "locks": {
    "wl":     { "name": "World Lock",    "icon": "fa-solid fa-lock",    "price": 5000,  "stock": 50, "unit": "Rp" },
    "dl":     { "name": "Diamond Lock",  "icon": "fa-solid fa-gem",     "price": 15000, "stock": 20, "unit": "Rp" },
    "bgl":    { "name": "Blue Gem Lock", "icon": "fa-solid fa-diamond", "price": 50000, "stock": 5,  "unit": "Rp" },
    "custom": { "name": "Custom Lock",   "icon": "fa-solid fa-key",     "price": 100000,"stock": 10, "unit": "Rp" }
  },
  "priceHistory": {
    "wl":     [4700, 4800, 4750, 4900, 5000, 4950, 5000],
    "dl":     [14000,14200,14100,14700,15000,14800,15000],
    "bgl":    [47000,48000,46000,49000,50000,49500,50000],
    "custom": [93000,95000,91000,97000,100000,98000,100000]
  }
}
```

### `data/testimonials.json`
Tambah testimoni baru:
```json
{
  "id": 7,
  "image": "assets/testi/testi7.jpg",
  "buyerNick": "NickPembeli",
  "gtpsName": "NamaGTPS",
  "lockName": "Diamond Lock",
  "price": "Rp 15.000",
  "rating": 5,
  "comment": "Komentar pembeli disini."
}
```

---

## 🚀 Deploy ke Vercel

### Cara 1 — Vercel CLI
```bash
npm i -g vercel
cd gtps-store
vercel
```

### Cara 2 — GitHub + Vercel Dashboard
1. Upload folder ini ke GitHub repo baru
2. Buka [vercel.com](https://vercel.com) → New Project
3. Import repo GitHub kamu
4. Framework Preset: **Other**
5. Root Directory: `/` (atau subfolder kalau perlu)
6. Klik **Deploy** ✅

---

## 🎨 Kustomisasi Tema

Semua design token ada di bagian `:root` di `css/style.css`:

```css
:root {
  --bg:       #080808;   /* Background utama */
  --surface:  #101010;   /* Surface card     */
  --accent:   #ffffff;   /* Warna aksen      */
  --text:     #e4e4e4;   /* Teks utama       */
  /* ... dst */
}
```

---

## 📝 Catatan

- **Video banner**: Pasang file MP4 di `assets/video/banner.mp4`. Kalau tidak ada video, background akan tetap hitam (normal).
- **Gambar**: Semua gambar bersifat opsional — kalau tidak ada, akan tampil ikon placeholder.
- **Musik**: Kalau `playlist` array kosong `[]`, widget musik disembunyikan otomatis.
- **WA Message**: Format pesan diatur di `config.js → store.waMessage`.
