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

const EXEMPLE_AOS = [
  {
    title: "Nettoyage intérieur et extérieur des bâtiments communaux",
    buyer: "Mairie de Nantes",
    dept: "44",
    score: 9,
    deadline: "28/02/2026",
    reason: "Nettoyage de locaux communaux, très pertinent"
  },
  {
    title: "Prestations de nettoyage des locaux et vitreries",
    buyer: "CPAM du Puy-de-Dôme",
    dept: "63",
    score: 9,
    deadline: "15/03/2026",
    reason: "Nettoyage + vitrerie de locaux administratifs"
  },
  {
    title: "Mise en propreté des locaux et des vitres",
    buyer: "Conseil Départemental 92",
    dept: "92",
    score: 10,
    deadline: "05/03/2026",
    reason: "Marché de propreté multi-sites, idéal PME"
  }
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
      background: '#0a1628',
      color: '#e8edf5',
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        html { scroll-behavior: smooth; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }

        .fade-in-up-delay-1 {
          animation: fadeInUp 0.8s ease 0.15s forwards;
          opacity: 0;
        }

        .fade-in-up-delay-2 {
          animation: fadeInUp 0.8s ease 0.3s forwards;
          opacity: 0;
        }

        .fade-in-up-delay-3 {
          animation: fadeInUp 0.8s ease 0.45s forwards;
          opacity: 0;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #34d399 0%, #6ee7b7 25%, #ffffff 50%, #6ee7b7 75%, #34d399 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(52, 211, 153, 0.15);
        }

        .btn-primary {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(52, 211, 153, 0.4);
        }

        .dept-tag {
          transition: all 0.2s ease;
        }
        .dept-tag:hover {
          background: rgba(52, 211, 153, 0.3) !important;
        }

        .glow-dot {
          animation: pulse 3s ease infinite;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #34d399 !important;
          box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.15);
        }

        ::selection {
          background: rgba(52, 211, 153, 0.3);
        }

        .faq-item {
          transition: all 0.3s ease;
        }
        .faq-item:hover {
          background: rgba(52, 211, 153, 0.05);
        }
      `}</style>

      {/* HERO SECTION */}
      <header style={{
        position: 'relative',
        padding: '40px 24px 80px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: 100,
          right: -100,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: 300,
          left: -150,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* Nav */}
        <nav className="fade-in-up" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 80,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #34d399, #059669)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>🧹</div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '-0.5px',
            }}>AlertePropreté</span>
          </div>
          <a href="#tarif" style={{
            color: '#34d399',
            textDecoration: 'none',
            fontSize: 15,
            fontWeight: 500,
            padding: '10px 24px',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: 8,
            transition: 'all 0.3s ease',
          }}>Voir le tarif →</a>
        </nav>

        {/* Hero content */}
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div className="fade-in-up" style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 500,
            color: '#6ee7b7',
            marginBottom: 24,
            letterSpacing: '0.5px',
          }}>
            <span className="glow-dot" style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              background: '#34d399',
              borderRadius: '50%',
              marginRight: 8,
              verticalAlign: 'middle',
            }} />
            VEILLE AUTOMATISÉE DES MARCHÉS PUBLICS
          </div>

          <h1 className="fade-in-up-delay-1" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: '-1px',
          }}>
            Ne ratez plus aucun<br />
            <span className="shimmer-text">appel d'offres</span><br />
            de nettoyage
          </h1>

          <p className="fade-in-up-delay-2" style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#8896b0',
            lineHeight: 1.7,
            maxWidth: 560,
            margin: '0 auto 40px',
          }}>
            Recevez chaque matin les marchés publics de propreté
            dans vos départements, scorés par IA selon leur pertinence.
          </p>

          <div className="fade-in-up-delay-3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#inscription" className="btn-primary" style={{
              padding: '16px 36px',
              background: 'linear-gradient(135deg, #34d399, #059669)',
              color: '#0a1628',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              textDecoration: 'none',
              display: 'inline-block',
            }}>
              Essai gratuit 14 jours
            </a>
            <a href="#exemples" style={{
              padding: '16px 36px',
              background: 'transparent',
              color: '#8896b0',
              borderRadius: 10,
              fontWeight: 500,
              fontSize: 16,
              textDecoration: 'none',
              border: '1px solid rgba(136, 150, 176, 0.2)',
              display: 'inline-block',
              transition: 'all 0.3s ease',
            }}>
              Voir un exemple
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="fade-in-up-delay-3" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 1,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 16,
          overflow: 'hidden',
          marginTop: 80,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {[
            { value: '100+', label: 'AO de nettoyage / mois' },
            { value: '96 depts', label: 'couverts en France' },
            { value: '5h00', label: 'dans votre boîte mail' },
            { value: 'IA', label: 'scoring de pertinence' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '28px 24px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#34d399',
                fontFamily: "'DM Sans', sans-serif",
              }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#6b7a94', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section style={{
        padding: '80px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: 16,
          letterSpacing: '-0.5px',
        }}>Comment ça marche</h2>
        <p style={{ textAlign: 'center', color: '#6b7a94', marginBottom: 60, fontSize: 17 }}>
          3 étapes, zéro effort de votre part
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {[
            {
              step: '01',
              icon: '🔍',
              title: 'Collecte automatique',
              desc: 'Notre système scanne le BOAMP (Bulletin Officiel) chaque nuit et extrait les marchés liés au nettoyage et à la propreté.',
            },
            {
              step: '02',
              icon: '🤖',
              title: "Scoring par l'IA",
              desc: "Chaque appel d'offres est analysé et noté de 1 à 10 selon sa pertinence pour une entreprise de nettoyage de locaux.",
            },
            {
              step: '03',
              icon: '📬',
              title: 'Email personnalisé',
              desc: 'Vous recevez chaque matin uniquement les AO pertinents dans vos départements, classés par score.',
            },
          ].map((item, i) => (
            <div key={i} className="card-hover" style={{
              padding: 36,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.06)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 16,
                right: 20,
                fontSize: 72,
                fontWeight: 900,
                color: 'rgba(52, 211, 153, 0.06)',
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1,
              }}>{item.step}</div>
              <div style={{ fontSize: 36, marginBottom: 20 }}>{item.icon}</div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 12,
                color: '#e8edf5',
              }}>{item.title}</h3>
              <p style={{
                fontSize: 15,
                color: '#6b7a94',
                lineHeight: 1.7,
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXEMPLES AO */}
      <section id="exemples" style={{
        padding: '80px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: 16,
          letterSpacing: '-0.5px',
        }}>Exemples d'appels d'offres</h2>
        <p style={{ textAlign: 'center', color: '#6b7a94', marginBottom: 60, fontSize: 17 }}>
          Voici le type d'AO que vous recevrez chaque matin
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720, margin: '0 auto' }}>
          {EXEMPLE_AOS.map((ao, i) => (
            <div key={i} className="card-hover" style={{
              padding: '24px 28px',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 20,
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{ao.title}</h4>
                <p style={{ fontSize: 13, color: '#6b7a94', marginBottom: 6 }}>
                  {ao.buyer} — Département {ao.dept}
                </p>
                <p style={{ fontSize: 13, color: '#34d399' }}>{ao.reason}</p>
                <p style={{ fontSize: 12, color: '#4a5568', marginTop: 8 }}>⏰ Deadline : {ao.deadline}</p>
              </div>
              <div style={{
                background: ao.score >= 9 ? 'linear-gradient(135deg, #34d399, #059669)' : 'linear-gradient(135deg, #fbbf24, #d97706)',
                color: ao.score >= 9 ? '#0a1628' : '#0a1628',
                padding: '8px 14px',
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 18,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {ao.score}/10
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="tarif" style={{
        padding: '80px 24px',
        maxWidth: 600,
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: 60,
          letterSpacing: '-0.5px',
        }}>Un prix simple</h2>

        <div className="card-hover" style={{
          padding: '48px 40px',
          background: 'linear-gradient(145deg, rgba(52, 211, 153, 0.08), rgba(52, 211, 153, 0.02))',
          borderRadius: 20,
          border: '1px solid rgba(52, 211, 153, 0.15)',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 14px',
            background: 'rgba(52, 211, 153, 0.15)',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
            color: '#6ee7b7',
            marginBottom: 24,
            letterSpacing: '1px',
          }}>14 JOURS D'ESSAI GRATUIT</div>

          <div style={{ marginBottom: 8 }}>
            <span style={{
              fontSize: 64,
              fontWeight: 900,
              fontFamily: "'Playfair Display', serif",
              color: '#ffffff',
            }}>39€</span>
            <span style={{ fontSize: 20, color: '#6b7a94', marginLeft: 4 }}>/mois</span>
          </div>
          <p style={{ color: '#6b7a94', marginBottom: 32, fontSize: 15 }}>Sans engagement · Annulable à tout moment</p>

          <div style={{ textAlign: 'left', maxWidth: 360, margin: '0 auto 36px' }}>
            {[
              'Veille quotidienne automatisée',
              'Tous les départements de France',
              'Scoring IA de pertinence',
              'Email digest chaque matin',
              'Sources : BOAMP + profils acheteurs',
              'Support par email',
            ].map((feature, i) => (
              <div key={i} style={{
                padding: '10px 0',
                borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 15,
                color: '#c0c9d9',
              }}>
                <span style={{ color: '#34d399', fontSize: 16 }}>✓</span>
                {feature}
              </div>
            ))}
          </div>

          <a href="#inscription" className="btn-primary" style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: 'linear-gradient(135deg, #34d399, #059669)',
            color: '#0a1628',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            textDecoration: 'none',
          }}>
            Démarrer l'essai gratuit
          </a>
        </div>
      </section>

      {/* INSCRIPTION FORM */}
      <section id="inscription" style={{
        padding: '80px 24px',
        maxWidth: 560,
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: 16,
          letterSpacing: '-0.5px',
        }}>Commencez votre essai</h2>
        <p style={{ textAlign: 'center', color: '#6b7a94', marginBottom: 48, fontSize: 17 }}>
          14 jours gratuits, sans carte bancaire
        </p>

        {submitted ? (
          <div style={{
            padding: 48,
            background: 'linear-gradient(145deg, rgba(52, 211, 153, 0.1), rgba(52, 211, 153, 0.03))',
            borderRadius: 20,
            border: '1px solid rgba(52, 211, 153, 0.2)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Inscription réussie !</h3>
            <p style={{ color: '#6b7a94', fontSize: 15, lineHeight: 1.7 }}>
              Vous recevrez votre premier email demain matin à 5h00<br />
              avec les meilleurs appels d'offres de nettoyage.
            </p>
          </div>
        ) : (
          <div style={{
            padding: '40px 36px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8896b0', marginBottom: 8 }}>
                Email professionnel *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@entreprise.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  color: '#e8edf5',
                  fontSize: 15,
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8896b0', marginBottom: 8 }}>
                  Nom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    color: '#e8edf5',
                    fontSize: 15,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8896b0', marginBottom: 8 }}>
                  Entreprise
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="PropreNet SARL"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    color: '#e8edf5',
                    fontSize: 15,
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 28, position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8896b0', marginBottom: 8 }}>
                Départements surveillés *
              </label>

              {selectedDepts.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {selectedDepts.map(code => (
                    <span key={code} className="dept-tag" onClick={() => setSelectedDepts(selectedDepts.filter(d => d !== code))} style={{
                      padding: '4px 12px',
                      background: 'rgba(52, 211, 153, 0.15)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      borderRadius: 6,
                      fontSize: 13,
                      color: '#6ee7b7',
                      cursor: 'pointer',
                    }}>
                      {code} ✕
                    </span>
                  ))}
                </div>
              )}

              <input
                type="text"
                value={deptSearch}
                onChange={(e) => { setDeptSearch(e.target.value); setShowDeptDropdown(true) }}
                onFocus={() => setShowDeptDropdown(true)}
                placeholder="Rechercher un département..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  color: '#e8edf5',
                  fontSize: 15,
                }}
              />

              {showDeptDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: 200,
                  overflowY: 'auto',
                  background: '#0f1f38',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  marginTop: 4,
                  zIndex: 10,
                }}>
                  {filteredDepts.slice(0, 15).map(dept => {
                    const code = dept.split(' - ')[0]
                    const isSelected = selectedDepts.includes(code)
                    return (
                      <div
                        key={dept}
                        onClick={() => toggleDept(dept)}
                        style={{
                          padding: '10px 16px',
                          cursor: 'pointer',
                          fontSize: 14,
                          color: isSelected ? '#34d399' : '#8896b0',
                          background: isSelected ? 'rgba(52, 211, 153, 0.08)' : 'transparent',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {isSelected ? '✓ ' : ''}{dept}
                      </div>
                    )
                  })}
                  <div
                    onClick={() => setShowDeptDropdown(false)}
                    style={{
                      padding: '10px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontSize: 13,
                      color: '#4a5568',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    Fermer ▲
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!email || selectedDepts.length === 0 || isSubmitting}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                background: (!email || selectedDepts.length === 0) 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'linear-gradient(135deg, #34d399, #059669)',
                color: (!email || selectedDepts.length === 0) ? '#4a5568' : '#0a1628',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 16,
                cursor: (!email || selectedDepts.length === 0) ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {isSubmitting ? 'Inscription en cours...' : 'Démarrer mon essai gratuit →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#4a5568', marginTop: 12 }}>
              Sans carte bancaire · 14 jours gratuits · Annulable à tout moment
            </p>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section style={{
        padding: '80px 24px',
        maxWidth: 700,
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: 48,
          letterSpacing: '-0.5px',
        }}>Questions fréquentes</h2>

        {[
          {
            q: "D'où viennent les appels d'offres ?",
            a: "Nous collectons les AO directement depuis le BOAMP (Bulletin Officiel des Annonces de Marchés Publics), la source officielle de l'État français. Tous les marchés publics y sont publiés obligatoirement."
          },
          {
            q: "Comment fonctionne le scoring IA ?",
            a: "Notre intelligence artificielle analyse chaque appel d'offres et lui attribue un score de 1 à 10 selon sa pertinence pour une entreprise de nettoyage de locaux. Un score de 8-10 signifie un marché directement lié au nettoyage de bâtiments."
          },
          {
            q: "À quelle heure reçoit-on l'email ?",
            a: "Chaque matin à 5h00, vous recevez un email avec les nouveaux appels d'offres détectés dans vos départements. Vous commencez votre journée avec toutes les opportunités en main."
          },
          {
            q: "Puis-je changer mes départements ?",
            a: "Oui, vous pouvez modifier vos départements surveillés à tout moment. Le changement prend effet dès le lendemain matin."
          },
          {
            q: "Y a-t-il un engagement ?",
            a: "Aucun engagement. Vous commencez par 14 jours d'essai gratuit sans carte bancaire, puis 39€/mois sans engagement. Vous pouvez annuler à tout moment en un clic."
          },
          {
            q: "C'est uniquement pour le nettoyage ?",
            a: "Oui, AlertePropreté est spécialisé dans le secteur de la propreté et du nettoyage. C'est ce qui nous permet d'avoir un scoring IA beaucoup plus précis que les plateformes généralistes."
          },
        ].map((faq, i) => (
          <div key={i} className="faq-item" style={{
            padding: '24px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            borderRadius: 8,
          }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: '#e8edf5' }}>
              {faq.q}
            </h4>
            <p style={{ fontSize: 15, color: '#6b7a94', lineHeight: 1.7 }}>
              {faq.a}
            </p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '48px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        textAlign: 'center',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 28,
            height: 28,
            background: 'linear-gradient(135deg, #34d399, #059669)',
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}>🧹</div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            fontWeight: 700,
          }}>AlertePropreté</span>
        </div>
        <p style={{ fontSize: 13, color: '#4a5568' }}>
          © 2026 AlertePropreté · Veille automatisée des marchés publics de nettoyage
        </p>
      </footer>
    </div>
  )
}