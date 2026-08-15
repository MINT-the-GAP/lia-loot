import { templateDocumentCandidates } from "./template-targets.ts"

const STYLE_ID = "lia-loot-highscore-style"

const CSS = `
lia-loot-secret-slide {
  display: none !important;
}

.loot-secret-slide-link:not(.loot-secret-slide-link--found),
.loot-secret-slide-row:not(.loot-secret-slide-row--found) {
  display: none !important;
}

.loot-secret-slide-link--found {
  display: block !important;
}

.loot-puzzle-slide-link--blocked,
.loot-puzzle-slide-row--blocked {
  display: none !important;
}

html.loot-secret-slide-discovering main.lia-slide__content,
html.loot-secret-slide-discovering .lia-pagination,
html.loot-secret-slide-discovering #lia-toc .lia-toc__content,
html.loot-secret-slide-discovering #lia-toc #lia-bm-toc5,
html.loot-secret-slide-discovering .loot-object-lock-button--local,
html.loot-secret-slide-blocked main.lia-slide__content,
html.loot-secret-slide-blocked .lia-pagination,
html.loot-secret-slide-blocked .loot-object-lock-button--local {
  visibility: hidden !important;
  pointer-events: none !important;
}

.loot-secret-slide-status {
  position: fixed;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loot-secret-slide-status--visible {
  z-index: 2100;
  top: 50%;
  left: 50%;
  width: min(30rem, calc(100vw - 2rem));
  height: auto;
  margin: 0;
  padding: 0.8rem 1rem;
  overflow: visible;
  clip: auto;
  transform: translate(-50%, -50%);
  white-space: normal;
  color: #f8fafc;
  background: #172033;
  border: 2px solid #54d5f5;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1.5rem rgba(8, 15, 28, 0.35);
  text-align: center;
  font: 700 0.95rem/1.4 system-ui, sans-serif;
}

html.loot-secret-slide-discovery-failed
  .loot-secret-slide-status--visible {
  border-color: #f87171;
}

.loot-achievement[hidden] {
  display: none !important;
}

.loot-achievement {
  position: fixed;
  z-index: 2147483000;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  width: min(22em, calc(100vw - 2em));
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #f7c948 transparent;
  font-size: 16px;
  pointer-events: auto;
}

.loot-achievement__card {
  position: relative;
  flex: 0 0 auto;
  min-height: 6rem;
  padding: 0.8rem 3.25rem 0.8rem 0.85rem;
  display: flex;
  align-items: center;
  color: #f8fafc;
  background: linear-gradient(145deg, #172033, #202c44);
  border: 3px solid #f7c948;
  border-radius: 0.45rem;
  box-shadow:
    5px 5px 0 #8b5b00,
    0 0.7rem 1.8rem rgba(8, 15, 28, 0.38);
  box-sizing: border-box;
  font-family: system-ui, sans-serif;
  pointer-events: auto;
  image-rendering: pixelated;
}

.loot-achievement__card--visible {
  animation: loot-achievement-in 240ms steps(5, end);
}

.loot-achievement__content {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.loot-achievement__graphic {
  width: 3.5rem;
  height: 3.5rem;
  flex: 0 0 auto;
  filter: drop-shadow(3px 3px 0 rgba(8, 15, 28, 0.5));
}

.loot-achievement__burst {
  fill: #6b4300;
}

.loot-achievement__burst-light {
  fill: #f7c948;
}

.loot-achievement__star {
  fill: #fff0a6;
}

.loot-achievement__text {
  min-width: 0;
}

.loot-achievement__eyebrow,
.loot-achievement__title,
.loot-achievement__message {
  margin: 0;
}

.loot-achievement__eyebrow {
  color: #f7c948;
  font: 850 0.68em/1.2 ui-monospace, "Cascadia Mono", monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loot-achievement__title {
  margin-top: 0.2rem;
  font-size: 1.05em;
  font-weight: 850;
  line-height: 1.2;
}

.loot-achievement__message {
  margin-top: 0.2rem;
  color: #dbe5f4;
  font-size: 0.84em;
  font-weight: 600;
  line-height: 1.35;
}

.loot-achievement__close {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  width: 44px;
  height: 44px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f8fafc;
  background: transparent;
  border: 0;
  border-radius: 0.25rem;
  font: 800 1.55rem/1 system-ui, sans-serif;
  cursor: pointer;
}

.loot-achievement__close:hover,
.loot-achievement__close:focus-visible {
  color: #172033;
  background: #f7c948;
  outline: 2px solid #fff0a6;
  outline-offset: -2px;
}

.loot-resource-bar {
  position: fixed;
  z-index: 1000;
  top: var(--loot-resource-top, 0px);
  left: 50%;
  width: max-content;
  max-width: calc(100vw - 1rem);
  min-height: 2.4rem;
  padding: 0.3rem 0.45rem;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.65rem;
  overflow: hidden;
  transform: translateX(-50%);
  color: #f8fafc;
  background: linear-gradient(90deg, #172033, #202c44);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-top: 0;
  border-radius: 0 0 0.85rem 0.85rem;
  box-shadow: 0 0.25rem 0.75rem rgba(8, 15, 28, 0.2);
  box-sizing: border-box;
  font: 700 0.95rem/1 system-ui, sans-serif;
}

.loot-resource-bar--empty {
  display: none;
}

.loot-resource {
  min-width: 4.25rem;
  padding: 0.25rem 0.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.22);
  font-variant-numeric: tabular-nums;
}

.loot-resource-icon {
  width: 1.35rem;
  height: 1.35rem;
  overflow: visible;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.loot-resource-icon--coins {
  fill: #f7c948;
  stroke: #9a6500;
  stroke-width: 1.8;
}

.loot-resource-icon--gems {
  fill: #54d5f5;
  stroke: #d7f7ff;
  stroke-width: 1.45;
}

.loot-resource-icon--energy {
  fill: #ffd43b;
  stroke: #7a3f00;
  stroke-width: 1.6;
}

.loot-resource--hidden {
  display: none;
}

.loot-resource-status {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loot-resource--insufficient {
  animation: loot-resource-insufficient 360ms ease-out;
}

.loot-key-inventory {
  position: relative;
  min-width: 0;
  min-height: 0;
  padding: 0;
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  gap: 0.2rem;
  background: none;
  border: 0;
  box-shadow: none;
  font: 700 0.78rem/1 system-ui, sans-serif;
}

.loot-key-inventory:focus-visible {
  outline: 3px solid #54d5f5;
  outline-offset: 2px;
}

.loot-key-inventory__list {
  min-width: 0;
  max-width: min(30rem, calc(100vw - 6rem));
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.18rem;
  overflow-x: auto;
  list-style: none;
  scrollbar-width: thin;
  overscroll-behavior-inline: contain;
}

.loot-key-inventory__item {
  width: 2.15rem;
  min-width: 2.15rem;
  height: 1.85rem;
  padding: 0.12rem 0.2rem;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 0.35rem;
  background: rgba(0, 0, 0, 0.22);
  box-sizing: border-box;
}

.loot-key-graphic.loot-key-inventory__icon {
  width: 1.85rem;
  height: 1.3rem;
  flex: 0 0 auto;
}

.loot-key-inventory__status {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loot-puzzle-inventory {
  min-width: 0;
  display: flex;
  align-items: center;
}

.loot-puzzle-inventory__list {
  min-width: 0;
  max-width: min(32rem, calc(100vw - 6rem));
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.22rem;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
}

.loot-puzzle-inventory__piece {
  width: 2.35rem;
  min-width: 2.35rem;
  height: 2.1rem;
  padding: 0.08rem;
  display: inline-grid;
  place-items: center;
  color: inherit;
  background: rgba(0, 0, 0, 0.22);
  border: 2px solid transparent;
  border-radius: 0.35rem;
  box-sizing: border-box;
  cursor: pointer;
}

.loot-puzzle-inventory__piece:hover,
.loot-puzzle-inventory__piece:focus-visible,
.loot-puzzle-inventory__piece.loot-puzzle-piece--selected {
  background: color-mix(in srgb, var(--loot-puzzle-light) 28%, #172033);
  border-color: var(--loot-puzzle-light);
  outline: none;
}

.loot-puzzle-inventory__piece.loot-puzzle-piece--selected {
  box-shadow: 0 0 0 2px #172033, 0 0 0 4px var(--loot-puzzle-light);
}

.loot-puzzle-inventory__piece .loot-puzzle-piece-graphic {
  width: 1.85rem;
  height: 1.85rem;
}

.loot-magnifier-tool {
  width: 2.3rem;
  min-width: 2.3rem;
  height: 2rem;
  padding: 0.18rem;
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  color: inherit;
  background: rgba(0, 0, 0, 0.22);
  border: 2px solid transparent;
  border-radius: 0.4rem;
  box-sizing: border-box;
  cursor: pointer;
  image-rendering: pixelated;
}

.loot-magnifier-tool:hover,
.loot-magnifier-tool:focus-visible {
  background: rgba(84, 213, 245, 0.18);
  border-color: #54d5f5;
  outline: 2px solid #d7f7ff;
  outline-offset: 1px;
}

.loot-magnifier-tool--active {
  background: rgba(247, 201, 72, 0.24);
  border-color: #f7c948;
  box-shadow: 0 0 0 2px rgba(247, 201, 72, 0.2);
}

.loot-magnifier-tool .loot-magnifier-graphic {
  width: 1.85rem;
  height: 1.85rem;
}

.loot-magnifier-lens[hidden] {
  display: none !important;
}

.loot-magnifier-lens {
  --loot-magnifier-radius: 72px;
  position: fixed;
  z-index: 2147482500;
  left: 0;
  top: 0;
  width: calc(var(--loot-magnifier-radius) * 2);
  height: calc(var(--loot-magnifier-radius) * 2);
  border: 5px solid #172033;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background:
    radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.2), transparent 34%),
    rgba(84, 213, 245, 0.06);
  box-shadow:
    0 0 0 3px #f7c948,
    8px 8px 0 rgba(8, 15, 28, 0.42),
    inset 0 0 1.4rem rgba(84, 213, 245, 0.16);
  box-sizing: border-box;
  pointer-events: none;
  image-rendering: pixelated;
  backdrop-filter: brightness(1.06);
}

.loot-magnifier-lens::after {
  content: "";
  position: absolute;
  right: -2.2rem;
  bottom: -1.15rem;
  width: 2.7rem;
  height: 0.9rem;
  background: #9a6500;
  border: 4px solid #172033;
  border-left-color: #f7c948;
  border-radius: 0.2rem;
  box-shadow: 4px 4px 0 rgba(8, 15, 28, 0.38);
  transform: rotate(45deg);
  transform-origin: left center;
  box-sizing: border-box;
}

body.loot-magnifier-active {
  cursor: crosshair;
}

lia-loot-hidden:not([data-loot-concealment-ready="true"]) {
  visibility: hidden;
}

.loot-magnifier-secret {
  --loot-magnifier-radius: 72px;
  --loot-magnifier-x: -9999px;
  --loot-magnifier-y: -9999px;
  position: relative;
  min-width: 1px;
  min-height: 1px;
  display: inline-grid;
  place-items: center;
  isolation: isolate;
  vertical-align: middle;
  pointer-events: none;
}

.loot-magnifier-secret__content {
  grid-area: 1 / 1;
  min-width: 0;
  display: inline-block;
  opacity: 0;
  user-select: none;
  pointer-events: none;
}

body.loot-magnifier-active.loot-magnifier-pointing
  .loot-magnifier-secret--under-lens
  > .loot-magnifier-secret__content {
  opacity: 1;
  -webkit-clip-path: circle(
    var(--loot-magnifier-radius) at var(--loot-magnifier-x)
      var(--loot-magnifier-y)
  );
  clip-path: circle(
    var(--loot-magnifier-radius) at var(--loot-magnifier-x)
      var(--loot-magnifier-y)
  );
  user-select: auto;
  pointer-events: auto;
}

.loot-magnifier-secret--under-lens {
  pointer-events: auto;
}

.loot-magnifier-secret--dust::after {
  content: "";
  z-index: 1;
  position: absolute;
  left: var(--loot-secret-left, 0);
  top: var(--loot-secret-top, 0);
  width: var(--loot-secret-width, 1.5rem);
  height: var(--loot-secret-height, 1.2rem);
  min-width: 1.5rem;
  min-height: 1.2rem;
  opacity: 0.16;
  background-image:
    radial-gradient(circle, #d7f7ff 0 1px, transparent 1.7px),
    radial-gradient(circle, #c4a7ff 0 1px, transparent 1.8px),
    radial-gradient(circle, #f7c948 0 1px, transparent 1.7px);
  background-position: 15% 25%, 72% 62%, 44% 84%;
  background-size: 19px 23px, 29px 31px, 37px 41px;
  filter: drop-shadow(0 0 2px rgba(196, 167, 255, 0.45));
  pointer-events: none;
  animation: loot-magic-dust 2.8s steps(4, end) infinite;
}

.loot-magnifier-secret--dust.loot-magnifier-secret--under-lens::after {
  opacity: 0.06;
}

lia-loot-lock,
.loot-object-lock-host {
  display: none;
}

.loot-object-lock-target {
  position: relative !important;
  min-height: 44px;
}

.loot-object-lock-concealed {
  display: none !important;
}

.loot-object-lock-button {
  position: absolute;
  z-index: 101;
  inset: 0;
  width: 100%;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  color: #f8fafc;
  background: linear-gradient(145deg, rgba(8, 15, 28, 0.96), rgba(23, 32, 51, 0.94));
  border: 2px solid var(--loot-key-main);
  border-radius: 0.35rem;
  box-shadow: inset 0 0 0 2px var(--loot-key-dark), 3px 3px 0 rgba(8, 15, 28, 0.4);
  box-sizing: border-box;
  font: 800 0.72rem/1.1 system-ui, sans-serif;
  cursor: pointer;
  image-rendering: pixelated;
  -webkit-tap-highlight-color: transparent;
}

.loot-object-lock-button[hidden] {
  display: none !important;
}

.loot-object-lock-button--floating {
  position: fixed;
  z-index: 2147482000;
  inset: auto;
  min-width: 0;
  min-height: 0;
  padding: 0;
}

.loot-object-lock-button--floating.loot-object-lock-button--local {
  z-index: 99;
}

.loot-object-lock-button--floating .loot-object-lock-graphic {
  max-width: 82%;
  max-height: calc(100% - 0.15rem);
}

.loot-object-lock-button:hover {
  filter: brightness(1.12);
}

.loot-object-lock-button:focus-visible {
  outline: 3px solid var(--loot-key-light);
  outline-offset: 2px;
}

.loot-object-lock-graphic {
  width: 2rem;
  height: 2.25rem;
  flex: 0 0 auto;
  overflow: visible;
  filter: drop-shadow(2px 2px 0 rgba(8, 15, 28, 0.45));
  image-rendering: pixelated;
}

.loot-object-lock-shadow {
  fill: rgba(8, 15, 28, 0.42);
}

.loot-object-lock-shackle-outline,
.loot-object-lock-outline {
  fill: var(--loot-key-dark);
}

.loot-object-lock-shackle {
  fill: var(--loot-key-light);
}

.loot-object-lock-body {
  fill: var(--loot-key-main);
}

.loot-object-lock-light {
  fill: var(--loot-key-light);
}

.loot-object-lock-keyhole {
  fill: #172033;
}

.loot-object-lock-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loot-object-lock-message {
  position: absolute;
  z-index: 2;
  bottom: calc(100% + 0.35rem);
  left: 50%;
  width: max-content;
  max-width: min(14rem, 80vw);
  padding: 0.3rem 0.45rem;
  display: none;
  color: #f8fafc;
  background: #172033;
  border: 2px solid var(--loot-key-main);
  box-shadow: 3px 3px 0 rgba(8, 15, 28, 0.4);
  line-height: 1.25;
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-object-lock-message:not(:empty) {
  display: block;
}

.loot-object-lock-button--near-top .loot-object-lock-message,
.loot-object-lock-button--fill .loot-object-lock-message {
  top: calc(100% + 0.35rem);
  bottom: auto;
}

.loot-object-lock-button--missing {
  animation: loot-object-lock-missing 360ms steps(4, end);
}

.loot-object-lock-button--unlocking {
  pointer-events: none;
  animation: loot-object-lock-open 620ms steps(5, end) forwards;
}

.loot-object-lock-button--unlocking .loot-object-lock-shackle-outline,
.loot-object-lock-button--unlocking .loot-object-lock-shackle {
  transform-box: fill-box;
  transform-origin: left bottom;
  animation: loot-object-lock-shackle 420ms steps(4, end) forwards;
}

.loot-object-lock-status {
  position: fixed;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

lia-loot-slide-portal {
  min-width: 5rem;
  min-height: 5.5rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.loot-slide-portal {
  position: relative;
  width: 5rem;
  height: 5.5rem;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0.15rem;
  display: inline-grid;
  place-items: center;
  color: inherit;
  background: transparent;
  border: 0;
  box-sizing: border-box;
  filter: drop-shadow(4px 5px 0 rgba(8, 10, 30, 0.36));
  cursor: pointer;
  image-rendering: pixelated;
  animation: loot-slide-portal-idle 1.8s steps(3, end) infinite;
  -webkit-tap-highlight-color: transparent;
}

.loot-slide-portal:hover:not(:disabled) {
  animation: none;
  transform: translateY(-2px) scale(1.04);
  filter: drop-shadow(5px 8px 0 rgba(8, 10, 30, 0.4));
}

.loot-slide-portal:active:not(:disabled) {
  transform: translateY(1px) scale(0.98);
  filter: drop-shadow(2px 3px 0 rgba(8, 10, 30, 0.36));
}

.loot-slide-portal[inert] {
  animation: none;
  transform: none;
  cursor: not-allowed;
}

.loot-slide-portal[inert] .loot-slide-portal__spark {
  animation-play-state: paused;
}

.loot-slide-portal:focus-visible {
  outline: 3px solid #54d5f5;
  outline-offset: 3px;
}

.loot-slide-portal--broken {
  opacity: 0.55;
  filter: grayscale(0.75) drop-shadow(3px 4px 0 rgba(8, 10, 30, 0.3));
  cursor: not-allowed;
  animation: none;
}

.loot-slide-portal--pending {
  opacity: 0.72;
  cursor: wait;
  animation: none;
}

.loot-slide-portal__problem {
  max-width: 14rem;
  margin-top: 0.35rem;
  padding: 0.25rem 0.4rem;
  color: #7c1823;
  background: #fff2f3;
  border: 2px solid #a82b38;
  box-shadow: 2px 2px 0 rgba(37, 19, 63, 0.24);
  font: 700 0.72rem/1.25 ui-monospace, "Cascadia Mono", monospace;
  text-align: center;
  box-sizing: border-box;
}

.loot-slide-portal__graphic {
  width: 5rem !important;
  height: 5.5rem !important;
  max-width: 100% !important;
  max-height: 100% !important;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-slide-portal__shadow { fill: rgba(8, 10, 30, 0.3); }
.loot-slide-portal__outline { fill: #25133f; }
.loot-slide-portal__rim { fill: #8e5bea; }
.loot-slide-portal__core { fill: #17355f; }
.loot-slide-portal__spark { fill: #8cf4ff; }
.loot-slide-portal__arrow { fill: #f4f0ff; }
.loot-slide-portal--one-way .loot-slide-portal__rim { fill: #2fc6d3; }
.loot-slide-portal--one-way .loot-slide-portal__core { fill: #16495e; }
.loot-slide-portal--return .loot-slide-portal__rim { fill: #d06cf2; }

.loot-slide-portal__spark--one {
  animation: loot-slide-portal-spark 1.2s steps(2, end) infinite;
}

.loot-slide-portal__spark--two {
  animation: loot-slide-portal-spark 1.2s 0.6s steps(2, end) infinite;
}

.loot-slide-portal__number {
  position: absolute;
  right: 0;
  bottom: 0.15rem;
  min-width: 1.45rem;
  padding: 0.18rem 0.25rem;
  color: #161024;
  background: #eafcff;
  border: 2px solid #25133f;
  box-shadow: 2px 2px 0 #25133f;
  font: 900 0.72rem/1 ui-monospace, "Cascadia Mono", monospace;
  text-align: center;
  box-sizing: border-box;
}

.loot-slide-portal-return {
  width: fit-content;
  max-width: 100%;
  margin: 1.25rem auto 0;
  padding: 0.55rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: inherit;
  background: rgba(84, 213, 245, 0.08);
  background: color-mix(in srgb, currentColor 7%, transparent);
  border: 2px solid rgba(84, 213, 245, 0.34);
  border: 2px solid color-mix(in srgb, currentColor 30%, transparent);
  border-radius: 0.35rem;
  box-sizing: border-box;
}

.loot-slide-portal-return__label {
  font-weight: 700;
}

.loot-slide-portal-status {
  position: fixed;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

lia-loot-magnifier {
  min-width: 4.5rem;
  min-height: 4.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-magnifier:empty {
  display: none;
}

.loot-magnifier-pickup {
  position: relative;
  width: 4.5rem;
  height: 4.5rem;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0.2rem;
  display: inline-grid;
  place-items: center;
  color: inherit;
  background: transparent;
  border: 0;
  box-sizing: border-box;
  filter: drop-shadow(4px 4px 0 rgba(8, 15, 28, 0.34));
  cursor: pointer;
  image-rendering: pixelated;
  animation: loot-magnifier-idle 2.4s steps(3, end) infinite;
  -webkit-tap-highlight-color: transparent;
}

.loot-magnifier-pickup:hover:not(:disabled) {
  animation: none;
  transform: translate(-2px, -2px) rotate(-3deg);
  filter: drop-shadow(7px 7px 0 rgba(8, 15, 28, 0.38));
}

.loot-magnifier-pickup:active:not(:disabled) {
  transform: translate(1px, 1px);
  filter: drop-shadow(2px 2px 0 rgba(8, 15, 28, 0.34));
}

.loot-magnifier-pickup:focus-visible {
  outline: 3px solid #54d5f5;
  outline-offset: 2px;
}

.loot-magnifier-pickup:disabled {
  opacity: 1;
}

.loot-magnifier-graphic {
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-magnifier-shadow {
  fill: rgba(8, 15, 28, 0.3);
}

.loot-magnifier-outline {
  fill: #172033;
}

.loot-magnifier-glass {
  fill: #67c7df;
}

.loot-magnifier-glint {
  fill: #e6fbff;
}

.loot-magnifier-handle {
  fill: #c17b1f;
}

.loot-magnifier-handle-light {
  fill: #f7c948;
}

.loot-magnifier-pickup__reward {
  position: absolute;
  z-index: 1;
  top: -0.35rem;
  left: 50%;
  padding: 3px 5px;
  opacity: 0;
  color: #172033;
  background: #d7f7ff;
  border: 2px solid #1c6275;
  box-shadow: 2px 2px 0 #1c6275;
  font: 900 0.66rem/1 ui-monospace, "Cascadia Mono", monospace;
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-magnifier-pickup--collected {
  pointer-events: none;
  animation: loot-magnifier-collect 650ms steps(5, end) forwards;
}

.loot-magnifier-pickup--collected .loot-magnifier-pickup__reward {
  animation: loot-magnifier-reward 600ms steps(5, end) forwards;
}

lia-loot-tool {
  min-width: 4.5rem;
  min-height: 4.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-tool:empty,
lia-loot-tool[hidden],
lia-loot-reveal[hidden],
lia-loot-reveal-end,
a[href^="#lia-loot-reveal-end-"],
lia-loot-if-start,
a[href="#lia-loot-if-end"],
[data-loot-inline-renderer],
[data-loot-inline-tail],
.loot-reveal-layer__cover[hidden],
.loot-reveal-layer__content[hidden],
[data-loot-reveal-payload][hidden],
[data-loot-reveal-range-blocked],
[data-loot-if-range-blocked],
[data-loot-puzzle-range-blocked] {
  display: none !important;
}

p:has([data-loot-inline-renderer]),
p:has([data-loot-inline-tail]),
.lia-paragraph:has([data-loot-inline-renderer]),
.lia-paragraph:has([data-loot-inline-tail]) {
  visibility: hidden !important;
}

lia-loot-puzzle-piece {
  min-width: 4.5rem;
  min-height: 4.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-puzzle-piece:empty {
  display: none;
}

lia-loot-puzzle-gate {
  display: block;
  width: 100%;
  margin: 1rem auto;
}

.loot-puzzle-pickup {
  width: 4.5rem;
  height: 4.5rem;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0.2rem;
  display: inline-grid;
  place-items: center;
  color: inherit;
  background: transparent;
  border: 0;
  filter: drop-shadow(4px 4px 0 rgba(8, 15, 28, 0.34));
  cursor: pointer;
  image-rendering: pixelated;
  animation: loot-puzzle-idle 2s steps(2, end) infinite;
}

.loot-puzzle-pickup:hover:not(:disabled) {
  transform: translate(-2px, -2px) rotate(2deg);
  filter: drop-shadow(6px 6px 0 rgba(8, 15, 28, 0.4));
}

.loot-puzzle-pickup:focus-visible {
  outline: 3px solid #54d5f5;
  outline-offset: 2px;
}

.loot-puzzle-pickup--collected {
  pointer-events: none;
  animation: loot-puzzle-collect 400ms steps(4, end) forwards;
}

.loot-puzzle-piece-graphic {
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-puzzle-piece__shadow {
  fill: rgba(8, 15, 28, 0.42);
}

.loot-puzzle-piece__body {
  fill: var(--loot-puzzle-main);
  stroke: var(--loot-puzzle-dark);
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.loot-puzzle-piece__highlight {
  fill: var(--loot-puzzle-light);
  opacity: 0.9;
}

.loot-puzzle-piece__number {
  fill: #ffffff;
  stroke: rgba(8, 15, 28, 0.94);
  stroke-width: 3.6;
  stroke-linejoin: round;
  paint-order: stroke fill;
  font-family: "Arial Black", "Segoe UI Black", system-ui, sans-serif;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -1px;
}

.loot-puzzle-inventory__piece .loot-puzzle-piece__number {
  stroke-width: 3.8;
  font-size: 40px;
  letter-spacing: -2px;
}

.loot-puzzle-color--red {
  --loot-puzzle-main: #e74c4c;
  --loot-puzzle-dark: #7d1f26;
  --loot-puzzle-light: #ffb0a9;
}

.loot-puzzle-color--blue {
  --loot-puzzle-main: #4a90e2;
  --loot-puzzle-dark: #1c4275;
  --loot-puzzle-light: #b8dcff;
}

.loot-puzzle-color--green {
  --loot-puzzle-main: #48b96a;
  --loot-puzzle-dark: #1d6536;
  --loot-puzzle-light: #bcefc8;
}

.loot-puzzle-color--yellow {
  --loot-puzzle-main: #f7c948;
  --loot-puzzle-dark: #8a5708;
  --loot-puzzle-light: #fff0a6;
}

.loot-puzzle-color--purple {
  --loot-puzzle-main: #9b63d9;
  --loot-puzzle-dark: #4b2772;
  --loot-puzzle-light: #e5ccff;
}

.loot-puzzle-color--orange {
  --loot-puzzle-main: #ed7d31;
  --loot-puzzle-dark: #8c3514;
  --loot-puzzle-light: #ffc9a1;
}

.loot-puzzle-color--magenta {
  --loot-puzzle-main: #d946a8;
  --loot-puzzle-dark: #741b56;
  --loot-puzzle-light: #ffb4e4;
}

.loot-puzzle-color--white {
  --loot-puzzle-main: #f1f5f9;
  --loot-puzzle-dark: #64748b;
  --loot-puzzle-light: #ffffff;
}

.loot-puzzle-color--black {
  --loot-puzzle-main: #2d333d;
  --loot-puzzle-dark: #080b12;
  --loot-puzzle-light: #cbd5e1;
}

.loot-puzzle-color--turquoise {
  --loot-puzzle-main: #20b8b5;
  --loot-puzzle-dark: #0b6264;
  --loot-puzzle-light: #a6f3ee;
}

.loot-puzzle-color--gray {
  --loot-puzzle-main: #8490a0;
  --loot-puzzle-dark: #46515f;
  --loot-puzzle-light: #d9e1ea;
}

.loot-puzzle-color--brown {
  --loot-puzzle-main: #9a6240;
  --loot-puzzle-dark: #4e2e1f;
  --loot-puzzle-light: #d9ad8d;
}

.loot-puzzle-color--black .loot-puzzle-piece__body {
  stroke: var(--loot-puzzle-light);
}

.loot-puzzle-gate {
  position: relative;
  width: fit-content;
  min-width: min(18rem, 100%);
  max-width: 100%;
  margin-inline: auto;
  padding: 0.9rem 1rem 1.05rem;
  color: #f8fafc;
  background:
    repeating-linear-gradient(
      0deg,
      transparent 0 1.05rem,
      rgba(8, 15, 28, 0.3) 1.05rem 1.2rem
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--loot-puzzle-main) 58%, #475569),
      color-mix(in srgb, var(--loot-puzzle-dark) 78%, #172033)
    );
  border: 4px solid var(--loot-puzzle-dark, #64748b);
  border-radius: 0.65rem;
  box-shadow:
    6px 6px 0 var(--loot-puzzle-dark, #475569),
    inset 0 0 0 3px rgba(255, 255, 255, 0.14),
    0 0.8rem 1.8rem rgba(8, 15, 28, 0.28);
  box-sizing: border-box;
  font-family: system-ui, sans-serif;
}

.loot-puzzle-gate.loot-puzzle-color--black {
  border-color: var(--loot-puzzle-light);
}

.loot-puzzle-gate.loot-puzzle-color--black .loot-puzzle-gate__frame {
  border-color: var(--loot-puzzle-light);
}

.loot-puzzle-gate:not(.loot-puzzle-gate--invalid)::before {
  content: "";
  position: absolute;
  z-index: 4;
  top: -0.25rem;
  left: 50%;
  width: 2rem;
  height: 1.3rem;
  background: linear-gradient(
    145deg,
    var(--loot-puzzle-light),
    var(--loot-puzzle-main)
  );
  border: 3px solid var(--loot-puzzle-dark);
  clip-path: polygon(18% 0, 82% 0, 100% 100%, 0 100%);
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-puzzle-gate:not(.loot-puzzle-gate--invalid)::after {
  content: "";
  position: absolute;
  z-index: 4;
  right: 0.35rem;
  bottom: 0.28rem;
  left: 0.35rem;
  height: 0.55rem;
  background: linear-gradient(
    180deg,
    var(--loot-puzzle-light),
    var(--loot-puzzle-dark)
  );
  border: 2px solid var(--loot-puzzle-dark);
  border-radius: 0.18rem;
  pointer-events: none;
}

.loot-puzzle-gate:not(.loot-puzzle-gate--invalid):focus-visible {
  outline: 3px solid #54d5f5;
  outline-offset: 5px;
}

.loot-puzzle-gate--invalid {
  width: min(42rem, 100%);
  --loot-puzzle-dark: #991b1b;
  color: #fff1f2;
  border-color: #ef4444;
}

.loot-puzzle-gate__title,
.loot-puzzle-gate__progress {
  margin: 0;
}

.loot-puzzle-gate:not(.loot-puzzle-gate--invalid) > .loot-puzzle-gate__title,
.loot-puzzle-gate:not(.loot-puzzle-gate--invalid) > .loot-puzzle-gate__progress {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loot-puzzle-gate__title {
  color: var(--loot-puzzle-light, #f8fafc);
  font-size: 1.2rem;
  line-height: 1.3;
}

.loot-puzzle-gate__title:focus-visible {
  outline: 3px solid #54d5f5;
  outline-offset: 3px;
}

.loot-puzzle-gate__progress {
  margin-top: 0.4rem;
  color: #dbe5f4;
  font-size: 0.92rem;
  font-weight: 650;
  line-height: 1.4;
}

.loot-puzzle-gate__frame {
  position: relative;
  width: fit-content;
  min-width: min(14rem, 100%);
  max-width: 100%;
  min-height: 8.75rem;
  margin: 0 auto 0.2rem;
  padding: 2.15rem 1.15rem 0.95rem;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(
      ellipse at 50% 8%,
      color-mix(in srgb, var(--loot-puzzle-main) 28%, #172033),
      #080f1c 72%
    );
  border: 0.55rem solid var(--loot-puzzle-dark);
  border-bottom-width: 0.8rem;
  border-radius: 7rem 7rem 0.35rem 0.35rem / 3.8rem 3.8rem 0.35rem 0.35rem;
  box-shadow:
    inset 0 0 0 3px var(--loot-puzzle-light),
    inset 0 1.1rem 1.8rem rgba(8, 15, 28, 0.58),
    0 4px 0 color-mix(in srgb, var(--loot-puzzle-dark) 75%, #080f1c);
  box-sizing: border-box;
}

.loot-puzzle-gate__grid {
  position: relative;
  z-index: 2;
  width: fit-content;
  max-width: 100%;
  padding: 0.2rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(var(--loot-puzzle-columns), minmax(44px, 4rem));
  justify-content: safe center;
  gap: 0.35rem;
  overflow-x: auto;
  box-sizing: border-box;
  scrollbar-width: thin;
}

.loot-puzzle-gate__slot {
  width: 4rem;
  max-width: 100%;
  aspect-ratio: 1;
  min-width: 44px;
  min-height: 44px;
  padding: 0.12rem;
  display: grid;
  place-items: center;
  color: #dbe5f4;
  background: rgba(8, 15, 28, 0.82);
  border: 3px dashed color-mix(in srgb, var(--loot-puzzle-light) 64%, #64748b);
  border-radius: 0.4rem;
  box-sizing: border-box;
  cursor: pointer;
}

.loot-puzzle-gate__slot:not(:disabled):hover,
.loot-puzzle-gate__slot:not(:disabled):focus-visible,
.loot-puzzle-gate__slot.loot-puzzle-piece--selected {
  border-style: solid;
  border-color: var(--loot-puzzle-light);
  outline: 3px solid #54d5f5;
  outline-offset: 2px;
}

.loot-puzzle-gate__slot.loot-puzzle-piece--selected {
  background: color-mix(in srgb, var(--loot-puzzle-main) 24%, #172033);
}

.loot-puzzle-gate__slot:disabled {
  opacity: 1;
  cursor: default;
}

.loot-puzzle-gate__doors {
  position: absolute;
  z-index: 1;
  inset: 0.55rem 0.55rem 0.8rem;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 5.8rem 5.8rem 0.12rem 0.12rem / 3rem 3rem 0.12rem 0.12rem;
  pointer-events: none;
}

.loot-puzzle-gate__doors > span {
  width: 50%;
  background:
    radial-gradient(circle, var(--loot-puzzle-light) 0 2px, transparent 2.5px)
      0.3rem 0.3rem / 1.35rem 1.35rem,
    linear-gradient(
      0deg,
      transparent 0 43%,
      var(--loot-puzzle-dark) 43% 49%,
      var(--loot-puzzle-light) 49% 52%,
      var(--loot-puzzle-dark) 52% 58%,
      transparent 58%
    ),
    repeating-linear-gradient(
      90deg,
      color-mix(in srgb, var(--loot-puzzle-main) 62%, #172033) 0 1rem,
      var(--loot-puzzle-dark) 1rem 1.2rem
    );
  border-inline: 2px solid var(--loot-puzzle-dark);
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--loot-puzzle-light) 62%, transparent);
  transition: transform 500ms steps(6, end);
}

.loot-puzzle-gate__doors > span:first-child {
  border-right-color: var(--loot-puzzle-light);
}

.loot-puzzle-gate__doors > span:last-child {
  border-left-color: var(--loot-puzzle-light);
}

.loot-puzzle-gate--open {
  border-color: var(--loot-puzzle-light);
  box-shadow:
    6px 6px 0 var(--loot-puzzle-dark),
    inset 0 0 0 3px rgba(255, 255, 255, 0.2),
    0 0 1.2rem color-mix(in srgb, var(--loot-puzzle-main) 48%, transparent);
}

.loot-puzzle-gate--open .loot-puzzle-gate__frame {
  background:
    radial-gradient(
      ellipse at 50% 35%,
      color-mix(in srgb, var(--loot-puzzle-main) 34%, #172033),
      #080f1c 76%
    );
}

.loot-puzzle-gate--open .loot-puzzle-gate__doors > span:first-child {
  transform: translateX(-110%);
}

.loot-puzzle-gate--open .loot-puzzle-gate__doors > span:last-child {
  transform: translateX(110%);
}

@keyframes loot-puzzle-idle {
  50% { transform: translateY(-2px) rotate(-1deg); }
}

@keyframes loot-puzzle-collect {
  to { opacity: 0; transform: translateY(-1.5rem) scale(0.45) rotate(12deg); }
}

lia-loot-reveal-start {
  display: block;
}

.loot-exploration-pickup {
  position: relative;
  width: 4.5rem;
  height: 4.5rem;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0.2rem;
  display: inline-grid;
  place-items: center;
  color: inherit;
  background: transparent;
  border: 0;
  box-sizing: border-box;
  filter: drop-shadow(4px 4px 0 rgba(8, 15, 28, 0.34));
  cursor: pointer;
  image-rendering: pixelated;
  animation: loot-exploration-idle 2.4s steps(3, end) infinite;
  -webkit-tap-highlight-color: transparent;
}

.loot-exploration-pickup:hover:not(:disabled),
.loot-reveal-cover:hover:not(:disabled) {
  animation: none;
  transform: translate(-2px, -2px);
  filter: drop-shadow(7px 7px 0 rgba(8, 15, 28, 0.38));
}

.loot-exploration-pickup:active:not(:disabled),
.loot-reveal-cover:active:not(:disabled) {
  transform: translate(1px, 1px);
  filter: drop-shadow(2px 2px 0 rgba(8, 15, 28, 0.34));
}

.loot-exploration-pickup:focus-visible,
.loot-reveal-cover:focus-visible,
.loot-exploration-tool:focus-visible {
  outline: 3px solid #54d5f5;
  outline-offset: 2px;
}

.loot-exploration-pickup__reward {
  position: absolute;
  z-index: 1;
  top: -0.35rem;
  left: 50%;
  padding: 3px 5px;
  opacity: 0;
  color: #172033;
  background: #d7f7ff;
  border: 2px solid #1c6275;
  box-shadow: 2px 2px 0 #1c6275;
  font: 900 0.66rem/1 ui-monospace, "Cascadia Mono", monospace;
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-exploration-pickup--collected {
  pointer-events: none;
  animation: loot-exploration-collect 650ms steps(5, end) forwards;
}

.loot-exploration-pickup--collected .loot-exploration-pickup__reward {
  animation: loot-exploration-reward 600ms steps(5, end) forwards;
}

.loot-exploration-tool {
  width: 2.3rem;
  min-width: 2.3rem;
  height: 2rem;
  padding: 0.18rem;
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  color: inherit;
  background: rgba(0, 0, 0, 0.22);
  border: 2px solid transparent;
  border-radius: 0.4rem;
  box-sizing: border-box;
  cursor: pointer;
  image-rendering: pixelated;
}

.loot-exploration-tool:hover,
.loot-exploration-tool:focus-visible {
  background: rgba(84, 213, 245, 0.18);
  border-color: #54d5f5;
}

.loot-exploration-tool--active {
  background: rgba(111, 214, 96, 0.24);
  border-color: #6fd660;
  box-shadow: 0 0 0 2px rgba(111, 214, 96, 0.2);
}

.loot-exploration-pickup > .loot-exploration-graphic,
.loot-exploration-tool > .loot-exploration-graphic,
.loot-reveal-cover > .loot-exploration-graphic {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-exploration-tool > .loot-exploration-graphic {
  width: 1.75rem;
  height: 1.75rem;
}

lia-loot-reveal {
  position: relative;
  min-width: 44px;
  min-height: 44px;
  max-width: 100%;
  display: block;
}

lia-loot-reveal[data-reveal-layout=inline] {
  width: auto;
  display: inline-grid;
  vertical-align: middle;
}

lia-loot-reveal[data-reveal-layout=inline]
  > [data-loot-reveal-payload] {
  width: auto;
}

lia-loot-reveal:not([data-loot-reveal-kind])
  > [data-loot-reveal-payload] {
  visibility: hidden;
}

.loot-reveal-layer {
  position: relative;
  width: 100%;
  min-width: 44px;
  min-height: 44px;
  display: grid;
  place-items: center;
  isolation: isolate;
}

.loot-reveal-layer__cover,
.loot-reveal-layer__content {
  grid-area: 1 / 1;
  min-width: 0;
  max-width: 100%;
}

.loot-reveal-layer__cover {
  width: 4.5rem;
  height: 4.5rem;
  max-width: 100%;
  display: grid;
  place-items: center;
}

.loot-reveal-layer__content {
  width: 100%;
  display: grid;
  place-items: center;
}

.loot-reveal-layer__final-content:not(.loot-magnifier-secret) {
  display: contents;
}

lia-loot-reveal > [data-loot-reveal-payload] {
  width: 100%;
  min-width: 0;
}

.loot-reveal-cover {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0.1rem;
  display: inline-grid;
  place-items: center;
  color: inherit;
  background: transparent;
  border: 0;
  box-sizing: border-box;
  filter: drop-shadow(4px 4px 0 rgba(8, 15, 28, 0.34));
  cursor: pointer;
  image-rendering: pixelated;
  animation: loot-exploration-idle 2.4s steps(3, end) infinite;
  -webkit-tap-highlight-color: transparent;
}

@media (any-hover: hover) and (any-pointer: fine) {
  html[data-loot-active-tool="shovel"] {
    --loot-action-tool-cursor: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 64 64%22 shape-rendering=%22crispEdges%22%3E%3Cpath fill=%22%23172033%22 d=%22M38 2h12v4h4v12h-4v4h-4v8h-4v8h-4v8h10v4h4v8H22v-8h4v-4h4v-8h4v-8h4v-8h-4v-4h-4V6h4V2h4Z%22/%3E%3Cpath fill=%22%23d58a2a%22 d=%22M38 6h8v4h4v4h-4v4h-8v-4h-4v-4h4V6Z%22/%3E%3Cpath fill=%22%238c5520%22 d=%22M38 18h8v8h-4v8h-4v8h-8v-4h4v-8h4V18Z%22/%3E%3Cpath fill=%22%23aeb9c8%22 d=%22M30 42h12v4h6v8H26v-8h4v-4Z%22/%3E%3Cpath fill=%22%23e6edf5%22 d=%22M34 46h8v4H30v-2h4v-2Z%22/%3E%3C/svg%3E") 18 29, crosshair;
  }

  html[data-loot-active-tool="watering-can"] {
    --loot-action-tool-cursor: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 64 64%22 shape-rendering=%22crispEdges%22%3E%3Cpath fill=%22%23172033%22 d=%22M22 12h24v4h6v4h4v8h-4v4h-8v-4h4v-8h-6v-4H26v8h20v4h4v24h-4v4H14v-4h-4V32H4v-4h16v-4h2V12Zm-8 20v16h28V28H22v4h-8Z%22/%3E%3Cpath fill=%22%234aa9c7%22 d=%22M14 32h28v16H14V32ZM4 32h10v8H8v-4H4v-4Zm0-8h10v4H4v-4Z%22/%3E%3Cpath fill=%22%23a9efff%22 d=%22M18 34h12v4H18v-4Z%22/%3E%3Cpath fill=%22%2326758f%22 d=%22M26 16h16v4h6v8h-4v-4h-4v-4H26v-4Z%22/%3E%3Cpath fill=%22%2367d7f5%22 d=%22M2 18h4v4H2v-4Zm6-4h4v4H8v-4Zm6 4h4v4h-4v-4Z%22/%3E%3C/svg%3E") 3 10, crosshair;
  }

  html[data-loot-active-tool] body,
  html[data-loot-active-tool] .loot-reveal-cover {
    cursor: var(--loot-action-tool-cursor);
  }
}

.loot-key-tray > .loot-key-placement .loot-reveal-layer,
.loot-chest-tray > .loot-chest-placement .loot-reveal-layer,
.loot-key-tray > .loot-key-placement .loot-reveal-layer__cover,
.loot-chest-tray > .loot-chest-placement .loot-reveal-layer__cover {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
}

.loot-key-tray > .loot-key-placement .loot-key-pickup,
.loot-chest-tray > .loot-chest-placement .loot-treasure-chest {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
}

.loot-reveal-layer--digging > .loot-reveal-layer__cover {
  animation: loot-soil-dig 520ms steps(5, end) forwards;
}

.loot-reveal-layer--watering > .loot-reveal-layer__cover {
  animation: loot-plant-water 520ms steps(4, end);
}

.loot-reveal-layer--opening > .loot-reveal-layer__cover {
  animation: loot-bloom-open 520ms steps(5, end) forwards;
}

.loot-exploration-shadow { fill: rgba(8, 15, 28, 0.3); }
.loot-exploration-outline { fill: #172033; }
.loot-shovel-handle { fill: #d58a2a; }
.loot-shovel-shaft { fill: #8c5520; }
.loot-shovel-metal { fill: #aeb9c8; }
.loot-shovel-light { fill: #e6edf5; }
.loot-watering-can-body { fill: #4aa9c7; }
.loot-watering-can-light { fill: #a9efff; }
.loot-watering-can-handle { fill: #26758f; }
.loot-watering-can-spout { fill: #4aa9c7; }
.loot-watering-can-water { fill: #67d7f5; }
.loot-soil-dark { fill: #69421f; }
.loot-soil-main { fill: #9b6129; }
.loot-soil-light { fill: #d28a3b; }
.loot-soil-stone { fill: #728095; }
.loot-plant-stem { fill: #328a42; }
.loot-plant-leaf { fill: #55bd58; }
.loot-plant-pot-dark { fill: #8e452c; }
.loot-plant-pot { fill: #d36c3d; }
.loot-plant-pot-light { fill: #f29a5d; }
.loot-flower-petal { fill: #f06ca8; }
.loot-flower-center { fill: #f7c948; }

lia-loot-key {
  min-width: 4.5rem;
  min-height: 3.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-key:empty,
lia-loot-key.loot-key-host--surface-source {
  display: none;
}

.loot-key-pickup {
  position: relative;
  width: 4.5rem;
  height: 3.5rem;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0.25rem;
  display: inline-grid;
  place-items: center;
  border: 0;
  color: inherit;
  background: transparent;
  box-sizing: border-box;
  filter: drop-shadow(4px 4px 0 rgba(8, 15, 28, 0.3));
  cursor: pointer;
  image-rendering: pixelated;
  animation: loot-key-idle 2.2s steps(2, end) infinite;
  -webkit-tap-highlight-color: transparent;
}

.loot-key-pickup:hover:not(:disabled) {
  animation: none;
  transform: translate(-2px, -2px) rotate(-2deg);
  filter: drop-shadow(6px 6px 0 rgba(8, 15, 28, 0.38));
}

.loot-key-pickup:active:not(:disabled) {
  transform: translate(1px, 1px);
  filter: drop-shadow(2px 2px 0 rgba(8, 15, 28, 0.34));
}

.loot-key-pickup:focus-visible {
  outline: 3px solid #54d5f5;
  outline-offset: 2px;
}

.loot-key-pickup:disabled {
  opacity: 1;
}

.loot-key-pickup > .loot-key-graphic {
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-key-color--red {
  --loot-key-main: #e74c4c;
  --loot-key-dark: #7d1f26;
  --loot-key-light: #ff9a91;
}

.loot-key-color--blue {
  --loot-key-main: #4a90e2;
  --loot-key-dark: #1c4275;
  --loot-key-light: #a9d4ff;
}

.loot-key-color--green {
  --loot-key-main: #48b96a;
  --loot-key-dark: #1d6536;
  --loot-key-light: #a8efb9;
}

.loot-key-color--yellow {
  --loot-key-main: #f7c948;
  --loot-key-dark: #8a5708;
  --loot-key-light: #fff0a6;
}

.loot-key-color--purple {
  --loot-key-main: #9b63d9;
  --loot-key-dark: #4b2772;
  --loot-key-light: #dfc2ff;
}

.loot-key-color--orange {
  --loot-key-main: #ed7d31;
  --loot-key-dark: #8c3514;
  --loot-key-light: #ffc18f;
}

.loot-key-color--magenta {
  --loot-key-main: #d946a8;
  --loot-key-dark: #741b56;
  --loot-key-light: #ffb4e4;
}

.loot-key-color--white {
  --loot-key-main: #f1f5f9;
  --loot-key-dark: #64748b;
  --loot-key-light: #ffffff;
}

.loot-key-color--black {
  --loot-key-main: #2d333d;
  --loot-key-dark: #080b12;
  --loot-key-light: #cbd5e1;
}

.loot-key-color--turquoise {
  --loot-key-main: #20b8b5;
  --loot-key-dark: #0b6264;
  --loot-key-light: #a6f3ee;
}

.loot-key-color--gray {
  --loot-key-main: #8490a0;
  --loot-key-dark: #46515f;
  --loot-key-light: #d9e1ea;
}

.loot-key-color--brown {
  --loot-key-main: #9a6240;
  --loot-key-dark: #4e2e1f;
  --loot-key-light: #d9ad8d;
}

.loot-key-color--black .loot-key-outline,
.loot-key-color--black .loot-object-lock-shackle-outline,
.loot-key-color--black .loot-object-lock-outline {
  fill: var(--loot-key-light);
}

.loot-key-shadow {
  fill: rgba(8, 15, 28, 0.34);
}

.loot-key-outline {
  fill: var(--loot-key-dark);
}

.loot-key-main {
  fill: var(--loot-key-main);
}

.loot-key-light {
  fill: var(--loot-key-light);
}

.loot-key-hole {
  fill: #172033;
}

.loot-key-pickup__reward {
  position: absolute;
  z-index: 1;
  top: -0.2rem;
  left: 50%;
  min-width: 1.8rem;
  padding: 3px 4px;
  opacity: 0;
  color: #172033;
  background: var(--loot-key-light);
  border: 2px solid var(--loot-key-dark);
  box-shadow: 2px 2px 0 var(--loot-key-dark);
  font: 900 0.8rem/1 ui-monospace, "Cascadia Mono", monospace;
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-key-pickup--collected {
  pointer-events: none;
  animation: loot-key-collect 650ms steps(5, end) forwards;
}

.loot-key-pickup--collected .loot-key-pickup__reward {
  animation: loot-key-reward 600ms steps(5, end) forwards;
}

.loot-key-placement {
  min-height: 3.75rem;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  list-style: none;
}

.loot-key-placement--toc {
  margin: 0.4rem 0.65rem;
  border-top: 2px solid color-mix(in srgb, currentColor 16%, transparent);
  border-bottom: 2px solid color-mix(in srgb, currentColor 16%, transparent);
}

.loot-key-placement--menu,
.loot-key-placement--classroom,
.loot-key-placement--info,
.loot-key-placement--translator,
.loot-key-placement--mode {
  width: 100%;
}

.loot-key-tray {
  width: 100%;
  min-width: 0;
  margin: 0.5rem 0 0;
  padding: 0.125rem 0.25rem 0.25rem;
  display: flex;
  flex: 0 0 auto;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  justify-content: safe center;
  gap: 0.375rem;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  box-sizing: border-box;
  list-style: none;
}

.loot-key-tray:empty {
  display: none;
}

.loot-key-tray > .loot-key-placement {
  position: relative;
  flex: 0 0 44px;
  align-self: auto;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0;
  display: grid;
  place-items: center;
}

.loot-key-tray > .loot-key-placement > .loot-key-pickup {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
}

lia-loot-chest {
  min-width: 4rem;
  min-height: 3.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-chest:empty,
lia-loot-chest.loot-treasure-host--portal-source {
  display: none;
}

.loot-chest-placement {
  min-height: 3.75rem;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  list-style: none;
}

.loot-chest-placement--toc {
  margin: 0.4rem 0.65rem;
  border-top: 2px solid color-mix(in srgb, currentColor 16%, transparent);
  border-bottom: 2px solid color-mix(in srgb, currentColor 16%, transparent);
}

.loot-chest-placement--menu,
.loot-chest-placement--classroom,
.loot-chest-placement--info,
.loot-chest-placement--translator,
.loot-chest-placement--mode {
  width: 100%;
}

.loot-chest-placement--template {
  position: fixed;
  z-index: 2147481900;
  min-width: 0;
  min-height: 0;
  margin: 0;
  padding: 0;
  pointer-events: none;
}

.loot-chest-placement--template .loot-treasure-chest {
  width: 100%;
  height: 100%;
  min-width: 40px;
  min-height: 40px;
  pointer-events: auto;
}

.loot-chest-placement--template-inside {
  position: relative;
  flex: 0 0 44px;
  align-self: auto;
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  height: 44px;
  margin: 0;
  padding: 0;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  list-style: none;
  pointer-events: auto;
}

.loot-chest-placement--template-inside .loot-treasure-chest {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
}

.loot-chest-tray {
  width: 100%;
  min-width: 0;
  margin: 0.5rem 0 0;
  padding: 0.125rem 0.25rem 0.25rem;
  display: flex;
  flex: 0 0 auto;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  justify-content: safe center;
  gap: 0.375rem;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  box-sizing: border-box;
  list-style: none;
}

.loot-chest-tray:empty {
  display: none;
}

.loot-chest-tray > .loot-chest-placement {
  position: relative;
  flex: 0 0 44px;
  align-self: auto;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0;
  display: grid;
  place-items: center;
}

.loot-chest-tray
  > .loot-chest-placement
  > .loot-treasure-chest {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
}

#lia-tff-panel-v2 > .loot-chest-tray {
  margin-top: 10px;
}

.loot-treasure-chest {
  position: relative;
  width: 4rem;
  height: 3.5rem;
  margin: 0;
  padding: 0;
  display: inline-grid;
  place-items: center;
  border: 0;
  color: inherit;
  background: transparent;
  filter: drop-shadow(4px 4px 0 rgba(8, 15, 28, 0.34));
  cursor: pointer;
  animation: loot-treasure-idle 2.4s steps(2, end) infinite;
  image-rendering: pixelated;
  -webkit-tap-highlight-color: transparent;
}

.loot-chest-placement .loot-treasure-chest {
  width: 3.6rem;
  height: 3.15rem;
}

.loot-treasure-chest:hover:not(:disabled) {
  animation: none;
  transform: translate(-2px, -2px);
  filter: drop-shadow(6px 6px 0 rgba(8, 15, 28, 0.42));
}

.loot-treasure-chest:active:not(:disabled) {
  transform: translate(1px, 1px);
  filter: drop-shadow(2px 2px 0 rgba(8, 15, 28, 0.38));
}

.loot-treasure-chest:focus-visible {
  outline: 3px solid #54d5f5;
  outline-offset: 3px;
}

.loot-treasure-chest:disabled {
  opacity: 1;
}

.loot-treasure-chest > .loot-treasure-chest-graphic {
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-chest-shadow {
  fill: rgba(8, 15, 28, 0.34);
}

.loot-chest-outline {
  fill: #2f1710;
}

.loot-chest-wood-dark {
  fill: #6f3218;
}

.loot-chest-wood {
  fill: #b95d24;
}

.loot-chest-wood-light {
  fill: #e58a35;
}

.loot-chest-metal-dark {
  fill: #8a5708;
}

.loot-chest-metal {
  fill: #e5a91c;
}

.loot-chest-metal-light {
  fill: #ffe16a;
}

.loot-chest-keyhole {
  fill: #21120d;
}

.loot-treasure-chest--diamonds .loot-chest-outline {
  fill: #10283c;
}

.loot-treasure-chest--diamonds .loot-chest-wood-dark {
  fill: #164864;
}

.loot-treasure-chest--diamonds .loot-chest-wood {
  fill: #237a9d;
}

.loot-treasure-chest--diamonds .loot-chest-wood-light {
  fill: #5dd9ee;
}

.loot-treasure-chest--diamonds .loot-chest-metal-dark {
  fill: #35657a;
}

.loot-treasure-chest--diamonds .loot-chest-metal {
  fill: #9fdce9;
}

.loot-treasure-chest--diamonds .loot-chest-metal-light {
  fill: #e3fbff;
}

.loot-chest-diamond-outline {
  fill: #0b2639;
}

.loot-chest-diamond-dark {
  fill: #187da1;
}

.loot-chest-diamond {
  fill: #54d5f5;
}

.loot-chest-diamond-light {
  fill: #d7f7ff;
}

.loot-treasure-chest--energy .loot-chest-outline {
  fill: #25143a;
}

.loot-treasure-chest--energy .loot-chest-wood-dark {
  fill: #3f1b63;
}

.loot-treasure-chest--energy .loot-chest-wood {
  fill: #6d33a3;
}

.loot-treasure-chest--energy .loot-chest-wood-light {
  fill: #ad6ee5;
}

.loot-treasure-chest--energy .loot-chest-metal-dark {
  fill: #8a5708;
}

.loot-treasure-chest--energy .loot-chest-metal {
  fill: #f7c948;
}

.loot-treasure-chest--energy .loot-chest-metal-light {
  fill: #fff0a6;
}

.loot-chest-energy-outline {
  fill: #291d08;
}

.loot-chest-energy {
  fill: #ffd43b;
}

.loot-chest-energy-light {
  fill: #fff8c5;
}

.loot-chest-lid {
  transform-box: fill-box;
  transform-origin: center bottom;
}

.loot-treasure-reward {
  position: absolute;
  z-index: 1;
  top: -0.35rem;
  left: 50%;
  min-width: 2.2rem;
  padding: 3px 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  opacity: 0;
  color: #4a2b08;
  background: #fff0a6;
  border: 2px solid #3b2207;
  box-shadow: 2px 2px 0 #3b2207;
  font: 900 0.8rem/1 ui-monospace, "Cascadia Mono", monospace;
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-treasure-reward__coin {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: #f7c948;
  box-shadow: inset 2px 0 #ffe97a, inset -2px 0 #9a6500;
  clip-path: polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%);
}

.loot-treasure-reward--diamonds {
  color: #08384d;
  background: #d7f7ff;
  border-color: #0e4c67;
  box-shadow: 2px 2px 0 #0e4c67;
}

.loot-treasure-reward__gem {
  width: 11px;
  height: 11px;
  display: inline-block;
  background: #54d5f5;
  box-shadow: inset 2px 0 #d7f7ff, inset -2px -2px #187da1;
  clip-path: polygon(50% 0, 100% 35%, 75% 100%, 25% 100%, 0 35%);
}

.loot-treasure-reward--energy {
  color: #351553;
  background: #f3e8ff;
  border-color: #5b2585;
  box-shadow: 2px 2px 0 #5b2585;
}

.loot-treasure-reward__energy {
  width: 11px;
  height: 12px;
  display: inline-block;
  background: #ffd43b;
  box-shadow: inset 2px 0 #fff8c5, inset -2px -2px #b36a00;
  clip-path: polygon(55% 0, 100% 0, 65% 40%, 100% 40%, 25% 100%, 42% 55%, 0 55%);
}

.loot-treasure-requirement {
  position: absolute;
  z-index: 2;
  bottom: calc(100% + 6px);
  left: 50%;
  width: max-content;
  max-width: min(14rem, 80vw);
  padding: 4px 6px;
  color: #f8fafc;
  background: #172033;
  border: 2px solid #f7c948;
  box-shadow: 3px 3px 0 rgba(8, 15, 28, 0.45);
  font: 800 0.68rem/1.25 ui-monospace, "Cascadia Mono", monospace;
  text-align: center;
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-treasure-chest--diamonds .loot-treasure-requirement {
  border-color: #54d5f5;
}

.loot-treasure-chest--energy .loot-treasure-requirement {
  border-color: #ffd43b;
}

.loot-treasure-chest--waiting {
  animation: loot-treasure-waiting 360ms steps(4, end);
}

.loot-treasure-chest--opened {
  pointer-events: none;
  animation: loot-treasure-disappear 650ms steps(5, end) forwards;
}

.loot-treasure-chest--opened .loot-chest-lid {
  animation: loot-treasure-open-lid 420ms steps(4, end) forwards;
}

.loot-treasure-chest--opened .loot-treasure-reward {
  animation: loot-treasure-reward 600ms steps(5, end) forwards;
}

.loot-highscore-dialog {
  border: 0;
  border-radius: 1.25rem;
  padding: 0;
  color: CanvasText;
  background: Canvas;
  box-shadow: 0 1.25rem 4rem rgba(0, 0, 0, 0.35);
  overflow: visible;
}

.loot-highscore-dialog::backdrop {
  background: rgba(8, 15, 28, 0.58);
  backdrop-filter: blur(2px);
}

.loot-highscore-dialog[open] {
  animation: loot-highscore-in 180ms ease-out;
}

.loot-highscore-card {
  position: relative;
  min-width: min(18rem, calc(100vw - 3rem));
  padding: 2.25rem 2.5rem 2rem;
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  text-align: center;
}

.loot-highscore-close {
  position: absolute;
  top: 0.45rem;
  right: 0.55rem;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 999px;
  color: inherit;
  background: transparent;
  font: inherit;
  font-size: 1.55rem;
  line-height: 1;
  cursor: pointer;
}

.loot-highscore-close:hover,
.loot-highscore-close:focus-visible {
  background: color-mix(in srgb, CanvasText 12%, transparent);
  outline: none;
}

.loot-highscore-trophy {
  width: 5.5rem;
  height: 5.5rem;
  filter: drop-shadow(0 0.45rem 0.4rem rgba(0, 0, 0, 0.2));
}

.loot-highscore-points {
  margin: 0;
  font-size: clamp(1.65rem, 7vw, 2.35rem);
  font-weight: 750;
  letter-spacing: 0.015em;
  white-space: nowrap;
}

@keyframes loot-highscore-in {
  from { opacity: 0; transform: translateY(0.65rem) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes loot-achievement-in {
  from { opacity: 0; transform: translate(1.25rem, 0.6rem) scale(0.94); }
  to { opacity: 1; transform: translate(0, 0) scale(1); }
}

@keyframes loot-resource-insufficient {
  0%, 100% { transform: translateX(0); background: rgba(0, 0, 0, 0.22); }
  25% { transform: translateX(-0.2rem); background: rgba(190, 35, 45, 0.72); }
  75% { transform: translateX(0.2rem); background: rgba(190, 35, 45, 0.72); }
}

@keyframes loot-treasure-idle {
  0%, 45%, 100% { transform: translateY(0); }
  50%, 95% { transform: translateY(-2px); }
}

@keyframes loot-treasure-waiting {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

@keyframes loot-treasure-open-lid {
  from { transform: translateY(0) rotate(0); }
  to { transform: translateY(-8px) rotate(-8deg); }
}

@keyframes loot-treasure-reward {
  0% { opacity: 0; transform: translate(-50%, 0); }
  20%, 65% { opacity: 1; transform: translate(-50%, -12px); }
  100% { opacity: 0; transform: translate(-50%, -28px); }
}

@keyframes loot-treasure-disappear {
  0%, 55% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.5); }
}

@keyframes loot-magnifier-idle {
  0%, 42%, 100% { transform: translateY(0) rotate(0); }
  48%, 92% { transform: translateY(-2px) rotate(3deg); }
}

@keyframes loot-slide-portal-idle {
  0%, 40%, 100% { transform: translateY(0); }
  48%, 92% { transform: translateY(-3px); }
}

@keyframes loot-slide-portal-spark {
  0%, 45%, 100% { opacity: 0.3; }
  50%, 95% { opacity: 1; }
}

@keyframes loot-magnifier-collect {
  0%, 45% { opacity: 1; transform: scale(1) rotate(0); }
  68% { opacity: 1; transform: scale(1.14) rotate(-10deg); }
  100% { opacity: 0; transform: scale(0.42) rotate(18deg); }
}

@keyframes loot-magnifier-reward {
  0% { opacity: 0; transform: translate(-50%, 0); }
  20%, 65% { opacity: 1; transform: translate(-50%, -14px); }
  100% { opacity: 0; transform: translate(-50%, -30px); }
}

@keyframes loot-exploration-idle {
  0%, 42%, 100% { transform: translateY(0) rotate(0); }
  48%, 92% { transform: translateY(-2px) rotate(-2deg); }
}

@keyframes loot-exploration-collect {
  0%, 45% { opacity: 1; transform: scale(1) rotate(0); }
  68% { opacity: 1; transform: scale(1.14) rotate(-8deg); }
  100% { opacity: 0; transform: scale(0.42) rotate(14deg); }
}

@keyframes loot-exploration-reward {
  0% { opacity: 0; transform: translate(-50%, 0); }
  20%, 65% { opacity: 1; transform: translate(-50%, -14px); }
  100% { opacity: 0; transform: translate(-50%, -30px); }
}

@keyframes loot-soil-dig {
  0% { opacity: 1; transform: translate(0, 0) scale(1); }
  35% { opacity: 1; transform: translate(-4px, 2px) scale(0.94); }
  70% { opacity: 0.65; transform: translate(5px, 7px) scale(0.72); }
  100% { opacity: 0; transform: translate(10px, 14px) scale(0.35); }
}

@keyframes loot-plant-water {
  0%, 100% { transform: translateY(0) scale(1); }
  40% { transform: translateY(3px) scale(0.92, 1.08); }
  70% { transform: translateY(-4px) scale(1.08, 0.94); }
}

@keyframes loot-bloom-open {
  0% { opacity: 1; transform: scale(1) rotate(0); }
  55% { opacity: 1; transform: scale(1.14) rotate(4deg); }
  100% { opacity: 0; transform: scale(0.45) rotate(-8deg); }
}

@keyframes loot-magic-dust {
  0%, 100% { opacity: 0.1; transform: translate(0, 0); }
  35% { opacity: 0.18; transform: translate(1px, -1px); }
  70% { opacity: 0.13; transform: translate(-1px, 1px); }
}

@keyframes loot-key-idle {
  0%, 45%, 100% { transform: translateY(0) rotate(0); }
  50%, 95% { transform: translateY(-2px) rotate(2deg); }
}

@keyframes loot-key-collect {
  0%, 48% { opacity: 1; transform: scale(1) rotate(0); }
  70% { opacity: 1; transform: scale(1.12) rotate(-8deg); }
  100% { opacity: 0; transform: scale(0.45) rotate(12deg); }
}

@keyframes loot-key-reward {
  0% { opacity: 0; transform: translate(-50%, 0); }
  20%, 65% { opacity: 1; transform: translate(-50%, -12px); }
  100% { opacity: 0; transform: translate(-50%, -26px); }
}

@keyframes loot-object-lock-missing {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

@keyframes loot-object-lock-open {
  0%, 55% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.55); }
}

@keyframes loot-object-lock-shackle {
  from { transform: translate(0, 0) rotate(0); }
  to { transform: translate(-2px, -5px) rotate(-18deg); }
}

@media (max-width: 63.9375rem) {
  .loot-object-lock-button--fill {
    padding: 0.25rem 0.75rem;
    justify-content: flex-start;
    gap: 0.55rem;
  }

  .loot-object-lock-button--fill .loot-object-lock-label {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    overflow: visible;
    clip: auto;
  }

}

@media (max-width: 36rem) {
  .loot-resource-bar {
    max-width: calc(100vw - 0.5rem);
    gap: 0.35rem;
  }

  .loot-key-inventory {
    gap: 0.25rem;
  }

  .loot-key-inventory__list {
    max-width: 45vw;
  }

  .loot-puzzle-inventory__list {
    max-width: 48vw;
  }

  .loot-puzzle-gate {
    padding: 0.65rem 0.7rem 0.85rem;
  }

  .loot-puzzle-gate__frame {
    min-height: 7.5rem;
    padding: 1.8rem 0.65rem 0.7rem;
    border-width: 0.45rem;
    border-bottom-width: 0.65rem;
  }

  .loot-puzzle-gate__grid {
    grid-template-columns:
      repeat(var(--loot-puzzle-columns), minmax(44px, 3.2rem));
  }

  .loot-puzzle-gate__slot {
    width: 3.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loot-achievement__card--visible { animation: none; }
  .loot-highscore-dialog[open] { animation: none; }
  .loot-resource--insufficient { animation: none; }
  .loot-treasure-chest { animation: none; }
  .loot-treasure-chest--waiting { animation: none; }
  .loot-treasure-chest--opened { opacity: 0; }
  .loot-key-pickup { animation: none; }
  .loot-key-pickup--collected { opacity: 0; }
  .loot-puzzle-pickup { animation: none; }
  .loot-puzzle-pickup--collected { opacity: 0; }
  .loot-puzzle-gate__doors > span { transition: none; }
  .loot-magnifier-pickup { animation: none; }
  .loot-magnifier-pickup--collected { opacity: 0; }
  .loot-exploration-pickup,
  .loot-reveal-cover { animation: none; }
  .loot-exploration-pickup--collected,
  .loot-reveal-layer--digging > .loot-reveal-layer__cover,
  .loot-reveal-layer--opening > .loot-reveal-layer__cover { opacity: 0; }
  .loot-reveal-layer--watering > .loot-reveal-layer__cover { animation: none; }
  .loot-slide-portal { animation: none; }
  .loot-slide-portal__spark { animation: none; }
  .loot-magnifier-secret--dust::after { animation: none; }
  .loot-object-lock-button--missing { animation: none; }
  .loot-object-lock-button--unlocking { opacity: 0; animation: none; }
  .loot-object-lock-button--unlocking .loot-object-lock-shackle-outline,
  .loot-object-lock-button--unlocking .loot-object-lock-shackle { animation: none; }
}

@media (forced-colors: active) {
  .loot-puzzle-gate,
  .loot-puzzle-gate__slot,
  .loot-puzzle-inventory__piece {
    border-color: CanvasText;
  }

  .loot-puzzle-piece__body,
  .loot-puzzle-piece__highlight {
    fill: Canvas;
    stroke: CanvasText;
  }

  .loot-puzzle-piece__number {
    fill: CanvasText;
    stroke: Canvas;
  }
}
`

export function injectStyles(documentRoot: Document = document): void {
  for (const candidate of templateDocumentCandidates(documentRoot)) {
    if (candidate.getElementById(STYLE_ID)) continue
    const style = candidate.createElement("style")
    style.id = STYLE_ID
    style.textContent = CSS
    candidate.head?.appendChild(style)
  }
}
