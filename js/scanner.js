const scanner = (function () {
  const SUSPICIOUS_TLDS = [
    "xyz", "top", "tk", "click", "zip", "mov", "gq", "ml", "cf", "ga",
    "icu", "buzz", "cam", "work", "rest", "bond", "cyou", "cfd", "quest",
  ];
  const PHISHING_KEYWORDS = [
    "login", "verify", "account", "secure", "bank", "update", "confirm",
    "password", "wallet", "bonus", "free", "win", "prize", "claim", "gift",
    "promo", "discount", "reward", "unlock", "suspend", "expired", "otp",
    "billing", "invoice", "refund",
  ];
  const GAMBLING_KEYWORDS = [
    "judol", "judionline", "judi", "slot", "togel", "casino", "taruhan",
    "poker", "lotre", "gacor", "maxwin", "rtp", "parlay", "jackpot",
    "situsbola", "taruhanbola", "judisoccer", "pialabet", "sbobet", "agenjudol",
    "judi online", "game online slot", "mesin slot", "slot online", "slot gacor",
    "idn poker", "idnslot", "poker88", "pkv", "bandar", "bandar66", "ceme",
    "domino", "dominoqq", "qq", "capsa", "sakong", "baccarat", "roulette",
    "sicbo", "dragon", "mahjong", "olympus", "starlight", "gates", "zeus",
    "bonanza", "sugar", "joker", "slot88", "slot777", "slot demo", "scatter",
    "free spin", "bigwin", "linkaja", "slotgacor", "bandarq", "dingdong",
    "tembak ikan", "tembakikan", "fish game", "toto", "4d",
    "kepo", "kakek", "sultan", "boss", "royal", "casino online", "betting",
    "bookie", "odds", "wager", "stake", "bet365", "bettingonline",
    "dewahoki", "88dewahoki", "dewa hoki", "dewabet", "dewaslot", "dewa slot",
    "mpo", "mpobos", "mpo888", "mpo777", "mposlot", "olx138", "hoki138",
    "mahjong138", "sedang138", "pusat138", "pragmatic", "pragmaticplay",
    "pragmatic88", "microgaming", "habanero", "spadegaming", "pgsoft",
    "pgsoftgame", "joker123", "jokerslot", "slotgacor88", "gacor77", "gacor118",
    "raja999", "rajabola", "raja slot", "asia99", "asia138", "asiahoki",
    "slot138", "panen138", "sultan138", "vegasslot", "vegas88", "sensa138",
    "bola88", "bola138", "sbobet88", "bet188", "winbet", "mega888", "918kiss",
    "ibet", "88tangkas", "tangkasnet", "mainkan", "maxbet", "ggbet", "dafabet",
    "betway", "pinnacle", "1xbet", "melbet", "22bet", "parimatch", "leonbet",
  ];
  const KNOWN_BRANDS = [
    "google", "youtube", "facebook", "instagram", "whatsapp", "telegram",
    "twitter", "x", "tiktok", "linkedin", "github", "netflix", "spotify",
    "amazon", "paypal", "apple", "microsoft", "windows", "office", "outlook",
    "mozilla", "firefox", "wikipedia", "reddit", "yahoo", "bing", "duckduckgo",
    "shopee", "tokopedia", "lazada", "blibli", "bukalapak", "bilibili",
    "dana", "ovo", "gopay", "grab", "grabpay", "linkaja", "shopee pay",
    "bca", "mandiri", "bri", "bni", "btn", "mandiriklik", "bca klik", "mybca",
    "atm", "payfazz", "doku", "midtrans", "xendit", "kredivo", "akulaku", "julio", "gopaylater",
    "gojek", "maxim", "traveloka", "tiket", "agoda", "airbnb", "booking",
    "kominfo", "djp", "pajak", "bpjs", "sim", "ktp", "ewallet", "bank",
  ];

  function normalizeUrl(raw) {
    let url = String(raw || "").trim();
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    return url;
  }

  function invalidResult(url) {
    return {
      url: url,
      host: "",
      score: 0,
      risk: "DANGER",
      checks: [
        { label: "Struktur Alamat Situs", status: "fail", detail: "Alamat yang Anda masukkan tidak dikenali sebagai alamat situs yang valid." },
      ],
      indicators: [{ severity: "danger", text: "Format alamat tidak dikenali sebagai alamat situs yang valid." }],
      recommendation: "Yang Anda masukkan bukan alamat situs yang valid. Periksa kembali, contoh: https://www.contoh-situs.com.",
    };
  }

  function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = [];
    for (let i = 0; i <= m; i++) {
      dp[i] = [];
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  function detectTyposquat(domain) {
    const parts = domain.toLowerCase().replace(/^www\./, "").split(".");
    const label = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    const base = (label || "").replace(/[^a-z0-9]/g, "");
    if (!base) return null;

    for (let k = 0; k < KNOWN_BRANDS.length; k++) {
      if (base === KNOWN_BRANDS[k].replace(/\s/g, "")) return null;
    }

    let closest = null;
    let closestDist = Infinity;

    for (let i = 0; i < KNOWN_BRANDS.length; i++) {
      const brand = KNOWN_BRANDS[i].replace(/\s/g, "");
      if (brand.length < 3 || base === brand) continue;

      if (base.includes(brand)) {
        const prefix = base.slice(0, base.indexOf(brand));
        const suffix = base.slice(base.indexOf(brand) + brand.length);
        if (prefix.length <= 3 && suffix.length <= 3) return brand;
        if (
          (prefix.length >= 1 || suffix.length >= 1) &&
          prefix.length <= 6 &&
          suffix.length <= 6 &&
          /(login|verify|secure|account|check|confirm|update|signin|auth|support|help|promo|bonus|free|win|prize|claim|gift|reward|bank|online|mobile|pay|resmi|official|safe|guard|otp|verification|acc|id|co|com|net|xyz|top|info)$/.test(prefix + suffix)
        ) {
          return brand;
        }
      }

      if (brand.length >= 6 && base.length >= brand.length - 1 && base.length <= brand.length + 6) {
        const d = substringEditDistance(base, brand);
        if (d >= 1 && d < closestDist && d <= 2) {
          closestDist = d;
          closest = brand;
        }
      }
    }

    return closest;
  }

  function substringEditDistance(base, brand) {
    let best = Infinity;
    const b = brand.length;
    const last = base.length - b + 1;
    for (let start = 0; start <= last; start++) {
      const win = base.slice(start, start + b);
      const d = levenshtein(win, brand);
      if (d < best) best = d;
    }
    return best;
  }

  function analyzeUrl(raw) {
    const url = normalizeUrl(raw);
    if (!url) return invalidResult(url);

    let parsed;
    try {
      parsed = new URL(url);
    } catch (e) {
      return invalidResult(url);
    }

    const host = parsed.hostname;
    if (!host || !host.includes(".")) return invalidResult(url);

    const checks = [];
    const indicators = [];
    let score = 100;

    const isHttps = parsed.protocol === "https:";
    checks.push({
      label: "Koneksi Aman (HTTPS)",
      status: isHttps ? "pass" : "fail",
      detail: isHttps ? "Koneksi terenkripsi (TLS), aman dari penyadapan." : "Koneksi tidak terenkripsi, data dapat disadap di tengah jalan.",
    });
    if (!isHttps) {
      score -= 20;
      indicators.push({ severity: "danger", text: "Situs tidak memakai pengamanan HTTPS." });
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const isIp = ipPattern.test(host);
    checks.push({
      label: "Alamat IP sebagai Nama Situs",
      status: isIp ? "fail" : "pass",
      detail: isIp ? "Nama situsnya berupa deretan angka IP, pola umum situs penipuan." : "Nama situsnya berupa alamat biasa (bukan deretan angka).",
    });
    if (isIp) {
      score -= 35;
      indicators.push({ severity: "danger", text: "Situs memakai alamat IP (deretan angka) sebagai nama." });
    }

    const tld = host.split(".").pop().toLowerCase();
    const isSuspiciousTld = SUSPICIOUS_TLDS.includes(tld);
    checks.push({
      label: "Akhiran Nama Situs",
      status: isSuspiciousTld ? "fail" : "pass",
      detail: isSuspiciousTld ? "." + tld + " masuk daftar akhiran berisiko tinggi." : "." + tld + " adalah akhiran yang umum digunakan.",
    });
    if (isSuspiciousTld) {
      score -= 25;
      indicators.push({ severity: "danger", text: "Akhiran nama situs berisiko tinggi: ." + tld });
    }

    const domain = host.replace(/^www\./, "");
    const domainLength = domain.length;
    checks.push({
      label: "Panjang Nama Situs",
      status: domainLength <= 30 ? "pass" : "warn",
      detail: domainLength + " karakter, " + (domainLength <= 30 ? "panjang wajar." : "nama situs tidak wajar panjangnya."),
    });
    if (domainLength > 30) {
      score -= 10;
      indicators.push({ severity: "warning", text: "Nama situs sangat panjang." });
    }

    const subdomainCount = Math.max(0, domain.split(".").length - 2);
    checks.push({
      label: "Lapisan Alamat Situs",
      status: subdomainCount <= 3 ? "pass" : "warn",
      detail: "Terdapat " + subdomainCount + " lapisan sebelum nama situs.",
    });
    if (subdomainCount > 3) {
      score -= 10;
      indicators.push({ severity: "warning", text: "Struktur alamat situs berlapis berlebihan." });
    }

    const hyphenCount = (domain.match(/-/g) || []).length;
    checks.push({
      label: "Penggunaan Tanda Hubung",
      status: hyphenCount <= 2 ? "pass" : "warn",
      detail: hyphenCount + " tanda hubung ditemukan.",
    });
    if (hyphenCount > 2) {
      score -= 8;
      indicators.push({ severity: "warning", text: "Pola tanda hubung mencurigakan." });
    }

    const typosquat = detectTyposquat(domain);
    checks.push({
      label: "Kemiripan dengan Merek Terkenal",
      status: typosquat ? "fail" : "pass",
      detail: typosquat
        ? "Nama situs menyerupai merek terkenal: " + typosquat + "."
        : "Tidak ada kemiripan dengan merek terkenal.",
    });
    if (typosquat) {
      score -= 30;
      indicators.push({
        severity: "danger",
        text: "Kemungkinan typosquatting: meniru merek " + typosquat + ".",
      });
    }

    const lower = (url + " " + domain).toLowerCase();
    const foundGambling = GAMBLING_KEYWORDS.filter((k) => lower.includes(k));
    checks.push({
      label: "Indikasi Konten Judi Online",
      status: foundGambling.length === 0 ? "pass" : "fail",
      detail: foundGambling.length
        ? "Ditemukan indikasi judi online: " + foundGambling.slice(0, 5).join(", ") + "."
        : "Tidak ada indikasi konten judi online.",
    });
    if (foundGambling.length) {
      score -= Math.min(40, 20 * foundGambling.length);
      indicators.push({
        severity: "danger",
        text: "Indikasi situs judi online terdeteksi: " + foundGambling.slice(0, 4).join(", ") + ".",
      });
    }

    const foundKeywords = PHISHING_KEYWORDS.filter((k) => lower.includes(k));
    checks.push({
      label: "Kata Kunci Mencurigakan",
      status: foundKeywords.length === 0 ? "pass" : "fail",
      detail: foundKeywords.length
        ? foundKeywords.length + " kata kunci berisiko: " + foundKeywords.slice(0, 5).join(", ")
        : "Tidak ada kata kunci mencurigakan.",
    });
    if (foundKeywords.length) {
      score -= Math.min(39, 13 * foundKeywords.length);
      indicators.push({
        severity: "danger",
        text: "Kata kunci penipuan terdeteksi: " + foundKeywords.slice(0, 4).join(", "),
      });
    }

    const hasCredential = /@/.test(url.replace("//", "")) || /(password|token|otp|login|key)=/i.test(url);
    checks.push({
      label: "Data Pribadi di Alamat Situs",
      status: hasCredential ? "fail" : "pass",
      detail: hasCredential ? "Alamat situs membawa data pribadi yang sensitif." : "Tidak ada data pribadi pada alamat situs.",
    });
    if (hasCredential) {
      score -= 25;
      indicators.push({ severity: "danger", text: "Alamat situs membawa data pribadi atau kode rahasia." });
    }

    const longUrl = url.length > 120;
    checks.push({
      label: "Panjang Alamat Situs",
      status: longUrl ? "warn" : "pass",
      detail: url.length + " karakter, " + (longUrl ? "alamat tidak wajar panjang." : "panjang wajar."),
    });
    if (longUrl) {
      score -= 5;
      indicators.push({ severity: "warning", text: "Alamat situs sangat panjang." });
    }

    score = Math.max(0, Math.min(100, score));

    let risk = "SAFE";
    if (score < 50) risk = "DANGER";
    else if (score < 80) risk = "SUSPICIOUS";

    const recommendation = {
      SAFE: "Alamat situs ini lolos seluruh pemeriksaan otomatis. Tetap waspada terhadap rayuan (rekayasa sosial), dan selalu verifikasi alamat sebelum memasukkan data pribadi.",
      SUSPICIOUS: "Beberapa tanda risiko terdeteksi. Jangan masukkan informasi pribadi. Verifikasi identitas situs melalui kanal resmi sebelum melanjutkan.",
      DANGER: "Tanda risiko tinggi terdeteksi. Hindari situs ini, jangan masukkan data apa pun, dan segera laporkan melalui tombol 'Laporkan Penipuan'.",
    }[risk];

    return { url, host, score, risk, checks, indicators, recommendation };
  }

  return { analyzeUrl, normalizeUrl };
})();