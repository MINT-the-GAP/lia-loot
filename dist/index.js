!function(e,t,o,l,n){var r="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},i="function"==typeof r[l]&&r[l],a=i.i||{},s=i.cache||{},c="u">typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(t,o){if(!s[t]){if(!e[t]){if(n[t])return n[t];var a="function"==typeof r[l]&&r[l];if(!o&&a)return a(t,!0);if(i)return i(t,!0);if(c&&"string"==typeof t)return c(t);var d=Error("Cannot find module '"+t+"'");throw d.code="MODULE_NOT_FOUND",d}h.resolve=function(o){var l=e[t][1][o];return null!=l?l:o},h.cache={};var p=s[t]=new u.Module(t);e[t][0].call(p.exports,h,p,p.exports,r)}return s[t].exports;function h(e){var t=h.resolve(e);if(!1===t)return{};if(Array.isArray(t)){var o={__esModule:!0};return t.forEach(function(e){var t=e[0],l=e[1],n=e[2]||e[0],r=u(l);"*"===t?Object.keys(r).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(o,e)||Object.defineProperty(o,e,{enumerable:!0,get:function(){return r[e]}})}):"*"===n?Object.defineProperty(o,t,{enumerable:!0,value:r}):Object.defineProperty(o,t,{enumerable:!0,get:function(){return"default"===n?r.__esModule?r.default:r:r[n]}})}),o}return u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.require=c,this.exports={}},u.modules=e,u.cache=s,u.parent=i,u.distDir=void 0,u.publicUrl=void 0,u.devServer=void 0,u.i=a,u.register=function(t,o){e[t]=[function(e,t){t.exports=o},{}]},Object.defineProperty(u,"root",{get:function(){return r[l]}}),r[l]=u;for(var d=0;d<t.length;d++)u(t[d]);if(o){var p=u(o);"object"==typeof exports&&"u">typeof module?module.exports=p:"function"==typeof define&&define.amd&&define(function(){return p})}}({k1TZk:[function(e,t,o,l){var n=e("./achievements"),r=e("./achievement-overlay"),i=e("./achievement-store"),a=e("./inventory-store"),s=e("./inline-reveal"),c=e("./key-colors"),u=e("./key-inventory-bar"),d=e("./key-pickup"),p=e("./magnifier"),h=e("./magnifier-store"),f=e("./exploration"),m=e("./exploration-store"),g=e("./loot-if"),b=e("./loot-if-store"),v=e("./object-lock"),y=e("./course-chests"),w=e("./course-identity"),k=e("./popup"),x=e("./quiz-events"),z=e("./resource-bar"),S=e("./resource-store"),E=e("./score"),C=e("./secret-slides"),L=e("./slide-portal"),_=e("./puzzle-runtime"),A=e("./puzzle-store"),I=e("./style"),T=e("./store"),N=e("./timer-events"),R=e("./treasure-chest");let j="0.0.1";async function P(e){try{let t,o,l,P,O,M,$,q,D,H,K,G,F,V,B;(0,I.injectStyles)(),(0,y.installCourseMarkdownCapture)(),(0,s.installInlineRevealRendering)(),await (0,w.prepareLiaCourseIdentity)(y.discoverCourseIdentity),t=new(0,T.HighscoreStore),o=new(0,S.ResourceStore),l=new(0,a.KeyInventoryStore),P=new(0,h.MagnifierStore),O=new(0,m.ExplorationStore),M=new(0,b.LootIfStore),$=new(0,i.AchievementStore),q=new(0,A.PuzzleStore),D=new(0,n.AchievementManager)($,r.showAchievement),H=()=>{let e=t.state();D.highscoreFinished(e?.finalScore??null,e?.config.maxPoints??NaN),D.enable()},K=e=>{let t=o.spend(e),l=o.state();return l&&(0,z.renderResources)(l.gold,l.diamonds,l.energy),t||(0,z.showInsufficientResource)("gold"===e?"coins":"diamonds"===e?"gems":"energy"),(0,g.refreshLootIf)(),t},G=(e,t,l)=>{let n=o.configure(e,t,l);D.chestCollected(o.collectedChestCounts()),(0,z.renderResources)(n.gold,n.diamonds,n.energy),(0,R.refreshTreasureChests)(),(0,g.refreshLootIf)()},F={version:j,configure(e,o,l,n,r){let i=(0,E.createConfig)(e,o,l,n,r);t.configure(i),D.highscoreFinished(null,i.maxPoints)},fail(e=1){t.fail(e)},hint(e=1){t.hint(e)},finish(){let e=t.finish(),o=t.state();return null!==e&&o&&(D.highscoreFinished(e,o.config.maxPoints),(0,k.showHighscore)(e,o.config.maxPoints)),e},reset(){(0,k.hideHighscore)(),t.reset();let e=t.state();D.highscoreFinished(null,e?.config.maxPoints??NaN)},score:e=>t.score(e),show(){let e=t.state();e?.finalScore!==null&&e?.finalScore!==void 0&&(0,k.showHighscore)(e.finalScore,e.config.maxPoints)},enableAchievements(){H()},state:()=>t.state(),resources(e,t,o){G(e,t,o)}},(0,I.injectStyles)(),(0,g.installLootIf)({chestCounts:()=>o.collectedChestCounts(),magnifierFound:()=>P.isCollected(),resourceState:()=>o.state(),unlockedLockIds:()=>l.state().unlockedLocks,openedPuzzleColors:()=>q.solvedColors()},M),(0,_.installPuzzles)(q,{catalogReady:(e,t)=>{D.puzzleCatalogReady(e,t),(0,g.refreshLootIf)()},changed:g.refreshLootIf,gateSolved:e=>{D.puzzleGateSolved(e),(0,g.refreshLootIf)()}}),(0,C.installSecretSlides)({found:()=>{D.secretSlideFound(),(0,g.recordLootIfSecretSlideVisited)()}}),(0,L.installSlidePortals)(),(0,y.discoverCourseAchievementsDeclaration)().then(e=>{e&&H()}),(0,y.discoverCourseAchievementCatalog)().then(e=>{let t=O.state();D.explorationCatalogReady(e,{dust:t.foundDustObjects.length,plant:t.wateredPlants.length,soil:t.dugLayers.length,solid:t.foundInvisibleObjects.length})}).catch(()=>{}).catch(()=>{}),(0,y.discoverCourseResourceDeclaration)().then(e=>{e&&null===o.state()&&G(e.gold,e.diamonds,e.energy)}).catch(()=>{}),(V=o.state())&&(0,z.renderResources)(V.gold,V.diamonds,V.energy),(0,p.installMagnifier)({collected:()=>P.isCollected(),collect:()=>{let e=P.collect();return e&&(0,g.refreshLootIf)(),e},find:(e,t)=>{if(!O.findConcealedObject(e,t))return;let o=O.state();D.concealmentFound(t,"dust"===t?o.foundDustObjects.length:o.foundInvisibleObjects.length)}}),(0,f.installExploration)({activeTool:()=>O.activeTool(),collectTool:e=>O.collectTool(e),digLayer:e=>!!O.digLayer(e)&&(D.soilDug(O.state().dugLayers.length),!0),isLayerDug:e=>O.isLayerDug(e),isPlantOpened:e=>O.isPlantOpened(e),isPlantWatered:e=>O.isPlantWatered(e),isToolCollected:e=>O.isToolCollected(e),openPlant:e=>O.openPlant(e),setActiveTool:e=>O.setActiveTool(e),waterPlant:e=>!!O.waterPlant(e)&&(D.plantBloomed(O.state().wateredPlants.length),!0)}),(0,R.installTreasureChests)({active:e=>{let t=o.state();return null!==t&&("energy"!==e||null!==t.energy)},catalogReady:e=>{D.chestCatalogReady(e,o.collectedChestCounts())},classify:(e,t)=>{o.classifyCollectedChest(e,t)&&(D.chestCollected(o.collectedChestCounts()),(0,g.refreshLootIf)())},collected:e=>o.isChestCollected(e),collect:(e,t,l)=>{if(!o.collectChest(e,t,l))return!1;let n=o.state();return!!n&&(D.chestCollected(o.collectedChestCounts()),(0,z.renderResources)(n.gold,n.diamonds,n.energy),(0,z.announceResource)(1===l?"diamonds"===t?"Diamanttruhe geöffnet: einen Diamanten erhalten.":"energy"===t?"Energiekiste geöffnet: einen Energiepunkt erhalten.":"Schatztruhe geöffnet: eine Goldmünze erhalten.":"diamonds"===t?"Diamanttruhe geöffnet: "+l+" Diamanten erhalten.":"energy"===t?"Energiekiste geöffnet: "+l+" Energiepunkte erhalten.":"Schatztruhe geöffnet: "+l+" Goldmünzen erhalten."),(0,g.refreshLootIf)(),!0)}}),B=l.state(),Object.values(B.keys).some(e=>e>0)&&(0,u.renderKeyInventory)(B.keys),(0,d.installKeyPickups)({collected:e=>l.isKeyCollected(e),collect:(e,t)=>!!l.collectKey(e,t)&&((0,u.renderKeyInventory)(l.state().keys),(0,u.announceKeyFound)(c.KEY_COLOR_DETAILS[t].foundMessage),!0),focusInventory:u.focusKeyInventory}),(0,v.installObjectLocks)({catalogReady:e=>{D.lockCatalogReady(e,l.state().unlockedLocks.length)},unlocked:e=>l.isLockUnlocked(e),unlock:(e,t,o)=>{let n=l.useKeyForLock(e,t);if("unlocked"===n){let e=l.state();(0,u.renderKeyInventory)(e.keys),D.lockUnlocked(e.unlockedLocks.length),M.recordOpenedLockTarget(o),(0,g.refreshLootIf)()}return n}}),(0,N.installTimerEventTracking)({useStart:()=>K("energy")}),(0,x.installQuizEventTracking)({active:()=>!0,failed:()=>t.fail(),hint:e=>t.hint(e),solved:e=>{(0,g.recordLootIfQuizSolved)(e)},allSolved:()=>D.quizzesCompleted(),courseCompleted:()=>null!==F.finish(),useCheck:()=>K("energy"),useHint:()=>K("gold"),useResolve:()=>K("diamonds")}),window.__LIA_LOOT_HIGHSCORE__=F,window.__LIA_LOOT_RUNTIME__===e&&(e.status="ready")}catch(t){window.__LIA_LOOT_RUNTIME__===e&&(e.status="failed"),console.error("[lia-loot] Initialisierung fehlgeschlagen.",t)}}let O=function(){let e=window.__LIA_LOOT_RUNTIME__;if(e?.status==="booting"||e?.status==="ready")return null;if(window.__LIA_LOOT_HIGHSCORE__)return window.__LIA_LOOT_RUNTIME__={version:j,status:"ready"},null;let t={version:j,status:"booting"};return window.__LIA_LOOT_RUNTIME__=t,t}();O&&P(O)},{"./achievements":"c7Uyw","./achievement-overlay":"aBJTX","./achievement-store":"40Y3c","./inventory-store":"bTrLW","./inline-reveal":"8S0Pe","./key-colors":"7rSfY","./key-inventory-bar":"kd9xY","./key-pickup":"aEHXm","./magnifier":"grhSe","./magnifier-store":"4rVr5","./exploration":"5BeJ3","./exploration-store":"eyg0o","./loot-if":"iooeB","./loot-if-store":"2KjdS","./object-lock":"bLBcI","./course-chests":"2ceW6","./course-identity":"g3iqo","./popup":"cCRZG","./quiz-events":"1ZNl4","./resource-bar":"1KrGH","./resource-store":"1O7ju","./score":"abltm","./secret-slides":"7fPSc","./slide-portal":"8aUxA","./puzzle-runtime":"yg2zb","./puzzle-store":"49JJj","./style":"3Vffy","./store":"5gsVV","./timer-events":"7riKx","./treasure-chest":"4oJ1H"}],c7Uyw:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"ACHIEVEMENT_EXPLORATION_KINDS",()=>i),n.export(o,"ACHIEVEMENTS",()=>c),n.export(o,"AchievementManager",()=>u);var r=e("./types.ts");let i=["solid","dust","soil","plant"],a={gold:"all-treasure-chests-opened",diamonds:"all-diamond-chests-opened",energy:"all-energy-chests-opened"},s={solid:"all-invisible-objects-found",dust:"all-magic-dust-objects-found",soil:"all-soil-dug",plant:"all-plants-bloomed"},c={"all-quizzes-solved":{id:"all-quizzes-solved",title:"Aufgaben-Meister",message:"Du hast alle Aufgaben geschafft."},"perfect-highscore":{id:"perfect-highscore",title:"Perfekter Highscore",message:"Du hast die maximale Punktzahl erreicht."},"all-treasure-chests-opened":{id:"all-treasure-chests-opened",title:"Schatzjäger",message:"Du hast alle Schatztruhen geöffnet."},"all-diamond-chests-opened":{id:"all-diamond-chests-opened",title:"Diamantensammler",message:"Du hast alle Diamanttruhen geöffnet."},"all-energy-chests-opened":{id:"all-energy-chests-opened",title:"Energiesammler",message:"Du hast alle Energiekisten geöffnet."},"all-invisible-objects-found":{id:"all-invisible-objects-found",title:"Unsichtbares entdeckt",message:"Du hast alle unsichtbaren Objekte gefunden."},"all-magic-dust-objects-found":{id:"all-magic-dust-objects-found",title:"Zauberstaubspürnase",message:"Du hast alle Zauberstaub-Objekte gefunden."},"all-soil-dug":{id:"all-soil-dug",title:"Ausgrabungsprofi",message:"Du hast alle Erdhaufen weggebuddelt."},"all-plants-bloomed":{id:"all-plants-bloomed",title:"Grüner Daumen",message:"Du hast alle Pflanzen zum Blühen gebracht."},"all-locks-opened":{id:"all-locks-opened",title:"Schlossknacker",message:"Du hast alle Schlösser geöffnet."},"all-puzzle-gates-opened":{id:"all-puzzle-gates-opened",title:"Puzzlemeister",message:"Du hast alle Puzzletore geöffnet."},"secret-slide-found":{id:"secret-slide-found",title:"Geheimnis entdeckt",message:"Du hast eine geheime Folie gefunden."}};class u{constructor(e,t){this.enabled=!1,this.allQuizzesCompleted=!1,this.perfectHighscore=!1,this.chestTotals={gold:null,diamonds:null,energy:null},this.collectedChests={gold:0,diamonds:0,energy:0},this.explorationTotals={solid:null,dust:null,soil:null,plant:null},this.explorationCompleted={solid:0,dust:0,soil:0,plant:0},this.lockTotal=null,this.unlockedLocks=0,this.puzzleGateTotal=null,this.solvedPuzzleGates=0,this.secretFound=!1,this.store=e,this.notify=t}enable(){this.enabled||(this.enabled=!0,this.evaluateAll())}isEnabled(){return this.enabled}quizzesCompleted(){this.allQuizzesCompleted=!0,this.evaluate("all-quizzes-solved",!0)}highscoreFinished(e,t){this.perfectHighscore=null!==e&&Number.isFinite(t)&&e===t,this.evaluate("perfect-highscore",this.perfectHighscore)}chestCatalogReady(e,t){this.chestTotals=d(e),this.collectedChests=d(t),this.evaluateChestProgress()}chestCollected(e){this.collectedChests=d(e),this.evaluateChestProgress()}explorationCatalogReady(e,t){this.explorationTotals=p(e),this.explorationCompleted=p(t),this.evaluateExplorationProgress()}concealmentFound(e,t){("solid"===e||"dust"===e)&&(this.explorationCompleted[e]=h(t),this.evaluateExplorationKind(e))}soilDug(e){this.explorationCompleted.soil=h(e),this.evaluateExplorationKind("soil")}plantBloomed(e){this.explorationCompleted.plant=h(e),this.evaluateExplorationKind("plant")}lockCatalogReady(e,t){this.lockTotal=h(e),this.unlockedLocks=h(t),this.evaluateLockProgress()}lockUnlocked(e){this.unlockedLocks=h(e),this.evaluateLockProgress()}puzzleCatalogReady(e,t){this.puzzleGateTotal=h(e),this.solvedPuzzleGates=h(t),this.evaluatePuzzleProgress()}puzzleGateSolved(e){this.solvedPuzzleGates=h(e),this.evaluatePuzzleProgress()}secretSlideFound(){this.secretFound=!0,this.evaluate("secret-slide-found",!0)}state(){return this.store.state()}evaluateAll(){this.evaluate("all-quizzes-solved",this.allQuizzesCompleted),this.evaluate("perfect-highscore",this.perfectHighscore),this.evaluateChestProgress(),this.evaluateExplorationProgress(),this.evaluateLockProgress(),this.evaluatePuzzleProgress(),this.evaluate("secret-slide-found",this.secretFound)}evaluateChestProgress(){for(let e of r.RESOURCE_KINDS){let t=this.chestTotals[e];this.evaluateCatalogProgress(a[e],t,this.collectedChests[e])}}evaluateExplorationProgress(){for(let e of i)this.evaluateExplorationKind(e)}evaluateExplorationKind(e){this.evaluateCatalogProgress(s[e],this.explorationTotals[e],this.explorationCompleted[e])}evaluateCatalogProgress(e,t,o){this.evaluate(e,null!==t&&t>0&&o>=t)}evaluateLockProgress(){this.evaluate("all-locks-opened",null!==this.lockTotal&&this.lockTotal>0&&this.unlockedLocks>=this.lockTotal)}evaluatePuzzleProgress(){this.evaluate("all-puzzle-gates-opened",null!==this.puzzleGateTotal&&this.puzzleGateTotal>0&&this.solvedPuzzleGates>=this.puzzleGateTotal)}evaluate(e,t){this.enabled&&t&&this.store.unlock(e)&&this.notify(c[e])}}function d(e){return{gold:h(e?.gold),diamonds:h(e?.diamonds),energy:h(e?.energy)}}function p(e){return{solid:h(e?.solid),dust:h(e?.dust),soil:h(e?.soil),plant:h(e?.plant)}}function h(e){return Number.isFinite(e)?Math.max(0,Math.floor(e)):0}},{"./types.ts":"ijQUu","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],ijQUu:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"RESOURCE_KINDS",()=>r),n.export(o,"ACHIEVEMENT_IDS",()=>i),n.export(o,"LEGACY_ACHIEVEMENT_IDS",()=>a);let r=["gold","diamonds","energy"],i=["all-quizzes-solved","perfect-highscore","all-treasure-chests-opened","all-diamond-chests-opened","all-energy-chests-opened","all-invisible-objects-found","all-magic-dust-objects-found","all-soil-dug","all-plants-bloomed","all-locks-opened","all-puzzle-gates-opened","secret-slide-found"],a=["all-chests-opened"]},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],aqhRK:[function(e,t,o,l){o.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},o.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},o.exportAll=function(e,t){return Object.keys(e).forEach(function(o){"default"===o||"__esModule"===o||Object.prototype.hasOwnProperty.call(t,o)||Object.defineProperty(t,o,{enumerable:!0,get:function(){return e[o]}})}),t},o.export=function(e,t,o){Object.defineProperty(e,t,{enumerable:!0,get:o})}},{}],aBJTX:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"ACHIEVEMENT_AUTO_HIDE_MS",()=>i),n.export(o,"showAchievement",()=>d);let r="lia-loot-achievement-overlay",i=12e3,a=new Set,s=new WeakMap;function c(){let e=document.getElementById(r);if(e)return e;let t=document.createElement("aside");return t.id=r,t.className="loot-achievement",t.hidden=!0,t.setAttribute("aria-label","Erfolgsmeldungen"),(document.body??document.documentElement).append(t),t}function u(e,t){let o=s.get(e);void 0!==o&&(globalThis.clearTimeout(o),s.delete(e));let l=c();e.remove(),a.delete(t),l.hidden=0===l.childElementCount,l.hidden||(l.scrollTop=l.scrollHeight)}function d(e){var t;let o,l,n,r,d,p,h,f,m;if(a.has(e.id))return;let g=c(),b=((o=document.createElement("div")).className="loot-achievement__card",o.dataset.achievementId=e.id,(l=document.createElement("div")).className="loot-achievement__content",l.setAttribute("role","status"),l.setAttribute("aria-live","polite"),l.setAttribute("aria-atomic","true"),(n=document.createElement("div")).className="loot-achievement__text",(r=document.createElement("p")).className="loot-achievement__eyebrow",r.textContent="Erfolg freigeschaltet",(d=document.createElement("p")).className="loot-achievement__title",d.textContent=e.title,(p=document.createElement("p")).className="loot-achievement__message",p.textContent=e.message,n.append(r,d,p),l.append(((h=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("viewBox","0 0 48 48"),h.setAttribute("shape-rendering","crispEdges"),h.setAttribute("aria-hidden","true"),h.classList.add("loot-achievement__graphic"),h.innerHTML=`
    <path class="loot-achievement__burst" d="M20 2h8v5h6v5h5v6h5v12h-5v6h-5v5h-6v5h-8v-5h-6v-5H9v-6H4V18h5v-6h5V7h6z"/>
    <path class="loot-achievement__burst-light" d="M20 7h8v4h6v5h5v16h-5v5h-6v4h-8v-4h-6v-5H9V16h5v-5h6z"/>
    <path class="loot-achievement__star" d="M22 12h4v7h7v4h-4v4h-3v8h-4v-8h-3v-4h-4v-4h7z"/>
  `,h),n),(f=document.createElement("button")).type="button",f.className="loot-achievement__close",f.setAttribute("aria-label","Erfolgsmeldung schließen"),f.textContent="×",f.addEventListener("click",()=>u(o,e.id)),o.addEventListener("keydown",t=>{"Escape"===t.key&&(t.preventDefault(),u(o,e.id))}),o.append(l,f),o);g.append(b),a.add(e.id),g.hidden=!1,b.offsetWidth,b.classList.add("loot-achievement__card--visible"),g.scrollTop=g.scrollHeight,t=e.id,m=globalThis.setTimeout(()=>{s.delete(b),u(b,t)},i),s.set(b,m)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"40Y3c":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"AchievementStore",()=>i);var r=e("./storage.ts");class i{unlock(e){return!this.current.unlocked.includes(e)&&(this.current.unlocked.push(e),(0,r.saveAchievements)(this.current),!0)}state(){var e;return{...e=this.current,unlocked:[...e.unlocked]}}constructor(){this.current=(0,r.loadAchievements)()??{version:1,unlocked:[]}}}},{"./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8s1BG":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"loadState",()=>b),n.export(o,"saveState",()=>v),n.export(o,"clearState",()=>y),n.export(o,"loadResources",()=>w),n.export(o,"saveResources",()=>k),n.export(o,"loadChestRewards",()=>x),n.export(o,"saveChestRewards",()=>z),n.export(o,"loadKeyInventory",()=>S),n.export(o,"saveKeyInventory",()=>E),n.export(o,"loadPuzzles",()=>C),n.export(o,"savePuzzles",()=>L),n.export(o,"loadMagnifier",()=>_),n.export(o,"saveMagnifier",()=>A),n.export(o,"loadAchievements",()=>I),n.export(o,"saveAchievements",()=>T);var r=e("./score.ts"),i=e("./key-colors.ts"),a=e("./course-identity.ts"),s=e("./types.ts");function c(e){let t=`${e}${encodeURIComponent((0,a.liaCourseIdentity)())}`;return!function(e,t){let o,l=(o=`${window.location.origin}${window.location.pathname}${window.location.search}`,`${e}${encodeURIComponent(o)}`);if(l===t)return;let n=window.sessionStorage.getItem(l);null!==n&&(null===window.sessionStorage.getItem(t)&&window.sessionStorage.setItem(t,n),window.sessionStorage.removeItem(l))}(e,t),t}function u(){return c("lia-loot:highscore:v1:")}function d(){return c("lia-loot:resources:v1:")}function p(){return c("lia-loot:chest-rewards:v1:")}function h(){return c("lia-loot:key-inventory:v1:")}function f(){return c("lia-loot:magnifier:v1:")}function m(){return c("lia-loot:achievements:v1:")}function g(){return c("lia-loot:puzzles:v1:")}function b(){try{let e=window.sessionStorage.getItem(u());if(!e)return null;let t=JSON.parse(e);return!function(e){if(!e||"object"!=typeof e||1!==e.version||!e.config)return!1;try{(0,r.createConfig)(e.config.maxPoints,e.config.failedCheckPenalty,e.config.hintPenalty,e.config.graceMinutes,e.config.perMinutePenalty)}catch{return!1}return Number.isFinite(e.startedAt)&&Number.isInteger(e.failedChecks)&&Number(e.failedChecks)>=0&&Number.isInteger(e.hintsUsed)&&Number(e.hintsUsed)>=0&&(null===e.finishedAt||Number.isFinite(e.finishedAt))&&(null===e.finalScore||Number.isFinite(e.finalScore))}(t)?null:t}catch{return null}}function v(e){try{window.sessionStorage.setItem(u(),JSON.stringify(e))}catch{}}function y(){try{window.sessionStorage.removeItem(u())}catch{}}function w(){try{let t=window.sessionStorage.getItem(d());if(!t)return null;var e=JSON.parse(t);if(!e||"object"!=typeof e||1!==e.version||!Number.isInteger(e.initialGold)||0>Number(e.initialGold)||!Number.isInteger(e.initialDiamonds)||0>Number(e.initialDiamonds)||!Number.isInteger(e.gold)||0>Number(e.gold)||!Number.isInteger(e.diamonds)||0>Number(e.diamonds))return null;let o=void 0!==e.initialEnergy&&null!==e.initialEnergy,l=void 0!==e.energy&&null!==e.energy;if(o!==l||o&&(!Number.isInteger(e.initialEnergy)||0>Number(e.initialEnergy)||!Number.isInteger(e.energy)||0>Number(e.energy))||void 0!==e.collectedChests&&(!Array.isArray(e.collectedChests)||!e.collectedChests.every(e=>"string"==typeof e&&e.trim().length>0))||void 0!==e.chestCollected&&"boolean"!=typeof e.chestCollected)return null;let n=Array.isArray(e.collectedChests)?[...new Set(e.collectedChests.map(e=>e.trim()))]:!0===e.chestCollected?["legacy:auto"]:[];return{version:1,initialGold:Number(e.initialGold),initialDiamonds:Number(e.initialDiamonds),initialEnergy:o?Number(e.initialEnergy):null,gold:Number(e.gold),diamonds:Number(e.diamonds),energy:l?Number(e.energy):null,collectedChests:n}}catch{return null}}function k(e){try{window.sessionStorage.setItem(d(),JSON.stringify(e))}catch{}}function x(){try{let e=window.sessionStorage.getItem(p());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!e.collected||"object"!=typeof e.collected||Array.isArray(e.collected))return null;let t=e.collected;if(Object.keys(t).some(e=>!s.RESOURCE_KINDS.includes(e)))return null;let o={gold:[],diamonds:[],energy:[]},l=new Set;for(let e of s.RESOURCE_KINDS){let n=t[e]??[];if(!Array.isArray(n)||!n.every(e=>"string"==typeof e&&e.trim().length>0))return null;let r=n.map(e=>e.trim());if(new Set(r).size!==r.length)return null;for(let e of r){if(l.has(e))return null;l.add(e)}o[e]=r}return{version:1,collected:o}}(t)}catch{return null}}function z(e){try{window.sessionStorage.setItem(p(),JSON.stringify(e))}catch{}}function S(){try{let e=window.sessionStorage.getItem(h());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!e.keys||"object"!=typeof e.keys)return null;let t=e.keys,o=(0,i.createEmptyKeyCounts)();for(let e of i.KEY_COLORS){let l=t[e]??0;if(!Number.isInteger(l)||0>Number(l))return null;o[e]=Number(l)}if(!Array.isArray(e.collectedKeys)||!e.collectedKeys.every(e=>"string"==typeof e&&e.trim().length>0))return null;let l=[...new Set(e.collectedKeys.map(e=>e.trim()))];if(void 0!==e.unlockedLocks&&(!Array.isArray(e.unlockedLocks)||!e.unlockedLocks.every(e=>"string"==typeof e&&e.trim().length>0)))return null;let n=Array.isArray(e.unlockedLocks)?e.unlockedLocks.map(e=>e.trim()):[],r=[...new Set(n)];return r.length!==n.length||i.KEY_COLORS.reduce((e,t)=>e+o[t],0)+r.length!==l.length?null:{version:1,keys:o,collectedKeys:l,unlockedLocks:r}}(t)}catch{return null}}function E(e){try{window.sessionStorage.setItem(h(),JSON.stringify(e))}catch{}}function C(){try{let e=window.sessionStorage.getItem(g());if(!e)return null;return function(e){if(!e||"object"!=typeof e||1!==e.version||"string"!=typeof e.signature||0===e.signature.length||e.signature.length>512||!e.collected||"object"!=typeof e.collected||Array.isArray(e.collected)||!e.placements||"object"!=typeof e.placements||Array.isArray(e.placements)||!Array.isArray(e.solvedGates))return null;let t=e.collected,o=e.placements,l=Object.fromEntries(i.KEY_COLORS.map(e=>[e,[]])),n=Object.fromEntries(i.KEY_COLORS.map(e=>[e,[]]));for(let e of i.KEY_COLORS){let r=t[e]??[],i=o[e]??[];if(!Array.isArray(r)||!r.every(e=>Number.isInteger(e)&&Number(e)>=1&&16>=Number(e))||new Set(r).size!==r.length||!Array.isArray(i)||i.length>16||!i.every(e=>null===e||Number.isInteger(e)&&Number(e)>=1&&16>=Number(e)))return null;let a=i.filter(e=>null!==e);if(new Set(a).size!==a.length||a.some(e=>!r.includes(e)))return null;l[e]=[...r],n[e]=[...i]}return e.solvedGates.every(e=>"string"==typeof e&&i.KEY_COLORS.includes(e))&&new Set(e.solvedGates).size===e.solvedGates.length?{version:1,signature:e.signature,collected:l,placements:n,solvedGates:[...e.solvedGates]}:null}(JSON.parse(e))}catch{return null}}function L(e){try{window.sessionStorage.setItem(g(),JSON.stringify(e))}catch{}}function _(){try{var e;let t=window.sessionStorage.getItem(f());if(!t)return null;return(e=JSON.parse(t))&&"object"==typeof e?1!==e.version||"boolean"!=typeof e.collected?null:{version:1,collected:e.collected}:null}catch{return null}}function A(e){try{window.sessionStorage.setItem(f(),JSON.stringify(e))}catch{}}function I(){try{let e=window.sessionStorage.getItem(m());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!Array.isArray(e.unlocked)||void 0!==e.legacyAllChestsOpened&&"boolean"!=typeof e.legacyAllChestsOpened)return null;let t=new Set([...s.ACHIEVEMENT_IDS,...s.LEGACY_ACHIEVEMENT_IDS]);if(!e.unlocked.every(e=>"string"==typeof e&&t.has(e)))return null;let o=[...e.unlocked];if(new Set(o).size!==o.length)return null;let l=!0===e.legacyAllChestsOpened||o.includes("all-chests-opened"),n=new Set(s.ACHIEVEMENT_IDS),r=o.filter(e=>n.has(e));return l?{version:1,unlocked:r,legacyAllChestsOpened:!0}:{version:1,unlocked:r}}(t)}catch{return null}}function T(e){try{window.sessionStorage.setItem(m(),JSON.stringify(e))}catch{}}},{"./score.ts":"abltm","./key-colors.ts":"7rSfY","./course-identity.ts":"g3iqo","./types.ts":"ijQUu","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],abltm:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"createConfig",()=>i),n.export(o,"sameConfig",()=>a),n.export(o,"elapsedSeconds",()=>s),n.export(o,"calculateScore",()=>c),n.export(o,"trophyTier",()=>u),n.export(o,"formatScore",()=>d);let r=["maxPoints","failedCheckPenalty","hintPenalty","graceMinutes","perMinutePenalty"];function i(e,t,o,l,n){let i={maxPoints:Number(e),failedCheckPenalty:Number(t),hintPenalty:Number(o),graceMinutes:Number(l),perMinutePenalty:Number(n)};if(!Number.isFinite(i.maxPoints)||i.maxPoints<=0)throw TypeError("@Highscore: Die maximale Punktzahl muss größer als 0 sein.");for(let e of r.slice(1))if(!Number.isFinite(i[e])||i[e]<0)throw TypeError(`@Highscore: ${e} muss eine nichtnegative Zahl sein.`);return i}function a(e,t){return r.every(o=>e[o]===t[o])}function s(e,t){return Math.max(0,Math.floor((t-e)/1e3))}function c(e,t,o){let l=Math.max(0,Math.floor((o-t.startedAt-6e4*e.graceMinutes)/1e3))*e.perMinutePenalty/60;return Math.max(0,e.maxPoints-t.failedChecks*e.failedCheckPenalty-t.hintsUsed*e.hintPenalty-l)}function u(e,t){let o=t>0?e/t:0;return o>=.9?"gold":o>=.75?"silver":o>=.5?"copper":null}function d(e,t="de-DE"){return new Intl.NumberFormat(t,{minimumFractionDigits:0,maximumFractionDigits:1}).format(e)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"7rSfY":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"KEY_COLORS",()=>r),n.export(o,"KEY_COLOR_DETAILS",()=>a),n.export(o,"isKeyColorRequest",()=>d),n.export(o,"createEmptyKeyCounts",()=>p),n.export(o,"requestedKeyColor",()=>h),n.export(o,"deterministicKeyColor",()=>f),n.export(o,"resolveKeyAppearance",()=>m);let r=["red","blue","green","yellow","purple","orange","magenta","white","black","turquoise","gray","brown"],i=["red","blue","green","yellow","purple","orange"],a={red:{label:"Rot",inventoryLabel:"Rote Schlüssel",pickupLabel:"Roten Schlüssel",foundMessage:"Roter Schlüssel gefunden."},blue:{label:"Blau",inventoryLabel:"Blaue Schlüssel",pickupLabel:"Blauen Schlüssel",foundMessage:"Blauer Schlüssel gefunden."},green:{label:"Grün",inventoryLabel:"Grüne Schlüssel",pickupLabel:"Grünen Schlüssel",foundMessage:"Grüner Schlüssel gefunden."},yellow:{label:"Gelb",inventoryLabel:"Gelbe Schlüssel",pickupLabel:"Gelben Schlüssel",foundMessage:"Gelber Schlüssel gefunden."},purple:{label:"Lila",inventoryLabel:"Lilafarbene Schlüssel",pickupLabel:"Lilafarbenen Schlüssel",foundMessage:"Lilafarbener Schlüssel gefunden."},orange:{label:"Orange",inventoryLabel:"Orangefarbene Schlüssel",pickupLabel:"Orangefarbenen Schlüssel",foundMessage:"Orangefarbener Schlüssel gefunden."},magenta:{label:"Magenta",inventoryLabel:"Magentafarbene Schlüssel",pickupLabel:"Magentafarbenen Schlüssel",foundMessage:"Magentafarbener Schlüssel gefunden."},white:{label:"Weiß",inventoryLabel:"Weiße Schlüssel",pickupLabel:"Weißen Schlüssel",foundMessage:"Weißer Schlüssel gefunden."},black:{label:"Schwarz",inventoryLabel:"Schwarze Schlüssel",pickupLabel:"Schwarzen Schlüssel",foundMessage:"Schwarzer Schlüssel gefunden."},turquoise:{label:"Türkis",inventoryLabel:"Türkisfarbene Schlüssel",pickupLabel:"Türkisfarbenen Schlüssel",foundMessage:"Türkisfarbener Schlüssel gefunden."},gray:{label:"Grau",inventoryLabel:"Graue Schlüssel",pickupLabel:"Grauen Schlüssel",foundMessage:"Grauer Schlüssel gefunden."},brown:{label:"Braun",inventoryLabel:"Braune Schlüssel",pickupLabel:"Braunen Schlüssel",foundMessage:"Brauner Schlüssel gefunden."}},s={red:"red",rot:"red",blue:"blue",blau:"blue",green:"green",grün:"green",gruen:"green",yellow:"yellow",gelb:"yellow",purple:"purple",violet:"purple",violett:"purple",lila:"purple",orange:"orange",magenta:"magenta",white:"white",weiss:"white",weiß:"white",black:"black",schwarz:"black",turquoise:"turquoise",türkis:"turquoise",tuerkis:"turquoise",gray:"gray",grey:"gray",grau:"gray",brown:"brown",braun:"brown",brau:"brown"},c=new Set(["","?","auto","random","zufall","mystery","unbekannt"]);function u(e){return e?.trim().toLowerCase()??""}function d(e){let t=u(e);return c.has(t)||/^@\d+$/.test(t)||void 0!==s[t]}function p(){return Object.fromEntries(r.map(e=>[e,0]))}function h(e){let t=u(e);return c.has(t)||/^@\d+$/.test(t)?null:s[t]??null}function f(e){let t=e.trim()||"loot-key",o=0x811c9dc5;for(let e=0;e<t.length;e+=1)o^=t.charCodeAt(e),o=Math.imul(o,0x1000193);return i[(o>>>0)%i.length]}function m(e,t){let o=h(t);return{color:o??f(e),mystery:null===o}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],g3iqo:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"DEFAULT_LIA_COURSE_VERSION",()=>r),n.export(o,"courseVersionFromMetadata",()=>c),n.export(o,"setLiaCourseVersion",()=>u),n.export(o,"setLiaCourseRevision",()=>d),n.export(o,"liaCourseVersion",()=>p),n.export(o,"liaCourseIdentity",()=>h),n.export(o,"prepareLiaCourseIdentity",()=>m);let r="0.0.1",i=null,a=null;function s(e){if("string"!=typeof e)return null;let t=e.trim();return 0===t.length||t.length>128||/[\u0000-\u001f\u007f]/u.test(t)?null:t}function c(e){if(!e||"object"!=typeof e)return null;let t=s(e.version);if(t)return t;for(let t of["course","definition","meta","metadata"]){let o=e[t];if(!o||"object"!=typeof o)continue;let l=s(o.version);if(l)return l}return null}function u(e){i=s(e)??r,a=null}function d(e){a=s(e)}function p(){return i??r}function h(){let e=`${function(){let e=window.LIA,t=e?.defaultCourseURL?.trim();try{let e=new URL(t||window.location.href,window.location.href);return e.hash="",e.href}catch{return t||`${window.location.pathname}${window.location.search}`}}()}::version=${encodeURIComponent(p())}`;return a?`${e}::revision=${encodeURIComponent(a)}`:e}function f(e){if("string"==typeof e){let t=s(e);return t?{version:t}:null}if(!e||"object"!=typeof e)return null;let t=s(e.version),o=s(e.revision);return t?o?{version:t,revision:o}:{version:t}:null}async function m(e,t=15e3,o=750){let l;if(i)return i;let n=window.LIA,a=n?.onReady,s=null,h=null,g=new Promise(e=>{n&&(s=t=>{let o=c(t);return o&&e(o),a?.call(n,t)},n.onReady=s)}),b=Promise.resolve().then(e).then(f).catch(()=>null),v=new Promise(e=>{b.then(t=>{t&&e(t)})}),y=new Promise(e=>{h=globalThis.setTimeout(()=>e(r),Math.max(0,t))}),w=await Promise.race([v.then(e=>({kind:"source",identity:e})),g.then(e=>({kind:"ready",version:e})),y.then(e=>({kind:"fallback",version:e}))]);if("source"===w.kind)l=w.identity;else if("ready"===w.kind){let e=null,t=await Promise.race([b,new Promise(t=>{e=globalThis.setTimeout(()=>t(null),Math.max(0,o))})]);null!==e&&globalThis.clearTimeout(e),l={version:w.version,...t?.revision?{revision:t.revision}:{}}}else l={version:w.version};return u(l.version),l.revision&&d(l.revision),null!==h&&globalThis.clearTimeout(h),n&&s&&n.onReady===s&&(n.onReady=a),p()}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],bTrLW:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"KeyInventoryStore",()=>a);var r=e("./key-colors.ts"),i=e("./storage.ts");class a{collectKey(e,t){let o=e.trim();return!(!o||this.current.collectedKeys.includes(o))&&(this.current.keys[t]+=1,this.current.collectedKeys.push(o),(0,i.saveKeyInventory)(this.current),!0)}isKeyCollected(e){return this.current.collectedKeys.includes(e.trim())}useKeyForLock(e,t){let o=e.trim();return o?this.current.unlockedLocks.includes(o)?"already-unlocked":this.current.keys[t]<=0?"missing-key":(this.current.keys[t]-=1,this.current.unlockedLocks.push(o),(0,i.saveKeyInventory)(this.current),"unlocked"):"invalid-lock-id"}isLockUnlocked(e){return this.current.unlockedLocks.includes(e.trim())}state(){var e;return{...e=this.current,keys:{...e.keys},collectedKeys:[...e.collectedKeys],unlockedLocks:[...e.unlockedLocks]}}constructor(){this.current=(0,i.loadKeyInventory)()??{version:1,keys:(0,r.createEmptyKeyCounts)(),collectedKeys:[],unlockedLocks:[]}}}},{"./key-colors.ts":"7rSfY","./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8S0Pe":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"installInlineRevealRendering",()=>N);var r=e("./course-chests.ts"),i=e("./slide-activity.ts");let a="lia-loot-reveal[data-reveal-layout=inline][data-loot-inline-kind]",s="data-loot-inline-renderer",c="data-loot-inline-tail",u="data-loot-inline-rendered",d=new Set(["data-chest-id","data-gate-id","data-key-id","data-lock-id","data-loot-if-id","data-magnifier-id","data-piece-id","data-portal-id","data-reveal-id","data-secret-id","data-tool-id"]),p=null,h=null,f=0,m=!1,g=new WeakMap,b=new Map,v=new Map,y=null;function w(e){let t=e.trim().toLocaleLowerCase("de-DE");return"erde"===t||"soil"===t?"soil":"pflanze"===t||"blume"===t||"plant"===t?"plant":null}function k(e){return"soil"===e?"erde":"pflanze"}function x(e){return[...document.querySelectorAll(a)].find(t=>t.getAttribute("data-reveal-id")===e)??null}function z(e){return[...document.querySelectorAll(`[${s}]`)].find(t=>t.getAttribute(s)===e)??null}function S(e,t){let o=0,l=0;for(;l<t.length;){if(/\s/u.test(t[l])){for(;/\s/u.test(t[l]??"");)l+=1;for(;/\s/u.test(e[o]??"");)o+=1;continue}if(e[o]!==t[l])return null;o+=1,l+=1}return o}function E(e,t){let o=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),l=o.nextNode(),n=0;for(;l&&n<24;){if(!(e.compareDocumentPosition(l)&Node.DOCUMENT_POSITION_FOLLOWING)){l=o.nextNode();continue}n+=1;let r=l.textContent??"";if(null!==S(r,t)||r.trim())return l;l=o.nextNode()}return null}function C(e,t){let o=e.textContent??"",l=S(o,t);if(null===l)return!1;let n=o.slice(l);return n?e.textContent=n:e.parentNode?.removeChild(e),!0}function L(){let e=new Map;for(let t of document.querySelectorAll(`[${c}]`)){let o=t.getAttribute(c);if(!o)continue;let l=e.get(o);l?l.push(t):e.set(o,[t])}for(let[t,o]of[...v]){if(!o.host.isConnected){let e=x(t);e&&(o.host=e)}for(let l of e.get(t)??[])if(o.trailingSource){let e=l.parentElement,t=e?[...e.children].indexOf(l):-1,n=E(l,o.trailingSource),r=l.nextElementSibling,i=n?.parentElement,a=e&&i?.parentElement===e?[...e.children].indexOf(i):-1,s=(r instanceof HTMLElement&&r.matches("span[ondblclick]")?r:null)??(i?.matches("span[ondblclick]")&&a>=0&&2>=Math.abs(a-t)?i:null),c=l.closest("p, .lia-paragraph")??e;if(e&&c){for(let[l,n]of o.candidates)l.isConnected||n.wrapper||n.container!==e||n.index!==t||o.candidates.delete(l);o.candidates.set(l,{container:e,index:t,marker:l,node:s===i?n:null,scope:c,wrapper:s}),s&&!s.textContent?.trim()&&l.remove()}}else l.remove();for(let[e,t]of[...o.candidates]){if(!t.container.isConnected||!t.scope.isConnected||!t.scope.contains(t.container)){o.candidates.delete(e);continue}if(t.wrapper?.isConnected&&t.wrapper.parentElement===t.container&&t.scope.contains(t.wrapper)||(t.wrapper=null,t.node=null),!t.wrapper){let e=[...t.container.children],o=[t.index,t.index-1,t.index+1,t.index-2,t.index+2].map(t=>e[t]).find(e=>e instanceof HTMLElement&&e.matches("span[ondblclick]"));o&&(t.wrapper=o)}if(!t.wrapper)continue;let l=[...t.wrapper.childNodes].filter(e=>e.nodeType===Node.TEXT_NODE);t.node=l.find(e=>null!==S(e.textContent??"",o.trailingSource))??l.find(e=>(e.textContent??"").trim())??l[0]??null,t.node&&C(t.node,o.trailingSource)&&(o.candidates.delete(e),t.marker.isConnected&&t.marker.remove())}}}function _(e,t,o){let l;(l=v.get(e))&&l.trailingSource===t?l.host=o:v.set(e,{candidates:new Map,host:o,trailingSource:t}),y||0===v.size||(y=new MutationObserver(L)).observe(document.body,{characterData:!0,childList:!0,subtree:!0}),L()}async function A(){if(p)return p;if(h)return h;let e=f;return h=(0,r.discoverCourseInlineRevealDeclarations)().then(t=>(e===f&&null===p&&(p=t),p??t)).finally(()=>{h=null})}function I(e){e.lia("LIA: stop")}async function T(e,t,o){let l=x(e),n=w(t);if(!l||!n)return void I(o);let r=function(e,t,o){let l=e.getAttribute("data-reveal-id")??"",n=(0,i.sectionFromLootId)(l);if(null===n)return null;let r=[...document.querySelectorAll(a)].filter(e=>(0,i.sectionFromLootId)(e.getAttribute("data-reveal-id")??"")===n&&w(e.getAttribute("data-loot-inline-kind")??"")===t).indexOf(e);return r<0?null:o.filter(e=>e.section===n&&e.kind===t)[r]??null}(l,n,await A());if(!r)return void I(o);if(l.setAttribute("data-options",`${k(n)}${r.options?`; ${r.options}`:""}`),_(e,r.trailingSource,l),!r.deferred){z(e)?.remove(),I(o);return}"true"===l.getAttribute(u)||b.has(e)||!z(e)||(l.setAttribute(u,"true"),function(e,t,o){let l;if(b.get(e))return;let n=!1,r=null,a=()=>{l&&b.get(e)===l&&(l.observer.disconnect(),window.clearInterval(l.interval),null!==l.settleTimeout&&window.clearTimeout(l.settleTimeout),window.clearTimeout(l.timeout),b.delete(e))},s=()=>{if(n||!l||b.get(e)!==l)return!1;let p=x(e),h=z(e),f=[...document.querySelectorAll(`[${c}]`)].find(t=>t.getAttribute(c)===e)??null;f&&(p?_(e,o.trailingSource,p):function(e,t){if(!e)return!0;if(!t)return e.remove(),!0;let o=E(e,t);return!!o&&!!C(o,t)&&(e.remove(),!0)}(f,o.trailingSource)&&v.get(e)?.candidates.delete(f));let m=h?.querySelector("output")??null,y=p?.querySelector("[data-loot-reveal-payload]")??null;if(!p||!h||!m?.hasChildNodes())return!1;n=!0;try{let n,c;p.setAttribute("data-options",`${k(t)}${o.options?`; ${o.options}`:""}`),(y??p).replaceChildren(...m.childNodes),h.remove(),p.setAttribute(u,"true");let f=(0,i.sectionFromLootId)(e);return null!==f&&(g.get(p)?.disconnect(),n=()=>(function(e,t,o){let l=0;for(let n of e.querySelectorAll("*")){for(let e of[...n.attributes])d.has(e.name)&&/^-1_\d+$/u.test(e.value)&&n.setAttribute(e.name,`${o}_${function(e){let t=0x811c9dc5;for(let o=0;o<e.length;o+=1)t^=e.charCodeAt(o),t=Math.imul(t,0x1000193);return String(t>>>0)}(`${t}:${l}:${e.name}:${e.value}`)}`);l+=1}})(p,e,f),(c=new MutationObserver(n)).observe(p,{attributeFilter:[...d],attributes:!0,childList:!0,subtree:!0}),g.set(p,c),n(),window.setTimeout(()=>{g.get(p)===c&&(n(),c.disconnect(),g.delete(p))},1e4)),r=p,l&&(null!==l.settleTimeout&&window.clearTimeout(l.settleTimeout),l.settleTimeout=window.setTimeout(()=>{window.requestAnimationFrame(()=>{window.requestAnimationFrame(()=>{if(!l||b.get(e)!==l||s())return;let t=x(e),o=t?.querySelector("[data-loot-reveal-payload]")??null;t===r&&t?.getAttribute(u)==="true"&&o?.hasChildNodes()&&!z(e)&&a()})})},750)),!0}finally{n=!1}},p=new MutationObserver(()=>{s()});p.observe(document.body,{characterData:!0,childList:!0,subtree:!0}),l={interval:window.setInterval(s,20),observer:p,settleTimeout:null,timeout:window.setTimeout(()=>{if(!l||b.get(e)!==l)return;let t=s(),o=x(e),n=o?.querySelector("[data-loot-reveal-payload]")??null,i=t||o===r&&o?.getAttribute(u)==="true"&&!!n?.hasChildNodes()&&!z(e);a(),i||(z(e)?.remove(),x(e)?.removeAttribute(u))},1e4)},b.set(e,l),s()}(e,n,r),o.liascript(r.content)),I(o)}function N(){window.__LIA_LOOT_INLINE_REVEALS__||(m||(m=!0,(0,r.onCourseMarkdownChange)(e=>{for(let e of(f+=1,b.values()))e.observer.disconnect(),window.clearInterval(e.interval),null!==e.settleTimeout&&window.clearTimeout(e.settleTimeout),window.clearTimeout(e.timeout);b.clear(),v.clear(),y?.disconnect(),y=null,p=(0,r.parseCourseInlineRevealDeclarations)(e),h=null})),window.__LIA_LOOT_INLINE_REVEALS__={render(e,t,o){T(e,t,o).catch(()=>I(o))}})}},{"./course-chests.ts":"2ceW6","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"2ceW6":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"DEFAULT_COURSE_VERSION",()=>j),n.export(o,"onCourseMarkdownChange",()=>Q),n.export(o,"installCourseMarkdownCapture",()=>X),n.export(o,"courseSourceRevision",()=>et),n.export(o,"parseCourseVersion",()=>eo),n.export(o,"parseCourseInlineRevealDeclarations",()=>ex),n.export(o,"parseCourseAchievementCatalog",()=>ez),n.export(o,"parseCourseChestDeclarations",()=>eS),n.export(o,"parseCourseKeyDeclarations",()=>eE),n.export(o,"parseCourseLockDeclarations",()=>eC),n.export(o,"parseCourseChestCatalogDeclarations",()=>eL),n.export(o,"parseCourseLockCatalogDeclarations",()=>e_),n.export(o,"parseCourseResourceDeclaration",()=>eI),n.export(o,"parseCourseSecretSlideDeclarations",()=>eT),n.export(o,"parseCoursePuzzleDeclarations",()=>eN),n.export(o,"parseCourseAchievementsDeclaration",()=>eR),n.export(o,"discoverCourseChestDeclarations",()=>eM),n.export(o,"discoverCourseKeyDeclarations",()=>e$),n.export(o,"discoverCourseVersion",()=>eq),n.export(o,"discoverCourseIdentity",()=>eD),n.export(o,"discoverCourseLockDeclarations",()=>eH),n.export(o,"discoverCourseChests",()=>eK),n.export(o,"discoverCourseLocks",()=>eG),n.export(o,"discoverCourseResourceDeclaration",()=>eF),n.export(o,"discoverCourseSecretSlideDeclarations",()=>eV),n.export(o,"requireCoursePuzzleDeclarations",()=>eB),n.export(o,"discoverCourseAchievementsDeclaration",()=>eW),n.export(o,"discoverCourseAchievementCatalog",()=>eU),n.export(o,"discoverCourseInlineRevealDeclarations",()=>eZ),n.export(o,"requireCourseSecretSlideDeclarations",()=>eY);var r=e("./collectible-visibility.ts"),i=e("./concealment.ts"),a=e("./exploration-options.ts"),s=e("./key-colors.ts"),c=e("./lock-options.ts"),u=e("./loot-if-options.ts"),d=e("./puzzle-catalog.ts"),p=e("./puzzle-options.ts"),h=e("./surface-targets.ts"),f=e("./template-targets.ts");let m=/@(Schatztruhe|Diamanttruhe|Diamantentruhe|Energiekiste|Energietruhe)(?![\p{L}\p{N}_])(?:\s*\(\s*([^()\r\n]*)\s*\))?/gu,g=/^\s*@Schluessel(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/,b=/^\s*@Schloss\s*\(\s*([^()\r\n]+)\s*\)\s*$/,v=/^\s*@LootTruhe_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*,\s*(gold|diamonds|energy)\s*\)\s*$/i,y=/^\s*@LootSchloss_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*\)\s*$/,w=/^\s*@(Schluessel|Lupe|Schaufel|Giesskanne)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu,k=/^\s*@LootSchluessel_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu,x=/^\s*@LootLupe_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu,z=/^\s*@LootWerkzeug_\s*\(\s*([^,()\r\n]+)\s*,\s*(shovel|watering-can)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu,S=/^\s*@LootRevealStart_\s*\(\s*([^,()\r\n]+)\s*,\s*(erde|pflanze)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu,E=/^\s*@LootRevealEnd_\s*\(\s*(erde|pflanze)\s*\)\s*$/iu,C=/^\s*@LootVersteckt_\s*\(\s*([^,()\r\n]+)\s*,\s*(solid|dust)\s*,[\s\S]*\)\s*$/iu,L=/^\s*@Ressourcen\s*\(\s*([^,()\r\n]+?)\s*,\s*([^,()\r\n]+?)(?:\s*,\s*([^,()\r\n]+?))?\s*\)\s*$/,_=/^\s*@Geheimfolie\s*$/,A=/@Puzzleteil(?![\p{L}\p{N}_])/giu,I=/^\s*@Puzzletor(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu,T=/^\s*@(achievements|erfolge)\s*$/i,N=/^\+?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[+-]?\d+)?$/i,R=[0,300,1e3],j="0.0.1",P={Schatztruhe:"gold",Diamanttruhe:"diamonds",Diamantentruhe:"diamonds",Energiekiste:"energy",Energietruhe:"energy"};function O(e){let t=[],o=new RegExp(m),l=0;for(;;){let n=o.exec(e);if(!n)break;if(""!==e.slice(l,n.index).trim())return[];t.push({macro:n[1],placement:(n[2]??"").trim()}),l=o.lastIndex}return""===e.slice(l).trim()?t:[]}let M=/^\s*@(Erdhaufen|Pflanze|Blume)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu,$=/^\s*@Ende(Erdhaufen|Pflanze|Blume)\s*$/iu,q=/^\s*@lootif\b/iu,D=/^\s*@lootif\s*\(\s*([^()\r\n]*)\s*\)\s*$/iu,H=/^\s*@LootIfStart_\b/u,K=/^\s*@LootIfStart_\s*\(\s*([^,()\r\n]+)\s*,\s*([^()\r\n]*)\s*\)\s*$/u,G=/^\s*@(Endelootif|EndeLootif|endlootif|EndLootIf)\s*$/u,F=/^\s*@LootIfEnd_\s*$/u;function V(e){return"erdhaufen"===e.toLocaleLowerCase("de-DE")?"soil":"plant"}let B=null,W=null,U=new WeakSet,Z=new Set;function Y(e,t){let o=e[t];if("function"!=typeof o||U.has(o))return;let l=function(e){let t=Reflect.apply(o,this,arguments);return"string"==typeof e&&0!==e.length&&!(e.length>0xa00000)&&e!==B&&(B=e,1)&&function(e){for(let t of Z)try{t(e)}catch(e){console.error("Loot: LiveEditor-Kursquelle konnte nicht aktualisiert werden.",e)}}(e),t};U.add(l),e[t]=l}function Q(e){return Z.add(e),()=>Z.delete(e)}function X(){let e=window.LIA;e&&(Y(e,"compile"),Y(e,"jit"),function(){if(null!==B||null!==ej())return;let e=function(){if(window.parent===window)return null;try{let e=window.parent.document,t=e.getElementById("liascript-preview");if(t?.tagName!=="IFRAME"||t.contentWindow!==window)return null;let o=e.querySelector(".bi-arrow-counterclockwise")?.closest("button");if(o)return o;return[...e.querySelectorAll("button")].find(e=>/(?:compile|kompil|recompile|aktualisier|neu laden)/iu.test(`${e.title} ${e.getAttribute("aria-label")??""}`))??null}catch{return null}}();e&&!e.disabled&&window.setTimeout(()=>{e.isConnected&&!e.disabled&&e.click()},0)}())}function J(e,t){let o=t.split(";").map(e=>e.trim().toLowerCase()).join(";");return`${e}(${o})`}function ee(e){let t=0x811c9dc5;for(let o=0;o<e.length;o+=1)t^=e.charCodeAt(o),t=Math.imul(t,0x1000193);return(t>>>0).toString(36)}function et(e){let t=e.replace(/^\uFEFF/u,"").replace(/\r\n?/gu,"\n");return`${t.length.toString(36)}-${ee(t)}`}function eo(e){let t=/^\s*<!--([\s\S]*?)-->/u.exec(e.replace(/^\uFEFF/u,""));return t&&/^\s*version\s*:\s*(.*?)\s*$/imu.exec(t[1])?.[1]?.trim()||j}function el(e){let t=[],o=null,l=!1,n=null,r=-1,i=[],a=[];for(let s of e.split(/\r?\n/)){let e=function(e,t){let o="",l=0,n=t;for(;l<e.length;){if(n){let t=e.indexOf("--\x3e",l);if(t<0)return{visible:o+=" ".repeat(e.length-l),inComment:!0};o+=" ".repeat(t+3-l),l=t+3,n=!1;continue}let t=e.indexOf("\x3c!--",l);if(t<0){o+=e.slice(l);break}o+=e.slice(l,t),o+=" ".repeat(4),l=t+4,n=!0}return{visible:o,inComment:n}}(s,l);if(l=e.inComment,o){(function(e,t){let o=/^ {0,3}(`{3,}|~{3,})\s*$/.exec(e);return null!==o&&o[1][0]===t.marker&&o[1].length>=t.length})(e.visible,o)&&(o=null);continue}let c=function(e){let t=/^ {0,3}(`{3,}|~{3,})/.exec(e);return t?{marker:t[1][0],length:t[1].length}:null}(e.visible);if(c){o=c;continue}if(n){RegExp(`</${n}\\s*>`,"i").test(e.visible)&&(n=null);continue}let d=/<(script|style|pre|code|textarea|template)(?:\s|>)/i.exec(e.visible);if(d){let t=d[1].toLowerCase();RegExp(`</${t}\\s*>`,"i").test(e.visible)||(n=t);continue}if(/^(?: {4}|\t)/.test(e.visible))continue;let p=function(e){let t="",o=0;for(let l=0;l<e.length;){if("`"===e[l]&&"\\"!==e[l-1]){let n=l+1;for(;"`"===e[n];)n+=1;let r=n-l;0===o?o=r:o===r&&(o=0),t+=" ".repeat(r),l=n;continue}t+=0===o?e[l]:" ",l+=1}return t}(e.visible);if(/^ {0,3}#{1,6}(?:\s+|$)/.test(p)&&(r+=1,a=[],i.length=0),G.test(p)||F.test(p)){let e=a.pop();e&&(e.closed=!0)}let h=$.exec(p);h&&i[i.length-1]===V(h[1])&&i.pop(),t.push({content:p,rawContent:s,lootIfCatalogEligible:!0,lootIfDepth:a.length,lootIfFrames:[...a],revealDepth:i.length,section:r});let f=M.exec(p);f&&i.push(V(f[1]));let m=function(e){let t=D.exec(e);if(t)return(0,u.parseLootIfOptions)(t[1]).valid;if(q.test(e))return!1;let o=K.exec(e);return o?(0,u.parseLootIfOptions)(o[2]).valid:!H.test(e)&&null}(p);null!==m&&a.push({closed:!1,valid:m})}return t.map(({lootIfFrames:e,...t})=>({...t,lootIfCatalogEligible:e.every(e=>e.closed&&e.valid)}))}function en(){return{dust:0,plant:0,soil:0,solid:0}}function er(e,t,o=1){e.dust+=t.dust*o,e.plant+=t.plant*o,e.soil+=t.soil*o,e.solid+=t.solid*o}function ei(e,t){let o=en();for(let l of(e&&(o[e]+=1),t))o[l.kind]+=1,l.concealment&&(o[l.concealment]+=1);return o}function ea(e){let t=(0,r.parseCollectibleOptions)(e),o=(0,a.parseExplorationOptions)(t.values),l=(0,i.extractConcealmentOptions)(o.values);return{catalog:ei(l.mode,o.layers),valid:0===t.errors.length&&0===l.errors.length,values:l.values}}let es=/^[+-]?(?:(?:\d+(?:[.,]\d*)?)|(?:[.,]\d+))(?:e[+-]?\d+)?$/iu;function ec(e){let t=function(e){let t=e.split(";").map(e=>e.trim()).filter(Boolean),o=!0;if(t[0]&&es.test(t[0])){let e=t.shift(),l=Number(e);/^\d+$/u.test(e)&&Number.isSafeInteger(l)&&!(l<=0)||(o=!1)}return t.some(e=>es.test(e))&&(o=!1),{options:t.filter(e=>!es.test(e)).join("; "),valid:o}}(e),o=ea(t.options);if(!t.valid||!o.valid)return null;let l=new Set;for(let e of o.values){let t=(0,h.resolveSurfaceTarget)(e)??(0,f.resolveTemplateTarget)(e);if(!t)return null;l.add(t)}let n=l.size>0?l.size:1,r=en();return er(r,o.catalog,n),r}function eu(e){let t=ea(e);if(!t.valid)return null;let o=!1,l=!1;for(let e of t.values){if((0,h.resolveSurfaceTarget)(e)){if(l)return null;l=!0;continue}if((0,s.isKeyColorRequest)(e)){if(o)return null;o=!0;continue}return null}return t.catalog}function ed(e){let t=ea(e);return t.valid&&0===t.values.length?t.catalog:null}function ep(e,t){let o="soil"===e?"erde":"pflanze",l=ea(t.trim()?o+"; "+t:o),n=l.catalog.soil+l.catalog.plant;return!l.valid||l.values.length>0||1!==n||1!==l.catalog[e]?null:l.catalog}function eh(e){let t=O(e);if(t.length>0){let e=en();for(let o of t){let t=ec(o.placement);t&&er(e,t)}return e}let o=w.exec(e);if(!o)return;let l=o[1].toLocaleLowerCase("de-DE"),n=(o[2]??"").trim();return"schluessel"===l?eu(n):ed(n)}function ef(e,t){let o=0;for(let l=t;l<e.length;l+=1){let t=e[l];if(92===t.charCodeAt(0)&&l+1<e.length){l+=1;continue}if("("===t)o+=1;else if(")"===t&&0==(o-=1))return l}return null}function em(e){let t=[],o=new RegExp(A);for(;;){let l=o.exec(e);if(!l)break;let n=l.index,r=e[n-1];if("@"===r||r?.charCodeAt(0)===92)continue;let i=n+l[0].length;for(;/\s/u.test(e[i]??"");)i+=1;if("("!==e[i]){t.push({options:"",start:n});continue}let a=ef(e,i);if(null===a)break;t.push({options:e.slice(i+1,a).trim(),start:n}),o.lastIndex=a+1}return t}function eg(e,t,o){return e+t/Math.max(1,o+1)}let eb={unsichtbar:"solid",zauberstaub:"dust"},ev={"Erdhaufen.inline":"soil","Pflanze.inline":"plant","Blume.inline":"plant"},ey=/@(Erdhaufen\.inline|Pflanze\.inline|Blume\.inline)(?![\p{L}\p{N}_.])/gu;function ew(e,t,o){let l=[],n=t+1,r=0,i=0;for(let t=n;t<o;t+=1){let a=e[t];if(92===a.charCodeAt(0)&&t+1<o){t+=1;continue}if("`"===a){let o=t+1;for(;"`"===e[o];)o+=1;let l=o-t;0===i?i=l:i===l&&(i=0),t=o-1;continue}if(0===i){if("("===a){r+=1;continue}if(")"===a){r=Math.max(0,r-1);continue}","===a&&0===r&&(l.push(e.slice(n,t).trim()),n=t+1)}}return l.push(e.slice(n,o).trim()),l}function ek(e,t=e){let o=[],l=new RegExp(ey);for(;;){let n=l.exec(e);if(!n)break;let r=e[n.index-1];if("@"===r||r?.charCodeAt(0)===92)continue;let i=n.index+n[0].length;for(;/\s/u.test(e[i]??"");)i+=1;if("("!==e[i])continue;let a=ef(e,i);if(null===a)break;let s=ew(t,i,a),c=s[0]??"",u=function(e,t,o){let l=0;for(let n=t+1;n<=o;n+=1){let t=e[n];if(92===t.charCodeAt(0)&&n<o){n+=1;continue}if("`"===t){let t=n+1;for(;"`"===e[t];)t+=1;let o=t-n;0===l?l=o:l===o&&(l=0),n=t-1;continue}if(0===l&&")"===t)return n}return o}(t,i,a);o.push({content:c,deferred:function(e){let t=0;for(let o=0;o<e.length;o+=1){if("`"===e[o]&&e[o-1]?.charCodeAt(0)!==92){let l=o+1;for(;"`"===e[l];)l+=1;let n=l-o;0===t?t=n:t===n&&(t=0),o=l-1;continue}if(!(0!==t||"@"!==e[o]||"@"===e[o-1]||e[o-1]?.charCodeAt(0)===92||/^[\p{L}\p{N}_]$/u.test(e[o-1]??""))&&/^[\p{L}_]$/u.test(e[o+1]??""))return!0}return!1}(c)||u<a,kind:ev[n[1]],options:s[1]??"",trailingSource:u<a?t.slice(u+1,a+1):""}),l.lastIndex=a+1}return o}function ex(e){let t=[];for(let o of el(e))for(let e of ek(o.content,o.rawContent))t.push({...e,catalogEligible:o.lootIfCatalogEligible,section:o.section});return t}function ez(e){let t,o,l=en(),n=[],r=(o=new Set((t=(0,d.buildPuzzleCatalog)(eN(e))).gates.filter(e=>e.valid&&null!==e.color).map(e=>e.color)),new Set(t.pieces.filter(e=>e.valid&&null!==e.color&&o.has(e.color)).map(e=>e.sourceOrder))),i=null,a=()=>n[n.length-1]?.catalog??l;for(let[t,o]of el(e).entries()){if(o.section!==i&&(n.length=0,i=o.section),!o.lootIfCatalogEligible)continue;let e=function(e){let t=M.exec(e);if(t){let e=V(t[1]);return{catalog:ep(e,t[2]??""),kind:e}}let o=S.exec(e);if(!o)return null;let l=V(o[2]);return{catalog:ep(l,o[3]),kind:l}}(o.content);if(e){n.push({catalog:en(),marker:e});continue}let l=function(e){let t=$.exec(e);if(t)return V(t[1]);let o=E.exec(e);return o?V(o[1]):null}(o.content);if(l){let e=n[n.length-1];if(e?.marker.kind!==l)continue;n.pop(),e.marker.catalog&&(er(e.catalog,e.marker.catalog),er(a(),e.catalog));continue}let s=eh(o.content),c=void 0===s?function(e){let t=v.exec(e);if(t)return ec(t[2]);let o=k.exec(e);if(o)return eu(o[2]);let l=x.exec(e);if(l)return ed(l[2]);let n=z.exec(e);if(n)return ed(n[3])}(o.content):s;for(let e of(c&&er(a(),c),ek(o.content,o.rawContent))){let t=eh(e.content);t&&er(a(),t)}for(let e of em(o.content)){let l=eg(t,e.start,o.content.length);if(!r.has(l))continue;let n=function(e){let t=(0,p.parsePuzzlePieceOptions)(e);return t.valid?ei(t.concealment,t.layers):null}(e.options);n&&er(a(),n)}er(a(),function(e){let t=en();for(let o=0;o<e.length;o+=1)if("@"===e[o]&&"@"!==e[o-1]&&e[o-1]?.charCodeAt(0)!==92)for(let[l,n]of Object.entries(ev)){if(e.slice(o+1,o+1+l.length)!==l)continue;let r=o+1+l.length;for(;/\s/u.test(e[r]??"");)r+=1;if("("!==e[r])break;let i=ef(e,r);if(null===i)break;let a=ep(n,ew(e,r,i)[1]??"");a&&er(t,a);break}return t}(o.content));let u=C.exec(o.content);u&&(a()[u[2]]+=1),er(a(),function(e){let t=en(),o=e.toLocaleLowerCase("de-DE");for(let l=0;l<e.length;l+=1)if("@"===e[l]&&"@"!==e[l-1]&&e[l-1]?.charCodeAt(0)!==92)for(let[n,r]of Object.entries(eb)){if(o.slice(l+1,l+1+n.length)!==n)continue;let i=l+1+n.length;for(;/\s/u.test(e[i]??"");)i+=1;"("===e[i]&&null!==ef(e,i)&&(t[r]+=1);break}return t}(o.content))}return l}function eS(e,t=!0){let o=[],l=new Map;for(let n of el(e))if(n.lootIfCatalogEligible&&(t||!(n.revealDepth>0)&&!(n.lootIfDepth>0)))for(let e of O(n.content)){let t=P[e.macro],r=J(e.macro,e.placement),i=(l.get(r)??0)+1;l.set(r,i),o.push({baseId:`source-${t}-${ee(r)}-${i}`,placement:e.placement,reward:t,section:n.section})}return o}function eE(e,t=!0){let o=[],l=new Map,n=new Set;for(let r of el(e)){if(!r.lootIfCatalogEligible||!t&&(r.revealDepth>0||r.lootIfDepth>0))continue;let e=g.exec(r.content);if(!e)continue;let i=(e[1]??"").trim(),a=J("Schluessel",i),s=(l.get(a)??0)+1;l.set(a,s);let c=`source-key-${ee(a)}-${s}`,u=c,d=1;for(;n.has(u);)d+=1,u=`${c}-collision-${d}`;n.add(u),o.push({baseId:u,options:i,section:r.section})}return o}function eC(e,t=!0){let o=[],l=new Map;for(let n of el(e)){if(!n.lootIfCatalogEligible||!t&&(n.revealDepth>0||n.lootIfDepth>0))continue;let e=b.exec(n.content);if(!e)continue;let r=e[1],i=r.indexOf(","),a=i>=0?(0,c.parseLockSpecification)(r.slice(0,i),r.slice(i+1)):(0,c.parseLockSpecification)(r),{target:s}=a;if(!a.valid||!a.color)continue;let u=`Schloss(${s.toLowerCase()},${a.color}${a.onlyOnSlide?",anker":""})`,d=(l.get(u)??0)+1;l.set(u,d),o.push({baseId:`source-lock-${ee(u)}-${d}`,target:s,color:a.color,onlyOnSlide:a.onlyOnSlide,section:n.section})}return o}function eL(e){let t=[],o=new Map;for(let l of ex(e))if(l.catalogEligible)for(let e of O(l.content)){let n=P[e.macro],r=`${l.kind}:`+J(e.macro,e.placement),i=(o.get(r)??0)+1;o.set(r,i),t.push({baseId:`source-inline-${n}-${ee(r)}-${i}`,placement:e.placement,reward:n,section:l.section})}return[...eS(e),...function(e){let t=[],o=new Map;for(let l of el(e)){if(!l.lootIfCatalogEligible)continue;let e=v.exec(l.content);if(!e)continue;let n=e[2].trim(),r=e[3].toLowerCase(),i=J(`LootTruhe(${r})`,`${e[1].trim()};${n}`),a=(o.get(i)??0)+1;o.set(i,a),t.push({baseId:`source-internal-${r}-${ee(i)}-${a}`,placement:n,reward:r,section:l.section})}return t}(e),...t]}function e_(e){return[...eC(e),...function(e){let t=[],o=new Map;for(let l of el(e)){if(!l.lootIfCatalogEligible)continue;let e=y.exec(l.content);if(!e)continue;let n=e[2].trim(),r=(0,c.parseLockOptions)(e[3]);if(!r.valid||!r.color)continue;let i=`LootSchloss(${e[1].trim()},${n.toLowerCase()},${r.color}${r.onlyOnSlide?",anker":""})`,a=(o.get(i)??0)+1;o.set(i,a),t.push({baseId:`source-internal-lock-${ee(i)}-${a}`,target:n,color:r.color,onlyOnSlide:r.onlyOnSlide,section:l.section})}return t}(e)]}function eA(e){let t=e.trim();if(!N.test(t))return null;let o=Number(t);return Number.isFinite(o)&&o>=0?o:null}function eI(e){for(let t of el(e)){if(!t.lootIfCatalogEligible||t.lootIfDepth>0)continue;let e=L.exec(t.content);if(!e)continue;let o=eA(e[1]),l=eA(e[2]),n=void 0===e[3]?void 0:eA(e[3]);if(null!==o&&null!==l&&null!==n)return{gold:o,diamonds:l,...void 0===n?{}:{energy:n},section:t.section}}return null}function eT(e){let t=[],o=new Set;for(let l of el(e))!(!l.lootIfCatalogEligible||l.lootIfDepth>0||l.section<0||o.has(l.section))&&_.test(l.content)&&(o.add(l.section),t.push({section:l.section}));return t}function eN(e){let t=[],o=[];for(let[l,n]of el(e).entries()){if(!n.lootIfCatalogEligible||n.section<0)continue;let e=n.revealDepth>0||n.lootIfDepth>0;for(let t of em(n.content))o.push({gated:e,options:t.options,section:n.section,sourceOrder:eg(l,t.start,n.content.length)});let r=I.exec(n.content);r&&t.push({gated:e,options:(r[1]??"").trim(),section:n.section,sourceOrder:l})}return{gates:t,pieces:o}}function eR(e){return el(e).some(e=>e.lootIfCatalogEligible&&0===e.lootIfDepth&&T.test(e.content))}function ej(){let e=window.LIA,t=e?.defaultCourseURL?.trim();if(t)try{let e=new URL(t,window.location.href);if(/^(?:https?:|blob:|data:)$/i.test(e.protocol))return e.href}catch{}return function(e){let t=e.trim();if(!t)return null;let o=[t];try{let e=decodeURIComponent(t);e!==t&&o.push(e)}catch{}return o.find(e=>/^(?:https?:|blob:|data:)/i.test(e))??null}(window.location.search.slice(1))}async function eP(){let e=ej();if(!e)return null;let t=window.LIA,o=t?.fetch??window.fetch.bind(window),l=new AbortController,n=window.setTimeout(()=>l.abort(),4e3);try{let t=await o(e,{cache:"no-cache",credentials:"same-origin",signal:l.signal});if(!t.ok)return null;let n=await t.text();return n.length<=0xa00000?n:null}catch{return null}finally{window.clearTimeout(n)}}async function eO(){if(null!==B)return B;if(W)return W;W=(async()=>{for(let e of R){if(e>0&&await new Promise(t=>window.setTimeout(t,e)),null!==B)return B;let t=await eP();if(null!==t)return B=t,t}return null})();try{return await W}finally{W=null}}async function eM(){let e=await eO();return e?eS(e,!1):[]}async function e$(){let e=await eO();return e?eE(e,!1):[]}async function eq(){let e=await eO();return e?eo(e):null}async function eD(){let e=await eO();return e?{version:eo(e),revision:et(e)}:null}async function eH(){let e=await eO();return e?eC(e,!1):[]}async function eK(){let e=await eO();return e?{declarations:eS(e,!1),catalog:eL(e)}:{declarations:[],catalog:[]}}async function eG(){let e=await eO();return e?{declarations:eC(e,!1),catalog:e_(e)}:{declarations:[],catalog:[]}}async function eF(){let e=await eO();return e?eI(e):null}async function eV(){let e=await eO();return e?eT(e):[]}async function eB(){let e=await eO();if(null===e)throw Error("Die LiaScript-Kursquelle konnte nicht geladen werden.");return eN(e)}async function eW(){let e=await eO();return!!e&&eR(e)}async function eU(){let e=await eO();return e?ez(e):en()}async function eZ(){let e=await eO();return e?ex(e):[]}async function eY(){let e=await eO();if(null===e)throw Error("Die LiaScript-Kursquelle konnte nicht geladen werden.");return eT(e)}},{"./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./exploration-options.ts":"fw9xf","./key-colors.ts":"7rSfY","./lock-options.ts":"3c981","./loot-if-options.ts":"6qN0r","./puzzle-catalog.ts":"30ewL","./puzzle-options.ts":"b2TzD","./surface-targets.ts":"dYwdL","./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8e3cc":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"MAX_COLLECTIBLE_DELAY_MS",()=>i),n.export(o,"COLLECTIBLE_THEMES",()=>a),n.export(o,"COLLECTIBLE_VARIANTS",()=>s),n.export(o,"isOnlyOnSlideOption",()=>_),n.export(o,"parseCollectibleOptions",()=>A),n.export(o,"collectibleRuleUsesEnvironment",()=>N),n.export(o,"collectibleEnvironmentMatches",()=>R),n.export(o,"currentCollectibleEnvironment",()=>M),n.export(o,"collectibleVisibilitySignature",()=>H),n.export(o,"advanceCollectibleReveal",()=>K),n.export(o,"CollectibleVisibilityGate",()=>G);var r=e("./template-targets.ts");let i=0x7fffffff,a=["red","yellow","turquoise","blue"],s=["dark","light"],c=new Set(["anker","nur auf folie","nur-auf-folie","folie","only on slide","only-on-slide","slide only","slide-only"]),u=new Set(["dark mode","dark-mode","darkmode","dunkelmodus"]),d=new Set(["hellmodus","light mode","light-mode","lightmode"]),p=new Set(["annotation-aus","annotation-hidden","annotations-aus","annotations-hidden","ohne annotation","ohne annotationen","ohne-annotation","ohne-annotationen","without annotations","without-annotations"]),h=/^(?:farbtheme|theme)[\s:=_-]+(.+)$/u,f=/^(?:farbmodus|variant)[\s:=_-]+(.+)$/u,m=/^(?:annotation|annotationen)[\s:=_-]+(.+)$/u,g={blau:"blue",blue:"blue",default:"turquoise",gelb:"yellow",red:"red",rot:"red",standard:"turquoise",tuerkis:"turquoise",turkis:"turquoise",turquoise:"turquoise",türkis:"turquoise",yellow:"yellow"},b={dark:"dark",dunkel:"dark",hell:"light",light:"light"},v=new Set(["aus","false","hidden","off","versteckt"]),y=/^(?:(?:erst\s+)?nach\s+|nach\s*=\s*)?(\d+(?:[.,]\d+)?)\s*(s|sek|sekunde|sekunden|m|min|minute|minuten)$/u,w=/^(?:ank\p{L}*|nur(?:\s+|-)|only(?:\s+|-)|slide(?:\s+|-)?only|(?:erst\s+)?nach(?:\s|=|$)|\d+(?:[.,]\d+)?\s*\p{L}|(?:farbtheme|theme|farbmodus|variant|annotationen?)(?:\s|:|=|_|-)|dark\p{L}*|light\p{L}*|dunkel\p{L}*|hell\p{L}*|ohne(?:\s+|-)annotation|annotations?(?:\s+|-)aus|without(?:\s+|-)annotations?)|(?:\bfoli\p{L}*\b|\bslides?\b|\bsek\p{L}*\b|\bmin(?:ute|uten)?\b)/u,k={annotationsVisible:!1,theme:"turquoise",variant:"light"},x=new Set,z=new Map,S=null,E=null,C=!1;function L(e){return e.normalize("NFKC").replace(/\s+/gu," ").trim().toLocaleLowerCase("de-DE")}function _(e){return c.has(L(e))}function A(e){let t=[],o=[],l=0,n=!1,r=!1,k=!1,x=!1,z=new Set,S=new Set;for(let a of e.split(";")){let e=a.trim();if(!e)continue;let s=L(e);if(c.has(s)){k=!0,r=!0;continue}let E=function(e){let t=h.exec(e);return t?{matched:!0,theme:g[t[1].trim()]??null}:{matched:!1,theme:null}}(s);if(E.matched){r=!0,E.theme?z.add(E.theme):o.push(`Unbekanntes Theme: ${e}`);continue}let C=function(e){let t=f.exec(e);return t?{matched:!0,variant:b[t[1].trim()]??null}:{matched:!1,variant:null}}(s);if(C.matched){r=!0,C.variant?S.add(C.variant):o.push(`Unbekannter Farbmodus: ${e}`);continue}let _=function(e){let t=m.exec(e);return t?{matched:!0,annotationsOff:v.has(t[1].trim())}:{matched:!1,annotationsOff:!1}}(s);if(_.matched){r=!0,_.annotationsOff?x=!0:o.push(`Unbekannte Annotationsbedingung: ${e}`);continue}if(u.has(s)){S.add("dark"),r=!0;continue}if(d.has(s)){S.add("light"),r=!0;continue}if(p.has(s)){x=!0,r=!0;continue}let A=function(e){let t=y.exec(e);if(!t)return{matched:!1,value:null};let o=Number(t[1].replace(",","."))*(["s","sek","sekunde","sekunden"].includes(t[2])?1e3:6e4);return{matched:!0,value:Number.isFinite(o)&&o>=0&&o<=i?o:null}}(s);if(A.matched){r=!0,null===A.value?o.push(`Ung\xfcltige Verz\xf6gerung: ${e}`):n?o.push("Die Verzögerung darf nur einmal angegeben werden."):(l=A.value,n=!0);continue}if(w.test(s)){r=!0,o.push(`Unbekannte Sichtbarkeitsoption: ${e}`);continue}t.push(e)}return{errors:o,hasOptions:r,rule:{delayMs:l,onlyOnSlide:k,onlyWithoutAnnotations:x,themes:a.filter(e=>z.has(e)),variants:s.filter(e=>S.has(e))},valid:0===o.length,values:t}}function I(e){return a.filter(t=>e.themes?.includes(t))}function T(e){return s.filter(t=>e.variants?.includes(t))}function N(e){return I(e).length>0||T(e).length>0||!0===e.onlyWithoutAnnotations}function R(e,t){let o=I(e),l=T(e);return(0===o.length||null!==t.theme&&o.includes(t.theme))&&(0===l.length||null!==t.variant&&l.includes(t.variant))&&(!e.onlyWithoutAnnotations||!t.annotationsVisible)}function j(e){try{return(0,r.templateDocumentCandidates)(e)}catch{return[e]}}function P(e){if("string"!=typeof e)return;let t=L(e);return["default","standard","tuerkis","turkis","turquoise","türkis"].includes(t)?"turquoise":a.includes(t)?t:null}function O(e){let t=function(e){try{let t=e.defaultView,o=t?.__LIA_ANNOTATION__?.getStore?.()?.ui?.visible;return"boolean"==typeof o?o:void 0}catch{return}}(e),o=function(e){try{let t=[...e.querySelectorAll(".lia-annot-toolbar")];if(0===t.length)return;let o=!1;for(let e of t){let t=e.querySelector("button[data-act='toggle']");if(!t)return!0;let l=(0,r.annotationToggleIsHidden)(t),n="true"===t.getAttribute("aria-pressed")||"1"===t.getAttribute("data-active");if(l&&n||n||!l)return!0;o=!0}return!o&&void 0}catch{return}}(e);if(void 0!==t&&void 0!==o)return t!==o||t;if(void 0!==t)return t;if(void 0!==o)return o;try{let t=e.defaultView;return t?.__LIA_ANNOTATION__!=null}catch{return!1}}function M(e){let t=e??("u"<typeof document?void 0:document);if(!t)return{...k};let o=j(t),l=null;for(let e of o)if(l=function(e){let t,o,l=e.documentElement;if(!l)return null;let n=function(e){try{let t=e.defaultView,o=t?.LIA?.settings;if(!o)return{theme:void 0,variant:void 0};let l=P(o.theme??o.data?.theme),n=o.light??o.data?.light;return{theme:l,variant:"boolean"==typeof n?n?"light":"dark":void 0}}catch{return{theme:void 0,variant:void 0}}}(e),r=function(e){let t=[...e.classList].filter(e=>e.startsWith("lia-theme-"));if(0!==t.length)return t.length>1?null:P(t[0].slice(10))}(l),i=(t=l.classList.contains("lia-variant-dark"),o=l.classList.contains("lia-variant-light"),t&&o?null:t?"dark":o?"light":void 0),a=void 0===r?n.theme:r,s=void 0===i?n.variant:i;return void 0===a||void 0===s?null:{theme:a,variant:s}}(e))break;return{annotationsVisible:o.some(O),theme:l?l.theme:k.theme,variant:l?l.variant:k.variant}}function $(e){return`${e.theme??"other"}:${e.variant??"other"}:${+!!e.annotationsVisible}`}function q(e){return e&&"object"==typeof e&&"function"==typeof e.matches?e:null}function D(e){let t=q(e);return!!t&&(!!t.matches(".lia-annot-toolbar, button[data-act='toggle']")||!!t.querySelector?.(".lia-annot-toolbar, .lia-annot-toolbar button[data-act='toggle']"))}function H(e){return`${+!!e.onlyOnSlide}:${e.delayMs}:${I(e).join(",")||"-"}:${T(e).join(",")||"-"}:${+!!e.onlyWithoutAnnotations}`}function K(e,t,o,l){let n=H(e),r=t?.signature===n?t:null,i=!e.onlyOnSlide||l;if(!r&&i&&(r={signature:n,startedAt:Number.isFinite(o)?o:0}),!r)return{state:null,visible:!1,wakeAt:null};let a=r.startedAt+e.delayMs,s=o>=a;return{state:r,visible:s&&(!e.onlyOnSlide||l),wakeAt:s?null:a}}class G{constructor(e=()=>Date.now(),t=(e,t)=>window.setTimeout(e,t),o=e=>window.clearTimeout(e),l=M){this.states=new Map,this.wakes=new Map,this.environmentCallbacks=new Map,this.stopObservingEnvironment=null,this.now=e,this.schedule=t,this.cancel=o,this.environment=l}visible(e,t,o,l){this.trackEnvironment(e,t,l);let n=this.now(),r=K(t,this.states.get(e)??null,n,o);return r.state?this.states.set(e,r.state):this.states.delete(e),this.syncWake(e,r.wakeAt,n,l),r.visible&&(!N(t)||R(t,this.environment()))}forget(e){this.states.delete(e);let t=this.wakes.get(e);t&&this.cancel(t.handle),this.wakes.delete(e),this.environmentCallbacks.delete(e),this.stopEnvironmentObserverWhenUnused()}trackEnvironment(e,t,o){var l;if(!N(t)){this.environmentCallbacks.delete(e),this.stopEnvironmentObserverWhenUnused();return}this.environmentCallbacks.set(e,o),this.stopObservingEnvironment??=(l=()=>{for(let e of new Set(this.environmentCallbacks.values()))e()},"u"<typeof document?()=>void 0:(x.add(l),function e(t){for(let o of j(t)){if(z.has(o)||!o.documentElement)continue;let t=o.defaultView?.MutationObserver;if(!t)continue;let l=[],n=t=>{t.some(e=>{var t,l;return t=o,"attributes"===(l=e).type?"class"===l.attributeName&&l.target===t.documentElement||!!["aria-pressed","data-active"].includes(l.attributeName??"")&&!!q(l.target)?.matches(".lia-annot-toolbar button[data-act='toggle']"):"childList"===l.type&&[...l.addedNodes,...l.removedNodes].some(D)})&&(C||(C=!0,queueMicrotask(()=>{C=!1;let t=S;if(!t)return;e(t);let o=$(M(t));if(o!==E)for(let e of(E=o,[...x]))e()})))};try{let e=new t(n);e.observe(o.documentElement,{attributeFilter:["class"],attributes:!0}),l.push(e);let r=new t(n);r.observe(o.documentElement,{attributeFilter:["aria-pressed","data-active"],attributes:!0,childList:!0,subtree:!0}),l.push(r),z.set(o,l)}catch{for(let e of l)e.disconnect()}}}(S??=document),E??=$(M(S)),()=>{if(x.delete(l),!(x.size>0)){for(let e of z.values())for(let t of e)t.disconnect();z.clear(),S=null,E=null}}))}stopEnvironmentObserverWhenUnused(){!(this.environmentCallbacks.size>0)&&this.stopObservingEnvironment&&(this.stopObservingEnvironment(),this.stopObservingEnvironment=null)}syncWake(e,t,o,l){let n=this.wakes.get(e);if(n&&n.at===t||(n&&this.cancel(n.handle),this.wakes.delete(e),null===t))return;let r=this.schedule(()=>{let t=this.wakes.get(e);t&&t.handle===r&&(this.wakes.delete(e),l())},Math.max(0,t-o));this.wakes.set(e,{at:t,handle:r})}}},{"./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"9odGA":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"TEMPLATE_TARGETS",()=>r),n.export(o,"normalizeTemplateTarget",()=>a),n.export(o,"templateDocumentCandidates",()=>s),n.export(o,"annotationToggleIsHidden",()=>c),n.export(o,"TEMPLATE_TARGET_DEFINITIONS",()=>w),n.export(o,"TEMPLATE_TARGET_LABELS",()=>k),n.export(o,"resolveTemplateTarget",()=>E),n.export(o,"isTemplateTarget",()=>C),n.export(o,"templateTargetDefinition",()=>L),n.export(o,"templateTargetPresent",()=>_),n.export(o,"templateElementIsVisible",()=>A),n.export(o,"findTemplateTargets",()=>I),n.export(o,"findTemplateTarget",()=>T);let r=["dynflex","timer","boardmode","marker","markerquiz","annotation","canvasocr","kachel","mathpath","llm","coordinate","freeze"];function i(e){return e.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[\s_-]+/g,"")}function a(e){return i(e)}function s(e){let t=[],o=e=>{!e||"object"!=typeof e||"function"!=typeof e.querySelectorAll||t.includes(e)||t.push(e)};for(let t of(o(e),b(e)))try{o(t.document)}catch{}return t}function c(e){return e?.getAttribute("aria-pressed")==="false"||e?.getAttribute("data-active")==="0"}function u(e,t){let o=[];for(let l of s(e))try{for(let e of l.querySelectorAll(t))o.includes(e)||o.push(e)}catch{}return o}function d(e,t){return{target:e,root:t,chestAnchor:t,lockAnchor:t,lockControls:[t],focusCandidates:[t]}}function p(e,t,o,l=t){return{target:e,root:t,chestAnchor:l,lockAnchor:o,lockControls:o?[o]:[],focusCandidates:o?[o,t]:[t]}}function h(e,t,o,l,n=t){return{target:e,root:t,chestAnchor:n,lockAnchor:o,lockControls:l,focusCandidates:[...l,t]}}function f(e,t){return{target:e,root:t,chestAnchor:t,lockAnchor:null,lockControls:[],focusCandidates:[t]}}function m(e){let t=new Set;return e.filter(e=>!t.has(e.root)&&(t.add(e.root),!0))}function g(e){let t=e.closest(".lia-quiz");if(t)return t;let o=e.closest("main.lia-slide__content");if(!o)return null;let l=e;for(;l.parentElement&&l.parentElement!==o;)l=l.parentElement;if(l.parentElement!==o)return null;let n=l.previousElementSibling;for(;n;){if(n.matches(".lia-quiz"))return n;let e=n.querySelectorAll(".lia-quiz");if(e.length>0)return e[e.length-1];n=n.previousElementSibling}return null}function b(e){let t=[],o=e=>{e&&"object"==typeof e&&(t.includes(e)||t.push(e))},l=e.defaultView;o(l);try{o(l?.parent)}catch{}try{o(l?.top)}catch{}return"u">typeof window&&o(window),t}function v(e,t){let o=e;for(let e of t.split(".")){if(!o||"object"!=typeof o&&"function"!=typeof o)return;try{o=o[e]}catch{return}}return o}let y=[{id:"dynflex",aliases:["lia-dynflex","flex","flexbereich"],importName:"lia-DynFlex",label:"DynFlex-Bereich",presenceGlobals:["__LIA_DYNFLEX_V1_0__"],runtimeSelector:"[data-dynflex-doc]",scope:"slide",locate:e=>u(e,".dynFlex").map(e=>d("dynflex",e))},{id:"timer",aliases:["lia-timer","quiztimer","zeit"],importName:"lia-timer",label:"Quiz-Timer",presenceGlobals:["__LIA_SOLUTION_TIMER_V0_0_1__"],runtimeSelector:"#__lia_solution_timer_css_v0_0_1__, .lia-sol-timer-badge[data-sol-timer-ui]",scope:"slide",locate:e=>{let t=u(e,"[data-solution-timer], [data-hint-timer]"),o=u(e,".lia-sol-timer-startbtn[data-sol-timer-ui='solution'], .lia-sol-timer-startbtn[data-sol-timer-ui='hint']"),l=t.map(e=>h("timer",e,null,[])),n=new Map;for(let e of o){let t=(e.matches(".lia-quiz")?e:e.closest(".lia-quiz"))??e.parentElement??e,o=n.get(t)??[];o.push(e),n.set(t,o)}for(let[e,t]of n){let o=h("timer",e,t[0]??null,t,t[0]??e);o.chestAvailable=!1,l.push(o)}return l}},{id:"boardmode",aliases:["lia-board-mode","board-modus","schriftgroesse","boardmodefontbutton","fontbutton"],importName:"lia-board-mode",label:"Board-Mode-Schriftsteuerung",presenceGlobals:["__LIA_TFF_REG_V2__"],runtimeSelector:"#lia-tff-btn-v2",scope:"global",locate:e=>{let t=u(e,"#lia-tff-panel-v2");return u(e,"#lia-tff-btn-v2").map(e=>{let o=t.find(t=>t.ownerDocument===e.ownerDocument),l=p("boardmode",e.parentElement??e,e,e);return l.chestAvailable=void 0!==o,o&&(l.chestContainer=o),l})}},{id:"marker",aliases:["lia-marker","textmarker","highlighter","textmarkerbutton","markerbutton"],importName:"lia-marker",label:"Textmarker-Werkzeug",presenceGlobals:["__LIA_TEXTMARKER_REG_V4__"],runtimeSelector:"#lia-hl-btn",scope:"global",locate:e=>{let t=u(e,"#lia-hl-panel > .body");return u(e,"#lia-hl-btn").map(e=>{let o=t.find(t=>t.ownerDocument===e.ownerDocument),l=p("marker",e.parentElement??e,e,e);return l.chestAvailable=void 0!==o,o&&(l.chestContainer=o),l})}},{id:"markerquiz",aliases:["textmarkerquiz","marker-quiz","highlightquiz"],importName:"lia-marker",label:"Textmarker-Quiz",presenceGlobals:["__LIA_TEXTMARKER_REG_V4__"],runtimeSelector:".hlq-proxy",scope:"slide",locate:e=>m(u(e,".hlq-proxy").map(e=>e.closest(".markerquiz")??e).map(e=>d("markerquiz",e)))},{id:"annotation",aliases:["lia-annotation","annotieren","zeichenleiste","annotationsbar","annotationbar"],importName:"lia-annotation",label:"Anmerkungs-Werkzeugleiste",presenceGlobals:["__LIA_ANNOTATION__"],runtimeSelector:".lia-annot-toolbar",scope:"global",locate:e=>u(e,".lia-annot-toolbar").map(e=>{let t=e.querySelector("button[data-act='toggle']");return{target:"annotation",root:e,chestAnchor:e,chestAvailable:c(t),chestPosition:"below",lockAnchor:e,lockControls:[e],focusCandidates:t?[t,e]:[e]}})},{id:"canvasocr",aliases:["lia-canvas-ocr","canvas-ocr","zeichenflaeche"],importName:"lia-canvas-ocr",label:"Canvas-/OCR-Zeichenfläche",presenceGlobals:["__LIA_CANVAS_OCR__"],runtimeSelector:".lia-canvas-pair",scope:"slide",locate:e=>u(e,".lia-canvas-pair").map(e=>{let t=e.querySelector(".lia-canvas-mount"),o=t?.querySelector("canvas.lia-draw")??null,l=e.querySelector(".lia-canvas-launch");return{target:"canvasocr",root:e,chestAnchor:o??t??e,chestAvailable:t?.getAttribute("data-open")==="1"&&null!==o,lockAnchor:e,lockControls:[e],focusCandidates:l?[l,e]:[e]}})},{id:"kachel",aliases:["lia-kachel","kachelfolge","tiles"],importName:"lia-kachel",label:"Kachelaufgabe",presenceGlobals:["LiaKachel.kachelfolge"],runtimeSelector:"[data-lia-kachelfolge]",scope:"slide",locate:e=>u(e,"[data-lia-kachelfolge], div.Kachel").filter(e=>e.hasAttribute("data-lia-kachelfolge")||!e.querySelector("[data-lia-kachelfolge]")).map(e=>d("kachel",e))},{id:"mathpath",aliases:["lia-mathpath","erklaerpfad","explain"],importName:"lia-mathpath",label:"MathPath-Erklärquiz",presenceGlobals:["__LIA_MATHPATH__"],runtimeSelector:".lia-quiz[data-lia-explain-enabled='1'], .lia-quiz[data-hint-button='1'][data-adetail-tags], .lia-mathpath-explain-list",scope:"slide",locate:e=>m(u(e,".lia-quiz[data-lia-explain-enabled='1'], .lia-quiz[data-hint-button='1'][data-adetail-tags], .lia-mathpath-explain-list").map(e=>e.matches(".lia-quiz")?e:e.closest(".lia-quiz")??e).map(e=>{let t=[...e.querySelectorAll("a.lia-mathpath-explain-link[data-lia-explain-href]")].filter(A);return h("mathpath",e,t[0]??null,t)}))},{id:"llm",aliases:["lia-llm","llmquiz","kiquiz"],importName:"lia-llm",label:"LLM-Quiz",presenceGlobals:["LiaLLM.version"],runtimeSelector:"lia-llm-quiz-use, lia-llm-feedback[id^='lia-llm-feedback-']",scope:"slide",locate:e=>m(u(e,"lia-llm-quiz-use, lia-llm-feedback[id^='lia-llm-feedback-']").map(g).filter(e=>null!==e).map(e=>d("llm",e)))},{id:"coordinate",aliases:["lia-coordinate","koordinaten","koordinatensystem"],importName:"lia-coordinate",label:"Koordinatensystem",presenceGlobals:["__coord"],scope:"slide",locate:e=>(function(e){let t=s(e),o=[];for(let l of b(e)){let e=v(l,"__boards");if(e&&"object"==typeof e)for(let l of Object.values(e)){if(!l||"object"!=typeof l)continue;let e=l.containerObj;e&&"object"==typeof e&&(1!==e.nodeType||"function"!=typeof e.matches||!e.matches(".jxgbox")||!t.includes(e.ownerDocument)||o.includes(e)||o.push(e))}}return o})(e).map(e=>d("coordinate",e))},{id:"freeze",aliases:["lia-freeze-v2","abgabe","submission"],importName:"lia-freeze-v2",label:"Freeze-Abgabe",presenceGlobals:[],runtimeSelector:"#lia-submission-runtime-style",scope:"slide",locate:e=>m(u(e,".lia-submit-box, #lia-exam-overlay > .lia-exam-intro-virtual-slide, .lia-adetails-points, #lia-freeze-bar, #lia-eval-placeholder").map(e=>{if(e.matches("#lia-eval-placeholder"))return f("freeze",e);let t=[...e.querySelectorAll("button, input, textarea, select, a[href], [tabindex]")];return 0===t.length?f("freeze",e):h("freeze",e,e,[...new Set(t)])}))}],w=y,k=Object.fromEntries(y.map(e=>[e.id,e.label])),x=new Map(y.map(e=>[e.id,e])),z=new Set(r),S=new Map;for(let e of y)for(let t of[e.id,...e.aliases]){let o=i(t),l=S.get(o);if(l&&l!==e.id)throw Error(`Loot: Template-Zielalias ${t} kollidiert zwischen ${l} und ${e.id}.`);S.set(o,e.id)}function E(e){return e?S.get(i(e))??null:null}function C(e){return z.has(e)}function L(e){return x.get(e)}function _(e,t=document){let o=L(e),l=o.presenceGlobals.length>0||void 0!==o.customElement;for(let e of b(t))if(o.presenceGlobals.some(t=>void 0!==v(e,t))||o.customElement&&function(e,t){try{return!!e.customElements?.get(t)}catch{return!1}}(e,o.customElement))return!0;return!l&&!!o.runtimeSelector&&u(t,o.runtimeSelector).length>0}function A(e){if(!1===e.isConnected||e.hasAttribute?.("hidden")||e.getAttribute?.("aria-hidden")==="true"||e.closest?.("[hidden], [aria-hidden='true']"))return!1;let t=e.ownerDocument?.defaultView;if(t?.getComputedStyle)try{let o=e;for(;o;){let e=t.getComputedStyle(o);if("none"===e.display||"hidden"===e.visibility||"collapse"===e.visibility||0===Number(e.opacity))return!1;o=o.parentElement}}catch{}if("function"==typeof e.getClientRects)try{return e.getClientRects().length>0}catch{return!1}return!0}function I(e,t,o=document){if(!_(e,o))return[];let l=L(e).locate(o),n=[];for(let e of l)if(A(e.root)){if("chest"===t){if(!1===e.chestAvailable)continue;A(e.chestAnchor)&&n.push(e);continue}e.lockAnchor&&e.lockControls.length>0&&A(e.lockAnchor)&&n.push(e)}return n}function T(e,t,o=document){return I(e,t,o)[0]??null}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8YWP0":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"CONCEALMENT_ATTRIBUTE",()=>r),n.export(o,"CONCEALMENT_SELECTOR",()=>i),n.export(o,"CONCEALMENT_CHANGED_EVENT",()=>a),n.export(o,"extractConcealmentOptions",()=>d),n.export(o,"concealmentModeOf",()=>p),n.export(o,"concealmentIdOf",()=>f),n.export(o,"concealedContentOf",()=>m),n.export(o,"prepareConcealedHost",()=>g),n.export(o,"notifyConcealmentLayoutChanged",()=>b),n.export(o,"setHostConcealment",()=>v);let r="data-loot-concealment",i=`[${r}]`,a="lia-loot:concealment-changed",s=[["data-loot-chest-button","chest"],["data-loot-key-button","key"],["data-loot-magnifier-button","magnifier"],["data-loot-tool-pickup","tool"],["data-loot-puzzle-pickup","puzzle"]],c={dust:"dust",solid:"solid",unsichtbar:"solid",verdeckt:"solid",zauberstaub:"dust"};function u(e){return e.trim().toLocaleLowerCase("de-DE")}function d(e){let t=[],o=[],l=null;for(let n of e){let e=c[u(n)];if(!e){o.push(n);continue}if(l){t.push(l===e?`Die Verbergungsoption \u{201E}${n}\u{201C} wurde doppelt angegeben.`:"„unsichtbar“ und „zauberstaub“ können nicht gleichzeitig verwendet werden.");continue}l=e}return{errors:t,mode:l,values:o}}function p(e){let t=u(e.getAttribute(r)??"");return"solid"===t||"dust"===t?t:null}function h(e){let t=e?.trim()??"";return t&&!t.startsWith("@")?t:null}function f(e){let t=h(e.getAttribute("data-loot-concealment-id"));if(t)return t;let o=h(e.getAttribute("data-secret-id"));if(o)return`secret:${o}`;let l=h(e.getAttribute("data-loot-reveal-cover-slot"));if(l)return`reveal:${l}`;for(let[t,o]of s){let l=e.querySelector(`[${t}]`),n=h(l?.getAttribute(t)??null);if(n)return`${o}:${n}`}return null}function m(e){return[...e.children].find(e=>e.classList.contains("loot-magnifier-secret__content"))??null}function g(e){let t=p(e);if(!t)return null;let o=m(e);return o||((o=document.createElement("span")).className="loot-magnifier-secret__content",e.appendChild(o)),[...e.childNodes].filter(e=>e!==o).forEach(e=>o.appendChild(e)),e.classList.add("loot-magnifier-secret"),e.classList.toggle("loot-magnifier-secret--solid","solid"===t),e.classList.toggle("loot-magnifier-secret--dust","dust"===t),e.dataset.lootConcealmentReady="true",t}function b(e){e.dispatchEvent(new CustomEvent(a,{bubbles:!0}))}function v(e,t){let o=p(e);if(!t){let t=m(e);t&&t.replaceWith(...t.childNodes),e.removeAttribute(r),delete e.dataset.lootConcealmentReady,e.classList.remove("loot-magnifier-secret","loot-magnifier-secret--solid","loot-magnifier-secret--dust","loot-magnifier-secret--under-lens"),e.style.removeProperty("--loot-magnifier-x"),e.style.removeProperty("--loot-magnifier-y"),e.removeAttribute("aria-hidden"),e.inert=!1,o&&b(e);return}e.setAttribute(r,t),g(e),o!==t&&(e.classList.remove("loot-magnifier-secret--under-lens"),e.setAttribute("aria-hidden","true"),e.inert=!0,b(e))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],fw9xf:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"TOOL_KINDS",()=>r),n.export(o,"REVEAL_KINDS",()=>i),n.export(o,"parseExplorationOptions",()=>c);let r=["shovel","watering-can"],i=["soil","plant"],a={erde:"soil",erdhaufen:"soil",soil:"soil",dirt:"soil",pflanze:"plant",blume:"plant",plant:"plant",flower:"plant"},s={dust:"dust",solid:"solid",unsichtbar:"solid",verdeckt:"solid",zauberstaub:"dust"};function c(e){let t=[],o=[];for(let l of("string"==typeof e?[e]:e).flatMap(e=>e.split(";"))){let e=l.trim();if(!e)continue;let n=e.normalize("NFKC").trim().toLocaleLowerCase("de-DE"),r=n.lastIndexOf("-");if(r>0){let e=a[n.slice(0,r)],o=s[n.slice(r+1)];if(e&&o){t.push({kind:e,concealment:o});continue}}let i=a[n];if(i){t.push({kind:i,concealment:null});continue}o.push(e)}return{layers:t,values:o}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"3c981":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"parseLockOptions",()=>s),n.export(o,"parseLockSpecification",()=>c);var r=e("./collectible-visibility.ts"),i=e("./key-colors.ts");function a(e){return/^@\d+$/u.test(e.trim())?"":e}function s(e){let t=[],o=[],l=!1;for(let o of e.split(";")){let e=o.trim();e&&((0,r.isOnlyOnSlideOption)(e)?l=!0:t.push(e))}1!==t.length&&o.push("Ein Schloss benötigt genau eine Schlüsselfarbe.");let n=1===t.length?(0,i.requestedKeyColor)(t[0]):null;return 1!==t.length||n||o.push(`Unbekannte Schl\xfcsselfarbe oder Schlossoption: ${t[0]}`),{color:n,errors:o,onlyOnSlide:l,valid:0===o.length&&null!==n}}function c(e,t=""){let o=a(e).trim(),l=a(t).trim();if(!l){let[e="",...t]=o.split(";");o=e.trim(),l=t.join(";")}return{target:o,...s(l)}}},{"./collectible-visibility.ts":"8e3cc","./key-colors.ts":"7rSfY","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"6qN0r":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"LOOT_IF_ACTIONS",()=>i),n.export(o,"MARKER_COLORS",()=>a),n.export(o,"normalizeHighlightedWord",()=>c),n.export(o,"parseLootIfCondition",()=>f),n.export(o,"compareLootIfNumbers",()=>m),n.export(o,"parseLootIfOptions",()=>g);var r=e("./lock-targets.ts");let i=["spawn"],a=["yellow","green","blue","pink","orange","red"];function s(e){return e.trim().toLocaleLowerCase("de-DE").normalize("NFD").replace(/[\u0300-\u036f]/gu,"").replace(/ß/gu,"ss").replace(/[‐‑‒–—−_]+/gu,"-").replace(/\s+/gu," ")}function c(e){return e.trim().toLocaleLowerCase("de-DE").normalize("NFKC").replace(/\s+/gu," ")}function u(e){return s(e).replace(/[\s-]+/gu,"-")}function d(e,t=!1){let o=e.trim().replace(",",".");if(!/^\d+(?:\.\d+)?$/u.test(o))return null;let l=Number(o);return!Number.isFinite(l)||l<0||l>Number.MAX_SAFE_INTEGER||t&&!Number.isInteger(l)?null:l}function p(e){let t=u(e);return["schatztruhe","schatztruhen","goldkiste","goldkisten"].includes(t)?"gold":["diamantkiste","diamantkisten","diamantenkiste","diamantenkisten","diamanttruhe","diamanttruhen","diamond-chest","diamond-chests"].includes(t)?"diamonds":["energiekiste","energiekisten","energy-chest","energy-chests"].includes(t)?"energy":["treasure-chest","treasure-chests"].includes(t)?"gold":null}function h(e){return({yellow:"yellow",gelb:"yellow",green:"green",grun:"green",gruen:"green",blue:"blue",blau:"blue",pink:"pink",rosa:"pink",orange:"orange",red:"red",rot:"red"})[u(e)]??null}function f(e){let t,o=u(e);if(["vorherige-aufgabe","vorherige-aufgabe-gelost","vorherige-aufgabe-geloest","previous-task","previous-task-solved","previous-quiz","previous-quiz-solved"].includes(o))return{kind:"previous-quiz"};if(["folienaufgaben-gelost","folienaufgaben-geloest","aktuelle-folie-gelost","aktuelle-folie-geloest","alle-aufgaben-der-aktuellen-folie-gelost","alle-aufgaben-der-aktuellen-folie-geloest","slide-tasks-solved","slide-quizzes-solved"].includes(o))return{kind:"current-slide-quizzes"};if(["geheimfolie-besucht","geheime-folie-besucht"].includes(o)||"secret-slide-visited"===o)return{kind:"secret-slide-visited"};if(["lupe-gefunden","lupe-eingesammelt"].includes(o)||"magnifier-found"===o)return{kind:"magnifier-found"};let l=/^\s*(?:puzzletor|puzzle-gate)\s*:\s*(.+?)\s*$/iu.exec(e)??/^\s*(rot(?:es)?|blau(?:es)?|gr(?:ü|ue)n(?:es)?|gelb(?:es)?|lila(?:farbenes)?|orangefarbenes|magentafarbenes|wei(?:ß|ss)es|schwarzes|t(?:ü|ue)rkisfarbenes|graues|braunes)\s+puzzletor\s+(?:geöffnet|geoeffnet)\s*$/iu.exec(e);if(l){let e={rot:"red",red:"red",blau:"blue",blue:"blue",grun:"green",gruen:"green",green:"green",gelb:"yellow",yellow:"yellow",lila:"purple",violett:"purple",purple:"purple",orange:"orange",magenta:"magenta",weiss:"white",white:"white",schwarz:"black",black:"black",turkis:"turquoise",tuerkis:"turquoise",turquoise:"turquoise",grau:"gray",gray:"gray",grey:"gray",braun:"brown",brau:"brown",brown:"brown"}[u(l[1].replace(/farbenes$/iu,"").replace(/es$/iu,""))]??null;if(e)return{kind:"puzzle-gate-opened",color:e}}let n=function(e){let t=/^\s*(?:markiert|marked)\s*(?:=|:)\s*([^:]+?)\s*$/iu.exec(e)??/^\s*(?:ein\s+)?wort\s+(?:wurde\s+)?mit\s+(?:der\s+farbe\s+)?([^\s]+)\s+markiert\s*$/iu.exec(e);if(t){let e=h(t[1]);if(e)return{kind:"word-highlighted",color:e,word:null}}let o=/^\s*(?:markiert|marked)\s*:\s*([^:]+?)\s*:\s*(.+?)\s*$/iu.exec(e);if(o){let e=h(o[1]),t=o[2].trim();if(e&&t)return{kind:"word-highlighted",color:e,word:t}}let l=/^\s*wort\s+(?:"([^"]+)"|„([^“]+)“|'([^']+)'|(.+?))\s+mit\s+(?:der\s+farbe\s+)?([^\s]+)\s+markiert\s*$/iu.exec(e);if(!l)return null;let n=h(l[5]),r=(l[1]??l[2]??l[3]??l[4]??"").trim();return n&&r?{kind:"word-highlighted",color:n,word:r}:null}(e);if(n)return n;let i=/^mindestens\s+(\d+)\s+(?:bewertbare\s+)?aufgaben\s+(?:gelost|geloest)$/u.exec(s(e));if(i){let e=d(i[1],!0);return null===e?null:{kind:"solved-quizzes",comparator:">=",value:e}}let a=/^(\d+)\s+(.+?)\s+(?:geoffnet|geoeffnet|eingesammelt)$/u.exec(s(e));if(a){let e=p(a[2]),t=d(a[1],!0);if(e&&null!==t)return{kind:"opened-chests",reward:e,comparator:">=",value:t}}let c=/^(?:schloss|lock)\s*:\s*(.+?)\s*$/iu.exec(e)??/^\s*schloss\s+(.+?)\s+(?:geoffnet|geoeffnet|entsperrt)\s*$/iu.exec(s(e));if(c){let e=(0,r.resolveLockTarget)(c[1]);if(e)return{kind:"lock-opened",target:e}}let f=function(e){let t,o=s(e),l=/^(.*?)\s*(>=|=>|<=|=<|==|=|>|<|mindestens|hochstens|grosser(?:\s+oder\s+gleich)?|kleiner(?:\s+oder\s+gleich)?|gleich)\s*(\d+(?:[.,]\d+)?)$/u.exec(o);if(!l)return null;let n=">"===(t=s(l[2]))||"grosser"===t?">":">="===t||"=>"===t||"mindestens"===t||"grosser oder gleich"===t?">=":"="===t||"=="===t||"gleich"===t?"=":"<="===t||"=<"===t||"hochstens"===t||"kleiner oder gleich"===t?"<=":"<"===t||"kleiner"===t?"<":null;return n?{comparator:n,label:l[1].trim(),value:l[3]}:null}(e);if(!f)return null;let m=d(f.value);if(null===m)return null;if(["aufgaben","bewertbare-aufgaben","geloste-aufgaben","geloeste-aufgaben","tasks","quizzes","scoreable-tasks"].includes(u(f.label)))return Number.isInteger(m)?{kind:"solved-quizzes",comparator:f.comparator,value:m}:null;let g=["gold","munzen","goldmunzen","coins"].includes(t=u(f.label))?"gold":["diamant","diamanten","diamonds","gems"].includes(t)?"diamonds":["energie","energy"].includes(t)?"energy":null;if(g)return{kind:"resource",resource:g,comparator:f.comparator,value:m};let b=p(f.label);return b&&Number.isInteger(m)?{kind:"opened-chests",reward:b,comparator:f.comparator,value:m}:null}function m(e,t,o){return!!Number.isFinite(e)&&!!Number.isFinite(o)&&(">"===t?e>o:">="===t?e>=o:"="===t?e===o:"<="===t?e<=o:e<o)}function g(e){let t=(e??"").split(";").map(e=>e.trim()),o=[];(2!==t.length||t.some(e=>0===e.length||/^@\d+$/u.test(e)))&&o.push("Erwartet wird @lootif(Trigger; spawn).");let l=t[0]?f(t[0]):null;l||o.push("Der lootif-Trigger ist unbekannt oder ungültig.");let n="spawn"===s(t[1]??"")?"spawn":null;return n||o.push('Als Aktion wird derzeit nur "spawn" unterstützt.'),{action:n,condition:l,errors:o,valid:0===o.length&&2===t.length}}},{"./lock-targets.ts":"1CWW8","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1CWW8":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"GLOBAL_LOCK_TARGETS",()=>i),n.export(o,"LOCAL_LOCK_TARGETS",()=>a),n.export(o,"ITEM_LOCK_TARGETS",()=>s),n.export(o,"TEMPLATE_LOCK_TARGETS",()=>c),n.export(o,"resolveLockTarget",()=>f),n.export(o,"isGlobalLockTarget",()=>m),n.export(o,"isLocalLockTarget",()=>g),n.export(o,"isItemLockTarget",()=>b),n.export(o,"isTemplateLockTarget",()=>v);var r=e("./template-targets.ts");let i=["toc","mode","menu","translator","classroom","info","seitenwechsel"],a=["check","resolve","hint","pentominoquiz"],s=["portal"],c=r.TEMPLATE_TARGETS,u={toc:"toc",inhaltsverzeichnis:"toc",mode:"mode",darstellung:"mode",ansicht:"mode",menu:"menu",menue:"menu",einstellungen:"menu",settings:"menu",translator:"translator",translate:"translator",ubersetzer:"translator",uebersetzer:"translator",sprache:"translator",classroom:"classroom",klasse:"classroom",teilen:"classroom",share:"classroom",info:"info",information:"info",informationen:"info",seitenwechsel:"seitenwechsel",seitennavigation:"seitenwechsel",navigation:"seitenwechsel",pages:"seitenwechsel",page:"seitenwechsel",check:"check",prufen:"check",pruefen:"check",resolve:"resolve",auflosen:"resolve",aufloesen:"resolve",losung:"resolve",loesung:"resolve",solution:"resolve",hint:"hint",hinweis:"hint",pentominoquiz:"pentominoquiz",pentominoquizn:"pentominoquiz",pentominodockquiz:"pentominoquiz",pentominodockquizn:"pentominoquiz",pentominodockquizauswahl:"pentominoquiz",pentominodockquizauswahln:"pentominoquiz",portal:"portal",folienportal:"portal",slideportal:"portal"},d=new Set(i),p=new Set(a),h=new Set(s);function f(e){return e?u[e.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[\s_-]+/g,"")]??(0,r.resolveTemplateTarget)(e)??null:null}function m(e){return d.has(e)}function g(e){return p.has(e)}function b(e){return h.has(e)}function v(e){return(0,r.isTemplateTarget)(e)}},{"./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"30ewL":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"buildPuzzleCatalog",()=>s),n.export(o,"validPuzzleGateConfigurations",()=>c);var r=e("./puzzle-options.ts");function i(e){return({red:"rot",blue:"blau",green:"gruen",yellow:"gelb",purple:"lila",orange:"orange",magenta:"magenta",white:"weiss",black:"schwarz",turquoise:"tuerkis",gray:"grau",brown:"braun"})[e]}function a(e,t){e.errors.includes(t)||e.errors.push(t),e.valid=!1}function s(e){let t=[],o=[],l=[];for(let l of e.gates){let e=function(e){let t=(0,r.parsePuzzleGateOptions)(e.options);return{...e,...t,errors:[...t.errors],id:t.color?"puzzle-gate:"+t.color:"puzzle-gate:invalid:"+e.section+":"+e.sourceOrder,pattern:t.matrix.flat()}}(l);e.color||t.push("Puzzletor auf Folie "+(l.section+1)+": "+e.errors.join(" ")),o.push(e)}for(let o of e.pieces){let e=function(e){let t=(0,r.parsePuzzlePieceOptions)(e.options);return t.color&&null!==t.number?{...e,...t,errors:[...t.errors],id:"puzzle-piece:"+t.color+":"+t.number}:null}(o);if(!e){let e=(0,r.parsePuzzlePieceOptions)(o.options);t.push("Puzzleteil auf Folie "+(o.section+1)+": "+e.errors.join(" "));continue}l.push(e)}let n=new Map;for(let e of o){if(!e.color)continue;let t=n.get(e.color)??[];t.push(e),n.set(e.color,t)}for(let[e,t]of n)if(t.length>1){let o="Für die Farbe "+i(e)+" darf es nur ein Puzzletor geben.";t.forEach(e=>a(e,o))}let s=new Map;for(let e of l){let t=s.get(e.color)??[];t.push(e),s.set(e.color,t)}for(let e of o){if(e.gated&&a(e,"Ein Puzzletor darf nicht innerhalb von @lootif, @Erdhaufen oder @Pflanze stehen."),!e.color){e.valid=!1;continue}let t=e.color,o=s.get(t)??[];for(let t of o)t.valid||a(e,"Puzzleteil "+t.number+": "+t.errors.join(" "));let l=new Map;for(let t of(o.forEach(e=>l.set(e.number,(l.get(e.number)??0)+1)),e.pattern)){let o=l.get(t)??0;0===o?a(e,"Das Puzzleteil "+t+" fehlt."):o>1&&a(e,"Das Puzzleteil "+t+" wurde mehrfach deklariert.")}for(let t of o)e.pattern.includes(t.number)||a(e,"Puzzleteil "+t.number+" gehört nicht zur Matrix dieses Tors."),(t.section>e.section||t.section===e.section&&t.sourceOrder>e.sourceOrder)&&a(e,"Puzzleteil "+t.number+" liegt hinter seinem eigenen Tor.");e.valid=e.valid&&0===e.errors.length}for(let[e,o]of s)n.has(e)||t.push("Für "+o.length+" Puzzleteil(e) der Farbe "+i(e)+" fehlt ein Puzzletor.");return o.sort((e,t)=>e.sourceOrder-t.sourceOrder),l.sort((e,t)=>e.sourceOrder-t.sourceOrder),{errors:t,gates:o,pieces:l,signature:"puzzle-"+function(e){let t=0x811c9dc5;for(let o=0;o<e.length;o+=1)t^=e.charCodeAt(o),t=Math.imul(t,0x1000193);return(t>>>0).toString(36)}(JSON.stringify([...e.gates.map(({gated:e,options:t,section:o,sourceOrder:l})=>({kind:"gate",gated:e,options:t.trim(),section:o,sourceOrder:l})),...e.pieces.map(({gated:e,options:t,section:o,sourceOrder:l})=>({kind:"piece",gated:e,options:t.trim(),section:o,sourceOrder:l}))].sort((e,t)=>e.sourceOrder-t.sourceOrder).map(({sourceOrder:e,...t})=>t)))}}function c(e){return e.gates.filter(e=>e.valid&&null!==e.color).map(e=>({color:e.color,pattern:[...e.pattern]}))}},{"./puzzle-options.ts":"b2TzD","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],b2TzD:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"MAX_PUZZLE_SLOTS",()=>c),n.export(o,"PUZZLE_COLORS",()=>u),n.export(o,"parsePuzzleGateOptions",()=>g),n.export(o,"parsePuzzlePieceOptions",()=>b);var r=e("./collectible-visibility.ts"),i=e("./concealment.ts"),a=e("./exploration-options.ts"),s=e("./surface-targets.ts");let c=16,u=["rot","blau","gruen","gelb","lila","orange","magenta","weiss","schwarz","tuerkis","grau","braun"],d={rot:"red",blau:"blue",gruen:"green",grün:"green",gelb:"yellow",lila:"purple",orange:"orange",magenta:"magenta",weiss:"white",weiß:"white",schwarz:"black",tuerkis:"turquoise",türkis:"turquoise",grau:"gray",braun:"brown",brau:"brown"},p=/^[+-]?(?:(?:\d+(?:[.,]\d*)?)|(?:[.,]\d+))(?:e[+-]?\d+)?$/iu;function h(e){return e.normalize("NFKC").replace(/\s+/gu," ").trim().toLocaleLowerCase("de-DE")}function f(e){return d[h(e)]??null}function m(e,t){if(""===e.trim())return{errors:[],tokens:[]};let o=[],l=[],n=0,r=0;for(let t=0;t<e.length;t+=1){let i=e[t];if("["===i){n+=1;continue}if("]"===i){(n-=1)<0&&(o.push("Die Puzzle-Angabe enthält eine schließende Klammer ohne Öffnung."),n=0);continue}";"===i&&0===n&&(l.push(e.slice(r,t)),r=t+1)}l.push(e.slice(r)),0!==n&&o.push("Die eckigen Klammern der Puzzle-Angabe sind nicht ausgeglichen.");let i=l.map(e=>e.trim());return i.some(e=>""===e)&&o.push(t),{errors:o,tokens:i.filter(e=>""!==e)}}function g(e){let t=m(e,"Das Puzzletor enthält eine leere Option."),o=[...t.errors],l=[],n=[],r=0;for(let e of t.tokens){let t=f(e);if(t){l.push(t);continue}if("anker"===h(e)){r+=1;continue}if(e.startsWith("[")||e.endsWith("]")){n.push(function(e){let t=[],o=e.trim();if(!o.startsWith("[")||!o.endsWith("]"))return{errors:["Die Puzzle-Matrix muss als [[Zelle;Zelle];[Zelle;Zelle]] angegeben werden."],matrix:[]};let l=m(o.slice(1,-1),"Die Puzzle-Matrix enthält eine leere Zeile.");t.push(...l.errors);let n=[];for(let e of l.tokens){let o=e.trim();if(!o.startsWith("[")||!o.endsWith("]")){t.push(`Ung\xfcltige Puzzle-Zeile: ${e}`);continue}let l=o.slice(1,-1);if(l.includes("[")||l.includes("]")){t.push(`Ung\xfcltig verschachtelte Puzzle-Zeile: ${e}`);continue}let r=l.split(";").map(e=>e.trim());if(0===r.length||r.some(e=>""===e)){t.push(`Die Puzzle-Zeile enth\xe4lt eine leere Zelle: ${e}`);continue}let i=[],a=!0;for(let e of r){if(!/^[1-9]\d*$/u.test(e)){t.push(`Ung\xfcltige Puzzleteilnummer in der Matrix: ${e}`),a=!1;continue}let o=Number(e);if(!Number.isSafeInteger(o)){t.push(`Zu gro\xdfe Puzzleteilnummer in der Matrix: ${e}`),a=!1;continue}i.push(o)}a&&n.push(i)}if(0===n.length)return t.push("Die Puzzle-Matrix benötigt mindestens eine Zeile mit einer Zelle."),{errors:t,matrix:[]};let r=n[0].length;n.some(e=>e.length!==r)&&t.push("Die Puzzle-Matrix muss streng rechteckig sein.");let i=n.flat();i.length>c&&t.push(`Ein Puzzletor darf h\xf6chstens ${c} Slots enthalten.`);let a=new Set(Array.from({length:i.length},(e,t)=>t+1)),s=new Set(i);return(s.size!==i.length||s.size!==a.size||[...a].some(e=>!s.has(e)))&&t.push(`Die Puzzle-Matrix muss jede Zahl von 1 bis ${i.length} genau einmal enthalten.`),{errors:t,matrix:n}}(e));continue}o.push(`Unbekannte Puzzletoroption: ${e}`)}1!==l.length&&o.push("Ein Puzzletor benötigt genau eine Farbe."),1!==n.length&&o.push("Ein Puzzletor benötigt genau eine Puzzle-Matrix."),r>1&&o.push("Die Puzzletoroption „anker“ darf nur einmal angegeben werden.");let i=1===n.length?n[0]:null;i&&o.push(...i.errors);let a=i?.matrix??[],s=a.length,u=s>0?a[0].length:0,d=a.reduce((e,t)=>e+t.length,0),p=1===l.length?l[0]:null;return{color:p,columns:u,errors:o,matrix:a,onlyOnSlide:1===r,rows:s,slotCount:d,valid:0===o.length&&null!==p&&s>0&&u>0&&d<=c}}function b(e){let t=m(e,"Das Puzzleteil enthält eine leere Option."),o=[...t.errors],l=t.tokens[0],n=t.tokens[1],u=t.tokens.slice(2),d=l?f(l):null;l?d||o.push(`Unbekannte Puzzleteilfarbe: ${l}`):o.push("Ein Puzzleteil benötigt als erste Angabe eine Farbe.");let h=null;if(n)if(/^[1-9]\d*$/u.test(n)){let e=Number(n);!Number.isSafeInteger(e)||e>c?o.push(`Die Puzzleteilnummer muss zwischen 1 und ${c} liegen: ${n}`):h=e}else o.push(`Ung\xfcltige Puzzleteilnummer: ${n}`);else o.push("Ein Puzzleteil benötigt als zweite Angabe eine positive Nummer.");let g=u.join("; "),b=(0,r.parseCollectibleOptions)(g),v=(0,a.parseExplorationOptions)(b.values),y=(0,i.extractConcealmentOptions)(v.values);return o.push(...b.errors,...function(e){let t=[],o=new Set;for(let l of e){let e=(0,r.parseCollectibleOptions)(l);if(!e.valid||!e.hasOptions||e.values.length>0)continue;let n=null,i=l;e.rule.onlyOnSlide?(n="anker",i="anker"):e.rule.themes?.length===1?(n=`theme:${e.rule.themes[0]}`,i=`Theme ${e.rule.themes[0]}`):e.rule.variants?.length===1?(n=`variant:${e.rule.variants[0]}`,i=`Farbmodus ${e.rule.variants[0]}`):e.rule.onlyWithoutAnnotations?(n="annotations:hidden",i="Annotationen aus"):(n="duration",i="Verzögerung"),o.has(n)?t.push(`Die Puzzleteiloption \u{201E}${i}\u{201C} wurde doppelt angegeben.`):o.add(n)}return t}(u),...y.errors,...y.values.map(e=>(0,s.resolveSurfaceTarget)(e)?`Oberfl\xe4chenziele sind f\xfcr Puzzleteile nicht zul\xe4ssig: ${e}`:f(e)?`Die Puzzleteilfarbe darf nur einmal und an erster Stelle angegeben werden: ${e}`:p.test(e)?`Die Puzzleteilnummer darf nur einmal und an zweiter Stelle angegeben werden: ${e}`:`Unbekannte Puzzleteiloption: ${e}`)),{color:d,concealment:y.mode,errors:o,layers:v.layers,number:h,valid:0===o.length&&null!==d&&null!==h,visibility:b.rule}}},{"./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./exploration-options.ts":"fw9xf","./surface-targets.ts":"dYwdL","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],dYwdL:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"SURFACE_TARGETS",()=>r),n.export(o,"resolveSurfaceTarget",()=>u),n.export(o,"isSurfaceTarget",()=>d),n.export(o,"surfaceTargetElement",()=>p),n.export(o,"surfaceTargetIsGrouped",()=>h);let r=["toc","menu","classroom","info","translator","mode"],i=[{aliases:[],grouped:!1,id:"toc",selector:"#lia-toc .lia-toc__content"},{aliases:[],grouped:!0,id:"menu",selector:"#lia-support-menu .lia-support-menu__item--settings .lia-support-menu__submenu"},{aliases:[],grouped:!0,id:"classroom",selector:"#lia-support-menu .lia-support-menu__item--share .lia-support-menu__submenu"},{aliases:[],grouped:!0,id:"info",selector:"#lia-support-menu .lia-support-menu__item--info .lia-support-menu__submenu"},{aliases:["translate","translation","lang","übersetzer","uebersetzer"],grouped:!0,id:"translator",selector:"#lia-support-menu .lia-support-menu__item--lang .lia-support-menu__submenu"},{aliases:["display","view","darstellung"],grouped:!0,id:"mode",selector:"#lia-support-menu .lia-support-menu__item--mode .lia-support-menu__submenu"}],a=new Map(i.map(e=>[e.id,e])),s=new Map;function c(e){return e.trim().toLocaleLowerCase("de-DE")}for(let e of i)for(let t of[e.id,...e.aliases])s.set(c(t),e.id);function u(e){return e?s.get(c(e))??null:null}function d(e){return a.has(e)}function p(e,t=document){if("toc"===e){let e=t.querySelector("#lia-toc #lia-bm-toc5 > .bm-list");if(e)return e}return t.querySelector(a.get(e).selector)}function h(e){return a.get(e).grouped}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5qduG":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"activeLiaSection",()=>m),n.export(o,"sectionFromLootId",()=>g),n.export(o,"sourceSlideIsActive",()=>b),n.export(o,"liaSlideIsAccessible",()=>v),n.export(o,"setLiaSlideAccessGuard",()=>w),n.export(o,"refreshLiaSlideActivity",()=>k),n.export(o,"observeLiaSlideActivity",()=>E);let r=".lia-slide__container",i=".lia-slide__container > main.lia-slide__content:not([hidden])",a=new Set,s=()=>!0,c=null,u=null,d=null,p=null,h=!1;function f(e){let t=/^#(\d+)$/.exec(e);if(!t)return null;let o=Number(t[1])-1;return Number.isInteger(o)&&o>=0?o:null}function m(){let e=document.querySelector(i),t=e?.parentElement;if(e&&t){let o=[...t.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(e);if(o>=0)return o}let o=document.querySelector("#lia-toc #focusedToc.lia-toc__link");if(o){let e=function(e){try{return f(new URL(e.href,window.location.href).hash)}catch{return f(e.getAttribute("href")??"")}}(o);if(null!==e)return e}return f(window.location.hash)}function g(e){let t=/(?:^|:)(\d+)_\d+(?::|$)/.exec(e);if(!t)return null;let o=Number(t[1]);return Number.isInteger(o)&&o>=0?o:null}function b(e,t){let o=m();if(!s(o??e))return!1;if(null!==e&&null!==o)return e===o;let l=t?.closest("main");return!!(l&&!l.hidden&&l.classList.contains("lia-slide__content"))}function v(e){return s(e)}function y(){for(let e of a)e()}function w(e){s=e,y()}function k(){y()}function x(e){for(let t of(u?.disconnect(),u=new MutationObserver(t=>{t.some(t=>t.target instanceof HTMLElement&&"MAIN"===t.target.tagName&&t.target.parentElement===e)&&y()}),e.children))t instanceof HTMLElement&&"MAIN"===t.tagName&&u.observe(t,{attributeFilter:["class","hidden"],attributes:!0})}function z(){let e,t=(e=document.querySelector(i),e?.parentElement?.classList.contains(r.slice(1))?e.parentElement:[...document.querySelectorAll(r)].find(e=>[...e.children].some(e=>e instanceof HTMLElement&&"MAIN"===e.tagName))??null);t===c||(u?.disconnect(),d?.disconnect(),c=t,t&&(x(t),(d=new MutationObserver(()=>{x(t),y()})).observe(t,{childList:!0}),y()))}function S(e){return e instanceof Element&&(e.matches(r)||null!==e.querySelector(r)||null!==c&&e.contains(c))}function E(e){return a.add(e),p||(p=new MutationObserver(e=>{(null===c||!1===c.isConnected||e.some(e=>[...e.addedNodes,...e.removedNodes].some(S)))&&z()})).observe(document.documentElement,{childList:!0,subtree:!0}),h||(h=!0,window.addEventListener("hashchange",y),window.addEventListener("pageshow",y),window.addEventListener("popstate",y)),z(),e(),()=>{a.delete(e)}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],kd9xY:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"renderKeyInventory",()=>c),n.export(o,"announceKeyFound",()=>u),n.export(o,"focusKeyInventory",()=>d);var r=e("./key-colors"),i=e("./key-visual"),a=e("./resource-bar");let s="lia-loot-key-inventory";function c(e){let t=r.KEY_COLORS.filter(t=>e[t]>0);if(0===t.length){document.getElementById(s)?.remove(),(0,a.refreshResourceBarVisibility)();return}let o=(function(){let e,t=document.getElementById(s);if(t)return t;let o=document.createElement("div");o.id=s,o.className="loot-key-inventory",o.setAttribute("role","group"),o.setAttribute("aria-label","Schlüsselinventar"),o.tabIndex=-1;let l=document.createElement("ul");return l.className="loot-key-inventory__list",l.setAttribute("role","list"),o.append(l,((e=document.createElement("span")).className="loot-key-inventory__status",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e)),(0,a.installResourceBar)().appendChild(o),o})().querySelector(".loot-key-inventory__list");if(o){for(let l of(o.replaceChildren(),t)){let t=r.KEY_COLOR_DETAILS[l].foundMessage.replace(/\s+gefunden\.$/,"");for(let n=0;n<e[l];n+=1){let r=document.createElement("li");r.className=`loot-key-inventory__item loot-key-color--${l}`,r.dataset.lootKeyColor=l,r.dataset.lootKeyInstance=`${l}-${n+1}`,r.setAttribute("aria-label",1===e[l]?t:`${t}, Exemplar ${n+1} von ${e[l]}`);let a=(0,i.createKeyGraphic)(l);a.classList.add("loot-key-inventory__icon"),r.append(a),o.appendChild(r)}}(0,a.refreshResourceBarVisibility)()}}function u(e){let t=document.querySelector(".loot-key-inventory__status");t&&(t.textContent="",window.setTimeout(()=>{t.textContent=e},0))}function d(){document.getElementById(s)?.focus({preventScroll:!0})}},{"./key-colors":"7rSfY","./key-visual":"iQm7z","./resource-bar":"1KrGH","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],iQm7z:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function r(e){let t=document.createElementNS("http://www.w3.org/2000/svg","svg");return t.setAttribute("viewBox","0 0 48 32"),t.setAttribute("shape-rendering","crispEdges"),t.setAttribute("aria-hidden","true"),t.classList.add("loot-key-graphic",`loot-key-color--${e}`),t.innerHTML=`
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
  `,t}n.defineInteropFlag(o),n.export(o,"createKeyGraphic",()=>r)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1KrGH":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"installResourceBar",()=>d),n.export(o,"refreshResourceBarVisibility",()=>p),n.export(o,"renderResources",()=>h),n.export(o,"showInsufficientResource",()=>f),n.export(o,"announceResource",()=>m);let r="lia-loot-resource-bar",i="lia-loot-resource-status",a=["header",".lia-header","[role='banner']"];function s(e,t){let o,l=document.createElement("div");l.className="loot-resource loot-resource--hidden",l.setAttribute("aria-label",`${t}: 0`);let n=document.createElement("span");return n.className="loot-resource-value",n.dataset.lootResource=e,n.textContent="0",l.append(((o=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("viewBox","0 0 32 32"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-resource-icon",`loot-resource-icon--${e}`),o.innerHTML="coins"===e?'<ellipse cx="16" cy="8" rx="10" ry="5"/><path d="M6 8v6c0 2.8 4.5 5 10 5s10-2.2 10-5V8"/><path d="M6 14v6c0 2.8 4.5 5 10 5s10-2.2 10-5v-6"/>':"gems"===e?'<path d="M8 5h16l5 7-13 15L3 12l5-7Z"/><path d="m3 12 8-2 5 17 5-17 8 2M8 5l3 5 5-5 5 5 3-5"/>':'<path d="M19 2 7 18h8l-2 12 12-18h-8l2-10Z"/>',o),n),l}function c(){let e,t=document.getElementById(i);if(t)return t.parentElement!==document.body&&document.body.appendChild(t),t;let o=((e=document.createElement("span")).id=i,e.className="loot-resource-status",e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e);return document.body.appendChild(o),o}function u(){for(let e of a){let t=document.querySelector(e);if(t&&t.id!==r&&!t.closest(`#${r}`))return t}return null}function d(){let e=document.getElementById(r);if(e)return c(),e;let t=document.createElement("aside");t.id=r,t.className="loot-resource-bar loot-resource-bar--empty",t.setAttribute("aria-label","Ressourcen und Inventar"),t.append(s("coins","Goldmünzen"),s("gems","Diamanten"),s("energy","Energie")),document.body.appendChild(t),c();let o=()=>{let e,o;return o=(e=u())?Math.max(0,e.getBoundingClientRect().bottom):0,void t.style.setProperty("--loot-resource-top",`${Math.round(o)}px`)};o(),window.addEventListener("resize",o,{passive:!0}),window.addEventListener("scroll",o,{passive:!0});let l=u();return l&&"ResizeObserver"in window&&new ResizeObserver(o).observe(l),t}function p(){let e=document.getElementById(r);if(!e)return;let t=[...e.querySelectorAll(".loot-resource")].some(e=>!e.classList.contains("loot-resource--hidden")),o=null!==e.querySelector("[data-loot-key-color]"),l=null!==e.querySelector("[data-loot-magnifier-tool]"),n=null!==e.querySelector("[data-loot-tool-control]"),i=null!==e.querySelector("[data-loot-puzzle-inventory-piece]");e.classList.toggle("loot-resource-bar--empty",!t&&!o&&!l&&!n&&!i)}function h(e,t,o=null){d();let l={coins:e,gems:t,energy:o},n={coins:"Goldmünzen",gems:"Diamanten",energy:"Energie"};for(let e of["coins","gems","energy"]){let t=document.querySelector(`[data-loot-resource="${e}"]`),r=t?.parentElement,i="energy"===e&&null===o;if(r?.classList.toggle("loot-resource--hidden",i),!t||i)continue;let a=l[e],s=Math.max(0,Math.floor("number"==typeof a&&Number.isFinite(a)?a:0));t.textContent=s.toLocaleString("de-DE"),r?.setAttribute("aria-label",`${n[e]}: ${s}`)}p()}function f(e){d();let t=document.querySelector(`[data-loot-resource="${e}"]`),o=t?.parentElement,l=document.querySelector(".loot-resource-status");o&&l&&(o.classList.remove("loot-resource--insufficient"),o.offsetWidth,o.classList.add("loot-resource--insufficient"),o.addEventListener("animationend",()=>o.classList.remove("loot-resource--insufficient"),{once:!0}),l.textContent="coins"===e?"Nicht genug Gold für einen Hinweis.":"gems"===e?"Nicht genug Diamanten zum Auflösen.":"Keine Energie mehr zum Prüfen oder Starten.")}function m(e){let t=c();t.textContent="",window.setTimeout(()=>{t.textContent=e},0)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],aEHXm:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"surfaceKeyInstanceId",()=>O),n.export(o,"parseKeyPickupOptions",()=>D),n.export(o,"pruneStaleKeySourceMatches",()=>F),n.export(o,"sourceCatalogCoversKeyHost",()=>V),n.export(o,"splitSurfaceKeyPlacements",()=>Q),n.export(o,"discardObservedKeyWrites",()=>en),n.export(o,"keyMutationBatchNeedsSync",()=>er),n.export(o,"installKeyPickups",()=>es);var r=e("./key-colors.ts"),i=e("./course-chests.ts"),a=e("./key-visual.ts"),s=e("./collectible-visibility.ts"),c=e("./concealment.ts"),u=e("./exploration-options.ts"),d=e("./exploration.ts"),p=e("./slide-activity.ts"),h=e("./surface-targets.ts");let f="lia-loot-key",m="data-loot-key-placement",g="data-loot-key-tray",b=null,v=0,y=new Set,w=new Set,k=new WeakSet,x=new Set,z=new(0,s.CollectibleVisibilityGate),S=new Map,E=new Map,C=new Set,L=new Map,_=new Map,A="idle",I=null,T=null,N=!1,R=!1,j=!1;function P(e){let t=e.getAttribute("data-key-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootKeyRuntimeId;if(o)return o;v+=1;let l=`runtime-${v}`;return e.dataset.lootKeyRuntimeId=l,l}function O(e,t){return`key:${e}:${t}`}function M(e,t){let o,l=document.createElement("button");return l.type="button",l.className=`loot-key-pickup loot-key-color--${t}`,l.dataset.lootKeyButton=e,l.dataset.lootKeyColor=t,l.setAttribute("aria-label",`${r.KEY_COLOR_DETAILS[t].pickupLabel} einsammeln`),l.append((0,a.createKeyGraphic)(t),((o=document.createElement("span")).className="loot-key-pickup__reward",o.setAttribute("aria-hidden","true"),o.textContent="+1",o)),q(l),l}function $(e){let t=function(e){for(let t of e.composedPath())if(t instanceof HTMLButtonElement&&t.hasAttribute("data-loot-key-button"))return t;return e.target instanceof Element?e.target.closest("[data-loot-key-button]"):null}(e),o=t?.dataset.lootKeyButton,l=t?.dataset.lootKeyColor;if(!t||!o||!l||!(l in r.KEY_COLOR_DETAILS)||!b||y.has(o)||!w.has(o))return;if(y.add(o),!b.collect(o,l)){y.delete(o),eo();return}let n=0===e.detail;t.disabled=!0,t.classList.add("loot-key-pickup--collected"),t.setAttribute("aria-label",r.KEY_COLOR_DETAILS[l].foundMessage),window.setTimeout(()=>{y.delete(o),t.remove(),eo(),n&&b?.focusInventory()},650)}function q(e){k.has(e)||(k.add(e),e.addEventListener("click",$))}function D(e){let t=(0,s.parseCollectibleOptions)("@0"===e.trim()?"":e),o=(0,u.parseExplorationOptions)(t.values),l=(0,c.extractConcealmentOptions)(o.values),n=[...t.errors,...l.errors],i=null,a=null;for(let e of l.values){let t=(0,h.resolveSurfaceTarget)(e);if(t){i?n.push("Für einen Schlüssel darf höchstens ein Oberflächenziel angegeben werden."):i=t;continue}if((0,r.isKeyColorRequest)(e)){null!==a?n.push("Für einen Schlüssel darf höchstens eine Farbe angegeben werden."):a=e;continue}n.push(`Unbekannte Schl\xfcsselfarbe, Zielangabe oder Option: ${e}`)}return{concealment:l.mode,errors:n,inline:null===i,layers:o.layers,placement:i,requestedColor:a,valid:0===n.length,visibility:t.rule}}function H(e){(0,d.clearHostRevealLayers)(e),(0,c.setHostConcealment)(e,null),e.childNodes.length>0&&e.replaceChildren()}function K(e,t){x.has(e)||(x.add(e),console.warn(`Loot: Schl\xfcssel ${e} bleibt wegen ung\xfcltiger Optionen verborgen. ${t.join(" ")}`))}function G(e,t){var o;let l;return`${e}:${l=0===t.layers.length?"none":t.layers.map(e=>`${e.kind}-${e.concealment??"visible"}`).join(","),[(o=t.requestedColor,(0,r.requestedKeyColor)(o)??"auto"),t.placement,(0,s.collectibleVisibilitySignature)(t.visibility),t.concealment??"none",l].join(":")}`}function F(e,t){for(let o of e.keys())t.has(o)||e.delete(o)}function V(e,t,o,l){let n=e.get(t);return null!==o&&l>0&&n===o||(n&&e.delete(t),null!==o&&!(l<=0)&&(function(e,t){let o=0;for(let l of e.values())l===t&&(o+=1);return o}(e,o)<l&&e.set(t,o),!0))}function B(e,t){let o=t.sourceSection,l=null===o?null:G(o,t),n=null===l?0:L.get(l)??0;V(_,e,l,n)?S.delete(e):S.set(e,t)}function W(e){for(let e of C)S.delete(e);for(let t of(C.clear(),L.clear(),_.clear(),e)){let e=D(t.options);if(!e.valid){K(t.baseId,e.errors);continue}if(e.inline||!e.placement)continue;let o={baseId:t.baseId,concealment:e.concealment,layers:[...e.layers],placement:e.placement,requestedColor:e.requestedColor,sourceSection:t.section,visibility:e.visibility};S.set(t.baseId,o),C.add(t.baseId);let l=G(t.section,o);L.set(l,(L.get(l)??0)+1)}for(let[e,t]of(A="complete",E))B(e,t);E.clear(),el()}function U(e){let t=e.classList.contains("loot-key-host--surface-source");e.classList.remove("loot-key-host--surface-source"),t&&((0,c.setHostConcealment)(e,null),e.removeAttribute("aria-hidden"))}function Z(e){let t,o=(t=P(e),{...D(e.getAttribute("data-color")?.trim()??""),baseId:t,sourceHost:e,sourceSection:(0,p.sectionFromLootId)(t)});if(!o.valid)return E.delete(o.baseId),S.delete(o.baseId),_.delete(o.baseId),U(e),K(o.baseId,o.errors),H(e),o;if(o.inline||!o.placement)return E.delete(o.baseId),S.delete(o.baseId),_.delete(o.baseId),U(e),o;let l={baseId:o.baseId,concealment:o.concealment,layers:[...o.layers],placement:o.placement,requestedColor:o.requestedColor,sourceHost:o.sourceHost,sourceSection:o.sourceSection,visibility:o.visibility};return"complete"===A?B(o.baseId,l):E.set(o.baseId,l),(0,d.clearHostRevealLayers)(e),(0,c.setHostConcealment)(e,null),e.classList.add("loot-key-host--surface-source"),e.setAttribute("aria-hidden","true"),e.childNodes.length>0&&e.replaceChildren(),o}function Y(e,t,o){return[...e.querySelectorAll("[data-loot-key-button]")].find(e=>e.dataset.lootKeyButton===t&&e.dataset.lootKeyColor===o)??null}function Q(e,t){let o=e.filter(e=>e.dataset.lootKeyPlacement===t);return{duplicates:o.slice(1),primary:o[0]??null}}function X(){return[...document.querySelectorAll(`[${m}]`)]}function J(e){e?.hasAttribute(g)&&!e.querySelector(`[${m}]`)&&e.remove()}function ee(e){if(!e)return;let t=e.parentElement;e.remove(),J(t)}function et(e){let{duplicates:t,primary:o}=Q(X(),e);ee(o),t.forEach(ee)}function eo(){if(!b)return;w.clear();let e=[...document.querySelectorAll(f)];F(_,new Set(e.map(P)));let t=new Map;for(let l of e){var o;if((0,d.hostIsRevealBlocked)(l,!1)){let e=P(l);E.delete(e),S.delete(e),_.delete(e);continue}let e=Z(l);if(!e.valid||!e.inline)continue;let n=(o=e.baseId,`key:${o}:inline`),r=t.get(n)??[];r.push({host:l,request:e}),t.set(n,r)}for(let[e,o]of t){let t=o.find(({host:e,request:t})=>(0,p.sourceSlideIsActive)(t.sourceSection,e))??o[0];for(let e of o)e!==t&&H(e.host);!function(e,t,o){if(!b)return;if(b.collected(t)&&!y.has(t)){w.delete(t),z.forget(`pickup:${t}`),H(e);return}let{color:l}=(0,r.resolveKeyAppearance)(t,o.requestedColor);if(y.has(t))return;if(!(0,p.liaSlideIsAccessible)(o.sourceSection)||!z.visible(`pickup:${t}`,o.visibility,(0,p.sourceSlideIsActive)(o.sourceSection,e),el)){w.delete(t),H(e);return}let n=(0,d.setHostRevealLayers)(e,t,o.layers),i=Y(n,t,l);i||((0,c.setHostConcealment)(n,null),n.replaceChildren(M(t,l)),i=Y(n,t,l)),i&&q(i),(0,c.setHostConcealment)(n,o.concealment),(0,d.hostIsRevealBlocked)(e)?w.delete(t):w.add(t)}(t.host,e,t.request)}!function(){if(!b)return;let e=new Set;for(let t of S.values()){let o=O(t.baseId,t.placement),l=y.has(o);if(!(0,p.liaSlideIsAccessible)(t.sourceSection)&&!l){w.delete(o),et(o);continue}if(b.collected(o)&&!l){w.delete(o),z.forget(`pickup:${o}`),et(o);continue}let n=z.visible(`pickup:${o}`,t.visibility,(0,p.sourceSlideIsActive)(t.sourceSection,t.sourceHost),el);if(!n&&!l){w.delete(o),et(o);continue}e.add(o);let i=X().find(e=>e.dataset.lootKeyPlacement===o)??null;l||(i=function(e,t){let o=(0,h.surfaceTargetElement)(t.placement,document),l=Q(X(),e),n=l.primary;if(l.duplicates.forEach(e=>ee(e)),!o)return ee(n),null;let i=(0,h.surfaceTargetIsGrouped)(t.placement)?function(e,t){let o=e.querySelector(`:scope > [${g}="${t}"]`);if(o)return o;let l=e.matches("ul, ol"),n=document.createElement(l?"li":"div");return n.className="loot-key-tray",n.dataset.lootKeyTray=t,n.setAttribute("role","group"),n.setAttribute("aria-label","Sammelbare Schlüssel"),e.appendChild(n),n}(o,t.placement):o,{color:a}=(0,r.resolveKeyAppearance)(e,t.requestedColor);if(!n){let o=i.matches("ul, ol");(n=document.createElement(o?"li":"div")).className=`loot-key-placement loot-key-placement--${t.placement}`,n.dataset.lootKeyPlacement=e,n.dataset.lootKeyLocation=t.placement,o&&n.setAttribute("role","none")}if(n.parentElement!==i){let e=n.parentElement;i.appendChild(n),J(e)}let s=(0,d.setHostRevealLayers)(n,e,t.layers),u=Y(s,e,a);return u||((0,c.setHostConcealment)(s,null),s.replaceChildren(M(e,a)),u=Y(s,e,a)),u&&q(u),(0,c.setHostConcealment)(s,t.concealment),n}(o,t)),n&&!l&&i&&!(0,d.hostIsRevealBlocked)(i)?w.add(o):w.delete(o),i?.querySelector("[data-loot-key-button]")?.setAttribute("data-loot-key-eligible",String(w.has(o)))}for(let t of X()){let o=t.dataset.lootKeyPlacement;o&&(e.has(o)||y.has(o))||ee(t)}}(),en(I)}function el(){null===T&&(T=window.setTimeout(()=>{T=null,eo()},0))}function en(e){e?.takeRecords()}function er(e){return e.length>0}function ei(e){er(e)&&el()}class ea extends HTMLElement{static get observedAttributes(){return["data-key-id","data-color"]}connectedCallback(){(0,d.hostIsRevealBlocked)(this,!1)||Z(this),el()}attributeChangedCallback(){this.isConnected&&((0,d.hostIsRevealBlocked)(this,!1)||Z(this),el())}}function es(e){b=e,"idle"===A&&(A="pending",(0,i.discoverCourseKeyDeclarations)().then(W).catch(()=>W([]))),N||(N=!0,(0,p.observeLiaSlideActivity)(el)),R||(R=!0,document.addEventListener(d.REVEAL_CHANGED_EVENT,el)),j||(j=!0,document.addEventListener("click",$,!0)),customElements.get(f)||customElements.define(f,ea),I||(I=new MutationObserver(ei)).observe(document.documentElement,{childList:!0,subtree:!0}),eo()}},{"./key-colors.ts":"7rSfY","./course-chests.ts":"2ceW6","./key-visual.ts":"iQm7z","./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./exploration-options.ts":"fw9xf","./exploration.ts":"5BeJ3","./slide-activity.ts":"5qduG","./surface-targets.ts":"dYwdL","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5BeJ3":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"REVEAL_CHANGED_EVENT",()=>E),n.export(o,"EXPLORATION_CHANGED_EVENT",()=>C),n.export(o,"revealLayerSignature",()=>Y),n.export(o,"setHostRevealLayers",()=>eh),n.export(o,"clearHostRevealLayers",()=>ef),n.export(o,"hostIsRevealBlocked",()=>em),n.export(o,"installExploration",()=>eO);var r=e("./collectible-visibility.ts"),i=e("./concealment.ts"),a=e("./exploration-options.ts"),s=e("./exploration-visual.ts"),c=e("./range-gate.ts"),u=e("./resource-bar.ts"),d=e("./slide-activity.ts"),p=e("./template-targets.ts");let h="lia-loot-tool",f="lia-loot-reveal",m="lia-loot-reveal-start",g="lia-loot-reveal-end",b='a[href^="#lia-loot-reveal-end-"]',v="data-loot-reveal-range-controller",y="data-loot-reveal-range-configuring",w="data-loot-reveal-range-blocked",k="data-loot-managed-reveal-root",x="data-loot-reveal-stack-signature",z="data-loot-reveal-final-content",S="data-loot-active-tool",E="lia-loot:reveal-changed",C="lia-loot:exploration-changed",L={shovel:{collectLabel:"Schaufel einsammeln",collectedMessage:"Schaufel gefunden.",label:"Schaufel",slug:"shovel"},"watering-can":{collectLabel:"Gießkanne einsammeln",collectedMessage:"Gießkanne gefunden.",label:"Gießkanne",slug:"watering-can"}},_=null,A=0,I=!1,T=!1,N=!1,R=null,j=[],P=new Set,O=new Set,M=new Set,$=new WeakSet,q=new Set,D=new Set,H=new Map,K=new(0,r.CollectibleVisibilityGate),G=new(0,r.CollectibleVisibilityGate),F=new WeakMap;function V(e){return a.TOOL_KINDS.includes(e)}function B(e){return e.split(";").map(e=>e.trim()).filter(e=>e&&!/^@\d+$/u.test(e)).join("; ")}function W(e,t,o,l){let n=e.getAttribute(t)?.trim();if(n&&!n.startsWith("@"))return n;let r=e.dataset[o];if(r)return r;A+=1;let i=`${l}:runtime-${A}`;return e.dataset[o]=i,i}function U(e,t,o){let l=`${t}:${e}`;D.has(l)||(D.add(l),console.warn(`Loot: ${t} ${e} bleibt wegen ung\xfcltiger Optionen verborgen. ${o.join(" ")}`))}function Z(e){return`${e.kind}:${e.concealment??"visible"}`}function Y(e){return e.map(Z).join(">")}function Q(e){return[...e.children].find(e=>e.hasAttribute(k))??null}function X(e){let t=e;for(;t.parentElement;){let e=t.parentElement,o="DIV"===e.tagName&&0===e.attributes.length;if("P"!==e.tagName&&"SPAN"!==e.tagName&&"LIA-KEEP"!==e.tagName&&!o||[...e.childNodes].some(e=>e!==t&&e.nodeType!==Node.COMMENT_NODE&&(e.nodeType!==Node.TEXT_NODE||!!e.textContent?.trim())))break;t=e}return t}function J(e){let t=X(e.start),o=e.end?X(e.end):null;if(!t.isConnected||null!==o&&!o.isConnected||!e.scope.isConnected)return[];let l=e.scope.ownerDocument.createRange();try{l.setStartAfter(t),o?l.setEndBefore(o):l.setEnd(e.scope,e.scope.childNodes.length)}catch{return[]}let n=[],r=e=>{for(let t of[...e.children]){if(!l.intersectsNode(t))continue;let e=!1;try{e=0===l.comparePoint(t,0)&&0===l.comparePoint(t,t.childNodes.length)}catch{e=!1}e?n.push(t):r(t)}};return r(e.scope),n}function ee(e,t){(0,c.setRangeGate)(e,"reveal",w,t)}function et(){N||(N=!0,queueMicrotask(()=>{N=!1,function(){let e=new Map;document.querySelectorAll(`${m}, ${g}, ${b}`).forEach(t=>{let o=t.closest("[data-loot-reveal-payload], [data-loot-reveal-layer-content], main.lia-slide__content, main")??document.body,l=e.get(o)??[];l.push(t),e.set(o,l)});let t=[];for(let[o,l]of e){let e=[],n=[];for(let t of l){if(t.matches(m)){e.push(t);continue}let o=e[e.length-1];if(!o)continue;let l=o.getAttribute("data-reveal-kind")?.trim(),r=t.getAttribute("data-reveal-kind")?.trim()||(t.matches(b)?t.getAttribute("href")?.slice("#lia-loot-reveal-end-".length).trim():void 0);l&&r&&l!==r||(e.pop(),n.push({end:t,start:o}))}n.forEach(({end:e,start:l})=>{let n=function(e,t){if(!e.isConnected||!t.isConnected)return null;let o=[...e.children].find(e=>e.matches(f)&&e.hasAttribute(v));return o||(o=e.ownerDocument.createElement(f)).setAttribute(v,"true"),o.setAttribute(y,"true"),o.setAttribute("data-reveal-id",e.getAttribute("data-reveal-id")??""),o.setAttribute("data-options",e.getAttribute("data-options")??""),o.removeAttribute(y),o.isConnected||e.appendChild(o),o}(l,e);n&&t.push({controller:n,end:e,scope:o,start:l})}),e.forEach(e=>{t.push({controller:null,end:null,scope:o,start:e})})}let o=new Set;t.forEach(e=>{e.controller&&o.add(e.controller)}),document.querySelectorAll(`${f}[${v}]`).forEach(e=>{o.has(e)||e.remove()}),j=t}(),eA(),document.dispatchEvent(new CustomEvent(E))}))}function eo(e){if(e.nodeType!==Node.ELEMENT_NODE)return!1;let t=`${m}, ${g}, ${b}`;return e.matches(t)||null!==e.querySelector(t)}function el(e){if("attributes"===e.type)return!!e.target.matches(`${m}, ${g}, ${b}`)||"href"===e.attributeName&&!!e.oldValue?.startsWith("#lia-loot-reveal-end-");if([...e.addedNodes,...e.removedNodes].some(eo))return!0;if(e.target.nodeType!==Node.ELEMENT_NODE)return!1;let t=e.target;return!t.closest(`${f}[${v}]`)&&j.some(e=>{let o=[e.start,e.end].filter(e=>null!==e);return t===e.scope||o.some(e=>t===e||t.contains(e)||e.contains(t))})}function en(e){return[...e.children].find(e=>e.hasAttribute("data-loot-reveal-layer-content")||e.hasAttribute("data-loot-reveal-payload"))}function er(e){return(function(e){let t=e,o=null;for(;t;){if(!(o=en(t)))return null;t=[...o.children].find(e=>e.hasAttribute("data-loot-reveal-kind"))}return o})(e)?.querySelector(`:scope > [${z}]`)??null}function ei(e,t,o){return`${e}:reveal:${o}:${Z(t)}`}function ea(e,t){return"soil"===e?"Erdhaufen mit Schaufel wegbuddeln":"bloomed"===t?"Blühende Pflanze öffnen":"Pflanze mit Gießkanne gießen"}function es(e,t,o){let l=o.createElement("button");return l.type="button",l.className=`loot-reveal-cover loot-reveal-cover--${t}`,l.dataset.lootRevealCover=e,l.dataset.lootRevealCoverPhase="locked",l.setAttribute("aria-label",ea(t,"locked")),l.append((0,s.createRevealCoverGraphic)(t,"seedling",o)),l.addEventListener("click",eb),l}function ec(e){(0,u.installResourceBar)(),(0,u.announceResource)(e)}function eu(e){let t,o=e.dataset.lootRevealKind;if("soil"!==o&&"plant"!==o)return!1;let l=function(e){if(!_)return"locked";let t=e.dataset.lootRevealId??"",o=e.dataset.lootRevealKind,l=H.get(t);return"soil"===o?_.isLayerDug(t)&&"digging"!==l?"revealed":"locked":"plant"!==o?"locked":_.isPlantOpened(t)&&"opening"!==l?"revealed":_.isPlantWatered(t)&&"watering"!==l?"bloomed":"locked"}(e),n=e.dataset.lootRevealState,r=[...e.children].find(e=>e.hasAttribute("data-loot-reveal-cover-slot")),a=en(e);if(!r||!a)return!1;let c=r.querySelector(":scope [data-loot-reveal-cover]");c&&(t="bloomed"===l?"bloomed":"locked",c.setAttribute("aria-label",ea(o,l)),c.dataset.lootRevealCoverPhase!==t&&(c.dataset.lootRevealCoverPhase=t,c.replaceChildren((0,s.createRevealCoverGraphic)(o,"bloomed"===t?"bloomed":"seedling",c.ownerDocument))));let u="revealed"===l;a.hidden=!u,a.inert=!u,a.setAttribute("aria-hidden",String(!u)),r.hidden=u,r.inert=u,e.dataset.lootRevealState=l,e.classList.toggle("loot-reveal-layer--bloomed","bloomed"===l),e.classList.toggle("loot-reveal-layer--revealed",u);let d=e.dataset.lootRevealConcealment;return(0,i.setHostConcealment)(r,u||!d?null:d),n!==l}function ed(e){(0,i.notifyConcealmentLayoutChanged)(e),e.dispatchEvent(new CustomEvent(E,{bubbles:!0}))}function ep(e){let t=Q(e);if(!t)return void delete e.dataset.lootRevealBlocked;let o=[],l=t;for(;l;){o.push(l);let e=en(l);l=e?[...e.children].find(e=>e.hasAttribute("data-loot-reveal-kind"))??null:null}let n=!1,r=!1;o.forEach(e=>{n=eu(e)||n,r="revealed"!==e.dataset.lootRevealState||r});let i=e.dataset.lootRevealBlocked;e.dataset.lootRevealBlocked=String(r),(n||i!==String(r))&&ed(e)}function eh(e,t,o){let l,n=Y(o),r=Q(e);if(r&&e.getAttribute(x)===n)return ep(e),er(r)??e;if(!r&&0===o.length)return e;if(r){let e=er(r);e?((0,i.setHostConcealment)(e,null),l=[...e.childNodes]):l=[]}else(0,i.setHostConcealment)(e,null),l=[...e.childNodes];if(e.replaceChildren(),e.removeAttribute(x),delete e.dataset.lootRevealBlocked,0===o.length)return e.append(...l),ed(e),e;let a=null,s=null;for(let[l,n]of o.entries()){let o=function(e,t,o,l){let n=ei(e,t,o),r=l.createElement("div");r.className=`loot-reveal-layer loot-reveal-layer--${t.kind}`,r.dataset.lootRevealId=n,r.dataset.lootRevealKind=t.kind,r.dataset.lootRevealState="locked",r.dataset.lootRevealConcealment=t.concealment??"";let a=l.createElement("div");a.className="loot-reveal-layer__cover",a.dataset.lootRevealCoverSlot=n,a.append(es(n,t.kind,l));let s=l.createElement("div");return s.className="loot-reveal-layer__content",s.dataset.lootRevealLayerContent=n,s.hidden=!0,s.inert=!0,s.setAttribute("aria-hidden","true"),r.append(a,s),(0,i.setHostConcealment)(a,t.concealment),{content:s,layer:r}}(t,n,l,e.ownerDocument);a?s?.appendChild(o.layer):(a=o.layer).setAttribute(k,"true"),s=o.content}if(!a||!s)return e;let c=e.ownerDocument.createElement("div");return c.className="loot-reveal-layer__final-content",c.setAttribute(z,"true"),c.append(...l),s.appendChild(c),e.appendChild(a),e.setAttribute(x,n),ep(e),c}function ef(e){let t=Q(e),o=null!==t||e.hasAttribute(x)||e.hasAttribute("data-loot-reveal-blocked");if(t){let o=er(t),l=o?[...o.childNodes]:[];o&&(0,i.setHostConcealment)(o,null),e.replaceChildren(...l)}(0,i.setHostConcealment)(e,null),e.removeAttribute(x),delete e.dataset.lootRevealBlocked,o&&ed(e)}function em(e,t=!0){t&&ep(e);let o=t&&e.matches(f)&&"revealed"!==e.dataset.lootRevealState;return t&&"true"===e.dataset.lootRevealBlocked||o||null!==e.closest(`[${w}]`)||null!==e.closest("[data-loot-if-range-blocked]")||!eL(e)}function eg(e,t,o){window.setTimeout(()=>{let l,n,r,i,a;H.delete(t),e.classList.remove("loot-reveal-layer--digging","loot-reveal-layer--opening","loot-reveal-layer--watering"),eI(),eS(),o&&"revealed"===e.dataset.lootRevealState&&(l=en(e),n="button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",r=l?[...l.querySelectorAll(n)]:[],(i=j.find(t=>t.controller===e))&&J(i).forEach(e=>{e.matches(n)&&r.push(e),r.push(...e.querySelectorAll(n))}),(a=r.find(e=>null===e.closest(`[hidden], [inert], [aria-hidden="true"], [${w}]`)&&e.getClientRects().length>0))?a.focus({preventScroll:!0}):(e.tabIndex=-1,e.focus({preventScroll:!0})))},520*!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)}function eb(e){let t=e.currentTarget;if(!(t instanceof HTMLButtonElement)||!_)return;let o=t.closest("[data-loot-reveal-kind]"),l=o?.dataset.lootRevealId,n=o?.dataset.lootRevealKind;if(!o||!l||H.has(l)||!eL(o))return;let r=0===e.detail;if("soil"===n)return"shovel"!==_.activeTool()?void ec("Aktiviere zuerst die Schaufel, um den Erdhaufen wegzubuddeln."):void(_.digLayer(l)&&(H.set(l,"digging"),o.classList.add("loot-reveal-layer--digging"),ec("Der Erdhaufen wird weggebuddelt."),eg(o,l,r)));if("plant"===n){if(!_.isPlantWatered(l))return"watering-can"!==_.activeTool()?void ec("Aktiviere zuerst die Gießkanne, um die Pflanze zu gießen."):void(_.waterPlant(l)&&(H.set(l,"watering"),o.classList.add("loot-reveal-layer--watering"),ec("Die Pflanze wächst und beginnt zu blühen."),eg(o,l,r)));_.openPlant(l)&&(H.set(l,"opening"),o.classList.add("loot-reveal-layer--opening"),ec("Die Blüte gibt den verborgenen Inhalt frei."),eg(o,l,r))}}function ev(e){let t=e.getAttribute("data-tool")?.trim();return V(t)?t:null}function ey(e,t){return`tool:${t}:${W(e,"data-tool-id","lootToolRuntimeId",`tool:${t}`)}:inline`}function ew(e){let t=function(e){for(let t of e.composedPath())if(t instanceof HTMLButtonElement&&t.hasAttribute("data-loot-tool-pickup"))return t;return e.target instanceof Element?e.target.closest("[data-loot-tool-pickup]"):null}(e),o=t?.dataset.lootToolPickup,l=t?.dataset.lootToolKind;if(!t||!o||!V(l)||!_||P.has(o)||!O.has(o))return;if(P.add(o),!_.collectTool(l)){P.delete(o),eS();return}let n=0===e.detail;t.disabled=!0,t.classList.add("loot-exploration-pickup--collected"),t.setAttribute("aria-label",`${L[l].label} gefunden`),eC(),ec(`${L[l].collectedMessage} Du kannst sie jetzt in der Leiste aktivieren.`),eS(),window.setTimeout(()=>{var e;P.delete(o),eS(),n&&(e=l,document.getElementById(eE(e))?.focus({preventScroll:!0}))},650)}function ek(e){$.has(e)||($.add(e),e.addEventListener("click",ew))}function ex(e){ef(e),e.childNodes.length>0&&e.replaceChildren(),e.hidden=!1}function ez(e){var t,o,l;let n,c,u,p,h,f,m;if(!_)return;let g=ev(e);if(!g)return void ex(e);let b=ey(e,g);if(_.isToolCollected(g)&&!P.has(b)){O.delete(b),G.forget(`tool:${b}`),ex(e);return}let v=(n=B(e.getAttribute("data-options")?.trim()??""),c=(0,r.parseCollectibleOptions)(n),u=(0,a.parseExplorationOptions)(c.values),p=(0,i.extractConcealmentOptions)(u.values),h=[...c.errors,...p.errors],p.values.length>0&&h.push(`Unbekannte Werkzeugoption: ${p.values.join("; ")}`),{concealment:p.mode,errors:h,layers:u.layers,sourceSection:(0,d.sectionFromLootId)(b),valid:0===h.length,visibility:c.rule});if(!v.valid){O.delete(b),U(b,L[g].label,v.errors),ex(e);return}if(em(e,!1)||!(0,d.liaSlideIsAccessible)(v.sourceSection)){O.delete(b),e.hidden=!0;return}let y=G.visible(`tool:${b}`,v.visibility,(0,d.sourceSlideIsActive)(v.sourceSection,e),eS);if(e.hidden=!y,!y)return void O.delete(b);let w=eh(e,b,v.layers),k=w.querySelector(`[data-loot-tool-pickup="${b}"]`);k?(0,i.setHostConcealment)(w,v.concealment):((0,i.setHostConcealment)(w,null),w.replaceChildren((t=b,o=g,(m=(l=e.ownerDocument).createElement("button")).type="button",m.className=`loot-exploration-pickup loot-exploration-pickup--${o}`,m.dataset.lootToolPickup=t,m.dataset.lootToolKind=o,m.setAttribute("aria-label",L[o].collectLabel),m.append((0,s.createExplorationToolGraphic)(o,l),((f=l.createElement("span")).className="loot-exploration-pickup__reward",f.setAttribute("aria-hidden","true"),f.textContent="GEFUNDEN",f)),ek(m),m)),(0,i.setHostConcealment)(w,v.concealment),k=w.querySelector("[data-loot-tool-pickup]")),k&&ek(k);let x=em(e);x||P.has(b)?O.delete(b):O.add(b),k?.toggleAttribute("data-loot-reveal-blocked",x)}function eS(){O.clear(),document.querySelectorAll(h).forEach(ez)}function eE(e){return`lia-loot-${L[e].slug}-tool`}function eC(){let e=_?.activeTool()??null,t=new Set((0,p.templateDocumentCandidates)(document));for(let o of M)e&&t.has(o)||(o.documentElement?.removeAttribute(S),M.delete(o));if(e)for(let o of t){let t=o.documentElement;t&&(t.setAttribute(S,e),M.add(o))}if(!_)return;let o=(0,u.installResourceBar)();for(let t of a.TOOL_KINDS){let l=document.getElementById(eE(t));if(!_.isToolCollected(t)){l?.remove();continue}l||(l=function(e){let t=document.createElement("button");return t.id=eE(e),t.type="button",t.className=`loot-exploration-tool loot-exploration-tool--${e}`,t.dataset.lootToolControl=e,t.append((0,s.createExplorationToolGraphic)(e)),t.addEventListener("click",()=>{if(!_)return;let t=_.activeTool();_.setActiveTool(t===e?null:e),eC(),ec(_.activeTool()===e?`${L[e].label} aktiviert.`:`${L[e].label} deaktiviert.`)}),t}(t),o.appendChild(l));let n=e===t;l.classList.toggle("loot-exploration-tool--active",n),l.setAttribute("aria-pressed",String(n)),l.setAttribute("aria-label",`${L[t].label} ${n?"deaktivieren":"aktivieren"}`)}(0,u.refreshResourceBarVisibility)()}function eL(e){let t=e.parentElement;for(;t;){if(t.hasAttribute(w)||(t.hasAttribute("data-loot-reveal-layer-content")||t.hasAttribute("data-loot-reveal-payload"))&&(t.hidden||t.inert))return!1;t=t.parentElement}return!0}function e_(e){var t;let o,l,n,s,c,u,p,h,f=`reveal:${W(e,"data-reveal-id","lootRevealRuntimeId","reveal")}`,m=function(e){let t=F.get(e);if(t?.isConnected)return t;let o=e.querySelector("[data-loot-reveal-payload]");return o||((o=e.ownerDocument.createElement("div")).dataset.lootRevealPayload="true",o.hidden=!0,o.inert=!0,o.setAttribute("aria-hidden","true"),o.append(...e.childNodes),e.appendChild(o)),F.set(e,o),o}(e),g=(o=B(e.getAttribute("data-options")?.trim()??""),l=(0,r.parseCollectibleOptions)(o),n=(0,a.parseExplorationOptions)(l.values),s=(0,i.extractConcealmentOptions)(n.values),c=n.layers.map(e=>({...e})),u=[...l.errors,...s.errors],s.mode&&c.length>0&&(c[0].concealment?u.push("Die äußere Freigabeschicht besitzt zwei Verbergungsarten."):c[0].concealment=s.mode),s.values.length>0&&u.push(`Unbekannte Freigabeoption: ${s.values.join("; ")}`),0===c.length?u.push("Eine Freigabe benötigt mindestens Erde oder eine Pflanze."):c.length>1&&u.push("Ein Freigabe-Container darf genau eine Schicht beschreiben."),{errors:u,layers:c,sourceSection:(0,d.sectionFromLootId)(f),valid:0===u.length,visibility:l.rule});if(!g.valid){e.hidden=!0,m.hidden=!0,m.inert=!0,m.setAttribute("aria-hidden","true"),U(f,"Freigabe",g.errors);return}if(t=g.layers[0],Q(e)&&ef(e),p=ei(f,t,0),h=[...e.children].find(e=>e.hasAttribute("data-loot-reveal-cover-slot")),h?.dataset.lootRevealCoverSlot!==p&&(h&&((0,i.setHostConcealment)(h,null),h.remove()),(h=e.ownerDocument.createElement("div")).className="loot-reveal-layer__cover",h.dataset.lootRevealCoverSlot=p,h.append(es(p,t.kind,e.ownerDocument))),(h.parentElement!==e||h.nextElementSibling!==m)&&e.insertBefore(h,m),e.classList.remove("loot-reveal-layer--soil","loot-reveal-layer--plant"),e.classList.add("loot-reveal-layer",`loot-reveal-layer--${t.kind}`),e.dataset.lootRevealId=p,e.dataset.lootRevealKind=t.kind,e.dataset.lootRevealConcealment=t.concealment??"",e.dataset.lootRevealState??="locked",(0,i.setHostConcealment)(h,t.concealment),eu(e)&&ed(e),!e.hasAttribute(v)&&!eL(e)||!(0,d.liaSlideIsAccessible)(g.sourceSection)){e.hidden=!0;return}let b=K.visible(`reveal:${f}`,g.visibility,(0,d.sourceSlideIsActive)(g.sourceSection,e),eA);e.hidden=!b,b&&eu(e)&&ed(e)}function eA(){document.querySelectorAll(f).forEach(e_);let e=new Set;for(let t of j)(null===t.controller||!t.controller.isConnected||t.controller.hidden||"revealed"!==t.controller.dataset.lootRevealState)&&J(t).forEach(t=>e.add(t));q.forEach(t=>{e.has(t)||ee(t,!1)}),e.forEach(e=>ee(e,!0)),q.clear(),e.forEach(e=>q.add(e))}function eI(){document.querySelectorAll(`[${x}]`).forEach(ep),eA()}function eT(){et(),eA(),eI(),eS(),eC()}class eN extends HTMLElement{static get observedAttributes(){return["data-tool-id","data-tool","data-options"]}connectedCallback(){ez(this)}disconnectedCallback(){let e=ev(this);if(!e)return;let t=ey(this,e);G.forget(`tool:${t}`),O.delete(t)}attributeChangedCallback(){this.isConnected&&ez(this)}}class eR extends HTMLElement{static get observedAttributes(){return["data-reveal-id","data-options"]}connectedCallback(){this.hasAttribute(y)||e_(this)}disconnectedCallback(){if(this.hasAttribute(v))return;let e=W(this,"data-reveal-id","lootRevealRuntimeId","reveal");K.forget(`reveal:reveal:${e}`)}attributeChangedCallback(){this.isConnected&&!this.hasAttribute(y)&&e_(this)}}class ej extends HTMLElement{static get observedAttributes(){return["data-reveal-id","data-reveal-kind","data-options"]}connectedCallback(){et()}disconnectedCallback(){et();let e=W(this,"data-reveal-id","lootRevealRuntimeId","reveal");queueMicrotask(()=>{this.isConnected||[...document.querySelectorAll(m)].some(t=>t!==this&&W(t,"data-reveal-id","lootRevealRuntimeId","reveal")===e)||K.forget(`reveal:reveal:${e}`)})}attributeChangedCallback(){this.isConnected&&et()}}class eP extends HTMLElement{static get observedAttributes(){return["data-reveal-kind"]}connectedCallback(){et()}disconnectedCallback(){et()}attributeChangedCallback(){this.isConnected&&et()}}function eO(e){_=e,customElements.get(f)||customElements.define(f,eR),customElements.get(h)||customElements.define(h,eN),customElements.get(m)||customElements.define(m,ej),customElements.get(g)||customElements.define(g,eP),I||(I=!0,(0,d.observeLiaSlideActivity)(eT)),T||(T=!0,document.addEventListener("click",ew,!0)),!R&&document.documentElement&&(R=new MutationObserver(e=>{e.some(el)&&et()})).observe(document.documentElement,{attributeFilter:["data-options","data-reveal-id","data-reveal-kind","href"],attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),et(),eC(),eA(),eS()}},{"./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./exploration-options.ts":"fw9xf","./exploration-visual.ts":"gRh4U","./range-gate.ts":"jrKO3","./resource-bar.ts":"1KrGH","./slide-activity.ts":"5qduG","./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],gRh4U:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function r(e,t,o){let l=o.createElementNS("http://www.w3.org/2000/svg","svg");return l.setAttribute("viewBox","0 0 64 64"),l.setAttribute("shape-rendering","crispEdges"),l.setAttribute("aria-hidden","true"),l.classList.add("loot-exploration-graphic",...e.split(/\s+/u).filter(Boolean)),l.innerHTML=t,l}function i(e,t=document){return"shovel"===e?r("loot-shovel-graphic",`
        <rect class="loot-exploration-shadow" x="7" y="54" width="50" height="5"/>
        <path class="loot-exploration-outline" d="M38 2h12v4h4v12h-4v4h-4v8h-4v8h-4v8h10v4h4v8H22v-8h4v-4h4v-8h4v-8h4v-8h-4v-4h-4V6h4V2h4Z"/>
        <path class="loot-shovel-handle" d="M38 6h8v4h4v4h-4v4h-8v-4h-4v-4h4V6Z"/>
        <path class="loot-shovel-shaft" d="M38 18h8v8h-4v8h-4v8h-8v-4h4v-8h4V18Z"/>
        <path class="loot-shovel-metal" d="M30 42h12v4h6v8H26v-8h4v-4Z"/>
        <path class="loot-shovel-light" d="M34 46h8v4h-12v-2h4v-2Z"/>
      `,t):r("loot-watering-can-graphic",`
      <rect class="loot-exploration-shadow" x="5" y="53" width="54" height="5"/>
      <path class="loot-exploration-outline" d="M22 12h24v4h6v4h4v8h-4v4h-8v-4h4v-8h-6v-4H26v8h20v4h4v24h-4v4H14v-4h-4V32H4v-4h16v-4h2V12Zm-8 20v16h28V28H22v4h-8Z"/>
      <path class="loot-watering-can-body" d="M14 32h28v16H14V32Z"/>
      <path class="loot-watering-can-light" d="M18 34h12v4H18v-4Z"/>
      <path class="loot-watering-can-handle" d="M26 16h16v4h6v8h-4v-4h-4v-4H26v-4Z"/>
      <path class="loot-watering-can-spout" d="M4 32h10v8H8v-4H4v-4Zm0-8h10v4H4v-4Z"/>
      <rect class="loot-watering-can-water" x="2" y="18" width="4" height="4"/>
      <rect class="loot-watering-can-water" x="8" y="14" width="4" height="4"/>
      <rect class="loot-watering-can-water" x="14" y="18" width="4" height="4"/>
    `,t)}function a(e,t="seedling",o=document){return"soil"===e?r("loot-soil-graphic",`
        <rect class="loot-exploration-shadow" x="5" y="54" width="54" height="5"/>
        <path class="loot-exploration-outline" d="M16 34h6v-8h8v-6h12v6h8v8h6v6h4v16H4V40h4v-6h8Z"/>
        <path class="loot-soil-dark" d="M8 42h8v-8h10v-8h14v6h10v8h6v12H8V42Z"/>
        <path class="loot-soil-main" d="M12 40h10v-8h16v4h12v6h6v6H12v-8Z"/>
        <rect class="loot-soil-light" x="20" y="34" width="12" height="4"/>
        <rect class="loot-soil-light" x="38" y="40" width="8" height="4"/>
        <rect class="loot-soil-stone" x="14" y="46" width="7" height="4"/>
        <rect class="loot-soil-stone" x="46" y="48" width="6" height="4"/>
      `,o):"bloomed"===t?r("loot-plant-graphic loot-plant-graphic--bloomed",`
        <rect class="loot-exploration-shadow" x="12" y="55" width="40" height="4"/>
        <path class="loot-exploration-outline" d="M28 6h8v4h8v8h6v10h-6v6h-8v20h12v5H16v-5h12V34h-8v-6h-6V18h6v-8h8V6Z"/>
        <path class="loot-flower-petal" d="M28 10h8v6h8v10h-8v8h-8v-8h-8V16h8v-6Z"/>
        <rect class="loot-flower-center" x="28" y="18" width="8" height="8"/>
        <rect class="loot-plant-stem" x="30" y="30" width="4" height="24"/>
        <path class="loot-plant-leaf" d="M18 36h12v10h-6v-4h-6v-6Zm16 4h12v6h-6v4h-6V40Z"/>
        <path class="loot-plant-pot-dark" d="M20 48h24v6h-4v5H24v-5h-4v-6Z"/>
        <rect class="loot-plant-pot" x="24" y="50" width="16" height="5"/>
      `,o):r("loot-plant-graphic loot-plant-graphic--seedling",`
      <rect class="loot-exploration-shadow" x="12" y="55" width="40" height="4"/>
      <path class="loot-exploration-outline" d="M29 17h6v14h9v4h5v11H38v8h10v5H16v-5h10v-8H15V35h5v-4h9V17Z"/>
      <rect class="loot-plant-stem" x="30" y="25" width="4" height="29"/>
      <path class="loot-plant-leaf" d="M19 31h11v11h-5v-4h-6v-7Zm15 4h11v7h-6v4h-5V35Z"/>
      <path class="loot-plant-pot-dark" d="M20 46h24v8h-4v5H24v-5h-4v-8Z"/>
      <rect class="loot-plant-pot" x="24" y="49" width="16" height="6"/>
      <rect class="loot-plant-pot-light" x="26" y="49" width="8" height="3"/>
    `,o)}n.defineInteropFlag(o),n.export(o,"createExplorationToolGraphic",()=>i),n.export(o,"createRevealCoverGraphic",()=>a)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],jrKO3:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"setRangeGate",()=>s);let r=new WeakMap;function i(e,t,o){e.getAttribute(t)!==o&&e.setAttribute(t,o)}function a(e,t){e.hasAttribute(t)&&e.removeAttribute(t)}function s(e,t,o,l){let n=r.get(e);if(l){n||(n={ariaHidden:e.getAttribute("aria-hidden"),blockers:new Set,inert:e.inert},r.set(e,n));let l=!n.blockers.has(t);return n.blockers.add(t),i(e,o,"true"),i(e,"aria-hidden","true"),e.inert||(e.inert=!0),l}if(!n){let t=e.hasAttribute(o);return a(e,o),t}let s=n.blockers.delete(t);return(a(e,o),n.blockers.size>0)?(i(e,"aria-hidden","true"),e.inert||(e.inert=!0)):(e.inert!==n.inert&&(e.inert=n.inert),null===n.ariaHidden?a(e,"aria-hidden"):i(e,"aria-hidden",n.ariaHidden),r.delete(e)),s}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],grhSe:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"installMagnifier",()=>ee),n.export(o,"MAGNIFIER_RADIUS",()=>u.MAGNIFIER_RADIUS);var r=e("./collectible-visibility.ts"),i=e("./concealment.ts"),a=e("./exploration-options.ts"),s=e("./hidden-arguments.ts"),c=e("./exploration.ts"),u=e("./magnifier-geometry.ts"),d=e("./magnifier-visual.ts"),p=e("./resource-bar.ts"),h=e("./slide-activity.ts");let f="lia-loot-magnifier",m="lia-loot-hidden",g="lia-loot-magnifier-tool",b="lia-loot-magnifier-lens",v=null,y=0,w=!1,k=!1,x=null,z=null,S=null,E=!1,C=!1,L=!1,_=!1,A=!1,I=new Set,T=new Set,N=new WeakSet,R=new Set,j=new(0,r.CollectibleVisibilityGate);function P(e){let t=function(e){for(let t of e.composedPath())if(t instanceof HTMLButtonElement&&t.hasAttribute("data-loot-magnifier-button"))return t;return e.target instanceof Element?e.target.closest("[data-loot-magnifier-button]"):null}(e),o=t?.dataset.lootMagnifierButton;if(!t||!o||!v||I.has(o)||!T.has(o))return;if(I.add(o),!v.collect()){I.delete(o),$();return}let l=0===e.detail;t.disabled=!0,t.classList.add("loot-magnifier-pickup--collected"),t.setAttribute("aria-label","Lupe gefunden"),Y(),(0,p.announceResource)("Lupe gefunden. Du kannst sie jetzt in der Leiste aktivieren."),$(),window.setTimeout(()=>{I.delete(o),t.remove(),$(),l&&U()},650)}function O(e){N.has(e)||(N.add(e),e.addEventListener("click",P))}function M(e){var t,o;let l,n,s,u,p;if(!v)return;let f=function(e){let t=e.getAttribute("data-magnifier-id")?.trim();if(t&&!t.startsWith("@"))return`magnifier:${t}:inline`;let o=e.dataset.lootMagnifierRuntimeId;if(o)return o;y+=1;let l=`magnifier:runtime-${y}:inline`;return e.dataset.lootMagnifierRuntimeId=l,l}(e);if(v.collected()&&!I.has(f)){T.delete(f),j.forget(`magnifier:${f}`),(0,c.clearHostRevealLayers)(e),e.childElementCount>0&&e.replaceChildren();return}let m=(t=e.getAttribute("data-options")?.trim()??"",l=/^@\d+$/u.test(t)?"":t,n=(0,r.parseCollectibleOptions)(l),s=(0,a.parseExplorationOptions)(n.values),u=(0,i.extractConcealmentOptions)(s.values),p=[...n.errors,...u.errors],u.values.length>0&&p.push(`Unbekannte Lupenoption: ${u.values.join("; ")}`),{concealment:u.mode,errors:p,layers:s.layers,sourceSection:(0,h.sectionFromLootId)(f),valid:0===p.length,visibility:n.rule});if(!m.valid){T.delete(f),o=m.errors,R.has(f)||(R.add(f),console.warn(`Loot: Lupe ${f} bleibt wegen ung\xfcltiger Optionen verborgen. ${o.join(" ")}`)),(0,c.clearHostRevealLayers)(e),e.childElementCount>0&&e.replaceChildren();return}if((0,c.hostIsRevealBlocked)(e,!1)){T.delete(f),e.hidden=!0;return}if(!(0,h.liaSlideIsAccessible)(m.sourceSection)){T.delete(f),(0,c.clearHostRevealLayers)(e),e.hidden=!0;return}if(!j.visible(`magnifier:${f}`,m.visibility,(0,h.sourceSlideIsActive)(m.sourceSection,e),$)){T.delete(f),(0,c.clearHostRevealLayers)(e),e.childElementCount>0&&e.replaceChildren();return}e.hidden=!1;let g=(0,c.setHostRevealLayers)(e,f,m.layers),b=[...g.querySelectorAll("[data-loot-magnifier-button]")].find(e=>e.dataset.lootMagnifierButton===f);if(b)O(b);else{let e,t;(0,i.setHostConcealment)(g,null),g.replaceChildren(((e=document.createElement("button")).type="button",e.className="loot-magnifier-pickup",e.dataset.lootMagnifierButton=f,e.setAttribute("aria-label","Lupe einsammeln"),e.append((0,d.createMagnifierGraphic)(),((t=document.createElement("span")).className="loot-magnifier-pickup__reward",t.setAttribute("aria-hidden","true"),t.textContent="GEFUNDEN",t)),O(e),e))}(0,i.setHostConcealment)(g,m.concealment),(0,c.hostIsRevealBlocked)(e)?T.delete(f):T.add(f)}function $(){T.clear(),document.querySelectorAll(f).forEach(M)}function q(){let e=document.getElementById(b);if(e instanceof HTMLDivElement)return e;let t=document.createElement("div");return t.id=b,t.className="loot-magnifier-lens",t.hidden=!0,t.setAttribute("aria-hidden","true"),document.body.appendChild(t),t}function D(e,t){e.classList.toggle("loot-magnifier-secret--under-lens",t),e.setAttribute("aria-hidden",String(!t)),e.inert=!t}function H(e,t){J(e);let o=(0,i.prepareConcealedHost)(e);if(!o)return;let l=(0,i.concealedContentOf)(e);if(!l)return;let n=e.getBoundingClientRect(),r=l.getBoundingClientRect();if(e.style.setProperty("--loot-secret-left",`${r.left-n.left}px`),e.style.setProperty("--loot-secret-top",`${r.top-n.top}px`),e.style.setProperty("--loot-secret-width",`${r.width}px`),e.style.setProperty("--loot-secret-height",`${r.height}px`),!t||!w||!k)return void D(e,!1);e.style.setProperty("--loot-magnifier-x",`${t.x-r.left}px`),e.style.setProperty("--loot-magnifier-y",`${t.y-r.top}px`);let a=e.classList.contains("loot-magnifier-secret--under-lens"),s=function(e,t){if(!e.isConnected||0===t.getClientRects().length)return!1;let o=t.getBoundingClientRect();if(o.width<=0||o.height<=0)return!1;let l=e.parentElement;for(;l;){if(l.hidden||l.inert||"true"===l.getAttribute("aria-hidden"))return!1;l=l.parentElement}return!0}(e,l)&&(0,u.magnifierIntersectsRect)(t.x,t.y,r);if(D(e,s),!s||a)return;let c=(0,i.concealmentIdOf)(e);c&&v?.find(c,o)}function K(e){document.querySelectorAll(i.CONCEALMENT_SELECTOR).forEach(t=>H(t,e))}function G(){$(),K(k?x:null)}function F(){A||(A=!0,queueMicrotask(()=>{A=!1,G()}))}function V(){if(S=null,!z||!w)return;x=z,z=null,k=!0;let e=q();e.style.left=`${x.x}px`,e.style.top=`${x.y}px`,e.hidden=!1,document.body.classList.add("loot-magnifier-pointing"),K(x)}function B(e){z=e,null===S&&(S=window.requestAnimationFrame(V))}function W(){k=!1,z=null,null!==S&&window.cancelAnimationFrame(S),S=null,q().hidden=!0,document.body.classList.remove("loot-magnifier-pointing"),K(null)}function U(){document.getElementById(g)?.focus({preventScroll:!0})}function Z(e,t=!0){w=!!(e&&v?.collected()),document.body.classList.toggle("loot-magnifier-active",w);let o=document.getElementById(g);o?.classList.toggle("loot-magnifier-tool--active",w),o?.setAttribute("aria-pressed",String(w)),o?.setAttribute("aria-label",w?"Lupe deaktivieren":"Lupe aktivieren"),w||W(),t&&(0,p.announceResource)(w?"Lupe aktiviert. Bewege den Zeiger über verborgene Bereiche.":"Lupe deaktiviert.")}function Y(){if(!v?.collected()){document.getElementById(g)?.remove(),Z(!1,!1),(0,p.refreshResourceBarVisibility)();return}let e=document.getElementById(g);e||((e=document.createElement("button")).id=g,e.type="button",e.className="loot-magnifier-tool",e.dataset.lootMagnifierTool="true",e.append((0,d.createMagnifierGraphic)()),e.addEventListener("click",()=>{Z(!w)}),(0,p.installResourceBar)().appendChild(e)),Z(w,!1),(0,p.refreshResourceBarVisibility)()}class Q extends HTMLElement{static get observedAttributes(){return["data-magnifier-id","data-options"]}connectedCallback(){M(this)}attributeChangedCallback(){this.isConnected&&M(this)}}class X extends HTMLElement{static get observedAttributes(){return["data-loot-concealment"]}connectedCallback(){J(this),H(this,k?x:null),this.childObserver??=new MutationObserver(()=>{queueMicrotask(()=>{this.isConnected&&(J(this),H(this,k?x:null))})}),this.childObserver.observe(this,{childList:!0}),queueMicrotask(()=>{this.isConnected&&(J(this),H(this,k?x:null))})}disconnectedCallback(){this.childObserver?.disconnect()}attributeChangedCallback(){this.isConnected&&H(this,k?x:null)}constructor(...e){super(...e),this.childObserver=null}}function J(e){let t=(0,i.concealedContentOf)(e);for(let o of t?[e,t]:[e])for(let e of o.childNodes){if(!(e instanceof Text)||null===e.nodeValue)continue;let t=(0,s.normalizeHiddenMacroArgumentText)(e.nodeValue);t!==e.nodeValue&&(e.nodeValue=t)}}function ee(e){v=e,E||(E=!0,window.addEventListener("pointermove",e=>{w&&e.isPrimary&&B({x:e.clientX,y:e.clientY})},{passive:!0}),window.addEventListener("pointerdown",e=>{w&&e.isPrimary&&"mouse"!==e.pointerType&&B({x:e.clientX,y:e.clientY})},{passive:!0}),window.addEventListener("pointerout",e=>{"mouse"===e.pointerType&&null===e.relatedTarget&&W()}),window.addEventListener("pointercancel",W),window.addEventListener("blur",W),window.addEventListener("scroll",()=>{w&&k&&x&&B(x)},{passive:!0}),window.addEventListener("resize",()=>{w&&k&&x&&B(x)},{passive:!0}),document.addEventListener("keydown",e=>{"Escape"===e.key&&w&&(e.preventDefault(),Z(!1),U())}),document.addEventListener(i.CONCEALMENT_CHANGED_EVENT,()=>{K(k?x:null)})),q(),L||(L=!0,(0,h.observeLiaSlideActivity)(G)),_||(_=!0,document.addEventListener(c.REVEAL_CHANGED_EVENT,F)),C||(C=!0,document.addEventListener("click",P,!0)),customElements.get(m)||customElements.define(m,X),customElements.get(f)||customElements.define(f,Q),Y(),$(),K(null)}},{"./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./exploration-options.ts":"fw9xf","./hidden-arguments.ts":"iONmM","./exploration.ts":"5BeJ3","./magnifier-geometry.ts":"ecwyG","./magnifier-visual.ts":"6yshi","./resource-bar.ts":"1KrGH","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],iONmM:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"normalizeHiddenMacroArgumentText",()=>i);let r=/LIALOOTHIDDEN7QARGSEP([1-9])X9END/gu;function i(e){let t=[...e.matchAll(r)];if(0===t.length)return e;let o=t[0],l=e.slice(0,o.index),n="@0"===l?"":l;for(let[o,l]of t.entries()){let r=l[1],i=l.index+l[0].length,a=t[o+1]?.index??e.length,s=e.slice(i,a);s!==`@${r}`&&(n+=`,${s}`)}return n}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],ecwyG:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"MAGNIFIER_RADIUS",()=>r),n.export(o,"magnifierIntersectsRect",()=>i);let r=72;function i(e,t,o,l=r){if(![e,t,o.left,o.right,o.top,o.bottom,l].every(Number.isFinite)||l<0||o.right<o.left||o.bottom<o.top)return!1;let n=Math.max(o.left,Math.min(e,o.right)),a=Math.max(o.top,Math.min(t,o.bottom)),s=e-n,c=t-a;return s*s+c*c<=l*l}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"6yshi":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function r(){let e=document.createElementNS("http://www.w3.org/2000/svg","svg");return e.setAttribute("viewBox","0 0 56 56"),e.setAttribute("shape-rendering","crispEdges"),e.setAttribute("aria-hidden","true"),e.classList.add("loot-magnifier-graphic"),e.innerHTML=`
    <rect class="loot-magnifier-shadow" x="8" y="46" width="42" height="6"/>
    <path class="loot-magnifier-outline" d="M10 2h20v4h8v8h4v20h-4v6h-8v4H10v-4H4v-6H0V14h4V8h6V2Z"/>
    <path class="loot-magnifier-glass" d="M14 10h12v4h4v16h-4v4H14v-4h-4V14h4v-4Z"/>
    <rect class="loot-magnifier-glint" x="14" y="12" width="8" height="4"/>
    <rect class="loot-magnifier-glint" x="12" y="16" width="4" height="8"/>
    <path class="loot-magnifier-outline" d="M30 34h8v4h4v4h4v4h4v10H38v-4h-4v-4h-4v-4h-4V36h4v-2Z"/>
    <path class="loot-magnifier-handle" d="M32 40h4v4h4v4h4v4h-4v-4h-4v-4h-4v-4Z"/>
    <rect class="loot-magnifier-handle-light" x="32" y="38" width="4" height="6"/>
  `,e}n.defineInteropFlag(o),n.export(o,"createMagnifierGraphic",()=>r)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"4rVr5":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"MagnifierStore",()=>i);var r=e("./storage.ts");class i{collect(){return!this.current.collected&&(this.current={version:1,collected:!0},(0,r.saveMagnifier)(this.current),!0)}isCollected(){return this.current.collected}state(){return{...this.current}}constructor(){this.current=(0,r.loadMagnifier)()??{version:1,collected:!1}}}},{"./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],eyg0o:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"isToolKind",()=>a),n.export(o,"ExplorationStore",()=>p);var r=e("./course-identity.ts"),i=e("./exploration-options.ts");function a(e){return i.TOOL_KINDS.includes(e)}function s(e){if(!Array.isArray(e)||!e.every(e=>"string"==typeof e&&e.trim().length>0))return null;let t=e.map(e=>e.trim());return new Set(t).size===t.length?t:null}function c(){return`lia-loot:exploration:v1:${encodeURIComponent((0,r.liaCourseIdentity)())}`}function u(e){try{window.sessionStorage.setItem(c(),JSON.stringify(e))}catch{}}function d(e){return e.trim()||null}class p{collectTool(e){return!(!a(e)||this.current.collectedTools.includes(e))&&(this.current.collectedTools.push(e),u(this.current),!0)}isToolCollected(e){return a(e)&&this.current.collectedTools.includes(e)}setActiveTool(e){return null===e?null!==this.active&&(this.active=null,!0):!!this.isToolCollected(e)&&this.active!==e&&(this.active=e,!0)}activeTool(){return this.active}digLayer(e){return this.recordId(e,this.current.dugLayers)}isLayerDug(e){return this.hasId(e,this.current.dugLayers)}findConcealedObject(e,t){return this.recordId(e,"dust"===t?this.current.foundDustObjects:this.current.foundInvisibleObjects)}isConcealedObjectFound(e,t){return this.hasId(e,"dust"===t?this.current.foundDustObjects:this.current.foundInvisibleObjects)}waterPlant(e){return this.recordId(e,this.current.wateredPlants)}isPlantWatered(e){return this.hasId(e,this.current.wateredPlants)}openPlant(e){let t=d(e);return!(!t||!this.current.wateredPlants.includes(t)||this.current.openedPlants.includes(t))&&(this.current.openedPlants.push(t),u(this.current),!0)}isPlantOpened(e){return this.hasId(e,this.current.openedPlants)}state(){var e;return{version:1,collectedTools:[...(e=this.current).collectedTools],dugLayers:[...e.dugLayers],foundDustObjects:[...e.foundDustObjects],foundInvisibleObjects:[...e.foundInvisibleObjects],wateredPlants:[...e.wateredPlants],openedPlants:[...e.openedPlants]}}recordId(e,t){let o=d(e);return!(!o||t.includes(o))&&(t.push(o),u(this.current),!0)}hasId(e,t){let o=d(e);return null!==o&&t.includes(o)}constructor(){this.current=function(){try{let e=window.sessionStorage.getItem(c());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!Array.isArray(e.collectedTools)||!e.collectedTools.every(a))return null;let t=[...e.collectedTools];if(new Set(t).size!==t.length)return null;let o=s(e.dugLayers),l=s(e.foundDustObjects??[]),n=s(e.foundInvisibleObjects??[]),r=s(e.wateredPlants),i=s(e.openedPlants);if(!o||!l||!n||!r||!i)return null;let c=new Set(r);return i.every(e=>c.has(e))?{version:1,collectedTools:t,dugLayers:o,foundDustObjects:l,foundInvisibleObjects:n,wateredPlants:r,openedPlants:i}:null}(t)}catch{return null}}()??{version:1,collectedTools:[],dugLayers:[],foundDustObjects:[],foundInvisibleObjects:[],wateredPlants:[],openedPlants:[]},this.active=null}}},{"./course-identity.ts":"g3iqo","./exploration-options.ts":"fw9xf","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],iooeB:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"LOOT_IF_CHANGED_EVENT",()=>f),n.export(o,"lootIfAuthoredRuntimeId",()=>C),n.export(o,"lootIfQuizInputTrack",()=>O),n.export(o,"lootIfQuizRendererAnchor",()=>M),n.export(o,"lootIfQuizId",()=>q),n.export(o,"lootIfQuizCheckIsReachable",()=>H),n.export(o,"refreshLootIf",()=>B),n.export(o,"recordLootIfQuizSolved",()=>W),n.export(o,"recordLootIfSecretSlideVisited",()=>U),n.export(o,"installLootIf",()=>X);var r=e("./exploration.ts"),i=e("./loot-if-options.ts"),a=e("./quiz-events.ts"),s=e("./range-gate.ts"),c=e("./slide-activity.ts");let u="lia-loot-if-start",d='a[href="#lia-loot-if-end"]',p="data-loot-if-range-blocked",h="data-loot-if-spawned",f="lia-loot:loot-if-changed",m=null,g=null,b=[],v=null,y=!1,w=0,k=!1,x=!1,z=new Set,S=new WeakMap,E=new Set;function C(e){let t=e?.trim()??"";return t&&!t.startsWith("@")?t:null}function L(e){let t=C(e.getAttribute("data-loot-if-id"));if(t)return{errors:[],id:t,valid:!0};let o="Die data-loot-if-id fehlt oder enthaelt einen nicht expandierten Makro-Platzhalter.",l=S.get(e);if(l)return{errors:[o],id:l,valid:!1};w+=1;let n=`loot-if:invalid-runtime-${w}`;return S.set(e,n),{errors:[o],id:n,valid:!1}}function _(e){let t=e;for(;t.parentElement;){let e=t.parentElement,o="DIV"===e.tagName&&0===e.attributes.length;if("P"!==e.tagName&&"SPAN"!==e.tagName&&"LIA-KEEP"!==e.tagName&&!o||[...e.childNodes].some(e=>e!==t&&e.nodeType!==Node.COMMENT_NODE&&(e.nodeType!==Node.TEXT_NODE||!!e.textContent?.trim())))break;t=e}return t}function A(e){E.has(e.id)||(E.add(e.id),console.warn(`Loot: @lootif ${e.id} bleibt wegen ung\xfcltiger Optionen verborgen. ${e.errors.join(" ")}`))}function I(){let e=new Set;for(let t of b)t.valid&&null!==t.end&&g?.isSpawned(t.id)||(function(e){let t=_(e.start),o=e.end?_(e.end):null;if(!t.isConnected||null!==o&&!o.isConnected||!e.scope.isConnected)return[];let l=e.scope.ownerDocument.createRange();try{l.setStartAfter(t),o?l.setEndBefore(o):l.setEnd(e.scope,e.scope.childNodes.length)}catch{return[]}let n=[],r=e=>{for(let t of[...e.children]){if(!l.intersectsNode(t))continue;let e=!1;try{e=0===l.comparePoint(t,0)&&0===l.comparePoint(t,t.childNodes.length)}catch{e=!1}e?n.push(t):r(t)}};return r(e.scope),n})(t).forEach(t=>e.add(t));let t=!1;for(let o of z)!e.has(o)&&(0,s.setRangeGate)(o,"loot-if",p,!1)&&(t=!0);for(let o of e)(0,s.setRangeGate)(o,"loot-if",p,!0)&&(t=!0);for(let t of(z.clear(),e.forEach(e=>z.add(e)),b))t.valid&&null!==t.end&&g?.isSpawned(t.id)?t.start.setAttribute(h,"true"):t.start.removeAttribute(h);return t}function T(e){return e.closest("main.lia-slide__content, main")}function N(e){if(!e)return null;let t=e.parentElement;if(t){let o=[...t.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName),l=o.indexOf(e);if(l>=0){let e=(0,c.activeLiaSection)();return 1===o.length&&null!==e?e:l}}return e.hidden?null:(0,c.activeLiaSection)()}function R(e){return[...e.querySelectorAll(".lia-quiz")].filter(a.isScoreableQuiz)}function j(e){let t=e?.trim().replace(/\s+/gu," ")??"";return t&&!t.startsWith("@")?t:null}let P=/\[\s*["']quiz["']\s*,\s*(\d+)\s*\]\s*,\s*\[\s*["']input["']\s*,\s*(\d+)\s*\]/u;function O(e){let t=e.parentElement;if(!t||"MAIN"===t.tagName||1!==t.querySelectorAll(".lia-quiz").length)return null;let o=new Map;return t.querySelectorAll("[oninput], [onchange], [onclick]").forEach(e=>{for(let t of["oninput","onchange","onclick"]){let l=P.exec(e.getAttribute(t)??"");if(!l)continue;let n={section:Number.parseInt(l[1],10),input:Number.parseInt(l[2],10)};o.set(`${n.section}:${n.input}`,n)}}),1===o.size?[...o.values()][0]:null}function M(e){let t=new Set;return e.querySelectorAll(".lia-quiz__answers[aria-labelledby]").forEach(e=>{let o=j(e.getAttribute("aria-labelledby"));o&&o.split(" ").every(e=>!e.startsWith("@"))&&t.add(o)}),1===t.size?[...t][0]:null}function $(e,t){let o=["data-quiz-id","data-uid","data-id","id"].map(t=>j(e.getAttribute(t))).find(e=>null!==e)??null,l=null!==t?`section-${t}`:"document";if(o)return`${l}:authored-${encodeURIComponent(o)}`;let n=O(e);if(n)return`section-${n.section}:lia-input-${n.input}`;let r=M(e);return r?`${l}:lia-label-${encodeURIComponent(r)}`:null}function q(e){if(!(e instanceof HTMLElement)||!(0,a.isScoreableQuiz)(e))return null;let t=T(e),o=N(t);if(!R(t??document).includes(e))return null;let l=$(e,o);return!l||R(document).some(t=>t!==e&&$(t,N(T(t)))===l)?(delete e.dataset.lootIfQuizId,null):(e.dataset.lootIfQuizId=l,l)}function D(e){let t=q(e);return e.classList.contains("solved")||null!==t&&!!g?.isQuizSolved(t)}function H(e,t=!1){let o=e.parentElement;for(;o;){var l;if(!0===(l=o).disabled||l.hasAttribute("disabled")||l.inert||l.hidden||l.getAttribute("aria-hidden")?.trim().toLowerCase()==="true")return!1;o=o.parentElement}return!e.hidden&&!e.inert&&(!(!0===e.disabled||e.hasAttribute("disabled")||e.getAttribute("aria-hidden")?.trim().toLowerCase()==="true")||t)}function K(e){let t=e.querySelector(".lia-quiz__check");return!!t&&H(t,D(e))&&null===e.closest(`[${p}], [data-loot-reveal-range-blocked]`)&&!(0,r.hostIsRevealBlocked)(e,!1)}function G(e,t){if(!e)return null;let o=e.split("/").filter(Boolean).map(e=>Number.parseInt(e,10));if(o.some(e=>!Number.isInteger(e)||e<0))return null;let l=t.body;for(let e of o){if(!l||e>=l.childNodes.length)return null;l=l.childNodes[e]}return l}function F(e,t){let o=e.nodeType===Node.TEXT_NODE?(e.nodeValue??"").length:e.childNodes.length;return Math.max(0,Math.min(Number.isFinite(t)?t:0,o))}function V(){if(!m||!g)return;!function(){let e=new Map;document.querySelectorAll(`${u}, ${d}`).forEach(t=>{let o=t.closest("[data-loot-reveal-payload], [data-loot-reveal-layer-content], main.lia-slide__content, main")??document.body,l=e.get(o)??[];l.push(t),e.set(o,l)});let t=[];for(let[o,l]of e){let e=[];for(let n of l){if(n.matches(u)){e.push(n);continue}let l=e.pop();if(!l)continue;let r=(0,i.parseLootIfOptions)(l.getAttribute("data-options")),a=L(l),s={condition:r.condition,end:n,errors:[...r.errors,...a.errors],id:a.id,scope:o,start:l,valid:r.valid&&a.valid};s.valid||A(s),t.push(s)}for(let l of e){let e=(0,i.parseLootIfOptions)(l.getAttribute("data-options")),n=L(l),r={condition:e.condition,end:null,errors:[...e.errors,...n.errors,"Das zugehörige @Endelootif fehlt."],id:n.id,scope:o,start:l,valid:!1};A(r),t.push(r)}}b=t}();let e=I();(function(){if(!g)return!1;let e=!1;for(let t of R(document)){if(!t.classList.contains("solved"))continue;let o=q(t);o&&g.recordSolvedQuiz(o)&&(e=!0)}return e})()&&(e=!0),function(){if(!g)return!1;let e=!1;for(let t of document.querySelectorAll(".lia-hl-rect[data-kind='user'][data-hl]")){let o=t.getAttribute("data-hl");o&&i.MARKER_COLORS.includes(o)&&g.recordHighlightColor(o)&&(e=!0)}for(let t of function(){let e=[];for(let t of function(){let e=[window];for(let t of[()=>window.parent,()=>window.top])try{let o=t();o&&!e.includes(o)&&e.push(o)}catch{}return e}())try{let o=t.__LIA_TEXTMARKER_REG_V4__;o&&!e.includes(o)&&e.push(o)}catch{}return e}())for(let o of Object.values(t.instances??{}))for(let t of o.HL??[]){if("user"!==t.kind||!t.anchor)continue;let o=t.color;if(!i.MARKER_COLORS.includes(o))continue;let l=function(e){let t=G(e.sp,document),o=G(e.ep,document);if(!t||!o)return null;let l=document.createRange();try{l.setStart(t,F(t,e.so)),l.setEnd(o,F(o,e.eo))}catch{return null}return l.toString().trim()||null}(t.anchor);l&&g.recordHighlight(o,l)&&(e=!0)}return e}()&&(e=!0);let t=!1;for(let e of b){var o;!g.isSpawned(e.id)&&e.valid&&e.end&&e.condition&&null===(o=e).start.closest(`[${p}], [data-loot-reveal-range-blocked]`)&&!(0,r.hostIsRevealBlocked)(o.start,!1)&&function(e,t){var o;if(!m||!g)return!1;if("previous-quiz"===t.kind){let t,o=(t=R(document).filter(t=>!!(t.compareDocumentPosition(e.start)&Node.DOCUMENT_POSITION_FOLLOWING)))[t.length-1]??null;return null!==o&&D(o)}if("current-slide-quizzes"===t.kind)return function(e){let t=(0,c.activeLiaSection)(),o=T(e.start),l=N(o);if(null!==t&&null!==l&&t!==l)return!1;let n=document.querySelector(".lia-slide__container > main.lia-slide__content:not([hidden])")??o;if(!n||o&&n!==o)return!1;let r=R(n).filter(K);return r.length>0&&r.every(D)}(e);if("solved-quizzes"===t.kind)return(0,i.compareLootIfNumbers)(g.state().solvedQuizzes.length,t.comparator,t.value);if("resource"===t.kind){let e=m.resourceState(),o=e?.[t.resource];return null!=o&&(0,i.compareLootIfNumbers)(o,t.comparator,t.value)}return"opened-chests"===t.kind?(0,i.compareLootIfNumbers)(m.chestCounts()[t.reward],t.comparator,t.value):"lock-opened"===t.kind?(o=t.target,!!(g?.hasOpenedLockTarget(o)||m?.unlockedLockIds().some(e=>e.split(":").map(e=>e.trim()).includes(o)))):"puzzle-gate-opened"===t.kind?m.openedPuzzleColors().includes(t.color):"secret-slide-visited"===t.kind?g.state().secretSlideVisited:"magnifier-found"===t.kind?m.magnifierFound():g.hasHighlight(t.color,t.word)}(e,e.condition)&&g.spawn(e.id)&&(t=!0)}t&&I()&&(e=!0),(e||t)&&(document.dispatchEvent(new CustomEvent(f)),document.dispatchEvent(new CustomEvent(r.REVEAL_CHANGED_EVENT))),t&&Z()}function B(){Z()}function W(e){if(!g)return;let t=q(e);t&&g.recordSolvedQuiz(t),Z()}function U(){g?.recordSecretSlideVisit(),Z()}function Z(){y||(y=!0,queueMicrotask(()=>{y=!1,V()}))}function Y(e){return e instanceof Element&&(e.matches(`${u}, ${d}, #lia-hl-overlay`)||null!==e.querySelector(`${u}, ${d}, #lia-hl-overlay`))}class Q extends HTMLElement{static get observedAttributes(){return["data-loot-if-id","data-options"]}connectedCallback(){Z()}attributeChangedCallback(){this.isConnected&&Z()}}function X(e,t){m=e,g=t,customElements.get(u)||customElements.define(u,Q),!v&&document.documentElement&&(v=new MutationObserver(e=>{e.some(e=>"attributes"===e.type||"childList"===e.type||[...e.addedNodes,...e.removedNodes].some(Y)||e.target instanceof Element&&!!e.target.closest(`${u}, .lia-quiz, #lia-hl-overlay, [data-loot-reveal-layer-content]`))&&Z()})).observe(document.documentElement,{attributeFilter:["aria-hidden","class","data-loot-if-id","data-options","disabled","hidden","href","inert"],attributes:!0,childList:!0,subtree:!0}),k||(k=!0,(0,c.observeLiaSlideActivity)(Z)),x||(x=!0,document.addEventListener(r.REVEAL_CHANGED_EVENT,Z)),V()}},{"./exploration.ts":"5BeJ3","./loot-if-options.ts":"6qN0r","./quiz-events.ts":"1ZNl4","./range-gate.ts":"jrKO3","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1ZNl4":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"isScoreableQuiz",()=>u),n.export(o,"lastScoreableQuiz",()=>m),n.export(o,"allRenderedCourseQuizzesSolved",()=>g),n.export(o,"CourseQuizProgress",()=>b),n.export(o,"isLastCourseQuiz",()=>v),n.export(o,"installQuizEventTracking",()=>z);var r=e("./course-chests.ts"),i=e("./slide-activity.ts");let a=".lia-quiz__check",s=".lia-quiz",c=".lia-quiz__resolve";function u(e){return!!(e.querySelector(a)&&e.querySelector(c))}function d(e){e.preventDefault(),e.stopImmediatePropagation()}function p(e){return!e.disabled&&null===e.closest("[inert]")}function h(e){let t=(e.querySelector(a)?.textContent?.trim()??"").match(/(?:^|\s)(\d+)\s*$/);return t?Number.parseInt(t[1],10):0}function f(e){return e.querySelectorAll(".lia-quiz__hints > li").length}function m(e){for(let t=e.length-1;t>=0;t-=1){let o=e[t];if(u(o))return o}return null}function g(e){let t=Array.from(e.querySelectorAll(s)).filter(u);return t.length>0&&t.every(e=>e.classList.contains("solved"))&&t.some(v)}class b{reset(){this.expectedSections.clear(),this.visitedSections.clear(),this.quizIds.clear(),this.completedQuizzes.clear(),this.solvedQuizzes.clear()}expectSections(e){this.expectedSections=new Set([...e].filter(e=>Number.isInteger(e)&&e>=0))}catalogSection(e,t){if(!Number.isInteger(e)||e<0)return;this.visitedSections.add(e);let o=this.quizIds.get(e)??new Set;this.quizIds.set(e,o),t.forEach(({id:t,state:l})=>{let n=`${e}:${t}`;o.add(n),"solved"===l?(this.solvedQuizzes.add(n),this.completedQuizzes.add(n)):"resolved"===l&&this.completedQuizzes.add(n)})}allCompleted(){return this.allKnownQuizzesAre(this.completedQuizzes)}allSolved(){return this.allKnownQuizzesAre(this.solvedQuizzes)}allKnownQuizzesAre(e){if(0===this.expectedSections.size)return!1;let t=0;for(let o of this.expectedSections){if(!this.visitedSections.has(o))return!1;let l=this.quizIds.get(o)??new Set;for(let o of(t+=l.size,l))if(!e.has(o))return!1}return t>0}constructor(){this.expectedSections=new Set,this.visitedSections=new Set,this.quizIds=new Map,this.completedQuizzes=new Set,this.solvedQuizzes=new Set}}function v(e){let t=e.closest("main.lia-slide__content"),o=t?.parentElement;if(!t||!o)return!1;let l=Array.from(o.children).filter(e=>"MAIN"===e.tagName);return l[l.length-1]===t&&m(Array.from(t.querySelectorAll(s)))===e}function y(e,t,o,l,n=3e4){let r,i=!1,a=0,s=()=>{r.disconnect(),window.clearTimeout(a)},c=()=>{i||(i=!0,s(),l())},u=()=>{if(i)return;if(!e.isConnected)return void c();let l=t();null!==l&&(i||(i=!0,s(),o(l)))};(r=new MutationObserver(u)).observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0}),a=window.setTimeout(c,n),window.setTimeout(u,0)}function w(e){let t=e;try{t=new URL(e,window.location.href).hash}catch{}let o=/^#(\d+)$/.exec(t);if(!o)return null;let l=Number.parseInt(o[1],10)-1;return Number.isInteger(l)&&l>=0?l:null}function k(e){let t=new Set([...e.querySelectorAll(".lia-quiz__answers[aria-labelledby]")].map(e=>(e.getAttribute("aria-labelledby")??"").trim().replace(/\s+/gu," ")).filter(e=>e.length>0&&!e.startsWith("@")));return 1===t.size?[...t][0]:null}function x(e){return e instanceof Element&&(e.matches(`${s}, #lia-toc, #lia-toc a[href]`)||null!==e.querySelector(`${s}, #lia-toc, #lia-toc a[href]`))}function z(e){let t=new WeakSet,o=new WeakSet,l=new WeakSet,n=new b,m=!1,g=!1,v=!1,z=!1,S=()=>{let e,t=(e=new Set,document.querySelectorAll("#lia-toc a[href]").forEach(t=>{let o=w(t.getAttribute("href")??"");null!==o&&e.add(o)}),e);if(0===t.size)return;n.expectSections(t);let o=document.querySelector(".lia-slide__container > main.lia-slide__content:not([hidden])");if(!o)return;let l=function(e,t){let o=w(window.location.hash);if(null!==o&&t.has(o))return o;let l=document.querySelector("#lia-toc #focusedToc[href], #lia-toc a[aria-current='page'][href]"),n=l?w(l.getAttribute("href")??""):null;if(null!==n&&t.has(n))return n;let r=e.parentElement;if(r){let o=[...r.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName),l=o.indexOf(e);if(o.length>1&&t.has(l))return l}return 1===t.size?[...t][0]:null}(o,t);if(null!==l){let e,t,r;n.catalogSection(l,(t=(e=[...o.querySelectorAll(s)].filter(u)).map(k),r=new Map,t.forEach(e=>{e&&r.set(e,(r.get(e)??0)+1)}),e.map((e,o)=>{let l=t[o];return{id:l&&1===r.get(l)?`anchor:${encodeURIComponent(l)}`:`ordinal:${o}`,state:e.classList.contains("solved")?"solved":e.classList.contains("resolved")?"resolved":"open"}})))}},E=()=>{S(),!g&&n.allSolved()&&(g=!0,e.allSolved?.()),!m&&n.allCompleted()&&(m=e.courseCompleted())},C=e=>{z||=e,v||(v=!0,window.setTimeout(()=>{let e=e=>{"function"==typeof window.requestAnimationFrame?window.requestAnimationFrame(()=>e()):window.setTimeout(e,0)};e(()=>{e(()=>{let e=z;v=!1,z=!1,e?E():S()})})},0))};"u">typeof document&&document.documentElement&&"u">typeof MutationObserver&&((0,i.observeLiaSlideActivity)(()=>C(!0)),new MutationObserver(e=>{e.some(e=>"attributes"===e.type&&e.target instanceof Element&&e.target.matches(s))?C(!0):e.some(e=>[...e.addedNodes,...e.removedNodes].some(x))&&C(!1)}).observe(document.documentElement,{attributeFilter:["class"],attributes:!0,childList:!0,subtree:!0}),(0,r.onCourseMarkdownChange)(()=>{n.reset(),m=!1,g=!1,C(!1)}),S()),window.addEventListener("click",n=>{var r;let i=(r=n.target)instanceof Element?r:r instanceof Node?r.parentElement:null;if(!i)return;let u=i.closest(a);if(u&&p(u)){let o=u.closest(s);if(!o||!o.classList.contains("open")||!o.querySelector(c))return;if(t.has(o)||!e.useCheck())return void d(n);if(!e.active())return;t.add(o);let l=h(o),r=()=>{t.delete(o)};return void y(o,()=>{let e=h(o);return o.classList.contains("solved")?"solved":o.classList.contains("resolved")?"resolved":e>l?"failed":null},t=>{r(),"failed"===t?e.failed():("resolved"===t?e.failed():e.solved(o),E())},r)}let m=i.closest(".lia-quiz__hint");if(m&&p(m)){let t=m.closest(s);if(!t||!t.classList.contains("open"))return;if(o.has(t)||!e.useHint())return void d(n);if(!e.active())return;o.add(t);let l=f(t),r=()=>{o.delete(t)};return void y(t,()=>{let e=f(t)-l;return e>0?e:null},t=>{r(),e.hint(t)},r)}let g=i.closest(c);if(g&&p(g)){let t=g.closest(s);if(!t||!t.classList.contains("open"))return;if(l.has(t)||!e.useResolve())return void d(n);if(!e.active())return;l.add(t);let o=()=>{l.delete(t)};y(t,()=>!!(t.classList.contains("solved")||t.classList.contains("resolved"))||null,()=>{o(),E()},o)}},!0)}},{"./course-chests.ts":"2ceW6","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"2KjdS":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"LootIfStore",()=>p);var r=e("./course-identity.ts"),i=e("./lock-targets.ts"),a=e("./loot-if-options.ts");function s(e){if(!Array.isArray(e)||!e.every(e=>"string"==typeof e&&e.trim().length>0))return null;let t=e.map(e=>e.trim());return new Set(t).size===t.length?t:null}function c(){return`lia-loot:loot-if:v1:${encodeURIComponent((0,r.liaCourseIdentity)())}`}function u(e){try{window.sessionStorage.setItem(c(),JSON.stringify(e))}catch{}}function d(e){return e.trim()||null}class p{isSpawned(e){let t=d(e);return null!==t&&this.current.spawned.includes(t)}spawn(e){return this.recordId(e,this.current.spawned)}isQuizSolved(e){let t=d(e);return null!==t&&this.current.solvedQuizzes.includes(t)}recordSolvedQuiz(e){return this.recordId(e,this.current.solvedQuizzes)}recordSecretSlideVisit(){return!this.current.secretSlideVisited&&(this.current.secretSlideVisited=!0,u(this.current),!0)}recordOpenedLockTarget(e){let t=(0,i.resolveLockTarget)(e);return!(!t||this.current.openedLockTargets.includes(t))&&(this.current.openedLockTargets.push(t),u(this.current),!0)}hasOpenedLockTarget(e){let t=(0,i.resolveLockTarget)(e);return null!==t&&this.current.openedLockTargets.includes(t)}recordHighlight(e,t){if(!a.MARKER_COLORS.includes(e))return!1;let o=(0,a.normalizeHighlightedWord)(t);if(!o||o.length>512)return!1;let l=this.recordHighlightColor(e,!1);return this.current.highlightedWords.some(t=>t.color===e&&t.word===o)?(l&&u(this.current),l):(this.current.highlightedWords.push({color:e,word:o}),u(this.current),!0)}recordHighlightColor(e,t=!0){return!(!a.MARKER_COLORS.includes(e)||this.current.highlightedColors.includes(e))&&(this.current.highlightedColors.push(e),t&&u(this.current),!0)}hasHighlight(e,t){if(null==t)return this.current.highlightedColors.includes(e);let o=(0,a.normalizeHighlightedWord)(t);return!!o&&this.current.highlightedWords.some(t=>t.color===e&&t.word===o)}state(){var e;return{version:1,highlightedColors:[...(e=this.current).highlightedColors],highlightedWords:e.highlightedWords.map(e=>({...e})),openedLockTargets:[...e.openedLockTargets],secretSlideVisited:e.secretSlideVisited,solvedQuizzes:[...e.solvedQuizzes],spawned:[...e.spawned]}}recordId(e,t){let o=d(e);return!(!o||t.includes(o))&&(t.push(o),u(this.current),!0)}constructor(){this.current=function(){try{let e=window.sessionStorage.getItem(c());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||"boolean"!=typeof e.secretSlideVisited)return null;let t=function(e){if(!Array.isArray(e))return null;let t=[],o=new Set;for(let l of e){if(!l||"object"!=typeof l||!a.MARKER_COLORS.includes(l.color)||"string"!=typeof l.word)return null;let e=(0,a.normalizeHighlightedWord)(l.word);if(!e||e.length>512)return null;let n=`${l.color}:${e}`;if(o.has(n))return null;o.add(n),t.push({color:l.color,word:e})}return t}(e.highlightedWords);if(!Array.isArray(e.highlightedColors)||!e.highlightedColors.every(e=>a.MARKER_COLORS.includes(e)))return null;let o=[...e.highlightedColors];if(new Set(o).size!==o.length)return null;let l=s(e.solvedQuizzes),n=s(e.spawned),r=void 0===e.openedLockTargets?[]:e.openedLockTargets;if(!Array.isArray(r)||!r.every(e=>"string"==typeof e&&(0,i.resolveLockTarget)(e)===e))return null;let c=[...r];return new Set(c).size===c.length&&t&&l&&n?{version:1,highlightedColors:o,highlightedWords:t,openedLockTargets:c,secretSlideVisited:e.secretSlideVisited,solvedQuizzes:l,spawned:n}:null}(t)}catch{return null}}()??{version:1,highlightedColors:[],highlightedWords:[],openedLockTargets:[],secretSlideVisited:!1,solvedQuizzes:[],spawned:[]}}}},{"./course-identity.ts":"g3iqo","./lock-targets.ts":"1CWW8","./loot-if-options.ts":"6qN0r","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],bLBcI:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"courseLockUnitCount",()=>F),n.export(o,"refreshObjectLocks",()=>ed),n.export(o,"installObjectLocks",()=>ep);var r=e("./course-chests.ts"),i=e("./lock-options.ts"),a=e("./lock-targets.ts"),s=e("./template-targets.ts"),c=e("./slide-activity.ts"),u=e("./exploration.ts"),d=e("./slide-navigation-lock.ts");let p="lia-loot-lock",h=".lia-quiz",f="lia-loot-lock-status",m={mode:{rootSelector:"#lia-support-menu .lia-support-menu__item--mode",triggerGroup:"mode",contentGroup:"mode",focusSelector:"#lia-mode-textbook"},menu:{rootSelector:"#lia-support-menu .lia-support-menu__item--settings",triggerGroup:"setting",contentGroup:"setting",focusSelector:"#lia-btn-light-mode"},translator:{rootSelector:"#lia-support-menu .lia-support-menu__item--lang",triggerGroup:"translation",contentGroup:"translation",focusSelector:"#lia-checkbox-google_translate"},classroom:{rootSelector:"#lia-support-menu .lia-support-menu__item--share",triggerGroup:"share",contentGroup:"share",focusSelector:"#lia-button-qr-code"},info:{rootSelector:"#lia-support-menu .lia-support-menu__item--info",triggerGroup:"information",contentGroup:"information",focusSelector:""}},g={check:".lia-quiz__control .lia-quiz__check",resolve:".lia-quiz__control .lia-quiz__resolve",hint:".lia-quiz__control .lia-quiz__hint"},b={toc:"Inhaltsverzeichnis",mode:"Darstellung",menu:"Menü",translator:"Übersetzer",classroom:"Classroom",info:"Info-Menü",seitenwechsel:"Seitenwechsel",check:"Prüfen",resolve:"Auflösen",hint:"Hinweis",pentominoquiz:"Pentomino-Quiz",portal:"Portal",...s.TEMPLATE_TARGET_LABELS},v={red:"Rotes Schloss",blue:"Blaues Schloss",green:"Grünes Schloss",yellow:"Gelbes Schloss",purple:"Lilafarbenes Schloss",orange:"Orangefarbenes Schloss",magenta:"Magentafarbenes Schloss",white:"Weißes Schloss",black:"Schwarzes Schloss",turquoise:"Türkisfarbenes Schloss",gray:"Graues Schloss",brown:"Braunes Schloss"},y={red:"roten Schlüssel",blue:"blauen Schlüssel",green:"grünen Schlüssel",yellow:"gelben Schlüssel",purple:"lilafarbenen Schlüssel",orange:"orangefarbenen Schlüssel",magenta:"magentafarbenen Schlüssel",white:"weißen Schlüssel",black:"schwarzen Schlüssel",turquoise:"türkisfarbenen Schlüssel",gray:"grauen Schlüssel",brown:"braunen Schlüssel"},w={red:"roter Schlüssel",blue:"blauer Schlüssel",green:"grüner Schlüssel",yellow:"gelber Schlüssel",purple:"lilafarbener Schlüssel",orange:"orangefarbener Schlüssel",magenta:"magentafarbener Schlüssel",white:"weißer Schlüssel",black:"schwarzer Schlüssel",turquoise:"türkisfarbener Schlüssel",gray:"grauer Schlüssel",brown:"brauner Schlüssel"},k=new Map,x=[],z=new Map,S=new Set,E=new WeakMap,C=new WeakMap,L=new WeakMap,_=null,A=[],I=null,T=null,N=0,R=0,j=0,P="idle",O=!1,M=!1,$=!1,q=!1;function D(e){return"global"===e.scope?e.onlyOnSlide?null!==e.sourceSection?`lock:${e.target}:section-${e.sourceSection}:${e.color}`:`lock:${e.baseId}:${e.target}:${e.color}`:`lock:${e.target}:${e.color}`:(0,a.isTemplateLockTarget)(e.target)&&null!==e.sourceSection?`lock:${e.target}:section-${e.sourceSection}:${e.color}`:`lock:${e.baseId}:${e.target}:${e.color}`}function H(e){let t=E.get(e);if(t)return t;R+=1;let o=`quiz-${R}`;return E.set(e,o),o}function K(e){if("global"!==e.scope)return z.delete(e.baseId),e;let t={...e};return e.onlyOnSlide||delete t.sourceHost,z.set(e.baseId,t),e}function G(e){let t=function(e){let t=e.getAttribute("data-lock-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootLockRuntimeId;if(o)return o;N+=1;let l=`runtime-lock-${N}`;return e.dataset.lootLockRuntimeId=l,l}(e);if((0,u.hostIsRevealBlocked)(e,!1))return z.delete(t),null;let o=(0,i.parseLockSpecification)(e.getAttribute("data-target")??"",e.getAttribute("data-color")??""),l=(0,a.resolveLockTarget)(o.target);if(e.classList.add("loot-object-lock-host"),"true"!==e.getAttribute("aria-hidden")&&e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren(),delete e.dataset.lootLockError,!l||!o.valid||!o.color)return z.delete(t),null;let n=(0,c.sectionFromLootId)(t),r={baseId:t,target:l,color:o.color,onlyOnSlide:o.onlyOnSlide,sourceSection:n,sourceHost:e};if((0,a.isTemplateLockTarget)(l)){let e="global"===(0,s.templateTargetDefinition)(l).scope?"global":"local";return K({...r,scope:e})}if((0,a.isGlobalLockTarget)(l))return K({...r,scope:"global"});if((0,a.isItemLockTarget)(l))return K({...r,scope:"local"});let d=function(e){let t=e.closest(h);if(t)return t;let o=e.closest("main.lia-slide__content");if(!o)return null;let l=e;for(;l!==o;){let e=l.previousElementSibling;for(;e instanceof HTMLElement&&function(e){let t=[...e.children];return 1===t.length&&t[0]instanceof HTMLElement&&t[0].matches(p)}(e);)e=e.previousElementSibling;if(e instanceof HTMLElement){if(e.matches(h))return e;let t=e.querySelectorAll(h);return t[t.length-1]??null}if(!(l.parentElement instanceof HTMLElement))break;l=l.parentElement}return null}(e);return d?K({...r,scope:"local",quiz:d}):(z.delete(t),e.dataset.lootLockError="quiz-not-adjacent",null)}function F(e,t=()=>!0){let o=new Set;for(let l of e){let e=(0,a.resolveLockTarget)(l.target);if(!e||(0,a.isTemplateLockTarget)(e)&&!t(e))continue;let n=(0,a.isTemplateLockTarget)(e)?"global"===(0,s.templateTargetDefinition)(e).scope?"global":"local":(0,a.isGlobalLockTarget)(e)?"global":(0,a.isLocalLockTarget)(e)||(0,a.isItemLockTarget)(e)?"local":null;n&&o.add(D({baseId:l.baseId,target:e,color:l.color,onlyOnSlide:l.onlyOnSlide,scope:n,sourceSection:l.section}))}return o.size}function V(e,t){for(let t of(x.length=0,e)){let e=function(e){let t=(0,a.resolveLockTarget)(e.target);return t&&(0,a.isTemplateLockTarget)(t)?{baseId:e.baseId,target:t,color:e.color,onlyOnSlide:e.onlyOnSlide,scope:"global"===(0,s.templateTargetDefinition)(t).scope?"global":"local",sourceSection:e.section}:t&&(0,a.isGlobalLockTarget)(t)?{baseId:e.baseId,target:t,color:e.color,onlyOnSlide:e.onlyOnSlide,scope:"global",sourceSection:e.section}:null}(t);e&&x.push(e)}P="complete",_?.catalogReady(F(t)),el()}function B(){let e=document.getElementById(f);if(e)return e;let t=document.createElement("div");return t.id=f,t.className="loot-object-lock-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function W(e,t){return[...e.children].filter(e=>e instanceof HTMLElement&&e.matches(t))}function U(e,t,o){e.getAttribute(t)!==o&&e.setAttribute(t,o)}function Z(e,t,o){null===o?e.removeAttribute(t):e.setAttribute(t,o)}function Y(e,t){return e.length===t.length&&e.every((e,o)=>e===t[o])}function Q(e,t,o){e.style[t]!==o&&(e.style[t]=o)}function X(e){for(let t of e.binding.controls)!function(e,t){if(e.states.get(t))return;let o={inert:t.inert,kind:"control",tabIndex:t.getAttribute("tabindex")};e.states.set(t,o)}(e,t),t.inert||(t.inert=!0),U(t,"tabindex","-1");for(let t of e.binding.contents)!function(e,t){if(e.states.get(t))return;let o={ariaHidden:t.getAttribute("aria-hidden"),concealed:t.classList.contains("loot-object-lock-concealed"),inert:t.inert,kind:"content"};e.states.set(t,o)}(e,t),t.inert||(t.inert=!0),U(t,"aria-hidden","true"),t.classList.add("loot-object-lock-concealed");!function(e){if("floating"!==e.binding.mode)return;let t=e.binding.anchor.getBoundingClientRect(),o=e.binding.anchor.ownerDocument.defaultView??window,l=e.binding.anchor.isConnected&&t.width>0&&t.height>0&&t.right>0&&t.bottom>0&&t.left<o.innerWidth&&t.top<o.innerHeight;e.button.hidden===l&&(e.button.hidden=!l),l&&(Q(e.button,"left",`${t.left}px`),Q(e.button,"top",`${t.top}px`),Q(e.button,"width",`${t.width}px`),Q(e.button,"height",`${t.height}px`),e.button.classList.toggle("loot-object-lock-button--near-top",t.top<96))}(e)}function J(e,t,o){let l;null!==e.feedbackTimer&&(window.clearTimeout(e.feedbackTimer),e.feedbackTimer=null),e.button.classList.toggle("loot-object-lock-button--missing","missing"===o),e.button.classList.toggle("loot-object-lock-button--unlocking","unlocking"===o);let n=e.button.querySelector(".loot-object-lock-message");n&&(n.textContent=t),(l=B()).textContent="",window.setTimeout(()=>{l.textContent=t},0),"missing"===o&&(e.feedbackTimer=window.setTimeout(()=>{e.feedbackTimer=null,e.button.classList.remove("loot-object-lock-button--missing"),n&&(n.textContent="")},2200))}function ee(e){let t=D(e);return!_?.unlocked(t)||S.has(t)}function et(e){return"seitenwechsel"===e.target&&(!e.onlyOnSlide||(0,c.sourceSlideIsActive)(e.sourceSection,e.sourceHost))&&!_?.unlocked(D(e))}function eo(){if(!_)return void(0,d.setSlideNavigationLocked)(!1);let e=function(){let e=[...x,...z.values()];document.querySelectorAll(p).forEach(t=>{let o=G(t);o&&e.push(o)});let t=[],o=new Set;for(let l of e){let e=D(l);o.has(e)||(o.add(e),t.push(l))}return t}();(0,d.setSlideNavigationLocked)(e.some(et));let t=function(e){let t=new Map;for(let o of e){let e=function(e){if(e.onlyOnSlide&&!(0,c.sourceSlideIsActive)(e.sourceSection,e.sourceHost))return null;if((0,a.isItemLockTarget)(e.target)){if(!(0,a.isItemLockTarget)(e.target)||!e.sourceHost?.isConnected||!(0,c.sourceSlideIsActive)(e.sourceSection,e.sourceHost))return null;let t=function(e){let t=e.closest("main.lia-slide__content");if(!t)return null;let o=null;for(let l of t.querySelectorAll("lia-loot-slide-portal"))(4&l.compareDocumentPosition(e))!=0&&(o=l);return o}(e.sourceHost),o=t?.querySelector("[data-loot-slide-portal-button]");return t&&o?{slotKey:`item:portal:${function(e){let t=C.get(e);if(t)return t;j+=1;let o=`portal-${j}`;return C.set(e,o),o}(t)}`,root:t,anchor:o,controls:[o],contents:[],mode:"floating",focusCandidates:[o]}:null}if((0,a.isTemplateLockTarget)(e.target)){if(!(0,a.isTemplateLockTarget)(e.target))return null;let t=(0,s.templateTargetDefinition)(e.target),o=(0,s.findTemplateTarget)(e.target,"lock",document);return o&&("slide"!==t.scope||(0,c.sourceSlideIsActive)(e.sourceSection,o.root))?{slotKey:"global"===t.scope?`template:global:${e.target}`:`template:${e.target}:section-${e.sourceSection??e.baseId}`,root:o.root,anchor:o.lockAnchor,controls:o.lockControls,contents:[],mode:"floating",focusCandidates:o.focusCandidates}:null}return"global"===e.scope?function(e){let t=m[e];if(t){let o=document.querySelector(t.rootSelector);if(!o)return null;let l=W(o,`button[data-group-id='${t.triggerGroup}'], i.hide-md-up`),n=W(o,`.lia-support-menu__submenu[data-group-id='${t.contentGroup}']`),r=t.focusSelector?o.querySelector(t.focusSelector):null;return{slotKey:`global:${e}`,root:o,anchor:o,controls:l,contents:n,mode:"fill",focusCandidates:[...l,...r?[r]:[],o]}}if("toc"===e){let e=document.querySelector("#lia-toc"),t=document.querySelector("#lia-btn-toc");return e&&t?{slotKey:"global:toc",root:e,anchor:t,controls:[t],contents:W(e,".lia-toc__content"),mode:"floating",focusCandidates:[t]}:null}if("seitenwechsel"===e){let e=document.querySelector(".lia-pagination"),t=e?.querySelector(":scope > .lia-pagination__content");if(!e||!t)return null;let o=document.querySelector("#lia-btn-prev"),l=document.querySelector("#lia-btn-next");return{slotKey:"global:seitenwechsel",root:e,anchor:t,controls:[o,l].filter(e=>null!==e),contents:[],mode:"floating",focusCandidates:[l,o].filter(e=>null!==e)}}return null}(e.target):function(e){if(!e.quiz||!e.quiz.isConnected||!(0,a.isLocalLockTarget)(e.target))return null;if("pentominoquiz"===e.target){let t=function(e){let t=function(e){let t=function(e){let t=e.closest("main.lia-slide__content");if(!t)return null;let o=e;for(;o.parentElement&&o.parentElement!==t;)o=o.parentElement;return o.parentElement===t?o:null}(e),o=t?.previousElementSibling;if(!(o instanceof HTMLElement)||!o.classList.contains("lia-pentomino-quiz-task"))return null;let l=o.querySelectorAll(".lia-pentomino-quiz[data-board-id], .lia-pentomino-dock-quiz[data-board-id]");return 1===l.length?l[0]:null}(e),o=e.ownerDocument.defaultView;if(!t||"function"!=typeof o?.LiaPentomino?.checkQuiz)return null;let l=t.dataset.boardId?.trim(),n=l?o.__boards?.[l]?.containerObj:null;if(!(n instanceof HTMLElement)||!n.isConnected||n.ownerDocument!==e.ownerDocument)return null;let r=n.getRootNode(),i=r instanceof ShadowRoot&&r.host instanceof HTMLElement?r.host:null;if(!i?.isConnected||i.ownerDocument!==e.ownerDocument||!i.matches("jsx-graph"))return null;let a=i,s=n.querySelector(".lia-pentomino-rotate-button > button");if(t.classList.contains("lia-pentomino-dock-quiz")){let o=t.dataset.dockMarkerId?.trim(),l=o?e.ownerDocument.getElementById(o):null,n=l?.closest(".lia-pentomino-workspace");if(!(l instanceof HTMLElement)||!l.classList.contains("lia-pentomino-dock")||!n?.contains(i))return null;a=n,s=n.querySelector(".lia-pentomino-dock-toggle")}else if(!t.classList.contains("lia-pentomino-quiz"))return null;let c=e.querySelector(".lia-quiz__check");return{primary:a,controls:[a,e,...s?[s]:[]],focusCandidates:[s,c,a,e].filter(e=>null!==e)}}(e.quiz);return t?{slotKey:`local:${H(e.quiz)}:${e.target}`,root:t.primary,anchor:t.primary,controls:t.controls,contents:[],mode:"floating",focusCandidates:t.focusCandidates}:null}let t=e.quiz.querySelector(g[e.target]);return t&&function(e,t){let o=e.classList.contains("open")&&!t.hasAttribute("hidden")&&!(t instanceof HTMLButtonElement&&t.disabled)&&"true"!==t.getAttribute("aria-hidden")&&t.getClientRects().length>0;if(o){let e=L.get(t);e&&("-1"===t.getAttribute("tabindex")&&Z(t,"tabindex",e.value),L.delete(t))}return o}(e.quiz,t)?{slotKey:`local:${H(e.quiz)}:${e.target}`,root:e.quiz,anchor:t,controls:[t],contents:[],mode:"floating",focusCandidates:[t]}:null}(e)}(o);if(!e)continue;let l=t.get(e.slotKey);l?l.requests.push(o):t.set(e.slotKey,{binding:e,requests:[o]})}let o=new Map;if(!_)return o;for(let[e,l]of t){let t=l.requests.find(ee);t&&o.set(e,{binding:l.binding,request:t})}return o}(e);for(let[e,n]of[...k]){let r=t.get(e);if(!r||D(r.request)!==n.lockId||(o=r.binding,l=n.binding,!(o.root===l.root&&o.anchor===l.anchor&&o.mode===l.mode&&Y(o.controls,l.controls)&&Y(o.contents,l.contents)))){var o,l;for(let[e,t]of(null!==n.feedbackTimer&&window.clearTimeout(n.feedbackTimer),n.states))!function(e,t){if(e.inert&&(e.inert=t.inert),"content"===t.kind){"true"===e.getAttribute("aria-hidden")&&Z(e,"aria-hidden",t.ariaHidden??null),e.classList.contains("loot-object-lock-concealed")&&e.classList.toggle("loot-object-lock-concealed",t.concealed??!1);return}let o=e.hasAttribute("hidden")||"true"===e.getAttribute("aria-hidden")||e instanceof HTMLButtonElement&&e.disabled||0===e.getClientRects().length;"-1"===e.getAttribute("tabindex")&&(o?L.set(e,{value:t.tabIndex??null}):(Z(e,"tabindex",t.tabIndex??null),L.delete(e)))}(e,t);n.states.clear(),I?.unobserve(n.binding.anchor),n.button.remove(),n.rootWasTarget||n.binding.root.classList.remove("loot-object-lock-target"),k.delete(e)}}for(let[e,o]of t){let t=k.get(e);t?X(t):k.set(e,function(e,t){for(let e of t.controls)"true"===e.getAttribute("aria-expanded")&&e.click();let o=D(e),l=function(e,t,o,l=document){let n=l.createElement("button");return n.type="button",n.className=`loot-object-lock-button loot-object-lock-button--${e.scope} loot-key-color--${e.color}`,n.dataset.lootLockButton=t,n.dataset.lootLockId=t,n.dataset.lootLockTarget=e.target,n.dataset.lootLockColor=e.color,n.dataset.lootLockScope=e.scope,n.setAttribute("aria-label",`${b[e.target]} gesperrt. Einen ${y[e.color]} verwenden.`),n.innerHTML=`
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
    <span class="loot-object-lock-label" aria-hidden="true">${v[e.color]}</span>
    <span class="loot-object-lock-message" aria-hidden="true"></span>
  `,n.addEventListener("click",e=>{e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),function(e){let t=k.get(e);if(!_||!t||S.has(t.lockId))return;let o=_.unlock(t.lockId,t.request.color,t.request.target);if("missing-key"===o)return J(t,`${b[t.request.target]} ist gesperrt. Du brauchst einen ${y[t.request.color]}.`,"missing");if("invalid-lock-id"===o)return;S.add(t.lockId),J(t,"unlocked"===o?`${b[t.request.target]} entsperrt. Ein ${w[t.request.color]} wurde verwendet.`:`${b[t.request.target]} ist bereits entsperrt.`,"unlocking");let l=t.lockId,n=t.binding;window.setTimeout(()=>{S.delete(l),eo();let t=k.get(e);t?t.button.focus({preventScroll:!0}):function(e){for(let t of e.focusCandidates)if(function(e){let t=e.getBoundingClientRect();return e.isConnected&&!e.hasAttribute("hidden")&&!e.inert&&!(e instanceof HTMLButtonElement&&e.disabled)&&t.width>0&&t.height>0&&"true"!==e.getAttribute("aria-hidden")&&e.tabIndex>=0}(t)&&(t.focus({preventScroll:!0}),t.ownerDocument.activeElement===t))return;let t=e.root.getAttribute("tabindex"),o=()=>{e.root.removeEventListener("blur",o),Z(e.root,"tabindex",t),es()};e.root.setAttribute("tabindex","-1"),es(),e.root.addEventListener("blur",o,{once:!0}),e.root.focus({preventScroll:!0})}(n)},620)}(o)}),n}(e,o,t.slotKey,t.anchor.ownerDocument);l.classList.add(`loot-object-lock-button--${t.mode}`);let n={binding:t,button:l,feedbackTimer:null,lockId:o,request:e,rootWasTarget:t.root.classList.contains("loot-object-lock-target"),states:new Map};return"fill"===t.mode?(t.root.classList.add("loot-object-lock-target"),t.root.appendChild(l)):t.anchor.ownerDocument.body.appendChild(l),I?.observe(t.anchor),X(n),n}(o.request,o.binding))}es()}function el(){null===T&&(T=window.setTimeout(()=>{T=null,eo()},0))}function en(e){return e?1===e.nodeType?e:e.parentElement:null}function er(e){let t=en(e);return!!t?.closest(`[data-loot-lock-button], #${f}`)}function ei(e){if(er(e.target)||function(e){let t,o;if("attributes"!==e.type||!e.attributeName)return!1;let l=en(e.target);if(!l)return!1;let n=[...k.values()];if("tabindex"===e.attributeName)return n.some(e=>e.binding.controls.includes(l))&&"-1"===l.getAttribute("tabindex");if("aria-hidden"===e.attributeName)return n.some(e=>e.binding.contents.includes(l))&&"true"===l.getAttribute("aria-hidden");if("class"!==e.attributeName)return!1;let r=(t=new Set((e.oldValue??"").split(/\s+/u).filter(Boolean)),[...new Set([...t,...o=new Set((l.getAttribute("class")??"").split(/\s+/u).filter(Boolean))])].filter(e=>t.has(e)!==o.has(e)));if(1!==r.length)return!1;if("loot-object-lock-concealed"===r[0]){let e=n.some(e=>e.binding.contents.includes(l));return l.classList.contains(r[0])===e}if("loot-object-lock-target"===r[0]){let e=n.some(e=>"fill"===e.binding.mode&&e.binding.root===l);return l.classList.contains(r[0])===e}return!1}(e))return!1;if("childList"!==e.type)return!0;let t=[...Array.from(e.addedNodes),...Array.from(e.removedNodes)];return 0===t.length||t.some(e=>{if(!er(e))return!0;let t=en(e),o=t?.closest("[data-loot-lock-button]");return!!o&&[...k.values()].some(e=>e.button===o)!==o.isConnected})}function ea(e){e.some(ei)&&el()}function es(){A.flatMap(e=>e.takeRecords()).some(ei)&&el()}function ec(e){var t;let o=(t=e.target,t?.nodeType===1?t:t&&"number"==typeof t.nodeType?t.parentElement:null);if(o){for(let t of k.values())if([...t.binding.controls,...t.binding.contents].some(e=>e===o||e.contains(o))){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation();return}}}class eu extends HTMLElement{static get observedAttributes(){return["data-lock-id","data-target","data-color"]}connectedCallback(){G(this),el()}attributeChangedCallback(){this.isConnected&&(G(this),el())}}function ed(){eo()}function ep(e){if(_=e,"idle"===P&&(P="pending",(0,r.discoverCourseLocks)().then(({declarations:e,catalog:t})=>V(e,t)).catch(()=>V([],[]))),B(),customElements.get(p)||customElements.define(p,eu),!O){O=!0;let e=(0,s.templateDocumentCandidates)(document);for(let t of e)t.addEventListener("click",ec,!0);(0,d.installSlideNavigationLock)(e)}if(q||(q=!0,document.addEventListener(u.REVEAL_CHANGED_EVENT,el)),0===A.length)for(let e of(0,s.templateDocumentCandidates)(document)){let t=new(e.defaultView?.MutationObserver??MutationObserver)(ea);t.observe(e.documentElement,{attributeFilter:["aria-hidden","class","data-open","disabled","hidden","style","tabindex"],attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),A.push(t)}if(M||(M=!0,(0,c.observeLiaSlideActivity)(el)),!$){if($=!0,"ResizeObserver"in window)for(let e of(I=new ResizeObserver(el),k.values()))I.observe(e.binding.anchor);let e=new Set;for(let t of(0,s.templateDocumentCandidates)(document)){let o=t.defaultView;o&&!e.has(o)&&(e.add(o),o.addEventListener("resize",el,{passive:!0}),o.addEventListener("scroll",el,{capture:!0,passive:!0}),o.visualViewport?.addEventListener("resize",el,{passive:!0}),o.visualViewport?.addEventListener("scroll",el,{passive:!0})),t.addEventListener("load",el,!0),t.fonts?.ready.then(el)}}ed()}},{"./course-chests.ts":"2ceW6","./lock-options.ts":"3c981","./lock-targets.ts":"1CWW8","./template-targets.ts":"9odGA","./slide-activity.ts":"5qduG","./exploration.ts":"5BeJ3","./slide-navigation-lock.ts":"lbx2r","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],lbx2r:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"isSequentialSlideNavigationKey",()=>d),n.export(o,"isSequentialSlideNavigationSwipe",()=>p),n.export(o,"isEditableSlideNavigationTarget",()=>f),n.export(o,"preserveEditableSlideNavigation",()=>m),n.export(o,"setSlideNavigationLocked",()=>y),n.export(o,"installSlideNavigationLock",()=>w);let r=new WeakSet,i=new WeakSet,a=new WeakMap,s=new WeakMap,c=new WeakSet,u=!1;function d(e){if("ArrowLeft"===e.key||"ArrowRight"===e.key)return!0;let t=e.key.toLocaleLowerCase("en-US");return e.altKey&&e.shiftKey&&!e.ctrlKey&&!e.metaKey&&("n"===t||"p"===t)}function p(e){return!![e.elapsedMs,e.endX,e.endY,e.startX,e.startY].every(Number.isFinite)&&!(e.elapsedMs<0)&&!(e.elapsedMs>300)&&Math.abs(e.endX-e.startX)>=150&&100>=Math.abs(e.endY-e.startY)}function h(e){let t=e?1===e.nodeType&&"function"==typeof e.closest?e:e.parentElement??null:null;if(!t)return null;let o=t.closest(".ace_editor, .CodeMirror");return o||(t.isContentEditable?t:t.closest("input,textarea,select,option,[contenteditable]:not([contenteditable='false']),[role='textbox'],[role='combobox'],[role='listbox'],[role='slider'],[role='spinbutton'],[role='radiogroup'],[role='tree'],[role='grid'],[role='menu'],.ace_editor,.CodeMirror"))}function f(e){return null!==h(e)}function m(e){let t=h(e.target);if(!t)return!1;let o=["key","code","keyCode","which"],l={key:e.key,code:e.code,keyCode:e.keyCode,which:e.which},n={key:"Unidentified",code:"Unidentified",keyCode:0,which:0},r=new Map,i=()=>{for(let t of o){let o=r.get(t);o?Object.defineProperty(e,t,o):delete e[t]}};try{for(let i of o)r.set(i,Object.getOwnPropertyDescriptor(e,i)),Object.defineProperty(e,i,{configurable:!0,get:()=>{let o=e.currentTarget;return o instanceof Node&&(o===t||t.contains(o))?l[i]:n[i]}})}catch{return i(),!1}let a=t=>{t===e&&(t.stopPropagation(),i())};return t.addEventListener("keydown",a,{once:!0}),(e.view??window).setTimeout(()=>{t.removeEventListener("keydown",a),i()},0),!0}function g(e){u&&d(e)&&(m(e)||(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation()))}function b(e,t){t.preventDefault(),t.stopImmediatePropagation(),t.stopPropagation(),c.add(e),e.setTimeout(()=>c.delete(e),0)}function v(e,t,o,l){return{elapsedMs:l.performance.now()-e.startedAt,endX:t,endY:o,startX:e.x,startY:e.y}}function y(e){u=e}function w(e){for(let t of e){let e=t.defaultView;e&&!i.has(e)&&(i.add(e),e.addEventListener("keydown",g,!0),e.addEventListener("touchstart",t=>(function(e,t){if(!u||1!==t.touches.length)return void s.delete(e);let o=t.touches.item(0);o&&s.set(e,{identifier:o.identifier,startedAt:e.performance.now(),x:o.clientX,y:o.clientY})})(e,t),{capture:!0,passive:!0}),e.addEventListener("touchend",t=>(function(e,t){let o=s.get(e);if(s.delete(e),!u||!o||void 0===o.identifier)return;let l=function(e,t){for(let o=0;o<e.length;o+=1){let l=e.item(o);if(l?.identifier===t)return l}return null}(t.changedTouches,o.identifier);l&&p(v(o,l.clientX,l.clientY,e))&&b(e,t)})(e,t),{capture:!0,passive:!1}),e.addEventListener("touchcancel",()=>s.delete(e),!0),e.addEventListener("mousedown",t=>{!u||0!==t.button?a.delete(e):a.set(e,{startedAt:e.performance.now(),x:t.clientX,y:t.clientY})},!0),e.addEventListener("mouseup",t=>(function(e,t){let o=a.get(e);a.delete(e),u&&o&&0===t.button&&p(v(o,t.clientX,t.clientY,e))&&b(e,t)})(e,t),!0),e.addEventListener("click",t=>{c.has(e)&&(c.delete(e),t.preventDefault(),t.stopImmediatePropagation(),t.stopPropagation())},!0)),r.has(t)||(r.add(t),t.addEventListener("keydown",g,!0))}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],cCRZG:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"showHighscore",()=>p),n.export(o,"hideHighscore",()=>h);var r=e("./score"),i=e("./style");let a="lia-loot-highscore-dialog",s="http://www.w3.org/2000/svg",c={gold:{fill:"#D4AF37",stroke:"#725A00",label:"Goldene Trophäe"},silver:{fill:"#A7A9AC",stroke:"#55585C",label:"Silberne Trophäe"},copper:{fill:"#B87333",stroke:"#6A3517",label:"Kupferfarbene Trophäe"}};function u(e){"function"==typeof e.close&&e.open?e.close():e.removeAttribute("open")}function d(e){return e?.tagName==="DIALOG"?e:null}function p(e,t){let o,l,n,p;(0,i.injectStyles)();let h=function(){let e=d(document.getElementById(a));if(e)return e;let t=document.createElement("dialog");t.id=a,t.className="loot-highscore-dialog";let o=document.createElement("div");o.className="loot-highscore-card",o.setAttribute("data-loot-highscore-content","");let l=document.createElement("button");return l.type="button",l.className="loot-highscore-close",l.setAttribute("aria-label","Highscore schließen"),l.textContent="×",l.addEventListener("click",()=>u(t)),t.addEventListener("click",e=>{e.target===t&&u(t)}),o.appendChild(l),t.appendChild(o),document.body.appendChild(t),t}(),f=h.querySelector("[data-loot-highscore-content]");if(!f)return;f.querySelectorAll(".loot-highscore-trophy, .loot-highscore-points").forEach(e=>e.remove());let m=(0,r.trophyTier)(e,t);m&&f.appendChild((o=c[m],(l=document.createElementNS(s,"svg")).setAttribute("viewBox","0 0 64 64"),l.setAttribute("class","loot-highscore-trophy"),l.setAttribute("role","img"),l.setAttribute("aria-label",o.label),(n=document.createElementNS(s,"path")).setAttribute("d","M18 8h28v10c0 11.5-5.8 20.6-14 23.4V48h10v7H22v-7h10v-6.6C23.8 38.6 18 29.5 18 18V8Z"),n.setAttribute("fill",o.fill),n.setAttribute("stroke",o.stroke),n.setAttribute("stroke-width","2.5"),n.setAttribute("stroke-linejoin","round"),(p=document.createElementNS(s,"path")).setAttribute("d","M18 13H9v5c0 8.8 4.8 14.4 13 16M46 13h9v5c0 8.8-4.8 14.4-13 16"),p.setAttribute("fill","none"),p.setAttribute("stroke",o.stroke),p.setAttribute("stroke-width","4"),p.setAttribute("stroke-linecap","round"),p.setAttribute("stroke-linejoin","round"),l.append(p,n),l));let g=document.createElement("p");g.id="lia-loot-highscore-points",g.className="loot-highscore-points",g.textContent=`${(0,r.formatScore)(e)} Punkte`,f.appendChild(g),h.setAttribute("aria-labelledby",g.id),"function"==typeof h.showModal?h.open||h.showModal():(h.setAttribute("open",""),h.setAttribute("role","dialog"),h.setAttribute("aria-modal","true")),f.querySelector(".loot-highscore-close")?.focus()}function h(){let e=d(document.getElementById(a));e&&u(e)}},{"./score":"abltm","./style":"3Vffy","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"3Vffy":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"injectStyles",()=>s);var r=e("./template-targets.ts");let i="lia-loot-highscore-style",a=`
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
`;function s(e=document){for(let t of(0,r.templateDocumentCandidates)(e)){if(t.getElementById(i))continue;let e=t.createElement("style");e.id=i,e.textContent=a,t.head?.appendChild(e)}}},{"./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1O7ju":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"ResourceStore",()=>d);var r=e("./storage.ts"),i=e("./types.ts");function a(e,t){if(!Number.isFinite(e)||e<0)throw TypeError(`${t} muss eine nichtnegative Zahl sein.`);return Math.floor(e)}function s(e){return{...e,collectedChests:[...e.collectedChests]}}function c(){return{version:1,collected:{gold:[],diamonds:[],energy:[]}}}function u(e){return i.RESOURCE_KINDS.includes(e)}class d{constructor(){this.enabled=!1,this.current=(0,r.loadResources)(),this.chestRewards=(0,r.loadChestRewards)()??c(),this.reconcileChestRewards()}configure(e,t,o){let l=a(e,"Gold"),n=a(t,"Diamanten"),i=void 0===o?null:a(o,"Energie");return this.current&&this.current.initialGold===l&&this.current.initialDiamonds===n&&this.current.initialEnergy===i||(this.current={version:1,initialGold:l,initialDiamonds:n,initialEnergy:i,gold:l,diamonds:n,energy:i,collectedChests:[]},this.chestRewards=c(),(0,r.saveResources)(this.current),(0,r.saveChestRewards)(this.chestRewards)),this.enabled=!0,s(this.current)}spend(e){if(!this.enabled||!this.current)return!0;if("energy"===e){if(null===this.current.energy)return!0;if(this.current.energy<=0)return!1;this.current.energy-=1}else{if(this.current[e]<=0)return!1;this.current[e]-=1}return(0,r.saveResources)(this.current),!0}collectChest(e,t="gold",o=1){let l=e.trim();if(!l||!u(t)||!Number.isSafeInteger(o)||o<=0||!this.enabled||!this.current||this.current.collectedChests.includes(l))return!1;if("energy"===t){if(null===this.current.energy)return!1;let e=this.current.energy+o;if(!Number.isSafeInteger(e))return!1;this.current.energy=e}else{let e=this.current[t]+o;if(!Number.isSafeInteger(e))return!1;this.current[t]=e}return this.current.collectedChests.push(l),this.chestRewards.collected[t].push(l),(0,r.saveResources)(this.current),(0,r.saveChestRewards)(this.chestRewards),!0}classifyCollectedChest(e,t){let o=e.trim();if(!o||!u(t)||!this.current?.collectedChests.includes(o))return!1;for(let e of i.RESOURCE_KINDS)if(this.chestRewards.collected[e].includes(o))return!1;return this.chestRewards.collected[t].push(o),(0,r.saveChestRewards)(this.chestRewards),!0}collectedChestCounts(){return{gold:this.chestRewards.collected.gold.length,diamonds:this.chestRewards.collected.diamonds.length,energy:this.chestRewards.collected.energy.length}}isChestCollected(e){return!!this.current?.collectedChests.includes(e.trim())}state(){return this.enabled&&this.current?s(this.current):null}reconcileChestRewards(){let e=new Set(this.current?.collectedChests??[]),t=new Set,o=!1;for(let l of i.RESOURCE_KINDS){let n=this.chestRewards.collected[l].filter(l=>!e.has(l)||t.has(l)?(o=!0,!1):(t.add(l),!0));n.length!==this.chestRewards.collected[l].length&&(o=!0),this.chestRewards.collected[l]=n}o&&(0,r.saveChestRewards)(this.chestRewards)}}},{"./storage.ts":"8s1BG","./types.ts":"ijQUu","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"7fPSc":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"normalizeSecretTitle",()=>M),n.export(o,"nextPublicSection",()=>$),n.export(o,"publicFallbackSection",()=>q),n.export(o,"deduplicateSecretSections",()=>D),n.export(o,"permitPortalSlideNavigation",()=>ef),n.export(o,"portalSlideNavigationBlockMessage",()=>em),n.export(o,"setPuzzleSlideAccessGuard",()=>eg),n.export(o,"refreshPuzzleSlideAccess",()=>eb),n.export(o,"installSecretSlides",()=>eA);var r=e("./course-chests.ts"),i=e("./course-identity.ts"),a=e("./slide-activity.ts"),s=e("./slide-navigation.ts"),c=e("./slide-navigation-lock.ts");let u="lia-loot-secret-slide",d="#lia-input-search, #lia-toc input[type='search'], #lia-toc input[role='searchbox']",p="lia-loot-secret-slide-status",h="lia-loot-secret-slide-permit:v1",f="#lia-toc .lia-toc__content > a.lia-toc__link[href*='#']",m="#lia-toc a[href*='#']",g=new Set,b=new Set,v=new Set,y=new Map,w=null,k=null,x=null,z=null,S=null,E=!1,C="pending",L=!1,_=!1,A=null,I=null,T=null,N=null,R=null,j=null,P=null,O=null;function M(e){return e.normalize("NFKC").replace(/\s+/gu," ").trim().toLocaleLowerCase("de-DE")}function $(e,t,o,l){for(let n=o+l;n>=0&&n<t;n+=l)if(!e.has(n))return n;return null}function q(e,t,o,l){let n=null===l?-1:o>l?1:-1;return $(e,t,o,n)??$(e,t,o,1===n?-1:1)}function D(e){return[...new Set(e)]}function H(){return(0,i.liaCourseIdentity)()}function K(){try{window.sessionStorage.removeItem(h)}catch{}}function G(e){A=e;let t={course:H(),expiresAt:Date.now()+15e3,section:e};try{window.sessionStorage.setItem(h,JSON.stringify(t))}catch{}}function F(){let e=document.getElementById(p);if(e)return e;let t=document.createElement("div");return t.id=p,t.className="loot-secret-slide-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function V(e){let t=F();t.classList.remove("loot-secret-slide-status--visible"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.textContent="",window.setTimeout(()=>{t.textContent=e},0)}function B(e,t=!1){let o=F();o.classList.add("loot-secret-slide-status--visible"),o.setAttribute("role",t?"alert":"status"),o.setAttribute("aria-live",t?"assertive":"polite"),o.textContent=e}function W(){let e="complete"!==C||_?function(){let e=["main.lia-slide__content:not([hidden])",".lia-pagination",".loot-object-lock-button--local"];"complete"!==C&&e.push("#lia-toc .lia-toc__content","#lia-toc #lia-bm-toc5");let t=new Set;for(let o of e)document.querySelectorAll(o).forEach(e=>{t.add(e)});return t}():new Set;for(let[o,l]of[...y])if(!e.has(o)){var t;o.inert=l.inert,"true"===o.getAttribute("aria-hidden")&&(null===(t=l.ariaHidden)?o.removeAttribute("aria-hidden"):o.setAttribute("aria-hidden",t)),"none"===o.style.pointerEvents&&(o.style.pointerEvents=l.pointerEvents),"hidden"===o.style.visibility&&(o.style.visibility=l.visibility),y.delete(o)}for(let t of e)y.has(t)||y.set(t,{ariaHidden:t.getAttribute("aria-hidden"),inert:t.inert,pointerEvents:t.style.pointerEvents,visibility:t.style.visibility}),t.inert=!0,t.setAttribute("aria-hidden","true"),t.style.pointerEvents="none",t.style.visibility="hidden";let o=document.activeElement;o instanceof HTMLElement&&[...e].some(e=>e===o||e.contains(o))&&o.blur()}function U(e){let t=/^#(\d+)$/.exec(e);if(!t)return null;let o=Number(t[1])-1;return Number.isInteger(o)&&o>=0?o:null}function Z(e){let t=e.getAttribute("href")??"";try{let e=new URL(window.location.href),o=new URL(t,e);if(o.origin!==e.origin||o.pathname!==e.pathname||o.search!==e.search)return null;return U(o.hash)}catch{return null}}function Y(){return[...document.querySelectorAll(m)]}function Q(){return(0,a.activeLiaSection)()}function X(e){return e instanceof HTMLInputElement&&e.matches(d)}function J(e){if(!e.isConnected||e.disabled)return!1;for(let t=e;t;t=t.parentElement){if(t.hidden||t.inert||"true"===t.getAttribute("aria-hidden")||"1"===t.getAttribute("data-lia-bm-hidden"))return!1;try{let e=t.ownerDocument.defaultView?.getComputedStyle(t);if(e?.display==="none"||e?.visibility==="hidden"||e?.visibility==="collapse")return!1}catch{}}return!0}function ee(){return M(function(){if(j&&X(j)&&J(j))return j;let e=document.activeElement;if(X(e)&&J(e))return e;let t=[...document.querySelectorAll(d)].filter(J);return t.find(e=>""!==M(e.value))??t[0]??null}()?.value??"")}function et(e=Y(),t=ee()){if(!t)return[];let o=new Set;for(let t of e){if(!t.matches(f))continue;let e=Z(t);null!==e&&g.has(e)&&o.add(e)}let l=[];for(let n of e){let e=Z(n);null===e||!g.has(e)||o.has(e)&&!n.matches(f)||M(n.textContent??"")!==t||l.push(e)}return D(l)}function eo(){let e=document.documentElement;e.classList.toggle("loot-secret-slide-discovering","complete"!==C),e.classList.toggle("loot-secret-slide-discovery-failed","failed"===C),e.classList.toggle("loot-secret-slide-blocked",_),k?.takeRecords()}function el(e){_=e,eo(),W(),(0,a.refreshLiaSlideActivity)()}function en(e){return"complete"===C&&(null===e||O?.allowed(e)!==!1&&(!g.has(e)||I===e))}function er(){z=null;let{totalSections:e}=function(){let e=Y(),t=new Set(et(e,ee())),o=-1;for(let l of e){let e=Z(l);if(null===e)continue;o=Math.max(o,e);let n=g.has(e),r=n&&t.has(e),i=null!==O&&!O.allowed(e);l.classList.toggle("loot-secret-slide-link",n),l.classList.toggle("loot-secret-slide-link--found",r),l.classList.toggle("loot-puzzle-slide-link--blocked",i),n?l.dataset.lootSecretSection=String(e):delete l.dataset.lootSecretSection,i?l.dataset.lootPuzzleSection=String(e):delete l.dataset.lootPuzzleSection;let a=l.closest("#lia-bm-toc5 .bm-row");a&&(a.classList.toggle("loot-secret-slide-row",n),a.classList.toggle("loot-secret-slide-row--found",r),a.classList.toggle("loot-puzzle-slide-row--blocked",i))}return{links:e,totalSections:o+1}}();if("pending"===C&&L&&e>0&&null!==Q()&&(C="complete"),!function(e){if("complete"!==C)return W();let t=Q();if(null===t)return el(!1);if(O?.allowed(t)===!1){I=null;let e=function(e){for(let t=e;t>=0;t-=1)if(O?.allowed(t)!==!1&&!g.has(t))return t;return null}(t);if(null===e){console.warn("Loot: Hinter dem Puzzletor wurde keine erreichbare Fallback-Folie gefunden."),B(O.message(t),!0),el(!0);return}if(B(O.message(t)),el(!0),N===t)return;N=t,(0,s.navigateToLiaSection)(e,"replace");return}if(e<=0)return el(!1);if(!g.has(t)){T=t,I=null,N=null,el(!1);return}if(I===t)return el(!1);if(A===t){A=null,I=t,T=t,N=null,K(),el(!1),P?.found(t),V("Geheimfolie geöffnet.");return}let o=q(g,e,t,T);if(null===o){console.warn("Loot: Der Kurs enthält keine öffentliche Folie; die Geheimfolie bleibt erreichbar."),I=t,T=t,el(!1);return}el(!0),N!==t&&(N=t,(0,s.navigateToLiaSection)(o,"replace"))}(e),"complete"===C){let e;eo(),_||(null!==S&&(window.clearTimeout(S),S=null),(e=F()).classList.remove("loot-secret-slide-status--visible"),e.textContent="")}W(),w?.takeRecords()}function ei(){null===z&&(z=window.setTimeout(er,0))}function ea(){null!==z&&(window.clearTimeout(z),z=null),er()}function es(e){return e instanceof Element?e:e instanceof Node?e.parentElement:null}function ec(e){if(!g.has(e))return!1;if(O?.allowed(e)===!1)return V(O.message(e)),!1;let t=et();return 1!==t.length||t[0]!==e?(V(t.length>1?"Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien.":"Gib zuerst den vollständigen Namen der Geheimfolie in die Suche ein."),!1):(Q()===e&&I===e?(A=null,K()):G(e),!0)}function eu(e){let t=es(e.target),o=t?.closest("#lia-btn-prev, #lia-btn-next"),l=o?Q():null,n=null===l?null:l+(o?.id==="lia-btn-next"?1:-1);if(null!==n&&n>=0&&O?.allowed(n)===!1){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),V(O.message(n));return}let r=t?.closest("a[href*='#']"),i=r?Z(r):null;if(null!==i&&O?.allowed(i)===!1){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),V(O.message(i));return}let a=t?.closest(m),s=a?Z(a):null;null===s||!g.has(s)||ec(s)||(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation())}function ed(e,t){!(0,c.preserveEditableSlideNavigation)(e)&&(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),t&&V(t))}function ep(e){X(e.target)&&(j=e.target);let t=function(e){if("string"!=typeof e.key||!(0,c.isSequentialSlideNavigationKey)(e))return null;let t=e.key.toLocaleLowerCase("en-US");return"ArrowRight"===e.key||"n"===t?1:-1}(e);if(null!==t){if("complete"!==C)return void ed(e);let o=Q(),l=null===o?null:o+t;if(null!==l&&l>=0&&O?.allowed(l)===!1)return void ed(e,O.message(l))}if("Enter"!==e.key||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||!X(e.target))return;let o=et();if(0===o.length)return;if(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),o.length>1)return void V("Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien.");let l=o[0];ec(l)&&(0,s.navigateToLiaSection)(l,"push")}function eh(e){X(e.target)&&(j=e.target),ei()}function ef(e){return"complete"===C&&!!Number.isInteger(e)&&!(e<0)&&O?.allowed(e)!==!1&&(g.has(e)&&G(e),!0)}function em(e){return O?.allowed(e)===!1?O.message(e):"Das Portal wartet, bis die Kursnavigation vorbereitet ist."}function eg(e){O=e,ei(),(0,a.refreshLiaSlideActivity)()}function eb(){ei(),(0,a.refreshLiaSlideActivity)()}function ev(e){if("complete"===C&&null===O||es(e.target)?.closest("a, button, input, textarea, select, [contenteditable]:not([contenteditable='false']), [draggable='true']")){R=null;return}if(e instanceof MouseEvent){R={kind:"mouse",startedAt:Date.now(),x:e.pageX,y:e.pageY};return}let t=e.changedTouches[0];t&&(R={kind:"touch",startedAt:Date.now(),x:t.pageX,y:t.pageY})}function ey(e){let t=R;if(R=null,!t)return;if(e instanceof MouseEvent){if("mouse"!==t.kind)return}else if("touch"!==t.kind)return;let o=e instanceof MouseEvent?e:e.changedTouches[0];if(!o)return;let l=o.pageX-t.x,n=o.pageY-t.y;if(!(Date.now()-t.startedAt<=300&&Math.abs(l)>=150&&100>=Math.abs(n)))return;let r=null;if("complete"===C){let e=Q(),t=null===e?null:e+(l<0?1:-1);if(null===t||t<0||O?.allowed(t)!==!1)return;r=O.message(t)}e.cancelable&&e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),r&&V(r)}function ew(){R=null}function ek(){let e=U(window.location.hash);null!==e&&O?.allowed(e)===!1&&(B(O.message(e)),el(!0)),ei()}function ex(e){for(let t of(v.clear(),e))t.section>=0&&v.add(t.section);for(let e of(g.clear(),v))g.add(e);for(let e of b)g.add(e)}function ez(e){C="pending",L=!1,b.clear(),I=null,T=null,j=null,A=null,N=null,_=!1,K(),ex((0,r.parseCourseSecretSlideDeclarations)(e)),L=!0,eo(),W(),ei()}function eS(e){ex(e),L=!0,ea()}function eE(e){C="failed",eo(),B("Geheimfolien konnten nicht sicher geladen werden. Bitte prüfe die Kursquelle und lade den Kurs neu.",!0),W(),(0,a.refreshLiaSlideActivity)(),console.error("Loot: Geheimfolien-Initialisierung fehlgeschlagen.",e)}function eC(){let e=document.getElementById("lia-toc");e===x||(w?.disconnect(),x=e,e&&((w=new MutationObserver(ea)).observe(e,{attributeFilter:["class","href","id"],attributes:!0,childList:!0,subtree:!0}),ea()))}function eL(e){if(!(e instanceof Element))return!1;let t="main.lia-slide__content, .lia-pagination, .loot-object-lock-button--local, #lia-toc .lia-toc__content, #lia-toc #lia-bm-toc5";return e.matches(t)||null!==e.querySelector(t)}function e_(e){document.getElementById("lia-toc")!==x&&eC(),("complete"!==C||_)&&e.some(e=>[...e.addedNodes].some(eL))&&ei()}function eA(e){if(e&&(P=e),!E){if(E=!0,(0,a.setLiaSlideAccessGuard)(en),(k=new MutationObserver(eo)).observe(document.documentElement,{attributeFilter:["class"],attributes:!0}),eo(),A=function(){try{let e=window.sessionStorage.getItem(h);if(!e)return null;let t=JSON.parse(e);if(t.course!==H()||!Number.isInteger(t.section)||t.section<0||"number"!=typeof t.expiresAt||t.expiresAt<Date.now())return K(),null;return t.section}catch{return K(),null}}(),F(),S=window.setTimeout(()=>{S=null,"pending"===C&&B("Kursnavigation wird vorbereitet …")},250),!customElements.get(u)){class e extends HTMLElement{connectedCallback(){let e;this.hidden=!0,this.setAttribute("aria-hidden","true"),null!==(e=function(e){let t=e.getAttribute("data-secret-id")??"",o=(0,a.sectionFromLootId)(t);if(null!==o)return o;let l=e.closest("main"),n=l?.parentElement;if(!l||!n)return null;let r=[...n.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(l);return r>=0?r:null}(this))&&(e<0||(b.add(e),g.add(e))),ea()}}customElements.define(u,e)}document.addEventListener("click",eu,!0),document.addEventListener("keydown",ep,!0),document.addEventListener("input",eh),document.addEventListener("touchstart",ev,{capture:!0,passive:!0}),document.addEventListener("touchend",ey,{capture:!0,passive:!1}),document.addEventListener("touchcancel",ew,!0),document.addEventListener("mousedown",ev,!0),document.addEventListener("mouseup",ey,!0),window.addEventListener("blur",ew),window.addEventListener("hashchange",ek),window.addEventListener("popstate",ek),eC(),(0,r.onCourseMarkdownChange)(ez),new MutationObserver(e_).observe(document.documentElement,{childList:!0,subtree:!0}),(0,r.requireCourseSecretSlideDeclarations)().then(eS).catch(eE),ei()}}},{"./course-chests.ts":"2ceW6","./course-identity.ts":"g3iqo","./slide-activity.ts":"5qduG","./slide-navigation.ts":"l5CPd","./slide-navigation-lock.ts":"lbx2r","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],l5CPd:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function r(e){if(!Number.isInteger(e)||e<0)throw RangeError("Eine LiaScript-Folie muss eine nichtnegative Section besitzen.");return`#${e+1}`}function i(e,t="push"){let o=r(e);if("push"===t){window.location.hash=o;return}try{window.location.replace(o)}catch{window.location.hash=o}}n.defineInteropFlag(o),n.export(o,"liaSlideHash",()=>r),n.export(o,"navigateToLiaSection",()=>i)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8aUxA":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"installSlidePortals",()=>D);var r=e("./portal-visual.ts"),i=e("./secret-slides.ts"),a=e("./slide-navigation.ts"),s=e("./slide-portal-options.ts"),c=e("./slide-portal-route.ts"),u=e("./slide-activity.ts");let d="lia-loot-slide-portal",p="lia-loot-slide-portal-status",h="[data-loot-slide-portal-return]",f=!1,m=0,g=!1,b=null,v=null,y=null,w=0,k=null,x=new Set;function z(){let e=document.getElementById(p);if(e)return e;let t=document.createElement("div");return t.id=p,t.className="loot-slide-portal-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function S(e){let t=z();t.textContent="",window.setTimeout(()=>{t.textContent=e},0)}function E(e){let t=e.getAttribute("data-portal-id")?.trim();if(t&&!t.startsWith("@"))return`slide-portal:${t}`;let o=e.dataset.lootSlidePortalRuntimeId;if(o)return o;m+=1;let l=`slide-portal:runtime-${m}`;return e.dataset.lootSlidePortalRuntimeId=l,l}function C(e){let t,o=E(e),l=(0,s.parseSlidePortalOptions)(e.getAttribute("data-options")?.trim()??"","one-way"===e.getAttribute("data-default-mode")?"one-way":"two-way"),n=function(e,t){let o=(0,u.sectionFromLootId)(t);if(null!==o)return o;let l=e.closest("main.lia-slide__content"),n=l?.parentElement;if(!l||!n)return null;let r=[...n.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(l);return r>=0?r:null}(e,o),r=l.valid&&null===n?"pending":l.valid?(0,s.validateSlidePortalTarget)(l.targetSection,n,(t=-1,document.querySelectorAll(".lia-slide__container").forEach(e=>{let o=[...e.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).length;t=Math.max(t,o-1)}),document.querySelectorAll("#lia-toc a[href*='#']").forEach(e=>{let o=function(e){let t=e;try{t=new URL(e,window.location.href).hash}catch{}let o=/^#(\d+)$/.exec(t);if(!o)return null;let l=Number(o[1])-1;return Number.isInteger(l)&&l>=0?l:null}(e.getAttribute("href")??e.href);null!==o&&(t=Math.max(t,o))}),t>=0?t+1:null)):"missing";return{...l,portalId:o,sourceSection:n,status:r}}function L(e){return e.errors.length>0?e.errors.join(" "):"same-slide"===e.status?"Quelle und Ziel eines Portals müssen verschiedene Folien sein.":"missing"===e.status?`Die Zielfolie ${e.targetSlide??"?"} existiert nicht.`:"Die Kursfolien werden noch vorbereitet."}function _(e){let t,o,l,n=C(e),s=[n.mode,n.targetSlide??"",n.status,n.errors.join("|")].join(":");if(e.dataset.lootSlidePortalSignature===s&&e.querySelector("[data-loot-slide-portal-button]"))return;"pending"!==n.status&&(!n.valid||"valid"!==n.status)&&("pending"===n.status||x.has(n.portalId)||(x.add(n.portalId),console.warn(`Loot: Portal ${n.portalId} ist defekt. ${L(n)}`))),e.dataset.lootSlidePortalSignature=s;let c=((t=document.createElement("button")).type="button",t.className=`loot-slide-portal loot-slide-portal--${n.mode}`,t.dataset.lootSlidePortalButton=n.portalId,t.dataset.lootSlidePortalMode=n.mode,t.dataset.lootSlidePortalTarget=String(n.targetSlide??""),t.setAttribute("aria-label",function(e){if("pending"===e.status)return"Portal wird vorbereitet";if(!e.valid||"valid"!==e.status)return`Defektes Portal. ${L(e)}`;let t="one-way"===e.mode?"Einwegportal":"Zweiwegportal";return`${t} zu Folie ${e.targetSlide} \xf6ffnen`}(n)),t.disabled=o=!n.valid||"valid"!==n.status,o&&(t.classList.add("pending"===n.status?"loot-slide-portal--pending":"loot-slide-portal--broken"),t.title=L(n)),t.append((0,r.createPortalGraphic)(n.mode)),(l=document.createElement("span")).className="loot-slide-portal__number",l.setAttribute("aria-hidden","true"),l.textContent="pending"===n.status?"…":String(n.targetSlide??"?"),t.append(l),t.addEventListener("click",()=>(function(e){let t=[...document.querySelectorAll(d)].find(t=>E(t)===e);if(!t)return;let o=C(t);if(!o.valid||"valid"!==o.status||null===o.targetSection||null===o.sourceSection)return void S(L(o));if("one-way"===o.mode)return(0,i.permitPortalSlideNavigation)(o.targetSection)?(N(),(0,a.navigateToLiaSection)(o.targetSection,"replace"),O(o.targetSection),S(`Einwegportal zu Folie ${o.targetSlide} ge\xf6ffnet.`),void $()):void S((0,i.portalSlideNavigationBlockMessage)(o.targetSection));let l={expiresAt:Date.now()+144e5,phase:"pending",portalId:o.portalId,sourceSection:o.sourceSection,targetSection:o.targetSection,version:1};(0,i.permitPortalSlideNavigation)(o.targetSection)?(R(l),(0,a.navigateToLiaSection)(o.targetSection,"push"),O(o.targetSection),S(`Portal zu Folie ${o.targetSlide} ge\xf6ffnet.`),$()):S((0,i.portalSlideNavigationBlockMessage)(o.targetSection))})(n.portalId)),t);if("pending"!==n.status&&(!n.valid||"valid"!==n.status)){let t=document.createElement("span");t.id=`lia-loot-slide-portal-problem-${n.portalId.replace(/[^a-zA-Z0-9_-]/gu,"-")}`,t.className="loot-slide-portal__problem",t.setAttribute("role","note"),t.textContent=`Defektes Portal: ${L(n)}`,c.setAttribute("aria-describedby",t.id),e.replaceChildren(c,t);return}e.replaceChildren(c)}function A(e){let t=[];for(let o of document.querySelectorAll(".lia-slide__container")){let l=[...o.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName);l[e]&&t.push(l[e])}return t.find(e=>!e.hidden)??t[0]??null}function I(e){document.querySelectorAll(h).forEach(t=>{e&&t.dataset.lootSlidePortalReturn===e||t.remove()})}function T(e){return`${e.portalId}:${e.sourceSection}:${e.targetSection}`}function N(){v=null,(0,c.clearSlidePortalRoute)(),I(),b?.takeRecords()}function R(e){v=e,(0,c.saveSlidePortalRoute)(e)}function j(){null!==y&&window.clearTimeout(y),y=null,w=0,k=null}function P(){y=null;let e=k;if(null===e)return;let t=A(e);if((0,u.activeLiaSection)()===e&&t&&!t.hidden){let e=t.querySelector("h1, h2, h3, h4, h5, h6")??t;e.hasAttribute("tabindex")||(e.setAttribute("tabindex","-1"),e.dataset.lootSlidePortalFocus="true"),e.focus({preventScroll:!0}),j();return}Date.now()>=w?j():y=window.setTimeout(P,50)}function O(e){null!==y&&window.clearTimeout(y),k=e,w=Date.now()+2e3,y=window.setTimeout(P,0)}function M(){g=!1,document.querySelectorAll(d).forEach(_),function(){var e;let t,o,l,n;if(!v)return I();if(v.expiresAt<=Date.now())return N();let s=(0,c.transitionSlidePortalRoute)(v,(0,u.activeLiaSection)());if(!s.route)return N();if(s.route.phase!==v.phase?R(s.route):v=s.route,!s.showReturn)return I();let d=T(s.route);if(I(d),[...document.querySelectorAll(h)].find(e=>e.dataset.lootSlidePortalReturn===d))return;let p=A(s.route.targetSection);p?.append((e=s.route,(t=document.createElement("aside")).className="loot-slide-portal-return",t.dataset.lootSlidePortalReturn=T(e),t.setAttribute("aria-label","Portal-Rückweg"),(o=document.createElement("span")).className="loot-slide-portal-return__label",o.textContent=`R\xfcckportal zu Folie ${e.sourceSection+1}`,(l=document.createElement("button")).type="button",l.className="loot-slide-portal loot-slide-portal--return",l.dataset.lootSlidePortalReturnButton=T(e),l.setAttribute("aria-label",`R\xfcckportal zu Folie ${e.sourceSection+1} \xf6ffnen`),l.append((0,r.createPortalGraphic)("two-way",!0)),(n=document.createElement("span")).className="loot-slide-portal__number",n.setAttribute("aria-hidden","true"),n.textContent=String(e.sourceSection+1),l.append(n),l.addEventListener("click",()=>{let t=e.sourceSection;(0,i.permitPortalSlideNavigation)(t)?(N(),(0,a.navigateToLiaSection)(t,"push"),O(t),S(`R\xfcckportal zu Folie ${t+1} ge\xf6ffnet.`)):S("Das Rückportal wartet, bis die Kursnavigation vorbereitet ist.")}),t.append(l,o),t))}(),null!==k&&null===y&&P(),b?.takeRecords()}function $(){g||(g=!0,window.setTimeout(M,0))}function q(e){let t=`${d}, ${h}, .lia-slide__container, main.lia-slide__content, #lia-toc, #lia-toc a[href*="#"]`;return e instanceof Element&&(e.matches(t)||null!==e.querySelector(t))}function D(){if(!f){if(f=!0,v=(0,c.loadSlidePortalRoute)(),z(),!customElements.get(d)){class e extends HTMLElement{static get observedAttributes(){return["data-portal-id","data-options","data-default-mode"]}connectedCallback(){_(this),$()}attributeChangedCallback(){this.isConnected&&_(this)}}customElements.define(d,e)}(0,u.observeLiaSlideActivity)($),(b=new MutationObserver(e=>{e.some(e=>"attributes"===e.type?e.target instanceof HTMLAnchorElement&&null!==e.target.closest("#lia-toc"):[...e.addedNodes,...e.removedNodes].some(q))&&$()})).observe(document.documentElement,{attributeFilter:["href"],attributes:!0,childList:!0,subtree:!0}),M()}}},{"./portal-visual.ts":"5qwxU","./secret-slides.ts":"7fPSc","./slide-navigation.ts":"l5CPd","./slide-portal-options.ts":"ffEjw","./slide-portal-route.ts":"kLbAb","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5qwxU":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function r(e,t=!1){let o=document.createElementNS("http://www.w3.org/2000/svg","svg");return o.setAttribute("viewBox","0 0 64 72"),o.setAttribute("shape-rendering","crispEdges"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-slide-portal__graphic"),o.innerHTML=`
    <rect class="loot-slide-portal__shadow" x="8" y="65" width="50" height="5"/>
    <path class="loot-slide-portal__outline" d="M8 66V28h4V18h6V12h8V8h16v4h8v6h6v10h4v38H48V31h-4v-7h-6v-4H26v4h-6v7h-4v35H8Z"/>
    <path class="loot-slide-portal__rim" d="M12 64V29h4V19h7v-5h22v5h7v10h4v35h-8V31h-4v-7h-6v-3H27v3h-7v7h-4v33h-4Z"/>
    <path class="loot-slide-portal__core" d="M17 64V33h4v-8h7v-3h10v3h6v8h4v31H17Z"/>
    <rect class="loot-slide-portal__spark loot-slide-portal__spark--one" x="24" y="27" width="4" height="4"/>
    <rect class="loot-slide-portal__spark loot-slide-portal__spark--two" x="40" y="48" width="4" height="4"/>
    ${"one-way"===e?'<path class="loot-slide-portal__arrow" d="M20 31h17v-7l11 12-11 12v-7H20V31Z"/>':t?'<path class="loot-slide-portal__arrow" d="M46 27H29v-7L18 32l11 12v-7h17V27Zm-28 22h17v7l11-12-11-12v7H18v10Z"/>':'<path class="loot-slide-portal__arrow" d="M18 27h17v-7l11 12-11 12v-7H18V27Zm28 22H29v7L18 44l11-12v7h17v10Z"/>'}
  `,o}n.defineInteropFlag(o),n.export(o,"createPortalGraphic",()=>r)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],ffEjw:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"parseSlidePortalOptions",()=>a),n.export(o,"validateSlidePortalTarget",()=>s);let r=new Set(["einweg","einbahn","einbahnstrasse","oneway","one-way"]),i=new Set(["hinundher","hin-und-her","zweiweg","bidirektional","twoway","two-way"]);function a(e,t="two-way"){let o=("@0"===e.trim()?"":e).split(";").map(e=>e.trim()).filter(Boolean),l=[],n=[],s=new Set;for(let e of o){if(/^\d+$/u.test(e)){n.push(Number(e));continue}let t=function(e){let t=e.normalize("NFKD").replace(/\p{M}/gu,"").trim().toLocaleLowerCase("de-DE").replace(/ß/gu,"ss").replace(/\s+/gu,"");return r.has(t)?"one-way":i.has(t)?"two-way":null}(e);if(t){s.add(t);continue}l.push(`Unbekannte Portaloption: ${e}`)}1!==n.length&&l.push("Ein Portal benötigt genau eine positive Foliennummer.");let c=1===n.length?n[0]:null;null!==c&&(!Number.isSafeInteger(c)||c<1)&&l.push("Die Zielfolie muss eine positive, sichere Ganzzahl sein."),s.size>1&&l.push("Ein Portal kann nicht zugleich Einweg- und Zweiwegportal sein.");let u=s.values().next().value,d=null!==c&&Number.isSafeInteger(c)&&c>=1?c-1:null,p=0===l.length?d:null;return{errors:l,mode:u??t,targetSection:p,targetSlide:c,valid:null!==p}}function s(e,t,o){return null===e||!Number.isInteger(e)||e<0?"missing":null!==t&&e===t?"same-slide":null===o||o<1?"pending":e<o?"valid":"missing"}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],kLbAb:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"normalizeSlidePortalRoute",()=>a),n.export(o,"transitionSlidePortalRoute",()=>s),n.export(o,"loadSlidePortalRoute",()=>c),n.export(o,"saveSlidePortalRoute",()=>u),n.export(o,"clearSlidePortalRoute",()=>d);var r=e("./course-identity.ts");function i(){return`lia-loot:slide-portal-route:v1:${encodeURIComponent((0,r.liaCourseIdentity)())}`}function a(e,t=Date.now()){return e&&"object"==typeof e?1!==e.version||"string"!=typeof e.portalId||0===e.portalId.trim().length||!Number.isInteger(e.sourceSection)||0>Number(e.sourceSection)||!Number.isInteger(e.targetSection)||0>Number(e.targetSection)||e.sourceSection===e.targetSection||"pending"!==e.phase&&"arrived"!==e.phase||"number"!=typeof e.expiresAt||!Number.isFinite(e.expiresAt)||e.expiresAt<=t?null:{expiresAt:e.expiresAt,phase:e.phase,portalId:e.portalId.trim(),sourceSection:Number(e.sourceSection),targetSection:Number(e.targetSection),version:1}:null}function s(e,t){return null===t?{route:e,showReturn:!1}:"pending"===e.phase?t===e.sourceSection?{route:e,showReturn:!1}:t===e.targetSection?{route:{...e,phase:"arrived"},showReturn:!0}:{route:null,showReturn:!1}:t===e.targetSection?{route:e,showReturn:!0}:{route:null,showReturn:!1}}function c(){try{let e=window.sessionStorage.getItem(i());if(!e)return null;let t=a(JSON.parse(e));return t||window.sessionStorage.removeItem(i()),t}catch{return null}}function u(e){try{window.sessionStorage.setItem(i(),JSON.stringify(e))}catch{}}function d(){try{window.sessionStorage.removeItem(i())}catch{}}},{"./course-identity.ts":"g3iqo","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],yg2zb:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"installPuzzles",()=>ec);var r=e("./puzzle-catalog.ts"),i=e("./puzzle-access.ts"),a=e("./course-chests.ts"),s=e("./collectible-visibility.ts"),c=e("./concealment.ts"),u=e("./exploration.ts"),d=e("./puzzle-inventory-bar.ts"),p=e("./puzzle-options.ts"),h=e("./puzzle-visual.ts"),f=e("./range-gate.ts"),m=e("./resource-bar.ts"),g=e("./secret-slides.ts"),b=e("./slide-activity.ts");let v="lia-loot-puzzle-piece",y="lia-loot-puzzle-gate",w="data-loot-puzzle-range-blocked",k=null,x=null,z=null,S=null,E=null,C=null,L=null,_=null,A=!1,I=!1,T=!1,N="pending",R="",j=new Set,P=new Set,O=new Set,M=new(0,s.CollectibleVisibilityGate),$=new Map;function q(e,t){let o=(0,b.sectionFromLootId)(e.getAttribute(t)??"");if(null!==o)return o;let l=e.closest("main"),n=l?.parentElement;if(!l||!n)return null;let r=[...n.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(l);return r>=0?r:null}function D(){return[...document.querySelectorAll(y)].flatMap((e,t)=>{let o=q(e,"data-gate-id");if(null===o)return[];let l=(0,p.parsePuzzleGateOptions)(e.getAttribute("data-options")??""),n=e.getAttribute("data-gate-id")?.trim();return[{access:{color:l.color,gateId:"puzzle-gate:fallback:"+(n||o+":"+t),mode:l.onlyOnSlide?"anchor":"navigation",section:o,sourceOrder:t},host:e,parsed:l}]})}function H(){return(0,i.earliestUnsolvedPuzzleGate)(z?z.gates.map(e=>({color:e.color,gateId:e.id,mode:e.onlyOnSlide?"anchor":"navigation",section:e.section,sourceOrder:e.sourceOrder})):"failed"===N?D().map(e=>e.access):[],new Set((k?.solvedColors()??[]).map(e=>"puzzle-gate:"+e)))}function K(){(0,g.setPuzzleSlideAccessGuard)({allowed:e=>(0,i.puzzleSectionAllowed)(e,H()),message:()=>{let e=H();return e?e.color?"Löse zuerst das Puzzletor in "+(0,h.puzzleColorLabel)(e.color)+".":"Das nächste Puzzletor ist fehlerhaft konfiguriert und bleibt geschlossen.":"Diese Folie ist noch nicht freigeschaltet."}})}function G(e,t){O.has(e)||(O.add(e),console.warn("Loot: "+t))}function F(e){(0,u.clearHostRevealLayers)(e),(0,c.setHostConcealment)(e,null),e.replaceChildren(),delete e.dataset.lootPuzzleRender}function V(e){if(!z)return null;let t=e.getAttribute("data-options")??"",o=(0,p.parsePuzzleGateOptions)(t),l=q(e,"data-gate-id"),n=z.gates.find(e=>e.options===t.trim()&&(null===l||e.section===l));return n||(o.color?z.gates.find(e=>e.color===o.color&&(null===l||e.section===l))??null:null)}function B(e,t,o){let l="invalid:"+t+":"+o.join("|");if(e.dataset.lootPuzzleRender===l)return;e.dataset.lootPuzzleRender=l;let n=document.createElement("section");n.className="loot-puzzle-gate loot-puzzle-gate--invalid",n.setAttribute("role","alert");let r=document.createElement("h3");r.className="loot-puzzle-gate__title",r.textContent="Puzzletor"+(t?" in "+(0,h.puzzleColorLabel)(t):"")+" ist nicht konfiguriert";let i=document.createElement("ul");for(let e of o){let t=document.createElement("li");t.textContent=e,i.appendChild(t)}n.append(r,i),e.replaceChildren(n)}function W(e){let t=e.closest("[data-loot-reveal-payload], [data-loot-reveal-layer-content], main.lia-slide__content, main")??document.body,o=function(e){let t=e;for(;t.parentElement;){let e=t.parentElement,o="DIV"===e.tagName&&0===e.attributes.length;if("P"!==e.tagName&&"SPAN"!==e.tagName&&"LIA-KEEP"!==e.tagName&&!o||[...e.childNodes].some(e=>e!==t&&e.nodeType!==Node.COMMENT_NODE&&(e.nodeType!==Node.TEXT_NODE||!!e.textContent?.trim())))break;t=e}return t}(e);if(!t.isConnected||!o.isConnected)return[];let l=t.ownerDocument.createRange();try{l.setStartAfter(o),l.setEnd(t,t.childNodes.length)}catch{return[]}let n=[],r=e=>{for(let t of[...e.children]){if(!l.intersectsNode(t))continue;let e=!1;try{e=0===l.comparePoint(t,0)&&0===l.comparePoint(t,t.childNodes.length)}catch{e=!1}e?n.push(t):r(t)}};return r(t),n}function U(e){for(let[t,o]of $){let l=e.get(t)??new Set;for(let e of o)l.has(e)||(0,f.setRangeGate)(e,"puzzle:"+t,w,!1)}for(let[t,o]of e)for(let e of o)(0,f.setRangeGate)(e,"puzzle:"+t,w,!0);$.clear(),e.forEach((e,t)=>$.set(t,e))}function Z(){if(_=null,"failed"===N)return void function(){j.clear(),document.querySelectorAll(v).forEach(F);let e=D(),t=new Map;for(let o of e){let e=[...o.parsed.errors,"Die Kursquelle konnte nicht geladen werden. Dieses Tor bleibt aus Sicherheitsgründen geschlossen."];B(o.host,o.parsed.color,[...new Set(e)]),"anchor"===o.access.mode&&t.set(o.access.gateId,new Set(W(o.host)))}U(t),(0,d.renderPuzzleInventory)([],null);let o=JSON.stringify(e.map(({access:e})=>e));o!==R&&(R=o,(0,g.refreshPuzzleSlideAccess)()),L?.takeRecords()}();if("complete"!==N||!z||!k)return;for(let e of(j.clear(),[...document.querySelectorAll(v)])){let t=function(e){if(!z)return null;let t=e.getAttribute("data-options")??"",o=(0,p.parsePuzzlePieceOptions)(t);if(!o.valid||!o.color||null===o.number)return null;let l=q(e,"data-piece-id");if(null===l)return null;let n=z.pieces.filter(e=>e.valid&&e.color===o.color&&e.number===o.number&&e.options===t.trim()&&e.section===l);return 1===n.length?n[0]:null}(e);if(!t){let t=(0,p.parsePuzzlePieceOptions)(e.getAttribute("data-options")??"");G("piece:"+(e.getAttribute("data-piece-id")??t.errors.join("|")),"Puzzleteil bleibt verborgen. "+t.errors.join(" ")),F(e);continue}let o=z.gates.find(e=>e.color===t.color);if(!o?.valid||!t.valid||(0,u.hostIsRevealBlocked)(e,!1)){F(e);continue}!function(e,t){if(!k||!t.valid||!t.color||null===t.number){j.delete(t.id),F(e);return}if(k.isPieceCollected(t.color,t.number)){j.delete(t.id),M.forget("puzzle:"+t.id),P.has(t.id)||F(e);return}if(P.has(t.id))return;if(!(0,b.liaSlideIsAccessible)(t.section)||!M.visible("puzzle:"+t.id,t.visibility,(0,b.sourceSlideIsActive)(t.section,e),Y)){j.delete(t.id),F(e);return}let o=(0,u.setHostRevealLayers)(e,t.id,t.layers),l=o.querySelector('[data-loot-puzzle-pickup="'+t.id+'"]');if(!l){let e;(0,c.setHostConcealment)(o,null),o.replaceChildren(((e=document.createElement("button")).type="button",e.className="loot-puzzle-pickup loot-puzzle-color--"+t.color,e.dataset.lootPuzzlePickup=t.id,e.dataset.lootPuzzleColor=t.color,e.dataset.lootPuzzleNumber=String(t.number),e.setAttribute("aria-label","Puzzleteil "+t.number+", "+(0,h.puzzleColorLabel)(t.color)+", einsammeln"),e.appendChild((0,h.createPuzzlePieceGraphic)(t.color,t.number)),e)),l=o.querySelector('[data-loot-puzzle-pickup="'+t.id+'"]')}(0,c.setHostConcealment)(o,t.concealment),l&&!(0,u.hostIsRevealBlocked)(e)?j.add(t.id):j.delete(t.id)}(e,t)}let e=[...document.querySelectorAll(y)];for(let t of e){let e=V(t);if(e){!function(e,t){if(!k)return;if(!t.valid||!t.color)return B(e,t.color,t.errors);let o=k.placement(t.color),l=k.isGateSolved(t.color),n=k.state().collected[t.color].length,r=S?S.color+":"+S.number:"-",i=o.map(e=>e??"-").join(",")+":"+l+":"+n+":"+r;if(e.dataset.lootPuzzleRender===i)return;e.dataset.lootPuzzleRender=i;let a=document.createElement("section");a.className="loot-puzzle-gate loot-puzzle-color--"+t.color,a.classList.toggle("loot-puzzle-gate--open",l),a.dataset.lootPuzzleGatePanel=t.id,a.tabIndex=-1,a.setAttribute("aria-label","Puzzletor in "+(0,h.puzzleColorLabel)(t.color)+", "+(l?"geöffnet":"geschlossen"));let s=document.createElement("h3");s.className="loot-puzzle-gate__title",s.tabIndex=-1,s.textContent="Puzzletor – "+(0,h.puzzleColorLabel)(t.color)+" – "+(l?"geöffnet":"geschlossen");let c=document.createElement("p");c.className="loot-puzzle-gate__progress",c.textContent=l?"Das Tor ist offen. Die folgenden Inhalte sind freigeschaltet.":"Gesammelt: "+n+" von "+t.slotCount+" Puzzleteilen. Wähle ein Teil und anschließend einen Steckplatz.";let u=document.createElement("div");u.className="loot-puzzle-gate__frame";let d=document.createElement("div");d.className="loot-puzzle-gate__grid",d.style.setProperty("--loot-puzzle-columns",String(t.columns)),d.setAttribute("role","group"),d.setAttribute("aria-label","Steckplätze des Puzzletors"),o.forEach((e,o)=>{let n=document.createElement("button");if(n.type="button",n.className="loot-puzzle-gate__slot",n.dataset.lootPuzzleGate=t.id,n.dataset.lootPuzzleColor=t.color,n.dataset.lootPuzzleSlot=String(o),n.disabled=l,null!==e){let r=S?.color===t.color&&S.number===e;n.dataset.lootPuzzleNumber=String(e),n.classList.toggle("loot-puzzle-piece--selected",r),n.setAttribute("aria-pressed",String(r)),n.setAttribute("aria-label","Steckplatz "+(o+1)+" von "+t.slotCount+", belegt mit Puzzleteil "+e+(l?"":", auswählen oder verschieben")),n.draggable=!l,n.appendChild((0,h.createPuzzlePieceGraphic)(t.color,e))}else n.setAttribute("aria-pressed","false"),n.setAttribute("aria-label","Steckplatz "+(o+1)+" von "+t.slotCount+", leer");d.appendChild(n)});let p=document.createElement("div");p.className="loot-puzzle-gate__doors",p.setAttribute("aria-hidden","true"),p.append(document.createElement("span"),document.createElement("span")),u.append(d,p),a.append(s,c,u),e.replaceChildren(a)}(t,e),e.valid||G(e.id,"Puzzletor bleibt geschlossen. "+e.errors.join(" "));continue}let o=(0,p.parsePuzzleGateOptions)(t.getAttribute("data-options")??"");B(t,o.color,o.errors)}let t=new Map;for(let o of e){let e=V(o);if(!e?.onlyOnSlide)continue;let l=t.get(e.id)??new Set;e.color&&k?.isGateSolved(e.color)||W(o).forEach(e=>l.add(e)),t.set(e.id,l)}U(t),(0,d.renderPuzzleInventory)(z&&k?z.pieces.filter(e=>e.valid&&null!==e.color&&null!==e.number&&z?.gates.some(t=>t.valid&&t.color===e.color)&&k?.isPieceCollected(e.color,e.number)&&k.availablePieces(e.color).includes(e.number)).map(e=>({color:e.color,number:e.number})):[],S),function(){let e=C;if(C=null,!e)return;let t=()=>document.querySelector('[data-loot-puzzle-slot="'+e.slot+'"][data-loot-puzzle-color="'+e.color+'"]'),o=t();o?.focus({preventScroll:!0}),window.requestAnimationFrame(()=>{let e=document.activeElement;e instanceof HTMLElement&&e!==document.body&&e!==document.documentElement&&e!==o&&e.isConnected||t()?.focus({preventScroll:!0})})}(),L?.takeRecords()}function Y(){null===_&&(_=window.setTimeout(Z,0))}function Q(e){let t=e.dataset.lootPuzzleColor,o=Number(e.dataset.lootPuzzleNumber);return t&&Number.isInteger(o)?{color:t,number:o}:null}function X(e){S?.color===e.color&&S.number===e.number?(S=null,(0,m.announceResource)("Puzzleteilauswahl aufgehoben.")):(S=e,(0,m.announceResource)("Puzzleteil "+e.number+", "+(0,h.puzzleColorLabel)(e.color)+", ausgewählt.")),Y()}function J(e,t){if(!S||!k)return void(0,m.announceResource)("Wähle zuerst ein Puzzleteil aus.");if(S.color!==e)return void(0,m.announceResource)("Dieses Teil gehört zum Puzzletor in "+(0,h.puzzleColorLabel)(S.color)+".");let o=S.number,l=k.placePiece(e,o,t);if("invalid"===l)return void(0,m.announceResource)("Dieses Puzzleteil kann hier nicht eingesetzt werden.");if(C={color:e,slot:t},S=null,"solved"===l){C=null;let t=k.solvedColors().length;(0,m.announceResource)("Puzzletor in "+(0,h.puzzleColorLabel)(e)+" geöffnet."),x?.gateSolved(t,e),x?.changed(),K(),(0,g.refreshPuzzleSlideAccess)(),Y(),window.setTimeout(()=>{document.querySelector('[data-loot-puzzle-gate-panel="puzzle-gate:'+e+'"]')?.focus({preventScroll:!0})},0);return}let n=k.placement(e);(0,m.announceResource)(n.every(e=>null!==e)?"Alle Plätze sind belegt, die Reihenfolge stimmt noch nicht.":"Puzzleteil "+o+" eingesetzt."),x?.changed(),Y()}function ee(e){let t=e.target instanceof Element?e.target.closest("[data-loot-puzzle-pickup], [data-loot-puzzle-inventory-piece], [data-loot-puzzle-slot]"):null;if(!t||!k||!z)return;let o=t.dataset.lootPuzzlePickup;if(o){let e=z.pieces.find(e=>e.id===o);if(!e?.color||null===e.number||!j.has(o)||P.has(o))return;if(P.add(o),!k.collectPiece(e.color,e.number)){P.delete(o),Y();return}t.classList.add("loot-puzzle-pickup--collected"),t.setAttribute("aria-label","Puzzleteil eingesammelt"),(0,m.announceResource)("Puzzleteil "+e.number+", "+(0,h.puzzleColorLabel)(e.color)+", gefunden."),x?.changed(),window.setTimeout(()=>{P.delete(o),Y(),window.setTimeout(()=>(0,d.focusPuzzleInventoryPiece)(e.color,e.number),0)},400);return}if(t.hasAttribute("data-loot-puzzle-inventory-piece")){let e=Q(t);e&&X(e);return}let l=t.dataset.lootPuzzleColor,n=Number(t.dataset.lootPuzzleSlot);if(!l||!Number.isInteger(n))return;let r=Q(t);if(!S&&r){C={color:l,slot:n},X(r);return}if(S&&r&&S.color===r.color&&S.number===r.number){S=null,C={color:l,slot:n},(0,m.announceResource)("Puzzleteilauswahl aufgehoben."),Y();return}J(l,n)}function et(e){if("Escape"!==e.key||!S)return;let t=e.target instanceof Element?e.target.closest("[data-loot-puzzle-slot]"):null,o=t?.dataset.lootPuzzleColor,l=Number(t?.dataset.lootPuzzleSlot);o&&Number.isInteger(l)&&(C={color:o,slot:l}),S=null,(0,m.announceResource)("Puzzleteilauswahl aufgehoben."),Y()}function eo(e){let t=e.target instanceof Element?e.target.closest("[data-loot-puzzle-inventory-piece], [data-loot-puzzle-slot][data-loot-puzzle-number]"):null,o=t?Q(t):null;o&&e.dataTransfer&&(E=o,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/x-lia-loot-puzzle",o.color+":"+o.number))}function el(){let e=E;E=null,e&&S?.color===e.color&&S.number===e.number&&(S=null,Y())}function en(e){let t=e.target instanceof Element?e.target.closest("[data-loot-puzzle-slot]"):null,o=E??S;t&&o&&t.dataset.lootPuzzleColor===o.color&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"))}function er(e){let t=e.target instanceof Element?e.target.closest("[data-loot-puzzle-slot]"):null;if(!t||!Array.from(e.dataTransfer?.types??[]).includes("text/x-lia-loot-puzzle"))return;let o=t.dataset.lootPuzzleColor,l=Number(t.dataset.lootPuzzleSlot);o&&Number.isInteger(l)&&(e.preventDefault(),E&&(S=E),J(o,l))}function ei(e){z=null,S=null,N="failed",K(),Y(),console.error("Loot: Puzzle-Kurskatalog konnte nicht geladen werden.",e)}class ea extends HTMLElement{static get observedAttributes(){return["data-options","data-piece-id"]}connectedCallback(){Y()}attributeChangedCallback(){this.isConnected&&Y()}}class es extends HTMLElement{static get observedAttributes(){return["data-options","data-gate-id"]}connectedCallback(){Y()}attributeChangedCallback(){this.isConnected&&Y()}}function ec(e,t){k=e,x=t,A||(A=!0,customElements.get(v)||customElements.define(v,ea),customElements.get(y)||customElements.define(y,es),document.addEventListener("click",ee,!0),document.addEventListener("keydown",et,!0),document.addEventListener("dragstart",eo,!0),document.addEventListener("dragend",el,!0),document.addEventListener("dragover",en,!0),document.addEventListener("drop",er,!0),I||(I=!0,(0,b.observeLiaSlideActivity)(Y)),T||(T=!0,document.addEventListener(u.REVEAL_CHANGED_EVENT,Y)),(L=new MutationObserver(Y)).observe(document.documentElement,{attributeFilter:["class","data-options","hidden","inert"],attributes:!0,childList:!0,subtree:!0}),(0,a.requireCoursePuzzleDeclarations)().then(e=>(function(e){if(z=e,N="complete",!k)return;for(let t of(k.configure(e.signature,(0,r.validPuzzleGateConfigurations)(e)),e.errors))G("catalog:"+t,t);let t=e.gates.filter(e=>e.valid);x?.catalogReady(t.length,t.filter(e=>e.color&&k?.isGateSolved(e.color)).length),K(),Z()})((0,r.buildPuzzleCatalog)(e))).catch(ei),Y())}},{"./puzzle-catalog.ts":"30ewL","./puzzle-access.ts":"7GH0l","./course-chests.ts":"2ceW6","./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./exploration.ts":"5BeJ3","./puzzle-inventory-bar.ts":"80unQ","./puzzle-options.ts":"b2TzD","./puzzle-visual.ts":"eaSrF","./range-gate.ts":"jrKO3","./resource-bar.ts":"1KrGH","./secret-slides.ts":"7fPSc","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"7GH0l":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function r(e){return e.filter(e=>"navigation"===e.mode).slice().sort((e,t)=>e.sourceOrder-t.sourceOrder||e.section-t.section||e.gateId.localeCompare(t.gateId))}function i(e,t){return r(e).find(e=>!t.has(e.gateId))??null}function a(e,t){return Number.isInteger(e)&&e>=0&&(null===t||e<=t.section)}function s(e,t,o=()=>!0){if(!Number.isInteger(e)||e<0)return null;let l=null===t?e:Math.min(e,t.section);for(let e=l;e>=0;e-=1)if(a(e,t)&&o(e))return e;return null}n.defineInteropFlag(o),n.export(o,"navigationPuzzleGates",()=>r),n.export(o,"earliestUnsolvedPuzzleGate",()=>i),n.export(o,"puzzleSectionAllowed",()=>a),n.export(o,"puzzleFallbackSection",()=>s)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"80unQ":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"renderPuzzleInventory",()=>c),n.export(o,"focusPuzzleInventoryPiece",()=>u);var r=e("./resource-bar.ts"),i=e("./puzzle-visual.ts");let a="lia-loot-puzzle-inventory";function s(e){return e.color+":"+e.number}function c(e,t){if(0===e.length){document.getElementById(a)?.remove(),(0,r.refreshResourceBarVisibility)();return}let o=document.activeElement instanceof HTMLElement?document.activeElement.dataset.lootPuzzleInventoryPiece??null:null,l=function(){let e=document.getElementById(a);if(e)return e;let t=document.createElement("div");t.id=a,t.className="loot-puzzle-inventory",t.setAttribute("role","group"),t.setAttribute("aria-label","Puzzleteile");let o=document.createElement("div");return o.className="loot-puzzle-inventory__list",o.setAttribute("role","list"),t.appendChild(o),(0,r.installResourceBar)().appendChild(t),t}(),n=e.map(s).join(",")+"|"+(t?s(t):"-");if(l.dataset.lootPuzzleInventorySignature===n)return void(0,r.refreshResourceBarVisibility)();let c=l.querySelector(".loot-puzzle-inventory__list");if(!c)return;let u=document.createDocumentFragment();for(let o of e){let e=s(o),l=t?.color===o.color&&t.number===o.number,n=document.createElement("span");n.setAttribute("role","listitem");let r=document.createElement("button");r.type="button",r.className="loot-puzzle-inventory__piece",r.classList.toggle("loot-puzzle-piece--selected",l),r.dataset.lootPuzzleInventoryPiece=e,r.dataset.lootPuzzleColor=o.color,r.dataset.lootPuzzleNumber=String(o.number),r.setAttribute("aria-pressed",String(l)),r.setAttribute("aria-label","Puzzleteil "+o.number+", "+(0,i.puzzleColorLabel)(o.color)+", auswählen"),r.draggable=!0,r.appendChild((0,i.createPuzzlePieceGraphic)(o.color,o.number)),n.appendChild(r),u.appendChild(n)}c.replaceChildren(u),l.dataset.lootPuzzleInventorySignature=n,(0,r.refreshResourceBarVisibility)(),o&&c.querySelector('[data-loot-puzzle-inventory-piece="'+CSS.escape(o)+'"]')?.focus({preventScroll:!0})}function u(e,t){let o=document.activeElement;o instanceof HTMLElement&&o!==document.body&&o!==document.documentElement&&o.isConnected||document.querySelector('[data-loot-puzzle-inventory-piece="'+CSS.escape(e+":"+t)+'"]')?.focus({preventScroll:!0})}},{"./resource-bar.ts":"1KrGH","./puzzle-visual.ts":"eaSrF","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],eaSrF:[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"puzzleColorLabel",()=>i),n.export(o,"createPuzzlePieceGraphic",()=>a);var r=e("./key-colors.ts");function i(e){return r.KEY_COLOR_DETAILS[e].label}function a(e,t){let o=document.createElementNS("http://www.w3.org/2000/svg","svg");o.setAttribute("viewBox","0 0 64 64"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-puzzle-piece-graphic","loot-puzzle-color--"+e);let l=document.createElementNS("http://www.w3.org/2000/svg","path");l.setAttribute("d","M9 9h17c-1 2-2 4-2 7a8 8 0 0 0 16 0c0-3-1-5-2-7h17v17c-2-1-4-2-7-2a8 8 0 0 0 0 16c3 0 5-1 7-2v17H38c1-2 2-4 2-7a8 8 0 0 0-16 0c0 3 1 5 2 7H9V38c2 1 4 2 7 2a8 8 0 0 0 0-16c-3 0-5 1-7 2V9Z"),l.classList.add("loot-puzzle-piece__shadow");let n=document.createElementNS("http://www.w3.org/2000/svg","path");n.setAttribute("d","M6 6h18c-1 2-2 4-2 7a10 10 0 0 0 20 0c0-3-1-5-2-7h18v18c-2-1-4-2-7-2a10 10 0 0 0 0 20c3 0 5-1 7-2v18H40c1-2 2-4 2-7a10 10 0 0 0-20 0c0 3 1 5 2 7H6V40c2 1 4 2 7 2a10 10 0 0 0 0-20c-3 0-5 1-7 2V6Z"),n.classList.add("loot-puzzle-piece__body");let r=document.createElementNS("http://www.w3.org/2000/svg","path");r.setAttribute("d","M10 10h14v4H14v10h-4V10Z"),r.classList.add("loot-puzzle-piece__highlight");let i=document.createElementNS("http://www.w3.org/2000/svg","text");return i.setAttribute("x","50%"),i.setAttribute("y","50%"),i.setAttribute("text-anchor","middle"),i.setAttribute("dominant-baseline","central"),i.classList.add("loot-puzzle-piece__number"),i.textContent=String(t),o.append(l,n,r,i),o}},{"./key-colors.ts":"7rSfY","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"49JJj":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"PuzzleStore",()=>c);var r=e("./key-colors.ts"),i=e("./storage.ts");function a(e="unconfigured"){return{version:1,signature:e,collected:Object.fromEntries(r.KEY_COLORS.map(e=>[e,[]])),placements:Object.fromEntries(r.KEY_COLORS.map(e=>[e,[]])),solvedGates:[]}}function s(e,t){return e.length===t.length&&e.every((e,o)=>e===t[o])}class c{configure(e,t){let o=e.trim();if(!o||o.length>512)throw Error("Die Puzzle-Konfigurationssignatur ist ungültig.");for(let e of(this.patterns.clear(),t)){if(this.patterns.has(e.color)||!function(e){if(0===e.length||e.length>16)return!1;let t=[...e];return t.every(e=>Number.isInteger(e)&&e>=1&&e<=16)&&new Set(t).size===t.length&&t.every(e=>e<=t.length)}(e.pattern))throw Error("Die Puzzle-Torkonfiguration ist nicht eindeutig oder ungültig.");this.patterns.set(e.color,[...e.pattern])}for(let e of(this.current.signature!==o&&(this.current=a(o)),r.KEY_COLORS)){let t=this.patterns.get(e);if(!t){this.current.collected[e]=[],this.current.placements[e]=[];continue}let o=new Set(t);this.current.collected[e]=this.current.collected[e].filter(e=>o.has(e));let l=this.current.placements[e];this.current.placements[e]=l.length===t.length?l.map(t=>null!==t&&o.has(t)&&this.current.collected[e].includes(t)?t:null):Array.from({length:t.length},()=>null)}return this.current.solvedGates=r.KEY_COLORS.filter(e=>{let t=this.patterns.get(e);return!!t&&s(this.current.placements[e],t)}),this.configured=!0,(0,i.savePuzzles)(this.current),this.state()}collectPiece(e,t){let o=this.patterns.get(e);return!(!this.configured||!o?.includes(t)||this.current.collected[e].includes(t))&&(this.current.collected[e].push(t),this.current.collected[e].sort((e,t)=>e-t),(0,i.savePuzzles)(this.current),!0)}isPieceCollected(e,t){return this.current.collected[e].includes(t)}availablePieces(e){let t=new Set(this.current.placements[e].filter(e=>null!==e));return this.current.collected[e].filter(e=>!t.has(e))}placement(e){return[...this.current.placements[e]]}placePiece(e,t,o){let l=this.patterns.get(e),n=this.current.placements[e];if(!this.configured||!l||this.isGateSolved(e)||!this.isPieceCollected(e,t)||!Number.isInteger(o)||o<0||o>=l.length)return"invalid";let r=n.indexOf(t);return(r>=0&&(n[r]=null),n[o]=t,s(n,l))?(this.current.solvedGates.push(e),(0,i.savePuzzles)(this.current),"solved"):((0,i.savePuzzles)(this.current),"placed")}isGateSolved(e){return this.configured&&this.current.solvedGates.includes(e)}solvedColors(){return this.configured?[...this.current.solvedGates]:[]}state(){var e;return{...e=this.current,collected:Object.fromEntries(r.KEY_COLORS.map(t=>[t,[...e.collected[t]]])),placements:Object.fromEntries(r.KEY_COLORS.map(t=>[t,[...e.placements[t]]])),solvedGates:[...e.solvedGates]}}constructor(){this.current=(0,i.loadPuzzles)()??a(),this.patterns=new Map,this.configured=!1}}},{"./key-colors.ts":"7rSfY","./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5gsVV":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"HighscoreStore",()=>s);var r=e("./score"),i=e("./storage");function a(e){return Number.isFinite(e)?Math.max(0,Math.floor(e)):0}class s{configure(e,t=Date.now()){this.current&&(0,r.sameConfig)(this.current.config,e)||(this.current={version:1,config:e,startedAt:t,failedChecks:0,hintsUsed:0,finishedAt:null,finalScore:null},(0,i.saveState)(this.current))}isRunning(){return null!==this.current&&null===this.current.finishedAt}fail(e=1){this.isRunning()&&this.current&&(this.current.failedChecks+=a(e),(0,i.saveState)(this.current))}hint(e=1){this.isRunning()&&this.current&&(this.current.hintsUsed+=a(e),(0,i.saveState)(this.current))}score(e=Date.now()){return this.current?null!==this.current.finalScore?this.current.finalScore:(0,r.calculateScore)(this.current.config,this.current,e):null}finish(e=Date.now()){if(!this.current)return null;if(null!==this.current.finalScore)return this.current.finalScore;let t=(0,r.calculateScore)(this.current.config,this.current,e);return this.current.finishedAt=e,this.current.finalScore=t,(0,i.saveState)(this.current),t}reset(e=Date.now()){if(!this.current)return void(0,i.clearState)();let t={...this.current.config};(0,i.clearState)(),this.current=null,this.configure(t,e)}state(){var e;return this.current?{...e=this.current,config:{...e.config}}:null}constructor(){this.current=(0,i.loadState)()}}},{"./score":"abltm","./storage":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"7riKx":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"TIMER_START_SELECTOR",()=>r),n.export(o,"installTimerEventTracking",()=>i);let r=".lia-sol-timer-startbtn[data-sol-timer-ui='solution'], .lia-sol-timer-startbtn[data-sol-timer-ui='hint']";function i(e){let t=new WeakSet;document.addEventListener("click",o=>{if(o.defaultPrevented)return;let l=function(e){for(let t of[..."function"==typeof e.composedPath?e.composedPath():[],e.target]){let e=t&&"object"==typeof t?1===t.nodeType?t:t.parentElement?t.parentElement:null:null,o=e?.closest(r);if(o)return o}return null}(o);if(!(!l||!1===l.isConnected||l.disabled||"true"===l.getAttribute("aria-disabled")||l.closest('[inert], [hidden], [aria-hidden="true"]')||function(e){let t=e.ownerDocument?.defaultView;if(!t)return!1;try{for(let o=e;o;o=o.parentElement){let e=t.getComputedStyle(o);if("none"===e.display||"hidden"===e.visibility||"collapse"===e.visibility||"none"===e.pointerEvents||0===Number(e.opacity))return!0}}catch{return!0}return!1}(l))){if(t.has(l)||!e.useStart()){var n;return void((n=o).preventDefault(),n.stopImmediatePropagation())}t.add(l)}},!0)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"4oJ1H":[function(e,t,o,l){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(o),n.export(o,"parseTreasureChestOptions",()=>q),n.export(o,"courseChestUnitCount",()=>D),n.export(o,"courseChestUnitCounts",()=>H),n.export(o,"templatePortalGeometry",()=>Y),n.export(o,"refreshTreasureChests",()=>et),n.export(o,"installTreasureChests",()=>eo);var r=e("./course-chests.ts"),i=e("./collectible-visibility.ts"),a=e("./concealment.ts"),s=e("./exploration-options.ts"),c=e("./exploration.ts"),u=e("./slide-activity.ts"),d=e("./surface-targets.ts"),p=e("./template-targets.ts");let h="lia-loot-chest",f="data-loot-chest-portal",m="data-loot-chest-tray",g=new Map,b=new Map,v=new Set,y=new Map,w=new Map,k=new Set,x=new Set,z=new Set,S=new(0,i.CollectibleVisibilityGate),E=null,C=[],L=null,_=0,A="idle",I=!1,T=!1,N=!1;function R(e){e?.hasAttribute(m)&&!e.querySelector(`[${f}]`)&&e.remove()}function j(e){if(!e)return;let t=e.parentElement;e.remove(),R(t)}function P(e,t,o,l,n=document){let r=n.createElement("button");return r.type="button",r.className="loot-treasure-chest","diamonds"===o?r.classList.add("loot-treasure-chest--diamonds"):"energy"===o&&r.classList.add("loot-treasure-chest--energy"),r.dataset.lootChestButton=e,r.dataset.lootChestLocation=t,r.dataset.lootChestReward=o,r.dataset.lootChestAmount=String(l),r.setAttribute("aria-label",1===l?"diamonds"===o?"Diamanttruhe öffnen und einen Diamanten erhalten":"energy"===o?"Energiekiste öffnen und einen Energiepunkt erhalten":"Schatztruhe öffnen und eine Goldmünze erhalten":"diamonds"===o?"Diamanttruhe öffnen und "+l+" Diamanten erhalten":"energy"===o?"Energiekiste öffnen und "+l+" Energiepunkte erhalten":"Schatztruhe öffnen und "+l+" Goldmünzen erhalten"),r.append(function(e,t=document){let o=t.createElementNS("http://www.w3.org/2000/svg","svg");o.setAttribute("viewBox","0 0 64 56"),o.setAttribute("shape-rendering","crispEdges"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-treasure-chest-graphic"),"diamonds"===e?o.classList.add("loot-treasure-chest-graphic--diamonds"):"energy"===e&&o.classList.add("loot-treasure-chest-graphic--energy");let l="diamonds"===e?`
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
    ${l}
    <rect class="loot-chest-outline" x="12" y="50" width="8" height="4"/>
    <rect class="loot-chest-outline" x="44" y="50" width="8" height="4"/>
  `,o}(o,n),function(e,t,o=document){let l=o.createElement("span");return l.className="loot-treasure-reward","diamonds"===e?l.classList.add("loot-treasure-reward--diamonds"):"energy"===e&&l.classList.add("loot-treasure-reward--energy"),l.setAttribute("aria-hidden","true"),l.innerHTML="diamonds"===e?'<span class="loot-treasure-reward__gem"></span><span>+'+t+"</span>":"energy"===e?'<span class="loot-treasure-reward__energy"></span><span>+'+t+"</span>":'<span class="loot-treasure-reward__coin"></span><span>+'+t+"</span>",l}(o,l,n)),r.addEventListener("click",()=>{if(!(!E||k.has(e))&&(x.has(e)||(Q(),r.isConnected&&x.has(e)))){if(!E.active(o)){let e;return void(r.querySelector(".loot-treasure-requirement")?.remove(),(e=r.ownerDocument.createElement("span")).className="loot-treasure-requirement",e.setAttribute("role","status"),e.textContent="energy"===o?"Zuerst Energie mit @Ressourcen(Gold, Diamanten, Energie) festlegen":"Zuerst @Ressourcen(...) ausführen",r.appendChild(e),r.classList.remove("loot-treasure-chest--waiting"),r.offsetWidth,r.classList.add("loot-treasure-chest--waiting"),window.setTimeout(()=>{e.remove(),r.classList.remove("loot-treasure-chest--waiting")},2200))}if(k.add(e),!E.collect(e,o,l)){k.delete(e),et();return}r.disabled=!0,r.classList.add("loot-treasure-chest--opened"),window.setTimeout(()=>{k.delete(e);let t=r.closest(`[${f}]`);t?j(t):r.remove(),X()},650)}}),r}function O(e){let t=e.getAttribute("data-chest-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootRuntimeId;if(o)return o;_+=1;let l=`runtime-${_}`;return e.dataset.lootRuntimeId=l,l}function M(e){return(0,d.resolveSurfaceTarget)(e)??(0,p.resolveTemplateTarget)(e)}let $=/^[+-]?(?:(?:\d+(?:[.,]\d*)?)|(?:[.,]\d+))(?:e[+-]?\d+)?$/iu;function q(e){let t=function(e){let t=e.split(";").map(e=>e.trim()).filter(Boolean),o=[],l=1;if(t[0]&&$.test(t[0])){let e=t.shift(),n=Number(e);/^\d+$/u.test(e)&&Number.isSafeInteger(n)&&!(n<=0)?l=n:o.push("Ungültige Truhenmenge: "+e+". Erwartet wird eine positive ganze Zahl.")}return t.filter(e=>$.test(e)).length>0&&o.push("Die Truhenmenge muss als erste Option stehen und darf nur einmal angegeben werden."),{amount:l,errors:o,options:t.filter(e=>!$.test(e)).join("; ")}}(e),o=(0,i.parseCollectibleOptions)(t.options),l=(0,a.extractConcealmentOptions)(o.values),n=(0,s.parseExplorationOptions)(l.values),r=[...t.errors,...o.errors,...l.errors,...n.values.filter(e=>null===M(e)).map(e=>`Unbekanntes Truhenziel oder Option: ${e}`)],c=[...new Set(n.values.map(e=>M(e)).filter(e=>null!==e))],u=o.hasOptions||null!==l.mode||n.layers.length>0,d=""===t.options.trim()||u&&0===n.values.length;return{amount:t.amount,concealment:l.mode,errors:r,inline:d,layers:n.layers,placements:c,valid:0===r.length,visibility:o.rule}}function D(e,t=()=>!0){let o=0;for(let l of e){let e=q(l.placement);e.valid&&(o+=e.inline?1:new Set(e.placements.filter(e=>!(0,p.isTemplateTarget)(e)||t(e))).size)}return o}function H(e,t=()=>!0){let o={gold:0,diamonds:0,energy:0};for(let l of e)o[l.reward]+=D([l],t);return o}function K(e,t){return`${e}:${t.reward}:${t.amount}:${[...t.placements].sort().join(";")}:${(0,i.collectibleVisibilitySignature)(t.visibility)}:${t.concealment??"none"}:${t.layers.map(e=>`${e.kind}-${e.concealment??"visible"}`).join(";")}`}function G(e,t){z.has(e)||(z.add(e),console.warn(`Loot: Fund ${e} bleibt wegen ung\xfcltiger Optionen verborgen. ${t.join(" ")}`))}function F(e,t){let o=t.sourceSection,l=null===o?null:K(o,t),n=w.get(e);if(null!==l&&n===l)return void g.delete(e);n&&w.delete(e);let r=null===l?0:y.get(l)??0;if(null!==l&&function(e){let t=0;for(let o of w.values())o===e&&(t+=1);return t}(l)<r){w.set(e,l),g.delete(e);return}g.set(e,t)}function V(e,t){for(let e of v)g.delete(e);for(let t of(v.clear(),y.clear(),w.clear(),e)){let e=q(t.placement);if(!e.valid){G(t.baseId,e.errors);continue}let o=new Set(e.placements);if(0===o.size)continue;let l={amount:e.amount,concealment:e.concealment,layers:e.layers,placements:o,reward:t.reward,sourceSection:t.section,visibility:e.visibility};for(let e of(g.set(t.baseId,l),o))E?.classify?.(`${t.baseId}:${e}`,t.reward);v.add(t.baseId);let n=K(t.section,l);y.set(n,(y.get(n)??0)+1)}for(let[e,o]of(A="complete",E?.catalogReady(H(t)),b))F(e,o);b.clear(),X()}function B(e){let t,o,l,n,r,i=(t=O(e),l="diamonds"===(o=e.getAttribute("data-reward")?.trim().toLowerCase())||"diamond"===o||"gems"===o||"diamant"===o||"diamanten"===o?"diamonds":"energy"===o||"energie"===o||"power"===o||"bolt"===o?"energy":"gold",{amount:(r=q("@0"===(n=e.getAttribute("data-placement")?.trim()??"")?"":n)).amount,baseId:t,concealment:r.concealment,errors:r.errors,inline:r.inline,layers:r.layers,placements:r.placements,reward:l,sourceHost:e,sourceSection:(0,u.sectionFromLootId)(t),valid:r.valid,visibility:r.visibility});if(i.valid)if(i.inline)b.delete(i.baseId),g.delete(i.baseId),w.delete(i.baseId),e.classList.remove("loot-treasure-host--portal-source"),0===i.layers.length&&(0,c.clearHostRevealLayers)(e);else{let t={amount:i.amount,concealment:i.concealment,layers:i.layers,placements:new Set(i.placements),reward:i.reward,sourceHost:i.sourceHost,sourceSection:i.sourceSection,visibility:i.visibility};"complete"===A?F(i.baseId,t):b.set(i.baseId,t),(0,c.clearHostRevealLayers)(e),(0,a.setHostConcealment)(e,null),e.classList.add("loot-treasure-host--portal-source"),e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren()}else G(i.baseId,i.errors),b.delete(i.baseId),g.delete(i.baseId),w.delete(i.baseId),(0,c.clearHostRevealLayers)(e),(0,a.setHostConcealment)(e,null),e.classList.add("loot-treasure-host--portal-source"),e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren();return i}function W(e,t,o,l){return[...e.querySelectorAll("[data-loot-chest-button]")].find(e=>e.dataset.lootChestButton===t&&e.dataset.lootChestReward===o&&e.dataset.lootChestAmount===String(l))??null}function U(e){for(let t of(0,p.templateDocumentCandidates)(document)){let o=[...t.querySelectorAll(`[${f}]`)].find(t=>t.dataset.lootChestPortal===e);if(o)return o}return null}function Z(e,t,o){e.style[t]!==o&&(e.style[t]=o)}function Y(e,t,o,l="overlay"){let n=Math.min(58,Math.max(44,e.width)),r=Math.min(51,Math.max(40,.875*n)),i=Math.max(4,t-n-4),a=Math.max(4,o-r-4),s="below"===l?e.left+(e.width-n)/2:e.right-n-4,c="below"===l?e.bottom+8:e.bottom-r-4;return{height:r,left:Math.max(4,Math.min(s,i)),top:Math.max(4,Math.min(c,a)),width:n}}function Q(){if(E){for(let e of(x.clear(),document.querySelectorAll(h))){if((0,c.hostIsRevealBlocked)(e,!1)){let t=O(e);b.delete(t),g.delete(t),w.delete(t);continue}let t=B(e);t.valid&&t.inline&&function(e,t,o){if(!E)return;E.classify?.(t,o.reward);let l=k.has(t);if(E.collected(t)&&!l){x.delete(t),S.forget(`chest:${o.baseId}`),(0,c.clearHostRevealLayers)(e),(0,a.setHostConcealment)(e,null),e.childElementCount>0&&e.replaceChildren();return}if(!(0,u.liaSlideIsAccessible)(o.sourceSection)&&!l){x.delete(t),(0,c.clearHostRevealLayers)(e),(0,a.setHostConcealment)(e,null),e.childElementCount>0&&e.replaceChildren();return}let n=S.visible(`chest:${o.baseId}`,o.visibility,(0,u.sourceSlideIsActive)(o.sourceSection,e),X);if(!n&&!l){(0,c.clearHostRevealLayers)(e),(0,a.setHostConcealment)(e,null),e.childElementCount>0&&e.replaceChildren(),x.delete(t);return}let r=(0,c.setHostRevealLayers)(e,t,o.layers);l||W(r,t,o.reward,o.amount)||((0,a.setHostConcealment)(r,null),r.replaceChildren(P(t,"inline",o.reward,o.amount))),(0,a.setHostConcealment)(r,o.concealment),n&&!(0,c.hostIsRevealBlocked)(e)?x.add(t):x.delete(t)}(e,`${t.baseId}:inline`,t)}!function(){if(!E)return;let e=new Set;for(let[t,o]of g){if(!(0,u.liaSlideIsAccessible)(o.sourceSection)){for(let e of o.placements){let o=`${t}:${e}`;x.delete(o),j(U(o))}continue}let l=S.visible(`chest:${t}`,o.visibility,(0,u.sourceSlideIsActive)(o.sourceSection,o.sourceHost),X);for(let n of o.placements){let r=`${t}:${n}`;E.classify?.(r,o.reward);let i=k.has(r),s=E.collected(r)&&!i;if(!l&&!i){x.delete(r),j(U(r));continue}e.add(r);let h=U(r);s?(j(h),h=null):i||(h=function(e,t,o){let l=function(e,t){if((0,p.isTemplateTarget)(e)){let o=(0,p.findTemplateTarget)(e,"chest",document);return o&&("slide"!==(0,p.templateTargetDefinition)(e).scope||(0,u.sourceSlideIsActive)(t.sourceSection,o.root))?{anchor:o.chestAnchor,container:o.chestContainer??o.chestAnchor.ownerDocument.body,grouped:!!o.chestContainer,template:!0,templateLayout:o.chestContainer?"inside":"floating",templatePosition:o.chestContainer?null:o.chestPosition??"overlay"}:null}if(!(0,d.isSurfaceTarget)(e))return null;let o=(0,d.surfaceTargetElement)(e,document);return o?{anchor:o,container:o,grouped:(0,d.surfaceTargetIsGrouped)(e),template:!1,templateLayout:null,templatePosition:null}:null}(t,o),n=U(e);if(!l)return j(n),null;(n?.dataset.lootChestReward!==o.reward||n?.dataset.lootChestAmount!==String(o.amount))&&(j(n),n=null);let r=l.grouped?function(e,t){let o=`:scope > [${m}="${t}"]`,l=e.container.querySelector(o);if(l)return l;let n=e.container.ownerDocument,r=e.container.matches("ul, ol"),i=n.createElement(r?"li":"div");return i.className=["loot-chest-tray",e.template?"loot-chest-tray--template":"loot-chest-tray--support"].join(" "),i.dataset.lootChestTray=t,i.setAttribute("role","group"),i.setAttribute("aria-label","Versteckte Funde"),e.container.appendChild(i),i}(l,t):l.container;if(!n){let i=r.ownerDocument,a=!l.template&&r.matches("ul, ol");(n=i.createElement(a?"li":"div")).className=`loot-chest-placement loot-chest-placement--${t}`,n.dataset.lootChestPortal=e,n.dataset.lootChestLocation=t,n.dataset.lootChestReward=o.reward,n.dataset.lootChestAmount=String(o.amount),l.template&&(n.dataset.lootChestTemplateTarget=t),a&&(n.classList.add("nav__item","lia-support-menu__item"),n.setAttribute("role","none"))}if(n.parentElement!==r){let e=n.parentElement;r.appendChild(n),R(e)}n.classList.toggle("loot-chest-placement--template","floating"===l.templateLayout),n.classList.toggle("loot-chest-placement--template-inside","inside"===l.templateLayout),n.classList.toggle("loot-chest-placement--template-below","floating"===l.templateLayout&&"below"===l.templatePosition),l.templatePosition?n.dataset.lootChestTemplatePosition=l.templatePosition:delete n.dataset.lootChestTemplatePosition;let i=(0,c.setHostRevealLayers)(n,e,o.layers);if(W(i,e,o.reward,o.amount)||((0,a.setHostConcealment)(i,null),i.replaceChildren(P(e,t,o.reward,o.amount,n.ownerDocument))),(0,a.setHostConcealment)(i,o.concealment),"floating"===l.templateLayout)!function(e,t,o){let l=t.getBoundingClientRect(),n=t.ownerDocument.defaultView??window,r=t.isConnected&&l.width>0&&l.height>0&&l.right>0&&l.bottom>0&&l.left<n.innerWidth&&l.top<n.innerHeight;if(e.hidden===r&&(e.hidden=!r),!r)return;let i=Y(l,n.innerWidth,n.innerHeight,o);Z(e,"left",`${i.left}px`),Z(e,"top",`${i.top}px`),Z(e,"width",`${i.width}px`),Z(e,"height",`${i.height}px`)}(n,l.anchor,l.templatePosition??"overlay");else if("inside"===l.templateLayout)for(let e of(n.hidden=!1,["height","left","top","width"]))Z(n,e,"");return n}(r,n,o)),!l||s||i||!h||(0,c.hostIsRevealBlocked)(h)?x.delete(r):x.add(r)}}for(let t of function(){let e=[];for(let t of(0,p.templateDocumentCandidates)(document))for(let o of t.querySelectorAll(`[${f}]`))e.includes(o)||e.push(o);return e}()){let o=t.dataset.lootChestPortal;o&&(e.has(o)||k.has(o))||j(t)}}(),function(){for(let e of C)e.takeRecords()}()}}function X(){null===L&&(L=window.setTimeout(()=>{L=null,Q()},0))}function J(e){e.length>0&&X()}class ee extends HTMLElement{static get observedAttributes(){return["data-chest-id","data-placement","data-reward"]}connectedCallback(){(0,c.hostIsRevealBlocked)(this,!1)||B(this),X()}attributeChangedCallback(){this.isConnected&&(x.clear(),(0,c.hostIsRevealBlocked)(this,!1)||B(this),X())}}function et(){Q()}function eo(e){if(E=e,document.getElementById("lia-loot-treasure-chest")?.remove(),"idle"===A&&(A="pending",(0,r.discoverCourseChests)().then(({declarations:e,catalog:t})=>V(e,t)).catch(()=>V([],[]))),I||(I=!0,(0,u.observeLiaSlideActivity)(()=>{for(let e of(x.clear(),X(),[80,250,650]))window.setTimeout(X,e)})),N||(N=!0,document.addEventListener(c.REVEAL_CHANGED_EVENT,X)),customElements.get(h)||customElements.define(h,ee),0===C.length)for(let e of(0,p.templateDocumentCandidates)(document)){let t=new(e.defaultView?.MutationObserver??MutationObserver)(J);t.observe(e.documentElement,{attributeFilter:["aria-hidden","aria-pressed","class","data-active","data-open","hidden","style"],attributes:!0,childList:!0,subtree:!0}),C.push(t)}if(!T){T=!0;let e=new Set;for(let t of(0,p.templateDocumentCandidates)(document)){let o=t.defaultView;!o||e.has(o)||(e.add(o),o.addEventListener("resize",X,{passive:!0}),o.addEventListener("scroll",X,{capture:!0,passive:!0}),o.visualViewport?.addEventListener("resize",X,{passive:!0}),o.visualViewport?.addEventListener("scroll",X,{passive:!0}))}}et()}},{"./course-chests.ts":"2ceW6","./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./exploration-options.ts":"fw9xf","./exploration.ts":"5BeJ3","./slide-activity.ts":"5qduG","./surface-targets.ts":"dYwdL","./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}]},["k1TZk"],"k1TZk","parcelRequire3c00",{});
//# sourceMappingURL=index.js.map
