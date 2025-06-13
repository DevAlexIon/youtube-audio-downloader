const fs = require("fs");
const path = require("path");
const ytdlp = require("yt-dlp-exec");

const download = async (url) => {
  const outputDir = path.join(__dirname, "..", "downloads");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputTemplate = path.join(outputDir, "%(title)s_%(id)s.%(ext)s");

  try {
    const result = await ytdlp(url, {
      extractAudio: true,
      audioFormat: "mp3",
      output: outputTemplate,
      noOverwrites: true,
      print: ["after_move:filepath"],
      cookies: path.join(__dirname, "..", "cookies.txt"),
    });

    const lines = result.trim().split("\n");
    const filePath = lines.find((line) => line.endsWith(".mp3"));

    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error("Fișierul mp3 nu a fost găsit");
    }

    return filePath;
  } catch (err) {
    throw new Error(`Eroare la descărcare: ${err.message}`);
  }
};

module.exports = download;
