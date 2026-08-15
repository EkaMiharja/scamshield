const gemini = (function () {
  const API_BASE = "/api/chat";
  const FALLBACK_BASE = "http://localhost:3000/api/chat";

  async function sendTo(base, messages) {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
    });
    if (!res.ok) {
      const body = await res.text().catch(function () {
        return "";
      });
      throw new Error("Layanan AI tidak tersedia (" + res.status + "). " + body);
    }
    const data = await res.json();
    if (!data || typeof data.text !== "string") throw new Error("Respon AI tidak dikenali.");
    return data.text;
  }

  async function chat(messages) {
    try {
      return await sendTo(API_BASE, messages);
    } catch (firstErr) {
      try {
        return await sendTo(FALLBACK_BASE, messages);
      } catch (secondErr) {
        throw new Error(firstErr && firstErr.message ? firstErr.message : String(firstErr));
      }
    }
  }

  async function analyzeUrl(url) {
    const messages = [
      {
        role: "user",
        content:
          "Periksa alamat situs ini: " + url + ". Berikan penilaian singkat apakah situs ini aman, mencurigakan, atau berbahaya, beserta 1-2 alasan utamanya. " +
          "Jawab maksimal 900 karakter. Akhiri jawaban dengan baris persis: VERDICT: AMAN, VERDICT: MENURIGAKAN, atau VERDICT: BERBAHAYA sesuai penilaian Anda.",
      },
    ];
    return chat(messages);
  }

  return { chat, analyzeUrl };
})();