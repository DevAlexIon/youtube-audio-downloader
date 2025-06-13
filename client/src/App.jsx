import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://youtube-audio-downloader-7f3r.onrender.com/api/download",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Download failed");
      }
      const { fileUrl, fileName } = await response.json();

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <h1>Descarcă MP3 de pe YouTube</h1>
      <input
        type="text"
        placeholder="Adaugă URL-ul YouTube aici"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: 12, fontSize: 16 }}
      />
      <button
        onClick={handleDownload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          backgroundColor: "#1e90ff",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Se descarcă..." : "Descarcă MP3"}
      </button>
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
    </div>
  );
}

export default App;
