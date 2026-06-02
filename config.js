// ============================================================
//  config.js — GTPS Lock Store Configuration
//  Ubah semua nilai di sini sesuai kebutuhan kamu
// ============================================================

const CONFIG = {

  // ─── STORE INFO ────────────────────────────────────────────
  store: {
    name: "LOCKSTORE",
    tagline: "Trusted GTPS Lock Dealer",
    waNumber: "6285188724658",
    waMessage: (lock, gtps, price) =>
      `mas beli ${lock} di ${gtps} dengan ${price}`,
  },

  // ─── BANNER ────────────────────────────────────────────────
  banner: {
    videoPath: "assets/video/banner.mp4",
    heading: "GTPS LOCK STORE",
    subheading: "World Lock · Diamond Lock · Blue Gem Lock · Custom Lock",
    ctaText: "Lihat Produk",
    ctaTarget: "#gtps",
  },

  // ─── MUSIC WIDGET ──────────────────────────────────────────
  music: {
    autoplay: false,
    playlist: [
      {
        title: "Midnight Chill",
        artist: "Lo-Fi Collective",
        src: "assets/music/track1.mp3",
        cover: "assets/music/cover1.jpg",
      },
      {
        title: "Dark Ambient",
        artist: "Synthwave Studio",
        src: "assets/music/track2.mp3",
        cover: "assets/music/cover2.jpg",
      },
    ],
  },

  // ─── STATISTIK (4 KARTU) ───────────────────────────────────
  stats: [
    { icon: "fa-solid fa-lock",       value: "0",    label: "Lock Terjual"   },
    { icon: "fa-solid fa-users",      value: "0",    label: "Pelanggan Puas" },
    { icon: "fa-solid fa-star",       value: "0",   label: "Rating Toko"    },
    { icon: "fa-solid fa-bolt",       value: "< 5 Min", label: "Proses Cepat"   },
  ],

  // ─── SIDEBAR NAVIGATION ────────────────────────────────────
  nav: [
    { icon: "fa-solid fa-house",           label: "Home",        href: "#banner"         },
    { icon: "fa-solid fa-server",          label: "GTPS",        href: "#gtps"           },
    { icon: "fa-solid fa-comment-dots",    label: "Testimoni",   href: "#testimonials"   },
    { icon: "fa-solid fa-circle-question", label: "FAQ",         href: "#faq"            },
    { icon: "fa-solid fa-box-open",        label: "Produk Lain", href: "#other-products" },
  ],

  // ─── FAQ ───────────────────────────────────────────────────
  faq: [
    {
      q: "Berapa lama proses pembelian lock?",
      a: "Proses sangat cepat, biasanya kurang dari 5 menit setelah konfirmasi pembayaran masuk.",
    },
    {
      q: "Apakah transaksi aman?",
      a: "Ya, semua transaksi dijamin aman. Kami sudah melayani ratusan pembeli dan zero komplain penipuan.",
    },
    {
      q: "Metode pembayaran apa yang diterima?",
      a: "Kami menerima Transfer Bank (BCA, BNI, Mandiri), GoPay, OVO, DANA, dan QRIS.",
    },
    {
      q: "Apakah ada garansi jika ada masalah?",
      a: "Setiap pembelian dijamin aman. Jika ada kendala, hubungi kami segera via WhatsApp dan kami siap bantu.",
    },
    {
      q: "Bagaimana cara pembelian?",
      a: "Pilih GTPS → klik lock yang diinginkan → konfirmasi harga → klik Beli via WhatsApp. Mudah dan cepat!",
    },
    {
      q: "Apakah stok selalu tersedia?",
      a: "Stok kami update secara berkala. Jika stok habis, hubungi kami dan kami akan usahakan secepatnya.",
    },
  ],

  // ─── PRODUK LAIN ───────────────────────────────────────────
  otherProducts: [
    {
      name: "Jasa Pembuatan Website Host Vercel",
      icon: "fa-solid fa-code",
      desc: "Jual Jasa pembuatan Website sesuai dengan apa yang customer mau [Host Vercel].",
      badge: "Hot",
      link: "#",
    },
    {
      name: "World GTPS",
      icon: "fa-solid fa-earth-asia",
      desc: "Berbagai Design/Name World.",
      badge: null,
      link: "#",
    },
    {
      name: "Jasa Build",
      icon: "fa-solid fa-hammer",
      desc: "Jasa bangun world impian kamu dengan desain terbaik.",
      badge: null,
      link: "#",
    },
  ],

  // ─── PATHS ─────────────────────────────────────────────────
  paths: {
    testimonials: "data/testimonials.json",
    gtps: "data/gtps.json",
    assets: "assets/",
  },

};
