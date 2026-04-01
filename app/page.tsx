'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [animationPhase, setAnimationPhase] = useState<'logo' | 'login'>('logo');

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // After logo animation completes (~2.8s), reveal login
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationPhase('login');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500&display=swap');

        :root {
          --neon: #00ff88;
          --neon-dim: #00cc6a;
          --neon-glow: rgba(0, 255, 136, 0.4);
          --bg-deep: #020408;
          --bg-card: rgba(6, 14, 26, 0.85);
          --border: rgba(0, 255, 136, 0.15);
          --text-muted: #5a7a6a;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg-deep);
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          height: 100vh;
        }

        /* ── Background ── */
        .bg-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,255,136,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(0,80,255,0.06) 0%, transparent 60%),
            linear-gradient(160deg, #020408 0%, #030d18 50%, #020408 100%);
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
        }

        /* Floating orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          animation: orbFloat 8s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
        .orb-1 { width: 400px; height: 400px; background: #00ff88; top: -100px; left: -100px; animation-delay: 0s; }
        .orb-2 { width: 300px; height: 300px; background: #0040ff; bottom: -80px; right: -80px; animation-delay: -3s; }
        .orb-3 { width: 200px; height: 200px; background: #00ffcc; top: 50%; left: 60%; animation-delay: -5s; opacity: 0.12; }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 20px) scale(0.97); }
        }

        /* ── Wrapper ── */
        .page-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }

        /* ── Logo Animation ── */
        .logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease;
        }

        .logo-wrapper.shift-up {
          transform: translateY(-40px);
        }

        /* SVG icon */
        .logo-icon {
          width: 72px;
          height: 72px;
          animation: iconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }

        @keyframes iconPop {
          from { transform: scale(0) rotate(-20deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);   opacity: 1; }
        }

        /* Text reveal */
        .logo-text {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 3.2rem;
          letter-spacing: 0.12em;
          color: var(--neon);
          text-shadow:
            0 0 10px var(--neon-glow),
            0 0 30px var(--neon-glow),
            0 0 60px rgba(0,255,136,0.25),
            0 0 100px rgba(0,255,136,0.1);
          animation: textReveal 0.9s cubic-bezier(0.2,0,0,1) 0.55s both;
          position: relative;
        }

        @keyframes textReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; letter-spacing: 0.3em; }
          to   { clip-path: inset(0 0% 0 0);   opacity: 1; letter-spacing: 0.12em; }
        }

        /* Scan line effect on logo */
        .logo-text::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 45%, rgba(0,255,136,0.08) 50%, transparent 55%);
          animation: scanLine 3s linear 1.5s infinite;
        }

        @keyframes scanLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        .logo-sub {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.72rem;
          letter-spacing: 0.45em;
          color: var(--text-muted);
          text-transform: uppercase;
          animation: fadeUp 0.7s ease 1.3s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Divider line */
        .divider-line {
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--neon), transparent);
          box-shadow: 0 0 8px var(--neon-glow);
          animation: lineExpand 0.6s ease 1.8s both;
          margin: 8px 0 4px;
        }

        @keyframes lineExpand {
          from { width: 0; opacity: 0; }
          to   { width: 180px; opacity: 1; }
        }

        /* ── Login Card ── */
        .login-card {
          margin-top: 40px;
          width: 100%;
          max-width: 400px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 36px 32px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(0,255,136,0.06),
            0 20px 60px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(0,255,136,0.08);
          animation: cardReveal 0.7s cubic-bezier(0.2,0,0,1) both;
          opacity: 0;
        }

        .login-card.visible {
          animation: cardReveal 0.7s cubic-bezier(0.2,0,0,1) 0.1s both;
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-headline {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 1rem;
          color: rgba(255,255,255,0.85);
          text-align: center;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
        }

        .card-sub {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 28px;
          letter-spacing: 0.02em;
        }

        /* Google button wrapper — override child styles */
        .google-btn-wrapper > * {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
        }

        .separator {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }

        .sep-line {
          flex: 1;
          height: 1px;
          background: rgba(0,255,136,0.08);
        }

        .sep-text {
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }

        .footer-note {
          text-align: center;
          font-size: 0.68rem;
          color: #334;
          margin-top: 20px;
          letter-spacing: 0.03em;
          line-height: 1.6;
        }

        .footer-note a { color: var(--neon-dim); text-decoration: none; }
        .footer-note a:hover { text-decoration: underline; }

        /* Corner accents on card */
        .card-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: var(--neon);
          border-style: solid;
          opacity: 0.5;
        }
        .card-corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
        .card-corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; border-radius: 0 4px 0 0; }
        .card-corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; border-radius: 0 0 0 4px; }
        .card-corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

        .card-relative { position: relative; }

        /* Pulse ring on icon */
        .icon-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(0,255,136,0.3);
          animation: ringPulse 2.5s ease-out 1s infinite;
        }

        @keyframes ringPulse {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.7); opacity: 0; }
        }

        .icon-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* Background layers */}
      <div className="bg-layer" />
      <div className="grid-overlay" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <main className="page-wrapper">

        {/* Logo */}
        <div className={`logo-wrapper ${animationPhase === 'login' ? 'shift-up' : ''}`}>
          <div className="icon-container">
            <div className="icon-ring" />
            <svg className="logo-icon" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00ff88"/>
                  <stop offset="100%" stopColor="#00cc6a"/>
                </linearGradient>
              </defs>
              {/* Hexagon outer ring */}
              <polygon
                points="36,4 64,20 64,52 36,68 8,52 8,20"
                stroke="url(#ng)" strokeWidth="1.5" fill="none"
                filter="url(#glow)" opacity="0.6"
              />
              {/* Inner hexagon */}
              <polygon
                points="36,14 56,25 56,47 36,58 16,47 16,25"
                stroke="url(#ng)" strokeWidth="1" fill="rgba(0,255,136,0.04)"
                opacity="0.5"
              />
              {/* Flow arrows / inflow symbol */}
              <path
                d="M24 36 L32 28 L32 33 L40 33 L40 39 L32 39 L32 44 Z"
                fill="url(#ng)" filter="url(#glow)"
              />
              {/* Right stream lines */}
              <line x1="42" y1="30" x2="50" y2="30" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              <line x1="42" y1="36" x2="52" y2="36" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
              <line x1="42" y1="42" x2="50" y2="42" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>

          <div className="logo-text">InflowOS</div>
          <div className="logo-sub">Operational Intelligence Platform</div>
          <div className="divider-line" />
        </div>

        {/* Login Card */}
        {animationPhase === 'login' && (
          <div className={`login-card visible card-relative`}>
            <div className="card-corner card-corner-tl" />
            <div className="card-corner card-corner-tr" />
            <div className="card-corner card-corner-bl" />
            <div className="card-corner card-corner-br" />

            <p className="card-headline">Welcome back</p>
            <p className="card-sub">Sign in to access your workspace</p>

            <div className="google-btn-wrapper">
              <GoogleLoginButton />
            </div>

            <div className="separator">
              <div className="sep-line" />
              <span className="sep-text">SECURE LOGIN</span>
              <div className="sep-line" />
            </div>

            <p className="footer-note">
              By signing in, you agree to our{' '}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </div>
        )}

      </main>
    </>
  );
}