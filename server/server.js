const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const dir = __dirname;
  const file = path.join(dir, ".env");
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .forEach(function (line) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq < 0) return;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (process.env[key] === undefined) process.env[key] = val;
    });
}

loadEnv();

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const SYSTEM_PROMPT =
  "Kamu adalah Sentry AI, asisten keamanan digital ScamShield Hub. Jawab dalam bahasa Indonesia. " +
  "Fokus membantu pengguna mengenali penipuan online, phishing, situs mencurigakan, dan praktik aman berselancar. " +
  "Jawaban harus singkat, padat, jelas, dan mudah dipahami. Jangan gunakan karakter khusus, emoticon, atau simbol seperti * dan #. " +
  "Ingatkan bahwa hasil analisis aplikasi bersifat indikatif, bukan jaminan mutlak.";

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

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(function (req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    if (!GEMINI_API_KEY) {
      send(res, 503, { error: "API key Gemini belum diisi di server. Set GEMINI_API_KEY lalu nyalakan ulang server." });
      return;
    }
    readBody(req)
      .then(function (body) {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          throw new Error("Request body tidak valid.");
        }
        if (!Array.isArray(parsed.messages) || !parsed.messages.length) {
          throw new Error("Field messages wajib diisi.");
        }
        return geminiRequest(parsed.messages);
      })
      .then(function (text) {
        send(res, 200, { text: text });
      })
      .catch(function (err) {
        send(res, 500, { error: String(err && err.message ? err.message : err) });
      });
    return;
  }

  send(res, 404, { error: "Tidak ditemukan. Gunakan POST /api/chat." });
});

server.listen(PORT, function () {
  console.log("ScamShield Hub AI proxy berjalan di http://localhost:" + PORT);
});