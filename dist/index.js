!function(e,t,o,n,r){var l="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},i="function"==typeof l[n]&&l[n],s=i.i||{},a=i.cache||{},c="u">typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(t,o){if(!a[t]){if(!e[t]){if(r[t])return r[t];var s="function"==typeof l[n]&&l[n];if(!o&&s)return s(t,!0);if(i)return i(t,!0);if(c&&"string"==typeof t)return c(t);var d=Error("Cannot find module '"+t+"'");throw d.code="MODULE_NOT_FOUND",d}m.resolve=function(o){var n=e[t][1][o];return null!=n?n:o},m.cache={};var h=a[t]=new u.Module(t);e[t][0].call(h.exports,m,h,h.exports,l)}return a[t].exports;function m(e){var t=m.resolve(e);if(!1===t)return{};if(Array.isArray(t)){var o={__esModule:!0};return t.forEach(function(e){var t=e[0],n=e[1],r=e[2]||e[0],l=u(n);"*"===t?Object.keys(l).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(o,e)||Object.defineProperty(o,e,{enumerable:!0,get:function(){return l[e]}})}):"*"===r?Object.defineProperty(o,t,{enumerable:!0,value:l}):Object.defineProperty(o,t,{enumerable:!0,get:function(){return"default"===r?l.__esModule?l.default:l:l[r]}})}),o}return u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.require=c,this.exports={}},u.modules=e,u.cache=a,u.parent=i,u.distDir=void 0,u.publicUrl=void 0,u.devServer=void 0,u.i=s,u.register=function(t,o){e[t]=[function(e,t){t.exports=o},{}]},Object.defineProperty(u,"root",{get:function(){return l[n]}}),l[n]=u;for(var d=0;d<t.length;d++)u(t[d]);if(o){var h=u(o);"object"==typeof exports&&"u">typeof module?module.exports=h:"function"==typeof define&&define.amd&&define(function(){return h})}}({"8RSWf":[function(e,t,o,n){var r=e("./achievements"),l=e("./achievement-overlay"),i=e("./achievement-store"),s=e("./inventory-store"),a=e("./key-colors"),c=e("./key-inventory-bar"),u=e("./key-pickup"),d=e("./object-lock"),h=e("./course-chests"),m=e("./popup"),f=e("./quiz-events"),p=e("./resource-bar"),g=e("./resource-store"),b=e("./score"),y=e("./secret-slides"),v=e("./style"),k=e("./store"),w=e("./treasure-chest");!function(){if(window.__LIA_LOOT_HIGHSCORE__)return;let e=new(0,k.HighscoreStore),t=new(0,g.ResourceStore),o=new(0,s.KeyInventoryStore),n=new(0,i.AchievementStore),x=new(0,r.AchievementManager)(n,l.showAchievement),S=()=>{let t=e.state();x.highscoreFinished(t?.finalScore??null,t?.config.maxPoints??NaN),(0,f.allRenderedCourseQuizzesSolved)(document)&&x.quizzesCompleted(),x.enable()},L=e=>{let o=t.spend(e),n=t.state();return n&&(0,p.renderResources)(n.gold,n.diamonds,n.energy),o||(0,p.showInsufficientResource)("gold"===e?"coins":"diamonds"===e?"gems":"energy"),o},C=(e,o,n)=>{let r=t.configure(e,o,n);x.chestCollected(r.collectedChests.length),(0,p.renderResources)(r.gold,r.diamonds,r.energy),(0,w.refreshTreasureChests)()},E={version:"0.0.1",configure(t,o,n,r,l){let i=(0,b.createConfig)(t,o,n,r,l);e.configure(i),x.highscoreFinished(null,i.maxPoints)},fail(t=1){e.fail(t)},hint(t=1){e.hint(t)},finish(){let t=e.finish(),o=e.state();return null!==t&&o&&(x.highscoreFinished(t,o.config.maxPoints),(0,m.showHighscore)(t,o.config.maxPoints)),t},reset(){(0,m.hideHighscore)(),e.reset();let t=e.state();x.highscoreFinished(null,t?.config.maxPoints??NaN)},score:t=>e.score(t),show(){let t=e.state();t?.finalScore!==null&&t?.finalScore!==void 0&&(0,m.showHighscore)(t.finalScore,t.config.maxPoints)},enableAchievements(){S()},state:()=>e.state(),resources(e,t,o){C(e,t,o)}};window.__LIA_LOOT_HIGHSCORE__=E,(0,v.injectStyles)(),(0,y.installSecretSlides)({found:()=>x.secretSlideFound()}),(0,h.discoverCourseAchievementsDeclaration)().then(e=>{e&&S()}).catch(()=>{}),(0,h.discoverCourseResourceDeclaration)().then(e=>{e&&null===t.state()&&C(e.gold,e.diamonds,e.energy)}).catch(()=>{});let _=t.state();_&&(0,p.renderResources)(_.gold,_.diamonds,_.energy),(0,w.installTreasureChests)({active:e=>{let o=t.state();return null!==o&&("energy"!==e||null!==o.energy)},catalogReady:e=>{x.chestCatalogReady(e,t.state()?.collectedChests.length??0)},collected:e=>t.isChestCollected(e),collect:(e,o)=>{if(!t.collectChest(e,o))return!1;let n=t.state();return!!n&&(x.chestCollected(n.collectedChests.length),(0,p.renderResources)(n.gold,n.diamonds,n.energy),(0,p.announceResource)("diamonds"===o?"Diamanttruhe geöffnet: einen Diamanten erhalten.":"energy"===o?"Energiekiste geöffnet: einen Energiepunkt erhalten.":"Schatztruhe geöffnet: eine Goldmünze erhalten."),!0)}});let A=o.state();Object.values(A.keys).some(e=>e>0)&&(0,c.renderKeyInventory)(A.keys),(0,u.installKeyPickups)({collected:e=>o.isKeyCollected(e),collect:(e,t)=>!!o.collectKey(e,t)&&((0,c.renderKeyInventory)(o.state().keys),(0,c.announceKeyFound)(a.KEY_COLOR_DETAILS[t].foundMessage),!0),focusInventory:c.focusKeyInventory}),(0,d.installObjectLocks)({catalogReady:e=>{x.lockCatalogReady(e,o.state().unlockedLocks.length)},unlocked:e=>o.isLockUnlocked(e),unlock:(e,t)=>{let n=o.useKeyForLock(e,t);if("unlocked"===n){let e=o.state();(0,c.renderKeyInventory)(e.keys),x.lockUnlocked(e.unlockedLocks.length)}return n}}),(0,f.installQuizEventTracking)({active:()=>e.isRunning()||x.isEnabled(),failed:()=>e.fail(),hint:t=>e.hint(t),solved:()=>{(0,f.allRenderedCourseQuizzesSolved)(document)&&x.quizzesCompleted()},courseCompleted:()=>E.finish(),useCheck:()=>L("energy"),useHint:()=>L("gold"),useResolve:()=>L("diamonds")})}()},{"./popup":"2ScWm","./quiz-events":"iVnYR","./score":"6LTpY","./style":"dmo3N","./store":"cswaT","./resource-bar":"eGQGH","./resource-store":"cFdCo","./treasure-chest":"iSaEL","./inventory-store":"9M6A9","./key-colors":"kuyjk","./key-inventory-bar":"7pcz5","./key-pickup":"2Xfsw","./object-lock":"jhthD","./course-chests":"blH4i","./secret-slides":"jyW1v","./achievements":"h0spE","./achievement-overlay":"jGehO","./achievement-store":"hxMIe"}],"2ScWm":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"showHighscore",()=>h),r.export(o,"hideHighscore",()=>m);var l=e("./score"),i=e("./style");let s="lia-loot-highscore-dialog",a="http://www.w3.org/2000/svg",c={gold:{fill:"#D4AF37",stroke:"#725A00",label:"Goldene Trophäe"},silver:{fill:"#A7A9AC",stroke:"#55585C",label:"Silberne Trophäe"},copper:{fill:"#B87333",stroke:"#6A3517",label:"Kupferfarbene Trophäe"}};function u(e){"function"==typeof e.close&&e.open?e.close():e.removeAttribute("open")}function d(e){return e?.tagName==="DIALOG"?e:null}function h(e,t){let o,n,r,h;(0,i.injectStyles)();let m=function(){let e=d(document.getElementById(s));if(e)return e;let t=document.createElement("dialog");t.id=s,t.className="loot-highscore-dialog";let o=document.createElement("div");o.className="loot-highscore-card",o.setAttribute("data-loot-highscore-content","");let n=document.createElement("button");return n.type="button",n.className="loot-highscore-close",n.setAttribute("aria-label","Highscore schließen"),n.textContent="×",n.addEventListener("click",()=>u(t)),t.addEventListener("click",e=>{e.target===t&&u(t)}),o.appendChild(n),t.appendChild(o),document.body.appendChild(t),t}(),f=m.querySelector("[data-loot-highscore-content]");if(!f)return;f.querySelectorAll(".loot-highscore-trophy, .loot-highscore-points").forEach(e=>e.remove());let p=(0,l.trophyTier)(e,t);p&&f.appendChild((o=c[p],(n=document.createElementNS(a,"svg")).setAttribute("viewBox","0 0 64 64"),n.setAttribute("class","loot-highscore-trophy"),n.setAttribute("role","img"),n.setAttribute("aria-label",o.label),(r=document.createElementNS(a,"path")).setAttribute("d","M18 8h28v10c0 11.5-5.8 20.6-14 23.4V48h10v7H22v-7h10v-6.6C23.8 38.6 18 29.5 18 18V8Z"),r.setAttribute("fill",o.fill),r.setAttribute("stroke",o.stroke),r.setAttribute("stroke-width","2.5"),r.setAttribute("stroke-linejoin","round"),(h=document.createElementNS(a,"path")).setAttribute("d","M18 13H9v5c0 8.8 4.8 14.4 13 16M46 13h9v5c0 8.8-4.8 14.4-13 16"),h.setAttribute("fill","none"),h.setAttribute("stroke",o.stroke),h.setAttribute("stroke-width","4"),h.setAttribute("stroke-linecap","round"),h.setAttribute("stroke-linejoin","round"),n.append(h,r),n));let g=document.createElement("p");g.id="lia-loot-highscore-points",g.className="loot-highscore-points",g.textContent=`${(0,l.formatScore)(e)} Punkte`,f.appendChild(g),m.setAttribute("aria-labelledby",g.id),"function"==typeof m.showModal?m.open||m.showModal():(m.setAttribute("open",""),m.setAttribute("role","dialog"),m.setAttribute("aria-modal","true")),f.querySelector(".loot-highscore-close")?.focus()}function m(){let e=d(document.getElementById(s));e&&u(e)}},{"./score":"6LTpY","./style":"dmo3N","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"6LTpY":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"createConfig",()=>i),r.export(o,"sameConfig",()=>s),r.export(o,"elapsedSeconds",()=>a),r.export(o,"calculateScore",()=>c),r.export(o,"trophyTier",()=>u),r.export(o,"formatScore",()=>d);let l=["maxPoints","failedCheckPenalty","hintPenalty","graceMinutes","perMinutePenalty"];function i(e,t,o,n,r){let i={maxPoints:Number(e),failedCheckPenalty:Number(t),hintPenalty:Number(o),graceMinutes:Number(n),perMinutePenalty:Number(r)};if(!Number.isFinite(i.maxPoints)||i.maxPoints<=0)throw TypeError("@Highscore: Die maximale Punktzahl muss größer als 0 sein.");for(let e of l.slice(1))if(!Number.isFinite(i[e])||i[e]<0)throw TypeError(`@Highscore: ${e} muss eine nichtnegative Zahl sein.`);return i}function s(e,t){return l.every(o=>e[o]===t[o])}function a(e,t){return Math.max(0,Math.floor((t-e)/1e3))}function c(e,t,o){let n=Math.max(0,Math.floor((o-t.startedAt-6e4*e.graceMinutes)/1e3))*e.perMinutePenalty/60;return Math.max(0,e.maxPoints-t.failedChecks*e.failedCheckPenalty-t.hintsUsed*e.hintPenalty-n)}function u(e,t){let o=t>0?e/t:0;return o>=.9?"gold":o>=.75?"silver":o>=.5?"copper":null}function d(e,t="de-DE"){return new Intl.NumberFormat(t,{minimumFractionDigits:0,maximumFractionDigits:1}).format(e)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,o,n){o.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},o.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},o.exportAll=function(e,t){return Object.keys(e).forEach(function(o){"default"===o||"__esModule"===o||Object.prototype.hasOwnProperty.call(t,o)||Object.defineProperty(t,o,{enumerable:!0,get:function(){return e[o]}})}),t},o.export=function(e,t,o){Object.defineProperty(e,t,{enumerable:!0,get:o})}},{}],dmo3N:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"injectStyles",()=>s);let l="lia-loot-highscore-style",i=`
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
`;function s(){if(document.getElementById(l))return;let e=document.createElement("style");e.id=l,e.textContent=i,document.head.appendChild(e)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],iVnYR:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"isScoreableQuiz",()=>a),r.export(o,"lastScoreableQuiz",()=>h),r.export(o,"allRenderedCourseQuizzesSolved",()=>m),r.export(o,"isLastCourseQuiz",()=>f),r.export(o,"installQuizEventTracking",()=>g);let l=".lia-quiz__check",i=".lia-quiz",s=".lia-quiz__resolve";function a(e){return!!(e.querySelector(l)&&e.querySelector(s))}function c(e){e.preventDefault(),e.stopImmediatePropagation()}function u(e){let t=(e.querySelector(l)?.textContent?.trim()??"").match(/(?:^|\s)(\d+)\s*$/);return t?Number.parseInt(t[1],10):0}function d(e){return e.querySelectorAll(".lia-quiz__hints > li").length}function h(e){for(let t=e.length-1;t>=0;t-=1){let o=e[t];if(a(o))return o}return null}function m(e){let t=Array.from(e.querySelectorAll(i)).filter(a);return t.length>0&&t.every(e=>e.classList.contains("solved"))&&t.some(f)}function f(e){let t=e.closest("main.lia-slide__content"),o=t?.parentElement;if(!t||!o)return!1;let n=Array.from(o.children).filter(e=>"MAIN"===e.tagName);return n[n.length-1]===t&&h(Array.from(t.querySelectorAll(i)))===e}function p(e,t,o,n,r=3e4){let l,i=!1,s=0,a=()=>{l.disconnect(),window.clearTimeout(s)},c=()=>{i||(i=!0,a(),n())},u=()=>{if(i)return;if(!e.isConnected)return void c();let n=t();null!==n&&(i||(i=!0,a(),o(n)))};(l=new MutationObserver(u)).observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0}),s=window.setTimeout(c,r),window.setTimeout(u,0)}function g(e){let t=new WeakSet,o=new WeakSet;document.addEventListener("click",n=>{var r;let a=(r=n.target)instanceof Element?r:r instanceof Node?r.parentElement:null;if(!a)return;let h=a.closest(l);if(h&&!h.disabled){let o=h.closest(i);if(!o||!o.classList.contains("open")||!o.querySelector(s))return;if(t.has(o)||!e.useCheck())return void c(n);if(!e.active())return;t.add(o);let r=u(o),l=()=>{t.delete(o)};return void p(o,()=>{let e=u(o);return o.classList.contains("solved")?"solved":e>r?"failed":null},t=>{l(),"failed"===t?e.failed():(e.solved(o),f(o)&&e.courseCompleted())},l)}let m=a.closest(".lia-quiz__hint");if(m&&!m.disabled){let t=m.closest(i);if(!t||!t.classList.contains("open"))return;if(o.has(t)||!e.useHint())return void c(n);if(!e.active())return;o.add(t);let r=d(t),l=()=>{o.delete(t)};return void p(t,()=>{let e=d(t)-r;return e>0?e:null},t=>{l(),e.hint(t)},l)}let g=a.closest(s);if(g&&!g.disabled){let t=g.closest(i);if(!t||!t.classList.contains("open"))return;e.useResolve()||c(n)}},!0)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],cswaT:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"HighscoreStore",()=>a);var l=e("./score"),i=e("./storage");function s(e){return Number.isFinite(e)?Math.max(0,Math.floor(e)):0}class a{configure(e,t=Date.now()){this.current&&(0,l.sameConfig)(this.current.config,e)||(this.current={version:1,config:e,startedAt:t,failedChecks:0,hintsUsed:0,finishedAt:null,finalScore:null},(0,i.saveState)(this.current))}isRunning(){return null!==this.current&&null===this.current.finishedAt}fail(e=1){this.isRunning()&&this.current&&(this.current.failedChecks+=s(e),(0,i.saveState)(this.current))}hint(e=1){this.isRunning()&&this.current&&(this.current.hintsUsed+=s(e),(0,i.saveState)(this.current))}score(e=Date.now()){return this.current?null!==this.current.finalScore?this.current.finalScore:(0,l.calculateScore)(this.current.config,this.current,e):null}finish(e=Date.now()){if(!this.current)return null;if(null!==this.current.finalScore)return this.current.finalScore;let t=(0,l.calculateScore)(this.current.config,this.current,e);return this.current.finishedAt=e,this.current.finalScore=t,(0,i.saveState)(this.current),t}reset(e=Date.now()){if(!this.current)return void(0,i.clearState)();let t={...this.current.config};(0,i.clearState)(),this.current=null,this.configure(t,e)}state(){var e;return this.current?{...e=this.current,config:{...e.config}}:null}constructor(){this.current=(0,i.loadState)()}}},{"./score":"6LTpY","./storage":"6UGi5","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"6UGi5":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"loadState",()=>h),r.export(o,"saveState",()=>m),r.export(o,"clearState",()=>f),r.export(o,"loadResources",()=>p),r.export(o,"saveResources",()=>g),r.export(o,"loadKeyInventory",()=>b),r.export(o,"saveKeyInventory",()=>y),r.export(o,"loadAchievements",()=>v),r.export(o,"saveAchievements",()=>k);var l=e("./score.ts"),i=e("./key-colors.ts"),s=e("./types.ts");function a(){let e=`${window.location.origin}${window.location.pathname}${window.location.search}`;return`lia-loot:highscore:v1:${encodeURIComponent(e)}`}function c(){let e=`${window.location.origin}${window.location.pathname}${window.location.search}`;return`lia-loot:resources:v1:${encodeURIComponent(e)}`}function u(){let e=`${window.location.origin}${window.location.pathname}${window.location.search}`;return`lia-loot:key-inventory:v1:${encodeURIComponent(e)}`}function d(){let e=`${window.location.origin}${window.location.pathname}${window.location.search}`;return`lia-loot:achievements:v1:${encodeURIComponent(e)}`}function h(){try{let e=window.sessionStorage.getItem(a());if(!e)return null;let t=JSON.parse(e);return!function(e){if(!e||"object"!=typeof e||1!==e.version||!e.config)return!1;try{(0,l.createConfig)(e.config.maxPoints,e.config.failedCheckPenalty,e.config.hintPenalty,e.config.graceMinutes,e.config.perMinutePenalty)}catch{return!1}return Number.isFinite(e.startedAt)&&Number.isInteger(e.failedChecks)&&Number(e.failedChecks)>=0&&Number.isInteger(e.hintsUsed)&&Number(e.hintsUsed)>=0&&(null===e.finishedAt||Number.isFinite(e.finishedAt))&&(null===e.finalScore||Number.isFinite(e.finalScore))}(t)?null:t}catch{return null}}function m(e){try{window.sessionStorage.setItem(a(),JSON.stringify(e))}catch{}}function f(){try{window.sessionStorage.removeItem(a())}catch{}}function p(){try{let t=window.sessionStorage.getItem(c());if(!t)return null;var e=JSON.parse(t);if(!e||"object"!=typeof e||1!==e.version||!Number.isInteger(e.initialGold)||0>Number(e.initialGold)||!Number.isInteger(e.initialDiamonds)||0>Number(e.initialDiamonds)||!Number.isInteger(e.gold)||0>Number(e.gold)||!Number.isInteger(e.diamonds)||0>Number(e.diamonds))return null;let o=void 0!==e.initialEnergy&&null!==e.initialEnergy,n=void 0!==e.energy&&null!==e.energy;if(o!==n||o&&(!Number.isInteger(e.initialEnergy)||0>Number(e.initialEnergy)||!Number.isInteger(e.energy)||0>Number(e.energy))||void 0!==e.collectedChests&&(!Array.isArray(e.collectedChests)||!e.collectedChests.every(e=>"string"==typeof e&&e.trim().length>0))||void 0!==e.chestCollected&&"boolean"!=typeof e.chestCollected)return null;let r=Array.isArray(e.collectedChests)?[...new Set(e.collectedChests.map(e=>e.trim()))]:!0===e.chestCollected?["legacy:auto"]:[];return{version:1,initialGold:Number(e.initialGold),initialDiamonds:Number(e.initialDiamonds),initialEnergy:o?Number(e.initialEnergy):null,gold:Number(e.gold),diamonds:Number(e.diamonds),energy:n?Number(e.energy):null,collectedChests:r}}catch{return null}}function g(e){try{window.sessionStorage.setItem(c(),JSON.stringify(e))}catch{}}function b(){try{let e=window.sessionStorage.getItem(u());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!e.keys||"object"!=typeof e.keys)return null;let t=e.keys,o=(0,i.createEmptyKeyCounts)();for(let e of i.KEY_COLORS){let n=t[e]??0;if(!Number.isInteger(n)||0>Number(n))return null;o[e]=Number(n)}if(!Array.isArray(e.collectedKeys)||!e.collectedKeys.every(e=>"string"==typeof e&&e.trim().length>0))return null;let n=[...new Set(e.collectedKeys.map(e=>e.trim()))];if(void 0!==e.unlockedLocks&&(!Array.isArray(e.unlockedLocks)||!e.unlockedLocks.every(e=>"string"==typeof e&&e.trim().length>0)))return null;let r=Array.isArray(e.unlockedLocks)?e.unlockedLocks.map(e=>e.trim()):[],l=[...new Set(r)];return l.length!==r.length||i.KEY_COLORS.reduce((e,t)=>e+o[t],0)+l.length!==n.length?null:{version:1,keys:o,collectedKeys:n,unlockedLocks:l}}(t)}catch{return null}}function y(e){try{window.sessionStorage.setItem(u(),JSON.stringify(e))}catch{}}function v(){try{let t=window.sessionStorage.getItem(d());if(!t)return null;var e=JSON.parse(t);if(!e||"object"!=typeof e||1!==e.version||!Array.isArray(e.unlocked))return null;let o=new Set(s.ACHIEVEMENT_IDS);if(!e.unlocked.every(e=>"string"==typeof e&&o.has(e)))return null;let n=[...e.unlocked];return new Set(n).size!==n.length?null:{version:1,unlocked:n}}catch{return null}}function k(e){try{window.sessionStorage.setItem(d(),JSON.stringify(e))}catch{}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./score.ts":"6LTpY","./key-colors.ts":"kuyjk","./types.ts":"dHDQY"}],kuyjk:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"KEY_COLORS",()=>l),r.export(o,"KEY_COLOR_DETAILS",()=>i),r.export(o,"isKeyColorRequest",()=>u),r.export(o,"createEmptyKeyCounts",()=>d),r.export(o,"requestedKeyColor",()=>h),r.export(o,"deterministicKeyColor",()=>m),r.export(o,"resolveKeyAppearance",()=>f);let l=["red","blue","green","yellow","purple","orange"],i={red:{label:"Rot",inventoryLabel:"Rote Schlüssel",pickupLabel:"Roten Schlüssel",foundMessage:"Roter Schlüssel gefunden."},blue:{label:"Blau",inventoryLabel:"Blaue Schlüssel",pickupLabel:"Blauen Schlüssel",foundMessage:"Blauer Schlüssel gefunden."},green:{label:"Grün",inventoryLabel:"Grüne Schlüssel",pickupLabel:"Grünen Schlüssel",foundMessage:"Grüner Schlüssel gefunden."},yellow:{label:"Gelb",inventoryLabel:"Gelbe Schlüssel",pickupLabel:"Gelben Schlüssel",foundMessage:"Gelber Schlüssel gefunden."},purple:{label:"Lila",inventoryLabel:"Lilafarbene Schlüssel",pickupLabel:"Lilafarbenen Schlüssel",foundMessage:"Lilafarbener Schlüssel gefunden."},orange:{label:"Orange",inventoryLabel:"Orangefarbene Schlüssel",pickupLabel:"Orangefarbenen Schlüssel",foundMessage:"Orangefarbener Schlüssel gefunden."}},s={red:"red",rot:"red",blue:"blue",blau:"blue",green:"green",grün:"green",gruen:"green",yellow:"yellow",gelb:"yellow",purple:"purple",violet:"purple",violett:"purple",lila:"purple",orange:"orange"},a=new Set(["","?","auto","random","zufall","mystery","unbekannt"]);function c(e){return e?.trim().toLowerCase()??""}function u(e){let t=c(e);return a.has(t)||/^@\d+$/.test(t)||void 0!==s[t]}function d(){return{red:0,blue:0,green:0,yellow:0,purple:0,orange:0}}function h(e){let t=c(e);return a.has(t)||/^@\d+$/.test(t)?null:s[t]??null}function m(e){let t=e.trim()||"loot-key",o=0x811c9dc5;for(let e=0;e<t.length;e+=1)o^=t.charCodeAt(e),o=Math.imul(o,0x1000193);return l[(o>>>0)%l.length]}function f(e,t){let o=h(t);return{color:o??m(e),mystery:null===o}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],dHDQY:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"ACHIEVEMENT_IDS",()=>l);let l=["all-quizzes-solved","perfect-highscore","all-chests-opened","all-locks-opened","secret-slide-found"]},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],eGQGH:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"installResourceBar",()=>c),r.export(o,"refreshResourceBarVisibility",()=>u),r.export(o,"renderResources",()=>d),r.export(o,"showInsufficientResource",()=>h),r.export(o,"announceResource",()=>m);let l="lia-loot-resource-bar",i=["header",".lia-header","[role='banner']"];function s(e,t){let o,n=document.createElement("div");n.className="loot-resource loot-resource--hidden",n.setAttribute("aria-label",`${t}: 0`);let r=document.createElement("span");return r.className="loot-resource-value",r.dataset.lootResource=e,r.textContent="0",n.append(((o=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("viewBox","0 0 32 32"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-resource-icon",`loot-resource-icon--${e}`),o.innerHTML="coins"===e?'<ellipse cx="16" cy="8" rx="10" ry="5"/><path d="M6 8v6c0 2.8 4.5 5 10 5s10-2.2 10-5V8"/><path d="M6 14v6c0 2.8 4.5 5 10 5s10-2.2 10-5v-6"/>':"gems"===e?'<path d="M8 5h16l5 7-13 15L3 12l5-7Z"/><path d="m3 12 8-2 5 17 5-17 8 2M8 5l3 5 5-5 5 5 3-5"/>':'<path d="M19 2 7 18h8l-2 12 12-18h-8l2-10Z"/>',o),r),n}function a(){for(let e of i){let t=document.querySelector(e);if(t&&t.id!==l&&!t.closest(`#${l}`))return t}return null}function c(){let e,t=document.getElementById(l);if(t)return t;let o=document.createElement("aside");o.id=l,o.className="loot-resource-bar loot-resource-bar--empty",o.setAttribute("aria-label","Ressourcen und Schlüsselinventar"),o.append(s("coins","Goldmünzen"),s("gems","Diamanten"),s("energy","Energie"),((e=document.createElement("span")).className="loot-resource-status",e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e)),document.body.appendChild(o);let n=()=>{let e,t;return t=(e=a())?Math.max(0,e.getBoundingClientRect().bottom):0,void o.style.setProperty("--loot-resource-top",`${Math.round(t)}px`)};n(),window.addEventListener("resize",n,{passive:!0}),window.addEventListener("scroll",n,{passive:!0});let r=a();return r&&"ResizeObserver"in window&&new ResizeObserver(n).observe(r),o}function u(){let e=document.getElementById(l);if(!e)return;let t=[...e.querySelectorAll(".loot-resource")].some(e=>!e.classList.contains("loot-resource--hidden")),o=null!==e.querySelector("[data-loot-key-color]");e.classList.toggle("loot-resource-bar--empty",!t&&!o)}function d(e,t,o=null){c();let n={coins:e,gems:t,energy:o},r={coins:"Goldmünzen",gems:"Diamanten",energy:"Energie"};for(let e of["coins","gems","energy"]){let t=document.querySelector(`[data-loot-resource="${e}"]`),l=t?.parentElement,i="energy"===e&&null===o;if(l?.classList.toggle("loot-resource--hidden",i),!t||i)continue;let s=n[e],a=Math.max(0,Math.floor("number"==typeof s&&Number.isFinite(s)?s:0));t.textContent=a.toLocaleString("de-DE"),l?.setAttribute("aria-label",`${r[e]}: ${a}`)}u()}function h(e){let t=document.querySelector(`[data-loot-resource="${e}"]`),o=t?.parentElement,n=document.querySelector(".loot-resource-status");o&&n&&(o.classList.remove("loot-resource--insufficient"),o.offsetWidth,o.classList.add("loot-resource--insufficient"),o.addEventListener("animationend",()=>o.classList.remove("loot-resource--insufficient"),{once:!0}),n.textContent="coins"===e?"Nicht genug Gold für einen Hinweis.":"gems"===e?"Nicht genug Diamanten zum Auflösen.":"Keine Energie mehr zum Prüfen.")}function m(e){let t=document.querySelector(".loot-resource-status");t&&(t.textContent="",window.setTimeout(()=>{t.textContent=e},0))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],cFdCo:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"ResourceStore",()=>a);var l=e("./storage.ts");function i(e,t){if(!Number.isFinite(e)||e<0)throw TypeError(`${t} muss eine nichtnegative Zahl sein.`);return Math.floor(e)}function s(e){return{...e,collectedChests:[...e.collectedChests]}}class a{configure(e,t,o){let n=i(e,"Gold"),r=i(t,"Diamanten"),a=void 0===o?null:i(o,"Energie");return this.current&&this.current.initialGold===n&&this.current.initialDiamonds===r&&this.current.initialEnergy===a||(this.current={version:1,initialGold:n,initialDiamonds:r,initialEnergy:a,gold:n,diamonds:r,energy:a,collectedChests:[]},(0,l.saveResources)(this.current)),this.enabled=!0,s(this.current)}spend(e){if(!this.enabled||!this.current)return!0;if("energy"===e){if(null===this.current.energy)return!0;if(this.current.energy<=0)return!1;this.current.energy-=1}else{if(this.current[e]<=0)return!1;this.current[e]-=1}return(0,l.saveResources)(this.current),!0}collectChest(e,t="gold"){let o=e.trim();if(!o||!this.enabled||!this.current||this.current.collectedChests.includes(o))return!1;if("energy"===t){if(null===this.current.energy)return!1;this.current.energy+=1}else this.current[t]+=1;return this.current.collectedChests.push(o),(0,l.saveResources)(this.current),!0}isChestCollected(e){return!!this.current?.collectedChests.includes(e.trim())}state(){return this.enabled&&this.current?s(this.current):null}constructor(){this.current=(0,l.loadResources)(),this.enabled=!1}}},{"./storage.ts":"6UGi5","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],iSaEL:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"courseChestUnitCount",()=>I),r.export(o,"refreshTreasureChests",()=>K),r.export(o,"installTreasureChests",()=>F);var l=e("./course-chests.ts"),i=e("./collectible-visibility.ts"),s=e("./slide-activity.ts");let a="lia-loot-chest",c="data-loot-chest-portal",u={toc:"toc",menu:"menu",classroom:"classroom",info:"info",translator:"translator",translate:"translator",translation:"translator",lang:"translator",übersetzer:"translator",uebersetzer:"translator",mode:"mode",display:"mode",view:"mode",darstellung:"mode"},d={toc:"#lia-toc .lia-toc__content",menu:"#lia-support-menu .lia-support-menu__item--settings .lia-support-menu__submenu",classroom:"#lia-support-menu .lia-support-menu__item--share .lia-support-menu__submenu",info:"#lia-support-menu .lia-support-menu__item--info .lia-support-menu__submenu",translator:"#lia-support-menu .lia-support-menu__item--lang .lia-support-menu__submenu",mode:"#lia-support-menu .lia-support-menu__item--mode .lia-support-menu__submenu"},h=new Map,m=new Map,f=new Set,p=new Map,g=new Map,b=new Set,y=new Set,v=new Set,k=new(0,i.CollectibleVisibilityGate),w=null,x=null,S=null,L=0,C="idle",E=!1;function _(e,t,o){let n,r,l,i=document.createElement("button");return i.type="button",i.className="loot-treasure-chest","diamonds"===o?i.classList.add("loot-treasure-chest--diamonds"):"energy"===o&&i.classList.add("loot-treasure-chest--energy"),i.dataset.lootChestButton=e,i.dataset.lootChestLocation=t,i.dataset.lootChestReward=o,i.setAttribute("aria-label","diamonds"===o?"Diamanttruhe öffnen und einen Diamanten erhalten":"energy"===o?"Energiekiste öffnen und einen Energiepunkt erhalten":"Schatztruhe öffnen und eine Goldmünze erhalten"),i.append(((n=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("viewBox","0 0 64 56"),n.setAttribute("shape-rendering","crispEdges"),n.setAttribute("aria-hidden","true"),n.classList.add("loot-treasure-chest-graphic"),"diamonds"===o?n.classList.add("loot-treasure-chest-graphic--diamonds"):"energy"===o&&n.classList.add("loot-treasure-chest-graphic--energy"),r="diamonds"===o?`
        <polygon class="loot-chest-diamond-outline" points="32,31 41,36 32,47 23,36"/>
        <polygon class="loot-chest-diamond-dark" points="32,33 38,36 32,44 26,36"/>
        <polygon class="loot-chest-diamond" points="32,33 38,36 32,41 26,36"/>
        <polygon class="loot-chest-diamond-light" points="32,33 32,40 26,36"/>
      `:"energy"===o?`
          <polygon class="loot-chest-energy-outline" points="33,31 40,31 35,36 39,36 28,47 31,39 24,39"/>
          <polygon class="loot-chest-energy" points="34,33 37,33 33,37 36,37 30,43 32,38 27,38"/>
          <polygon class="loot-chest-energy-light" points="34,33 36,33 33,36 32,36"/>
        `:`
          <rect class="loot-chest-keyhole" x="31" y="37" width="2" height="5"/>
          <rect class="loot-chest-keyhole" x="30" y="40" width="4" height="2"/>
        `,n.innerHTML=`
    <rect class="loot-chest-shadow" x="8" y="50" width="48" height="4"/>
    <g class="loot-chest-lid">
      <rect class="loot-chest-outline" x="8" y="6" width="48" height="18"/>
      <rect class="loot-chest-wood-dark" x="12" y="10" width="40" height="12"/>
      <rect class="loot-chest-wood" x="16" y="10" width="32" height="4"/>
      <rect class="loot-chest-wood-light" x="16" y="10" width="20" height="2"/>
      <rect class="loot-chest-wood" x="12" y="16" width="40" height="6"/>
      <rect class="loot-chest-metal-dark" x="28" y="6" width="8" height="18"/>
      <rect class="loot-chest-metal" x="30" y="8" width="4" height="14"/>
      <rect class="loot-chest-outline" x="4" y="22" width="56" height="10"/>
      <rect class="loot-chest-metal-dark" x="8" y="24" width="48" height="6"/>
      <rect class="loot-chest-metal" x="8" y="24" width="48" height="2"/>
      <rect class="loot-chest-metal-light" x="12" y="24" width="16" height="2"/>
    </g>
    <rect class="loot-chest-outline" x="8" y="30" width="48" height="20"/>
    <rect class="loot-chest-wood-dark" x="12" y="34" width="40" height="12"/>
    <rect class="loot-chest-wood" x="12" y="34" width="40" height="6"/>
    <rect class="loot-chest-wood-light" x="16" y="34" width="18" height="2"/>
    <rect class="loot-chest-metal-dark" x="28" y="30" width="8" height="20"/>
    <rect class="loot-chest-metal" x="30" y="32" width="4" height="16"/>
    <rect class="loot-chest-outline" x="24" y="30" width="16" height="16"/>
    <rect class="loot-chest-metal-dark" x="28" y="34" width="8" height="8"/>
    <rect class="loot-chest-metal" x="30" y="34" width="4" height="4"/>
    ${r}
    <rect class="loot-chest-outline" x="12" y="50" width="8" height="4"/>
    <rect class="loot-chest-outline" x="44" y="50" width="8" height="4"/>
  `,n),((l=document.createElement("span")).className="loot-treasure-reward","diamonds"===o?l.classList.add("loot-treasure-reward--diamonds"):"energy"===o&&l.classList.add("loot-treasure-reward--energy"),l.setAttribute("aria-hidden","true"),l.innerHTML="diamonds"===o?'<span class="loot-treasure-reward__gem"></span><span>+1</span>':"energy"===o?'<span class="loot-treasure-reward__energy"></span><span>+1</span>':'<span class="loot-treasure-reward__coin"></span><span>+1</span>',l)),i.addEventListener("click",()=>{if(!(!w||b.has(e))&&(y.has(e)||(R(),i.isConnected&&y.has(e)))){if(!w.active(o)){let e;return void(i.querySelector(".loot-treasure-requirement")?.remove(),(e=document.createElement("span")).className="loot-treasure-requirement",e.setAttribute("role","status"),e.textContent="energy"===o?"Zuerst Energie mit @Ressourcen(Gold, Diamanten, Energie) festlegen":"Zuerst @Ressourcen(...) ausführen",i.appendChild(e),i.classList.remove("loot-treasure-chest--waiting"),i.offsetWidth,i.classList.add("loot-treasure-chest--waiting"),window.setTimeout(()=>{e.remove(),i.classList.remove("loot-treasure-chest--waiting")},2200))}if(b.add(e),!w.collect(e,o)){b.delete(e),K();return}i.disabled=!0,i.classList.add("loot-treasure-chest--opened"),window.setTimeout(()=>{b.delete(e);let t=i.closest(`[${c}]`);t?t.remove():i.remove(),O()},650)}}),i}function A(e){return[...new Set(e.map(e=>u[e.trim().toLowerCase()]).filter(e=>void 0!==e))]}function j(e){return e.filter(e=>void 0===u[e.trim().toLowerCase()]).map(e=>`Unbekanntes Truhenziel oder Option: ${e}`)}function I(e){let t=0;for(let o of e){let e=(0,i.parseCollectibleOptions)(o.placement);if([...e.errors,...j(e.values)].length>0)continue;let n=new Set(A(e.values));t+=""===o.placement||e.hasOptions&&0===e.values.length?1:n.size}return t}function M(e,t){return`${e}:${t.reward}:${[...t.placements].sort().join(";")}:${(0,i.collectibleVisibilitySignature)(t.visibility)}`}function N(e,t){v.has(e)||(v.add(e),console.warn(`Loot: Fund ${e} bleibt wegen ung\xfcltiger Optionen verborgen. ${t.join(" ")}`))}function T(e,t){let o=t.sourceSection,n=null===o?null:M(o,t),r=g.get(e);if(null!==n&&r===n)return void h.delete(e);r&&g.delete(e);let l=null===n?0:p.get(n)??0;if(null!==n&&function(e){let t=0;for(let o of g.values())o===e&&(t+=1);return t}(n)<l){g.set(e,n),h.delete(e);return}h.set(e,t)}function $(e){for(let e of f)h.delete(e);for(let t of(f.clear(),p.clear(),g.clear(),e)){let e=(0,i.parseCollectibleOptions)(t.placement),o=[...e.errors,...j(e.values)];if(o.length>0){N(t.baseId,o);continue}let n=new Set(A(e.values));if(0===n.size)continue;let r={placements:n,reward:t.reward,sourceSection:t.section,visibility:e.rule};h.set(t.baseId,r),f.add(t.baseId);let l=M(t.section,r);p.set(l,(p.get(l)??0)+1)}for(let[t,o]of(C="complete",w?.catalogReady(I(e)),m))T(t,o);m.clear(),O()}function z(e){let t,o,n,r,l,a,c,u,d=(t=function(e){let t=e.getAttribute("data-chest-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootRuntimeId;if(o)return o;L+=1;let n=`runtime-${L}`;return e.dataset.lootRuntimeId=n,n}(e),n="diamonds"===(o=e.getAttribute("data-reward")?.trim().toLowerCase())||"diamond"===o||"gems"===o||"diamant"===o||"diamanten"===o?"diamonds":"energy"===o||"energie"===o||"power"===o||"bolt"===o?"energy":"gold",l="@0"===(r=e.getAttribute("data-placement")?.trim()??"")?"":r,c=[...(a=(0,i.parseCollectibleOptions)(l)).errors,...j(a.values)],u=A(a.values),{baseId:t,errors:c,inline:""===l||a.hasOptions&&0===a.values.length,placements:u,reward:n,sourceHost:e,sourceSection:(0,s.sectionFromLootId)(t),valid:0===c.length,visibility:a.rule});if(d.valid)if(d.inline)m.delete(d.baseId),h.delete(d.baseId),g.delete(d.baseId),e.classList.remove("loot-treasure-host--portal-source"),e.removeAttribute("aria-hidden");else{let t={placements:new Set(d.placements),reward:d.reward,sourceHost:d.sourceHost,sourceSection:d.sourceSection,visibility:d.visibility};"complete"===C?T(d.baseId,t):m.set(d.baseId,t),e.classList.add("loot-treasure-host--portal-source"),e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren()}else N(d.baseId,d.errors),m.delete(d.baseId),h.delete(d.baseId),g.delete(d.baseId),e.classList.add("loot-treasure-host--portal-source"),e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren();return d}function q(e){return[...document.querySelectorAll(`[${c}]`)].find(t=>t.dataset.lootChestPortal===e)??null}function R(){if(w){for(let e of(y.clear(),document.querySelectorAll(a))){let t=z(e);t.valid&&t.inline&&function(e,t,o){var n;if(!w)return;let r=b.has(t);if(w.collected(t)&&!r){y.delete(t),k.forget(`chest:${o.baseId}`),e.childElementCount>0&&e.replaceChildren();return}let l=k.visible(`chest:${o.baseId}`,o.visibility,(0,s.sourceSlideIsActive)(o.sourceSection,e),O);if(l?y.add(t):y.delete(t),!l&&!r){e.childElementCount>0&&e.replaceChildren();return}r||(n=o.reward,[...e.querySelectorAll("[data-loot-chest-button]")].find(e=>e.dataset.lootChestButton===t&&e.dataset.lootChestReward===n))||e.replaceChildren(_(t,"inline",o.reward))}(e,`${t.baseId}:inline`,t)}!function(){if(!w)return;let e=new Set;for(let[t,o]of h){let n=k.visible(`chest:${t}`,o.visibility,(0,s.sourceSlideIsActive)(o.sourceSection,o.sourceHost),O);for(let r of o.placements){let l=`${t}:${r}`,i=b.has(l),s=w.collected(l)&&!i;if(!n&&!i){y.delete(l),q(l)?.remove();continue}e.add(l),n&&!s?y.add(l):y.delete(l),s?q(l)?.remove():i||function(e,t,o){let n=q(e);if(n?.dataset.lootChestReward===o)return;n?.remove();let r=document.querySelector(d[t]);if(!r)return;let l=r.matches("ul, ol"),i=document.createElement(l?"li":"div");i.className=`loot-chest-placement loot-chest-placement--${t}`,i.dataset.lootChestPortal=e,i.dataset.lootChestLocation=t,i.dataset.lootChestReward=o,l&&(i.classList.add("nav__item","lia-support-menu__item"),i.setAttribute("role","none")),i.append(_(e,t,o)),r.appendChild(i)}(l,r,o.reward)}}for(let t of document.querySelectorAll(`[${c}]`)){let o=t.dataset.lootChestPortal;o&&(e.has(o)||b.has(o))||t.remove()}}()}}function O(){null===S&&(S=window.setTimeout(()=>{S=null,R()},0))}class D extends HTMLElement{static get observedAttributes(){return["data-chest-id","data-placement","data-reward"]}connectedCallback(){z(this),O()}attributeChangedCallback(){this.isConnected&&(y.clear(),z(this),O())}}function K(){R()}function F(e){w=e,document.getElementById("lia-loot-treasure-chest")?.remove(),"idle"===C&&(C="pending",(0,l.discoverCourseChestDeclarations)().then($).catch(()=>$([]))),E||(E=!0,(0,s.observeLiaSlideActivity)(()=>{y.clear(),O()})),customElements.get(a)||customElements.define(a,D),x||(x=new MutationObserver(O)).observe(document.documentElement,{childList:!0,subtree:!0}),K()}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./collectible-visibility.ts":"3JMDS","./slide-activity.ts":"99v7X","./course-chests.ts":"blH4i"}],"3JMDS":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"MAX_COLLECTIBLE_DELAY_MS",()=>l),r.export(o,"parseCollectibleOptions",()=>c),r.export(o,"collectibleVisibilitySignature",()=>u),r.export(o,"advanceCollectibleReveal",()=>d),r.export(o,"CollectibleVisibilityGate",()=>h);let l=0x7fffffff,i=new Set(["anker","nur auf folie","nur-auf-folie","folie","only on slide","only-on-slide","slide only","slide-only"]),s=/^(?:(?:erst\s+)?nach\s+|nach\s*=\s*)?(\d+(?:[.,]\d+)?)\s*(s|sek|sekunde|sekunden|m|min|minute|minuten)$/u,a=/^(?:ank\p{L}*|nur(?:\s+|-)|only(?:\s+|-)|slide(?:\s+|-)?only|(?:erst\s+)?nach(?:\s|=|$)|\d+(?:[.,]\d+)?\s*\p{L})|(?:\bfoli\p{L}*\b|\bslides?\b|\bsek\p{L}*\b|\bmin(?:ute|uten)?\b)/u;function c(e){let t=[],o=[],n=0,r=!1,c=!1,u=!1;for(let d of e.split(";")){let e=d.trim();if(!e)continue;let h=e.normalize("NFKC").replace(/\s+/gu," ").trim().toLocaleLowerCase("de-DE");if(i.has(h)){u=!0,c=!0;continue}let m=function(e){let t=s.exec(e);if(!t)return{matched:!1,value:null};let o=Number(t[1].replace(",","."))*(["s","sek","sekunde","sekunden"].includes(t[2])?1e3:6e4);return{matched:!0,value:Number.isFinite(o)&&o>=0&&o<=l?o:null}}(h);if(m.matched){c=!0,null===m.value?o.push(`Ung\xfcltige Verz\xf6gerung: ${e}`):r?o.push("Die Verzögerung darf nur einmal angegeben werden."):(n=m.value,r=!0);continue}if(a.test(h)){c=!0,o.push(`Unbekannte Sichtbarkeitsoption: ${e}`);continue}t.push(e)}return{errors:o,hasOptions:c,rule:{delayMs:n,onlyOnSlide:u},valid:0===o.length,values:t}}function u(e){return`${+!!e.onlyOnSlide}:${e.delayMs}`}function d(e,t,o,n){let r=u(e),l=t?.signature===r?t:null,i=!e.onlyOnSlide||n;if(!l&&i&&(l={signature:r,startedAt:Number.isFinite(o)?o:0}),!l)return{state:null,visible:!1,wakeAt:null};let s=l.startedAt+e.delayMs,a=o>=s;return{state:l,visible:a&&(!e.onlyOnSlide||n),wakeAt:a?null:s}}class h{constructor(e=()=>Date.now(),t=(e,t)=>window.setTimeout(e,t),o=e=>window.clearTimeout(e)){this.states=new Map,this.wakes=new Map,this.now=e,this.schedule=t,this.cancel=o}visible(e,t,o,n){let r=this.now(),l=d(t,this.states.get(e)??null,r,o);return l.state?this.states.set(e,l.state):this.states.delete(e),this.syncWake(e,l.wakeAt,r,n),l.visible}forget(e){this.states.delete(e);let t=this.wakes.get(e);t&&this.cancel(t.handle),this.wakes.delete(e)}syncWake(e,t,o,n){let r=this.wakes.get(e);if(r&&r.at===t||(r&&this.cancel(r.handle),this.wakes.delete(e),null===t))return;let l=this.schedule(()=>{let t=this.wakes.get(e);t&&t.handle===l&&(this.wakes.delete(e),n())},Math.max(0,t-o));this.wakes.set(e,{at:t,handle:l})}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"99v7X":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"activeLiaSection",()=>p),r.export(o,"sectionFromLootId",()=>g),r.export(o,"sourceSlideIsActive",()=>b),r.export(o,"setLiaSlideAccessGuard",()=>v),r.export(o,"refreshLiaSlideActivity",()=>k),r.export(o,"observeLiaSlideActivity",()=>L);let l=".lia-slide__container",i=".lia-slide__container > main.lia-slide__content:not([hidden])",s=new Set,a=()=>!0,c=null,u=null,d=null,h=null,m=!1;function f(e){let t=/^#(\d+)$/.exec(e);if(!t)return null;let o=Number(t[1])-1;return Number.isInteger(o)&&o>=0?o:null}function p(){let e=document.querySelector(i),t=e?.parentElement;if(e&&t){let o=[...t.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(e);if(o>=0)return o}let o=document.querySelector("#lia-toc #focusedToc.lia-toc__link");if(o){let e=function(e){try{return f(new URL(e.href,window.location.href).hash)}catch{return f(e.getAttribute("href")??"")}}(o);if(null!==e)return e}return f(window.location.hash)}function g(e){let t=/(?:^|:)(\d+)_\d+(?::|$)/.exec(e);if(!t)return null;let o=Number(t[1]);return Number.isInteger(o)&&o>=0?o:null}function b(e,t){let o=p();if(!a(o??e))return!1;if(null!==e&&null!==o)return e===o;let n=t?.closest("main");return!!(n&&!n.hidden&&n.classList.contains("lia-slide__content"))}function y(){for(let e of s)e()}function v(e){a=e,y()}function k(){y()}function w(e){for(let t of(u?.disconnect(),u=new MutationObserver(t=>{t.some(t=>t.target instanceof HTMLElement&&"MAIN"===t.target.tagName&&t.target.parentElement===e)&&y()}),e.children))t instanceof HTMLElement&&"MAIN"===t.tagName&&u.observe(t,{attributeFilter:["class","hidden"],attributes:!0})}function x(){let e,t=(e=document.querySelector(i),e?.parentElement?.classList.contains(l.slice(1))?e.parentElement:[...document.querySelectorAll(l)].find(e=>[...e.children].some(e=>e instanceof HTMLElement&&"MAIN"===e.tagName))??null);t===c||(u?.disconnect(),d?.disconnect(),c=t,t&&(w(t),(d=new MutationObserver(()=>{w(t),y()})).observe(t,{childList:!0}),y()))}function S(e){return e instanceof Element&&(e.matches(l)||null!==e.querySelector(l)||null!==c&&e.contains(c))}function L(e){return s.add(e),h||(h=new MutationObserver(e=>{(null===c||!1===c.isConnected||e.some(e=>[...e.addedNodes,...e.removedNodes].some(S)))&&x()})).observe(document.documentElement,{childList:!0,subtree:!0}),m||(m=!0,window.addEventListener("hashchange",y),window.addEventListener("pageshow",y),window.addEventListener("popstate",y)),x(),e(),()=>{s.delete(e)}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],blH4i:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"parseCourseChestDeclarations",()=>y),r.export(o,"parseCourseLockDeclarations",()=>v),r.export(o,"parseCourseResourceDeclaration",()=>w),r.export(o,"parseCourseSecretSlideDeclarations",()=>x),r.export(o,"parseCourseAchievementsDeclaration",()=>S),r.export(o,"discoverCourseChestDeclarations",()=>E),r.export(o,"discoverCourseLockDeclarations",()=>_),r.export(o,"discoverCourseResourceDeclaration",()=>A),r.export(o,"discoverCourseSecretSlideDeclarations",()=>j),r.export(o,"discoverCourseAchievementsDeclaration",()=>I),r.export(o,"requireCourseSecretSlideDeclarations",()=>M);var l=e("./key-colors.ts");let i=/^\s*@(Schatztruhe|Diamanttruhe|Energiekiste)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/,s=/^\s*@Schloss\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*\)\s*$/,a=/^\s*@Ressourcen\s*\(\s*([^,()\r\n]+?)\s*,\s*([^,()\r\n]+?)(?:\s*,\s*([^,()\r\n]+?))?\s*\)\s*$/,c=/^\s*@Geheimfolie\s*$/,u=/^\s*@(achievements|erfolge)\s*$/i,d=/^\+?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[+-]?\d+)?$/i,h=[0,300,1e3],m={Schatztruhe:"gold",Diamanttruhe:"diamonds",Energiekiste:"energy"},f=null,p=null;function g(e){let t=0x811c9dc5;for(let o=0;o<e.length;o+=1)t^=e.charCodeAt(o),t=Math.imul(t,0x1000193);return(t>>>0).toString(36)}function b(e){let t=[],o=null,n=!1,r=null,l=-1;for(let i of e.split(/\r?\n/)){let e=function(e,t){let o="",n=0,r=t;for(;n<e.length;){if(r){let t=e.indexOf("--\x3e",n);if(t<0)return{visible:o,inComment:!0};n=t+3,r=!1;continue}let t=e.indexOf("\x3c!--",n);if(t<0){o+=e.slice(n);break}o+=e.slice(n,t),n=t+4,r=!0}return{visible:o,inComment:r}}(i,n);if(n=e.inComment,o){(function(e,t){let o=/^ {0,3}(`{3,}|~{3,})\s*$/.exec(e);return null!==o&&o[1][0]===t.marker&&o[1].length>=t.length})(e.visible,o)&&(o=null);continue}let s=function(e){let t=/^ {0,3}(`{3,}|~{3,})/.exec(e);return t?{marker:t[1][0],length:t[1].length}:null}(e.visible);if(s){o=s;continue}if(r){RegExp(`</${r}\\s*>`,"i").test(e.visible)&&(r=null);continue}let a=/<(script|style|pre|code|textarea|template)(?:\s|>)/i.exec(e.visible);if(a){let t=a[1].toLowerCase();RegExp(`</${t}\\s*>`,"i").test(e.visible)||(r=t);continue}if(/^(?: {4}|\t)/.test(e.visible))continue;let c=function(e){let t="",o=0;for(let n=0;n<e.length;){if("`"===e[n]&&"\\"!==e[n-1]){let r=n+1;for(;"`"===e[r];)r+=1;let l=r-n;0===o?o=l:o===l&&(o=0),t+=" ".repeat(l),n=r;continue}t+=0===o?e[n]:" ",n+=1}return t}(e.visible);/^ {0,3}#{1,6}(?:\s+|$)/.test(c)&&(l+=1),t.push({content:c,section:l})}return t}function y(e){let t=[],o=new Map;for(let n of b(e)){let e=i.exec(n.content);if(!e)continue;let r=(e[2]??"").trim(),l=m[e[1]],s=function(e,t){let o=t.split(";").map(e=>e.trim().toLowerCase()).join(";");return`${e}(${o})`}(e[1],r),a=(o.get(s)??0)+1;o.set(s,a),t.push({baseId:`source-${l}-${g(s)}-${a}`,placement:r,reward:l,section:n.section})}return t}function v(e){let t=[],o=new Map;for(let n of b(e)){let e=s.exec(n.content);if(!e)continue;let r=e[1].trim(),i=(0,l.requestedKeyColor)(e[2]);if(!i)continue;let a=`Schloss(${r.toLowerCase()},${i})`,c=(o.get(a)??0)+1;o.set(a,c),t.push({baseId:`source-lock-${g(a)}-${c}`,target:r,color:i,section:n.section})}return t}function k(e){let t=e.trim();if(!d.test(t))return null;let o=Number(t);return Number.isFinite(o)&&o>=0?o:null}function w(e){for(let t of b(e)){let e=a.exec(t.content);if(!e)continue;let o=k(e[1]),n=k(e[2]),r=void 0===e[3]?void 0:k(e[3]);if(null!==o&&null!==n&&null!==r)return{gold:o,diamonds:n,...void 0===r?{}:{energy:r},section:t.section}}return null}function x(e){let t=[],o=new Set;for(let n of b(e))!(n.section<0||o.has(n.section))&&c.test(n.content)&&(o.add(n.section),t.push({section:n.section}));return t}function S(e){return b(e).some(e=>u.test(e.content))}async function L(){let e=function(){let e=window.LIA,t=e?.defaultCourseURL?.trim();if(t)try{let e=new URL(t,window.location.href);if(/^(?:https?:|blob:|data:)$/i.test(e.protocol))return e.href}catch{}return function(e){let t=e.trim();if(!t)return null;let o=[t];try{let e=decodeURIComponent(t);e!==t&&o.push(e)}catch{}return o.find(e=>/^(?:https?:|blob:|data:)/i.test(e))??null}(window.location.search.slice(1))}();if(!e)return null;let t=window.LIA,o=t?.fetch??window.fetch.bind(window),n=new AbortController,r=window.setTimeout(()=>n.abort(),4e3);try{let t=await o(e,{cache:"default",credentials:"same-origin",signal:n.signal});if(!t.ok)return null;let r=await t.text();return r.length<=0xa00000?r:null}catch{return null}finally{window.clearTimeout(r)}}async function C(){if(null!==f)return f;if(p)return p;p=(async()=>{for(let e of h){e>0&&await new Promise(t=>window.setTimeout(t,e));let t=await L();if(null!==t)return f=t,t}return null})();try{return await p}finally{p=null}}async function E(){let e=await C();return e?y(e):[]}async function _(){let e=await C();return e?v(e):[]}async function A(){let e=await C();return e?w(e):null}async function j(){let e=await C();return e?x(e):[]}async function I(){let e=await C();return!!e&&S(e)}async function M(){let e=await C();if(null===e)throw Error("Die LiaScript-Kursquelle konnte nicht geladen werden.");return x(e)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./key-colors.ts":"kuyjk"}],"9M6A9":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"KeyInventoryStore",()=>s);var l=e("./key-colors.ts"),i=e("./storage.ts");class s{collectKey(e,t){let o=e.trim();return!(!o||this.current.collectedKeys.includes(o))&&(this.current.keys[t]+=1,this.current.collectedKeys.push(o),(0,i.saveKeyInventory)(this.current),!0)}isKeyCollected(e){return this.current.collectedKeys.includes(e.trim())}useKeyForLock(e,t){let o=e.trim();return o?this.current.unlockedLocks.includes(o)?"already-unlocked":this.current.keys[t]<=0?"missing-key":(this.current.keys[t]-=1,this.current.unlockedLocks.push(o),(0,i.saveKeyInventory)(this.current),"unlocked"):"invalid-lock-id"}isLockUnlocked(e){return this.current.unlockedLocks.includes(e.trim())}state(){var e;return{...e=this.current,keys:{...e.keys},collectedKeys:[...e.collectedKeys],unlockedLocks:[...e.unlockedLocks]}}constructor(){this.current=(0,i.loadKeyInventory)()??{version:1,keys:(0,l.createEmptyKeyCounts)(),collectedKeys:[],unlockedLocks:[]}}}},{"./key-colors.ts":"kuyjk","./storage.ts":"6UGi5","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"7pcz5":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"renderKeyInventory",()=>c),r.export(o,"announceKeyFound",()=>u),r.export(o,"focusKeyInventory",()=>d);var l=e("./key-colors"),i=e("./key-visual"),s=e("./resource-bar");let a="lia-loot-key-inventory";function c(e){let t=l.KEY_COLORS.filter(t=>e[t]>0);if(0===t.length){document.getElementById(a)?.remove(),(0,s.refreshResourceBarVisibility)();return}let o=(function(){let e,t=document.getElementById(a);if(t)return t;let o=document.createElement("div");o.id=a,o.className="loot-key-inventory",o.setAttribute("role","group"),o.setAttribute("aria-label","Schlüsselinventar"),o.tabIndex=-1;let n=document.createElement("ul");return n.className="loot-key-inventory__list",n.setAttribute("role","list"),o.append(n,((e=document.createElement("span")).className="loot-key-inventory__status",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e)),(0,s.installResourceBar)().appendChild(o),o})().querySelector(".loot-key-inventory__list");if(o){for(let n of(o.replaceChildren(),t)){let t=l.KEY_COLOR_DETAILS[n].foundMessage.replace(/\s+gefunden\.$/,"");for(let r=0;r<e[n];r+=1){let l=document.createElement("li");l.className=`loot-key-inventory__item loot-key-color--${n}`,l.dataset.lootKeyColor=n,l.dataset.lootKeyInstance=`${n}-${r+1}`,l.setAttribute("aria-label",1===e[n]?t:`${t}, Exemplar ${r+1} von ${e[n]}`);let s=(0,i.createKeyGraphic)(n);s.classList.add("loot-key-inventory__icon"),l.append(s),o.appendChild(l)}}(0,s.refreshResourceBarVisibility)()}}function u(e){let t=document.querySelector(".loot-key-inventory__status");t&&(t.textContent="",window.setTimeout(()=>{t.textContent=e},0))}function d(){document.getElementById(a)?.focus({preventScroll:!0})}},{"./key-colors":"kuyjk","./key-visual":"mOWpJ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./resource-bar":"eGQGH"}],mOWpJ:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(e){let t=document.createElementNS("http://www.w3.org/2000/svg","svg");return t.setAttribute("viewBox","0 0 48 32"),t.setAttribute("shape-rendering","crispEdges"),t.setAttribute("aria-hidden","true"),t.classList.add("loot-key-graphic",`loot-key-color--${e}`),t.innerHTML=`
    <rect class="loot-key-shadow" x="4" y="28" width="40" height="3"/>
    <rect class="loot-key-outline" x="4" y="4" width="20" height="20"/>
    <rect class="loot-key-outline" x="20" y="10" width="24" height="12"/>
    <rect class="loot-key-outline" x="32" y="18" width="4" height="8"/>
    <rect class="loot-key-outline" x="40" y="18" width="4" height="8"/>
    <rect class="loot-key-main" x="8" y="8" width="12" height="12"/>
    <rect class="loot-key-main" x="20" y="14" width="20" height="4"/>
    <rect class="loot-key-main" x="32" y="18" width="4" height="4"/>
    <rect class="loot-key-main" x="40" y="18" width="4" height="4"/>
    <rect class="loot-key-light" x="8" y="8" width="12" height="4"/>
    <rect class="loot-key-light" x="20" y="14" width="16" height="2"/>
    <rect class="loot-key-hole" x="12" y="12" width="4" height="4"/>
  `,t}r.defineInteropFlag(o),r.export(o,"createKeyGraphic",()=>l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"2Xfsw":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"installKeyPickups",()=>k);var l=e("./key-colors"),i=e("./key-visual"),s=e("./collectible-visibility.ts"),a=e("./slide-activity.ts");let c="lia-loot-key",u=null,d=0,h=new Set,m=new Set,f=new Set,p=new(0,s.CollectibleVisibilityGate),g=!1;function b(e){var t;let o,n,r;if(!u)return;let c=function(e){let t=e.getAttribute("data-key-id")?.trim();if(t&&!t.startsWith("@"))return`key:${t}:inline`;let o=e.dataset.lootKeyRuntimeId;if(o)return o;d+=1;let n=`key:runtime-${d}:inline`;return e.dataset.lootKeyRuntimeId=n,n}(e);if(u.collected(c)&&!h.has(c)){m.delete(c),p.forget(`pickup:${c}`),e.childElementCount>0&&e.replaceChildren();return}let g=(o=e.getAttribute("data-color")?.trim()??"",r=[...(n=(0,s.parseCollectibleOptions)("@0"===o?"":o)).errors],n.values.length>1?r.push("Für einen Schlüssel darf höchstens eine Farbe angegeben werden."):1!==n.values.length||(0,l.isKeyColorRequest)(n.values[0])||r.push(`Unbekannte Schl\xfcsselfarbe oder Option: ${n.values[0]}`),{errors:r,requestedColor:n.values[0]??null,sourceSection:(0,a.sectionFromLootId)(c),valid:0===r.length,visibility:n.rule});if(!g.valid){m.delete(c),t=g.errors,f.has(c)||(f.add(c),console.warn(`Loot: Schl\xfcssel ${c} bleibt wegen ung\xfcltiger Optionen verborgen. ${t.join(" ")}`)),e.childElementCount>0&&e.replaceChildren();return}let{color:b}=(0,l.resolveKeyAppearance)(c,g.requestedColor);if(h.has(c))return;if(!p.visible(`pickup:${c}`,g.visibility,(0,a.sourceSlideIsActive)(g.sourceSection,e),y)){m.delete(c),e.childElementCount>0&&e.replaceChildren();return}m.add(c);let v=[...e.querySelectorAll("[data-loot-key-button]")].find(e=>e.dataset.lootKeyButton===c);if(v?.dataset.lootKeyColor!==b){let t,o;e.replaceChildren(((t=document.createElement("button")).type="button",t.className=`loot-key-pickup loot-key-color--${b}`,t.dataset.lootKeyButton=c,t.dataset.lootKeyColor=b,t.setAttribute("aria-label",`${l.KEY_COLOR_DETAILS[b].pickupLabel} einsammeln`),t.append((0,i.createKeyGraphic)(b),((o=document.createElement("span")).className="loot-key-pickup__reward",o.setAttribute("aria-hidden","true"),o.textContent="+1",o)),t.addEventListener("click",e=>{if(!u||h.has(c)||!m.has(c))return;if(h.add(c),!u.collect(c,b)){h.delete(c),y();return}let o=0===e.detail;t.disabled=!0,t.classList.add("loot-key-pickup--collected"),t.setAttribute("aria-label",l.KEY_COLOR_DETAILS[b].foundMessage),window.setTimeout(()=>{h.delete(c),t.remove(),o&&u?.focusInventory()},650)}),t))}}function y(){m.clear(),document.querySelectorAll(c).forEach(b)}class v extends HTMLElement{static get observedAttributes(){return["data-key-id","data-color"]}connectedCallback(){b(this)}attributeChangedCallback(){this.isConnected&&b(this)}}function k(e){u=e,g||(g=!0,(0,a.observeLiaSlideActivity)(y)),customElements.get(c)||customElements.define(c,v),y()}},{"./key-colors":"kuyjk","./key-visual":"mOWpJ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./collectible-visibility.ts":"3JMDS","./slide-activity.ts":"99v7X"}],jhthD:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"courseLockUnitCount",()=>T),r.export(o,"refreshObjectLocks",()=>Y),r.export(o,"installObjectLocks",()=>V);var l=e("./course-chests.ts"),i=e("./key-colors.ts"),s=e("./lock-targets.ts");let a="lia-loot-lock",c=".lia-quiz",u="lia-loot-lock-status",d={mode:{rootSelector:"#lia-support-menu .lia-support-menu__item--mode",triggerGroup:"mode",contentGroup:"mode",focusSelector:"#lia-mode-textbook"},menu:{rootSelector:"#lia-support-menu .lia-support-menu__item--settings",triggerGroup:"setting",contentGroup:"setting",focusSelector:"#lia-btn-light-mode"},translator:{rootSelector:"#lia-support-menu .lia-support-menu__item--lang",triggerGroup:"translation",contentGroup:"translation",focusSelector:"#lia-checkbox-google_translate"},classroom:{rootSelector:"#lia-support-menu .lia-support-menu__item--share",triggerGroup:"share",contentGroup:"share",focusSelector:"#lia-button-qr-code"},info:{rootSelector:"#lia-support-menu .lia-support-menu__item--info",triggerGroup:"information",contentGroup:"information",focusSelector:""}},h={check:".lia-quiz__control .lia-quiz__check",resolve:".lia-quiz__control .lia-quiz__resolve",hint:".lia-quiz__control .lia-quiz__hint"},m={toc:"Inhaltsverzeichnis",mode:"Darstellung",menu:"Menü",translator:"Übersetzer",classroom:"Classroom",info:"Info-Menü",seitenwechsel:"Seitenwechsel",check:"Prüfen",resolve:"Auflösen",hint:"Hinweis"},f={red:"Rotes Schloss",blue:"Blaues Schloss",green:"Grünes Schloss",yellow:"Gelbes Schloss",purple:"Lilafarbenes Schloss",orange:"Orangefarbenes Schloss"},p={red:"roten Schlüssel",blue:"blauen Schlüssel",green:"grünen Schlüssel",yellow:"gelben Schlüssel",purple:"lilafarbenen Schlüssel",orange:"orangefarbenen Schlüssel"},g={red:"roter Schlüssel",blue:"blauer Schlüssel",green:"grüner Schlüssel",yellow:"gelber Schlüssel",purple:"lilafarbener Schlüssel",orange:"orangefarbener Schlüssel"},b=new Map,y=[],v=new Set,k=new WeakMap,w=new WeakMap,x=null,S=null,L=null,C=null,E=0,_=0,A="idle",j=!1,I=!1;function M(e){return"global"===e.scope?`lock:${e.target}:${e.color}`:`lock:${e.baseId}:${e.target}:${e.color}`}function N(e){let t=function(e){let t=e.getAttribute("data-lock-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootLockRuntimeId;if(o)return o;E+=1;let n=`runtime-lock-${E}`;return e.dataset.lootLockRuntimeId=n,n}(e),o=(0,s.resolveLockTarget)(e.getAttribute("data-target")),n=(0,i.requestedKeyColor)(e.getAttribute("data-color"));if(e.classList.add("loot-object-lock-host"),"true"!==e.getAttribute("aria-hidden")&&e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren(),delete e.dataset.lootLockError,!o||!n)return null;if((0,s.isGlobalLockTarget)(o))return{baseId:t,target:o,color:n,scope:"global"};let r=function(e){let t,o=e.closest(c);if(o)return o;let n=e.closest("main.lia-slide__content");if(!n)return null;let r=function(e,t){let o=e;for(;o.parentElement&&o.parentElement!==t;)o=o.parentElement;return o.parentElement===t?o:null}(e,n);if(!r)return null;let l=r.previousElementSibling;for(;l instanceof HTMLElement&&1===(t=[...l.children]).length&&t[0]instanceof HTMLElement&&t[0].matches(a);)l=l.previousElementSibling;return l instanceof HTMLElement&&l.matches(c)?l:null}(e);return r?{baseId:t,target:o,color:n,scope:"local",quiz:r}:(e.dataset.lootLockError="quiz-not-adjacent",null)}function T(e){let t=new Set;for(let o of e){let e=(0,s.resolveLockTarget)(o.target);if(!e)continue;let n=(0,s.isGlobalLockTarget)(e)?"global":(0,s.isLocalLockTarget)(e)?"local":null;n&&t.add(M({baseId:o.baseId,target:e,color:o.color,scope:n}))}return t.size}function $(e){for(let t of(y.length=0,e)){let e=function(e){let t=(0,s.resolveLockTarget)(e.target);return t&&(0,s.isGlobalLockTarget)(t)?{baseId:e.baseId,target:t,color:e.color,scope:"global"}:null}(t);e&&y.push(e)}A="complete",x?.catalogReady(T(e)),P()}function z(){let e=document.getElementById(u);if(e)return e;let t=document.createElement("div");return t.id=u,t.className="loot-object-lock-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function q(e,t){return[...e.children].filter(e=>e instanceof HTMLElement&&e.matches(t))}function R(e,t,o){e.getAttribute(t)!==o&&e.setAttribute(t,o)}function O(e,t,o){null===o?e.removeAttribute(t):e.setAttribute(t,o)}function D(e,t){return e.length===t.length&&e.every((e,o)=>e===t[o])}function K(e,t,o){e.style[t]!==o&&(e.style[t]=o)}function F(e){for(let t of e.binding.controls)!function(e,t){if(e.states.get(t))return;let o={inert:t.inert,kind:"control",tabIndex:t.getAttribute("tabindex")};e.states.set(t,o)}(e,t),t.inert||(t.inert=!0),R(t,"tabindex","-1");for(let t of e.binding.contents)!function(e,t){if(e.states.get(t))return;let o={ariaHidden:t.getAttribute("aria-hidden"),concealed:t.classList.contains("loot-object-lock-concealed"),inert:t.inert,kind:"content"};e.states.set(t,o)}(e,t),t.inert||(t.inert=!0),R(t,"aria-hidden","true"),t.classList.add("loot-object-lock-concealed");!function(e){if("floating"!==e.binding.mode)return;let t=e.binding.anchor.getBoundingClientRect(),o=e.binding.anchor.isConnected&&t.width>0&&t.height>0&&t.right>0&&t.bottom>0&&t.left<window.innerWidth&&t.top<window.innerHeight;e.button.hidden===o&&(e.button.hidden=!o),o&&(K(e.button,"left",`${t.left}px`),K(e.button,"top",`${t.top}px`),K(e.button,"width",`${t.width}px`),K(e.button,"height",`${t.height}px`),e.button.classList.toggle("loot-object-lock-button--near-top",t.top<96))}(e)}function G(e,t,o){let n;null!==e.feedbackTimer&&(window.clearTimeout(e.feedbackTimer),e.feedbackTimer=null),e.button.classList.toggle("loot-object-lock-button--missing","missing"===o),e.button.classList.toggle("loot-object-lock-button--unlocking","unlocking"===o);let r=e.button.querySelector(".loot-object-lock-message");r&&(r.textContent=t),(n=z()).textContent="",window.setTimeout(()=>{n.textContent=t},0),"missing"===o&&(e.feedbackTimer=window.setTimeout(()=>{e.feedbackTimer=null,e.button.classList.remove("loot-object-lock-button--missing"),r&&(r.textContent="")},2200))}function H(){if(!x)return;let e=function(){let e=new Map;for(let t of function(){let e=[...y];document.querySelectorAll(a).forEach(t=>{let o=N(t);o&&e.push(o)});let t=[],o=new Set;for(let n of e){let e=M(n);o.has(e)||(o.add(e),t.push(n))}return t}()){let o="global"===t.scope?function(e){let t=d[e];if(t){let o=document.querySelector(t.rootSelector);if(!o)return null;let n=q(o,`button[data-group-id='${t.triggerGroup}'], i.hide-md-up`),r=q(o,`.lia-support-menu__submenu[data-group-id='${t.contentGroup}']`),l=t.focusSelector?o.querySelector(t.focusSelector):null;return{slotKey:`global:${e}`,root:o,anchor:o,controls:n,contents:r,mode:"fill",focusCandidates:[...n,...l?[l]:[],o]}}if("toc"===e){let e=document.querySelector("#lia-toc"),t=document.querySelector("#lia-btn-toc");return e&&t?{slotKey:"global:toc",root:e,anchor:t,controls:[t],contents:q(e,".lia-toc__content"),mode:"floating",focusCandidates:[t]}:null}if("seitenwechsel"===e){let e=document.querySelector(".lia-pagination"),t=e?.querySelector(":scope > .lia-pagination__content");if(!e||!t)return null;let o=document.querySelector("#lia-btn-prev"),n=document.querySelector("#lia-btn-next");return{slotKey:"global:seitenwechsel",root:e,anchor:t,controls:[o,n].filter(e=>null!==e),contents:[],mode:"floating",focusCandidates:[n,o].filter(e=>null!==e)}}return null}(t.target):function(e){if(!e.quiz||!e.quiz.isConnected||!(0,s.isLocalLockTarget)(e.target))return null;let t=e.quiz.querySelector(h[e.target]);return t&&function(e,t){let o=e.classList.contains("open")&&!t.hasAttribute("hidden")&&!(t instanceof HTMLButtonElement&&t.disabled)&&"true"!==t.getAttribute("aria-hidden")&&t.getClientRects().length>0;if(o){let e=w.get(t);e&&("-1"===t.getAttribute("tabindex")&&O(t,"tabindex",e.value),w.delete(t))}return o}(e.quiz,t)?{slotKey:`local:${function(e){let t=k.get(e);if(t)return t;_+=1;let o=`quiz-${_}`;return k.set(e,o),o}(e.quiz)}:${e.target}`,root:e.quiz,anchor:t,controls:[t],contents:[],mode:"floating",focusCandidates:[t]}:null}(t);if(!o)continue;let n=e.get(o.slotKey);n?n.requests.push(t):e.set(o.slotKey,{binding:o,requests:[t]})}let t=new Map;if(!x)return t;for(let[o,n]of e){let e=n.requests.find(e=>{let t=M(e);return!x?.unlocked(t)||v.has(t)});e&&t.set(o,{binding:n.binding,request:e})}return t}();for(let[n,r]of[...b]){let l=e.get(n);if(!l||M(l.request)!==r.lockId||(t=l.binding,o=r.binding,!(t.root===o.root&&t.anchor===o.anchor&&t.mode===o.mode&&D(t.controls,o.controls)&&D(t.contents,o.contents)))){var t,o;for(let[e,t]of(null!==r.feedbackTimer&&window.clearTimeout(r.feedbackTimer),r.states))!function(e,t){if(e.inert&&(e.inert=t.inert),"content"===t.kind){"true"===e.getAttribute("aria-hidden")&&O(e,"aria-hidden",t.ariaHidden??null),e.classList.contains("loot-object-lock-concealed")&&e.classList.toggle("loot-object-lock-concealed",t.concealed??!1);return}let o=e.hasAttribute("hidden")||"true"===e.getAttribute("aria-hidden")||e instanceof HTMLButtonElement&&e.disabled||0===e.getClientRects().length;"-1"===e.getAttribute("tabindex")&&(o?w.set(e,{value:t.tabIndex??null}):(O(e,"tabindex",t.tabIndex??null),w.delete(e)))}(e,t);r.states.clear(),L?.unobserve(r.binding.anchor),r.button.remove(),r.rootWasTarget||r.binding.root.classList.remove("loot-object-lock-target"),b.delete(n)}}for(let[t,o]of e){let e=b.get(t);e?F(e):b.set(t,function(e,t){var o;let n;for(let e of t.controls)"true"===e.getAttribute("aria-expanded")&&e.click();let r=M(e),l=(o=t.slotKey,(n=document.createElement("button")).type="button",n.className=`loot-object-lock-button loot-object-lock-button--${e.scope} loot-key-color--${e.color}`,n.dataset.lootLockButton=r,n.dataset.lootLockId=r,n.dataset.lootLockTarget=e.target,n.dataset.lootLockColor=e.color,n.dataset.lootLockScope=e.scope,n.setAttribute("aria-label",`${m[e.target]} gesperrt. Einen ${p[e.color]} verwenden.`),n.innerHTML=`
    <svg class="loot-object-lock-graphic" viewBox="0 0 36 40" shape-rendering="crispEdges" aria-hidden="true" focusable="false">
      <rect class="loot-object-lock-shadow" x="5" y="35" width="28" height="3"/>
      <path class="loot-object-lock-shackle-outline" d="M9 18V11C9 4 14 1 18 1s9 3 9 10v7h-6v-7c0-3-1-4-3-4s-3 1-3 4v7Z"/>
      <path class="loot-object-lock-shackle" d="M12 17v-6c0-5 3-7 6-7s6 2 6 7v6h-3v-6c0-3-1-4-3-4s-3 1-3 4v6Z"/>
      <rect class="loot-object-lock-outline" x="4" y="15" width="28" height="22"/>
      <rect class="loot-object-lock-body" x="7" y="18" width="22" height="16"/>
      <rect class="loot-object-lock-light" x="7" y="18" width="14" height="4"/>
      <rect class="loot-object-lock-keyhole" x="16" y="23" width="4" height="7"/>
      <rect class="loot-object-lock-keyhole" x="14" y="23" width="8" height="4"/>
    </svg>
    <span class="loot-object-lock-label" aria-hidden="true">${f[e.color]}</span>
    <span class="loot-object-lock-message" aria-hidden="true"></span>
  `,n.addEventListener("click",e=>{e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),function(e){let t=b.get(e);if(!x||!t||v.has(t.lockId))return;let o=x.unlock(t.lockId,t.request.color);if("missing-key"===o)return G(t,`${m[t.request.target]} ist gesperrt. Du brauchst einen ${p[t.request.color]}.`,"missing");if("invalid-lock-id"===o)return;v.add(t.lockId),G(t,"unlocked"===o?`${m[t.request.target]} entsperrt. Ein ${g[t.request.color]} wurde verwendet.`:`${m[t.request.target]} ist bereits entsperrt.`,"unlocking");let n=t.lockId,r=t.binding;window.setTimeout(()=>{v.delete(n),H();let t=b.get(e);t?t.button.focus({preventScroll:!0}):function(e){for(let t of e.focusCandidates)if(function(e){let t=e.getBoundingClientRect();return e.isConnected&&!e.hasAttribute("hidden")&&!e.inert&&!(e instanceof HTMLButtonElement&&e.disabled)&&t.width>0&&t.height>0&&"true"!==e.getAttribute("aria-hidden")&&e.tabIndex>=0}(t)&&(t.focus({preventScroll:!0}),document.activeElement===t))return;let t=e.root.getAttribute("tabindex"),o=()=>{e.root.removeEventListener("blur",o),O(e.root,"tabindex",t)};e.root.setAttribute("tabindex","-1"),e.root.addEventListener("blur",o,{once:!0}),e.root.focus({preventScroll:!0})}(r)},620)}(o)}),n);l.classList.add(`loot-object-lock-button--${t.mode}`);let i={binding:t,button:l,feedbackTimer:null,lockId:r,request:e,rootWasTarget:t.root.classList.contains("loot-object-lock-target"),states:new Map};return"fill"===t.mode?(t.root.classList.add("loot-object-lock-target"),t.root.appendChild(l)):document.body.appendChild(l),L?.observe(t.anchor),F(i),i}(o.request,o.binding))}}function P(){null===C&&(C=window.setTimeout(()=>{C=null,H()},0))}function B(e){var t;let o=(t=e.target)instanceof Element?t:t instanceof Node?t.parentElement:null;if(o){for(let t of b.values())if([...t.binding.controls,...t.binding.contents].some(e=>e===o||e.contains(o))){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation();return}}}class U extends HTMLElement{static get observedAttributes(){return["data-lock-id","data-target","data-color"]}connectedCallback(){N(this),P()}attributeChangedCallback(){this.isConnected&&(N(this),P())}}function Y(){H()}function V(e){if(x=e,"idle"===A&&(A="pending",(0,l.discoverCourseLockDeclarations)().then($).catch(()=>$([]))),z(),customElements.get(a)||customElements.define(a,U),j||(j=!0,document.addEventListener("click",B,!0)),S||(S=new MutationObserver(P)).observe(document.documentElement,{attributeFilter:["aria-hidden","class","disabled","hidden","style","tabindex"],attributes:!0,childList:!0,subtree:!0}),!I){if(I=!0,"ResizeObserver"in window)for(let e of(L=new ResizeObserver(P),b.values()))L.observe(e.binding.anchor);window.addEventListener("resize",P,{passive:!0}),window.addEventListener("scroll",P,{capture:!0,passive:!0}),window.visualViewport?.addEventListener("resize",P,{passive:!0}),window.visualViewport?.addEventListener("scroll",P,{passive:!0}),document.addEventListener("load",P,!0),document.fonts?.ready.then(P)}Y()}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./course-chests.ts":"blH4i","./key-colors.ts":"kuyjk","./lock-targets.ts":"2OCqm"}],"2OCqm":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"GLOBAL_LOCK_TARGETS",()=>l),r.export(o,"LOCAL_LOCK_TARGETS",()=>i),r.export(o,"resolveLockTarget",()=>u),r.export(o,"isGlobalLockTarget",()=>d),r.export(o,"isLocalLockTarget",()=>h);let l=["toc","mode","menu","translator","classroom","info","seitenwechsel"],i=["check","resolve","hint"],s={toc:"toc",inhaltsverzeichnis:"toc",mode:"mode",darstellung:"mode",ansicht:"mode",menu:"menu",menue:"menu",einstellungen:"menu",settings:"menu",translator:"translator",translate:"translator",ubersetzer:"translator",uebersetzer:"translator",sprache:"translator",classroom:"classroom",klasse:"classroom",teilen:"classroom",share:"classroom",info:"info",information:"info",informationen:"info",seitenwechsel:"seitenwechsel",seitennavigation:"seitenwechsel",navigation:"seitenwechsel",pages:"seitenwechsel",page:"seitenwechsel",check:"check",prufen:"check",pruefen:"check",resolve:"resolve",auflosen:"resolve",aufloesen:"resolve",losung:"resolve",loesung:"resolve",solution:"resolve",hint:"hint",hinweis:"hint"},a=new Set(l),c=new Set(i);function u(e){return e?s[e.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[\s_-]+/g,"")]??null:null}function d(e){return a.has(e)}function h(e){return c.has(e)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],jyW1v:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"normalizeSecretTitle",()=>A),r.export(o,"nextPublicSection",()=>j),r.export(o,"publicFallbackSection",()=>I),r.export(o,"installSecretSlides",()=>ei);var l=e("./course-chests.ts"),i=e("./slide-activity.ts");let s="lia-loot-secret-slide",a="lia-input-search",c="lia-loot-secret-slide-status",u="loot-secret-slide-link",d="lia-loot-secret-slide-permit:v1",h=new Set,m=new Map,f=null,p=null,g=null,b=null,y=!1,v="pending",k=!1,w=!1,x=null,S=null,L=null,C=null,E=null,_=null;function A(e){return e.normalize("NFKC").replace(/\s+/gu," ").trim().toLocaleLowerCase("de-DE")}function j(e,t,o,n){for(let r=o+n;r>=0&&r<t;r+=n)if(!e.has(r))return r;return null}function I(e,t,o,n){let r=null===n?-1:o>n?1:-1;return j(e,t,o,r)??j(e,t,o,1===r?-1:1)}function M(){try{let e=new URL(window.location.href);return e.hash="",e.href}catch{return`${window.location.pathname}${window.location.search}`}}function N(){try{window.sessionStorage.removeItem(d)}catch{}}function T(){let e=document.getElementById(c);if(e)return e;let t=document.createElement("div");return t.id=c,t.className="loot-secret-slide-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function $(e){let t=T();t.classList.remove("loot-secret-slide-status--visible"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.textContent="",window.setTimeout(()=>{t.textContent=e},0)}function z(e,t=!1){let o=T();o.classList.add("loot-secret-slide-status--visible"),o.setAttribute("role",t?"alert":"status"),o.setAttribute("aria-live",t?"assertive":"polite"),o.textContent=e}function q(){let e="complete"!==v||w?function(){let e=["main.lia-slide__content:not([hidden])",".lia-pagination",".loot-object-lock-button--local"];"complete"!==v&&e.push("#lia-toc .lia-toc__content");let t=new Set;for(let o of e)document.querySelectorAll(o).forEach(e=>{t.add(e)});return t}():new Set;for(let[o,n]of[...m])if(!e.has(o)){var t;o.inert=n.inert,"true"===o.getAttribute("aria-hidden")&&(null===(t=n.ariaHidden)?o.removeAttribute("aria-hidden"):o.setAttribute("aria-hidden",t)),"none"===o.style.pointerEvents&&(o.style.pointerEvents=n.pointerEvents),"hidden"===o.style.visibility&&(o.style.visibility=n.visibility),m.delete(o)}for(let t of e)m.has(t)||m.set(t,{ariaHidden:t.getAttribute("aria-hidden"),inert:t.inert,pointerEvents:t.style.pointerEvents,visibility:t.style.visibility}),t.inert=!0,t.setAttribute("aria-hidden","true"),t.style.pointerEvents="none",t.style.visibility="hidden";let o=document.activeElement;o instanceof HTMLElement&&[...e].some(e=>e===o||e.contains(o))&&o.blur()}function R(e){let t=e.getAttribute("href")??"",o=t;try{o=new URL(t,window.location.href).hash}catch{}let n=/^#(\d+)$/.exec(o);if(!n)return null;let r=Number(n[1])-1;return Number.isInteger(r)&&r>=0?r:null}function O(){return[...document.querySelectorAll("#lia-toc .lia-toc__content > a.lia-toc__link[href*='#']")]}function D(){return(0,i.activeLiaSection)()}function K(){let e=document.getElementById(a);return e instanceof HTMLInputElement?A(e.value):""}function F(e){return A(e.textContent??"")}function G(){let e=K();return e?O().filter(t=>{let o=R(t);return null!==o&&h.has(o)&&F(t)===e}):[]}function H(e,t=!0){let o=`#${e+1}`;if(!t){window.location.hash=o;return}try{window.location.replace(o)}catch{window.location.hash=o}}function P(){let e=document.documentElement;e.classList.toggle("loot-secret-slide-discovering","complete"!==v),e.classList.toggle("loot-secret-slide-discovery-failed","failed"===v),e.classList.toggle("loot-secret-slide-blocked",w)}function B(e){w=e,P(),q(),(0,i.refreshLiaSlideActivity)()}function U(e){return"complete"===v&&(null===e||!h.has(e)||S===e)}function Y(){g=null;let{totalSections:e}=function(){let e=O(),t=K(),o=-1;for(let n of e){let e=R(n);if(null===e)continue;o=Math.max(o,e);let r=h.has(e),l=r&&""!==t&&F(n)===t;n.classList.toggle(u,r),n.classList.toggle("loot-secret-slide-link--found",l),r?n.dataset.lootSecretSection=String(e):delete n.dataset.lootSecretSection}return{links:e,totalSections:o+1}}();if("pending"===v&&k&&e>0&&null!==D()&&(v="complete"),!function(e){if("complete"!==v)return q();let t=D();if(null===t||e<=0)return B(!1);if(!h.has(t)){L=t,S=null,C=null,B(!1);return}if(S===t)return B(!1);if(x===t){x=null,S=t,L=t,C=null,N(),B(!1),_?.found(t),$("Geheimfolie geöffnet.");return}let o=I(h,e,t,L);if(null===o){console.warn("Loot: Der Kurs enthält keine öffentliche Folie; die Geheimfolie bleibt erreichbar."),S=t,L=t,B(!1);return}B(!0),C!==t&&(C=t,H(o))}(e),"complete"===v){let e;P(),null!==b&&(window.clearTimeout(b),b=null),(e=T()).classList.remove("loot-secret-slide-status--visible"),e.textContent=""}q()}function V(){null===g&&(g=window.setTimeout(Y,0))}function W(e){let t=R(e);if(null===t||!h.has(t))return!1;let o=G();if(1!==o.length||o[0]!==e)return $(o.length>1?"Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien.":"Gib zuerst den vollständigen Namen der Geheimfolie in die Suche ein."),!1;if(D()===t&&S===t)return x=null,N(),!0;x=t;let n={course:M(),expiresAt:Date.now()+15e3,section:t};try{window.sessionStorage.setItem(d,JSON.stringify(n))}catch{}return!0}function X(e){var t;let o=(t=e.target)instanceof Element?t:t instanceof Node?t.parentElement:null,n=o?.closest(`a.${u}`);!n||W(n)||(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation())}function J(e){let t="ArrowLeft"===e.key||"ArrowRight"===e.key||e.altKey&&e.shiftKey&&["n","p"].includes(e.key.toLocaleLowerCase("en-US"));if("complete"!==v&&t){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation();return}if("Enter"!==e.key||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||!(e.target instanceof HTMLInputElement)||e.target.id!==a)return;let o=G();if(0===o.length)return;if(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),o.length>1)return void $("Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien.");let n=R(o[0]);null!==n&&W(o[0])&&H(n,!1)}function Q(e){if("complete"===v){E=null;return}if(e instanceof MouseEvent){E={kind:"mouse",startedAt:Date.now(),x:e.pageX,y:e.pageY};return}let t=e.changedTouches[0];t&&(E={kind:"touch",startedAt:Date.now(),x:t.pageX,y:t.pageY})}function Z(e){let t=E;if(E=null,!t||"complete"===v)return;if(e instanceof MouseEvent){if("mouse"!==t.kind)return}else if("touch"!==t.kind)return;let o=e instanceof MouseEvent?e:e.changedTouches[0];if(!o)return;let n=o.pageX-t.x,r=o.pageY-t.y;Date.now()-t.startedAt<=300&&Math.abs(n)>=150&&100>=Math.abs(r)&&(e.cancelable&&e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation())}function ee(){E=null}function et(e){for(let t of e)t.section>=0&&h.add(t.section);k=!0,Y()}function eo(e){v="failed",P(),z("Geheimfolien konnten nicht sicher geladen werden. Bitte prüfe die Kursquelle und lade den Kurs neu.",!0),q(),(0,i.refreshLiaSlideActivity)(),console.error("Loot: Geheimfolien-Initialisierung fehlgeschlagen.",e)}function en(){let e=document.getElementById("lia-toc");e===p||(f?.disconnect(),p=e,e&&((f=new MutationObserver(V)).observe(e,{attributeFilter:["class","href","id"],attributes:!0,childList:!0,subtree:!0}),V()))}function er(e){if(!(e instanceof Element))return!1;let t="main.lia-slide__content, .lia-pagination, .loot-object-lock-button--local, #lia-toc .lia-toc__content";return e.matches(t)||null!==e.querySelector(t)}function el(e){document.getElementById("lia-toc")!==p&&en(),("complete"!==v||w)&&e.some(e=>[...e.addedNodes].some(er))&&V()}function ei(e){if(e&&(_=e),!y){if(y=!0,(0,i.setLiaSlideAccessGuard)(U),new MutationObserver(P).observe(document.documentElement,{attributeFilter:["class"],attributes:!0}),P(),x=function(){try{let e=window.sessionStorage.getItem(d);if(!e)return null;let t=JSON.parse(e);if(t.course!==M()||!Number.isInteger(t.section)||t.section<0||"number"!=typeof t.expiresAt||t.expiresAt<Date.now())return N(),null;return t.section}catch{return N(),null}}(),T(),b=window.setTimeout(()=>{b=null,"pending"===v&&z("Kursnavigation wird vorbereitet …")},250),!customElements.get(s)){class e extends HTMLElement{connectedCallback(){let e;this.hidden=!0,this.setAttribute("aria-hidden","true"),null!==(e=function(e){let t=e.getAttribute("data-secret-id")??"",o=(0,i.sectionFromLootId)(t);if(null!==o)return o;let n=e.closest("main"),r=n?.parentElement;if(!n||!r)return null;let l=[...r.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(n);return l>=0?l:null}(this))&&h.add(e),V()}}customElements.define(s,e)}document.addEventListener("click",X,!0),document.addEventListener("keydown",J,!0),document.addEventListener("input",V),document.addEventListener("touchstart",Q,{capture:!0,passive:!0}),document.addEventListener("touchend",Z,{capture:!0,passive:!1}),document.addEventListener("touchcancel",ee,!0),document.addEventListener("mousedown",Q,!0),document.addEventListener("mouseup",Z,!0),window.addEventListener("blur",ee),window.addEventListener("hashchange",V),en(),new MutationObserver(el).observe(document.documentElement,{childList:!0,subtree:!0}),(0,l.requireCourseSecretSlideDeclarations)().then(et).catch(eo),V()}}},{"./course-chests.ts":"blH4i","@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./slide-activity.ts":"99v7X"}],h0spE:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"ACHIEVEMENTS",()=>l),r.export(o,"AchievementManager",()=>i);let l={"all-quizzes-solved":{id:"all-quizzes-solved",title:"Aufgaben-Meister",message:"Du hast alle Aufgaben geschafft."},"perfect-highscore":{id:"perfect-highscore",title:"Perfekter Highscore",message:"Du hast die maximale Punktzahl erreicht."},"all-chests-opened":{id:"all-chests-opened",title:"Schatzjäger",message:"Du hast alle Truhen geöffnet."},"all-locks-opened":{id:"all-locks-opened",title:"Schlossknacker",message:"Du hast alle Schlösser geöffnet."},"secret-slide-found":{id:"secret-slide-found",title:"Geheimnis entdeckt",message:"Du hast eine geheime Folie gefunden."}};class i{constructor(e,t){this.enabled=!1,this.allQuizzesCompleted=!1,this.perfectHighscore=!1,this.chestTotal=null,this.collectedChests=0,this.lockTotal=null,this.unlockedLocks=0,this.secretFound=!1,this.store=e,this.notify=t}enable(){this.enabled||(this.enabled=!0,this.evaluateAll())}isEnabled(){return this.enabled}quizzesCompleted(){this.allQuizzesCompleted=!0,this.evaluate("all-quizzes-solved",!0)}highscoreFinished(e,t){this.perfectHighscore=null!==e&&Number.isFinite(t)&&e===t,this.evaluate("perfect-highscore",this.perfectHighscore)}chestCatalogReady(e,t){this.chestTotal=s(e),this.collectedChests=s(t),this.evaluateChestProgress()}chestCollected(e){this.collectedChests=s(e),this.evaluateChestProgress()}lockCatalogReady(e,t){this.lockTotal=s(e),this.unlockedLocks=s(t),this.evaluateLockProgress()}lockUnlocked(e){this.unlockedLocks=s(e),this.evaluateLockProgress()}secretSlideFound(){this.secretFound=!0,this.evaluate("secret-slide-found",!0)}state(){return this.store.state()}evaluateAll(){this.evaluate("all-quizzes-solved",this.allQuizzesCompleted),this.evaluate("perfect-highscore",this.perfectHighscore),this.evaluateChestProgress(),this.evaluateLockProgress(),this.evaluate("secret-slide-found",this.secretFound)}evaluateChestProgress(){this.evaluate("all-chests-opened",null!==this.chestTotal&&this.chestTotal>0&&this.collectedChests>=this.chestTotal)}evaluateLockProgress(){this.evaluate("all-locks-opened",null!==this.lockTotal&&this.lockTotal>0&&this.unlockedLocks>=this.lockTotal)}evaluate(e,t){this.enabled&&t&&this.store.unlock(e)&&this.notify(l[e])}}function s(e){return Number.isFinite(e)?Math.max(0,Math.floor(e)):0}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],jGehO:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"showAchievement",()=>d);let l="lia-loot-achievement-overlay",i=[],s=null;function a(){let e,t=document.getElementById(l);if(t)return t;let o=document.createElement("aside");o.id=l,o.className="loot-achievement",o.hidden=!0,o.setAttribute("aria-label","Erfolgsmeldung");let n=document.createElement("div");n.className="loot-achievement__card";let r=document.createElement("div");r.className="loot-achievement__content",r.setAttribute("role","status"),r.setAttribute("aria-live","polite"),r.setAttribute("aria-atomic","true");let i=document.createElement("div");i.className="loot-achievement__text";let s=document.createElement("p");s.className="loot-achievement__eyebrow",s.textContent="Erfolg freigeschaltet";let a=document.createElement("p");a.className="loot-achievement__title";let c=document.createElement("p");c.className="loot-achievement__message",i.append(s,a,c),r.append(((e=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("viewBox","0 0 48 48"),e.setAttribute("shape-rendering","crispEdges"),e.setAttribute("aria-hidden","true"),e.classList.add("loot-achievement__graphic"),e.innerHTML=`
    <path class="loot-achievement__burst" d="M20 2h8v5h6v5h5v6h5v12h-5v6h-5v5h-6v5h-8v-5h-6v-5H9v-6H4V18h5v-6h5V7h6z"/>
    <path class="loot-achievement__burst-light" d="M20 7h8v4h6v5h5v16h-5v5h-6v4h-8v-4h-6v-5H9V16h5v-5h6z"/>
    <path class="loot-achievement__star" d="M22 12h4v7h7v4h-4v4h-3v8h-4v-8h-3v-4h-4v-4h7z"/>
  `,e),i);let d=document.createElement("button");return d.type="button",d.className="loot-achievement__close",d.setAttribute("aria-label","Erfolgsmeldung schließen"),d.textContent="×",d.addEventListener("click",u),n.addEventListener("keydown",e=>{"Escape"===e.key&&(e.preventDefault(),u())}),n.append(r,d),o.append(n),(document.body??document.documentElement).append(o),o}function c(){if(s||0===i.length)return;let e=a();if(!(s=i.shift()??null))return;let t=e.querySelector(".loot-achievement__title"),o=e.querySelector(".loot-achievement__message");t&&(t.textContent=s.title),o&&(o.textContent=s.message),e.dataset.achievementId=s.id,e.hidden=!1,e.classList.remove("loot-achievement--visible"),e.offsetWidth,e.classList.add("loot-achievement--visible")}function u(){if(!s)return;let e=a();e.classList.remove("loot-achievement--visible"),e.hidden=!0,delete e.dataset.achievementId,s=null,c()}function d(e){s?.id===e.id||i.some(t=>t.id===e.id)||(i.push(e),c())}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],hxMIe:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"AchievementStore",()=>i);var l=e("./storage.ts");class i{unlock(e){return!this.current.unlocked.includes(e)&&(this.current.unlocked.push(e),(0,l.saveAchievements)(this.current),!0)}state(){var e;return{...e=this.current,unlocked:[...e.unlocked]}}constructor(){this.current=(0,l.loadAchievements)()??{version:1,unlocked:[]}}}},{"./storage.ts":"6UGi5","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}]},["8RSWf"],"8RSWf","parcelRequire3c00",{});
//# sourceMappingURL=index.js.map
