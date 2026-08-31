# Turnstile Layout Investigation

> **STATUS: HISTORICAL INVESTIGATION — Completed 2026-08-12.** This investigation documented Turnstile layout behavior at that time. Current Turnstile configuration and sizing rules are documented in [FUTURE_MAINTENANCE.md](./FUTURE_MAINTENANCE.md) (auth rules section) and the codebase itself. Some technical details about package sizing behavior remain useful reference, but the investigation is not current architecture.

> **Investigation date:** 2026-08-12. Scope: `/contact` and `/signup`; read-only application/package trace. No application code was changed for this investigation.

> **Confidence levels noted:** High for route/card geometry and package outer sizing; Medium for exact real-device overflow cause (Cloudflare iframe is external to package source). The remaining uncertainty about iframe dimensions and runtime style mutations requires live browser verification.

---

## 1. Affected routes

| Route | Turnstile caller | Form/card shell |
|---|---|---|
| `/contact` | `app/(public)/contact/ContactClient.tsx` | `ContactClient` → `Card` enquiry card → `<form>` |
| `/signup` | `app/(auth)/signup/SignupForm.tsx` | `SignupClient` → `m.div` → `Card` → `SignupForm` |

The Contact SEO card is a separate sibling rendered by `contact/page.tsx`. Its spacing does not participate in the Turnstile card’s width calculation.

## 2. Complete component/file map

### Shared root

`app/layout.tsx`

```text
html
└─ body.font-body.relative.min-h-dvh.flex.flex-col.overflow-x-hidden
   └─ Providers
      └─ main.flex-1.pt-[7.5rem].pb-28.md:pb-0.space-y-6.md:space-y-10
         ├─ /contact page or /signup page
         └─ (footer)
```

Important root behavior:

- Tailwind preflight applies `box-sizing: border-box` to elements, including borders and padding in declared widths.
- `body` has `overflow-x-hidden`. This masks page-level horizontal overflow in the browser; it does not make an oversized child fit.
- The `main` spacing is vertical only (`space-y-*`); it does not create horizontal width.
- Fixed navbar/marquee are outside the route content and do not constrain either card.

### `/contact`

```text
/contact page
└─ ContactClient
   └─ section.w-full
      └─ div.mx-auto.max-w-7xl.px-4.sm:px-6.pt-10.pb-12.sm:pb-16.lg:pt-20
         └─ div.grid.w-full.gap-8.lg:grid-cols-2
            └─ div.group.min-w-0
               └─ Card.h-full
                  ├─ default Card p-6
                  ├─ SectionHeading
                  └─ form.mt-6.grid.gap-4
                     └─ TurnstileField(options.size="flexible")
                        └─ div.w-full.min-w-0
                           └─ div.flex.w-full.min-w-0.justify-center
                              └─ Turnstile
                                 └─ div#cf-turnstile (package-generated)
                                    └─ Cloudflare-created iframe (runtime)
```

At mobile widths the Contact grid has one column because `lg:grid-cols-2` starts at 1024px. At desktop it has two equal grid tracks; the outer route container is still capped by `max-w-7xl`.

Other Contact constraints:

- `Card` has `relative overflow-hidden`, `border`, and default `p-6`.
- The form is a block grid with `w` unconstrained, so it fills the card content box.
- Input/textarea classes use `w-full`, padding `px-4`, `py-3`, and borders. They do not establish a wider intrinsic width.
- The two-button row is `grid grid-cols-2`; buttons have `min-w-0 w-full`, so it is not the Turnstile width source.
- The old Contact `matchMedia` compact/flexible selection has been removed. The only current sizing decision is inside `TurnstileField`.
- `ContactClient` no longer has section-level `overflow-hidden`; `Card` still clips its own contents through `overflow-hidden`.

### `/signup`

```text
/signup page
└─ SignupClient
   └─ section.relative.min-h-[calc(100dvh-7.5rem)].overflow-hidden
      └─ div.mx-auto.grid.max-w-7xl.px-4.sm:px-6.py-10
         └─ m.div.w-full.max-w-2xl.mx-auto.lg:mx-0
            └─ Card (class adds px-6 py-5; md:p-10; lg:px-8 lg:py-7)
               └─ div.relative.z-10
                  └─ div.mt-4.lg:mt-3
                     └─ Suspense
                        └─ SignupForm
                           └─ form.mx-auto.mt-8.flex.w-full.max-w-none.flex-col.gap-5
                              └─ TurnstileField(options.theme="auto")
                                 └─ div.w-full.min-w-0
                                    └─ div.flex.w-full.min-w-0.justify-center
                                       └─ Turnstile
                                          └─ div#cf-turnstile (package-generated)
                                             └─ Cloudflare-created iframe (runtime)
```

