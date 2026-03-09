import { getServiceSupabase } from "@/lib/supabase";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

export const metadata = {
  title: "Désinscription – monmarché",
  robots: "noindex",
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { id?: string; token?: string };
}) {
  const id = searchParams.id;
  const token = searchParams.token;
  let success = false;
  let error = false;

  if (!id || !token || !verifyUnsubscribeToken(id, token)) {
    error = true;
  } else {
    const supabase = getServiceSupabase();
    const { error: dbError } = await supabase
      .from("subscribers")
      .update({ active: false })
      .eq("id", id);

    if (dbError) {
      error = true;
    } else {
      success = true;
    }
  }

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
        <a
          href="/"
          style={{ textDecoration: "none", display: "inline-block", marginBottom: 40 }}
        >
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: "#6366F1", fontWeight: 700 }}>
            mon
          </span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: "#0f0f0f" }}>
            marché
          </span>
        </a>

        {success && (
          <>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
              Vous êtes désinscrit(e)
            </h1>
            <p style={{ color: "#7a7a7a", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              Vous ne recevrez plus de digest par email. Si c'est une erreur, vous pouvez vous réinscrire à tout moment.
            </p>
          </>
        )}

        {error && (
          <>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
              Lien invalide
            </h1>
            <p style={{ color: "#7a7a7a", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              Ce lien de désinscription est invalide ou a déjà été utilisé. Si vous souhaitez vous désinscrire, contactez-nous.
            </p>
          </>
        )}

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
