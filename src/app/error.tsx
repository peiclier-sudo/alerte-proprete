"use client";

export default function Error({ reset }: { reset: () => void }) {
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
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Une erreur est survenue
        </h1>
        <p style={{ color: "#7a7a7a", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Quelque chose s'est mal passé. Veuillez réessayer.
        </p>
        <button
          onClick={reset}
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "#6366F1",
            color: "#fff",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
      </div>
    </main>
  );
}
