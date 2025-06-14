const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const download = require("./utils/download");

const app = express();
const PORT = process.env.PORT || 4000;

const downloadsPath = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath);
}

app.use(cors());
app.use(express.json());

const clientBuildPath = path.join(__dirname, "public");
app.use(express.static(clientBuildPath));

app.post("/api/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const filePath = await download(url);
    const fileName = path.basename(filePath);

    res.json({
      fileUrl: `/downloads/${encodeURIComponent(fileName)}`,
      fileName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to download" });
  }
});

app.get("/downloads/:filename", (req, res) => {
  const filePath = path.join(downloadsPath, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.download(filePath);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