At mobile widths the Signup outer grid is one column. `m.div` is `w-full`, capped by `max-w-2xl`; `mx-auto` centers it. The Card therefore receives the full available route-column width and its horizontal padding reduces the Turnstile field’s available content width.

Signup-specific overflow masking:

- `SignupClient`’s section is `overflow-hidden`.
- `Card` is also `overflow-hidden`.
- `body` is `overflow-x-hidden`.

These rules can hide evidence of a child overflow; they do not correct the child’s intrinsic size.

## 3. Shared `TurnstileField` behavior

Current file: `components/public/ui/TurnstileField.tsx`.

The component renders two ordinary block/flex wrappers:

```text
div.w-full.min-w-0                  // outer field block
└─ div.flex.w-full.min-w-0.justify-center
   └─ <Turnstile options={{...options, size: widgetSize}} />
```

The inner field reserves:

- `min-h-[140px]` when `widgetSize === "compact"`;
- `min-h-[65px]` for normal/flexible render mode;
- no explicit minimum height for invisible/execute/interaction-only cases.

The wrapper has no explicit `max-width`, no negative margin, no transform, no CSS containment, and no overflow rule.

JavaScript behavior:

1. Initial state calls `getResponsiveSize(requestedSize, 0, ...)`.
2. For normal/flexible requests, width `0` selects `compact`.
3. `useLayoutEffect` measures `field.getBoundingClientRect().width`.
4. It selects compact below 300px; otherwise it selects the requested size.
5. A `ResizeObserver` repeats that measurement when the wrapper width changes.
6. Changing `size` changes the package options object. The installed package then cleans up and re-renders its widget because its render-parameter memo/effect depends on size.

This means the abstraction is not a pure reservation wrapper: it can intentionally transition from compact to normal/flexible after layout measurement. That transition is a potential layout-shift boundary.

## 4. Actual installed package sizing behavior

Installed package: `@marsidev/react-turnstile@1.4.1`. Source: `node_modules/@marsidev/react-turnstile/dist/index.js`; typings: `dist/index.d.ts`.

The package’s internal style map is:

| `options.size` | Inline style applied to package’s outer `<div>` |
|---|---|
| `normal` | `width: 300px; height: 65px` |
| `compact` | `width: 150px; height: 140px` |
| `flexible` | `min-width: 300px; width: 100%; height: 65px` |
| `invisible` | `width: 0; height: 0; overflow: hidden` |

The package maps `options.size` to this style before calling Cloudflare. The package’s typings explicitly describe flexible as “100% width (min: 300px) x 65px”. Compact is explicitly 150×140; it is not documented or implemented as a fluid-width mode.

### React/package wrapper dimensions

The package component itself renders a `div` (default `as="div"`) with id `cf-turnstile`. Its inline `style` is the package style map above, merged with any caller `style` (the current `TurnstileField` deliberately omits/does not pass a caller style).

The SSR HTML observed from the production server for both routes is:

```html
<div class="w-full min-w-0">
  <div class="flex w-full min-w-0 justify-center min-h-[140px]">
    <div id="cf-turnstile" style="width:150px;height:140px"></div>
  </div>
</div>
```

That is the pre-Cloudflare DOM. There is no iframe in the package’s SSR output.

### Turnstile container and iframe boundary

After the API script loads, the package executes:

```text
window.turnstile.render(u.current, renderParameters)
```

`u.current` is the `div#cf-turnstile`. The package does not create the iframe, does not set iframe CSS, and does not expose a CSS sizing hook for Cloudflare’s internal iframe. The iframe is inserted/mutated by the external Cloudflare script.

Consequences:

- No shadow DOM implementation or iframe CSS exists in the installed React package.
- The repository can prove the outer container’s inline dimensions, but cannot prove the final iframe’s computed width from package source alone.
- CSS `max-width` on the React wrapper would not necessarily shrink an iframe whose own inline/computed width is set by Cloudflare.
- The package’s `onWidgetLoad` callback fires after Cloudflare render, but current code does not measure the iframe or reconcile its dimensions.
- Cloudflare can mutate the target container during initialization/challenge state. This is the remaining unobserved runtime boundary requiring a real browser/devtools capture.

### Hydration and initialization differences

The current `TurnstileField` server/client sequence is:

