// The three application scenes the deck references.
// Each one is `<PhoneSlot>`-only — no slide-side caption (that lives on the
// deck slide itself).
//
// Step 1 — Onboard + underwrite (38s): chat → bank/books/credit auth →
//          credit memo card.
// Step 2 — Notification (5s): lock screen lights up with the offer push.
// Step 3 — Offer page (11s): hero offer card + agent chat about alternatives.

const { Easing, clamp, interpolate, useSprite } = window;
const {
  OJ_BRAND, OJ_INK, OJ_PAPER, OJ_FG1, OJ_FG2, OJ_FG3,
  OJ_LIME, OJ_BORDER, OJ_HONEY,
} = window;
const {
  PhoneSlot, PhoneHeader, Bubble,
  AuthOverlay, BooksPicker,
  OJAvatarImg,
} = window;

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1 — Onboard + underwrite (38s)
// ═══════════════════════════════════════════════════════════════════════════
function Step1() {
  const { localTime: t } = useSprite();

  const consentScopes = {
    plaid: [
      'Only connect O.J. to providers you trust.',
      'O.J. will read 6 months of bank statements to underwrite your loan.',
    ],
    puzzle: [
      'Only connect O.J. to providers you trust.',
      'O.J. will read your P&L, balance sheet and cash flow.',
    ],
    transunion: [
      'Only connect O.J. to providers you trust.',
      'O.J. will run a soft credit pull. No impact to your score.',
    ],
  };

  const status =
    (t >= 6.0  && t < 11.5) ? 'Connecting your bank…' :
    (t >= 17.5 && t < 21.5) ? 'Connecting Puzzle…' :
    (t >= 24.5 && t < 28.8) ? 'Soft credit pull…' :
    (t >= 33.0)             ? 'Memo ready ✨' :
    'Online · Your AI broker';

  const scroll = interpolate(
    [0, 12, 16, 22, 29, 33, 38],
    [0, 40, 90, 170, 280, 480, 580],
    Easing.easeInOutCubic
  )(t);

  const memoOp = clamp((t - 33.0) / 0.5, 0, 1);

  return (
    <PhoneSlot>
      <div style={{ position: 'relative', height: '100%', background: OJ_PAPER,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <PhoneHeader status={status} />

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: -scroll,
            padding: '14px 14px 16px',
            display: 'flex', flexDirection: 'column', gap: 0,
          }}>
            <Bubble role="oj"   t={t} appearAt={0.4}
              text="Hey! I'm O.J. What are you looking to fund?" />
            <Bubble role="user" t={t} appearAt={2.0}
              text="Cindy's Flowers, Brooklyn. Need $250k for spring inventory." />

            {/* BANK */}
            <Bubble role="oj"   t={t} appearAt={4.0}
              text="Great. Let's start with your bank so I can see your cash position." />
            <Bubble role="oj"   t={t} appearAt={11.5}
              text="Got it — strong cash flow, no NSFs." />

            {/* BOOKS */}
            <Bubble role="oj"   t={t} appearAt={12.5}
              text="Now your books — where do you keep them?" />
            <BooksPicker t={t} appearAt={14.0} pickAt={15.5} />
            <Bubble role="user" t={t} appearAt={15.7}
              text="Puzzle." />
            <Bubble role="oj"   t={t} appearAt={16.5}
              text="Cool — connecting Puzzle now." />
            <Bubble role="oj"   t={t} appearAt={21.5}
              text="Books look healthy. 51% gross margin." />

            {/* CREDIT */}
            <Bubble role="oj"   t={t} appearAt={22.5}
              text="Last thing — a soft credit pull. No score impact." />
            <Bubble role="oj"   t={t} appearAt={28.8}
              text="742 FICO. You're in A- tier." />

            {/* WRAP */}
            <Bubble role="oj"   t={t} appearAt={29.8}
              text={<>All set. Cindy's Flowers · <strong>4.2× DSCR</strong> · 742 FICO · A- tier.</>} />
            <Bubble role="oj"   t={t} appearAt={31.5}
              text="Building your credit memo and shopping it to lenders now." />

            {memoOp > 0 && (
              <div style={{
                opacity: memoOp,
                transform: `translateY(${(1-memoOp)*10}px)`,
                marginTop: 8, marginLeft: 32,
                padding: '12px 14px',
                background: '#fff', border: '1px solid #FAD5BB', borderRadius: 14,
                boxShadow: '0 8px 22px rgba(249,100,11,0.15)',
              }}>
                <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase', color: OJ_BRAND }}>
                  Credit memo · ready
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 600,
                  color: OJ_INK, marginTop: 5, letterSpacing: '-0.02em' }}>
                  Cindy's Flowers · $250k WC
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: OJ_FG2,
                  marginTop: 6, lineHeight: 1.5 }}>
                  4.2× DSCR · 742 FICO · 6 yrs · Grade A-
                </div>
              </div>
            )}
          </div>
        </div>

        <AuthOverlay provider="plaid"      t={t} startAt={6.0}  endAt={11.0}
          scopeLines={consentScopes.plaid} />
        <AuthOverlay provider="puzzle"     t={t} startAt={17.5} endAt={21.0}
          scopeLines={consentScopes.puzzle} />
        <AuthOverlay provider="transunion" t={t} startAt={24.5} endAt={28.3}
          scopeLines={consentScopes.transunion} />
      </div>
    </PhoneSlot>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2 — Notification (5s): lock screen lights up with the offer push
