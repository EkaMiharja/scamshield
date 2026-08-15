window.sections = window.sections || {};
window.sections.ai = `
  <div class="container container-chat">
    <div class="section-head section-head-center">
      <h2 id="ai-title" class="section-title">Sentry AI</h2>
      <p class="section-sub">Tanyakan apa saja seputar keamanan digital: cara mengenali penipuan, makna hasil pemeriksaan, atau cara melindungi data pribadi.</p>
    </div>

    <div class="card chat-card">
      <div id="chat-log" class="chat-log" aria-live="polite">
        <div class="chat-msg chat-msg-bot">
          <span class="chat-avatar" aria-hidden="true">AI</span>
          <div class="chat-bubble">Halo! Saya Sentry AI dari ScamShield Hub. Tanya saya soal penipuan online, situs mencurigakan, atau cara aman berselancar di internet.</div>
        </div>
      </div>
      <div id="chat-status" class="chat-status" hidden>
        <span class="chat-typing" aria-hidden="true"></span>
        <span>AI sedang mengetik...</span>
      </div>
      <form id="chat-form" class="chat-form">
        <input id="chat-input" type="text" maxlength="500" placeholder="Tulis pertanyaan Anda (maks. 500 karakter)..." aria-label="Pertanyaan untuk AI" autocomplete="off" spellcheck="false">
        <button id="chat-send" class="btn-primary btn-buy chat-send" type="submit">Kirim</button>
      </form>
      <div class="chat-suggest" aria-label="Pertanyaan contoh">
        <span class="chat-suggest-label">Coba tanya:</span>
        <button type="button" class="preset-btn chat-chip" data-prompt="Bagaimana cara mengenali email phishing?">Kenali email phishing</button>
        <button type="button" class="preset-btn chat-chip" data-prompt="Tolong jelaskan arti skor kepercayaan di hasil pemeriksaan">Arti skor kepercayaan</button>
        <button type="button" class="preset-btn chat-chip" data-prompt="Apa yang harus saya lakukan jika sudah terlanjur memasukkan data di situs penipuan?">Sudah kena tipu</button>
      </div>
    </div>
  </div>
`;