// Shared UI primitives used across all three steps.
// PhoneSlot is anchored at (40, 40) of a 440x820 stage — the phone fills the
// frame with comfortable padding, no slide-side caption.

const { Easing, clamp } = window;
const {
  OJAvatarImg, PhoneFrame,
  OJ_BRAND, OJ_INK, OJ_PAPER, OJ_FG1, OJ_FG2, OJ_FG3,
  OJ_LIME, OJ_LIME_SOFT, OJ_BORDER,
} = window;

// Stage dims — every page uses these. Phone is 360x740, +40px padding.
const STAGE_W = 440;
const STAGE_H = 820;
const PHONE_X = 40;
const PHONE_Y = 40;

function PhoneSlot({ children }) {
  return (
    <div style={{ position: 'absolute', left: PHONE_X, top: PHONE_Y }}>
      <PhoneFrame x={0} y={0}>
        {children}
      </PhoneFrame>
    </div>
  );
}

// Chat bubble — appears at `appearAt`, fades + slides up.
function Bubble({ role, text, t, appearAt }) {
  const op = clamp((t - appearAt) / 0.3, 0, 1);
  if (op <= 0) return null;
  const isOJ = role === 'oj';
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-end',
      flexDirection: isOJ ? 'row' : 'row-reverse',
      opacity: op, transform: `translateY(${(1-op)*8}px)`,
      marginBottom: 10,
    }}>
      {isOJ
        ? <OJAvatarImg size={26} />
        : <div style={{
            width: 26, height: 26, borderRadius: 99,
            background: '#d3cfc1', color: '#3f3d39',
            fontFamily: 'Inter', fontWeight: 700, fontSize: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>CL</div>}
      <div style={{
        maxWidth: 240, padding: '9px 12px',
        background: isOJ ? '#fff' : '#f4f1ec',
        border: isOJ ? '1px solid #FAD5BB' : '1px solid '+OJ_BORDER,
        borderRadius: isOJ ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
        fontFamily: 'Inter', fontSize: 13.5, lineHeight: 1.45, color: OJ_FG1,
      }}>
        {text}
      </div>
    </div>
  );
}

function PhoneHeader({ status }) {
  return (
    <div style={{
      padding: '10px 16px 12px',
      borderBottom: '1px solid '+OJ_BORDER,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <OJAvatarImg size={32} pulse />
      <div>
        <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: OJ_INK }}>O.J.</div>
        <div style={{ fontFamily: 'Inter', fontSize: 11, color: OJ_LIME, fontWeight: 500 }}>
          ● {status || 'Online'}
        </div>
      </div>
    </div>
  );
}

// Provider visual identities — used in both consent screens and provider rows
const PROVIDERS = {
  plaid: {
    name: 'Plaid', accent: '#000',
    LogoTile: ({ size = 56 }) => (
      <div style={{
        width: size, height: size, borderRadius: size * 0.22,
        background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width={size*0.55} height={size*0.55} viewBox="0 0 32 32">
          <circle cx="6" cy="16" r="3.2" fill="#000" />
          <circle cx="16" cy="6" r="3.2" fill="#000" />
          <circle cx="16" cy="26" r="3.2" fill="#000" />
          <circle cx="26" cy="16" r="3.2" fill="#000" />
          <path d="M6 16 L16 6 L26 16 L16 26 Z" stroke="#000" strokeWidth="1.6" fill="none" />
        </svg>
      </div>
    ),
  },
  puzzle: {
    name: 'Puzzle.io', accent: '#7F56D9',
    LogoTile: ({ size = 56 }) => (
      <div style={{
        width: size, height: size, borderRadius: size * 0.22,
        background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width={size*0.55} height={size*0.55} viewBox="0 0 32 32">
          <path d="M5 5 H14 V10 a3 3 0 0 0 4 0 V5 H27 V14 a3 3 0 0 1 0 4 H27 V27 H18 V22 a3 3 0 0 0 -4 0 V27 H5 V18 a3 3 0 0 1 0 -4 V5 Z"
            fill="#7F56D9" />
        </svg>
      </div>
    ),
  },
  transunion: {
    name: 'TransUnion', accent: '#003F7D',
    LogoTile: ({ size = 56 }) => (
      <div style={{
        width: size, height: size, borderRadius: size * 0.22,
        background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.95 }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: size*0.32, color: '#003F7D', letterSpacing: '-0.04em' }}>TU</div>
          <div style={{ width: size*0.5, height: 2, background: '#E31E2D', marginTop: 2, borderRadius: 1 }} />
        </div>
      </div>
    ),
  },
};

function OJTile({ size = 56 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: '#fff', boxShadow: '0 4px 14px rgba(249,100,11,0.18), 0 0 0 1px rgba(0,0,0,0.04)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4,
    }}>
      <img src="assets/juice-box.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
}

Object.assign(window, {
  STAGE_W, STAGE_H, PHONE_X, PHONE_Y,
  PhoneSlot, Bubble, PhoneHeader, PROVIDERS, OJTile,
});
