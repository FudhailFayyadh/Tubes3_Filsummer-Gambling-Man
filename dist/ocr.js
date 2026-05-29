(function(){"use strict";var ur={exports:{}};(function(t){var o=function(a){var l=Object.prototype,d=l.hasOwnProperty,h=Object.defineProperty||function(n,r,e){n[r]=e.value},f,m=typeof Symbol=="function"?Symbol:{},w=m.iterator||"@@iterator",D=m.asyncIterator||"@@asyncIterator",T=m.toStringTag||"@@toStringTag";function k(n,r,e){return Object.defineProperty(n,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),n[r]}try{k({},"")}catch{k=function(r,e,s){return r[e]=s}}function C(n,r,e,s){var i=r&&r.prototype instanceof N?r:N,p=Object.create(i.prototype),y=new F(s||[]);return h(p,"_invoke",{value:Q(n,e,y)}),p}a.wrap=C;function _(n,r,e){try{return{type:"normal",arg:n.call(r,e)}}catch(s){return{type:"throw",arg:s}}}var I="suspendedStart",Z="suspendedYield",Y="executing",j="completed",g={};function N(){}function P(){}function $(){}var W={};k(W,w,function(){return this});var G=Object.getPrototypeOf,R=G&&G(G(c([])));R&&R!==l&&d.call(R,w)&&(W=R);var E=$.prototype=N.prototype=Object.create(W);P.prototype=$,h(E,"constructor",{value:$,configurable:!0}),h($,"constructor",{value:P,configurable:!0}),P.displayName=k($,T,"GeneratorFunction");function q(n){["next","throw","return"].forEach(function(r){k(n,r,function(e){return this._invoke(r,e)})})}a.isGeneratorFunction=function(n){var r=typeof n=="function"&&n.constructor;return r?r===P||(r.displayName||r.name)==="GeneratorFunction":!1},a.mark=function(n){return Object.setPrototypeOf?Object.setPrototypeOf(n,$):(n.__proto__=$,k(n,T,"GeneratorFunction")),n.prototype=Object.create(E),n},a.awrap=function(n){return{__await:n}};function z(n,r){function e(p,y,v,L){var b=_(n[p],n,y);if(b.type==="throw")L(b.arg);else{var rr=b.arg,x=rr.value;return x&&typeof x=="object"&&d.call(x,"__await")?r.resolve(x.__await).then(function(A){e("next",A,v,L)},function(A){e("throw",A,v,L)}):r.resolve(x).then(function(A){rr.value=A,v(rr)},function(A){return e("throw",A,v,L)})}}var s;function i(p,y){function v(){return new r(function(L,b){e(p,y,L,b)})}return s=s?s.then(v,v):v()}h(this,"_invoke",{value:i})}q(z.prototype),k(z.prototype,D,function(){return this}),a.AsyncIterator=z,a.async=function(n,r,e,s,i){i===void 0&&(i=Promise);var p=new z(C(n,r,e,s),i);return a.isGeneratorFunction(r)?p:p.next().then(function(y){return y.done?y.value:p.next()})};function Q(n,r,e){var s=I;return function(p,y){if(s===Y)throw new Error("Generator is already running");if(s===j){if(p==="throw")throw y;return u()}for(e.method=p,e.arg=y;;){var v=e.delegate;if(v){var L=J(v,e);if(L){if(L===g)continue;return L}}if(e.method==="next")e.sent=e._sent=e.arg;else if(e.method==="throw"){if(s===I)throw s=j,e.arg;e.dispatchException(e.arg)}else e.method==="return"&&e.abrupt("return",e.arg);s=Y;var b=_(n,r,e);if(b.type==="normal"){if(s=e.done?j:Z,b.arg===g)continue;return{value:b.arg,done:e.done}}else b.type==="throw"&&(s=j,e.method="throw",e.arg=b.arg)}}}function J(n,r){var e=r.method,s=n.iterator[e];if(s===f)return r.delegate=null,e==="throw"&&n.iterator.return&&(r.method="return",r.arg=f,J(n,r),r.method==="throw")||e!=="return"&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+e+"' method")),g;var i=_(s,n.iterator,r.arg);if(i.type==="throw")return r.method="throw",r.arg=i.arg,r.delegate=null,g;var p=i.arg;if(!p)return r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g;if(p.done)r[n.resultName]=p.value,r.next=n.nextLoc,r.method!=="return"&&(r.method="next",r.arg=f);else return p;return r.delegate=null,g}q(E),k(E,T,"Generator"),k(E,w,function(){return this}),k(E,"toString",function(){return"[object Generator]"});function X(n){var r={tryLoc:n[0]};1 in n&&(r.catchLoc=n[1]),2 in n&&(r.finallyLoc=n[2],r.afterLoc=n[3]),this.tryEntries.push(r)}function B(n){var r=n.completion||{};r.type="normal",delete r.arg,n.completion=r}function F(n){this.tryEntries=[{tryLoc:"root"}],n.forEach(X,this),this.reset(!0)}a.keys=function(n){var r=Object(n),e=[];for(var s in r)e.push(s);return e.reverse(),function i(){for(;e.length;){var p=e.pop();if(p in r)return i.value=p,i.done=!1,i}return i.done=!0,i}};function c(n){if(n){var r=n[w];if(r)return r.call(n);if(typeof n.next=="function")return n;if(!isNaN(n.length)){var e=-1,s=function i(){for(;++e<n.length;)if(d.call(n,e))return i.value=n[e],i.done=!1,i;return i.value=f,i.done=!0,i};return s.next=s}}return{next:u}}a.values=c;function u(){return{value:f,done:!0}}return F.prototype={constructor:F,reset:function(n){if(this.prev=0,this.next=0,this.sent=this._sent=f,this.done=!1,this.delegate=null,this.method="next",this.arg=f,this.tryEntries.forEach(B),!n)for(var r in this)r.charAt(0)==="t"&&d.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=f)},stop:function(){this.done=!0;var n=this.tryEntries[0],r=n.completion;if(r.type==="throw")throw r.arg;return this.rval},dispatchException:function(n){if(this.done)throw n;var r=this;function e(L,b){return p.type="throw",p.arg=n,r.next=L,b&&(r.method="next",r.arg=f),!!b}for(var s=this.tryEntries.length-1;s>=0;--s){var i=this.tryEntries[s],p=i.completion;if(i.tryLoc==="root")return e("end");if(i.tryLoc<=this.prev){var y=d.call(i,"catchLoc"),v=d.call(i,"finallyLoc");if(y&&v){if(this.prev<i.catchLoc)return e(i.catchLoc,!0);if(this.prev<i.finallyLoc)return e(i.finallyLoc)}else if(y){if(this.prev<i.catchLoc)return e(i.catchLoc,!0)}else if(v){if(this.prev<i.finallyLoc)return e(i.finallyLoc)}else throw new Error("try statement without catch or finally")}}},abrupt:function(n,r){for(var e=this.tryEntries.length-1;e>=0;--e){var s=this.tryEntries[e];if(s.tryLoc<=this.prev&&d.call(s,"finallyLoc")&&this.prev<s.finallyLoc){var i=s;break}}i&&(n==="break"||n==="continue")&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var p=i?i.completion:{};return p.type=n,p.arg=r,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(p)},complete:function(n,r){if(n.type==="throw")throw n.arg;return n.type==="break"||n.type==="continue"?this.next=n.arg:n.type==="return"?(this.rval=this.arg=n.arg,this.method="return",this.next="end"):n.type==="normal"&&r&&(this.next=r),g},finish:function(n){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===n)return this.complete(e.completion,e.afterLoc),B(e),g}},catch:function(n){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===n){var s=e.completion;if(s.type==="throw"){var i=s.arg;B(e)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(n,r,e){return this.delegate={iterator:c(n),resultName:r,nextLoc:e},this.method==="next"&&(this.arg=f),g}},a}(t.exports);try{regeneratorRuntime=o}catch{typeof globalThis=="object"?globalThis.regeneratorRuntime=o:Function("r","regeneratorRuntime = r")(o)}})(ur);var nr=(t,o)=>`${t}-${o}-${Math.random().toString(16).slice(3,8)}`;const pr=nr;let tr=0;var dr=({id:t,action:o,payload:a={}})=>{let l=t;return typeof l>"u"&&(l=pr("Job",tr),tr+=1),{id:l,action:o,payload:a}},U={};let H=!1;U.logging=H,U.setLogging=t=>{H=t},U.log=(...t)=>H?console.log.apply(void 0,t):null;function fr(t){throw new Error('Could not dynamically require "'+t+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var gr=t=>{const o={};return typeof WorkerGlobalScope<"u"?o.type="webworker":typeof document=="object"?o.type="browser":typeof process=="object"&&typeof fr=="function"&&(o.type="node"),typeof t>"u"?o:o[t]};const hr=gr("type")==="browser"?t=>new URL(t,window.location.href).href:t=>t;var mr=t=>{const o={...t};return["corePath","workerPath","langPath"].forEach(a=>{t[a]&&(o[a]=hr(o[a]))}),o},wr={TESSERACT_ONLY:0,LSTM_ONLY:1,TESSERACT_LSTM_COMBINED:2,DEFAULT:3};const yr={version:"7.0.0"};var vr={workerBlobURL:!0,logger:()=>{}};const br=yr.version;var kr={...vr,workerPath:`https://cdn.jsdelivr.net/npm/tesseract.js@v${br}/dist/worker.min.js`},jr=({workerPath:t,workerBlobURL:o})=>{let a;if(Blob&&URL&&o){const l=new Blob([`importScripts("${t}");`],{type:"application/javascript"});a=new Worker(URL.createObjectURL(l))}else a=new Worker(t);return a},Lr=t=>{t.terminate()},Sr=(t,o)=>{t.onmessage=({data:a})=>{o(a)}},$r=async(t,o)=>{t.postMessage(o)};const K=t=>new Promise((o,a)=>{const l=new FileReader;l.onload=()=>{o(l.result)},l.onerror=({target:{error:{code:d}}})=>{a(Error(`File could not be read! Code=${d}`))},l.readAsArrayBuffer(t)}),V=async t=>{let o=t;if(typeof t>"u")return"undefined";if(typeof t=="string")/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(t)?o=atob(t.split(",")[1]).split("").map(a=>a.charCodeAt(0)):o=await(await fetch(t)).arrayBuffer();else if(typeof HTMLElement<"u"&&t instanceof HTMLElement)t.tagName==="IMG"&&(o=await V(t.src)),t.tagName==="VIDEO"&&(o=await V(t.poster)),t.tagName==="CANVAS"&&await new Promise(a=>{t.toBlob(async l=>{o=await K(l),a()})});else if(typeof OffscreenCanvas<"u"&&t instanceof OffscreenCanvas){const a=await t.convertToBlob();o=await K(a)}else(t instanceof File||t instanceof Blob)&&(o=await K(t));return new Uint8Array(o)};var Er=V,Or={defaultOptions:kr,spawnWorker:jr,terminateWorker:Lr,onMessage:Sr,send:$r,loadImage:Er};const Tr=mr,S=dr,{log:er}=U,_r=nr,O=wr,{defaultOptions:Ar,spawnWorker:Cr,terminateWorker:Pr,onMessage:Rr,loadImage:or,send:qr}=Or;let ar=0;var ir=async(t="eng",o=O.LSTM_ONLY,a={},l={})=>{const d=_r("Worker",ar),{logger:h,errorHandler:f,...m}=Tr({...Ar,...a}),w={},D=typeof t=="string"?t.split("+"):t;let T=o,k=l;const C=[O.DEFAULT,O.LSTM_ONLY].includes(o)&&!m.legacyCore;let _,I;const Z=new Promise((c,u)=>{I=c,_=u}),Y=c=>{_(c.message)};let j=Cr(m);j.onerror=Y,ar+=1;const g=({id:c,action:u,payload:n})=>new Promise((r,e)=>{er(`[${d}]: Start ${c}, action=${u}`);const s=`${u}-${c}`;w[s]={resolve:r,reject:e},qr(j,{workerId:d,jobId:c,action:u,payload:n})}),N=()=>console.warn("`load` is depreciated and should be removed from code (workers now come pre-loaded)"),P=c=>g(S({id:c,action:"load",payload:{options:{lstmOnly:C,corePath:m.corePath,logging:m.logging}}})),$=(c,u,n)=>g(S({id:n,action:"FS",payload:{method:"writeFile",args:[c,u]}})),W=(c,u)=>g(S({id:u,action:"FS",payload:{method:"readFile",args:[c,{encoding:"utf8"}]}})),G=(c,u)=>g(S({id:u,action:"FS",payload:{method:"unlink",args:[c]}})),R=(c,u,n)=>g(S({id:n,action:"FS",payload:{method:c,args:u}})),E=(c,u)=>g(S({id:u,action:"loadLanguage",payload:{langs:c,options:{langPath:m.langPath,dataPath:m.dataPath,cachePath:m.cachePath,cacheMethod:m.cacheMethod,gzip:m.gzip,lstmOnly:[O.DEFAULT,O.LSTM_ONLY].includes(T)&&!m.legacyLang}}})),q=(c,u,n,r)=>g(S({id:r,action:"initialize",payload:{langs:c,oem:u,config:n}})),z=(c="eng",u,n,r)=>{if(C&&[O.TESSERACT_ONLY,O.TESSERACT_LSTM_COMBINED].includes(u))throw Error("Legacy model requested but code missing.");const e=u||T;T=e;const s=n||k;k=s;const p=(typeof c=="string"?c.split("+"):c).filter(y=>!D.includes(y));return D.push(...p),p.length>0?E(p,r).then(()=>q(c,e,s,r)):q(c,e,s,r)},Q=(c={},u)=>g(S({id:u,action:"setParameters",payload:{params:c}})),J=async(c,u={},n={text:!0},r)=>g(S({id:r,action:"recognize",payload:{image:await or(c),options:u,output:n}})),X=async(c,u)=>{if(C)throw Error("`worker.detect` requires Legacy model, which was not loaded.");return g(S({id:u,action:"detect",payload:{image:await or(c)}}))},B=async()=>(j!==null&&(Pr(j),j=null),Promise.resolve());Rr(j,({workerId:c,jobId:u,status:n,action:r,data:e})=>{const s=`${r}-${u}`;if(n==="resolve")er(`[${c}]: Complete ${u}`),w[s].resolve({jobId:u,data:e}),delete w[s];else if(n==="reject")if(w[s].reject(e),delete w[s],r==="load"&&_(e),f)f(e);else throw Error(e);else n==="progress"&&h({...e,userJobId:u})});const F={id:d,worker:j,load:N,writeText:$,readText:W,removeFile:G,FS:R,reinitialize:z,setParameters:Q,recognize:J,detect:X,terminate:B};return P().then(()=>E(t)).then(()=>q(t,o,l)).then(()=>I(F)).catch(()=>{}),Z};const sr=ir;var zr={recognize:async(t,o,a)=>{const l=await sr(o,1,a);return l.recognize(t).finally(async()=>{await l.terminate()})},detect:async(t,o)=>{const a=await sr("osd",0,o);return a.detect(t).finally(async()=>{await a.terminate()})}},Mr={createWorker:ir,...zr};function Ir(t){const o=t.length,a=new Array(o).fill(0);let l=0;for(let d=1;d<o;d++){for(;l>0&&t[l]!==t[d];)l=a[l-1];t[l]===t[d]&&l++,a[d]=l}return a}function Nr(t,o){const a=t.length,l=o.length;if(l===0||l>a)return{positions:[],comparisons:0};const d=Ir(o),h=[];let f=0,m=0;for(let w=0;w<a;w++)for(;;)if(m++,o[f]===t[w]){f++,f===l&&(h.push(w-l+1),f=d[f-1]);break}else if(f>0)f=d[f-1];else break;return{positions:h,comparisons:m}}const Wr=`slot\r
slot gacor\r
gacor\r
maxwin\r
scatter\r
scatter hitam\r
scatter merah\r
jackpot\r
jackpot maxwin\r
bonus new member\r
bonus member baru\r
bonus deposit\r
bonus harian\r
bonus mingguan\r
bonus bulanan\r
bonus rollingan\r
bonus turnover\r
bonus referral\r
bonus cashback\r
cashback slot\r
cashback casino\r
free spin\r
free spins\r
freebet\r
free bet\r
freechip\r
free chip\r
deposit pulsa\r
deposit ewallet\r
deposit dana\r
deposit ovo\r
deposit gopay\r
deposit qris\r
deposit tanpa potongan\r
minimal deposit\r
wd cepat\r
withdraw cepat\r
withdraw kilat\r
withdraw otomatis\r
rtp\r
rtp live\r
rtp slot\r
rtp gacor\r
rtp tertinggi\r
rtp hari ini\r
slot online\r
judi online\r
situs judi\r
situs slot\r
bandar slot\r
bandar togel\r
casino online\r
live casino\r
pragmatic play\r
pg soft\r
habanero\r
joker gaming\r
microgaming\r
spadegaming\r
slot88\r
slot 88\r
slot777\r
slot 777\r
slot gacor hari ini\r
slot gampang menang\r
slot terpercaya\r
slot resmi\r
slot terbaru\r
slot terbaik\r
slot viral\r
slot thailand\r
slot olympus\r
olympus1000\r
olympus 1000\r
mahjong ways\r
mahjong ways 2\r
sweet bonanza\r
starlight princess\r
gates of olympus\r
gates olympus\r
wild west gold\r
bonanza slot\r
zeus slot\r
kakek zeus\r
petir zeus\r
slot petir\r
slot receh\r
slot anti rungkad\r
anti rungkad\r
anti kalah\r
pasti menang\r
jamin menang\r
cuan slot\r
cuan besar\r
cuan maxwin\r
cuan gacor\r
slot cuan\r
situs gacor\r
game gacor\r
akun gacor\r
jam gacor\r
pola gacor\r
pola slot\r
pola maxwin\r
jam hoki\r
jam hoki slot\r
jam hoki gacor\r
admin slot\r
link alternatif\r
link gacor\r
login slot\r
daftar slot\r
daftar judi\r
register slot\r
main slot\r
main judi\r
main casino\r
main togel\r
pasang togel\r
prediksi togel\r
angka hoki\r
angka jitu\r
angka keramat\r
slot deposit pulsa\r
slot via dana\r
slot via ovo\r
slot via qris\r
slot via gopay\r
slot deposit qris\r
slot tanpa potongan\r
slot resmi terpercaya\r
situs terpercaya\r
agen judi\r
agen slot\r
agen togel\r
bandar darat online\r
bandar online\r
slot resmi indonesia\r
slot gampang wd\r
slot gampang maxwin\r
slot no 1\r
slot nomor 1\r
slot paling gacor\r
slot paling cuan\r
slot hoki\r
slot hoki hari ini\r
slot gacor maxwin\r
slot gacor terpercaya\r
slot gacor terbaru\r
slot gacor 2026\r
slot gacor 2025\r
slot thailand gacor\r
slot server thailand\r
server thailand\r
server kamboja\r
slot server kamboja\r
slot luar negeri\r
akun pro slot\r
akun sultan\r
akun hoki\r
akun maxwin\r
situs anti rungkad\r
judi bola\r
taruhan bola\r
sportsbook\r
mix parlay\r
parlay\r
casino terpercaya\r
roulette online\r
baccarat online\r
blackjack online\r
poker online\r
capsa online\r
domino qiu qiu\r
dominoqq\r
qq online\r
bandarq\r
sakong online\r
aduq online\r
togel singapore\r
togel hongkong\r
togel sidney\r
togel macau\r
toto gelap\r
togel online\r
pasaran togel\r
angka togel\r
keluaran togel\r
result togel\r
prediksi hk\r
prediksi sdy\r
prediksi sgp\r
live draw\r
live draw hk\r
live draw sdy\r
live draw sgp\r
jackpot terbesar\r
jackpot harian\r
jackpot mingguan\r
bonus member baru 100\r
bonus 100\r
bonus 200\r
bonus cashback 10 persen\r
bonus turnover slot\r
bonus rollingan slot\r
bonus referral slot\r
slot bonus new member\r
casino bonus\r
casino online terpercaya\r
situs gacor terpercaya\r
agen terpercaya\r
daftar sekarang\r
main sekarang\r
claim bonus\r
klaim bonus\r
spin gratis\r
spin free\r
spin otomatis\r
auto spin\r
buy free spin\r
buy feature\r
feature buy\r
slot buy feature\r
big win\r
mega win\r
super win\r
sensational\r
epic win\r
double chance\r
turbo spin\r
auto cuan\r
modal receh\r
modal kecil cuan besar\r
deposit receh\r
deposit 10 ribu\r
deposit 5 ribu\r
deposit murah\r
situs resmi slot\r
situs slot online terpercaya\r
situs slot gacor terpercaya\r
slot online terpercaya no 1\r
slot online gacor\r
slot online maxwin\r
slot online gampang menang\r
slot online indonesia\r
slot online via dana\r
slot online deposit pulsa\r
slot qris\r
slot dana\r
slot ovo\r
slot gopay\r
slot pulsa\r
slot tri\r
slot xl\r
slot telkomsel\r
slot indosat\r
slot smartfren\r
judi slot online\r
judi casino online\r
judi terpercaya\r
judi gacor\r
judi bola online\r
judi togel online\r
judi deposit pulsa\r
slot deposit dana\r
slot deposit ovo\r
slot deposit gopay\r
slot deposit linkaja\r
slot deposit shopeepay\r
situs slot deposit pulsa tanpa potongan\r
slot deposit ewallet\r
judi online terpercaya\r
akun demo slot\r
demo slot\r
provider slot\r
provider gacor\r
provider terbaik\r
slot pragmatic\r
slot pg soft\r
slot habanero\r
slot joker\r
slot microgaming\r
slot spadegaming\r
slot live22\r
slot toptrend\r
slot yggdrasil\r
slot jdb\r
slot cq9\r
slot playstar\r
slot ion\r
slot onetouch\r
slot no limit city\r
slot hacksaw\r
slot dragon hatch\r
slot aztec\r
slot zeus\r
slot fu fu fu\r
slot panda\r
slot naga\r
slot kakek merah\r
slot princess\r
slot bonanza\r
slot aladdin\r
slot buah\r
slot ikan\r
slot dewa petir\r
slot dewa zeus\r
slot gacor malam ini\r
slot gacor sore ini\r
slot gacor pagi ini\r
slot gacor siang ini\r
slot gacor auto maxwin\r
slot gacor anti kalah\r
slot gacor hari ini terpercaya\r
slot gacor gampang menang\r
slot gacor modal kecil\r
slot gacor deposit kecil\r
slot gacor bonus besar\r
slot gacor terpercaya no 1\r
situs slot gacor no 1\r
situs slot gampang menang\r
situs judi terpercaya no 1\r
link slot gacor\r
link judi online\r
link slot online\r
alternatif slot\r
alternatif judi\r
mirror site slot\r
mirror judi\r
main slot sekarang\r
main judi sekarang\r
main dan menang\r
auto menang\r
auto wd\r
wd tanpa syarat\r
wd 1 menit\r
wd 5 menit\r
wd tercepat\r
slot anti zonk\r
anti zonk\r
slot gacor anti zonk\r
slot hoki malam ini\r
slot hoki hari ini\r
slot hoki gacor\r
admin gacor\r
admin maxwin\r
admin hoki\r
jackpot terbesar hari ini\r
slot jackpot terbesar\r
slot jackpot maxwin\r
casino gacor\r
live casino gacor\r
live slot\r
live jackpot\r
prediksi slot\r
trik slot\r
cara menang slot\r
cara maxwin\r
tips gacor\r
tips maxwin\r
bocoran slot\r
bocoran admin\r
bocoran jam gacor\r
bocoran pola slot\r
bocoran maxwin\r
akun sultan gacor\r
akun hoki maxwin\r
akun gacor terpercaya\r
akun anti rungkad\r
akun auto win\r
akun auto maxwin\r
slot vip\r
member vip\r
vip slot\r
vip casino\r
vip gambling\r
high roller\r
rollingan besar\r
turnover besar\r
bonus turnover casino\r
bonus cashback harian\r
cashback mingguan\r
cashback bulanan\r
judi terpercaya indonesia\r
slot resmi terbaik\r
slot resmi no 1\r
slot resmi gampang menang\r
judi slot terpercaya\r
judi slot gacor\r
judi slot maxwin\r
slot online gampang wd\r
slot online gampang cuan\r
slot online anti kalah\r
slot online anti rungkad\r
slot online terpercaya indonesia\r
situs slot resmi indonesia\r
situs judi online indonesia\r
slot online terbaik\r
slot online resmi\r
slot online bonus besar\r
slot online bonus new member\r
casino online indonesia\r
casino online terpercaya indonesia\r
situs casino online\r
bandar casino online\r
bandar togel online\r
bandar slot online\r
`.split(`
`).map(t=>t.trim()).filter(t=>t.length>0&&!t.startsWith("#")),M="judol-ocr-blur",lr="judol-ocr-label";function Gr(t){const o=t.toUpperCase(),a=[];for(const l of Wr){const d=l.trim().toUpperCase();if(!d)continue;const{positions:h}=Nr(o,d);h.length>0&&a.push(l)}return a}async function Br(t){try{const o=await fetch(t);return o.ok?await o.blob():null}catch{return null}}function Fr(t){if(t.classList.contains(M))return;t.classList.add(M),t.style.filter="blur(10px)",t.style.transition="filter 0.3s ease";const o=t.parentElement;if(!o)return;const a=document.createElement("div");a.className=lr,a.textContent="Konten Judol Terdeteksi",a.style.cssText=["position:absolute","top:50%","left:50%","transform:translate(-50%,-50%)","background:rgba(231,76,60,0.85)","color:#fff","padding:4px 10px","border-radius:4px","font-size:12px","font-weight:700","pointer-events:none","z-index:9999","white-space:nowrap"].join(";"),getComputedStyle(o).position==="static"&&(o.style.position="relative"),o.appendChild(a)}function xr(){document.querySelectorAll(`.${M}`).forEach(t=>{t.classList.remove(M),t.style.filter="",t.style.transition=""}),document.querySelectorAll(`.${lr}`).forEach(t=>t.remove())}async function cr(){const t=Array.from(document.querySelectorAll("img")).filter(h=>h.complete&&h.naturalWidth>50&&h.src&&!h.classList.contains(M));if(t.length===0){await chrome.storage.local.set({ocrResult:{imagesScanned:0,imagesDetected:0,detectedImages:[],executionTime:0,timestamp:Date.now()}});return}const o=performance.now();let a=null;try{a=await Mr.createWorker("eng")}catch{return}const l=[];for(const h of t)try{const f=await Br(h.src);if(!f)continue;const{data:m}=await a.recognize(f),w=Gr(m.text);w.length>0&&(Fr(h),l.push({src:h.src,keywords:w}))}catch{}await a.terminate();const d={imagesScanned:t.length,imagesDetected:l.length,detectedImages:l,executionTime:performance.now()-o,timestamp:Date.now()};await chrome.storage.local.set({ocrResult:d})}chrome.runtime.onMessage.addListener(t=>{t.type==="RESCAN"&&(xr(),cr())}),cr()})();
