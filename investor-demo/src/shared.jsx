// Shared visual primitives for the O.J. demo.
// Phone frame, mac window chrome, panels, OJ avatar, easings.

const OJ_BRAND = '#F9640B';
const OJ_BRAND_HOVER = '#be4a06';
const OJ_LIME = '#75B928';
const OJ_LIME_SOFT = '#ecfce2';
const OJ_ICE = '#7FC8D6';
const OJ_HONEY = '#FAB35E';
const OJ_INK = '#141A2F';
const OJ_INK_2 = '#1a2140';
const OJ_PAPER = '#FAF8F5';
const OJ_BORDER = '#EAE6DE';
const OJ_BORDER_STRONG = '#d3cfc1';
const OJ_FG1 = '#3D4852';
const OJ_FG2 = '#6b7480';
const OJ_FG3 = '#9aa0a8';
const OJ_BRAND_SOFT = '#ffe9de';

// ---------- Phone frame ----------
function PhoneFrame({ x = 0, y = 0, scale = 1, children, style = {} }) {
  const W = 360, H = 740;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: W, height: H,
      transform: `scale(${scale})`, transformOrigin: 'top left',
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: '#0c0d10',
        borderRadius: 48,
        padding: 10,
        boxShadow: '0 30px 80px rgba(20,26,47,0.35), 0 8px 20px rgba(20,26,47,0.18), inset 0 0 0 2px rgba(255,255,255,0.05)',
      }}>
        <div style={{
          position: 'absolute', inset: 10,
          background: '#fff',
          borderRadius: 40,
          overflow: 'hidden',
        }}>
          {/* Notch / dynamic island */}
          <div style={{
            position: 'absolute', top: 10, left: '50%',
            transform: 'translateX(-50%)',
            width: 110, height: 28, background: '#0c0d10', borderRadius: 14, zIndex: 5,
          }} />
          {/* Status bar */}
          <div style={{
            position: 'absolute', top: 14, left: 24, right: 24, zIndex: 4,
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: OJ_INK,
          }}>
            <span>9:41</span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 11 }}>
              <span>●●●●</span>
              <span>5G</span>
              <span style={{ display: 'inline-block', width: 22, height: 11, border: '1.4px solid '+OJ_INK, borderRadius: 3, position: 'relative' }}>
                <span style={{ position:'absolute', inset: 1, width: 16, background: OJ_INK, borderRadius: 1 }} />
              </span>
            </span>
          </div>
          <div style={{ position: 'absolute', inset: 0, paddingTop: 50 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Mac window chrome ----------
function MacWindow({ x, y, w, h, title, children, scale = 1, style = {} }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: w, height: h,
      transform: `scale(${scale})`, transformOrigin: 'top left',
      borderRadius: 14,
      background: '#fff',
      boxShadow: '0 30px 80px rgba(20,26,47,0.18), 0 8px 24px rgba(20,26,47,0.10)',
      border: '1px solid '+OJ_BORDER,
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        height: 36, background: '#f4f1ec', borderBottom: '1px solid '+OJ_BORDER,
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
      }}>
        <div style={{ width: 11, height: 11, borderRadius: 99, background: '#ff5f57' }} />
        <div style={{ width: 11, height: 11, borderRadius: 99, background: '#febc2e' }} />
        <div style={{ width: 11, height: 11, borderRadius: 99, background: '#28c840' }} />
        <div style={{
          flex: 1, textAlign: 'center', fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: OJ_FG2,
          letterSpacing: '-0.01em',
        }}>
          {title}
        </div>
        <div style={{ width: 36 }} />
      </div>
      <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 36px)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ---------- OJ avatar (juice box image with optional pulse) ----------
function OJAvatarImg({ size = 32, pulse = false }) {
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      borderRadius: 9999,
      background: 'linear-gradient(135deg, '+OJ_BRAND+', '+OJ_BRAND_HOVER+')',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: pulse ? '0 0 0 0 rgba(249,100,11,0.4)' : 'none',
      animation: pulse ? 'oj-pulse 1.6s infinite' : 'none',
    }}>
      <span style={{
        color: '#fff', fontFamily: 'Inter', fontWeight: 800, fontSize: size * 0.4, letterSpacing: '-0.04em',
      }}>OJ</span>
      {pulse && <span style={{
        position: 'absolute', bottom: -1, right: -1,
        width: size * 0.28, height: size * 0.28,
        borderRadius: 9999, background: OJ_LIME, border: '2px solid #fff',
      }} />}
    </div>
  );
}

// ---------- Caption / camera title ----------
function Caption({ children, x, y, maxWidth = 480, align = 'left' }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, maxWidth,
      textAlign: align,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {children}
    </div>
  );
}

// Eyebrow + title pair used over scenes
function SceneTitle({ eyebrow, title, x, y, color = OJ_INK, maxWidth = 640 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, maxWidth,
      fontFamily: 'Inter, system-ui, sans-serif', color,
    }}>
      <div style={{
        fontWeight: 700, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: OJ_BRAND, marginBottom: 10,
      }}>{eyebrow}</div>
      <div style={{
        fontWeight: 600, fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1.05, color,
      }}>{title}</div>
    </div>
  );
}

// Channel pill — "in-app" / "sms" / "email" indicator
function ChannelPill({ channel, x, y }) {
  const map = {
    'in-app': { label: 'In-app',  bg: OJ_BRAND_SOFT, fg: '#853203', dot: OJ_BRAND },
    'sms':    { label: 'SMS',     bg: '#eef4f6',     fg: '#33545b', dot: OJ_ICE },
    'email':  { label: 'Email',   bg: OJ_LIME_SOFT,  fg: '#284408', dot: OJ_LIME },
    'push':   { label: 'Push',    bg: '#fff2e0',     fg: '#714b16', dot: OJ_HONEY },
    'voice':  { label: 'Voice',   bg: '#eff0f8',     fg: '#2d375c', dot: '#697bbc' },
    'data':   { label: 'Data',    bg: '#eef4f6',     fg: '#33545b', dot: OJ_ICE },
  };
  const c = map[channel] || map['in-app'];
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 12px',
      background: c.bg, color: c.fg,
      fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase',
      borderRadius: 9999,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: c.dot, boxShadow: '0 0 0 3px '+c.bg }} />
      {c.label}
    </div>
  );
}

// ---------- Style block injected once ----------
function GlobalStyles() {
  return (
    <style>{`
      @keyframes oj-pulse {
        0% { box-shadow: 0 0 0 0 rgba(249,100,11,0.45); }
        70% { box-shadow: 0 0 0 14px rgba(249,100,11,0); }
        100% { box-shadow: 0 0 0 0 rgba(249,100,11,0); }
      }
      @keyframes oj-typing {
        0%,80%,100% { opacity: 0.3; transform: translateY(0); }
        40% { opacity: 1; transform: translateY(-3px); }
      }
      @keyframes oj-shimmer-bg {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes oj-bg-bloom {
        0%,100% { transform: translate(0,0); }
        50% { transform: translate(20px, -10px); }
      }
    `}</style>
  );
}

Object.assign(window, {
  OJ_BRAND, OJ_BRAND_HOVER, OJ_LIME, OJ_LIME_SOFT, OJ_ICE, OJ_HONEY, OJ_INK, OJ_INK_2,
  OJ_PAPER, OJ_BORDER, OJ_BORDER_STRONG, OJ_FG1, OJ_FG2, OJ_FG3, OJ_BRAND_SOFT,
  PhoneFrame, MacWindow, OJAvatarImg, Caption, SceneTitle, ChannelPill, GlobalStyles,
});
