# ScamShield Hub

Platform deteksi & pelaporan scam **100% client-side** — dibangun dengan Vanilla HTML, CSS, dan JavaScript murni untuk **SDG Tech Switch Fest**.

> **SDG 9 — Industry, Innovation & Infrastructure**: Keamanan digital adalah infrastruktur dasar bagi industri dan inovasi. ScamShield Hub membuktikan bahwa perlindungan siber dapat berjalan tanpa server, tanpa mengirim data, dan tetap transparan bagi pengguna.

## Fitur

- **Pill Navbar** — navigasi kapsul mengambang dengan efek glassmorphism, sticky, dan drawer menu di mobile
- **Hero Scanner** — analisis URL instan dengan tombol preset demo (Safe / Phishing / Suspicious)
- **Analysis Dashboard** — SVG Trust Score gauge animasi (0–100), Security Checklist, Threat Breakdown, dan rekomendasi
- **Community Threat Feed** — kartu laporan scam dengan status badge, filter real-time, dan penanda waktu
- **Report Scam Form** — formulir pelaporan dengan validasi client-side, tersimpan ke `localStorage`, dan langsung masuk ke Threat Feed
- **SDG Impact Section** — edukasi kontribusi platform terhadap SDG 9 + metodologi *Explainable Security*
- **Dark Cybersecurity Theme** — mengikuti `Guideline.md` secara ketat (Deep Navy, Cyber Blue, semantic risk colors)

## Cara Menjalankan

Tidak ada dependency, build tool, atau server.

1. Double-click `index.html`
2. Atau buka lewat browser: `File > Open File`

Semua fitur berfungsi penuh secara offline (font akan jatuh ke `system-ui` bila tanpa internet).

**Fitur Chat AI (Gemini)** butuh backend proxy karena API key disimpan di server:

- **Lokal**: `GEMINI_API_KEY=xxx GEMINI_MODEL=gemini-flash-latest node server/server.js` (atau isi `server/.env`), lalu chat di `index.html`.
- **Vercel**: deploy repositori ini; set env `GEMINI_API_KEY` di Vercel. Frontend statis di-serve Vercel, `api/chat.js` menjadi serverless function `/api/chat`. `.env` lokal tidak ikut ter-deploy.

## Struktur Proyek

```
scamshield-hub/
├── index.html           # Single Page Application entry
├── css/
│   └── style.css        # Theme variables, layout, gauge & animasi
├── js/
│   ├── app.js           # SPA router, dashboard render, feed, form, toast
│   ├── scanner.js       # Mesin heuristik URL + perhitungan Trust Score
│   ├── storage.js       # Manager localStorage + seed data
│   ├── gauge.js         # Renderer SVG trust score ring
│   ├── gemini.js        # Klien chat Gemini (proxy serbaguna)
│   └── sections/        # Template HTML per-section (scanner, dashboard, feed, report, ai)
├── server/
│   └── server.js        # Backend proxy Gemini lokal (Node murni, opsional)
├── api/
│   └── chat.js          # Serverless function chat untuk Vercel (opsional)
├── assets/
│   ├── favicon.svg
│   └── favicon.ico
├── vercel.json
├── package.json
└── README.md
```

## Mesin Analisis (scanner.js)

Pemeriksaan heuristik yang dijalankan seluruhnya di peramban:

- Validasi protokol **HTTPS**
- Deteksi host berupa **alamat IP**
- Evaluasi **Top-Level Domain** berisiko (`.xyz`, `.top`, `.tk`, `.click`, dll.)
- Panjang domain, kedalaman subdomain, dan pola hyphen
- Pencocokan **kata kunci phishing** (login, verify, free, prize, dll.)
- Deteksi kredensial/query mencurigakan pada URL
- Pencocokan **kata kunci judi online**

Skor Trust (0–100) diklasifikasikan menjadi **SAFE** (hijau), **SUSPICIOUS** (amber), dan **DANGER** (merah).

## Roadmap (Fase Berikutnya)

Arsitektur modular dirancang agar **Gemini API** dapat di-attach sebagai modul AI tambahan tanpa mengubah mesin inti — mempertahankan 100% transparansi dan *explainability*.

## Legal

Hasil analisis bersifat indikatif berbasis aturan heuristik, bukan jaminan keamanan mutlak. Selalu verifikasi melalui kanal resmi. Semua data tersimpan lokal di perangkat pengguna.
