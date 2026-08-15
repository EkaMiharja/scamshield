const https = require("https");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const SYSTEM_PROMPT =
  "Kamu adalah Sentry AI, asisten keamanan digital ScamShield Hub. Jawab dalam bahasa Indonesia. " +
  "Fokus membantu pengguna mengenali penipuan online, phishing, situs mencurigakan, dan praktik aman berselancar. " +
  "Jawaban harus singkat, padat, jelas, dan mudah dipahami. Jangan gunakan karakter khusus, emoticon, atau simbol seperti * dan #. " +
  "Jika jawaban berupa langkah-langkah, tampilkan sebagai list bernomor. Batasi panjang jawaban maksimal 900 karakter tanpa memotong konteks atau kalimat yang penting. " +
  "Jika pengguna perlu melaporkan sesuatu (misalnya penipuan, nomor mencurigakan, atau akun palsu), berikan keterangan ke mana harus melapor, contoh: aplikasi perbankan resmi, aduannomor.id, patrolisiber.id, atau polisi. " +
  "Ingatkan bahwa hasil analisis aplikasi bersifat indikatif, bukan jaminan mutlak.";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function geminiRequest(messages) {
  const contents = messages
    .filter(function (m) {
      return m && m.role && typeof m.content === "string";
    })
    .map(function (m) {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      };
    });

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: contents,
  };

  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(payload);
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      MODEL +
      ":generateContent?key=" +
      encodeURIComponent(GEMINI_API_KEY);

    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      function (res) {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", function (c) {
          raw += c;
        });
        res.on("end", function () {
          if (res.statusCode !== 200) {
            reject(new Error("Gemini API error " + res.statusCode + ": " + raw.slice(0, 400)));
            return;
          }
          let json;
          try {
            json = JSON.parse(raw);
          } catch (e) {
            reject(new Error("Respon Gemini tidak valid."));
            return;
          }
          const text =
            json.candidates &&
            json.candidates[0] &&
            json.candidates[0].content &&
            json.candidates[0].content.parts &&
            json.candidates[0].content.parts[0] &&
            json.candidates[0].content.parts[0].text;
          if (typeof text !== "string") {
            reject(new Error("Gemini tidak mengembalikan teks."));
            return;
          }
          resolve(text);
        });
      }
    );
    req.on("error", function (err) {
      reject(err);
    });
    req.write(body);
    req.end();
  });
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    let raw = "";
    req.setEncoding("utf8");
    req.on("data", function (c) {
      raw += c;
      if (raw.length > 1e6) {
        req.destroy();
        reject(new Error("Payload terlalu besar."));
      }
    });
    req.on("end", function () {
      resolve(raw);
    });
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Gunakan POST /api/chat." }));
    return;
  }

  if (!GEMINI_API_KEY) {
    res.statusCode = 503;
    res.end(JSON.stringify({ error: "API key Gemini belum diisi. Tambahkan GEMINI_API_KEY di Vercel Environment Variables." }));
    return;
  }

  try {
    const body = await readBody(req);
    const parsed = JSON.parse(body);
    if (!Array.isArray(parsed.messages) || !parsed.messages.length) {
      throw new Error("Field messages wajib diisi.");
    }
    const text = await geminiRequest(parsed.messages);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ text: text }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: String(err && err.message ? err.message : err) }));
  }
};