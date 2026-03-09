export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fcfbf9",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: "#0f0f0f",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 72,
            fontWeight: 700,
            color: "#e4e1db",
            display: "block",
            marginBottom: 8,
          }}
        >
          404
        </span>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Page introuvable
        </h1>
        <p style={{ color: "#7a7a7a", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Cette page n'existe pas ou a été déplacée.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "#6366F1",
            color: "#fff",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Retour à l'accueil
        </a>
      </div>
    </main>
  );
}
