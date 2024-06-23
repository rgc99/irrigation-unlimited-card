function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var a;const l=window,d=l.trustedTypes,c=d?d.emptyScript:"",u=l.reactiveElementPolyfillSupport,h={toAttribute(t,e){switch(e){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>e!==t&&(e==e||t==t),p={attribute:!0,type:String,converter:h,reflect:!1,hasChanged:v},_="finalized";let m=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=p){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty(_))return!1;this[_]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((i=>{const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=p){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:h).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:h;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;m[_]=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:m}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const $=window,f=$.trustedTypes,y=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,b="$lit$",w=`lit$${(Math.random()+"").slice(9)}$`,S="?"+w,E=`<${S}>`,A=document,x=()=>A.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,k=Array.isArray,z="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,j=/>/g,O=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),M=/'/g,R=/"/g,q=/^(?:script|style|textarea|title)$/i,T=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),N=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),H=new WeakMap,L=A.createTreeWalker(A,129,null,!1);function I(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==y?y.createHTML(e):e}const V=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":"",r=U;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===U?"!--"===l[1]?r=P:void 0!==l[1]?r=j:void 0!==l[2]?(q.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=O):void 0!==l[3]&&(r=O):r===O?">"===l[0]?(r=null!=n?n:U,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?O:'"'===l[3]?R:M):r===R||r===M?r=O:r===P||r===j?r=U:(r=O,n=void 0);const u=r===O&&t[e+1].startsWith("/>")?" ":"";o+=r===U?i+E:d>=0?(s.push(a),i.slice(0,d)+b+i.slice(d)+w+u):i+w+(-2===d?(s.push(void 0),e):u)}return[I(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class B{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,d]=V(t,e);if(this.el=B.createElement(l,i),L.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=L.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(b)||e.startsWith(w)){const i=d[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+b).split(w),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?G:"?"===e[1]?Q:"@"===e[1]?X:J})}else a.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(q.test(s.tagName)){const t=s.textContent.split(w),e=t.length-1;if(e>0){s.textContent=f?f.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],x()),L.nextNode(),a.push({type:2,index:++n});s.append(t[e],x())}}}else if(8===s.nodeType)if(s.data===S)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(w,t+1));)a.push({type:7,index:n}),t+=w.length-1}n++}}static createElement(t,e){const i=A.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){var n,o,r,a;if(e===N)return e;let l=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const d=C(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,s)),void 0!==s?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=Z(t,l._$AS(t,e.values),l,s)),e}class W{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:A).importNode(i,!0);L.currentNode=n;let o=L.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new K(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new Y(o,this,t)),this._$AV.push(e),l=s[++a]}r!==(null==l?void 0:l.index)&&(o=L.nextNode(),r++)}return L.currentNode=A,n}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class K{constructor(t,e,i,s){var n;this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),C(t)?t===D||null==t||""===t?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==N&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>k(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==D&&C(this._$AH)?this._$AA.nextSibling.data=t:this.$(A.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=B.createElement(I(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(i);else{const t=new W(n,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=H.get(t.strings);return void 0===e&&H.set(t.strings,e=new B(t)),e}T(t){k(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new K(this.k(x()),this.k(x()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class J{constructor(t,e,i,s,n){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=D}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=Z(this,t,e,0),o=!C(t)||t!==this._$AH&&t!==N,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Z(this,s[i+r],e,r),a===N&&(a=this._$AH[r]),o||(o=!C(a)||a!==this._$AH[r]),a===D?t=D:t!==D&&(t+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===D?void 0:t}}const F=f?f.emptyScript:"";class Q extends J{constructor(){super(...arguments),this.type=4}j(t){t&&t!==D?this.element.setAttribute(this.name,F):this.element.removeAttribute(this.name)}}class X extends J{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=Z(this,t,e,0))&&void 0!==i?i:D)===N)return;const s=this._$AH,n=t===D&&s!==D||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==D&&(s===D||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Y{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const tt=$.litHtmlPolyfillSupport;null==tt||tt(B,K),(null!==(g=$.litHtmlVersions)&&void 0!==g?g:$.litHtmlVersions=[]).push("2.8.0");const et=window,it=et.ShadowRoot&&(void 0===et.ShadyCSS||et.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,st=Symbol(),nt=new WeakMap;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ot=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==st)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(it&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=nt.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&nt.set(e,t))}return t}toString(){return this.cssText}};const rt=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new ot(i,t,st)},at=it?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new ot("string"==typeof t?t:t+"",void 0,st))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var lt;const dt=window,ct=dt.trustedTypes,ut=ct?ct.emptyScript:"",ht=dt.reactiveElementPolyfillSupport,vt={toAttribute(t,e){switch(e){case Boolean:t=t?ut:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},pt=(t,e)=>e!==t&&(e==e||t==t),_t={attribute:!0,type:String,converter:vt,reflect:!1,hasChanged:pt},mt="finalized";class gt extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=_t){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||_t}static finalize(){if(this.hasOwnProperty(mt))return!1;this[mt]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(at(t))}else void 0!==t&&e.push(at(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{it?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),s=et.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=_t){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:vt).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:vt;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||pt)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var $t,ft;gt[mt]=!0,gt.elementProperties=new Map,gt.elementStyles=[],gt.shadowRootOptions={mode:"open"},null==ht||ht({ReactiveElement:gt}),(null!==(lt=dt.reactiveElementVersions)&&void 0!==lt?lt:dt.reactiveElementVersions=[]).push("1.6.3");class yt extends gt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new K(e.insertBefore(x(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return N}}yt.finalized=!0,yt._$litElement$=!0,null===($t=globalThis.litElementHydrateSupport)||void 0===$t||$t.call(globalThis,{LitElement:yt});const bt=globalThis.litElementPolyfillSupport;null==bt||bt({LitElement:yt}),(null!==(ft=globalThis.litElementVersions)&&void 0!==ft?ft:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,St=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}},Et=(t,e,i)=>{e.constructor.createProperty(i,t)};function At(t){return(e,i)=>void 0!==i?Et(t,e,i):St(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function xt(t){return At({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Ct;null===(Ct=window.HTMLSlotElement)||void 0===Ct||Ct.prototype.assignedElements;let kt=class extends yt{setConfig(t){this._config=t}get _name(){var t;return(null===(t=this._config)||void 0===t?void 0:t.name)||""}get _show_controllers(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_controllers)||""}get _always_show_zones(){var t;return(null===(t=this._config)||void 0===t?void 0:t.always_show_zones)||!1}get _always_show_sequences(){var t;return(null===(t=this._config)||void 0===t?void 0:t.always_show_sequences)||!1}get _show_timeline_scheduled(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_timeline_scheduled)||!1}get _show_timeline_history(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_timeline_history)||!0}render(){return this.hass?T`
      <div class="iu-editor-row">
        <ha-textfield
          label="Title (optional)"
          .value=${this._name}
          .configValue=${"name"}
          @input="${this._valueChanged}"
        ></ha-textfield>
      </div>
      <div class="iu-editor-row">
        <ha-textfield
          label="Show controllers (CSV list)"
          .value=${this._show_controllers}
          .configValue=${"show_controllers"}
          @input="${this._valueChanged}"
        ></ha-textfield>
      </div>
      <div class="iu-editor-row">
        <ha-switch
          id=${this._always_show_zones}
          .checked=${this._always_show_zones}
          .configValue=${"always_show_zones"}
          @change=${this._valueChanged}
        ></ha-switch>
        <label for=${this._always_show_zones}>Always show zones</label>
      </div>
      <div class="iu-editor-row">
        <ha-switch
          id=${this._always_show_sequences}
          .checked=${this._always_show_sequences}
          .configValue=${"always_show_sequences"}
          @change=${this._valueChanged}
        ></ha-switch>
        <label for=${this._always_show_sequences}>Always show sequences</label>
      </div>
      <div class="iu-editor-row">
        <ha-switch
          id=${this._show_timeline_scheduled}
          .checked=${this._show_timeline_scheduled}
          .configValue=${"show_timeline_scheduled"}
          @change=${this._valueChanged}
        ></ha-switch>
        <label for=${this._show_timeline_scheduled}
          >Show timeline scheduled</label
        >
      </div>
      <div class="iu-editor-row">
        <ha-switch
          id=${this._show_timeline_history}
          .checked=${this._show_timeline_history}
          .configValue=${"show_timeline_history"}
          @change=${this._valueChanged}
        ></ha-switch>
        <label for=${this._show_timeline_history}>Show timeline history</label>
      </div>
    `:D}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;if(e.configValue)if(""===e.value){const t=Object.assign({},this._config);delete t[e.configValue],this._config=t}else this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:void 0!==e.checked?e.checked:e.value});((t,e,i,s)=>{s=s||{},i=null==i?{}:i;const n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});n.detail=i,t.dispatchEvent(n)})(this,"config-changed",{config:this._config},{bubbles:!0,composed:!0})}};function zt(t){if(t){var e=t.split(":");return 60*+e[0]*60+60*+e[1]+(+e[2]||0)}}function Ut(t){if(!t)return;const e=Math.floor(t/3600),i=Math.floor((t-3600*e)/60),s=t%60;return String(e)+":"+String(i).padStart(2,"0")+":"+String(s).padStart(2,"0")}kt.styles=rt`
    ha-switch {
      padding: 16px 6px;
    }
    ha-textfield {
      width: 100%;
    }
  `,t([At({attribute:!1})],kt.prototype,"hass",void 0),t([xt()],kt.prototype,"_config",void 0),kt=t([wt("irrigation-unlimited-card-editor")],kt);class Pt{constructor(t){this.start=void 0,this.status=void 0,this.duration=void 0,this._remaining=void 0,this.last_updated=void 0,this._percent_completed=void 0,this.index=t.index,this.name=t.name,this.entity_id=t.entity_id}get remaining(){return Ut(this._remaining)}set remaining(t){this._remaining=zt(t)}get percent_completed(){return this._percent_completed}update(t){let e=0;const i=t.states[this.entity_id],s=new Date(i.last_updated);return(void 0===this.last_updated||s>this.last_updated)&&(this.last_updated=s,e|=1,this.status=i.attributes.status,"on"===this.status||"delay"===this.status||"paused"===this.status?(this.start=new Date(i.attributes.current_start),this.duration=zt(i.attributes.current_duration),this.remaining=i.attributes.time_remaining):this.duration=this.start=this._remaining=void 0),"on"!==this.status&&"delay"!==this.status||(e|=2),e}timer(t){if(this.start&&this.duration&&("on"===this.status||"delay"===this.status)){const e=Math.round((t.getTime()-this.start.getTime())/1e3);this._remaining=this.duration-e,this._percent_completed=Math.round(e/this.duration*100)}}}class jt{constructor(t){this.enabled=!0,this.suspended=null,this.index=t.index,this.zone_ids=t.zone_ids}get remaining(){return Ut(this._remaining)}set remaining(t){this._remaining=zt(t)}get duration(){return Ut(this._remaining)}set duration(t){this._remaining=zt(t)}}class Ot extends Pt{constructor(t){super(t),this.zones=[];for(const e of t.zones)this.zones.push(new jt(e))}update(t){let e=super.update(t);if(1&e){const e=t.states[this.entity_id];for(const t of e.attributes.zones){const e=this.zones[t.index];e.icon=t.icon,e.enabled=t.enabled,e.suspended=t.suspended?new Date(t.suspended):null,e.start=new Date(t.start),e._duration=zt(t.duration),e.adjustment=t.adjustment,"off"===e.status&&"on"===t.status?(e._remaining=e._duration,e.percent_completed=0):"off"===t.status&&(e._remaining=e.percent_completed=void 0),e.status=t.status}}return e}timer(t){if(super.timer(t),"on"===this.status)for(const e of this.zones)if(e.start&&e._duration){const i=Math.round((t.getTime()-e.start.getTime())/1e3);e._remaining=e._duration-i,e.percent_completed=Math.round(i/e._duration*100)}}}class Mt extends Pt{constructor(t){super(t),this.zone_id=t.zone_id}}class Rt extends Pt{constructor(t){super(t),this.zones=[],this.sequences=[],this.controller_id=t.controller_id;for(const e of t.zones)this.zones.push(new Mt(e));for(const e of t.sequences)this.sequences.push(new Ot(e))}lookup_zone_name(t){for(const e of this.zones)if(e.zone_id===t)return e.name}update(t){let e=super.update(t);for(const i of this.zones)e|=i.update(t);for(const i of this.sequences)e|=i.update(t);return e}}class qt{constructor(t){this.initialised=!1,this.version="",this.timer_id=void 0,this.parent=t,this.controllers=[]}async _getInfo(t){try{return(await t.callService("irrigation_unlimited","get_info",{},{entity_id:"irrigation_unlimited.coordinator"},!0,!0)).response}catch(t){throw console.log(t),t}}init(t){t&&!this.initialised&&this._getInfo(t).then((t=>{this.version=t.version;for(const e of t.controllers)this.controllers.push(new Rt(e));this.initialised=!0,this.parent.requestUpdate()}))}update(t){if(!this.initialised)return!1;let e=0;for(const i of this.controllers)e|=i.update(t);return void 0===this.timer_id&&2&e?this.start_timer(t):void 0===this.timer_id||2&e||this.stop_timer(),0!==e}start_timer(t){var e;this.timer_id||(this.timer_id=setInterval((e=this,function(){const t=new Date;for(const i of e.controllers){i.timer(t);for(const e of i.zones)e.timer(t);for(const e of i.sequences)e.timer(t)}e.parent.requestUpdate()}),1e3))}stop_timer(){this.timer_id&&(clearInterval(this.timer_id),this.timer_id=void 0)}}const Tt=rt`
  .iu-controller.iu-hidden {
    display: none;
  }

  .iu-control-panel {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .iu-control-panel-item {
    padding: 0.5em 0 0.5em 1em;
  }

  .iu-zones.iu-hidden.iu-content {
    display: none;
  }

  .iu-sequences.iu-hidden.iu-content {
    display: none;
  }

  .iu-hidden .iu-content {
    display: none;
  }

  .iu-hidden .iu-expander::before {
    content: "\u25B6";
    font-size: large;
  }

  .iu-expander::before {
    content: "\u25BC";
    font-size: large;
  }

  .iu-controller-row.iu-td {
    display: flex;
    align-items: center;
    min-height: 3em;
  }

  .iu-zone-row.iu-td {
    display: flex;
    align-items: center;
    min-height: 3em;
  }

  .iu-sequence-row.iu-td {
    display: flex;
    align-items: center;
    min-height: 3em;
  }

  .iu-sequence-zone-row.iu-td {
    display: flex;
    align-items: center;
    height: 2em;
  }

  .iu-timeline-scheduled,
  .iu-timeline-scheduled .iu-schedule {
    color: var(--label-badge-blue, #039be5);
  }

  .iu-timeline-next,
  .iu-timeline-next .iu-schedule {
    color: var(--label-badge-red, #db4437);
  }

  .iu-timeline-history,
  .iu-timeline-history .iu-schedule {
    color: var(--label-badge-green, #43a047);
  }

  .iu-td {
    display: flex;
    align-items: center;
  }

  .iu-td1 {
    flex: 1.5em;
    text-align: center;
    cursor: pointer;
  }

  .iu-td2 {
    flex: 30px;
    text-align: center;
  }

  .iu-td3 {
    flex: 40%;
    text-align: left;
  }

  .iu-td4 {
    flex: 20%;
    text-align: center;
  }

  .iu-td5 {
    flex: 15%;
    text-align: center;
  }

  .iu-td6 {
    flex: 15%;
    text-align: center;
  }

  .iu-td7 {
    flex: 10%;
    text-align: center;
  }

  .iu-on .iu-duration,
  .iu-delay .iu-duration {
    color: var(--state-on-color, #66a61e);
  }

  .iu-paused .iu-duration {
    color: var(--state-on-color, #66a61e);
    animation: 1s step-end infinite duration-paused;
  }

  @keyframes duration-paused {
    50% {
      opacity: 0;
    }
  }

  .iu-schedule {
    color: var(--secondary-text-color, #727272);
    font-size: small;
  }

  .iu-manual .iu-schedule {
    color: var(--label-badge-red, #df4c1e);
  }

  .iu-suspended .iu-start {
    color: var(--label-badge-yellow, #ffff00);
    font-style: italic;
  }

  .iu-name {
    color: var(--secondary-text-color, #727272);
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ha-icon {
    color: var(--state-icon-color, #44739e);
  }

  .iu-on .iu-td2 ha-icon,
  .iu-paused .iu-td2 ha-icon,
  .iu-delay .iu-td2 ha-icon {
    color: var(--state-icon-active-color, #fdd835);
  }

  .iu-menu {
    position: relative;
    display: inline-block;
  }

  .iu-menu-button {
    background-color: transparent;
    text-align: center;
    display: block;
    font-size: 16px;
    border: none;
    cursor: pointer;
  }

  .iu-menu-content {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 200px;
    padding: 10px 0;
    position: absolute;
    background-color: var(--card-background-color, white);
    right: 0;
    box-shadow: 0px 0px 7px 0px rgba(50, 50, 50, 0.75);
    border-radius: 5px;
    z-index: 1;
  }

  .iu-menu-content.iu-hidden {
    display: none;
  }

  .iu-menu-content .iu-menu-item {
    display: flex;
    padding: 0px 5px;
    line-height: 48px;
  }

  .iu-menu .iu-menu-item:hover {
    color: var(--primary-color, #b3e5fc);
    background-color: var(--secondary-background-color, #e5e5e5);
  }

  .iu-menu-item.iu-hidden {
    display: none;
  }

  .iu-mc1 {
    flex: 30%;
    text-align: left;
  }

  .iu-mc2 {
    flex: 40%;
    text-align: right;
  }

  .iu-mc3 {
    flex: 30%;
    text-align: center;
  }

  .iu-mc3 ha-icon {
    display: flex;
  }

  .iu-adjust-input:invalid,
  .iu-time-input:invalid {
    color: var(--label-badge-red, #df4c1e);
  }
`;var Nt={version:"Version",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_error:"Show Error"},Dt={common:Nt},Ht={version:"Versjon",invalid_configuration:"Ikke gyldig konfiguration",show_warning:"Vis advarsel"},Lt={common:Ht};const It={en:Object.freeze({__proto__:null,common:Nt,default:Dt}),nb:Object.freeze({__proto__:null,common:Ht,default:Lt})};function Vt(t,e="",i=""){const s=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let n;try{n=t.split(".").reduce(((t,e)=>t[e]),It[s])}catch(e){n=t.split(".").reduce(((t,e)=>t[e]),It.en)}return void 0===n&&(n=t.split(".").reduce(((t,e)=>t[e]),It.en)),""!==e&&""!==i&&(n=n.replace(e,i)),n}console.info(`%c  IRRIGATION-UNLIMITED-CARD \n%c  ${Vt("common.version")} 2024.5.0    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"irrigation-unlimited-card",name:"Irrigation Unlimited Card",description:"A companion card for the Irrigation Unlimited integration"});let Bt=class extends yt{constructor(){super(...arguments),this.iu_coordinator=new qt(this)}static async getConfigElement(){return document.createElement("irrigation-unlimited-card-editor")}setConfig(t){if(!t)throw new Error(Vt("common.invalid_configuration"));this.config=t}static getStubConfig(){return{}}getCardSize(){return 1}firstUpdated(t){this.iu_coordinator.init(this.hass)}shouldUpdate(t){return!!this.hass&&(!!t.has("config")||this.iu_coordinator.update(this.hass))}render(){return this.hass?T`
      <ha-card
        .header=${this.config.name}
        tabindex="0"
        id="iu-card"
        @click="${this._clickNet}"
      >
        <div class="iu-header-row iu-td">
          <div class="iu-td1"></div>
          <div class="iu-td2"></div>
          <div class="iu-td3"></div>
          <div class="iu-td4"><ha-icon icon="mdi:clock-outline"></ha-icon></div>
          <div class="iu-td5"><ha-icon icon="mdi:timer-sand"></ha-icon></div>
          <div class="iu-td6"><ha-icon icon="mdi:delta"></ha-icon></div>
          <div class="iu-td7"><ha-icon icon="mdi:menu"></ha-icon></div>
        </div>
        <div class="iu-controllers">
          ${this.iu_coordinator.controllers.map((t=>this._renderController(t)))}
        </div>
      </ha-card>
    `:D}_renderController(t){var e;const i=this.hass.states[t.entity_id];i.attributes.status;const s="on"===i.state,n=i.attributes.enabled,o=i.attributes.suspended,r=!(!this.config.show_controllers||this.config.show_controllers&&(null===(e=this.config.show_controllers)||void 0===e?void 0:e.replace(/\s/g,"").split(",").includes(t.index+1+""))),a=!this.config.always_show_zones,l=!this.config.always_show_sequences;let d,c,u,h="";s?(d=new Date(i.attributes.current_start),c=t.remaining,u=i.attributes.current_name):o?(d=new Date(o),c="",u=""):(d=new Date(i.attributes.next_start),c=i.attributes.next_duration,u=i.attributes.next_name),isNaN(d.getTime())||(h=d.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}));const v=["iu-controller iu-object"];r&&v.push("iu-hidden");const p=["iu-controller-row iu-td"];s&&p.push("iu-on"),n&&p.push("iu-enabled"),o&&p.push("iu-suspended");const _=["iu-zones iu-content"];a&&_.push("iu-hidden");const m=["iu-sequences iu-content"];return l&&m.push("iu-hidden"),T`
      <div
        class=${v.join(" ")}
        iu-key="${t.index+1}.0.0.0"
      >
        <hr />
        <div class=${p.join(" ")}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${i.attributes.icon}></ha-icon>
          </div>
          <div class="iu-td3">
            <span>${t.index+1}</span>
            <span class="iu-name">${t.name}</span>
          </div>
          <div class="iu-td4">
            <div ?hidden=${!n}>
              <span class="iu-schedule">${u}</span>
              <br ?hidden=${s||o} />
              <span class="iu-start" ?hidden=${s}>${h}</span>
            </div>
          </div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!n}>${c}</div>
          </div>
          <div class="iu-td6"></div>
          <div class="iu-td7">
            ${this._renderMenu(n,!1,!0,!0,3,null,o)}
          </div>
        </div>
        <div class="iu-control-panel">
          <div class="iu-control-panel-item">
            <label>Zones&nbsp;</label>
            <ha-switch
              .checked="${!a}"
              .disabled="${this.config.always_show_zones}"
              @change="${this._toggleZones}"
            >
            </ha-switch>
          </div>
          <div class="iu-control-panel-item">
            <label>Sequences&nbsp;</label>
            <ha-switch
              .checked="${!l}"
              .disabled="${this.config.always_show_sequences}"
              @change="${this._toggleSequences}"
            >
            </ha-switch>
          </div>
        </div>
        <div class=${_.join(" ")}>
          <hr />
          ${t.zones.map((e=>this._renderZone(t,e)))}
        </div>
        <div class=${m.join(" ")}>
          <hr />
          ${t.sequences.map((e=>this._renderSequence(t,e)))}
        </div>
      </div>
    `}_renderZone(t,e){const i=this.hass.states[e.entity_id],s=i.attributes.status,n="on"===i.state,o=i.attributes.enabled,r=i.attributes.suspended,a="blocked"===s;let l,d,c,u,h,v="";n?(l=new Date(i.attributes.current_start),d=e.remaining,c=i.attributes.current_schedule,u=i.attributes.current_name,h=i.attributes.current_adjustment):r?(l=new Date(r),d="",c=-1,u="",h=""):(l=new Date(i.attributes.next_start),d=i.attributes.next_duration,c=i.attributes.next_schedule,u=i.attributes.next_name,h=i.attributes.next_adjustment);const p=0===c;isNaN(l.getTime())||(v=l.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}));const _=["iu-zone-row iu-td"];n&&_.push("iu-on"),o&&_.push("iu-enabled"),r&&_.push("iu-suspended"),p&&_.push("iu-manual"),a&&_.push("iu-blocked");let m=i.attributes.timeline;return void 0===m&&(m=[]),T`
      <div
        class="iu-zone iu-object"
        iu-key="${t.index+1}.${e.index+1}.0.0"
      >
        <div class="iu-collapsible iu-hidden">
          <div class=${_.join(" ")}>
            <div
              class="iu-td1 iu-expander"
              @click="${this._toggleCollapse}"
            ></div>
            <div class="iu-td2" @click="${this._toggleCollapse}">
              <ha-icon .icon=${i.attributes.icon}></ha-icon>
            </div>
            <div class="iu-td3">
              <span style="color: ${this._selectColour(e.index)}"
                >${e.index+1}</span
              >
              <span class="iu-name">${i.attributes.friendly_name}</span>
            </div>
            <div class="iu-td4">
              <div ?hidden=${!o||a}>
                <span class="iu-schedule">${u}</span>
                <br ?hidden=${n||p||r} />
                <span class="iu-start" ?hidden=${n||p}
                  >${v}</span
                >
              </div>
            </div>
            <div class="iu-td5 iu-duration">
              <div ?hidden=${!o||r||a}>
                ${d}
              </div>
            </div>
            <div class="iu-td6 iu-adjustment">
              <div ?hidden=${!o||a||r||p}>
                ${h}
              </div>
            </div>
            <div class="iu-td7">
              ${this._renderMenu(o,a,!0,!0,0,h,r)}
            </div>
          </div>
          <div class="iu-zone-history iu-content">
            ${m.filter((t=>t.start!==t.end&&"history"===t.status&&(void 0===this.config.show_timeline_history||this.config.show_timeline_history)||"scheduled"===t.status&&this.config.show_timeline_scheduled||"next"===t.status&&this.config.show_timeline_scheduled)).map((t=>this._renderZoneHistory(t)))}
          </div>
        </div>
      </div>
    `}_renderZoneHistory(t){const e=new Date(t.start),i=new Date(new Date(t.end).getTime()-e.getTime()).toISOString().slice(12,19),s=e.toLocaleString(void 0,{weekday:"short",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:!1}),n=["iu-timeline-row iu-td"];let o="";return"history"===t.status?(n.push("iu-timeline-history"),o="mdi:history"):"scheduled"===t.status?(n.push("iu-timeline-scheduled"),o="mdi:clock-outline"):"next"===t.status&&(n.push("iu-timeline-next"),o="mdi:clock-star-four-points-outline"),T`
      <div class="iu-zone-history iu-object">
        <div class=${n.join(" ")}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon icon=${o}></ha-icon>
          </div>
          <div class="iu-td3">${s}</div>
          <div class="iu-td4 iu-schedule">${t.schedule_name}</div>
          <div class="iu-td5 iu-duration">${i}</div>
          <div class="iu-td6 iu-adjustment">${t.adjustment}</div>
          <div class="iu-td7"></div>
        </div>
      </div>
    `}_renderSequence(t,e){const i=this.hass.states[e.entity_id],s=i.attributes.status,n="on"===s,o="paused"===s,r="delay"===s,a="blocked"===s,l=i.attributes.enabled,d=i.attributes.suspended;let c,u,h,v,p,_="";n||o||r?(c=new Date(i.attributes.current_start),u=e.remaining,h=i.attributes.current_schedule,v=i.attributes.current_name,p=i.attributes.adjustment):d?(c=new Date(d),u="",h=-1,v="",p=""):(c=new Date(i.attributes.next_start),u=i.attributes.next_duration,h=i.attributes.next_schedule,v=i.attributes.next_name,p=i.attributes.adjustment);const m=0===h,g="0:00:00"!==e.remaining;null===c||isNaN(c.getTime())||(_=c.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}));const $=["iu-sequence-row iu-td"];return n&&$.push("iu-on"),o&&$.push("iu-paused"),r&&$.push("iu-delay"),l&&$.push("iu-enabled"),d&&$.push("iu-suspended"),m&&$.push("iu-manual"),g&&$.push("iu-running"),a&&$.push("iu-blocked"),T`
      <div
        class="iu-sequence iu-object"
        iu-key="${t.index+1}.0.${e.index+1}.0"
      >
        <div class="iu-collapsible iu-hidden">
          <div class=${$.join(" ")}>
            <div
              class="iu-td1 iu-expander"
              @click="${this._toggleCollapse}"
            ></div>
            <div class="iu-td2" @click="${this._toggleCollapse}">
              <ha-icon
                .icon=${i.attributes.icon}
                ?is-on=${n||o}
              ></ha-icon>
            </div>
            <div class="iu-td3" @click="${this._toggleCollapse}">
              <span>${e.index+1}</span>
              <span class="iu-name">${e.name}</span>
            </div>
            <div class="iu-td4">
              <div ?hidden=${!l||a}>
                <span class="iu-schedule">${v}</span>
                <br ?hidden=${n||o||r||d} />
                <span class="iu-start" ?hidden=${n||o||r}
                  >${_}</span
                >
              </div>
            </div>
            <div class="iu-td5 iu-duration">
              <div
                ?hidden=${!l||d||a||!(g||o||r)}
              >
                ${u}
              </div>
            </div>
            <div class="iu-td6 iu-adjustment">
              <div ?hidden=${m}>${p}</div>
            </div>
            <div class="iu-td7">
              ${this._renderMenu(l,a,!0,!0,"on"===s||"delay"===s?1:"paused"===s?2:0,p,d)}
            </div>
          </div>
          <div class="iu-sequence-zones iu-content">
            ${e.zones.map((i=>this._renderSequenceZone(t,e,i,m)))}
          </div>
        </div>
      </div>
    `}_renderSequenceZone(t,e,i,s){const n=i.status,o="on"===n,r=i.enabled,a=i.suspended,l="blocked"===n,d=0!==i._duration;let c,u="";if(c=o?i.remaining:a?"":i.duration,null!==a){const t=new Date(a);isNaN(t.getTime())||(u=t.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}))}const h=["iu-sequence-zone-row iu-td"];return o&&h.push("iu-on"),r&&h.push("iu-enabled"),a&&h.push("iu-suspended"),s&&h.push("iu-manual"),d&&h.push("iu-running"),l&&h.push("iu-blocked"),T`
      <div
        class="iu-sequence-zone iu-object"
        iu-key="${t.index+1}.0.${e.index+1}.${i.index+1}"
      >
        <div class=${h.join(" ")}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${i.icon} ?is-on=${o}></ha-icon>
          </div>
          <div class="iu-td3">
            <span
              >${i.zone_ids.map(((e,i,s)=>this._renderSequenceZoneRef(t,e,i===s.length-1)))}</span
            >
          </div>
          <div class="iu-td4">
            <div ?hidden=${!r||l}>
              <span class="iu-start">${u}</span>
            </div>
          </div>
          <div class="iu-td5 iu-duration">
            <div
              ?hidden=${!r||null!==a||l||!d}
            >
              ${c}
            </div>
          </div>
          <div class="iu-td6 iu-adjustment">
            <div ?hidden=${s}>${i.adjustment}</div>
          </div>
          <div class="iu-td7">
            ${this._renderMenu(r,l,!1,!1,0,i.adjustment,a)}
          </div>
        </div>
      </div>
    `}_renderSequenceZoneRef(t,e,i){const s=t.lookup_zone_name(e);return s?T`<span class="iu-name"
        >${s}${!1===i?", ":""}</span
      >`:T`
      <span style="color: ${this._selectColour(parseInt(e)-1)}"
        >${e}</span
      >
    `}_renderMenu(t,e,i,s,n,o,r){return T`
      <div class="iu-menu">
        <ha-icon
          class="iu-menu-button"
          icon="mdi:dots-vertical"
          @click="${this._toggleMenu}"
        ></ha-icon>
        <div class="iu-menu-content iu-hidden">
          <div class="iu-menu-item">
            <div class="iu-mc1">Enable</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              ${this._renderEnabled(t,e)}
            </div>
          </div>
          <div
            class="iu-menu-item ${void 0===r?"iu-hidden":""}"
          >
            <div class="iu-mc1">Suspend</div>
            <div class="iu-mc2">
              <input
                type="text"
                class="iu-time-input"
                placeholder="h:mm:ss"
                title="Duration
===============
h:mm:ss
<blank> = reset"
                size="8"
                maxlength="8"
                required
                pattern="^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$"
              />
            </div>
            <div class="iu-mc3">
              <ha-icon-button
                icon="mdi:timer-outline"
                @click="${this._serviceSuspend}"
              >
                <ha-icon icon="mdi:timer-outline"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="iu-menu-item ${i?"":"iu-hidden"}">
            <div class="iu-mc1">Manual</div>
            <div class="iu-mc2">
              <input
                type="text"
                class="iu-time-input"
                placeholder="0:00:00"
                title="Duration"
                size="8"
                maxlength="8"
                required
                pattern="^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$"
              />
            </div>
            <div class="iu-mc3">
              <ha-icon-button
                icon="mdi:play"
                @click="${this._serviceManualRun}"
              >
                <ha-icon icon="mdi:run"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div
            class="iu-menu-item ${(1&~n)>0?"iu-hidden":""}"
          >
            <div class="iu-mc1">Pause</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              <ha-icon-button
                .disabled=${(1&~n)>0}
                @click="${this._servicePause}"
              >
                <ha-icon icon="mdi:pause"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div
            class="iu-menu-item ${(2&~n)>0?"iu-hidden":""}"
          >
            <div class="iu-mc1">Resume</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              <ha-icon-button
                .disabled=${(2&~n)>0}
                @click="${this._serviceResume}"
              >
                <ha-icon icon="mdi:play"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="iu-menu-item ${s?"":"iu-hidden"}">
            <div class="iu-mc1">Cancel</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              <ha-icon-button
                .disabled=${!s}
                @click="${this._serviceCancel}"
              >
                <ha-icon icon="mdi:cancel"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div
            class="iu-menu-item ${void 0===o?"iu-hidden":""}"
          >
            <div class="iu-mc1">Adjust</div>
            <div class="iu-mc2">
              <input
                type="text"
                class="iu-adjust-input"
                value=${null!=o?o:""}
                title="Adjustment options
===============
Percentage: %n
Actual: =0:00:00
Increase: +0:00:00
Decrease: -0:00:00
Reset: <blank>"
                size="9"
                maxlength="9"
                pattern="^$|^[=+-][0-9]{1,2}:[0-9]{2}:[0-9]{2}$|^%[0-9]*.?[0-9]+$"
              />
            </div>
            <div class="iu-mc3">
              <ha-icon-button icon="mdi:adjust" @click="${this._serviceAdjust}">
                <ha-icon icon="mdi:adjust"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
        </div>
      </div>
    `}_renderEnabled(t,e){return T`
      <ha-switch
        .checked=${t}
        .disabled=${e}
        @change="${this._serviceEnable}"
      ></ha-switch>
    `}_selectColour(t){const e=["#3498db","#e74c3c","#9b59b6","#f1c40f","#2ecc71","#1abc9c","#34495e","#e67e22","#7f8c8d","#27ae60","#2980b9","#8e44ad"];return e[t%e.length]}_clickNet(t){var e;const i=t.target;if(i.closest(".iu-menu"))return;const s=null===(e=i.closest("#iu-card"))||void 0===e?void 0:e.querySelectorAll(".iu-menu-content:not(.iu-hidden)");null==s||s.forEach((t=>t.classList.add("iu-hidden")))}_toggleCollapse(t){const e=t.target.closest(".iu-collapsible");null==e||e.classList.toggle("iu-hidden"),this.requestUpdate()}_toggleZones(t){var e,i;null===(i=null===(e=t.target.closest(".iu-controller"))||void 0===e?void 0:e.querySelector(".iu-zones"))||void 0===i||i.classList.toggle("iu-hidden")}_toggleSequences(t){var e,i;null===(i=null===(e=t.target.closest(".iu-controller"))||void 0===e?void 0:e.querySelector(".iu-sequences"))||void 0===i||i.classList.toggle("iu-hidden")}_toggleMenu(t){var e,i;null===(i=null===(e=t.target.closest(".iu-menu"))||void 0===e?void 0:e.querySelector(".iu-menu-content"))||void 0===i||i.classList.toggle("iu-hidden")}_get_iu_key(t){var e,i;return null===(i=null===(e=t.target.closest(".iu-object"))||void 0===e?void 0:e.getAttribute("iu-key"))||void 0===i?void 0:i.split(".",4)}_build_entity_id(t){const e=this.iu_coordinator.controllers[+t[0]-1];let i;return i="0"===t[1]&&"0"===t[2]?e.entity_id:"0"!==t[1]?e.zones[+t[1]-1].entity_id:e.sequences[+t[2]-1].entity_id,i}_build_data(t){const e=this._get_iu_key(t);if(!e)return;const i={entity_id:this._build_entity_id(e)};return"0"!==e[3]&&(i.zones=Number(e[3])),i}_serviceEnable(t){const e=this._build_data(t);e&&this.hass.callService("irrigation_unlimited","toggle",e)}_serviceSuspend(t){var e;const i=this._build_data(t);if(!i)return;const s=null===(e=t.target.closest(".iu-menu-item"))||void 0===e?void 0:e.querySelector(".iu-time-input");s.value?i.for=s.value:i.reset=null,this.hass.callService("irrigation_unlimited","suspend",i)}_serviceManualRun(t){var e;const i=this._build_data(t);if(!i)return;const s=null===(e=t.target.closest(".iu-menu-item"))||void 0===e?void 0:e.querySelector(".iu-time-input");s.value&&(i.time=s.value),this.hass.callService("irrigation_unlimited","manual_run",i),this._toggleMenu(t)}_serviceCancel(t){const e=this._build_data(t);e&&(this.hass.callService("irrigation_unlimited","cancel",e),this._toggleMenu(t))}_servicePause(t){const e=this._build_data(t);e&&(e.sequence_id="0",this.hass.callService("irrigation_unlimited","pause",e),this._toggleMenu(t))}_serviceResume(t){const e=this._build_data(t);e&&(e.sequence_id="0",this.hass.callService("irrigation_unlimited","resume",e),this._toggleMenu(t))}_serviceAdjust(t){var e;const i=this._build_data(t);if(!i)return;const s=(null===(e=t.target.closest(".iu-menu-item"))||void 0===e?void 0:e.querySelector(".iu-adjust-input")).value;switch(s.slice(0,1)){case"%":i.percentage=s.slice(1);break;case"=":i.actual=s.slice(1);break;case"+":i.increase=s.slice(1);break;case"-":i.decrease=s.slice(1);break;case"":i.reset=null;break;default:return}this.hass.callService("irrigation_unlimited","adjust_time",i),this._toggleMenu(t)}};Bt.styles=Tt,t([At({attribute:!1})],Bt.prototype,"hass",void 0),t([xt()],Bt.prototype,"config",void 0),Bt=t([wt("irrigation-unlimited-card")],Bt);export{Bt as IrrigationUnlimitedCard};