// ═══════════════════════════════════════════════════════════════════════════
function Step2() {
  const { localTime } = useSprite();
  const pushOp = clamp((localTime - 0.6) / 0.4, 0, 1);
  const pushTy = (1 - Easing.easeOutBack(pushOp)) * -60;

  return (
    <PhoneSlot>
      <div style={{
        position: 'absolute', inset: 0, top: 0,
        background: 'linear-gradient(160deg, #1a2140 0%, #141A2F 50%, #511b01 100%)',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center',
          fontFamily: 'Inter', color: '#fff',
        }}>
          <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.8 }}>Tuesday, March 12</div>
          <div style={{ fontSize: 78, fontWeight: 200, letterSpacing: '-0.04em', marginTop: 4, lineHeight: 1 }}>
            9:42
          </div>
        </div>

        <div style={{
          position: 'absolute', top: 240, left: 14, right: 14,
          opacity: pushOp, transform: `translateY(${pushTy}px)`,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 20, padding: '12px 14px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
        }}>
          <OJAvatarImg size={36} pulse />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ fontWeight: 600, color: OJ_INK }}>O.J.</span>
              <span style={{ color: OJ_FG2 }}>now</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: OJ_INK, marginTop: 2 }}>
              Good news — your offer is in
            </div>
            <div style={{ fontSize: 12, color: OJ_FG1, marginTop: 3, lineHeight: 1.4 }}>
              Hi Cindy — I locked $250k at 8.9% APR, funds in 5 days. Tap to review.
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center',
          fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.6)',
        }}>
          swipe up to open
        </div>
      </div>
    </PhoneSlot>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3 — Offer page + agent chat (11s)
