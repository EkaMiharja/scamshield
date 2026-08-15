const storage = (function () {
  const KEY = "scamshield_reports_v1";

  function getReports() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        const seeded = seedData();
        localStorage.setItem(KEY, JSON.stringify(seeded));
        return seeded;
      }
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list.sort((a, b) => b.timestamp - a.timestamp) : [];
    } catch (e) {
      return [];
    }
  }

  function saveReport(data) {
    const reports = getReports();
    const report = {
      id: (window.crypto && crypto.randomUUID && crypto.randomUUID()) || "r_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      status: "Under Review",
      timestamp: Date.now(),
      ...data,
    };
    reports.unshift(report);
    localStorage.setItem(KEY, JSON.stringify(reports));
    return report;
  }

  function deleteReport(id) {
    const reports = getReports().filter((r) => r.id !== id);
    localStorage.setItem(KEY, JSON.stringify(reports));
  }

  function updateReportStatus(id, status) {
    const reports = getReports().map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(KEY, JSON.stringify(reports));
  }

  function searchReports(query) {
    if (!query) return [];
    const q = String(query).toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    return getReports().filter((r) => String(r.url || "").toLowerCase().includes(q));
  }

  function seedData() {
    const now = Date.now();
    const H = 3600000;
    return [
      {
        id: "seed_1",
        url: "https://secure-login-bank.xyz/verify-account",
        category: "Phishing",
        status: "Verified Scam",
        timestamp: now - 2 * H,
        contact: "admin@secure-login-bank.xyz",
        chronology: "Menerima SMS yang meminta verifikasi rekening bank sebelum 'terkunci'. Halaman meniru login resmi bank dan meminta kode OTP.",
        proof: "Screenshot halaman login palsu dan nomor pengirim SMS.",
      },
      {
        id: "seed_2",
        url: "https://free-bitcoin.tk/claim",
        category: "Investment Fraud",
        status: "Verified Scam",
        timestamp: now - 6 * H,
        contact: "Telegram: @freebtc_promo",
        chronology: "Menjanjikan pengembalian 10x dari 'deposit mining' kecil. Penarikan tidak pernah diproses dan grup langsung dihapus.",
        proof: "Log chat dan alamat wallet terekam.",
      },
      {
        id: "seed_3",
        url: "https://shop-discount.top/checkout",
        category: "E-commerce Fraud",
        status: "Under Review",
        timestamp: now - 14 * H,
        contact: "WhatsApp +62 812-xxxx-xxxx",
        chronology: "Membayar barang elektronik dengan diskon 70%, penjual menghilang setelah pembayaran diterima.",
        proof: "Bukti transfer dan nomor pesanan.",
      },
      {
        id: "seed_4",
        url: "http://192.168.1.10:8080/portal",
        category: "Phishing",
        status: "Verified Scam",
        timestamp: now - 30 * H,
        contact: "-",
        chronology: "Portal Wi-Fi palsu yang meminta kredensial login akun ISP korban.",
        proof: "Screenshot portal.",
      },
      {
        id: "seed_5",
        url: "https://verify-account.id/secure-check",
        category: "Phishing",
        status: "Resolved",
        timestamp: now - 50 * H,
        contact: "-",
        chronology: "Kampanye SMS massal menargetkan pengguna e-wallet dengan verifikasi keamanan palsu.",
        proof: "Screenshot SMS dari beberapa korban.",
      },
      {
        id: "seed_6",
        url: "https://promo-winner.click/claim-prize",
        category: "Online Scam",
        status: "Under Review",
        timestamp: now - 72 * H,
        contact: "Email: winner@promo-winner.click",
        chronology: "Mengklaim korban memenangkan hadiah undian dan meminta 'biaya aktivasi' sebelum hadiah dicairkan.",
        proof: "Rangkaian email.",
      },
    ];
  }

  return { getReports, saveReport, deleteReport, updateReportStatus, searchReports };
})();