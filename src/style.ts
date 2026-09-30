import darknessCloudAsymmetricUrl from "data-url:./assets/darkness-cloud-puff-asymmetric-v4.png"
import darknessCloudRoundUrl from "data-url:./assets/darkness-cloud-puff-round-v3.png"
import darknessCloudUrl from "data-url:./assets/darkness-cloud-puff-v1.png"
import darknessCloudWideUrl from "data-url:./assets/darkness-cloud-puff-wide-v2.png"

import { templateDocumentCandidates } from "./template-targets.ts"

const STYLE_ID = "lia-loot-highscore-style"
const DARKNESS_CLOUD_URL = darknessCloudUrl
const DARKNESS_CLOUD_WIDE_URL = darknessCloudWideUrl
const DARKNESS_CLOUD_ROUND_URL = darknessCloudRoundUrl
const DARKNESS_CLOUD_ASYMMETRIC_URL = darknessCloudAsymmetricUrl

const CSS = `
lia-loot-gift {
  min-width: 5.8rem;
  min-height: 5.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-gift[hidden] {
  display: none !important;
}

lia-loot-gift[data-loot-gift-state="opened"] {
  min-width: 0;
  min-height: 0;
}

.loot-gift-button {
  appearance: none;
  position: relative;
  width: 5.8rem;
  height: 5.2rem;
  min-width: 44px;
  min-height: 44px;
  margin: 0.2rem;
  padding: 0.2rem;
  display: inline-grid;
  place-items: center;
  overflow: visible;
  color: inherit;
  background: radial-gradient(
    circle at 50% 52%,
    rgba(247, 201, 72, 0.22),
    transparent 64%
  );
  border: 0;
  border-radius: 0.75rem;
  filter: drop-shadow(4px 5px 0 rgba(8, 15, 28, 0.28));
  cursor: pointer;
  box-sizing: border-box;
  image-rendering: pixelated;
  -webkit-tap-highlight-color: transparent;
}

.loot-gift-button:hover:not(:disabled),
.loot-gift-button:focus-visible {
  background: radial-gradient(
    circle at 50% 52%,
    rgba(247, 201, 72, 0.42),
    transparent 66%
  );
  outline: 3px solid #f7c948;
  outline-offset: 2px;
  transform: translateY(-2px);
}

.loot-gift-button:disabled {
  cursor: default;
}

.loot-gift-graphic {
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-gift-shadow { fill: rgba(8, 15, 28, 0.32); }
.loot-gift-outline { fill: #172033; }
.loot-gift-paper { fill: #d94b58; }
.loot-gift-paper-dark { fill: #9d293d; }
.loot-gift-paper-light { fill: #f06a6d; }
.loot-gift-ribbon { fill: #f7c948; }
.loot-gift-ribbon-light { fill: #fff0a6; }
.loot-gift-shine { fill: #ffadb0; }

lia-loot-gift[data-loot-gift-state="opening"] .loot-gift-button {
  animation: loot-gift-open 720ms steps(6, end) forwards;
}

lia-loot-gift[data-loot-gift-state="opening"] .loot-gift-lid,
lia-loot-gift[data-loot-gift-state="opening"] .loot-gift-bow {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-gift-lid 720ms steps(6, end) forwards;
}

lia-loot-gift[data-loot-gift-state="opening"] .loot-gift-box {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-gift-box 720ms steps(6, end) forwards;
}

[data-loot-gift-content]:not([hidden]) {
  display: inline;
}

[data-loot-gift-renderer][hidden] {
  display: none !important;
}

[data-loot-gift-renderer]:not([hidden]) {
  display: inline;
}

@keyframes loot-gift-open {
  0%, 18% { opacity: 1; transform: translateY(0) rotate(0); }
  28% { opacity: 1; transform: translateY(1px) rotate(-3deg); }
  38% { opacity: 1; transform: translateY(0) rotate(3deg); }
  52% { opacity: 1; transform: translateY(1px) rotate(-2deg); }
  78% { opacity: 1; transform: translateY(0) rotate(0); }
  100% { opacity: 0; transform: translateY(7px) scale(0.82); }
}

@keyframes loot-gift-lid {
  0%, 48% { opacity: 1; transform: translate(0, 0) rotate(0); }
  64% { opacity: 1; transform: translate(-3px, -12px) rotate(-8deg); }
  82% { opacity: 1; transform: translate(8px, -25px) rotate(18deg); }
  100% { opacity: 0; transform: translate(15px, -34px) rotate(28deg); }
}

@keyframes loot-gift-box {
  0%, 72% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.82, 0.68); }
}

lia-loot-wood-crate {
  min-width: 8.6rem;
  min-height: 7.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-wood-crate[hidden] {
  display: none !important;
}

lia-loot-wood-crate[data-loot-wood-crate-state="broken"] {
  min-width: 0;
  min-height: 0;
}

.loot-wood-crate-button {
  appearance: none;
  position: relative;
  width: 8.6rem;
  height: 7.4rem;
  min-width: 44px;
  min-height: 44px;
  margin: 0.2rem;
  padding: 0;
  display: inline-grid;
  place-items: center;
  overflow: visible;
  color: inherit;
  background: transparent;
  border: 0;
  border-radius: 0;
  filter: drop-shadow(5px 6px 0 rgba(8, 15, 28, 0.34));
  cursor: pointer;
  box-sizing: border-box;
  image-rendering: pixelated;
  -webkit-tap-highlight-color: transparent;
}

.loot-wood-crate-button:hover:not(:disabled),
.loot-wood-crate-button:focus-visible {
  background: rgba(210, 138, 59, 0.12);
  outline: 3px solid #e1a14b;
  outline-offset: 2px;
  transform: translateY(-2px);
}

.loot-wood-crate-button:disabled {
  cursor: default;
}

.loot-wood-crate-graphic {
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-wood-crate-strike-tool {
  position: absolute;
  z-index: 2;
  top: -1.25rem;
  right: -0.15rem;
  width: 4.8rem;
  height: 4.8rem;
  opacity: 0;
  pointer-events: none;
  transform: rotate(18deg);
  transform-origin: 74% 92%;
}

.loot-wood-crate-shadow { fill: rgba(8, 15, 28, 0.34); }
.loot-wood-crate-outline { fill: #332113; }
.loot-wood-crate-dark { fill: #633817; }
.loot-wood-crate-plank { fill: #bc712d; }
.loot-wood-crate-side { fill: #8f4d1f; }
.loot-wood-crate-side-panel { fill: #a75c25; }
.loot-wood-crate-light { fill: #e7a34b; }
.loot-wood-crate-top-panel { fill: #c77a31; }
.loot-wood-crate-frame-light { fill: #d9903d; }
.loot-wood-crate-brace-light { fill: #ad6427; }
.loot-wood-crate-grain { fill: rgba(97, 53, 22, 0.42); }
.loot-wood-crate-stamp {
  fill: rgba(48, 30, 17, 0.7);
  font: 900 9px/1 ui-monospace, "Cascadia Mono", monospace;
  letter-spacing: 1px;
}
.loot-wood-crate-crack,
.loot-wood-crate-hole {
  opacity: 0;
  fill: #2b1a10;
}
.loot-wood-crate-nail { fill: #b8c2cf; }
.loot-wood-crate-splinters {
  fill: #d38b3d;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="1"],
  [data-loot-wood-crate-damage="2"],
  [data-loot-wood-crate-damage="3"],
  [data-loot-wood-crate-damage="4"],
  [data-loot-wood-crate-damage="5"],
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-crack--1,
lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="2"],
  [data-loot-wood-crate-damage="3"],
  [data-loot-wood-crate-damage="4"],
  [data-loot-wood-crate-damage="5"],
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-crack--2,
lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="3"],
  [data-loot-wood-crate-damage="4"],
  [data-loot-wood-crate-damage="5"],
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-crack--3,
lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="4"],
  [data-loot-wood-crate-damage="5"],
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-crack--4,
lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="5"],
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-crack--5,
lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-crack--6,
lia-loot-wood-crate[data-loot-wood-crate-damage="7"]
  .loot-wood-crate-crack--7,
lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="4"],
  [data-loot-wood-crate-damage="5"],
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-hole--4,
lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-hole--6 {
  opacity: 1;
}

lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="4"],
  [data-loot-wood-crate-damage="5"],
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-stamp {
  opacity: 0.42;
}

lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="5"],
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-plank--middle {
  transform-box: fill-box;
  transform-origin: center;
  transform: translate(1px, 2px) rotate(0.7deg);
}

lia-loot-wood-crate:is(
  [data-loot-wood-crate-damage="6"],
  [data-loot-wood-crate-damage="7"]
) .loot-wood-crate-brace {
  opacity: 0.78;
}

lia-loot-wood-crate[data-loot-wood-crate-damage="7"]
  .loot-wood-crate-plank--top {
  transform-box: fill-box;
  transform-origin: center;
  transform: translate(-2px, 2px) rotate(-1deg);
}

lia-loot-wood-crate[data-loot-wood-crate-state="striking"]
  .loot-wood-crate-button {
  animation: loot-wood-crate-hit 440ms steps(5, end);
}

lia-loot-wood-crate[data-loot-wood-crate-state="striking"]
  .loot-wood-crate-body {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-wood-crate-hit-body 440ms steps(5, end);
}

lia-loot-wood-crate[data-loot-wood-crate-state="striking"]
  .loot-wood-crate-splinters {
  animation: loot-wood-crate-hit-splinters 440ms steps(5, end);
}

lia-loot-wood-crate[data-loot-wood-crate-state="striking"]
  .loot-wood-crate-strike-tool {
  animation: loot-wood-crate-axe-strike 440ms steps(5, end);
}

lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
  .loot-wood-crate-button {
  animation: loot-wood-crate-break 920ms steps(7, end) forwards;
}

lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
  .loot-wood-crate-body {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-wood-crate-body 920ms steps(7, end) forwards;
}

lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
  .loot-wood-crate-plank--top {
  transform-box: fill-box;
  transform-origin: center;
  animation: loot-wood-crate-top-plank 920ms steps(7, end) forwards;
}

lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
  .loot-wood-crate-plank--middle {
  transform-box: fill-box;
  transform-origin: center;
  animation: loot-wood-crate-middle-plank 920ms steps(7, end) forwards;
}

lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
  .loot-wood-crate-splinters {
  animation: loot-wood-crate-splinters 920ms steps(7, end) forwards;
}

lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
  .loot-wood-crate-strike-tool {
  animation: loot-wood-crate-axe-strike 440ms steps(5, end) forwards;
}

[data-loot-wood-crate-renderer][hidden] {
  display: none !important;
}

[data-loot-wood-crate-renderer]:not([hidden]) {
  display: inline;
}

@keyframes loot-wood-crate-break {
  0%, 78% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(8px) scale(0.78, 0.62); }
}

@keyframes loot-wood-crate-hit {
  0%, 100% { filter: drop-shadow(4px 5px 0 rgba(8, 15, 28, 0.3)); }
  48% { filter: drop-shadow(7px 7px 0 rgba(8, 15, 28, 0.38)); }
}

@keyframes loot-wood-crate-hit-body {
  0%, 18%, 100% { transform: translate(0, 0) rotate(0); }
  42% { transform: translate(-4px, 1px) rotate(-1.5deg); }
  66% { transform: translate(3px, 0) rotate(1deg); }
}

@keyframes loot-wood-crate-hit-splinters {
  0%, 28% { opacity: 0; transform: scale(0.4); }
  46%, 70% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.35); }
}

@keyframes loot-wood-crate-body {
  0%, 16% { transform: translate(0, 0) rotate(0); }
  25% { transform: translate(-3px, 1px) rotate(-2deg); }
  34% { transform: translate(3px, 0) rotate(2deg); }
  46% { transform: translate(-2px, 2px) rotate(-1deg); }
  62%, 100% { transform: translate(0, 5px) scale(0.9, 0.72); }
}

@keyframes loot-wood-crate-top-plank {
  0%, 35% { opacity: 1; transform: translate(0, 0) rotate(0); }
  58% { opacity: 1; transform: translate(-12px, -17px) rotate(-14deg); }
  100% { opacity: 0; transform: translate(-29px, -31px) rotate(-28deg); }
}

@keyframes loot-wood-crate-middle-plank {
  0%, 38% { opacity: 1; transform: translate(0, 0) rotate(0); }
  62% { opacity: 1; transform: translate(13px, -10px) rotate(12deg); }
  100% { opacity: 0; transform: translate(31px, -20px) rotate(25deg); }
}

@keyframes loot-wood-crate-splinters {
  0%, 34% { opacity: 0; transform: scale(0.35); }
  42%, 62% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(1.8); }
}

@keyframes loot-wood-crate-axe-strike {
  0%, 8% { opacity: 0; transform: translate(8px, -8px) rotate(18deg); }
  14% { opacity: 1; transform: translate(6px, -6px) rotate(18deg); }
  48% { opacity: 1; transform: translate(0, 0) rotate(-58deg); }
  62% { opacity: 1; transform: translate(1px, -1px) rotate(-49deg); }
  100% { opacity: 0; transform: translate(9px, -10px) rotate(15deg); }
}

lia-loot-cat-food {
  min-width: 5.8rem;
  min-height: 5.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-cat-food:empty,
lia-loot-cat-food[hidden],
[data-loot-cat-food-renderer][hidden] {
  display: none !important;
}

.loot-cat-food-graphic {
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-cat-food-shadow { fill: rgba(8, 15, 28, 0.34); }
.loot-cat-food-outline { fill: #172033; }
.loot-cat-food-fish-body { fill: #d9d7c7; }
.loot-cat-food-fish-light { fill: #fff4d1; }
.loot-cat-food-fish-eye { fill: #172033; }
.loot-cat-food-bowl-dark { fill: #8b2f28; }
.loot-cat-food-bowl-main { fill: #d64d3d; }
.loot-cat-food-bowl-light { fill: #ff8a62; }
.loot-cat-food-pellet { fill: #74401f; }
.loot-cat-food-label { fill: #fff0a6; }

.loot-cat-food-pickup {
  appearance: none;
  position: relative;
  width: 5.8rem;
  height: 5.2rem;
  min-width: 44px;
  min-height: 44px;
  margin: 0.2rem;
  padding: 0.18rem;
  display: inline-grid;
  place-items: center;
  overflow: visible;
  color: inherit;
  background:
    radial-gradient(circle at 50% 55%, rgba(255, 224, 112, 0.34), transparent 64%);
  border: 0;
  border-radius: 0.75rem;
  filter: drop-shadow(4px 5px 0 rgba(8, 15, 28, 0.32));
  box-sizing: border-box;
  cursor: pointer;
  image-rendering: pixelated;
  -webkit-tap-highlight-color: transparent;
}

.loot-cat-food-pickup:hover:not(:disabled),
.loot-cat-food-pickup:focus-visible {
  background:
    radial-gradient(circle at 50% 55%, rgba(255, 224, 112, 0.56), transparent 66%);
  outline: 3px solid #f7c948;
  outline-offset: 2px;
  transform: translateY(-2px);
}

.loot-cat-food-pickup:disabled { cursor: default; }

.loot-cat-food-pickup__reward {
  position: absolute;
  z-index: 2;
  top: -0.2rem;
  left: 50%;
  padding: 0.2rem 0.34rem;
  opacity: 0;
  color: #172033;
  background: #ffe070;
  border: 2px solid #8b5b00;
  box-shadow: 2px 2px 0 #51340f;
  font: 900 0.62rem/1 ui-monospace, "Cascadia Mono", monospace;
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-cat-food-pickup--collected {
  pointer-events: none;
  animation: loot-cat-food-collect 620ms steps(5, end) forwards;
}

.loot-cat-food-pickup--collected .loot-cat-food-pickup__reward {
  animation: loot-cat-food-reward 580ms steps(5, end) forwards;
}

lia-loot-cat {
  min-width: 6.4rem;
  min-height: 6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-cat:empty,
lia-loot-cat[hidden] {
  display: none !important;
}

.loot-cat-graphic {
  --loot-cat-outline: #172033;
  --loot-cat-fur: #c9822e;
  --loot-cat-fur-dark: #85451f;
  --loot-cat-fur-light: #f1c982;
  --loot-cat-stripe: #6f351b;
  --loot-cat-marking: #9a5424;
  --loot-cat-whisker: #fff0c9;
  --loot-cat-paw: #f8dfaa;
  --loot-cat-paw-detail: #b96e2b;
  --loot-cat-collar: #27b8bb;
  --loot-cat-collar-light: #8ef3ee;
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-cat-graphic[data-cat-collar="red"],
.loot-cat-collar-graphic[data-cat-collar="red"] {
  --loot-cat-collar: #e44747;
  --loot-cat-collar-light: #ff9a8f;
}

.loot-cat-graphic[data-cat-collar="blue"],
.loot-cat-collar-graphic[data-cat-collar="blue"] {
  --loot-cat-collar: #3f83e8;
  --loot-cat-collar-light: #9bd2ff;
}

.loot-cat-graphic[data-cat-collar="green"],
.loot-cat-collar-graphic[data-cat-collar="green"] {
  --loot-cat-collar: #36a85b;
  --loot-cat-collar-light: #9aeca8;
}

.loot-cat-graphic[data-cat-collar="yellow"],
.loot-cat-collar-graphic[data-cat-collar="yellow"] {
  --loot-cat-collar: #f4c542;
  --loot-cat-collar-light: #fff0a0;
}

.loot-cat-graphic[data-cat-collar="purple"],
.loot-cat-collar-graphic[data-cat-collar="purple"] {
  --loot-cat-collar: #8f5ad6;
  --loot-cat-collar-light: #cfadff;
}

.loot-cat-graphic[data-cat-collar="orange"],
.loot-cat-collar-graphic[data-cat-collar="orange"] {
  --loot-cat-collar: #e9822f;
  --loot-cat-collar-light: #ffc07a;
}

.loot-cat-graphic[data-cat-collar="magenta"],
.loot-cat-collar-graphic[data-cat-collar="magenta"] {
  --loot-cat-collar: #d94db7;
  --loot-cat-collar-light: #ff9de4;
}

.loot-cat-graphic[data-cat-collar="white"],
.loot-cat-collar-graphic[data-cat-collar="white"] {
  --loot-cat-collar: #f2eee5;
  --loot-cat-collar-light: #ffffff;
}

.loot-cat-graphic[data-cat-collar="black"],
.loot-cat-collar-graphic[data-cat-collar="black"] {
  --loot-cat-collar: #252b37;
  --loot-cat-collar-light: #687080;
}

.loot-cat-graphic[data-cat-collar="turquoise"],
.loot-cat-collar-graphic[data-cat-collar="turquoise"] {
  --loot-cat-collar: #27b8bb;
  --loot-cat-collar-light: #8ef3ee;
}

.loot-cat-graphic[data-cat-collar="gray"],
.loot-cat-collar-graphic[data-cat-collar="gray"] {
  --loot-cat-collar: #7b8794;
  --loot-cat-collar-light: #c4ccd4;
}

.loot-cat-graphic[data-cat-collar="brown"],
.loot-cat-collar-graphic[data-cat-collar="brown"] {
  --loot-cat-collar: #8c5520;
  --loot-cat-collar-light: #d69a45;
}

.loot-cat-graphic[data-cat-variant="grey"] {
  --loot-cat-fur: #919ba8;
  --loot-cat-fur-dark: #596575;
  --loot-cat-fur-light: #d8dde3;
  --loot-cat-stripe: #424b59;
  --loot-cat-marking: #697483;
  --loot-cat-whisker: #f5f0e7;
  --loot-cat-paw: #ded4cb;
  --loot-cat-paw-detail: #8a7771;
}

.loot-cat-graphic[data-cat-variant="black"] {
  --loot-cat-fur: #343b49;
  --loot-cat-fur-dark: #171c27;
  --loot-cat-fur-light: #8f99a6;
  --loot-cat-stripe: #0d121c;
  --loot-cat-marking: #252b37;
  --loot-cat-whisker: #e7e2d9;
  --loot-cat-paw: #aab1bc;
  --loot-cat-paw-detail: #5e6673;
}

.loot-cat-graphic[data-cat-variant="white"] {
  --loot-cat-fur: #eeeae2;
  --loot-cat-fur-dark: #b9b4ad;
  --loot-cat-fur-light: #fffaf0;
  --loot-cat-stripe: #918b84;
  --loot-cat-marking: #d2cbc1;
  --loot-cat-whisker: #756f6a;
  --loot-cat-paw: #ead8d3;
  --loot-cat-paw-detail: #ad8d8b;
}

.loot-cat-graphic[data-cat-variant="calico"] {
  --loot-cat-fur: #eee3cf;
  --loot-cat-fur-dark: #3d3a43;
  --loot-cat-fur-light: #fff5df;
  --loot-cat-stripe: #aa4f25;
  --loot-cat-marking: #ce7136;
  --loot-cat-whisker: #f9f2e4;
  --loot-cat-paw: #e9d1bd;
  --loot-cat-paw-detail: #a55d48;
}

.loot-cat-shadow { fill: rgba(8, 15, 28, 0.34); }
.loot-cat-outline { fill: var(--loot-cat-outline); }
.loot-cat-fur { fill: var(--loot-cat-fur); }
.loot-cat-fur-dark { fill: var(--loot-cat-fur-dark); }
.loot-cat-fur-light { fill: var(--loot-cat-fur-light); }
.loot-cat-stripe { fill: var(--loot-cat-stripe); }
.loot-cat-ear { fill: #e79079; }
.loot-cat-eye,
.loot-cat-mouth,
.loot-cat-sleep-eye { fill: #172033; }
.loot-cat-eye-light { fill: #d9fbff; }
.loot-cat-eye-glint { fill: #ffffff; }
.loot-cat-pupil { fill: #070c16; }
.loot-cat-yawn-eye,
.loot-cat-yawn-mouth { fill: #172033; }
.loot-cat-yawn-palate { fill: #7e3045; }
.loot-cat-yawn-fang { fill: #fff4d1; }
.loot-cat-yawn-tongue { fill: #e79079; }
.loot-cat-nose { fill: #c84f63; }
.loot-cat-marking { fill: var(--loot-cat-marking); }
.loot-cat-whisker { fill: var(--loot-cat-whisker); }
.loot-cat-collar,
.loot-cat-tag { visibility: hidden; }
.loot-cat-graphic[data-cat-collar] .loot-cat-collar,
.loot-cat-graphic[data-cat-collar] .loot-cat-tag { visibility: visible; }
.loot-cat-collar { fill: var(--loot-cat-collar); }
.loot-cat-tag { fill: #f7c948; }
.loot-cat-paw { fill: var(--loot-cat-paw); }
.loot-cat-paw-detail { fill: var(--loot-cat-paw-detail); }

.loot-cat-collar-graphic {
  --loot-cat-collar: #27b8bb;
  --loot-cat-collar-light: #8ef3ee;
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-cat-collar-icon-shadow { fill: rgba(8, 15, 28, 0.3); }
.loot-cat-collar-icon-outline,
.loot-cat-collar-icon-tag-outline { fill: #172033; }
.loot-cat-collar-icon-band { fill: var(--loot-cat-collar); }
.loot-cat-collar-icon-light { fill: var(--loot-cat-collar-light); }
.loot-cat-collar-icon-tag { fill: #f7c948; }

.loot-cat-pose--sleeping {
  display: none;
}

.loot-cat-yawn-face {
  display: none;
}

.loot-cat-doze-eyes {
  display: none;
}

.loot-cat-pickup {
  appearance: none;
  position: relative;
  width: 6.4rem;
  height: 6rem;
  min-width: 44px;
  min-height: 44px;
  margin: 0.2rem;
  padding: 0.22rem;
  display: inline-grid;
  place-items: center;
  overflow: visible;
  color: inherit;
  background:
    radial-gradient(circle at 50% 48%, rgba(255, 226, 151, 0.32), transparent 62%);
  border: 0;
  border-radius: 0.8rem;
  filter: drop-shadow(4px 5px 0 rgba(8, 15, 28, 0.32));
  box-sizing: border-box;
  cursor: pointer;
  image-rendering: pixelated;
  -webkit-tap-highlight-color: transparent;
}

.loot-cat-pickup:hover:not(:disabled),
.loot-cat-pickup:focus-visible {
  background:
    radial-gradient(circle at 50% 48%, rgba(255, 226, 151, 0.5), transparent 64%);
  outline: 3px solid #f7c948;
  outline-offset: 2px;
  transform: translateY(-2px);
}

.loot-cat-pickup:disabled {
  cursor: default;
}

.loot-cat-pickup__reward {
  position: absolute;
  z-index: 2;
  top: -0.2rem;
  left: 50%;
  padding: 0.2rem 0.34rem;
  opacity: 0;
  color: #172033;
  background: #ffe070;
  border: 2px solid #8b5b00;
  box-shadow: 2px 2px 0 #51340f;
  font: 900 0.62rem/1 ui-monospace, "Cascadia Mono", monospace;
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-cat-pickup--collected {
  pointer-events: none;
  animation: loot-cat-collect 620ms steps(5, end) forwards;
}

.loot-cat-pickup--collected .loot-cat-pickup__reward {
  animation: loot-cat-reward 580ms steps(5, end) forwards;
}

.loot-cat-companion {
  appearance: none;
  position: fixed;
  z-index: 2147482600;
  right: max(0.8rem, env(safe-area-inset-right));
  bottom: calc(max(0.65rem, env(safe-area-inset-bottom)) + 3.25rem);
  width: clamp(8.25rem, 10.5vw, 11.5rem);
  height: clamp(7.55rem, 9.5vw, 10.5rem);
  min-width: 82px;
  min-height: 75px;
  margin: 0;
  padding: 0;
  display: grid;
  place-items: center;
  overflow: visible;
  color: #fff3c4;
  background: transparent;
  border: 0;
  filter: drop-shadow(5px 6px 0 rgba(8, 15, 28, 0.32));
  box-sizing: border-box;
  cursor: pointer;
  image-rendering: pixelated;
  transform: translateZ(0);
  -webkit-tap-highlight-color: transparent;
}

.loot-cat-companion:hover {
  filter:
    brightness(1.06)
    drop-shadow(5px 6px 0 rgba(8, 15, 28, 0.36));
}

.loot-cat-companion:focus-visible {
  outline: 3px solid #f7c948;
  outline-offset: 3px;
  border-radius: 0.55rem;
}

.loot-cat-food-cursor {
  position: fixed;
  z-index: 2147483647;
  top: 0;
  left: 0;
  width: 2.25rem;
  height: 1.85rem;
  display: none;
  pointer-events: none;
  contain: layout paint style;
  will-change: transform;
  image-rendering: pixelated;
}

.loot-cat-food-cursor[hidden] {
  display: none !important;
}

.loot-cat-food-cursor > .loot-cat-food-graphic {
  width: 100%;
  height: 100%;
  filter: drop-shadow(2px 2px 0 rgba(8, 15, 28, 0.45));
}

@media (any-hover: hover) and (any-pointer: fine) {
  html[data-loot-active-cat-food] body,
  html[data-loot-active-cat-food] .loot-cat-companion {
    cursor: none !important;
  }

  .loot-cat-food-cursor:not([hidden]) {
    display: block;
  }
}

.loot-cat-companion__food {
  position: absolute;
  z-index: 3;
  left: 2%;
  bottom: -1%;
  width: 48%;
  height: 44%;
  opacity: 0;
  pointer-events: none;
  transform: translate(-18px, 8px) scale(0.7);
}

.loot-cat-companion__status {
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

.loot-cat-companion__sleep {
  position: absolute;
  z-index: 2;
  top: 0.05rem;
  right: 0.35rem;
  display: none;
  align-items: end;
  gap: 0.08rem;
  color: #fff2a8;
  text-shadow: 2px 2px 0 #172033;
  font: 900 1.25rem/1 ui-monospace, "Cascadia Mono", monospace;
  pointer-events: none;
}

.loot-cat-companion__sleep span:nth-child(1) { font-size: 1.1em; }
.loot-cat-companion__sleep span:nth-child(2) { font-size: 0.82em; }
.loot-cat-companion__sleep span:nth-child(3) { font-size: 0.64em; }

.loot-cat-companion__message {
  position: absolute;
  z-index: 3;
  right: 18%;
  bottom: calc(100% - 0.15rem);
  width: max-content;
  max-width: min(16rem, 72vw);
  padding: 0.52rem 0.68rem;
  opacity: 0;
  color: #172033;
  background: #fff8d9;
  border: 3px solid #172033;
  border-radius: 0.75rem 0.75rem 0.12rem 0.75rem;
  box-shadow: 4px 4px 0 rgba(8, 15, 28, 0.28);
  font: 800 clamp(0.78rem, 1.4vw, 0.96rem)/1.25 system-ui, sans-serif;
  text-align: left;
  transform: translateY(0.5rem) scale(0.92);
  transform-origin: right bottom;
  transition: opacity 140ms ease-out, transform 140ms ease-out;
  pointer-events: none;
}

.loot-cat-companion__reward-icon {
  width: 1.4rem;
  height: 1.4rem;
  flex: 0 0 auto;
}

.loot-cat-companion__message:has(.loot-cat-companion__reward-icon) {
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
}

.loot-cat-companion__message::after {
  content: "";
  position: absolute;
  right: 0.65rem;
  bottom: -0.58rem;
  width: 0.8rem;
  height: 0.8rem;
  background: #fff8d9;
  border-right: 3px solid #172033;
  border-bottom: 3px solid #172033;
  transform: skewY(35deg);
}

.loot-cat-companion[data-cat-message-visible="true"] .loot-cat-companion__message {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.loot-cat-companion[data-cat-state="idle"] .loot-cat-head {
  transform-box: fill-box;
  transform-origin: center bottom;
  transform:
    translate(
      var(--loot-cat-head-x, 0px),
      var(--loot-cat-head-y, 0px)
    )
    rotate(var(--loot-cat-head-angle, 0deg));
}

.loot-cat-companion[data-cat-state="idle"] .loot-cat-pupil {
  transform-box: fill-box;
  transform:
    translate(
      var(--loot-cat-pupil-x, 0px),
      var(--loot-cat-pupil-y, 0px)
    );
}

.loot-cat-companion[data-cat-state="idle"] .loot-cat-tail {
  transform-box: fill-box;
  transform-origin: left bottom;
  animation: loot-cat-tail 3.4s steps(3, end) infinite;
}

.loot-cat-companion[data-cat-state="idle"] .loot-cat-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: loot-cat-blink 5.2s linear infinite;
}

.loot-cat-companion[data-cat-state="nodding"] .loot-cat-head {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-cat-nod 760ms steps(5, end);
}

.loot-cat-companion[data-cat-state="jumping"] .loot-cat-graphic {
  animation: loot-cat-jump 900ms steps(7, end);
}

.loot-cat-companion[data-cat-state="eating"] .loot-cat-head {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-cat-eat-head 1400ms steps(7, end);
}

.loot-cat-companion[data-cat-state="eating"] .loot-cat-torso {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-cat-eat-body 1400ms steps(7, end);
}

.loot-cat-companion[data-cat-state="eating"] .loot-cat-companion__food {
  animation: loot-cat-food-offer 1400ms steps(7, end);
}

.loot-cat-companion[data-cat-state="yawning"] .loot-cat-head {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-cat-yawn 1800ms steps(6, end);
}

.loot-cat-companion[data-cat-state="yawning"] :is(
  .loot-cat-eyes,
  .loot-cat-mouth
) {
  display: none;
}

.loot-cat-companion[data-cat-state="yawning"] .loot-cat-yawn-face {
  display: block;
}

.loot-cat-companion[data-cat-state="yawning"] .loot-cat-yawn-jaw {
  transform-box: fill-box;
  transform-origin: center top;
  animation: loot-cat-yawn-jaw 1800ms steps(5, end);
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-pose--sitting,
.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-pose--sitting,
.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-pose--sleeping,
.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-pose--sleeping {
  display: block;
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-pose--sitting .loot-cat-head {
  animation: loot-cat-lower-head 2000ms steps(8, end) both;
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-torso {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-cat-lower-torso 2000ms steps(7, end) both;
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-tail {
  animation: loot-cat-lower-tail 2000ms steps(5, end) both;
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-sit-paws {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-cat-stretch-paws 2000ms steps(5, end) both;
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-pose--sitting .loot-cat-eyes {
  animation: loot-cat-hide-open-eyes 2000ms steps(1, end) both;
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-doze-eyes {
  display: block;
  animation: loot-cat-show-doze-eyes 2000ms steps(1, end) both;
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-sleep-body {
  animation: loot-cat-reveal-sleep-body 2000ms steps(6, end) both;
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-sleep-head {
  animation: loot-cat-reveal-sleep-head 2000ms steps(5, end) both;
}

.loot-cat-companion[data-cat-state="lying-down"] .loot-cat-sleep-paws {
  animation: loot-cat-reveal-sleep-paws 2000ms steps(4, end) both;
}

.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-pose--sitting .loot-cat-head {
  animation: loot-cat-lower-head 2000ms steps(8, end) reverse both;
}

.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-torso {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-cat-lower-torso 2000ms steps(7, end) reverse both;
}

.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-tail {
  animation: loot-cat-lower-tail 2000ms steps(5, end) reverse both;
}

.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-sit-paws {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: loot-cat-stretch-paws 2000ms steps(5, end) reverse both;
}

.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-pose--sitting .loot-cat-eyes {
  animation: loot-cat-hide-open-eyes 2000ms steps(1, end) reverse both;
}

.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-doze-eyes {
  display: block;
  animation: loot-cat-show-doze-eyes 2000ms steps(1, end) reverse both;
}

.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-sleep-body {
  animation: loot-cat-reveal-sleep-body 2000ms steps(6, end) reverse both;
}

.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-sleep-head {
  animation: loot-cat-reveal-sleep-head 2000ms steps(5, end) reverse both;
}

.loot-cat-companion[data-cat-state="standing-up"] .loot-cat-sleep-paws {
  animation: loot-cat-reveal-sleep-paws 2000ms steps(4, end) reverse both;
}

.loot-cat-companion:is(
  [data-cat-state="lying-down"],
  [data-cat-state="standing-up"]
) :is(
  .loot-cat-sleep-body,
  .loot-cat-sleep-head,
  .loot-cat-sleep-paws
) {
  transform-box: fill-box;
  transform-origin: center bottom;
}

.loot-cat-companion[data-cat-state="sleeping"] .loot-cat-pose--sitting {
  display: none;
}

.loot-cat-companion[data-cat-state="sleeping"] .loot-cat-pose--sleeping {
  display: block;
}

.loot-cat-companion[data-cat-state="sleeping"] .loot-cat-companion__sleep {
  display: flex;
  animation: loot-cat-sleep-marks 1.8s steps(3, end) infinite;
}

body.loot-cat-owned .loot-achievement {
  bottom: calc(max(1rem, env(safe-area-inset-bottom)) + 14rem);
}

@keyframes loot-cat-collect {
  0%, 45% { opacity: 1; transform: scale(1); }
  68% { opacity: 1; transform: scale(1.14); }
  100% { opacity: 0; transform: scale(0.45) translate(42vw, 30vh); }
}

@keyframes loot-cat-food-collect {
  0%, 45% { opacity: 1; transform: scale(1); }
  68% { opacity: 1; transform: scale(1.14); }
  100% { opacity: 0; transform: scale(0.72); }
}

@keyframes loot-cat-food-reward {
  0% { opacity: 0; transform: translate(-50%, 0); }
  18%, 68% { opacity: 1; transform: translate(-50%, -14px); }
  100% { opacity: 0; transform: translate(-50%, -27px); }
}

@keyframes loot-cat-reward {
  0% { opacity: 0; transform: translate(-50%, 0); }
  18%, 68% { opacity: 1; transform: translate(-50%, -14px); }
  100% { opacity: 0; transform: translate(-50%, -27px); }
}

@keyframes loot-cat-nod {
  0%, 100% { transform: translateY(0) rotate(0); }
  25%, 65% { transform: translateY(5px) rotate(2deg); }
  45%, 82% { transform: translateY(1px) rotate(-1deg); }
}

@keyframes loot-cat-jump {
  0%, 100% { transform: translateY(0) rotate(0); }
  20% { transform: translateY(3px) scaleX(1.05) scaleY(0.94); }
  42% { transform: translateY(-24px) rotate(-4deg); }
  62% { transform: translateY(-16px) rotate(4deg); }
  82% { transform: translateY(2px) scaleX(1.06) scaleY(0.93); }
}

@keyframes loot-cat-eat-head {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  15% { transform: translate(-5px, 7px) rotate(-6deg); }
  28%, 48%, 68% { transform: translate(-6px, 10px) rotate(-8deg); }
  38%, 58%, 78% { transform: translate(-5px, 6px) rotate(-5deg); }
  88% { transform: translate(-2px, 2px) rotate(-2deg); }
}

@keyframes loot-cat-eat-body {
  0%, 100% { transform: translate(0, 0) scale(1); }
  16%, 82% { transform: translate(-1px, 2px) scale(1.02, 0.98); }
  34%, 66% { transform: translate(-1px, 3px) scale(1.03, 0.97); }
}

@keyframes loot-cat-food-offer {
  0% { opacity: 0; transform: translate(-18px, 8px) scale(0.7); }
  12%, 72% { opacity: 1; transform: translate(0, 0) scale(1); }
  84% { opacity: 1; transform: translate(4px, 3px) scale(0.84); }
  100% { opacity: 0; transform: translate(8px, 5px) scale(0.55); }
}

@keyframes loot-cat-yawn {
  0%, 100% { transform: translateY(0) rotate(0); }
  16% { transform: translateY(1px) rotate(0); }
  36%, 74% { transform: translateY(-3px) rotate(-2deg); }
  88% { transform: translateY(-1px) rotate(-1deg); }
}

@keyframes loot-cat-yawn-jaw {
  0%, 100% { transform: translateY(-1px) scaleY(0.22); }
  20% { transform: translateY(0) scaleY(0.55); }
  38%, 74% { transform: translateY(0) scaleY(1); }
  88% { transform: translateY(-1px) scaleY(0.48); }
}

@keyframes loot-cat-lower-head {
  0%, 24% {
    opacity: 1;
    transform: translate(0, 0) scale(1) rotate(0);
  }
  36% {
    opacity: 1;
    transform: translate(-1px, 4px) scale(0.98) rotate(-1deg);
  }
  48% {
    opacity: 1;
    transform: translate(-2px, 10px) scale(0.95) rotate(-2deg);
  }
  58% {
    opacity: 1;
    transform: translate(-4px, 18px) scale(0.9) rotate(-3deg);
  }
  68.9% {
    opacity: 1;
    transform: translate(-6px, 25px) scale(0.86, 0.88) rotate(-3deg);
  }
  69%, 100% {
    opacity: 0;
    transform: translate(-6px, 25px) scale(0.86, 0.88) rotate(-3deg);
  }
}

@keyframes loot-cat-lower-torso {
  0%, 14% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  26% { opacity: 1; transform: translate(0, 2px) scale(1.02, 0.97); }
  38% { opacity: 1; transform: translate(1px, 4px) scale(1.04, 0.92); }
  50% { opacity: 1; transform: translate(1px, 7px) scale(1.06, 0.86); }
  57.9% {
    opacity: 1;
    transform: translate(2px, 9px) scale(1.08, 0.82);
  }
  58%, 100% {
    opacity: 0;
    transform: translate(2px, 9px) scale(1.08, 0.82);
  }
}

@keyframes loot-cat-stretch-paws {
  0%, 28% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  42% { opacity: 1; transform: translate(-2px, 1px) scale(1.03, 0.96); }
  57.9% {
    opacity: 1;
    transform: translate(-4px, 1px) scale(1.06, 0.9);
  }
  58%, 100% {
    opacity: 0;
    transform: translate(-4px, 1px) scale(1.06, 0.9);
  }
}

@keyframes loot-cat-hide-open-eyes {
  0%, 57.9% { opacity: 1; }
  58%, 100% { opacity: 0; }
}

@keyframes loot-cat-show-doze-eyes {
  0%, 57.9% { opacity: 0; }
  58%, 100% { opacity: 1; }
}

@keyframes loot-cat-lower-tail {
  0%, 5% {
    opacity: 1;
    transform: translate(0, 0) rotate(0);
  }
  16% { opacity: 1; transform: translate(1px, 2px) rotate(5deg); }
  28% { opacity: 1; transform: translate(2px, 6px) rotate(11deg); }
  39.9% {
    opacity: 1;
    transform: translate(3px, 10px) rotate(17deg);
  }
  40%, 100% {
    opacity: 0;
    transform: translate(3px, 10px) rotate(17deg);
  }
}

@keyframes loot-cat-reveal-sleep-body {
  0%, 55.9% {
    opacity: 0;
    transform: translate(3px, 7px) scale(0.94, 0.82);
  }
  56% {
    opacity: 1;
    transform: translate(3px, 7px) scale(0.94, 0.82);
  }
  72% { opacity: 1; transform: translate(1px, 3px) scale(1.02, 0.93); }
  88%, 100% { opacity: 1; transform: translate(0, 0) scale(1); }
}

@keyframes loot-cat-reveal-sleep-head {
  0%, 68.9% {
    opacity: 0;
    transform: translate(2px, -1px) scale(0.98, 0.92);
  }
  69% {
    opacity: 1;
    transform: translate(2px, -1px) scale(0.98, 0.92);
  }
  84% { opacity: 1; transform: translate(1px, 1px) scale(1.02, 0.97); }
  100% { opacity: 1; transform: translate(0, 0) scale(1); }
}

@keyframes loot-cat-reveal-sleep-paws {
  0%, 57.9% {
    opacity: 0;
    transform: translate(2px, 3px) scale(0.96, 0.86);
  }
  58% {
    opacity: 1;
    transform: translate(2px, 3px) scale(0.96, 0.86);
  }
  78%, 100% { opacity: 1; transform: translate(0, 0) scale(1); }
}

@keyframes loot-cat-tail {
  0%, 55%, 100% { transform: rotate(0); }
  68% { transform: rotate(-7deg); }
  82% { transform: rotate(5deg); }
}

@keyframes loot-cat-blink {
  0%, 89%, 95%, 100% { transform: scaleY(1); }
  91.5%, 93% { transform: scaleY(0.08); }
}

@keyframes loot-cat-sleep-marks {
  0% { opacity: 0.35; transform: translate(0, 3px); }
  50% { opacity: 1; }
  100% { opacity: 0.35; transform: translate(2px, -3px); }
}

@media (max-width: 36rem) {
  .loot-cat-companion {
    right: max(0.35rem, env(safe-area-inset-right));
    bottom: calc(max(0.35rem, env(safe-area-inset-bottom)) + 3.25rem);
    width: 7.8rem;
    height: 7.2rem;
  }

  body.loot-cat-owned .loot-achievement {
    bottom: calc(max(0.5rem, env(safe-area-inset-bottom)) + 12rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  lia-loot-gift[data-loot-gift-state="opening"] .loot-gift-button,
  lia-loot-gift[data-loot-gift-state="opening"] .loot-gift-lid,
  lia-loot-gift[data-loot-gift-state="opening"] .loot-gift-bow,
  lia-loot-gift[data-loot-gift-state="opening"] .loot-gift-box,
  lia-loot-wood-crate[data-loot-wood-crate-state="striking"]
    .loot-wood-crate-button,
  lia-loot-wood-crate[data-loot-wood-crate-state="striking"]
    .loot-wood-crate-body,
  lia-loot-wood-crate[data-loot-wood-crate-state="striking"]
    .loot-wood-crate-splinters,
  lia-loot-wood-crate[data-loot-wood-crate-state="striking"]
    .loot-wood-crate-strike-tool,
  lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
    .loot-wood-crate-button,
  lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
    .loot-wood-crate-body,
  lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
    .loot-wood-crate-plank--top,
  lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
    .loot-wood-crate-plank--middle,
  lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
    .loot-wood-crate-splinters,
  lia-loot-wood-crate[data-loot-wood-crate-state="breaking"]
    .loot-wood-crate-strike-tool,
  .loot-cat-pickup--collected,
  .loot-cat-pickup--collected .loot-cat-pickup__reward,
  .loot-cat-food-pickup--collected,
  .loot-cat-food-pickup--collected .loot-cat-food-pickup__reward,
  .loot-cat-companion .loot-cat-tail,
  .loot-cat-companion .loot-cat-torso,
  .loot-cat-companion .loot-cat-sit-paws,
  .loot-cat-companion .loot-cat-eyes,
  .loot-cat-companion .loot-cat-doze-eyes,
  .loot-cat-companion .loot-cat-ear,
  .loot-cat-companion .loot-cat-head,
  .loot-cat-companion .loot-cat-pose,
  .loot-cat-companion .loot-cat-yawn-jaw,
  .loot-cat-companion .loot-cat-sleep-body,
  .loot-cat-companion .loot-cat-sleep-paws,
  .loot-cat-companion .loot-cat-graphic,
  .loot-cat-companion__sleep,
  .loot-cat-companion__food,
  .loot-cat-companion__message {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
  }
}

lia-loot-shop {
  display: inline-block;
  max-width: 100%;
  margin: 0.35rem 0;
  vertical-align: middle;
}

.loot-shop-building-button {
  appearance: none;
  position: relative;
  width: 6.6rem;
  min-width: 6.6rem;
  height: 5.9rem;
  margin: 0;
  padding: 0.2rem;
  color: #fff7d1;
  background: transparent;
  border: 0;
  border-radius: 0.55rem;
  cursor: pointer;
  image-rendering: pixelated;
}

.loot-shop-building-button:hover,
.loot-shop-building-button:focus-visible {
  background: rgba(247, 201, 72, 0.12);
  outline: 3px solid #f7c948;
  outline-offset: 2px;
}

.loot-shop-building-button:disabled {
  cursor: not-allowed;
  filter: grayscale(0.85);
  opacity: 0.55;
}

.loot-shop-building {
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(4px 5px 2px rgba(6, 9, 16, 0.38));
}

.loot-shop-shadow { fill: rgba(6, 9, 16, 0.45); }
.loot-shop-outline,
.loot-shop-roof-outline,
.loot-shop-sign-outline,
.loot-shop-window-outline,
.loot-shop-door-outline { fill: #172033; }
.loot-shop-wall { fill: #c9853e; }
.loot-shop-wall-light { fill: #f1bd67; }
.loot-shop-roof { fill: #a42d3f; }
.loot-shop-roof-light { fill: #df5361; }
.loot-shop-sign { fill: #f7c948; }
.loot-shop-sign-coin { fill: #9a6500; }
.loot-shop-window { fill: #54d5f5; }
.loot-shop-window-light { fill: #d7f7ff; }
.loot-shop-door { fill: #704226; }
.loot-shop-handle { fill: #f7c948; }

.loot-shop-building-label {
  position: absolute;
  left: 50%;
  bottom: 0.15rem;
  padding: 0.08rem 0.35rem;
  transform: translateX(-50%);
  color: #172033;
  background: #f7c948;
  border: 2px solid #172033;
  border-radius: 0.15rem;
  box-shadow: 2px 2px 0 rgba(6, 9, 16, 0.35);
  font: 900 0.66rem/1.1 ui-monospace, "Cascadia Mono", monospace;
  letter-spacing: 0.08em;
}

body.loot-shop-open {
  overflow: hidden;
}

.loot-shop-overlay {
  position: fixed;
  z-index: 2147483200;
  inset: 0;
  display: grid;
  place-items: center;
  padding: max(1em, env(safe-area-inset-top))
    max(1em, env(safe-area-inset-right))
    max(1em, env(safe-area-inset-bottom))
    max(1em, env(safe-area-inset-left));
  background: rgba(8, 15, 28, 0.68);
  backdrop-filter: blur(3px);
  box-sizing: border-box;
  font: 400 clamp(16px, calc(0.45vw + 8px), 22px)/1.4 system-ui, sans-serif;
}

.loot-shop-dialog {
  --loot-shop-panel: #172033;
  --loot-shop-panel-soft: #202c44;
  --loot-shop-line: rgba(219, 229, 244, 0.2);
  position: relative;
  width: min(90vw, 96em);
  max-height: min(52em, calc(100vh - 2em));
  max-height: min(52em, calc(100dvh - 2em));
  overflow: auto;
  overscroll-behavior: contain;
  color: #f8fafc;
  background: linear-gradient(145deg, #1b263a, var(--loot-shop-panel));
  border: 1px solid var(--loot-shop-line);
  border-radius: 1em;
  box-shadow:
    0 1.4em 4em rgba(3, 7, 18, 0.56),
    0 0 0 1px rgba(8, 15, 28, 0.72);
  box-sizing: border-box;
  scrollbar-color: #7b879a transparent;
}

.loot-shop-dialog::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  left: 1em;
  right: 1em;
  height: 4px;
  background: linear-gradient(90deg, transparent, #f7c948 12% 88%, transparent);
  pointer-events: none;
}

.loot-shop-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  padding: 1.15em 1.25em 0.3em;
}

.loot-shop-dialog__header h2 {
  margin: 0;
  color: #ffe070;
  font: 900 clamp(1.15em, 2.6vw, 1.45em)/1.15 ui-monospace, "Cascadia Mono", monospace;
  letter-spacing: 0.035em;
}

.loot-shop-dialog__header h2::before {
  content: "";
  display: inline-block;
  width: 0.55em;
  height: 0.55em;
  margin-right: 0.55em;
  background: #f7c948;
  border: 2px solid #8b5b00;
  box-shadow: 2px 2px 0 rgba(8, 15, 28, 0.7);
  transform: translateY(-0.05em) rotate(45deg);
}

.loot-shop-dialog__close {
  appearance: none;
  position: relative;
  flex: 0 0 auto;
  width: 1.5em;
  height: 1.5em;
  display: block;
  overflow: hidden;
  padding: 0;
  color: #dbe5f4;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--loot-shop-line);
  border-radius: 999px;
  font: 700 1.55em/1 system-ui, sans-serif;
  text-indent: -9999px;
  cursor: pointer;
}

.loot-shop-dialog__close::before,
.loot-shop-dialog__close::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.66em;
  height: 0.11em;
  background: currentColor;
  border-radius: 999px;
  transform-origin: center;
}

.loot-shop-dialog__close::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.loot-shop-dialog__close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.loot-shop-dialog__close:hover,
.loot-shop-dialog__close:focus-visible {
  color: #172033;
  background: #f7c948;
  border-color: #fff0a6;
  outline: 2px solid #fff0a6;
  outline-offset: 2px;
}

.loot-shop-dialog__intro {
  margin: 0;
  padding: 0 1.25em;
  color: #aebbd0;
  font-size: 0.92em;
}

.loot-shop-balance {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
  min-height: 1.8em;
  margin: 0.85em 1.25em 0;
  color: #dbe5f4;
}

.loot-shop-balance__item,
.loot-shop-price {
  --loot-shop-accent: #94a3b8;
  display: inline-flex;
  align-items: center;
  gap: 0.38em;
  min-height: 1.6em;
  padding: 0.2em 0.52em;
  color: #eef3fb;
  background: rgba(8, 15, 28, 0.52);
  border: 1px solid color-mix(in srgb, var(--loot-shop-accent) 50%, #334155);
  border-radius: 999px;
  font: 800 0.72em/1 ui-monospace, "Cascadia Mono", monospace;
  white-space: nowrap;
}

.loot-shop-price--gold { --loot-shop-accent: #f7c948; }
.loot-shop-price--diamonds { --loot-shop-accent: #54d5f5; }
.loot-shop-price--energy { --loot-shop-accent: #ffd43b; }

.loot-shop-balance__item > .loot-resource-icon,
.loot-shop-price > .loot-resource-icon {
  width: 1.05em;
  height: 1.05em;
  flex: 0 0 auto;
}

.loot-shop-dialog__warning {
  margin: 0.85em 1.25em 0;
  padding: 0.55em 0.7em;
  color: #fff1f2;
  background: rgba(127, 29, 29, 0.38);
  border: 1px solid #fb7185;
  border-radius: 0.55em;
  font-size: 0.85em;
}

.loot-shop-offers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20em), 1fr));
  gap: 0.7em;
  padding: 1em 1.25em 1.25em;
}

.loot-shop-offer {
  min-width: 0;
  display: grid;
  grid-template-columns: 3.65em minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  gap: 0.65em 0.75em;
  padding: 0.8em;
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--loot-shop-line);
  border-radius: 0.75em;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
  box-sizing: border-box;
  transition: border-color 120ms ease, background 120ms ease;
}

.loot-shop-offer:focus-within,
.loot-shop-offer:hover {
  background: rgba(255, 255, 255, 0.055);
  border-color: rgba(247, 201, 72, 0.46);
}

.loot-shop-offer__icon {
  position: relative;
  grid-row: 1 / span 2;
  align-self: start;
  width: 3.65em;
  height: 3.65em;
  display: grid;
  place-items: center;
  background: rgba(8, 15, 28, 0.46);
  border: 1px solid rgba(174, 187, 208, 0.25);
  border-radius: 0.6em;
  box-sizing: border-box;
  image-rendering: pixelated;
}

.loot-shop-offer__icon svg {
  width: 3.05em;
  height: 3.05em;
  max-width: 100%;
  max-height: 100%;
}

.loot-shop-offer__icon--perk::after {
  content: "+";
  position: absolute;
  right: -0.28em;
  bottom: -0.28em;
  width: 1.25em;
  height: 1.25em;
  display: grid;
  place-items: center;
  color: #172033;
  background: #f7c948;
  border: 2px solid #172033;
  border-radius: 0.25em;
  box-shadow: 1px 1px 0 #8b5b00;
  font: 900 1em/1 ui-monospace, "Cascadia Mono", monospace;
  box-sizing: border-box;
}

.loot-shop-perk-graphic--energy-chest {
  width: 2.7em !important;
  height: 2.7em !important;
}

.loot-shop-offer__copy {
  min-width: 0;
}

.loot-shop-offer__copy h3 {
  margin: 0 0 0.22em;
  color: #fff4b8;
  font: 800 0.94em/1.22 system-ui, sans-serif;
}

.loot-shop-offer__copy p {
  margin: 0 0 0.5em;
  color: #b9c5d8;
  font-size: 0.78em;
  line-height: 1.38;
}

.loot-shop-offer__price {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
}

.loot-shop-offer__buy {
  appearance: none;
  grid-column: 2;
  justify-self: start;
  min-width: 7.25em;
  min-height: 2.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.72em;
  color: #172033;
  background: #f7c948;
  border: 2px solid #8b5b00;
  border-radius: 0.35em;
  box-shadow: 2px 2px 0 rgba(8, 15, 28, 0.58);
  font: 900 0.78em/1.2 ui-monospace, "Cascadia Mono", monospace;
  text-align: center;
  cursor: pointer;
}

.loot-shop-offer__buy:hover,
.loot-shop-offer__buy:focus-visible {
  background: #ffe070;
  border-color: #f7c948;
  outline: 2px solid #54d5f5;
  outline-offset: 2px;
}

.loot-shop-offer__buy:disabled {
  color: #8492a5;
  background: #263247;
  border-color: #46556d;
  box-shadow: none;
  cursor: not-allowed;
}

.loot-shop-dialog__status {
  margin: 0 1.25em 1.15em;
  padding: 0.55em 0.7em;
  color: #a7f3d0;
  background: rgba(16, 185, 129, 0.1);
  border-left: 3px solid #34d399;
  border-radius: 0.2em 0.5em 0.5em 0.2em;
  font-size: 0.84em;
  font-weight: 700;
}

.loot-shop-dialog__status:empty {
  display: none;
}

.loot-shop-product-graphic {
  fill: none;
  stroke: #172033;
  stroke-width: 3;
  stroke-linejoin: round;
}

.loot-shop-product-graphic--gold { fill: #f7c948; }
.loot-shop-product-graphic--diamonds { fill: #54d5f5; }
.loot-shop-product-graphic--energy { fill: #ffd43b; }

@media (max-width: 600px) {
  .loot-shop-overlay {
    padding: 0.5em;
  }

  .loot-shop-dialog {
    width: calc(100vw - 1em);
    max-height: calc(100vh - 1em);
    max-height: calc(100dvh - 1em);
    border-radius: 0.8em;
  }

  .loot-shop-dialog__header {
    padding: 1em 0.85em 0.25em;
  }

  .loot-shop-dialog__intro {
    padding-inline: 0.85em;
  }

  .loot-shop-balance,
  .loot-shop-dialog__warning {
    margin-inline: 0.85em;
  }

  .loot-shop-offers {
    grid-template-columns: minmax(0, 1fr);
    padding: 0.85em;
  }

  .loot-shop-dialog__status {
    margin-inline: 0.85em;
  }

  .loot-shop-offer {
    grid-template-columns: 3.35em minmax(0, 1fr);
  }

  .loot-shop-offer__icon {
    width: 3.35em;
    height: 3.35em;
  }
}

lia-loot-bonus {
  display: inline-block;
  min-width: 5.6rem;
  min-height: 5.35rem;
  vertical-align: middle;
}

lia-loot-bonus[hidden] {
  display: none !important;
}

.loot-bonus-pickup {
  appearance: none;
  position: relative;
  width: 5.6rem;
  height: 5.35rem;
  margin: 0.24rem;
  padding: 0.32rem;
  display: inline-grid;
  place-items: center;
  overflow: visible;
  color: #172033;
  background:
    radial-gradient(circle at 50% 40%, rgba(255, 233, 153, 0.96), rgba(213, 157, 57, 0.34) 54%, transparent 55%),
    transparent;
  border: 0;
  border-radius: 1rem;
  filter: drop-shadow(0 0.3rem 0.28rem rgba(4, 10, 20, 0.42));
  cursor: pointer;
  box-sizing: border-box;
}

.loot-bonus-pickup:hover,
.loot-bonus-pickup:focus-visible {
  background:
    radial-gradient(circle at 50% 40%, #fff2b9, rgba(244, 191, 72, 0.52) 57%, transparent 58%),
    transparent;
  outline: 3px solid #2dd4bf;
  outline-offset: 2px;
  transform: translateY(-2px);
}

.loot-bonus-pickup:disabled {
  cursor: default;
}

.loot-bonus-pickup__visual {
  position: relative;
  width: 4.45rem;
  height: 4.15rem;
  display: grid;
  place-items: center;
}

.loot-bonus-pickup__graphic {
  width: 3.85rem;
  height: 3.85rem;
  max-width: 100%;
  max-height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-bonus-pickup__visual > .loot-atlas-graphic {
  width: 4.25rem;
  height: 4.25rem;
}

.loot-bonus-pickup__chip {
  position: absolute;
  right: -0.3rem;
  bottom: -0.12rem;
  min-width: 2.35rem;
  padding: 0.24rem 0.36rem;
  color: #172033;
  background: #ffd24d;
  border: 2px solid #7f5616;
  border-radius: 0.32rem;
  box-shadow: 2px 2px 0 #51340f;
  font: 900 0.62rem/1 ui-monospace, "Cascadia Mono", monospace;
  letter-spacing: 0.035em;
  text-align: center;
  white-space: nowrap;
}

.loot-bonus-pickup__reward {
  position: absolute;
  top: -0.14rem;
  left: -0.06rem;
  padding: 0.2rem 0.34rem;
  color: #dcfffa;
  background: #0f766e;
  border: 2px solid #5eead4;
  border-radius: 0.3rem;
  box-shadow: 2px 2px 0 rgba(6, 78, 74, 0.62);
  font: 900 0.52rem/1 ui-monospace, "Cascadia Mono", monospace;
  letter-spacing: 0.045em;
  pointer-events: none;
}

.loot-bonus-pickup--collected {
  animation: loot-bonus-collected 620ms ease-in forwards;
}

@keyframes loot-bonus-collected {
  0% { opacity: 1; transform: scale(1); }
  42% { opacity: 1; transform: scale(1.16) rotate(-3deg); }
  100% { opacity: 0; transform: scale(0.35) translateY(-1.4rem); }
}

@media (prefers-reduced-motion: reduce) {
  .loot-bonus-pickup--collected {
    animation-duration: 1ms;
  }
}

body.loot-atlas-open {
  overflow: hidden;
}

.loot-atlas-graphic {
  overflow: visible;
  image-rendering: pixelated;
}

.loot-atlas-shadow { fill: rgba(5, 9, 17, 0.55); }
.loot-atlas-roll-dark { fill: #714316; }
.loot-atlas-paper { fill: #d6a85b; }
.loot-atlas-paper-light { fill: #f1d493; }
.loot-atlas-roll { fill: #b77727; }
.loot-atlas-roll-light { fill: #edc06a; }
.loot-atlas-map-line { fill: #765127; }
.loot-atlas-map-mark { fill: #9c2f32; }

.loot-atlas-tool {
  width: 2.3rem;
  min-width: 2.3rem;
  height: 2rem;
  padding: 0.08rem;
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  color: inherit;
  background: rgba(0, 0, 0, 0.22);
  border: 2px solid transparent;
  border-radius: 0.4rem;
  box-sizing: border-box;
  cursor: pointer;
}

.loot-atlas-tool:hover,
.loot-atlas-tool:focus-visible {
  background: rgba(214, 168, 91, 0.2);
  border-color: #edc06a;
  outline: 2px solid #f7e1ad;
  outline-offset: 1px;
}

.loot-atlas-tool .loot-atlas-graphic {
  width: 1.88rem;
  height: 1.88rem;
}

.loot-atlas-overlay {
  position: fixed;
  z-index: 2147483210;
  inset: 0;
  display: grid;
  place-items: center;
  padding: max(1rem, env(safe-area-inset-top))
    max(1rem, env(safe-area-inset-right))
    max(1rem, env(safe-area-inset-bottom))
    max(1rem, env(safe-area-inset-left));
  background: rgba(8, 15, 28, 0.72);
  backdrop-filter: blur(4px);
  box-sizing: border-box;
  font: 400 clamp(15px, calc(0.38vw + 9px), 20px)/1.42 system-ui, sans-serif;
}

.loot-atlas-dialog {
  position: relative;
  width: min(94vw, 88em);
  max-height: min(56em, calc(100vh - 2em));
  max-height: min(56em, calc(100dvh - 2em));
  overflow: auto;
  overscroll-behavior: contain;
  color: #3f2c18;
  background: #d8bd82;
  border: 1px solid #795421;
  border-radius: 0.8rem;
  box-shadow:
    0 1.5rem 5rem rgba(3, 7, 18, 0.62),
    0 0 0 4px rgba(78, 49, 17, 0.58),
    inset 0 0 2.2rem rgba(82, 52, 19, 0.2);
  box-sizing: border-box;
  scrollbar-color: #8b642f rgba(91, 58, 22, 0.12);
}

.loot-atlas-dialog::before {
  content: "";
  position: absolute;
  z-index: 4;
  top: 0.3rem;
  left: 1.2rem;
  right: 1.2rem;
  height: 0.38rem;
  background: linear-gradient(180deg, #bd8b42, #6f471b 52%, #b68138);
  border-radius: 999px;
  box-shadow: 0 1px 0 rgba(255, 235, 179, 0.58);
  pointer-events: none;
}

.loot-atlas-dialog__header {
  position: sticky;
  z-index: 3;
  top: 0;
  display: grid;
  grid-template-columns: 4.4em 1fr auto;
  align-items: center;
  gap: 0.85em;
  padding: 1.15em 1.2em 0.9em;
  background:
    linear-gradient(90deg, rgba(108, 73, 28, 0.08), transparent 12% 88%, rgba(108, 73, 28, 0.1)),
    linear-gradient(180deg, #ecd7a2 0%, #dfc48a 100%);
  border-bottom: 2px solid rgba(105, 73, 33, 0.58);
  box-shadow: 0 0.45rem 1rem rgba(73, 45, 16, 0.2);
}

.loot-atlas-dialog__emblem {
  width: 4.2em;
  height: 4.2em;
}

.loot-atlas-dialog__header h2,
.loot-atlas-dialog__header p {
  margin: 0;
}

.loot-atlas-dialog__header h2 {
  color: #493016;
  font: 900 clamp(1.35rem, 3vw, 2rem)/1.05 Georgia, "Times New Roman", serif;
  letter-spacing: 0.055em;
  text-shadow: 0 1px 0 rgba(255, 244, 207, 0.72);
}

.loot-atlas-dialog__header p {
  margin-top: 0.2em;
  color: #75572f;
  font-size: 0.86em;
}

.loot-atlas-dialog__close {
  appearance: none;
  position: relative;
  width: 2.6em;
  height: 2.6em;
  padding: 0;
  overflow: hidden;
  color: #513719;
  background: rgba(255, 244, 207, 0.42);
  border: 1px solid rgba(91, 60, 25, 0.48);
  border-radius: 999px;
  text-indent: -9999px;
  cursor: pointer;
}

.loot-atlas-dialog__close::before,
.loot-atlas-dialog__close::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.15em;
  height: 0.16em;
  background: currentColor;
  border-radius: 999px;
}

.loot-atlas-dialog__close::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.loot-atlas-dialog__close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.loot-atlas-dialog__close:hover,
.loot-atlas-dialog__close:focus-visible {
  color: #fff8df;
  background: #74451d;
  border-color: #4f3017;
  outline: 2px solid #a46e2c;
  outline-offset: 2px;
}

.loot-atlas-dialog__body {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18em, 0.46fr);
  gap: 0.9em;
  padding: 1em;
  background:
    radial-gradient(ellipse at 50% 45%, rgba(255, 244, 204, 0.26), transparent 63%),
    linear-gradient(90deg, rgba(104, 67, 25, 0.1), transparent 8% 92%, rgba(104, 67, 25, 0.12)),
    #d8bd82;
}

.loot-atlas-dialog__body::before {
  content: "";
  position: absolute;
  z-index: 0;
  inset: 0;
  opacity: 0.28;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 720'%3E%3Cg fill='none' stroke='%23634624' stroke-linecap='round'%3E%3Cpath d='M28 168 C142 62 246 232 382 142 S625 104 735 212 S986 285 1176 112' stroke-width='3' stroke-dasharray='5 14'/%3E%3Cpath d='M54 542 C190 448 282 606 430 506 S672 390 790 512 S1016 606 1160 476' stroke-width='2.5' stroke-dasharray='4 13'/%3E%3Cpath d='M914 44 C842 134 952 183 895 270 S806 420 925 485' stroke-width='2' stroke-dasharray='3 12'/%3E%3Cg stroke-width='1.4' opacity='.52'%3E%3Cellipse cx='170' cy='370' rx='128' ry='82'/%3E%3Cellipse cx='170' cy='370' rx='102' ry='63'/%3E%3Cellipse cx='1050' cy='385' rx='112' ry='74'/%3E%3Cellipse cx='1050' cy='385' rx='87' ry='53'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-position: center;
  background-size: cover;
  pointer-events: none;
}

.loot-atlas-dialog__body > * {
  position: relative;
  z-index: 1;
}

.loot-atlas-section,
.loot-atlas-locked {
  min-width: 0;
  padding: 0.85em;
  color: #3f2c18;
  background:
    linear-gradient(135deg, rgba(255, 247, 216, 0.8), rgba(231, 207, 151, 0.78));
  border: 1px solid rgba(100, 68, 29, 0.62);
  border-radius: 0.45rem;
  box-shadow:
    0 0.28rem 0.7rem rgba(76, 47, 16, 0.14),
    inset 0 0 0 1px rgba(255, 247, 217, 0.5);
  box-sizing: border-box;
}

.loot-atlas-dialog__body > .loot-atlas-section:first-child {
  grid-row: 1 / span 2;
}

.loot-atlas-section > h2,
.loot-atlas-locked > h3 {
  margin: 0 0 0.7rem;
  color: #53381b;
  font: 900 1em/1.2 Georgia, "Times New Roman", serif;
  letter-spacing: 0.055em;
}

.loot-atlas-section > h2::before,
.loot-atlas-locked > h3::before {
  content: "◆";
  display: inline-block;
  margin-right: 0.48em;
  color: #986426;
  font-size: 0.68em;
  transform: translateY(-0.08em) rotate(45deg);
}

.loot-atlas-achievements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  gap: 0.55em;
}

.loot-atlas-achievement {
  position: relative;
  min-width: 0;
  min-height: 4.15em;
  display: grid;
  grid-template-columns: 2.15em minmax(0, 1fr);
  align-items: center;
  gap: 0.65em;
  padding: 0.65em 0.7em;
  color: #3f2c18;
  background: rgba(255, 249, 226, 0.56);
  border: 1px dashed rgba(101, 72, 35, 0.72);
  border-radius: 0.32rem;
  box-shadow: 0 1px 0 rgba(255, 251, 232, 0.72);
  box-sizing: border-box;
}

.loot-atlas-achievement:nth-child(3n + 1) {
  transform: rotate(-0.18deg);
}

.loot-atlas-achievement:nth-child(3n) {
  transform: rotate(0.18deg);
}

.loot-atlas-achievement--complete {
  background: rgba(196, 220, 174, 0.62);
  border-color: rgba(49, 100, 65, 0.72);
}

.loot-atlas-achievement--absent {
  opacity: 0.58;
}

.loot-atlas-achievement__badge {
  width: 2.05em;
  height: 2.05em;
  display: grid;
  place-items: center;
  color: #684923;
  background: #ead5a0;
  border: 2px solid #86602d;
  border-radius: 50%;
  box-shadow:
    0 0 0 3px rgba(134, 96, 45, 0.16),
    inset 0 0 0 2px rgba(255, 246, 211, 0.48);
  font: 900 1.1rem/1 ui-monospace, monospace;
  box-sizing: border-box;
}

.loot-atlas-achievement--complete .loot-atlas-achievement__badge {
  color: #fff4d4;
  background: #3e7650;
  border-color: #285638;
  box-shadow:
    0 0 0 3px rgba(54, 110, 72, 0.18),
    inset 0 0 0 2px rgba(221, 240, 203, 0.36);
}

.loot-atlas-achievement h3,
.loot-atlas-achievement p {
  margin: 0;
}

.loot-atlas-achievement h3 {
  color: #3f2c18;
  font-family: system-ui, sans-serif;
  font-weight: 800;
  font-size: 0.84em;
  line-height: 1.22;
}

.loot-atlas-achievement p {
  margin-top: 0.2em;
  font-family: system-ui, sans-serif;
  color: #735837;
  font-size: 0.72em;
}

.loot-atlas-achievement__meter {
  grid-column: 1 / -1;
  height: 0.35em;
  overflow: hidden;
  background: repeating-linear-gradient(90deg, rgba(103, 72, 35, 0.45) 0 0.36em, transparent 0.36em 0.66em);
  border-radius: 999px;
}

.loot-atlas-achievement__meter > span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #6f4921, #b47b32);
  border-radius: inherit;
}

.loot-atlas-numbers {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
}

.loot-atlas-course-numbers::after {
  content: "KARTENLEGENDE";
  position: absolute;
  top: 0.95rem;
  right: 0.9rem;
  color: rgba(87, 58, 25, 0.62);
  font: 800 0.56em/1 ui-monospace, monospace;
  letter-spacing: 0.13em;
}

.loot-atlas-number {
  min-width: 0;
  padding: 0.55rem 0.6rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  background: rgba(255, 249, 226, 0.48);
  border-left: 3px solid #956026;
  border-bottom: 1px dotted rgba(96, 65, 29, 0.4);
  border-radius: 0.25rem 0.45rem 0.45rem 0.25rem;
}

.loot-atlas-number strong {
  color: #5c3b1b;
  font: 900 1.05em/1 ui-monospace, "Cascadia Mono", monospace;
}

.loot-atlas-number span {
  min-width: 0;
  color: #6a5033;
  font-size: 0.72em;
  line-height: 1.2;
}

.loot-atlas-locked {
  position: relative;
  overflow: hidden;
  color: #765c39;
  background:
    repeating-linear-gradient(135deg, rgba(127, 91, 47, 0.08) 0 10px, rgba(255, 247, 216, 0.28) 10px 20px),
    rgba(230, 207, 156, 0.8);
  border-style: dashed;
}

.loot-atlas-locked::after {
  content: "PERK";
  position: absolute;
  top: 0.65rem;
  right: 0.7rem;
  padding: 0.18rem 0.38rem;
  color: #fff3d0;
  background: #74491f;
  border-radius: 0.25rem;
  font: 900 0.62em/1 ui-monospace, monospace;
  letter-spacing: 0.08em;
}

.loot-atlas-locked p,
.loot-atlas-loading,
.loot-atlas-slide-complete {
  margin: 0;
  color: #725839;
  font-size: 0.82em;
}

.loot-atlas-slide-complete {
  padding: 0.65rem;
  color: #285a3a;
  background: rgba(187, 217, 166, 0.62);
  border-left: 3px solid #3e7650;
  border-radius: 0.25rem;
}

.loot-atlas-slide-info {
  min-height: 8.4em;
  padding-right: 5.25em;
}

.loot-atlas-slide-info::after {
  content: "✦";
  position: absolute;
  top: 50%;
  right: 1.05em;
  width: 3em;
  height: 3em;
  display: grid;
  place-items: center;
  color: #6d4921;
  background:
    linear-gradient(90deg, transparent 48%, rgba(92, 60, 25, 0.52) 48% 52%, transparent 52%),
    linear-gradient(transparent 48%, rgba(92, 60, 25, 0.52) 48% 52%, transparent 52%);
  border: 1px solid rgba(92, 60, 25, 0.68);
  border-radius: 50%;
  box-shadow: 0 0 0 0.28em rgba(92, 60, 25, 0.1);
  font: 900 1.35em/1 Georgia, serif;
  transform: translateY(-50%) rotate(12deg);
}

.loot-atlas-remaining {
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
  list-style: none;
}

.loot-atlas-remaining li {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.48rem 0.55rem;
  color: #4d371f;
  background: rgba(255, 249, 226, 0.52);
  border: 1px dotted rgba(96, 65, 29, 0.48);
  border-radius: 0.4rem;
  font-size: 0.74em;
}

.loot-atlas-remaining strong {
  min-width: 1.55rem;
  color: #5c3b1b;
  font: 900 1.05em/1 ui-monospace, monospace;
}

@media (max-width: 900px) {
  .loot-atlas-dialog__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .loot-atlas-dialog__body > .loot-atlas-section:first-child {
    grid-row: auto;
  }
}

@media (max-width: 600px) {
  .loot-atlas-overlay {
    padding: 0.5rem;
  }

  .loot-atlas-dialog {
    width: calc(100vw - 1rem);
    max-height: calc(100dvh - 1rem);
    border-radius: 0.8rem;
  }

  .loot-atlas-dialog__header {
    grid-template-columns: 3.35em 1fr auto;
    padding: 0.85em;
  }

  .loot-atlas-dialog__emblem {
    width: 3.25em;
    height: 3.25em;
  }

  .loot-atlas-dialog__body {
    padding: 0.7em;
  }

  .loot-atlas-achievements,
  .loot-atlas-numbers,
  .loot-atlas-remaining {
    grid-template-columns: minmax(0, 1fr);
  }

  .loot-atlas-slide-info {
    min-height: 0;
    padding-right: 0.85em;
  }

  .loot-atlas-slide-info::after {
    display: none;
  }
}

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

.loot-cat-food-inventory {
  display: flex;
  align-items: center;
}

.loot-cat-food-control {
  appearance: none;
  position: relative;
  width: 2.35rem;
  height: 2rem;
  min-width: 2.35rem;
  padding: 0.04rem;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: inherit;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.55rem;
  cursor: pointer;
  box-sizing: border-box;
  image-rendering: pixelated;
}

.loot-cat-food-control:hover,
.loot-cat-food-control:focus-visible {
  background: rgba(255, 207, 74, 0.18);
  border-color: #ffcf4a;
  outline: 2px solid #ffcf4a;
  outline-offset: 1px;
}

.loot-cat-food-control--active,
.loot-cat-food-control[aria-pressed="true"] {
  background: #fff0a6;
  border-color: #ffcf4a;
  box-shadow: inset 0 0 0 2px #8b5b00;
  outline: 2px solid #ffcf4a;
  outline-offset: 1px;
}

.loot-cat-food-control .loot-cat-food-graphic {
  width: 2.2rem;
  height: 1.8rem;
}

.loot-cat-food-control__count {
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 0.85rem;
  height: 0.85rem;
  padding: 0 0.12rem;
  display: grid;
  place-items: center;
  color: #172033;
  background: #ffcf4a;
  border: 1px solid #8b5b00;
  border-radius: 0.4rem;
  box-sizing: border-box;
  font: 900 0.58rem/0.8 ui-monospace, "Cascadia Mono", monospace;
  pointer-events: none;
}

.loot-cat-food-subbar {
  position: fixed;
  z-index: 1001;
  left: 50%;
  width: max-content;
  max-width: calc(100vw - 1rem);
  padding: 0.35rem;
  display: flex;
  align-items: stretch;
  gap: 0.35rem;
  overflow-x: auto;
  transform: translateX(-50%);
  color: #f8fafc;
  background: linear-gradient(90deg, #172033, #202c44);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.75rem;
  box-shadow: 0 0.35rem 0.9rem rgba(8, 15, 28, 0.28);
  box-sizing: border-box;
  font: 700 0.68rem/1.1 system-ui, sans-serif;
}

.loot-cat-food-subbar[hidden] {
  display: none;
}

.loot-cat-food-choice {
  appearance: none;
  width: 4.35rem;
  min-width: 4.35rem;
  min-height: 4rem;
  padding: 0.18rem 0.2rem 0.28rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.12rem;
  color: inherit;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid transparent;
  border-radius: 0.55rem;
  cursor: pointer;
  box-sizing: border-box;
}

.loot-cat-food-choice:hover,
.loot-cat-food-choice:focus-visible {
  background: rgba(255, 207, 74, 0.15);
  border-color: rgba(255, 207, 74, 0.72);
  outline: 0;
}

.loot-cat-food-choice[aria-pressed="true"] {
  color: #172033;
  background: #fff0a6;
  border-color: #ffcf4a;
}

.loot-cat-food-choice .loot-cat-food-graphic {
  width: 3rem;
  height: 2.65rem;
  flex: 0 0 auto;
}

.loot-cat-food-choice span {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loot-pet-control {
  appearance: none;
  width: 2.2rem;
  height: 2rem;
  min-width: 2.2rem;
  padding: 0.05rem;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: inherit;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.55rem;
  cursor: pointer;
  box-sizing: border-box;
}

.loot-pet-control:hover,
.loot-pet-control:focus-visible,
.loot-pet-control[aria-expanded="true"] {
  background: rgba(84, 213, 245, 0.2);
  border-color: #54d5f5;
  outline: 2px solid #54d5f5;
  outline-offset: 1px;
}

.loot-pet-control .loot-cat-graphic {
  width: 2rem;
  height: 1.85rem;
}

.loot-pet-subbar {
  position: fixed;
  z-index: 1001;
  left: 50%;
  width: max-content;
  max-width: calc(100vw - 1rem);
  padding: 0.35rem;
  display: flex;
  align-items: stretch;
  gap: 0.35rem;
  overflow-x: auto;
  transform: translateX(-50%);
  color: #f8fafc;
  background: linear-gradient(90deg, #172033, #202c44);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.75rem;
  box-shadow: 0 0.35rem 0.9rem rgba(8, 15, 28, 0.28);
  box-sizing: border-box;
  font: 700 0.68rem/1.1 system-ui, sans-serif;
}

.loot-pet-subbar[hidden] {
  display: none;
}

.loot-pet-subbar__divider {
  width: 2px;
  min-width: 2px;
  margin: 0.2rem 0.08rem;
  align-self: stretch;
  background: rgba(255, 255, 255, 0.24);
  box-shadow: 1px 0 0 rgba(8, 15, 28, 0.5);
}

.loot-pet-choice {
  appearance: none;
  width: 4.35rem;
  min-width: 4.35rem;
  min-height: 4rem;
  padding: 0.18rem 0.2rem 0.28rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.12rem;
  color: inherit;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid transparent;
  border-radius: 0.55rem;
  cursor: pointer;
  box-sizing: border-box;
}

.loot-pet-choice:hover,
.loot-pet-choice:focus-visible {
  background: rgba(84, 213, 245, 0.15);
  border-color: rgba(84, 213, 245, 0.72);
  outline: 0;
}

.loot-pet-choice[aria-pressed="true"] {
  color: #172033;
  background: #d9fbff;
  border-color: #54d5f5;
}

.loot-pet-choice--collar[aria-pressed="true"] {
  background: #fff0a6;
  border-color: #ffcf4a;
}

.loot-pet-choice .loot-cat-graphic {
  width: 2.75rem;
  height: 2.55rem;
  flex: 0 0 auto;
}

.loot-pet-choice span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
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

.loot-flashlight-tool {
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

.loot-flashlight-tool:hover,
.loot-flashlight-tool:focus-visible {
  background: rgba(255, 224, 112, 0.2);
  border-color: #ffe070;
  outline: 2px solid #fff5bf;
  outline-offset: 1px;
}

.loot-flashlight-tool--active {
  background: rgba(255, 224, 112, 0.28);
  border-color: #ffe070;
  box-shadow: 0 0 0 2px rgba(255, 224, 112, 0.22);
}

.loot-flashlight-tool .loot-flashlight-graphic {
  width: 1.85rem;
  height: 1.85rem;
}

.loot-flashlight-beam[hidden] {
  display: none !important;
}

.loot-flashlight-beam {
  --loot-flashlight-radius: 92px;
  position: fixed;
  z-index: 2147482499;
  left: 0;
  top: 0;
  width: calc(var(--loot-flashlight-radius) * 2);
  height: calc(var(--loot-flashlight-radius) * 2);
  border: 2px solid rgba(255, 239, 170, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle at 44% 42%,
    rgba(255, 253, 230, 0.14) 0 28%,
    rgba(255, 236, 158, 0.09) 56%,
    rgba(255, 220, 105, 0.035) 72%,
    transparent 78%
  );
  box-shadow:
    0 0 24px rgba(255, 224, 112, 0.24),
    inset 0 0 30px rgba(255, 246, 196, 0.16);
  box-sizing: border-box;
  pointer-events: none;
}

.loot-flashlight-pan {
  appearance: none;
  position: absolute;
  right: -2.15rem;
  bottom: -1.35rem;
  width: 4.6rem;
  height: 3.8rem;
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0;
  pointer-events: none;
  touch-action: none;
}

.loot-flashlight-beam--touch > .loot-flashlight-pan {
  pointer-events: auto;
  cursor: grab;
}

.loot-flashlight-pan--dragging { cursor: grabbing; }

.loot-flashlight-pan:focus-visible {
  outline: 3px solid #fff5bf;
  outline-offset: 2px;
}

.loot-flashlight-pan > .loot-flashlight-graphic {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(3px 4px 2px rgba(4, 6, 10, 0.42));
  transform: rotate(-42deg);
}

body.loot-flashlight-active { cursor: crosshair; }
body.loot-flashlight-active.loot-flashlight-touch { cursor: auto; }

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

.loot-magnifier-pan {
  appearance: none;
  position: absolute;
  right: -0.25rem;
  bottom: -0.25rem;
  width: 3rem;
  height: 3rem;
  margin: 0;
  padding: 0;
  color: inherit;
  background: transparent;
  border: 0;
  box-shadow: none;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.loot-magnifier-lens--touch > .loot-magnifier-pan {
  pointer-events: auto;
  cursor: grab;
}

.loot-magnifier-lens--touch > .loot-magnifier-pan--dragging {
  cursor: grabbing;
}

.loot-magnifier-pan:focus-visible {
  outline: 3px solid #d7f7ff;
  outline-offset: 2px;
}

.loot-magnifier-pan::after {
  content: "";
  position: absolute;
  left: 0.3rem;
  top: 0.85rem;
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

body.loot-magnifier-active.loot-magnifier-touch {
  cursor: auto;
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

lia-loot-fog-start,
lia-loot-fog-end {
  display: none !important;
}

lia-loot-fog:not([data-loot-fog-ready="true"]) {
  visibility: hidden;
}

lia-loot-fog {
  min-width: 1px;
  min-height: 1px;
  display: inline-block;
  vertical-align: baseline;
}

.loot-fog-target {
  --loot-flashlight-radius: 92px;
  --loot-flashlight-x: -9999px;
  --loot-flashlight-y: -9999px;
}

.loot-fog-target--range {
  -webkit-clip-path: circle(
    0 at var(--loot-flashlight-x) var(--loot-flashlight-y)
  );
  clip-path: circle(
    0 at var(--loot-flashlight-x) var(--loot-flashlight-y)
  );
}

body.loot-flashlight-active.loot-flashlight-pointing
  .loot-fog-target--range.loot-fog-target--under-beam {
  -webkit-clip-path: circle(
    calc(var(--loot-flashlight-radius) - 12px)
      at var(--loot-flashlight-x) var(--loot-flashlight-y)
  );
  clip-path: circle(
    calc(var(--loot-flashlight-radius) - 12px)
      at var(--loot-flashlight-x) var(--loot-flashlight-y)
  );
}

.loot-fog-overlay[hidden] {
  display: none !important;
}

.loot-fog-overlay {
  --loot-flashlight-radius: 92px;
  --loot-flashlight-x: -9999px;
  --loot-flashlight-y: -9999px;
  position: absolute;
  z-index: 2147482000;
  box-sizing: border-box;
  overflow: visible;
  isolation: isolate;
  border: 0;
  background: transparent;
  pointer-events: none;
  transform: translateZ(0);
}

.loot-fog-overlay-surface {
  position: relative;
}

.loot-fog-overlay::before,
.loot-fog-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-repeat: no-repeat;
}

.loot-fog-cloud {
  position: absolute;
  box-sizing: border-box;
  isolation: isolate;
  overflow: visible;
  background: transparent;
  pointer-events: none;
}

.loot-fog-cloud__puff {
  position: absolute;
  opacity: 0.88;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  filter:
    blur(0.9px)
    brightness(0.52)
    contrast(0.95);
  pointer-events: none;
  transform-origin: center;
  animation: loot-fog-puff-drift 12s ease-in-out infinite alternate;
}

.loot-fog-cloud__puff--variant-0 {
  background-image: url("${DARKNESS_CLOUD_URL}");
}

.loot-fog-cloud__puff--variant-1 {
  background-image: url("${DARKNESS_CLOUD_WIDE_URL}");
}

.loot-fog-cloud__puff--variant-2 {
  background-image: url("${DARKNESS_CLOUD_ROUND_URL}");
}

.loot-fog-cloud__puff--variant-3 {
  background-image: url("${DARKNESS_CLOUD_ASYMMETRIC_URL}");
}

.loot-fog-cloud__puff--connector {
  animation-duration: 15s;
}

[data-loot-fog-renderer],
[data-loot-fog-renderer-origin] {
  display: none !important;
}

body.loot-flashlight-active.loot-flashlight-pointing
  .loot-fog-overlay--under-beam {
  -webkit-mask-image: radial-gradient(
    circle at var(--loot-flashlight-x) var(--loot-flashlight-y),
    transparent 0 calc(var(--loot-flashlight-radius) - 18px),
    rgba(0, 0, 0, 0.18) calc(var(--loot-flashlight-radius) - 8px),
    #000 var(--loot-flashlight-radius)
  );
  mask-image: radial-gradient(
    circle at var(--loot-flashlight-x) var(--loot-flashlight-y),
    transparent 0 calc(var(--loot-flashlight-radius) - 18px),
    rgba(0, 0, 0, 0.18) calc(var(--loot-flashlight-radius) - 8px),
    #000 var(--loot-flashlight-radius)
  );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  pointer-events: none;
}

.loot-fog-overlay--under-beam > .loot-fog-cloud {
  pointer-events: none;
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
  animation: loot-slide-portal-idle 1.8s steps(3, end) infinite;
  transform-origin: center;
}

.loot-slide-portal:hover:not(:disabled) > .loot-slide-portal__graphic,
.loot-slide-portal[inert] > .loot-slide-portal__graphic,
.loot-slide-portal--broken > .loot-slide-portal__graphic,
.loot-slide-portal--pending > .loot-slide-portal__graphic {
  animation: none;
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

.loot-magnifier-pickup > .loot-magnifier-graphic {
  animation: loot-magnifier-idle 2.4s steps(3, end) infinite;
  transform-origin: center;
}

.loot-magnifier-pickup:hover:not(:disabled) > .loot-magnifier-graphic,
.loot-magnifier-pickup--collected > .loot-magnifier-graphic {
  animation: none;
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

lia-loot-flashlight {
  min-width: 4.5rem;
  min-height: 4.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

lia-loot-flashlight:empty { display: none; }

.loot-flashlight-pickup {
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
  -webkit-tap-highlight-color: transparent;
}

.loot-flashlight-pickup:hover:not(:disabled) {
  animation: none;
  transform: translate(-2px, -2px) rotate(2deg);
  filter: drop-shadow(7px 7px 0 rgba(8, 15, 28, 0.38));
}

.loot-flashlight-pickup:active:not(:disabled) {
  transform: translate(1px, 1px);
  filter: drop-shadow(2px 2px 0 rgba(8, 15, 28, 0.34));
}

.loot-flashlight-pickup:focus-visible {
  outline: 3px solid #ffe070;
  outline-offset: 2px;
}

.loot-flashlight-pickup:disabled { opacity: 1; }

.loot-flashlight-graphic {
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.loot-flashlight-pickup > .loot-flashlight-graphic {
  animation: loot-flashlight-idle 2.4s steps(3, end) infinite;
  transform-origin: center;
}

.loot-flashlight-pickup:hover:not(:disabled) > .loot-flashlight-graphic,
.loot-flashlight-pickup--collected > .loot-flashlight-graphic {
  animation: none;
}

.loot-flashlight-shadow { fill: rgba(8, 15, 28, 0.3); }
.loot-flashlight-outline { fill: #111827; }
.loot-flashlight-rim { fill: #c78b18; }
.loot-flashlight-lens { fill: #ffe584; }
.loot-flashlight-glow { fill: rgba(255, 241, 164, 0.5); }
.loot-flashlight-shine { fill: #fffbe5; }
.loot-flashlight-collar { fill: #7b5412; }
.loot-flashlight-body { fill: #48576a; }
.loot-flashlight-body-light { fill: #8492a5; }
.loot-flashlight-grip { fill: #283444; }
.loot-flashlight-switch { fill: #f7c948; }
.loot-flashlight-switch-light { fill: #fff0a3; }
.loot-flashlight-cap { fill: #252e3c; }
.loot-flashlight-bolt { fill: #b9c2cf; }

.loot-flashlight-pickup__reward {
  position: absolute;
  z-index: 1;
  top: -0.35rem;
  left: 50%;
  padding: 3px 5px;
  opacity: 0;
  color: #172033;
  background: #fff5bf;
  border: 2px solid #9a6500;
  box-shadow: 2px 2px 0 #9a6500;
  font: 900 0.66rem/1 ui-monospace, "Cascadia Mono", monospace;
  transform: translateX(-50%);
  pointer-events: none;
}

.loot-flashlight-pickup--collected {
  pointer-events: none;
  animation: loot-flashlight-collect 650ms steps(5, end) forwards;
}

.loot-flashlight-pickup--collected .loot-flashlight-pickup__reward {
  animation: loot-flashlight-reward 600ms steps(5, end) forwards;
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
lia-loot-flashlight:empty,
lia-loot-flashlight[hidden],
lia-loot-reveal[hidden],
lia-loot-reveal[data-reveal-layout=inline]:not([data-loot-reveal-kind]),
lia-loot-reveal[data-loot-inline-error],
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

/* DynFlex also declares display with !important; a blocked range must win. */
.dynFlex:is(
  [data-loot-reveal-range-blocked],
  [data-loot-if-range-blocked],
  [data-loot-puzzle-range-blocked]
) {
  display: none !important;
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
}

.loot-puzzle-pickup > .loot-puzzle-piece-graphic {
  animation: loot-puzzle-idle 2s steps(2, end) infinite;
  transform-origin: center;
}

.loot-puzzle-pickup--collected > .loot-puzzle-piece-graphic {
  animation: none;
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

.loot-exploration-pickup > .loot-exploration-graphic {
  animation: loot-exploration-idle 2.4s steps(3, end) infinite;
  transform-origin: center;
}

.loot-exploration-pickup:hover:not(:disabled) > .loot-exploration-graphic,
.loot-exploration-pickup--collected > .loot-exploration-graphic {
  animation: none;
}

.loot-exploration-tool > .loot-exploration-graphic {
  width: 1.95rem;
  height: 1.95rem;
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
  -webkit-tap-highlight-color: transparent;
}

.loot-reveal-cover > .loot-exploration-graphic {
  animation: loot-exploration-idle 2.4s steps(3, end) infinite;
  transform-origin: center;
}

.loot-reveal-cover:hover:not(:disabled) > .loot-exploration-graphic {
  animation: none;
}

@media (any-hover: hover) and (any-pointer: fine) {
  html[data-loot-active-tool="shovel"] {
    --loot-action-tool-cursor: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 64 64%22 shape-rendering=%22crispEdges%22%3E%3Cpath fill=%22%23172033%22 d=%22M47 1 60 14 54 20 41 7Z%22/%3E%3Cpath fill=%22%23d58a2a%22 d=%22M48 5 56 13 53 16 45 8Z%22/%3E%3Cpath fill=%22%23172033%22 d=%22m45 8 8 8-28 39-10-10 30-37Z%22/%3E%3Cpath fill=%22%238c5520%22 d=%22m47 13 4 4-27 34-4-4 27-34Z%22/%3E%3Cpath fill=%22%23d69a45%22 d=%22m46 12 2 2-27 34-2-2 27-34Z%22/%3E%3Cpath fill=%22%23172033%22 d=%22M12 29 39 49 35 58 25 64 9 63 0 54 0 40 6 33Z%22/%3E%3Cpath fill=%22%23aeb9c8%22 d=%22M14 35 33 50 30 55 22 61 11 59 5 52 6 42Z%22/%3E%3Cpath fill=%22%23e6edf5%22 d=%22M8 40 15 37 15 56 10 56 5 50Z%22/%3E%3Cpath fill=%22%236b7788%22 d=%22M16 38h8v4h4v7h-4v4h-8v-4h-4v-7h4v-4Z%22/%3E%3Cpath fill=%22%23f7c948%22 d=%22M18 44h4v4h-4z%22/%3E%3C/svg%3E") 5 27, crosshair;
  }

  html[data-loot-active-tool="watering-can"] {
    --loot-action-tool-cursor: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 64 64%22 shape-rendering=%22crispEdges%22%3E%3Cpath fill=%22%23172033%22 d=%22M22 12h24v4h6v4h4v8h-4v4h-8v-4h4v-8h-6v-4H26v8h20v4h4v24h-4v4H14v-4h-4V32H4v-4h16v-4h2V12Zm-8 20v16h28V28H22v4h-8Z%22/%3E%3Cpath fill=%22%234aa9c7%22 d=%22M14 32h28v16H14V32ZM4 32h10v8H8v-4H4v-4Zm0-8h10v4H4v-4Z%22/%3E%3Cpath fill=%22%23a9efff%22 d=%22M18 34h12v4H18v-4Z%22/%3E%3Cpath fill=%22%2326758f%22 d=%22M26 16h16v4h6v8h-4v-4h-4v-4H26v-4Z%22/%3E%3Cpath fill=%22%2367d7f5%22 d=%22M2 18h4v4H2v-4Zm6-4h4v4H8v-4Zm6 4h4v4h-4v-4Z%22/%3E%3C/svg%3E") 3 10, crosshair;
  }

  html[data-loot-active-tool="axe"] {
    --loot-action-tool-cursor: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 64 64%22 shape-rendering=%22crispEdges%22%3E%3Cpath fill=%22%23172033%22 d=%22M29 20h13l13 41H39L29 20ZM7 6h29l10 7h9l4 6-4 12h-9l-11 8H12L2 31V14L7 6Z%22/%3E%3Cpath fill=%22%238c5520%22 d=%22M34 24h5l11 33h-8L34 24Z%22/%3E%3Cpath fill=%22%237f8790%22 d=%22M10 11h23l9 6h9l2 3-2 6H41l-9 8H15l-7-7 1-13 1-3Z%22/%3E%3Cpath fill=%22%23b9c0c7%22 d=%22M11 11h20l6 4H17l-6 5-3-3 3-6Z%22/%3E%3Cpath fill=%22%23b9823f%22 d=%22M29 19h15v5H30Zm2 8h13v5H32Z%22/%3E%3C/svg%3E") 4 15, crosshair;
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
.loot-shovel-grip-cutout { fill: #172033; }
.loot-shovel-shaft { fill: #8c5520; }
.loot-shovel-shaft-light { fill: #d69a45; }
.loot-shovel-metal { fill: #aeb9c8; }
.loot-shovel-light { fill: #e6edf5; }
.loot-shovel-socket { fill: #6b7788; }
.loot-shovel-rivet { fill: #f7c948; }
.loot-watering-can-body { fill: #4aa9c7; }
.loot-watering-can-light { fill: #a9efff; }
.loot-watering-can-handle { fill: #26758f; }
.loot-watering-can-spout { fill: #4aa9c7; }
.loot-watering-can-water { fill: #67d7f5; }
.loot-axe-handle { fill: #8c5520; }
.loot-axe-handle-light { fill: #d69a45; }
.loot-axe-head { fill: #7f8790; }
.loot-axe-head-dark { fill: #515861; }
.loot-axe-head-light { fill: #b9c0c7; }
.loot-axe-chip { fill: #5e656d; }
.loot-axe-binding { fill: #b9823f; }
.loot-axe-rivet { fill: #e4c47a; }
.loot-axe-graphic[data-loot-axe-tier="iron"] .loot-axe-head {
  fill: #aeb9c8;
}
.loot-axe-graphic[data-loot-axe-tier="iron"] .loot-axe-head-dark {
  fill: #667383;
}
.loot-axe-graphic[data-loot-axe-tier="iron"] .loot-axe-head-light {
  fill: #edf3f8;
}
.loot-axe-graphic[data-loot-axe-tier="iron"] .loot-axe-chip {
  fill: #7d8997;
}
.loot-axe-graphic[data-loot-axe-tier="iron"] .loot-axe-binding {
  fill: #536171;
}
.loot-axe-graphic[data-loot-axe-tier="gold"] .loot-axe-head {
  fill: #e4a928;
}
.loot-axe-graphic[data-loot-axe-tier="gold"] .loot-axe-head-dark {
  fill: #9a6500;
}
.loot-axe-graphic[data-loot-axe-tier="gold"] .loot-axe-head-light {
  fill: #ffe58a;
}
.loot-axe-graphic[data-loot-axe-tier="gold"] .loot-axe-chip {
  fill: #b8790a;
}
.loot-axe-graphic[data-loot-axe-tier="gold"] .loot-axe-binding {
  fill: #754a08;
}
.loot-axe-graphic[data-loot-axe-tier="diamond"] .loot-axe-head {
  fill: #35c9d0;
}
.loot-axe-graphic[data-loot-axe-tier="diamond"] .loot-axe-head-dark {
  fill: #117f92;
}
.loot-axe-graphic[data-loot-axe-tier="diamond"] .loot-axe-head-light {
  fill: #b8ffff;
}
.loot-axe-graphic[data-loot-axe-tier="diamond"] .loot-axe-chip {
  fill: #1aa5b2;
}
.loot-axe-graphic[data-loot-axe-tier="diamond"] .loot-axe-binding {
  fill: #176c7a;
}
.loot-axe-graphic[data-loot-axe-tier="diamond"] .loot-axe-rivet {
  fill: #ffffff;
}
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
  animation: loot-key-idle 2.2s steps(2, end) infinite;
  transform-origin: center;
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

.loot-key-pickup:hover:not(:disabled) > .loot-key-graphic,
.loot-key-pickup--collected > .loot-key-graphic {
  animation: none;
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

.loot-chest-placement--template .loot-reveal-cover {
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

/* Keep the small revealed click target stationary between pointerdown and click. */
.loot-magnifier-secret .loot-treasure-chest:hover:not(:disabled),
.loot-magnifier-secret .loot-treasure-chest:active:not(:disabled) {
  transform: none;
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
  pointer-events: none;
  animation: loot-treasure-idle 2.4s steps(2, end) infinite;
  transform-origin: center;
}

.loot-treasure-chest:hover:not(:disabled) > .loot-treasure-chest-graphic {
  animation: none;
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
  0%, 45%, 100% { opacity: 1; }
  50%, 95% { opacity: 0.94; }
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

@keyframes loot-flashlight-idle {
  0%, 42%, 100% { transform: translateY(0) rotate(0); }
  48%, 92% { transform: translateY(-2px) rotate(-2deg); }
}

@keyframes loot-flashlight-collect {
  0%, 45% { opacity: 1; transform: scale(1) rotate(0); }
  68% { opacity: 1; transform: scale(1.14) rotate(8deg); }
  100% { opacity: 0; transform: scale(0.42) rotate(-14deg); }
}

@keyframes loot-flashlight-reward {
  0% { opacity: 0; transform: translate(-50%, 0); }
  20%, 65% { opacity: 1; transform: translate(-50%, -14px); }
  100% { opacity: 0; transform: translate(-50%, -30px); }
}

@keyframes loot-fog-breathe {
  from { opacity: 0.97; transform: scale(1.005, 1.015); }
  to { opacity: 1; transform: scale(1.018, 1.035); }
}

@keyframes loot-fog-float-near {
  from { transform: translate3d(-0.7%, -1.2%, 0) scale(1.01); }
  to { transform: translate3d(0.9%, 1.1%, 0) scale(1.035); }
}

@keyframes loot-fog-float-far {
  from { transform: translate3d(0.8%, -0.8%, 0) scale(1.025); }
  to { transform: translate3d(-0.9%, 0.9%, 0) scale(1.005); }
}

@keyframes loot-fog-puff-drift {
  from { margin-left: -1.5px; }
  to { margin-left: 1.5px; }
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

  .loot-cat-food-subbar {
    max-width: calc(100vw - 0.5rem);
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
  .loot-treasure-chest > .loot-treasure-chest-graphic { animation: none; }
  .loot-treasure-chest--waiting { animation: none; }
  .loot-treasure-chest--opened { opacity: 0; }
  .loot-key-pickup > .loot-key-graphic { animation: none; }
  .loot-key-pickup--collected { opacity: 0; }
  .loot-puzzle-pickup > .loot-puzzle-piece-graphic { animation: none; }
  .loot-puzzle-pickup--collected { opacity: 0; }
  .loot-puzzle-gate__doors > span { transition: none; }
  .loot-magnifier-pickup > .loot-magnifier-graphic { animation: none; }
  .loot-magnifier-pickup--collected { opacity: 0; }
  .loot-flashlight-pickup > .loot-flashlight-graphic,
  .loot-fog-cloud__puff { animation: none; }
  .loot-flashlight-pickup--collected { opacity: 0; }
  .loot-exploration-pickup > .loot-exploration-graphic,
  .loot-reveal-cover > .loot-exploration-graphic { animation: none; }
  .loot-exploration-pickup--collected,
  .loot-reveal-layer--digging > .loot-reveal-layer__cover,
  .loot-reveal-layer--opening > .loot-reveal-layer__cover { opacity: 0; }
  .loot-reveal-layer--watering > .loot-reveal-layer__cover { animation: none; }
  .loot-slide-portal > .loot-slide-portal__graphic { animation: none; }
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
