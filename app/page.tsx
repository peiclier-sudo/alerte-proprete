'use client'

import { useState } from 'react'

const DEPARTEMENTS = [
  "01 - Ain","02 - Aisne","03 - Allier","04 - Alpes-de-Haute-Provence","05 - Hautes-Alpes",
  "06 - Alpes-Maritimes","07 - Ardèche","08 - Ardennes","09 - Ariège","10 - Aube",
  "11 - Aude","12 - Aveyron","13 - Bouches-du-Rhône","14 - Calvados","15 - Cantal",
  "16 - Charente","17 - Charente-Maritime","18 - Cher","19 - Corrèze","2A - Corse-du-Sud",
  "2B - Haute-Corse","21 - Côte-d'Or","22 - Côtes-d'Armor","23 - Creuse","24 - Dordogne",
  "25 - Doubs","26 - Drôme","27 - Eure","28 - Eure-et-Loir","29 - Finistère",
  "30 - Gard","31 - Haute-Garonne","32 - Gers","33 - Gironde","34 - Hérault",
  "35 - Ille-et-Vilaine","36 - Indre","37 - Indre-et-Loire","38 - Isère","39 - Jura",
  "40 - Landes","41 - Loir-et-Cher","42 - Loire","43 - Haute-Loire","44 - Loire-Atlantique",
  "45 - Loiret","46 - Lot","47 - Lot-et-Garonne","48 - Lozère","49 - Maine-et-Loire",
  "50 - Manche","51 - Marne","52 - Haute-Marne","53 - Mayenne","54 - Meurthe-et-Moselle",
  "55 - Meuse","56 - Morbihan","57 - Moselle","58 - Nièvre","59 - Nord",
  "60 - Oise","61 - Orne","62 - Pas-de-Calais","63 - Puy-de-Dôme","64 - Pyrénées-Atlantiques",
  "65 - Hautes-Pyrénées","66 - Pyrénées-Orientales","67 - Bas-Rhin","68 - Haut-Rhin","69 - Rhône",
  "70 - Haute-Saône","71 - Saône-et-Loire","72 - Sarthe","73 - Savoie","74 - Haute-Savoie",
  "75 - Paris","76 - Seine-Maritime","77 - Seine-et-Marne","78 - Yvelines","79 - Deux-Sèvres",
  "80 - Somme","81 - Tarn","82 - Tarn-et-Garonne","83 - Var","84 - Vaucluse",
  "85 - Vendée","86 - Vienne","87 - Haute-Vienne","88 - Vosges","89 - Yonne",
  "90 - Territoire de Belfort","91 - Essonne","92 - Hauts-de-Seine","93 - Seine-Saint-Denis",
  "94 - Val-de-Marne","95 - Val-d'Oise","971 - Guadeloupe","972 - Martinique",
  "973 - Guyane","974 - Réunion","976 - Mayotte"
]

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [selectedDepts, setSelectedDepts] = useState<string[]>([])
  const [deptSearch, setDeptSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showDeptDropdown, setShowDeptDropdown] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredDepts = DEPARTEMENTS.filter(d =>
    d.toLowerCase().includes(deptSearch.toLowerCase())
  )

  const toggleDept = (dept: string) => {
    const code = dept.split(' - ')[0]
    if (selectedDepts.includes(code)) {
      setSelectedDepts(selectedDepts.filter(d => d !== code))
    } else {
      setSelectedDepts([...selectedDepts, code])
    }
  }

  const handleSubmit = async () => {
    if (!email || selectedDepts.length === 0) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, company, departments: selectedDepts }),
      })
      if (res.ok) setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
    setIsSubmitting(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafaf8',
      color: '#1a1a1a',
      fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        ::selection { background: #d1fae5; }

        input:focus { outline: none; border-color: #059669 !important; }

        .cta-btn {
          transition: all 0.2s ease;
        }
        .cta-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .ao-card {
          transition: all 0.2s ease;
        }
        .ao-card:hover {
          border-color: #d1d5db;
        }

        .faq-toggle {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .faq-toggle:hover {
          background: #f3f4f6;
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 800,
            color: '#059669',
            letterSpacing: '-0.5px',
          }}>alerte</span>
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 800,
            color: '#1a1a1a',
            letterSpacing: '-0.5px',
          }}>propreté</span>
        </div>
        <a href="#inscription" className="cta-btn" style={{
          padding: '10px 20px',
          background: '#059669',
          color: 'white',
          borderRadius: 6,
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 600,
        }}>Essai gratuit</a>
      </nav>

      {/* HERO — Pain-point led, benefit focused */}
      <header style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '72px 24px 64px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#059669',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}>Veille marchés publics de nettoyage</p>

        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(32px, 5.5vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.15,
          color: '#111',
          marginBottom: 20,
          letterSpacing: '-1px',
        }}>
          Vous perdez des marchés publics parce que vous les découvrez trop tard.
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 19px)',
          color: '#555',
          lineHeight: 1.7,
          maxWidth: 580,
          margin: '0 auto 36px',
        }}>
          AlertePropreté surveille le BOAMP chaque nuit et vous envoie
          les appels d'offres de nettoyage dans vos départements,
          classés par pertinence. Chaque matin à 5h, dans votre boîte mail.
        </p>

        <a href="#inscription" className="cta-btn" style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: '#059669',
          color: 'white',
          borderRadius: 8,
          textDecoration: 'none',
          fontSize: 16,
          fontWeight: 700,
        }}>Essayer gratuitement pendant 14 jours</a>

        <p style={{ fontSize: 13, color: '#999', marginTop: 12 }}>
          Sans carte bancaire. Sans engagement.
        </p>
      </header>

      {/* SOCIAL PROOF BAR — Numbers that build trust */}
      <div style={{
        maxWidth: 760,
        margin: '0 auto 64px',
        padding: '0 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          overflow: 'hidden',
          background: 'white',
        }}>
          {[
            { val: '100+', label: 'AO de nettoyage par mois' },
            { val: '96', label: 'départements couverts' },
            { val: '< 2 min', label: 'de lecture chaque matin' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '20px 16px',
              textAlign: 'center',
              borderRight: i < 2 ? '1px solid #e5e7eb' : 'none',
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669', fontFamily: "'Fraunces', serif" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: '#777', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM / SOLUTION — Address the pain directly */}
      <section style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '0 24px 80px',
      }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(24px, 3.5vw, 32px)',
          fontWeight: 700,
          color: '#111',
          marginBottom: 40,
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}>Le problème que vous connaissez bien</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {/* Problem */}
          <div style={{
            padding: '28px 24px',
            background: '#fef2f2',
            borderRadius: 10,
            border: '1px solid #fecaca',
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#991b1b', marginBottom: 16 }}>Sans AlertePropreté</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Vous passez 1h par jour à chercher des AO sur différentes plateformes',
                'Vous découvrez des marchés après la date limite',
                'Vous répondez à des AO peu pertinents, perdant temps et argent',
                'Vos concurrents qui ont des veilleurs dédiés vous passent devant',
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#7f1d1d', lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0, marginTop: 2 }}>—</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div style={{
            padding: '28px 24px',
            background: '#f0fdf4',
            borderRadius: 10,
            border: '1px solid #bbf7d0',
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#166534', marginBottom: 16 }}>Avec AlertePropreté</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Un email par jour avec uniquement les AO pertinents pour vous',
                'Détection dès la publication, bien avant la deadline',
                "Chaque AO est noté par l'IA : vous ne lisez que les meilleurs",
                'Le même niveau de veille que les grands groupes, pour 39 €/mois',
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#14532d', lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0, marginTop: 2 }}>+</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — Simple, 3-step, no emojis */}
      <section style={{
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(24px, 3.5vw, 32px)',
            fontWeight: 700,
            color: '#111',
            marginBottom: 48,
            textAlign: 'center',
            letterSpacing: '-0.5px',
          }}>Comment ça fonctionne</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {[
              {
                num: '1',
                title: 'Collecte automatique chaque nuit',
                desc: "Notre système interroge le Bulletin Officiel des Annonces de Marchés Publics (BOAMP) et extrait tous les marchés liés au nettoyage, à la propreté et à l'entretien de locaux.",
              },
              {
                num: '2',
                title: 'Analyse et scoring par intelligence artificielle',
                desc: "Chaque appel d'offres est évalué de 1 à 10 selon sa pertinence pour une entreprise de nettoyage de locaux. Vous ne voyez que ceux qui comptent vraiment.",
              },
              {
                num: '3',
                title: 'Un email clair dans votre boîte, à 5h du matin',
                desc: "Vous commencez votre journée avec la liste des opportunités dans vos départements, triées par pertinence. Titre, acheteur, deadline, lien direct vers l'AO.",
              },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#059669',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                }}>{step.num}</div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 6 }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REAL EXAMPLES — Show, don't tell */}
      <section style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '80px 24px',
      }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(24px, 3.5vw, 32px)',
          fontWeight: 700,
          color: '#111',
          marginBottom: 12,
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}>Ce que vous recevez chaque matin</h2>
        <p style={{ textAlign: 'center', color: '#777', marginBottom: 40, fontSize: 15 }}>
          Exemples réels issus du BOAMP cette semaine
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              title: "Nettoyage intérieur et extérieur des bâtiments communaux et intercommunaux — 2026 à 2029",
              buyer: "Communauté de communes Loire-Atlantique",
              dept: "44",
              score: 9,
              deadline: "28/02/2026",
            },
            {
              title: "Prestations de nettoyage des locaux et de la vitrerie des sites de la CPAM",
              buyer: "CPAM du Puy-de-Dôme",
              dept: "63",
              score: 9,
              deadline: "15/03/2026",
            },
            {
              title: "Mise en propreté des locaux et des vitres — Conseil Départemental",
              buyer: "Département des Hauts-de-Seine",
              dept: "92",
              score: 10,
              deadline: "05/03/2026",
            },
          ].map((ao, i) => (
            <div key={i} className="ao-card" style={{
              padding: '20px 24px',
              background: 'white',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 6, lineHeight: 1.4 }}>
                  {ao.title}
                </p>
                <p style={{ fontSize: 13, color: '#777' }}>
                  {ao.buyer} — Dpt {ao.dept} — Limite : {ao.deadline}
                </p>
              </div>
              <div style={{
                background: ao.score >= 9 ? '#059669' : '#d97706',
                color: 'white',
                padding: '6px 12px',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 15,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {ao.score}/10
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#999', marginTop: 16 }}>
          Score de pertinence calculé par IA — 10 = parfaitement adapté à une PME de nettoyage
        </p>
      </section>

      {/* PRICING — Single plan, clear value */}
      <section id="tarif" style={{
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(24px, 3.5vw, 32px)',
            fontWeight: 700,
            color: '#111',
            marginBottom: 40,
            letterSpacing: '-0.5px',
          }}>Un seul tarif, tout inclus</h2>

          <div style={{
            padding: '40px 32px',
            border: '2px solid #059669',
            borderRadius: 12,
            background: '#fafaf8',
          }}>
            <div style={{ marginBottom: 24 }}>
              <span style={{
                fontSize: 52,
                fontWeight: 800,
                fontFamily: "'Fraunces', serif",
                color: '#111',
              }}>39 €</span>
              <span style={{ fontSize: 18, color: '#777' }}> / mois</span>
            </div>

            <div style={{ textAlign: 'left', marginBottom: 32 }}>
              {[
                'Veille quotidienne sur le BOAMP',
                'Scoring de pertinence par IA',
                'Email digest chaque matin',
                'Tous les départements de votre choix',
                'Détection dès publication',
                'Support par email',
              ].map((f, i) => (
                <div key={i} style={{
                  padding: '10px 0',
                  borderBottom: i < 5 ? '1px solid #e5e7eb' : 'none',
                  fontSize: 15,
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>&#10003;</span>
                  {f}
                </div>
              ))}
            </div>

            <a href="#inscription" className="cta-btn" style={{
              display: 'block',
              padding: '14px',
              background: '#059669',
              color: 'white',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 700,
              textAlign: 'center',
            }}>Commencer l'essai gratuit</a>

            <p style={{ fontSize: 13, color: '#999', marginTop: 10 }}>
              14 jours gratuits — Sans carte bancaire — Sans engagement
            </p>
          </div>

          <p style={{
            fontSize: 14,
            color: '#777',
            marginTop: 24,
            lineHeight: 1.6,
          }}>
            Un seul marché remporté rembourse des années d'abonnement.
            <br />La question n'est pas le prix, c'est combien de marchés vous ratez aujourd'hui.
          </p>
        </div>
      </section>

      {/* INSCRIPTION FORM */}
      <section id="inscription" style={{
        maxWidth: 500,
        margin: '0 auto',
        padding: '80px 24px',
      }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(24px, 3.5vw, 32px)',
          fontWeight: 700,
          color: '#111',
          marginBottom: 8,
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}>Démarrez votre essai gratuit</h2>
        <p style={{ textAlign: 'center', color: '#777', marginBottom: 36, fontSize: 15 }}>
          Recevez votre premier email demain matin
        </p>

        {submitted ? (
          <div style={{
            padding: 40,
            background: '#f0fdf4',
            borderRadius: 10,
            border: '1px solid #bbf7d0',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#166534', marginBottom: 8, fontFamily: "'Fraunces', serif" }}>
              Inscription confirmée.
            </p>
            <p style={{ color: '#555', fontSize: 15, lineHeight: 1.7 }}>
              Votre premier digest arrivera demain matin à 5h00
              avec les appels d'offres de nettoyage dans vos départements.
            </p>
          </div>
        ) : (
          <div style={{
            padding: '32px 28px',
            background: 'white',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Email professionnel
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@entreprise.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#fafaf8',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  color: '#111',
                  fontSize: 15,
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                  Nom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#fafaf8',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    color: '#111',
                    fontSize: 15,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                  Entreprise
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nom de l'entreprise"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#fafaf8',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    color: '#111',
                    fontSize: 15,
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24, position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Départements à surveiller
              </label>

              {selectedDepts.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {selectedDepts.map(code => (
                    <span
                      key={code}
                      onClick={() => setSelectedDepts(selectedDepts.filter(d => d !== code))}
                      style={{
                        padding: '3px 10px',
                        background: '#d1fae5',
                        borderRadius: 4,
                        fontSize: 13,
                        color: '#065f46',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      {code} ×
                    </span>
                  ))}
                </div>
              )}

              <input
                type="text"
                value={deptSearch}
                onChange={(e) => { setDeptSearch(e.target.value); setShowDeptDropdown(true) }}
                onFocus={() => setShowDeptDropdown(true)}
                placeholder="Tapez pour rechercher..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#fafaf8',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  color: '#111',
                  fontSize: 15,
                }}
              />

              {showDeptDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: 180,
                  overflowY: 'auto',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  marginTop: 4,
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}>
                  {filteredDepts.slice(0, 12).map(dept => {
                    const code = dept.split(' - ')[0]
                    const isSelected = selectedDepts.includes(code)
                    return (
                      <div
                        key={dept}
                        onClick={() => toggleDept(dept)}
                        style={{
                          padding: '9px 14px',
                          cursor: 'pointer',
                          fontSize: 14,
                          color: isSelected ? '#059669' : '#333',
                          fontWeight: isSelected ? 600 : 400,
                          background: isSelected ? '#f0fdf4' : 'transparent',
                          borderBottom: '1px solid #f3f4f6',
                        }}
                      >
                        {isSelected ? '✓ ' : ''}{dept}
                      </div>
                    )
                  })}
                  <div
                    onClick={() => setShowDeptDropdown(false)}
                    style={{
                      padding: '8px 14px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontSize: 13,
                      color: '#999',
                    }}
                  >
                    Fermer
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!email || selectedDepts.length === 0 || isSubmitting}
              className="cta-btn"
              style={{
                width: '100%',
                padding: '14px',
                background: (!email || selectedDepts.length === 0) ? '#d1d5db' : '#059669',
                color: (!email || selectedDepts.length === 0) ? '#999' : 'white',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                cursor: (!email || selectedDepts.length === 0) ? 'not-allowed' : 'pointer',
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              {isSubmitting ? 'Inscription...' : 'Démarrer mon essai gratuit'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 10 }}>
              14 jours gratuits. Sans carte bancaire.
            </p>
          </div>
        )}
      </section>

      {/* FAQ — Accordion style */}
      <section style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '0 24px 80px',
      }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(24px, 3.5vw, 32px)',
          fontWeight: 700,
          color: '#111',
          marginBottom: 32,
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}>Questions fréquentes</h2>

        {[
          {
            q: "D'où viennent les appels d'offres ?",
            a: "Directement du BOAMP (Bulletin Officiel des Annonces de Marchés Publics), la source officielle de l'État. Tous les marchés publics y sont publiés obligatoirement. Nous ne dépendons d'aucun intermédiaire."
          },
          {
            q: "Comment fonctionne le scoring de pertinence ?",
            a: "Notre intelligence artificielle analyse le titre, le descripteur, l'acheteur et les codes CPV de chaque marché. Elle attribue un score de 1 à 10 selon la pertinence pour une entreprise de nettoyage de locaux. Un 8 ou plus signifie un marché directement lié au nettoyage de bâtiments."
          },
          {
            q: "Est-ce que ça couvre aussi la vitrerie et l'entretien ?",
            a: "Oui. Le système détecte les marchés de nettoyage de locaux, de vitrerie, d'entretien de bâtiments et de propreté en général. Tout ce qui touche au secteur de la propreté est couvert."
          },
          {
            q: "Puis-je modifier mes départements après l'inscription ?",
            a: "Oui, à tout moment. Contactez-nous par email et vos préférences seront mises à jour pour le lendemain matin."
          },
          {
            q: "Quel est l'engagement ?",
            a: "Aucun. L'essai dure 14 jours sans carte bancaire. Ensuite, l'abonnement est de 39 €/mois, résiliable à tout moment en un clic. Pas de frais cachés, pas de période minimum."
          },
        ].map((faq, i) => (
          <div key={i} style={{
            borderBottom: '1px solid #e5e7eb',
          }}>
            <div
              className="faq-toggle"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                padding: '18px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{faq.q}</p>
              <span style={{
                fontSize: 20,
                color: '#999',
                transform: openFaq === i ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.2s ease',
                flexShrink: 0,
                marginLeft: 12,
              }}>+</span>
            </div>
            {openFaq === i && (
              <p style={{
                fontSize: 14,
                color: '#555',
                lineHeight: 1.7,
                paddingBottom: 18,
              }}>{faq.a}</p>
            )}
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <section style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '0 24px 80px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(20px, 3vw, 26px)',
          fontWeight: 700,
          color: '#111',
          marginBottom: 20,
          lineHeight: 1.4,
        }}>
          Demain matin à 5h, vous pourriez avoir vos premiers marchés.
        </p>
        <a href="#inscription" className="cta-btn" style={{
          display: 'inline-block',
          padding: '14px 36px',
          background: '#059669',
          color: 'white',
          borderRadius: 8,
          textDecoration: 'none',
          fontSize: 16,
          fontWeight: 700,
        }}>Essayer gratuitement</a>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #e5e7eb',
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, marginBottom: 8 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: '#059669' }}>alerte</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>propreté</span>
        </div>
        <p style={{ fontSize: 12, color: '#999' }}>
          AlertePropreté — Veille automatisée des marchés publics de nettoyage
        </p>
      </footer>
    </div>
  )
}