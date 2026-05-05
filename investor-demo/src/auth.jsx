// Auth flow building blocks — consent intro screen, three branded provider
// sheets (Plaid Link / Puzzle OAuth / TransUnion soft-pull), the chat-inline
// books picker, and the slide-up overlay that combines them.

const { Easing, clamp } = window;
const {
  OJ_BRAND, OJ_INK, OJ_FG1, OJ_FG2, OJ_FG3,
  OJ_LIME, OJ_LIME_SOFT, OJ_BORDER, OJ_BORDER_STRONG,
} = window;
const { PROVIDERS, OJTile } = window;

// ─── OJ ↔ Provider consent intro ─────────────────────────────────────────────
function ConsentScreen({ providerKey, scopeLines, t }) {
  const Provider = PROVIDERS[providerKey];
  const introT = clamp(t / 0.5, 0, 1);
  const scale = 0.92 + 0.08 * Easing.easeOutBack(introT);
  const op = Easing.easeOutCubic(introT);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff',
      display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: 'linear-gradient(135deg, #f5e6ff 0%, #ffe5d6 50%, #ffd9d2 100%)',
        padding: '38px 24px 30px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14,
          opacity: op, transform: `scale(${scale})` }}>
          <OJTile size={56} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 6, height: 2, borderRadius: 1,
                background: i === 0 ? '#F9640B' : i === 1 ? '#FAB35E' : '#E0D9CA',
              }} />
            ))}
          </div>
          <Provider.LogoTile size={56} />
        </div>

        <div style={{
          marginTop: 18, fontFamily: 'Inter', fontSize: 17, fontWeight: 600,
          color: OJ_INK, letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.3,
          maxWidth: 260,
        }}>
          O.J. wants to connect<br/>to your {Provider.name}
        </div>
      </div>

      <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {scopeLines.map((line, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 99, background: '#f4f1ec',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {i === 0 ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 L4 6 v6 c0 5 3 9 8 10 c5 -1 8 -5 8 -10 V6 z M9 12 l2 2 l4 -4"
                    stroke={OJ_FG2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="15" r="4" stroke={OJ_FG2} strokeWidth="2" />
                  <path d="M12 12 L20 4 M17 4 H20 V7 M16 8 l2 2" stroke={OJ_FG2} strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: OJ_FG1,
              lineHeight: 1.5, paddingTop: 6 }}>
              {line}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 18px 16px' }}>
        <div style={{
          padding: '13px 16px', background: OJ_INK, color: '#fff',
          borderRadius: 12, textAlign: 'center',
          fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          Continue <span>→</span>
        </div>
        <div style={{
          marginTop: 10, fontFamily: 'Inter', fontSize: 11, color: OJ_FG2,
          textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          Secured by
          <img src="assets/juice-box.png" alt="" style={{ width: 14, height: 14, objectFit: 'contain' }} />
          <span style={{ fontWeight: 600, color: OJ_INK }}>O.J.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Plaid Link sheet — picker → password → success ─────────────────────────
function PlaidLinkSheet({ t }) {
  const stage = t < 1.4 ? 'pick' : t < 2.8 ? 'creds' : 'done';
  const stageT = t < 1.4 ? t : t < 2.8 ? t - 1.4 : t - 2.8;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff',
      display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '14px 16px 12px', borderBottom: '1px solid #eee',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ width: 18, fontFamily: 'Inter', fontSize: 18, color: OJ_INK }}>
          {stage !== 'pick' && stage !== 'done' ? '←' : ''}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 32 32">
            <circle cx="6" cy="16" r="3" fill="#000" />
            <circle cx="16" cy="6" r="3" fill="#000" />
            <circle cx="16" cy="26" r="3" fill="#000" />
            <circle cx="26" cy="16" r="3" fill="#000" />
          </svg>
          <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#000', letterSpacing: '0.02em' }}>
            PLAID
          </span>
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 18, color: OJ_FG3 }}>✕</div>
      </div>

      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {stage === 'pick' && (
          <>
            <div style={{ fontFamily: 'Inter', fontSize: 19, fontWeight: 700, color: OJ_INK, letterSpacing: '-0.02em' }}>
              Select your bank
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: OJ_FG2, marginTop: 5, lineHeight: 1.45 }}>
              Log in to securely link your account to this application.
            </div>
            <div style={{
              marginTop: 14, padding: '10px 12px',
              background: '#f6f6f8', borderRadius: 10,
              fontFamily: 'Inter', fontSize: 13, color: OJ_INK,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: OJ_FG3 }}>🔍</span>
              chase business
              <span style={{ color: OJ_BRAND, opacity: stageT % 1 < 0.5 ? 1 : 0 }}>|</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 14 }}>
              {[
                { name: 'Chase Business', sub: 'chase.com', tap: stageT > 0.55 },
                { name: 'Chase Personal', sub: 'chase.com' },
                { name: 'Chase Sapphire', sub: 'chase.com' },
              ].map((b, i) => (
                <div key={i} style={{
                  padding: '12px 4px', display: 'flex', alignItems: 'center', gap: 12,
                  borderBottom: '1px solid #f1f1f3',
                  background: b.tap ? '#fff8f3' : 'transparent',
                  borderRadius: b.tap ? 8 : 0,
                  paddingLeft: b.tap ? 10 : 4, paddingRight: b.tap ? 10 : 4,
                  transition: 'all 200ms',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 99, background: '#117ACA',
                    color: '#fff', fontFamily: 'Inter', fontWeight: 800, fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>C</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: OJ_INK }}>{b.name}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 11, color: OJ_FG2, marginTop: 1 }}>{b.sub}</div>
                  </div>
                  <div style={{ color: OJ_FG3, fontSize: 16 }}>›</div>
                </div>
              ))}
            </div>
          </>
        )}

        {stage === 'creds' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 99, background: '#117ACA',
                color: '#fff', fontFamily: 'Inter', fontWeight: 800, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>C</div>
              <div>
                <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: OJ_INK }}>Chase Business</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: OJ_FG2 }}>chase.com</div>
              </div>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 17, fontWeight: 700, color: OJ_INK, marginTop: 18, letterSpacing: '-0.02em' }}>
              Enter your password
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: OJ_FG2, marginTop: 4, lineHeight: 1.45 }}>
              Log in to securely re-link your account.<br/>User ID: <span style={{ color: OJ_INK, fontWeight: 500 }}>cindy•••••</span>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: OJ_FG2, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</div>
              <div style={{
                marginTop: 5, padding: '10px 12px', borderRadius: 8,
                border: '1.5px solid '+(stageT > 0.05 ? OJ_BRAND : '#ddd'),
                background: '#fff',
                fontFamily: 'Inter', fontSize: 14, color: OJ_INK,
                display: 'flex', alignItems: 'center', gap: 4,
                boxShadow: stageT > 0.05 ? '0 0 0 3px rgba(249,100,11,0.12)' : 'none',
              }}>
                {(() => {
                  const dots = clamp(Math.floor((stageT - 0.05) * 14), 0, 10);
                  return '•'.repeat(dots);
                })()}
                <span style={{ color: OJ_BRAND, opacity: stageT % 0.4 < 0.2 ? 1 : 0 }}>|</span>
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{
              padding: '13px 16px',
              background: stageT > 0.85 ? '#000' : '#9aa0a8', color: '#fff',
              borderRadius: 12, textAlign: 'center',
              fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
              transition: 'background 200ms',
            }}>{stageT > 0.85 ? 'Signing in…' : 'Continue'}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: OJ_FG2,
              textAlign: 'center', marginTop: 12 }}>
              Log in with different credentials
            </div>
          </>
        )}

        {stage === 'done' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{
              width: 76, height: 76, borderRadius: 99, background: OJ_LIME_SOFT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 10px rgba(117,185,40,0.10)',
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M5 12 l4 4 l10 -10" stroke={OJ_LIME} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 19, fontWeight: 700, color: OJ_INK, marginTop: 18, letterSpacing: '-0.02em' }}>
              Success!
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: OJ_FG2, marginTop: 8, maxWidth: 240, lineHeight: 1.5 }}>
              Your Chase Business account has<br/>successfully been linked.
            </div>
            <div style={{ flex: 1 }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Puzzle.io OAuth bounce ─────────────────────────────────────────────────
function PuzzleAuthSheet({ t }) {
  const stage = t < 1.0 ? 'auth' : 'done';
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff',
      display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '14px 16px 12px', borderBottom: '1px solid #eee',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ width: 18 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <PROVIDERS.puzzle.LogoTile size={20} />
          <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#7F56D9', letterSpacing: '-0.01em' }}>
            Puzzle
          </span>
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 18, color: OJ_FG3 }}>✕</div>
      </div>

      {stage === 'auth' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PROVIDERS.puzzle.LogoTile size={48} />
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 17, fontWeight: 700, color: OJ_INK, marginTop: 18, letterSpacing: '-0.02em' }}>
            Signing you in
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: OJ_FG2, marginTop: 6, textAlign: 'center', maxWidth: 240, lineHeight: 1.5 }}>
            Authorizing O.J. to read your books
          </div>
          <div style={{ marginTop: 22, display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: 99, background: '#7F56D9',
                animation: 'oj-typing 1s infinite', animationDelay: (i*0.15)+'s',
              }} />
            ))}
          </div>
          <div style={{ marginTop: 28, padding: '10px 14px', background: '#faf6ff',
            borderRadius: 10, fontFamily: 'Inter', fontSize: 11, color: '#5d3eb0',
            display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🔒</span> cindysflowers@puzzle.io
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 22 }}>
          <div style={{
            width: 76, height: 76, borderRadius: 99, background: OJ_LIME_SOFT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 10px rgba(117,185,40,0.10)',
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M5 12 l4 4 l10 -10" stroke={OJ_LIME} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 19, fontWeight: 700, color: OJ_INK, marginTop: 18, letterSpacing: '-0.02em' }}>
            Books linked
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: OJ_FG2, marginTop: 8, maxWidth: 240, lineHeight: 1.5 }}>
            P&L, balance sheet, and cash flow shared with O.J.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TransUnion soft-pull sheet ─────────────────────────────────────────────