```text
SSR: compact outer style (150×140) for all normal/flexible requests
↓ hydration/layout effect
available width measured
↓ if width >= 300
outer style/options change to normal or flexible
↓ package cleanup/re-render
Cloudflare script render inserts iframe
```

At widths below 300px, the state remains compact and there is no compact→normal transition. At widths above 300px, a compact→requested-size transition is expected before/around widget initialization. This is a real size change even when the final requested size mathematically fits.

## 5. Realistic width calculations

The following assumes the normal mobile route geometry visible in source and Tailwind preflight `border-box` sizing.

### Contact

At mobile, the route content container is `w-full px-4` (16px each side). The form card fills its one-column grid track. Card default horizontal padding is `p-6` = 24px each side.

| Viewport | Route/card outer width | Card content width available to form/Turnstile |
|---:|---:|---:|
| 320px | 288px | 240px |
| 360px | 328px | 280px |
| 375px | 343px | 295px |
| 390px | 358px | 310px |
| 430px | 398px | 350px |

Turnstile comparison:

| Viewport | Contact requested size | Measured decision | Package outer result |
|---:|---|---|---|
| 320 | flexible | compact | 150×140 |
| 360 | flexible | compact | 150×140 |
| 375 | flexible | compact | 150×140 |
| 390 | flexible | flexible | width 100%, **min-width 300px**, height 65px |
| 430 | flexible | flexible | width 100%, **min-width 300px**, height 65px |

The first deterministic width constraint in Contact is therefore the package’s 300px minimum for flexible mode versus the card’s 240/280/295px content box. The current field avoids that outer-container conflict by selecting compact. At 390/430, the available content width is at least 300px, so flexible can fit the outer container.

### Signup

Signup has the same `px-4` route column and the same mobile Card horizontal padding (`px-6`, overriding the Card primitive’s horizontal component while retaining 24px each side).

| Viewport | Route/card outer width | Card content width available to form/Turnstile |
|---:|---:|---:|
| 320px | 288px | 240px |
| 360px | 328px | 280px |
| 375px | 343px | 295px |
| 390px | 358px | 310px |
| 430px | 398px | 350px |

Signup passes no `size`, so the package default requested size is normal. The field’s logic still starts compact and changes to normal at measured width >=300px:

| Viewport | Initial field state | Post-measurement state | Package outer result |
|---:|---|---|---|
| 320 | compact | compact | 150×140 |
| 360 | compact | compact | 150×140 |
| 375 | compact | compact | 150×140 |
| 390 | compact | normal | 300×65 |
| 430 | compact | normal | 300×65 |

At 390px and 430px, the normal 300px outer widget fits inside 310px/350px of card content. At 320/360/375px, the current field does not select a normal 300px outer widget. Therefore the source-visible parent geometry alone does **not** explain a post-load width expansion at those three widths.

## 6. Exact source of expansion/overflow

### Proven facts

1. The package’s flexible outer container has an unavoidable `min-width:300px`.
2. The package’s normal outer container is exactly `300px` wide.
3. Contact’s and Signup’s mobile card content widths are 240/280/295/310/350px at the requested viewport widths.
4. The current `TurnstileField` selects compact below 300px and therefore prevents the package’s **outer React container** from demanding 300px at 320/360/375px.
5. The current field can still change from compact to normal/flexible at 390px/430px, causing a genuine outer-widget size transition.
6. The Cloudflare iframe is not generated by the package source and is not inspectable from the repository’s static DOM alone.

### What is not proven by this repository

The repository cannot, without a real hydrated browser session, identify the final iframe’s computed width, its internal minimum, or any runtime style mutation performed by Cloudflare. Therefore it is not defensible to claim that the current remaining real-device overflow is caused solely by the React wrapper.

### Most likely architectural boundary

The current evidence points to one of two runtime cases:

- **Iframe-owned overflow:** Cloudflare inserts an iframe wider than the compact outer container (or applies a minimum/inline width during challenge initialization). In that case Turnstile is exposing an iframe constraint; parent `min-w-0` and wrapper width cannot shrink the iframe. `Card`/section/body overflow rules can only clip/mask it.
- **Transition/layout-shift overflow:** At 390px/430px, `TurnstileField` changes compact→normal/flexible before/while Cloudflare initializes. If Cloudflare measures or mutates based on the transient compact/normal container, the widget can briefly establish a different intrinsic size. This is a field-state/hydration boundary, not a grid-column problem.

