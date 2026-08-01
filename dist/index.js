!function(e,t,o,r,n){var l="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},i="function"==typeof l[r]&&l[r],a=i.i||{},s=i.cache||{},c="u">typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(t,o){if(!s[t]){if(!e[t]){if(n[t])return n[t];var a="function"==typeof l[r]&&l[r];if(!o&&a)return a(t,!0);if(i)return i(t,!0);if(c&&"string"==typeof t)return c(t);var d=Error("Cannot find module '"+t+"'");throw d.code="MODULE_NOT_FOUND",d}p.resolve=function(o){var r=e[t][1][o];return null!=r?r:o},p.cache={};var m=s[t]=new u.Module(t);e[t][0].call(m.exports,p,m,m.exports,l)}return s[t].exports;function p(e){var t=p.resolve(e);if(!1===t)return{};if(Array.isArray(t)){var o={__esModule:!0};return t.forEach(function(e){var t=e[0],r=e[1],n=e[2]||e[0],l=u(r);"*"===t?Object.keys(l).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(o,e)||Object.defineProperty(o,e,{enumerable:!0,get:function(){return l[e]}})}):"*"===n?Object.defineProperty(o,t,{enumerable:!0,value:l}):Object.defineProperty(o,t,{enumerable:!0,get:function(){return"default"===n?l.__esModule?l.default:l:l[n]}})}),o}return u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.require=c,this.exports={}},u.modules=e,u.cache=s,u.parent=i,u.distDir=void 0,u.publicUrl=void 0,u.devServer=void 0,u.i=a,u.register=function(t,o){e[t]=[function(e,t){t.exports=o},{}]},Object.defineProperty(u,"root",{get:function(){return l[r]}}),l[r]=u;for(var d=0;d<t.length;d++)u(t[d]);if(o){var m=u(o);"object"==typeof exports&&"u">typeof module?module.exports=m:"function"==typeof define&&define.amd&&define(function(){return m})}}({k1TZk:[function(e,t,o,r){var n=e("./achievements"),l=e("./achievement-overlay"),i=e("./achievement-store"),a=e("./inventory-store"),s=e("./key-colors"),c=e("./key-inventory-bar"),u=e("./key-pickup"),d=e("./magnifier"),m=e("./magnifier-store"),p=e("./object-lock"),h=e("./course-chests"),f=e("./course-identity"),g=e("./popup"),b=e("./quiz-events"),y=e("./resource-bar"),v=e("./resource-store"),w=e("./score"),x=e("./secret-slides"),k=e("./slide-portal"),S=e("./style"),_=e("./store"),C=e("./timer-events"),L=e("./treasure-chest");let E="0.0.1";async function A(e){try{let t,o,r,A,I,T,j,M,N,R,q,$;await (0,f.prepareLiaCourseIdentity)(h.discoverCourseVersion),t=new(0,_.HighscoreStore),o=new(0,v.ResourceStore),r=new(0,a.KeyInventoryStore),A=new(0,m.MagnifierStore),I=new(0,i.AchievementStore),T=new(0,n.AchievementManager)(I,l.showAchievement),j=()=>{let e=t.state();T.highscoreFinished(e?.finalScore??null,e?.config.maxPoints??NaN),(0,b.allRenderedCourseQuizzesSolved)(document)&&T.quizzesCompleted(),T.enable()},M=e=>{let t=o.spend(e),r=o.state();return r&&(0,y.renderResources)(r.gold,r.diamonds,r.energy),t||(0,y.showInsufficientResource)("gold"===e?"coins":"diamonds"===e?"gems":"energy"),t},N=(e,t,r)=>{let n=o.configure(e,t,r);T.chestCollected(n.collectedChests.length),(0,y.renderResources)(n.gold,n.diamonds,n.energy),(0,L.refreshTreasureChests)()},R={version:E,configure(e,o,r,n,l){let i=(0,w.createConfig)(e,o,r,n,l);t.configure(i),T.highscoreFinished(null,i.maxPoints)},fail(e=1){t.fail(e)},hint(e=1){t.hint(e)},finish(){let e=t.finish(),o=t.state();return null!==e&&o&&(T.highscoreFinished(e,o.config.maxPoints),(0,g.showHighscore)(e,o.config.maxPoints)),e},reset(){(0,g.hideHighscore)(),t.reset();let e=t.state();T.highscoreFinished(null,e?.config.maxPoints??NaN)},score:e=>t.score(e),show(){let e=t.state();e?.finalScore!==null&&e?.finalScore!==void 0&&(0,g.showHighscore)(e.finalScore,e.config.maxPoints)},enableAchievements(){j()},state:()=>t.state(),resources(e,t,o){N(e,t,o)}},(0,S.injectStyles)(),(0,x.installSecretSlides)({found:()=>T.secretSlideFound()}),(0,k.installSlidePortals)(),(0,h.discoverCourseAchievementsDeclaration)().then(e=>{e&&j()}).catch(()=>{}),(0,h.discoverCourseResourceDeclaration)().then(e=>{e&&null===o.state()&&N(e.gold,e.diamonds,e.energy)}).catch(()=>{}),(q=o.state())&&(0,y.renderResources)(q.gold,q.diamonds,q.energy),(0,L.installTreasureChests)({active:e=>{let t=o.state();return null!==t&&("energy"!==e||null!==t.energy)},catalogReady:e=>{T.chestCatalogReady(e,o.state()?.collectedChests.length??0)},collected:e=>o.isChestCollected(e),collect:(e,t)=>{if(!o.collectChest(e,t))return!1;let r=o.state();return!!r&&(T.chestCollected(r.collectedChests.length),(0,y.renderResources)(r.gold,r.diamonds,r.energy),(0,y.announceResource)("diamonds"===t?"Diamanttruhe geöffnet: einen Diamanten erhalten.":"energy"===t?"Energiekiste geöffnet: einen Energiepunkt erhalten.":"Schatztruhe geöffnet: eine Goldmünze erhalten."),!0)}}),(0,d.installMagnifier)({collected:()=>A.isCollected(),collect:()=>A.collect()}),$=r.state(),Object.values($.keys).some(e=>e>0)&&(0,c.renderKeyInventory)($.keys),(0,u.installKeyPickups)({collected:e=>r.isKeyCollected(e),collect:(e,t)=>!!r.collectKey(e,t)&&((0,c.renderKeyInventory)(r.state().keys),(0,c.announceKeyFound)(s.KEY_COLOR_DETAILS[t].foundMessage),!0),focusInventory:c.focusKeyInventory}),(0,p.installObjectLocks)({catalogReady:e=>{T.lockCatalogReady(e,r.state().unlockedLocks.length)},unlocked:e=>r.isLockUnlocked(e),unlock:(e,t)=>{let o=r.useKeyForLock(e,t);if("unlocked"===o){let e=r.state();(0,c.renderKeyInventory)(e.keys),T.lockUnlocked(e.unlockedLocks.length)}return o}}),(0,C.installTimerEventTracking)({useStart:()=>M("energy")}),(0,b.installQuizEventTracking)({active:()=>t.isRunning()||T.isEnabled(),failed:()=>t.fail(),hint:e=>t.hint(e),solved:()=>{(0,b.allRenderedCourseQuizzesSolved)(document)&&T.quizzesCompleted()},courseCompleted:()=>R.finish(),useCheck:()=>M("energy"),useHint:()=>M("gold"),useResolve:()=>M("diamonds")}),window.__LIA_LOOT_HIGHSCORE__=R,window.__LIA_LOOT_RUNTIME__===e&&(e.status="ready")}catch(t){window.__LIA_LOOT_RUNTIME__===e&&(e.status="failed"),console.error("[lia-loot] Initialisierung fehlgeschlagen.",t)}}let I=function(){let e=window.__LIA_LOOT_RUNTIME__;if(e?.status==="booting"||e?.status==="ready")return null;if(window.__LIA_LOOT_HIGHSCORE__)return window.__LIA_LOOT_RUNTIME__={version:E,status:"ready"},null;let t={version:E,status:"booting"};return window.__LIA_LOOT_RUNTIME__=t,t}();I&&A(I)},{"./achievements":"c7Uyw","./achievement-overlay":"aBJTX","./achievement-store":"40Y3c","./inventory-store":"bTrLW","./key-colors":"7rSfY","./key-inventory-bar":"kd9xY","./key-pickup":"aEHXm","./magnifier":"grhSe","./magnifier-store":"4rVr5","./object-lock":"bLBcI","./course-chests":"2ceW6","./course-identity":"g3iqo","./popup":"cCRZG","./quiz-events":"1ZNl4","./resource-bar":"1KrGH","./resource-store":"1O7ju","./score":"abltm","./secret-slides":"7fPSc","./slide-portal":"8aUxA","./style":"3Vffy","./store":"5gsVV","./timer-events":"7riKx","./treasure-chest":"4oJ1H"}],c7Uyw:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"ACHIEVEMENTS",()=>l),n.export(o,"AchievementManager",()=>i);let l={"all-quizzes-solved":{id:"all-quizzes-solved",title:"Aufgaben-Meister",message:"Du hast alle Aufgaben geschafft."},"perfect-highscore":{id:"perfect-highscore",title:"Perfekter Highscore",message:"Du hast die maximale Punktzahl erreicht."},"all-chests-opened":{id:"all-chests-opened",title:"Schatzjäger",message:"Du hast alle Truhen geöffnet."},"all-locks-opened":{id:"all-locks-opened",title:"Schlossknacker",message:"Du hast alle Schlösser geöffnet."},"secret-slide-found":{id:"secret-slide-found",title:"Geheimnis entdeckt",message:"Du hast eine geheime Folie gefunden."}};class i{constructor(e,t){this.enabled=!1,this.allQuizzesCompleted=!1,this.perfectHighscore=!1,this.chestTotal=null,this.collectedChests=0,this.lockTotal=null,this.unlockedLocks=0,this.secretFound=!1,this.store=e,this.notify=t}enable(){this.enabled||(this.enabled=!0,this.evaluateAll())}isEnabled(){return this.enabled}quizzesCompleted(){this.allQuizzesCompleted=!0,this.evaluate("all-quizzes-solved",!0)}highscoreFinished(e,t){this.perfectHighscore=null!==e&&Number.isFinite(t)&&e===t,this.evaluate("perfect-highscore",this.perfectHighscore)}chestCatalogReady(e,t){this.chestTotal=a(e),this.collectedChests=a(t),this.evaluateChestProgress()}chestCollected(e){this.collectedChests=a(e),this.evaluateChestProgress()}lockCatalogReady(e,t){this.lockTotal=a(e),this.unlockedLocks=a(t),this.evaluateLockProgress()}lockUnlocked(e){this.unlockedLocks=a(e),this.evaluateLockProgress()}secretSlideFound(){this.secretFound=!0,this.evaluate("secret-slide-found",!0)}state(){return this.store.state()}evaluateAll(){this.evaluate("all-quizzes-solved",this.allQuizzesCompleted),this.evaluate("perfect-highscore",this.perfectHighscore),this.evaluateChestProgress(),this.evaluateLockProgress(),this.evaluate("secret-slide-found",this.secretFound)}evaluateChestProgress(){this.evaluate("all-chests-opened",null!==this.chestTotal&&this.chestTotal>0&&this.collectedChests>=this.chestTotal)}evaluateLockProgress(){this.evaluate("all-locks-opened",null!==this.lockTotal&&this.lockTotal>0&&this.unlockedLocks>=this.lockTotal)}evaluate(e,t){this.enabled&&t&&this.store.unlock(e)&&this.notify(l[e])}}function a(e){return Number.isFinite(e)?Math.max(0,Math.floor(e)):0}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],aqhRK:[function(e,t,o,r){o.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},o.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},o.exportAll=function(e,t){return Object.keys(e).forEach(function(o){"default"===o||"__esModule"===o||Object.prototype.hasOwnProperty.call(t,o)||Object.defineProperty(t,o,{enumerable:!0,get:function(){return e[o]}})}),t},o.export=function(e,t,o){Object.defineProperty(e,t,{enumerable:!0,get:o})}},{}],aBJTX:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"ACHIEVEMENT_AUTO_HIDE_MS",()=>i),n.export(o,"showAchievement",()=>d);let l="lia-loot-achievement-overlay",i=12e3,a=new Set,s=new WeakMap;function c(){let e=document.getElementById(l);if(e)return e;let t=document.createElement("aside");return t.id=l,t.className="loot-achievement",t.hidden=!0,t.setAttribute("aria-label","Erfolgsmeldungen"),(document.body??document.documentElement).append(t),t}function u(e,t){let o=s.get(e);void 0!==o&&(globalThis.clearTimeout(o),s.delete(e));let r=c();e.remove(),a.delete(t),r.hidden=0===r.childElementCount,r.hidden||(r.scrollTop=r.scrollHeight)}function d(e){var t;let o,r,n,l,d,m,p,h,f;if(a.has(e.id))return;let g=c(),b=((o=document.createElement("div")).className="loot-achievement__card",o.dataset.achievementId=e.id,(r=document.createElement("div")).className="loot-achievement__content",r.setAttribute("role","status"),r.setAttribute("aria-live","polite"),r.setAttribute("aria-atomic","true"),(n=document.createElement("div")).className="loot-achievement__text",(l=document.createElement("p")).className="loot-achievement__eyebrow",l.textContent="Erfolg freigeschaltet",(d=document.createElement("p")).className="loot-achievement__title",d.textContent=e.title,(m=document.createElement("p")).className="loot-achievement__message",m.textContent=e.message,n.append(l,d,m),r.append(((p=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("viewBox","0 0 48 48"),p.setAttribute("shape-rendering","crispEdges"),p.setAttribute("aria-hidden","true"),p.classList.add("loot-achievement__graphic"),p.innerHTML=`
    <path class="loot-achievement__burst" d="M20 2h8v5h6v5h5v6h5v12h-5v6h-5v5h-6v5h-8v-5h-6v-5H9v-6H4V18h5v-6h5V7h6z"/>
    <path class="loot-achievement__burst-light" d="M20 7h8v4h6v5h5v16h-5v5h-6v4h-8v-4h-6v-5H9V16h5v-5h6z"/>
    <path class="loot-achievement__star" d="M22 12h4v7h7v4h-4v4h-3v8h-4v-8h-3v-4h-4v-4h7z"/>
  `,p),n),(h=document.createElement("button")).type="button",h.className="loot-achievement__close",h.setAttribute("aria-label","Erfolgsmeldung schließen"),h.textContent="×",h.addEventListener("click",()=>u(o,e.id)),o.addEventListener("keydown",t=>{"Escape"===t.key&&(t.preventDefault(),u(o,e.id))}),o.append(r,h),o);g.append(b),a.add(e.id),g.hidden=!1,b.offsetWidth,b.classList.add("loot-achievement__card--visible"),g.scrollTop=g.scrollHeight,t=e.id,f=globalThis.setTimeout(()=>{s.delete(b),u(b,t)},i),s.set(b,f)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"40Y3c":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"AchievementStore",()=>i);var l=e("./storage.ts");class i{unlock(e){return!this.current.unlocked.includes(e)&&(this.current.unlocked.push(e),(0,l.saveAchievements)(this.current),!0)}state(){var e;return{...e=this.current,unlocked:[...e.unlocked]}}constructor(){this.current=(0,l.loadAchievements)()??{version:1,unlocked:[]}}}},{"./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8s1BG":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"loadState",()=>f),n.export(o,"saveState",()=>g),n.export(o,"clearState",()=>b),n.export(o,"loadResources",()=>y),n.export(o,"saveResources",()=>v),n.export(o,"loadKeyInventory",()=>w),n.export(o,"saveKeyInventory",()=>x),n.export(o,"loadMagnifier",()=>k),n.export(o,"saveMagnifier",()=>S),n.export(o,"loadAchievements",()=>_),n.export(o,"saveAchievements",()=>C);var l=e("./score.ts"),i=e("./key-colors.ts"),a=e("./course-identity.ts"),s=e("./types.ts");function c(e){let t=`${e}${encodeURIComponent((0,a.liaCourseIdentity)())}`;return!function(e,t){let o,r=(o=`${window.location.origin}${window.location.pathname}${window.location.search}`,`${e}${encodeURIComponent(o)}`);if(r===t)return;let n=window.sessionStorage.getItem(r);null!==n&&(null===window.sessionStorage.getItem(t)&&window.sessionStorage.setItem(t,n),window.sessionStorage.removeItem(r))}(e,t),t}function u(){return c("lia-loot:highscore:v1:")}function d(){return c("lia-loot:resources:v1:")}function m(){return c("lia-loot:key-inventory:v1:")}function p(){return c("lia-loot:magnifier:v1:")}function h(){return c("lia-loot:achievements:v1:")}function f(){try{let e=window.sessionStorage.getItem(u());if(!e)return null;let t=JSON.parse(e);return!function(e){if(!e||"object"!=typeof e||1!==e.version||!e.config)return!1;try{(0,l.createConfig)(e.config.maxPoints,e.config.failedCheckPenalty,e.config.hintPenalty,e.config.graceMinutes,e.config.perMinutePenalty)}catch{return!1}return Number.isFinite(e.startedAt)&&Number.isInteger(e.failedChecks)&&Number(e.failedChecks)>=0&&Number.isInteger(e.hintsUsed)&&Number(e.hintsUsed)>=0&&(null===e.finishedAt||Number.isFinite(e.finishedAt))&&(null===e.finalScore||Number.isFinite(e.finalScore))}(t)?null:t}catch{return null}}function g(e){try{window.sessionStorage.setItem(u(),JSON.stringify(e))}catch{}}function b(){try{window.sessionStorage.removeItem(u())}catch{}}function y(){try{let t=window.sessionStorage.getItem(d());if(!t)return null;var e=JSON.parse(t);if(!e||"object"!=typeof e||1!==e.version||!Number.isInteger(e.initialGold)||0>Number(e.initialGold)||!Number.isInteger(e.initialDiamonds)||0>Number(e.initialDiamonds)||!Number.isInteger(e.gold)||0>Number(e.gold)||!Number.isInteger(e.diamonds)||0>Number(e.diamonds))return null;let o=void 0!==e.initialEnergy&&null!==e.initialEnergy,r=void 0!==e.energy&&null!==e.energy;if(o!==r||o&&(!Number.isInteger(e.initialEnergy)||0>Number(e.initialEnergy)||!Number.isInteger(e.energy)||0>Number(e.energy))||void 0!==e.collectedChests&&(!Array.isArray(e.collectedChests)||!e.collectedChests.every(e=>"string"==typeof e&&e.trim().length>0))||void 0!==e.chestCollected&&"boolean"!=typeof e.chestCollected)return null;let n=Array.isArray(e.collectedChests)?[...new Set(e.collectedChests.map(e=>e.trim()))]:!0===e.chestCollected?["legacy:auto"]:[];return{version:1,initialGold:Number(e.initialGold),initialDiamonds:Number(e.initialDiamonds),initialEnergy:o?Number(e.initialEnergy):null,gold:Number(e.gold),diamonds:Number(e.diamonds),energy:r?Number(e.energy):null,collectedChests:n}}catch{return null}}function v(e){try{window.sessionStorage.setItem(d(),JSON.stringify(e))}catch{}}function w(){try{let e=window.sessionStorage.getItem(m());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!e.keys||"object"!=typeof e.keys)return null;let t=e.keys,o=(0,i.createEmptyKeyCounts)();for(let e of i.KEY_COLORS){let r=t[e]??0;if(!Number.isInteger(r)||0>Number(r))return null;o[e]=Number(r)}if(!Array.isArray(e.collectedKeys)||!e.collectedKeys.every(e=>"string"==typeof e&&e.trim().length>0))return null;let r=[...new Set(e.collectedKeys.map(e=>e.trim()))];if(void 0!==e.unlockedLocks&&(!Array.isArray(e.unlockedLocks)||!e.unlockedLocks.every(e=>"string"==typeof e&&e.trim().length>0)))return null;let n=Array.isArray(e.unlockedLocks)?e.unlockedLocks.map(e=>e.trim()):[],l=[...new Set(n)];return l.length!==n.length||i.KEY_COLORS.reduce((e,t)=>e+o[t],0)+l.length!==r.length?null:{version:1,keys:o,collectedKeys:r,unlockedLocks:l}}(t)}catch{return null}}function x(e){try{window.sessionStorage.setItem(m(),JSON.stringify(e))}catch{}}function k(){try{var e;let t=window.sessionStorage.getItem(p());if(!t)return null;return(e=JSON.parse(t))&&"object"==typeof e?1!==e.version||"boolean"!=typeof e.collected?null:{version:1,collected:e.collected}:null}catch{return null}}function S(e){try{window.sessionStorage.setItem(p(),JSON.stringify(e))}catch{}}function _(){try{let t=window.sessionStorage.getItem(h());if(!t)return null;var e=JSON.parse(t);if(!e||"object"!=typeof e||1!==e.version||!Array.isArray(e.unlocked))return null;let o=new Set(s.ACHIEVEMENT_IDS);if(!e.unlocked.every(e=>"string"==typeof e&&o.has(e)))return null;let r=[...e.unlocked];return new Set(r).size!==r.length?null:{version:1,unlocked:r}}catch{return null}}function C(e){try{window.sessionStorage.setItem(h(),JSON.stringify(e))}catch{}}},{"./score.ts":"abltm","./key-colors.ts":"7rSfY","./course-identity.ts":"g3iqo","./types.ts":"ijQUu","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],abltm:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"createConfig",()=>i),n.export(o,"sameConfig",()=>a),n.export(o,"elapsedSeconds",()=>s),n.export(o,"calculateScore",()=>c),n.export(o,"trophyTier",()=>u),n.export(o,"formatScore",()=>d);let l=["maxPoints","failedCheckPenalty","hintPenalty","graceMinutes","perMinutePenalty"];function i(e,t,o,r,n){let i={maxPoints:Number(e),failedCheckPenalty:Number(t),hintPenalty:Number(o),graceMinutes:Number(r),perMinutePenalty:Number(n)};if(!Number.isFinite(i.maxPoints)||i.maxPoints<=0)throw TypeError("@Highscore: Die maximale Punktzahl muss größer als 0 sein.");for(let e of l.slice(1))if(!Number.isFinite(i[e])||i[e]<0)throw TypeError(`@Highscore: ${e} muss eine nichtnegative Zahl sein.`);return i}function a(e,t){return l.every(o=>e[o]===t[o])}function s(e,t){return Math.max(0,Math.floor((t-e)/1e3))}function c(e,t,o){let r=Math.max(0,Math.floor((o-t.startedAt-6e4*e.graceMinutes)/1e3))*e.perMinutePenalty/60;return Math.max(0,e.maxPoints-t.failedChecks*e.failedCheckPenalty-t.hintsUsed*e.hintPenalty-r)}function u(e,t){let o=t>0?e/t:0;return o>=.9?"gold":o>=.75?"silver":o>=.5?"copper":null}function d(e,t="de-DE"){return new Intl.NumberFormat(t,{minimumFractionDigits:0,maximumFractionDigits:1}).format(e)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"7rSfY":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"KEY_COLORS",()=>l),n.export(o,"KEY_COLOR_DETAILS",()=>i),n.export(o,"isKeyColorRequest",()=>u),n.export(o,"createEmptyKeyCounts",()=>d),n.export(o,"requestedKeyColor",()=>m),n.export(o,"deterministicKeyColor",()=>p),n.export(o,"resolveKeyAppearance",()=>h);let l=["red","blue","green","yellow","purple","orange"],i={red:{label:"Rot",inventoryLabel:"Rote Schlüssel",pickupLabel:"Roten Schlüssel",foundMessage:"Roter Schlüssel gefunden."},blue:{label:"Blau",inventoryLabel:"Blaue Schlüssel",pickupLabel:"Blauen Schlüssel",foundMessage:"Blauer Schlüssel gefunden."},green:{label:"Grün",inventoryLabel:"Grüne Schlüssel",pickupLabel:"Grünen Schlüssel",foundMessage:"Grüner Schlüssel gefunden."},yellow:{label:"Gelb",inventoryLabel:"Gelbe Schlüssel",pickupLabel:"Gelben Schlüssel",foundMessage:"Gelber Schlüssel gefunden."},purple:{label:"Lila",inventoryLabel:"Lilafarbene Schlüssel",pickupLabel:"Lilafarbenen Schlüssel",foundMessage:"Lilafarbener Schlüssel gefunden."},orange:{label:"Orange",inventoryLabel:"Orangefarbene Schlüssel",pickupLabel:"Orangefarbenen Schlüssel",foundMessage:"Orangefarbener Schlüssel gefunden."}},a={red:"red",rot:"red",blue:"blue",blau:"blue",green:"green",grün:"green",gruen:"green",yellow:"yellow",gelb:"yellow",purple:"purple",violet:"purple",violett:"purple",lila:"purple",orange:"orange"},s=new Set(["","?","auto","random","zufall","mystery","unbekannt"]);function c(e){return e?.trim().toLowerCase()??""}function u(e){let t=c(e);return s.has(t)||/^@\d+$/.test(t)||void 0!==a[t]}function d(){return{red:0,blue:0,green:0,yellow:0,purple:0,orange:0}}function m(e){let t=c(e);return s.has(t)||/^@\d+$/.test(t)?null:a[t]??null}function p(e){let t=e.trim()||"loot-key",o=0x811c9dc5;for(let e=0;e<t.length;e+=1)o^=t.charCodeAt(e),o=Math.imul(o,0x1000193);return l[(o>>>0)%l.length]}function h(e,t){let o=m(t);return{color:o??p(e),mystery:null===o}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],g3iqo:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"DEFAULT_LIA_COURSE_VERSION",()=>l),n.export(o,"courseVersionFromMetadata",()=>s),n.export(o,"setLiaCourseVersion",()=>c),n.export(o,"liaCourseVersion",()=>u),n.export(o,"liaCourseIdentity",()=>d),n.export(o,"prepareLiaCourseIdentity",()=>m);let l="0.0.1",i=null;function a(e){if("string"!=typeof e)return null;let t=e.trim();return 0===t.length||t.length>128||/[\u0000-\u001f\u007f]/u.test(t)?null:t}function s(e){if(!e||"object"!=typeof e)return null;let t=a(e.version);if(t)return t;for(let t of["course","definition","meta","metadata"]){let o=e[t];if(!o||"object"!=typeof o)continue;let r=a(o.version);if(r)return r}return null}function c(e){i=a(e)??l}function u(){return i??l}function d(){return`${function(){let e=window.LIA,t=e?.defaultCourseURL?.trim();try{let e=new URL(t||window.location.href,window.location.href);return e.hash="",e.href}catch{return t||`${window.location.pathname}${window.location.search}`}}()}::version=${encodeURIComponent(u())}`}async function m(e,t=15e3){if(i)return i;let o=window.LIA,r=o?.onReady,n=null,d=null,p=new Promise(e=>{o&&(n=t=>{let n=s(t);return n&&e(n),r?.call(o,t)},o.onReady=n)}),h=new Promise(t=>{Promise.resolve().then(e).then(e=>{let o=a(e);o&&t(o)}).catch(()=>{})}),f=new Promise(e=>{d=globalThis.setTimeout(()=>e(l),Math.max(0,t))});return c(await Promise.race([p,h,f])),null!==d&&globalThis.clearTimeout(d),o&&n&&o.onReady===n&&(o.onReady=r),u()}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],ijQUu:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"ACHIEVEMENT_IDS",()=>l);let l=["all-quizzes-solved","perfect-highscore","all-chests-opened","all-locks-opened","secret-slide-found"]},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],bTrLW:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"KeyInventoryStore",()=>a);var l=e("./key-colors.ts"),i=e("./storage.ts");class a{collectKey(e,t){let o=e.trim();return!(!o||this.current.collectedKeys.includes(o))&&(this.current.keys[t]+=1,this.current.collectedKeys.push(o),(0,i.saveKeyInventory)(this.current),!0)}isKeyCollected(e){return this.current.collectedKeys.includes(e.trim())}useKeyForLock(e,t){let o=e.trim();return o?this.current.unlockedLocks.includes(o)?"already-unlocked":this.current.keys[t]<=0?"missing-key":(this.current.keys[t]-=1,this.current.unlockedLocks.push(o),(0,i.saveKeyInventory)(this.current),"unlocked"):"invalid-lock-id"}isLockUnlocked(e){return this.current.unlockedLocks.includes(e.trim())}state(){var e;return{...e=this.current,keys:{...e.keys},collectedKeys:[...e.collectedKeys],unlockedLocks:[...e.unlockedLocks]}}constructor(){this.current=(0,i.loadKeyInventory)()??{version:1,keys:(0,l.createEmptyKeyCounts)(),collectedKeys:[],unlockedLocks:[]}}}},{"./key-colors.ts":"7rSfY","./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],kd9xY:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"renderKeyInventory",()=>c),n.export(o,"announceKeyFound",()=>u),n.export(o,"focusKeyInventory",()=>d);var l=e("./key-colors"),i=e("./key-visual"),a=e("./resource-bar");let s="lia-loot-key-inventory";function c(e){let t=l.KEY_COLORS.filter(t=>e[t]>0);if(0===t.length){document.getElementById(s)?.remove(),(0,a.refreshResourceBarVisibility)();return}let o=(function(){let e,t=document.getElementById(s);if(t)return t;let o=document.createElement("div");o.id=s,o.className="loot-key-inventory",o.setAttribute("role","group"),o.setAttribute("aria-label","Schlüsselinventar"),o.tabIndex=-1;let r=document.createElement("ul");return r.className="loot-key-inventory__list",r.setAttribute("role","list"),o.append(r,((e=document.createElement("span")).className="loot-key-inventory__status",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e)),(0,a.installResourceBar)().appendChild(o),o})().querySelector(".loot-key-inventory__list");if(o){for(let r of(o.replaceChildren(),t)){let t=l.KEY_COLOR_DETAILS[r].foundMessage.replace(/\s+gefunden\.$/,"");for(let n=0;n<e[r];n+=1){let l=document.createElement("li");l.className=`loot-key-inventory__item loot-key-color--${r}`,l.dataset.lootKeyColor=r,l.dataset.lootKeyInstance=`${r}-${n+1}`,l.setAttribute("aria-label",1===e[r]?t:`${t}, Exemplar ${n+1} von ${e[r]}`);let a=(0,i.createKeyGraphic)(r);a.classList.add("loot-key-inventory__icon"),l.append(a),o.appendChild(l)}}(0,a.refreshResourceBarVisibility)()}}function u(e){let t=document.querySelector(".loot-key-inventory__status");t&&(t.textContent="",window.setTimeout(()=>{t.textContent=e},0))}function d(){document.getElementById(s)?.focus({preventScroll:!0})}},{"./key-colors":"7rSfY","./key-visual":"iQm7z","./resource-bar":"1KrGH","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],iQm7z:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(e){let t=document.createElementNS("http://www.w3.org/2000/svg","svg");return t.setAttribute("viewBox","0 0 48 32"),t.setAttribute("shape-rendering","crispEdges"),t.setAttribute("aria-hidden","true"),t.classList.add("loot-key-graphic",`loot-key-color--${e}`),t.innerHTML=`
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
  `,t}n.defineInteropFlag(o),n.export(o,"createKeyGraphic",()=>l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1KrGH":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"installResourceBar",()=>c),n.export(o,"refreshResourceBarVisibility",()=>u),n.export(o,"renderResources",()=>d),n.export(o,"showInsufficientResource",()=>m),n.export(o,"announceResource",()=>p);let l="lia-loot-resource-bar",i=["header",".lia-header","[role='banner']"];function a(e,t){let o,r=document.createElement("div");r.className="loot-resource loot-resource--hidden",r.setAttribute("aria-label",`${t}: 0`);let n=document.createElement("span");return n.className="loot-resource-value",n.dataset.lootResource=e,n.textContent="0",r.append(((o=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("viewBox","0 0 32 32"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-resource-icon",`loot-resource-icon--${e}`),o.innerHTML="coins"===e?'<ellipse cx="16" cy="8" rx="10" ry="5"/><path d="M6 8v6c0 2.8 4.5 5 10 5s10-2.2 10-5V8"/><path d="M6 14v6c0 2.8 4.5 5 10 5s10-2.2 10-5v-6"/>':"gems"===e?'<path d="M8 5h16l5 7-13 15L3 12l5-7Z"/><path d="m3 12 8-2 5 17 5-17 8 2M8 5l3 5 5-5 5 5 3-5"/>':'<path d="M19 2 7 18h8l-2 12 12-18h-8l2-10Z"/>',o),n),r}function s(){for(let e of i){let t=document.querySelector(e);if(t&&t.id!==l&&!t.closest(`#${l}`))return t}return null}function c(){let e,t=document.getElementById(l);if(t)return t;let o=document.createElement("aside");o.id=l,o.className="loot-resource-bar loot-resource-bar--empty",o.setAttribute("aria-label","Ressourcen und Inventar"),o.append(a("coins","Goldmünzen"),a("gems","Diamanten"),a("energy","Energie"),((e=document.createElement("span")).className="loot-resource-status",e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e)),document.body.appendChild(o);let r=()=>{let e,t;return t=(e=s())?Math.max(0,e.getBoundingClientRect().bottom):0,void o.style.setProperty("--loot-resource-top",`${Math.round(t)}px`)};r(),window.addEventListener("resize",r,{passive:!0}),window.addEventListener("scroll",r,{passive:!0});let n=s();return n&&"ResizeObserver"in window&&new ResizeObserver(r).observe(n),o}function u(){let e=document.getElementById(l);if(!e)return;let t=[...e.querySelectorAll(".loot-resource")].some(e=>!e.classList.contains("loot-resource--hidden")),o=null!==e.querySelector("[data-loot-key-color]"),r=null!==e.querySelector("[data-loot-magnifier-tool]");e.classList.toggle("loot-resource-bar--empty",!t&&!o&&!r)}function d(e,t,o=null){c();let r={coins:e,gems:t,energy:o},n={coins:"Goldmünzen",gems:"Diamanten",energy:"Energie"};for(let e of["coins","gems","energy"]){let t=document.querySelector(`[data-loot-resource="${e}"]`),l=t?.parentElement,i="energy"===e&&null===o;if(l?.classList.toggle("loot-resource--hidden",i),!t||i)continue;let a=r[e],s=Math.max(0,Math.floor("number"==typeof a&&Number.isFinite(a)?a:0));t.textContent=s.toLocaleString("de-DE"),l?.setAttribute("aria-label",`${n[e]}: ${s}`)}u()}function m(e){let t=document.querySelector(`[data-loot-resource="${e}"]`),o=t?.parentElement,r=document.querySelector(".loot-resource-status");o&&r&&(o.classList.remove("loot-resource--insufficient"),o.offsetWidth,o.classList.add("loot-resource--insufficient"),o.addEventListener("animationend",()=>o.classList.remove("loot-resource--insufficient"),{once:!0}),r.textContent="coins"===e?"Nicht genug Gold für einen Hinweis.":"gems"===e?"Nicht genug Diamanten zum Auflösen.":"Keine Energie mehr zum Prüfen oder Starten.")}function p(e){let t=document.querySelector(".loot-resource-status");t&&(t.textContent="",window.setTimeout(()=>{t.textContent=e},0))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],aEHXm:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"surfaceKeyInstanceId",()=>j),n.export(o,"parseKeyPickupOptions",()=>N),n.export(o,"pruneStaleKeySourceMatches",()=>z),n.export(o,"sourceCatalogCoversKeyHost",()=>O),n.export(o,"splitSurfaceKeyPlacements",()=>G),n.export(o,"discardObservedKeyWrites",()=>X),n.export(o,"keyMutationBatchNeedsSync",()=>Q),n.export(o,"installKeyPickups",()=>et);var l=e("./key-colors.ts"),i=e("./course-chests.ts"),a=e("./key-visual.ts"),s=e("./collectible-visibility.ts"),c=e("./concealment.ts"),u=e("./slide-activity.ts"),d=e("./surface-targets.ts");let m="lia-loot-key",p="data-loot-key-placement",h="data-loot-key-tray",f=null,g=0,b=new Set,y=new Set,v=new Set,w=new(0,s.CollectibleVisibilityGate),x=new Map,k=new Map,S=new Set,_=new Map,C=new Map,L="idle",E=null,A=null,I=!1;function T(e){let t=e.getAttribute("data-key-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootKeyRuntimeId;if(o)return o;g+=1;let r=`runtime-${g}`;return e.dataset.lootKeyRuntimeId=r,r}function j(e,t){return`key:${e}:${t}`}function M(e,t){let o,r=document.createElement("button");return r.type="button",r.className=`loot-key-pickup loot-key-color--${t}`,r.dataset.lootKeyButton=e,r.dataset.lootKeyColor=t,r.setAttribute("aria-label",`${l.KEY_COLOR_DETAILS[t].pickupLabel} einsammeln`),r.append((0,a.createKeyGraphic)(t),((o=document.createElement("span")).className="loot-key-pickup__reward",o.setAttribute("aria-hidden","true"),o.textContent="+1",o)),r.addEventListener("click",o=>{if(!f||b.has(e)||!y.has(e))return;if(b.add(e),!f.collect(e,t)){b.delete(e),W();return}let n=0===o.detail;r.disabled=!0,r.classList.add("loot-key-pickup--collected"),r.setAttribute("aria-label",l.KEY_COLOR_DETAILS[t].foundMessage),window.setTimeout(()=>{b.delete(e),r.remove(),W(),n&&f?.focusInventory()},650)}),r}function N(e){let t=(0,s.parseCollectibleOptions)("@0"===e.trim()?"":e),o=(0,c.extractConcealmentOptions)(t.values),r=[...t.errors,...o.errors],n=null,i=null;for(let e of o.values){let t=(0,d.resolveSurfaceTarget)(e);if(t){n?r.push("Für einen Schlüssel darf höchstens ein Oberflächenziel angegeben werden."):n=t;continue}if((0,l.isKeyColorRequest)(e)){null!==i?r.push("Für einen Schlüssel darf höchstens eine Farbe angegeben werden."):i=e;continue}r.push(`Unbekannte Schl\xfcsselfarbe, Zielangabe oder Option: ${e}`)}return{concealment:o.mode,errors:r,inline:null===n,placement:n,requestedColor:i,valid:0===r.length,visibility:t.rule}}function R(e){(0,c.setHostConcealment)(e,null),e.childNodes.length>0&&e.replaceChildren()}function q(e,t){v.has(e)||(v.add(e),console.warn(`Loot: Schl\xfcssel ${e} bleibt wegen ung\xfcltiger Optionen verborgen. ${t.join(" ")}`))}function $(e,t){var o;return`${e}:${[(o=t.requestedColor,(0,l.requestedKeyColor)(o)??"auto"),t.placement,(0,s.collectibleVisibilitySignature)(t.visibility),t.concealment??"none"].join(":")}`}function z(e,t){for(let o of e.keys())t.has(o)||e.delete(o)}function O(e,t,o,r){let n=e.get(t);return null!==o&&r>0&&n===o||(n&&e.delete(t),null!==o&&!(r<=0)&&(function(e,t){let o=0;for(let r of e.values())r===t&&(o+=1);return o}(e,o)<r&&e.set(t,o),!0))}function P(e,t){let o=t.sourceSection,r=null===o?null:$(o,t),n=null===r?0:_.get(r)??0;O(C,e,r,n)?x.delete(e):x.set(e,t)}function K(e){for(let e of S)x.delete(e);for(let t of(S.clear(),_.clear(),C.clear(),e)){let e=N(t.options);if(!e.valid){q(t.baseId,e.errors);continue}if(e.inline||!e.placement)continue;let o={baseId:t.baseId,concealment:e.concealment,placement:e.placement,requestedColor:e.requestedColor,sourceSection:t.section,visibility:e.visibility};x.set(t.baseId,o),S.add(t.baseId);let r=$(t.section,o);_.set(r,(_.get(r)??0)+1)}for(let[e,t]of(L="complete",k))P(e,t);k.clear(),Z()}function D(e){let t=e.classList.contains("loot-key-host--surface-source");e.classList.remove("loot-key-host--surface-source"),t&&((0,c.setHostConcealment)(e,null),e.removeAttribute("aria-hidden"))}function H(e){let t,o=(t=T(e),{...N(e.getAttribute("data-color")?.trim()??""),baseId:t,sourceHost:e,sourceSection:(0,u.sectionFromLootId)(t)});if(!o.valid)return k.delete(o.baseId),x.delete(o.baseId),C.delete(o.baseId),D(e),q(o.baseId,o.errors),R(e),o;if(o.inline||!o.placement)return k.delete(o.baseId),x.delete(o.baseId),C.delete(o.baseId),D(e),o;let r={baseId:o.baseId,concealment:o.concealment,placement:o.placement,requestedColor:o.requestedColor,sourceHost:o.sourceHost,sourceSection:o.sourceSection,visibility:o.visibility};return"complete"===L?P(o.baseId,r):k.set(o.baseId,r),(0,c.setHostConcealment)(e,null),e.classList.add("loot-key-host--surface-source"),e.setAttribute("aria-hidden","true"),e.childNodes.length>0&&e.replaceChildren(),o}function F(e,t,o){return[...e.querySelectorAll("[data-loot-key-button]")].find(e=>e.dataset.lootKeyButton===t&&e.dataset.lootKeyColor===o)??null}function G(e,t){let o=e.filter(e=>e.dataset.lootKeyPlacement===t);return{duplicates:o.slice(1),primary:o[0]??null}}function V(){return[...document.querySelectorAll(`[${p}]`)]}function B(e){e?.hasAttribute(h)&&!e.querySelector(`[${p}]`)&&e.remove()}function U(e){if(!e)return;let t=e.parentElement;e.remove(),B(t)}function Y(e){let{duplicates:t,primary:o}=G(V(),e);U(o),t.forEach(U)}function W(){if(!f)return;y.clear();let e=[...document.querySelectorAll(m)];z(C,new Set(e.map(T)));let t=new Map;for(let r of e){var o;let e=H(r);if(!e.valid||!e.inline)continue;let n=(o=e.baseId,`key:${o}:inline`),l=t.get(n)??[];l.push({host:r,request:e}),t.set(n,l)}for(let[e,o]of t){let t=o.find(({host:e,request:t})=>(0,u.sourceSlideIsActive)(t.sourceSection,e))??o[0];for(let e of o)e!==t&&R(e.host);!function(e,t,o){if(!f)return;if(f.collected(t)&&!b.has(t)){y.delete(t),w.forget(`pickup:${t}`),R(e);return}let{color:r}=(0,l.resolveKeyAppearance)(t,o.requestedColor);if(!b.has(t)){if(!w.visible(`pickup:${t}`,o.visibility,(0,u.sourceSlideIsActive)(o.sourceSection,e),Z)){y.delete(t),R(e);return}y.add(t),F(e,t,r)||((0,c.setHostConcealment)(e,null),e.replaceChildren(M(t,r))),(0,c.setHostConcealment)(e,o.concealment)}}(t.host,e,t.request)}!function(){if(!f)return;let e=new Set;for(let t of x.values()){let o=j(t.baseId,t.placement),r=b.has(o);if(f.collected(o)&&!r){y.delete(o),w.forget(`pickup:${o}`),Y(o);continue}let n=w.visible(`pickup:${o}`,t.visibility,(0,u.sourceSlideIsActive)(t.sourceSection,t.sourceHost),Z);if(!n&&!r){y.delete(o),Y(o);continue}e.add(o),n&&!r?y.add(o):y.delete(o),r||function(e,t){let o=(0,d.surfaceTargetElement)(t.placement,document),r=G(V(),e),n=r.primary;if(r.duplicates.forEach(e=>U(e)),!o)return U(n);let i=(0,d.surfaceTargetIsGrouped)(t.placement)?function(e,t){let o=e.querySelector(`:scope > [${h}="${t}"]`);if(o)return o;let r=e.matches("ul, ol"),n=document.createElement(r?"li":"div");return n.className="loot-key-tray",n.dataset.lootKeyTray=t,n.setAttribute("role","group"),n.setAttribute("aria-label","Sammelbare Schlüssel"),e.appendChild(n),n}(o,t.placement):o,{color:a}=(0,l.resolveKeyAppearance)(e,t.requestedColor);if(n)F(n,e,a)||((0,c.setHostConcealment)(n,null),n.replaceChildren(M(e,a)));else{let o=i.matches("ul, ol");(n=document.createElement(o?"li":"div")).className=`loot-key-placement loot-key-placement--${t.placement}`,n.dataset.lootKeyPlacement=e,n.dataset.lootKeyLocation=t.placement,o&&n.setAttribute("role","none"),n.append(M(e,a))}if(n.parentElement!==i){let e=n.parentElement;i.appendChild(n),B(e)}(0,c.setHostConcealment)(n,t.concealment)}(o,t)}for(let t of V()){let o=t.dataset.lootKeyPlacement;o&&(e.has(o)||b.has(o))||U(t)}}(),X(E)}function Z(){null===A&&(A=window.setTimeout(()=>{A=null,W()},0))}function X(e){e?.takeRecords()}function Q(e){return e.length>0}function J(e){Q(e)&&Z()}class ee extends HTMLElement{static get observedAttributes(){return["data-key-id","data-color"]}connectedCallback(){H(this),Z()}attributeChangedCallback(){this.isConnected&&(H(this),Z())}}function et(e){f=e,"idle"===L&&(L="pending",(0,i.discoverCourseKeyDeclarations)().then(K).catch(()=>K([]))),I||(I=!0,(0,u.observeLiaSlideActivity)(Z)),customElements.get(m)||customElements.define(m,ee),E||(E=new MutationObserver(J)).observe(document.documentElement,{childList:!0,subtree:!0}),W()}},{"./key-colors.ts":"7rSfY","./course-chests.ts":"2ceW6","./key-visual.ts":"iQm7z","./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./slide-activity.ts":"5qduG","./surface-targets.ts":"dYwdL","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"2ceW6":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"DEFAULT_COURSE_VERSION",()=>g),n.export(o,"parseCourseVersion",()=>k),n.export(o,"parseCourseChestDeclarations",()=>_),n.export(o,"parseCourseKeyDeclarations",()=>C),n.export(o,"parseCourseLockDeclarations",()=>L),n.export(o,"parseCourseChestCatalogDeclarations",()=>E),n.export(o,"parseCourseLockCatalogDeclarations",()=>A),n.export(o,"parseCourseResourceDeclaration",()=>T),n.export(o,"parseCourseSecretSlideDeclarations",()=>j),n.export(o,"parseCourseAchievementsDeclaration",()=>M),n.export(o,"discoverCourseChestDeclarations",()=>q),n.export(o,"discoverCourseKeyDeclarations",()=>$),n.export(o,"discoverCourseVersion",()=>z),n.export(o,"discoverCourseLockDeclarations",()=>O),n.export(o,"discoverCourseChests",()=>P),n.export(o,"discoverCourseLocks",()=>K),n.export(o,"discoverCourseResourceDeclaration",()=>D),n.export(o,"discoverCourseSecretSlideDeclarations",()=>H),n.export(o,"discoverCourseAchievementsDeclaration",()=>F),n.export(o,"requireCourseSecretSlideDeclarations",()=>G);var l=e("./lock-options.ts");let i=/^\s*@(Schatztruhe|Diamanttruhe|Energiekiste)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/,a=/^\s*@Schluessel(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/,s=/^\s*@Schloss\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*\)\s*$/,c=/^\s*@LootTruhe_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*,\s*(gold|diamonds|energy)\s*\)\s*$/i,u=/^\s*@LootSchloss_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*\)\s*$/,d=/^\s*@Ressourcen\s*\(\s*([^,()\r\n]+?)\s*,\s*([^,()\r\n]+?)(?:\s*,\s*([^,()\r\n]+?))?\s*\)\s*$/,m=/^\s*@Geheimfolie\s*$/,p=/^\s*@(achievements|erfolge)\s*$/i,h=/^\+?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[+-]?\d+)?$/i,f=[0,300,1e3],g="0.0.1",b={Schatztruhe:"gold",Diamanttruhe:"diamonds",Energiekiste:"energy"},y=null,v=null;function w(e,t){let o=t.split(";").map(e=>e.trim().toLowerCase()).join(";");return`${e}(${o})`}function x(e){let t=0x811c9dc5;for(let o=0;o<e.length;o+=1)t^=e.charCodeAt(o),t=Math.imul(t,0x1000193);return(t>>>0).toString(36)}function k(e){let t=/^\s*<!--([\s\S]*?)-->/u.exec(e.replace(/^\uFEFF/u,""));return t&&/^\s*version\s*:\s*(.*?)\s*$/imu.exec(t[1])?.[1]?.trim()||g}function S(e){let t=[],o=null,r=!1,n=null,l=-1;for(let i of e.split(/\r?\n/)){let e=function(e,t){let o="",r=0,n=t;for(;r<e.length;){if(n){let t=e.indexOf("--\x3e",r);if(t<0)return{visible:o,inComment:!0};r=t+3,n=!1;continue}let t=e.indexOf("\x3c!--",r);if(t<0){o+=e.slice(r);break}o+=e.slice(r,t),r=t+4,n=!0}return{visible:o,inComment:n}}(i,r);if(r=e.inComment,o){(function(e,t){let o=/^ {0,3}(`{3,}|~{3,})\s*$/.exec(e);return null!==o&&o[1][0]===t.marker&&o[1].length>=t.length})(e.visible,o)&&(o=null);continue}let a=function(e){let t=/^ {0,3}(`{3,}|~{3,})/.exec(e);return t?{marker:t[1][0],length:t[1].length}:null}(e.visible);if(a){o=a;continue}if(n){RegExp(`</${n}\\s*>`,"i").test(e.visible)&&(n=null);continue}let s=/<(script|style|pre|code|textarea|template)(?:\s|>)/i.exec(e.visible);if(s){let t=s[1].toLowerCase();RegExp(`</${t}\\s*>`,"i").test(e.visible)||(n=t);continue}if(/^(?: {4}|\t)/.test(e.visible))continue;let c=function(e){let t="",o=0;for(let r=0;r<e.length;){if("`"===e[r]&&"\\"!==e[r-1]){let n=r+1;for(;"`"===e[n];)n+=1;let l=n-r;0===o?o=l:o===l&&(o=0),t+=" ".repeat(l),r=n;continue}t+=0===o?e[r]:" ",r+=1}return t}(e.visible);/^ {0,3}#{1,6}(?:\s+|$)/.test(c)&&(l+=1),t.push({content:c,section:l})}return t}function _(e){let t=[],o=new Map;for(let r of S(e)){let e=i.exec(r.content);if(!e)continue;let n=(e[2]??"").trim(),l=b[e[1]],a=w(e[1],n),s=(o.get(a)??0)+1;o.set(a,s),t.push({baseId:`source-${l}-${x(a)}-${s}`,placement:n,reward:l,section:r.section})}return t}function C(e){let t=[],o=new Map,r=new Set;for(let n of S(e)){let e=a.exec(n.content);if(!e)continue;let l=(e[1]??"").trim(),i=w("Schluessel",l),s=(o.get(i)??0)+1;o.set(i,s);let c=`source-key-${x(i)}-${s}`,u=c,d=1;for(;r.has(u);)d+=1,u=`${c}-collision-${d}`;r.add(u),t.push({baseId:u,options:l,section:n.section})}return t}function L(e){let t=[],o=new Map;for(let r of S(e)){let e=s.exec(r.content);if(!e)continue;let n=e[1].trim(),i=(0,l.parseLockOptions)(e[2]);if(!i.valid||!i.color)continue;let a=`Schloss(${n.toLowerCase()},${i.color}${i.onlyOnSlide?",anker":""})`,c=(o.get(a)??0)+1;o.set(a,c),t.push({baseId:`source-lock-${x(a)}-${c}`,target:n,color:i.color,onlyOnSlide:i.onlyOnSlide,section:r.section})}return t}function E(e){return[..._(e),...function(e){let t=[],o=new Map;for(let r of S(e)){let e=c.exec(r.content);if(!e)continue;let n=e[2].trim(),l=e[3].toLowerCase(),i=w(`LootTruhe(${l})`,`${e[1].trim()};${n}`),a=(o.get(i)??0)+1;o.set(i,a),t.push({baseId:`source-internal-${l}-${x(i)}-${a}`,placement:n,reward:l,section:r.section})}return t}(e)]}function A(e){return[...L(e),...function(e){let t=[],o=new Map;for(let r of S(e)){let e=u.exec(r.content);if(!e)continue;let n=e[2].trim(),i=(0,l.parseLockOptions)(e[3]);if(!i.valid||!i.color)continue;let a=`LootSchloss(${e[1].trim()},${n.toLowerCase()},${i.color}${i.onlyOnSlide?",anker":""})`,s=(o.get(a)??0)+1;o.set(a,s),t.push({baseId:`source-internal-lock-${x(a)}-${s}`,target:n,color:i.color,onlyOnSlide:i.onlyOnSlide,section:r.section})}return t}(e)]}function I(e){let t=e.trim();if(!h.test(t))return null;let o=Number(t);return Number.isFinite(o)&&o>=0?o:null}function T(e){for(let t of S(e)){let e=d.exec(t.content);if(!e)continue;let o=I(e[1]),r=I(e[2]),n=void 0===e[3]?void 0:I(e[3]);if(null!==o&&null!==r&&null!==n)return{gold:o,diamonds:r,...void 0===n?{}:{energy:n},section:t.section}}return null}function j(e){let t=[],o=new Set;for(let r of S(e))!(r.section<0||o.has(r.section))&&m.test(r.content)&&(o.add(r.section),t.push({section:r.section}));return t}function M(e){return S(e).some(e=>p.test(e.content))}async function N(){let e=function(){let e=window.LIA,t=e?.defaultCourseURL?.trim();if(t)try{let e=new URL(t,window.location.href);if(/^(?:https?:|blob:|data:)$/i.test(e.protocol))return e.href}catch{}return function(e){let t=e.trim();if(!t)return null;let o=[t];try{let e=decodeURIComponent(t);e!==t&&o.push(e)}catch{}return o.find(e=>/^(?:https?:|blob:|data:)/i.test(e))??null}(window.location.search.slice(1))}();if(!e)return null;let t=window.LIA,o=t?.fetch??window.fetch.bind(window),r=new AbortController,n=window.setTimeout(()=>r.abort(),4e3);try{let t=await o(e,{cache:"default",credentials:"same-origin",signal:r.signal});if(!t.ok)return null;let n=await t.text();return n.length<=0xa00000?n:null}catch{return null}finally{window.clearTimeout(n)}}async function R(){if(null!==y)return y;if(v)return v;v=(async()=>{for(let e of f){e>0&&await new Promise(t=>window.setTimeout(t,e));let t=await N();if(null!==t)return y=t,t}return null})();try{return await v}finally{v=null}}async function q(){let e=await R();return e?_(e):[]}async function $(){let e=await R();return e?C(e):[]}async function z(){let e=await R();return e?k(e):null}async function O(){let e=await R();return e?L(e):[]}async function P(){let e=await R();return e?{declarations:_(e),catalog:E(e)}:{declarations:[],catalog:[]}}async function K(){let e=await R();return e?{declarations:L(e),catalog:A(e)}:{declarations:[],catalog:[]}}async function D(){let e=await R();return e?T(e):null}async function H(){let e=await R();return e?j(e):[]}async function F(){let e=await R();return!!e&&M(e)}async function G(){let e=await R();if(null===e)throw Error("Die LiaScript-Kursquelle konnte nicht geladen werden.");return j(e)}},{"./lock-options.ts":"3c981","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"3c981":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"parseLockOptions",()=>a);var l=e("./collectible-visibility.ts"),i=e("./key-colors.ts");function a(e){let t=[],o=[],r=!1;for(let o of e.split(";")){let e=o.trim();e&&((0,l.isOnlyOnSlideOption)(e)?r=!0:t.push(e))}1!==t.length&&o.push("Ein Schloss benötigt genau eine Schlüsselfarbe.");let n=1===t.length?(0,i.requestedKeyColor)(t[0]):null;return 1!==t.length||n||o.push(`Unbekannte Schl\xfcsselfarbe oder Schlossoption: ${t[0]}`),{color:n,errors:o,onlyOnSlide:r,valid:0===o.length&&null!==n}}},{"./collectible-visibility.ts":"8e3cc","./key-colors.ts":"7rSfY","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8e3cc":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"MAX_COLLECTIBLE_DELAY_MS",()=>l),n.export(o,"isOnlyOnSlideOption",()=>u),n.export(o,"parseCollectibleOptions",()=>d),n.export(o,"collectibleVisibilitySignature",()=>m),n.export(o,"advanceCollectibleReveal",()=>p),n.export(o,"CollectibleVisibilityGate",()=>h);let l=0x7fffffff,i=new Set(["anker","nur auf folie","nur-auf-folie","folie","only on slide","only-on-slide","slide only","slide-only"]),a=/^(?:(?:erst\s+)?nach\s+|nach\s*=\s*)?(\d+(?:[.,]\d+)?)\s*(s|sek|sekunde|sekunden|m|min|minute|minuten)$/u,s=/^(?:ank\p{L}*|nur(?:\s+|-)|only(?:\s+|-)|slide(?:\s+|-)?only|(?:erst\s+)?nach(?:\s|=|$)|\d+(?:[.,]\d+)?\s*\p{L})|(?:\bfoli\p{L}*\b|\bslides?\b|\bsek\p{L}*\b|\bmin(?:ute|uten)?\b)/u;function c(e){return e.normalize("NFKC").replace(/\s+/gu," ").trim().toLocaleLowerCase("de-DE")}function u(e){return i.has(c(e))}function d(e){let t=[],o=[],r=0,n=!1,u=!1,d=!1;for(let m of e.split(";")){let e=m.trim();if(!e)continue;let p=c(e);if(i.has(p)){d=!0,u=!0;continue}let h=function(e){let t=a.exec(e);if(!t)return{matched:!1,value:null};let o=Number(t[1].replace(",","."))*(["s","sek","sekunde","sekunden"].includes(t[2])?1e3:6e4);return{matched:!0,value:Number.isFinite(o)&&o>=0&&o<=l?o:null}}(p);if(h.matched){u=!0,null===h.value?o.push(`Ung\xfcltige Verz\xf6gerung: ${e}`):n?o.push("Die Verzögerung darf nur einmal angegeben werden."):(r=h.value,n=!0);continue}if(s.test(p)){u=!0,o.push(`Unbekannte Sichtbarkeitsoption: ${e}`);continue}t.push(e)}return{errors:o,hasOptions:u,rule:{delayMs:r,onlyOnSlide:d},valid:0===o.length,values:t}}function m(e){return`${+!!e.onlyOnSlide}:${e.delayMs}`}function p(e,t,o,r){let n=m(e),l=t?.signature===n?t:null,i=!e.onlyOnSlide||r;if(!l&&i&&(l={signature:n,startedAt:Number.isFinite(o)?o:0}),!l)return{state:null,visible:!1,wakeAt:null};let a=l.startedAt+e.delayMs,s=o>=a;return{state:l,visible:s&&(!e.onlyOnSlide||r),wakeAt:s?null:a}}class h{constructor(e=()=>Date.now(),t=(e,t)=>window.setTimeout(e,t),o=e=>window.clearTimeout(e)){this.states=new Map,this.wakes=new Map,this.now=e,this.schedule=t,this.cancel=o}visible(e,t,o,r){let n=this.now(),l=p(t,this.states.get(e)??null,n,o);return l.state?this.states.set(e,l.state):this.states.delete(e),this.syncWake(e,l.wakeAt,n,r),l.visible}forget(e){this.states.delete(e);let t=this.wakes.get(e);t&&this.cancel(t.handle),this.wakes.delete(e)}syncWake(e,t,o,r){let n=this.wakes.get(e);if(n&&n.at===t||(n&&this.cancel(n.handle),this.wakes.delete(e),null===t))return;let l=this.schedule(()=>{let t=this.wakes.get(e);t&&t.handle===l&&(this.wakes.delete(e),r())},Math.max(0,t-o));this.wakes.set(e,{at:t,handle:l})}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8YWP0":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"CONCEALMENT_ATTRIBUTE",()=>l),n.export(o,"CONCEALMENT_SELECTOR",()=>i),n.export(o,"CONCEALMENT_CHANGED_EVENT",()=>a),n.export(o,"extractConcealmentOptions",()=>u),n.export(o,"concealmentModeOf",()=>d),n.export(o,"concealedContentOf",()=>m),n.export(o,"prepareConcealedHost",()=>p),n.export(o,"setHostConcealment",()=>f);let l="data-loot-concealment",i=`[${l}]`,a="lia-loot:concealment-changed",s={dust:"dust",solid:"solid",unsichtbar:"solid",verdeckt:"solid",zauberstaub:"dust"};function c(e){return e.trim().toLocaleLowerCase("de-DE")}function u(e){let t=[],o=[],r=null;for(let n of e){let e=s[c(n)];if(!e){o.push(n);continue}if(r){t.push(r===e?`Die Verbergungsoption \u{201E}${n}\u{201C} wurde doppelt angegeben.`:"„unsichtbar“ und „zauberstaub“ können nicht gleichzeitig verwendet werden.");continue}r=e}return{errors:t,mode:r,values:o}}function d(e){let t=c(e.getAttribute(l)??"");return"solid"===t||"dust"===t?t:null}function m(e){return[...e.children].find(e=>e.classList.contains("loot-magnifier-secret__content"))??null}function p(e){let t=d(e);if(!t)return null;let o=m(e);return o||((o=document.createElement("span")).className="loot-magnifier-secret__content",e.appendChild(o)),[...e.childNodes].filter(e=>e!==o).forEach(e=>o.appendChild(e)),e.classList.add("loot-magnifier-secret"),e.classList.toggle("loot-magnifier-secret--solid","solid"===t),e.classList.toggle("loot-magnifier-secret--dust","dust"===t),e.dataset.lootConcealmentReady="true",t}function h(e){e.dispatchEvent(new CustomEvent(a,{bubbles:!0}))}function f(e,t){let o=d(e);if(!t){let t=m(e);t&&t.replaceWith(...t.childNodes),e.removeAttribute(l),delete e.dataset.lootConcealmentReady,e.classList.remove("loot-magnifier-secret","loot-magnifier-secret--solid","loot-magnifier-secret--dust","loot-magnifier-secret--under-lens"),e.style.removeProperty("--loot-magnifier-x"),e.style.removeProperty("--loot-magnifier-y"),e.removeAttribute("aria-hidden"),e.inert=!1,o&&h(e);return}e.setAttribute(l,t),p(e),o!==t&&(e.classList.remove("loot-magnifier-secret--under-lens"),e.setAttribute("aria-hidden","true"),e.inert=!0,h(e))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5qduG":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"activeLiaSection",()=>f),n.export(o,"sectionFromLootId",()=>g),n.export(o,"sourceSlideIsActive",()=>b),n.export(o,"setLiaSlideAccessGuard",()=>v),n.export(o,"refreshLiaSlideActivity",()=>w),n.export(o,"observeLiaSlideActivity",()=>_);let l=".lia-slide__container",i=".lia-slide__container > main.lia-slide__content:not([hidden])",a=new Set,s=()=>!0,c=null,u=null,d=null,m=null,p=!1;function h(e){let t=/^#(\d+)$/.exec(e);if(!t)return null;let o=Number(t[1])-1;return Number.isInteger(o)&&o>=0?o:null}function f(){let e=document.querySelector(i),t=e?.parentElement;if(e&&t){let o=[...t.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(e);if(o>=0)return o}let o=document.querySelector("#lia-toc #focusedToc.lia-toc__link");if(o){let e=function(e){try{return h(new URL(e.href,window.location.href).hash)}catch{return h(e.getAttribute("href")??"")}}(o);if(null!==e)return e}return h(window.location.hash)}function g(e){let t=/(?:^|:)(\d+)_\d+(?::|$)/.exec(e);if(!t)return null;let o=Number(t[1]);return Number.isInteger(o)&&o>=0?o:null}function b(e,t){let o=f();if(!s(o??e))return!1;if(null!==e&&null!==o)return e===o;let r=t?.closest("main");return!!(r&&!r.hidden&&r.classList.contains("lia-slide__content"))}function y(){for(let e of a)e()}function v(e){s=e,y()}function w(){y()}function x(e){for(let t of(u?.disconnect(),u=new MutationObserver(t=>{t.some(t=>t.target instanceof HTMLElement&&"MAIN"===t.target.tagName&&t.target.parentElement===e)&&y()}),e.children))t instanceof HTMLElement&&"MAIN"===t.tagName&&u.observe(t,{attributeFilter:["class","hidden"],attributes:!0})}function k(){let e,t=(e=document.querySelector(i),e?.parentElement?.classList.contains(l.slice(1))?e.parentElement:[...document.querySelectorAll(l)].find(e=>[...e.children].some(e=>e instanceof HTMLElement&&"MAIN"===e.tagName))??null);t===c||(u?.disconnect(),d?.disconnect(),c=t,t&&(x(t),(d=new MutationObserver(()=>{x(t),y()})).observe(t,{childList:!0}),y()))}function S(e){return e instanceof Element&&(e.matches(l)||null!==e.querySelector(l)||null!==c&&e.contains(c))}function _(e){return a.add(e),m||(m=new MutationObserver(e=>{(null===c||!1===c.isConnected||e.some(e=>[...e.addedNodes,...e.removedNodes].some(S)))&&k()})).observe(document.documentElement,{childList:!0,subtree:!0}),p||(p=!0,window.addEventListener("hashchange",y),window.addEventListener("pageshow",y),window.addEventListener("popstate",y)),k(),e(),()=>{a.delete(e)}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],dYwdL:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"SURFACE_TARGETS",()=>l),n.export(o,"resolveSurfaceTarget",()=>u),n.export(o,"isSurfaceTarget",()=>d),n.export(o,"surfaceTargetElement",()=>m),n.export(o,"surfaceTargetIsGrouped",()=>p);let l=["toc","menu","classroom","info","translator","mode"],i=[{aliases:[],grouped:!1,id:"toc",selector:"#lia-toc .lia-toc__content"},{aliases:[],grouped:!0,id:"menu",selector:"#lia-support-menu .lia-support-menu__item--settings .lia-support-menu__submenu"},{aliases:[],grouped:!0,id:"classroom",selector:"#lia-support-menu .lia-support-menu__item--share .lia-support-menu__submenu"},{aliases:[],grouped:!0,id:"info",selector:"#lia-support-menu .lia-support-menu__item--info .lia-support-menu__submenu"},{aliases:["translate","translation","lang","übersetzer","uebersetzer"],grouped:!0,id:"translator",selector:"#lia-support-menu .lia-support-menu__item--lang .lia-support-menu__submenu"},{aliases:["display","view","darstellung"],grouped:!0,id:"mode",selector:"#lia-support-menu .lia-support-menu__item--mode .lia-support-menu__submenu"}],a=new Map(i.map(e=>[e.id,e])),s=new Map;function c(e){return e.trim().toLocaleLowerCase("de-DE")}for(let e of i)for(let t of[e.id,...e.aliases])s.set(c(t),e.id);function u(e){return e?s.get(c(e))??null:null}function d(e){return a.has(e)}function m(e,t=document){return t.querySelector(a.get(e).selector)}function p(e){return a.get(e).grouped}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],grhSe:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"installMagnifier",()=>F),n.export(o,"MAGNIFIER_RADIUS",()=>a.MAGNIFIER_RADIUS);var l=e("./collectible-visibility.ts"),i=e("./concealment.ts"),a=e("./magnifier-geometry.ts"),s=e("./magnifier-visual.ts"),c=e("./resource-bar.ts"),u=e("./slide-activity.ts");let d="lia-loot-magnifier",m="lia-loot-hidden",p="lia-loot-magnifier-tool",h="lia-loot-magnifier-lens",f=null,g=0,b=!1,y=!1,v=null,w=null,x=null,k=!1,S=!1,_=new Set,C=new Set,L=new Set,E=new(0,l.CollectibleVisibilityGate);function A(e){var t,o;let r,n,i;if(!f)return;let a=function(e){let t=e.getAttribute("data-magnifier-id")?.trim();if(t&&!t.startsWith("@"))return`magnifier:${t}:inline`;let o=e.dataset.lootMagnifierRuntimeId;if(o)return o;g+=1;let r=`magnifier:runtime-${g}:inline`;return e.dataset.lootMagnifierRuntimeId=r,r}(e);if(f.collected()&&!_.has(a)){C.delete(a),E.forget(`magnifier:${a}`),e.childElementCount>0&&e.replaceChildren();return}let d=(t=e.getAttribute("data-options")?.trim()??"",r=/^@\d+$/u.test(t)?"":t,i=[...(n=(0,l.parseCollectibleOptions)(r)).errors],n.values.length>0&&i.push(`Unbekannte Lupenoption: ${n.values.join("; ")}`),{errors:i,sourceSection:(0,u.sectionFromLootId)(a),valid:0===i.length,visibility:n.rule});if(!d.valid){C.delete(a),o=d.errors,L.has(a)||(L.add(a),console.warn(`Loot: Lupe ${a} bleibt wegen ung\xfcltiger Optionen verborgen. ${o.join(" ")}`)),e.childElementCount>0&&e.replaceChildren();return}if(!E.visible(`magnifier:${a}`,d.visibility,(0,u.sourceSlideIsActive)(d.sourceSection,e),I)){C.delete(a),e.childElementCount>0&&e.replaceChildren();return}if(C.add(a),![...e.querySelectorAll("[data-loot-magnifier-button]")].find(e=>e.dataset.lootMagnifierButton===a)){let t,o;e.replaceChildren(((t=document.createElement("button")).type="button",t.className="loot-magnifier-pickup",t.dataset.lootMagnifierButton=a,t.setAttribute("aria-label","Lupe einsammeln"),t.append((0,s.createMagnifierGraphic)(),((o=document.createElement("span")).className="loot-magnifier-pickup__reward",o.setAttribute("aria-hidden","true"),o.textContent="GEFUNDEN",o)),t.addEventListener("click",e=>{if(!f||_.has(a)||!C.has(a))return;if(_.add(a),!f.collect()){_.delete(a),I();return}let o=0===e.detail;t.disabled=!0,t.classList.add("loot-magnifier-pickup--collected"),t.setAttribute("aria-label","Lupe gefunden"),K(),(0,c.announceResource)("Lupe gefunden. Du kannst sie jetzt in der Leiste aktivieren."),I(),window.setTimeout(()=>{_.delete(a),t.remove(),I(),o&&O()},650)}),t))}}function I(){C.clear(),document.querySelectorAll(d).forEach(A)}function T(){let e=document.getElementById(h);if(e instanceof HTMLDivElement)return e;let t=document.createElement("div");return t.id=h,t.className="loot-magnifier-lens",t.hidden=!0,t.setAttribute("aria-hidden","true"),document.body.appendChild(t),t}function j(e,t){e.classList.toggle("loot-magnifier-secret--under-lens",t),e.setAttribute("aria-hidden",String(!t)),e.inert=!t}function M(e,t){if(!(0,i.prepareConcealedHost)(e))return;let o=(0,i.concealedContentOf)(e);if(!o)return;let r=e.getBoundingClientRect(),n=o.getBoundingClientRect();(e.style.setProperty("--loot-secret-left",`${n.left-r.left}px`),e.style.setProperty("--loot-secret-top",`${n.top-r.top}px`),e.style.setProperty("--loot-secret-width",`${n.width}px`),e.style.setProperty("--loot-secret-height",`${n.height}px`),t&&b&&y)?(e.style.setProperty("--loot-magnifier-x",`${t.x-n.left}px`),e.style.setProperty("--loot-magnifier-y",`${t.y-n.top}px`),j(e,(0,a.magnifierIntersectsRect)(t.x,t.y,n))):j(e,!1)}function N(e){document.querySelectorAll(i.CONCEALMENT_SELECTOR).forEach(t=>M(t,e))}function R(){I(),N(y?v:null)}function q(){if(x=null,!w||!b)return;v=w,w=null,y=!0;let e=T();e.style.left=`${v.x}px`,e.style.top=`${v.y}px`,e.hidden=!1,document.documentElement.classList.add("loot-magnifier-pointing"),N(v)}function $(e){w=e,null===x&&(x=window.requestAnimationFrame(q))}function z(){y=!1,w=null,null!==x&&window.cancelAnimationFrame(x),x=null,T().hidden=!0,document.documentElement.classList.remove("loot-magnifier-pointing"),N(null)}function O(){document.getElementById(p)?.focus({preventScroll:!0})}function P(e,t=!0){b=!!(e&&f?.collected()),document.documentElement.classList.toggle("loot-magnifier-active",b);let o=document.getElementById(p);o?.classList.toggle("loot-magnifier-tool--active",b),o?.setAttribute("aria-pressed",String(b)),o?.setAttribute("aria-label",b?"Lupe deaktivieren":"Lupe aktivieren"),b||z(),t&&(0,c.announceResource)(b?"Lupe aktiviert. Bewege den Zeiger über verborgene Bereiche.":"Lupe deaktiviert.")}function K(){if(!f?.collected()){document.getElementById(p)?.remove(),P(!1,!1),(0,c.refreshResourceBarVisibility)();return}let e=document.getElementById(p);e||((e=document.createElement("button")).id=p,e.type="button",e.className="loot-magnifier-tool",e.dataset.lootMagnifierTool="true",e.append((0,s.createMagnifierGraphic)()),e.addEventListener("click",()=>{P(!b)}),(0,c.installResourceBar)().appendChild(e)),P(b,!1),(0,c.refreshResourceBarVisibility)()}class D extends HTMLElement{static get observedAttributes(){return["data-magnifier-id","data-options"]}connectedCallback(){A(this)}attributeChangedCallback(){this.isConnected&&A(this)}}class H extends HTMLElement{static get observedAttributes(){return["data-loot-concealment"]}connectedCallback(){M(this,y?v:null),this.childObserver??=new MutationObserver(()=>{queueMicrotask(()=>{this.isConnected&&M(this,y?v:null)})}),this.childObserver.observe(this,{childList:!0}),queueMicrotask(()=>{this.isConnected&&M(this,y?v:null)})}disconnectedCallback(){this.childObserver?.disconnect()}attributeChangedCallback(){this.isConnected&&M(this,y?v:null)}constructor(...e){super(...e),this.childObserver=null}}function F(e){f=e,k||(k=!0,window.addEventListener("pointermove",e=>{b&&e.isPrimary&&$({x:e.clientX,y:e.clientY})},{passive:!0}),window.addEventListener("pointerdown",e=>{b&&e.isPrimary&&"mouse"!==e.pointerType&&$({x:e.clientX,y:e.clientY})},{passive:!0}),window.addEventListener("pointerout",e=>{"mouse"===e.pointerType&&null===e.relatedTarget&&z()}),window.addEventListener("pointercancel",z),window.addEventListener("blur",z),window.addEventListener("scroll",()=>{b&&y&&v&&$(v)},{passive:!0}),window.addEventListener("resize",()=>{b&&y&&v&&$(v)},{passive:!0}),document.addEventListener("keydown",e=>{"Escape"===e.key&&b&&(e.preventDefault(),P(!1),O())}),document.addEventListener(i.CONCEALMENT_CHANGED_EVENT,()=>{N(y?v:null)})),T(),S||(S=!0,(0,u.observeLiaSlideActivity)(R)),customElements.get(m)||customElements.define(m,H),customElements.get(d)||customElements.define(d,D),K(),I(),N(null)}},{"./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./magnifier-geometry.ts":"ecwyG","./magnifier-visual.ts":"6yshi","./resource-bar.ts":"1KrGH","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],ecwyG:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"MAGNIFIER_RADIUS",()=>l),n.export(o,"magnifierIntersectsRect",()=>i);let l=72;function i(e,t,o,r=l){if(![e,t,o.left,o.right,o.top,o.bottom,r].every(Number.isFinite)||r<0||o.right<o.left||o.bottom<o.top)return!1;let n=Math.max(o.left,Math.min(e,o.right)),a=Math.max(o.top,Math.min(t,o.bottom)),s=e-n,c=t-a;return s*s+c*c<=r*r}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"6yshi":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(){let e=document.createElementNS("http://www.w3.org/2000/svg","svg");return e.setAttribute("viewBox","0 0 56 56"),e.setAttribute("shape-rendering","crispEdges"),e.setAttribute("aria-hidden","true"),e.classList.add("loot-magnifier-graphic"),e.innerHTML=`
    <rect class="loot-magnifier-shadow" x="8" y="46" width="42" height="6"/>
    <path class="loot-magnifier-outline" d="M10 2h20v4h8v8h4v20h-4v6h-8v4H10v-4H4v-6H0V14h4V8h6V2Z"/>
    <path class="loot-magnifier-glass" d="M14 10h12v4h4v16h-4v4H14v-4h-4V14h4v-4Z"/>
    <rect class="loot-magnifier-glint" x="14" y="12" width="8" height="4"/>
    <rect class="loot-magnifier-glint" x="12" y="16" width="4" height="8"/>
    <path class="loot-magnifier-outline" d="M30 34h8v4h4v4h4v4h4v10H38v-4h-4v-4h-4v-4h-4V36h4v-2Z"/>
    <path class="loot-magnifier-handle" d="M32 40h4v4h4v4h4v4h-4v-4h-4v-4h-4v-4Z"/>
    <rect class="loot-magnifier-handle-light" x="32" y="38" width="4" height="6"/>
  `,e}n.defineInteropFlag(o),n.export(o,"createMagnifierGraphic",()=>l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"4rVr5":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"MagnifierStore",()=>i);var l=e("./storage.ts");class i{collect(){return!this.current.collected&&(this.current={version:1,collected:!0},(0,l.saveMagnifier)(this.current),!0)}isCollected(){return this.current.collected}state(){return{...this.current}}constructor(){this.current=(0,l.loadMagnifier)()??{version:1,collected:!1}}}},{"./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],bLBcI:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"courseLockUnitCount",()=>K),n.export(o,"refreshObjectLocks",()=>el),n.export(o,"installObjectLocks",()=>ei);var l=e("./course-chests.ts"),i=e("./lock-options.ts"),a=e("./lock-targets.ts"),s=e("./template-targets.ts"),c=e("./slide-activity.ts");let u="lia-loot-lock",d=".lia-quiz",m="lia-loot-lock-status",p={mode:{rootSelector:"#lia-support-menu .lia-support-menu__item--mode",triggerGroup:"mode",contentGroup:"mode",focusSelector:"#lia-mode-textbook"},menu:{rootSelector:"#lia-support-menu .lia-support-menu__item--settings",triggerGroup:"setting",contentGroup:"setting",focusSelector:"#lia-btn-light-mode"},translator:{rootSelector:"#lia-support-menu .lia-support-menu__item--lang",triggerGroup:"translation",contentGroup:"translation",focusSelector:"#lia-checkbox-google_translate"},classroom:{rootSelector:"#lia-support-menu .lia-support-menu__item--share",triggerGroup:"share",contentGroup:"share",focusSelector:"#lia-button-qr-code"},info:{rootSelector:"#lia-support-menu .lia-support-menu__item--info",triggerGroup:"information",contentGroup:"information",focusSelector:""}},h={check:".lia-quiz__control .lia-quiz__check",resolve:".lia-quiz__control .lia-quiz__resolve",hint:".lia-quiz__control .lia-quiz__hint"},f={toc:"Inhaltsverzeichnis",mode:"Darstellung",menu:"Menü",translator:"Übersetzer",classroom:"Classroom",info:"Info-Menü",seitenwechsel:"Seitenwechsel",check:"Prüfen",resolve:"Auflösen",hint:"Hinweis",portal:"Portal",...s.TEMPLATE_TARGET_LABELS},g={red:"Rotes Schloss",blue:"Blaues Schloss",green:"Grünes Schloss",yellow:"Gelbes Schloss",purple:"Lilafarbenes Schloss",orange:"Orangefarbenes Schloss"},b={red:"roten Schlüssel",blue:"blauen Schlüssel",green:"grünen Schlüssel",yellow:"gelben Schlüssel",purple:"lilafarbenen Schlüssel",orange:"orangefarbenen Schlüssel"},y={red:"roter Schlüssel",blue:"blauer Schlüssel",green:"grüner Schlüssel",yellow:"gelber Schlüssel",purple:"lilafarbener Schlüssel",orange:"orangefarbener Schlüssel"},v=new Map,w=[],x=new Map,k=new Set,S=new WeakMap,_=new WeakMap,C=new WeakMap,L=null,E=[],A=null,I=null,T=0,j=0,M=0,N="idle",R=!1,q=!1,$=!1;function z(e){return"global"===e.scope?e.onlyOnSlide?null!==e.sourceSection?`lock:${e.target}:section-${e.sourceSection}:${e.color}`:`lock:${e.baseId}:${e.target}:${e.color}`:`lock:${e.target}:${e.color}`:(0,a.isTemplateLockTarget)(e.target)&&null!==e.sourceSection?`lock:${e.target}:section-${e.sourceSection}:${e.color}`:`lock:${e.baseId}:${e.target}:${e.color}`}function O(e){if("global"!==e.scope)return x.delete(e.baseId),e;let t={...e};return e.onlyOnSlide||delete t.sourceHost,x.set(e.baseId,t),e}function P(e){let t=function(e){let t=e.getAttribute("data-lock-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootLockRuntimeId;if(o)return o;T+=1;let r=`runtime-lock-${T}`;return e.dataset.lootLockRuntimeId=r,r}(e),o=(0,a.resolveLockTarget)(e.getAttribute("data-target")),r=(0,i.parseLockOptions)(e.getAttribute("data-color")??"");if(e.classList.add("loot-object-lock-host"),"true"!==e.getAttribute("aria-hidden")&&e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren(),delete e.dataset.lootLockError,!o||!r.valid||!r.color)return x.delete(t),null;let n=(0,c.sectionFromLootId)(t),l={baseId:t,target:o,color:r.color,onlyOnSlide:r.onlyOnSlide,sourceSection:n,sourceHost:e};if((0,a.isTemplateLockTarget)(o)){let e="global"===(0,s.templateTargetDefinition)(o).scope?"global":"local";return O({...l,scope:e})}if((0,a.isGlobalLockTarget)(o))return O({...l,scope:"global"});if((0,a.isItemLockTarget)(o))return O({...l,scope:"local"});let m=function(e){let t,o=e.closest(d);if(o)return o;let r=e.closest("main.lia-slide__content");if(!r)return null;let n=function(e,t){let o=e;for(;o.parentElement&&o.parentElement!==t;)o=o.parentElement;return o.parentElement===t?o:null}(e,r);if(!n)return null;let l=n.previousElementSibling;for(;l instanceof HTMLElement&&1===(t=[...l.children]).length&&t[0]instanceof HTMLElement&&t[0].matches(u);)l=l.previousElementSibling;return l instanceof HTMLElement&&l.matches(d)?l:null}(e);return m?O({...l,scope:"local",quiz:m}):(x.delete(t),e.dataset.lootLockError="quiz-not-adjacent",null)}function K(e,t=()=>!0){let o=new Set;for(let r of e){let e=(0,a.resolveLockTarget)(r.target);if(!e||(0,a.isTemplateLockTarget)(e)&&!t(e))continue;let n=(0,a.isTemplateLockTarget)(e)?"global"===(0,s.templateTargetDefinition)(e).scope?"global":"local":(0,a.isGlobalLockTarget)(e)?"global":(0,a.isLocalLockTarget)(e)||(0,a.isItemLockTarget)(e)?"local":null;n&&o.add(z({baseId:r.baseId,target:e,color:r.color,onlyOnSlide:r.onlyOnSlide,scope:n,sourceSection:r.section}))}return o.size}function D(e,t){for(let t of(w.length=0,e)){let e=function(e){let t=(0,a.resolveLockTarget)(e.target);return t&&(0,a.isTemplateLockTarget)(t)?{baseId:e.baseId,target:t,color:e.color,onlyOnSlide:e.onlyOnSlide,scope:"global"===(0,s.templateTargetDefinition)(t).scope?"global":"local",sourceSection:e.section}:t&&(0,a.isGlobalLockTarget)(t)?{baseId:e.baseId,target:t,color:e.color,onlyOnSlide:e.onlyOnSlide,scope:"global",sourceSection:e.section}:null}(t);e&&w.push(e)}N="complete",L?.catalogReady(K(t)),X()}function H(){let e=document.getElementById(m);if(e)return e;let t=document.createElement("div");return t.id=m,t.className="loot-object-lock-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function F(e,t){return[...e.children].filter(e=>e instanceof HTMLElement&&e.matches(t))}function G(e,t,o){e.getAttribute(t)!==o&&e.setAttribute(t,o)}function V(e,t,o){null===o?e.removeAttribute(t):e.setAttribute(t,o)}function B(e,t){return e.length===t.length&&e.every((e,o)=>e===t[o])}function U(e,t,o){e.style[t]!==o&&(e.style[t]=o)}function Y(e){for(let t of e.binding.controls)!function(e,t){if(e.states.get(t))return;let o={inert:t.inert,kind:"control",tabIndex:t.getAttribute("tabindex")};e.states.set(t,o)}(e,t),t.inert||(t.inert=!0),G(t,"tabindex","-1");for(let t of e.binding.contents)!function(e,t){if(e.states.get(t))return;let o={ariaHidden:t.getAttribute("aria-hidden"),concealed:t.classList.contains("loot-object-lock-concealed"),inert:t.inert,kind:"content"};e.states.set(t,o)}(e,t),t.inert||(t.inert=!0),G(t,"aria-hidden","true"),t.classList.add("loot-object-lock-concealed");!function(e){if("floating"!==e.binding.mode)return;let t=e.binding.anchor.getBoundingClientRect(),o=e.binding.anchor.ownerDocument.defaultView??window,r=e.binding.anchor.isConnected&&t.width>0&&t.height>0&&t.right>0&&t.bottom>0&&t.left<o.innerWidth&&t.top<o.innerHeight;e.button.hidden===r&&(e.button.hidden=!r),r&&(U(e.button,"left",`${t.left}px`),U(e.button,"top",`${t.top}px`),U(e.button,"width",`${t.width}px`),U(e.button,"height",`${t.height}px`),e.button.classList.toggle("loot-object-lock-button--near-top",t.top<96))}(e)}function W(e,t,o){let r;null!==e.feedbackTimer&&(window.clearTimeout(e.feedbackTimer),e.feedbackTimer=null),e.button.classList.toggle("loot-object-lock-button--missing","missing"===o),e.button.classList.toggle("loot-object-lock-button--unlocking","unlocking"===o);let n=e.button.querySelector(".loot-object-lock-message");n&&(n.textContent=t),(r=H()).textContent="",window.setTimeout(()=>{r.textContent=t},0),"missing"===o&&(e.feedbackTimer=window.setTimeout(()=>{e.feedbackTimer=null,e.button.classList.remove("loot-object-lock-button--missing"),n&&(n.textContent="")},2200))}function Z(){if(!L)return;let e=function(){let e=new Map;for(let t of function(){let e=[...w,...x.values()];document.querySelectorAll(u).forEach(t=>{let o=P(t);o&&e.push(o)});let t=[],o=new Set;for(let r of e){let e=z(r);o.has(e)||(o.add(e),t.push(r))}return t}()){let o=function(e){if(e.onlyOnSlide&&!(0,c.sourceSlideIsActive)(e.sourceSection,e.sourceHost))return null;if((0,a.isItemLockTarget)(e.target)){if(!(0,a.isItemLockTarget)(e.target)||!e.sourceHost?.isConnected||!(0,c.sourceSlideIsActive)(e.sourceSection,e.sourceHost))return null;let t=function(e){let t=e.closest("main.lia-slide__content");if(!t)return null;let o=null;for(let r of t.querySelectorAll("lia-loot-slide-portal"))(4&r.compareDocumentPosition(e))!=0&&(o=r);return o}(e.sourceHost),o=t?.querySelector("[data-loot-slide-portal-button]");return t&&o?{slotKey:`item:portal:${function(e){let t=_.get(e);if(t)return t;M+=1;let o=`portal-${M}`;return _.set(e,o),o}(t)}`,root:t,anchor:o,controls:[o],contents:[],mode:"floating",focusCandidates:[o]}:null}if((0,a.isTemplateLockTarget)(e.target)){if(!(0,a.isTemplateLockTarget)(e.target))return null;let t=(0,s.templateTargetDefinition)(e.target),o=(0,s.findTemplateTarget)(e.target,"lock",document);return o&&("slide"!==t.scope||(0,c.sourceSlideIsActive)(e.sourceSection,o.root))?{slotKey:"global"===t.scope?`template:global:${e.target}`:`template:${e.target}:section-${e.sourceSection??e.baseId}`,root:o.root,anchor:o.lockAnchor,controls:o.lockControls,contents:[],mode:"floating",focusCandidates:o.focusCandidates}:null}return"global"===e.scope?function(e){let t=p[e];if(t){let o=document.querySelector(t.rootSelector);if(!o)return null;let r=F(o,`button[data-group-id='${t.triggerGroup}'], i.hide-md-up`),n=F(o,`.lia-support-menu__submenu[data-group-id='${t.contentGroup}']`),l=t.focusSelector?o.querySelector(t.focusSelector):null;return{slotKey:`global:${e}`,root:o,anchor:o,controls:r,contents:n,mode:"fill",focusCandidates:[...r,...l?[l]:[],o]}}if("toc"===e){let e=document.querySelector("#lia-toc"),t=document.querySelector("#lia-btn-toc");return e&&t?{slotKey:"global:toc",root:e,anchor:t,controls:[t],contents:F(e,".lia-toc__content"),mode:"floating",focusCandidates:[t]}:null}if("seitenwechsel"===e){let e=document.querySelector(".lia-pagination"),t=e?.querySelector(":scope > .lia-pagination__content");if(!e||!t)return null;let o=document.querySelector("#lia-btn-prev"),r=document.querySelector("#lia-btn-next");return{slotKey:"global:seitenwechsel",root:e,anchor:t,controls:[o,r].filter(e=>null!==e),contents:[],mode:"floating",focusCandidates:[r,o].filter(e=>null!==e)}}return null}(e.target):function(e){if(!e.quiz||!e.quiz.isConnected||!(0,a.isLocalLockTarget)(e.target))return null;let t=e.quiz.querySelector(h[e.target]);return t&&function(e,t){let o=e.classList.contains("open")&&!t.hasAttribute("hidden")&&!(t instanceof HTMLButtonElement&&t.disabled)&&"true"!==t.getAttribute("aria-hidden")&&t.getClientRects().length>0;if(o){let e=C.get(t);e&&("-1"===t.getAttribute("tabindex")&&V(t,"tabindex",e.value),C.delete(t))}return o}(e.quiz,t)?{slotKey:`local:${function(e){let t=S.get(e);if(t)return t;j+=1;let o=`quiz-${j}`;return S.set(e,o),o}(e.quiz)}:${e.target}`,root:e.quiz,anchor:t,controls:[t],contents:[],mode:"floating",focusCandidates:[t]}:null}(e)}(t);if(!o)continue;let r=e.get(o.slotKey);r?r.requests.push(t):e.set(o.slotKey,{binding:o,requests:[t]})}let t=new Map;if(!L)return t;for(let[o,r]of e){let e=r.requests.find(e=>{let t=z(e);return!L?.unlocked(t)||k.has(t)});e&&t.set(o,{binding:r.binding,request:e})}return t}();for(let[r,n]of[...v]){let l=e.get(r);if(!l||z(l.request)!==n.lockId||(t=l.binding,o=n.binding,!(t.root===o.root&&t.anchor===o.anchor&&t.mode===o.mode&&B(t.controls,o.controls)&&B(t.contents,o.contents)))){var t,o;for(let[e,t]of(null!==n.feedbackTimer&&window.clearTimeout(n.feedbackTimer),n.states))!function(e,t){if(e.inert&&(e.inert=t.inert),"content"===t.kind){"true"===e.getAttribute("aria-hidden")&&V(e,"aria-hidden",t.ariaHidden??null),e.classList.contains("loot-object-lock-concealed")&&e.classList.toggle("loot-object-lock-concealed",t.concealed??!1);return}let o=e.hasAttribute("hidden")||"true"===e.getAttribute("aria-hidden")||e instanceof HTMLButtonElement&&e.disabled||0===e.getClientRects().length;"-1"===e.getAttribute("tabindex")&&(o?C.set(e,{value:t.tabIndex??null}):(V(e,"tabindex",t.tabIndex??null),C.delete(e)))}(e,t);n.states.clear(),A?.unobserve(n.binding.anchor),n.button.remove(),n.rootWasTarget||n.binding.root.classList.remove("loot-object-lock-target"),v.delete(r)}}for(let[t,o]of e){let e=v.get(t);e?Y(e):v.set(t,function(e,t){for(let e of t.controls)"true"===e.getAttribute("aria-expanded")&&e.click();let o=z(e),r=function(e,t,o,r=document){let n=r.createElement("button");return n.type="button",n.className=`loot-object-lock-button loot-object-lock-button--${e.scope} loot-key-color--${e.color}`,n.dataset.lootLockButton=t,n.dataset.lootLockId=t,n.dataset.lootLockTarget=e.target,n.dataset.lootLockColor=e.color,n.dataset.lootLockScope=e.scope,n.setAttribute("aria-label",`${f[e.target]} gesperrt. Einen ${b[e.color]} verwenden.`),n.innerHTML=`
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
    <span class="loot-object-lock-label" aria-hidden="true">${g[e.color]}</span>
    <span class="loot-object-lock-message" aria-hidden="true"></span>
  `,n.addEventListener("click",e=>{e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),function(e){let t=v.get(e);if(!L||!t||k.has(t.lockId))return;let o=L.unlock(t.lockId,t.request.color);if("missing-key"===o)return W(t,`${f[t.request.target]} ist gesperrt. Du brauchst einen ${b[t.request.color]}.`,"missing");if("invalid-lock-id"===o)return;k.add(t.lockId),W(t,"unlocked"===o?`${f[t.request.target]} entsperrt. Ein ${y[t.request.color]} wurde verwendet.`:`${f[t.request.target]} ist bereits entsperrt.`,"unlocking");let r=t.lockId,n=t.binding;window.setTimeout(()=>{k.delete(r),Z();let t=v.get(e);t?t.button.focus({preventScroll:!0}):function(e){for(let t of e.focusCandidates)if(function(e){let t=e.getBoundingClientRect();return e.isConnected&&!e.hasAttribute("hidden")&&!e.inert&&!(e instanceof HTMLButtonElement&&e.disabled)&&t.width>0&&t.height>0&&"true"!==e.getAttribute("aria-hidden")&&e.tabIndex>=0}(t)&&(t.focus({preventScroll:!0}),t.ownerDocument.activeElement===t))return;let t=e.root.getAttribute("tabindex"),o=()=>{e.root.removeEventListener("blur",o),V(e.root,"tabindex",t),eo()};e.root.setAttribute("tabindex","-1"),eo(),e.root.addEventListener("blur",o,{once:!0}),e.root.focus({preventScroll:!0})}(n)},620)}(o)}),n}(e,o,t.slotKey,t.anchor.ownerDocument);r.classList.add(`loot-object-lock-button--${t.mode}`);let n={binding:t,button:r,feedbackTimer:null,lockId:o,request:e,rootWasTarget:t.root.classList.contains("loot-object-lock-target"),states:new Map};return"fill"===t.mode?(t.root.classList.add("loot-object-lock-target"),t.root.appendChild(r)):t.anchor.ownerDocument.body.appendChild(r),A?.observe(t.anchor),Y(n),n}(o.request,o.binding))}eo()}function X(){null===I&&(I=window.setTimeout(()=>{I=null,Z()},0))}function Q(e){return e?1===e.nodeType?e:e.parentElement:null}function J(e){let t=Q(e);return!!t?.closest(`[data-loot-lock-button], #${m}`)}function ee(e){if(J(e.target)||function(e){let t,o;if("attributes"!==e.type||!e.attributeName)return!1;let r=Q(e.target);if(!r)return!1;let n=[...v.values()];if("tabindex"===e.attributeName)return n.some(e=>e.binding.controls.includes(r))&&"-1"===r.getAttribute("tabindex");if("aria-hidden"===e.attributeName)return n.some(e=>e.binding.contents.includes(r))&&"true"===r.getAttribute("aria-hidden");if("class"!==e.attributeName)return!1;let l=(t=new Set((e.oldValue??"").split(/\s+/u).filter(Boolean)),[...new Set([...t,...o=new Set((r.getAttribute("class")??"").split(/\s+/u).filter(Boolean))])].filter(e=>t.has(e)!==o.has(e)));if(1!==l.length)return!1;if("loot-object-lock-concealed"===l[0]){let e=n.some(e=>e.binding.contents.includes(r));return r.classList.contains(l[0])===e}if("loot-object-lock-target"===l[0]){let e=n.some(e=>"fill"===e.binding.mode&&e.binding.root===r);return r.classList.contains(l[0])===e}return!1}(e))return!1;if("childList"!==e.type)return!0;let t=[...Array.from(e.addedNodes),...Array.from(e.removedNodes)];return 0===t.length||t.some(e=>{if(!J(e))return!0;let t=Q(e),o=t?.closest("[data-loot-lock-button]");return!!o&&[...v.values()].some(e=>e.button===o)!==o.isConnected})}function et(e){e.some(ee)&&X()}function eo(){E.flatMap(e=>e.takeRecords()).some(ee)&&X()}function er(e){var t;let o=(t=e.target,t?.nodeType===1?t:t&&"number"==typeof t.nodeType?t.parentElement:null);if(o){for(let t of v.values())if([...t.binding.controls,...t.binding.contents].some(e=>e===o||e.contains(o))){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation();return}}}class en extends HTMLElement{static get observedAttributes(){return["data-lock-id","data-target","data-color"]}connectedCallback(){P(this),X()}attributeChangedCallback(){this.isConnected&&(P(this),X())}}function el(){Z()}function ei(e){if(L=e,"idle"===N&&(N="pending",(0,l.discoverCourseLocks)().then(({declarations:e,catalog:t})=>D(e,t)).catch(()=>D([],[]))),H(),customElements.get(u)||customElements.define(u,en),!R)for(let e of(R=!0,(0,s.templateDocumentCandidates)(document)))e.addEventListener("click",er,!0);if(0===E.length)for(let e of(0,s.templateDocumentCandidates)(document)){let t=new(e.defaultView?.MutationObserver??MutationObserver)(et);t.observe(e.documentElement,{attributeFilter:["aria-hidden","class","data-open","disabled","hidden","style","tabindex"],attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),E.push(t)}if(q||(q=!0,(0,c.observeLiaSlideActivity)(X)),!$){if($=!0,"ResizeObserver"in window)for(let e of(A=new ResizeObserver(X),v.values()))A.observe(e.binding.anchor);let e=new Set;for(let t of(0,s.templateDocumentCandidates)(document)){let o=t.defaultView;o&&!e.has(o)&&(e.add(o),o.addEventListener("resize",X,{passive:!0}),o.addEventListener("scroll",X,{capture:!0,passive:!0}),o.visualViewport?.addEventListener("resize",X,{passive:!0}),o.visualViewport?.addEventListener("scroll",X,{passive:!0})),t.addEventListener("load",X,!0),t.fonts?.ready.then(X)}}el()}},{"./course-chests.ts":"2ceW6","./lock-options.ts":"3c981","./lock-targets.ts":"1CWW8","./template-targets.ts":"9odGA","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1CWW8":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"GLOBAL_LOCK_TARGETS",()=>i),n.export(o,"LOCAL_LOCK_TARGETS",()=>a),n.export(o,"ITEM_LOCK_TARGETS",()=>s),n.export(o,"TEMPLATE_LOCK_TARGETS",()=>c),n.export(o,"resolveLockTarget",()=>h),n.export(o,"isGlobalLockTarget",()=>f),n.export(o,"isLocalLockTarget",()=>g),n.export(o,"isItemLockTarget",()=>b),n.export(o,"isTemplateLockTarget",()=>y);var l=e("./template-targets.ts");let i=["toc","mode","menu","translator","classroom","info","seitenwechsel"],a=["check","resolve","hint"],s=["portal"],c=l.TEMPLATE_TARGETS,u={toc:"toc",inhaltsverzeichnis:"toc",mode:"mode",darstellung:"mode",ansicht:"mode",menu:"menu",menue:"menu",einstellungen:"menu",settings:"menu",translator:"translator",translate:"translator",ubersetzer:"translator",uebersetzer:"translator",sprache:"translator",classroom:"classroom",klasse:"classroom",teilen:"classroom",share:"classroom",info:"info",information:"info",informationen:"info",seitenwechsel:"seitenwechsel",seitennavigation:"seitenwechsel",navigation:"seitenwechsel",pages:"seitenwechsel",page:"seitenwechsel",check:"check",prufen:"check",pruefen:"check",resolve:"resolve",auflosen:"resolve",aufloesen:"resolve",losung:"resolve",loesung:"resolve",solution:"resolve",hint:"hint",hinweis:"hint",portal:"portal",folienportal:"portal",slideportal:"portal"},d=new Set(i),m=new Set(a),p=new Set(s);function h(e){return e?u[e.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[\s_-]+/g,"")]??(0,l.resolveTemplateTarget)(e)??null:null}function f(e){return d.has(e)}function g(e){return m.has(e)}function b(e){return p.has(e)}function y(e){return(0,l.isTemplateTarget)(e)}},{"./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"9odGA":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"TEMPLATE_TARGETS",()=>l),n.export(o,"normalizeTemplateTarget",()=>a),n.export(o,"templateDocumentCandidates",()=>s),n.export(o,"TEMPLATE_TARGET_DEFINITIONS",()=>v),n.export(o,"TEMPLATE_TARGET_LABELS",()=>w),n.export(o,"resolveTemplateTarget",()=>_),n.export(o,"isTemplateTarget",()=>C),n.export(o,"templateTargetDefinition",()=>L),n.export(o,"templateTargetPresent",()=>E),n.export(o,"templateElementIsVisible",()=>A),n.export(o,"findTemplateTargets",()=>I),n.export(o,"findTemplateTarget",()=>T);let l=["dynflex","timer","boardmode","marker","markerquiz","annotation","canvasocr","kachel","mathpath","llm","coordinate","freeze"];function i(e){return e.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[\s_-]+/g,"")}function a(e){return i(e)}function s(e){let t=[],o=e=>{!e||"object"!=typeof e||"function"!=typeof e.querySelectorAll||t.includes(e)||t.push(e)};for(let t of(o(e),g(e)))try{o(t.document)}catch{}return t}function c(e,t){let o=[];for(let r of s(e))try{for(let e of r.querySelectorAll(t))o.includes(e)||o.push(e)}catch{}return o}function u(e,t){return{target:e,root:t,chestAnchor:t,lockAnchor:t,lockControls:[t],focusCandidates:[t]}}function d(e,t,o,r=t){return{target:e,root:t,chestAnchor:r,lockAnchor:o,lockControls:o?[o]:[],focusCandidates:o?[o,t]:[t]}}function m(e,t,o,r,n=t){return{target:e,root:t,chestAnchor:n,lockAnchor:o,lockControls:r,focusCandidates:[...r,t]}}function p(e,t){return{target:e,root:t,chestAnchor:t,lockAnchor:null,lockControls:[],focusCandidates:[t]}}function h(e){let t=new Set;return e.filter(e=>!t.has(e.root)&&(t.add(e.root),!0))}function f(e){let t=e.closest(".lia-quiz");if(t)return t;let o=e.closest("main.lia-slide__content");if(!o)return null;let r=e;for(;r.parentElement&&r.parentElement!==o;)r=r.parentElement;if(r.parentElement!==o)return null;let n=r.previousElementSibling;for(;n;){if(n.matches(".lia-quiz"))return n;let e=n.querySelectorAll(".lia-quiz");if(e.length>0)return e[e.length-1];n=n.previousElementSibling}return null}function g(e){let t=[],o=e=>{e&&"object"==typeof e&&(t.includes(e)||t.push(e))},r=e.defaultView;o(r);try{o(r?.parent)}catch{}try{o(r?.top)}catch{}return"u">typeof window&&o(window),t}function b(e,t){let o=e;for(let e of t.split(".")){if(!o||"object"!=typeof o&&"function"!=typeof o)return;try{o=o[e]}catch{return}}return o}let y=[{id:"dynflex",aliases:["lia-dynflex","flex","flexbereich"],importName:"lia-DynFlex",label:"DynFlex-Bereich",presenceGlobals:["__LIA_DYNFLEX_V1_0__"],runtimeSelector:"[data-dynflex-doc]",scope:"slide",locate:e=>c(e,".dynFlex").map(e=>u("dynflex",e))},{id:"timer",aliases:["lia-timer","quiztimer","zeit"],importName:"lia-timer",label:"Quiz-Timer",presenceGlobals:["__LIA_SOLUTION_TIMER_V0_0_1__"],runtimeSelector:"#__lia_solution_timer_css_v0_0_1__, .lia-sol-timer-badge[data-sol-timer-ui]",scope:"slide",locate:e=>{let t=c(e,"[data-solution-timer], [data-hint-timer]"),o=c(e,".lia-sol-timer-startbtn[data-sol-timer-ui='solution'], .lia-sol-timer-startbtn[data-sol-timer-ui='hint']"),r=t.map(e=>m("timer",e,null,[])),n=new Map;for(let e of o){let t=(e.matches(".lia-quiz")?e:e.closest(".lia-quiz"))??e.parentElement??e,o=n.get(t)??[];o.push(e),n.set(t,o)}for(let[e,t]of n){let o=m("timer",e,t[0]??null,t,t[0]??e);o.chestAvailable=!1,r.push(o)}return r}},{id:"boardmode",aliases:["lia-board-mode","board-modus","schriftgroesse","boardmodefontbutton","fontbutton"],importName:"lia-board-mode",label:"Board-Mode-Schriftsteuerung",presenceGlobals:["__LIA_TFF_REG_V2__"],runtimeSelector:"#lia-tff-btn-v2",scope:"global",locate:e=>{let t=c(e,"#lia-tff-panel-v2");return c(e,"#lia-tff-btn-v2").map(e=>{let o=t.find(t=>t.ownerDocument===e.ownerDocument),r=d("boardmode",e.parentElement??e,e,e);return r.chestAvailable=void 0!==o,o&&(r.chestContainer=o),r})}},{id:"marker",aliases:["lia-marker","textmarker","highlighter","textmarkerbutton","markerbutton"],importName:"lia-marker",label:"Textmarker-Werkzeug",presenceGlobals:["__LIA_TEXTMARKER_REG_V4__"],runtimeSelector:"#lia-hl-btn",scope:"global",locate:e=>{let t=c(e,"#lia-hl-panel > .body");return c(e,"#lia-hl-btn").map(e=>{let o=t.find(t=>t.ownerDocument===e.ownerDocument),r=d("marker",e.parentElement??e,e,e);return r.chestAvailable=void 0!==o,o&&(r.chestContainer=o),r})}},{id:"markerquiz",aliases:["textmarkerquiz","marker-quiz","highlightquiz"],importName:"lia-marker",label:"Textmarker-Quiz",presenceGlobals:["__LIA_TEXTMARKER_REG_V4__"],runtimeSelector:".hlq-proxy",scope:"slide",locate:e=>h(c(e,".hlq-proxy").map(e=>e.closest(".markerquiz")??e).map(e=>u("markerquiz",e)))},{id:"annotation",aliases:["lia-annotation","annotieren","zeichenleiste","annotationsbar","annotationbar"],importName:"lia-annotation",label:"Anmerkungs-Werkzeugleiste",presenceGlobals:["__LIA_ANNOTATION__"],runtimeSelector:".lia-annot-toolbar",scope:"global",locate:e=>c(e,".lia-annot-toolbar").map(e=>{let t=e.querySelector("button[data-act='toggle']");return{target:"annotation",root:e,chestAnchor:e,chestAvailable:t?.getAttribute("aria-pressed")==="false"||t?.getAttribute("data-active")==="0",chestPosition:"below",lockAnchor:e,lockControls:[e],focusCandidates:t?[t,e]:[e]}})},{id:"canvasocr",aliases:["lia-canvas-ocr","canvas-ocr","zeichenflaeche"],importName:"lia-canvas-ocr",label:"Canvas-/OCR-Zeichenfläche",presenceGlobals:["__LIA_CANVAS_OCR__"],runtimeSelector:".lia-canvas-pair",scope:"slide",locate:e=>c(e,".lia-canvas-pair").map(e=>{let t=e.querySelector(".lia-canvas-mount"),o=t?.querySelector("canvas.lia-draw")??null,r=e.querySelector(".lia-canvas-launch");return{target:"canvasocr",root:e,chestAnchor:o??t??e,chestAvailable:t?.getAttribute("data-open")==="1"&&null!==o,lockAnchor:e,lockControls:[e],focusCandidates:r?[r,e]:[e]}})},{id:"kachel",aliases:["lia-kachel","kachelfolge","tiles"],importName:"lia-kachel",label:"Kachelaufgabe",presenceGlobals:["LiaKachel.kachelfolge"],runtimeSelector:"[data-lia-kachelfolge]",scope:"slide",locate:e=>c(e,"[data-lia-kachelfolge], div.Kachel").filter(e=>e.hasAttribute("data-lia-kachelfolge")||!e.querySelector("[data-lia-kachelfolge]")).map(e=>u("kachel",e))},{id:"mathpath",aliases:["lia-mathpath","erklaerpfad","explain"],importName:"lia-mathpath",label:"MathPath-Erklärquiz",presenceGlobals:["__LIA_MATHPATH__"],runtimeSelector:".lia-quiz[data-lia-explain-enabled='1'], .lia-quiz[data-hint-button='1'][data-adetail-tags], .lia-mathpath-explain-list",scope:"slide",locate:e=>h(c(e,".lia-quiz[data-lia-explain-enabled='1'], .lia-quiz[data-hint-button='1'][data-adetail-tags], .lia-mathpath-explain-list").map(e=>e.matches(".lia-quiz")?e:e.closest(".lia-quiz")??e).map(e=>{let t=[...e.querySelectorAll("a.lia-mathpath-explain-link[data-lia-explain-href]")].filter(A);return m("mathpath",e,t[0]??null,t)}))},{id:"llm",aliases:["lia-llm","llmquiz","kiquiz"],importName:"lia-llm",label:"LLM-Quiz",presenceGlobals:["LiaLLM.version"],runtimeSelector:"lia-llm-quiz-use, lia-llm-feedback[id^='lia-llm-feedback-']",scope:"slide",locate:e=>h(c(e,"lia-llm-quiz-use, lia-llm-feedback[id^='lia-llm-feedback-']").map(f).filter(e=>null!==e).map(e=>u("llm",e)))},{id:"coordinate",aliases:["lia-coordinate","koordinaten","koordinatensystem"],importName:"lia-coordinate",label:"Koordinatensystem",presenceGlobals:["__coord"],scope:"slide",locate:e=>(function(e){let t=s(e),o=[];for(let r of g(e)){let e=b(r,"__boards");if(e&&"object"==typeof e)for(let r of Object.values(e)){if(!r||"object"!=typeof r)continue;let e=r.containerObj;e&&"object"==typeof e&&(1!==e.nodeType||"function"!=typeof e.matches||!e.matches(".jxgbox")||!t.includes(e.ownerDocument)||o.includes(e)||o.push(e))}}return o})(e).map(e=>u("coordinate",e))},{id:"freeze",aliases:["lia-freeze-v2","abgabe","submission"],importName:"lia-freeze-v2",label:"Freeze-Abgabe",presenceGlobals:[],runtimeSelector:"#lia-submission-runtime-style",scope:"slide",locate:e=>h(c(e,".lia-submit-box, #lia-exam-overlay > .lia-exam-intro-virtual-slide, .lia-adetails-points, #lia-freeze-bar, #lia-eval-placeholder").map(e=>{if(e.matches("#lia-eval-placeholder"))return p("freeze",e);let t=[...e.querySelectorAll("button, input, textarea, select, a[href], [tabindex]")];return 0===t.length?p("freeze",e):m("freeze",e,e,[...new Set(t)])}))}],v=y,w=Object.fromEntries(y.map(e=>[e.id,e.label])),x=new Map(y.map(e=>[e.id,e])),k=new Set(l),S=new Map;for(let e of y)for(let t of[e.id,...e.aliases]){let o=i(t),r=S.get(o);if(r&&r!==e.id)throw Error(`Loot: Template-Zielalias ${t} kollidiert zwischen ${r} und ${e.id}.`);S.set(o,e.id)}function _(e){return e?S.get(i(e))??null:null}function C(e){return k.has(e)}function L(e){return x.get(e)}function E(e,t=document){let o=L(e),r=o.presenceGlobals.length>0||void 0!==o.customElement;for(let e of g(t))if(o.presenceGlobals.some(t=>void 0!==b(e,t))||o.customElement&&function(e,t){try{return!!e.customElements?.get(t)}catch{return!1}}(e,o.customElement))return!0;return!r&&!!o.runtimeSelector&&c(t,o.runtimeSelector).length>0}function A(e){if(!1===e.isConnected||e.hasAttribute?.("hidden")||e.getAttribute?.("aria-hidden")==="true"||e.closest?.("[hidden], [aria-hidden='true']"))return!1;let t=e.ownerDocument?.defaultView;if(t?.getComputedStyle)try{let o=e;for(;o;){let e=t.getComputedStyle(o);if("none"===e.display||"hidden"===e.visibility||"collapse"===e.visibility||0===Number(e.opacity))return!1;o=o.parentElement}}catch{}if("function"==typeof e.getClientRects)try{return e.getClientRects().length>0}catch{return!1}return!0}function I(e,t,o=document){if(!E(e,o))return[];let r=L(e).locate(o),n=[];for(let e of r)if(A(e.root)){if("chest"===t){if(!1===e.chestAvailable)continue;A(e.chestAnchor)&&n.push(e);continue}e.lockAnchor&&e.lockControls.length>0&&A(e.lockAnchor)&&n.push(e)}return n}function T(e,t,o=document){return I(e,t,o)[0]??null}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],cCRZG:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"showHighscore",()=>m),n.export(o,"hideHighscore",()=>p);var l=e("./score"),i=e("./style");let a="lia-loot-highscore-dialog",s="http://www.w3.org/2000/svg",c={gold:{fill:"#D4AF37",stroke:"#725A00",label:"Goldene Trophäe"},silver:{fill:"#A7A9AC",stroke:"#55585C",label:"Silberne Trophäe"},copper:{fill:"#B87333",stroke:"#6A3517",label:"Kupferfarbene Trophäe"}};function u(e){"function"==typeof e.close&&e.open?e.close():e.removeAttribute("open")}function d(e){return e?.tagName==="DIALOG"?e:null}function m(e,t){let o,r,n,m;(0,i.injectStyles)();let p=function(){let e=d(document.getElementById(a));if(e)return e;let t=document.createElement("dialog");t.id=a,t.className="loot-highscore-dialog";let o=document.createElement("div");o.className="loot-highscore-card",o.setAttribute("data-loot-highscore-content","");let r=document.createElement("button");return r.type="button",r.className="loot-highscore-close",r.setAttribute("aria-label","Highscore schließen"),r.textContent="×",r.addEventListener("click",()=>u(t)),t.addEventListener("click",e=>{e.target===t&&u(t)}),o.appendChild(r),t.appendChild(o),document.body.appendChild(t),t}(),h=p.querySelector("[data-loot-highscore-content]");if(!h)return;h.querySelectorAll(".loot-highscore-trophy, .loot-highscore-points").forEach(e=>e.remove());let f=(0,l.trophyTier)(e,t);f&&h.appendChild((o=c[f],(r=document.createElementNS(s,"svg")).setAttribute("viewBox","0 0 64 64"),r.setAttribute("class","loot-highscore-trophy"),r.setAttribute("role","img"),r.setAttribute("aria-label",o.label),(n=document.createElementNS(s,"path")).setAttribute("d","M18 8h28v10c0 11.5-5.8 20.6-14 23.4V48h10v7H22v-7h10v-6.6C23.8 38.6 18 29.5 18 18V8Z"),n.setAttribute("fill",o.fill),n.setAttribute("stroke",o.stroke),n.setAttribute("stroke-width","2.5"),n.setAttribute("stroke-linejoin","round"),(m=document.createElementNS(s,"path")).setAttribute("d","M18 13H9v5c0 8.8 4.8 14.4 13 16M46 13h9v5c0 8.8-4.8 14.4-13 16"),m.setAttribute("fill","none"),m.setAttribute("stroke",o.stroke),m.setAttribute("stroke-width","4"),m.setAttribute("stroke-linecap","round"),m.setAttribute("stroke-linejoin","round"),r.append(m,n),r));let g=document.createElement("p");g.id="lia-loot-highscore-points",g.className="loot-highscore-points",g.textContent=`${(0,l.formatScore)(e)} Punkte`,h.appendChild(g),p.setAttribute("aria-labelledby",g.id),"function"==typeof p.showModal?p.open||p.showModal():(p.setAttribute("open",""),p.setAttribute("role","dialog"),p.setAttribute("aria-modal","true")),h.querySelector(".loot-highscore-close")?.focus()}function p(){let e=d(document.getElementById(a));e&&u(e)}},{"./score":"abltm","./style":"3Vffy","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"3Vffy":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"injectStyles",()=>s);var l=e("./template-targets.ts");let i="lia-loot-highscore-style",a=`
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

html.loot-magnifier-active body {
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

html.loot-magnifier-active.loot-magnifier-pointing
  .loot-magnifier-secret--under-lens
  .loot-magnifier-secret__content {
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
  .loot-magnifier-pickup { animation: none; }
  .loot-magnifier-pickup--collected { opacity: 0; }
  .loot-slide-portal { animation: none; }
  .loot-slide-portal__spark { animation: none; }
  .loot-magnifier-secret--dust::after { animation: none; }
  .loot-object-lock-button--missing { animation: none; }
  .loot-object-lock-button--unlocking { opacity: 0; animation: none; }
  .loot-object-lock-button--unlocking .loot-object-lock-shackle-outline,
  .loot-object-lock-button--unlocking .loot-object-lock-shackle { animation: none; }
}
`;function s(e=document){for(let t of(0,l.templateDocumentCandidates)(e)){if(t.getElementById(i))continue;let e=t.createElement("style");e.id=i,e.textContent=a,t.head?.appendChild(e)}}},{"./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1ZNl4":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"isScoreableQuiz",()=>s),n.export(o,"lastScoreableQuiz",()=>m),n.export(o,"allRenderedCourseQuizzesSolved",()=>p),n.export(o,"isLastCourseQuiz",()=>h),n.export(o,"installQuizEventTracking",()=>g);let l=".lia-quiz__check",i=".lia-quiz",a=".lia-quiz__resolve";function s(e){return!!(e.querySelector(l)&&e.querySelector(a))}function c(e){e.preventDefault(),e.stopImmediatePropagation()}function u(e){let t=(e.querySelector(l)?.textContent?.trim()??"").match(/(?:^|\s)(\d+)\s*$/);return t?Number.parseInt(t[1],10):0}function d(e){return e.querySelectorAll(".lia-quiz__hints > li").length}function m(e){for(let t=e.length-1;t>=0;t-=1){let o=e[t];if(s(o))return o}return null}function p(e){let t=Array.from(e.querySelectorAll(i)).filter(s);return t.length>0&&t.every(e=>e.classList.contains("solved"))&&t.some(h)}function h(e){let t=e.closest("main.lia-slide__content"),o=t?.parentElement;if(!t||!o)return!1;let r=Array.from(o.children).filter(e=>"MAIN"===e.tagName);return r[r.length-1]===t&&m(Array.from(t.querySelectorAll(i)))===e}function f(e,t,o,r,n=3e4){let l,i=!1,a=0,s=()=>{l.disconnect(),window.clearTimeout(a)},c=()=>{i||(i=!0,s(),r())},u=()=>{if(i)return;if(!e.isConnected)return void c();let r=t();null!==r&&(i||(i=!0,s(),o(r)))};(l=new MutationObserver(u)).observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0}),a=window.setTimeout(c,n),window.setTimeout(u,0)}function g(e){let t=new WeakSet,o=new WeakSet;document.addEventListener("click",r=>{var n;let s=(n=r.target)instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s)return;let m=s.closest(l);if(m&&!m.disabled){let o=m.closest(i);if(!o||!o.classList.contains("open")||!o.querySelector(a))return;if(t.has(o)||!e.useCheck())return void c(r);if(!e.active())return;t.add(o);let n=u(o),l=()=>{t.delete(o)};return void f(o,()=>{let e=u(o);return o.classList.contains("solved")?"solved":e>n?"failed":null},t=>{l(),"failed"===t?e.failed():(e.solved(o),h(o)&&e.courseCompleted())},l)}let p=s.closest(".lia-quiz__hint");if(p&&!p.disabled){let t=p.closest(i);if(!t||!t.classList.contains("open"))return;if(o.has(t)||!e.useHint())return void c(r);if(!e.active())return;o.add(t);let n=d(t),l=()=>{o.delete(t)};return void f(t,()=>{let e=d(t)-n;return e>0?e:null},t=>{l(),e.hint(t)},l)}let g=s.closest(a);if(g&&!g.disabled){let t=g.closest(i);if(!t||!t.classList.contains("open"))return;e.useResolve()||c(r)}},!0)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1O7ju":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"ResourceStore",()=>s);var l=e("./storage.ts");function i(e,t){if(!Number.isFinite(e)||e<0)throw TypeError(`${t} muss eine nichtnegative Zahl sein.`);return Math.floor(e)}function a(e){return{...e,collectedChests:[...e.collectedChests]}}class s{configure(e,t,o){let r=i(e,"Gold"),n=i(t,"Diamanten"),s=void 0===o?null:i(o,"Energie");return this.current&&this.current.initialGold===r&&this.current.initialDiamonds===n&&this.current.initialEnergy===s||(this.current={version:1,initialGold:r,initialDiamonds:n,initialEnergy:s,gold:r,diamonds:n,energy:s,collectedChests:[]},(0,l.saveResources)(this.current)),this.enabled=!0,a(this.current)}spend(e){if(!this.enabled||!this.current)return!0;if("energy"===e){if(null===this.current.energy)return!0;if(this.current.energy<=0)return!1;this.current.energy-=1}else{if(this.current[e]<=0)return!1;this.current[e]-=1}return(0,l.saveResources)(this.current),!0}collectChest(e,t="gold"){let o=e.trim();if(!o||!this.enabled||!this.current||this.current.collectedChests.includes(o))return!1;if("energy"===t){if(null===this.current.energy)return!1;this.current.energy+=1}else this.current[t]+=1;return this.current.collectedChests.push(o),(0,l.saveResources)(this.current),!0}isChestCollected(e){return!!this.current?.collectedChests.includes(e.trim())}state(){return this.enabled&&this.current?a(this.current):null}constructor(){this.current=(0,l.loadResources)(),this.enabled=!1}}},{"./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"7fPSc":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"normalizeSecretTitle",()=>j),n.export(o,"nextPublicSection",()=>M),n.export(o,"publicFallbackSection",()=>N),n.export(o,"permitPortalSlideNavigation",()=>et),n.export(o,"installSecretSlides",()=>eu);var l=e("./course-chests.ts"),i=e("./course-identity.ts"),a=e("./slide-activity.ts"),s=e("./slide-navigation.ts");let c="lia-loot-secret-slide",u="lia-input-search",d="lia-loot-secret-slide-status",m="loot-secret-slide-link",p="lia-loot-secret-slide-permit:v1",h=new Set,f=new Map,g=null,b=null,y=null,v=null,w=null,x=!1,k="pending",S=!1,_=!1,C=null,L=null,E=null,A=null,I=null,T=null;function j(e){return e.normalize("NFKC").replace(/\s+/gu," ").trim().toLocaleLowerCase("de-DE")}function M(e,t,o,r){for(let n=o+r;n>=0&&n<t;n+=r)if(!e.has(n))return n;return null}function N(e,t,o,r){let n=null===r?-1:o>r?1:-1;return M(e,t,o,n)??M(e,t,o,1===n?-1:1)}function R(){return(0,i.liaCourseIdentity)()}function q(){try{window.sessionStorage.removeItem(p)}catch{}}function $(e){C=e;let t={course:R(),expiresAt:Date.now()+15e3,section:e};try{window.sessionStorage.setItem(p,JSON.stringify(t))}catch{}}function z(){let e=document.getElementById(d);if(e)return e;let t=document.createElement("div");return t.id=d,t.className="loot-secret-slide-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function O(e){let t=z();t.classList.remove("loot-secret-slide-status--visible"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.textContent="",window.setTimeout(()=>{t.textContent=e},0)}function P(e,t=!1){let o=z();o.classList.add("loot-secret-slide-status--visible"),o.setAttribute("role",t?"alert":"status"),o.setAttribute("aria-live",t?"assertive":"polite"),o.textContent=e}function K(){let e="complete"!==k||_?function(){let e=["main.lia-slide__content:not([hidden])",".lia-pagination",".loot-object-lock-button--local"];"complete"!==k&&e.push("#lia-toc .lia-toc__content");let t=new Set;for(let o of e)document.querySelectorAll(o).forEach(e=>{t.add(e)});return t}():new Set;for(let[o,r]of[...f])if(!e.has(o)){var t;o.inert=r.inert,"true"===o.getAttribute("aria-hidden")&&(null===(t=r.ariaHidden)?o.removeAttribute("aria-hidden"):o.setAttribute("aria-hidden",t)),"none"===o.style.pointerEvents&&(o.style.pointerEvents=r.pointerEvents),"hidden"===o.style.visibility&&(o.style.visibility=r.visibility),f.delete(o)}for(let t of e)f.has(t)||f.set(t,{ariaHidden:t.getAttribute("aria-hidden"),inert:t.inert,pointerEvents:t.style.pointerEvents,visibility:t.style.visibility}),t.inert=!0,t.setAttribute("aria-hidden","true"),t.style.pointerEvents="none",t.style.visibility="hidden";let o=document.activeElement;o instanceof HTMLElement&&[...e].some(e=>e===o||e.contains(o))&&o.blur()}function D(e){let t=e.getAttribute("href")??"",o=t;try{o=new URL(t,window.location.href).hash}catch{}let r=/^#(\d+)$/.exec(o);if(!r)return null;let n=Number(r[1])-1;return Number.isInteger(n)&&n>=0?n:null}function H(){return[...document.querySelectorAll("#lia-toc .lia-toc__content > a.lia-toc__link[href*='#']")]}function F(){return(0,a.activeLiaSection)()}function G(){let e=document.getElementById(u);return e instanceof HTMLInputElement?j(e.value):""}function V(e){return j(e.textContent??"")}function B(){let e=G();return e?H().filter(t=>{let o=D(t);return null!==o&&h.has(o)&&V(t)===e}):[]}function U(){let e=document.documentElement;e.classList.toggle("loot-secret-slide-discovering","complete"!==k),e.classList.toggle("loot-secret-slide-discovery-failed","failed"===k),e.classList.toggle("loot-secret-slide-blocked",_),b?.takeRecords()}function Y(e){_=e,U(),K(),(0,a.refreshLiaSlideActivity)()}function W(e){return"complete"===k&&(null===e||!h.has(e)||L===e)}function Z(){v=null;let{totalSections:e}=function(){let e=H(),t=G(),o=-1;for(let r of e){let e=D(r);if(null===e)continue;o=Math.max(o,e);let n=h.has(e),l=n&&""!==t&&V(r)===t;r.classList.toggle(m,n),r.classList.toggle("loot-secret-slide-link--found",l),n?r.dataset.lootSecretSection=String(e):delete r.dataset.lootSecretSection}return{links:e,totalSections:o+1}}();if("pending"===k&&S&&e>0&&null!==F()&&(k="complete"),!function(e){if("complete"!==k)return K();let t=F();if(null===t||e<=0)return Y(!1);if(!h.has(t)){E=t,L=null,A=null,Y(!1);return}if(L===t)return Y(!1);if(C===t){C=null,L=t,E=t,A=null,q(),Y(!1),T?.found(t),O("Geheimfolie geöffnet.");return}let o=N(h,e,t,E);if(null===o){console.warn("Loot: Der Kurs enthält keine öffentliche Folie; die Geheimfolie bleibt erreichbar."),L=t,E=t,Y(!1);return}Y(!0),A!==t&&(A=t,(0,s.navigateToLiaSection)(o,"replace"))}(e),"complete"===k){let e;U(),null!==w&&(window.clearTimeout(w),w=null),(e=z()).classList.remove("loot-secret-slide-status--visible"),e.textContent=""}K(),g?.takeRecords()}function X(){null===v&&(v=window.setTimeout(Z,0))}function Q(e){let t=D(e);if(null===t||!h.has(t))return!1;let o=B();return 1!==o.length||o[0]!==e?(O(o.length>1?"Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien.":"Gib zuerst den vollständigen Namen der Geheimfolie in die Suche ein."),!1):(F()===t&&L===t?(C=null,q()):$(t),!0)}function J(e){var t;let o=(t=e.target)instanceof Element?t:t instanceof Node?t.parentElement:null,r=o?.closest(`a.${m}`);!r||Q(r)||(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation())}function ee(e){let t="ArrowLeft"===e.key||"ArrowRight"===e.key||e.altKey&&e.shiftKey&&["n","p"].includes(e.key.toLocaleLowerCase("en-US"));if("complete"!==k&&t){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation();return}if("Enter"!==e.key||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||!(e.target instanceof HTMLInputElement)||e.target.id!==u)return;let o=B();if(0===o.length)return;if(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),o.length>1)return void O("Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien.");let r=D(o[0]);null!==r&&Q(o[0])&&(0,s.navigateToLiaSection)(r,"push")}function et(e){return"complete"===k&&!!Number.isInteger(e)&&!(e<0)&&(h.has(e)&&$(e),!0)}function eo(e){if("complete"===k){I=null;return}if(e instanceof MouseEvent){I={kind:"mouse",startedAt:Date.now(),x:e.pageX,y:e.pageY};return}let t=e.changedTouches[0];t&&(I={kind:"touch",startedAt:Date.now(),x:t.pageX,y:t.pageY})}function er(e){let t=I;if(I=null,!t||"complete"===k)return;if(e instanceof MouseEvent){if("mouse"!==t.kind)return}else if("touch"!==t.kind)return;let o=e instanceof MouseEvent?e:e.changedTouches[0];if(!o)return;let r=o.pageX-t.x,n=o.pageY-t.y;Date.now()-t.startedAt<=300&&Math.abs(r)>=150&&100>=Math.abs(n)&&(e.cancelable&&e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation())}function en(){I=null}function el(e){for(let t of e)t.section>=0&&h.add(t.section);S=!0,Z()}function ei(e){k="failed",U(),P("Geheimfolien konnten nicht sicher geladen werden. Bitte prüfe die Kursquelle und lade den Kurs neu.",!0),K(),(0,a.refreshLiaSlideActivity)(),console.error("Loot: Geheimfolien-Initialisierung fehlgeschlagen.",e)}function ea(){let e=document.getElementById("lia-toc");e===y||(g?.disconnect(),y=e,e&&((g=new MutationObserver(X)).observe(e,{attributeFilter:["class","href","id"],attributes:!0,childList:!0,subtree:!0}),X()))}function es(e){if(!(e instanceof Element))return!1;let t="main.lia-slide__content, .lia-pagination, .loot-object-lock-button--local, #lia-toc .lia-toc__content";return e.matches(t)||null!==e.querySelector(t)}function ec(e){document.getElementById("lia-toc")!==y&&ea(),("complete"!==k||_)&&e.some(e=>[...e.addedNodes].some(es))&&X()}function eu(e){if(e&&(T=e),!x){if(x=!0,(0,a.setLiaSlideAccessGuard)(W),(b=new MutationObserver(U)).observe(document.documentElement,{attributeFilter:["class"],attributes:!0}),U(),C=function(){try{let e=window.sessionStorage.getItem(p);if(!e)return null;let t=JSON.parse(e);if(t.course!==R()||!Number.isInteger(t.section)||t.section<0||"number"!=typeof t.expiresAt||t.expiresAt<Date.now())return q(),null;return t.section}catch{return q(),null}}(),z(),w=window.setTimeout(()=>{w=null,"pending"===k&&P("Kursnavigation wird vorbereitet …")},250),!customElements.get(c)){class e extends HTMLElement{connectedCallback(){let e;this.hidden=!0,this.setAttribute("aria-hidden","true"),null!==(e=function(e){let t=e.getAttribute("data-secret-id")??"",o=(0,a.sectionFromLootId)(t);if(null!==o)return o;let r=e.closest("main"),n=r?.parentElement;if(!r||!n)return null;let l=[...n.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(r);return l>=0?l:null}(this))&&h.add(e),X()}}customElements.define(c,e)}document.addEventListener("click",J,!0),document.addEventListener("keydown",ee,!0),document.addEventListener("input",X),document.addEventListener("touchstart",eo,{capture:!0,passive:!0}),document.addEventListener("touchend",er,{capture:!0,passive:!1}),document.addEventListener("touchcancel",en,!0),document.addEventListener("mousedown",eo,!0),document.addEventListener("mouseup",er,!0),window.addEventListener("blur",en),window.addEventListener("hashchange",X),ea(),new MutationObserver(ec).observe(document.documentElement,{childList:!0,subtree:!0}),(0,l.requireCourseSecretSlideDeclarations)().then(el).catch(ei),X()}}},{"./course-chests.ts":"2ceW6","./course-identity.ts":"g3iqo","./slide-activity.ts":"5qduG","./slide-navigation.ts":"l5CPd","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],l5CPd:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(e){if(!Number.isInteger(e)||e<0)throw RangeError("Eine LiaScript-Folie muss eine nichtnegative Section besitzen.");return`#${e+1}`}function i(e,t="push"){let o=l(e);if("push"===t){window.location.hash=o;return}try{window.location.replace(o)}catch{window.location.hash=o}}n.defineInteropFlag(o),n.export(o,"liaSlideHash",()=>l),n.export(o,"navigateToLiaSection",()=>i)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8aUxA":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"installSlidePortals",()=>K);var l=e("./portal-visual.ts"),i=e("./secret-slides.ts"),a=e("./slide-navigation.ts"),s=e("./slide-portal-options.ts"),c=e("./slide-portal-route.ts"),u=e("./slide-activity.ts");let d="lia-loot-slide-portal",m="lia-loot-slide-portal-status",p="[data-loot-slide-portal-return]",h=!1,f=0,g=!1,b=null,y=null,v=null,w=0,x=null,k=new Set;function S(){let e=document.getElementById(m);if(e)return e;let t=document.createElement("div");return t.id=m,t.className="loot-slide-portal-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function _(e){let t=S();t.textContent="",window.setTimeout(()=>{t.textContent=e},0)}function C(e){let t=e.getAttribute("data-portal-id")?.trim();if(t&&!t.startsWith("@"))return`slide-portal:${t}`;let o=e.dataset.lootSlidePortalRuntimeId;if(o)return o;f+=1;let r=`slide-portal:runtime-${f}`;return e.dataset.lootSlidePortalRuntimeId=r,r}function L(e){let t,o=C(e),r=(0,s.parseSlidePortalOptions)(e.getAttribute("data-options")?.trim()??"","one-way"===e.getAttribute("data-default-mode")?"one-way":"two-way"),n=function(e,t){let o=(0,u.sectionFromLootId)(t);if(null!==o)return o;let r=e.closest("main.lia-slide__content"),n=r?.parentElement;if(!r||!n)return null;let l=[...n.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(r);return l>=0?l:null}(e,o),l=r.valid&&null===n?"pending":r.valid?(0,s.validateSlidePortalTarget)(r.targetSection,n,(t=-1,document.querySelectorAll(".lia-slide__container").forEach(e=>{let o=[...e.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).length;t=Math.max(t,o-1)}),document.querySelectorAll("#lia-toc a[href*='#']").forEach(e=>{let o=function(e){let t=e;try{t=new URL(e,window.location.href).hash}catch{}let o=/^#(\d+)$/.exec(t);if(!o)return null;let r=Number(o[1])-1;return Number.isInteger(r)&&r>=0?r:null}(e.getAttribute("href")??e.href);null!==o&&(t=Math.max(t,o))}),t>=0?t+1:null)):"missing";return{...r,portalId:o,sourceSection:n,status:l}}function E(e){return e.errors.length>0?e.errors.join(" "):"same-slide"===e.status?"Quelle und Ziel eines Portals müssen verschiedene Folien sein.":"missing"===e.status?`Die Zielfolie ${e.targetSlide??"?"} existiert nicht.`:"Die Kursfolien werden noch vorbereitet."}function A(e){let t,o,r,n=L(e),s=[n.mode,n.targetSlide??"",n.status,n.errors.join("|")].join(":");if(e.dataset.lootSlidePortalSignature===s&&e.querySelector("[data-loot-slide-portal-button]"))return;"pending"!==n.status&&(!n.valid||"valid"!==n.status)&&("pending"===n.status||k.has(n.portalId)||(k.add(n.portalId),console.warn(`Loot: Portal ${n.portalId} ist defekt. ${E(n)}`))),e.dataset.lootSlidePortalSignature=s;let c=((t=document.createElement("button")).type="button",t.className=`loot-slide-portal loot-slide-portal--${n.mode}`,t.dataset.lootSlidePortalButton=n.portalId,t.dataset.lootSlidePortalMode=n.mode,t.dataset.lootSlidePortalTarget=String(n.targetSlide??""),t.setAttribute("aria-label",function(e){if("pending"===e.status)return"Portal wird vorbereitet";if(!e.valid||"valid"!==e.status)return`Defektes Portal. ${E(e)}`;let t="one-way"===e.mode?"Einwegportal":"Zweiwegportal";return`${t} zu Folie ${e.targetSlide} \xf6ffnen`}(n)),t.disabled=o=!n.valid||"valid"!==n.status,o&&(t.classList.add("pending"===n.status?"loot-slide-portal--pending":"loot-slide-portal--broken"),t.title=E(n)),t.append((0,l.createPortalGraphic)(n.mode)),(r=document.createElement("span")).className="loot-slide-portal__number",r.setAttribute("aria-hidden","true"),r.textContent="pending"===n.status?"…":String(n.targetSlide??"?"),t.append(r),t.addEventListener("click",()=>(function(e){let t=[...document.querySelectorAll(d)].find(t=>C(t)===e);if(!t)return;let o=L(t);if(!o.valid||"valid"!==o.status||null===o.targetSection||null===o.sourceSection)return void _(E(o));if("one-way"===o.mode){var r;M(),r=o.targetSection,((0,i.permitPortalSlideNavigation)(r)?((0,a.navigateToLiaSection)(r,"replace"),$(r),O(),0):(_("Das Portal wartet, bis die Kursnavigation vorbereitet ist."),1))||_(`Einwegportal zu Folie ${o.targetSlide} ge\xf6ffnet.`);return}let n={expiresAt:Date.now()+144e5,phase:"pending",portalId:o.portalId,sourceSection:o.sourceSection,targetSection:o.targetSection,version:1};(0,i.permitPortalSlideNavigation)(o.targetSection)?(N(n),(0,a.navigateToLiaSection)(o.targetSection,"push"),$(o.targetSection),_(`Portal zu Folie ${o.targetSlide} ge\xf6ffnet.`),O()):_("Das Portal wartet, bis die Kursnavigation vorbereitet ist.")})(n.portalId)),t);if("pending"!==n.status&&(!n.valid||"valid"!==n.status)){let t=document.createElement("span");t.id=`lia-loot-slide-portal-problem-${n.portalId.replace(/[^a-zA-Z0-9_-]/gu,"-")}`,t.className="loot-slide-portal__problem",t.setAttribute("role","note"),t.textContent=`Defektes Portal: ${E(n)}`,c.setAttribute("aria-describedby",t.id),e.replaceChildren(c,t);return}e.replaceChildren(c)}function I(e){let t=[];for(let o of document.querySelectorAll(".lia-slide__container")){let r=[...o.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName);r[e]&&t.push(r[e])}return t.find(e=>!e.hidden)??t[0]??null}function T(e){document.querySelectorAll(p).forEach(t=>{e&&t.dataset.lootSlidePortalReturn===e||t.remove()})}function j(e){return`${e.portalId}:${e.sourceSection}:${e.targetSection}`}function M(){y=null,(0,c.clearSlidePortalRoute)(),T(),b?.takeRecords()}function N(e){y=e,(0,c.saveSlidePortalRoute)(e)}function R(){null!==v&&window.clearTimeout(v),v=null,w=0,x=null}function q(){v=null;let e=x;if(null===e)return;let t=I(e);if((0,u.activeLiaSection)()===e&&t&&!t.hidden){let e=t.querySelector("h1, h2, h3, h4, h5, h6")??t;e.hasAttribute("tabindex")||(e.setAttribute("tabindex","-1"),e.dataset.lootSlidePortalFocus="true"),e.focus({preventScroll:!0}),R();return}Date.now()>=w?R():v=window.setTimeout(q,50)}function $(e){null!==v&&window.clearTimeout(v),x=e,w=Date.now()+2e3,v=window.setTimeout(q,0)}function z(){g=!1,document.querySelectorAll(d).forEach(A),function(){var e;let t,o,r,n;if(!y)return T();if(y.expiresAt<=Date.now())return M();let s=(0,c.transitionSlidePortalRoute)(y,(0,u.activeLiaSection)());if(!s.route)return M();if(s.route.phase!==y.phase?N(s.route):y=s.route,!s.showReturn)return T();let d=j(s.route);if(T(d),[...document.querySelectorAll(p)].find(e=>e.dataset.lootSlidePortalReturn===d))return;let m=I(s.route.targetSection);m?.append((e=s.route,(t=document.createElement("aside")).className="loot-slide-portal-return",t.dataset.lootSlidePortalReturn=j(e),t.setAttribute("aria-label","Portal-Rückweg"),(o=document.createElement("span")).className="loot-slide-portal-return__label",o.textContent=`R\xfcckportal zu Folie ${e.sourceSection+1}`,(r=document.createElement("button")).type="button",r.className="loot-slide-portal loot-slide-portal--return",r.dataset.lootSlidePortalReturnButton=j(e),r.setAttribute("aria-label",`R\xfcckportal zu Folie ${e.sourceSection+1} \xf6ffnen`),r.append((0,l.createPortalGraphic)("two-way",!0)),(n=document.createElement("span")).className="loot-slide-portal__number",n.setAttribute("aria-hidden","true"),n.textContent=String(e.sourceSection+1),r.append(n),r.addEventListener("click",()=>{let t=e.sourceSection;(0,i.permitPortalSlideNavigation)(t)?(M(),(0,a.navigateToLiaSection)(t,"push"),$(t),_(`R\xfcckportal zu Folie ${t+1} ge\xf6ffnet.`)):_("Das Rückportal wartet, bis die Kursnavigation vorbereitet ist.")}),t.append(r,o),t))}(),null!==x&&null===v&&q(),b?.takeRecords()}function O(){g||(g=!0,window.setTimeout(z,0))}function P(e){let t=`${d}, ${p}, .lia-slide__container, main.lia-slide__content, #lia-toc, #lia-toc a[href*="#"]`;return e instanceof Element&&(e.matches(t)||null!==e.querySelector(t))}function K(){if(!h){if(h=!0,y=(0,c.loadSlidePortalRoute)(),S(),!customElements.get(d)){class e extends HTMLElement{static get observedAttributes(){return["data-portal-id","data-options","data-default-mode"]}connectedCallback(){A(this),O()}attributeChangedCallback(){this.isConnected&&A(this)}}customElements.define(d,e)}(0,u.observeLiaSlideActivity)(O),(b=new MutationObserver(e=>{e.some(e=>"attributes"===e.type?e.target instanceof HTMLAnchorElement&&null!==e.target.closest("#lia-toc"):[...e.addedNodes,...e.removedNodes].some(P))&&O()})).observe(document.documentElement,{attributeFilter:["href"],attributes:!0,childList:!0,subtree:!0}),z()}}},{"./portal-visual.ts":"5qwxU","./secret-slides.ts":"7fPSc","./slide-navigation.ts":"l5CPd","./slide-portal-options.ts":"ffEjw","./slide-portal-route.ts":"kLbAb","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5qwxU":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(e,t=!1){let o=document.createElementNS("http://www.w3.org/2000/svg","svg");return o.setAttribute("viewBox","0 0 64 72"),o.setAttribute("shape-rendering","crispEdges"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-slide-portal__graphic"),o.innerHTML=`
    <rect class="loot-slide-portal__shadow" x="8" y="65" width="50" height="5"/>
    <path class="loot-slide-portal__outline" d="M8 66V28h4V18h6V12h8V8h16v4h8v6h6v10h4v38H48V31h-4v-7h-6v-4H26v4h-6v7h-4v35H8Z"/>
    <path class="loot-slide-portal__rim" d="M12 64V29h4V19h7v-5h22v5h7v10h4v35h-8V31h-4v-7h-6v-3H27v3h-7v7h-4v33h-4Z"/>
    <path class="loot-slide-portal__core" d="M17 64V33h4v-8h7v-3h10v3h6v8h4v31H17Z"/>
    <rect class="loot-slide-portal__spark loot-slide-portal__spark--one" x="24" y="27" width="4" height="4"/>
    <rect class="loot-slide-portal__spark loot-slide-portal__spark--two" x="40" y="48" width="4" height="4"/>
    ${"one-way"===e?'<path class="loot-slide-portal__arrow" d="M20 31h17v-7l11 12-11 12v-7H20V31Z"/>':t?'<path class="loot-slide-portal__arrow" d="M46 27H29v-7L18 32l11 12v-7h17V27Zm-28 22h17v7l11-12-11-12v7H18v10Z"/>':'<path class="loot-slide-portal__arrow" d="M18 27h17v-7l11 12-11 12v-7H18V27Zm28 22H29v7L18 44l11-12v7h17v10Z"/>'}
  `,o}n.defineInteropFlag(o),n.export(o,"createPortalGraphic",()=>l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],ffEjw:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"parseSlidePortalOptions",()=>a),n.export(o,"validateSlidePortalTarget",()=>s);let l=new Set(["einweg","einbahn","einbahnstrasse","oneway","one-way"]),i=new Set(["hinundher","hin-und-her","zweiweg","bidirektional","twoway","two-way"]);function a(e,t="two-way"){let o=("@0"===e.trim()?"":e).split(";").map(e=>e.trim()).filter(Boolean),r=[],n=[],s=new Set;for(let e of o){if(/^\d+$/u.test(e)){n.push(Number(e));continue}let t=function(e){let t=e.normalize("NFKD").replace(/\p{M}/gu,"").trim().toLocaleLowerCase("de-DE").replace(/ß/gu,"ss").replace(/\s+/gu,"");return l.has(t)?"one-way":i.has(t)?"two-way":null}(e);if(t){s.add(t);continue}r.push(`Unbekannte Portaloption: ${e}`)}1!==n.length&&r.push("Ein Portal benötigt genau eine positive Foliennummer.");let c=1===n.length?n[0]:null;null!==c&&(!Number.isSafeInteger(c)||c<1)&&r.push("Die Zielfolie muss eine positive, sichere Ganzzahl sein."),s.size>1&&r.push("Ein Portal kann nicht zugleich Einweg- und Zweiwegportal sein.");let u=s.values().next().value,d=null!==c&&Number.isSafeInteger(c)&&c>=1?c-1:null,m=0===r.length?d:null;return{errors:r,mode:u??t,targetSection:m,targetSlide:c,valid:null!==m}}function s(e,t,o){return null===e||!Number.isInteger(e)||e<0?"missing":null!==t&&e===t?"same-slide":null===o||o<1?"pending":e<o?"valid":"missing"}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],kLbAb:[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"normalizeSlidePortalRoute",()=>a),n.export(o,"transitionSlidePortalRoute",()=>s),n.export(o,"loadSlidePortalRoute",()=>c),n.export(o,"saveSlidePortalRoute",()=>u),n.export(o,"clearSlidePortalRoute",()=>d);var l=e("./course-identity.ts");function i(){return`lia-loot:slide-portal-route:v1:${encodeURIComponent((0,l.liaCourseIdentity)())}`}function a(e,t=Date.now()){return e&&"object"==typeof e?1!==e.version||"string"!=typeof e.portalId||0===e.portalId.trim().length||!Number.isInteger(e.sourceSection)||0>Number(e.sourceSection)||!Number.isInteger(e.targetSection)||0>Number(e.targetSection)||e.sourceSection===e.targetSection||"pending"!==e.phase&&"arrived"!==e.phase||"number"!=typeof e.expiresAt||!Number.isFinite(e.expiresAt)||e.expiresAt<=t?null:{expiresAt:e.expiresAt,phase:e.phase,portalId:e.portalId.trim(),sourceSection:Number(e.sourceSection),targetSection:Number(e.targetSection),version:1}:null}function s(e,t){return null===t?{route:e,showReturn:!1}:"pending"===e.phase?t===e.sourceSection?{route:e,showReturn:!1}:t===e.targetSection?{route:{...e,phase:"arrived"},showReturn:!0}:{route:null,showReturn:!1}:t===e.targetSection?{route:e,showReturn:!0}:{route:null,showReturn:!1}}function c(){try{let e=window.sessionStorage.getItem(i());if(!e)return null;let t=a(JSON.parse(e));return t||window.sessionStorage.removeItem(i()),t}catch{return null}}function u(e){try{window.sessionStorage.setItem(i(),JSON.stringify(e))}catch{}}function d(){try{window.sessionStorage.removeItem(i())}catch{}}},{"./course-identity.ts":"g3iqo","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5gsVV":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"HighscoreStore",()=>s);var l=e("./score"),i=e("./storage");function a(e){return Number.isFinite(e)?Math.max(0,Math.floor(e)):0}class s{configure(e,t=Date.now()){this.current&&(0,l.sameConfig)(this.current.config,e)||(this.current={version:1,config:e,startedAt:t,failedChecks:0,hintsUsed:0,finishedAt:null,finalScore:null},(0,i.saveState)(this.current))}isRunning(){return null!==this.current&&null===this.current.finishedAt}fail(e=1){this.isRunning()&&this.current&&(this.current.failedChecks+=a(e),(0,i.saveState)(this.current))}hint(e=1){this.isRunning()&&this.current&&(this.current.hintsUsed+=a(e),(0,i.saveState)(this.current))}score(e=Date.now()){return this.current?null!==this.current.finalScore?this.current.finalScore:(0,l.calculateScore)(this.current.config,this.current,e):null}finish(e=Date.now()){if(!this.current)return null;if(null!==this.current.finalScore)return this.current.finalScore;let t=(0,l.calculateScore)(this.current.config,this.current,e);return this.current.finishedAt=e,this.current.finalScore=t,(0,i.saveState)(this.current),t}reset(e=Date.now()){if(!this.current)return void(0,i.clearState)();let t={...this.current.config};(0,i.clearState)(),this.current=null,this.configure(t,e)}state(){var e;return this.current?{...e=this.current,config:{...e.config}}:null}constructor(){this.current=(0,i.loadState)()}}},{"./score":"abltm","./storage":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"7riKx":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"TIMER_START_SELECTOR",()=>l),n.export(o,"installTimerEventTracking",()=>i);let l=".lia-sol-timer-startbtn[data-sol-timer-ui='solution'], .lia-sol-timer-startbtn[data-sol-timer-ui='hint']";function i(e){let t=new WeakSet;document.addEventListener("click",o=>{if(o.defaultPrevented)return;let r=function(e){for(let t of[..."function"==typeof e.composedPath?e.composedPath():[],e.target]){let e=t&&"object"==typeof t?1===t.nodeType?t:t.parentElement?t.parentElement:null:null,o=e?.closest(l);if(o)return o}return null}(o);if(!(!r||!1===r.isConnected||r.disabled||"true"===r.getAttribute("aria-disabled")||r.closest('[inert], [hidden], [aria-hidden="true"]')||function(e){let t=e.ownerDocument?.defaultView;if(!t)return!1;try{for(let o=e;o;o=o.parentElement){let e=t.getComputedStyle(o);if("none"===e.display||"hidden"===e.visibility||"collapse"===e.visibility||"none"===e.pointerEvents||0===Number(e.opacity))return!0}}catch{return!0}return!1}(r))){if(t.has(r)||!e.useStart()){var n;return void((n=o).preventDefault(),n.stopImmediatePropagation())}t.add(r)}},!0)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"4oJ1H":[function(e,t,o,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"parseTreasureChestOptions",()=>R),n.export(o,"courseChestUnitCount",()=>q),n.export(o,"templatePortalGeometry",()=>F),n.export(o,"refreshTreasureChests",()=>Y),n.export(o,"installTreasureChests",()=>W);var l=e("./course-chests.ts"),i=e("./collectible-visibility.ts"),a=e("./concealment.ts"),s=e("./slide-activity.ts"),c=e("./surface-targets.ts"),u=e("./template-targets.ts");let d="lia-loot-chest",m="data-loot-chest-portal",p="data-loot-chest-tray",h=new Map,f=new Map,g=new Set,b=new Map,y=new Map,v=new Set,w=new Set,x=new Set,k=new(0,i.CollectibleVisibilityGate),S=null,_=[],C=null,L=0,E="idle",A=!1,I=!1;function T(e){e?.hasAttribute(p)&&!e.querySelector(`[${m}]`)&&e.remove()}function j(e){if(!e)return;let t=e.parentElement;e.remove(),T(t)}function M(e,t,o,r=document){let n=r.createElement("button");return n.type="button",n.className="loot-treasure-chest","diamonds"===o?n.classList.add("loot-treasure-chest--diamonds"):"energy"===o&&n.classList.add("loot-treasure-chest--energy"),n.dataset.lootChestButton=e,n.dataset.lootChestLocation=t,n.dataset.lootChestReward=o,n.setAttribute("aria-label","diamonds"===o?"Diamanttruhe öffnen und einen Diamanten erhalten":"energy"===o?"Energiekiste öffnen und einen Energiepunkt erhalten":"Schatztruhe öffnen und eine Goldmünze erhalten"),n.append(function(e,t=document){let o=t.createElementNS("http://www.w3.org/2000/svg","svg");o.setAttribute("viewBox","0 0 64 56"),o.setAttribute("shape-rendering","crispEdges"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-treasure-chest-graphic"),"diamonds"===e?o.classList.add("loot-treasure-chest-graphic--diamonds"):"energy"===e&&o.classList.add("loot-treasure-chest-graphic--energy");let r="diamonds"===e?`
        <polygon class="loot-chest-diamond-outline" points="32,31 41,36 32,47 23,36"/>
        <polygon class="loot-chest-diamond-dark" points="32,33 38,36 32,44 26,36"/>
        <polygon class="loot-chest-diamond" points="32,33 38,36 32,41 26,36"/>
        <polygon class="loot-chest-diamond-light" points="32,33 32,40 26,36"/>
      `:"energy"===e?`
          <polygon class="loot-chest-energy-outline" points="33,31 40,31 35,36 39,36 28,47 31,39 24,39"/>
          <polygon class="loot-chest-energy" points="34,33 37,33 33,37 36,37 30,43 32,38 27,38"/>
          <polygon class="loot-chest-energy-light" points="34,33 36,33 33,36 32,36"/>
        `:`
          <rect class="loot-chest-keyhole" x="31" y="37" width="2" height="5"/>
          <rect class="loot-chest-keyhole" x="30" y="40" width="4" height="2"/>
        `;return o.innerHTML=`
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
  `,o}(o,r),function(e,t=document){let o=t.createElement("span");return o.className="loot-treasure-reward","diamonds"===e?o.classList.add("loot-treasure-reward--diamonds"):"energy"===e&&o.classList.add("loot-treasure-reward--energy"),o.setAttribute("aria-hidden","true"),o.innerHTML="diamonds"===e?'<span class="loot-treasure-reward__gem"></span><span>+1</span>':"energy"===e?'<span class="loot-treasure-reward__energy"></span><span>+1</span>':'<span class="loot-treasure-reward__coin"></span><span>+1</span>',o}(o,r)),n.addEventListener("click",()=>{if(!(!S||v.has(e))&&(w.has(e)||(G(),n.isConnected&&w.has(e)))){if(!S.active(o)){let e;return void(n.querySelector(".loot-treasure-requirement")?.remove(),(e=n.ownerDocument.createElement("span")).className="loot-treasure-requirement",e.setAttribute("role","status"),e.textContent="energy"===o?"Zuerst Energie mit @Ressourcen(Gold, Diamanten, Energie) festlegen":"Zuerst @Ressourcen(...) ausführen",n.appendChild(e),n.classList.remove("loot-treasure-chest--waiting"),n.offsetWidth,n.classList.add("loot-treasure-chest--waiting"),window.setTimeout(()=>{e.remove(),n.classList.remove("loot-treasure-chest--waiting")},2200))}if(v.add(e),!S.collect(e,o)){v.delete(e),Y();return}n.disabled=!0,n.classList.add("loot-treasure-chest--opened"),window.setTimeout(()=>{v.delete(e);let t=n.closest(`[${m}]`);t?j(t):n.remove(),V()},650)}}),n}function N(e){return(0,c.resolveSurfaceTarget)(e)??(0,u.resolveTemplateTarget)(e)}function R(e){let t=(0,i.parseCollectibleOptions)(e),o=(0,a.extractConcealmentOptions)(t.values),r=[...t.errors,...o.errors,...o.values.filter(e=>null===N(e)).map(e=>`Unbekanntes Truhenziel oder Option: ${e}`)],n=[...new Set(o.values.map(e=>N(e)).filter(e=>null!==e))],l=t.hasOptions||null!==o.mode,s=""===e.trim()||l&&0===o.values.length;return{concealment:o.mode,errors:r,inline:s,placements:n,valid:0===r.length,visibility:t.rule}}function q(e,t=()=>!0){let o=0;for(let r of e){let e=R(r.placement);e.valid&&(o+=e.inline?1:new Set(e.placements.filter(e=>!(0,u.isTemplateTarget)(e)||t(e))).size)}return o}function $(e,t){return`${e}:${t.reward}:${[...t.placements].sort().join(";")}:${(0,i.collectibleVisibilitySignature)(t.visibility)}:${t.concealment??"none"}`}function z(e,t){x.has(e)||(x.add(e),console.warn(`Loot: Fund ${e} bleibt wegen ung\xfcltiger Optionen verborgen. ${t.join(" ")}`))}function O(e,t){let o=t.sourceSection,r=null===o?null:$(o,t),n=y.get(e);if(null!==r&&n===r)return void h.delete(e);n&&y.delete(e);let l=null===r?0:b.get(r)??0;if(null!==r&&function(e){let t=0;for(let o of y.values())o===e&&(t+=1);return t}(r)<l){y.set(e,r),h.delete(e);return}h.set(e,t)}function P(e,t){for(let e of g)h.delete(e);for(let t of(g.clear(),b.clear(),y.clear(),e)){let e=R(t.placement);if(!e.valid){z(t.baseId,e.errors);continue}let o=new Set(e.placements);if(0===o.size)continue;let r={concealment:e.concealment,placements:o,reward:t.reward,sourceSection:t.section,visibility:e.visibility};h.set(t.baseId,r),g.add(t.baseId);let n=$(t.section,r);b.set(n,(b.get(n)??0)+1)}for(let[e,o]of(E="complete",S?.catalogReady(q(t)),f))O(e,o);f.clear(),V()}function K(e){let t,o,r,n,l,i=(t=function(e){let t=e.getAttribute("data-chest-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootRuntimeId;if(o)return o;L+=1;let r=`runtime-${L}`;return e.dataset.lootRuntimeId=r,r}(e),r="diamonds"===(o=e.getAttribute("data-reward")?.trim().toLowerCase())||"diamond"===o||"gems"===o||"diamant"===o||"diamanten"===o?"diamonds":"energy"===o||"energie"===o||"power"===o||"bolt"===o?"energy":"gold",{baseId:t,concealment:(l=R("@0"===(n=e.getAttribute("data-placement")?.trim()??"")?"":n)).concealment,errors:l.errors,inline:l.inline,placements:l.placements,reward:r,sourceHost:e,sourceSection:(0,s.sectionFromLootId)(t),valid:l.valid,visibility:l.visibility});if(i.valid)if(i.inline)f.delete(i.baseId),h.delete(i.baseId),y.delete(i.baseId),e.classList.remove("loot-treasure-host--portal-source"),null===i.concealment&&(0,a.setHostConcealment)(e,null);else{let t={concealment:i.concealment,placements:new Set(i.placements),reward:i.reward,sourceHost:i.sourceHost,sourceSection:i.sourceSection,visibility:i.visibility};"complete"===E?O(i.baseId,t):f.set(i.baseId,t),(0,a.setHostConcealment)(e,null),e.classList.add("loot-treasure-host--portal-source"),e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren()}else z(i.baseId,i.errors),f.delete(i.baseId),h.delete(i.baseId),y.delete(i.baseId),(0,a.setHostConcealment)(e,null),e.classList.add("loot-treasure-host--portal-source"),e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren();return i}function D(e){for(let t of(0,u.templateDocumentCandidates)(document)){let o=[...t.querySelectorAll(`[${m}]`)].find(t=>t.dataset.lootChestPortal===e);if(o)return o}return null}function H(e,t,o){e.style[t]!==o&&(e.style[t]=o)}function F(e,t,o,r="overlay"){let n=Math.min(58,Math.max(44,e.width)),l=Math.min(51,Math.max(40,.875*n)),i=Math.max(4,t-n-4),a=Math.max(4,o-l-4),s="below"===r?e.left+(e.width-n)/2:e.right-n-4,c="below"===r?e.bottom+8:e.bottom-l-4;return{height:l,left:Math.max(4,Math.min(s,i)),top:Math.max(4,Math.min(c,a)),width:n}}function G(){if(S){for(let e of(w.clear(),document.querySelectorAll(d))){let t=K(e);t.valid&&t.inline&&function(e,t,o){var r;if(!S)return;let n=v.has(t);if(S.collected(t)&&!n){w.delete(t),k.forget(`chest:${o.baseId}`),(0,a.setHostConcealment)(e,null),e.childElementCount>0&&e.replaceChildren();return}let l=k.visible(`chest:${o.baseId}`,o.visibility,(0,s.sourceSlideIsActive)(o.sourceSection,e),V);if(l?w.add(t):w.delete(t),!l&&!n){e.childElementCount>0&&e.replaceChildren(),(0,a.setHostConcealment)(e,null);return}n||(r=o.reward,[...e.querySelectorAll("[data-loot-chest-button]")].find(e=>e.dataset.lootChestButton===t&&e.dataset.lootChestReward===r))||e.replaceChildren(M(t,"inline",o.reward)),(0,a.setHostConcealment)(e,o.concealment)}(e,`${t.baseId}:inline`,t)}!function(){if(!S)return;let e=new Set;for(let[t,o]of h){let r=k.visible(`chest:${t}`,o.visibility,(0,s.sourceSlideIsActive)(o.sourceSection,o.sourceHost),V);for(let n of o.placements){let l=`${t}:${n}`,i=v.has(l),d=S.collected(l)&&!i;if(!r&&!i){w.delete(l),j(D(l));continue}e.add(l),r&&!d?w.add(l):w.delete(l),d?j(D(l)):i||function(e,t,o){let r=function(e,t){if((0,u.isTemplateTarget)(e)){let o=(0,u.findTemplateTarget)(e,"chest",document);return o&&("slide"!==(0,u.templateTargetDefinition)(e).scope||(0,s.sourceSlideIsActive)(t.sourceSection,o.root))?{anchor:o.chestAnchor,container:o.chestContainer??o.chestAnchor.ownerDocument.body,grouped:!!o.chestContainer,template:!0,templateLayout:o.chestContainer?"inside":"floating",templatePosition:o.chestContainer?null:o.chestPosition??"overlay"}:null}if(!(0,c.isSurfaceTarget)(e))return null;let o=(0,c.surfaceTargetElement)(e,document);return o?{anchor:o,container:o,grouped:(0,c.surfaceTargetIsGrouped)(e),template:!1,templateLayout:null,templatePosition:null}:null}(t,o),n=D(e);if(!r)return j(n);n?.dataset.lootChestReward!==o.reward&&(j(n),n=null);let l=r.grouped?function(e,t){let o=`:scope > [${p}="${t}"]`,r=e.container.querySelector(o);if(r)return r;let n=e.container.ownerDocument,l=e.container.matches("ul, ol"),i=n.createElement(l?"li":"div");return i.className=["loot-chest-tray",e.template?"loot-chest-tray--template":"loot-chest-tray--support"].join(" "),i.dataset.lootChestTray=t,i.setAttribute("role","group"),i.setAttribute("aria-label","Versteckte Funde"),e.container.appendChild(i),i}(r,t):r.container;if(!n){let i=l.ownerDocument,a=!r.template&&l.matches("ul, ol");(n=i.createElement(a?"li":"div")).className=`loot-chest-placement loot-chest-placement--${t}`,n.dataset.lootChestPortal=e,n.dataset.lootChestLocation=t,n.dataset.lootChestReward=o.reward,r.template&&(n.dataset.lootChestTemplateTarget=t),a&&(n.classList.add("nav__item","lia-support-menu__item"),n.setAttribute("role","none")),n.append(M(e,t,o.reward,i))}if(n.parentElement!==l){let e=n.parentElement;l.appendChild(n),T(e)}if(n.classList.toggle("loot-chest-placement--template","floating"===r.templateLayout),n.classList.toggle("loot-chest-placement--template-inside","inside"===r.templateLayout),n.classList.toggle("loot-chest-placement--template-below","floating"===r.templateLayout&&"below"===r.templatePosition),r.templatePosition?n.dataset.lootChestTemplatePosition=r.templatePosition:delete n.dataset.lootChestTemplatePosition,(0,a.setHostConcealment)(n,o.concealment),"floating"===r.templateLayout)!function(e,t,o){let r=t.getBoundingClientRect(),n=t.ownerDocument.defaultView??window,l=t.isConnected&&r.width>0&&r.height>0&&r.right>0&&r.bottom>0&&r.left<n.innerWidth&&r.top<n.innerHeight;if(e.hidden===l&&(e.hidden=!l),!l)return;let i=F(r,n.innerWidth,n.innerHeight,o);H(e,"left",`${i.left}px`),H(e,"top",`${i.top}px`),H(e,"width",`${i.width}px`),H(e,"height",`${i.height}px`)}(n,r.anchor,r.templatePosition??"overlay");else if("inside"===r.templateLayout)for(let e of(n.hidden=!1,["height","left","top","width"]))H(n,e,"")}(l,n,o)}}for(let t of function(){let e=[];for(let t of(0,u.templateDocumentCandidates)(document))for(let o of t.querySelectorAll(`[${m}]`))e.includes(o)||e.push(o);return e}()){let o=t.dataset.lootChestPortal;o&&(e.has(o)||v.has(o))||j(t)}}(),function(){for(let e of _)e.takeRecords()}()}}function V(){null===C&&(C=window.setTimeout(()=>{C=null,G()},0))}function B(e){e.length>0&&V()}class U extends HTMLElement{static get observedAttributes(){return["data-chest-id","data-placement","data-reward"]}connectedCallback(){K(this),V()}attributeChangedCallback(){this.isConnected&&(w.clear(),K(this),V())}}function Y(){G()}function W(e){if(S=e,document.getElementById("lia-loot-treasure-chest")?.remove(),"idle"===E&&(E="pending",(0,l.discoverCourseChests)().then(({declarations:e,catalog:t})=>P(e,t)).catch(()=>P([],[]))),A||(A=!0,(0,s.observeLiaSlideActivity)(()=>{for(let e of(w.clear(),V(),[80,250,650]))window.setTimeout(V,e)})),customElements.get(d)||customElements.define(d,U),0===_.length)for(let e of(0,u.templateDocumentCandidates)(document)){let t=new(e.defaultView?.MutationObserver??MutationObserver)(B);t.observe(e.documentElement,{attributeFilter:["aria-hidden","aria-pressed","class","data-active","data-open","hidden","style"],attributes:!0,childList:!0,subtree:!0}),_.push(t)}if(!I){I=!0;let e=new Set;for(let t of(0,u.templateDocumentCandidates)(document)){let o=t.defaultView;!o||e.has(o)||(e.add(o),o.addEventListener("resize",V,{passive:!0}),o.addEventListener("scroll",V,{capture:!0,passive:!0}),o.visualViewport?.addEventListener("resize",V,{passive:!0}),o.visualViewport?.addEventListener("scroll",V,{passive:!0}))}}Y()}},{"./course-chests.ts":"2ceW6","./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./slide-activity.ts":"5qduG","./surface-targets.ts":"dYwdL","./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}]},["k1TZk"],"k1TZk","parcelRequire3c00",{});
//# sourceMappingURL=index.js.map