// ═══════════════════════════════════════════════════════════════════════════
function Step3() {
  const { localTime } = useSprite();

  const heroOp     = clamp((localTime - 0.2) / 0.5, 0, 1);
  const ojMsg1     = 1.0;
  const ojMsg2     = 2.6;
  const cindyMsg1  = 4.5;
  const ojMsg3     = 6.0;
  const altsAppear = 7.4;

  const scrollY = interpolate(
    [0, ojMsg2, cindyMsg1, ojMsg3, altsAppear],
    [0, 0, 40, 90, 170],
    Easing.easeInOutCubic
  )(localTime);

  return (
    <PhoneSlot>
      <div style={{ height: '100%', background: OJ_PAPER, display: 'flex', flexDirection: 'column' }}>
        <PhoneHeader status="Your offer" />

        {/* HERO offer card */}
        <div style={{
          margin: '14px 14px 0',
          opacity: heroOp,
          transform: `translateY(${(1-heroOp)*16}px) scale(${0.96 + heroOp*0.04})`,
          background: 'linear-gradient(160deg, #FFF7EE 0%, #FFEAD3 100%)',
          border: '1px solid #FAD5BB',
          borderRadius: 18, padding: '14px 16px',
          boxShadow: '0 12px 30px rgba(249,100,11,0.18)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 99, background: OJ_LIME,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: '#1d3308', fontWeight: 800,
            }}>✓</div>
            <div style={{ fontFamily: 'Inter', fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: OJ_BRAND }}>
              Locked offer · LendingClub
            </div>
          </div>
          <div style={{
            fontFamily: 'Inter', fontSize: 38, fontWeight: 600,
            letterSpacing: '-0.035em', color: OJ_INK,
            fontVariantNumeric: 'tabular-nums', marginTop: 6, lineHeight: 1,
          }}>
            $250,000
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 10,
            fontFamily: 'Inter', fontSize: 11, color: OJ_FG1 }}>
            <div><span style={{ fontWeight: 700, color: OJ_INK }}>8.9%</span> APR</div>
            <div><span style={{ fontWeight: 700, color: OJ_INK }}>36</span> mo</div>
            <div><span style={{ fontWeight: 700, color: OJ_INK }}>5 days</span> to fund</div>
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', marginTop: 12 }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: -scrollY,
            padding: '0 14px 18px', display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <Bubble role="oj" t={localTime} appearAt={ojMsg1}
              text="Here's what I picked for you." />
            <Bubble role="oj" t={localTime} appearAt={ojMsg2}
              text={<>LendingClub gave the lowest APR <em>and</em> the fastest funding. Your 4.2× DSCR + 742 FICO put you in their A- tier.</>} />
            <Bubble role="cindy" t={localTime} appearAt={cindyMsg1}
              text="What else did you see?" />
            <Bubble role="oj" t={localTime} appearAt={ojMsg3}
              text="Three other live offers — same memo, different lenders:" />

            {[
              { name: 'OnDeck',      apr: '9.4%',  fund: '3 days', note: 'faster, costs ~$1,100 more' },
              { name: 'Provide',     apr: '9.1%',  fund: '7 days', note: 'similar, slower funding' },
              { name: 'LendingTree', apr: '10.2%', fund: '4 days', note: 'higher APR, declined' },
            ].map((o, i) => {
              const at = altsAppear + i * 0.25;
              const op = clamp((localTime - at) / 0.35, 0, 1);
              return (
                <div key={o.name} style={{
                  opacity: op, transform: `translateY(${(1-op)*8}px)`,
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px',
                  background: '#fff', border: '1px solid '+OJ_BORDER,
                  borderRadius: 12,
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 7,
                    background: OJ_INK, color: OJ_HONEY,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Inter', fontWeight: 800, fontSize: 9.5,
                    letterSpacing: '-0.02em', flexShrink: 0,
                  }}>{o.name.slice(0,2).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 12.5, fontWeight: 600,
                        color: OJ_INK }}>{o.name}</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600,
                        color: OJ_FG1, fontVariantNumeric: 'tabular-nums' }}>
                        {o.apr} · {o.fund}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: OJ_FG2, marginTop: 2 }}>
                      {o.note}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          padding: '10px 12px 14px',
          borderTop: '1px solid '+OJ_BORDER, background: '#fff',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            flex: 1, padding: '9px 12px', borderRadius: 99,
            background: OJ_PAPER, border: '1px solid '+OJ_BORDER,
            fontFamily: 'Inter', fontSize: 12, color: OJ_FG3,
          }}>
            Ask O.J. anything…
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 99, background: OJ_BRAND,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14,
          }}>↑</div>
        </div>
      </div>
    </PhoneSlot>
  );
}

// Durations the rolling demo + standalone pages share
const DUR_STEP1 = 38;
const DUR_STEP2 = 5;
const DUR_STEP3 = 11;

Object.assign(window, { Step1, Step2, Step3, DUR_STEP1, DUR_STEP2, DUR_STEP3 });