function TUAuthSheet({ t }) {
  const stage = t < 1.0 ? 'verify' : 'done';
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff',
      display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '14px 16px 12px', borderBottom: '1px solid #eee',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ width: 18 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 800, color: '#003F7D', letterSpacing: '-0.01em' }}>
            TransUnion
          </span>
          <div style={{ width: 14, height: 2, background: '#E31E2D', borderRadius: 1 }} />
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 18, color: OJ_FG3 }}>✕</div>
      </div>

      {stage === 'verify' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 22 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 17, fontWeight: 700, color: OJ_INK, letterSpacing: '-0.02em' }}>
            Verify your identity
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: OJ_FG2, marginTop: 5, lineHeight: 1.5 }}>
            We'll do a soft credit check. This won't impact your score.
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { k: 'Cindy Reyes', sub: 'Full legal name' },
              { k: '•••-••-4821', sub: 'Last 4 of SSN' },
              { k: '742 Bergen St, Brooklyn', sub: 'Address' },
            ].map((f, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 10,
                border: '1px solid #ddd', background: '#fff',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 99, background: '#003F7D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12 l4 4 l10 -10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: OJ_INK }}>{f.k}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, color: OJ_FG2, marginTop: 1 }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            padding: '13px 16px', background: '#003F7D', color: '#fff',
            borderRadius: 12, textAlign: 'center',
            fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
          }}>Run soft pull</div>
          <div style={{ fontFamily: 'Inter', fontSize: 10, color: OJ_FG3,
            textAlign: 'center', marginTop: 8 }}>
            Soft inquiry · No impact to your credit score
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 22 }}>
          <div style={{
            width: 76, height: 76, borderRadius: 99, background: OJ_LIME_SOFT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 10px rgba(117,185,40,0.10)',
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M5 12 l4 4 l10 -10" stroke={OJ_LIME} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 19, fontWeight: 700, color: OJ_INK, marginTop: 18, letterSpacing: '-0.02em' }}>
            Credit linked
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: OJ_FG2, marginTop: 8, maxWidth: 240, lineHeight: 1.5 }}>
            Soft pull complete. No impact to your score.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Inline books picker (Xero / QuickBooks / Puzzle) ───────────────────────
