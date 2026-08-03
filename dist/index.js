!function(e,t,o,n,r){var l="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},i="function"==typeof l[n]&&l[n],a=i.i||{},s=i.cache||{},c="u">typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(t,o){if(!s[t]){if(!e[t]){if(r[t])return r[t];var a="function"==typeof l[n]&&l[n];if(!o&&a)return a(t,!0);if(i)return i(t,!0);if(c&&"string"==typeof t)return c(t);var d=Error("Cannot find module '"+t+"'");throw d.code="MODULE_NOT_FOUND",d}f.resolve=function(o){var n=e[t][1][o];return null!=n?n:o},f.cache={};var h=s[t]=new u.Module(t);e[t][0].call(h.exports,f,h,h.exports,l)}return s[t].exports;function f(e){var t=f.resolve(e);if(!1===t)return{};if(Array.isArray(t)){var o={__esModule:!0};return t.forEach(function(e){var t=e[0],n=e[1],r=e[2]||e[0],l=u(n);"*"===t?Object.keys(l).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(o,e)||Object.defineProperty(o,e,{enumerable:!0,get:function(){return l[e]}})}):"*"===r?Object.defineProperty(o,t,{enumerable:!0,value:l}):Object.defineProperty(o,t,{enumerable:!0,get:function(){return"default"===r?l.__esModule?l.default:l:l[r]}})}),o}return u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.require=c,this.exports={}},u.modules=e,u.cache=s,u.parent=i,u.distDir=void 0,u.publicUrl=void 0,u.devServer=void 0,u.i=a,u.register=function(t,o){e[t]=[function(e,t){t.exports=o},{}]},Object.defineProperty(u,"root",{get:function(){return l[n]}}),l[n]=u;for(var d=0;d<t.length;d++)u(t[d]);if(o){var h=u(o);"object"==typeof exports&&"u">typeof module?module.exports=h:"function"==typeof define&&define.amd&&define(function(){return h})}}({k1TZk:[function(e,t,o,n){var r=e("./achievements"),l=e("./achievement-overlay"),i=e("./achievement-store"),a=e("./inventory-store"),s=e("./key-colors"),c=e("./key-inventory-bar"),u=e("./key-pickup"),d=e("./magnifier"),h=e("./magnifier-store"),f=e("./exploration"),p=e("./exploration-store"),m=e("./loot-if"),g=e("./loot-if-store"),v=e("./object-lock"),b=e("./course-chests"),y=e("./course-identity"),w=e("./popup"),k=e("./quiz-events"),x=e("./resource-bar"),S=e("./resource-store"),E=e("./score"),C=e("./secret-slides"),L=e("./slide-portal"),A=e("./style"),_=e("./store"),I=e("./timer-events"),T=e("./treasure-chest");let R="0.0.1";async function j(e){try{let t,o,n,j,N,M,$,O,z,q,D,P,H,K;await (0,y.prepareLiaCourseIdentity)(b.discoverCourseVersion),t=new(0,_.HighscoreStore),o=new(0,S.ResourceStore),n=new(0,a.KeyInventoryStore),j=new(0,h.MagnifierStore),N=new(0,p.ExplorationStore),M=new(0,g.LootIfStore),$=new(0,i.AchievementStore),O=new(0,r.AchievementManager)($,l.showAchievement),z=()=>{let e=t.state();O.highscoreFinished(e?.finalScore??null,e?.config.maxPoints??NaN),(0,k.allRenderedCourseQuizzesSolved)(document)&&O.quizzesCompleted(),O.enable()},q=e=>{let t=o.spend(e),n=o.state();return n&&(0,x.renderResources)(n.gold,n.diamonds,n.energy),t||(0,x.showInsufficientResource)("gold"===e?"coins":"diamonds"===e?"gems":"energy"),(0,m.refreshLootIf)(),t},D=(e,t,n)=>{let r=o.configure(e,t,n);O.chestCollected(o.collectedChestCounts()),(0,x.renderResources)(r.gold,r.diamonds,r.energy),(0,T.refreshTreasureChests)(),(0,m.refreshLootIf)()},P={version:R,configure(e,o,n,r,l){let i=(0,E.createConfig)(e,o,n,r,l);t.configure(i),O.highscoreFinished(null,i.maxPoints)},fail(e=1){t.fail(e)},hint(e=1){t.hint(e)},finish(){let e=t.finish(),o=t.state();return null!==e&&o&&(O.highscoreFinished(e,o.config.maxPoints),(0,w.showHighscore)(e,o.config.maxPoints)),e},reset(){(0,w.hideHighscore)(),t.reset();let e=t.state();O.highscoreFinished(null,e?.config.maxPoints??NaN)},score:e=>t.score(e),show(){let e=t.state();e?.finalScore!==null&&e?.finalScore!==void 0&&(0,w.showHighscore)(e.finalScore,e.config.maxPoints)},enableAchievements(){z()},state:()=>t.state(),resources(e,t,o){D(e,t,o)}},(0,A.injectStyles)(),(0,m.installLootIf)({chestCounts:()=>o.collectedChestCounts(),magnifierFound:()=>j.isCollected(),resourceState:()=>o.state(),unlockedLockIds:()=>n.state().unlockedLocks},M),(0,C.installSecretSlides)({found:()=>{O.secretSlideFound(),(0,m.recordLootIfSecretSlideVisited)()}}),(0,L.installSlidePortals)(),(0,b.discoverCourseAchievementsDeclaration)().then(e=>{e&&z()}),(0,b.discoverCourseAchievementCatalog)().then(e=>{let t=N.state();O.explorationCatalogReady(e,{dust:t.foundDustObjects.length,plant:t.wateredPlants.length,soil:t.dugLayers.length,solid:t.foundInvisibleObjects.length})}).catch(()=>{}).catch(()=>{}),(0,b.discoverCourseResourceDeclaration)().then(e=>{e&&null===o.state()&&D(e.gold,e.diamonds,e.energy)}).catch(()=>{}),(H=o.state())&&(0,x.renderResources)(H.gold,H.diamonds,H.energy),(0,d.installMagnifier)({collected:()=>j.isCollected(),collect:()=>{let e=j.collect();return e&&(0,m.refreshLootIf)(),e},find:(e,t)=>{if(!N.findConcealedObject(e,t))return;let o=N.state();O.concealmentFound(t,"dust"===t?o.foundDustObjects.length:o.foundInvisibleObjects.length)}}),(0,f.installExploration)({activeTool:()=>N.activeTool(),collectTool:e=>N.collectTool(e),digLayer:e=>!!N.digLayer(e)&&(O.soilDug(N.state().dugLayers.length),!0),isLayerDug:e=>N.isLayerDug(e),isPlantOpened:e=>N.isPlantOpened(e),isPlantWatered:e=>N.isPlantWatered(e),isToolCollected:e=>N.isToolCollected(e),openPlant:e=>N.openPlant(e),setActiveTool:e=>N.setActiveTool(e),waterPlant:e=>!!N.waterPlant(e)&&(O.plantBloomed(N.state().wateredPlants.length),!0)}),(0,T.installTreasureChests)({active:e=>{let t=o.state();return null!==t&&("energy"!==e||null!==t.energy)},catalogReady:e=>{O.chestCatalogReady(e,o.collectedChestCounts())},classify:(e,t)=>{o.classifyCollectedChest(e,t)&&(O.chestCollected(o.collectedChestCounts()),(0,m.refreshLootIf)())},collected:e=>o.isChestCollected(e),collect:(e,t,n)=>{if(!o.collectChest(e,t,n))return!1;let r=o.state();return!!r&&(O.chestCollected(o.collectedChestCounts()),(0,x.renderResources)(r.gold,r.diamonds,r.energy),(0,x.announceResource)(1===n?"diamonds"===t?"Diamanttruhe geöffnet: einen Diamanten erhalten.":"energy"===t?"Energiekiste geöffnet: einen Energiepunkt erhalten.":"Schatztruhe geöffnet: eine Goldmünze erhalten.":"diamonds"===t?"Diamanttruhe geöffnet: "+n+" Diamanten erhalten.":"energy"===t?"Energiekiste geöffnet: "+n+" Energiepunkte erhalten.":"Schatztruhe geöffnet: "+n+" Goldmünzen erhalten."),(0,m.refreshLootIf)(),!0)}}),K=n.state(),Object.values(K.keys).some(e=>e>0)&&(0,c.renderKeyInventory)(K.keys),(0,u.installKeyPickups)({collected:e=>n.isKeyCollected(e),collect:(e,t)=>!!n.collectKey(e,t)&&((0,c.renderKeyInventory)(n.state().keys),(0,c.announceKeyFound)(s.KEY_COLOR_DETAILS[t].foundMessage),!0),focusInventory:c.focusKeyInventory}),(0,v.installObjectLocks)({catalogReady:e=>{O.lockCatalogReady(e,n.state().unlockedLocks.length)},unlocked:e=>n.isLockUnlocked(e),unlock:(e,t,o)=>{let r=n.useKeyForLock(e,t);if("unlocked"===r){let e=n.state();(0,c.renderKeyInventory)(e.keys),O.lockUnlocked(e.unlockedLocks.length),M.recordOpenedLockTarget(o),(0,m.refreshLootIf)()}return r}}),(0,I.installTimerEventTracking)({useStart:()=>q("energy")}),(0,k.installQuizEventTracking)({active:()=>!0,failed:()=>t.fail(),hint:e=>t.hint(e),solved:e=>{(0,m.recordLootIfQuizSolved)(e),(0,k.allRenderedCourseQuizzesSolved)(document)&&O.quizzesCompleted()},courseCompleted:()=>P.finish(),useCheck:()=>q("energy"),useHint:()=>q("gold"),useResolve:()=>q("diamonds")}),window.__LIA_LOOT_HIGHSCORE__=P,window.__LIA_LOOT_RUNTIME__===e&&(e.status="ready")}catch(t){window.__LIA_LOOT_RUNTIME__===e&&(e.status="failed"),console.error("[lia-loot] Initialisierung fehlgeschlagen.",t)}}let N=function(){let e=window.__LIA_LOOT_RUNTIME__;if(e?.status==="booting"||e?.status==="ready")return null;if(window.__LIA_LOOT_HIGHSCORE__)return window.__LIA_LOOT_RUNTIME__={version:R,status:"ready"},null;let t={version:R,status:"booting"};return window.__LIA_LOOT_RUNTIME__=t,t}();N&&j(N)},{"./achievements":"c7Uyw","./achievement-overlay":"aBJTX","./achievement-store":"40Y3c","./inventory-store":"bTrLW","./key-colors":"7rSfY","./key-inventory-bar":"kd9xY","./key-pickup":"aEHXm","./magnifier":"grhSe","./magnifier-store":"4rVr5","./object-lock":"bLBcI","./course-chests":"2ceW6","./course-identity":"g3iqo","./popup":"cCRZG","./quiz-events":"1ZNl4","./resource-bar":"1KrGH","./resource-store":"1O7ju","./score":"abltm","./secret-slides":"7fPSc","./slide-portal":"8aUxA","./style":"3Vffy","./store":"5gsVV","./timer-events":"7riKx","./treasure-chest":"4oJ1H","./exploration":"5BeJ3","./exploration-store":"eyg0o","./loot-if":"iooeB","./loot-if-store":"2KjdS"}],c7Uyw:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"ACHIEVEMENT_EXPLORATION_KINDS",()=>i),r.export(o,"ACHIEVEMENTS",()=>c),r.export(o,"AchievementManager",()=>u);var l=e("./types.ts");let i=["solid","dust","soil","plant"],a={gold:"all-treasure-chests-opened",diamonds:"all-diamond-chests-opened",energy:"all-energy-chests-opened"},s={solid:"all-invisible-objects-found",dust:"all-magic-dust-objects-found",soil:"all-soil-dug",plant:"all-plants-bloomed"},c={"all-quizzes-solved":{id:"all-quizzes-solved",title:"Aufgaben-Meister",message:"Du hast alle Aufgaben geschafft."},"perfect-highscore":{id:"perfect-highscore",title:"Perfekter Highscore",message:"Du hast die maximale Punktzahl erreicht."},"all-treasure-chests-opened":{id:"all-treasure-chests-opened",title:"Schatzjäger",message:"Du hast alle Schatztruhen geöffnet."},"all-diamond-chests-opened":{id:"all-diamond-chests-opened",title:"Diamantensammler",message:"Du hast alle Diamanttruhen geöffnet."},"all-energy-chests-opened":{id:"all-energy-chests-opened",title:"Energiesammler",message:"Du hast alle Energiekisten geöffnet."},"all-invisible-objects-found":{id:"all-invisible-objects-found",title:"Unsichtbares entdeckt",message:"Du hast alle unsichtbaren Objekte gefunden."},"all-magic-dust-objects-found":{id:"all-magic-dust-objects-found",title:"Zauberstaubspürnase",message:"Du hast alle Zauberstaub-Objekte gefunden."},"all-soil-dug":{id:"all-soil-dug",title:"Ausgrabungsprofi",message:"Du hast alle Erdhaufen weggebuddelt."},"all-plants-bloomed":{id:"all-plants-bloomed",title:"Grüner Daumen",message:"Du hast alle Pflanzen zum Blühen gebracht."},"all-locks-opened":{id:"all-locks-opened",title:"Schlossknacker",message:"Du hast alle Schlösser geöffnet."},"secret-slide-found":{id:"secret-slide-found",title:"Geheimnis entdeckt",message:"Du hast eine geheime Folie gefunden."}};class u{constructor(e,t){this.enabled=!1,this.allQuizzesCompleted=!1,this.perfectHighscore=!1,this.chestTotals={gold:null,diamonds:null,energy:null},this.collectedChests={gold:0,diamonds:0,energy:0},this.explorationTotals={solid:null,dust:null,soil:null,plant:null},this.explorationCompleted={solid:0,dust:0,soil:0,plant:0},this.lockTotal=null,this.unlockedLocks=0,this.secretFound=!1,this.store=e,this.notify=t,this.legacyAllChestsOpened=!0===e.state().legacyAllChestsOpened}enable(){this.enabled||(this.enabled=!0,this.evaluateAll())}isEnabled(){return this.enabled}quizzesCompleted(){this.allQuizzesCompleted=!0,this.evaluate("all-quizzes-solved",!0)}highscoreFinished(e,t){this.perfectHighscore=null!==e&&Number.isFinite(t)&&e===t,this.evaluate("perfect-highscore",this.perfectHighscore)}chestCatalogReady(e,t){this.chestTotals=d(e),this.collectedChests=d(t),this.evaluateChestProgress()}chestCollected(e){this.collectedChests=d(e),this.evaluateChestProgress()}explorationCatalogReady(e,t){this.explorationTotals=h(e),this.explorationCompleted=h(t),this.evaluateExplorationProgress()}concealmentFound(e,t){("solid"===e||"dust"===e)&&(this.explorationCompleted[e]=f(t),this.evaluateExplorationKind(e))}soilDug(e){this.explorationCompleted.soil=f(e),this.evaluateExplorationKind("soil")}plantBloomed(e){this.explorationCompleted.plant=f(e),this.evaluateExplorationKind("plant")}lockCatalogReady(e,t){this.lockTotal=f(e),this.unlockedLocks=f(t),this.evaluateLockProgress()}lockUnlocked(e){this.unlockedLocks=f(e),this.evaluateLockProgress()}secretSlideFound(){this.secretFound=!0,this.evaluate("secret-slide-found",!0)}state(){return this.store.state()}evaluateAll(){this.evaluate("all-quizzes-solved",this.allQuizzesCompleted),this.evaluate("perfect-highscore",this.perfectHighscore),this.evaluateChestProgress(),this.evaluateExplorationProgress(),this.evaluateLockProgress(),this.evaluate("secret-slide-found",this.secretFound)}evaluateChestProgress(){for(let e of l.RESOURCE_KINDS){let t=this.chestTotals[e];this.evaluateCatalogProgress(a[e],t,this.collectedChests[e],this.legacyAllChestsOpened&&null!==t&&t>0)}}evaluateExplorationProgress(){for(let e of i)this.evaluateExplorationKind(e)}evaluateExplorationKind(e){this.evaluateCatalogProgress(s[e],this.explorationTotals[e],this.explorationCompleted[e])}evaluateCatalogProgress(e,t,o,n=!1){this.evaluate(e,null!==t&&t>0&&(n||o>=t))}evaluateLockProgress(){this.evaluate("all-locks-opened",null!==this.lockTotal&&this.lockTotal>0&&this.unlockedLocks>=this.lockTotal)}evaluate(e,t){this.enabled&&t&&this.store.unlock(e)&&this.notify(c[e])}}function d(e){return{gold:f(e?.gold),diamonds:f(e?.diamonds),energy:f(e?.energy)}}function h(e){return{solid:f(e?.solid),dust:f(e?.dust),soil:f(e?.soil),plant:f(e?.plant)}}function f(e){return Number.isFinite(e)?Math.max(0,Math.floor(e)):0}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK","./types.ts":"ijQUu"}],aqhRK:[function(e,t,o,n){o.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},o.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},o.exportAll=function(e,t){return Object.keys(e).forEach(function(o){"default"===o||"__esModule"===o||Object.prototype.hasOwnProperty.call(t,o)||Object.defineProperty(t,o,{enumerable:!0,get:function(){return e[o]}})}),t},o.export=function(e,t,o){Object.defineProperty(e,t,{enumerable:!0,get:o})}},{}],ijQUu:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"RESOURCE_KINDS",()=>l),r.export(o,"ACHIEVEMENT_IDS",()=>i),r.export(o,"LEGACY_ACHIEVEMENT_IDS",()=>a);let l=["gold","diamonds","energy"],i=["all-quizzes-solved","perfect-highscore","all-treasure-chests-opened","all-diamond-chests-opened","all-energy-chests-opened","all-invisible-objects-found","all-magic-dust-objects-found","all-soil-dug","all-plants-bloomed","all-locks-opened","secret-slide-found"],a=["all-chests-opened"]},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],aBJTX:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"ACHIEVEMENT_AUTO_HIDE_MS",()=>i),r.export(o,"showAchievement",()=>d);let l="lia-loot-achievement-overlay",i=12e3,a=new Set,s=new WeakMap;function c(){let e=document.getElementById(l);if(e)return e;let t=document.createElement("aside");return t.id=l,t.className="loot-achievement",t.hidden=!0,t.setAttribute("aria-label","Erfolgsmeldungen"),(document.body??document.documentElement).append(t),t}function u(e,t){let o=s.get(e);void 0!==o&&(globalThis.clearTimeout(o),s.delete(e));let n=c();e.remove(),a.delete(t),n.hidden=0===n.childElementCount,n.hidden||(n.scrollTop=n.scrollHeight)}function d(e){var t;let o,n,r,l,d,h,f,p,m;if(a.has(e.id))return;let g=c(),v=((o=document.createElement("div")).className="loot-achievement__card",o.dataset.achievementId=e.id,(n=document.createElement("div")).className="loot-achievement__content",n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.setAttribute("aria-atomic","true"),(r=document.createElement("div")).className="loot-achievement__text",(l=document.createElement("p")).className="loot-achievement__eyebrow",l.textContent="Erfolg freigeschaltet",(d=document.createElement("p")).className="loot-achievement__title",d.textContent=e.title,(h=document.createElement("p")).className="loot-achievement__message",h.textContent=e.message,r.append(l,d,h),n.append(((f=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("viewBox","0 0 48 48"),f.setAttribute("shape-rendering","crispEdges"),f.setAttribute("aria-hidden","true"),f.classList.add("loot-achievement__graphic"),f.innerHTML=`
    <path class="loot-achievement__burst" d="M20 2h8v5h6v5h5v6h5v12h-5v6h-5v5h-6v5h-8v-5h-6v-5H9v-6H4V18h5v-6h5V7h6z"/>
    <path class="loot-achievement__burst-light" d="M20 7h8v4h6v5h5v16h-5v5h-6v4h-8v-4h-6v-5H9V16h5v-5h6z"/>
    <path class="loot-achievement__star" d="M22 12h4v7h7v4h-4v4h-3v8h-4v-8h-3v-4h-4v-4h7z"/>
  `,f),r),(p=document.createElement("button")).type="button",p.className="loot-achievement__close",p.setAttribute("aria-label","Erfolgsmeldung schließen"),p.textContent="×",p.addEventListener("click",()=>u(o,e.id)),o.addEventListener("keydown",t=>{"Escape"===t.key&&(t.preventDefault(),u(o,e.id))}),o.append(n,p),o);g.append(v),a.add(e.id),g.hidden=!1,v.offsetWidth,v.classList.add("loot-achievement__card--visible"),g.scrollTop=g.scrollHeight,t=e.id,m=globalThis.setTimeout(()=>{s.delete(v),u(v,t)},i),s.set(v,m)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"40Y3c":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"AchievementStore",()=>i);var l=e("./storage.ts");class i{unlock(e){return!this.current.unlocked.includes(e)&&(this.current.unlocked.push(e),(0,l.saveAchievements)(this.current),!0)}state(){var e;return{...e=this.current,unlocked:[...e.unlocked]}}constructor(){this.current=(0,l.loadAchievements)()??{version:1,unlocked:[]}}}},{"./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8s1BG":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"loadState",()=>g),r.export(o,"saveState",()=>v),r.export(o,"clearState",()=>b),r.export(o,"loadResources",()=>y),r.export(o,"saveResources",()=>w),r.export(o,"loadChestRewards",()=>k),r.export(o,"saveChestRewards",()=>x),r.export(o,"loadKeyInventory",()=>S),r.export(o,"saveKeyInventory",()=>E),r.export(o,"loadMagnifier",()=>C),r.export(o,"saveMagnifier",()=>L),r.export(o,"loadAchievements",()=>A),r.export(o,"saveAchievements",()=>_);var l=e("./score.ts"),i=e("./key-colors.ts"),a=e("./course-identity.ts"),s=e("./types.ts");function c(e){let t=`${e}${encodeURIComponent((0,a.liaCourseIdentity)())}`;return!function(e,t){let o,n=(o=`${window.location.origin}${window.location.pathname}${window.location.search}`,`${e}${encodeURIComponent(o)}`);if(n===t)return;let r=window.sessionStorage.getItem(n);null!==r&&(null===window.sessionStorage.getItem(t)&&window.sessionStorage.setItem(t,r),window.sessionStorage.removeItem(n))}(e,t),t}function u(){return c("lia-loot:highscore:v1:")}function d(){return c("lia-loot:resources:v1:")}function h(){return c("lia-loot:chest-rewards:v1:")}function f(){return c("lia-loot:key-inventory:v1:")}function p(){return c("lia-loot:magnifier:v1:")}function m(){return c("lia-loot:achievements:v1:")}function g(){try{let e=window.sessionStorage.getItem(u());if(!e)return null;let t=JSON.parse(e);return!function(e){if(!e||"object"!=typeof e||1!==e.version||!e.config)return!1;try{(0,l.createConfig)(e.config.maxPoints,e.config.failedCheckPenalty,e.config.hintPenalty,e.config.graceMinutes,e.config.perMinutePenalty)}catch{return!1}return Number.isFinite(e.startedAt)&&Number.isInteger(e.failedChecks)&&Number(e.failedChecks)>=0&&Number.isInteger(e.hintsUsed)&&Number(e.hintsUsed)>=0&&(null===e.finishedAt||Number.isFinite(e.finishedAt))&&(null===e.finalScore||Number.isFinite(e.finalScore))}(t)?null:t}catch{return null}}function v(e){try{window.sessionStorage.setItem(u(),JSON.stringify(e))}catch{}}function b(){try{window.sessionStorage.removeItem(u())}catch{}}function y(){try{let t=window.sessionStorage.getItem(d());if(!t)return null;var e=JSON.parse(t);if(!e||"object"!=typeof e||1!==e.version||!Number.isInteger(e.initialGold)||0>Number(e.initialGold)||!Number.isInteger(e.initialDiamonds)||0>Number(e.initialDiamonds)||!Number.isInteger(e.gold)||0>Number(e.gold)||!Number.isInteger(e.diamonds)||0>Number(e.diamonds))return null;let o=void 0!==e.initialEnergy&&null!==e.initialEnergy,n=void 0!==e.energy&&null!==e.energy;if(o!==n||o&&(!Number.isInteger(e.initialEnergy)||0>Number(e.initialEnergy)||!Number.isInteger(e.energy)||0>Number(e.energy))||void 0!==e.collectedChests&&(!Array.isArray(e.collectedChests)||!e.collectedChests.every(e=>"string"==typeof e&&e.trim().length>0))||void 0!==e.chestCollected&&"boolean"!=typeof e.chestCollected)return null;let r=Array.isArray(e.collectedChests)?[...new Set(e.collectedChests.map(e=>e.trim()))]:!0===e.chestCollected?["legacy:auto"]:[];return{version:1,initialGold:Number(e.initialGold),initialDiamonds:Number(e.initialDiamonds),initialEnergy:o?Number(e.initialEnergy):null,gold:Number(e.gold),diamonds:Number(e.diamonds),energy:n?Number(e.energy):null,collectedChests:r}}catch{return null}}function w(e){try{window.sessionStorage.setItem(d(),JSON.stringify(e))}catch{}}function k(){try{let e=window.sessionStorage.getItem(h());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!e.collected||"object"!=typeof e.collected||Array.isArray(e.collected))return null;let t=e.collected;if(Object.keys(t).some(e=>!s.RESOURCE_KINDS.includes(e)))return null;let o={gold:[],diamonds:[],energy:[]},n=new Set;for(let e of s.RESOURCE_KINDS){let r=t[e]??[];if(!Array.isArray(r)||!r.every(e=>"string"==typeof e&&e.trim().length>0))return null;let l=r.map(e=>e.trim());if(new Set(l).size!==l.length)return null;for(let e of l){if(n.has(e))return null;n.add(e)}o[e]=l}return{version:1,collected:o}}(t)}catch{return null}}function x(e){try{window.sessionStorage.setItem(h(),JSON.stringify(e))}catch{}}function S(){try{let e=window.sessionStorage.getItem(f());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!e.keys||"object"!=typeof e.keys)return null;let t=e.keys,o=(0,i.createEmptyKeyCounts)();for(let e of i.KEY_COLORS){let n=t[e]??0;if(!Number.isInteger(n)||0>Number(n))return null;o[e]=Number(n)}if(!Array.isArray(e.collectedKeys)||!e.collectedKeys.every(e=>"string"==typeof e&&e.trim().length>0))return null;let n=[...new Set(e.collectedKeys.map(e=>e.trim()))];if(void 0!==e.unlockedLocks&&(!Array.isArray(e.unlockedLocks)||!e.unlockedLocks.every(e=>"string"==typeof e&&e.trim().length>0)))return null;let r=Array.isArray(e.unlockedLocks)?e.unlockedLocks.map(e=>e.trim()):[],l=[...new Set(r)];return l.length!==r.length||i.KEY_COLORS.reduce((e,t)=>e+o[t],0)+l.length!==n.length?null:{version:1,keys:o,collectedKeys:n,unlockedLocks:l}}(t)}catch{return null}}function E(e){try{window.sessionStorage.setItem(f(),JSON.stringify(e))}catch{}}function C(){try{var e;let t=window.sessionStorage.getItem(p());if(!t)return null;return(e=JSON.parse(t))&&"object"==typeof e?1!==e.version||"boolean"!=typeof e.collected?null:{version:1,collected:e.collected}:null}catch{return null}}function L(e){try{window.sessionStorage.setItem(p(),JSON.stringify(e))}catch{}}function A(){try{let e=window.sessionStorage.getItem(m());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!Array.isArray(e.unlocked)||void 0!==e.legacyAllChestsOpened&&"boolean"!=typeof e.legacyAllChestsOpened)return null;let t=new Set([...s.ACHIEVEMENT_IDS,...s.LEGACY_ACHIEVEMENT_IDS]);if(!e.unlocked.every(e=>"string"==typeof e&&t.has(e)))return null;let o=[...e.unlocked];if(new Set(o).size!==o.length)return null;let n=!0===e.legacyAllChestsOpened||o.includes("all-chests-opened"),r=new Set(s.ACHIEVEMENT_IDS),l=o.filter(e=>r.has(e));return n?{version:1,unlocked:l,legacyAllChestsOpened:!0}:{version:1,unlocked:l}}(t)}catch{return null}}function _(e){try{window.sessionStorage.setItem(m(),JSON.stringify(e))}catch{}}},{"./score.ts":"abltm","./key-colors.ts":"7rSfY","./course-identity.ts":"g3iqo","./types.ts":"ijQUu","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],abltm:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"createConfig",()=>i),r.export(o,"sameConfig",()=>a),r.export(o,"elapsedSeconds",()=>s),r.export(o,"calculateScore",()=>c),r.export(o,"trophyTier",()=>u),r.export(o,"formatScore",()=>d);let l=["maxPoints","failedCheckPenalty","hintPenalty","graceMinutes","perMinutePenalty"];function i(e,t,o,n,r){let i={maxPoints:Number(e),failedCheckPenalty:Number(t),hintPenalty:Number(o),graceMinutes:Number(n),perMinutePenalty:Number(r)};if(!Number.isFinite(i.maxPoints)||i.maxPoints<=0)throw TypeError("@Highscore: Die maximale Punktzahl muss größer als 0 sein.");for(let e of l.slice(1))if(!Number.isFinite(i[e])||i[e]<0)throw TypeError(`@Highscore: ${e} muss eine nichtnegative Zahl sein.`);return i}function a(e,t){return l.every(o=>e[o]===t[o])}function s(e,t){return Math.max(0,Math.floor((t-e)/1e3))}function c(e,t,o){let n=Math.max(0,Math.floor((o-t.startedAt-6e4*e.graceMinutes)/1e3))*e.perMinutePenalty/60;return Math.max(0,e.maxPoints-t.failedChecks*e.failedCheckPenalty-t.hintsUsed*e.hintPenalty-n)}function u(e,t){let o=t>0?e/t:0;return o>=.9?"gold":o>=.75?"silver":o>=.5?"copper":null}function d(e,t="de-DE"){return new Intl.NumberFormat(t,{minimumFractionDigits:0,maximumFractionDigits:1}).format(e)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"7rSfY":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"KEY_COLORS",()=>l),r.export(o,"KEY_COLOR_DETAILS",()=>i),r.export(o,"isKeyColorRequest",()=>u),r.export(o,"createEmptyKeyCounts",()=>d),r.export(o,"requestedKeyColor",()=>h),r.export(o,"deterministicKeyColor",()=>f),r.export(o,"resolveKeyAppearance",()=>p);let l=["red","blue","green","yellow","purple","orange"],i={red:{label:"Rot",inventoryLabel:"Rote Schlüssel",pickupLabel:"Roten Schlüssel",foundMessage:"Roter Schlüssel gefunden."},blue:{label:"Blau",inventoryLabel:"Blaue Schlüssel",pickupLabel:"Blauen Schlüssel",foundMessage:"Blauer Schlüssel gefunden."},green:{label:"Grün",inventoryLabel:"Grüne Schlüssel",pickupLabel:"Grünen Schlüssel",foundMessage:"Grüner Schlüssel gefunden."},yellow:{label:"Gelb",inventoryLabel:"Gelbe Schlüssel",pickupLabel:"Gelben Schlüssel",foundMessage:"Gelber Schlüssel gefunden."},purple:{label:"Lila",inventoryLabel:"Lilafarbene Schlüssel",pickupLabel:"Lilafarbenen Schlüssel",foundMessage:"Lilafarbener Schlüssel gefunden."},orange:{label:"Orange",inventoryLabel:"Orangefarbene Schlüssel",pickupLabel:"Orangefarbenen Schlüssel",foundMessage:"Orangefarbener Schlüssel gefunden."}},a={red:"red",rot:"red",blue:"blue",blau:"blue",green:"green",grün:"green",gruen:"green",yellow:"yellow",gelb:"yellow",purple:"purple",violet:"purple",violett:"purple",lila:"purple",orange:"orange"},s=new Set(["","?","auto","random","zufall","mystery","unbekannt"]);function c(e){return e?.trim().toLowerCase()??""}function u(e){let t=c(e);return s.has(t)||/^@\d+$/.test(t)||void 0!==a[t]}function d(){return{red:0,blue:0,green:0,yellow:0,purple:0,orange:0}}function h(e){let t=c(e);return s.has(t)||/^@\d+$/.test(t)?null:a[t]??null}function f(e){let t=e.trim()||"loot-key",o=0x811c9dc5;for(let e=0;e<t.length;e+=1)o^=t.charCodeAt(e),o=Math.imul(o,0x1000193);return l[(o>>>0)%l.length]}function p(e,t){let o=h(t);return{color:o??f(e),mystery:null===o}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],g3iqo:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"DEFAULT_LIA_COURSE_VERSION",()=>l),r.export(o,"courseVersionFromMetadata",()=>s),r.export(o,"setLiaCourseVersion",()=>c),r.export(o,"liaCourseVersion",()=>u),r.export(o,"liaCourseIdentity",()=>d),r.export(o,"prepareLiaCourseIdentity",()=>h);let l="0.0.1",i=null;function a(e){if("string"!=typeof e)return null;let t=e.trim();return 0===t.length||t.length>128||/[\u0000-\u001f\u007f]/u.test(t)?null:t}function s(e){if(!e||"object"!=typeof e)return null;let t=a(e.version);if(t)return t;for(let t of["course","definition","meta","metadata"]){let o=e[t];if(!o||"object"!=typeof o)continue;let n=a(o.version);if(n)return n}return null}function c(e){i=a(e)??l}function u(){return i??l}function d(){return`${function(){let e=window.LIA,t=e?.defaultCourseURL?.trim();try{let e=new URL(t||window.location.href,window.location.href);return e.hash="",e.href}catch{return t||`${window.location.pathname}${window.location.search}`}}()}::version=${encodeURIComponent(u())}`}async function h(e,t=15e3){if(i)return i;let o=window.LIA,n=o?.onReady,r=null,d=null,f=new Promise(e=>{o&&(r=t=>{let r=s(t);return r&&e(r),n?.call(o,t)},o.onReady=r)}),p=new Promise(t=>{Promise.resolve().then(e).then(e=>{let o=a(e);o&&t(o)}).catch(()=>{})}),m=new Promise(e=>{d=globalThis.setTimeout(()=>e(l),Math.max(0,t))});return c(await Promise.race([f,p,m])),null!==d&&globalThis.clearTimeout(d),o&&r&&o.onReady===r&&(o.onReady=n),u()}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],bTrLW:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"KeyInventoryStore",()=>a);var l=e("./key-colors.ts"),i=e("./storage.ts");class a{collectKey(e,t){let o=e.trim();return!(!o||this.current.collectedKeys.includes(o))&&(this.current.keys[t]+=1,this.current.collectedKeys.push(o),(0,i.saveKeyInventory)(this.current),!0)}isKeyCollected(e){return this.current.collectedKeys.includes(e.trim())}useKeyForLock(e,t){let o=e.trim();return o?this.current.unlockedLocks.includes(o)?"already-unlocked":this.current.keys[t]<=0?"missing-key":(this.current.keys[t]-=1,this.current.unlockedLocks.push(o),(0,i.saveKeyInventory)(this.current),"unlocked"):"invalid-lock-id"}isLockUnlocked(e){return this.current.unlockedLocks.includes(e.trim())}state(){var e;return{...e=this.current,keys:{...e.keys},collectedKeys:[...e.collectedKeys],unlockedLocks:[...e.unlockedLocks]}}constructor(){this.current=(0,i.loadKeyInventory)()??{version:1,keys:(0,l.createEmptyKeyCounts)(),collectedKeys:[],unlockedLocks:[]}}}},{"./key-colors.ts":"7rSfY","./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],kd9xY:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"renderKeyInventory",()=>c),r.export(o,"announceKeyFound",()=>u),r.export(o,"focusKeyInventory",()=>d);var l=e("./key-colors"),i=e("./key-visual"),a=e("./resource-bar");let s="lia-loot-key-inventory";function c(e){let t=l.KEY_COLORS.filter(t=>e[t]>0);if(0===t.length){document.getElementById(s)?.remove(),(0,a.refreshResourceBarVisibility)();return}let o=(function(){let e,t=document.getElementById(s);if(t)return t;let o=document.createElement("div");o.id=s,o.className="loot-key-inventory",o.setAttribute("role","group"),o.setAttribute("aria-label","Schlüsselinventar"),o.tabIndex=-1;let n=document.createElement("ul");return n.className="loot-key-inventory__list",n.setAttribute("role","list"),o.append(n,((e=document.createElement("span")).className="loot-key-inventory__status",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e)),(0,a.installResourceBar)().appendChild(o),o})().querySelector(".loot-key-inventory__list");if(o){for(let n of(o.replaceChildren(),t)){let t=l.KEY_COLOR_DETAILS[n].foundMessage.replace(/\s+gefunden\.$/,"");for(let r=0;r<e[n];r+=1){let l=document.createElement("li");l.className=`loot-key-inventory__item loot-key-color--${n}`,l.dataset.lootKeyColor=n,l.dataset.lootKeyInstance=`${n}-${r+1}`,l.setAttribute("aria-label",1===e[n]?t:`${t}, Exemplar ${r+1} von ${e[n]}`);let a=(0,i.createKeyGraphic)(n);a.classList.add("loot-key-inventory__icon"),l.append(a),o.appendChild(l)}}(0,a.refreshResourceBarVisibility)()}}function u(e){let t=document.querySelector(".loot-key-inventory__status");t&&(t.textContent="",window.setTimeout(()=>{t.textContent=e},0))}function d(){document.getElementById(s)?.focus({preventScroll:!0})}},{"./key-colors":"7rSfY","./key-visual":"iQm7z","./resource-bar":"1KrGH","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],iQm7z:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(e){let t=document.createElementNS("http://www.w3.org/2000/svg","svg");return t.setAttribute("viewBox","0 0 48 32"),t.setAttribute("shape-rendering","crispEdges"),t.setAttribute("aria-hidden","true"),t.classList.add("loot-key-graphic",`loot-key-color--${e}`),t.innerHTML=`
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
  `,t}r.defineInteropFlag(o),r.export(o,"createKeyGraphic",()=>l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1KrGH":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"installResourceBar",()=>c),r.export(o,"refreshResourceBarVisibility",()=>u),r.export(o,"renderResources",()=>d),r.export(o,"showInsufficientResource",()=>h),r.export(o,"announceResource",()=>f);let l="lia-loot-resource-bar",i=["header",".lia-header","[role='banner']"];function a(e,t){let o,n=document.createElement("div");n.className="loot-resource loot-resource--hidden",n.setAttribute("aria-label",`${t}: 0`);let r=document.createElement("span");return r.className="loot-resource-value",r.dataset.lootResource=e,r.textContent="0",n.append(((o=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("viewBox","0 0 32 32"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-resource-icon",`loot-resource-icon--${e}`),o.innerHTML="coins"===e?'<ellipse cx="16" cy="8" rx="10" ry="5"/><path d="M6 8v6c0 2.8 4.5 5 10 5s10-2.2 10-5V8"/><path d="M6 14v6c0 2.8 4.5 5 10 5s10-2.2 10-5v-6"/>':"gems"===e?'<path d="M8 5h16l5 7-13 15L3 12l5-7Z"/><path d="m3 12 8-2 5 17 5-17 8 2M8 5l3 5 5-5 5 5 3-5"/>':'<path d="M19 2 7 18h8l-2 12 12-18h-8l2-10Z"/>',o),r),n}function s(){for(let e of i){let t=document.querySelector(e);if(t&&t.id!==l&&!t.closest(`#${l}`))return t}return null}function c(){let e,t=document.getElementById(l);if(t)return t;let o=document.createElement("aside");o.id=l,o.className="loot-resource-bar loot-resource-bar--empty",o.setAttribute("aria-label","Ressourcen und Inventar"),o.append(a("coins","Goldmünzen"),a("gems","Diamanten"),a("energy","Energie"),((e=document.createElement("span")).className="loot-resource-status",e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e)),document.body.appendChild(o);let n=()=>{let e,t;return t=(e=s())?Math.max(0,e.getBoundingClientRect().bottom):0,void o.style.setProperty("--loot-resource-top",`${Math.round(t)}px`)};n(),window.addEventListener("resize",n,{passive:!0}),window.addEventListener("scroll",n,{passive:!0});let r=s();return r&&"ResizeObserver"in window&&new ResizeObserver(n).observe(r),o}function u(){let e=document.getElementById(l);if(!e)return;let t=[...e.querySelectorAll(".loot-resource")].some(e=>!e.classList.contains("loot-resource--hidden")),o=null!==e.querySelector("[data-loot-key-color]"),n=null!==e.querySelector("[data-loot-magnifier-tool]"),r=null!==e.querySelector("[data-loot-tool-control]");e.classList.toggle("loot-resource-bar--empty",!t&&!o&&!n&&!r)}function d(e,t,o=null){c();let n={coins:e,gems:t,energy:o},r={coins:"Goldmünzen",gems:"Diamanten",energy:"Energie"};for(let e of["coins","gems","energy"]){let t=document.querySelector(`[data-loot-resource="${e}"]`),l=t?.parentElement,i="energy"===e&&null===o;if(l?.classList.toggle("loot-resource--hidden",i),!t||i)continue;let a=n[e],s=Math.max(0,Math.floor("number"==typeof a&&Number.isFinite(a)?a:0));t.textContent=s.toLocaleString("de-DE"),l?.setAttribute("aria-label",`${r[e]}: ${s}`)}u()}function h(e){let t=document.querySelector(`[data-loot-resource="${e}"]`),o=t?.parentElement,n=document.querySelector(".loot-resource-status");o&&n&&(o.classList.remove("loot-resource--insufficient"),o.offsetWidth,o.classList.add("loot-resource--insufficient"),o.addEventListener("animationend",()=>o.classList.remove("loot-resource--insufficient"),{once:!0}),n.textContent="coins"===e?"Nicht genug Gold für einen Hinweis.":"gems"===e?"Nicht genug Diamanten zum Auflösen.":"Keine Energie mehr zum Prüfen oder Starten.")}function f(e){let t=document.querySelector(".loot-resource-status");t&&(t.textContent="",window.setTimeout(()=>{t.textContent=e},0))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],aEHXm:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"surfaceKeyInstanceId",()=>O),r.export(o,"parseKeyPickupOptions",()=>P),r.export(o,"pruneStaleKeySourceMatches",()=>F),r.export(o,"sourceCatalogCoversKeyHost",()=>V),r.export(o,"splitSurfaceKeyPlacements",()=>X),r.export(o,"discardObservedKeyWrites",()=>er),r.export(o,"keyMutationBatchNeedsSync",()=>el),r.export(o,"installKeyPickups",()=>es);var l=e("./key-colors.ts"),i=e("./course-chests.ts"),a=e("./key-visual.ts"),s=e("./collectible-visibility.ts"),c=e("./concealment.ts"),u=e("./exploration-options.ts"),d=e("./exploration.ts"),h=e("./slide-activity.ts"),f=e("./surface-targets.ts");let p="lia-loot-key",m="data-loot-key-placement",g="data-loot-key-tray",v=null,b=0,y=new Set,w=new Set,k=new WeakSet,x=new Set,S=new(0,s.CollectibleVisibilityGate),E=new Map,C=new Map,L=new Set,A=new Map,_=new Map,I="idle",T=null,R=null,j=!1,N=!1,M=!1;function $(e){let t=e.getAttribute("data-key-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootKeyRuntimeId;if(o)return o;b+=1;let n=`runtime-${b}`;return e.dataset.lootKeyRuntimeId=n,n}function O(e,t){return`key:${e}:${t}`}function z(e,t){let o,n=document.createElement("button");return n.type="button",n.className=`loot-key-pickup loot-key-color--${t}`,n.dataset.lootKeyButton=e,n.dataset.lootKeyColor=t,n.setAttribute("aria-label",`${l.KEY_COLOR_DETAILS[t].pickupLabel} einsammeln`),n.append((0,a.createKeyGraphic)(t),((o=document.createElement("span")).className="loot-key-pickup__reward",o.setAttribute("aria-hidden","true"),o.textContent="+1",o)),D(n),n}function q(e){let t=function(e){for(let t of e.composedPath())if(t instanceof HTMLButtonElement&&t.hasAttribute("data-loot-key-button"))return t;return e.target instanceof Element?e.target.closest("[data-loot-key-button]"):null}(e),o=t?.dataset.lootKeyButton,n=t?.dataset.lootKeyColor;if(!t||!o||!n||!(n in l.KEY_COLOR_DETAILS)||!v||y.has(o)||!w.has(o))return;if(y.add(o),!v.collect(o,n)){y.delete(o),eo();return}let r=0===e.detail;t.disabled=!0,t.classList.add("loot-key-pickup--collected"),t.setAttribute("aria-label",l.KEY_COLOR_DETAILS[n].foundMessage),window.setTimeout(()=>{y.delete(o),t.remove(),eo(),r&&v?.focusInventory()},650)}function D(e){k.has(e)||(k.add(e),e.addEventListener("click",q))}function P(e){let t=(0,s.parseCollectibleOptions)("@0"===e.trim()?"":e),o=(0,u.parseExplorationOptions)(t.values),n=(0,c.extractConcealmentOptions)(o.values),r=[...t.errors,...n.errors],i=null,a=null;for(let e of n.values){let t=(0,f.resolveSurfaceTarget)(e);if(t){i?r.push("Für einen Schlüssel darf höchstens ein Oberflächenziel angegeben werden."):i=t;continue}if((0,l.isKeyColorRequest)(e)){null!==a?r.push("Für einen Schlüssel darf höchstens eine Farbe angegeben werden."):a=e;continue}r.push(`Unbekannte Schl\xfcsselfarbe, Zielangabe oder Option: ${e}`)}return{concealment:n.mode,errors:r,inline:null===i,layers:o.layers,placement:i,requestedColor:a,valid:0===r.length,visibility:t.rule}}function H(e){(0,d.clearHostRevealLayers)(e),(0,c.setHostConcealment)(e,null),e.childNodes.length>0&&e.replaceChildren()}function K(e,t){x.has(e)||(x.add(e),console.warn(`Loot: Schl\xfcssel ${e} bleibt wegen ung\xfcltiger Optionen verborgen. ${t.join(" ")}`))}function G(e,t){var o;let n;return`${e}:${n=0===t.layers.length?"none":t.layers.map(e=>`${e.kind}-${e.concealment??"visible"}`).join(","),[(o=t.requestedColor,(0,l.requestedKeyColor)(o)??"auto"),t.placement,(0,s.collectibleVisibilitySignature)(t.visibility),t.concealment??"none",n].join(":")}`}function F(e,t){for(let o of e.keys())t.has(o)||e.delete(o)}function V(e,t,o,n){let r=e.get(t);return null!==o&&n>0&&r===o||(r&&e.delete(t),null!==o&&!(n<=0)&&(function(e,t){let o=0;for(let n of e.values())n===t&&(o+=1);return o}(e,o)<n&&e.set(t,o),!0))}function B(e,t){let o=t.sourceSection,n=null===o?null:G(o,t),r=null===n?0:A.get(n)??0;V(_,e,n,r)?E.delete(e):E.set(e,t)}function W(e){for(let e of L)E.delete(e);for(let t of(L.clear(),A.clear(),_.clear(),e)){let e=P(t.options);if(!e.valid){K(t.baseId,e.errors);continue}if(e.inline||!e.placement)continue;let o={baseId:t.baseId,concealment:e.concealment,layers:[...e.layers],placement:e.placement,requestedColor:e.requestedColor,sourceSection:t.section,visibility:e.visibility};E.set(t.baseId,o),L.add(t.baseId);let n=G(t.section,o);A.set(n,(A.get(n)??0)+1)}for(let[e,t]of(I="complete",C))B(e,t);C.clear(),en()}function U(e){let t=e.classList.contains("loot-key-host--surface-source");e.classList.remove("loot-key-host--surface-source"),t&&((0,c.setHostConcealment)(e,null),e.removeAttribute("aria-hidden"))}function Z(e){let t,o=(t=$(e),{...P(e.getAttribute("data-color")?.trim()??""),baseId:t,sourceHost:e,sourceSection:(0,h.sectionFromLootId)(t)});if(!o.valid)return C.delete(o.baseId),E.delete(o.baseId),_.delete(o.baseId),U(e),K(o.baseId,o.errors),H(e),o;if(o.inline||!o.placement)return C.delete(o.baseId),E.delete(o.baseId),_.delete(o.baseId),U(e),o;let n={baseId:o.baseId,concealment:o.concealment,layers:[...o.layers],placement:o.placement,requestedColor:o.requestedColor,sourceHost:o.sourceHost,sourceSection:o.sourceSection,visibility:o.visibility};return"complete"===I?B(o.baseId,n):C.set(o.baseId,n),(0,d.clearHostRevealLayers)(e),(0,c.setHostConcealment)(e,null),e.classList.add("loot-key-host--surface-source"),e.setAttribute("aria-hidden","true"),e.childNodes.length>0&&e.replaceChildren(),o}function Y(e,t,o){return[...e.querySelectorAll("[data-loot-key-button]")].find(e=>e.dataset.lootKeyButton===t&&e.dataset.lootKeyColor===o)??null}function X(e,t){let o=e.filter(e=>e.dataset.lootKeyPlacement===t);return{duplicates:o.slice(1),primary:o[0]??null}}function Q(){return[...document.querySelectorAll(`[${m}]`)]}function J(e){e?.hasAttribute(g)&&!e.querySelector(`[${m}]`)&&e.remove()}function ee(e){if(!e)return;let t=e.parentElement;e.remove(),J(t)}function et(e){let{duplicates:t,primary:o}=X(Q(),e);ee(o),t.forEach(ee)}function eo(){if(!v)return;w.clear();let e=[...document.querySelectorAll(p)];F(_,new Set(e.map($)));let t=new Map;for(let n of e){var o;if((0,d.hostIsRevealBlocked)(n,!1)){let e=$(n);C.delete(e),E.delete(e),_.delete(e);continue}let e=Z(n);if(!e.valid||!e.inline)continue;let r=(o=e.baseId,`key:${o}:inline`),l=t.get(r)??[];l.push({host:n,request:e}),t.set(r,l)}for(let[e,o]of t){let t=o.find(({host:e,request:t})=>(0,h.sourceSlideIsActive)(t.sourceSection,e))??o[0];for(let e of o)e!==t&&H(e.host);!function(e,t,o){if(!v)return;if(v.collected(t)&&!y.has(t)){w.delete(t),S.forget(`pickup:${t}`),H(e);return}let{color:n}=(0,l.resolveKeyAppearance)(t,o.requestedColor);if(y.has(t))return;if(!S.visible(`pickup:${t}`,o.visibility,(0,h.sourceSlideIsActive)(o.sourceSection,e),en)){w.delete(t),H(e);return}let r=(0,d.setHostRevealLayers)(e,t,o.layers),i=Y(r,t,n);i||((0,c.setHostConcealment)(r,null),r.replaceChildren(z(t,n)),i=Y(r,t,n)),i&&D(i),(0,c.setHostConcealment)(r,o.concealment),(0,d.hostIsRevealBlocked)(e)?w.delete(t):w.add(t)}(t.host,e,t.request)}!function(){if(!v)return;let e=new Set;for(let t of E.values()){let o=O(t.baseId,t.placement),n=y.has(o);if(v.collected(o)&&!n){w.delete(o),S.forget(`pickup:${o}`),et(o);continue}let r=S.visible(`pickup:${o}`,t.visibility,(0,h.sourceSlideIsActive)(t.sourceSection,t.sourceHost),en);if(!r&&!n){w.delete(o),et(o);continue}e.add(o);let i=Q().find(e=>e.dataset.lootKeyPlacement===o)??null;n||(i=function(e,t){let o=(0,f.surfaceTargetElement)(t.placement,document),n=X(Q(),e),r=n.primary;if(n.duplicates.forEach(e=>ee(e)),!o)return ee(r),null;let i=(0,f.surfaceTargetIsGrouped)(t.placement)?function(e,t){let o=e.querySelector(`:scope > [${g}="${t}"]`);if(o)return o;let n=e.matches("ul, ol"),r=document.createElement(n?"li":"div");return r.className="loot-key-tray",r.dataset.lootKeyTray=t,r.setAttribute("role","group"),r.setAttribute("aria-label","Sammelbare Schlüssel"),e.appendChild(r),r}(o,t.placement):o,{color:a}=(0,l.resolveKeyAppearance)(e,t.requestedColor);if(!r){let o=i.matches("ul, ol");(r=document.createElement(o?"li":"div")).className=`loot-key-placement loot-key-placement--${t.placement}`,r.dataset.lootKeyPlacement=e,r.dataset.lootKeyLocation=t.placement,o&&r.setAttribute("role","none")}if(r.parentElement!==i){let e=r.parentElement;i.appendChild(r),J(e)}let s=(0,d.setHostRevealLayers)(r,e,t.layers),u=Y(s,e,a);return u||((0,c.setHostConcealment)(s,null),s.replaceChildren(z(e,a)),u=Y(s,e,a)),u&&D(u),(0,c.setHostConcealment)(s,t.concealment),r}(o,t)),r&&!n&&i&&!(0,d.hostIsRevealBlocked)(i)?w.add(o):w.delete(o),i?.querySelector("[data-loot-key-button]")?.setAttribute("data-loot-key-eligible",String(w.has(o)))}for(let t of Q()){let o=t.dataset.lootKeyPlacement;o&&(e.has(o)||y.has(o))||ee(t)}}(),er(T)}function en(){null===R&&(R=window.setTimeout(()=>{R=null,eo()},0))}function er(e){e?.takeRecords()}function el(e){return e.length>0}function ei(e){el(e)&&en()}class ea extends HTMLElement{static get observedAttributes(){return["data-key-id","data-color"]}connectedCallback(){(0,d.hostIsRevealBlocked)(this,!1)||Z(this),en()}attributeChangedCallback(){this.isConnected&&((0,d.hostIsRevealBlocked)(this,!1)||Z(this),en())}}function es(e){v=e,"idle"===I&&(I="pending",(0,i.discoverCourseKeyDeclarations)().then(W).catch(()=>W([]))),j||(j=!0,(0,h.observeLiaSlideActivity)(en)),N||(N=!0,document.addEventListener(d.REVEAL_CHANGED_EVENT,en)),M||(M=!0,document.addEventListener("click",q,!0)),customElements.get(p)||customElements.define(p,ea),T||(T=new MutationObserver(ei)).observe(document.documentElement,{childList:!0,subtree:!0}),eo()}},{"./key-colors.ts":"7rSfY","./course-chests.ts":"2ceW6","./key-visual.ts":"iQm7z","./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./slide-activity.ts":"5qduG","./surface-targets.ts":"dYwdL","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK","./exploration-options.ts":"fw9xf","./exploration.ts":"5BeJ3"}],"2ceW6":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"DEFAULT_COURSE_VERSION",()=>T),r.export(o,"parseCourseVersion",()=>V),r.export(o,"parseCourseAchievementCatalog",()=>eo),r.export(o,"parseCourseChestDeclarations",()=>en),r.export(o,"parseCourseKeyDeclarations",()=>er),r.export(o,"parseCourseLockDeclarations",()=>el),r.export(o,"parseCourseChestCatalogDeclarations",()=>ei),r.export(o,"parseCourseLockCatalogDeclarations",()=>ea),r.export(o,"parseCourseResourceDeclaration",()=>ec),r.export(o,"parseCourseSecretSlideDeclarations",()=>eu),r.export(o,"parseCourseAchievementsDeclaration",()=>ed),r.export(o,"discoverCourseChestDeclarations",()=>ep),r.export(o,"discoverCourseKeyDeclarations",()=>em),r.export(o,"discoverCourseVersion",()=>eg),r.export(o,"discoverCourseLockDeclarations",()=>ev),r.export(o,"discoverCourseChests",()=>eb),r.export(o,"discoverCourseLocks",()=>ey),r.export(o,"discoverCourseResourceDeclaration",()=>ew),r.export(o,"discoverCourseSecretSlideDeclarations",()=>ek),r.export(o,"discoverCourseAchievementsDeclaration",()=>ex),r.export(o,"discoverCourseAchievementCatalog",()=>eS),r.export(o,"requireCourseSecretSlideDeclarations",()=>eE);var l=e("./collectible-visibility.ts"),i=e("./concealment.ts"),a=e("./exploration-options.ts"),s=e("./key-colors.ts"),c=e("./lock-options.ts"),u=e("./loot-if-options.ts"),d=e("./surface-targets.ts"),h=e("./template-targets.ts");let f=/^\s*@(Schatztruhe|Diamanttruhe|Energiekiste)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/,p=/^\s*@Schluessel(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/,m=/^\s*@Schloss\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*\)\s*$/,g=/^\s*@LootTruhe_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*,\s*(gold|diamonds|energy)\s*\)\s*$/i,v=/^\s*@LootSchloss_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*\)\s*$/,b=/^\s*@(Schatztruhe|Diamanttruhe|Energiekiste|Schluessel|Lupe|Schaufel|Giesskanne)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu,y=/^\s*@LootSchluessel_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu,w=/^\s*@LootLupe_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu,k=/^\s*@LootWerkzeug_\s*\(\s*([^,()\r\n]+)\s*,\s*(shovel|watering-can)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu,x=/^\s*@LootRevealStart_\s*\(\s*([^,()\r\n]+)\s*,\s*(erde|pflanze)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu,S=/^\s*@LootRevealEnd_\s*\(\s*(erde|pflanze)\s*\)\s*$/iu,E=/^\s*@LootVersteckt_\s*\(\s*([^,()\r\n]+)\s*,\s*(solid|dust)\s*,[\s\S]*\)\s*$/iu,C=/^\s*@Ressourcen\s*\(\s*([^,()\r\n]+?)\s*,\s*([^,()\r\n]+?)(?:\s*,\s*([^,()\r\n]+?))?\s*\)\s*$/,L=/^\s*@Geheimfolie\s*$/,A=/^\s*@(achievements|erfolge)\s*$/i,_=/^\+?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[+-]?\d+)?$/i,I=[0,300,1e3],T="0.0.1",R={Schatztruhe:"gold",Diamanttruhe:"diamonds",Energiekiste:"energy"},j=/^\s*@(Erdhaufen|Pflanze|Blume)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu,N=/^\s*@Ende(Erdhaufen|Pflanze|Blume)\s*$/iu,M=/^\s*@lootif\b/iu,$=/^\s*@lootif\s*\(\s*([^()\r\n]*)\s*\)\s*$/iu,O=/^\s*@LootIfStart_\b/u,z=/^\s*@LootIfStart_\s*\(\s*([^,()\r\n]+)\s*,\s*([^()\r\n]*)\s*\)\s*$/u,q=/^\s*@(Endelootif|EndeLootif|endlootif|EndLootIf)\s*$/u,D=/^\s*@LootIfEnd_\s*$/u;function P(e){return"erdhaufen"===e.toLocaleLowerCase("de-DE")?"soil":"plant"}let H=null,K=null;function G(e,t){let o=t.split(";").map(e=>e.trim().toLowerCase()).join(";");return`${e}(${o})`}function F(e){let t=0x811c9dc5;for(let o=0;o<e.length;o+=1)t^=e.charCodeAt(o),t=Math.imul(t,0x1000193);return(t>>>0).toString(36)}function V(e){let t=/^\s*<!--([\s\S]*?)-->/u.exec(e.replace(/^\uFEFF/u,""));return t&&/^\s*version\s*:\s*(.*?)\s*$/imu.exec(t[1])?.[1]?.trim()||T}function B(e){let t=[],o=null,n=!1,r=null,l=-1,i=[],a=[];for(let s of e.split(/\r?\n/)){let e=function(e,t){let o="",n=0,r=t;for(;n<e.length;){if(r){let t=e.indexOf("--\x3e",n);if(t<0)return{visible:o,inComment:!0};n=t+3,r=!1;continue}let t=e.indexOf("\x3c!--",n);if(t<0){o+=e.slice(n);break}o+=e.slice(n,t),n=t+4,r=!0}return{visible:o,inComment:r}}(s,n);if(n=e.inComment,o){(function(e,t){let o=/^ {0,3}(`{3,}|~{3,})\s*$/.exec(e);return null!==o&&o[1][0]===t.marker&&o[1].length>=t.length})(e.visible,o)&&(o=null);continue}let c=function(e){let t=/^ {0,3}(`{3,}|~{3,})/.exec(e);return t?{marker:t[1][0],length:t[1].length}:null}(e.visible);if(c){o=c;continue}if(r){RegExp(`</${r}\\s*>`,"i").test(e.visible)&&(r=null);continue}let d=/<(script|style|pre|code|textarea|template)(?:\s|>)/i.exec(e.visible);if(d){let t=d[1].toLowerCase();RegExp(`</${t}\\s*>`,"i").test(e.visible)||(r=t);continue}if(/^(?: {4}|\t)/.test(e.visible))continue;let h=function(e){let t="",o=0;for(let n=0;n<e.length;){if("`"===e[n]&&"\\"!==e[n-1]){let r=n+1;for(;"`"===e[r];)r+=1;let l=r-n;0===o?o=l:o===l&&(o=0),t+=" ".repeat(l),n=r;continue}t+=0===o?e[n]:" ",n+=1}return t}(e.visible);if(/^ {0,3}#{1,6}(?:\s+|$)/.test(h)&&(l+=1,a=[]),q.test(h)||D.test(h)){let e=a.pop();e&&(e.closed=!0)}let f=N.exec(h);f&&i[i.length-1]===P(f[1])&&i.pop(),t.push({content:h,lootIfCatalogEligible:!0,lootIfDepth:a.length,lootIfFrames:[...a],revealDepth:i.length,section:l});let p=j.exec(h);p&&i.push(P(p[1]));let m=function(e){let t=$.exec(e);if(t)return(0,u.parseLootIfOptions)(t[1]).valid;if(M.test(e))return!1;let o=z.exec(e);return o?(0,u.parseLootIfOptions)(o[2]).valid:!O.test(e)&&null}(h);null!==m&&a.push({closed:!1,valid:m})}return t.map(({lootIfFrames:e,...t})=>({...t,lootIfCatalogEligible:e.every(e=>e.closed&&e.valid)}))}function W(){return{dust:0,plant:0,soil:0,solid:0}}function U(e,t,o=1){e.dust+=t.dust*o,e.plant+=t.plant*o,e.soil+=t.soil*o,e.solid+=t.solid*o}function Z(e){let t=(0,l.parseCollectibleOptions)(e),o=(0,a.parseExplorationOptions)(t.values),n=(0,i.extractConcealmentOptions)(o.values);return{catalog:function(e,t){let o=W();for(let n of(e&&(o[e]+=1),t))o[n.kind]+=1,n.concealment&&(o[n.concealment]+=1);return o}(n.mode,o.layers),valid:0===t.errors.length&&0===n.errors.length,values:n.values}}let Y=/^[+-]?(?:(?:\d+(?:[.,]\d*)?)|(?:[.,]\d+))(?:e[+-]?\d+)?$/iu;function X(e){let t=function(e){let t=e.split(";").map(e=>e.trim()).filter(Boolean),o=!0;if(t[0]&&Y.test(t[0])){let e=t.shift(),n=Number(e);/^\d+$/u.test(e)&&Number.isSafeInteger(n)&&!(n<=0)||(o=!1)}return t.some(e=>Y.test(e))&&(o=!1),{options:t.filter(e=>!Y.test(e)).join("; "),valid:o}}(e),o=Z(t.options);if(!t.valid||!o.valid)return null;let n=new Set;for(let e of o.values){let t=(0,d.resolveSurfaceTarget)(e)??(0,h.resolveTemplateTarget)(e);if(!t)return null;n.add(t)}let r=n.size>0?n.size:1,l=W();return U(l,o.catalog,r),l}function Q(e){let t=Z(e);if(!t.valid)return null;let o=!1,n=!1;for(let e of t.values){if((0,d.resolveSurfaceTarget)(e)){if(n)return null;n=!0;continue}if((0,s.isKeyColorRequest)(e)){if(o)return null;o=!0;continue}return null}return t.catalog}function J(e){let t=Z(e);return t.valid&&0===t.values.length?t.catalog:null}function ee(e,t){let o="soil"===e?"erde":"pflanze",n=Z(t.trim()?o+"; "+t:o),r=n.catalog.soil+n.catalog.plant;return!n.valid||n.values.length>0||1!==r||1!==n.catalog[e]?null:n.catalog}let et={unsichtbar:"solid",zauberstaub:"dust"};function eo(e){let t=W(),o=[],n=()=>o[o.length-1]?.catalog??t;for(let t of B(e)){if(!t.lootIfCatalogEligible)continue;let e=function(e){let t=j.exec(e);if(t){let e=P(t[1]);return{catalog:ee(e,t[2]??""),kind:e}}let o=x.exec(e);if(!o)return null;let n=P(o[2]);return{catalog:ee(n,o[3]),kind:n}}(t.content);if(e){o.push({catalog:W(),marker:e});continue}let r=function(e){let t=N.exec(e);if(t)return P(t[1]);let o=S.exec(e);return o?P(o[1]):null}(t.content);if(r){let e=o[o.length-1];if(e?.marker.kind!==r)continue;o.pop(),e.marker.catalog&&(U(e.catalog,e.marker.catalog),U(n(),e.catalog));continue}let l=function(e){let t=b.exec(e);if(!t)return;let o=t[1].toLocaleLowerCase("de-DE"),n=(t[2]??"").trim();return"schatztruhe"===o||"diamanttruhe"===o||"energiekiste"===o?X(n):"schluessel"===o?Q(n):J(n)}(t.content),i=void 0===l?function(e){let t=g.exec(e);if(t)return X(t[2]);let o=y.exec(e);if(o)return Q(o[2]);let n=w.exec(e);if(n)return J(n[2]);let r=k.exec(e);if(r)return J(r[3])}(t.content):l;i&&U(n(),i);let a=E.exec(t.content);a&&(n()[a[2]]+=1),U(n(),function(e){let t=W(),o=e.toLocaleLowerCase("de-DE");for(let n=0;n<e.length;n+=1)if("@"===e[n]&&"@"!==e[n-1]&&e[n-1]?.charCodeAt(0)!==92)for(let[r,l]of Object.entries(et)){if(o.slice(n+1,n+1+r.length)!==r)continue;let i=n+1+r.length;for(;/\s/u.test(e[i]??"");)i+=1;"("===e[i]&&null!==function(e,t){let o=0;for(let n=t;n<e.length;n+=1){let t=e[n];if(92===t.charCodeAt(0)&&n+1<e.length){n+=1;continue}if("("===t)o+=1;else if(")"===t&&0==(o-=1))return n}return null}(e,i)&&(t[l]+=1);break}return t}(t.content))}return t}function en(e,t=!0){let o=[],n=new Map;for(let r of B(e)){if(!r.lootIfCatalogEligible||!t&&(r.revealDepth>0||r.lootIfDepth>0))continue;let e=f.exec(r.content);if(!e)continue;let l=(e[2]??"").trim(),i=R[e[1]],a=G(e[1],l),s=(n.get(a)??0)+1;n.set(a,s),o.push({baseId:`source-${i}-${F(a)}-${s}`,placement:l,reward:i,section:r.section})}return o}function er(e,t=!0){let o=[],n=new Map,r=new Set;for(let l of B(e)){if(!l.lootIfCatalogEligible||!t&&(l.revealDepth>0||l.lootIfDepth>0))continue;let e=p.exec(l.content);if(!e)continue;let i=(e[1]??"").trim(),a=G("Schluessel",i),s=(n.get(a)??0)+1;n.set(a,s);let c=`source-key-${F(a)}-${s}`,u=c,d=1;for(;r.has(u);)d+=1,u=`${c}-collision-${d}`;r.add(u),o.push({baseId:u,options:i,section:l.section})}return o}function el(e,t=!0){let o=[],n=new Map;for(let r of B(e)){if(!r.lootIfCatalogEligible||!t&&(r.revealDepth>0||r.lootIfDepth>0))continue;let e=m.exec(r.content);if(!e)continue;let l=e[1].trim(),i=(0,c.parseLockOptions)(e[2]);if(!i.valid||!i.color)continue;let a=`Schloss(${l.toLowerCase()},${i.color}${i.onlyOnSlide?",anker":""})`,s=(n.get(a)??0)+1;n.set(a,s),o.push({baseId:`source-lock-${F(a)}-${s}`,target:l,color:i.color,onlyOnSlide:i.onlyOnSlide,section:r.section})}return o}function ei(e){return[...en(e),...function(e){let t=[],o=new Map;for(let n of B(e)){if(!n.lootIfCatalogEligible)continue;let e=g.exec(n.content);if(!e)continue;let r=e[2].trim(),l=e[3].toLowerCase(),i=G(`LootTruhe(${l})`,`${e[1].trim()};${r}`),a=(o.get(i)??0)+1;o.set(i,a),t.push({baseId:`source-internal-${l}-${F(i)}-${a}`,placement:r,reward:l,section:n.section})}return t}(e)]}function ea(e){return[...el(e),...function(e){let t=[],o=new Map;for(let n of B(e)){if(!n.lootIfCatalogEligible)continue;let e=v.exec(n.content);if(!e)continue;let r=e[2].trim(),l=(0,c.parseLockOptions)(e[3]);if(!l.valid||!l.color)continue;let i=`LootSchloss(${e[1].trim()},${r.toLowerCase()},${l.color}${l.onlyOnSlide?",anker":""})`,a=(o.get(i)??0)+1;o.set(i,a),t.push({baseId:`source-internal-lock-${F(i)}-${a}`,target:r,color:l.color,onlyOnSlide:l.onlyOnSlide,section:n.section})}return t}(e)]}function es(e){let t=e.trim();if(!_.test(t))return null;let o=Number(t);return Number.isFinite(o)&&o>=0?o:null}function ec(e){for(let t of B(e)){if(!t.lootIfCatalogEligible||t.lootIfDepth>0)continue;let e=C.exec(t.content);if(!e)continue;let o=es(e[1]),n=es(e[2]),r=void 0===e[3]?void 0:es(e[3]);if(null!==o&&null!==n&&null!==r)return{gold:o,diamonds:n,...void 0===r?{}:{energy:r},section:t.section}}return null}function eu(e){let t=[],o=new Set;for(let n of B(e))!(!n.lootIfCatalogEligible||n.lootIfDepth>0||n.section<0||o.has(n.section))&&L.test(n.content)&&(o.add(n.section),t.push({section:n.section}));return t}function ed(e){return B(e).some(e=>e.lootIfCatalogEligible&&0===e.lootIfDepth&&A.test(e.content))}async function eh(){let e=function(){let e=window.LIA,t=e?.defaultCourseURL?.trim();if(t)try{let e=new URL(t,window.location.href);if(/^(?:https?:|blob:|data:)$/i.test(e.protocol))return e.href}catch{}return function(e){let t=e.trim();if(!t)return null;let o=[t];try{let e=decodeURIComponent(t);e!==t&&o.push(e)}catch{}return o.find(e=>/^(?:https?:|blob:|data:)/i.test(e))??null}(window.location.search.slice(1))}();if(!e)return null;let t=window.LIA,o=t?.fetch??window.fetch.bind(window),n=new AbortController,r=window.setTimeout(()=>n.abort(),4e3);try{let t=await o(e,{cache:"default",credentials:"same-origin",signal:n.signal});if(!t.ok)return null;let r=await t.text();return r.length<=0xa00000?r:null}catch{return null}finally{window.clearTimeout(r)}}async function ef(){if(null!==H)return H;if(K)return K;K=(async()=>{for(let e of I){e>0&&await new Promise(t=>window.setTimeout(t,e));let t=await eh();if(null!==t)return H=t,t}return null})();try{return await K}finally{K=null}}async function ep(){let e=await ef();return e?en(e,!1):[]}async function em(){let e=await ef();return e?er(e,!1):[]}async function eg(){let e=await ef();return e?V(e):null}async function ev(){let e=await ef();return e?el(e,!1):[]}async function eb(){let e=await ef();return e?{declarations:en(e,!1),catalog:ei(e)}:{declarations:[],catalog:[]}}async function ey(){let e=await ef();return e?{declarations:el(e,!1),catalog:ea(e)}:{declarations:[],catalog:[]}}async function ew(){let e=await ef();return e?ec(e):null}async function ek(){let e=await ef();return e?eu(e):[]}async function ex(){let e=await ef();return!!e&&ed(e)}async function eS(){let e=await ef();return e?eo(e):W()}async function eE(){let e=await ef();if(null===e)throw Error("Die LiaScript-Kursquelle konnte nicht geladen werden.");return eu(e)}},{"./lock-options.ts":"3c981","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK","./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./exploration-options.ts":"fw9xf","./key-colors.ts":"7rSfY","./surface-targets.ts":"dYwdL","./template-targets.ts":"9odGA","./loot-if-options.ts":"6qN0r"}],"3c981":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"parseLockOptions",()=>a);var l=e("./collectible-visibility.ts"),i=e("./key-colors.ts");function a(e){let t=[],o=[],n=!1;for(let o of e.split(";")){let e=o.trim();e&&((0,l.isOnlyOnSlideOption)(e)?n=!0:t.push(e))}1!==t.length&&o.push("Ein Schloss benötigt genau eine Schlüsselfarbe.");let r=1===t.length?(0,i.requestedKeyColor)(t[0]):null;return 1!==t.length||r||o.push(`Unbekannte Schl\xfcsselfarbe oder Schlossoption: ${t[0]}`),{color:r,errors:o,onlyOnSlide:n,valid:0===o.length&&null!==r}}},{"./collectible-visibility.ts":"8e3cc","./key-colors.ts":"7rSfY","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8e3cc":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"MAX_COLLECTIBLE_DELAY_MS",()=>i),r.export(o,"COLLECTIBLE_THEMES",()=>a),r.export(o,"COLLECTIBLE_VARIANTS",()=>s),r.export(o,"isOnlyOnSlideOption",()=>_),r.export(o,"parseCollectibleOptions",()=>I),r.export(o,"collectibleRuleUsesEnvironment",()=>j),r.export(o,"collectibleEnvironmentMatches",()=>N),r.export(o,"currentCollectibleEnvironment",()=>z),r.export(o,"collectibleVisibilitySignature",()=>H),r.export(o,"advanceCollectibleReveal",()=>K),r.export(o,"CollectibleVisibilityGate",()=>G);var l=e("./template-targets.ts");let i=0x7fffffff,a=["red","yellow","turquoise","blue"],s=["dark","light"],c=new Set(["anker","nur auf folie","nur-auf-folie","folie","only on slide","only-on-slide","slide only","slide-only"]),u=new Set(["dark mode","dark-mode","darkmode","dunkelmodus"]),d=new Set(["hellmodus","light mode","light-mode","lightmode"]),h=new Set(["annotation-aus","annotation-hidden","annotations-aus","annotations-hidden","ohne annotation","ohne annotationen","ohne-annotation","ohne-annotationen","without annotations","without-annotations"]),f=/^(?:farbtheme|theme)[\s:=_-]+(.+)$/u,p=/^(?:farbmodus|variant)[\s:=_-]+(.+)$/u,m=/^(?:annotation|annotationen)[\s:=_-]+(.+)$/u,g={blau:"blue",blue:"blue",default:"turquoise",gelb:"yellow",red:"red",rot:"red",standard:"turquoise",tuerkis:"turquoise",turkis:"turquoise",turquoise:"turquoise",türkis:"turquoise",yellow:"yellow"},v={dark:"dark",dunkel:"dark",hell:"light",light:"light"},b=new Set(["aus","false","hidden","off","versteckt"]),y=/^(?:(?:erst\s+)?nach\s+|nach\s*=\s*)?(\d+(?:[.,]\d+)?)\s*(s|sek|sekunde|sekunden|m|min|minute|minuten)$/u,w=/^(?:ank\p{L}*|nur(?:\s+|-)|only(?:\s+|-)|slide(?:\s+|-)?only|(?:erst\s+)?nach(?:\s|=|$)|\d+(?:[.,]\d+)?\s*\p{L}|(?:farbtheme|theme|farbmodus|variant|annotationen?)(?:\s|:|=|_|-)|dark\p{L}*|light\p{L}*|dunkel\p{L}*|hell\p{L}*|ohne(?:\s+|-)annotation|annotations?(?:\s+|-)aus|without(?:\s+|-)annotations?)|(?:\bfoli\p{L}*\b|\bslides?\b|\bsek\p{L}*\b|\bmin(?:ute|uten)?\b)/u,k={annotationsVisible:!1,theme:"turquoise",variant:"light"},x=new Set,S=new Map,E=null,C=null,L=!1;function A(e){return e.normalize("NFKC").replace(/\s+/gu," ").trim().toLocaleLowerCase("de-DE")}function _(e){return c.has(A(e))}function I(e){let t=[],o=[],n=0,r=!1,l=!1,k=!1,x=!1,S=new Set,E=new Set;for(let a of e.split(";")){let e=a.trim();if(!e)continue;let s=A(e);if(c.has(s)){k=!0,l=!0;continue}let C=function(e){let t=f.exec(e);return t?{matched:!0,theme:g[t[1].trim()]??null}:{matched:!1,theme:null}}(s);if(C.matched){l=!0,C.theme?S.add(C.theme):o.push(`Unbekanntes Theme: ${e}`);continue}let L=function(e){let t=p.exec(e);return t?{matched:!0,variant:v[t[1].trim()]??null}:{matched:!1,variant:null}}(s);if(L.matched){l=!0,L.variant?E.add(L.variant):o.push(`Unbekannter Farbmodus: ${e}`);continue}let _=function(e){let t=m.exec(e);return t?{matched:!0,annotationsOff:b.has(t[1].trim())}:{matched:!1,annotationsOff:!1}}(s);if(_.matched){l=!0,_.annotationsOff?x=!0:o.push(`Unbekannte Annotationsbedingung: ${e}`);continue}if(u.has(s)){E.add("dark"),l=!0;continue}if(d.has(s)){E.add("light"),l=!0;continue}if(h.has(s)){x=!0,l=!0;continue}let I=function(e){let t=y.exec(e);if(!t)return{matched:!1,value:null};let o=Number(t[1].replace(",","."))*(["s","sek","sekunde","sekunden"].includes(t[2])?1e3:6e4);return{matched:!0,value:Number.isFinite(o)&&o>=0&&o<=i?o:null}}(s);if(I.matched){l=!0,null===I.value?o.push(`Ung\xfcltige Verz\xf6gerung: ${e}`):r?o.push("Die Verzögerung darf nur einmal angegeben werden."):(n=I.value,r=!0);continue}if(w.test(s)){l=!0,o.push(`Unbekannte Sichtbarkeitsoption: ${e}`);continue}t.push(e)}return{errors:o,hasOptions:l,rule:{delayMs:n,onlyOnSlide:k,onlyWithoutAnnotations:x,themes:a.filter(e=>S.has(e)),variants:s.filter(e=>E.has(e))},valid:0===o.length,values:t}}function T(e){return a.filter(t=>e.themes?.includes(t))}function R(e){return s.filter(t=>e.variants?.includes(t))}function j(e){return T(e).length>0||R(e).length>0||!0===e.onlyWithoutAnnotations}function N(e,t){let o=T(e),n=R(e);return(0===o.length||null!==t.theme&&o.includes(t.theme))&&(0===n.length||null!==t.variant&&n.includes(t.variant))&&(!e.onlyWithoutAnnotations||!t.annotationsVisible)}function M(e){try{return(0,l.templateDocumentCandidates)(e)}catch{return[e]}}function $(e){if("string"!=typeof e)return;let t=A(e);return["default","standard","tuerkis","turkis","turquoise","türkis"].includes(t)?"turquoise":a.includes(t)?t:null}function O(e){let t=function(e){try{let t=e.defaultView,o=t?.__LIA_ANNOTATION__?.getStore?.()?.ui?.visible;return"boolean"==typeof o?o:void 0}catch{return}}(e),o=function(e){try{let t=[...e.querySelectorAll(".lia-annot-toolbar")];if(0===t.length)return;let o=!1;for(let e of t){let t=e.querySelector("button[data-act='toggle']");if(!t)return!0;let n=(0,l.annotationToggleIsHidden)(t),r="true"===t.getAttribute("aria-pressed")||"1"===t.getAttribute("data-active");if(n&&r||r||!n)return!0;o=!0}return!o&&void 0}catch{return}}(e);if(void 0!==t&&void 0!==o)return t!==o||t;if(void 0!==t)return t;if(void 0!==o)return o;try{let t=e.defaultView;return t?.__LIA_ANNOTATION__!=null}catch{return!1}}function z(e){let t=e??("u"<typeof document?void 0:document);if(!t)return{...k};let o=M(t),n=null;for(let e of o)if(n=function(e){let t,o,n=e.documentElement;if(!n)return null;let r=function(e){try{let t=e.defaultView,o=t?.LIA?.settings;if(!o)return{theme:void 0,variant:void 0};let n=$(o.theme??o.data?.theme),r=o.light??o.data?.light;return{theme:n,variant:"boolean"==typeof r?r?"light":"dark":void 0}}catch{return{theme:void 0,variant:void 0}}}(e),l=function(e){let t=[...e.classList].filter(e=>e.startsWith("lia-theme-"));if(0!==t.length)return t.length>1?null:$(t[0].slice(10))}(n),i=(t=n.classList.contains("lia-variant-dark"),o=n.classList.contains("lia-variant-light"),t&&o?null:t?"dark":o?"light":void 0),a=void 0===l?r.theme:l,s=void 0===i?r.variant:i;return void 0===a||void 0===s?null:{theme:a,variant:s}}(e))break;return{annotationsVisible:o.some(O),theme:n?n.theme:k.theme,variant:n?n.variant:k.variant}}function q(e){return`${e.theme??"other"}:${e.variant??"other"}:${+!!e.annotationsVisible}`}function D(e){return e&&"object"==typeof e&&"function"==typeof e.matches?e:null}function P(e){let t=D(e);return!!t&&(!!t.matches(".lia-annot-toolbar, button[data-act='toggle']")||!!t.querySelector?.(".lia-annot-toolbar, .lia-annot-toolbar button[data-act='toggle']"))}function H(e){return`${+!!e.onlyOnSlide}:${e.delayMs}:${T(e).join(",")||"-"}:${R(e).join(",")||"-"}:${+!!e.onlyWithoutAnnotations}`}function K(e,t,o,n){let r=H(e),l=t?.signature===r?t:null,i=!e.onlyOnSlide||n;if(!l&&i&&(l={signature:r,startedAt:Number.isFinite(o)?o:0}),!l)return{state:null,visible:!1,wakeAt:null};let a=l.startedAt+e.delayMs,s=o>=a;return{state:l,visible:s&&(!e.onlyOnSlide||n),wakeAt:s?null:a}}class G{constructor(e=()=>Date.now(),t=(e,t)=>window.setTimeout(e,t),o=e=>window.clearTimeout(e),n=z){this.states=new Map,this.wakes=new Map,this.environmentCallbacks=new Map,this.stopObservingEnvironment=null,this.now=e,this.schedule=t,this.cancel=o,this.environment=n}visible(e,t,o,n){this.trackEnvironment(e,t,n);let r=this.now(),l=K(t,this.states.get(e)??null,r,o);return l.state?this.states.set(e,l.state):this.states.delete(e),this.syncWake(e,l.wakeAt,r,n),l.visible&&(!j(t)||N(t,this.environment()))}forget(e){this.states.delete(e);let t=this.wakes.get(e);t&&this.cancel(t.handle),this.wakes.delete(e),this.environmentCallbacks.delete(e),this.stopEnvironmentObserverWhenUnused()}trackEnvironment(e,t,o){var n;if(!j(t)){this.environmentCallbacks.delete(e),this.stopEnvironmentObserverWhenUnused();return}this.environmentCallbacks.set(e,o),this.stopObservingEnvironment??=(n=()=>{for(let e of new Set(this.environmentCallbacks.values()))e()},"u"<typeof document?()=>void 0:(x.add(n),function e(t){for(let o of M(t)){if(S.has(o)||!o.documentElement)continue;let t=o.defaultView?.MutationObserver;if(!t)continue;let n=[],r=t=>{t.some(e=>{var t,n;return t=o,"attributes"===(n=e).type?"class"===n.attributeName&&n.target===t.documentElement||!!["aria-pressed","data-active"].includes(n.attributeName??"")&&!!D(n.target)?.matches(".lia-annot-toolbar button[data-act='toggle']"):"childList"===n.type&&[...n.addedNodes,...n.removedNodes].some(P)})&&(L||(L=!0,queueMicrotask(()=>{L=!1;let t=E;if(!t)return;e(t);let o=q(z(t));if(o!==C)for(let e of(C=o,[...x]))e()})))};try{let e=new t(r);e.observe(o.documentElement,{attributeFilter:["class"],attributes:!0}),n.push(e);let l=new t(r);l.observe(o.documentElement,{attributeFilter:["aria-pressed","data-active"],attributes:!0,childList:!0,subtree:!0}),n.push(l),S.set(o,n)}catch{for(let e of n)e.disconnect()}}}(E??=document),C??=q(z(E)),()=>{if(x.delete(n),!(x.size>0)){for(let e of S.values())for(let t of e)t.disconnect();S.clear(),E=null,C=null}}))}stopEnvironmentObserverWhenUnused(){!(this.environmentCallbacks.size>0)&&this.stopObservingEnvironment&&(this.stopObservingEnvironment(),this.stopObservingEnvironment=null)}syncWake(e,t,o,n){let r=this.wakes.get(e);if(r&&r.at===t||(r&&this.cancel(r.handle),this.wakes.delete(e),null===t))return;let l=this.schedule(()=>{let t=this.wakes.get(e);t&&t.handle===l&&(this.wakes.delete(e),n())},Math.max(0,t-o));this.wakes.set(e,{at:t,handle:l})}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK","./template-targets.ts":"9odGA"}],"9odGA":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"TEMPLATE_TARGETS",()=>l),r.export(o,"normalizeTemplateTarget",()=>a),r.export(o,"templateDocumentCandidates",()=>s),r.export(o,"annotationToggleIsHidden",()=>c),r.export(o,"TEMPLATE_TARGET_DEFINITIONS",()=>w),r.export(o,"TEMPLATE_TARGET_LABELS",()=>k),r.export(o,"resolveTemplateTarget",()=>C),r.export(o,"isTemplateTarget",()=>L),r.export(o,"templateTargetDefinition",()=>A),r.export(o,"templateTargetPresent",()=>_),r.export(o,"templateElementIsVisible",()=>I),r.export(o,"findTemplateTargets",()=>T),r.export(o,"findTemplateTarget",()=>R);let l=["dynflex","timer","boardmode","marker","markerquiz","annotation","canvasocr","kachel","mathpath","llm","coordinate","freeze"];function i(e){return e.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[\s_-]+/g,"")}function a(e){return i(e)}function s(e){let t=[],o=e=>{!e||"object"!=typeof e||"function"!=typeof e.querySelectorAll||t.includes(e)||t.push(e)};for(let t of(o(e),v(e)))try{o(t.document)}catch{}return t}function c(e){return e?.getAttribute("aria-pressed")==="false"||e?.getAttribute("data-active")==="0"}function u(e,t){let o=[];for(let n of s(e))try{for(let e of n.querySelectorAll(t))o.includes(e)||o.push(e)}catch{}return o}function d(e,t){return{target:e,root:t,chestAnchor:t,lockAnchor:t,lockControls:[t],focusCandidates:[t]}}function h(e,t,o,n=t){return{target:e,root:t,chestAnchor:n,lockAnchor:o,lockControls:o?[o]:[],focusCandidates:o?[o,t]:[t]}}function f(e,t,o,n,r=t){return{target:e,root:t,chestAnchor:r,lockAnchor:o,lockControls:n,focusCandidates:[...n,t]}}function p(e,t){return{target:e,root:t,chestAnchor:t,lockAnchor:null,lockControls:[],focusCandidates:[t]}}function m(e){let t=new Set;return e.filter(e=>!t.has(e.root)&&(t.add(e.root),!0))}function g(e){let t=e.closest(".lia-quiz");if(t)return t;let o=e.closest("main.lia-slide__content");if(!o)return null;let n=e;for(;n.parentElement&&n.parentElement!==o;)n=n.parentElement;if(n.parentElement!==o)return null;let r=n.previousElementSibling;for(;r;){if(r.matches(".lia-quiz"))return r;let e=r.querySelectorAll(".lia-quiz");if(e.length>0)return e[e.length-1];r=r.previousElementSibling}return null}function v(e){let t=[],o=e=>{e&&"object"==typeof e&&(t.includes(e)||t.push(e))},n=e.defaultView;o(n);try{o(n?.parent)}catch{}try{o(n?.top)}catch{}return"u">typeof window&&o(window),t}function b(e,t){let o=e;for(let e of t.split(".")){if(!o||"object"!=typeof o&&"function"!=typeof o)return;try{o=o[e]}catch{return}}return o}let y=[{id:"dynflex",aliases:["lia-dynflex","flex","flexbereich"],importName:"lia-DynFlex",label:"DynFlex-Bereich",presenceGlobals:["__LIA_DYNFLEX_V1_0__"],runtimeSelector:"[data-dynflex-doc]",scope:"slide",locate:e=>u(e,".dynFlex").map(e=>d("dynflex",e))},{id:"timer",aliases:["lia-timer","quiztimer","zeit"],importName:"lia-timer",label:"Quiz-Timer",presenceGlobals:["__LIA_SOLUTION_TIMER_V0_0_1__"],runtimeSelector:"#__lia_solution_timer_css_v0_0_1__, .lia-sol-timer-badge[data-sol-timer-ui]",scope:"slide",locate:e=>{let t=u(e,"[data-solution-timer], [data-hint-timer]"),o=u(e,".lia-sol-timer-startbtn[data-sol-timer-ui='solution'], .lia-sol-timer-startbtn[data-sol-timer-ui='hint']"),n=t.map(e=>f("timer",e,null,[])),r=new Map;for(let e of o){let t=(e.matches(".lia-quiz")?e:e.closest(".lia-quiz"))??e.parentElement??e,o=r.get(t)??[];o.push(e),r.set(t,o)}for(let[e,t]of r){let o=f("timer",e,t[0]??null,t,t[0]??e);o.chestAvailable=!1,n.push(o)}return n}},{id:"boardmode",aliases:["lia-board-mode","board-modus","schriftgroesse","boardmodefontbutton","fontbutton"],importName:"lia-board-mode",label:"Board-Mode-Schriftsteuerung",presenceGlobals:["__LIA_TFF_REG_V2__"],runtimeSelector:"#lia-tff-btn-v2",scope:"global",locate:e=>{let t=u(e,"#lia-tff-panel-v2");return u(e,"#lia-tff-btn-v2").map(e=>{let o=t.find(t=>t.ownerDocument===e.ownerDocument),n=h("boardmode",e.parentElement??e,e,e);return n.chestAvailable=void 0!==o,o&&(n.chestContainer=o),n})}},{id:"marker",aliases:["lia-marker","textmarker","highlighter","textmarkerbutton","markerbutton"],importName:"lia-marker",label:"Textmarker-Werkzeug",presenceGlobals:["__LIA_TEXTMARKER_REG_V4__"],runtimeSelector:"#lia-hl-btn",scope:"global",locate:e=>{let t=u(e,"#lia-hl-panel > .body");return u(e,"#lia-hl-btn").map(e=>{let o=t.find(t=>t.ownerDocument===e.ownerDocument),n=h("marker",e.parentElement??e,e,e);return n.chestAvailable=void 0!==o,o&&(n.chestContainer=o),n})}},{id:"markerquiz",aliases:["textmarkerquiz","marker-quiz","highlightquiz"],importName:"lia-marker",label:"Textmarker-Quiz",presenceGlobals:["__LIA_TEXTMARKER_REG_V4__"],runtimeSelector:".hlq-proxy",scope:"slide",locate:e=>m(u(e,".hlq-proxy").map(e=>e.closest(".markerquiz")??e).map(e=>d("markerquiz",e)))},{id:"annotation",aliases:["lia-annotation","annotieren","zeichenleiste","annotationsbar","annotationbar"],importName:"lia-annotation",label:"Anmerkungs-Werkzeugleiste",presenceGlobals:["__LIA_ANNOTATION__"],runtimeSelector:".lia-annot-toolbar",scope:"global",locate:e=>u(e,".lia-annot-toolbar").map(e=>{let t=e.querySelector("button[data-act='toggle']");return{target:"annotation",root:e,chestAnchor:e,chestAvailable:c(t),chestPosition:"below",lockAnchor:e,lockControls:[e],focusCandidates:t?[t,e]:[e]}})},{id:"canvasocr",aliases:["lia-canvas-ocr","canvas-ocr","zeichenflaeche"],importName:"lia-canvas-ocr",label:"Canvas-/OCR-Zeichenfläche",presenceGlobals:["__LIA_CANVAS_OCR__"],runtimeSelector:".lia-canvas-pair",scope:"slide",locate:e=>u(e,".lia-canvas-pair").map(e=>{let t=e.querySelector(".lia-canvas-mount"),o=t?.querySelector("canvas.lia-draw")??null,n=e.querySelector(".lia-canvas-launch");return{target:"canvasocr",root:e,chestAnchor:o??t??e,chestAvailable:t?.getAttribute("data-open")==="1"&&null!==o,lockAnchor:e,lockControls:[e],focusCandidates:n?[n,e]:[e]}})},{id:"kachel",aliases:["lia-kachel","kachelfolge","tiles"],importName:"lia-kachel",label:"Kachelaufgabe",presenceGlobals:["LiaKachel.kachelfolge"],runtimeSelector:"[data-lia-kachelfolge]",scope:"slide",locate:e=>u(e,"[data-lia-kachelfolge], div.Kachel").filter(e=>e.hasAttribute("data-lia-kachelfolge")||!e.querySelector("[data-lia-kachelfolge]")).map(e=>d("kachel",e))},{id:"mathpath",aliases:["lia-mathpath","erklaerpfad","explain"],importName:"lia-mathpath",label:"MathPath-Erklärquiz",presenceGlobals:["__LIA_MATHPATH__"],runtimeSelector:".lia-quiz[data-lia-explain-enabled='1'], .lia-quiz[data-hint-button='1'][data-adetail-tags], .lia-mathpath-explain-list",scope:"slide",locate:e=>m(u(e,".lia-quiz[data-lia-explain-enabled='1'], .lia-quiz[data-hint-button='1'][data-adetail-tags], .lia-mathpath-explain-list").map(e=>e.matches(".lia-quiz")?e:e.closest(".lia-quiz")??e).map(e=>{let t=[...e.querySelectorAll("a.lia-mathpath-explain-link[data-lia-explain-href]")].filter(I);return f("mathpath",e,t[0]??null,t)}))},{id:"llm",aliases:["lia-llm","llmquiz","kiquiz"],importName:"lia-llm",label:"LLM-Quiz",presenceGlobals:["LiaLLM.version"],runtimeSelector:"lia-llm-quiz-use, lia-llm-feedback[id^='lia-llm-feedback-']",scope:"slide",locate:e=>m(u(e,"lia-llm-quiz-use, lia-llm-feedback[id^='lia-llm-feedback-']").map(g).filter(e=>null!==e).map(e=>d("llm",e)))},{id:"coordinate",aliases:["lia-coordinate","koordinaten","koordinatensystem"],importName:"lia-coordinate",label:"Koordinatensystem",presenceGlobals:["__coord"],scope:"slide",locate:e=>(function(e){let t=s(e),o=[];for(let n of v(e)){let e=b(n,"__boards");if(e&&"object"==typeof e)for(let n of Object.values(e)){if(!n||"object"!=typeof n)continue;let e=n.containerObj;e&&"object"==typeof e&&(1!==e.nodeType||"function"!=typeof e.matches||!e.matches(".jxgbox")||!t.includes(e.ownerDocument)||o.includes(e)||o.push(e))}}return o})(e).map(e=>d("coordinate",e))},{id:"freeze",aliases:["lia-freeze-v2","abgabe","submission"],importName:"lia-freeze-v2",label:"Freeze-Abgabe",presenceGlobals:[],runtimeSelector:"#lia-submission-runtime-style",scope:"slide",locate:e=>m(u(e,".lia-submit-box, #lia-exam-overlay > .lia-exam-intro-virtual-slide, .lia-adetails-points, #lia-freeze-bar, #lia-eval-placeholder").map(e=>{if(e.matches("#lia-eval-placeholder"))return p("freeze",e);let t=[...e.querySelectorAll("button, input, textarea, select, a[href], [tabindex]")];return 0===t.length?p("freeze",e):f("freeze",e,e,[...new Set(t)])}))}],w=y,k=Object.fromEntries(y.map(e=>[e.id,e.label])),x=new Map(y.map(e=>[e.id,e])),S=new Set(l),E=new Map;for(let e of y)for(let t of[e.id,...e.aliases]){let o=i(t),n=E.get(o);if(n&&n!==e.id)throw Error(`Loot: Template-Zielalias ${t} kollidiert zwischen ${n} und ${e.id}.`);E.set(o,e.id)}function C(e){return e?E.get(i(e))??null:null}function L(e){return S.has(e)}function A(e){return x.get(e)}function _(e,t=document){let o=A(e),n=o.presenceGlobals.length>0||void 0!==o.customElement;for(let e of v(t))if(o.presenceGlobals.some(t=>void 0!==b(e,t))||o.customElement&&function(e,t){try{return!!e.customElements?.get(t)}catch{return!1}}(e,o.customElement))return!0;return!n&&!!o.runtimeSelector&&u(t,o.runtimeSelector).length>0}function I(e){if(!1===e.isConnected||e.hasAttribute?.("hidden")||e.getAttribute?.("aria-hidden")==="true"||e.closest?.("[hidden], [aria-hidden='true']"))return!1;let t=e.ownerDocument?.defaultView;if(t?.getComputedStyle)try{let o=e;for(;o;){let e=t.getComputedStyle(o);if("none"===e.display||"hidden"===e.visibility||"collapse"===e.visibility||0===Number(e.opacity))return!1;o=o.parentElement}}catch{}if("function"==typeof e.getClientRects)try{return e.getClientRects().length>0}catch{return!1}return!0}function T(e,t,o=document){if(!_(e,o))return[];let n=A(e).locate(o),r=[];for(let e of n)if(I(e.root)){if("chest"===t){if(!1===e.chestAvailable)continue;I(e.chestAnchor)&&r.push(e);continue}e.lockAnchor&&e.lockControls.length>0&&I(e.lockAnchor)&&r.push(e)}return r}function R(e,t,o=document){return T(e,t,o)[0]??null}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8YWP0":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"CONCEALMENT_ATTRIBUTE",()=>l),r.export(o,"CONCEALMENT_SELECTOR",()=>i),r.export(o,"CONCEALMENT_CHANGED_EVENT",()=>a),r.export(o,"extractConcealmentOptions",()=>d),r.export(o,"concealmentModeOf",()=>h),r.export(o,"concealmentIdOf",()=>p),r.export(o,"concealedContentOf",()=>m),r.export(o,"prepareConcealedHost",()=>g),r.export(o,"notifyConcealmentLayoutChanged",()=>v),r.export(o,"setHostConcealment",()=>b);let l="data-loot-concealment",i=`[${l}]`,a="lia-loot:concealment-changed",s=[["data-loot-chest-button","chest"],["data-loot-key-button","key"],["data-loot-magnifier-button","magnifier"],["data-loot-tool-pickup","tool"]],c={dust:"dust",solid:"solid",unsichtbar:"solid",verdeckt:"solid",zauberstaub:"dust"};function u(e){return e.trim().toLocaleLowerCase("de-DE")}function d(e){let t=[],o=[],n=null;for(let r of e){let e=c[u(r)];if(!e){o.push(r);continue}if(n){t.push(n===e?`Die Verbergungsoption \u{201E}${r}\u{201C} wurde doppelt angegeben.`:"„unsichtbar“ und „zauberstaub“ können nicht gleichzeitig verwendet werden.");continue}n=e}return{errors:t,mode:n,values:o}}function h(e){let t=u(e.getAttribute(l)??"");return"solid"===t||"dust"===t?t:null}function f(e){let t=e?.trim()??"";return t&&!t.startsWith("@")?t:null}function p(e){let t=f(e.getAttribute("data-loot-concealment-id"));if(t)return t;let o=f(e.getAttribute("data-secret-id"));if(o)return`secret:${o}`;let n=f(e.getAttribute("data-loot-reveal-cover-slot"));if(n)return`reveal:${n}`;for(let[t,o]of s){let n=e.querySelector(`[${t}]`),r=f(n?.getAttribute(t)??null);if(r)return`${o}:${r}`}return null}function m(e){return[...e.children].find(e=>e.classList.contains("loot-magnifier-secret__content"))??null}function g(e){let t=h(e);if(!t)return null;let o=m(e);return o||((o=document.createElement("span")).className="loot-magnifier-secret__content",e.appendChild(o)),[...e.childNodes].filter(e=>e!==o).forEach(e=>o.appendChild(e)),e.classList.add("loot-magnifier-secret"),e.classList.toggle("loot-magnifier-secret--solid","solid"===t),e.classList.toggle("loot-magnifier-secret--dust","dust"===t),e.dataset.lootConcealmentReady="true",t}function v(e){e.dispatchEvent(new CustomEvent(a,{bubbles:!0}))}function b(e,t){let o=h(e);if(!t){let t=m(e);t&&t.replaceWith(...t.childNodes),e.removeAttribute(l),delete e.dataset.lootConcealmentReady,e.classList.remove("loot-magnifier-secret","loot-magnifier-secret--solid","loot-magnifier-secret--dust","loot-magnifier-secret--under-lens"),e.style.removeProperty("--loot-magnifier-x"),e.style.removeProperty("--loot-magnifier-y"),e.removeAttribute("aria-hidden"),e.inert=!1,o&&v(e);return}e.setAttribute(l,t),g(e),o!==t&&(e.classList.remove("loot-magnifier-secret--under-lens"),e.setAttribute("aria-hidden","true"),e.inert=!0,v(e))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],fw9xf:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"TOOL_KINDS",()=>l),r.export(o,"REVEAL_KINDS",()=>i),r.export(o,"parseExplorationOptions",()=>c);let l=["shovel","watering-can"],i=["soil","plant"],a={erde:"soil",erdhaufen:"soil",soil:"soil",dirt:"soil",pflanze:"plant",blume:"plant",plant:"plant",flower:"plant"},s={dust:"dust",solid:"solid",unsichtbar:"solid",verdeckt:"solid",zauberstaub:"dust"};function c(e){let t=[],o=[];for(let n of("string"==typeof e?[e]:e).flatMap(e=>e.split(";"))){let e=n.trim();if(!e)continue;let r=e.normalize("NFKC").trim().toLocaleLowerCase("de-DE"),l=r.lastIndexOf("-");if(l>0){let e=a[r.slice(0,l)],o=s[r.slice(l+1)];if(e&&o){t.push({kind:e,concealment:o});continue}}let i=a[r];if(i){t.push({kind:i,concealment:null});continue}o.push(e)}return{layers:t,values:o}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],dYwdL:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"SURFACE_TARGETS",()=>l),r.export(o,"resolveSurfaceTarget",()=>u),r.export(o,"isSurfaceTarget",()=>d),r.export(o,"surfaceTargetElement",()=>h),r.export(o,"surfaceTargetIsGrouped",()=>f);let l=["toc","menu","classroom","info","translator","mode"],i=[{aliases:[],grouped:!1,id:"toc",selector:"#lia-toc .lia-toc__content"},{aliases:[],grouped:!0,id:"menu",selector:"#lia-support-menu .lia-support-menu__item--settings .lia-support-menu__submenu"},{aliases:[],grouped:!0,id:"classroom",selector:"#lia-support-menu .lia-support-menu__item--share .lia-support-menu__submenu"},{aliases:[],grouped:!0,id:"info",selector:"#lia-support-menu .lia-support-menu__item--info .lia-support-menu__submenu"},{aliases:["translate","translation","lang","übersetzer","uebersetzer"],grouped:!0,id:"translator",selector:"#lia-support-menu .lia-support-menu__item--lang .lia-support-menu__submenu"},{aliases:["display","view","darstellung"],grouped:!0,id:"mode",selector:"#lia-support-menu .lia-support-menu__item--mode .lia-support-menu__submenu"}],a=new Map(i.map(e=>[e.id,e])),s=new Map;function c(e){return e.trim().toLocaleLowerCase("de-DE")}for(let e of i)for(let t of[e.id,...e.aliases])s.set(c(t),e.id);function u(e){return e?s.get(c(e))??null:null}function d(e){return a.has(e)}function h(e,t=document){return t.querySelector(a.get(e).selector)}function f(e){return a.get(e).grouped}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"6qN0r":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"LOOT_IF_ACTIONS",()=>i),r.export(o,"MARKER_COLORS",()=>a),r.export(o,"normalizeHighlightedWord",()=>c),r.export(o,"parseLootIfCondition",()=>p),r.export(o,"compareLootIfNumbers",()=>m),r.export(o,"parseLootIfOptions",()=>g);var l=e("./lock-targets.ts");let i=["spawn"],a=["yellow","green","blue","pink","orange","red"];function s(e){return e.trim().toLocaleLowerCase("de-DE").normalize("NFD").replace(/[\u0300-\u036f]/gu,"").replace(/ß/gu,"ss").replace(/[‐‑‒–—−_]+/gu,"-").replace(/\s+/gu," ")}function c(e){return e.trim().toLocaleLowerCase("de-DE").normalize("NFKC").replace(/\s+/gu," ")}function u(e){return s(e).replace(/[\s-]+/gu,"-")}function d(e,t=!1){let o=e.trim().replace(",",".");if(!/^\d+(?:\.\d+)?$/u.test(o))return null;let n=Number(o);return!Number.isFinite(n)||n<0||n>Number.MAX_SAFE_INTEGER||t&&!Number.isInteger(n)?null:n}function h(e){let t=u(e);return["schatztruhe","schatztruhen","goldkiste","goldkisten"].includes(t)?"gold":["diamantkiste","diamantkisten","diamantenkiste","diamantenkisten","diamanttruhe","diamanttruhen","diamond-chest","diamond-chests"].includes(t)?"diamonds":["energiekiste","energiekisten","energy-chest","energy-chests"].includes(t)?"energy":["treasure-chest","treasure-chests"].includes(t)?"gold":null}function f(e){return({yellow:"yellow",gelb:"yellow",green:"green",grun:"green",gruen:"green",blue:"blue",blau:"blue",pink:"pink",rosa:"pink",orange:"orange",red:"red",rot:"red"})[u(e)]??null}function p(e){let t,o=u(e);if(["vorherige-aufgabe","vorherige-aufgabe-gelost","vorherige-aufgabe-geloest","previous-task","previous-task-solved","previous-quiz","previous-quiz-solved"].includes(o))return{kind:"previous-quiz"};if(["folienaufgaben-gelost","folienaufgaben-geloest","aktuelle-folie-gelost","aktuelle-folie-geloest","alle-aufgaben-der-aktuellen-folie-gelost","alle-aufgaben-der-aktuellen-folie-geloest","slide-tasks-solved","slide-quizzes-solved"].includes(o))return{kind:"current-slide-quizzes"};if(["geheimfolie-besucht","geheime-folie-besucht"].includes(o)||"secret-slide-visited"===o)return{kind:"secret-slide-visited"};if(["lupe-gefunden","lupe-eingesammelt"].includes(o)||"magnifier-found"===o)return{kind:"magnifier-found"};let n=function(e){let t=/^\s*(?:markiert|marked)\s*(?:=|:)\s*([^:]+?)\s*$/iu.exec(e)??/^\s*(?:ein\s+)?wort\s+(?:wurde\s+)?mit\s+(?:der\s+farbe\s+)?([^\s]+)\s+markiert\s*$/iu.exec(e);if(t){let e=f(t[1]);if(e)return{kind:"word-highlighted",color:e,word:null}}let o=/^\s*(?:markiert|marked)\s*:\s*([^:]+?)\s*:\s*(.+?)\s*$/iu.exec(e);if(o){let e=f(o[1]),t=o[2].trim();if(e&&t)return{kind:"word-highlighted",color:e,word:t}}let n=/^\s*wort\s+(?:"([^"]+)"|„([^“]+)“|'([^']+)'|(.+?))\s+mit\s+(?:der\s+farbe\s+)?([^\s]+)\s+markiert\s*$/iu.exec(e);if(!n)return null;let r=f(n[5]),l=(n[1]??n[2]??n[3]??n[4]??"").trim();return r&&l?{kind:"word-highlighted",color:r,word:l}:null}(e);if(n)return n;let r=/^mindestens\s+(\d+)\s+(?:bewertbare\s+)?aufgaben\s+(?:gelost|geloest)$/u.exec(s(e));if(r){let e=d(r[1],!0);return null===e?null:{kind:"solved-quizzes",comparator:">=",value:e}}let i=/^(\d+)\s+(.+?)\s+(?:geoffnet|geoeffnet|eingesammelt)$/u.exec(s(e));if(i){let e=h(i[2]),t=d(i[1],!0);if(e&&null!==t)return{kind:"opened-chests",reward:e,comparator:">=",value:t}}let a=/^(?:schloss|lock)\s*:\s*(.+?)\s*$/iu.exec(e)??/^\s*schloss\s+(.+?)\s+(?:geoffnet|geoeffnet|entsperrt)\s*$/iu.exec(s(e));if(a){let e=(0,l.resolveLockTarget)(a[1]);if(e)return{kind:"lock-opened",target:e}}let c=function(e){let t,o=s(e),n=/^(.*?)\s*(>=|=>|<=|=<|==|=|>|<|mindestens|hochstens|grosser(?:\s+oder\s+gleich)?|kleiner(?:\s+oder\s+gleich)?|gleich)\s*(\d+(?:[.,]\d+)?)$/u.exec(o);if(!n)return null;let r=">"===(t=s(n[2]))||"grosser"===t?">":">="===t||"=>"===t||"mindestens"===t||"grosser oder gleich"===t?">=":"="===t||"=="===t||"gleich"===t?"=":"<="===t||"=<"===t||"hochstens"===t||"kleiner oder gleich"===t?"<=":"<"===t||"kleiner"===t?"<":null;return r?{comparator:r,label:n[1].trim(),value:n[3]}:null}(e);if(!c)return null;let p=d(c.value);if(null===p)return null;if(["aufgaben","bewertbare-aufgaben","geloste-aufgaben","geloeste-aufgaben","tasks","quizzes","scoreable-tasks"].includes(u(c.label)))return Number.isInteger(p)?{kind:"solved-quizzes",comparator:c.comparator,value:p}:null;let m=["gold","munzen","goldmunzen","coins"].includes(t=u(c.label))?"gold":["diamant","diamanten","diamonds","gems"].includes(t)?"diamonds":["energie","energy"].includes(t)?"energy":null;if(m)return{kind:"resource",resource:m,comparator:c.comparator,value:p};let g=h(c.label);return g&&Number.isInteger(p)?{kind:"opened-chests",reward:g,comparator:c.comparator,value:p}:null}function m(e,t,o){return!!Number.isFinite(e)&&!!Number.isFinite(o)&&(">"===t?e>o:">="===t?e>=o:"="===t?e===o:"<="===t?e<=o:e<o)}function g(e){let t=(e??"").split(";").map(e=>e.trim()),o=[];(2!==t.length||t.some(e=>0===e.length||/^@\d+$/u.test(e)))&&o.push("Erwartet wird @lootif(Trigger; spawn).");let n=t[0]?p(t[0]):null;n||o.push("Der lootif-Trigger ist unbekannt oder ungültig.");let r="spawn"===s(t[1]??"")?"spawn":null;return r||o.push('Als Aktion wird derzeit nur "spawn" unterstützt.'),{action:r,condition:n,errors:o,valid:0===o.length&&2===t.length}}},{"./lock-targets.ts":"1CWW8","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1CWW8":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"GLOBAL_LOCK_TARGETS",()=>i),r.export(o,"LOCAL_LOCK_TARGETS",()=>a),r.export(o,"ITEM_LOCK_TARGETS",()=>s),r.export(o,"TEMPLATE_LOCK_TARGETS",()=>c),r.export(o,"resolveLockTarget",()=>p),r.export(o,"isGlobalLockTarget",()=>m),r.export(o,"isLocalLockTarget",()=>g),r.export(o,"isItemLockTarget",()=>v),r.export(o,"isTemplateLockTarget",()=>b);var l=e("./template-targets.ts");let i=["toc","mode","menu","translator","classroom","info","seitenwechsel"],a=["check","resolve","hint"],s=["portal"],c=l.TEMPLATE_TARGETS,u={toc:"toc",inhaltsverzeichnis:"toc",mode:"mode",darstellung:"mode",ansicht:"mode",menu:"menu",menue:"menu",einstellungen:"menu",settings:"menu",translator:"translator",translate:"translator",ubersetzer:"translator",uebersetzer:"translator",sprache:"translator",classroom:"classroom",klasse:"classroom",teilen:"classroom",share:"classroom",info:"info",information:"info",informationen:"info",seitenwechsel:"seitenwechsel",seitennavigation:"seitenwechsel",navigation:"seitenwechsel",pages:"seitenwechsel",page:"seitenwechsel",check:"check",prufen:"check",pruefen:"check",resolve:"resolve",auflosen:"resolve",aufloesen:"resolve",losung:"resolve",loesung:"resolve",solution:"resolve",hint:"hint",hinweis:"hint",portal:"portal",folienportal:"portal",slideportal:"portal"},d=new Set(i),h=new Set(a),f=new Set(s);function p(e){return e?u[e.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[\s_-]+/g,"")]??(0,l.resolveTemplateTarget)(e)??null:null}function m(e){return d.has(e)}function g(e){return h.has(e)}function v(e){return f.has(e)}function b(e){return(0,l.isTemplateTarget)(e)}},{"./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5qduG":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"activeLiaSection",()=>m),r.export(o,"sectionFromLootId",()=>g),r.export(o,"sourceSlideIsActive",()=>v),r.export(o,"setLiaSlideAccessGuard",()=>y),r.export(o,"refreshLiaSlideActivity",()=>w),r.export(o,"observeLiaSlideActivity",()=>E);let l=".lia-slide__container",i=".lia-slide__container > main.lia-slide__content:not([hidden])",a=new Set,s=()=>!0,c=null,u=null,d=null,h=null,f=!1;function p(e){let t=/^#(\d+)$/.exec(e);if(!t)return null;let o=Number(t[1])-1;return Number.isInteger(o)&&o>=0?o:null}function m(){let e=document.querySelector(i),t=e?.parentElement;if(e&&t){let o=[...t.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(e);if(o>=0)return o}let o=document.querySelector("#lia-toc #focusedToc.lia-toc__link");if(o){let e=function(e){try{return p(new URL(e.href,window.location.href).hash)}catch{return p(e.getAttribute("href")??"")}}(o);if(null!==e)return e}return p(window.location.hash)}function g(e){let t=/(?:^|:)(\d+)_\d+(?::|$)/.exec(e);if(!t)return null;let o=Number(t[1]);return Number.isInteger(o)&&o>=0?o:null}function v(e,t){let o=m();if(!s(o??e))return!1;if(null!==e&&null!==o)return e===o;let n=t?.closest("main");return!!(n&&!n.hidden&&n.classList.contains("lia-slide__content"))}function b(){for(let e of a)e()}function y(e){s=e,b()}function w(){b()}function k(e){for(let t of(u?.disconnect(),u=new MutationObserver(t=>{t.some(t=>t.target instanceof HTMLElement&&"MAIN"===t.target.tagName&&t.target.parentElement===e)&&b()}),e.children))t instanceof HTMLElement&&"MAIN"===t.tagName&&u.observe(t,{attributeFilter:["class","hidden"],attributes:!0})}function x(){let e,t=(e=document.querySelector(i),e?.parentElement?.classList.contains(l.slice(1))?e.parentElement:[...document.querySelectorAll(l)].find(e=>[...e.children].some(e=>e instanceof HTMLElement&&"MAIN"===e.tagName))??null);t===c||(u?.disconnect(),d?.disconnect(),c=t,t&&(k(t),(d=new MutationObserver(()=>{k(t),b()})).observe(t,{childList:!0}),b()))}function S(e){return e instanceof Element&&(e.matches(l)||null!==e.querySelector(l)||null!==c&&e.contains(c))}function E(e){return a.add(e),h||(h=new MutationObserver(e=>{(null===c||!1===c.isConnected||e.some(e=>[...e.addedNodes,...e.removedNodes].some(S)))&&x()})).observe(document.documentElement,{childList:!0,subtree:!0}),f||(f=!0,window.addEventListener("hashchange",b),window.addEventListener("pageshow",b),window.addEventListener("popstate",b)),x(),e(),()=>{a.delete(e)}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5BeJ3":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"REVEAL_CHANGED_EVENT",()=>C),r.export(o,"EXPLORATION_CHANGED_EVENT",()=>L),r.export(o,"revealLayerSignature",()=>Y),r.export(o,"setHostRevealLayers",()=>ef),r.export(o,"clearHostRevealLayers",()=>ep),r.export(o,"hostIsRevealBlocked",()=>em),r.export(o,"installExploration",()=>eO);var l=e("./collectible-visibility.ts"),i=e("./concealment.ts"),a=e("./exploration-options.ts"),s=e("./exploration-visual.ts"),c=e("./range-gate.ts"),u=e("./resource-bar.ts"),d=e("./slide-activity.ts"),h=e("./template-targets.ts");let f="lia-loot-tool",p="lia-loot-reveal",m="lia-loot-reveal-start",g="lia-loot-reveal-end",v='a[href^="#lia-loot-reveal-end-"]',b="data-loot-reveal-range-controller",y="data-loot-reveal-range-configuring",w="data-loot-reveal-range-blocked",k="data-loot-managed-reveal-root",x="data-loot-reveal-stack-signature",S="data-loot-reveal-final-content",E="data-loot-active-tool",C="lia-loot:reveal-changed",L="lia-loot:exploration-changed",A={shovel:{collectLabel:"Schaufel einsammeln",collectedMessage:"Schaufel gefunden.",label:"Schaufel",slug:"shovel"},"watering-can":{collectLabel:"Gießkanne einsammeln",collectedMessage:"Gießkanne gefunden.",label:"Gießkanne",slug:"watering-can"}},_=null,I=0,T=!1,R=!1,j=!1,N=null,M=[],$=new Set,O=new Set,z=new Set,q=new WeakSet,D=new Set,P=new Set,H=new Map,K=new(0,l.CollectibleVisibilityGate),G=new(0,l.CollectibleVisibilityGate),F=new WeakMap;function V(e){return a.TOOL_KINDS.includes(e)}function B(e){return e.split(";").map(e=>e.trim()).filter(e=>e&&!/^@\d+$/u.test(e)).join("; ")}function W(e,t,o,n){let r=e.getAttribute(t)?.trim();if(r&&!r.startsWith("@"))return r;let l=e.dataset[o];if(l)return l;I+=1;let i=`${n}:runtime-${I}`;return e.dataset[o]=i,i}function U(e,t,o){let n=`${t}:${e}`;P.has(n)||(P.add(n),console.warn(`Loot: ${t} ${e} bleibt wegen ung\xfcltiger Optionen verborgen. ${o.join(" ")}`))}function Z(e){return`${e.kind}:${e.concealment??"visible"}`}function Y(e){return e.map(Z).join(">")}function X(e){return[...e.children].find(e=>e.hasAttribute(k))??null}function Q(e){let t=e;for(;t.parentElement;){let e=t.parentElement,o="DIV"===e.tagName&&0===e.attributes.length;if("P"!==e.tagName&&"SPAN"!==e.tagName&&"LIA-KEEP"!==e.tagName&&!o||[...e.childNodes].some(e=>e!==t&&e.nodeType!==Node.COMMENT_NODE&&(e.nodeType!==Node.TEXT_NODE||!!e.textContent?.trim())))break;t=e}return t}function J(e){let t=Q(e.start),o=e.end?Q(e.end):null;if(!t.isConnected||null!==o&&!o.isConnected||!e.scope.isConnected)return[];let n=e.scope.ownerDocument.createRange();try{n.setStartAfter(t),o?n.setEndBefore(o):n.setEnd(e.scope,e.scope.childNodes.length)}catch{return[]}let r=[],l=e=>{for(let t of[...e.children]){if(!n.intersectsNode(t))continue;let e=!1;try{e=0===n.comparePoint(t,0)&&0===n.comparePoint(t,t.childNodes.length)}catch{e=!1}e?r.push(t):l(t)}};return l(e.scope),r}function ee(e,t){(0,c.setRangeGate)(e,"reveal",w,t)}function et(){j||(j=!0,queueMicrotask(()=>{j=!1,function(){let e=new Map;document.querySelectorAll(`${m}, ${g}, ${v}`).forEach(t=>{let o=t.closest("[data-loot-reveal-payload], [data-loot-reveal-layer-content], main.lia-slide__content, main")??document.body,n=e.get(o)??[];n.push(t),e.set(o,n)});let t=[];for(let[o,n]of e){let e=[],r=[];for(let t of n){if(t.matches(m)){e.push(t);continue}let o=e[e.length-1];if(!o)continue;let n=o.getAttribute("data-reveal-kind")?.trim(),l=t.getAttribute("data-reveal-kind")?.trim()||(t.matches(v)?t.getAttribute("href")?.slice("#lia-loot-reveal-end-".length).trim():void 0);n&&l&&n!==l||(e.pop(),r.push({end:t,start:o}))}r.forEach(({end:e,start:n})=>{let r=function(e,t){if(!e.isConnected||!t.isConnected)return null;let o=[...e.children].find(e=>e.matches(p)&&e.hasAttribute(b));return o||(o=e.ownerDocument.createElement(p)).setAttribute(b,"true"),o.setAttribute(y,"true"),o.setAttribute("data-reveal-id",e.getAttribute("data-reveal-id")??""),o.setAttribute("data-options",e.getAttribute("data-options")??""),o.removeAttribute(y),o.isConnected||e.appendChild(o),o}(n,e);r&&t.push({controller:r,end:e,scope:o,start:n})}),e.forEach(e=>{t.push({controller:null,end:null,scope:o,start:e})})}let o=new Set;t.forEach(e=>{e.controller&&o.add(e.controller)}),document.querySelectorAll(`${p}[${b}]`).forEach(e=>{o.has(e)||e.remove()}),M=t}(),eI(),document.dispatchEvent(new CustomEvent(C))}))}function eo(e){if(e.nodeType!==Node.ELEMENT_NODE)return!1;let t=`${m}, ${g}, ${v}`;return e.matches(t)||null!==e.querySelector(t)}function en(e){if("attributes"===e.type)return!!e.target.matches(`${m}, ${g}, ${v}`)||"href"===e.attributeName&&!!e.oldValue?.startsWith("#lia-loot-reveal-end-");if([...e.addedNodes,...e.removedNodes].some(eo))return!0;if(e.target.nodeType!==Node.ELEMENT_NODE)return!1;let t=e.target;return!t.closest(`${p}[${b}]`)&&M.some(e=>{let o=[e.start,e.end].filter(e=>null!==e);return t===e.scope||o.some(e=>t===e||t.contains(e)||e.contains(t))})}function er(e){return[...e.children].find(e=>e.hasAttribute("data-loot-reveal-layer-content")||e.hasAttribute("data-loot-reveal-payload"))}function el(e){return(function(e){let t=e,o=null;for(;t;){if(!(o=er(t)))return null;t=[...o.children].find(e=>e.hasAttribute("data-loot-reveal-kind"))}return o})(e)?.querySelector(`:scope > [${S}]`)??null}function ei(e,t,o){return`${e}:reveal:${o}:${Z(t)}`}function ea(e,t){return"soil"===e?"Erdhaufen mit Schaufel wegbuddeln":"bloomed"===t?"Blühende Pflanze öffnen":"Pflanze mit Gießkanne gießen"}function es(e,t,o){let n=o.createElement("button");return n.type="button",n.className=`loot-reveal-cover loot-reveal-cover--${t}`,n.dataset.lootRevealCover=e,n.dataset.lootRevealCoverPhase="locked",n.setAttribute("aria-label",ea(t,"locked")),n.append((0,s.createRevealCoverGraphic)(t,"seedling",o)),n.addEventListener("click",ev),n}function ec(e){(0,u.installResourceBar)(),(0,u.announceResource)(e)}function eu(e){let t,o=e.dataset.lootRevealKind;if("soil"!==o&&"plant"!==o)return!1;let n=function(e){if(!_)return"locked";let t=e.dataset.lootRevealId??"",o=e.dataset.lootRevealKind,n=H.get(t);return"soil"===o?_.isLayerDug(t)&&"digging"!==n?"revealed":"locked":"plant"!==o?"locked":_.isPlantOpened(t)&&"opening"!==n?"revealed":_.isPlantWatered(t)&&"watering"!==n?"bloomed":"locked"}(e),r=e.dataset.lootRevealState,l=[...e.children].find(e=>e.hasAttribute("data-loot-reveal-cover-slot")),a=er(e);if(!l||!a)return!1;let c=l.querySelector(":scope [data-loot-reveal-cover]");c&&(t="bloomed"===n?"bloomed":"locked",c.setAttribute("aria-label",ea(o,n)),c.dataset.lootRevealCoverPhase!==t&&(c.dataset.lootRevealCoverPhase=t,c.replaceChildren((0,s.createRevealCoverGraphic)(o,"bloomed"===t?"bloomed":"seedling",c.ownerDocument))));let u="revealed"===n;a.hidden=!u,a.inert=!u,a.setAttribute("aria-hidden",String(!u)),l.hidden=u,l.inert=u,e.dataset.lootRevealState=n,e.classList.toggle("loot-reveal-layer--bloomed","bloomed"===n),e.classList.toggle("loot-reveal-layer--revealed",u);let d=e.dataset.lootRevealConcealment;return(0,i.setHostConcealment)(l,u||!d?null:d),r!==n}function ed(e){(0,i.notifyConcealmentLayoutChanged)(e),e.dispatchEvent(new CustomEvent(C,{bubbles:!0}))}function eh(e){let t=X(e);if(!t)return void delete e.dataset.lootRevealBlocked;let o=[],n=t;for(;n;){o.push(n);let e=er(n);n=e?[...e.children].find(e=>e.hasAttribute("data-loot-reveal-kind"))??null:null}let r=!1,l=!1;o.forEach(e=>{r=eu(e)||r,l="revealed"!==e.dataset.lootRevealState||l});let i=e.dataset.lootRevealBlocked;e.dataset.lootRevealBlocked=String(l),(r||i!==String(l))&&ed(e)}function ef(e,t,o){let n,r=Y(o),l=X(e);if(l&&e.getAttribute(x)===r)return eh(e),el(l)??e;if(!l&&0===o.length)return e;if(l){let e=el(l);e?((0,i.setHostConcealment)(e,null),n=[...e.childNodes]):n=[]}else(0,i.setHostConcealment)(e,null),n=[...e.childNodes];if(e.replaceChildren(),e.removeAttribute(x),delete e.dataset.lootRevealBlocked,0===o.length)return e.append(...n),ed(e),e;let a=null,s=null;for(let[n,r]of o.entries()){let o=function(e,t,o,n){let r=ei(e,t,o),l=n.createElement("div");l.className=`loot-reveal-layer loot-reveal-layer--${t.kind}`,l.dataset.lootRevealId=r,l.dataset.lootRevealKind=t.kind,l.dataset.lootRevealState="locked",l.dataset.lootRevealConcealment=t.concealment??"";let a=n.createElement("div");a.className="loot-reveal-layer__cover",a.dataset.lootRevealCoverSlot=r,a.append(es(r,t.kind,n));let s=n.createElement("div");return s.className="loot-reveal-layer__content",s.dataset.lootRevealLayerContent=r,s.hidden=!0,s.inert=!0,s.setAttribute("aria-hidden","true"),l.append(a,s),(0,i.setHostConcealment)(a,t.concealment),{content:s,layer:l}}(t,r,n,e.ownerDocument);a?s?.appendChild(o.layer):(a=o.layer).setAttribute(k,"true"),s=o.content}if(!a||!s)return e;let c=e.ownerDocument.createElement("div");return c.className="loot-reveal-layer__final-content",c.setAttribute(S,"true"),c.append(...n),s.appendChild(c),e.appendChild(a),e.setAttribute(x,r),eh(e),c}function ep(e){let t=X(e),o=null!==t||e.hasAttribute(x)||e.hasAttribute("data-loot-reveal-blocked");if(t){let o=el(t),n=o?[...o.childNodes]:[];o&&(0,i.setHostConcealment)(o,null),e.replaceChildren(...n)}(0,i.setHostConcealment)(e,null),e.removeAttribute(x),delete e.dataset.lootRevealBlocked,o&&ed(e)}function em(e,t=!0){t&&eh(e);let o=t&&e.matches(p)&&"revealed"!==e.dataset.lootRevealState;return t&&"true"===e.dataset.lootRevealBlocked||o||null!==e.closest(`[${w}]`)||null!==e.closest("[data-loot-if-range-blocked]")||!eA(e)}function eg(e,t,o){window.setTimeout(()=>{let n,r,l,i,a;H.delete(t),e.classList.remove("loot-reveal-layer--digging","loot-reveal-layer--opening","loot-reveal-layer--watering"),eT(),eE(),o&&"revealed"===e.dataset.lootRevealState&&(n=er(e),r="button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",l=n?[...n.querySelectorAll(r)]:[],(i=M.find(t=>t.controller===e))&&J(i).forEach(e=>{e.matches(r)&&l.push(e),l.push(...e.querySelectorAll(r))}),(a=l.find(e=>null===e.closest(`[hidden], [inert], [aria-hidden="true"], [${w}]`)&&e.getClientRects().length>0))?a.focus({preventScroll:!0}):(e.tabIndex=-1,e.focus({preventScroll:!0})))},520*!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)}function ev(e){let t=e.currentTarget;if(!(t instanceof HTMLButtonElement)||!_)return;let o=t.closest("[data-loot-reveal-kind]"),n=o?.dataset.lootRevealId,r=o?.dataset.lootRevealKind;if(!o||!n||H.has(n)||!eA(o))return;let l=0===e.detail;if("soil"===r)return"shovel"!==_.activeTool()?void ec("Aktiviere zuerst die Schaufel, um den Erdhaufen wegzubuddeln."):void(_.digLayer(n)&&(H.set(n,"digging"),o.classList.add("loot-reveal-layer--digging"),ec("Der Erdhaufen wird weggebuddelt."),eg(o,n,l)));if("plant"===r){if(!_.isPlantWatered(n))return"watering-can"!==_.activeTool()?void ec("Aktiviere zuerst die Gießkanne, um die Pflanze zu gießen."):void(_.waterPlant(n)&&(H.set(n,"watering"),o.classList.add("loot-reveal-layer--watering"),ec("Die Pflanze wächst und beginnt zu blühen."),eg(o,n,l)));_.openPlant(n)&&(H.set(n,"opening"),o.classList.add("loot-reveal-layer--opening"),ec("Die Blüte gibt den verborgenen Inhalt frei."),eg(o,n,l))}}function eb(e){let t=e.getAttribute("data-tool")?.trim();return V(t)?t:null}function ey(e,t){return`tool:${t}:${W(e,"data-tool-id","lootToolRuntimeId",`tool:${t}`)}:inline`}function ew(e){let t=function(e){for(let t of e.composedPath())if(t instanceof HTMLButtonElement&&t.hasAttribute("data-loot-tool-pickup"))return t;return e.target instanceof Element?e.target.closest("[data-loot-tool-pickup]"):null}(e),o=t?.dataset.lootToolPickup,n=t?.dataset.lootToolKind;if(!t||!o||!V(n)||!_||$.has(o)||!O.has(o))return;if($.add(o),!_.collectTool(n)){$.delete(o),eE();return}let r=0===e.detail;t.disabled=!0,t.classList.add("loot-exploration-pickup--collected"),t.setAttribute("aria-label",`${A[n].label} gefunden`),eL(),ec(`${A[n].collectedMessage} Du kannst sie jetzt in der Leiste aktivieren.`),eE(),window.setTimeout(()=>{var e;$.delete(o),eE(),r&&(e=n,document.getElementById(eC(e))?.focus({preventScroll:!0}))},650)}function ek(e){q.has(e)||(q.add(e),e.addEventListener("click",ew))}function ex(e){ep(e),e.childNodes.length>0&&e.replaceChildren(),e.hidden=!1}function eS(e){var t,o,n;let r,c,u,h,f,p,m;if(!_)return;let g=eb(e);if(!g)return void ex(e);let v=ey(e,g);if(_.isToolCollected(g)&&!$.has(v)){O.delete(v),G.forget(`tool:${v}`),ex(e);return}let b=(r=B(e.getAttribute("data-options")?.trim()??""),c=(0,l.parseCollectibleOptions)(r),u=(0,a.parseExplorationOptions)(c.values),h=(0,i.extractConcealmentOptions)(u.values),f=[...c.errors,...h.errors],h.values.length>0&&f.push(`Unbekannte Werkzeugoption: ${h.values.join("; ")}`),{concealment:h.mode,errors:f,layers:u.layers,sourceSection:(0,d.sectionFromLootId)(v),valid:0===f.length,visibility:c.rule});if(!b.valid){O.delete(v),U(v,A[g].label,b.errors),ex(e);return}if(em(e,!1)){O.delete(v),e.hidden=!0;return}let y=G.visible(`tool:${v}`,b.visibility,(0,d.sourceSlideIsActive)(b.sourceSection,e),eE);if(e.hidden=!y,!y)return void O.delete(v);let w=ef(e,v,b.layers),k=w.querySelector(`[data-loot-tool-pickup="${v}"]`);k?(0,i.setHostConcealment)(w,b.concealment):((0,i.setHostConcealment)(w,null),w.replaceChildren((t=v,o=g,(m=(n=e.ownerDocument).createElement("button")).type="button",m.className=`loot-exploration-pickup loot-exploration-pickup--${o}`,m.dataset.lootToolPickup=t,m.dataset.lootToolKind=o,m.setAttribute("aria-label",A[o].collectLabel),m.append((0,s.createExplorationToolGraphic)(o,n),((p=n.createElement("span")).className="loot-exploration-pickup__reward",p.setAttribute("aria-hidden","true"),p.textContent="GEFUNDEN",p)),ek(m),m)),(0,i.setHostConcealment)(w,b.concealment),k=w.querySelector("[data-loot-tool-pickup]")),k&&ek(k);let x=em(e);x||$.has(v)?O.delete(v):O.add(v),k?.toggleAttribute("data-loot-reveal-blocked",x)}function eE(){O.clear(),document.querySelectorAll(f).forEach(eS)}function eC(e){return`lia-loot-${A[e].slug}-tool`}function eL(){let e=_?.activeTool()??null,t=new Set((0,h.templateDocumentCandidates)(document));for(let o of z)e&&t.has(o)||(o.documentElement?.removeAttribute(E),z.delete(o));if(e)for(let o of t){let t=o.documentElement;t&&(t.setAttribute(E,e),z.add(o))}if(!_)return;let o=(0,u.installResourceBar)();for(let t of a.TOOL_KINDS){let n=document.getElementById(eC(t));if(!_.isToolCollected(t)){n?.remove();continue}n||(n=function(e){let t=document.createElement("button");return t.id=eC(e),t.type="button",t.className=`loot-exploration-tool loot-exploration-tool--${e}`,t.dataset.lootToolControl=e,t.append((0,s.createExplorationToolGraphic)(e)),t.addEventListener("click",()=>{if(!_)return;let t=_.activeTool();_.setActiveTool(t===e?null:e),eL(),ec(_.activeTool()===e?`${A[e].label} aktiviert.`:`${A[e].label} deaktiviert.`)}),t}(t),o.appendChild(n));let r=e===t;n.classList.toggle("loot-exploration-tool--active",r),n.setAttribute("aria-pressed",String(r)),n.setAttribute("aria-label",`${A[t].label} ${r?"deaktivieren":"aktivieren"}`)}(0,u.refreshResourceBarVisibility)()}function eA(e){let t=e.parentElement;for(;t;){if(t.hasAttribute(w)||(t.hasAttribute("data-loot-reveal-layer-content")||t.hasAttribute("data-loot-reveal-payload"))&&(t.hidden||t.inert))return!1;t=t.parentElement}return!0}function e_(e){var t;let o,n,r,s,c,u,h,f,p=`reveal:${W(e,"data-reveal-id","lootRevealRuntimeId","reveal")}`,m=function(e){let t=F.get(e);if(t?.isConnected)return t;let o=e.querySelector("[data-loot-reveal-payload]");return o||((o=e.ownerDocument.createElement("div")).dataset.lootRevealPayload="true",o.hidden=!0,o.inert=!0,o.setAttribute("aria-hidden","true"),o.append(...e.childNodes),e.appendChild(o)),F.set(e,o),o}(e),g=(o=B(e.getAttribute("data-options")?.trim()??""),n=(0,l.parseCollectibleOptions)(o),r=(0,a.parseExplorationOptions)(n.values),s=(0,i.extractConcealmentOptions)(r.values),c=r.layers.map(e=>({...e})),u=[...n.errors,...s.errors],s.mode&&c.length>0&&(c[0].concealment?u.push("Die äußere Freigabeschicht besitzt zwei Verbergungsarten."):c[0].concealment=s.mode),s.values.length>0&&u.push(`Unbekannte Freigabeoption: ${s.values.join("; ")}`),0===c.length?u.push("Eine Freigabe benötigt mindestens Erde oder eine Pflanze."):c.length>1&&u.push("Ein Freigabe-Container darf genau eine Schicht beschreiben."),{errors:u,layers:c,sourceSection:(0,d.sectionFromLootId)(p),valid:0===u.length,visibility:n.rule});if(!g.valid){e.hidden=!0,m.hidden=!0,m.inert=!0,m.setAttribute("aria-hidden","true"),U(p,"Freigabe",g.errors);return}if(t=g.layers[0],X(e)&&ep(e),h=ei(p,t,0),f=[...e.children].find(e=>e.hasAttribute("data-loot-reveal-cover-slot")),f?.dataset.lootRevealCoverSlot!==h&&(f&&((0,i.setHostConcealment)(f,null),f.remove()),(f=e.ownerDocument.createElement("div")).className="loot-reveal-layer__cover",f.dataset.lootRevealCoverSlot=h,f.append(es(h,t.kind,e.ownerDocument))),(f.parentElement!==e||f.nextElementSibling!==m)&&e.insertBefore(f,m),e.classList.remove("loot-reveal-layer--soil","loot-reveal-layer--plant"),e.classList.add("loot-reveal-layer",`loot-reveal-layer--${t.kind}`),e.dataset.lootRevealId=h,e.dataset.lootRevealKind=t.kind,e.dataset.lootRevealConcealment=t.concealment??"",e.dataset.lootRevealState??="locked",(0,i.setHostConcealment)(f,t.concealment),eu(e)&&ed(e),!e.hasAttribute(b)&&!eA(e)){e.hidden=!0;return}let v=K.visible(`reveal:${p}`,g.visibility,(0,d.sourceSlideIsActive)(g.sourceSection,e),eI);e.hidden=!v,v&&eu(e)&&ed(e)}function eI(){document.querySelectorAll(p).forEach(e_);let e=new Set;for(let t of M)(null===t.controller||!t.controller.isConnected||t.controller.hidden||"revealed"!==t.controller.dataset.lootRevealState)&&J(t).forEach(t=>e.add(t));D.forEach(t=>{e.has(t)||ee(t,!1)}),e.forEach(e=>ee(e,!0)),D.clear(),e.forEach(e=>D.add(e))}function eT(){document.querySelectorAll(`[${x}]`).forEach(eh),eI()}function eR(){et(),eI(),eT(),eE(),eL()}class ej extends HTMLElement{static get observedAttributes(){return["data-tool-id","data-tool","data-options"]}connectedCallback(){eS(this)}disconnectedCallback(){let e=eb(this);if(!e)return;let t=ey(this,e);G.forget(`tool:${t}`),O.delete(t)}attributeChangedCallback(){this.isConnected&&eS(this)}}class eN extends HTMLElement{static get observedAttributes(){return["data-reveal-id","data-options"]}connectedCallback(){this.hasAttribute(y)||e_(this)}disconnectedCallback(){if(this.hasAttribute(b))return;let e=W(this,"data-reveal-id","lootRevealRuntimeId","reveal");K.forget(`reveal:reveal:${e}`)}attributeChangedCallback(){this.isConnected&&!this.hasAttribute(y)&&e_(this)}}class eM extends HTMLElement{static get observedAttributes(){return["data-reveal-id","data-reveal-kind","data-options"]}connectedCallback(){et()}disconnectedCallback(){et();let e=W(this,"data-reveal-id","lootRevealRuntimeId","reveal");queueMicrotask(()=>{this.isConnected||[...document.querySelectorAll(m)].some(t=>t!==this&&W(t,"data-reveal-id","lootRevealRuntimeId","reveal")===e)||K.forget(`reveal:reveal:${e}`)})}attributeChangedCallback(){this.isConnected&&et()}}class e$ extends HTMLElement{static get observedAttributes(){return["data-reveal-kind"]}connectedCallback(){et()}disconnectedCallback(){et()}attributeChangedCallback(){this.isConnected&&et()}}function eO(e){_=e,customElements.get(p)||customElements.define(p,eN),customElements.get(f)||customElements.define(f,ej),customElements.get(m)||customElements.define(m,eM),customElements.get(g)||customElements.define(g,e$),T||(T=!0,(0,d.observeLiaSlideActivity)(eR)),R||(R=!0,document.addEventListener("click",ew,!0)),!N&&document.documentElement&&(N=new MutationObserver(e=>{e.some(en)&&et()})).observe(document.documentElement,{attributeFilter:["data-options","data-reveal-id","data-reveal-kind","href"],attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),et(),eL(),eI(),eE()}},{"./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./exploration-options.ts":"fw9xf","./exploration-visual.ts":"gRh4U","./resource-bar.ts":"1KrGH","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK","./template-targets.ts":"9odGA","./range-gate.ts":"jrKO3"}],gRh4U:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(e,t,o){let n=o.createElementNS("http://www.w3.org/2000/svg","svg");return n.setAttribute("viewBox","0 0 64 64"),n.setAttribute("shape-rendering","crispEdges"),n.setAttribute("aria-hidden","true"),n.classList.add("loot-exploration-graphic",...e.split(/\s+/u).filter(Boolean)),n.innerHTML=t,n}function i(e,t=document){return"shovel"===e?l("loot-shovel-graphic",`
        <rect class="loot-exploration-shadow" x="7" y="54" width="50" height="5"/>
        <path class="loot-exploration-outline" d="M38 2h12v4h4v12h-4v4h-4v8h-4v8h-4v8h10v4h4v8H22v-8h4v-4h4v-8h4v-8h4v-8h-4v-4h-4V6h4V2h4Z"/>
        <path class="loot-shovel-handle" d="M38 6h8v4h4v4h-4v4h-8v-4h-4v-4h4V6Z"/>
        <path class="loot-shovel-shaft" d="M38 18h8v8h-4v8h-4v8h-8v-4h4v-8h4V18Z"/>
        <path class="loot-shovel-metal" d="M30 42h12v4h6v8H26v-8h4v-4Z"/>
        <path class="loot-shovel-light" d="M34 46h8v4h-12v-2h4v-2Z"/>
      `,t):l("loot-watering-can-graphic",`
      <rect class="loot-exploration-shadow" x="5" y="53" width="54" height="5"/>
      <path class="loot-exploration-outline" d="M22 12h24v4h6v4h4v8h-4v4h-8v-4h4v-8h-6v-4H26v8h20v4h4v24h-4v4H14v-4h-4V32H4v-4h16v-4h2V12Zm-8 20v16h28V28H22v4h-8Z"/>
      <path class="loot-watering-can-body" d="M14 32h28v16H14V32Z"/>
      <path class="loot-watering-can-light" d="M18 34h12v4H18v-4Z"/>
      <path class="loot-watering-can-handle" d="M26 16h16v4h6v8h-4v-4h-4v-4H26v-4Z"/>
      <path class="loot-watering-can-spout" d="M4 32h10v8H8v-4H4v-4Zm0-8h10v4H4v-4Z"/>
      <rect class="loot-watering-can-water" x="2" y="18" width="4" height="4"/>
      <rect class="loot-watering-can-water" x="8" y="14" width="4" height="4"/>
      <rect class="loot-watering-can-water" x="14" y="18" width="4" height="4"/>
    `,t)}function a(e,t="seedling",o=document){return"soil"===e?l("loot-soil-graphic",`
        <rect class="loot-exploration-shadow" x="5" y="54" width="54" height="5"/>
        <path class="loot-exploration-outline" d="M16 34h6v-8h8v-6h12v6h8v8h6v6h4v16H4V40h4v-6h8Z"/>
        <path class="loot-soil-dark" d="M8 42h8v-8h10v-8h14v6h10v8h6v12H8V42Z"/>
        <path class="loot-soil-main" d="M12 40h10v-8h16v4h12v6h6v6H12v-8Z"/>
        <rect class="loot-soil-light" x="20" y="34" width="12" height="4"/>
        <rect class="loot-soil-light" x="38" y="40" width="8" height="4"/>
        <rect class="loot-soil-stone" x="14" y="46" width="7" height="4"/>
        <rect class="loot-soil-stone" x="46" y="48" width="6" height="4"/>
      `,o):"bloomed"===t?l("loot-plant-graphic loot-plant-graphic--bloomed",`
        <rect class="loot-exploration-shadow" x="12" y="55" width="40" height="4"/>
        <path class="loot-exploration-outline" d="M28 6h8v4h8v8h6v10h-6v6h-8v20h12v5H16v-5h12V34h-8v-6h-6V18h6v-8h8V6Z"/>
        <path class="loot-flower-petal" d="M28 10h8v6h8v10h-8v8h-8v-8h-8V16h8v-6Z"/>
        <rect class="loot-flower-center" x="28" y="18" width="8" height="8"/>
        <rect class="loot-plant-stem" x="30" y="30" width="4" height="24"/>
        <path class="loot-plant-leaf" d="M18 36h12v10h-6v-4h-6v-6Zm16 4h12v6h-6v4h-6V40Z"/>
        <path class="loot-plant-pot-dark" d="M20 48h24v6h-4v5H24v-5h-4v-6Z"/>
        <rect class="loot-plant-pot" x="24" y="50" width="16" height="5"/>
      `,o):l("loot-plant-graphic loot-plant-graphic--seedling",`
      <rect class="loot-exploration-shadow" x="12" y="55" width="40" height="4"/>
      <path class="loot-exploration-outline" d="M29 17h6v14h9v4h5v11H38v8h10v5H16v-5h10v-8H15V35h5v-4h9V17Z"/>
      <rect class="loot-plant-stem" x="30" y="25" width="4" height="29"/>
      <path class="loot-plant-leaf" d="M19 31h11v11h-5v-4h-6v-7Zm15 4h11v7h-6v4h-5V35Z"/>
      <path class="loot-plant-pot-dark" d="M20 46h24v8h-4v5H24v-5h-4v-8Z"/>
      <rect class="loot-plant-pot" x="24" y="49" width="16" height="6"/>
      <rect class="loot-plant-pot-light" x="26" y="49" width="8" height="3"/>
    `,o)}r.defineInteropFlag(o),r.export(o,"createExplorationToolGraphic",()=>i),r.export(o,"createRevealCoverGraphic",()=>a)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],jrKO3:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"setRangeGate",()=>s);let l=new WeakMap;function i(e,t,o){e.getAttribute(t)!==o&&e.setAttribute(t,o)}function a(e,t){e.hasAttribute(t)&&e.removeAttribute(t)}function s(e,t,o,n){let r=l.get(e);if(n){r||(r={ariaHidden:e.getAttribute("aria-hidden"),blockers:new Set,inert:e.inert},l.set(e,r));let n=!r.blockers.has(t);return r.blockers.add(t),i(e,o,"true"),i(e,"aria-hidden","true"),e.inert||(e.inert=!0),n}if(!r){let t=e.hasAttribute(o);return a(e,o),t}let s=r.blockers.delete(t);return(a(e,o),r.blockers.size>0)?(i(e,"aria-hidden","true"),e.inert||(e.inert=!0)):(e.inert!==r.inert&&(e.inert=r.inert),null===r.ariaHidden?a(e,"aria-hidden"):i(e,"aria-hidden",r.ariaHidden),l.delete(e)),s}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],grhSe:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"installMagnifier",()=>Q),r.export(o,"MAGNIFIER_RADIUS",()=>c.MAGNIFIER_RADIUS);var l=e("./collectible-visibility.ts"),i=e("./concealment.ts"),a=e("./exploration-options.ts"),s=e("./exploration.ts"),c=e("./magnifier-geometry.ts"),u=e("./magnifier-visual.ts"),d=e("./resource-bar.ts"),h=e("./slide-activity.ts");let f="lia-loot-magnifier",p="lia-loot-hidden",m="lia-loot-magnifier-tool",g="lia-loot-magnifier-lens",v=null,b=0,y=!1,w=!1,k=null,x=null,S=null,E=!1,C=!1,L=!1,A=!1,_=!1,I=new Set,T=new Set,R=new WeakSet,j=new Set,N=new(0,l.CollectibleVisibilityGate);function M(e){let t=function(e){for(let t of e.composedPath())if(t instanceof HTMLButtonElement&&t.hasAttribute("data-loot-magnifier-button"))return t;return e.target instanceof Element?e.target.closest("[data-loot-magnifier-button]"):null}(e),o=t?.dataset.lootMagnifierButton;if(!t||!o||!v||I.has(o)||!T.has(o))return;if(I.add(o),!v.collect()){I.delete(o),z();return}let n=0===e.detail;t.disabled=!0,t.classList.add("loot-magnifier-pickup--collected"),t.setAttribute("aria-label","Lupe gefunden"),Z(),(0,d.announceResource)("Lupe gefunden. Du kannst sie jetzt in der Leiste aktivieren."),z(),window.setTimeout(()=>{I.delete(o),t.remove(),z(),n&&W()},650)}function $(e){R.has(e)||(R.add(e),e.addEventListener("click",M))}function O(e){var t,o;let n,r,c,d,f;if(!v)return;let p=function(e){let t=e.getAttribute("data-magnifier-id")?.trim();if(t&&!t.startsWith("@"))return`magnifier:${t}:inline`;let o=e.dataset.lootMagnifierRuntimeId;if(o)return o;b+=1;let n=`magnifier:runtime-${b}:inline`;return e.dataset.lootMagnifierRuntimeId=n,n}(e);if(v.collected()&&!I.has(p)){T.delete(p),N.forget(`magnifier:${p}`),(0,s.clearHostRevealLayers)(e),e.childElementCount>0&&e.replaceChildren();return}let m=(t=e.getAttribute("data-options")?.trim()??"",n=/^@\d+$/u.test(t)?"":t,r=(0,l.parseCollectibleOptions)(n),c=(0,a.parseExplorationOptions)(r.values),d=(0,i.extractConcealmentOptions)(c.values),f=[...r.errors,...d.errors],d.values.length>0&&f.push(`Unbekannte Lupenoption: ${d.values.join("; ")}`),{concealment:d.mode,errors:f,layers:c.layers,sourceSection:(0,h.sectionFromLootId)(p),valid:0===f.length,visibility:r.rule});if(!m.valid){T.delete(p),o=m.errors,j.has(p)||(j.add(p),console.warn(`Loot: Lupe ${p} bleibt wegen ung\xfcltiger Optionen verborgen. ${o.join(" ")}`)),(0,s.clearHostRevealLayers)(e),e.childElementCount>0&&e.replaceChildren();return}if((0,s.hostIsRevealBlocked)(e,!1)){T.delete(p),e.hidden=!0;return}if(!N.visible(`magnifier:${p}`,m.visibility,(0,h.sourceSlideIsActive)(m.sourceSection,e),z)){T.delete(p),(0,s.clearHostRevealLayers)(e),e.childElementCount>0&&e.replaceChildren();return}e.hidden=!1;let g=(0,s.setHostRevealLayers)(e,p,m.layers),y=[...g.querySelectorAll("[data-loot-magnifier-button]")].find(e=>e.dataset.lootMagnifierButton===p);if(y)$(y);else{let e,t;(0,i.setHostConcealment)(g,null),g.replaceChildren(((e=document.createElement("button")).type="button",e.className="loot-magnifier-pickup",e.dataset.lootMagnifierButton=p,e.setAttribute("aria-label","Lupe einsammeln"),e.append((0,u.createMagnifierGraphic)(),((t=document.createElement("span")).className="loot-magnifier-pickup__reward",t.setAttribute("aria-hidden","true"),t.textContent="GEFUNDEN",t)),$(e),e))}(0,i.setHostConcealment)(g,m.concealment),(0,s.hostIsRevealBlocked)(e)?T.delete(p):T.add(p)}function z(){T.clear(),document.querySelectorAll(f).forEach(O)}function q(){let e=document.getElementById(g);if(e instanceof HTMLDivElement)return e;let t=document.createElement("div");return t.id=g,t.className="loot-magnifier-lens",t.hidden=!0,t.setAttribute("aria-hidden","true"),document.body.appendChild(t),t}function D(e,t){e.classList.toggle("loot-magnifier-secret--under-lens",t),e.setAttribute("aria-hidden",String(!t)),e.inert=!t}function P(e,t){let o=(0,i.prepareConcealedHost)(e);if(!o)return;let n=(0,i.concealedContentOf)(e);if(!n)return;let r=e.getBoundingClientRect(),l=n.getBoundingClientRect();if(e.style.setProperty("--loot-secret-left",`${l.left-r.left}px`),e.style.setProperty("--loot-secret-top",`${l.top-r.top}px`),e.style.setProperty("--loot-secret-width",`${l.width}px`),e.style.setProperty("--loot-secret-height",`${l.height}px`),!t||!y||!w)return void D(e,!1);e.style.setProperty("--loot-magnifier-x",`${t.x-l.left}px`),e.style.setProperty("--loot-magnifier-y",`${t.y-l.top}px`);let a=e.classList.contains("loot-magnifier-secret--under-lens"),s=function(e,t){if(!e.isConnected||0===t.getClientRects().length)return!1;let o=t.getBoundingClientRect();if(o.width<=0||o.height<=0)return!1;let n=e.parentElement;for(;n;){if(n.hidden||n.inert||"true"===n.getAttribute("aria-hidden"))return!1;n=n.parentElement}return!0}(e,n)&&(0,c.magnifierIntersectsRect)(t.x,t.y,l);if(D(e,s),!s||a)return;let u=(0,i.concealmentIdOf)(e);u&&v?.find(u,o)}function H(e){document.querySelectorAll(i.CONCEALMENT_SELECTOR).forEach(t=>P(t,e))}function K(){z(),H(w?k:null)}function G(){_||(_=!0,queueMicrotask(()=>{_=!1,K()}))}function F(){if(S=null,!x||!y)return;k=x,x=null,w=!0;let e=q();e.style.left=`${k.x}px`,e.style.top=`${k.y}px`,e.hidden=!1,document.body.classList.add("loot-magnifier-pointing"),H(k)}function V(e){x=e,null===S&&(S=window.requestAnimationFrame(F))}function B(){w=!1,x=null,null!==S&&window.cancelAnimationFrame(S),S=null,q().hidden=!0,document.body.classList.remove("loot-magnifier-pointing"),H(null)}function W(){document.getElementById(m)?.focus({preventScroll:!0})}function U(e,t=!0){y=!!(e&&v?.collected()),document.body.classList.toggle("loot-magnifier-active",y);let o=document.getElementById(m);o?.classList.toggle("loot-magnifier-tool--active",y),o?.setAttribute("aria-pressed",String(y)),o?.setAttribute("aria-label",y?"Lupe deaktivieren":"Lupe aktivieren"),y||B(),t&&(0,d.announceResource)(y?"Lupe aktiviert. Bewege den Zeiger über verborgene Bereiche.":"Lupe deaktiviert.")}function Z(){if(!v?.collected()){document.getElementById(m)?.remove(),U(!1,!1),(0,d.refreshResourceBarVisibility)();return}let e=document.getElementById(m);e||((e=document.createElement("button")).id=m,e.type="button",e.className="loot-magnifier-tool",e.dataset.lootMagnifierTool="true",e.append((0,u.createMagnifierGraphic)()),e.addEventListener("click",()=>{U(!y)}),(0,d.installResourceBar)().appendChild(e)),U(y,!1),(0,d.refreshResourceBarVisibility)()}class Y extends HTMLElement{static get observedAttributes(){return["data-magnifier-id","data-options"]}connectedCallback(){O(this)}attributeChangedCallback(){this.isConnected&&O(this)}}class X extends HTMLElement{static get observedAttributes(){return["data-loot-concealment"]}connectedCallback(){P(this,w?k:null),this.childObserver??=new MutationObserver(()=>{queueMicrotask(()=>{this.isConnected&&P(this,w?k:null)})}),this.childObserver.observe(this,{childList:!0}),queueMicrotask(()=>{this.isConnected&&P(this,w?k:null)})}disconnectedCallback(){this.childObserver?.disconnect()}attributeChangedCallback(){this.isConnected&&P(this,w?k:null)}constructor(...e){super(...e),this.childObserver=null}}function Q(e){v=e,E||(E=!0,window.addEventListener("pointermove",e=>{y&&e.isPrimary&&V({x:e.clientX,y:e.clientY})},{passive:!0}),window.addEventListener("pointerdown",e=>{y&&e.isPrimary&&"mouse"!==e.pointerType&&V({x:e.clientX,y:e.clientY})},{passive:!0}),window.addEventListener("pointerout",e=>{"mouse"===e.pointerType&&null===e.relatedTarget&&B()}),window.addEventListener("pointercancel",B),window.addEventListener("blur",B),window.addEventListener("scroll",()=>{y&&w&&k&&V(k)},{passive:!0}),window.addEventListener("resize",()=>{y&&w&&k&&V(k)},{passive:!0}),document.addEventListener("keydown",e=>{"Escape"===e.key&&y&&(e.preventDefault(),U(!1),W())}),document.addEventListener(i.CONCEALMENT_CHANGED_EVENT,()=>{H(w?k:null)})),q(),L||(L=!0,(0,h.observeLiaSlideActivity)(K)),A||(A=!0,document.addEventListener(s.REVEAL_CHANGED_EVENT,G)),C||(C=!0,document.addEventListener("click",M,!0)),customElements.get(p)||customElements.define(p,X),customElements.get(f)||customElements.define(f,Y),Z(),z(),H(null)}},{"./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./magnifier-geometry.ts":"ecwyG","./magnifier-visual.ts":"6yshi","./resource-bar.ts":"1KrGH","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK","./exploration-options.ts":"fw9xf","./exploration.ts":"5BeJ3"}],ecwyG:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"MAGNIFIER_RADIUS",()=>l),r.export(o,"magnifierIntersectsRect",()=>i);let l=72;function i(e,t,o,n=l){if(![e,t,o.left,o.right,o.top,o.bottom,n].every(Number.isFinite)||n<0||o.right<o.left||o.bottom<o.top)return!1;let r=Math.max(o.left,Math.min(e,o.right)),a=Math.max(o.top,Math.min(t,o.bottom)),s=e-r,c=t-a;return s*s+c*c<=n*n}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"6yshi":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(){let e=document.createElementNS("http://www.w3.org/2000/svg","svg");return e.setAttribute("viewBox","0 0 56 56"),e.setAttribute("shape-rendering","crispEdges"),e.setAttribute("aria-hidden","true"),e.classList.add("loot-magnifier-graphic"),e.innerHTML=`
    <rect class="loot-magnifier-shadow" x="8" y="46" width="42" height="6"/>
    <path class="loot-magnifier-outline" d="M10 2h20v4h8v8h4v20h-4v6h-8v4H10v-4H4v-6H0V14h4V8h6V2Z"/>
    <path class="loot-magnifier-glass" d="M14 10h12v4h4v16h-4v4H14v-4h-4V14h4v-4Z"/>
    <rect class="loot-magnifier-glint" x="14" y="12" width="8" height="4"/>
    <rect class="loot-magnifier-glint" x="12" y="16" width="4" height="8"/>
    <path class="loot-magnifier-outline" d="M30 34h8v4h4v4h4v4h4v10H38v-4h-4v-4h-4v-4h-4V36h4v-2Z"/>
    <path class="loot-magnifier-handle" d="M32 40h4v4h4v4h4v4h-4v-4h-4v-4h-4v-4Z"/>
    <rect class="loot-magnifier-handle-light" x="32" y="38" width="4" height="6"/>
  `,e}r.defineInteropFlag(o),r.export(o,"createMagnifierGraphic",()=>l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"4rVr5":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"MagnifierStore",()=>i);var l=e("./storage.ts");class i{collect(){return!this.current.collected&&(this.current={version:1,collected:!0},(0,l.saveMagnifier)(this.current),!0)}isCollected(){return this.current.collected}state(){return{...this.current}}constructor(){this.current=(0,l.loadMagnifier)()??{version:1,collected:!1}}}},{"./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],bLBcI:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"courseLockUnitCount",()=>G),r.export(o,"refreshObjectLocks",()=>eu),r.export(o,"installObjectLocks",()=>ed);var l=e("./course-chests.ts"),i=e("./lock-options.ts"),a=e("./lock-targets.ts"),s=e("./template-targets.ts"),c=e("./slide-activity.ts"),u=e("./exploration.ts"),d=e("./slide-navigation-lock.ts");let h="lia-loot-lock",f=".lia-quiz",p="lia-loot-lock-status",m={mode:{rootSelector:"#lia-support-menu .lia-support-menu__item--mode",triggerGroup:"mode",contentGroup:"mode",focusSelector:"#lia-mode-textbook"},menu:{rootSelector:"#lia-support-menu .lia-support-menu__item--settings",triggerGroup:"setting",contentGroup:"setting",focusSelector:"#lia-btn-light-mode"},translator:{rootSelector:"#lia-support-menu .lia-support-menu__item--lang",triggerGroup:"translation",contentGroup:"translation",focusSelector:"#lia-checkbox-google_translate"},classroom:{rootSelector:"#lia-support-menu .lia-support-menu__item--share",triggerGroup:"share",contentGroup:"share",focusSelector:"#lia-button-qr-code"},info:{rootSelector:"#lia-support-menu .lia-support-menu__item--info",triggerGroup:"information",contentGroup:"information",focusSelector:""}},g={check:".lia-quiz__control .lia-quiz__check",resolve:".lia-quiz__control .lia-quiz__resolve",hint:".lia-quiz__control .lia-quiz__hint"},v={toc:"Inhaltsverzeichnis",mode:"Darstellung",menu:"Menü",translator:"Übersetzer",classroom:"Classroom",info:"Info-Menü",seitenwechsel:"Seitenwechsel",check:"Prüfen",resolve:"Auflösen",hint:"Hinweis",portal:"Portal",...s.TEMPLATE_TARGET_LABELS},b={red:"Rotes Schloss",blue:"Blaues Schloss",green:"Grünes Schloss",yellow:"Gelbes Schloss",purple:"Lilafarbenes Schloss",orange:"Orangefarbenes Schloss"},y={red:"roten Schlüssel",blue:"blauen Schlüssel",green:"grünen Schlüssel",yellow:"gelben Schlüssel",purple:"lilafarbenen Schlüssel",orange:"orangefarbenen Schlüssel"},w={red:"roter Schlüssel",blue:"blauer Schlüssel",green:"grüner Schlüssel",yellow:"gelber Schlüssel",purple:"lilafarbener Schlüssel",orange:"orangefarbener Schlüssel"},k=new Map,x=[],S=new Map,E=new Set,C=new WeakMap,L=new WeakMap,A=new WeakMap,_=null,I=[],T=null,R=null,j=0,N=0,M=0,$="idle",O=!1,z=!1,q=!1,D=!1;function P(e){return"global"===e.scope?e.onlyOnSlide?null!==e.sourceSection?`lock:${e.target}:section-${e.sourceSection}:${e.color}`:`lock:${e.baseId}:${e.target}:${e.color}`:`lock:${e.target}:${e.color}`:(0,a.isTemplateLockTarget)(e.target)&&null!==e.sourceSection?`lock:${e.target}:section-${e.sourceSection}:${e.color}`:`lock:${e.baseId}:${e.target}:${e.color}`}function H(e){if("global"!==e.scope)return S.delete(e.baseId),e;let t={...e};return e.onlyOnSlide||delete t.sourceHost,S.set(e.baseId,t),e}function K(e){let t=function(e){let t=e.getAttribute("data-lock-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootLockRuntimeId;if(o)return o;j+=1;let n=`runtime-lock-${j}`;return e.dataset.lootLockRuntimeId=n,n}(e);if((0,u.hostIsRevealBlocked)(e,!1))return S.delete(t),null;let o=(0,a.resolveLockTarget)(e.getAttribute("data-target")),n=(0,i.parseLockOptions)(e.getAttribute("data-color")??"");if(e.classList.add("loot-object-lock-host"),"true"!==e.getAttribute("aria-hidden")&&e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren(),delete e.dataset.lootLockError,!o||!n.valid||!n.color)return S.delete(t),null;let r=(0,c.sectionFromLootId)(t),l={baseId:t,target:o,color:n.color,onlyOnSlide:n.onlyOnSlide,sourceSection:r,sourceHost:e};if((0,a.isTemplateLockTarget)(o)){let e="global"===(0,s.templateTargetDefinition)(o).scope?"global":"local";return H({...l,scope:e})}if((0,a.isGlobalLockTarget)(o))return H({...l,scope:"global"});if((0,a.isItemLockTarget)(o))return H({...l,scope:"local"});let d=function(e){let t=e.closest(f);if(t)return t;let o=e.closest("main.lia-slide__content");if(!o)return null;let n=e;for(;n!==o;){let e=n.previousElementSibling;for(;e instanceof HTMLElement&&function(e){let t=[...e.children];return 1===t.length&&t[0]instanceof HTMLElement&&t[0].matches(h)}(e);)e=e.previousElementSibling;if(e instanceof HTMLElement){if(e.matches(f))return e;let t=e.querySelectorAll(f);return t[t.length-1]??null}if(!(n.parentElement instanceof HTMLElement))break;n=n.parentElement}return null}(e);return d?H({...l,scope:"local",quiz:d}):(S.delete(t),e.dataset.lootLockError="quiz-not-adjacent",null)}function G(e,t=()=>!0){let o=new Set;for(let n of e){let e=(0,a.resolveLockTarget)(n.target);if(!e||(0,a.isTemplateLockTarget)(e)&&!t(e))continue;let r=(0,a.isTemplateLockTarget)(e)?"global"===(0,s.templateTargetDefinition)(e).scope?"global":"local":(0,a.isGlobalLockTarget)(e)?"global":(0,a.isLocalLockTarget)(e)||(0,a.isItemLockTarget)(e)?"local":null;r&&o.add(P({baseId:n.baseId,target:e,color:n.color,onlyOnSlide:n.onlyOnSlide,scope:r,sourceSection:n.section}))}return o.size}function F(e,t){for(let t of(x.length=0,e)){let e=function(e){let t=(0,a.resolveLockTarget)(e.target);return t&&(0,a.isTemplateLockTarget)(t)?{baseId:e.baseId,target:t,color:e.color,onlyOnSlide:e.onlyOnSlide,scope:"global"===(0,s.templateTargetDefinition)(t).scope?"global":"local",sourceSection:e.section}:t&&(0,a.isGlobalLockTarget)(t)?{baseId:e.baseId,target:t,color:e.color,onlyOnSlide:e.onlyOnSlide,scope:"global",sourceSection:e.section}:null}(t);e&&x.push(e)}$="complete",_?.catalogReady(G(t)),eo()}function V(){let e=document.getElementById(p);if(e)return e;let t=document.createElement("div");return t.id=p,t.className="loot-object-lock-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function B(e,t){return[...e.children].filter(e=>e instanceof HTMLElement&&e.matches(t))}function W(e,t,o){e.getAttribute(t)!==o&&e.setAttribute(t,o)}function U(e,t,o){null===o?e.removeAttribute(t):e.setAttribute(t,o)}function Z(e,t){return e.length===t.length&&e.every((e,o)=>e===t[o])}function Y(e,t,o){e.style[t]!==o&&(e.style[t]=o)}function X(e){for(let t of e.binding.controls)!function(e,t){if(e.states.get(t))return;let o={inert:t.inert,kind:"control",tabIndex:t.getAttribute("tabindex")};e.states.set(t,o)}(e,t),t.inert||(t.inert=!0),W(t,"tabindex","-1");for(let t of e.binding.contents)!function(e,t){if(e.states.get(t))return;let o={ariaHidden:t.getAttribute("aria-hidden"),concealed:t.classList.contains("loot-object-lock-concealed"),inert:t.inert,kind:"content"};e.states.set(t,o)}(e,t),t.inert||(t.inert=!0),W(t,"aria-hidden","true"),t.classList.add("loot-object-lock-concealed");!function(e){if("floating"!==e.binding.mode)return;let t=e.binding.anchor.getBoundingClientRect(),o=e.binding.anchor.ownerDocument.defaultView??window,n=e.binding.anchor.isConnected&&t.width>0&&t.height>0&&t.right>0&&t.bottom>0&&t.left<o.innerWidth&&t.top<o.innerHeight;e.button.hidden===n&&(e.button.hidden=!n),n&&(Y(e.button,"left",`${t.left}px`),Y(e.button,"top",`${t.top}px`),Y(e.button,"width",`${t.width}px`),Y(e.button,"height",`${t.height}px`),e.button.classList.toggle("loot-object-lock-button--near-top",t.top<96))}(e)}function Q(e,t,o){let n;null!==e.feedbackTimer&&(window.clearTimeout(e.feedbackTimer),e.feedbackTimer=null),e.button.classList.toggle("loot-object-lock-button--missing","missing"===o),e.button.classList.toggle("loot-object-lock-button--unlocking","unlocking"===o);let r=e.button.querySelector(".loot-object-lock-message");r&&(r.textContent=t),(n=V()).textContent="",window.setTimeout(()=>{n.textContent=t},0),"missing"===o&&(e.feedbackTimer=window.setTimeout(()=>{e.feedbackTimer=null,e.button.classList.remove("loot-object-lock-button--missing"),r&&(r.textContent="")},2200))}function J(e){let t=P(e);return!_?.unlocked(t)||E.has(t)}function ee(e){return"seitenwechsel"===e.target&&(!e.onlyOnSlide||(0,c.sourceSlideIsActive)(e.sourceSection,e.sourceHost))&&!_?.unlocked(P(e))}function et(){if(!_)return void(0,d.setSlideNavigationLocked)(!1);let e=function(){let e=[...x,...S.values()];document.querySelectorAll(h).forEach(t=>{let o=K(t);o&&e.push(o)});let t=[],o=new Set;for(let n of e){let e=P(n);o.has(e)||(o.add(e),t.push(n))}return t}();(0,d.setSlideNavigationLocked)(e.some(ee));let t=function(e){let t=new Map;for(let o of e){let e=function(e){if(e.onlyOnSlide&&!(0,c.sourceSlideIsActive)(e.sourceSection,e.sourceHost))return null;if((0,a.isItemLockTarget)(e.target)){if(!(0,a.isItemLockTarget)(e.target)||!e.sourceHost?.isConnected||!(0,c.sourceSlideIsActive)(e.sourceSection,e.sourceHost))return null;let t=function(e){let t=e.closest("main.lia-slide__content");if(!t)return null;let o=null;for(let n of t.querySelectorAll("lia-loot-slide-portal"))(4&n.compareDocumentPosition(e))!=0&&(o=n);return o}(e.sourceHost),o=t?.querySelector("[data-loot-slide-portal-button]");return t&&o?{slotKey:`item:portal:${function(e){let t=L.get(e);if(t)return t;M+=1;let o=`portal-${M}`;return L.set(e,o),o}(t)}`,root:t,anchor:o,controls:[o],contents:[],mode:"floating",focusCandidates:[o]}:null}if((0,a.isTemplateLockTarget)(e.target)){if(!(0,a.isTemplateLockTarget)(e.target))return null;let t=(0,s.templateTargetDefinition)(e.target),o=(0,s.findTemplateTarget)(e.target,"lock",document);return o&&("slide"!==t.scope||(0,c.sourceSlideIsActive)(e.sourceSection,o.root))?{slotKey:"global"===t.scope?`template:global:${e.target}`:`template:${e.target}:section-${e.sourceSection??e.baseId}`,root:o.root,anchor:o.lockAnchor,controls:o.lockControls,contents:[],mode:"floating",focusCandidates:o.focusCandidates}:null}return"global"===e.scope?function(e){let t=m[e];if(t){let o=document.querySelector(t.rootSelector);if(!o)return null;let n=B(o,`button[data-group-id='${t.triggerGroup}'], i.hide-md-up`),r=B(o,`.lia-support-menu__submenu[data-group-id='${t.contentGroup}']`),l=t.focusSelector?o.querySelector(t.focusSelector):null;return{slotKey:`global:${e}`,root:o,anchor:o,controls:n,contents:r,mode:"fill",focusCandidates:[...n,...l?[l]:[],o]}}if("toc"===e){let e=document.querySelector("#lia-toc"),t=document.querySelector("#lia-btn-toc");return e&&t?{slotKey:"global:toc",root:e,anchor:t,controls:[t],contents:B(e,".lia-toc__content"),mode:"floating",focusCandidates:[t]}:null}if("seitenwechsel"===e){let e=document.querySelector(".lia-pagination"),t=e?.querySelector(":scope > .lia-pagination__content");if(!e||!t)return null;let o=document.querySelector("#lia-btn-prev"),n=document.querySelector("#lia-btn-next");return{slotKey:"global:seitenwechsel",root:e,anchor:t,controls:[o,n].filter(e=>null!==e),contents:[],mode:"floating",focusCandidates:[n,o].filter(e=>null!==e)}}return null}(e.target):function(e){if(!e.quiz||!e.quiz.isConnected||!(0,a.isLocalLockTarget)(e.target))return null;let t=e.quiz.querySelector(g[e.target]);return t&&function(e,t){let o=e.classList.contains("open")&&!t.hasAttribute("hidden")&&!(t instanceof HTMLButtonElement&&t.disabled)&&"true"!==t.getAttribute("aria-hidden")&&t.getClientRects().length>0;if(o){let e=A.get(t);e&&("-1"===t.getAttribute("tabindex")&&U(t,"tabindex",e.value),A.delete(t))}return o}(e.quiz,t)?{slotKey:`local:${function(e){let t=C.get(e);if(t)return t;N+=1;let o=`quiz-${N}`;return C.set(e,o),o}(e.quiz)}:${e.target}`,root:e.quiz,anchor:t,controls:[t],contents:[],mode:"floating",focusCandidates:[t]}:null}(e)}(o);if(!e)continue;let n=t.get(e.slotKey);n?n.requests.push(o):t.set(e.slotKey,{binding:e,requests:[o]})}let o=new Map;if(!_)return o;for(let[e,n]of t){let t=n.requests.find(J);t&&o.set(e,{binding:n.binding,request:t})}return o}(e);for(let[e,r]of[...k]){let l=t.get(e);if(!l||P(l.request)!==r.lockId||(o=l.binding,n=r.binding,!(o.root===n.root&&o.anchor===n.anchor&&o.mode===n.mode&&Z(o.controls,n.controls)&&Z(o.contents,n.contents)))){var o,n;for(let[e,t]of(null!==r.feedbackTimer&&window.clearTimeout(r.feedbackTimer),r.states))!function(e,t){if(e.inert&&(e.inert=t.inert),"content"===t.kind){"true"===e.getAttribute("aria-hidden")&&U(e,"aria-hidden",t.ariaHidden??null),e.classList.contains("loot-object-lock-concealed")&&e.classList.toggle("loot-object-lock-concealed",t.concealed??!1);return}let o=e.hasAttribute("hidden")||"true"===e.getAttribute("aria-hidden")||e instanceof HTMLButtonElement&&e.disabled||0===e.getClientRects().length;"-1"===e.getAttribute("tabindex")&&(o?A.set(e,{value:t.tabIndex??null}):(U(e,"tabindex",t.tabIndex??null),A.delete(e)))}(e,t);r.states.clear(),T?.unobserve(r.binding.anchor),r.button.remove(),r.rootWasTarget||r.binding.root.classList.remove("loot-object-lock-target"),k.delete(e)}}for(let[e,o]of t){let t=k.get(e);t?X(t):k.set(e,function(e,t){for(let e of t.controls)"true"===e.getAttribute("aria-expanded")&&e.click();let o=P(e),n=function(e,t,o,n=document){let r=n.createElement("button");return r.type="button",r.className=`loot-object-lock-button loot-object-lock-button--${e.scope} loot-key-color--${e.color}`,r.dataset.lootLockButton=t,r.dataset.lootLockId=t,r.dataset.lootLockTarget=e.target,r.dataset.lootLockColor=e.color,r.dataset.lootLockScope=e.scope,r.setAttribute("aria-label",`${v[e.target]} gesperrt. Einen ${y[e.color]} verwenden.`),r.innerHTML=`
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
    <span class="loot-object-lock-label" aria-hidden="true">${b[e.color]}</span>
    <span class="loot-object-lock-message" aria-hidden="true"></span>
  `,r.addEventListener("click",e=>{e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),function(e){let t=k.get(e);if(!_||!t||E.has(t.lockId))return;let o=_.unlock(t.lockId,t.request.color,t.request.target);if("missing-key"===o)return Q(t,`${v[t.request.target]} ist gesperrt. Du brauchst einen ${y[t.request.color]}.`,"missing");if("invalid-lock-id"===o)return;E.add(t.lockId),Q(t,"unlocked"===o?`${v[t.request.target]} entsperrt. Ein ${w[t.request.color]} wurde verwendet.`:`${v[t.request.target]} ist bereits entsperrt.`,"unlocking");let n=t.lockId,r=t.binding;window.setTimeout(()=>{E.delete(n),et();let t=k.get(e);t?t.button.focus({preventScroll:!0}):function(e){for(let t of e.focusCandidates)if(function(e){let t=e.getBoundingClientRect();return e.isConnected&&!e.hasAttribute("hidden")&&!e.inert&&!(e instanceof HTMLButtonElement&&e.disabled)&&t.width>0&&t.height>0&&"true"!==e.getAttribute("aria-hidden")&&e.tabIndex>=0}(t)&&(t.focus({preventScroll:!0}),t.ownerDocument.activeElement===t))return;let t=e.root.getAttribute("tabindex"),o=()=>{e.root.removeEventListener("blur",o),U(e.root,"tabindex",t),ea()};e.root.setAttribute("tabindex","-1"),ea(),e.root.addEventListener("blur",o,{once:!0}),e.root.focus({preventScroll:!0})}(r)},620)}(o)}),r}(e,o,t.slotKey,t.anchor.ownerDocument);n.classList.add(`loot-object-lock-button--${t.mode}`);let r={binding:t,button:n,feedbackTimer:null,lockId:o,request:e,rootWasTarget:t.root.classList.contains("loot-object-lock-target"),states:new Map};return"fill"===t.mode?(t.root.classList.add("loot-object-lock-target"),t.root.appendChild(n)):t.anchor.ownerDocument.body.appendChild(n),T?.observe(t.anchor),X(r),r}(o.request,o.binding))}ea()}function eo(){null===R&&(R=window.setTimeout(()=>{R=null,et()},0))}function en(e){return e?1===e.nodeType?e:e.parentElement:null}function er(e){let t=en(e);return!!t?.closest(`[data-loot-lock-button], #${p}`)}function el(e){if(er(e.target)||function(e){let t,o;if("attributes"!==e.type||!e.attributeName)return!1;let n=en(e.target);if(!n)return!1;let r=[...k.values()];if("tabindex"===e.attributeName)return r.some(e=>e.binding.controls.includes(n))&&"-1"===n.getAttribute("tabindex");if("aria-hidden"===e.attributeName)return r.some(e=>e.binding.contents.includes(n))&&"true"===n.getAttribute("aria-hidden");if("class"!==e.attributeName)return!1;let l=(t=new Set((e.oldValue??"").split(/\s+/u).filter(Boolean)),[...new Set([...t,...o=new Set((n.getAttribute("class")??"").split(/\s+/u).filter(Boolean))])].filter(e=>t.has(e)!==o.has(e)));if(1!==l.length)return!1;if("loot-object-lock-concealed"===l[0]){let e=r.some(e=>e.binding.contents.includes(n));return n.classList.contains(l[0])===e}if("loot-object-lock-target"===l[0]){let e=r.some(e=>"fill"===e.binding.mode&&e.binding.root===n);return n.classList.contains(l[0])===e}return!1}(e))return!1;if("childList"!==e.type)return!0;let t=[...Array.from(e.addedNodes),...Array.from(e.removedNodes)];return 0===t.length||t.some(e=>{if(!er(e))return!0;let t=en(e),o=t?.closest("[data-loot-lock-button]");return!!o&&[...k.values()].some(e=>e.button===o)!==o.isConnected})}function ei(e){e.some(el)&&eo()}function ea(){I.flatMap(e=>e.takeRecords()).some(el)&&eo()}function es(e){var t;let o=(t=e.target,t?.nodeType===1?t:t&&"number"==typeof t.nodeType?t.parentElement:null);if(o){for(let t of k.values())if([...t.binding.controls,...t.binding.contents].some(e=>e===o||e.contains(o))){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation();return}}}class ec extends HTMLElement{static get observedAttributes(){return["data-lock-id","data-target","data-color"]}connectedCallback(){K(this),eo()}attributeChangedCallback(){this.isConnected&&(K(this),eo())}}function eu(){et()}function ed(e){if(_=e,"idle"===$&&($="pending",(0,l.discoverCourseLocks)().then(({declarations:e,catalog:t})=>F(e,t)).catch(()=>F([],[]))),V(),customElements.get(h)||customElements.define(h,ec),!O){O=!0;let e=(0,s.templateDocumentCandidates)(document);for(let t of e)t.addEventListener("click",es,!0);(0,d.installSlideNavigationLock)(e)}if(D||(D=!0,document.addEventListener(u.REVEAL_CHANGED_EVENT,eo)),0===I.length)for(let e of(0,s.templateDocumentCandidates)(document)){let t=new(e.defaultView?.MutationObserver??MutationObserver)(ei);t.observe(e.documentElement,{attributeFilter:["aria-hidden","class","data-open","disabled","hidden","style","tabindex"],attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),I.push(t)}if(z||(z=!0,(0,c.observeLiaSlideActivity)(eo)),!q){if(q=!0,"ResizeObserver"in window)for(let e of(T=new ResizeObserver(eo),k.values()))T.observe(e.binding.anchor);let e=new Set;for(let t of(0,s.templateDocumentCandidates)(document)){let o=t.defaultView;o&&!e.has(o)&&(e.add(o),o.addEventListener("resize",eo,{passive:!0}),o.addEventListener("scroll",eo,{capture:!0,passive:!0}),o.visualViewport?.addEventListener("resize",eo,{passive:!0}),o.visualViewport?.addEventListener("scroll",eo,{passive:!0})),t.addEventListener("load",eo,!0),t.fonts?.ready.then(eo)}}eu()}},{"./course-chests.ts":"2ceW6","./lock-options.ts":"3c981","./lock-targets.ts":"1CWW8","./template-targets.ts":"9odGA","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK","./exploration.ts":"5BeJ3","./slide-navigation-lock.ts":"lbx2r"}],lbx2r:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"isSequentialSlideNavigationKey",()=>d),r.export(o,"isSequentialSlideNavigationSwipe",()=>h),r.export(o,"isEditableSlideNavigationTarget",()=>f),r.export(o,"setSlideNavigationLocked",()=>v),r.export(o,"installSlideNavigationLock",()=>b);let l=new WeakSet,i=new WeakSet,a=new WeakMap,s=new WeakMap,c=new WeakSet,u=!1;function d(e){if("ArrowLeft"===e.key||"ArrowRight"===e.key)return!0;let t=e.key.toLocaleLowerCase("en-US");return e.altKey&&e.shiftKey&&!e.ctrlKey&&!e.metaKey&&("n"===t||"p"===t)}function h(e){return!![e.elapsedMs,e.endX,e.endY,e.startX,e.startY].every(Number.isFinite)&&!(e.elapsedMs<0)&&!(e.elapsedMs>300)&&Math.abs(e.endX-e.startX)>=150&&100>=Math.abs(e.endY-e.startY)}function f(e){let t=e?1===e.nodeType&&"function"==typeof e.closest?e:e.parentElement??null:null;return!!t&&(!!t.isContentEditable||!!t.closest("input,textarea,select,option,[contenteditable]:not([contenteditable='false']),[role='textbox'],[role='combobox'],[role='listbox'],[role='slider'],[role='spinbutton'],[role='radiogroup'],[role='tree'],[role='grid'],[role='menu'],.ace_editor,.CodeMirror"))}function p(e){u&&d(e)&&(f(e.target)||e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation())}function m(e,t){t.preventDefault(),t.stopImmediatePropagation(),t.stopPropagation(),c.add(e),e.setTimeout(()=>c.delete(e),0)}function g(e,t,o,n){return{elapsedMs:n.performance.now()-e.startedAt,endX:t,endY:o,startX:e.x,startY:e.y}}function v(e){u=e}function b(e){for(let t of e){let e=t.defaultView;e&&!i.has(e)&&(i.add(e),e.addEventListener("keydown",p,!0),e.addEventListener("touchstart",t=>(function(e,t){if(!u||1!==t.touches.length)return void s.delete(e);let o=t.touches.item(0);o&&s.set(e,{identifier:o.identifier,startedAt:e.performance.now(),x:o.clientX,y:o.clientY})})(e,t),{capture:!0,passive:!0}),e.addEventListener("touchend",t=>(function(e,t){let o=s.get(e);if(s.delete(e),!u||!o||void 0===o.identifier)return;let n=function(e,t){for(let o=0;o<e.length;o+=1){let n=e.item(o);if(n?.identifier===t)return n}return null}(t.changedTouches,o.identifier);n&&h(g(o,n.clientX,n.clientY,e))&&m(e,t)})(e,t),{capture:!0,passive:!1}),e.addEventListener("touchcancel",()=>s.delete(e),!0),e.addEventListener("mousedown",t=>{!u||0!==t.button?a.delete(e):a.set(e,{startedAt:e.performance.now(),x:t.clientX,y:t.clientY})},!0),e.addEventListener("mouseup",t=>(function(e,t){let o=a.get(e);a.delete(e),u&&o&&0===t.button&&h(g(o,t.clientX,t.clientY,e))&&m(e,t)})(e,t),!0),e.addEventListener("click",t=>{c.has(e)&&(c.delete(e),t.preventDefault(),t.stopImmediatePropagation(),t.stopPropagation())},!0)),l.has(t)||(l.add(t),t.addEventListener("keydown",p,!0))}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],cCRZG:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"showHighscore",()=>h),r.export(o,"hideHighscore",()=>f);var l=e("./score"),i=e("./style");let a="lia-loot-highscore-dialog",s="http://www.w3.org/2000/svg",c={gold:{fill:"#D4AF37",stroke:"#725A00",label:"Goldene Trophäe"},silver:{fill:"#A7A9AC",stroke:"#55585C",label:"Silberne Trophäe"},copper:{fill:"#B87333",stroke:"#6A3517",label:"Kupferfarbene Trophäe"}};function u(e){"function"==typeof e.close&&e.open?e.close():e.removeAttribute("open")}function d(e){return e?.tagName==="DIALOG"?e:null}function h(e,t){let o,n,r,h;(0,i.injectStyles)();let f=function(){let e=d(document.getElementById(a));if(e)return e;let t=document.createElement("dialog");t.id=a,t.className="loot-highscore-dialog";let o=document.createElement("div");o.className="loot-highscore-card",o.setAttribute("data-loot-highscore-content","");let n=document.createElement("button");return n.type="button",n.className="loot-highscore-close",n.setAttribute("aria-label","Highscore schließen"),n.textContent="×",n.addEventListener("click",()=>u(t)),t.addEventListener("click",e=>{e.target===t&&u(t)}),o.appendChild(n),t.appendChild(o),document.body.appendChild(t),t}(),p=f.querySelector("[data-loot-highscore-content]");if(!p)return;p.querySelectorAll(".loot-highscore-trophy, .loot-highscore-points").forEach(e=>e.remove());let m=(0,l.trophyTier)(e,t);m&&p.appendChild((o=c[m],(n=document.createElementNS(s,"svg")).setAttribute("viewBox","0 0 64 64"),n.setAttribute("class","loot-highscore-trophy"),n.setAttribute("role","img"),n.setAttribute("aria-label",o.label),(r=document.createElementNS(s,"path")).setAttribute("d","M18 8h28v10c0 11.5-5.8 20.6-14 23.4V48h10v7H22v-7h10v-6.6C23.8 38.6 18 29.5 18 18V8Z"),r.setAttribute("fill",o.fill),r.setAttribute("stroke",o.stroke),r.setAttribute("stroke-width","2.5"),r.setAttribute("stroke-linejoin","round"),(h=document.createElementNS(s,"path")).setAttribute("d","M18 13H9v5c0 8.8 4.8 14.4 13 16M46 13h9v5c0 8.8-4.8 14.4-13 16"),h.setAttribute("fill","none"),h.setAttribute("stroke",o.stroke),h.setAttribute("stroke-width","4"),h.setAttribute("stroke-linecap","round"),h.setAttribute("stroke-linejoin","round"),n.append(h,r),n));let g=document.createElement("p");g.id="lia-loot-highscore-points",g.className="loot-highscore-points",g.textContent=`${(0,l.formatScore)(e)} Punkte`,p.appendChild(g),f.setAttribute("aria-labelledby",g.id),"function"==typeof f.showModal?f.open||f.showModal():(f.setAttribute("open",""),f.setAttribute("role","dialog"),f.setAttribute("aria-modal","true")),p.querySelector(".loot-highscore-close")?.focus()}function f(){let e=d(document.getElementById(a));e&&u(e)}},{"./score":"abltm","./style":"3Vffy","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"3Vffy":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"injectStyles",()=>s);var l=e("./template-targets.ts");let i="lia-loot-highscore-style",a=`
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
.loot-reveal-layer__cover[hidden],
.loot-reveal-layer__content[hidden],
[data-loot-reveal-payload][hidden],
[data-loot-reveal-range-blocked],
[data-loot-if-range-blocked] {
  display: none !important;
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
`;function s(e=document){for(let t of(0,l.templateDocumentCandidates)(e)){if(t.getElementById(i))continue;let e=t.createElement("style");e.id=i,e.textContent=a,t.head?.appendChild(e)}}},{"./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1ZNl4":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"isScoreableQuiz",()=>s),r.export(o,"lastScoreableQuiz",()=>h),r.export(o,"allRenderedCourseQuizzesSolved",()=>f),r.export(o,"isLastCourseQuiz",()=>p),r.export(o,"installQuizEventTracking",()=>g);let l=".lia-quiz__check",i=".lia-quiz",a=".lia-quiz__resolve";function s(e){return!!(e.querySelector(l)&&e.querySelector(a))}function c(e){e.preventDefault(),e.stopImmediatePropagation()}function u(e){let t=(e.querySelector(l)?.textContent?.trim()??"").match(/(?:^|\s)(\d+)\s*$/);return t?Number.parseInt(t[1],10):0}function d(e){return e.querySelectorAll(".lia-quiz__hints > li").length}function h(e){for(let t=e.length-1;t>=0;t-=1){let o=e[t];if(s(o))return o}return null}function f(e){let t=Array.from(e.querySelectorAll(i)).filter(s);return t.length>0&&t.every(e=>e.classList.contains("solved"))&&t.some(p)}function p(e){let t=e.closest("main.lia-slide__content"),o=t?.parentElement;if(!t||!o)return!1;let n=Array.from(o.children).filter(e=>"MAIN"===e.tagName);return n[n.length-1]===t&&h(Array.from(t.querySelectorAll(i)))===e}function m(e,t,o,n,r=3e4){let l,i=!1,a=0,s=()=>{l.disconnect(),window.clearTimeout(a)},c=()=>{i||(i=!0,s(),n())},u=()=>{if(i)return;if(!e.isConnected)return void c();let n=t();null!==n&&(i||(i=!0,s(),o(n)))};(l=new MutationObserver(u)).observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0}),a=window.setTimeout(c,r),window.setTimeout(u,0)}function g(e){let t=new WeakSet,o=new WeakSet;document.addEventListener("click",n=>{var r;let s=(r=n.target)instanceof Element?r:r instanceof Node?r.parentElement:null;if(!s)return;let h=s.closest(l);if(h&&!h.disabled){let o=h.closest(i);if(!o||!o.classList.contains("open")||!o.querySelector(a))return;if(t.has(o)||!e.useCheck())return void c(n);if(!e.active())return;t.add(o);let r=u(o),l=()=>{t.delete(o)};return void m(o,()=>{let e=u(o);return o.classList.contains("solved")?"solved":e>r?"failed":null},t=>{l(),"failed"===t?e.failed():(e.solved(o),p(o)&&e.courseCompleted())},l)}let f=s.closest(".lia-quiz__hint");if(f&&!f.disabled){let t=f.closest(i);if(!t||!t.classList.contains("open"))return;if(o.has(t)||!e.useHint())return void c(n);if(!e.active())return;o.add(t);let r=d(t),l=()=>{o.delete(t)};return void m(t,()=>{let e=d(t)-r;return e>0?e:null},t=>{l(),e.hint(t)},l)}let g=s.closest(a);if(g&&!g.disabled){let t=g.closest(i);if(!t||!t.classList.contains("open"))return;e.useResolve()||c(n)}},!0)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"1O7ju":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"ResourceStore",()=>d);var l=e("./storage.ts"),i=e("./types.ts");function a(e,t){if(!Number.isFinite(e)||e<0)throw TypeError(`${t} muss eine nichtnegative Zahl sein.`);return Math.floor(e)}function s(e){return{...e,collectedChests:[...e.collectedChests]}}function c(){return{version:1,collected:{gold:[],diamonds:[],energy:[]}}}function u(e){return i.RESOURCE_KINDS.includes(e)}class d{constructor(){this.enabled=!1,this.current=(0,l.loadResources)(),this.chestRewards=(0,l.loadChestRewards)()??c(),this.reconcileChestRewards()}configure(e,t,o){let n=a(e,"Gold"),r=a(t,"Diamanten"),i=void 0===o?null:a(o,"Energie");return this.current&&this.current.initialGold===n&&this.current.initialDiamonds===r&&this.current.initialEnergy===i||(this.current={version:1,initialGold:n,initialDiamonds:r,initialEnergy:i,gold:n,diamonds:r,energy:i,collectedChests:[]},this.chestRewards=c(),(0,l.saveResources)(this.current),(0,l.saveChestRewards)(this.chestRewards)),this.enabled=!0,s(this.current)}spend(e){if(!this.enabled||!this.current)return!0;if("energy"===e){if(null===this.current.energy)return!0;if(this.current.energy<=0)return!1;this.current.energy-=1}else{if(this.current[e]<=0)return!1;this.current[e]-=1}return(0,l.saveResources)(this.current),!0}collectChest(e,t="gold",o=1){let n=e.trim();if(!n||!u(t)||!Number.isSafeInteger(o)||o<=0||!this.enabled||!this.current||this.current.collectedChests.includes(n))return!1;if("energy"===t){if(null===this.current.energy)return!1;let e=this.current.energy+o;if(!Number.isSafeInteger(e))return!1;this.current.energy=e}else{let e=this.current[t]+o;if(!Number.isSafeInteger(e))return!1;this.current[t]=e}return this.current.collectedChests.push(n),this.chestRewards.collected[t].push(n),(0,l.saveResources)(this.current),(0,l.saveChestRewards)(this.chestRewards),!0}classifyCollectedChest(e,t){let o=e.trim();if(!o||!u(t)||!this.current?.collectedChests.includes(o))return!1;for(let e of i.RESOURCE_KINDS)if(this.chestRewards.collected[e].includes(o))return!1;return this.chestRewards.collected[t].push(o),(0,l.saveChestRewards)(this.chestRewards),!0}collectedChestCounts(){return{gold:this.chestRewards.collected.gold.length,diamonds:this.chestRewards.collected.diamonds.length,energy:this.chestRewards.collected.energy.length}}isChestCollected(e){return!!this.current?.collectedChests.includes(e.trim())}state(){return this.enabled&&this.current?s(this.current):null}reconcileChestRewards(){let e=new Set(this.current?.collectedChests??[]),t=new Set,o=!1;for(let n of i.RESOURCE_KINDS){let r=this.chestRewards.collected[n].filter(n=>!e.has(n)||t.has(n)?(o=!0,!1):(t.add(n),!0));r.length!==this.chestRewards.collected[n].length&&(o=!0),this.chestRewards.collected[n]=r}o&&(0,l.saveChestRewards)(this.chestRewards)}}},{"./storage.ts":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK","./types.ts":"ijQUu"}],"7fPSc":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"normalizeSecretTitle",()=>R),r.export(o,"nextPublicSection",()=>j),r.export(o,"publicFallbackSection",()=>N),r.export(o,"permitPortalSlideNavigation",()=>et),r.export(o,"installSecretSlides",()=>eu);var l=e("./course-chests.ts"),i=e("./course-identity.ts"),a=e("./slide-activity.ts"),s=e("./slide-navigation.ts");let c="lia-loot-secret-slide",u="lia-input-search",d="lia-loot-secret-slide-status",h="loot-secret-slide-link",f="lia-loot-secret-slide-permit:v1",p=new Set,m=new Map,g=null,v=null,b=null,y=null,w=null,k=!1,x="pending",S=!1,E=!1,C=null,L=null,A=null,_=null,I=null,T=null;function R(e){return e.normalize("NFKC").replace(/\s+/gu," ").trim().toLocaleLowerCase("de-DE")}function j(e,t,o,n){for(let r=o+n;r>=0&&r<t;r+=n)if(!e.has(r))return r;return null}function N(e,t,o,n){let r=null===n?-1:o>n?1:-1;return j(e,t,o,r)??j(e,t,o,1===r?-1:1)}function M(){return(0,i.liaCourseIdentity)()}function $(){try{window.sessionStorage.removeItem(f)}catch{}}function O(e){C=e;let t={course:M(),expiresAt:Date.now()+15e3,section:e};try{window.sessionStorage.setItem(f,JSON.stringify(t))}catch{}}function z(){let e=document.getElementById(d);if(e)return e;let t=document.createElement("div");return t.id=d,t.className="loot-secret-slide-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function q(e){let t=z();t.classList.remove("loot-secret-slide-status--visible"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.textContent="",window.setTimeout(()=>{t.textContent=e},0)}function D(e,t=!1){let o=z();o.classList.add("loot-secret-slide-status--visible"),o.setAttribute("role",t?"alert":"status"),o.setAttribute("aria-live",t?"assertive":"polite"),o.textContent=e}function P(){let e="complete"!==x||E?function(){let e=["main.lia-slide__content:not([hidden])",".lia-pagination",".loot-object-lock-button--local"];"complete"!==x&&e.push("#lia-toc .lia-toc__content");let t=new Set;for(let o of e)document.querySelectorAll(o).forEach(e=>{t.add(e)});return t}():new Set;for(let[o,n]of[...m])if(!e.has(o)){var t;o.inert=n.inert,"true"===o.getAttribute("aria-hidden")&&(null===(t=n.ariaHidden)?o.removeAttribute("aria-hidden"):o.setAttribute("aria-hidden",t)),"none"===o.style.pointerEvents&&(o.style.pointerEvents=n.pointerEvents),"hidden"===o.style.visibility&&(o.style.visibility=n.visibility),m.delete(o)}for(let t of e)m.has(t)||m.set(t,{ariaHidden:t.getAttribute("aria-hidden"),inert:t.inert,pointerEvents:t.style.pointerEvents,visibility:t.style.visibility}),t.inert=!0,t.setAttribute("aria-hidden","true"),t.style.pointerEvents="none",t.style.visibility="hidden";let o=document.activeElement;o instanceof HTMLElement&&[...e].some(e=>e===o||e.contains(o))&&o.blur()}function H(e){let t=e.getAttribute("href")??"",o=t;try{o=new URL(t,window.location.href).hash}catch{}let n=/^#(\d+)$/.exec(o);if(!n)return null;let r=Number(n[1])-1;return Number.isInteger(r)&&r>=0?r:null}function K(){return[...document.querySelectorAll("#lia-toc .lia-toc__content > a.lia-toc__link[href*='#']")]}function G(){return(0,a.activeLiaSection)()}function F(){let e=document.getElementById(u);return e instanceof HTMLInputElement?R(e.value):""}function V(e){return R(e.textContent??"")}function B(){let e=F();return e?K().filter(t=>{let o=H(t);return null!==o&&p.has(o)&&V(t)===e}):[]}function W(){let e=document.documentElement;e.classList.toggle("loot-secret-slide-discovering","complete"!==x),e.classList.toggle("loot-secret-slide-discovery-failed","failed"===x),e.classList.toggle("loot-secret-slide-blocked",E),v?.takeRecords()}function U(e){E=e,W(),P(),(0,a.refreshLiaSlideActivity)()}function Z(e){return"complete"===x&&(null===e||!p.has(e)||L===e)}function Y(){y=null;let{totalSections:e}=function(){let e=K(),t=F(),o=-1;for(let n of e){let e=H(n);if(null===e)continue;o=Math.max(o,e);let r=p.has(e),l=r&&""!==t&&V(n)===t;n.classList.toggle(h,r),n.classList.toggle("loot-secret-slide-link--found",l),r?n.dataset.lootSecretSection=String(e):delete n.dataset.lootSecretSection}return{links:e,totalSections:o+1}}();if("pending"===x&&S&&e>0&&null!==G()&&(x="complete"),!function(e){if("complete"!==x)return P();let t=G();if(null===t||e<=0)return U(!1);if(!p.has(t)){A=t,L=null,_=null,U(!1);return}if(L===t)return U(!1);if(C===t){C=null,L=t,A=t,_=null,$(),U(!1),T?.found(t),q("Geheimfolie geöffnet.");return}let o=N(p,e,t,A);if(null===o){console.warn("Loot: Der Kurs enthält keine öffentliche Folie; die Geheimfolie bleibt erreichbar."),L=t,A=t,U(!1);return}U(!0),_!==t&&(_=t,(0,s.navigateToLiaSection)(o,"replace"))}(e),"complete"===x){let e;W(),null!==w&&(window.clearTimeout(w),w=null),(e=z()).classList.remove("loot-secret-slide-status--visible"),e.textContent=""}P(),g?.takeRecords()}function X(){null===y&&(y=window.setTimeout(Y,0))}function Q(e){let t=H(e);if(null===t||!p.has(t))return!1;let o=B();return 1!==o.length||o[0]!==e?(q(o.length>1?"Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien.":"Gib zuerst den vollständigen Namen der Geheimfolie in die Suche ein."),!1):(G()===t&&L===t?(C=null,$()):O(t),!0)}function J(e){var t;let o=(t=e.target)instanceof Element?t:t instanceof Node?t.parentElement:null,n=o?.closest(`a.${h}`);!n||Q(n)||(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation())}function ee(e){let t="ArrowLeft"===e.key||"ArrowRight"===e.key||e.altKey&&e.shiftKey&&["n","p"].includes(e.key.toLocaleLowerCase("en-US"));if("complete"!==x&&t){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation();return}if("Enter"!==e.key||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||!(e.target instanceof HTMLInputElement)||e.target.id!==u)return;let o=B();if(0===o.length)return;if(e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),o.length>1)return void q("Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien.");let n=H(o[0]);null!==n&&Q(o[0])&&(0,s.navigateToLiaSection)(n,"push")}function et(e){return"complete"===x&&!!Number.isInteger(e)&&!(e<0)&&(p.has(e)&&O(e),!0)}function eo(e){if("complete"===x){I=null;return}if(e instanceof MouseEvent){I={kind:"mouse",startedAt:Date.now(),x:e.pageX,y:e.pageY};return}let t=e.changedTouches[0];t&&(I={kind:"touch",startedAt:Date.now(),x:t.pageX,y:t.pageY})}function en(e){let t=I;if(I=null,!t||"complete"===x)return;if(e instanceof MouseEvent){if("mouse"!==t.kind)return}else if("touch"!==t.kind)return;let o=e instanceof MouseEvent?e:e.changedTouches[0];if(!o)return;let n=o.pageX-t.x,r=o.pageY-t.y;Date.now()-t.startedAt<=300&&Math.abs(n)>=150&&100>=Math.abs(r)&&(e.cancelable&&e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation())}function er(){I=null}function el(e){for(let t of e)t.section>=0&&p.add(t.section);S=!0,Y()}function ei(e){x="failed",W(),D("Geheimfolien konnten nicht sicher geladen werden. Bitte prüfe die Kursquelle und lade den Kurs neu.",!0),P(),(0,a.refreshLiaSlideActivity)(),console.error("Loot: Geheimfolien-Initialisierung fehlgeschlagen.",e)}function ea(){let e=document.getElementById("lia-toc");e===b||(g?.disconnect(),b=e,e&&((g=new MutationObserver(X)).observe(e,{attributeFilter:["class","href","id"],attributes:!0,childList:!0,subtree:!0}),X()))}function es(e){if(!(e instanceof Element))return!1;let t="main.lia-slide__content, .lia-pagination, .loot-object-lock-button--local, #lia-toc .lia-toc__content";return e.matches(t)||null!==e.querySelector(t)}function ec(e){document.getElementById("lia-toc")!==b&&ea(),("complete"!==x||E)&&e.some(e=>[...e.addedNodes].some(es))&&X()}function eu(e){if(e&&(T=e),!k){if(k=!0,(0,a.setLiaSlideAccessGuard)(Z),(v=new MutationObserver(W)).observe(document.documentElement,{attributeFilter:["class"],attributes:!0}),W(),C=function(){try{let e=window.sessionStorage.getItem(f);if(!e)return null;let t=JSON.parse(e);if(t.course!==M()||!Number.isInteger(t.section)||t.section<0||"number"!=typeof t.expiresAt||t.expiresAt<Date.now())return $(),null;return t.section}catch{return $(),null}}(),z(),w=window.setTimeout(()=>{w=null,"pending"===x&&D("Kursnavigation wird vorbereitet …")},250),!customElements.get(c)){class e extends HTMLElement{connectedCallback(){let e;this.hidden=!0,this.setAttribute("aria-hidden","true"),null!==(e=function(e){let t=e.getAttribute("data-secret-id")??"",o=(0,a.sectionFromLootId)(t);if(null!==o)return o;let n=e.closest("main"),r=n?.parentElement;if(!n||!r)return null;let l=[...r.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(n);return l>=0?l:null}(this))&&p.add(e),X()}}customElements.define(c,e)}document.addEventListener("click",J,!0),document.addEventListener("keydown",ee,!0),document.addEventListener("input",X),document.addEventListener("touchstart",eo,{capture:!0,passive:!0}),document.addEventListener("touchend",en,{capture:!0,passive:!1}),document.addEventListener("touchcancel",er,!0),document.addEventListener("mousedown",eo,!0),document.addEventListener("mouseup",en,!0),window.addEventListener("blur",er),window.addEventListener("hashchange",X),ea(),new MutationObserver(ec).observe(document.documentElement,{childList:!0,subtree:!0}),(0,l.requireCourseSecretSlideDeclarations)().then(el).catch(ei),X()}}},{"./course-chests.ts":"2ceW6","./course-identity.ts":"g3iqo","./slide-activity.ts":"5qduG","./slide-navigation.ts":"l5CPd","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],l5CPd:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(e){if(!Number.isInteger(e)||e<0)throw RangeError("Eine LiaScript-Folie muss eine nichtnegative Section besitzen.");return`#${e+1}`}function i(e,t="push"){let o=l(e);if("push"===t){window.location.hash=o;return}try{window.location.replace(o)}catch{window.location.hash=o}}r.defineInteropFlag(o),r.export(o,"liaSlideHash",()=>l),r.export(o,"navigateToLiaSection",()=>i)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"8aUxA":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"installSlidePortals",()=>P);var l=e("./portal-visual.ts"),i=e("./secret-slides.ts"),a=e("./slide-navigation.ts"),s=e("./slide-portal-options.ts"),c=e("./slide-portal-route.ts"),u=e("./slide-activity.ts");let d="lia-loot-slide-portal",h="lia-loot-slide-portal-status",f="[data-loot-slide-portal-return]",p=!1,m=0,g=!1,v=null,b=null,y=null,w=0,k=null,x=new Set;function S(){let e=document.getElementById(h);if(e)return e;let t=document.createElement("div");return t.id=h,t.className="loot-slide-portal-status",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),document.body.appendChild(t),t}function E(e){let t=S();t.textContent="",window.setTimeout(()=>{t.textContent=e},0)}function C(e){let t=e.getAttribute("data-portal-id")?.trim();if(t&&!t.startsWith("@"))return`slide-portal:${t}`;let o=e.dataset.lootSlidePortalRuntimeId;if(o)return o;m+=1;let n=`slide-portal:runtime-${m}`;return e.dataset.lootSlidePortalRuntimeId=n,n}function L(e){let t,o=C(e),n=(0,s.parseSlidePortalOptions)(e.getAttribute("data-options")?.trim()??"","one-way"===e.getAttribute("data-default-mode")?"one-way":"two-way"),r=function(e,t){let o=(0,u.sectionFromLootId)(t);if(null!==o)return o;let n=e.closest("main.lia-slide__content"),r=n?.parentElement;if(!n||!r)return null;let l=[...r.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).indexOf(n);return l>=0?l:null}(e,o),l=n.valid&&null===r?"pending":n.valid?(0,s.validateSlidePortalTarget)(n.targetSection,r,(t=-1,document.querySelectorAll(".lia-slide__container").forEach(e=>{let o=[...e.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName).length;t=Math.max(t,o-1)}),document.querySelectorAll("#lia-toc a[href*='#']").forEach(e=>{let o=function(e){let t=e;try{t=new URL(e,window.location.href).hash}catch{}let o=/^#(\d+)$/.exec(t);if(!o)return null;let n=Number(o[1])-1;return Number.isInteger(n)&&n>=0?n:null}(e.getAttribute("href")??e.href);null!==o&&(t=Math.max(t,o))}),t>=0?t+1:null)):"missing";return{...n,portalId:o,sourceSection:r,status:l}}function A(e){return e.errors.length>0?e.errors.join(" "):"same-slide"===e.status?"Quelle und Ziel eines Portals müssen verschiedene Folien sein.":"missing"===e.status?`Die Zielfolie ${e.targetSlide??"?"} existiert nicht.`:"Die Kursfolien werden noch vorbereitet."}function _(e){let t,o,n,r=L(e),s=[r.mode,r.targetSlide??"",r.status,r.errors.join("|")].join(":");if(e.dataset.lootSlidePortalSignature===s&&e.querySelector("[data-loot-slide-portal-button]"))return;"pending"!==r.status&&(!r.valid||"valid"!==r.status)&&("pending"===r.status||x.has(r.portalId)||(x.add(r.portalId),console.warn(`Loot: Portal ${r.portalId} ist defekt. ${A(r)}`))),e.dataset.lootSlidePortalSignature=s;let c=((t=document.createElement("button")).type="button",t.className=`loot-slide-portal loot-slide-portal--${r.mode}`,t.dataset.lootSlidePortalButton=r.portalId,t.dataset.lootSlidePortalMode=r.mode,t.dataset.lootSlidePortalTarget=String(r.targetSlide??""),t.setAttribute("aria-label",function(e){if("pending"===e.status)return"Portal wird vorbereitet";if(!e.valid||"valid"!==e.status)return`Defektes Portal. ${A(e)}`;let t="one-way"===e.mode?"Einwegportal":"Zweiwegportal";return`${t} zu Folie ${e.targetSlide} \xf6ffnen`}(r)),t.disabled=o=!r.valid||"valid"!==r.status,o&&(t.classList.add("pending"===r.status?"loot-slide-portal--pending":"loot-slide-portal--broken"),t.title=A(r)),t.append((0,l.createPortalGraphic)(r.mode)),(n=document.createElement("span")).className="loot-slide-portal__number",n.setAttribute("aria-hidden","true"),n.textContent="pending"===r.status?"…":String(r.targetSlide??"?"),t.append(n),t.addEventListener("click",()=>(function(e){let t=[...document.querySelectorAll(d)].find(t=>C(t)===e);if(!t)return;let o=L(t);if(!o.valid||"valid"!==o.status||null===o.targetSection||null===o.sourceSection)return void E(A(o));if("one-way"===o.mode){var n;j(),n=o.targetSection,((0,i.permitPortalSlideNavigation)(n)?((0,a.navigateToLiaSection)(n,"replace"),O(n),q(),0):(E("Das Portal wartet, bis die Kursnavigation vorbereitet ist."),1))||E(`Einwegportal zu Folie ${o.targetSlide} ge\xf6ffnet.`);return}let r={expiresAt:Date.now()+144e5,phase:"pending",portalId:o.portalId,sourceSection:o.sourceSection,targetSection:o.targetSection,version:1};(0,i.permitPortalSlideNavigation)(o.targetSection)?(N(r),(0,a.navigateToLiaSection)(o.targetSection,"push"),O(o.targetSection),E(`Portal zu Folie ${o.targetSlide} ge\xf6ffnet.`),q()):E("Das Portal wartet, bis die Kursnavigation vorbereitet ist.")})(r.portalId)),t);if("pending"!==r.status&&(!r.valid||"valid"!==r.status)){let t=document.createElement("span");t.id=`lia-loot-slide-portal-problem-${r.portalId.replace(/[^a-zA-Z0-9_-]/gu,"-")}`,t.className="loot-slide-portal__problem",t.setAttribute("role","note"),t.textContent=`Defektes Portal: ${A(r)}`,c.setAttribute("aria-describedby",t.id),e.replaceChildren(c,t);return}e.replaceChildren(c)}function I(e){let t=[];for(let o of document.querySelectorAll(".lia-slide__container")){let n=[...o.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName);n[e]&&t.push(n[e])}return t.find(e=>!e.hidden)??t[0]??null}function T(e){document.querySelectorAll(f).forEach(t=>{e&&t.dataset.lootSlidePortalReturn===e||t.remove()})}function R(e){return`${e.portalId}:${e.sourceSection}:${e.targetSection}`}function j(){b=null,(0,c.clearSlidePortalRoute)(),T(),v?.takeRecords()}function N(e){b=e,(0,c.saveSlidePortalRoute)(e)}function M(){null!==y&&window.clearTimeout(y),y=null,w=0,k=null}function $(){y=null;let e=k;if(null===e)return;let t=I(e);if((0,u.activeLiaSection)()===e&&t&&!t.hidden){let e=t.querySelector("h1, h2, h3, h4, h5, h6")??t;e.hasAttribute("tabindex")||(e.setAttribute("tabindex","-1"),e.dataset.lootSlidePortalFocus="true"),e.focus({preventScroll:!0}),M();return}Date.now()>=w?M():y=window.setTimeout($,50)}function O(e){null!==y&&window.clearTimeout(y),k=e,w=Date.now()+2e3,y=window.setTimeout($,0)}function z(){g=!1,document.querySelectorAll(d).forEach(_),function(){var e;let t,o,n,r;if(!b)return T();if(b.expiresAt<=Date.now())return j();let s=(0,c.transitionSlidePortalRoute)(b,(0,u.activeLiaSection)());if(!s.route)return j();if(s.route.phase!==b.phase?N(s.route):b=s.route,!s.showReturn)return T();let d=R(s.route);if(T(d),[...document.querySelectorAll(f)].find(e=>e.dataset.lootSlidePortalReturn===d))return;let h=I(s.route.targetSection);h?.append((e=s.route,(t=document.createElement("aside")).className="loot-slide-portal-return",t.dataset.lootSlidePortalReturn=R(e),t.setAttribute("aria-label","Portal-Rückweg"),(o=document.createElement("span")).className="loot-slide-portal-return__label",o.textContent=`R\xfcckportal zu Folie ${e.sourceSection+1}`,(n=document.createElement("button")).type="button",n.className="loot-slide-portal loot-slide-portal--return",n.dataset.lootSlidePortalReturnButton=R(e),n.setAttribute("aria-label",`R\xfcckportal zu Folie ${e.sourceSection+1} \xf6ffnen`),n.append((0,l.createPortalGraphic)("two-way",!0)),(r=document.createElement("span")).className="loot-slide-portal__number",r.setAttribute("aria-hidden","true"),r.textContent=String(e.sourceSection+1),n.append(r),n.addEventListener("click",()=>{let t=e.sourceSection;(0,i.permitPortalSlideNavigation)(t)?(j(),(0,a.navigateToLiaSection)(t,"push"),O(t),E(`R\xfcckportal zu Folie ${t+1} ge\xf6ffnet.`)):E("Das Rückportal wartet, bis die Kursnavigation vorbereitet ist.")}),t.append(n,o),t))}(),null!==k&&null===y&&$(),v?.takeRecords()}function q(){g||(g=!0,window.setTimeout(z,0))}function D(e){let t=`${d}, ${f}, .lia-slide__container, main.lia-slide__content, #lia-toc, #lia-toc a[href*="#"]`;return e instanceof Element&&(e.matches(t)||null!==e.querySelector(t))}function P(){if(!p){if(p=!0,b=(0,c.loadSlidePortalRoute)(),S(),!customElements.get(d)){class e extends HTMLElement{static get observedAttributes(){return["data-portal-id","data-options","data-default-mode"]}connectedCallback(){_(this),q()}attributeChangedCallback(){this.isConnected&&_(this)}}customElements.define(d,e)}(0,u.observeLiaSlideActivity)(q),(v=new MutationObserver(e=>{e.some(e=>"attributes"===e.type?e.target instanceof HTMLAnchorElement&&null!==e.target.closest("#lia-toc"):[...e.addedNodes,...e.removedNodes].some(D))&&q()})).observe(document.documentElement,{attributeFilter:["href"],attributes:!0,childList:!0,subtree:!0}),z()}}},{"./portal-visual.ts":"5qwxU","./secret-slides.ts":"7fPSc","./slide-navigation.ts":"l5CPd","./slide-portal-options.ts":"ffEjw","./slide-portal-route.ts":"kLbAb","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5qwxU":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(e,t=!1){let o=document.createElementNS("http://www.w3.org/2000/svg","svg");return o.setAttribute("viewBox","0 0 64 72"),o.setAttribute("shape-rendering","crispEdges"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-slide-portal__graphic"),o.innerHTML=`
    <rect class="loot-slide-portal__shadow" x="8" y="65" width="50" height="5"/>
    <path class="loot-slide-portal__outline" d="M8 66V28h4V18h6V12h8V8h16v4h8v6h6v10h4v38H48V31h-4v-7h-6v-4H26v4h-6v7h-4v35H8Z"/>
    <path class="loot-slide-portal__rim" d="M12 64V29h4V19h7v-5h22v5h7v10h4v35h-8V31h-4v-7h-6v-3H27v3h-7v7h-4v33h-4Z"/>
    <path class="loot-slide-portal__core" d="M17 64V33h4v-8h7v-3h10v3h6v8h4v31H17Z"/>
    <rect class="loot-slide-portal__spark loot-slide-portal__spark--one" x="24" y="27" width="4" height="4"/>
    <rect class="loot-slide-portal__spark loot-slide-portal__spark--two" x="40" y="48" width="4" height="4"/>
    ${"one-way"===e?'<path class="loot-slide-portal__arrow" d="M20 31h17v-7l11 12-11 12v-7H20V31Z"/>':t?'<path class="loot-slide-portal__arrow" d="M46 27H29v-7L18 32l11 12v-7h17V27Zm-28 22h17v7l11-12-11-12v7H18v10Z"/>':'<path class="loot-slide-portal__arrow" d="M18 27h17v-7l11 12-11 12v-7H18V27Zm28 22H29v7L18 44l11-12v7h17v10Z"/>'}
  `,o}r.defineInteropFlag(o),r.export(o,"createPortalGraphic",()=>l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],ffEjw:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"parseSlidePortalOptions",()=>a),r.export(o,"validateSlidePortalTarget",()=>s);let l=new Set(["einweg","einbahn","einbahnstrasse","oneway","one-way"]),i=new Set(["hinundher","hin-und-her","zweiweg","bidirektional","twoway","two-way"]);function a(e,t="two-way"){let o=("@0"===e.trim()?"":e).split(";").map(e=>e.trim()).filter(Boolean),n=[],r=[],s=new Set;for(let e of o){if(/^\d+$/u.test(e)){r.push(Number(e));continue}let t=function(e){let t=e.normalize("NFKD").replace(/\p{M}/gu,"").trim().toLocaleLowerCase("de-DE").replace(/ß/gu,"ss").replace(/\s+/gu,"");return l.has(t)?"one-way":i.has(t)?"two-way":null}(e);if(t){s.add(t);continue}n.push(`Unbekannte Portaloption: ${e}`)}1!==r.length&&n.push("Ein Portal benötigt genau eine positive Foliennummer.");let c=1===r.length?r[0]:null;null!==c&&(!Number.isSafeInteger(c)||c<1)&&n.push("Die Zielfolie muss eine positive, sichere Ganzzahl sein."),s.size>1&&n.push("Ein Portal kann nicht zugleich Einweg- und Zweiwegportal sein.");let u=s.values().next().value,d=null!==c&&Number.isSafeInteger(c)&&c>=1?c-1:null,h=0===n.length?d:null;return{errors:n,mode:u??t,targetSection:h,targetSlide:c,valid:null!==h}}function s(e,t,o){return null===e||!Number.isInteger(e)||e<0?"missing":null!==t&&e===t?"same-slide":null===o||o<1?"pending":e<o?"valid":"missing"}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],kLbAb:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"normalizeSlidePortalRoute",()=>a),r.export(o,"transitionSlidePortalRoute",()=>s),r.export(o,"loadSlidePortalRoute",()=>c),r.export(o,"saveSlidePortalRoute",()=>u),r.export(o,"clearSlidePortalRoute",()=>d);var l=e("./course-identity.ts");function i(){return`lia-loot:slide-portal-route:v1:${encodeURIComponent((0,l.liaCourseIdentity)())}`}function a(e,t=Date.now()){return e&&"object"==typeof e?1!==e.version||"string"!=typeof e.portalId||0===e.portalId.trim().length||!Number.isInteger(e.sourceSection)||0>Number(e.sourceSection)||!Number.isInteger(e.targetSection)||0>Number(e.targetSection)||e.sourceSection===e.targetSection||"pending"!==e.phase&&"arrived"!==e.phase||"number"!=typeof e.expiresAt||!Number.isFinite(e.expiresAt)||e.expiresAt<=t?null:{expiresAt:e.expiresAt,phase:e.phase,portalId:e.portalId.trim(),sourceSection:Number(e.sourceSection),targetSection:Number(e.targetSection),version:1}:null}function s(e,t){return null===t?{route:e,showReturn:!1}:"pending"===e.phase?t===e.sourceSection?{route:e,showReturn:!1}:t===e.targetSection?{route:{...e,phase:"arrived"},showReturn:!0}:{route:null,showReturn:!1}:t===e.targetSection?{route:e,showReturn:!0}:{route:null,showReturn:!1}}function c(){try{let e=window.sessionStorage.getItem(i());if(!e)return null;let t=a(JSON.parse(e));return t||window.sessionStorage.removeItem(i()),t}catch{return null}}function u(e){try{window.sessionStorage.setItem(i(),JSON.stringify(e))}catch{}}function d(){try{window.sessionStorage.removeItem(i())}catch{}}},{"./course-identity.ts":"g3iqo","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"5gsVV":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"HighscoreStore",()=>s);var l=e("./score"),i=e("./storage");function a(e){return Number.isFinite(e)?Math.max(0,Math.floor(e)):0}class s{configure(e,t=Date.now()){this.current&&(0,l.sameConfig)(this.current.config,e)||(this.current={version:1,config:e,startedAt:t,failedChecks:0,hintsUsed:0,finishedAt:null,finalScore:null},(0,i.saveState)(this.current))}isRunning(){return null!==this.current&&null===this.current.finishedAt}fail(e=1){this.isRunning()&&this.current&&(this.current.failedChecks+=a(e),(0,i.saveState)(this.current))}hint(e=1){this.isRunning()&&this.current&&(this.current.hintsUsed+=a(e),(0,i.saveState)(this.current))}score(e=Date.now()){return this.current?null!==this.current.finalScore?this.current.finalScore:(0,l.calculateScore)(this.current.config,this.current,e):null}finish(e=Date.now()){if(!this.current)return null;if(null!==this.current.finalScore)return this.current.finalScore;let t=(0,l.calculateScore)(this.current.config,this.current,e);return this.current.finishedAt=e,this.current.finalScore=t,(0,i.saveState)(this.current),t}reset(e=Date.now()){if(!this.current)return void(0,i.clearState)();let t={...this.current.config};(0,i.clearState)(),this.current=null,this.configure(t,e)}state(){var e;return this.current?{...e=this.current,config:{...e.config}}:null}constructor(){this.current=(0,i.loadState)()}}},{"./score":"abltm","./storage":"8s1BG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"7riKx":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"TIMER_START_SELECTOR",()=>l),r.export(o,"installTimerEventTracking",()=>i);let l=".lia-sol-timer-startbtn[data-sol-timer-ui='solution'], .lia-sol-timer-startbtn[data-sol-timer-ui='hint']";function i(e){let t=new WeakSet;document.addEventListener("click",o=>{if(o.defaultPrevented)return;let n=function(e){for(let t of[..."function"==typeof e.composedPath?e.composedPath():[],e.target]){let e=t&&"object"==typeof t?1===t.nodeType?t:t.parentElement?t.parentElement:null:null,o=e?.closest(l);if(o)return o}return null}(o);if(!(!n||!1===n.isConnected||n.disabled||"true"===n.getAttribute("aria-disabled")||n.closest('[inert], [hidden], [aria-hidden="true"]')||function(e){let t=e.ownerDocument?.defaultView;if(!t)return!1;try{for(let o=e;o;o=o.parentElement){let e=t.getComputedStyle(o);if("none"===e.display||"hidden"===e.visibility||"collapse"===e.visibility||"none"===e.pointerEvents||0===Number(e.opacity))return!0}}catch{return!0}return!1}(n))){if(t.has(n)||!e.useStart()){var r;return void((r=o).preventDefault(),r.stopImmediatePropagation())}t.add(n)}},!0)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"4oJ1H":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"parseTreasureChestOptions",()=>D),r.export(o,"courseChestUnitCount",()=>P),r.export(o,"courseChestUnitCounts",()=>H),r.export(o,"templatePortalGeometry",()=>Y),r.export(o,"refreshTreasureChests",()=>et),r.export(o,"installTreasureChests",()=>eo);var l=e("./course-chests.ts"),i=e("./collectible-visibility.ts"),a=e("./concealment.ts"),s=e("./exploration-options.ts"),c=e("./exploration.ts"),u=e("./slide-activity.ts"),d=e("./surface-targets.ts"),h=e("./template-targets.ts");let f="lia-loot-chest",p="data-loot-chest-portal",m="data-loot-chest-tray",g=new Map,v=new Map,b=new Set,y=new Map,w=new Map,k=new Set,x=new Set,S=new Set,E=new(0,i.CollectibleVisibilityGate),C=null,L=[],A=null,_=0,I="idle",T=!1,R=!1,j=!1;function N(e){e?.hasAttribute(m)&&!e.querySelector(`[${p}]`)&&e.remove()}function M(e){if(!e)return;let t=e.parentElement;e.remove(),N(t)}function $(e,t,o,n,r=document){let l=r.createElement("button");return l.type="button",l.className="loot-treasure-chest","diamonds"===o?l.classList.add("loot-treasure-chest--diamonds"):"energy"===o&&l.classList.add("loot-treasure-chest--energy"),l.dataset.lootChestButton=e,l.dataset.lootChestLocation=t,l.dataset.lootChestReward=o,l.dataset.lootChestAmount=String(n),l.setAttribute("aria-label",1===n?"diamonds"===o?"Diamanttruhe öffnen und einen Diamanten erhalten":"energy"===o?"Energiekiste öffnen und einen Energiepunkt erhalten":"Schatztruhe öffnen und eine Goldmünze erhalten":"diamonds"===o?"Diamanttruhe öffnen und "+n+" Diamanten erhalten":"energy"===o?"Energiekiste öffnen und "+n+" Energiepunkte erhalten":"Schatztruhe öffnen und "+n+" Goldmünzen erhalten"),l.append(function(e,t=document){let o=t.createElementNS("http://www.w3.org/2000/svg","svg");o.setAttribute("viewBox","0 0 64 56"),o.setAttribute("shape-rendering","crispEdges"),o.setAttribute("aria-hidden","true"),o.classList.add("loot-treasure-chest-graphic"),"diamonds"===e?o.classList.add("loot-treasure-chest-graphic--diamonds"):"energy"===e&&o.classList.add("loot-treasure-chest-graphic--energy");let n="diamonds"===e?`
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
    ${n}
    <rect class="loot-chest-outline" x="12" y="50" width="8" height="4"/>
    <rect class="loot-chest-outline" x="44" y="50" width="8" height="4"/>
  `,o}(o,r),function(e,t,o=document){let n=o.createElement("span");return n.className="loot-treasure-reward","diamonds"===e?n.classList.add("loot-treasure-reward--diamonds"):"energy"===e&&n.classList.add("loot-treasure-reward--energy"),n.setAttribute("aria-hidden","true"),n.innerHTML="diamonds"===e?'<span class="loot-treasure-reward__gem"></span><span>+'+t+"</span>":"energy"===e?'<span class="loot-treasure-reward__energy"></span><span>+'+t+"</span>":'<span class="loot-treasure-reward__coin"></span><span>+'+t+"</span>",n}(o,n,r)),l.addEventListener("click",()=>{if(!(!C||k.has(e))&&(x.has(e)||(X(),l.isConnected&&x.has(e)))){if(!C.active(o)){let e;return void(l.querySelector(".loot-treasure-requirement")?.remove(),(e=l.ownerDocument.createElement("span")).className="loot-treasure-requirement",e.setAttribute("role","status"),e.textContent="energy"===o?"Zuerst Energie mit @Ressourcen(Gold, Diamanten, Energie) festlegen":"Zuerst @Ressourcen(...) ausführen",l.appendChild(e),l.classList.remove("loot-treasure-chest--waiting"),l.offsetWidth,l.classList.add("loot-treasure-chest--waiting"),window.setTimeout(()=>{e.remove(),l.classList.remove("loot-treasure-chest--waiting")},2200))}if(k.add(e),!C.collect(e,o,n)){k.delete(e),et();return}l.disabled=!0,l.classList.add("loot-treasure-chest--opened"),window.setTimeout(()=>{k.delete(e);let t=l.closest(`[${p}]`);t?M(t):l.remove(),Q()},650)}}),l}function O(e){let t=e.getAttribute("data-chest-id")?.trim();if(t&&!t.startsWith("@"))return t;let o=e.dataset.lootRuntimeId;if(o)return o;_+=1;let n=`runtime-${_}`;return e.dataset.lootRuntimeId=n,n}function z(e){return(0,d.resolveSurfaceTarget)(e)??(0,h.resolveTemplateTarget)(e)}let q=/^[+-]?(?:(?:\d+(?:[.,]\d*)?)|(?:[.,]\d+))(?:e[+-]?\d+)?$/iu;function D(e){let t=function(e){let t=e.split(";").map(e=>e.trim()).filter(Boolean),o=[],n=1;if(t[0]&&q.test(t[0])){let e=t.shift(),r=Number(e);/^\d+$/u.test(e)&&Number.isSafeInteger(r)&&!(r<=0)?n=r:o.push("Ungültige Truhenmenge: "+e+". Erwartet wird eine positive ganze Zahl.")}return t.filter(e=>q.test(e)).length>0&&o.push("Die Truhenmenge muss als erste Option stehen und darf nur einmal angegeben werden."),{amount:n,errors:o,options:t.filter(e=>!q.test(e)).join("; ")}}(e),o=(0,i.parseCollectibleOptions)(t.options),n=(0,a.extractConcealmentOptions)(o.values),r=(0,s.parseExplorationOptions)(n.values),l=[...t.errors,...o.errors,...n.errors,...r.values.filter(e=>null===z(e)).map(e=>`Unbekanntes Truhenziel oder Option: ${e}`)],c=[...new Set(r.values.map(e=>z(e)).filter(e=>null!==e))],u=o.hasOptions||null!==n.mode||r.layers.length>0,d=""===t.options.trim()||u&&0===r.values.length;return{amount:t.amount,concealment:n.mode,errors:l,inline:d,layers:r.layers,placements:c,valid:0===l.length,visibility:o.rule}}function P(e,t=()=>!0){let o=0;for(let n of e){let e=D(n.placement);e.valid&&(o+=e.inline?1:new Set(e.placements.filter(e=>!(0,h.isTemplateTarget)(e)||t(e))).size)}return o}function H(e,t=()=>!0){let o={gold:0,diamonds:0,energy:0};for(let n of e)o[n.reward]+=P([n],t);return o}function K(e,t){return`${e}:${t.reward}:${t.amount}:${[...t.placements].sort().join(";")}:${(0,i.collectibleVisibilitySignature)(t.visibility)}:${t.concealment??"none"}:${t.layers.map(e=>`${e.kind}-${e.concealment??"visible"}`).join(";")}`}function G(e,t){S.has(e)||(S.add(e),console.warn(`Loot: Fund ${e} bleibt wegen ung\xfcltiger Optionen verborgen. ${t.join(" ")}`))}function F(e,t){let o=t.sourceSection,n=null===o?null:K(o,t),r=w.get(e);if(null!==n&&r===n)return void g.delete(e);r&&w.delete(e);let l=null===n?0:y.get(n)??0;if(null!==n&&function(e){let t=0;for(let o of w.values())o===e&&(t+=1);return t}(n)<l){w.set(e,n),g.delete(e);return}g.set(e,t)}function V(e,t){for(let e of b)g.delete(e);for(let t of(b.clear(),y.clear(),w.clear(),e)){let e=D(t.placement);if(!e.valid){G(t.baseId,e.errors);continue}let o=new Set(e.placements);if(0===o.size)continue;let n={amount:e.amount,concealment:e.concealment,layers:e.layers,placements:o,reward:t.reward,sourceSection:t.section,visibility:e.visibility};for(let e of(g.set(t.baseId,n),o))C?.classify?.(`${t.baseId}:${e}`,t.reward);b.add(t.baseId);let r=K(t.section,n);y.set(r,(y.get(r)??0)+1)}for(let[e,o]of(I="complete",C?.catalogReady(H(t)),v))F(e,o);v.clear(),Q()}function B(e){let t,o,n,r,l,i=(t=O(e),n="diamonds"===(o=e.getAttribute("data-reward")?.trim().toLowerCase())||"diamond"===o||"gems"===o||"diamant"===o||"diamanten"===o?"diamonds":"energy"===o||"energie"===o||"power"===o||"bolt"===o?"energy":"gold",{amount:(l=D("@0"===(r=e.getAttribute("data-placement")?.trim()??"")?"":r)).amount,baseId:t,concealment:l.concealment,errors:l.errors,inline:l.inline,layers:l.layers,placements:l.placements,reward:n,sourceHost:e,sourceSection:(0,u.sectionFromLootId)(t),valid:l.valid,visibility:l.visibility});if(i.valid)if(i.inline)v.delete(i.baseId),g.delete(i.baseId),w.delete(i.baseId),e.classList.remove("loot-treasure-host--portal-source"),0===i.layers.length&&(0,c.clearHostRevealLayers)(e);else{let t={amount:i.amount,concealment:i.concealment,layers:i.layers,placements:new Set(i.placements),reward:i.reward,sourceHost:i.sourceHost,sourceSection:i.sourceSection,visibility:i.visibility};"complete"===I?F(i.baseId,t):v.set(i.baseId,t),(0,c.clearHostRevealLayers)(e),(0,a.setHostConcealment)(e,null),e.classList.add("loot-treasure-host--portal-source"),e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren()}else G(i.baseId,i.errors),v.delete(i.baseId),g.delete(i.baseId),w.delete(i.baseId),(0,c.clearHostRevealLayers)(e),(0,a.setHostConcealment)(e,null),e.classList.add("loot-treasure-host--portal-source"),e.setAttribute("aria-hidden","true"),e.childElementCount>0&&e.replaceChildren();return i}function W(e,t,o,n){return[...e.querySelectorAll("[data-loot-chest-button]")].find(e=>e.dataset.lootChestButton===t&&e.dataset.lootChestReward===o&&e.dataset.lootChestAmount===String(n))??null}function U(e){for(let t of(0,h.templateDocumentCandidates)(document)){let o=[...t.querySelectorAll(`[${p}]`)].find(t=>t.dataset.lootChestPortal===e);if(o)return o}return null}function Z(e,t,o){e.style[t]!==o&&(e.style[t]=o)}function Y(e,t,o,n="overlay"){let r=Math.min(58,Math.max(44,e.width)),l=Math.min(51,Math.max(40,.875*r)),i=Math.max(4,t-r-4),a=Math.max(4,o-l-4),s="below"===n?e.left+(e.width-r)/2:e.right-r-4,c="below"===n?e.bottom+8:e.bottom-l-4;return{height:l,left:Math.max(4,Math.min(s,i)),top:Math.max(4,Math.min(c,a)),width:r}}function X(){if(C){for(let e of(x.clear(),document.querySelectorAll(f))){if((0,c.hostIsRevealBlocked)(e,!1)){let t=O(e);v.delete(t),g.delete(t),w.delete(t);continue}let t=B(e);t.valid&&t.inline&&function(e,t,o){if(!C)return;C.classify?.(t,o.reward);let n=k.has(t);if(C.collected(t)&&!n){x.delete(t),E.forget(`chest:${o.baseId}`),(0,c.clearHostRevealLayers)(e),(0,a.setHostConcealment)(e,null),e.childElementCount>0&&e.replaceChildren();return}let r=E.visible(`chest:${o.baseId}`,o.visibility,(0,u.sourceSlideIsActive)(o.sourceSection,e),Q);if(!r&&!n){(0,c.clearHostRevealLayers)(e),(0,a.setHostConcealment)(e,null),e.childElementCount>0&&e.replaceChildren(),x.delete(t);return}let l=(0,c.setHostRevealLayers)(e,t,o.layers);n||W(l,t,o.reward,o.amount)||((0,a.setHostConcealment)(l,null),l.replaceChildren($(t,"inline",o.reward,o.amount))),(0,a.setHostConcealment)(l,o.concealment),r&&!(0,c.hostIsRevealBlocked)(e)?x.add(t):x.delete(t)}(e,`${t.baseId}:inline`,t)}!function(){if(!C)return;let e=new Set;for(let[t,o]of g){let n=E.visible(`chest:${t}`,o.visibility,(0,u.sourceSlideIsActive)(o.sourceSection,o.sourceHost),Q);for(let r of o.placements){let l=`${t}:${r}`;C.classify?.(l,o.reward);let i=k.has(l),s=C.collected(l)&&!i;if(!n&&!i){x.delete(l),M(U(l));continue}e.add(l);let f=U(l);s?(M(f),f=null):i||(f=function(e,t,o){let n=function(e,t){if((0,h.isTemplateTarget)(e)){let o=(0,h.findTemplateTarget)(e,"chest",document);return o&&("slide"!==(0,h.templateTargetDefinition)(e).scope||(0,u.sourceSlideIsActive)(t.sourceSection,o.root))?{anchor:o.chestAnchor,container:o.chestContainer??o.chestAnchor.ownerDocument.body,grouped:!!o.chestContainer,template:!0,templateLayout:o.chestContainer?"inside":"floating",templatePosition:o.chestContainer?null:o.chestPosition??"overlay"}:null}if(!(0,d.isSurfaceTarget)(e))return null;let o=(0,d.surfaceTargetElement)(e,document);return o?{anchor:o,container:o,grouped:(0,d.surfaceTargetIsGrouped)(e),template:!1,templateLayout:null,templatePosition:null}:null}(t,o),r=U(e);if(!n)return M(r),null;(r?.dataset.lootChestReward!==o.reward||r?.dataset.lootChestAmount!==String(o.amount))&&(M(r),r=null);let l=n.grouped?function(e,t){let o=`:scope > [${m}="${t}"]`,n=e.container.querySelector(o);if(n)return n;let r=e.container.ownerDocument,l=e.container.matches("ul, ol"),i=r.createElement(l?"li":"div");return i.className=["loot-chest-tray",e.template?"loot-chest-tray--template":"loot-chest-tray--support"].join(" "),i.dataset.lootChestTray=t,i.setAttribute("role","group"),i.setAttribute("aria-label","Versteckte Funde"),e.container.appendChild(i),i}(n,t):n.container;if(!r){let i=l.ownerDocument,a=!n.template&&l.matches("ul, ol");(r=i.createElement(a?"li":"div")).className=`loot-chest-placement loot-chest-placement--${t}`,r.dataset.lootChestPortal=e,r.dataset.lootChestLocation=t,r.dataset.lootChestReward=o.reward,r.dataset.lootChestAmount=String(o.amount),n.template&&(r.dataset.lootChestTemplateTarget=t),a&&(r.classList.add("nav__item","lia-support-menu__item"),r.setAttribute("role","none"))}if(r.parentElement!==l){let e=r.parentElement;l.appendChild(r),N(e)}r.classList.toggle("loot-chest-placement--template","floating"===n.templateLayout),r.classList.toggle("loot-chest-placement--template-inside","inside"===n.templateLayout),r.classList.toggle("loot-chest-placement--template-below","floating"===n.templateLayout&&"below"===n.templatePosition),n.templatePosition?r.dataset.lootChestTemplatePosition=n.templatePosition:delete r.dataset.lootChestTemplatePosition;let i=(0,c.setHostRevealLayers)(r,e,o.layers);if(W(i,e,o.reward,o.amount)||((0,a.setHostConcealment)(i,null),i.replaceChildren($(e,t,o.reward,o.amount,r.ownerDocument))),(0,a.setHostConcealment)(i,o.concealment),"floating"===n.templateLayout)!function(e,t,o){let n=t.getBoundingClientRect(),r=t.ownerDocument.defaultView??window,l=t.isConnected&&n.width>0&&n.height>0&&n.right>0&&n.bottom>0&&n.left<r.innerWidth&&n.top<r.innerHeight;if(e.hidden===l&&(e.hidden=!l),!l)return;let i=Y(n,r.innerWidth,r.innerHeight,o);Z(e,"left",`${i.left}px`),Z(e,"top",`${i.top}px`),Z(e,"width",`${i.width}px`),Z(e,"height",`${i.height}px`)}(r,n.anchor,n.templatePosition??"overlay");else if("inside"===n.templateLayout)for(let e of(r.hidden=!1,["height","left","top","width"]))Z(r,e,"");return r}(l,r,o)),!n||s||i||!f||(0,c.hostIsRevealBlocked)(f)?x.delete(l):x.add(l)}}for(let t of function(){let e=[];for(let t of(0,h.templateDocumentCandidates)(document))for(let o of t.querySelectorAll(`[${p}]`))e.includes(o)||e.push(o);return e}()){let o=t.dataset.lootChestPortal;o&&(e.has(o)||k.has(o))||M(t)}}(),function(){for(let e of L)e.takeRecords()}()}}function Q(){null===A&&(A=window.setTimeout(()=>{A=null,X()},0))}function J(e){e.length>0&&Q()}class ee extends HTMLElement{static get observedAttributes(){return["data-chest-id","data-placement","data-reward"]}connectedCallback(){(0,c.hostIsRevealBlocked)(this,!1)||B(this),Q()}attributeChangedCallback(){this.isConnected&&(x.clear(),(0,c.hostIsRevealBlocked)(this,!1)||B(this),Q())}}function et(){X()}function eo(e){if(C=e,document.getElementById("lia-loot-treasure-chest")?.remove(),"idle"===I&&(I="pending",(0,l.discoverCourseChests)().then(({declarations:e,catalog:t})=>V(e,t)).catch(()=>V([],[]))),T||(T=!0,(0,u.observeLiaSlideActivity)(()=>{for(let e of(x.clear(),Q(),[80,250,650]))window.setTimeout(Q,e)})),j||(j=!0,document.addEventListener(c.REVEAL_CHANGED_EVENT,Q)),customElements.get(f)||customElements.define(f,ee),0===L.length)for(let e of(0,h.templateDocumentCandidates)(document)){let t=new(e.defaultView?.MutationObserver??MutationObserver)(J);t.observe(e.documentElement,{attributeFilter:["aria-hidden","aria-pressed","class","data-active","data-open","hidden","style"],attributes:!0,childList:!0,subtree:!0}),L.push(t)}if(!R){R=!0;let e=new Set;for(let t of(0,h.templateDocumentCandidates)(document)){let o=t.defaultView;!o||e.has(o)||(e.add(o),o.addEventListener("resize",Q,{passive:!0}),o.addEventListener("scroll",Q,{capture:!0,passive:!0}),o.visualViewport?.addEventListener("resize",Q,{passive:!0}),o.visualViewport?.addEventListener("scroll",Q,{passive:!0}))}}et()}},{"./course-chests.ts":"2ceW6","./collectible-visibility.ts":"8e3cc","./concealment.ts":"8YWP0","./slide-activity.ts":"5qduG","./surface-targets.ts":"dYwdL","./template-targets.ts":"9odGA","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK","./exploration-options.ts":"fw9xf","./exploration.ts":"5BeJ3"}],eyg0o:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"isToolKind",()=>a),r.export(o,"ExplorationStore",()=>h);var l=e("./course-identity.ts"),i=e("./exploration-options.ts");function a(e){return i.TOOL_KINDS.includes(e)}function s(e){if(!Array.isArray(e)||!e.every(e=>"string"==typeof e&&e.trim().length>0))return null;let t=e.map(e=>e.trim());return new Set(t).size===t.length?t:null}function c(){return`lia-loot:exploration:v1:${encodeURIComponent((0,l.liaCourseIdentity)())}`}function u(e){try{window.sessionStorage.setItem(c(),JSON.stringify(e))}catch{}}function d(e){return e.trim()||null}class h{collectTool(e){return!(!a(e)||this.current.collectedTools.includes(e))&&(this.current.collectedTools.push(e),u(this.current),!0)}isToolCollected(e){return a(e)&&this.current.collectedTools.includes(e)}setActiveTool(e){return null===e?null!==this.active&&(this.active=null,!0):!!this.isToolCollected(e)&&this.active!==e&&(this.active=e,!0)}activeTool(){return this.active}digLayer(e){return this.recordId(e,this.current.dugLayers)}isLayerDug(e){return this.hasId(e,this.current.dugLayers)}findConcealedObject(e,t){return this.recordId(e,"dust"===t?this.current.foundDustObjects:this.current.foundInvisibleObjects)}isConcealedObjectFound(e,t){return this.hasId(e,"dust"===t?this.current.foundDustObjects:this.current.foundInvisibleObjects)}waterPlant(e){return this.recordId(e,this.current.wateredPlants)}isPlantWatered(e){return this.hasId(e,this.current.wateredPlants)}openPlant(e){let t=d(e);return!(!t||!this.current.wateredPlants.includes(t)||this.current.openedPlants.includes(t))&&(this.current.openedPlants.push(t),u(this.current),!0)}isPlantOpened(e){return this.hasId(e,this.current.openedPlants)}state(){var e;return{version:1,collectedTools:[...(e=this.current).collectedTools],dugLayers:[...e.dugLayers],foundDustObjects:[...e.foundDustObjects],foundInvisibleObjects:[...e.foundInvisibleObjects],wateredPlants:[...e.wateredPlants],openedPlants:[...e.openedPlants]}}recordId(e,t){let o=d(e);return!(!o||t.includes(o))&&(t.push(o),u(this.current),!0)}hasId(e,t){let o=d(e);return null!==o&&t.includes(o)}constructor(){this.current=function(){try{let e=window.sessionStorage.getItem(c());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||!Array.isArray(e.collectedTools)||!e.collectedTools.every(a))return null;let t=[...e.collectedTools];if(new Set(t).size!==t.length)return null;let o=s(e.dugLayers),n=s(e.foundDustObjects??[]),r=s(e.foundInvisibleObjects??[]),l=s(e.wateredPlants),i=s(e.openedPlants);if(!o||!n||!r||!l||!i)return null;let c=new Set(l);return i.every(e=>c.has(e))?{version:1,collectedTools:t,dugLayers:o,foundDustObjects:n,foundInvisibleObjects:r,wateredPlants:l,openedPlants:i}:null}(t)}catch{return null}}()??{version:1,collectedTools:[],dugLayers:[],foundDustObjects:[],foundInvisibleObjects:[],wateredPlants:[],openedPlants:[]},this.active=null}}},{"./course-identity.ts":"g3iqo","./exploration-options.ts":"fw9xf","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],iooeB:[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"LOOT_IF_CHANGED_EVENT",()=>p),r.export(o,"lootIfAuthoredRuntimeId",()=>L),r.export(o,"lootIfQuizInputTrack",()=>O),r.export(o,"lootIfQuizRendererAnchor",()=>z),r.export(o,"lootIfQuizId",()=>D),r.export(o,"lootIfQuizCheckIsReachable",()=>H),r.export(o,"refreshLootIf",()=>B),r.export(o,"recordLootIfQuizSolved",()=>W),r.export(o,"recordLootIfSecretSlideVisited",()=>U),r.export(o,"installLootIf",()=>Q);var l=e("./exploration.ts"),i=e("./loot-if-options.ts"),a=e("./quiz-events.ts"),s=e("./range-gate.ts"),c=e("./slide-activity.ts");let u="lia-loot-if-start",d='a[href="#lia-loot-if-end"]',h="data-loot-if-range-blocked",f="data-loot-if-spawned",p="lia-loot:loot-if-changed",m=null,g=null,v=[],b=null,y=!1,w=0,k=!1,x=!1,S=new Set,E=new WeakMap,C=new Set;function L(e){let t=e?.trim()??"";return t&&!t.startsWith("@")?t:null}function A(e){let t=L(e.getAttribute("data-loot-if-id"));if(t)return{errors:[],id:t,valid:!0};let o="Die data-loot-if-id fehlt oder enthaelt einen nicht expandierten Makro-Platzhalter.",n=E.get(e);if(n)return{errors:[o],id:n,valid:!1};w+=1;let r=`loot-if:invalid-runtime-${w}`;return E.set(e,r),{errors:[o],id:r,valid:!1}}function _(e){let t=e;for(;t.parentElement;){let e=t.parentElement,o="DIV"===e.tagName&&0===e.attributes.length;if("P"!==e.tagName&&"SPAN"!==e.tagName&&"LIA-KEEP"!==e.tagName&&!o||[...e.childNodes].some(e=>e!==t&&e.nodeType!==Node.COMMENT_NODE&&(e.nodeType!==Node.TEXT_NODE||!!e.textContent?.trim())))break;t=e}return t}function I(e){C.has(e.id)||(C.add(e.id),console.warn(`Loot: @lootif ${e.id} bleibt wegen ung\xfcltiger Optionen verborgen. ${e.errors.join(" ")}`))}function T(){let e=new Set;for(let t of v)t.valid&&null!==t.end&&g?.isSpawned(t.id)||(function(e){let t=_(e.start),o=e.end?_(e.end):null;if(!t.isConnected||null!==o&&!o.isConnected||!e.scope.isConnected)return[];let n=e.scope.ownerDocument.createRange();try{n.setStartAfter(t),o?n.setEndBefore(o):n.setEnd(e.scope,e.scope.childNodes.length)}catch{return[]}let r=[],l=e=>{for(let t of[...e.children]){if(!n.intersectsNode(t))continue;let e=!1;try{e=0===n.comparePoint(t,0)&&0===n.comparePoint(t,t.childNodes.length)}catch{e=!1}e?r.push(t):l(t)}};return l(e.scope),r})(t).forEach(t=>e.add(t));let t=!1;for(let o of S)!e.has(o)&&(0,s.setRangeGate)(o,"loot-if",h,!1)&&(t=!0);for(let o of e)(0,s.setRangeGate)(o,"loot-if",h,!0)&&(t=!0);for(let t of(S.clear(),e.forEach(e=>S.add(e)),v))t.valid&&null!==t.end&&g?.isSpawned(t.id)?t.start.setAttribute(f,"true"):t.start.removeAttribute(f);return t}function R(e){return e.closest("main.lia-slide__content, main")}function j(e){if(!e)return null;let t=e.parentElement;if(t){let o=[...t.children].filter(e=>e instanceof HTMLElement&&"MAIN"===e.tagName),n=o.indexOf(e);if(n>=0){let e=(0,c.activeLiaSection)();return 1===o.length&&null!==e?e:n}}return e.hidden?null:(0,c.activeLiaSection)()}function N(e){return[...e.querySelectorAll(".lia-quiz")].filter(a.isScoreableQuiz)}function M(e){let t=e?.trim().replace(/\s+/gu," ")??"";return t&&!t.startsWith("@")?t:null}let $=/\[\s*["']quiz["']\s*,\s*(\d+)\s*\]\s*,\s*\[\s*["']input["']\s*,\s*(\d+)\s*\]/u;function O(e){let t=e.parentElement;if(!t||"MAIN"===t.tagName||1!==t.querySelectorAll(".lia-quiz").length)return null;let o=new Map;return t.querySelectorAll("[oninput], [onchange], [onclick]").forEach(e=>{for(let t of["oninput","onchange","onclick"]){let n=$.exec(e.getAttribute(t)??"");if(!n)continue;let r={section:Number.parseInt(n[1],10),input:Number.parseInt(n[2],10)};o.set(`${r.section}:${r.input}`,r)}}),1===o.size?[...o.values()][0]:null}function z(e){let t=new Set;return e.querySelectorAll(".lia-quiz__answers[aria-labelledby]").forEach(e=>{let o=M(e.getAttribute("aria-labelledby"));o&&o.split(" ").every(e=>!e.startsWith("@"))&&t.add(o)}),1===t.size?[...t][0]:null}function q(e,t){let o=["data-quiz-id","data-uid","data-id","id"].map(t=>M(e.getAttribute(t))).find(e=>null!==e)??null,n=null!==t?`section-${t}`:"document";if(o)return`${n}:authored-${encodeURIComponent(o)}`;let r=O(e);if(r)return`section-${r.section}:lia-input-${r.input}`;let l=z(e);return l?`${n}:lia-label-${encodeURIComponent(l)}`:null}function D(e){if(!(e instanceof HTMLElement)||!(0,a.isScoreableQuiz)(e))return null;let t=R(e),o=j(t);if(!N(t??document).includes(e))return null;let n=q(e,o);return!n||N(document).some(t=>t!==e&&q(t,j(R(t)))===n)?(delete e.dataset.lootIfQuizId,null):(e.dataset.lootIfQuizId=n,n)}function P(e){let t=D(e);return e.classList.contains("solved")||null!==t&&!!g?.isQuizSolved(t)}function H(e,t=!1){let o=e.parentElement;for(;o;){var n;if(!0===(n=o).disabled||n.hasAttribute("disabled")||n.inert||n.hidden||n.getAttribute("aria-hidden")?.trim().toLowerCase()==="true")return!1;o=o.parentElement}return!e.hidden&&!e.inert&&(!(!0===e.disabled||e.hasAttribute("disabled")||e.getAttribute("aria-hidden")?.trim().toLowerCase()==="true")||t)}function K(e){let t=e.querySelector(".lia-quiz__check");return!!t&&H(t,P(e))&&null===e.closest(`[${h}], [data-loot-reveal-range-blocked]`)&&!(0,l.hostIsRevealBlocked)(e,!1)}function G(e,t){if(!e)return null;let o=e.split("/").filter(Boolean).map(e=>Number.parseInt(e,10));if(o.some(e=>!Number.isInteger(e)||e<0))return null;let n=t.body;for(let e of o){if(!n||e>=n.childNodes.length)return null;n=n.childNodes[e]}return n}function F(e,t){let o=e.nodeType===Node.TEXT_NODE?(e.nodeValue??"").length:e.childNodes.length;return Math.max(0,Math.min(Number.isFinite(t)?t:0,o))}function V(){if(!m||!g)return;!function(){let e=new Map;document.querySelectorAll(`${u}, ${d}`).forEach(t=>{let o=t.closest("[data-loot-reveal-payload], [data-loot-reveal-layer-content], main.lia-slide__content, main")??document.body,n=e.get(o)??[];n.push(t),e.set(o,n)});let t=[];for(let[o,n]of e){let e=[];for(let r of n){if(r.matches(u)){e.push(r);continue}let n=e.pop();if(!n)continue;let l=(0,i.parseLootIfOptions)(n.getAttribute("data-options")),a=A(n),s={condition:l.condition,end:r,errors:[...l.errors,...a.errors],id:a.id,scope:o,start:n,valid:l.valid&&a.valid};s.valid||I(s),t.push(s)}for(let n of e){let e=(0,i.parseLootIfOptions)(n.getAttribute("data-options")),r=A(n),l={condition:e.condition,end:null,errors:[...e.errors,...r.errors,"Das zugehörige @Endelootif fehlt."],id:r.id,scope:o,start:n,valid:!1};I(l),t.push(l)}}v=t}();let e=T();(function(){if(!g)return!1;let e=!1;for(let t of N(document)){if(!t.classList.contains("solved"))continue;let o=D(t);o&&g.recordSolvedQuiz(o)&&(e=!0)}return e})()&&(e=!0),function(){if(!g)return!1;let e=!1;for(let t of document.querySelectorAll(".lia-hl-rect[data-kind='user'][data-hl]")){let o=t.getAttribute("data-hl");o&&i.MARKER_COLORS.includes(o)&&g.recordHighlightColor(o)&&(e=!0)}for(let t of function(){let e=[];for(let t of function(){let e=[window];for(let t of[()=>window.parent,()=>window.top])try{let o=t();o&&!e.includes(o)&&e.push(o)}catch{}return e}())try{let o=t.__LIA_TEXTMARKER_REG_V4__;o&&!e.includes(o)&&e.push(o)}catch{}return e}())for(let o of Object.values(t.instances??{}))for(let t of o.HL??[]){if("user"!==t.kind||!t.anchor)continue;let o=t.color;if(!i.MARKER_COLORS.includes(o))continue;let n=function(e){let t=G(e.sp,document),o=G(e.ep,document);if(!t||!o)return null;let n=document.createRange();try{n.setStart(t,F(t,e.so)),n.setEnd(o,F(o,e.eo))}catch{return null}return n.toString().trim()||null}(t.anchor);n&&g.recordHighlight(o,n)&&(e=!0)}return e}()&&(e=!0);let t=!1;for(let e of v){var o;!g.isSpawned(e.id)&&e.valid&&e.end&&e.condition&&null===(o=e).start.closest(`[${h}], [data-loot-reveal-range-blocked]`)&&!(0,l.hostIsRevealBlocked)(o.start,!1)&&function(e,t){var o;if(!m||!g)return!1;if("previous-quiz"===t.kind){let t,o=(t=N(document).filter(t=>!!(t.compareDocumentPosition(e.start)&Node.DOCUMENT_POSITION_FOLLOWING)))[t.length-1]??null;return null!==o&&P(o)}if("current-slide-quizzes"===t.kind)return function(e){let t=(0,c.activeLiaSection)(),o=R(e.start),n=j(o);if(null!==t&&null!==n&&t!==n)return!1;let r=document.querySelector(".lia-slide__container > main.lia-slide__content:not([hidden])")??o;if(!r||o&&r!==o)return!1;let l=N(r).filter(K);return l.length>0&&l.every(P)}(e);if("solved-quizzes"===t.kind)return(0,i.compareLootIfNumbers)(g.state().solvedQuizzes.length,t.comparator,t.value);if("resource"===t.kind){let e=m.resourceState(),o=e?.[t.resource];return null!=o&&(0,i.compareLootIfNumbers)(o,t.comparator,t.value)}return"opened-chests"===t.kind?(0,i.compareLootIfNumbers)(m.chestCounts()[t.reward],t.comparator,t.value):"lock-opened"===t.kind?(o=t.target,!!(g?.hasOpenedLockTarget(o)||m?.unlockedLockIds().some(e=>e.split(":").map(e=>e.trim()).includes(o)))):"secret-slide-visited"===t.kind?g.state().secretSlideVisited:"magnifier-found"===t.kind?m.magnifierFound():g.hasHighlight(t.color,t.word)}(e,e.condition)&&g.spawn(e.id)&&(t=!0)}t&&T()&&(e=!0),(e||t)&&(document.dispatchEvent(new CustomEvent(p)),document.dispatchEvent(new CustomEvent(l.REVEAL_CHANGED_EVENT))),t&&Z()}function B(){Z()}function W(e){if(!g)return;let t=D(e);t&&g.recordSolvedQuiz(t),Z()}function U(){g?.recordSecretSlideVisit(),Z()}function Z(){y||(y=!0,queueMicrotask(()=>{y=!1,V()}))}function Y(e){return e instanceof Element&&(e.matches(`${u}, ${d}, #lia-hl-overlay`)||null!==e.querySelector(`${u}, ${d}, #lia-hl-overlay`))}class X extends HTMLElement{static get observedAttributes(){return["data-loot-if-id","data-options"]}connectedCallback(){Z()}attributeChangedCallback(){this.isConnected&&Z()}}function Q(e,t){m=e,g=t,customElements.get(u)||customElements.define(u,X),!b&&document.documentElement&&(b=new MutationObserver(e=>{e.some(e=>"attributes"===e.type||"childList"===e.type||[...e.addedNodes,...e.removedNodes].some(Y)||e.target instanceof Element&&!!e.target.closest(`${u}, .lia-quiz, #lia-hl-overlay, [data-loot-reveal-layer-content]`))&&Z()})).observe(document.documentElement,{attributeFilter:["aria-hidden","class","data-loot-if-id","data-options","disabled","hidden","href","inert"],attributes:!0,childList:!0,subtree:!0}),k||(k=!0,(0,c.observeLiaSlideActivity)(Z)),x||(x=!0,document.addEventListener(l.REVEAL_CHANGED_EVENT,Z)),V()}},{"./exploration.ts":"5BeJ3","./loot-if-options.ts":"6qN0r","./quiz-events.ts":"1ZNl4","./range-gate.ts":"jrKO3","./slide-activity.ts":"5qduG","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}],"2KjdS":[function(e,t,o,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"LootIfStore",()=>h);var l=e("./course-identity.ts"),i=e("./lock-targets.ts"),a=e("./loot-if-options.ts");function s(e){if(!Array.isArray(e)||!e.every(e=>"string"==typeof e&&e.trim().length>0))return null;let t=e.map(e=>e.trim());return new Set(t).size===t.length?t:null}function c(){return`lia-loot:loot-if:v1:${encodeURIComponent((0,l.liaCourseIdentity)())}`}function u(e){try{window.sessionStorage.setItem(c(),JSON.stringify(e))}catch{}}function d(e){return e.trim()||null}class h{isSpawned(e){let t=d(e);return null!==t&&this.current.spawned.includes(t)}spawn(e){return this.recordId(e,this.current.spawned)}isQuizSolved(e){let t=d(e);return null!==t&&this.current.solvedQuizzes.includes(t)}recordSolvedQuiz(e){return this.recordId(e,this.current.solvedQuizzes)}recordSecretSlideVisit(){return!this.current.secretSlideVisited&&(this.current.secretSlideVisited=!0,u(this.current),!0)}recordOpenedLockTarget(e){let t=(0,i.resolveLockTarget)(e);return!(!t||this.current.openedLockTargets.includes(t))&&(this.current.openedLockTargets.push(t),u(this.current),!0)}hasOpenedLockTarget(e){let t=(0,i.resolveLockTarget)(e);return null!==t&&this.current.openedLockTargets.includes(t)}recordHighlight(e,t){if(!a.MARKER_COLORS.includes(e))return!1;let o=(0,a.normalizeHighlightedWord)(t);if(!o||o.length>512)return!1;let n=this.recordHighlightColor(e,!1);return this.current.highlightedWords.some(t=>t.color===e&&t.word===o)?(n&&u(this.current),n):(this.current.highlightedWords.push({color:e,word:o}),u(this.current),!0)}recordHighlightColor(e,t=!0){return!(!a.MARKER_COLORS.includes(e)||this.current.highlightedColors.includes(e))&&(this.current.highlightedColors.push(e),t&&u(this.current),!0)}hasHighlight(e,t){if(null==t)return this.current.highlightedColors.includes(e);let o=(0,a.normalizeHighlightedWord)(t);return!!o&&this.current.highlightedWords.some(t=>t.color===e&&t.word===o)}state(){var e;return{version:1,highlightedColors:[...(e=this.current).highlightedColors],highlightedWords:e.highlightedWords.map(e=>({...e})),openedLockTargets:[...e.openedLockTargets],secretSlideVisited:e.secretSlideVisited,solvedQuizzes:[...e.solvedQuizzes],spawned:[...e.spawned]}}recordId(e,t){let o=d(e);return!(!o||t.includes(o))&&(t.push(o),u(this.current),!0)}constructor(){this.current=function(){try{let e=window.sessionStorage.getItem(c());if(!e)return null;let t=JSON.parse(e);return function(e){if(!e||"object"!=typeof e||1!==e.version||"boolean"!=typeof e.secretSlideVisited)return null;let t=function(e){if(!Array.isArray(e))return null;let t=[],o=new Set;for(let n of e){if(!n||"object"!=typeof n||!a.MARKER_COLORS.includes(n.color)||"string"!=typeof n.word)return null;let e=(0,a.normalizeHighlightedWord)(n.word);if(!e||e.length>512)return null;let r=`${n.color}:${e}`;if(o.has(r))return null;o.add(r),t.push({color:n.color,word:e})}return t}(e.highlightedWords);if(!Array.isArray(e.highlightedColors)||!e.highlightedColors.every(e=>a.MARKER_COLORS.includes(e)))return null;let o=[...e.highlightedColors];if(new Set(o).size!==o.length)return null;let n=s(e.solvedQuizzes),r=s(e.spawned),l=void 0===e.openedLockTargets?[]:e.openedLockTargets;if(!Array.isArray(l)||!l.every(e=>"string"==typeof e&&(0,i.resolveLockTarget)(e)===e))return null;let c=[...l];return new Set(c).size===c.length&&t&&n&&r?{version:1,highlightedColors:o,highlightedWords:t,openedLockTargets:c,secretSlideVisited:e.secretSlideVisited,solvedQuizzes:n,spawned:r}:null}(t)}catch{return null}}()??{version:1,highlightedColors:[],highlightedWords:[],openedLockTargets:[],secretSlideVisited:!1,solvedQuizzes:[],spawned:[]}}}},{"./course-identity.ts":"g3iqo","./lock-targets.ts":"1CWW8","./loot-if-options.ts":"6qN0r","@parcel/transformer-js/src/esmodule-helpers.js":"aqhRK"}]},["k1TZk"],"k1TZk","parcelRequire3c00",{});
//# sourceMappingURL=index.js.map
