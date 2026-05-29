(function(){"use strict";function j(){return{children:{},fail:0,outputs:[]}}function F(n){const t=[];for(const o of n){const r=o.trim().toUpperCase();r.length>0&&t.push(r)}return t}function z(n){const t=[j()];for(const o of n){let r=0;for(const e of o)t[r].children[e]===void 0&&(t[r].children[e]=t.length,t.push(j())),r=t[r].children[e];t[r].outputs.push(o)}return t}function A(n,t){for(const o of Object.keys(n[0].children)){const r=n[0].children[o];n[r].fail=0,t.push(r)}}function N(n,t,o,r){let e=n[t].fail;for(;e!==0&&n[e].children[o]===void 0;)e=n[e].fail;const i=n[e].children[o];n[r].fail=i===void 0?0:i,n[r].outputs.push(...n[n[r].fail].outputs)}function U(n){const t=[];let o=0;for(A(n,t);o<t.length;){const r=t[o];o++;for(const e of Object.keys(n[r].children)){const i=n[r].children[e];N(n,r,e,i),t.push(i)}}}function L(n,t,o){const r=n.get(t);r?r.push(o):n.set(t,[o])}function I(n,t){const o=new Map;let r=0,e=0;for(let i=0;i<n.length;i++){const a=n[i];for(;e!==0&&t[e].children[a]===void 0;)r++,e=t[e].fail;r++;const s=t[e].children[a];e=s===void 0?0:s;for(const l of t[e].outputs)L(o,l,i-l.length+1)}return{positions:o,comparisons:r}}function K(n,t,o,r){const e=[];for(const i of n){const a=i.trim().toUpperCase(),s=t.get(a);!s||s.length===0||e.push({keyword:i,positions:s,count:s.length,algorithm:"AC",executionTime:o,comparisons:r})}return e}function q(n,t){const o=F(t);if(o.length===0)return[];const r=performance.now(),e=z(o);U(e);const i=I(n.toUpperCase(),e),a=performance.now()-r;return K(t,i.positions,a,i.comparisons)}function $(n){const t={};for(let o=0;o<n.length;o++)t[n[o]]=o;return t}function B(n,t){const o=n.length,r=t.length;if(r===0||r>o)return{positions:[],comparisons:0};const e=$(t),i=[];let a=0,s=0;for(;s<=o-r;){let l=r-1;for(;l>=0&&(a++,t[l]===n[s+l]);)l--;if(l<0){i.push(s),s+=1;continue}const u=n[s+l],c=e[u]??-1;s+=Math.max(1,l-c)}return{positions:i,comparisons:a}}function O(n,t){const o=n.toUpperCase(),r=[];for(const e of t){const i=e.trim().toUpperCase();if(!i)continue;const a=performance.now(),{positions:s,comparisons:l}=B(o,i),u=performance.now()-a;s.length>0&&r.push({keyword:e,positions:s,count:s.length,algorithm:"BM",executionTime:u,comparisons:l})}return r}const _=["A4@","B8","E3","G6","I1!|","L1|","O0","S5$","T7+","Z2"];function P(n,t){const o=n.toUpperCase(),r=t.toUpperCase();for(const e of _){let i=!1,a=!1;for(const s of e)s===o&&(i=!0),s===r&&(a=!0);if(i&&a)return!0}return!1}function W(n,t){return n.toUpperCase()===t.toUpperCase()?0:P(n,t)?.2:1}function H(n){const t=[],o=/[A-Za-z0-9\u00C0-\uFFFF]+/g;let r;for(;(r=o.exec(n))!==null;)t.push({value:r[0],position:r.index});return t}function V(n,t){const o=n.toUpperCase(),r=t.toUpperCase(),e=o.length+1,i=r.length+1,a=Array.from({length:e},()=>new Array(i).fill(0));for(let s=0;s<e;s++)a[s][0]=s;for(let s=0;s<i;s++)a[0][s]=s;for(let s=1;s<e;s++)for(let l=1;l<i;l++){const u=a[s-1][l]+1,c=a[s][l-1]+1,p=a[s-1][l-1]+W(o[s-1],r[l-1]);a[s][l]=Math.min(u,c,p)}return a[o.length][r.length]}function J(n,t,o){const r=H(n),e=[];for(const i of t){const a=i.trim();if(!a)continue;const s=performance.now(),l=[];let u=0;for(const p of r){const d=Math.max(a.length,p.value.length);if(d===0||Math.abs(a.length-p.value.length)>Math.max(2,a.length*o))continue;const h=V(a,p.value)/d;h<=o&&h>0&&(l.push(p.position),u=Math.max(u,1-h))}const c=performance.now()-s;l.length>0&&e.push({keyword:a,positions:l,count:l.length,algorithm:"Fuzzy",executionTime:c,isFuzzy:!0,similarity:u})}return e}function Z(n){const t=n.length,o=new Array(t).fill(0);let r=0;for(let e=1;e<t;e++){for(;r>0&&n[r]!==n[e];)r=o[r-1];n[r]===n[e]&&r++,o[e]=r}return o}function D(n,t){const o=n.length,r=t.length;if(r===0||r>o)return{positions:[],comparisons:0};const e=Z(t),i=[];let a=0,s=0;for(let l=0;l<o;l++)for(;;)if(s++,t[a]===n[l]){a++,a===r&&(i.push(l-r+1),a=e[a-1]);break}else if(a>0)a=e[a-1];else break;return{positions:i,comparisons:s}}function G(n,t){const o=n.toUpperCase(),r=[];for(const e of t){const i=e.trim().toUpperCase();if(!i)continue;const a=performance.now(),{positions:s,comparisons:l}=D(o,i),u=performance.now()-a;s.length>0&&r.push({keyword:e,positions:s,count:s.length,algorithm:"KMP",executionTime:u,comparisons:l})}return r}const k=31,b=1000000007;function w(n){return n.charCodeAt(0)}function m(n,t){return Number(BigInt(n)*BigInt(t)%BigInt(b))}function y(n,t){return(n+t)%b}function T(n,t,o){let r=0;for(let e=0;e<o;e++)r=y(m(r,k),w(n[t+e]));return r}function X(n,t){const o=n.length,r=t.length;if(r===0||r>o)return{positions:[],comparisons:0,hashComparisons:0};let e=1;for(let c=0;c<r-1;c++)e=m(e,k);const i=T(t,0,r);let a=T(n,0,r);const s=[];let l=0,u=0;for(let c=0;c<=o-r;c++)if(c>0&&(a=y(m(y(a-m(w(n[c-1]),e)+b,0),k),w(n[c+r-1]))),u++,a===i){let p=!0;for(let d=0;d<r;d++)if(l++,n[c+d]!==t[d]){p=!1;break}p&&s.push(c)}return{positions:s,comparisons:l,hashComparisons:u}}function Q(n,t){const o=n.toUpperCase(),r=[];for(const e of t){const i=e.trim().toUpperCase();if(!i)continue;const a=performance.now(),{positions:s,comparisons:l}=X(o,i),u=performance.now()-a;s.length>0&&r.push({keyword:e,positions:s,count:s.length,algorithm:"RK",executionTime:u,comparisons:l})}return r}const Y={A:"[A4@ÀÁÂÃÄÅĀĂĄαΑ]",B:"[B8ß]",C:"[C(¢©Ç]",D:"[Dð]",E:"[E3ÈÉÊËĒĔĖĘĚεΕЕ]",F:"[Fƒ]",G:"[G6Ğ]",H:"[H#]",I:"[I1|!ÌÍÎÏĪĬĮİιΙ]",J:"[Jʝ]",K:"[Kκ]",L:"[L1|ŁλΛ]",M:"[MмМ]",N:"[NñŃŅŇηΗ]",O:"[O0ÒÓÔÕÖØŌŎŐοΟОо]",P:"[PрΡ]",Q:"[Qq]",R:"[RrŔŖŘρΡ]",S:"[S5$§ŚŜŞŠσΣ]",T:"[T7+ŢŤτΤ]",U:"[UÙÚÛÜŪŬŮŰŲΥ]",V:"[Vν]",W:"[Wω]",X:"[X×χΧ]",Y:"[YÝŶŸγΥ]",Z:"[Z2ŹŻŽζ]"};function v(n){return n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function nn(n){return n.toUpperCase().split("").map(o=>Y[o]??`[${v(o)}${v(o.toLowerCase())}]`).join("")+"\\d{2,4}"}function tn(n,t){const o=performance.now(),r=[],e=new Set;for(const u of t){const c=u.trim();if(!c)continue;const p=nn(c),d=new RegExp(p,"g"),f=[];let h;for(d.lastIndex=0;(h=d.exec(n))!==null;)f.push(h.index),e.add(c.toUpperCase());f.length>0&&r.push({keyword:c,positions:f,count:f.length,algorithm:"Regex",executionTime:performance.now()-o})}const i=/\b([A-Za-zͰ-Ͽ][A-Za-z0-9Ͱ-Ͽ]{1,})\d{2,4}\b/g,a=[],s=[];let l;for(i.lastIndex=0;(l=i.exec(n))!==null;){const u=l[1].toUpperCase();if(!e.has(u)){a.push(l.index);const c=l[0];s.some(p=>p===c)||s.push(c)}}if(a.length>0){const u=s.slice(0,3).join(", ")+(s.length>3?"...":"");r.push({keyword:`(catch-all: ${u})`,positions:a,count:a.length,algorithm:"Regex",executionTime:performance.now()-o})}return r}const rn=`slot\r
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
`,on=["KMP","BM","Regex","RK","AC","Fuzzy"],x="judol-detector-highlight",C="judol-detector-tooltip",en=.3,g=rn.split(`
`).map(n=>n.trim()).filter(n=>n.length>0&&!n.startsWith("#"));function sn(n){return n==="script"||n==="style"||n==="noscript"||n==="textarea"||n==="input"}function an(n){return n.classList.contains(x)||n.classList.contains(C)}function ln(n){const t=window.getComputedStyle(n);return t.display!=="none"&&t.visibility!=="hidden"&&t.opacity!=="0"}function cn(n){const t=n.parentElement,o=n.nodeValue??"";return!t||o.trim().length===0||sn(t.tagName.toLowerCase())||an(t)||!ln(t)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}function un(){const n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:cn}),t=[];let o="",r=n.nextNode();for(;r;){const e=r,i=e.nodeValue??"",a=o.length,s=a+i.length;o+=i,o+=`
`,t.push({node:e,text:i,start:a,end:s}),r=n.nextNode()}return{text:o,parts:t}}function pn(){const n=Array.from(document.querySelectorAll(`.${x}`));for(const t of n){const o=t.parentNode;o&&(o.replaceChild(document.createTextNode(t.textContent??""),t),o.normalize())}}function R(){const n=Array.from(document.querySelectorAll(`.${C}`));for(const t of n)t.remove()}function dn(){R(),pn()}function gn(n){return n==="KMP"||n==="BM"||n==="RK"||n==="AC"}function hn(n){const t=new Set;for(const o of n)gn(o.algorithm)&&t.add(o.keyword.trim().toUpperCase());return t}function fn(n){const t=[];for(const o of g)n.has(o.toUpperCase())||t.push(o);return t}function mn(n,t){const o=G(n,g),r=O(n,g),e=t.acRkEnabled?Q(n,g):[],i=t.acRkEnabled?q(n,g):[],a=tn(n,g),s=hn([...o,...r,...e,...i]),l=J(n,fn(s),en);return[...o,...r,...e,...i,...a,...l]}function kn(n){return/[A-Za-z0-9\u00C0-\uFFFF]/.test(n)}function bn(n,t){let o=0;for(;t+o<n.length&&kn(n[t+o]);)o++;return o===0?1:o}function wn(n,t,o){return t.algorithm==="Regex"||t.algorithm==="Fuzzy"?bn(n,o):Math.max(1,t.keyword.length)}function yn(n,t){return n.node!==t.node?!1:n.start<t.end&&t.start<n.end}function xn(n,t){for(const o of n)if(yn(o,t)){o.start=Math.min(o.start,t.start),o.end=Math.max(o.end,t.end),o.matches.push(...t.matches);return}n.push(t)}function Cn(n,t,o,r,e){const i=wn(n,r,e),a=e+i;for(const s of t)e>=s.end||a<=s.start||xn(o,{node:s.node,start:Math.max(0,e-s.start),end:Math.min(s.text.length,a-s.start),matches:[r]})}function jn(n,t){const o=[];for(const r of t)for(const e of r.positions)Cn(n.text,n.parts,o,r,e);return o.filter(r=>r.end>r.start)}function Tn(n){return n<1?`${(n*1e3).toFixed(0)} us`:n<1e3?`${n.toFixed(2)} ms`:`${(n/1e3).toFixed(2)} s`}function vn(n){const t=new Set,o=[];for(const r of n){const e=`${r.keyword} (${r.algorithm})`;t.has(e)||(t.add(e),o.push(e))}return o.join(", ")}function E(n){let t=0;for(const o of n)t+=o.count;return t}function Rn(n){let t=0;for(const o of n)t+=o.executionTime;return t}function M(){R()}function En(n,t){M();const o=n.getBoundingClientRect(),r=document.createElement("div");r.className=C,r.textContent=`Keyword: ${vn(t)} | Kemunculan: ${E(t)} | Waktu: ${Tn(Rn(t))}`,r.style.position="fixed",r.style.left=`${Math.max(8,o.left)}px`,r.style.top=`${Math.max(8,o.top-34)}px`,r.style.zIndex="2147483647",r.style.background="#111827",r.style.color="#ffffff",r.style.padding="6px 8px",r.style.borderRadius="4px",r.style.font="12px Arial, sans-serif",r.style.maxWidth="420px",r.style.pointerEvents="none",document.body.appendChild(r)}function Mn(n,t,o){const r=document.createElement("span");return r.className=x,r.textContent=n,r.style.background="#fde047",r.style.color="inherit",r.style.borderRadius="3px",r.style.padding="0 2px",o.blurTextEnabled&&(r.style.filter="blur(4px)",r.style.userSelect="none"),r.addEventListener("mouseenter",()=>En(r,t)),r.addEventListener("mouseleave",M),r}function Sn(n){const t=new Map;for(const o of n){const r=t.get(o.node);r?r.push(o):t.set(o.node,[o])}return t}function Fn(n,t,o){var a;const r=n.nodeValue??"",e=document.createDocumentFragment();let i=0;t.sort((s,l)=>s.start-l.start);for(const s of t)s.start>i&&e.appendChild(document.createTextNode(r.slice(i,s.start))),e.appendChild(Mn(r.slice(s.start,s.end),s.matches,o)),i=s.end;i<r.length&&e.appendChild(document.createTextNode(r.slice(i))),(a=n.parentNode)==null||a.replaceChild(e,n)}function zn(n,t){const o=Sn(n);for(const[r,e]of o)Fn(r,e,t)}function An(n){const t=[];for(const o of on){let r=0,e=0,i=0;for(const a of n)a.algorithm===o&&(r+=a.count,e+=a.executionTime,i+=a.comparisons??0);t.push({algorithm:o,totalMatches:r,executionTime:e,comparisons:i})}return t}function Nn(n){return{matches:n,algorithmStats:An(n),totalKeywordsFound:E(n),timestamp:Date.now()}}function Un(){return new Promise(n=>{chrome.storage.local.get(["detectorSettings"],t=>{const o=t.detectorSettings;n({blurTextEnabled:(o==null?void 0:o.blurTextEnabled)===!0,acRkEnabled:(o==null?void 0:o.acRkEnabled)!==!1})})})}async function S(){dn();const n=await Un(),t=un(),o=mn(t.text,n),r=jn(t,o);zn(r,n),await chrome.storage.local.set({scanResult:Nn(o)})}chrome.runtime.onMessage.addListener(n=>{(n.type==="RESCAN"||n.type==="SET_BLUR_TEXT"||n.type==="SET_AC_RK")&&S()}),S()})();