function BooksPicker({ t, appearAt, pickAt }) {
  const op = clamp((t - appearAt) / 0.35, 0, 1);
  if (op <= 0) return null;
  const opts = [
    { key: 'xero',     label: 'Xero',       sub: 'Cloud books' },
    { key: 'qb',       label: 'QuickBooks', sub: 'Most common' },
    { key: 'puzzle',   label: 'Puzzle',     sub: 'Modern · AI books' },
  ];
  return (
    <div style={{
      opacity: op, transform: `translateY(${(1-op)*8}px)`,
      display: 'flex', flexDirection: 'column', gap: 6,
      margin: '6px 0 8px', paddingLeft: 32,
    }}>
      {opts.map((o) => {
        const isPicked = o.key === 'puzzle';
        const showPick = t > pickAt - 0.05;
        const fade = !isPicked && showPick;
        return (
          <div key={o.key} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 11px',
            background: '#fff',
            border: '1.5px solid '+(isPicked && showPick ? OJ_BRAND : OJ_BORDER),
            borderRadius: 10,
            boxShadow: isPicked && showPick ? '0 0 0 3px rgba(249,100,11,0.14)' : 'none',
            opacity: fade ? 0.4 : 1,
            transition: 'all 280ms',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: o.key === 'xero' ? '#13B5EA' :
                          o.key === 'qb' ? '#2CA01C' : OJ_BRAND,
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Inter', fontWeight: 800, fontSize: 11,
            }}>{o.label[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Inter', fontSize: 12.5, fontWeight: 600, color: OJ_INK }}>
                {o.label}
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: OJ_FG2, marginTop: 1 }}>
                {o.sub}
              </div>
            </div>
            {isPicked && showPick && (
              <div style={{
                fontFamily: 'Inter', fontSize: 10, color: OJ_BRAND,
                fontWeight: 700, letterSpacing: '0.08em',
              }}>SELECTED</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Slide-up auth overlay (consent + provider sheet, then dismiss) ─────────
function AuthOverlay({ provider, t, startAt, endAt, scopeLines }) {
  if (t < startAt - 0.5 || t > endAt + 0.5) return null;
  const slideIn  = clamp((t - startAt) / 0.4, 0, 1);
  const slideOut = clamp((t - endAt) / 0.35, 0, 1);
  const visible  = slideIn - slideOut;
  if (visible <= 0.001) return null;
  const ty = (1 - Easing.easeOutCubic(slideIn)) * 460
           + Easing.easeInCubic(slideOut) * 460;

  const overlayT   = t - startAt;
  const consentDur = 1.8;
  const inConsent  = overlayT < consentDur;
  const authT      = overlayT - consentDur;

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: '88%', background: '#fff',
      borderTopLeftRadius: 22, borderTopRightRadius: 22,
      transform: `translateY(${ty}px)`,
      boxShadow: '0 -16px 36px rgba(20,26,47,0.20)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {inConsent ? (
        <ConsentScreen providerKey={provider} scopeLines={scopeLines} t={overlayT} />
      ) : (
        <>
          {provider === 'plaid'      && <PlaidLinkSheet  t={authT} />}
          {provider === 'puzzle'     && <PuzzleAuthSheet t={authT} />}
          {provider === 'transunion' && <TUAuthSheet     t={authT} />}
        </>
      )}
    </div>
  );
}

Object.assign(window, {
  ConsentScreen, PlaidLinkSheet, PuzzleAuthSheet, TUAuthSheet,
  BooksPicker, AuthOverlay,
});
