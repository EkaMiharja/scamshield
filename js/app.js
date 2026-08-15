(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  Object.keys(window.sections || {}).forEach(function (key) {
    const host = document.getElementById(key + "-section");
    if (host && window.sections[key]) host.innerHTML = window.sections[key];
  });

  const SECTION_IDS = ["scanner", "feed", "report", "ai", "dashboard"];

  const navLinks = $$(".nav-link");
  const navMenu = $("#nav-menu");
  const navToggle = $("#nav-toggle");

  const scanForm = $("#scan-form");
  const urlInput = $("#url-input");
  const analyzeBtn = $("#analyze-btn");

  const gaugeCard = $("#gauge-card");
  const gaugeContainer = $("#gauge-container");
  const checklistEl = $("#checklist");
  const matchAlert = $("#match-alert");
  const dashboardHost = $("#dashboard-host");
  const dashboardBadge = $("#dashboard-badge");
  const recommendationEl = $("#recommendation");

  const feedList = $("#feed-list");
  const feedFilter = $("#feed-filter");
  const feedCount = $("#feed-count");

  const reportForm = $("#report-form");
  const toastWrap = $("#toast-wrap");

  let pendingStatusReportId = null;

  const ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
  const ICON_X =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  const ICON_WARN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>';
  const ICON_INFO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function timeAgo(ts) {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    if (m < 1) return "baru saja";
    if (m < 60) return m + " menit lalu";
    const h = Math.floor(m / 60);
    if (h < 24) return h + " jam lalu";
    const d = Math.floor(h / 24);
    return d + " hari lalu";
  }

  function riskLabel(r) {
    return r === "SAFE" ? "AMAN" : r === "SUSPICIOUS" ? "MENURIGAKAN" : "BERBAHAYA";
  }

  function statusLabel(s) {
    return (
      {
        "Verified Scam": "Terbukti Penipuan",
        "Under Review": "Sedang Ditinjau",
        Suspicious: "Mencurigakan",
        Resolved: "Sudah Tuntas",
      }[s] || s
    );
  }

  function statusBadgeHtml(r) {
    const cls = r.status === "Verified Scam" ? "danger" : r.status === "Resolved" ? "safe" : "warning";
    return '<span class="badge badge-' + cls + '">' + escapeHtml(statusLabel(r.status)) + "</span>";
  }

  function categoryLabel(c) {
    return (
      {
        Phishing: "Login / Tautan Palsu",
        "Investment Fraud": "Penipuan Investasi",
        "Online Scam": "Penipuan Online",
        "E-commerce Fraud": "Penipuan Belanja Online",
        "Social Media Scam": "Penipuan Media Sosial",
        "Loan / Pinjol Ilegal": "Pinjaman Online Ilegal",
        Other: "Lainnya",
      }[c] || c
    );
  }

  /* ---------- SPA Router ---------- */

  function showSection(id) {
    SECTION_IDS.forEach(function (s) {
      const el = document.getElementById(s + "-section");
      if (!el) return;
      const isActive = s === id;
      el.hidden = !isActive;
      if (isActive) {
        el.classList.remove("section-enter");
        void el.offsetWidth;
        el.classList.add("section-enter");
      }
    });

    navLinks.forEach(function (l) {
      const isActive = l.dataset.section === id;
      l.classList.toggle("active", isActive);
      l.setAttribute("aria-current", isActive ? "true" : "false");
    });

    closeMenu();

    if (id === "feed") renderFeed(feedFilter.value);

    if (window.location.hash !== "#" + id) {
      history.replaceState(null, "", "#" + id);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeMenu() {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      showSection(link.dataset.section);
    });
  });

  navToggle.addEventListener("click", function () {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("hashchange", function () {
    const target = window.location.hash.replace("#", "");
    if (SECTION_IDS.includes(target)) showSection(target);
  });

  /* ---------- Scanner ---------- */

  $$(".preset-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      urlInput.value = btn.dataset.preset;
      urlInput.focus();
    });
  });

  scanForm.addEventListener("submit", function (e) {
    e.preventDefault();
    runAnalysis();
  });

  function runAnalysis() {
    const raw = urlInput.value.trim();
    if (!raw) {
      showToast("Masukkan alamat situs terlebih dahulu.", "warning");
      urlInput.focus();
      return;
    }

    scanForm.classList.add("is-scanning");
    analyzeBtn.disabled = true;
    analyzeBtn.querySelector(".btn-label").textContent = "Memeriksa...";

    setTimeout(function () {
      const result = scanner.analyzeUrl(raw);
      renderDashboard(result);
      scanForm.classList.remove("is-scanning");
      analyzeBtn.disabled = false;
      analyzeBtn.querySelector(".btn-label").textContent = "Cek Situs";
      showSection("dashboard");
      document.getElementById("dashboard-section").scrollIntoView({ behavior: "smooth", block: "start" });
    }, 700);
  }

  function renderDashboard(result) {
    gaugeContainer.innerHTML =
      '<div class="gauge-wrap gauge-pending"><span class="gauge-pending-text">Menunggu analisis AI...</span></div>';

    gaugeCard.classList.remove("risk-safe", "risk-warning", "risk-danger");
    gaugeCard.classList.add("risk-" + result.risk.toLowerCase());

    dashboardHost.textContent = result.host || "";
    dashboardBadge.textContent = "Menunggu AI";
    dashboardBadge.className = "badge badge-muted";

    checklistEl.innerHTML = result.checks
      .map(function (c) {
        const icon = c.status === "pass" ? ICON_CHECK : c.status === "warn" ? ICON_WARN : ICON_X;
        const cls = c.status === "pass" ? "safe" : c.status === "warn" ? "warning" : "danger";
        return (
          '<li class="check-row">' +
          '<span class="check-icon check-' + cls + '" aria-hidden="true">' + icon + "</span>" +
          '<div class="check-info">' +
          '<span class="check-label">' + c.label + "</span>" +
          '<span class="check-detail">' + c.detail + "</span>" +
          "</div>" +
          '<span class="badge badge-' + cls + '">' + c.status.toUpperCase() + "</span>" +
          "</li>"
        );
      })
      .join("");

    recommendationEl.textContent = "Menunggu hasil analisis AI untuk menentukan rekomendasi.";

    runAiAnalysis(result.url, result);

    const matches = storage.searchReports(result.host || result.url);
    if (matches.length) {
      matchAlert.hidden = false;
      $(".match-body", matchAlert).textContent =
        "Alamat situs ini sudah pernah dilaporkan " + matches.length + " kali oleh komunitas (status terbaru: " + statusLabel(matches[0].status) + "). Hindari memasukkan data pribadi.";
    } else {
      matchAlert.hidden = true;
    }
  }

  /* ---------- AI Analysis ---------- */

  const aiAnalysis = $("#ai-analysis");
  const aiAnalysisBody = $("#ai-analysis-body");

  const AI_RISK_SCORE = {
    AMAN: 90,
    MENURIGAKAN: 55,
    BERBAHAYA: 20,
  };

  function riskFromScore(score) {
    if (score < 50) return "DANGER";
    if (score < 80) return "SUSPICIOUS";
    return "SAFE";
  }

  function parseAiVerdict(text) {
    const m = String(text || "").match(/\bVERDICT\s*:\s*(AMAN|MENURIGAKAN|BERBAHAYA)\b/);
    return m ? m[1] : null;
  }

  const AI_RECOMMENDATION = {
    SAFE: "Alamat situs ini lolos seluruh pemeriksaan. Tetap waspada terhadap rayuan (rekayasa sosial), dan selalu verifikasi alamat sebelum memasukkan data pribadi.",
    SUSPICIOUS: "Beberapa tanda risiko terdeteksi. Jangan masukkan informasi pribadi. Verifikasi identitas situs melalui kanal resmi sebelum melanjutkan.",
    DANGER: "Tanda risiko tinggi terdeteksi. Hindari situs ini, jangan masukkan data apa pun, dan segera laporkan melalui menu Laporkan Penipuan.",
  };

  function applyAiVerdict(result, verdict) {
    const aiScore = verdict ? AI_RISK_SCORE[verdict] : undefined;
    const merged = aiScore === undefined ? result.score : Math.round((result.score + aiScore) / 2);
    const mergedRisk = riskFromScore(merged);

    gauge.render(gaugeContainer, merged, mergedRisk);
    gaugeCard.classList.remove("risk-safe", "risk-warning", "risk-danger");
    gaugeCard.classList.add("risk-" + mergedRisk.toLowerCase());
    dashboardBadge.textContent = riskLabel(mergedRisk);
    dashboardBadge.className =
      "badge badge-" + (mergedRisk === "SAFE" ? "safe" : mergedRisk === "SUSPICIOUS" ? "warning" : "danger");
    recommendationEl.textContent = AI_RECOMMENDATION[mergedRisk] || result.recommendation;

    if (pendingStatusReportId) {
      const rid = pendingStatusReportId;
      pendingStatusReportId = null;
      const report = storage.getReports().find((r) => r.id === rid);
      if (report) {
        const newStatus =
          mergedRisk === "DANGER" ? "Verified Scam" : mergedRisk === "SUSPICIOUS" ? "Suspicious" : "Resolved";
        storage.updateReportStatus(rid, newStatus);
        showToast(
          "Status laporan diperbarui: " + statusLabel(newStatus) + " (" + riskLabel(mergedRisk) + ").",
          mergedRisk === "DANGER" ? "danger" : "info"
        );
      }
    }
  }

  function runAiAnalysis(url, result) {
    aiAnalysis.hidden = false;
    aiAnalysisBody.textContent = "Sentry AI sedang memeriksa alamat situs ini...";

    gemini
      .analyzeUrl(url)
      .then(function (text) {
        aiAnalysisBody.textContent = text.replace(/\bVERDICT\s*:\s*(AMAN|MENURIGAKAN|BERBAHAYA)\b/gi, "").trim();
        applyAiVerdict(result, parseAiVerdict(text));
      })
      .catch(function (err) {
        aiAnalysisBody.textContent =
          "Analisis AI tidak tersedia saat ini. " + (err && err.message ? err.message : "Coba lagi nanti.");
        applyAiVerdict(result, null);
      });
  }

  /* ---------- Threat Feed ---------- */

  function renderFeed(filter) {
    const reports = storage.getReports();
    const q = (filter || "").trim().toLowerCase();
    const list = q
      ? reports.filter(function (r) {
          return (String(r.url) + " " + String(r.category)).toLowerCase().includes(q);
        })
      : reports;

    feedCount.textContent = list.length + " laporan";

    if (!list.length) {
      feedList.innerHTML =
        '<div class="feed-empty">Tidak ada laporan yang cocok dengan pencarian Anda.</div>';
      return;
    }

    feedList.innerHTML = list
      .map(function (r) {
        return (
          '<article class="card feed-card">' +
          '<div class="feed-head">' +
          '<span class="feed-domain mono" title="' + escapeHtml(r.url) + '">' + escapeHtml(r.url) + "</span>" +
          statusBadgeHtml(r) +
          "</div>" +
          '<div class="feed-meta">' +
          '<span class="chip">' + escapeHtml(categoryLabel(r.category)) + "</span>" +
          '<span class="feed-time mono">' + timeAgo(r.timestamp) + "</span>" +
          "</div>" +
          '<p class="feed-chronology">' + escapeHtml(r.chronology) + "</p>" +
          (r.contact && r.contact !== "-"
            ? '<p class="feed-contact">Kontak: <span class="mono">' + escapeHtml(r.contact) + "</span></p>"
            : "") +
          '<div class="feed-actions">' +
          '<button type="button" class="btn-ghost btn-sm" data-scan-id="' + escapeHtml(r.id) + '">Scan Link</button>' +
          '<button type="button" class="btn-ghost btn-sm" data-report-url="' + escapeHtml(r.url) + '">Laporkan Serupa</button>' +
          '<button type="button" class="btn-ghost btn-icon btn-sm" data-delete-id="' + escapeHtml(r.id) + '" aria-label="Hapus laporan">' + ICON_X + "</button>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  feedFilter.addEventListener("input", function () {
    renderFeed(feedFilter.value);
  });

  feedList.addEventListener("click", function (e) {
    const scanBtn = e.target.closest("[data-scan-id]");
    if (scanBtn) {
      const report = storage.getReports().find((r) => r.id === scanBtn.dataset.scanId);
      if (!report) return;
      pendingStatusReportId = report.id;
      urlInput.value = report.url;
      showSection("scanner");
      document.getElementById("scanner-section").scrollIntoView({ behavior: "smooth", block: "start" });
      runAnalysis();
      return;
    }
    const reportBtn = e.target.closest("[data-report-url]");
    if (reportBtn) {
      $("#report-url").value = reportBtn.dataset.reportUrl;
      showSection("report");
      document.getElementById("report-section").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const delBtn = e.target.closest("[data-delete-id]");
    if (delBtn) {
      storage.deleteReport(delBtn.dataset.deleteId);
      renderFeed(feedFilter.value);
      showToast("Laporan dihapus dari database lokal.", "info");
    }
  });

  /* ---------- Report Form ---------- */

  function setFieldError(input, msg) {
    const field = input.closest(".field");
    const err = field ? field.querySelector(".field-error") : null;
    input.classList.toggle("invalid", Boolean(msg));
    if (err) {
      err.textContent = msg || "";
      err.hidden = !msg;
    }
  }

  ["#report-url", "#report-category", "#report-chronology"].forEach(function (sel) {
    $(sel).addEventListener("input", function () {
      setFieldError($(sel), "");
    });
  });

  reportForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const url = $("#report-url").value.trim();
    const category = $("#report-category").value;
    const contact = $("#report-contact").value.trim();
    const chronology = $("#report-chronology").value.trim();
    const proof = $("#report-proof").value.trim();

    let ok = true;

    if (!scanner.analyzeUrl(url).host) {
      setFieldError($("#report-url"), "Masukkan alamat situs yang valid, misalnya: example.com atau https://example.com.");
      ok = false;
    }
    if (!category) {
      setFieldError($("#report-category"), "Pilih kategori scam.");
      ok = false;
    }
    if (chronology.length < 10) {
      setFieldError($("#report-chronology"), "Kronologi minimal 10 karakter.");
      ok = false;
    }

    if (!ok) {
      showToast("Periksa kembali isian form Anda.", "danger");
      return;
    }

    storage.saveReport({
      url: url,
      category: category,
      contact: contact || "-",
      chronology: chronology,
      proof: proof || "-",
    });

    reportForm.reset();
    renderFeed(feedFilter.value);
    showToast("Laporan berhasil dikirim dan langsung muncul di Laporan Terbaru.", "success");
    showSection("feed");
  });

  /* ---------- Toast ---------- */

  function showToast(message, type) {
    const icons = {
      success: ICON_CHECK,
      warning: ICON_WARN,
      danger: ICON_X,
      info: ICON_INFO,
    };
    const t = document.createElement("div");
    t.className = "toast toast-" + type;
    t.setAttribute("role", "status");
    t.innerHTML =
      '<span class="toast-icon" aria-hidden="true">' + (icons[type] || ICON_INFO) + "</span><span>" + message + "</span>";
    toastWrap.appendChild(t);

    requestAnimationFrame(function () {
      t.classList.add("show");
    });

    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () {
        t.remove();
      }, 320);
    }, 4200);
  }

  /* ---------- Chat AI ---------- */

  const chatLog = $("#chat-log");
  const chatForm = $("#chat-form");
  const chatInput = $("#chat-input");
  const chatSend = $("#chat-send");
  const chatStatus = $("#chat-status");

  function addChatMessage(role, text) {
    const row = document.createElement("div");
    row.className = "chat-msg chat-msg-" + (role === "user" ? "user" : "bot");
    const avatar = document.createElement("span");
    avatar.className = "chat-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = role === "user" ? "A" : "AI";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = text;
    row.appendChild(avatar);
    row.appendChild(bubble);
    chatLog.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function setChatBusy(busy) {
    chatInput.disabled = busy;
    chatSend.disabled = busy;
    chatStatus.hidden = !busy;
    if (!busy) chatInput.focus();
  }

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message || chatSend.disabled) return;

    addChatMessage("user", message);
    chatInput.value = "";
    setChatBusy(true);

    const history = Array.from(chatLog.querySelectorAll(".chat-msg"))
      .map(function (row) {
        const isUser = row.classList.contains("chat-msg-user");
        return {
          role: isUser ? "user" : "assistant",
          content: row.querySelector(".chat-bubble").textContent,
        };
      })
      .filter(function (m) {
        return m.content && m.content.length > 0;
      });

    gemini
      .chat(history)
      .then(function (text) {
        addChatMessage("bot", text);
        setChatBusy(false);
      })
      .catch(function (err) {
        addChatMessage("bot", "Maaf, saya belum bisa menjawab. " + (err && err.message ? err.message : "Terjadi kesalahan."));
        setChatBusy(false);
      });
  });

  $$(".chat-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      chatInput.value = chip.dataset.prompt;
      chatInput.focus();
    });
  });

  /* ---------- Init ---------- */

  renderFeed();

  const initial = window.location.hash.replace("#", "");
  showSection(SECTION_IDS.includes(initial) ? initial : "scanner");
})();