The source does **not** show a mobile grid min-content expansion chain (`Turnstile → card → grid`) at 320/360/375px because the field’s selected outer size is 150px. If a device shows card width expansion at those widths, the first changing element is almost certainly the Cloudflare-created iframe/runtime subtree or a browser-specific intrinsic sizing interaction not represented in the package source.

## 7. Contact-specific root cause

The Contact card is narrower than 300px internally at 320/360/375px. Flexible mode would be invalid for that content width because the package explicitly applies `min-width:300px`; this explains prior malformed/clipped behavior when flexible was used unconditionally.

Current field behavior avoids that outer minimum by switching to compact. Remaining malformed appearance can still occur if the Cloudflare iframe does not honor the 150px compact envelope or if `Card.overflow-hidden` clips the iframe. The form, textarea, button grid, and SEO sibling do not create a wider track in the mobile one-column layout.

The SEO card’s padding/Read More changes are in a separate sibling section and have no causal relationship to the Contact form card or Turnstile width.

## 8. Signup-specific root cause

The key source-visible size transition is:

```text
SSR/initial state: 150×140 compact
→ useLayoutEffect + ResizeObserver measurement
→ at 390/430 content width, requested normal becomes 300×65
→ package re-renders the widget because size is in its render dependencies
```

At 320/360/375, this transition does not occur; current source remains compact. Thus the reported “card fits before load, becomes wider after load” cannot be attributed to the current outer package style at those widths without a runtime DOM capture. The exact element to inspect on a device is `#cf-turnstile` and its first descendant iframe: record `getBoundingClientRect()`, computed `width/min-width`, inline styles, and the card/form rect before script, after `onWidgetLoad`, and after challenge display.

The Signup section/Card/body `overflow-hidden`/`overflow-x-hidden` can hide the symptom and must not be treated as proof that the card itself is the source.

## 9. Is `TurnstileField` architecturally correct?

It is directionally correct as a parent-width guard, but it is not a complete solution to the observed device problem:

- Correct: it uses package-supported sizes, avoids negative margins, uses `w-full min-w-0`, and avoids flexible mode below the package’s 300px minimum.
- Risky: it initializes every normal/flexible request as compact, then changes options after measurement. That creates a deliberate size/state transition and forces the package to remove/re-render its widget.
- Incomplete: it measures the React wrapper, not the Cloudflare-created iframe. The measured wrapper width is therefore not proof that the final widget fits.
- Incomplete: it reserves height but does not reserve/validate the final iframe’s runtime width/height.

The abstraction is not fundamentally useless, but it currently masks the actual package/iframe boundary and may introduce a hydration/measurement transition that needs to be evaluated before another CSS patch.

## 10. Correct fix target (diagnosis only)

The next engineer should target the first failing runtime element, in this order:

1. Capture hydrated DOM/computed geometry on real devices for `Card`, form, field wrappers, `#cf-turnstile`, and its iframe at 320/360/375/390/430-equivalent widths.
2. Determine whether the iframe’s width is greater than its package outer container, and whether it changes after `onWidgetLoad` or challenge state.
3. Determine whether compact and normal are being switched before Cloudflare render and whether that causes package cleanup/re-render.
4. Only then decide whether the fix belongs at the Turnstile option/state boundary, the iframe/container contract, or the parent layout.

## 11. Approaches that should not be used

- Do not add more `overflow-hidden`/`overflow-x-hidden` to hide the iframe.
- Do not use negative margins or hard-coded desktop widths.
- Do not assume `flexible` can shrink below 300px.
- Do not assume CSS `max-width:100%` on the React wrapper resizes a Cloudflare-owned iframe.
- Do not add another viewport breakpoint without measuring the actual field/iframe rect.
- Do not change CAPTCHA verification, callbacks, auth, server actions, or rate limits while diagnosing layout.
- Do not infer that the SEO card spacing is related to the Turnstile card.

## 12. Confidence and remaining verification

Confidence is **high** for the route/card geometry, package outer sizing, current field state machine, and the 300px first constraint. Confidence is **medium** for the exact real-device overflow cause because Cloudflare’s runtime iframe is external to the installed package and no browser binary/live challenge was available in this environment.

Required evidence to close the remaining uncertainty:

- real mobile DevTools DOM snapshot after Cloudflare initialization;
- computed styles and `getBoundingClientRect()` for `#cf-turnstile` and its iframe before/after load/challenge;
- confirmation whether the iframe is 150px compact, 300px normal, or another runtime width;
- confirmation whether the card width changes or only the iframe is clipped/overflows inside an unchanged card.
