const STYLE_ID = "lia-loot-highscore-style"

const CSS = `
lia-loot-secret-slide {
  display: none !important;
}

.lia-toc__link.loot-secret-slide-link:not(.loot-secret-slide-link--found) {
  display: none !important;
}

.lia-toc__link.loot-secret-slide-link--found {
  display: block !important;
}

html.loot-secret-slide-discovering main.lia-slide__content,
html.loot-secret-slide-discovering .lia-pagination,
html.loot-secret-slide-discovering #lia-toc .lia-toc__content,
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
  font-size: 16px;
  pointer-events: none;
}

.loot-achievement__card {
  position: relative;
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

.loot-achievement--visible .loot-achievement__card {
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

.loot-object-lock-button--floating {
  position: fixed;
  z-index: 2147482000;
  inset: auto;
  min-width: 0;
  min-height: 0;
  padding: 0;
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

lia-loot-key {
  min-width: 4.5rem;
  min-height: 3.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-key:empty {
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

.loot-key-graphic {
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

.loot-treasure-chest-graphic {
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
}

@media (prefers-reduced-motion: reduce) {
  .loot-achievement--visible .loot-achievement__card { animation: none; }
  .loot-highscore-dialog[open] { animation: none; }
  .loot-resource--insufficient { animation: none; }
  .loot-treasure-chest { animation: none; }
  .loot-treasure-chest--waiting { animation: none; }
  .loot-treasure-chest--opened { opacity: 0; }
  .loot-key-pickup { animation: none; }
  .loot-key-pickup--collected { opacity: 0; }
  .loot-object-lock-button--missing { animation: none; }
  .loot-object-lock-button--unlocking { opacity: 0; animation: none; }
  .loot-object-lock-button--unlocking .loot-object-lock-shackle-outline,
  .loot-object-lock-button--unlocking .loot-object-lock-shackle { animation: none; }
}
`

export function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = CSS
  document.head.appendChild(style)
}
