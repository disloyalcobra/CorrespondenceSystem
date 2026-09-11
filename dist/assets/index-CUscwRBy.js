(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const a of l.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(i){if(i.ep)return;i.ep=!0;const l=n(i);fetch(i.href,l)}})();function Ou(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var zs={exports:{}},go={},Fs={exports:{}},V={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cr=Symbol.for("react.element"),Pu=Symbol.for("react.portal"),Mu=Symbol.for("react.fragment"),Lu=Symbol.for("react.strict_mode"),Uu=Symbol.for("react.profiler"),$u=Symbol.for("react.provider"),Bu=Symbol.for("react.context"),Vu=Symbol.for("react.forward_ref"),Wu=Symbol.for("react.suspense"),Hu=Symbol.for("react.memo"),Gu=Symbol.for("react.lazy"),ia=Symbol.iterator;function Qu(e){return e===null||typeof e!="object"?null:(e=ia&&e[ia]||e["@@iterator"],typeof e=="function"?e:null)}var Ds={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Ts=Object.assign,Is={};function Nn(e,t,n){this.props=e,this.context=t,this.refs=Is,this.updater=n||Ds}Nn.prototype.isReactComponent={};Nn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Nn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Rs(){}Rs.prototype=Nn.prototype;function ll(e,t,n){this.props=e,this.context=t,this.refs=Is,this.updater=n||Ds}var al=ll.prototype=new Rs;al.constructor=ll;Ts(al,Nn.prototype);al.isPureReactComponent=!0;var la=Array.isArray,As=Object.prototype.hasOwnProperty,sl={current:null},Os={key:!0,ref:!0,__self:!0,__source:!0};function Ps(e,t,n){var r,i={},l=null,a=null;if(t!=null)for(r in t.ref!==void 0&&(a=t.ref),t.key!==void 0&&(l=""+t.key),t)As.call(t,r)&&!Os.hasOwnProperty(r)&&(i[r]=t[r]);var s=arguments.length-2;if(s===1)i.children=n;else if(1<s){for(var c=Array(s),u=0;u<s;u++)c[u]=arguments[u+2];i.children=c}if(e&&e.defaultProps)for(r in s=e.defaultProps,s)i[r]===void 0&&(i[r]=s[r]);return{$$typeof:cr,type:e,key:l,ref:a,props:i,_owner:sl.current}}function qu(e,t){return{$$typeof:cr,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function cl(e){return typeof e=="object"&&e!==null&&e.$$typeof===cr}function Ku(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var aa=/\/+/g;function Ro(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Ku(""+e.key):t.toString(36)}function Dr(e,t,n,r,i){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var a=!1;if(e===null)a=!0;else switch(l){case"string":case"number":a=!0;break;case"object":switch(e.$$typeof){case cr:case Pu:a=!0}}if(a)return a=e,i=i(a),e=r===""?"."+Ro(a,0):r,la(i)?(n="",e!=null&&(n=e.replace(aa,"$&/")+"/"),Dr(i,t,n,"",function(u){return u})):i!=null&&(cl(i)&&(i=qu(i,n+(!i.key||a&&a.key===i.key?"":(""+i.key).replace(aa,"$&/")+"/")+e)),t.push(i)),1;if(a=0,r=r===""?".":r+":",la(e))for(var s=0;s<e.length;s++){l=e[s];var c=r+Ro(l,s);a+=Dr(l,t,n,c,i)}else if(c=Qu(e),typeof c=="function")for(e=c.call(e),s=0;!(l=e.next()).done;)l=l.value,c=r+Ro(l,s++),a+=Dr(l,t,n,c,i);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return a}function mr(e,t,n){if(e==null)return e;var r=[],i=0;return Dr(e,r,"","",function(l){return t.call(n,l,i++)}),r}function Xu(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var je={current:null},Tr={transition:null},Yu={ReactCurrentDispatcher:je,ReactCurrentBatchConfig:Tr,ReactCurrentOwner:sl};function Ms(){throw Error("act(...) is not supported in production builds of React.")}V.Children={map:mr,forEach:function(e,t,n){mr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return mr(e,function(){t++}),t},toArray:function(e){return mr(e,function(t){return t})||[]},only:function(e){if(!cl(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};V.Component=Nn;V.Fragment=Mu;V.Profiler=Uu;V.PureComponent=ll;V.StrictMode=Lu;V.Suspense=Wu;V.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Yu;V.act=Ms;V.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Ts({},e.props),i=e.key,l=e.ref,a=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,a=sl.current),t.key!==void 0&&(i=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(c in t)As.call(t,c)&&!Os.hasOwnProperty(c)&&(r[c]=t[c]===void 0&&s!==void 0?s[c]:t[c])}var c=arguments.length-2;if(c===1)r.children=n;else if(1<c){s=Array(c);for(var u=0;u<c;u++)s[u]=arguments[u+2];r.children=s}return{$$typeof:cr,type:e.type,key:i,ref:l,props:r,_owner:a}};V.createContext=function(e){return e={$$typeof:Bu,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:$u,_context:e},e.Consumer=e};V.createElement=Ps;V.createFactory=function(e){var t=Ps.bind(null,e);return t.type=e,t};V.createRef=function(){return{current:null}};V.forwardRef=function(e){return{$$typeof:Vu,render:e}};V.isValidElement=cl;V.lazy=function(e){return{$$typeof:Gu,_payload:{_status:-1,_result:e},_init:Xu}};V.memo=function(e,t){return{$$typeof:Hu,type:e,compare:t===void 0?null:t}};V.startTransition=function(e){var t=Tr.transition;Tr.transition={};try{e()}finally{Tr.transition=t}};V.unstable_act=Ms;V.useCallback=function(e,t){return je.current.useCallback(e,t)};V.useContext=function(e){return je.current.useContext(e)};V.useDebugValue=function(){};V.useDeferredValue=function(e){return je.current.useDeferredValue(e)};V.useEffect=function(e,t){return je.current.useEffect(e,t)};V.useId=function(){return je.current.useId()};V.useImperativeHandle=function(e,t,n){return je.current.useImperativeHandle(e,t,n)};V.useInsertionEffect=function(e,t){return je.current.useInsertionEffect(e,t)};V.useLayoutEffect=function(e,t){return je.current.useLayoutEffect(e,t)};V.useMemo=function(e,t){return je.current.useMemo(e,t)};V.useReducer=function(e,t,n){return je.current.useReducer(e,t,n)};V.useRef=function(e){return je.current.useRef(e)};V.useState=function(e){return je.current.useState(e)};V.useSyncExternalStore=function(e,t,n){return je.current.useSyncExternalStore(e,t,n)};V.useTransition=function(){return je.current.useTransition()};V.version="18.3.1";Fs.exports=V;var A=Fs.exports;const Zu=Ou(A);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ju=A,ep=Symbol.for("react.element"),tp=Symbol.for("react.fragment"),np=Object.prototype.hasOwnProperty,rp=Ju.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,op={key:!0,ref:!0,__self:!0,__source:!0};function Ls(e,t,n){var r,i={},l=null,a=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(a=t.ref);for(r in t)np.call(t,r)&&!op.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)i[r]===void 0&&(i[r]=t[r]);return{$$typeof:ep,type:e,key:l,ref:a,props:i,_owner:rp.current}}go.Fragment=tp;go.jsx=Ls;go.jsxs=Ls;zs.exports=go;var o=zs.exports,ci={},Us={exports:{}},Te={},$s={exports:{}},Bs={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(k,C){var I=k.length;k.push(C);e:for(;0<I;){var D=I-1>>>1,O=k[D];if(0<i(O,C))k[D]=C,k[I]=O,I=D;else break e}}function n(k){return k.length===0?null:k[0]}function r(k){if(k.length===0)return null;var C=k[0],I=k.pop();if(I!==C){k[0]=I;e:for(var D=0,O=k.length,X=O>>>1;D<X;){var L=2*(D+1)-1,ie=k[L],Re=L+1,ge=k[Re];if(0>i(ie,I))Re<O&&0>i(ge,ie)?(k[D]=ge,k[Re]=I,D=Re):(k[D]=ie,k[L]=I,D=L);else if(Re<O&&0>i(ge,I))k[D]=ge,k[Re]=I,D=Re;else break e}}return C}function i(k,C){var I=k.sortIndex-C.sortIndex;return I!==0?I:k.id-C.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;e.unstable_now=function(){return l.now()}}else{var a=Date,s=a.now();e.unstable_now=function(){return a.now()-s}}var c=[],u=[],v=1,f=null,h=3,x=!1,j=!1,N=!1,S=typeof setTimeout=="function"?setTimeout:null,m=typeof clearTimeout=="function"?clearTimeout:null,d=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function p(k){for(var C=n(u);C!==null;){if(C.callback===null)r(u);else if(C.startTime<=k)r(u),C.sortIndex=C.expirationTime,t(c,C);else break;C=n(u)}}function y(k){if(N=!1,p(k),!j)if(n(c)!==null)j=!0,Q(E);else{var C=n(u);C!==null&&b(y,C.startTime-k)}}function E(k,C){j=!1,N&&(N=!1,m(F),F=-1),x=!0;var I=h;try{for(p(C),f=n(c);f!==null&&(!(f.expirationTime>C)||k&&!w());){var D=f.callback;if(typeof D=="function"){f.callback=null,h=f.priorityLevel;var O=D(f.expirationTime<=C);C=e.unstable_now(),typeof O=="function"?f.callback=O:f===n(c)&&r(c),p(C)}else r(c);f=n(c)}if(f!==null)var X=!0;else{var L=n(u);L!==null&&b(y,L.startTime-C),X=!1}return X}finally{f=null,h=I,x=!1}}var g=!1,z=null,F=-1,P=5,M=-1;function w(){return!(e.unstable_now()-M<P)}function U(){if(z!==null){var k=e.unstable_now();M=k;var C=!0;try{C=z(!0,k)}finally{C?T():(g=!1,z=null)}}else g=!1}var T;if(typeof d=="function")T=function(){d(U)};else if(typeof MessageChannel<"u"){var B=new MessageChannel,Z=B.port2;B.port1.onmessage=U,T=function(){Z.postMessage(null)}}else T=function(){S(U,0)};function Q(k){z=k,g||(g=!0,T())}function b(k,C){F=S(function(){k(e.unstable_now())},C)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(k){k.callback=null},e.unstable_continueExecution=function(){j||x||(j=!0,Q(E))},e.unstable_forceFrameRate=function(k){0>k||125<k?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<k?Math.floor(1e3/k):5},e.unstable_getCurrentPriorityLevel=function(){return h},e.unstable_getFirstCallbackNode=function(){return n(c)},e.unstable_next=function(k){switch(h){case 1:case 2:case 3:var C=3;break;default:C=h}var I=h;h=C;try{return k()}finally{h=I}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(k,C){switch(k){case 1:case 2:case 3:case 4:case 5:break;default:k=3}var I=h;h=k;try{return C()}finally{h=I}},e.unstable_scheduleCallback=function(k,C,I){var D=e.unstable_now();switch(typeof I=="object"&&I!==null?(I=I.delay,I=typeof I=="number"&&0<I?D+I:D):I=D,k){case 1:var O=-1;break;case 2:O=250;break;case 5:O=1073741823;break;case 4:O=1e4;break;default:O=5e3}return O=I+O,k={id:v++,callback:C,priorityLevel:k,startTime:I,expirationTime:O,sortIndex:-1},I>D?(k.sortIndex=I,t(u,k),n(c)===null&&k===n(u)&&(N?(m(F),F=-1):N=!0,b(y,I-D))):(k.sortIndex=O,t(c,k),j||x||(j=!0,Q(E))),k},e.unstable_shouldYield=w,e.unstable_wrapCallback=function(k){var C=h;return function(){var I=h;h=C;try{return k.apply(this,arguments)}finally{h=I}}}})(Bs);$s.exports=Bs;var ip=$s.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var lp=A,De=ip;function _(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Vs=new Set,Hn={};function Gt(e,t){mn(e,t),mn(e+"Capture",t)}function mn(e,t){for(Hn[e]=t,e=0;e<t.length;e++)Vs.add(t[e])}var it=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),di=Object.prototype.hasOwnProperty,ap=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,sa={},ca={};function sp(e){return di.call(ca,e)?!0:di.call(sa,e)?!1:ap.test(e)?ca[e]=!0:(sa[e]=!0,!1)}function cp(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function dp(e,t,n,r){if(t===null||typeof t>"u"||cp(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Ne(e,t,n,r,i,l,a){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=a}var pe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){pe[e]=new Ne(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];pe[t]=new Ne(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){pe[e]=new Ne(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){pe[e]=new Ne(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){pe[e]=new Ne(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){pe[e]=new Ne(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){pe[e]=new Ne(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){pe[e]=new Ne(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){pe[e]=new Ne(e,5,!1,e.toLowerCase(),null,!1,!1)});var dl=/[\-:]([a-z])/g;function ul(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(dl,ul);pe[t]=new Ne(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(dl,ul);pe[t]=new Ne(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(dl,ul);pe[t]=new Ne(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){pe[e]=new Ne(e,1,!1,e.toLowerCase(),null,!1,!1)});pe.xlinkHref=new Ne("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){pe[e]=new Ne(e,1,!1,e.toLowerCase(),null,!0,!0)});function pl(e,t,n,r){var i=pe.hasOwnProperty(t)?pe[t]:null;(i!==null?i.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(dp(t,n,i,r)&&(n=null),r||i===null?sp(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):i.mustUseProperty?e[i.propertyName]=n===null?i.type===3?!1:"":n:(t=i.attributeName,r=i.attributeNamespace,n===null?e.removeAttribute(t):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var ct=lp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,hr=Symbol.for("react.element"),Kt=Symbol.for("react.portal"),Xt=Symbol.for("react.fragment"),fl=Symbol.for("react.strict_mode"),ui=Symbol.for("react.profiler"),Ws=Symbol.for("react.provider"),Hs=Symbol.for("react.context"),ml=Symbol.for("react.forward_ref"),pi=Symbol.for("react.suspense"),fi=Symbol.for("react.suspense_list"),hl=Symbol.for("react.memo"),ut=Symbol.for("react.lazy"),Gs=Symbol.for("react.offscreen"),da=Symbol.iterator;function Sn(e){return e===null||typeof e!="object"?null:(e=da&&e[da]||e["@@iterator"],typeof e=="function"?e:null)}var te=Object.assign,Ao;function Tn(e){if(Ao===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ao=t&&t[1]||""}return`
`+Ao+e}var Oo=!1;function Po(e,t){if(!e||Oo)return"";Oo=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(u){var r=u}Reflect.construct(e,[],t)}else{try{t.call()}catch(u){r=u}e.call(t.prototype)}else{try{throw Error()}catch(u){r=u}e()}}catch(u){if(u&&r&&typeof u.stack=="string"){for(var i=u.stack.split(`
`),l=r.stack.split(`
`),a=i.length-1,s=l.length-1;1<=a&&0<=s&&i[a]!==l[s];)s--;for(;1<=a&&0<=s;a--,s--)if(i[a]!==l[s]){if(a!==1||s!==1)do if(a--,s--,0>s||i[a]!==l[s]){var c=`
`+i[a].replace(" at new "," at ");return e.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",e.displayName)),c}while(1<=a&&0<=s);break}}}finally{Oo=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Tn(e):""}function up(e){switch(e.tag){case 5:return Tn(e.type);case 16:return Tn("Lazy");case 13:return Tn("Suspense");case 19:return Tn("SuspenseList");case 0:case 2:case 15:return e=Po(e.type,!1),e;case 11:return e=Po(e.type.render,!1),e;case 1:return e=Po(e.type,!0),e;default:return""}}function mi(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Xt:return"Fragment";case Kt:return"Portal";case ui:return"Profiler";case fl:return"StrictMode";case pi:return"Suspense";case fi:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Hs:return(e.displayName||"Context")+".Consumer";case Ws:return(e._context.displayName||"Context")+".Provider";case ml:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case hl:return t=e.displayName||null,t!==null?t:mi(e.type)||"Memo";case ut:t=e._payload,e=e._init;try{return mi(e(t))}catch{}}return null}function pp(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return mi(t);case 8:return t===fl?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function bt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Qs(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function fp(e){var t=Qs(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(a){r=""+a,l.call(this,a)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(a){r=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function xr(e){e._valueTracker||(e._valueTracker=fp(e))}function qs(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Qs(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Vr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function hi(e,t){var n=t.checked;return te({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function ua(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=bt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Ks(e,t){t=t.checked,t!=null&&pl(e,"checked",t,!1)}function xi(e,t){Ks(e,t);var n=bt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?gi(e,t.type,n):t.hasOwnProperty("defaultValue")&&gi(e,t.type,bt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function pa(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function gi(e,t,n){(t!=="number"||Vr(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var In=Array.isArray;function sn(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t["$"+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty("$"+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=""+bt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function vi(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(_(91));return te({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function fa(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(_(92));if(In(n)){if(1<n.length)throw Error(_(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:bt(n)}}function Xs(e,t){var n=bt(t.value),r=bt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function ma(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Ys(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function yi(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Ys(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var gr,Zs=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,i){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,i)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(gr=gr||document.createElement("div"),gr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=gr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Gn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var On={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},mp=["Webkit","ms","Moz","O"];Object.keys(On).forEach(function(e){mp.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),On[t]=On[e]})});function Js(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||On.hasOwnProperty(e)&&On[e]?(""+t).trim():t+"px"}function ec(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=Js(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,i):e[n]=i}}var hp=te({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ji(e,t){if(t){if(hp[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(_(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(_(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(_(61))}if(t.style!=null&&typeof t.style!="object")throw Error(_(62))}}function Ni(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var wi=null;function xl(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ki=null,cn=null,dn=null;function ha(e){if(e=pr(e)){if(typeof ki!="function")throw Error(_(280));var t=e.stateNode;t&&(t=wo(t),ki(e.stateNode,e.type,t))}}function tc(e){cn?dn?dn.push(e):dn=[e]:cn=e}function nc(){if(cn){var e=cn,t=dn;if(dn=cn=null,ha(e),t)for(e=0;e<t.length;e++)ha(t[e])}}function rc(e,t){return e(t)}function oc(){}var Mo=!1;function ic(e,t,n){if(Mo)return e(t,n);Mo=!0;try{return rc(e,t,n)}finally{Mo=!1,(cn!==null||dn!==null)&&(oc(),nc())}}function Qn(e,t){var n=e.stateNode;if(n===null)return null;var r=wo(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(_(231,t,typeof n));return n}var Si=!1;if(it)try{var _n={};Object.defineProperty(_n,"passive",{get:function(){Si=!0}}),window.addEventListener("test",_n,_n),window.removeEventListener("test",_n,_n)}catch{Si=!1}function xp(e,t,n,r,i,l,a,s,c){var u=Array.prototype.slice.call(arguments,3);try{t.apply(n,u)}catch(v){this.onError(v)}}var Pn=!1,Wr=null,Hr=!1,_i=null,gp={onError:function(e){Pn=!0,Wr=e}};function vp(e,t,n,r,i,l,a,s,c){Pn=!1,Wr=null,xp.apply(gp,arguments)}function yp(e,t,n,r,i,l,a,s,c){if(vp.apply(this,arguments),Pn){if(Pn){var u=Wr;Pn=!1,Wr=null}else throw Error(_(198));Hr||(Hr=!0,_i=u)}}function Qt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function lc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function xa(e){if(Qt(e)!==e)throw Error(_(188))}function jp(e){var t=e.alternate;if(!t){if(t=Qt(e),t===null)throw Error(_(188));return t!==e?null:e}for(var n=e,r=t;;){var i=n.return;if(i===null)break;var l=i.alternate;if(l===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===l.child){for(l=i.child;l;){if(l===n)return xa(i),e;if(l===r)return xa(i),t;l=l.sibling}throw Error(_(188))}if(n.return!==r.return)n=i,r=l;else{for(var a=!1,s=i.child;s;){if(s===n){a=!0,n=i,r=l;break}if(s===r){a=!0,r=i,n=l;break}s=s.sibling}if(!a){for(s=l.child;s;){if(s===n){a=!0,n=l,r=i;break}if(s===r){a=!0,r=l,n=i;break}s=s.sibling}if(!a)throw Error(_(189))}}if(n.alternate!==r)throw Error(_(190))}if(n.tag!==3)throw Error(_(188));return n.stateNode.current===n?e:t}function ac(e){return e=jp(e),e!==null?sc(e):null}function sc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=sc(e);if(t!==null)return t;e=e.sibling}return null}var cc=De.unstable_scheduleCallback,ga=De.unstable_cancelCallback,Np=De.unstable_shouldYield,wp=De.unstable_requestPaint,re=De.unstable_now,kp=De.unstable_getCurrentPriorityLevel,gl=De.unstable_ImmediatePriority,dc=De.unstable_UserBlockingPriority,Gr=De.unstable_NormalPriority,Sp=De.unstable_LowPriority,uc=De.unstable_IdlePriority,vo=null,Ye=null;function _p(e){if(Ye&&typeof Ye.onCommitFiberRoot=="function")try{Ye.onCommitFiberRoot(vo,e,void 0,(e.current.flags&128)===128)}catch{}}var He=Math.clz32?Math.clz32:Ep,bp=Math.log,Cp=Math.LN2;function Ep(e){return e>>>=0,e===0?32:31-(bp(e)/Cp|0)|0}var vr=64,yr=4194304;function Rn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Qr(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,i=e.suspendedLanes,l=e.pingedLanes,a=n&268435455;if(a!==0){var s=a&~i;s!==0?r=Rn(s):(l&=a,l!==0&&(r=Rn(l)))}else a=n&~i,a!==0?r=Rn(a):l!==0&&(r=Rn(l));if(r===0)return 0;if(t!==0&&t!==r&&!(t&i)&&(i=r&-r,l=t&-t,i>=l||i===16&&(l&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-He(t),i=1<<n,r|=e[n],t&=~i;return r}function zp(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Fp(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,l=e.pendingLanes;0<l;){var a=31-He(l),s=1<<a,c=i[a];c===-1?(!(s&n)||s&r)&&(i[a]=zp(s,t)):c<=t&&(e.expiredLanes|=s),l&=~s}}function bi(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function pc(){var e=vr;return vr<<=1,!(vr&4194240)&&(vr=64),e}function Lo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function dr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-He(t),e[t]=n}function Dp(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var i=31-He(n),l=1<<i;t[i]=0,r[i]=-1,e[i]=-1,n&=~l}}function vl(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-He(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}var H=0;function fc(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var mc,yl,hc,xc,gc,Ci=!1,jr=[],vt=null,yt=null,jt=null,qn=new Map,Kn=new Map,ft=[],Tp="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function va(e,t){switch(e){case"focusin":case"focusout":vt=null;break;case"dragenter":case"dragleave":yt=null;break;case"mouseover":case"mouseout":jt=null;break;case"pointerover":case"pointerout":qn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Kn.delete(t.pointerId)}}function bn(e,t,n,r,i,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:l,targetContainers:[i]},t!==null&&(t=pr(t),t!==null&&yl(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Ip(e,t,n,r,i){switch(t){case"focusin":return vt=bn(vt,e,t,n,r,i),!0;case"dragenter":return yt=bn(yt,e,t,n,r,i),!0;case"mouseover":return jt=bn(jt,e,t,n,r,i),!0;case"pointerover":var l=i.pointerId;return qn.set(l,bn(qn.get(l)||null,e,t,n,r,i)),!0;case"gotpointercapture":return l=i.pointerId,Kn.set(l,bn(Kn.get(l)||null,e,t,n,r,i)),!0}return!1}function vc(e){var t=At(e.target);if(t!==null){var n=Qt(t);if(n!==null){if(t=n.tag,t===13){if(t=lc(n),t!==null){e.blockedOn=t,gc(e.priority,function(){hc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ir(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Ei(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);wi=r,n.target.dispatchEvent(r),wi=null}else return t=pr(n),t!==null&&yl(t),e.blockedOn=n,!1;t.shift()}return!0}function ya(e,t,n){Ir(e)&&n.delete(t)}function Rp(){Ci=!1,vt!==null&&Ir(vt)&&(vt=null),yt!==null&&Ir(yt)&&(yt=null),jt!==null&&Ir(jt)&&(jt=null),qn.forEach(ya),Kn.forEach(ya)}function Cn(e,t){e.blockedOn===t&&(e.blockedOn=null,Ci||(Ci=!0,De.unstable_scheduleCallback(De.unstable_NormalPriority,Rp)))}function Xn(e){function t(i){return Cn(i,e)}if(0<jr.length){Cn(jr[0],e);for(var n=1;n<jr.length;n++){var r=jr[n];r.blockedOn===e&&(r.blockedOn=null)}}for(vt!==null&&Cn(vt,e),yt!==null&&Cn(yt,e),jt!==null&&Cn(jt,e),qn.forEach(t),Kn.forEach(t),n=0;n<ft.length;n++)r=ft[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<ft.length&&(n=ft[0],n.blockedOn===null);)vc(n),n.blockedOn===null&&ft.shift()}var un=ct.ReactCurrentBatchConfig,qr=!0;function Ap(e,t,n,r){var i=H,l=un.transition;un.transition=null;try{H=1,jl(e,t,n,r)}finally{H=i,un.transition=l}}function Op(e,t,n,r){var i=H,l=un.transition;un.transition=null;try{H=4,jl(e,t,n,r)}finally{H=i,un.transition=l}}function jl(e,t,n,r){if(qr){var i=Ei(e,t,n,r);if(i===null)Ko(e,t,r,Kr,n),va(e,r);else if(Ip(i,e,t,n,r))r.stopPropagation();else if(va(e,r),t&4&&-1<Tp.indexOf(e)){for(;i!==null;){var l=pr(i);if(l!==null&&mc(l),l=Ei(e,t,n,r),l===null&&Ko(e,t,r,Kr,n),l===i)break;i=l}i!==null&&r.stopPropagation()}else Ko(e,t,r,null,n)}}var Kr=null;function Ei(e,t,n,r){if(Kr=null,e=xl(r),e=At(e),e!==null)if(t=Qt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=lc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Kr=e,null}function yc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(kp()){case gl:return 1;case dc:return 4;case Gr:case Sp:return 16;case uc:return 536870912;default:return 16}default:return 16}}var ht=null,Nl=null,Rr=null;function jc(){if(Rr)return Rr;var e,t=Nl,n=t.length,r,i="value"in ht?ht.value:ht.textContent,l=i.length;for(e=0;e<n&&t[e]===i[e];e++);var a=n-e;for(r=1;r<=a&&t[n-r]===i[l-r];r++);return Rr=i.slice(e,1<r?1-r:void 0)}function Ar(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Nr(){return!0}function ja(){return!1}function Ie(e){function t(n,r,i,l,a){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=l,this.target=a,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(n=e[s],this[s]=n?n(l):l[s]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Nr:ja,this.isPropagationStopped=ja,this}return te(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Nr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Nr)},persist:function(){},isPersistent:Nr}),t}var wn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wl=Ie(wn),ur=te({},wn,{view:0,detail:0}),Pp=Ie(ur),Uo,$o,En,yo=te({},ur,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:kl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==En&&(En&&e.type==="mousemove"?(Uo=e.screenX-En.screenX,$o=e.screenY-En.screenY):$o=Uo=0,En=e),Uo)},movementY:function(e){return"movementY"in e?e.movementY:$o}}),Na=Ie(yo),Mp=te({},yo,{dataTransfer:0}),Lp=Ie(Mp),Up=te({},ur,{relatedTarget:0}),Bo=Ie(Up),$p=te({},wn,{animationName:0,elapsedTime:0,pseudoElement:0}),Bp=Ie($p),Vp=te({},wn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Wp=Ie(Vp),Hp=te({},wn,{data:0}),wa=Ie(Hp),Gp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Qp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},qp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Kp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=qp[e])?!!t[e]:!1}function kl(){return Kp}var Xp=te({},ur,{key:function(e){if(e.key){var t=Gp[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ar(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Qp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:kl,charCode:function(e){return e.type==="keypress"?Ar(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ar(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Yp=Ie(Xp),Zp=te({},yo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ka=Ie(Zp),Jp=te({},ur,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:kl}),ef=Ie(Jp),tf=te({},wn,{propertyName:0,elapsedTime:0,pseudoElement:0}),nf=Ie(tf),rf=te({},yo,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),of=Ie(rf),lf=[9,13,27,32],Sl=it&&"CompositionEvent"in window,Mn=null;it&&"documentMode"in document&&(Mn=document.documentMode);var af=it&&"TextEvent"in window&&!Mn,Nc=it&&(!Sl||Mn&&8<Mn&&11>=Mn),Sa=" ",_a=!1;function wc(e,t){switch(e){case"keyup":return lf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function kc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Yt=!1;function sf(e,t){switch(e){case"compositionend":return kc(t);case"keypress":return t.which!==32?null:(_a=!0,Sa);case"textInput":return e=t.data,e===Sa&&_a?null:e;default:return null}}function cf(e,t){if(Yt)return e==="compositionend"||!Sl&&wc(e,t)?(e=jc(),Rr=Nl=ht=null,Yt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Nc&&t.locale!=="ko"?null:t.data;default:return null}}var df={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ba(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!df[e.type]:t==="textarea"}function Sc(e,t,n,r){tc(r),t=Xr(t,"onChange"),0<t.length&&(n=new wl("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Ln=null,Yn=null;function uf(e){Ac(e,0)}function jo(e){var t=en(e);if(qs(t))return e}function pf(e,t){if(e==="change")return t}var _c=!1;if(it){var Vo;if(it){var Wo="oninput"in document;if(!Wo){var Ca=document.createElement("div");Ca.setAttribute("oninput","return;"),Wo=typeof Ca.oninput=="function"}Vo=Wo}else Vo=!1;_c=Vo&&(!document.documentMode||9<document.documentMode)}function Ea(){Ln&&(Ln.detachEvent("onpropertychange",bc),Yn=Ln=null)}function bc(e){if(e.propertyName==="value"&&jo(Yn)){var t=[];Sc(t,Yn,e,xl(e)),ic(uf,t)}}function ff(e,t,n){e==="focusin"?(Ea(),Ln=t,Yn=n,Ln.attachEvent("onpropertychange",bc)):e==="focusout"&&Ea()}function mf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return jo(Yn)}function hf(e,t){if(e==="click")return jo(t)}function xf(e,t){if(e==="input"||e==="change")return jo(t)}function gf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Qe=typeof Object.is=="function"?Object.is:gf;function Zn(e,t){if(Qe(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!di.call(t,i)||!Qe(e[i],t[i]))return!1}return!0}function za(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Fa(e,t){var n=za(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=za(n)}}function Cc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Cc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ec(){for(var e=window,t=Vr();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Vr(e.document)}return t}function _l(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function vf(e){var t=Ec(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Cc(n.ownerDocument.documentElement,n)){if(r!==null&&_l(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=n.textContent.length,l=Math.min(r.start,i);r=r.end===void 0?l:Math.min(r.end,i),!e.extend&&l>r&&(i=r,r=l,l=i),i=Fa(n,l);var a=Fa(n,r);i&&a&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),l>r?(e.addRange(t),e.extend(a.node,a.offset)):(t.setEnd(a.node,a.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var yf=it&&"documentMode"in document&&11>=document.documentMode,Zt=null,zi=null,Un=null,Fi=!1;function Da(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Fi||Zt==null||Zt!==Vr(r)||(r=Zt,"selectionStart"in r&&_l(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Un&&Zn(Un,r)||(Un=r,r=Xr(zi,"onSelect"),0<r.length&&(t=new wl("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Zt)))}function wr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Jt={animationend:wr("Animation","AnimationEnd"),animationiteration:wr("Animation","AnimationIteration"),animationstart:wr("Animation","AnimationStart"),transitionend:wr("Transition","TransitionEnd")},Ho={},zc={};it&&(zc=document.createElement("div").style,"AnimationEvent"in window||(delete Jt.animationend.animation,delete Jt.animationiteration.animation,delete Jt.animationstart.animation),"TransitionEvent"in window||delete Jt.transitionend.transition);function No(e){if(Ho[e])return Ho[e];if(!Jt[e])return e;var t=Jt[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in zc)return Ho[e]=t[n];return e}var Fc=No("animationend"),Dc=No("animationiteration"),Tc=No("animationstart"),Ic=No("transitionend"),Rc=new Map,Ta="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function zt(e,t){Rc.set(e,t),Gt(t,[e])}for(var Go=0;Go<Ta.length;Go++){var Qo=Ta[Go],jf=Qo.toLowerCase(),Nf=Qo[0].toUpperCase()+Qo.slice(1);zt(jf,"on"+Nf)}zt(Fc,"onAnimationEnd");zt(Dc,"onAnimationIteration");zt(Tc,"onAnimationStart");zt("dblclick","onDoubleClick");zt("focusin","onFocus");zt("focusout","onBlur");zt(Ic,"onTransitionEnd");mn("onMouseEnter",["mouseout","mouseover"]);mn("onMouseLeave",["mouseout","mouseover"]);mn("onPointerEnter",["pointerout","pointerover"]);mn("onPointerLeave",["pointerout","pointerover"]);Gt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Gt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Gt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Gt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Gt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Gt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var An="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),wf=new Set("cancel close invalid load scroll toggle".split(" ").concat(An));function Ia(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,yp(r,t,void 0,e),e.currentTarget=null}function Ac(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;e:{var l=void 0;if(t)for(var a=r.length-1;0<=a;a--){var s=r[a],c=s.instance,u=s.currentTarget;if(s=s.listener,c!==l&&i.isPropagationStopped())break e;Ia(i,s,u),l=c}else for(a=0;a<r.length;a++){if(s=r[a],c=s.instance,u=s.currentTarget,s=s.listener,c!==l&&i.isPropagationStopped())break e;Ia(i,s,u),l=c}}}if(Hr)throw e=_i,Hr=!1,_i=null,e}function q(e,t){var n=t[Ai];n===void 0&&(n=t[Ai]=new Set);var r=e+"__bubble";n.has(r)||(Oc(t,e,2,!1),n.add(r))}function qo(e,t,n){var r=0;t&&(r|=4),Oc(n,e,r,t)}var kr="_reactListening"+Math.random().toString(36).slice(2);function Jn(e){if(!e[kr]){e[kr]=!0,Vs.forEach(function(n){n!=="selectionchange"&&(wf.has(n)||qo(n,!1,e),qo(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[kr]||(t[kr]=!0,qo("selectionchange",!1,t))}}function Oc(e,t,n,r){switch(yc(t)){case 1:var i=Ap;break;case 4:i=Op;break;default:i=jl}n=i.bind(null,t,n,e),i=void 0,!Si||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),r?i!==void 0?e.addEventListener(t,n,{capture:!0,passive:i}):e.addEventListener(t,n,!0):i!==void 0?e.addEventListener(t,n,{passive:i}):e.addEventListener(t,n,!1)}function Ko(e,t,n,r,i){var l=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var a=r.tag;if(a===3||a===4){var s=r.stateNode.containerInfo;if(s===i||s.nodeType===8&&s.parentNode===i)break;if(a===4)for(a=r.return;a!==null;){var c=a.tag;if((c===3||c===4)&&(c=a.stateNode.containerInfo,c===i||c.nodeType===8&&c.parentNode===i))return;a=a.return}for(;s!==null;){if(a=At(s),a===null)return;if(c=a.tag,c===5||c===6){r=l=a;continue e}s=s.parentNode}}r=r.return}ic(function(){var u=l,v=xl(n),f=[];e:{var h=Rc.get(e);if(h!==void 0){var x=wl,j=e;switch(e){case"keypress":if(Ar(n)===0)break e;case"keydown":case"keyup":x=Yp;break;case"focusin":j="focus",x=Bo;break;case"focusout":j="blur",x=Bo;break;case"beforeblur":case"afterblur":x=Bo;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":x=Na;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":x=Lp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":x=ef;break;case Fc:case Dc:case Tc:x=Bp;break;case Ic:x=nf;break;case"scroll":x=Pp;break;case"wheel":x=of;break;case"copy":case"cut":case"paste":x=Wp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":x=ka}var N=(t&4)!==0,S=!N&&e==="scroll",m=N?h!==null?h+"Capture":null:h;N=[];for(var d=u,p;d!==null;){p=d;var y=p.stateNode;if(p.tag===5&&y!==null&&(p=y,m!==null&&(y=Qn(d,m),y!=null&&N.push(er(d,y,p)))),S)break;d=d.return}0<N.length&&(h=new x(h,j,null,n,v),f.push({event:h,listeners:N}))}}if(!(t&7)){e:{if(h=e==="mouseover"||e==="pointerover",x=e==="mouseout"||e==="pointerout",h&&n!==wi&&(j=n.relatedTarget||n.fromElement)&&(At(j)||j[lt]))break e;if((x||h)&&(h=v.window===v?v:(h=v.ownerDocument)?h.defaultView||h.parentWindow:window,x?(j=n.relatedTarget||n.toElement,x=u,j=j?At(j):null,j!==null&&(S=Qt(j),j!==S||j.tag!==5&&j.tag!==6)&&(j=null)):(x=null,j=u),x!==j)){if(N=Na,y="onMouseLeave",m="onMouseEnter",d="mouse",(e==="pointerout"||e==="pointerover")&&(N=ka,y="onPointerLeave",m="onPointerEnter",d="pointer"),S=x==null?h:en(x),p=j==null?h:en(j),h=new N(y,d+"leave",x,n,v),h.target=S,h.relatedTarget=p,y=null,At(v)===u&&(N=new N(m,d+"enter",j,n,v),N.target=p,N.relatedTarget=S,y=N),S=y,x&&j)t:{for(N=x,m=j,d=0,p=N;p;p=qt(p))d++;for(p=0,y=m;y;y=qt(y))p++;for(;0<d-p;)N=qt(N),d--;for(;0<p-d;)m=qt(m),p--;for(;d--;){if(N===m||m!==null&&N===m.alternate)break t;N=qt(N),m=qt(m)}N=null}else N=null;x!==null&&Ra(f,h,x,N,!1),j!==null&&S!==null&&Ra(f,S,j,N,!0)}}e:{if(h=u?en(u):window,x=h.nodeName&&h.nodeName.toLowerCase(),x==="select"||x==="input"&&h.type==="file")var E=pf;else if(ba(h))if(_c)E=xf;else{E=mf;var g=ff}else(x=h.nodeName)&&x.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(E=hf);if(E&&(E=E(e,u))){Sc(f,E,n,v);break e}g&&g(e,h,u),e==="focusout"&&(g=h._wrapperState)&&g.controlled&&h.type==="number"&&gi(h,"number",h.value)}switch(g=u?en(u):window,e){case"focusin":(ba(g)||g.contentEditable==="true")&&(Zt=g,zi=u,Un=null);break;case"focusout":Un=zi=Zt=null;break;case"mousedown":Fi=!0;break;case"contextmenu":case"mouseup":case"dragend":Fi=!1,Da(f,n,v);break;case"selectionchange":if(yf)break;case"keydown":case"keyup":Da(f,n,v)}var z;if(Sl)e:{switch(e){case"compositionstart":var F="onCompositionStart";break e;case"compositionend":F="onCompositionEnd";break e;case"compositionupdate":F="onCompositionUpdate";break e}F=void 0}else Yt?wc(e,n)&&(F="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(F="onCompositionStart");F&&(Nc&&n.locale!=="ko"&&(Yt||F!=="onCompositionStart"?F==="onCompositionEnd"&&Yt&&(z=jc()):(ht=v,Nl="value"in ht?ht.value:ht.textContent,Yt=!0)),g=Xr(u,F),0<g.length&&(F=new wa(F,e,null,n,v),f.push({event:F,listeners:g}),z?F.data=z:(z=kc(n),z!==null&&(F.data=z)))),(z=af?sf(e,n):cf(e,n))&&(u=Xr(u,"onBeforeInput"),0<u.length&&(v=new wa("onBeforeInput","beforeinput",null,n,v),f.push({event:v,listeners:u}),v.data=z))}Ac(f,t)})}function er(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Xr(e,t){for(var n=t+"Capture",r=[];e!==null;){var i=e,l=i.stateNode;i.tag===5&&l!==null&&(i=l,l=Qn(e,n),l!=null&&r.unshift(er(e,l,i)),l=Qn(e,t),l!=null&&r.push(er(e,l,i))),e=e.return}return r}function qt(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ra(e,t,n,r,i){for(var l=t._reactName,a=[];n!==null&&n!==r;){var s=n,c=s.alternate,u=s.stateNode;if(c!==null&&c===r)break;s.tag===5&&u!==null&&(s=u,i?(c=Qn(n,l),c!=null&&a.unshift(er(n,c,s))):i||(c=Qn(n,l),c!=null&&a.push(er(n,c,s)))),n=n.return}a.length!==0&&e.push({event:t,listeners:a})}var kf=/\r\n?/g,Sf=/\u0000|\uFFFD/g;function Aa(e){return(typeof e=="string"?e:""+e).replace(kf,`
`).replace(Sf,"")}function Sr(e,t,n){if(t=Aa(t),Aa(e)!==t&&n)throw Error(_(425))}function Yr(){}var Di=null,Ti=null;function Ii(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ri=typeof setTimeout=="function"?setTimeout:void 0,_f=typeof clearTimeout=="function"?clearTimeout:void 0,Oa=typeof Promise=="function"?Promise:void 0,bf=typeof queueMicrotask=="function"?queueMicrotask:typeof Oa<"u"?function(e){return Oa.resolve(null).then(e).catch(Cf)}:Ri;function Cf(e){setTimeout(function(){throw e})}function Xo(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){e.removeChild(i),Xn(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);Xn(t)}function Nt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Pa(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var kn=Math.random().toString(36).slice(2),Xe="__reactFiber$"+kn,tr="__reactProps$"+kn,lt="__reactContainer$"+kn,Ai="__reactEvents$"+kn,Ef="__reactListeners$"+kn,zf="__reactHandles$"+kn;function At(e){var t=e[Xe];if(t)return t;for(var n=e.parentNode;n;){if(t=n[lt]||n[Xe]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Pa(e);e!==null;){if(n=e[Xe])return n;e=Pa(e)}return t}e=n,n=e.parentNode}return null}function pr(e){return e=e[Xe]||e[lt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function en(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(_(33))}function wo(e){return e[tr]||null}var Oi=[],tn=-1;function Ft(e){return{current:e}}function K(e){0>tn||(e.current=Oi[tn],Oi[tn]=null,tn--)}function G(e,t){tn++,Oi[tn]=e.current,e.current=t}var Ct={},xe=Ft(Ct),_e=Ft(!1),$t=Ct;function hn(e,t){var n=e.type.contextTypes;if(!n)return Ct;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var i={},l;for(l in n)i[l]=t[l];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function be(e){return e=e.childContextTypes,e!=null}function Zr(){K(_e),K(xe)}function Ma(e,t,n){if(xe.current!==Ct)throw Error(_(168));G(xe,t),G(_e,n)}function Pc(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in t))throw Error(_(108,pp(e)||"Unknown",i));return te({},n,r)}function Jr(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Ct,$t=xe.current,G(xe,e),G(_e,_e.current),!0}function La(e,t,n){var r=e.stateNode;if(!r)throw Error(_(169));n?(e=Pc(e,t,$t),r.__reactInternalMemoizedMergedChildContext=e,K(_e),K(xe),G(xe,e)):K(_e),G(_e,n)}var et=null,ko=!1,Yo=!1;function Mc(e){et===null?et=[e]:et.push(e)}function Ff(e){ko=!0,Mc(e)}function Dt(){if(!Yo&&et!==null){Yo=!0;var e=0,t=H;try{var n=et;for(H=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}et=null,ko=!1}catch(i){throw et!==null&&(et=et.slice(e+1)),cc(gl,Dt),i}finally{H=t,Yo=!1}}return null}var nn=[],rn=0,eo=null,to=0,Ae=[],Oe=0,Bt=null,tt=1,nt="";function It(e,t){nn[rn++]=to,nn[rn++]=eo,eo=e,to=t}function Lc(e,t,n){Ae[Oe++]=tt,Ae[Oe++]=nt,Ae[Oe++]=Bt,Bt=e;var r=tt;e=nt;var i=32-He(r)-1;r&=~(1<<i),n+=1;var l=32-He(t)+i;if(30<l){var a=i-i%5;l=(r&(1<<a)-1).toString(32),r>>=a,i-=a,tt=1<<32-He(t)+i|n<<i|r,nt=l+e}else tt=1<<l|n<<i|r,nt=e}function bl(e){e.return!==null&&(It(e,1),Lc(e,1,0))}function Cl(e){for(;e===eo;)eo=nn[--rn],nn[rn]=null,to=nn[--rn],nn[rn]=null;for(;e===Bt;)Bt=Ae[--Oe],Ae[Oe]=null,nt=Ae[--Oe],Ae[Oe]=null,tt=Ae[--Oe],Ae[Oe]=null}var Fe=null,ze=null,Y=!1,We=null;function Uc(e,t){var n=Pe(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Ua(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Fe=e,ze=Nt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Fe=e,ze=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Bt!==null?{id:tt,overflow:nt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Pe(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Fe=e,ze=null,!0):!1;default:return!1}}function Pi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Mi(e){if(Y){var t=ze;if(t){var n=t;if(!Ua(e,t)){if(Pi(e))throw Error(_(418));t=Nt(n.nextSibling);var r=Fe;t&&Ua(e,t)?Uc(r,n):(e.flags=e.flags&-4097|2,Y=!1,Fe=e)}}else{if(Pi(e))throw Error(_(418));e.flags=e.flags&-4097|2,Y=!1,Fe=e}}}function $a(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Fe=e}function _r(e){if(e!==Fe)return!1;if(!Y)return $a(e),Y=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ii(e.type,e.memoizedProps)),t&&(t=ze)){if(Pi(e))throw $c(),Error(_(418));for(;t;)Uc(e,t),t=Nt(t.nextSibling)}if($a(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(_(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ze=Nt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ze=null}}else ze=Fe?Nt(e.stateNode.nextSibling):null;return!0}function $c(){for(var e=ze;e;)e=Nt(e.nextSibling)}function xn(){ze=Fe=null,Y=!1}function El(e){We===null?We=[e]:We.push(e)}var Df=ct.ReactCurrentBatchConfig;function zn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(_(309));var r=n.stateNode}if(!r)throw Error(_(147,e));var i=r,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(a){var s=i.refs;a===null?delete s[l]:s[l]=a},t._stringRef=l,t)}if(typeof e!="string")throw Error(_(284));if(!n._owner)throw Error(_(290,e))}return e}function br(e,t){throw e=Object.prototype.toString.call(t),Error(_(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ba(e){var t=e._init;return t(e._payload)}function Bc(e){function t(m,d){if(e){var p=m.deletions;p===null?(m.deletions=[d],m.flags|=16):p.push(d)}}function n(m,d){if(!e)return null;for(;d!==null;)t(m,d),d=d.sibling;return null}function r(m,d){for(m=new Map;d!==null;)d.key!==null?m.set(d.key,d):m.set(d.index,d),d=d.sibling;return m}function i(m,d){return m=_t(m,d),m.index=0,m.sibling=null,m}function l(m,d,p){return m.index=p,e?(p=m.alternate,p!==null?(p=p.index,p<d?(m.flags|=2,d):p):(m.flags|=2,d)):(m.flags|=1048576,d)}function a(m){return e&&m.alternate===null&&(m.flags|=2),m}function s(m,d,p,y){return d===null||d.tag!==6?(d=oi(p,m.mode,y),d.return=m,d):(d=i(d,p),d.return=m,d)}function c(m,d,p,y){var E=p.type;return E===Xt?v(m,d,p.props.children,y,p.key):d!==null&&(d.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===ut&&Ba(E)===d.type)?(y=i(d,p.props),y.ref=zn(m,d,p),y.return=m,y):(y=Br(p.type,p.key,p.props,null,m.mode,y),y.ref=zn(m,d,p),y.return=m,y)}function u(m,d,p,y){return d===null||d.tag!==4||d.stateNode.containerInfo!==p.containerInfo||d.stateNode.implementation!==p.implementation?(d=ii(p,m.mode,y),d.return=m,d):(d=i(d,p.children||[]),d.return=m,d)}function v(m,d,p,y,E){return d===null||d.tag!==7?(d=Lt(p,m.mode,y,E),d.return=m,d):(d=i(d,p),d.return=m,d)}function f(m,d,p){if(typeof d=="string"&&d!==""||typeof d=="number")return d=oi(""+d,m.mode,p),d.return=m,d;if(typeof d=="object"&&d!==null){switch(d.$$typeof){case hr:return p=Br(d.type,d.key,d.props,null,m.mode,p),p.ref=zn(m,null,d),p.return=m,p;case Kt:return d=ii(d,m.mode,p),d.return=m,d;case ut:var y=d._init;return f(m,y(d._payload),p)}if(In(d)||Sn(d))return d=Lt(d,m.mode,p,null),d.return=m,d;br(m,d)}return null}function h(m,d,p,y){var E=d!==null?d.key:null;if(typeof p=="string"&&p!==""||typeof p=="number")return E!==null?null:s(m,d,""+p,y);if(typeof p=="object"&&p!==null){switch(p.$$typeof){case hr:return p.key===E?c(m,d,p,y):null;case Kt:return p.key===E?u(m,d,p,y):null;case ut:return E=p._init,h(m,d,E(p._payload),y)}if(In(p)||Sn(p))return E!==null?null:v(m,d,p,y,null);br(m,p)}return null}function x(m,d,p,y,E){if(typeof y=="string"&&y!==""||typeof y=="number")return m=m.get(p)||null,s(d,m,""+y,E);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case hr:return m=m.get(y.key===null?p:y.key)||null,c(d,m,y,E);case Kt:return m=m.get(y.key===null?p:y.key)||null,u(d,m,y,E);case ut:var g=y._init;return x(m,d,p,g(y._payload),E)}if(In(y)||Sn(y))return m=m.get(p)||null,v(d,m,y,E,null);br(d,y)}return null}function j(m,d,p,y){for(var E=null,g=null,z=d,F=d=0,P=null;z!==null&&F<p.length;F++){z.index>F?(P=z,z=null):P=z.sibling;var M=h(m,z,p[F],y);if(M===null){z===null&&(z=P);break}e&&z&&M.alternate===null&&t(m,z),d=l(M,d,F),g===null?E=M:g.sibling=M,g=M,z=P}if(F===p.length)return n(m,z),Y&&It(m,F),E;if(z===null){for(;F<p.length;F++)z=f(m,p[F],y),z!==null&&(d=l(z,d,F),g===null?E=z:g.sibling=z,g=z);return Y&&It(m,F),E}for(z=r(m,z);F<p.length;F++)P=x(z,m,F,p[F],y),P!==null&&(e&&P.alternate!==null&&z.delete(P.key===null?F:P.key),d=l(P,d,F),g===null?E=P:g.sibling=P,g=P);return e&&z.forEach(function(w){return t(m,w)}),Y&&It(m,F),E}function N(m,d,p,y){var E=Sn(p);if(typeof E!="function")throw Error(_(150));if(p=E.call(p),p==null)throw Error(_(151));for(var g=E=null,z=d,F=d=0,P=null,M=p.next();z!==null&&!M.done;F++,M=p.next()){z.index>F?(P=z,z=null):P=z.sibling;var w=h(m,z,M.value,y);if(w===null){z===null&&(z=P);break}e&&z&&w.alternate===null&&t(m,z),d=l(w,d,F),g===null?E=w:g.sibling=w,g=w,z=P}if(M.done)return n(m,z),Y&&It(m,F),E;if(z===null){for(;!M.done;F++,M=p.next())M=f(m,M.value,y),M!==null&&(d=l(M,d,F),g===null?E=M:g.sibling=M,g=M);return Y&&It(m,F),E}for(z=r(m,z);!M.done;F++,M=p.next())M=x(z,m,F,M.value,y),M!==null&&(e&&M.alternate!==null&&z.delete(M.key===null?F:M.key),d=l(M,d,F),g===null?E=M:g.sibling=M,g=M);return e&&z.forEach(function(U){return t(m,U)}),Y&&It(m,F),E}function S(m,d,p,y){if(typeof p=="object"&&p!==null&&p.type===Xt&&p.key===null&&(p=p.props.children),typeof p=="object"&&p!==null){switch(p.$$typeof){case hr:e:{for(var E=p.key,g=d;g!==null;){if(g.key===E){if(E=p.type,E===Xt){if(g.tag===7){n(m,g.sibling),d=i(g,p.props.children),d.return=m,m=d;break e}}else if(g.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===ut&&Ba(E)===g.type){n(m,g.sibling),d=i(g,p.props),d.ref=zn(m,g,p),d.return=m,m=d;break e}n(m,g);break}else t(m,g);g=g.sibling}p.type===Xt?(d=Lt(p.props.children,m.mode,y,p.key),d.return=m,m=d):(y=Br(p.type,p.key,p.props,null,m.mode,y),y.ref=zn(m,d,p),y.return=m,m=y)}return a(m);case Kt:e:{for(g=p.key;d!==null;){if(d.key===g)if(d.tag===4&&d.stateNode.containerInfo===p.containerInfo&&d.stateNode.implementation===p.implementation){n(m,d.sibling),d=i(d,p.children||[]),d.return=m,m=d;break e}else{n(m,d);break}else t(m,d);d=d.sibling}d=ii(p,m.mode,y),d.return=m,m=d}return a(m);case ut:return g=p._init,S(m,d,g(p._payload),y)}if(In(p))return j(m,d,p,y);if(Sn(p))return N(m,d,p,y);br(m,p)}return typeof p=="string"&&p!==""||typeof p=="number"?(p=""+p,d!==null&&d.tag===6?(n(m,d.sibling),d=i(d,p),d.return=m,m=d):(n(m,d),d=oi(p,m.mode,y),d.return=m,m=d),a(m)):n(m,d)}return S}var gn=Bc(!0),Vc=Bc(!1),no=Ft(null),ro=null,on=null,zl=null;function Fl(){zl=on=ro=null}function Dl(e){var t=no.current;K(no),e._currentValue=t}function Li(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function pn(e,t){ro=e,zl=on=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(Se=!0),e.firstContext=null)}function Le(e){var t=e._currentValue;if(zl!==e)if(e={context:e,memoizedValue:t,next:null},on===null){if(ro===null)throw Error(_(308));on=e,ro.dependencies={lanes:0,firstContext:e}}else on=on.next=e;return t}var Ot=null;function Tl(e){Ot===null?Ot=[e]:Ot.push(e)}function Wc(e,t,n,r){var i=t.interleaved;return i===null?(n.next=n,Tl(t)):(n.next=i.next,i.next=n),t.interleaved=n,at(e,r)}function at(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var pt=!1;function Il(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Hc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function rt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function wt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,W&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,at(e,n)}return i=r.interleaved,i===null?(t.next=t,Tl(r)):(t.next=i.next,i.next=t),r.interleaved=t,at(e,n)}function Or(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,vl(e,n)}}function Va(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?i=l=a:l=l.next=a,n=n.next}while(n!==null);l===null?i=l=t:l=l.next=t}else i=l=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:l,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function oo(e,t,n,r){var i=e.updateQueue;pt=!1;var l=i.firstBaseUpdate,a=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,u=c.next;c.next=null,a===null?l=u:a.next=u,a=c;var v=e.alternate;v!==null&&(v=v.updateQueue,s=v.lastBaseUpdate,s!==a&&(s===null?v.firstBaseUpdate=u:s.next=u,v.lastBaseUpdate=c))}if(l!==null){var f=i.baseState;a=0,v=u=c=null,s=l;do{var h=s.lane,x=s.eventTime;if((r&h)===h){v!==null&&(v=v.next={eventTime:x,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var j=e,N=s;switch(h=t,x=n,N.tag){case 1:if(j=N.payload,typeof j=="function"){f=j.call(x,f,h);break e}f=j;break e;case 3:j.flags=j.flags&-65537|128;case 0:if(j=N.payload,h=typeof j=="function"?j.call(x,f,h):j,h==null)break e;f=te({},f,h);break e;case 2:pt=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,h=i.effects,h===null?i.effects=[s]:h.push(s))}else x={eventTime:x,lane:h,tag:s.tag,payload:s.payload,callback:s.callback,next:null},v===null?(u=v=x,c=f):v=v.next=x,a|=h;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;h=s,s=h.next,h.next=null,i.lastBaseUpdate=h,i.shared.pending=null}}while(!0);if(v===null&&(c=f),i.baseState=c,i.firstBaseUpdate=u,i.lastBaseUpdate=v,t=i.shared.interleaved,t!==null){i=t;do a|=i.lane,i=i.next;while(i!==t)}else l===null&&(i.shared.lanes=0);Wt|=a,e.lanes=a,e.memoizedState=f}}function Wa(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(_(191,i));i.call(r)}}}var fr={},Ze=Ft(fr),nr=Ft(fr),rr=Ft(fr);function Pt(e){if(e===fr)throw Error(_(174));return e}function Rl(e,t){switch(G(rr,t),G(nr,e),G(Ze,fr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:yi(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=yi(t,e)}K(Ze),G(Ze,t)}function vn(){K(Ze),K(nr),K(rr)}function Gc(e){Pt(rr.current);var t=Pt(Ze.current),n=yi(t,e.type);t!==n&&(G(nr,e),G(Ze,n))}function Al(e){nr.current===e&&(K(Ze),K(nr))}var J=Ft(0);function io(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Zo=[];function Ol(){for(var e=0;e<Zo.length;e++)Zo[e]._workInProgressVersionPrimary=null;Zo.length=0}var Pr=ct.ReactCurrentDispatcher,Jo=ct.ReactCurrentBatchConfig,Vt=0,ee=null,le=null,se=null,lo=!1,$n=!1,or=0,Tf=0;function fe(){throw Error(_(321))}function Pl(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Qe(e[n],t[n]))return!1;return!0}function Ml(e,t,n,r,i,l){if(Vt=l,ee=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Pr.current=e===null||e.memoizedState===null?Of:Pf,e=n(r,i),$n){l=0;do{if($n=!1,or=0,25<=l)throw Error(_(301));l+=1,se=le=null,t.updateQueue=null,Pr.current=Mf,e=n(r,i)}while($n)}if(Pr.current=ao,t=le!==null&&le.next!==null,Vt=0,se=le=ee=null,lo=!1,t)throw Error(_(300));return e}function Ll(){var e=or!==0;return or=0,e}function Ke(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return se===null?ee.memoizedState=se=e:se=se.next=e,se}function Ue(){if(le===null){var e=ee.alternate;e=e!==null?e.memoizedState:null}else e=le.next;var t=se===null?ee.memoizedState:se.next;if(t!==null)se=t,le=e;else{if(e===null)throw Error(_(310));le=e,e={memoizedState:le.memoizedState,baseState:le.baseState,baseQueue:le.baseQueue,queue:le.queue,next:null},se===null?ee.memoizedState=se=e:se=se.next=e}return se}function ir(e,t){return typeof t=="function"?t(e):t}function ei(e){var t=Ue(),n=t.queue;if(n===null)throw Error(_(311));n.lastRenderedReducer=e;var r=le,i=r.baseQueue,l=n.pending;if(l!==null){if(i!==null){var a=i.next;i.next=l.next,l.next=a}r.baseQueue=i=l,n.pending=null}if(i!==null){l=i.next,r=r.baseState;var s=a=null,c=null,u=l;do{var v=u.lane;if((Vt&v)===v)c!==null&&(c=c.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),r=u.hasEagerState?u.eagerState:e(r,u.action);else{var f={lane:v,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};c===null?(s=c=f,a=r):c=c.next=f,ee.lanes|=v,Wt|=v}u=u.next}while(u!==null&&u!==l);c===null?a=r:c.next=s,Qe(r,t.memoizedState)||(Se=!0),t.memoizedState=r,t.baseState=a,t.baseQueue=c,n.lastRenderedState=r}if(e=n.interleaved,e!==null){i=e;do l=i.lane,ee.lanes|=l,Wt|=l,i=i.next;while(i!==e)}else i===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function ti(e){var t=Ue(),n=t.queue;if(n===null)throw Error(_(311));n.lastRenderedReducer=e;var r=n.dispatch,i=n.pending,l=t.memoizedState;if(i!==null){n.pending=null;var a=i=i.next;do l=e(l,a.action),a=a.next;while(a!==i);Qe(l,t.memoizedState)||(Se=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,r]}function Qc(){}function qc(e,t){var n=ee,r=Ue(),i=t(),l=!Qe(r.memoizedState,i);if(l&&(r.memoizedState=i,Se=!0),r=r.queue,Ul(Yc.bind(null,n,r,e),[e]),r.getSnapshot!==t||l||se!==null&&se.memoizedState.tag&1){if(n.flags|=2048,lr(9,Xc.bind(null,n,r,i,t),void 0,null),ce===null)throw Error(_(349));Vt&30||Kc(n,t,i)}return i}function Kc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=ee.updateQueue,t===null?(t={lastEffect:null,stores:null},ee.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Xc(e,t,n,r){t.value=n,t.getSnapshot=r,Zc(t)&&Jc(e)}function Yc(e,t,n){return n(function(){Zc(t)&&Jc(e)})}function Zc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Qe(e,n)}catch{return!0}}function Jc(e){var t=at(e,1);t!==null&&Ge(t,e,1,-1)}function Ha(e){var t=Ke();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ir,lastRenderedState:e},t.queue=e,e=e.dispatch=Af.bind(null,ee,e),[t.memoizedState,e]}function lr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=ee.updateQueue,t===null?(t={lastEffect:null,stores:null},ee.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function ed(){return Ue().memoizedState}function Mr(e,t,n,r){var i=Ke();ee.flags|=e,i.memoizedState=lr(1|t,n,void 0,r===void 0?null:r)}function So(e,t,n,r){var i=Ue();r=r===void 0?null:r;var l=void 0;if(le!==null){var a=le.memoizedState;if(l=a.destroy,r!==null&&Pl(r,a.deps)){i.memoizedState=lr(t,n,l,r);return}}ee.flags|=e,i.memoizedState=lr(1|t,n,l,r)}function Ga(e,t){return Mr(8390656,8,e,t)}function Ul(e,t){return So(2048,8,e,t)}function td(e,t){return So(4,2,e,t)}function nd(e,t){return So(4,4,e,t)}function rd(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function od(e,t,n){return n=n!=null?n.concat([e]):null,So(4,4,rd.bind(null,t,e),n)}function $l(){}function id(e,t){var n=Ue();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Pl(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ld(e,t){var n=Ue();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Pl(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function ad(e,t,n){return Vt&21?(Qe(n,t)||(n=pc(),ee.lanes|=n,Wt|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Se=!0),e.memoizedState=n)}function If(e,t){var n=H;H=n!==0&&4>n?n:4,e(!0);var r=Jo.transition;Jo.transition={};try{e(!1),t()}finally{H=n,Jo.transition=r}}function sd(){return Ue().memoizedState}function Rf(e,t,n){var r=St(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},cd(e))dd(t,n);else if(n=Wc(e,t,n,r),n!==null){var i=ye();Ge(n,e,r,i),ud(n,t,r)}}function Af(e,t,n){var r=St(e),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(cd(e))dd(t,i);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var a=t.lastRenderedState,s=l(a,n);if(i.hasEagerState=!0,i.eagerState=s,Qe(s,a)){var c=t.interleaved;c===null?(i.next=i,Tl(t)):(i.next=c.next,c.next=i),t.interleaved=i;return}}catch{}finally{}n=Wc(e,t,i,r),n!==null&&(i=ye(),Ge(n,e,r,i),ud(n,t,r))}}function cd(e){var t=e.alternate;return e===ee||t!==null&&t===ee}function dd(e,t){$n=lo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function ud(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,vl(e,n)}}var ao={readContext:Le,useCallback:fe,useContext:fe,useEffect:fe,useImperativeHandle:fe,useInsertionEffect:fe,useLayoutEffect:fe,useMemo:fe,useReducer:fe,useRef:fe,useState:fe,useDebugValue:fe,useDeferredValue:fe,useTransition:fe,useMutableSource:fe,useSyncExternalStore:fe,useId:fe,unstable_isNewReconciler:!1},Of={readContext:Le,useCallback:function(e,t){return Ke().memoizedState=[e,t===void 0?null:t],e},useContext:Le,useEffect:Ga,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Mr(4194308,4,rd.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Mr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Mr(4,2,e,t)},useMemo:function(e,t){var n=Ke();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ke();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Rf.bind(null,ee,e),[r.memoizedState,e]},useRef:function(e){var t=Ke();return e={current:e},t.memoizedState=e},useState:Ha,useDebugValue:$l,useDeferredValue:function(e){return Ke().memoizedState=e},useTransition:function(){var e=Ha(!1),t=e[0];return e=If.bind(null,e[1]),Ke().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=ee,i=Ke();if(Y){if(n===void 0)throw Error(_(407));n=n()}else{if(n=t(),ce===null)throw Error(_(349));Vt&30||Kc(r,t,n)}i.memoizedState=n;var l={value:n,getSnapshot:t};return i.queue=l,Ga(Yc.bind(null,r,l,e),[e]),r.flags|=2048,lr(9,Xc.bind(null,r,l,n,t),void 0,null),n},useId:function(){var e=Ke(),t=ce.identifierPrefix;if(Y){var n=nt,r=tt;n=(r&~(1<<32-He(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=or++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Tf++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Pf={readContext:Le,useCallback:id,useContext:Le,useEffect:Ul,useImperativeHandle:od,useInsertionEffect:td,useLayoutEffect:nd,useMemo:ld,useReducer:ei,useRef:ed,useState:function(){return ei(ir)},useDebugValue:$l,useDeferredValue:function(e){var t=Ue();return ad(t,le.memoizedState,e)},useTransition:function(){var e=ei(ir)[0],t=Ue().memoizedState;return[e,t]},useMutableSource:Qc,useSyncExternalStore:qc,useId:sd,unstable_isNewReconciler:!1},Mf={readContext:Le,useCallback:id,useContext:Le,useEffect:Ul,useImperativeHandle:od,useInsertionEffect:td,useLayoutEffect:nd,useMemo:ld,useReducer:ti,useRef:ed,useState:function(){return ti(ir)},useDebugValue:$l,useDeferredValue:function(e){var t=Ue();return le===null?t.memoizedState=e:ad(t,le.memoizedState,e)},useTransition:function(){var e=ti(ir)[0],t=Ue().memoizedState;return[e,t]},useMutableSource:Qc,useSyncExternalStore:qc,useId:sd,unstable_isNewReconciler:!1};function Be(e,t){if(e&&e.defaultProps){t=te({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Ui(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:te({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var _o={isMounted:function(e){return(e=e._reactInternals)?Qt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=ye(),i=St(e),l=rt(r,i);l.payload=t,n!=null&&(l.callback=n),t=wt(e,l,i),t!==null&&(Ge(t,e,i,r),Or(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=ye(),i=St(e),l=rt(r,i);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=wt(e,l,i),t!==null&&(Ge(t,e,i,r),Or(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ye(),r=St(e),i=rt(n,r);i.tag=2,t!=null&&(i.callback=t),t=wt(e,i,r),t!==null&&(Ge(t,e,r,n),Or(t,e,r))}};function Qa(e,t,n,r,i,l,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,l,a):t.prototype&&t.prototype.isPureReactComponent?!Zn(n,r)||!Zn(i,l):!0}function pd(e,t,n){var r=!1,i=Ct,l=t.contextType;return typeof l=="object"&&l!==null?l=Le(l):(i=be(t)?$t:xe.current,r=t.contextTypes,l=(r=r!=null)?hn(e,i):Ct),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=_o,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=l),t}function qa(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&_o.enqueueReplaceState(t,t.state,null)}function $i(e,t,n,r){var i=e.stateNode;i.props=n,i.state=e.memoizedState,i.refs={},Il(e);var l=t.contextType;typeof l=="object"&&l!==null?i.context=Le(l):(l=be(t)?$t:xe.current,i.context=hn(e,l)),i.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(Ui(e,t,l,n),i.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(t=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),t!==i.state&&_o.enqueueReplaceState(i,i.state,null),oo(e,n,i,r),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function yn(e,t){try{var n="",r=t;do n+=up(r),r=r.return;while(r);var i=n}catch(l){i=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:i,digest:null}}function ni(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Bi(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Lf=typeof WeakMap=="function"?WeakMap:Map;function fd(e,t,n){n=rt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){co||(co=!0,Zi=r),Bi(e,t)},n}function md(e,t,n){n=rt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var i=t.value;n.payload=function(){return r(i)},n.callback=function(){Bi(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){Bi(e,t),typeof r!="function"&&(kt===null?kt=new Set([this]):kt.add(this));var a=t.stack;this.componentDidCatch(t.value,{componentStack:a!==null?a:""})}),n}function Ka(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Lf;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(i.add(n),e=Jf.bind(null,e,t,n),t.then(e,e))}function Xa(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Ya(e,t,n,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=rt(-1,1),t.tag=2,wt(n,t,1))),n.lanes|=1),e)}var Uf=ct.ReactCurrentOwner,Se=!1;function ve(e,t,n,r){t.child=e===null?Vc(t,null,n,r):gn(t,e.child,n,r)}function Za(e,t,n,r,i){n=n.render;var l=t.ref;return pn(t,i),r=Ml(e,t,n,r,l,i),n=Ll(),e!==null&&!Se?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,st(e,t,i)):(Y&&n&&bl(t),t.flags|=1,ve(e,t,r,i),t.child)}function Ja(e,t,n,r,i){if(e===null){var l=n.type;return typeof l=="function"&&!Kl(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,hd(e,t,l,r,i)):(e=Br(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!(e.lanes&i)){var a=l.memoizedProps;if(n=n.compare,n=n!==null?n:Zn,n(a,r)&&e.ref===t.ref)return st(e,t,i)}return t.flags|=1,e=_t(l,r),e.ref=t.ref,e.return=t,t.child=e}function hd(e,t,n,r,i){if(e!==null){var l=e.memoizedProps;if(Zn(l,r)&&e.ref===t.ref)if(Se=!1,t.pendingProps=r=l,(e.lanes&i)!==0)e.flags&131072&&(Se=!0);else return t.lanes=e.lanes,st(e,t,i)}return Vi(e,t,n,r,i)}function xd(e,t,n){var r=t.pendingProps,i=r.children,l=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},G(an,Ee),Ee|=n;else{if(!(n&1073741824))return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,G(an,Ee),Ee|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=l!==null?l.baseLanes:n,G(an,Ee),Ee|=r}else l!==null?(r=l.baseLanes|n,t.memoizedState=null):r=n,G(an,Ee),Ee|=r;return ve(e,t,i,n),t.child}function gd(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Vi(e,t,n,r,i){var l=be(n)?$t:xe.current;return l=hn(t,l),pn(t,i),n=Ml(e,t,n,r,l,i),r=Ll(),e!==null&&!Se?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,st(e,t,i)):(Y&&r&&bl(t),t.flags|=1,ve(e,t,n,i),t.child)}function es(e,t,n,r,i){if(be(n)){var l=!0;Jr(t)}else l=!1;if(pn(t,i),t.stateNode===null)Lr(e,t),pd(t,n,r),$i(t,n,r,i),r=!0;else if(e===null){var a=t.stateNode,s=t.memoizedProps;a.props=s;var c=a.context,u=n.contextType;typeof u=="object"&&u!==null?u=Le(u):(u=be(n)?$t:xe.current,u=hn(t,u));var v=n.getDerivedStateFromProps,f=typeof v=="function"||typeof a.getSnapshotBeforeUpdate=="function";f||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(s!==r||c!==u)&&qa(t,a,r,u),pt=!1;var h=t.memoizedState;a.state=h,oo(t,r,a,i),c=t.memoizedState,s!==r||h!==c||_e.current||pt?(typeof v=="function"&&(Ui(t,n,v,r),c=t.memoizedState),(s=pt||Qa(t,n,s,r,h,c,u))?(f||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=c),a.props=r,a.state=c,a.context=u,r=s):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Hc(e,t),s=t.memoizedProps,u=t.type===t.elementType?s:Be(t.type,s),a.props=u,f=t.pendingProps,h=a.context,c=n.contextType,typeof c=="object"&&c!==null?c=Le(c):(c=be(n)?$t:xe.current,c=hn(t,c));var x=n.getDerivedStateFromProps;(v=typeof x=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(s!==f||h!==c)&&qa(t,a,r,c),pt=!1,h=t.memoizedState,a.state=h,oo(t,r,a,i);var j=t.memoizedState;s!==f||h!==j||_e.current||pt?(typeof x=="function"&&(Ui(t,n,x,r),j=t.memoizedState),(u=pt||Qa(t,n,u,r,h,j,c)||!1)?(v||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(r,j,c),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(r,j,c)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||s===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=j),a.props=r,a.state=j,a.context=c,r=u):(typeof a.componentDidUpdate!="function"||s===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),r=!1)}return Wi(e,t,n,r,l,i)}function Wi(e,t,n,r,i,l){gd(e,t);var a=(t.flags&128)!==0;if(!r&&!a)return i&&La(t,n,!1),st(e,t,l);r=t.stateNode,Uf.current=t;var s=a&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&a?(t.child=gn(t,e.child,null,l),t.child=gn(t,null,s,l)):ve(e,t,s,l),t.memoizedState=r.state,i&&La(t,n,!0),t.child}function vd(e){var t=e.stateNode;t.pendingContext?Ma(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Ma(e,t.context,!1),Rl(e,t.containerInfo)}function ts(e,t,n,r,i){return xn(),El(i),t.flags|=256,ve(e,t,n,r),t.child}var Hi={dehydrated:null,treeContext:null,retryLane:0};function Gi(e){return{baseLanes:e,cachePool:null,transitions:null}}function yd(e,t,n){var r=t.pendingProps,i=J.current,l=!1,a=(t.flags&128)!==0,s;if((s=a)||(s=e!==null&&e.memoizedState===null?!1:(i&2)!==0),s?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),G(J,i&1),e===null)return Mi(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(a=r.children,e=r.fallback,l?(r=t.mode,l=t.child,a={mode:"hidden",children:a},!(r&1)&&l!==null?(l.childLanes=0,l.pendingProps=a):l=Eo(a,r,0,null),e=Lt(e,r,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=Gi(n),t.memoizedState=Hi,e):Bl(t,a));if(i=e.memoizedState,i!==null&&(s=i.dehydrated,s!==null))return $f(e,t,a,r,s,i,n);if(l){l=r.fallback,a=t.mode,i=e.child,s=i.sibling;var c={mode:"hidden",children:r.children};return!(a&1)&&t.child!==i?(r=t.child,r.childLanes=0,r.pendingProps=c,t.deletions=null):(r=_t(i,c),r.subtreeFlags=i.subtreeFlags&14680064),s!==null?l=_t(s,l):(l=Lt(l,a,n,null),l.flags|=2),l.return=t,r.return=t,r.sibling=l,t.child=r,r=l,l=t.child,a=e.child.memoizedState,a=a===null?Gi(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},l.memoizedState=a,l.childLanes=e.childLanes&~n,t.memoizedState=Hi,r}return l=e.child,e=l.sibling,r=_t(l,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Bl(e,t){return t=Eo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Cr(e,t,n,r){return r!==null&&El(r),gn(t,e.child,null,n),e=Bl(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function $f(e,t,n,r,i,l,a){if(n)return t.flags&256?(t.flags&=-257,r=ni(Error(_(422))),Cr(e,t,a,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=r.fallback,i=t.mode,r=Eo({mode:"visible",children:r.children},i,0,null),l=Lt(l,i,a,null),l.flags|=2,r.return=t,l.return=t,r.sibling=l,t.child=r,t.mode&1&&gn(t,e.child,null,a),t.child.memoizedState=Gi(a),t.memoizedState=Hi,l);if(!(t.mode&1))return Cr(e,t,a,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var s=r.dgst;return r=s,l=Error(_(419)),r=ni(l,r,void 0),Cr(e,t,a,r)}if(s=(a&e.childLanes)!==0,Se||s){if(r=ce,r!==null){switch(a&-a){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|a)?0:i,i!==0&&i!==l.retryLane&&(l.retryLane=i,at(e,i),Ge(r,e,i,-1))}return ql(),r=ni(Error(_(421))),Cr(e,t,a,r)}return i.data==="$?"?(t.flags|=128,t.child=e.child,t=em.bind(null,e),i._reactRetry=t,null):(e=l.treeContext,ze=Nt(i.nextSibling),Fe=t,Y=!0,We=null,e!==null&&(Ae[Oe++]=tt,Ae[Oe++]=nt,Ae[Oe++]=Bt,tt=e.id,nt=e.overflow,Bt=t),t=Bl(t,r.children),t.flags|=4096,t)}function ns(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Li(e.return,t,n)}function ri(e,t,n,r,i){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=r,l.tail=n,l.tailMode=i)}function jd(e,t,n){var r=t.pendingProps,i=r.revealOrder,l=r.tail;if(ve(e,t,r.children,n),r=J.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ns(e,n,t);else if(e.tag===19)ns(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(G(J,r),!(t.mode&1))t.memoizedState=null;else switch(i){case"forwards":for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&io(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),ri(t,!1,i,n,l);break;case"backwards":for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&io(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}ri(t,!0,n,null,l);break;case"together":ri(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Lr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function st(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Wt|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(_(153));if(t.child!==null){for(e=t.child,n=_t(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=_t(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Bf(e,t,n){switch(t.tag){case 3:vd(t),xn();break;case 5:Gc(t);break;case 1:be(t.type)&&Jr(t);break;case 4:Rl(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,i=t.memoizedProps.value;G(no,r._currentValue),r._currentValue=i;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(G(J,J.current&1),t.flags|=128,null):n&t.child.childLanes?yd(e,t,n):(G(J,J.current&1),e=st(e,t,n),e!==null?e.sibling:null);G(J,J.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return jd(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),G(J,J.current),r)break;return null;case 22:case 23:return t.lanes=0,xd(e,t,n)}return st(e,t,n)}var Nd,Qi,wd,kd;Nd=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Qi=function(){};wd=function(e,t,n,r){var i=e.memoizedProps;if(i!==r){e=t.stateNode,Pt(Ze.current);var l=null;switch(n){case"input":i=hi(e,i),r=hi(e,r),l=[];break;case"select":i=te({},i,{value:void 0}),r=te({},r,{value:void 0}),l=[];break;case"textarea":i=vi(e,i),r=vi(e,r),l=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Yr)}ji(n,r);var a;n=null;for(u in i)if(!r.hasOwnProperty(u)&&i.hasOwnProperty(u)&&i[u]!=null)if(u==="style"){var s=i[u];for(a in s)s.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Hn.hasOwnProperty(u)?l||(l=[]):(l=l||[]).push(u,null));for(u in r){var c=r[u];if(s=i!=null?i[u]:void 0,r.hasOwnProperty(u)&&c!==s&&(c!=null||s!=null))if(u==="style")if(s){for(a in s)!s.hasOwnProperty(a)||c&&c.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in c)c.hasOwnProperty(a)&&s[a]!==c[a]&&(n||(n={}),n[a]=c[a])}else n||(l||(l=[]),l.push(u,n)),n=c;else u==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,s=s?s.__html:void 0,c!=null&&s!==c&&(l=l||[]).push(u,c)):u==="children"?typeof c!="string"&&typeof c!="number"||(l=l||[]).push(u,""+c):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Hn.hasOwnProperty(u)?(c!=null&&u==="onScroll"&&q("scroll",e),l||s===c||(l=[])):(l=l||[]).push(u,c))}n&&(l=l||[]).push("style",n);var u=l;(t.updateQueue=u)&&(t.flags|=4)}};kd=function(e,t,n,r){n!==r&&(t.flags|=4)};function Fn(e,t){if(!Y)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function me(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Vf(e,t,n){var r=t.pendingProps;switch(Cl(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return me(t),null;case 1:return be(t.type)&&Zr(),me(t),null;case 3:return r=t.stateNode,vn(),K(_e),K(xe),Ol(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(_r(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,We!==null&&(tl(We),We=null))),Qi(e,t),me(t),null;case 5:Al(t);var i=Pt(rr.current);if(n=t.type,e!==null&&t.stateNode!=null)wd(e,t,n,r,i),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(_(166));return me(t),null}if(e=Pt(Ze.current),_r(t)){r=t.stateNode,n=t.type;var l=t.memoizedProps;switch(r[Xe]=t,r[tr]=l,e=(t.mode&1)!==0,n){case"dialog":q("cancel",r),q("close",r);break;case"iframe":case"object":case"embed":q("load",r);break;case"video":case"audio":for(i=0;i<An.length;i++)q(An[i],r);break;case"source":q("error",r);break;case"img":case"image":case"link":q("error",r),q("load",r);break;case"details":q("toggle",r);break;case"input":ua(r,l),q("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!l.multiple},q("invalid",r);break;case"textarea":fa(r,l),q("invalid",r)}ji(n,l),i=null;for(var a in l)if(l.hasOwnProperty(a)){var s=l[a];a==="children"?typeof s=="string"?r.textContent!==s&&(l.suppressHydrationWarning!==!0&&Sr(r.textContent,s,e),i=["children",s]):typeof s=="number"&&r.textContent!==""+s&&(l.suppressHydrationWarning!==!0&&Sr(r.textContent,s,e),i=["children",""+s]):Hn.hasOwnProperty(a)&&s!=null&&a==="onScroll"&&q("scroll",r)}switch(n){case"input":xr(r),pa(r,l,!0);break;case"textarea":xr(r),ma(r);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(r.onclick=Yr)}r=i,t.updateQueue=r,r!==null&&(t.flags|=4)}else{a=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Ys(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=a.createElement(n,{is:r.is}):(e=a.createElement(n),n==="select"&&(a=e,r.multiple?a.multiple=!0:r.size&&(a.size=r.size))):e=a.createElementNS(e,n),e[Xe]=t,e[tr]=r,Nd(e,t,!1,!1),t.stateNode=e;e:{switch(a=Ni(n,r),n){case"dialog":q("cancel",e),q("close",e),i=r;break;case"iframe":case"object":case"embed":q("load",e),i=r;break;case"video":case"audio":for(i=0;i<An.length;i++)q(An[i],e);i=r;break;case"source":q("error",e),i=r;break;case"img":case"image":case"link":q("error",e),q("load",e),i=r;break;case"details":q("toggle",e),i=r;break;case"input":ua(e,r),i=hi(e,r),q("invalid",e);break;case"option":i=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=te({},r,{value:void 0}),q("invalid",e);break;case"textarea":fa(e,r),i=vi(e,r),q("invalid",e);break;default:i=r}ji(n,i),s=i;for(l in s)if(s.hasOwnProperty(l)){var c=s[l];l==="style"?ec(e,c):l==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&Zs(e,c)):l==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&Gn(e,c):typeof c=="number"&&Gn(e,""+c):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(Hn.hasOwnProperty(l)?c!=null&&l==="onScroll"&&q("scroll",e):c!=null&&pl(e,l,c,a))}switch(n){case"input":xr(e),pa(e,r,!1);break;case"textarea":xr(e),ma(e);break;case"option":r.value!=null&&e.setAttribute("value",""+bt(r.value));break;case"select":e.multiple=!!r.multiple,l=r.value,l!=null?sn(e,!!r.multiple,l,!1):r.defaultValue!=null&&sn(e,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=Yr)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return me(t),null;case 6:if(e&&t.stateNode!=null)kd(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(_(166));if(n=Pt(rr.current),Pt(Ze.current),_r(t)){if(r=t.stateNode,n=t.memoizedProps,r[Xe]=t,(l=r.nodeValue!==n)&&(e=Fe,e!==null))switch(e.tag){case 3:Sr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Sr(r.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Xe]=t,t.stateNode=r}return me(t),null;case 13:if(K(J),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Y&&ze!==null&&t.mode&1&&!(t.flags&128))$c(),xn(),t.flags|=98560,l=!1;else if(l=_r(t),r!==null&&r.dehydrated!==null){if(e===null){if(!l)throw Error(_(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(_(317));l[Xe]=t}else xn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;me(t),l=!1}else We!==null&&(tl(We),We=null),l=!0;if(!l)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||J.current&1?ae===0&&(ae=3):ql())),t.updateQueue!==null&&(t.flags|=4),me(t),null);case 4:return vn(),Qi(e,t),e===null&&Jn(t.stateNode.containerInfo),me(t),null;case 10:return Dl(t.type._context),me(t),null;case 17:return be(t.type)&&Zr(),me(t),null;case 19:if(K(J),l=t.memoizedState,l===null)return me(t),null;if(r=(t.flags&128)!==0,a=l.rendering,a===null)if(r)Fn(l,!1);else{if(ae!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(a=io(e),a!==null){for(t.flags|=128,Fn(l,!1),r=a.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)l=n,e=r,l.flags&=14680066,a=l.alternate,a===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=a.childLanes,l.lanes=a.lanes,l.child=a.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=a.memoizedProps,l.memoizedState=a.memoizedState,l.updateQueue=a.updateQueue,l.type=a.type,e=a.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return G(J,J.current&1|2),t.child}e=e.sibling}l.tail!==null&&re()>jn&&(t.flags|=128,r=!0,Fn(l,!1),t.lanes=4194304)}else{if(!r)if(e=io(a),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Fn(l,!0),l.tail===null&&l.tailMode==="hidden"&&!a.alternate&&!Y)return me(t),null}else 2*re()-l.renderingStartTime>jn&&n!==1073741824&&(t.flags|=128,r=!0,Fn(l,!1),t.lanes=4194304);l.isBackwards?(a.sibling=t.child,t.child=a):(n=l.last,n!==null?n.sibling=a:t.child=a,l.last=a)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=re(),t.sibling=null,n=J.current,G(J,r?n&1|2:n&1),t):(me(t),null);case 22:case 23:return Ql(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?Ee&1073741824&&(me(t),t.subtreeFlags&6&&(t.flags|=8192)):me(t),null;case 24:return null;case 25:return null}throw Error(_(156,t.tag))}function Wf(e,t){switch(Cl(t),t.tag){case 1:return be(t.type)&&Zr(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return vn(),K(_e),K(xe),Ol(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Al(t),null;case 13:if(K(J),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(_(340));xn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return K(J),null;case 4:return vn(),null;case 10:return Dl(t.type._context),null;case 22:case 23:return Ql(),null;case 24:return null;default:return null}}var Er=!1,he=!1,Hf=typeof WeakSet=="function"?WeakSet:Set,R=null;function ln(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){ne(e,t,r)}else n.current=null}function qi(e,t,n){try{n()}catch(r){ne(e,t,r)}}var rs=!1;function Gf(e,t){if(Di=qr,e=Ec(),_l(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,l=r.focusNode;r=r.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var a=0,s=-1,c=-1,u=0,v=0,f=e,h=null;t:for(;;){for(var x;f!==n||i!==0&&f.nodeType!==3||(s=a+i),f!==l||r!==0&&f.nodeType!==3||(c=a+r),f.nodeType===3&&(a+=f.nodeValue.length),(x=f.firstChild)!==null;)h=f,f=x;for(;;){if(f===e)break t;if(h===n&&++u===i&&(s=a),h===l&&++v===r&&(c=a),(x=f.nextSibling)!==null)break;f=h,h=f.parentNode}f=x}n=s===-1||c===-1?null:{start:s,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ti={focusedElem:e,selectionRange:n},qr=!1,R=t;R!==null;)if(t=R,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,R=e;else for(;R!==null;){t=R;try{var j=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(j!==null){var N=j.memoizedProps,S=j.memoizedState,m=t.stateNode,d=m.getSnapshotBeforeUpdate(t.elementType===t.type?N:Be(t.type,N),S);m.__reactInternalSnapshotBeforeUpdate=d}break;case 3:var p=t.stateNode.containerInfo;p.nodeType===1?p.textContent="":p.nodeType===9&&p.documentElement&&p.removeChild(p.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(_(163))}}catch(y){ne(t,t.return,y)}if(e=t.sibling,e!==null){e.return=t.return,R=e;break}R=t.return}return j=rs,rs=!1,j}function Bn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var l=i.destroy;i.destroy=void 0,l!==void 0&&qi(t,n,l)}i=i.next}while(i!==r)}}function bo(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Ki(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Sd(e){var t=e.alternate;t!==null&&(e.alternate=null,Sd(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Xe],delete t[tr],delete t[Ai],delete t[Ef],delete t[zf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function _d(e){return e.tag===5||e.tag===3||e.tag===4}function os(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||_d(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Xi(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Yr));else if(r!==4&&(e=e.child,e!==null))for(Xi(e,t,n),e=e.sibling;e!==null;)Xi(e,t,n),e=e.sibling}function Yi(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Yi(e,t,n),e=e.sibling;e!==null;)Yi(e,t,n),e=e.sibling}var de=null,Ve=!1;function dt(e,t,n){for(n=n.child;n!==null;)bd(e,t,n),n=n.sibling}function bd(e,t,n){if(Ye&&typeof Ye.onCommitFiberUnmount=="function")try{Ye.onCommitFiberUnmount(vo,n)}catch{}switch(n.tag){case 5:he||ln(n,t);case 6:var r=de,i=Ve;de=null,dt(e,t,n),de=r,Ve=i,de!==null&&(Ve?(e=de,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):de.removeChild(n.stateNode));break;case 18:de!==null&&(Ve?(e=de,n=n.stateNode,e.nodeType===8?Xo(e.parentNode,n):e.nodeType===1&&Xo(e,n),Xn(e)):Xo(de,n.stateNode));break;case 4:r=de,i=Ve,de=n.stateNode.containerInfo,Ve=!0,dt(e,t,n),de=r,Ve=i;break;case 0:case 11:case 14:case 15:if(!he&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var l=i,a=l.destroy;l=l.tag,a!==void 0&&(l&2||l&4)&&qi(n,t,a),i=i.next}while(i!==r)}dt(e,t,n);break;case 1:if(!he&&(ln(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(s){ne(n,t,s)}dt(e,t,n);break;case 21:dt(e,t,n);break;case 22:n.mode&1?(he=(r=he)||n.memoizedState!==null,dt(e,t,n),he=r):dt(e,t,n);break;default:dt(e,t,n)}}function is(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Hf),t.forEach(function(r){var i=tm.bind(null,e,r);n.has(r)||(n.add(r),r.then(i,i))})}}function $e(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var l=e,a=t,s=a;e:for(;s!==null;){switch(s.tag){case 5:de=s.stateNode,Ve=!1;break e;case 3:de=s.stateNode.containerInfo,Ve=!0;break e;case 4:de=s.stateNode.containerInfo,Ve=!0;break e}s=s.return}if(de===null)throw Error(_(160));bd(l,a,i),de=null,Ve=!1;var c=i.alternate;c!==null&&(c.return=null),i.return=null}catch(u){ne(i,t,u)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Cd(t,e),t=t.sibling}function Cd(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if($e(t,e),qe(e),r&4){try{Bn(3,e,e.return),bo(3,e)}catch(N){ne(e,e.return,N)}try{Bn(5,e,e.return)}catch(N){ne(e,e.return,N)}}break;case 1:$e(t,e),qe(e),r&512&&n!==null&&ln(n,n.return);break;case 5:if($e(t,e),qe(e),r&512&&n!==null&&ln(n,n.return),e.flags&32){var i=e.stateNode;try{Gn(i,"")}catch(N){ne(e,e.return,N)}}if(r&4&&(i=e.stateNode,i!=null)){var l=e.memoizedProps,a=n!==null?n.memoizedProps:l,s=e.type,c=e.updateQueue;if(e.updateQueue=null,c!==null)try{s==="input"&&l.type==="radio"&&l.name!=null&&Ks(i,l),Ni(s,a);var u=Ni(s,l);for(a=0;a<c.length;a+=2){var v=c[a],f=c[a+1];v==="style"?ec(i,f):v==="dangerouslySetInnerHTML"?Zs(i,f):v==="children"?Gn(i,f):pl(i,v,f,u)}switch(s){case"input":xi(i,l);break;case"textarea":Xs(i,l);break;case"select":var h=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!l.multiple;var x=l.value;x!=null?sn(i,!!l.multiple,x,!1):h!==!!l.multiple&&(l.defaultValue!=null?sn(i,!!l.multiple,l.defaultValue,!0):sn(i,!!l.multiple,l.multiple?[]:"",!1))}i[tr]=l}catch(N){ne(e,e.return,N)}}break;case 6:if($e(t,e),qe(e),r&4){if(e.stateNode===null)throw Error(_(162));i=e.stateNode,l=e.memoizedProps;try{i.nodeValue=l}catch(N){ne(e,e.return,N)}}break;case 3:if($e(t,e),qe(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Xn(t.containerInfo)}catch(N){ne(e,e.return,N)}break;case 4:$e(t,e),qe(e);break;case 13:$e(t,e),qe(e),i=e.child,i.flags&8192&&(l=i.memoizedState!==null,i.stateNode.isHidden=l,!l||i.alternate!==null&&i.alternate.memoizedState!==null||(Hl=re())),r&4&&is(e);break;case 22:if(v=n!==null&&n.memoizedState!==null,e.mode&1?(he=(u=he)||v,$e(t,e),he=u):$e(t,e),qe(e),r&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!v&&e.mode&1)for(R=e,v=e.child;v!==null;){for(f=R=v;R!==null;){switch(h=R,x=h.child,h.tag){case 0:case 11:case 14:case 15:Bn(4,h,h.return);break;case 1:ln(h,h.return);var j=h.stateNode;if(typeof j.componentWillUnmount=="function"){r=h,n=h.return;try{t=r,j.props=t.memoizedProps,j.state=t.memoizedState,j.componentWillUnmount()}catch(N){ne(r,n,N)}}break;case 5:ln(h,h.return);break;case 22:if(h.memoizedState!==null){as(f);continue}}x!==null?(x.return=h,R=x):as(f)}v=v.sibling}e:for(v=null,f=e;;){if(f.tag===5){if(v===null){v=f;try{i=f.stateNode,u?(l=i.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(s=f.stateNode,c=f.memoizedProps.style,a=c!=null&&c.hasOwnProperty("display")?c.display:null,s.style.display=Js("display",a))}catch(N){ne(e,e.return,N)}}}else if(f.tag===6){if(v===null)try{f.stateNode.nodeValue=u?"":f.memoizedProps}catch(N){ne(e,e.return,N)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===e)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===e)break e;for(;f.sibling===null;){if(f.return===null||f.return===e)break e;v===f&&(v=null),f=f.return}v===f&&(v=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:$e(t,e),qe(e),r&4&&is(e);break;case 21:break;default:$e(t,e),qe(e)}}function qe(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(_d(n)){var r=n;break e}n=n.return}throw Error(_(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Gn(i,""),r.flags&=-33);var l=os(e);Yi(e,l,i);break;case 3:case 4:var a=r.stateNode.containerInfo,s=os(e);Xi(e,s,a);break;default:throw Error(_(161))}}catch(c){ne(e,e.return,c)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Qf(e,t,n){R=e,Ed(e)}function Ed(e,t,n){for(var r=(e.mode&1)!==0;R!==null;){var i=R,l=i.child;if(i.tag===22&&r){var a=i.memoizedState!==null||Er;if(!a){var s=i.alternate,c=s!==null&&s.memoizedState!==null||he;s=Er;var u=he;if(Er=a,(he=c)&&!u)for(R=i;R!==null;)a=R,c=a.child,a.tag===22&&a.memoizedState!==null?ss(i):c!==null?(c.return=a,R=c):ss(i);for(;l!==null;)R=l,Ed(l),l=l.sibling;R=i,Er=s,he=u}ls(e)}else i.subtreeFlags&8772&&l!==null?(l.return=i,R=l):ls(e)}}function ls(e){for(;R!==null;){var t=R;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:he||bo(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!he)if(n===null)r.componentDidMount();else{var i=t.elementType===t.type?n.memoizedProps:Be(t.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&Wa(t,l,r);break;case 3:var a=t.updateQueue;if(a!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Wa(t,a,n)}break;case 5:var s=t.stateNode;if(n===null&&t.flags&4){n=s;var c=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var v=u.memoizedState;if(v!==null){var f=v.dehydrated;f!==null&&Xn(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(_(163))}he||t.flags&512&&Ki(t)}catch(h){ne(t,t.return,h)}}if(t===e){R=null;break}if(n=t.sibling,n!==null){n.return=t.return,R=n;break}R=t.return}}function as(e){for(;R!==null;){var t=R;if(t===e){R=null;break}var n=t.sibling;if(n!==null){n.return=t.return,R=n;break}R=t.return}}function ss(e){for(;R!==null;){var t=R;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{bo(4,t)}catch(c){ne(t,n,c)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var i=t.return;try{r.componentDidMount()}catch(c){ne(t,i,c)}}var l=t.return;try{Ki(t)}catch(c){ne(t,l,c)}break;case 5:var a=t.return;try{Ki(t)}catch(c){ne(t,a,c)}}}catch(c){ne(t,t.return,c)}if(t===e){R=null;break}var s=t.sibling;if(s!==null){s.return=t.return,R=s;break}R=t.return}}var qf=Math.ceil,so=ct.ReactCurrentDispatcher,Vl=ct.ReactCurrentOwner,Me=ct.ReactCurrentBatchConfig,W=0,ce=null,oe=null,ue=0,Ee=0,an=Ft(0),ae=0,ar=null,Wt=0,Co=0,Wl=0,Vn=null,ke=null,Hl=0,jn=1/0,Je=null,co=!1,Zi=null,kt=null,zr=!1,xt=null,uo=0,Wn=0,Ji=null,Ur=-1,$r=0;function ye(){return W&6?re():Ur!==-1?Ur:Ur=re()}function St(e){return e.mode&1?W&2&&ue!==0?ue&-ue:Df.transition!==null?($r===0&&($r=pc()),$r):(e=H,e!==0||(e=window.event,e=e===void 0?16:yc(e.type)),e):1}function Ge(e,t,n,r){if(50<Wn)throw Wn=0,Ji=null,Error(_(185));dr(e,n,r),(!(W&2)||e!==ce)&&(e===ce&&(!(W&2)&&(Co|=n),ae===4&&mt(e,ue)),Ce(e,r),n===1&&W===0&&!(t.mode&1)&&(jn=re()+500,ko&&Dt()))}function Ce(e,t){var n=e.callbackNode;Fp(e,t);var r=Qr(e,e===ce?ue:0);if(r===0)n!==null&&ga(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&ga(n),t===1)e.tag===0?Ff(cs.bind(null,e)):Mc(cs.bind(null,e)),bf(function(){!(W&6)&&Dt()}),n=null;else{switch(fc(r)){case 1:n=gl;break;case 4:n=dc;break;case 16:n=Gr;break;case 536870912:n=uc;break;default:n=Gr}n=Od(n,zd.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function zd(e,t){if(Ur=-1,$r=0,W&6)throw Error(_(327));var n=e.callbackNode;if(fn()&&e.callbackNode!==n)return null;var r=Qr(e,e===ce?ue:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=po(e,r);else{t=r;var i=W;W|=2;var l=Dd();(ce!==e||ue!==t)&&(Je=null,jn=re()+500,Mt(e,t));do try{Yf();break}catch(s){Fd(e,s)}while(!0);Fl(),so.current=l,W=i,oe!==null?t=0:(ce=null,ue=0,t=ae)}if(t!==0){if(t===2&&(i=bi(e),i!==0&&(r=i,t=el(e,i))),t===1)throw n=ar,Mt(e,0),mt(e,r),Ce(e,re()),n;if(t===6)mt(e,r);else{if(i=e.current.alternate,!(r&30)&&!Kf(i)&&(t=po(e,r),t===2&&(l=bi(e),l!==0&&(r=l,t=el(e,l))),t===1))throw n=ar,Mt(e,0),mt(e,r),Ce(e,re()),n;switch(e.finishedWork=i,e.finishedLanes=r,t){case 0:case 1:throw Error(_(345));case 2:Rt(e,ke,Je);break;case 3:if(mt(e,r),(r&130023424)===r&&(t=Hl+500-re(),10<t)){if(Qr(e,0)!==0)break;if(i=e.suspendedLanes,(i&r)!==r){ye(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=Ri(Rt.bind(null,e,ke,Je),t);break}Rt(e,ke,Je);break;case 4:if(mt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,i=-1;0<r;){var a=31-He(r);l=1<<a,a=t[a],a>i&&(i=a),r&=~l}if(r=i,r=re()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*qf(r/1960))-r,10<r){e.timeoutHandle=Ri(Rt.bind(null,e,ke,Je),r);break}Rt(e,ke,Je);break;case 5:Rt(e,ke,Je);break;default:throw Error(_(329))}}}return Ce(e,re()),e.callbackNode===n?zd.bind(null,e):null}function el(e,t){var n=Vn;return e.current.memoizedState.isDehydrated&&(Mt(e,t).flags|=256),e=po(e,t),e!==2&&(t=ke,ke=n,t!==null&&tl(t)),e}function tl(e){ke===null?ke=e:ke.push.apply(ke,e)}function Kf(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],l=i.getSnapshot;i=i.value;try{if(!Qe(l(),i))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function mt(e,t){for(t&=~Wl,t&=~Co,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-He(t),r=1<<n;e[n]=-1,t&=~r}}function cs(e){if(W&6)throw Error(_(327));fn();var t=Qr(e,0);if(!(t&1))return Ce(e,re()),null;var n=po(e,t);if(e.tag!==0&&n===2){var r=bi(e);r!==0&&(t=r,n=el(e,r))}if(n===1)throw n=ar,Mt(e,0),mt(e,t),Ce(e,re()),n;if(n===6)throw Error(_(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Rt(e,ke,Je),Ce(e,re()),null}function Gl(e,t){var n=W;W|=1;try{return e(t)}finally{W=n,W===0&&(jn=re()+500,ko&&Dt())}}function Ht(e){xt!==null&&xt.tag===0&&!(W&6)&&fn();var t=W;W|=1;var n=Me.transition,r=H;try{if(Me.transition=null,H=1,e)return e()}finally{H=r,Me.transition=n,W=t,!(W&6)&&Dt()}}function Ql(){Ee=an.current,K(an)}function Mt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,_f(n)),oe!==null)for(n=oe.return;n!==null;){var r=n;switch(Cl(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Zr();break;case 3:vn(),K(_e),K(xe),Ol();break;case 5:Al(r);break;case 4:vn();break;case 13:K(J);break;case 19:K(J);break;case 10:Dl(r.type._context);break;case 22:case 23:Ql()}n=n.return}if(ce=e,oe=e=_t(e.current,null),ue=Ee=t,ae=0,ar=null,Wl=Co=Wt=0,ke=Vn=null,Ot!==null){for(t=0;t<Ot.length;t++)if(n=Ot[t],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,l=n.pending;if(l!==null){var a=l.next;l.next=i,r.next=a}n.pending=r}Ot=null}return e}function Fd(e,t){do{var n=oe;try{if(Fl(),Pr.current=ao,lo){for(var r=ee.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}lo=!1}if(Vt=0,se=le=ee=null,$n=!1,or=0,Vl.current=null,n===null||n.return===null){ae=1,ar=t,oe=null;break}e:{var l=e,a=n.return,s=n,c=t;if(t=ue,s.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var u=c,v=s,f=v.tag;if(!(v.mode&1)&&(f===0||f===11||f===15)){var h=v.alternate;h?(v.updateQueue=h.updateQueue,v.memoizedState=h.memoizedState,v.lanes=h.lanes):(v.updateQueue=null,v.memoizedState=null)}var x=Xa(a);if(x!==null){x.flags&=-257,Ya(x,a,s,l,t),x.mode&1&&Ka(l,u,t),t=x,c=u;var j=t.updateQueue;if(j===null){var N=new Set;N.add(c),t.updateQueue=N}else j.add(c);break e}else{if(!(t&1)){Ka(l,u,t),ql();break e}c=Error(_(426))}}else if(Y&&s.mode&1){var S=Xa(a);if(S!==null){!(S.flags&65536)&&(S.flags|=256),Ya(S,a,s,l,t),El(yn(c,s));break e}}l=c=yn(c,s),ae!==4&&(ae=2),Vn===null?Vn=[l]:Vn.push(l),l=a;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var m=fd(l,c,t);Va(l,m);break e;case 1:s=c;var d=l.type,p=l.stateNode;if(!(l.flags&128)&&(typeof d.getDerivedStateFromError=="function"||p!==null&&typeof p.componentDidCatch=="function"&&(kt===null||!kt.has(p)))){l.flags|=65536,t&=-t,l.lanes|=t;var y=md(l,s,t);Va(l,y);break e}}l=l.return}while(l!==null)}Id(n)}catch(E){t=E,oe===n&&n!==null&&(oe=n=n.return);continue}break}while(!0)}function Dd(){var e=so.current;return so.current=ao,e===null?ao:e}function ql(){(ae===0||ae===3||ae===2)&&(ae=4),ce===null||!(Wt&268435455)&&!(Co&268435455)||mt(ce,ue)}function po(e,t){var n=W;W|=2;var r=Dd();(ce!==e||ue!==t)&&(Je=null,Mt(e,t));do try{Xf();break}catch(i){Fd(e,i)}while(!0);if(Fl(),W=n,so.current=r,oe!==null)throw Error(_(261));return ce=null,ue=0,ae}function Xf(){for(;oe!==null;)Td(oe)}function Yf(){for(;oe!==null&&!Np();)Td(oe)}function Td(e){var t=Ad(e.alternate,e,Ee);e.memoizedProps=e.pendingProps,t===null?Id(e):oe=t,Vl.current=null}function Id(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Wf(n,t),n!==null){n.flags&=32767,oe=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{ae=6,oe=null;return}}else if(n=Vf(n,t,Ee),n!==null){oe=n;return}if(t=t.sibling,t!==null){oe=t;return}oe=t=e}while(t!==null);ae===0&&(ae=5)}function Rt(e,t,n){var r=H,i=Me.transition;try{Me.transition=null,H=1,Zf(e,t,n,r)}finally{Me.transition=i,H=r}return null}function Zf(e,t,n,r){do fn();while(xt!==null);if(W&6)throw Error(_(327));n=e.finishedWork;var i=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(_(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if(Dp(e,l),e===ce&&(oe=ce=null,ue=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||zr||(zr=!0,Od(Gr,function(){return fn(),null})),l=(n.flags&15990)!==0,n.subtreeFlags&15990||l){l=Me.transition,Me.transition=null;var a=H;H=1;var s=W;W|=4,Vl.current=null,Gf(e,n),Cd(n,e),vf(Ti),qr=!!Di,Ti=Di=null,e.current=n,Qf(n),wp(),W=s,H=a,Me.transition=l}else e.current=n;if(zr&&(zr=!1,xt=e,uo=i),l=e.pendingLanes,l===0&&(kt=null),_p(n.stateNode),Ce(e,re()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)i=t[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(co)throw co=!1,e=Zi,Zi=null,e;return uo&1&&e.tag!==0&&fn(),l=e.pendingLanes,l&1?e===Ji?Wn++:(Wn=0,Ji=e):Wn=0,Dt(),null}function fn(){if(xt!==null){var e=fc(uo),t=Me.transition,n=H;try{if(Me.transition=null,H=16>e?16:e,xt===null)var r=!1;else{if(e=xt,xt=null,uo=0,W&6)throw Error(_(331));var i=W;for(W|=4,R=e.current;R!==null;){var l=R,a=l.child;if(R.flags&16){var s=l.deletions;if(s!==null){for(var c=0;c<s.length;c++){var u=s[c];for(R=u;R!==null;){var v=R;switch(v.tag){case 0:case 11:case 15:Bn(8,v,l)}var f=v.child;if(f!==null)f.return=v,R=f;else for(;R!==null;){v=R;var h=v.sibling,x=v.return;if(Sd(v),v===u){R=null;break}if(h!==null){h.return=x,R=h;break}R=x}}}var j=l.alternate;if(j!==null){var N=j.child;if(N!==null){j.child=null;do{var S=N.sibling;N.sibling=null,N=S}while(N!==null)}}R=l}}if(l.subtreeFlags&2064&&a!==null)a.return=l,R=a;else e:for(;R!==null;){if(l=R,l.flags&2048)switch(l.tag){case 0:case 11:case 15:Bn(9,l,l.return)}var m=l.sibling;if(m!==null){m.return=l.return,R=m;break e}R=l.return}}var d=e.current;for(R=d;R!==null;){a=R;var p=a.child;if(a.subtreeFlags&2064&&p!==null)p.return=a,R=p;else e:for(a=d;R!==null;){if(s=R,s.flags&2048)try{switch(s.tag){case 0:case 11:case 15:bo(9,s)}}catch(E){ne(s,s.return,E)}if(s===a){R=null;break e}var y=s.sibling;if(y!==null){y.return=s.return,R=y;break e}R=s.return}}if(W=i,Dt(),Ye&&typeof Ye.onPostCommitFiberRoot=="function")try{Ye.onPostCommitFiberRoot(vo,e)}catch{}r=!0}return r}finally{H=n,Me.transition=t}}return!1}function ds(e,t,n){t=yn(n,t),t=fd(e,t,1),e=wt(e,t,1),t=ye(),e!==null&&(dr(e,1,t),Ce(e,t))}function ne(e,t,n){if(e.tag===3)ds(e,e,n);else for(;t!==null;){if(t.tag===3){ds(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(kt===null||!kt.has(r))){e=yn(n,e),e=md(t,e,1),t=wt(t,e,1),e=ye(),t!==null&&(dr(t,1,e),Ce(t,e));break}}t=t.return}}function Jf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=ye(),e.pingedLanes|=e.suspendedLanes&n,ce===e&&(ue&n)===n&&(ae===4||ae===3&&(ue&130023424)===ue&&500>re()-Hl?Mt(e,0):Wl|=n),Ce(e,t)}function Rd(e,t){t===0&&(e.mode&1?(t=yr,yr<<=1,!(yr&130023424)&&(yr=4194304)):t=1);var n=ye();e=at(e,t),e!==null&&(dr(e,t,n),Ce(e,n))}function em(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Rd(e,n)}function tm(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(_(314))}r!==null&&r.delete(t),Rd(e,n)}var Ad;Ad=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||_e.current)Se=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return Se=!1,Bf(e,t,n);Se=!!(e.flags&131072)}else Se=!1,Y&&t.flags&1048576&&Lc(t,to,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Lr(e,t),e=t.pendingProps;var i=hn(t,xe.current);pn(t,n),i=Ml(null,t,r,e,i,n);var l=Ll();return t.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,be(r)?(l=!0,Jr(t)):l=!1,t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Il(t),i.updater=_o,t.stateNode=i,i._reactInternals=t,$i(t,r,e,n),t=Wi(null,t,r,!0,l,n)):(t.tag=0,Y&&l&&bl(t),ve(null,t,i,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Lr(e,t),e=t.pendingProps,i=r._init,r=i(r._payload),t.type=r,i=t.tag=rm(r),e=Be(r,e),i){case 0:t=Vi(null,t,r,e,n);break e;case 1:t=es(null,t,r,e,n);break e;case 11:t=Za(null,t,r,e,n);break e;case 14:t=Ja(null,t,r,Be(r.type,e),n);break e}throw Error(_(306,r,""))}return t;case 0:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Be(r,i),Vi(e,t,r,i,n);case 1:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Be(r,i),es(e,t,r,i,n);case 3:e:{if(vd(t),e===null)throw Error(_(387));r=t.pendingProps,l=t.memoizedState,i=l.element,Hc(e,t),oo(t,r,null,n);var a=t.memoizedState;if(r=a.element,l.isDehydrated)if(l={element:r,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){i=yn(Error(_(423)),t),t=ts(e,t,r,n,i);break e}else if(r!==i){i=yn(Error(_(424)),t),t=ts(e,t,r,n,i);break e}else for(ze=Nt(t.stateNode.containerInfo.firstChild),Fe=t,Y=!0,We=null,n=Vc(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(xn(),r===i){t=st(e,t,n);break e}ve(e,t,r,n)}t=t.child}return t;case 5:return Gc(t),e===null&&Mi(t),r=t.type,i=t.pendingProps,l=e!==null?e.memoizedProps:null,a=i.children,Ii(r,i)?a=null:l!==null&&Ii(r,l)&&(t.flags|=32),gd(e,t),ve(e,t,a,n),t.child;case 6:return e===null&&Mi(t),null;case 13:return yd(e,t,n);case 4:return Rl(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=gn(t,null,r,n):ve(e,t,r,n),t.child;case 11:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Be(r,i),Za(e,t,r,i,n);case 7:return ve(e,t,t.pendingProps,n),t.child;case 8:return ve(e,t,t.pendingProps.children,n),t.child;case 12:return ve(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,i=t.pendingProps,l=t.memoizedProps,a=i.value,G(no,r._currentValue),r._currentValue=a,l!==null)if(Qe(l.value,a)){if(l.children===i.children&&!_e.current){t=st(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var s=l.dependencies;if(s!==null){a=l.child;for(var c=s.firstContext;c!==null;){if(c.context===r){if(l.tag===1){c=rt(-1,n&-n),c.tag=2;var u=l.updateQueue;if(u!==null){u=u.shared;var v=u.pending;v===null?c.next=c:(c.next=v.next,v.next=c),u.pending=c}}l.lanes|=n,c=l.alternate,c!==null&&(c.lanes|=n),Li(l.return,n,t),s.lanes|=n;break}c=c.next}}else if(l.tag===10)a=l.type===t.type?null:l.child;else if(l.tag===18){if(a=l.return,a===null)throw Error(_(341));a.lanes|=n,s=a.alternate,s!==null&&(s.lanes|=n),Li(a,n,t),a=l.sibling}else a=l.child;if(a!==null)a.return=l;else for(a=l;a!==null;){if(a===t){a=null;break}if(l=a.sibling,l!==null){l.return=a.return,a=l;break}a=a.return}l=a}ve(e,t,i.children,n),t=t.child}return t;case 9:return i=t.type,r=t.pendingProps.children,pn(t,n),i=Le(i),r=r(i),t.flags|=1,ve(e,t,r,n),t.child;case 14:return r=t.type,i=Be(r,t.pendingProps),i=Be(r.type,i),Ja(e,t,r,i,n);case 15:return hd(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Be(r,i),Lr(e,t),t.tag=1,be(r)?(e=!0,Jr(t)):e=!1,pn(t,n),pd(t,r,i),$i(t,r,i,n),Wi(null,t,r,!0,e,n);case 19:return jd(e,t,n);case 22:return xd(e,t,n)}throw Error(_(156,t.tag))};function Od(e,t){return cc(e,t)}function nm(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Pe(e,t,n,r){return new nm(e,t,n,r)}function Kl(e){return e=e.prototype,!(!e||!e.isReactComponent)}function rm(e){if(typeof e=="function")return Kl(e)?1:0;if(e!=null){if(e=e.$$typeof,e===ml)return 11;if(e===hl)return 14}return 2}function _t(e,t){var n=e.alternate;return n===null?(n=Pe(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Br(e,t,n,r,i,l){var a=2;if(r=e,typeof e=="function")Kl(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case Xt:return Lt(n.children,i,l,t);case fl:a=8,i|=8;break;case ui:return e=Pe(12,n,t,i|2),e.elementType=ui,e.lanes=l,e;case pi:return e=Pe(13,n,t,i),e.elementType=pi,e.lanes=l,e;case fi:return e=Pe(19,n,t,i),e.elementType=fi,e.lanes=l,e;case Gs:return Eo(n,i,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Ws:a=10;break e;case Hs:a=9;break e;case ml:a=11;break e;case hl:a=14;break e;case ut:a=16,r=null;break e}throw Error(_(130,e==null?e:typeof e,""))}return t=Pe(a,n,t,i),t.elementType=e,t.type=r,t.lanes=l,t}function Lt(e,t,n,r){return e=Pe(7,e,r,t),e.lanes=n,e}function Eo(e,t,n,r){return e=Pe(22,e,r,t),e.elementType=Gs,e.lanes=n,e.stateNode={isHidden:!1},e}function oi(e,t,n){return e=Pe(6,e,null,t),e.lanes=n,e}function ii(e,t,n){return t=Pe(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function om(e,t,n,r,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Lo(0),this.expirationTimes=Lo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Lo(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Xl(e,t,n,r,i,l,a,s,c){return e=new om(e,t,n,s,c),t===1?(t=1,l===!0&&(t|=8)):t=0,l=Pe(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Il(l),e}function im(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Kt,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Pd(e){if(!e)return Ct;e=e._reactInternals;e:{if(Qt(e)!==e||e.tag!==1)throw Error(_(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(be(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(_(171))}if(e.tag===1){var n=e.type;if(be(n))return Pc(e,n,t)}return t}function Md(e,t,n,r,i,l,a,s,c){return e=Xl(n,r,!0,e,i,l,a,s,c),e.context=Pd(null),n=e.current,r=ye(),i=St(n),l=rt(r,i),l.callback=t??null,wt(n,l,i),e.current.lanes=i,dr(e,i,r),Ce(e,r),e}function zo(e,t,n,r){var i=t.current,l=ye(),a=St(i);return n=Pd(n),t.context===null?t.context=n:t.pendingContext=n,t=rt(l,a),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=wt(i,t,a),e!==null&&(Ge(e,i,a,l),Or(e,i,a)),a}function fo(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function us(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Yl(e,t){us(e,t),(e=e.alternate)&&us(e,t)}function lm(){return null}var Ld=typeof reportError=="function"?reportError:function(e){console.error(e)};function Zl(e){this._internalRoot=e}Fo.prototype.render=Zl.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(_(409));zo(e,t,null,null)};Fo.prototype.unmount=Zl.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ht(function(){zo(null,e,null,null)}),t[lt]=null}};function Fo(e){this._internalRoot=e}Fo.prototype.unstable_scheduleHydration=function(e){if(e){var t=xc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<ft.length&&t!==0&&t<ft[n].priority;n++);ft.splice(n,0,e),n===0&&vc(e)}};function Jl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Do(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function ps(){}function am(e,t,n,r,i){if(i){if(typeof r=="function"){var l=r;r=function(){var u=fo(a);l.call(u)}}var a=Md(t,r,e,0,null,!1,!1,"",ps);return e._reactRootContainer=a,e[lt]=a.current,Jn(e.nodeType===8?e.parentNode:e),Ht(),a}for(;i=e.lastChild;)e.removeChild(i);if(typeof r=="function"){var s=r;r=function(){var u=fo(c);s.call(u)}}var c=Xl(e,0,!1,null,null,!1,!1,"",ps);return e._reactRootContainer=c,e[lt]=c.current,Jn(e.nodeType===8?e.parentNode:e),Ht(function(){zo(t,c,n,r)}),c}function To(e,t,n,r,i){var l=n._reactRootContainer;if(l){var a=l;if(typeof i=="function"){var s=i;i=function(){var c=fo(a);s.call(c)}}zo(t,a,e,i)}else a=am(n,t,e,i,r);return fo(a)}mc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Rn(t.pendingLanes);n!==0&&(vl(t,n|1),Ce(t,re()),!(W&6)&&(jn=re()+500,Dt()))}break;case 13:Ht(function(){var r=at(e,1);if(r!==null){var i=ye();Ge(r,e,1,i)}}),Yl(e,1)}};yl=function(e){if(e.tag===13){var t=at(e,134217728);if(t!==null){var n=ye();Ge(t,e,134217728,n)}Yl(e,134217728)}};hc=function(e){if(e.tag===13){var t=St(e),n=at(e,t);if(n!==null){var r=ye();Ge(n,e,t,r)}Yl(e,t)}};xc=function(){return H};gc=function(e,t){var n=H;try{return H=e,t()}finally{H=n}};ki=function(e,t,n){switch(t){case"input":if(xi(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var i=wo(r);if(!i)throw Error(_(90));qs(r),xi(r,i)}}}break;case"textarea":Xs(e,n);break;case"select":t=n.value,t!=null&&sn(e,!!n.multiple,t,!1)}};rc=Gl;oc=Ht;var sm={usingClientEntryPoint:!1,Events:[pr,en,wo,tc,nc,Gl]},Dn={findFiberByHostInstance:At,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},cm={bundleType:Dn.bundleType,version:Dn.version,rendererPackageName:Dn.rendererPackageName,rendererConfig:Dn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ct.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=ac(e),e===null?null:e.stateNode},findFiberByHostInstance:Dn.findFiberByHostInstance||lm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Fr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Fr.isDisabled&&Fr.supportsFiber)try{vo=Fr.inject(cm),Ye=Fr}catch{}}Te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sm;Te.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Jl(t))throw Error(_(200));return im(e,t,null,n)};Te.createRoot=function(e,t){if(!Jl(e))throw Error(_(299));var n=!1,r="",i=Ld;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),t=Xl(e,1,!1,null,null,n,!1,r,i),e[lt]=t.current,Jn(e.nodeType===8?e.parentNode:e),new Zl(t)};Te.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(_(188)):(e=Object.keys(e).join(","),Error(_(268,e)));return e=ac(t),e=e===null?null:e.stateNode,e};Te.flushSync=function(e){return Ht(e)};Te.hydrate=function(e,t,n){if(!Do(t))throw Error(_(200));return To(null,e,t,!0,n)};Te.hydrateRoot=function(e,t,n){if(!Jl(e))throw Error(_(405));var r=n!=null&&n.hydratedSources||null,i=!1,l="",a=Ld;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),t=Md(t,null,e,1,n??null,i,!1,l,a),e[lt]=t.current,Jn(e),r)for(e=0;e<r.length;e++)n=r[e],i=n._getVersion,i=i(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,i]:t.mutableSourceEagerHydrationData.push(n,i);return new Fo(t)};Te.render=function(e,t,n){if(!Do(t))throw Error(_(200));return To(null,e,t,!1,n)};Te.unmountComponentAtNode=function(e){if(!Do(e))throw Error(_(40));return e._reactRootContainer?(Ht(function(){To(null,null,e,!1,function(){e._reactRootContainer=null,e[lt]=null})}),!0):!1};Te.unstable_batchedUpdates=Gl;Te.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Do(n))throw Error(_(200));if(e==null||e._reactInternals===void 0)throw Error(_(38));return To(e,t,n,!1,r)};Te.version="18.3.1-next-f1338f8080-20240426";function Ud(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ud)}catch(e){console.error(e)}}Ud(),Us.exports=Te;var dm=Us.exports,fs=dm;ci.createRoot=fs.createRoot,ci.hydrateRoot=fs.hydrateRoot;const ms=[{id:1,nombre:"Oficialía de Partes (Generador)"},{id:2,nombre:"Directora General"},{id:3,nombre:"Titular de Departamento"},{id:4,nombre:"Administrador del Sistema"}],hs=[{id:1,nombre:"Dirección General de Turismo",tipo:"DIRECCION_GENERAL",clave:"DGT"},{id:2,nombre:"Dirección de Protocolos y Eventos",tipo:"OPERATIVO",clave:"DPE"},{id:3,nombre:"Dirección Administrativa (18 Ote)",tipo:"ADMINISTRATIVO",clave:"DA18O"},{id:4,nombre:"Subdirección de Promoción y Mercadotecnia",tipo:"PROMOCION",clave:"SPM"},{id:5,nombre:"Unidad de Asuntos Jurídicos",tipo:"JURIDICO",clave:"UAJ"},{id:6,nombre:"Coordinación de Enlace y Pueblos Mágicos",tipo:"PROGRAMAS",clave:"CEPM"}],xs=[{id:1,nombre:"Oficio Ordinario"},{id:2,nombre:"Memorándum Interno"},{id:3,nombre:"Circular General"},{id:4,nombre:"Tarjeta Informativa"},{id:5,nombre:"Petición Ciudadana"}],gs=[{id:1,nombre:"Pendiente",orden:1,color:"pendiente"},{id:2,nombre:"Turnado",orden:2,color:"turnado"},{id:3,nombre:"En Proceso",orden:3,color:"proceso"},{id:4,nombre:"Respondido",orden:4,color:"respondido"},{id:5,nombre:"Concluido",orden:5,color:"concluido"},{id:6,nombre:"Vencido",orden:6,color:"vencido"}],vs=[{id:1,nombre:"Lic. Claudia Hernández Mora",email:"oficialia.partes@turismo.gob.mx",cargo:"Responsable de Oficialía de Partes",rol_id:1,departamento_id:1,activo:!0,avatar:"CH"},{id:2,nombre:"Mtra. Josefina Morales Ramírez",email:"directora.general@turismo.gob.mx",cargo:"Secretaria / Directora General de Turismo",rol_id:2,departamento_id:1,activo:!0,avatar:"JM"},{id:3,nombre:"Lic. Carlos Alberto Mendoza",email:"protocolos@turismo.gob.mx",cargo:"Director de Protocolos y Eventos",rol_id:3,departamento_id:2,activo:!0,avatar:"CM"},{id:4,nombre:"C.P. Rosalba Sánchez Trejo",email:"admon.18ote@turismo.gob.mx",cargo:"Directora Administrativa (Sede 18 Ote)",rol_id:3,departamento_id:3,activo:!0,avatar:"RS"},{id:5,nombre:"Mtro. Héctor Daniel Aguilar",email:"promocion@turismo.gob.mx",cargo:"Subdirector de Promoción Turística",rol_id:3,departamento_id:4,activo:!0,avatar:"HA"},{id:6,nombre:"Ing. Rodrigo Vega Solís",email:"admin.sistemas@turismo.gob.mx",cargo:"Administrador de Tecnologías",rol_id:4,departamento_id:1,activo:!0,avatar:"RV"}],ys=[{id:1,folio:"SECTUR/DGT/2026/0104",tipo_documento_id:1,asunto:"Solicitud de stand y logística para Tianguis Turístico México 2026",objeto:"Gestión de espacios institucionales, acreditaciones de artesanos y coordinación del pabellón representativo en el Tianguis Turístico 2026.",destinatario:"C. Gobernador Constitucional del Estado / Asuntos Especiales",fecha_documento:"2026-09-02",fecha_recepcion:"2026-09-03 09:30:00",termino:"2026-09-18",remitente_usuario_id:1,origen_usuario_id:1,departamento_destino_inicial_id:2,estado_id:2,creado_en:"2026-09-03 09:45:00",prioridad:"ALTA"},{id:2,folio:"SECTUR/DGT/2026/0105",tipo_documento_id:4,asunto:"Informe trimestral de ocupación hotelera y afluencia en Pueblos Mágicos",objeto:"Remisión de datos estadísticos levantados durante la temporada de verano para revisión y validación de la Dirección General.",destinatario:"Mtra. Josefina Morales Ramírez - Secretaria de Turismo",fecha_documento:"2026-09-05",fecha_recepcion:"2026-09-05 11:15:00",termino:"2026-09-20",remitente_usuario_id:1,origen_usuario_id:1,departamento_destino_inicial_id:4,estado_id:3,creado_en:"2026-09-05 11:30:00",prioridad:"MEDIA"},{id:3,folio:"SECTUR/DGT/2026/0106",tipo_documento_id:2,asunto:"Requerimiento de comprobaciones de viáticos y compras sede 18 Ote",objeto:"Notificación de cierre presupuestal mensual y entrega obligatoria de facturas y formatos de comisión pendientes.",destinatario:"Todos los Titulares de Área",fecha_documento:"2026-09-06",fecha_recepcion:"2026-09-06 14:00:00",termino:"2026-09-12",remitente_usuario_id:1,origen_usuario_id:1,departamento_destino_inicial_id:3,estado_id:1,creado_en:"2026-09-06 14:15:00",prioridad:"URGENTE"},{id:4,folio:"SECTUR/DGT/2026/0098",tipo_documento_id:1,asunto:"Convenio de colaboración turística y cultural con el Municipio de Cuetzalan",objeto:"Revisión y firma del instrumento jurídico para la promoción del festival del café y huipil 2026.",destinatario:"H. Ayuntamiento de Cuetzalan del Progreso",fecha_documento:"2026-08-20",fecha_recepcion:"2026-08-21 10:00:00",termino:"2026-09-05",remitente_usuario_id:1,origen_usuario_id:1,departamento_destino_inicial_id:5,estado_id:5,creado_en:"2026-08-21 10:30:00",prioridad:"NORMAL"},{id:5,folio:"SECTUR/DGT/2026/0107",tipo_documento_id:5,asunto:"Solicitud de apoyo para festival gastronómico de la Sierra Norte",objeto:"Petición del comité comunitario para difusión en medios digitales del estado y apoyo en material de difusión.",destinatario:"Secretaría de Turismo del Estado",fecha_documento:"2026-09-08",fecha_recepcion:"2026-09-08 16:20:00",termino:"2026-09-25",remitente_usuario_id:1,origen_usuario_id:1,departamento_destino_inicial_id:6,estado_id:1,creado_en:"2026-09-08 16:35:00",prioridad:"NORMAL"}],js=[{id:1,entidad_tipo:"OFICIO",entidad_id:1,nombre_archivo:"Oficio_Tianguis_Turistico_2026_SECTUR.pdf",archivo_url:"/docs/Oficio_Tianguis_Turistico_2026_SECTUR.pdf",tamano:"2.4 MB",creado_en:"2026-09-03 09:45:00"},{id:2,entidad_tipo:"OFICIO",entidad_id:2,nombre_archivo:"Informe_Estadistico_Ocupacion_Verano.pdf",archivo_url:"/docs/Informe_Estadistico_Ocupacion_Verano.pdf",tamano:"5.1 MB",creado_en:"2026-09-05 11:30:00"},{id:3,entidad_tipo:"OFICIO",entidad_id:3,nombre_archivo:"Circular_Cierre_Presupuestal_Viaticos.pdf",archivo_url:"/docs/Circular_Cierre_Presupuestal_Viaticos.pdf",tamano:"1.2 MB",creado_en:"2026-09-06 14:15:00"},{id:4,entidad_tipo:"SEGUIMIENTO",entidad_id:3,nombre_archivo:"Respuesta_Convenio_Cuetzalan_Firmado.pdf",archivo_url:"/docs/Respuesta_Convenio_Cuetzalan_Firmado.pdf",tamano:"3.8 MB",creado_en:"2026-08-30 12:00:00"}],Ns=[{id:1,oficio_id:1,departamento_id:2,turnado_por_usuario_id:2,turnado_en:"2026-09-03 12:00:00",recibido_en:"2026-09-03 13:10:00",instrucciones:"Por favor atender con carácter de urgente. Coordinar con los artesanos de la Sierra y prever el stand oficial de 120m²."},{id:2,oficio_id:2,departamento_id:4,turnado_por_usuario_id:2,turnado_en:"2026-09-05 13:30:00",recibido_en:"2026-09-05 14:00:00",instrucciones:"Analizar comparativo respecto al año 2025 para presentación ante el gabinete de desarrollo económico."},{id:3,oficio_id:4,departamento_id:5,turnado_por_usuario_id:2,turnado_en:"2026-08-21 11:00:00",recibido_en:"2026-08-21 11:25:00",instrucciones:"Emitir dictamen de procedencia legal y validar facultades del presidente municipal."}],ws=[{id:1,oficio_id:1,usuario_id:3,tipo:"OBSERVACION",contenido:"Se estableció contacto con el comité organizador de Tianguis Turístico. Se envió plano preliminar para selección de ubicación del pabellón.",creado_en:"2026-09-04 10:15:00"},{id:2,oficio_id:2,usuario_id:5,tipo:"AVANCE",contenido:"Datos recopilados de 10 Pueblos Mágicos. Tasa de ocupación promedio registrada del 76.4%, superando en 4.2% el periodo anterior.",creado_en:"2026-09-07 09:40:00"},{id:3,oficio_id:4,usuario_id:5,tipo:"RESPUESTA_FORMAL",contenido:"Se revisó y dictaminó favorablemente el convenio de colaboración turística. Se anexa documento firmado por el área jurídica.",creado_en:"2026-08-30 12:00:00"}],ks=[{id:1,oficio_id:1,usuario_id:2,leido_en:"2026-09-03 11:30:00"},{id:2,oficio_id:1,usuario_id:3,leido_en:"2026-09-03 13:10:00"},{id:3,oficio_id:2,usuario_id:5,leido_en:"2026-09-05 14:00:00"},{id:4,oficio_id:3,usuario_id:2,leido_en:"2026-09-07 08:30:00"}],Ss=[{id:1,usuario_id:1,accion:"CREAR_OFICIO",entidad:"oficios",entidad_id:1,detalle:"Ingreso inicial del oficio SECTUR/DGT/2026/0104 en Oficialía de Partes con 1 anexo PDF.",creado_en:"2026-09-03 09:45:00"},{id:2,usuario_id:2,accion:"TURNAR_OFICIO",entidad:"oficio_turnos",entidad_id:1,detalle:"La Directora turnó el oficio SECTUR/DGT/2026/0104 al departamento de Protocolos y Eventos.",creado_en:"2026-09-03 12:00:00"},{id:3,usuario_id:3,accion:"REGISTRAR_SEGUIMIENTO",entidad:"oficio_seguimiento",entidad_id:1,detalle:"Protocolos y Eventos agregó observación técnica sobre avance con comité de Tianguis Turístico.",creado_en:"2026-09-04 10:15:00"},{id:4,usuario_id:1,accion:"CREAR_OFICIO",entidad:"oficios",entidad_id:3,detalle:"Ingreso de memorándum interno SECTUR/DGT/2026/0106 de comprobaciones de viáticos.",creado_en:"2026-09-06 14:15:00"}],$d=A.createContext(),_s="SECTUR_CORRESPONDENCIA_DATA_V1";function um({children:e}){const[t,n]=A.useState(()=>{try{const b=localStorage.getItem(_s);if(b)return JSON.parse(b)}catch(b){console.warn("No se pudo cargar la información desde LocalStorage:",b)}return{roles:ms,departamentos:hs,tiposDocumento:xs,estados:gs,usuarios:vs,oficios:ys,adjuntos:js,turnos:Ns,seguimientos:ws,lecturas:ks,auditoria:Ss}}),[r,i]=A.useState(2),[l,a]=A.useState("dashboard"),[s,c]=A.useState(null),[u,v]=A.useState(""),[f,h]=A.useState([]);A.useEffect(()=>{try{localStorage.setItem(_s,JSON.stringify(t))}catch(b){console.error("Error al persistir el estado en LocalStorage:",b)}},[t]);const x=t.usuarios.find(b=>b.id===r)||t.usuarios[0],j=t.roles.find(b=>b.id===x.rol_id),N=t.departamentos.find(b=>b.id===x.departamento_id),S=(b,k,C="success")=>{const I=Date.now()+Math.random();h(D=>[...D,{id:I,title:b,message:k,type:C}]),setTimeout(()=>{h(D=>D.filter(O=>O.id!==I))},4e3)},m=b=>{h(k=>k.filter(C=>C.id!==b))},d=()=>new Date().toISOString().replace("T"," ").substring(0,19),p=(b,k,C,I)=>({id:t.auditoria.length?Math.max(...t.auditoria.map(O=>O.id))+1:1,usuario_id:x.id,accion:b,entidad:k,entidad_id:C,detalle:I,creado_en:d()}),y=(b,k=[])=>{const C=t.oficios.length?Math.max(...t.oficios.map(L=>L.id))+1:1,I=d(),D={id:C,folio:b.folio||`SECTUR/DGT/2026/${String(C).padStart(4,"0")}`,tipo_documento_id:parseInt(b.tipo_documento_id)||1,asunto:b.asunto,objeto:b.objeto,destinatario:b.destinatario||"Secretaría de Turismo",fecha_documento:b.fecha_documento||I.split(" ")[0],fecha_recepcion:b.fecha_recepcion||I,termino:b.termino,remitente_usuario_id:x.id,origen_usuario_id:x.id,departamento_destino_inicial_id:parseInt(b.departamento_destino_inicial_id)||1,estado_id:1,creado_en:I,prioridad:b.prioridad||"NORMAL"},O=k.map((L,ie)=>({id:(t.adjuntos.length?Math.max(...t.adjuntos.map(Re=>Re.id))+1:1)+ie,entidad_tipo:"OFICIO",entidad_id:C,nombre_archivo:L.name,archivo_url:L.url||`/docs/${L.name}`,tamano:L.size||"1.5 MB",creado_en:I})),X=p("CREAR_OFICIO","oficios",C,`El usuario ${x.nombre} ingresó el oficio con folio ${D.folio}.`);return n(L=>({...L,oficios:[D,...L.oficios],adjuntos:[...L.adjuntos,...O],auditoria:[X,...L.auditoria]})),S("Oficio Registrado",`Se generó con éxito el folio ${D.folio}`,"success"),D},E=(b,k,C)=>{const I=d(),D=t.departamentos.find(L=>L.id===parseInt(k)),O={id:t.turnos.length?Math.max(...t.turnos.map(L=>L.id))+1:1,oficio_id:b,departamento_id:parseInt(k),turnado_por_usuario_id:x.id,turnado_en:I,recibido_en:null,instrucciones:C||"Atender según atribuciones normativas."},X=p("TURNAR_OFICIO","oficio_turnos",O.id,`Oficio turnado al departamento "${D?D.nombre:"Área"}" por ${x.nombre}.`);n(L=>({...L,turnos:[...L.turnos,O],oficios:L.oficios.map(ie=>ie.id===b?{...ie,estado_id:2}:ie),auditoria:[X,...L.auditoria]})),S("Oficio Turnado",`Se turnó exitosamente a ${D==null?void 0:D.nombre}`,"success")},g=(b,k,C="OBSERVACION")=>{const I=d(),D=t.seguimientos.length?Math.max(...t.seguimientos.map(L=>L.id))+1:1,O={id:D,oficio_id:b,usuario_id:x.id,tipo:C,contenido:k,creado_en:I},X=p("REGISTRAR_SEGUIMIENTO","oficio_seguimiento",D,`${x.nombre} agregó una ${C.toLowerCase()} al oficio #${b}.`);n(L=>({...L,seguimientos:[...L.seguimientos,O],oficios:L.oficios.map(ie=>ie.id===b&&ie.estado_id===2?{...ie,estado_id:3}:ie),auditoria:[X,...L.auditoria]})),S("Seguimiento Guardado","Se añadió la nota al historial del oficio.","info")},z=(b,k,C=null,I=!1)=>{const D=d(),O=t.seguimientos.length?Math.max(...t.seguimientos.map(ge=>ge.id))+1:1,X={id:O,oficio_id:b,usuario_id:x.id,tipo:"RESPUESTA_FORMAL",contenido:k,creado_en:D};let L=null;C&&(L={id:t.adjuntos.length?Math.max(...t.adjuntos.map(ge=>ge.id))+1:1,entidad_tipo:"SEGUIMIENTO",entidad_id:O,nombre_archivo:C.name||"Oficio_Respuesta_Oficial.pdf",archivo_url:C.url||`/docs/${C.name}`,tamano:C.size||"2.0 MB",creado_en:D});const ie=I?5:4,Re=p("EMITIR_RESPUESTA","oficio_seguimiento",O,`Respuesta formal emitida por ${x.nombre} para el oficio #${b}.`);n(ge=>({...ge,seguimientos:[...ge.seguimientos,X],adjuntos:L?[...ge.adjuntos,L]:ge.adjuntos,oficios:ge.oficios.map(Io=>Io.id===b?{...Io,estado_id:ie}:Io),auditoria:[Re,...ge.auditoria]})),S("Respuesta Emitida",`El oficio ahora se encuentra en estado "${ie===5?"Concluido":"Respondido"}".`,"success")},F=b=>{if(t.lecturas.some(D=>D.oficio_id===b&&D.usuario_id===x.id))return;const C=d(),I={id:t.lecturas.length?Math.max(...t.lecturas.map(D=>D.id))+1:1,oficio_id:b,usuario_id:x.id,leido_en:C};n(D=>({...D,lecturas:[...D.lecturas,I]}))},P=b=>{const k=t.departamentos.length?Math.max(...t.departamentos.map(D=>D.id))+1:1,C={id:k,nombre:b.nombre,tipo:b.tipo||"OPERATIVO",clave:b.clave||`DEP-${k}`},I=p("CREAR_DEPARTAMENTO","departamentos",k,`Se creó el departamento ${C.nombre}.`);n(D=>({...D,departamentos:[...D.departamentos,C],auditoria:[I,...D.auditoria]})),S("Departamento Creado",`Se dio de alta "${C.nombre}".`,"success")},M=b=>{const k=t.usuarios.length?Math.max(...t.usuarios.map(L=>L.id))+1:1,C=b.nombre.split(" ").map(L=>L[0]).filter(Boolean).slice(0,2).join("").toUpperCase()||"U",I={id:k,nombre:b.nombre,email:b.email,cargo:b.cargo||"Funcionario Público",rol_id:parseInt(b.rol_id)||3,departamento_id:parseInt(b.departamento_id)||1,password_hash:b.password||"TempPass2026!",activo:!0,avatar:C},D=t.roles.find(L=>L.id===I.rol_id),O=t.departamentos.find(L=>L.id===I.departamento_id),X=p("CREAR_USUARIO","usuarios",k,`Alta del usuario "${I.nombre}" con rol "${D==null?void 0:D.nombre}" en el área "${O==null?void 0:O.nombre}".`);return n(L=>({...L,usuarios:[...L.usuarios,I],auditoria:[X,...L.auditoria]})),S("Usuario Registrado",`Se dio de alta la cuenta para ${I.nombre}`,"success"),I},w=(b,k)=>{const C=t.usuarios.find(D=>D.id===b);if(!C)return;const I=p("MODIFICAR_USUARIO","usuarios",b,`Se actualizaron datos del usuario "${C.nombre}" (Rol: ${k.rol_id}, Depto: ${k.departamento_id}).`);n(D=>({...D,usuarios:D.usuarios.map(O=>O.id===b?{...O,...k,rol_id:parseInt(k.rol_id)||O.rol_id,departamento_id:parseInt(k.departamento_id)||O.departamento_id}:O),auditoria:[I,...D.auditoria]})),S("Usuario Actualizado","Los cambios de rol y departamento han sido guardados.","success")},U=b=>{const k=t.usuarios.find(O=>O.id===b);if(!k)return;const C=!k.activo,D=p(C?"ACTIVAR_USUARIO":"DESACTIVAR_USUARIO","usuarios",b,`${C?"Reactivación":"Desactivación"} de la cuenta institucional de "${k.nombre}".`);n(O=>({...O,usuarios:O.usuarios.map(X=>X.id===b?{...X,activo:C}:X),auditoria:[D,...O.auditoria]})),S(C?"Cuenta Activada":"Cuenta Desactivada",`El usuario ${k.nombre} ahora está ${C?"activo":"inactivo"}.`,C?"success":"info")},T=(b,k)=>{const C=t.usuarios.find(D=>D.id===b);if(!C)return;const I=p("RESTABLECER_PASSWORD","usuarios",b,`Se restableció la contraseña temporal del usuario "${C.nombre}".`);n(D=>({...D,usuarios:D.usuarios.map(O=>O.id===b?{...O,password_hash:k}:O),auditoria:[I,...D.auditoria]})),S("Contraseña Restablecida",`Nueva clave temporal configurada para ${C.nombre}.`,"success")},B=(b,k,C)=>{const I="\uFEFF"+[k.join(","),...C.map(L=>L.map(ie=>`"${String(ie??"").replace(/"/g,'""')}"`).join(","))].join(`
`),D=new Blob([I],{type:"text/csv;charset=utf-8;"}),O=URL.createObjectURL(D),X=document.createElement("a");X.setAttribute("href",O),X.setAttribute("download",b),document.body.appendChild(X),X.click(),document.body.removeChild(X),S("Archivo Descargado",`Se generó "${b}" con éxito.`,"success")},Z=()=>{n({roles:ms,departamentos:hs,tiposDocumento:xs,estados:gs,usuarios:vs,oficios:ys,adjuntos:js,turnos:Ns,seguimientos:ws,lecturas:ks,auditoria:Ss}),S("Datos Restaurados","Se han restablecido los datos demo originales.","info")},Q={total:t.oficios.length,pendientes:t.oficios.filter(b=>b.estado_id===1).length,turnados:t.oficios.filter(b=>b.estado_id===2).length,enProceso:t.oficios.filter(b=>b.estado_id===3).length,respondidos:t.oficios.filter(b=>b.estado_id===4).length,concluidos:t.oficios.filter(b=>b.estado_id===5).length,vencidos:t.oficios.filter(b=>b.estado_id===5||!b.termino?!1:new Date(b.termino)<new Date).length};return o.jsx($d.Provider,{value:{data:t,activeUser:x,activeRole:j,activeDepto:N,activeUserId:r,setActiveUserId:i,activeView:l,setActiveView:a,selectedOficioId:s,setSelectedOficioId:c,searchQuery:u,setSearchQuery:v,toasts:f,addToast:S,removeToast:m,metrics:Q,crearOficio:y,turnarOficio:E,agregarSeguimiento:g,emitirRespuestaFormal:z,marcarComoLeido:F,agregarDepartamento:P,crearUsuario:M,actualizarUsuario:w,toggleActivarUsuario:U,restablecerPassword:T,descargarCSV:B,resetMockData:Z},children:e})}function we(){const e=A.useContext($d);if(!e)throw new Error("useStore debe ser utilizado dentro de un StoreProvider");return e}/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pm=e=>e==null?void 0:e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function fm(e,t,n=[]){if(t==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:pm(e),size:24,node:t,...n.length>0?{aliases:n}:{}}}/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mm=e=>{let t="",n=!1;for(const r of e){if(r==="-"||r==="_"||r<=" "){n=t.length>0;continue}t.length===0?t+=r.toLowerCase():t+=n?r.toUpperCase():r,n=!1}return t};/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hm=e=>{const t=mm(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nl=(...e)=>e.filter((t,n,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===n).join(" ").trim();/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function li(e){return e!=null}function xm(e,t={}){var h,x;const n=t.attributeNames??{},r=j=>n[j]??j,i=e.size??e.width??Tt.width,l=e.size??e.height??Tt.height,a=((h=e.aliases)==null?void 0:h.filter(j=>typeof j=="string"&&j.trim()!=="").map(j=>`lucide-${j}`))??[],s=[...e.name?[`lucide-${e.name}`]:[],...a],c=((x=t.className)==null?void 0:x.split(" ").filter(Boolean))??[],u=t.includeDefaultClasses===!1?nl(...c):nl("lucide",...s,...c),v=t.absoluteStrokeWidth?Number(t.strokeWidth??Tt["stroke-width"])*Number(e.size??e.width??Tt.width)/Number(t.size??t.width??Tt.width):t.strokeWidth??Tt["stroke-width"];return["svg",{...Object.entries(Tt).reduce((j,[N,S])=>(j[r(N)]=S,j),{}),..."color"in t&&t.color&&{[r("stroke")]:t.color},..."size"in t&&li(t.size)&&{[r("width")]:t.size,[r("height")]:t.size},..."width"in t&&li(t.width)&&{[r("width")]:t.width},..."height"in t&&li(t.height)&&{[r("height")]:t.height},[r("stroke-width")]:v,...u&&{[r("class")]:u},[r("viewBox")]:`0 0 ${i} ${l}`,...t.hasA11yProp===!1?{[r("aria-hidden")]:"true"}:{},..."attributes"in t&&t.attributes},e.node.map(j=>{const[N,S,m]=j,d=t.nonScalingStroke?{[r("vector-effect")]:"non-scaling-stroke",...S}:S;return m?[N,d,m]:[N,d]})]}/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function gm(e,t={}){return xm(e,{...t,attributeNames:{...t.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vm=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1},ym=A.createContext({}),jm=()=>A.useContext(ym),Nm=A.forwardRef(({color:e,size:t,width:n,height:r,strokeWidth:i,absoluteStrokeWidth:l,nonScalingStroke:a,className:s="",children:c,iconNode:u=[],icon:v={node:u,aliases:[],size:24},...f},h)=>{const{size:x=24,strokeWidth:j=2,absoluteStrokeWidth:N=!1,nonScalingStroke:S=!1,color:m="currentColor",className:d=""}=jm()??{},p=!!c||vm(f),[y,E,g=[]]=gm(v,{color:e??m,width:n??t??x,height:r??t??x,strokeWidth:i??j,absoluteStrokeWidth:l??N,nonScalingStroke:a??S,className:nl(d,s),hasA11yProp:p,attributes:f});return A.createElement(y,{ref:h,...E},[...g.map(([z,F])=>A.createElement(z,F)),...Array.isArray(c)?c:[c]])});/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function $(e,t=[],n=[]){const r=typeof e=="string"?fm(e,t,n):e,i=A.forwardRef(({className:l,...a},s)=>A.createElement(Nm,{ref:s,icon:r,className:l,...a}));return r.name&&(i.displayName=hm(r.name)),i}/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bd={name:"arrow-left",size:24,node:[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]};Bd.node;const wm=$(Bd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vd={name:"arrow-right",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]};Vd.node;const ai=$(Vd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wd={name:"arrow-up-down",size:24,node:[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]};Wd.node;const km=$(Wd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hd={name:"bell",size:24,node:[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]};Hd.node;const Sm=$(Hd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gd={name:"building-complex",size:24,node:[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]],aliases:["building-2"]};Gd.node;const Qd=$(Gd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qd={name:"building",size:24,node:[["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3",key:"cabbwy"}],["rect",{x:"4",y:"2",width:"16",height:"20",rx:"2",key:"1uxh74"}]]};qd.node;const Et=$(qd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kd={name:"calendar",size:24,node:[["path",{d:"M8 2v3",key:"1ioesn"}],["path",{d:"M16 2v3",key:"otl347"}],["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",key:"h1oib"}],["path",{d:"M3 9h18",key:"1pudct"}]]};Kd.node;const ea=$(Kd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xd={name:"check",size:24,node:[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]};Xd.node;const _m=$(Xd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yd={name:"chevron-down",size:24,node:[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]};Yd.node;const bm=$(Yd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zd={name:"circle-alert",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],aliases:["alert-circle"]};Zd.node;const Cm=$(Zd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jd={name:"circle-check",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 9-5.5 5.5L8 12",key:"xofnsj"}]],aliases:["check-circle-2"]};Jd.node;const ta=$(Jd);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eu={name:"circle-check-big",size:24,node:[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],aliases:["check-circle"]};eu.node;const Em=$(eu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tu={name:"clock",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]]};tu.node;const sr=$(tu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nu={name:"cloud-upload",size:24,node:[["path",{d:"M12 13v8",key:"1l5pq0"}],["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"m8 17 4-4 4 4",key:"1quai1"}]],aliases:["upload-cloud"]};nu.node;const zm=$(nu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ru={name:"copy",size:24,node:[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]};ru.node;const Fm=$(ru);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ou={name:"download",size:24,node:[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]};ou.node;const mo=$(ou);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iu={name:"eye",size:24,node:[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]};iu.node;const rl=$(iu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lu={name:"file-check",size:24,node:[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"m9 15 2 2 4-4",key:"1grp1n"}]]};lu.node;const ho=$(lu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const au={name:"file-plus",size:24,node:[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M9 15h6",key:"cctwl0"}],["path",{d:"M12 18v-6",key:"17g6i2"}]]};au.node;const na=$(au);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const su={name:"file-spreadsheet",size:24,node:[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]};su.node;const ol=$(su);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cu={name:"file-text",size:24,node:[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]};cu.node;const gt=$(cu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const du={name:"inbox",size:24,node:[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]]};du.node;const ra=$(du);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uu={name:"info",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]};uu.node;const Dm=$(uu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pu={name:"key-round",size:24,node:[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]};pu.node;const bs=$(pu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fu={name:"layout-dashboard",size:24,node:[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]};fu.node;const Tm=$(fu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mu={name:"mail",size:24,node:[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]};mu.node;const Im=$(mu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hu={name:"message-square-plus",size:24,node:[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}],["path",{d:"M12 8v6",key:"1ib9pf"}],["path",{d:"M9 11h6",key:"1fldmi"}]]};hu.node;const il=$(hu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xu={name:"paperclip",size:24,node:[["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",key:"1miecu"}]]};xu.node;const Cs=$(xu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gu={name:"plus",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]};gu.node;const Rm=$(gu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vu={name:"printer",size:24,node:[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]};vu.node;const si=$(vu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yu={name:"rotate-ccw",size:24,node:[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]};yu.node;const Am=$(yu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ju={name:"save",size:24,node:[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]};ju.node;const Om=$(ju);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nu={name:"search",size:24,node:[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]};Nu.node;const oa=$(Nu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wu={name:"send",size:24,node:[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]};wu.node;const Ut=$(wu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ku={name:"shield-alert",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]};ku.node;const Pm=$(ku);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Su={name:"shield-check",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]};Su.node;const _u=$(Su);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bu={name:"shield",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]};bu.node;const Mm=$(bu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cu={name:"square-pen",size:24,node:[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],aliases:["pen-box","edit","pen-square"]};Cu.node;const Lm=$(Cu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eu={name:"triangle-alert",size:24,node:[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],aliases:["alert-triangle"]};Eu.node;const xo=$(Eu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zu={name:"upload",size:24,node:[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]]};zu.node;const Um=$(zu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fu={name:"user-check",size:24,node:[["path",{d:"m16 11 2 2 4-4",key:"9rsbq5"}],["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]};Fu.node;const Du=$(Fu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tu={name:"user-plus",size:24,node:[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]};Tu.node;const Es=$(Tu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iu={name:"user-x",size:24,node:[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"17",x2:"22",y1:"8",y2:"13",key:"3nzzx3"}],["line",{x1:"22",x2:"17",y1:"8",y2:"13",key:"1swrse"}]]};Iu.node;const $m=$(Iu);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ru={name:"users",size:24,node:[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]};Ru.node;const Bm=$(Ru);/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Au={name:"x",size:24,node:[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]};Au.node;const ot=$(Au);function Vm(){const{activeUser:e,activeRole:t,activeDepto:n,data:r,setActiveUserId:i,searchQuery:l,setSearchQuery:a,setActiveView:s,metrics:c,resetMockData:u}=we(),[v,f]=A.useState(!1),[h,x]=A.useState(!1),j=r.oficios.filter(N=>N.estado_id===5||!N.termino?!1:Math.ceil((new Date(N.termino)-new Date)/(1e3*60*60*24))<=5);return o.jsxs("header",{className:"topbar",children:[o.jsx("div",{className:"topbar-left",children:o.jsxs("div",{className:"brand-badge",children:[o.jsx("div",{className:"brand-crest",children:o.jsx(Qd,{size:20,className:"text-gold"})}),o.jsxs("div",{className:"brand-text",children:[o.jsx("span",{className:"brand-sub",children:"GOBIERNO DE MÉXICO • SECTUR"}),o.jsx("span",{className:"brand-title",children:"Sistema de Correspondencia"})]})]})}),o.jsx("div",{className:"topbar-center",children:o.jsxs("div",{className:"search-wrapper",children:[o.jsx(oa,{size:17,className:"search-icon"}),o.jsx("input",{type:"text",placeholder:"Buscar por folio, asunto, persona o dependencia...",value:l,onChange:N=>a(N.target.value),className:"topbar-search-input"}),l&&o.jsx("button",{onClick:()=>a(""),className:"search-clear-btn",title:"Limpiar búsqueda",children:"×"})]})}),o.jsxs("div",{className:"topbar-right",children:[o.jsxs("div",{className:"relative",children:[o.jsxs("button",{className:`icon-button ${j.length>0?"has-notifications":""}`,onClick:()=>{x(!h),f(!1)},title:"Oficios con término próximo",children:[o.jsx(Sm,{size:19}),j.length>0&&o.jsx("span",{className:"notification-badge",children:j.length})]}),h&&o.jsxs("div",{className:"dropdown-panel notifications-dropdown",children:[o.jsxs("div",{className:"dropdown-header",children:[o.jsx("span",{className:"dropdown-title",children:"Oficios Urgentes / Por Vencer"}),o.jsxs("span",{className:"badge badge-vencido",children:[j.length," alertas"]})]}),o.jsx("div",{className:"dropdown-list",children:j.length===0?o.jsx("div",{className:"empty-notice",children:"No hay oficios con vencimiento próximo"}):j.map(N=>o.jsxs("div",{className:"notification-item",onClick:()=>{s("oficios"),x(!1)},children:[o.jsx("div",{className:"notification-item-folio",children:N.folio}),o.jsx("div",{className:"notification-item-asunto",children:N.asunto}),o.jsxs("div",{className:"notification-item-term",children:["Término: ",o.jsx("strong",{children:N.termino})]})]},N.id))})]})]}),o.jsxs("div",{className:"relative",children:[o.jsxs("button",{className:"role-selector-btn",onClick:()=>{f(!v),x(!1)},children:[o.jsx("div",{className:"user-avatar",children:e.avatar}),o.jsxs("div",{className:"user-details-box",children:[o.jsx("div",{className:"user-name",children:e.nombre}),o.jsxs("div",{className:"user-role-tag",children:[o.jsx("span",{className:"gold-dot"}),t==null?void 0:t.nombre]})]}),o.jsx(bm,{size:16,className:"text-gold"})]}),v&&o.jsxs("div",{className:"dropdown-panel role-switcher-dropdown",children:[o.jsx("div",{className:"dropdown-header",children:o.jsxs("div",{children:[o.jsx("div",{className:"dropdown-title",children:"Simulador de Rol / Usuario"}),o.jsx("div",{className:"dropdown-subtitle",children:"Cambia de rol para probar permisos y vistas"})]})}),o.jsx("div",{className:"role-options-list",children:r.usuarios.map(N=>{const S=r.roles.find(d=>d.id===N.rol_id),m=N.id===e.id;return o.jsxs("button",{className:`role-option-item ${m?"active":""}`,onClick:()=>{i(N.id),f(!1)},children:[o.jsx("div",{className:"role-avatar-circle",children:N.avatar}),o.jsxs("div",{className:"role-option-info",children:[o.jsx("div",{className:"role-option-name",children:N.nombre}),o.jsx("div",{className:"role-option-title",children:S==null?void 0:S.nombre}),o.jsx("div",{className:"role-option-cargo",children:N.cargo})]}),m&&o.jsx(Du,{size:18,className:"text-dorado"})]},N.id)})}),o.jsx("div",{className:"dropdown-footer",children:o.jsxs("button",{className:"btn-reset-demo",onClick:()=>{u(),f(!1)},children:[o.jsx(Am,{size:14}),"Restablecer Datos Demo"]})})]})]})]}),o.jsx("style",{children:`
        .topbar {
          background-color: var(--color-guinda-dark);
          color: #FFFFFF;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          border-bottom: 2px solid var(--color-dorado);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-crest {
          width: 38px;
          height: 38px;
          background: rgba(188, 149, 92, 0.15);
          border: 1.5px solid var(--color-dorado);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-gold {
          color: var(--color-dorado);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-sub {
          font-size: 10px;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: var(--color-dorado);
        }

        .brand-title {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #FFFFFF;
        }

        .topbar-center {
          flex: 1;
          max-width: 480px;
          margin: 0 24px;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: #9CA3AF;
          pointer-events: none;
        }

        .topbar-search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 9999px;
          padding: 8px 36px 8px 38px;
          color: #FFFFFF;
          font-size: 13.5px;
          outline: none;
          transition: all 0.2s ease;
        }

        .topbar-search-input::placeholder {
          color: rgba(255, 255, 255, 0.65);
        }

        .topbar-search-input:focus {
          background: #FFFFFF;
          color: var(--color-text-dark);
          border-color: var(--color-dorado);
          box-shadow: 0 0 0 3px rgba(188, 149, 92, 0.3);
        }

        .search-clear-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #9CA3AF;
          font-size: 18px;
          cursor: pointer;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .icon-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: var(--color-dorado);
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: #EF4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          border-radius: 9999px;
          padding: 2px 5px;
          min-width: 17px;
          text-align: center;
          border: 1.5px solid var(--color-guinda-dark);
        }

        .role-selector-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(188, 149, 92, 0.4);
          padding: 5px 14px 5px 6px;
          border-radius: 30px;
          cursor: pointer;
          color: #FFFFFF;
          transition: all 0.2s ease;
        }

        .role-selector-btn:hover {
          background: rgba(0, 0, 0, 0.35);
          border-color: var(--color-dorado);
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-dorado) 0%, #8C682D 100%);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #FFFFFF;
        }

        .user-details-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 1.2;
        }

        .user-role-tag {
          font-size: 11px;
          color: var(--color-dorado);
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .gold-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-dorado);
        }

        .relative {
          position: relative;
        }

        .dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #FFFFFF;
          color: var(--color-text-dark);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-xl);
          z-index: 100;
          animation: scaleUp 0.2s ease;
        }

        .role-switcher-dropdown {
          width: 360px;
        }

        .notifications-dropdown {
          width: 320px;
        }

        .dropdown-header {
          padding: 14px 18px;
          border-bottom: 1px solid var(--color-border);
          background-color: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }

        .dropdown-title {
          font-weight: 700;
          font-size: 13.5px;
          color: var(--color-guinda-dark);
        }

        .dropdown-subtitle {
          font-size: 11.5px;
          color: var(--color-text-subtle);
        }

        .role-options-list {
          max-height: 320px;
          overflow-y: auto;
          padding: 8px;
        }

        .role-option-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s;
        }

        .role-option-item:hover {
          background-color: #F1F5F9;
        }

        .role-option-item.active {
          background-color: var(--color-dorado-light);
          border-color: var(--color-dorado-border);
        }

        .role-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-guinda-dark);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .role-option-info {
          flex: 1;
        }

        .role-option-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-dark);
        }

        .role-option-title {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--color-guinda-primary);
        }

        .role-option-cargo {
          font-size: 11px;
          color: var(--color-text-subtle);
        }

        .dropdown-footer {
          padding: 10px 16px;
          border-top: 1px solid var(--color-border);
          background-color: #FAFBFD;
          display: flex;
          justify-content: center;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }

        .btn-reset-demo {
          background: none;
          border: none;
          color: #64748B;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .btn-reset-demo:hover {
          color: var(--color-guinda-dark);
        }

        .notification-item {
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border-light);
          cursor: pointer;
          transition: background 0.15s;
        }

        .notification-item:hover {
          background-color: #FEF2F2;
        }

        .notification-item-folio {
          font-size: 12px;
          font-weight: 700;
          color: #991B1B;
        }

        .notification-item-asunto {
          font-size: 12.5px;
          color: var(--color-text-dark);
          margin: 2px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .notification-item-term {
          font-size: 11px;
          color: #64748B;
        }

        .empty-notice {
          padding: 24px;
          text-align: center;
          font-size: 13px;
          color: #94A3B8;
        }
      `})]})}function Wm(){const{activeView:e,setActiveView:t,activeUser:n,activeRole:r,activeDepto:i,metrics:l}=we(),a=n.rol_id===1||n.rol_id===4,s=n.rol_id===2,c=[{id:"dashboard",label:"Panel Principal",icon:Tm,badge:null},{id:"oficios",label:"Bandeja de Oficios",icon:ra,badge:l.pendientes>0?`${l.pendientes} pend.`:null,badgeColor:"amber"},{id:"nuevo",label:"Generar Nuevo Oficio",icon:na,highlight:!0,allowed:a||s},{id:"reportes",label:"Reportes y Exportación",icon:ol,badge:"Excel / PDF",badgeColor:"default"},{id:"departamentos",label:"Catálogo Departamentos",icon:Et,badge:null},{id:"usuarios",label:"Gestión de Usuarios",icon:Bm,badge:null},{id:"auditoria",label:"Bitácora de Auditoría",icon:Pm,badge:null}];return o.jsxs("aside",{className:"sidebar",children:[o.jsxs("div",{className:"sidebar-header",children:[o.jsx("div",{className:"sidebar-institution-seal",children:o.jsx("div",{className:"seal-outer",children:o.jsx("span",{className:"seal-text",children:"SECTUR"})})}),o.jsxs("div",{className:"sidebar-inst-title",children:[o.jsx("h3",{children:"SECRETARÍA DE TURISMO"}),o.jsx("p",{children:"Correspondencia y Gestión"})]})]}),o.jsx("div",{className:"sidebar-gold-line"}),o.jsxs("nav",{className:"sidebar-nav",children:[o.jsx("div",{className:"nav-section-title",children:"MENÚ PRINCIPAL"}),o.jsx("ul",{className:"nav-list",children:c.map(u=>{const v=u.icon,f=e===u.id;return u.allowed===!1?null:o.jsx("li",{children:o.jsxs("button",{className:`nav-link ${f?"active":""} ${u.highlight?"nav-link-cta":""}`,onClick:()=>t(u.id),children:[o.jsx(v,{size:19,className:"nav-icon"}),o.jsx("span",{className:"nav-label",children:u.label}),u.badge&&o.jsx("span",{className:`nav-badge badge-${u.badgeColor||"default"}`,children:u.badge})]})},u.id)})})]}),o.jsxs("div",{className:"sidebar-footer",children:[o.jsxs("div",{className:"dept-context-card",children:[o.jsx("div",{className:"dept-label",children:"ÁREA ASIGNADA:"}),o.jsx("div",{className:"dept-name",children:(i==null?void 0:i.nombre)||"Dirección General"}),o.jsx("div",{className:"dept-role-pill",children:o.jsx("span",{children:r==null?void 0:r.nombre})})]}),o.jsx("div",{className:"system-version-tag",children:o.jsx("span",{children:"Versión 2.4.0 • SECTUR 2026"})})]}),o.jsx("style",{children:`
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #501324 0%, #691C32 40%, #460F1E 100%);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          border-right: 2px solid var(--color-dorado);
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
          height: 100vh;
          position: sticky;
          top: 0;
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 24px 20px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-institution-seal {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid var(--color-dorado);
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .seal-outer {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seal-text {
          font-size: 9.5px;
          font-weight: 800;
          color: var(--color-dorado);
          letter-spacing: 0.08em;
        }

        .sidebar-inst-title h3 {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #FFFFFF;
          line-height: 1.2;
        }

        .sidebar-inst-title p {
          font-size: 11px;
          color: var(--color-dorado);
          font-weight: 500;
          margin-top: 2px;
        }

        .sidebar-gold-line {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--color-dorado) 50%, transparent 100%);
          margin: 0 16px 16px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 14px;
          overflow-y: auto;
        }

        .nav-section-title {
          font-size: 10.5px;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: rgba(188, 149, 92, 0.85);
          padding: 8px 12px;
          margin-bottom: 4px;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          border-color: rgba(188, 149, 92, 0.3);
          transform: translateX(3px);
        }

        .nav-link.active {
          background: linear-gradient(90deg, rgba(188, 149, 92, 0.28) 0%, rgba(188, 149, 92, 0.08) 100%);
          color: #FFFFFF;
          border-left: 3.5px solid var(--color-dorado);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .nav-link.active .nav-icon {
          color: var(--color-dorado);
        }

        .nav-link-cta {
          background: rgba(188, 149, 92, 0.15);
          border: 1px dashed var(--color-dorado);
          color: #FFFFFF;
          margin-top: 4px;
        }

        .nav-link-cta:hover {
          background: var(--color-dorado);
          color: #2b1307;
          border-style: solid;
        }

        .nav-link-cta.active {
          background: var(--color-dorado);
          color: #2b1307;
          border-color: #FFFFFF;
        }

        .nav-link-cta.active .nav-icon {
          color: #2b1307;
        }

        .nav-icon {
          color: rgba(255, 255, 255, 0.7);
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .nav-label {
          flex: 1;
        }

        .nav-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .badge-amber {
          background-color: #F59E0B;
          color: #78350F;
        }

        .badge-default {
          background-color: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        .sidebar-footer {
          padding: 16px 14px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dept-context-card {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(188, 149, 92, 0.3);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .dept-label {
          font-size: 9.5px;
          letter-spacing: 0.08em;
          color: var(--color-dorado);
          font-weight: 700;
        }

        .dept-name {
          font-size: 12px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 2px 0 6px;
          line-height: 1.3;
        }

        .dept-role-pill {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 600;
          background: rgba(188, 149, 92, 0.2);
          color: #FDF2F4;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(188, 149, 92, 0.3);
        }

        .system-version-tag {
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
        }
      `})]})}function Hm(){const{data:e,metrics:t,setActiveView:n,setSelectedOficioId:r,activeUser:i,activeRole:l}=we(),a=e.oficios.filter(f=>f.estado_id!==5).map(f=>{const h=e.departamentos.find(m=>m.id===f.departamento_destino_inicial_id),x=e.estados.find(m=>m.id===f.estado_id),j=e.tiposDocumento.find(m=>m.id===f.tipo_documento_id);let N=null,S="normal";if(f.termino){const m=Math.ceil((new Date(f.termino)-new Date)/864e5);N=m,m<0?S="vencido":m<=3?S="critico":m<=7&&(S="preventivo")}return{...f,deptoNombre:h?h.nombre:"Sin asignar",estadoNombre:x?x.nombre:"Desconocido",tipoNombre:j?j.nombre:"Documento",diasRestantes:N,urgenciaNivel:S}}).sort((f,h)=>(f.diasRestantes??999)-(h.diasRestantes??999)),s=e.departamentos.map(f=>{const h=e.oficios.filter(j=>j.departamento_destino_inicial_id===f.id).length,x=e.oficios.filter(j=>j.departamento_destino_inicial_id===f.id&&j.estado_id===1).length;return{...f,total:h,pendientes:x}}).sort((f,h)=>h.total-f.total),c=e.auditoria.slice(0,5).map(f=>{const h=e.usuarios.find(x=>x.id===f.usuario_id);return{...f,usuarioNombre:h?h.nombre:"Sistema",cargo:h?h.cargo:""}}),u=i.rol_id===1||i.rol_id===4,v=i.rol_id===2;return o.jsxs("div",{className:"dashboard-container",children:[o.jsxs("div",{className:"welcome-banner card card-gold-accent",children:[o.jsxs("div",{className:"welcome-content",children:[o.jsxs("div",{className:"welcome-subtitle",children:[o.jsx("span",{className:"inst-tag",children:"SECRETARÍA DE TURISMO"}),o.jsxs("span",{className:"date-tag",children:[o.jsx(ea,{size:14}),new Date().toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"})]})]}),o.jsxs("h1",{className:"welcome-title",children:["Bienvenido(a), ",i.nombre]}),o.jsx("p",{className:"welcome-desc",children:"Panel ejecutivo para el seguimiento, turno y control de la correspondencia oficial de SECTUR."})]}),o.jsxs("div",{className:"welcome-actions",children:[(u||v)&&o.jsxs("button",{className:"btn btn-primary",onClick:()=>n("nuevo"),children:[o.jsx(na,{size:18}),"Nuevo Oficio"]}),o.jsxs("button",{className:"btn btn-secondary",onClick:()=>n("oficios"),children:[o.jsx(ra,{size:18}),"Ver Todos los Oficios"]})]})]}),o.jsxs("div",{className:"metrics-grid",children:[o.jsxs("div",{className:"metric-card card",children:[o.jsxs("div",{className:"metric-header",children:[o.jsx("span",{className:"metric-label",children:"TOTAL OFICIOS"}),o.jsx("div",{className:"metric-icon-box bg-gold-subtle",children:o.jsx(gt,{size:20,className:"text-gold"})})]}),o.jsx("div",{className:"metric-value",children:t.total}),o.jsx("div",{className:"metric-footer",children:"Registrados en la plataforma"})]}),o.jsxs("div",{className:"metric-card card clickable",onClick:()=>n("oficios"),children:[o.jsxs("div",{className:"metric-header",children:[o.jsx("span",{className:"metric-label",children:"PENDIENTES DE TURNO"}),o.jsx("div",{className:"metric-icon-box bg-amber-subtle",children:o.jsx(sr,{size:20,className:"text-amber"})})]}),o.jsx("div",{className:"metric-value text-amber",children:t.pendientes}),o.jsx("div",{className:"metric-footer",children:"Requieren revisión de Directora"})]}),o.jsxs("div",{className:"metric-card card clickable",onClick:()=>n("oficios"),children:[o.jsxs("div",{className:"metric-header",children:[o.jsx("span",{className:"metric-label",children:"TURNADOS / EN PROCESO"}),o.jsx("div",{className:"metric-icon-box bg-purple-subtle",children:o.jsx(Ut,{size:20,className:"text-purple"})})]}),o.jsx("div",{className:"metric-value text-purple",children:t.turnados+t.enProceso}),o.jsx("div",{className:"metric-footer",children:"En atención en departamentos"})]}),o.jsxs("div",{className:"metric-card card clickable",onClick:()=>n("oficios"),children:[o.jsxs("div",{className:"metric-header",children:[o.jsx("span",{className:"metric-label",children:"POR VENCER / VENCIDOS"}),o.jsx("div",{className:"metric-icon-box bg-red-subtle",children:o.jsx(xo,{size:20,className:"text-red"})})]}),o.jsx("div",{className:"metric-value text-red",children:t.vencidos}),o.jsx("div",{className:"metric-footer",children:"Atención urgente requerida"})]}),o.jsxs("div",{className:"metric-card card",children:[o.jsxs("div",{className:"metric-header",children:[o.jsx("span",{className:"metric-label",children:"CONCLUIDOS"}),o.jsx("div",{className:"metric-icon-box bg-green-subtle",children:o.jsx(ta,{size:20,className:"text-green"})})]}),o.jsx("div",{className:"metric-value text-green",children:t.concluidos}),o.jsx("div",{className:"metric-footer",children:"Atendidos con respuesta formal"})]})]}),o.jsxs("div",{className:"dashboard-grid-two",children:[o.jsxs("div",{className:"card dashboard-section",children:[o.jsxs("div",{className:"section-header",children:[o.jsxs("div",{className:"section-title-wrap",children:[o.jsx(xo,{size:18,className:"text-red"}),o.jsx("h2",{children:"Atención Prioritaria (Término y Vencimiento)"})]}),o.jsxs("button",{className:"btn btn-sm btn-secondary",onClick:()=>n("oficios"),children:["Ver bandeja ",o.jsx(ai,{size:14})]})]}),o.jsx("div",{className:"urgent-list",children:a.slice(0,4).map(f=>o.jsxs("div",{className:`urgent-card-item urgency-${f.urgenciaNivel}`,onClick:()=>{r(f.id),n("oficios")},children:[o.jsxs("div",{className:"urgent-top",children:[o.jsx("span",{className:"urgent-folio",children:f.folio}),o.jsx("span",{className:`badge badge-${f.estado_id===1?"pendiente":f.estado_id===2?"turnado":"proceso"}`,children:f.estadoNombre})]}),o.jsx("div",{className:"urgent-asunto",children:f.asunto}),o.jsxs("div",{className:"urgent-bottom",children:[o.jsxs("span",{className:"urgent-depto",children:[o.jsx(Et,{size:13}),f.deptoNombre]}),o.jsxs("span",{className:"urgent-days-badge",children:[o.jsx(sr,{size:13}),f.diasRestantes===null?"Sin fecha límite":f.diasRestantes<0?`Vencido hace ${Math.abs(f.diasRestantes)} días`:`${f.diasRestantes} días restantes`]})]})]},f.id))})]}),o.jsxs("div",{className:"card dashboard-section",children:[o.jsxs("div",{className:"section-header",children:[o.jsxs("div",{className:"section-title-wrap",children:[o.jsx(Et,{size:18,className:"text-gold"}),o.jsx("h2",{children:"Carga por Departamento"})]}),o.jsxs("button",{className:"btn btn-sm btn-secondary",onClick:()=>n("departamentos"),children:["Ver áreas ",o.jsx(ai,{size:14})]})]}),o.jsx("div",{className:"depto-stats-list",children:s.map(f=>{const h=t.total>0?Math.round(f.total/t.total*100):0;return o.jsxs("div",{className:"depto-stat-row",children:[o.jsxs("div",{className:"depto-stat-info",children:[o.jsx("span",{className:"depto-stat-name",children:f.nombre}),o.jsxs("span",{className:"depto-stat-count",children:[o.jsx("strong",{children:f.total})," oficios (",h,"%)"]})]}),o.jsx("div",{className:"stat-progress-bg",children:o.jsx("div",{className:"stat-progress-fill",style:{width:`${Math.max(h,5)}%`}})})]},f.id)})})]})]}),o.jsxs("div",{className:"card dashboard-section mt-6",children:[o.jsxs("div",{className:"section-header",children:[o.jsxs("div",{className:"section-title-wrap",children:[o.jsx(_u,{size:18,className:"text-guinda"}),o.jsx("h2",{children:"Bitácora de Trazabilidad Reciente"})]}),o.jsxs("button",{className:"btn btn-sm btn-secondary",onClick:()=>n("auditoria"),children:["Ver toda la bitácora ",o.jsx(ai,{size:14})]})]}),o.jsx("div",{className:"recent-audit-table",children:o.jsxs("table",{className:"custom-table",children:[o.jsx("thead",{children:o.jsxs("tr",{children:[o.jsx("th",{children:"Fecha y Hora"}),o.jsx("th",{children:"Usuario"}),o.jsx("th",{children:"Acción Realizada"}),o.jsx("th",{children:"Detalle del Evento"})]})}),o.jsx("tbody",{children:c.map(f=>o.jsxs("tr",{children:[o.jsx("td",{style:{whiteSpace:"nowrap",fontSize:"13px",color:"#64748B"},children:f.creado_en}),o.jsxs("td",{children:[o.jsx("div",{style:{fontWeight:600,color:"var(--color-text-dark)"},children:f.usuarioNombre}),o.jsx("div",{style:{fontSize:"11px",color:"var(--color-text-subtle)"},children:f.cargo})]}),o.jsx("td",{children:o.jsx("span",{className:"badge badge-dorado font-bold",children:f.accion})}),o.jsx("td",{style:{fontSize:"13.5px"},children:f.detalle})]},f.id))})]})})]}),o.jsx("style",{children:`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .welcome-banner {
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #FFFFFF 0%, #FAF6F0 100%);
          border-left: 5px solid var(--color-guinda-dark);
        }

        .welcome-content {
          max-width: 700px;
        }

        .welcome-subtitle {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .inst-tag {
          font-size: 11px;
          font-weight: 800;
          color: var(--color-guinda-primary);
          letter-spacing: 0.08em;
        }

        .date-tag {
          font-size: 12px;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .welcome-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--color-guinda-dark);
          margin-bottom: 6px;
        }

        .welcome-desc {
          font-size: 14px;
          color: var(--color-text-muted);
        }

        .welcome-actions {
          display: flex;
          gap: 12px;
        }

        .dashboard-grid-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-grid-two {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-section {
          padding: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1.5px solid var(--color-border-light);
        }

        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-title-wrap h2 {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-guinda-dark);
        }

        .urgent-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .urgent-card-item {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .urgent-card-item:hover {
          border-color: var(--color-dorado);
          transform: translateX(4px);
          box-shadow: var(--shadow-sm);
        }

        .urgent-card-item.urgency-critico {
          border-left: 4px solid #EF4444;
          background-color: #FFFDFD;
        }

        .urgent-card-item.urgency-vencido {
          border-left: 4px solid #991B1B;
          background-color: #FEF2F2;
        }

        .urgent-card-item.urgency-preventivo {
          border-left: 4px solid #F59E0B;
        }

        .urgent-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .urgent-folio {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-guinda-dark);
        }

        .urgent-asunto {
          font-size: 13.5px;
          color: var(--color-text-dark);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .urgent-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #64748B;
        }

        .urgent-depto {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .urgent-days-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          color: #DC2626;
        }

        .depto-stats-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .depto-stat-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .depto-stat-info {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .depto-stat-name {
          font-weight: 600;
          color: var(--color-text-dark);
        }

        .depto-stat-count {
          color: #64748B;
        }

        .stat-progress-bg {
          width: 100%;
          height: 8px;
          background-color: #F1F5F9;
          border-radius: 9999px;
          overflow: hidden;
        }

        .stat-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-guinda-primary) 0%, var(--color-dorado) 100%);
          border-radius: 9999px;
        }

        .mt-6 {
          margin-top: 24px;
        }

        .recent-audit-table {
          overflow-x: auto;
        }
      `})]})}function Gm({oficio:e,onClose:t}){var v;const{data:n,turnarOficio:r,activeUser:i}=we(),[l,a]=A.useState(e.departamento_destino_inicial_id||((v=n.departamentos[1])==null?void 0:v.id)||""),[s,c]=A.useState("Para su debida atención, trámite y resolución conforme a las atribuciones de su área."),u=f=>{f.preventDefault(),l&&(r(e.id,l,s),t())};return o.jsx("div",{className:"modal-overlay",onClick:t,children:o.jsxs("div",{className:"modal-content",onClick:f=>f.stopPropagation(),style:{maxWidth:"580px"},children:[o.jsxs("div",{className:"modal-header",children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[o.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"8px",background:"var(--color-guinda-light)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-guinda-primary)"},children:o.jsx(Ut,{size:18})}),o.jsxs("div",{children:[o.jsx("h3",{style:{fontSize:"16px",color:"var(--color-guinda-dark)"},children:"Turnar Oficio a Departamento"}),o.jsxs("p",{style:{fontSize:"12px",color:"var(--color-text-subtle)"},children:["Folio: ",e.folio]})]})]}),o.jsx("button",{onClick:t,style:{background:"none",border:"none",cursor:"pointer",color:"#64748B"},children:o.jsx(ot,{size:20})})]}),o.jsxs("form",{onSubmit:u,children:[o.jsxs("div",{className:"modal-body",children:[o.jsxs("div",{style:{padding:"12px 14px",background:"#F8FAFC",borderRadius:"var(--radius-md)",border:"1px solid var(--color-border)",marginBottom:"18px",fontSize:"13px"},children:[o.jsx("div",{style:{fontWeight:600,color:"var(--color-text-dark)",marginBottom:"4px"},children:"Asunto del Oficio:"}),o.jsx("div",{style:{color:"var(--color-text-muted)"},children:e.asunto})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:[o.jsx(Qd,{size:15,className:"text-gold"}),"Departamento Destino ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("select",{className:"form-select",value:l,onChange:f=>a(f.target.value),required:!0,children:n.departamentos.map(f=>o.jsxs("option",{value:f.id,children:[f.nombre," (",f.tipo,")"]},f.id))}),o.jsx("span",{className:"form-helper",children:"El titular del departamento seleccionado recibirá la notificación y turno."})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Instrucciones Específicas / Observaciones del Turno ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("textarea",{className:"form-textarea",rows:4,value:s,onChange:f=>c(f.target.value),placeholder:"Indique las directrices para la atención del oficio...",required:!0})]})]}),o.jsxs("div",{className:"modal-footer",children:[o.jsx("button",{type:"button",className:"btn btn-secondary",onClick:t,children:"Cancelar"}),o.jsxs("button",{type:"submit",className:"btn btn-primary",children:[o.jsx(Ut,{size:16}),"Confirmar y Turnar"]})]})]})]})})}function Qm({oficio:e,onClose:t}){const{emitirRespuestaFormal:n,activeUser:r}=we(),[i,l]=A.useState(""),[a,s]=A.useState(!1),[c,u]=A.useState("Respuesta_Oficio_"+e.folio.replaceAll("/","_")+".pdf"),[v,f]=A.useState(!0),h=x=>{if(x.preventDefault(),!i.trim())return;const j=v?{name:c,url:`/docs/${c}`,size:"2.4 MB"}:null;n(e.id,i,j,a),t()};return o.jsx("div",{className:"modal-overlay",onClick:t,children:o.jsxs("div",{className:"modal-content",onClick:x=>x.stopPropagation(),style:{maxWidth:"620px"},children:[o.jsxs("div",{className:"modal-header",children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[o.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"8px",background:"var(--status-respondido-bg)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--status-respondido-text)"},children:o.jsx(ho,{size:18})}),o.jsxs("div",{children:[o.jsx("h3",{style:{fontSize:"16px",color:"var(--color-guinda-dark)"},children:"Emitir Respuesta Formal"}),o.jsxs("p",{style:{fontSize:"12px",color:"var(--color-text-subtle)"},children:["Folio: ",e.folio]})]})]}),o.jsx("button",{onClick:t,style:{background:"none",border:"none",cursor:"pointer",color:"#64748B"},children:o.jsx(ot,{size:20})})]}),o.jsxs("form",{onSubmit:h,children:[o.jsxs("div",{className:"modal-body",children:[o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Texto del Dictamen / Respuesta Institucional ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("textarea",{className:"form-textarea",rows:5,value:i,onChange:x=>l(x.target.value),placeholder:"Describa la resolución, acciones efectuadas o respuesta remitida al interesado...",required:!0})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:[o.jsx(Um,{size:15,className:"text-gold"}),"Oficio o Dictamen de Respuesta (PDF Adjunto)"]}),o.jsxs("div",{style:{border:"1.5px dashed var(--color-dorado)",borderRadius:"var(--radius-md)",padding:"16px",backgroundColor:"#FAFBFD",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[o.jsx(gt,{size:22,className:"text-guinda"}),o.jsxs("div",{children:[o.jsx("input",{type:"text",className:"form-input",style:{padding:"4px 8px",fontSize:"13px",width:"320px"},value:c,onChange:x=>u(x.target.value)}),o.jsx("div",{style:{fontSize:"11px",color:"#64748B",marginTop:"2px"},children:"Simulación de archivo PDF (2.4 MB) • Listo para adjuntar"})]})]}),o.jsxs("label",{style:{fontSize:"12px",fontWeight:600,color:"var(--color-guinda-primary)",cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"},children:[o.jsx("input",{type:"checkbox",checked:v,onChange:x=>f(x.target.checked)}),"Incluir PDF"]})]})]}),o.jsxs("div",{style:{marginTop:"16px",padding:"12px 14px",background:"#F0FDF4",borderRadius:"var(--radius-md)",border:"1px solid #BBF7D0",display:"flex",alignItems:"flex-start",gap:"10px"},children:[o.jsx("input",{type:"checkbox",id:"checkConcluir",checked:a,onChange:x=>s(x.target.checked),style:{marginTop:"3px",cursor:"pointer"}}),o.jsxs("label",{htmlFor:"checkConcluir",style:{fontSize:"13px",color:"#166534",cursor:"pointer"},children:[o.jsx("strong",{children:"Marcar trámite como Concluido definitivamente"}),o.jsx("div",{style:{fontSize:"11.5px",color:"#15803D"},children:"Si el asunto no requiere más turnos ni seguimiento posterior, se cerrará el folio."})]})]})]}),o.jsxs("div",{className:"modal-footer",children:[o.jsx("button",{type:"button",className:"btn btn-secondary",onClick:t,children:"Cancelar"}),o.jsxs("button",{type:"submit",className:"btn btn-primary",children:[o.jsx(Em,{size:16}),"Registrar Respuesta"]})]})]})]})})}function qm({oficio:e,onClose:t}){const{agregarSeguimiento:n}=we(),[r,i]=A.useState("OBSERVACION"),[l,a]=A.useState(""),s=c=>{c.preventDefault(),l.trim()&&(n(e.id,l,r),t())};return o.jsx("div",{className:"modal-overlay",onClick:t,children:o.jsxs("div",{className:"modal-content",onClick:c=>c.stopPropagation(),style:{maxWidth:"540px"},children:[o.jsxs("div",{className:"modal-header",children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[o.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"8px",background:"var(--color-dorado-light)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-dorado-hover)"},children:o.jsx(il,{size:18})}),o.jsxs("div",{children:[o.jsx("h3",{style:{fontSize:"16px",color:"var(--color-guinda-dark)"},children:"Agregar Nota de Seguimiento"}),o.jsxs("p",{style:{fontSize:"12px",color:"var(--color-text-subtle)"},children:["Folio: ",e.folio]})]})]}),o.jsx("button",{onClick:t,style:{background:"none",border:"none",cursor:"pointer",color:"#64748B"},children:o.jsx(ot,{size:20})})]}),o.jsxs("form",{onSubmit:s,children:[o.jsxs("div",{className:"modal-body",children:[o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Tipo de Entrada"}),o.jsxs("select",{className:"form-select",value:r,onChange:c=>i(c.target.value),children:[o.jsx("option",{value:"OBSERVACION",children:"Observación / Nota Interna"}),o.jsx("option",{value:"AVANCE",children:"Reporte de Avance / Gestión"})]})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Contenido / Comentarios ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("textarea",{className:"form-textarea",rows:4,value:l,onChange:c=>a(c.target.value),placeholder:"Escriba los avances, llamadas o gestiones intermedias...",required:!0})]})]}),o.jsxs("div",{className:"modal-footer",children:[o.jsx("button",{type:"button",className:"btn btn-secondary",onClick:t,children:"Cancelar"}),o.jsxs("button",{type:"submit",className:"btn btn-primary",children:[o.jsx(Ut,{size:16}),"Guardar Nota"]})]})]})]})})}function Km({oficioId:e,onClose:t}){const{data:n,activeUser:r,activeRole:i,marcarComoLeido:l}=we(),[a,s]=A.useState("ficha"),[c,u]=A.useState(!1),[v,f]=A.useState(!1),[h,x]=A.useState(!1),[j,N]=A.useState(null),S=n.oficios.find(T=>T.id===e);if(A.useEffect(()=>{e&&l(e)},[e]),!S)return null;const m=n.departamentos.find(T=>T.id===S.departamento_destino_inicial_id),d=n.tiposDocumento.find(T=>T.id===S.tipo_documento_id),p=n.estados.find(T=>T.id===S.estado_id),y=n.usuarios.find(T=>T.id===S.remitente_usuario_id),E=n.adjuntos.filter(T=>T.entidad_tipo==="OFICIO"&&T.entidad_id===S.id||T.entidad_tipo==="SEGUIMIENTO"&&n.seguimientos.some(B=>B.oficio_id===S.id&&B.id===T.entidad_id)),g=n.turnos.filter(T=>T.oficio_id===S.id),z=n.seguimientos.filter(T=>T.oficio_id===S.id),F=n.lecturas.filter(T=>T.oficio_id===S.id),P=[{type:"CREACION",date:S.creado_en||S.fecha_recepcion,title:"Ingreso a Oficialía de Partes",description:`El documento fue registrado en la plataforma por ${(y==null?void 0:y.nombre)||"Oficialía de Partes"}.`,icon:gt,color:"gold"},...F.map(T=>{const B=n.usuarios.find(Z=>Z.id===T.usuario_id);return{type:"LECTURA",date:T.leido_en,title:"Documento Consultado",description:`${(B==null?void 0:B.nombre)||"Usuario"} visualizó los detalles de este oficio.`,icon:rl,color:"gray"}}),...g.map(T=>{const B=n.usuarios.find(Q=>Q.id===T.turnado_por_usuario_id),Z=n.departamentos.find(Q=>Q.id===T.departamento_id);return{type:"TURNO",date:T.turnado_en,title:`Turnado a: ${(Z==null?void 0:Z.nombre)||"Departamento"}`,description:`Instrucción: "${T.instrucciones}" (Turnado por ${(B==null?void 0:B.nombre)||"Directora"}).`,icon:Ut,color:"purple"}}),...z.map(T=>{const B=n.usuarios.find(Q=>Q.id===T.usuario_id),Z=T.tipo==="RESPUESTA_FORMAL";return{type:T.tipo,date:T.creado_en,title:Z?"Respuesta Formal Emitida":T.tipo==="AVANCE"?"Avance de Gestión":"Observación / Nota",description:T.contenido,author:B==null?void 0:B.nombre,cargo:B==null?void 0:B.cargo,icon:Z?ho:il,color:Z?"green":"amber"}})].sort((T,B)=>new Date(T.date)-new Date(B.date));let M=null;S.termino&&(M=Math.ceil((new Date(S.termino)-new Date)/(1e3*60*60*24)));const w=r.rol_id===2||r.rol_id===4,U=r.rol_id===3||r.rol_id===4;return o.jsxs("div",{className:"modal-overlay",onClick:t,children:[o.jsxs("div",{className:"modal-content oficio-detail-modal",onClick:T=>T.stopPropagation(),children:[o.jsxs("div",{className:"modal-header detail-header",children:[o.jsxs("div",{className:"detail-header-left",children:[o.jsx("span",{className:"inst-badge-gold",children:"SECTUR • OFICIO OFICIAL"}),o.jsx("h2",{className:"detail-folio",children:S.folio})]}),o.jsxs("div",{className:"detail-header-right",children:[o.jsx("span",{className:`badge badge-${S.estado_id===1?"pendiente":S.estado_id===2?"turnado":S.estado_id===3?"proceso":S.estado_id===4?"respondido":"concluido"}`,children:p==null?void 0:p.nombre}),o.jsxs("button",{className:"btn btn-sm btn-secondary",onClick:()=>window.print(),title:"Imprimir o Guardar Ficha en PDF",children:[o.jsx(mo,{size:14}),"Imprimir / PDF"]}),o.jsx("button",{className:"close-btn",onClick:t,children:o.jsx(ot,{size:20})})]})]}),o.jsxs("div",{className:"detail-tabs",children:[o.jsxs("button",{className:`tab-btn ${a==="ficha"?"active":""}`,onClick:()=>s("ficha"),children:[o.jsx(gt,{size:16}),"Ficha del Oficio"]}),o.jsxs("button",{className:`tab-btn ${a==="timeline"?"active":""}`,onClick:()=>s("timeline"),children:[o.jsx(sr,{size:16}),"Línea de Tiempo (",P.length,")"]}),o.jsxs("button",{className:`tab-btn ${a==="adjuntos"?"active":""}`,onClick:()=>s("adjuntos"),children:[o.jsx(Cs,{size:16}),"Adjuntos (",E.length,")"]})]}),o.jsxs("div",{className:"modal-body detail-body",children:[a==="ficha"&&o.jsxs("div",{className:"official-sheet",children:[o.jsxs("div",{className:"sheet-top-banner",children:[o.jsxs("div",{className:"sheet-gov-text",children:[o.jsx("strong",{children:"SECRETARÍA DE TURISMO"}),o.jsx("span",{children:"DIRECCIÓN GENERAL Y OFICIALÍA DE PARTES"})]}),o.jsx("div",{className:"sheet-seal-icon",children:"SECTUR"})]}),o.jsx("div",{className:"sheet-divider-gold"}),o.jsxs("div",{className:"sheet-section",children:[o.jsx("div",{className:"sheet-field-title",children:"ASUNTO:"}),o.jsx("div",{className:"sheet-asunto-text",children:S.asunto})]}),S.objeto&&o.jsxs("div",{className:"sheet-section",children:[o.jsx("div",{className:"sheet-field-title",children:"OBJETO / DESCRIPCIÓN:"}),o.jsx("div",{className:"sheet-objeto-text",children:S.objeto})]}),o.jsxs("div",{className:"sheet-grid-meta",children:[o.jsxs("div",{className:"meta-item",children:[o.jsx("span",{className:"meta-label",children:"TIPO DE DOCUMENTO"}),o.jsx("span",{className:"meta-value",children:d==null?void 0:d.nombre})]}),o.jsxs("div",{className:"meta-item",children:[o.jsx("span",{className:"meta-label",children:"DESTINATARIO EXTERNO / MEMBRETE"}),o.jsx("span",{className:"meta-value",children:S.destinatario})]}),o.jsxs("div",{className:"meta-item",children:[o.jsx("span",{className:"meta-label",children:"DEPARTAMENTO DESTINO ASIGNADO"}),o.jsx("span",{className:"meta-value",style:{color:"var(--color-guinda-primary)",fontWeight:700},children:m==null?void 0:m.nombre})]}),o.jsxs("div",{className:"meta-item",children:[o.jsx("span",{className:"meta-label",children:"FECHA DE RECEPCIÓN"}),o.jsx("span",{className:"meta-value",children:S.fecha_recepcion})]}),o.jsxs("div",{className:"meta-item",children:[o.jsx("span",{className:"meta-label",children:"FECHA DE VENCIMIENTO (TÉRMINO)"}),o.jsxs("span",{className:"meta-value",style:{color:M!==null&&M<=3?"#DC2626":"inherit",fontWeight:700},children:[S.termino||"Sin fecha de término fija",M!==null&&o.jsxs("span",{style:{fontSize:"12px",marginLeft:"6px",fontWeight:500},children:["(",M<0?`Vencido hace ${Math.abs(M)}d`:`${M} días restantes`,")"]})]})]}),o.jsxs("div",{className:"meta-item",children:[o.jsx("span",{className:"meta-label",children:"REMITENTE / CAPTURA"}),o.jsxs("span",{className:"meta-value",children:[y==null?void 0:y.nombre," (",y==null?void 0:y.cargo,")"]})]})]}),g.length>0&&o.jsxs("div",{className:"sheet-turn-box",children:[o.jsxs("div",{className:"turn-box-header",children:[o.jsx(Ut,{size:15}),o.jsx("span",{children:"ÚLTIMA INSTRUCCIÓN DE TURNO"})]}),o.jsxs("p",{className:"turn-box-text",children:['"',g[g.length-1].instrucciones,'"']})]})]}),a==="timeline"&&o.jsx("div",{className:"timeline-container",children:P.map((T,B)=>{const Z=T.icon;return o.jsxs("div",{className:`timeline-row timeline-${T.color}`,children:[o.jsx("div",{className:"timeline-node",children:o.jsx(Z,{size:16})}),o.jsxs("div",{className:"timeline-card",children:[o.jsxs("div",{className:"timeline-card-header",children:[o.jsx("span",{className:"timeline-card-title",children:T.title}),o.jsx("span",{className:"timeline-card-date",children:T.date})]}),o.jsx("p",{className:"timeline-card-desc",children:T.description}),T.author&&o.jsxs("div",{className:"timeline-card-author",children:["Por: ",o.jsx("strong",{children:T.author})," (",T.cargo,")"]})]})]},B)})}),a==="adjuntos"&&o.jsxs("div",{className:"adjuntos-container",children:[E.length===0?o.jsxs("div",{className:"empty-adjuntos",children:[o.jsx(Cs,{size:32,style:{color:"#CBD5E1",marginBottom:"8px"}}),o.jsx("p",{children:"No se han registrado archivos adjuntos en este oficio."})]}):o.jsx("div",{className:"adjuntos-grid",children:E.map(T=>o.jsxs("div",{className:"adjunto-card",children:[o.jsx("div",{className:"adjunto-icon",children:o.jsx(gt,{size:24,className:"text-guinda"})}),o.jsxs("div",{className:"adjunto-info",children:[o.jsx("div",{className:"adjunto-name",children:T.nombre_archivo}),o.jsxs("div",{className:"adjunto-meta",children:[T.tamano," • Subido el ",T.creado_en]})]}),o.jsxs("div",{className:"adjunto-actions",children:[o.jsx("button",{className:"btn-adjunto-action",onClick:()=>N(T.nombre_archivo),title:"Previsualizar documento",children:o.jsx(rl,{size:16})}),o.jsx("a",{href:"#",onClick:B=>{B.preventDefault(),alert(`Descargando archivo simulado: ${T.nombre_archivo}`)},className:"btn-adjunto-action",title:"Descargar",children:o.jsx(mo,{size:16})})]})]},T.id))}),j&&o.jsxs("div",{className:"pdf-preview-box",children:[o.jsxs("div",{className:"pdf-preview-header",children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[o.jsx(gt,{size:16,className:"text-guinda"}),o.jsx("span",{style:{fontSize:"13px",fontWeight:600},children:j})]}),o.jsx("button",{className:"close-preview-btn",onClick:()=>N(null),children:"Cerrar Visor ×"})]}),o.jsx("div",{className:"pdf-canvas-simulation",children:o.jsxs("div",{className:"simulated-pdf-sheet",children:[o.jsx("div",{className:"pdf-watermark",children:"SECTUR MÉXICO"}),o.jsx("div",{className:"pdf-seal-gold",children:"SELLO DIGITAL AUTORIZADO"}),o.jsx("h3",{children:"SECRETARÍA DE TURISMO • DIRECCIÓN GENERAL"}),o.jsxs("p",{className:"pdf-folio-stamp",children:["Folio Oficial: ",S.folio]}),o.jsx("hr",{style:{margin:"14px 0",borderColor:"#BC955C"}}),o.jsxs("p",{style:{fontWeight:700,marginBottom:"8px"},children:["ASUNTO: ",S.asunto]}),o.jsx("p",{style:{fontSize:"13px",lineHeight:1.6,color:"#334155"},children:"Por medio del presente documento institucional, se hace constar el registro y trámite de la correspondencia oficial para los fines y efectos a los que haya lugar conforme a la normativa vigente."}),o.jsxs("div",{className:"pdf-signature-box",children:[o.jsx("div",{className:"signature-line"}),o.jsx("span",{children:"LIC. CLAUDIA HERNÁNDEZ MORA"}),o.jsx("small",{children:"Oficialía de Partes - SECTUR"})]})]})})]})]})]}),o.jsxs("div",{className:"modal-footer detail-footer",children:[o.jsx("div",{className:"footer-left",children:o.jsxs("span",{className:"user-role-notice",children:["Acciones disponibles para tu rol: ",o.jsx("strong",{children:i==null?void 0:i.nombre})]})}),o.jsxs("div",{className:"footer-actions",children:[w&&o.jsxs("button",{className:"btn btn-primary",onClick:()=>u(!0),children:[o.jsx(Ut,{size:16}),"Turnar Oficio"]}),U&&o.jsxs(o.Fragment,{children:[o.jsxs("button",{className:"btn btn-secondary",onClick:()=>x(!0),children:[o.jsx(il,{size:16}),"Agregar Nota"]}),o.jsxs("button",{className:"btn btn-accent",onClick:()=>f(!0),children:[o.jsx(ho,{size:16}),"Emitir Respuesta"]})]}),o.jsx("button",{className:"btn btn-secondary",onClick:t,children:"Cerrar Ficha"})]})]})]}),c&&o.jsx(Gm,{oficio:S,onClose:()=>u(!1)}),v&&o.jsx(Qm,{oficio:S,onClose:()=>f(!1)}),h&&o.jsx(qm,{oficio:S,onClose:()=>x(!1)}),o.jsx("style",{children:`
        .oficio-detail-modal {
          max-width: 860px;
          border-top: 4px solid var(--color-guinda-dark);
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 28px;
          background-color: #FAFBFD;
        }

        .inst-badge-gold {
          font-size: 10.5px;
          font-weight: 800;
          color: var(--color-dorado-hover);
          letter-spacing: 0.1em;
        }

        .detail-folio {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-guinda-dark);
          margin-top: 2px;
        }

        .detail-header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748B;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
        }

        .close-btn:hover {
          background-color: #F1F5F9;
          color: #1E293B;
        }

        .detail-tabs {
          display: flex;
          border-bottom: 1.5px solid var(--color-border);
          padding: 0 28px;
          background-color: #FFFFFF;
          gap: 8px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-subtle);
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: var(--color-guinda-dark);
        }

        .tab-btn.active {
          color: var(--color-guinda-dark);
          border-bottom-color: var(--color-dorado);
        }

        .detail-body {
          padding: 28px;
          background-color: #F8FAFC;
        }

        .official-sheet {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 28px 32px;
          box-shadow: var(--shadow-sm);
        }

        .sheet-top-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .sheet-gov-text {
          display: flex;
          flex-direction: column;
        }

        .sheet-gov-text strong {
          font-size: 14px;
          letter-spacing: 0.08em;
          color: var(--color-guinda-dark);
        }

        .sheet-gov-text span {
          font-size: 11px;
          color: var(--color-dorado-hover);
          font-weight: 600;
        }

        .sheet-seal-icon {
          font-size: 12px;
          font-weight: 800;
          color: var(--color-dorado);
          border: 1.5px solid var(--color-dorado);
          padding: 4px 10px;
          border-radius: 4px;
        }

        .sheet-divider-gold {
          height: 2px;
          background: linear-gradient(90deg, var(--color-guinda-dark) 0%, var(--color-dorado) 50%, var(--color-guinda-dark) 100%);
          margin-bottom: 20px;
        }

        .sheet-section {
          margin-bottom: 18px;
        }

        .sheet-field-title {
          font-size: 11.5px;
          font-weight: 800;
          color: var(--color-guinda-primary);
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .sheet-asunto-text {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-dark);
          line-height: 1.4;
        }

        .sheet-objeto-text {
          font-size: 14px;
          color: var(--color-text-muted);
          line-height: 1.5;
          background-color: #F8FAFC;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--color-dorado);
        }

        .sheet-grid-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--color-border-light);
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .meta-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-subtle);
          letter-spacing: 0.04em;
        }

        .meta-value {
          font-size: 13.5px;
          color: var(--color-text-dark);
          font-weight: 500;
        }

        .sheet-turn-box {
          margin-top: 20px;
          padding: 14px 18px;
          background: #EEF2FF;
          border-radius: var(--radius-md);
          border: 1px solid #C7D2FE;
        }

        .turn-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #3730A3;
          margin-bottom: 6px;
        }

        .turn-box-text {
          font-size: 13.5px;
          color: #1E1B4B;
          font-style: italic;
        }

        /* Timeline Styles */
        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
          position: relative;
          padding-left: 20px;
        }

        .timeline-container::before {
          content: '';
          position: absolute;
          left: 37px;
          top: 15px;
          bottom: 15px;
          width: 2px;
          background-color: #E2E8F0;
        }

        .timeline-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          position: relative;
        }

        .timeline-node {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          flex-shrink: 0;
        }

        .timeline-gold .timeline-node {
          border-color: var(--color-dorado);
          color: var(--color-dorado-hover);
          background-color: var(--color-dorado-light);
        }

        .timeline-purple .timeline-node {
          border-color: #8B5CF6;
          color: #6D28D9;
          background-color: #EDE9FE;
        }

        .timeline-green .timeline-node {
          border-color: #10B981;
          color: #047857;
          background-color: #D1FAE5;
        }

        .timeline-amber .timeline-node {
          border-color: #F59E0B;
          color: #B45309;
          background-color: #FEF3C7;
        }

        .timeline-gray .timeline-node {
          border-color: #94A3B8;
          color: #64748B;
        }

        .timeline-card {
          flex: 1;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          box-shadow: var(--shadow-sm);
        }

        .timeline-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .timeline-card-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-text-dark);
        }

        .timeline-card-date {
          font-size: 11.5px;
          color: var(--color-text-subtle);
        }

        .timeline-card-desc {
          font-size: 13px;
          color: var(--color-text-muted);
          line-height: 1.4;
        }

        .timeline-card-author {
          margin-top: 8px;
          font-size: 11.5px;
          color: var(--color-guinda-primary);
        }

        /* Adjuntos Styles */
        .adjuntos-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .adjuntos-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .adjunto-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 14px 18px;
        }

        .adjunto-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background-color: var(--color-guinda-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .adjunto-info {
          flex: 1;
        }

        .adjunto-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-dark);
        }

        .adjunto-meta {
          font-size: 12px;
          color: #64748B;
        }

        .adjunto-actions {
          display: flex;
          gap: 8px;
        }

        .btn-adjunto-action {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: #FFFFFF;
          color: var(--color-guinda-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-adjunto-action:hover {
          background-color: var(--color-dorado-light);
          border-color: var(--color-dorado);
        }

        .pdf-preview-box {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .pdf-preview-header {
          padding: 10px 16px;
          background: #F1F5F9;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-preview-btn {
          background: none;
          border: none;
          font-size: 12px;
          color: #DC2626;
          font-weight: 600;
          cursor: pointer;
        }

        .pdf-canvas-simulation {
          background-color: #525659;
          padding: 24px;
          display: flex;
          justify-content: center;
        }

        .simulated-pdf-sheet {
          background: #FFFFFF;
          max-width: 580px;
          width: 100%;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          position: relative;
        }

        .pdf-watermark {
          position: absolute;
          top: 40%;
          left: 20%;
          font-size: 40px;
          font-weight: 900;
          color: rgba(188, 149, 92, 0.08);
          transform: rotate(-30deg);
          pointer-events: none;
        }

        .pdf-seal-gold {
          font-size: 10px;
          font-weight: 800;
          color: #8C682D;
          border: 1px dashed #BC955C;
          display: inline-block;
          padding: 2px 8px;
          margin-bottom: 12px;
        }

        .pdf-folio-stamp {
          font-size: 13px;
          color: var(--color-guinda-primary);
          font-weight: 700;
        }

        .pdf-signature-box {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .signature-line {
          width: 200px;
          height: 1px;
          background-color: #94A3B8;
          margin-bottom: 6px;
        }

        .pdf-signature-box span {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-text-dark);
        }

        .pdf-signature-box small {
          font-size: 11px;
          color: #64748B;
        }

        .detail-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 28px;
        }

        .user-role-notice {
          font-size: 12px;
          color: var(--color-text-subtle);
        }

        .footer-actions {
          display: flex;
          gap: 10px;
        }
      `})]})}function Xm(){const{data:e,activeUser:t,selectedOficioId:n,setSelectedOficioId:r,setActiveView:i,searchQuery:l,setSearchQuery:a}=we(),[s,c]=A.useState("ALL"),[u,v]=A.useState("ALL"),[f,h]=A.useState("ALL"),[x,j]=A.useState("desc"),N=e.oficios.filter(d=>{if(l.trim()){const p=l.toLowerCase(),y=d.folio.toLowerCase().includes(p),E=d.asunto.toLowerCase().includes(p),g=(d.destinatario||"").toLowerCase().includes(p),z=(d.objeto||"").toLowerCase().includes(p);if(!y&&!E&&!g&&!z)return!1}if(s!=="ALL"){if(s==="VENCIDO")return d.estado_id===5||!d.termino?!1:new Date(d.termino)<new Date;if(d.estado_id!==parseInt(s))return!1}return!(u!=="ALL"&&d.departamento_destino_inicial_id!==parseInt(u)||f!=="ALL"&&d.tipo_documento_id!==parseInt(f))}).sort((d,p)=>{const y=new Date(d.creado_en||d.fecha_recepcion),E=new Date(p.creado_en||p.fecha_recepcion);return x==="desc"?E-y:y-E}),S=t.rol_id===1||t.rol_id===4,m=t.rol_id===2;return o.jsxs("div",{className:"oficios-container",children:[o.jsxs("div",{className:"page-header-row",children:[o.jsxs("div",{children:[o.jsx("div",{className:"breadcrumb-tag",children:"GESTIÓN INSTITUCIONAL"}),o.jsx("h1",{className:"page-title",children:"Bandeja General de Oficios"}),o.jsx("p",{className:"page-desc",children:"Consulta, seguimiento y control de expedientes de correspondencia oficial de SECTUR."})]}),o.jsx("div",{className:"page-header-actions",children:(S||m)&&o.jsxs("button",{className:"btn btn-primary",onClick:()=>i("nuevo"),children:[o.jsx(na,{size:18}),"Nuevo Oficio"]})})]}),o.jsxs("div",{className:"card filter-card",children:[o.jsxs("div",{className:"filter-top-row",children:[o.jsxs("div",{className:"status-chips-wrap",children:[o.jsxs("button",{className:`status-chip ${s==="ALL"?"active":""}`,onClick:()=>c("ALL"),children:["Todos (",e.oficios.length,")"]}),e.estados.map(d=>{const p=e.oficios.filter(y=>y.estado_id===d.id).length;return o.jsxs("button",{className:`status-chip chip-${d.color} ${s===String(d.id)?"active":""}`,onClick:()=>c(String(d.id)),children:[d.nombre," (",p,")"]},d.id)}),o.jsxs("button",{className:`status-chip chip-vencido ${s==="VENCIDO"?"active":""}`,onClick:()=>c("VENCIDO"),children:[o.jsx(xo,{size:13}),"Vencidos"]})]}),o.jsx("div",{className:"sort-wrap",children:o.jsxs("button",{className:"btn btn-sm btn-secondary",onClick:()=>j(d=>d==="desc"?"asc":"desc"),children:[o.jsx(km,{size:14}),x==="desc"?"Más recientes primero":"Más antiguos primero"]})})]}),o.jsxs("div",{className:"filter-bottom-row",children:[o.jsxs("div",{className:"filter-select-group",children:[o.jsx("label",{children:"Departamento:"}),o.jsxs("select",{className:"form-select",value:u,onChange:d=>v(d.target.value),children:[o.jsx("option",{value:"ALL",children:"Todos los Departamentos"}),e.departamentos.map(d=>o.jsx("option",{value:d.id,children:d.nombre},d.id))]})]}),o.jsxs("div",{className:"filter-select-group",children:[o.jsx("label",{children:"Tipo Documento:"}),o.jsxs("select",{className:"form-select",value:f,onChange:d=>h(d.target.value),children:[o.jsx("option",{value:"ALL",children:"Todos los Tipos"}),e.tiposDocumento.map(d=>o.jsx("option",{value:d.id,children:d.nombre},d.id))]})]}),o.jsxs("div",{className:"filter-search-group",children:[o.jsx("label",{children:"Búsqueda rápida:"}),o.jsxs("div",{className:"inline-search-box",children:[o.jsx(oa,{size:16,className:"inline-search-icon"}),o.jsx("input",{type:"text",placeholder:"Filtrar por texto...",value:l,onChange:d=>a(d.target.value),className:"form-input",style:{paddingLeft:"34px"}})]})]})]})]}),o.jsx("div",{className:"table-container card",children:o.jsxs("table",{className:"custom-table oficios-table",children:[o.jsx("thead",{children:o.jsxs("tr",{children:[o.jsx("th",{children:"Folio"}),o.jsx("th",{children:"Asunto & Objeto"}),o.jsx("th",{children:"Tipo"}),o.jsx("th",{children:"Área Destino"}),o.jsx("th",{children:"Recepción"}),o.jsx("th",{children:"Término"}),o.jsx("th",{children:"Estado"}),o.jsx("th",{style:{textAlign:"right"},children:"Acciones"})]})}),o.jsx("tbody",{children:N.length===0?o.jsx("tr",{children:o.jsxs("td",{colSpan:"8",style:{textAlign:"center",padding:"48px 24px",color:"#94A3B8"},children:[o.jsx(ra,{size:40,style:{margin:"0 auto 12px",color:"#CBD5E1"}}),o.jsx("div",{style:{fontSize:"15px",fontWeight:600,color:"var(--color-text-dark)"},children:"No se encontraron oficios con los filtros seleccionados"}),o.jsx("div",{style:{fontSize:"13px",marginTop:"4px"},children:"Prueba cambiando los criterios de búsqueda o restablece los filtros."})]})}):N.map(d=>{const p=e.departamentos.find(F=>F.id===d.departamento_destino_inicial_id),y=e.tiposDocumento.find(F=>F.id===d.tipo_documento_id),E=e.estados.find(F=>F.id===d.estado_id);let g=null,z=!1;return d.termino&&d.estado_id!==5&&(g=Math.ceil((new Date(d.termino)-new Date)/(1e3*60*60*24)),g<0&&(z=!0)),o.jsxs("tr",{className:"oficio-row",onClick:()=>r(d.id),children:[o.jsxs("td",{children:[o.jsx("div",{className:"table-folio",children:d.folio}),d.prioridad==="URGENTE"&&o.jsx("span",{className:"priority-tag-urgent",children:"URGENTE"})]}),o.jsxs("td",{style:{maxWidth:"340px"},children:[o.jsx("div",{className:"table-asunto",children:d.asunto}),o.jsxs("div",{className:"table-destinatario",children:["Dest: ",d.destinatario]})]}),o.jsx("td",{children:o.jsx("span",{className:"doc-type-tag",children:y==null?void 0:y.nombre})}),o.jsx("td",{children:o.jsxs("div",{className:"table-depto-name",children:[o.jsx(Et,{size:13,className:"text-gold"}),p==null?void 0:p.nombre]})}),o.jsx("td",{style:{whiteSpace:"nowrap",fontSize:"12.5px",color:"#64748B"},children:d.fecha_recepcion.split(" ")[0]}),o.jsx("td",{children:o.jsxs("div",{className:`table-term ${z?"term-vencido":g!==null&&g<=3?"term-critico":""}`,children:[d.termino||"—",g!==null&&o.jsx("span",{className:"days-left-chip",children:z?`Vencido (${Math.abs(g)}d)`:`${g}d`})]})}),o.jsx("td",{children:o.jsx("span",{className:`badge badge-${d.estado_id===1?"pendiente":d.estado_id===2?"turnado":d.estado_id===3?"proceso":d.estado_id===4?"respondido":"concluido"}`,children:E==null?void 0:E.nombre})}),o.jsx("td",{style:{textAlign:"right"},onClick:F=>F.stopPropagation(),children:o.jsxs("button",{className:"btn btn-sm btn-secondary",onClick:()=>r(d.id),title:"Ver Ficha y Seguimiento",children:[o.jsx(rl,{size:14}),"Ficha"]})})]},d.id)})})]})}),n&&o.jsx(Km,{oficioId:n,onClose:()=>r(null)}),o.jsx("style",{children:`
        .oficios-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .page-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .breadcrumb-tag {
          font-size: 11px;
          font-weight: 800;
          color: var(--color-dorado-hover);
          letter-spacing: 0.1em;
        }

        .page-title {
          font-size: 24px;
          color: var(--color-guinda-dark);
          margin-top: 2px;
        }

        .page-desc {
          font-size: 13.5px;
          color: var(--color-text-muted);
        }

        .filter-card {
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .filter-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .status-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .status-chip {
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid var(--color-border);
          background: #FFFFFF;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text-dark);
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .status-chip:hover {
          border-color: var(--color-dorado);
          background-color: #FAFBFD;
        }

        .status-chip.active {
          background-color: var(--color-guinda-dark);
          color: #FFFFFF;
          border-color: var(--color-guinda-dark);
          box-shadow: 0 2px 6px rgba(105, 28, 50, 0.25);
        }

        .status-chip.chip-vencido.active {
          background-color: #DC2626;
          border-color: #DC2626;
        }

        .filter-bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1.5fr;
          gap: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--color-border-light);
        }

        @media (max-width: 900px) {
          .filter-bottom-row {
            grid-template-columns: 1fr;
          }
        }

        .filter-select-group, .filter-search-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-select-group label, .filter-search-group label {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--color-text-subtle);
        }

        .inline-search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .inline-search-icon {
          position: absolute;
          left: 12px;
          color: #9CA3AF;
        }

        .oficio-row {
          cursor: pointer;
        }

        .table-folio {
          font-weight: 700;
          color: var(--color-guinda-dark);
          font-size: 13.5px;
        }

        .priority-tag-urgent {
          display: inline-block;
          font-size: 9.5px;
          font-weight: 800;
          background-color: #FEE2E2;
          color: #991B1B;
          padding: 1px 5px;
          border-radius: 4px;
          margin-top: 2px;
        }

        .table-asunto {
          font-weight: 600;
          color: var(--color-text-dark);
          font-size: 13.5px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .table-destinatario {
          font-size: 11.5px;
          color: #64748B;
          margin-top: 2px;
        }

        .doc-type-tag {
          font-size: 12px;
          color: #4B5563;
          background-color: #F1F5F9;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .table-depto-name {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text-dark);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .table-term {
          font-size: 12.5px;
          color: var(--color-text-muted);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .term-critico {
          color: #D97706;
          font-weight: 700;
        }

        .term-vencido {
          color: #DC2626;
          font-weight: 700;
        }

        .days-left-chip {
          font-size: 11px;
          color: inherit;
        }
      `})]})}function Ym({files:e,setFiles:t}){const[n,r]=A.useState(!1),i=v=>{v.preventDefault(),r(!0)},l=()=>{r(!1)},a=v=>{v.preventDefault(),r(!1);const f=Array.from(v.dataTransfer.files);c(f)},s=v=>{const f=Array.from(v.target.files);c(f)},c=v=>{const f=v.map(h=>({id:Date.now()+Math.random(),name:h.name,size:`${(h.size/1048576).toFixed(1)} MB`,type:h.type||"application/pdf",raw:h}));t(h=>[...h,...f])},u=v=>{t(f=>f.filter(h=>h.id!==v))};return o.jsxs("div",{className:"dropzone-wrapper",children:[o.jsxs("div",{className:`dropzone-box ${n?"dragging":""}`,onDragOver:i,onDragLeave:l,onDrop:a,children:[o.jsx("div",{className:"dropzone-icon-circle",children:o.jsx(zm,{size:28,className:"text-gold"})}),o.jsx("h4",{className:"dropzone-title",children:"Arrastra y suelta tus archivos aquí"}),o.jsx("p",{className:"dropzone-subtitle",children:"Soporta documentos PDF, DOCX o imágenes escaneadas de hasta 25 MB"}),o.jsxs("label",{className:"btn btn-secondary btn-sm dropzone-btn",children:[o.jsx("span",{children:"Seleccionar desde el equipo"}),o.jsx("input",{type:"file",multiple:!0,accept:".pdf,.doc,.docx,.jpg,.jpeg,.png",onChange:s,style:{display:"none"}})]})]}),e.length>0&&o.jsxs("div",{className:"uploaded-files-list",children:[o.jsxs("div",{className:"files-list-header",children:["Archivos listos para adjuntar (",e.length,"):"]}),e.map(v=>o.jsxs("div",{className:"file-chip-item",children:[o.jsx(gt,{size:18,className:"text-guinda"}),o.jsxs("div",{className:"file-chip-info",children:[o.jsx("span",{className:"file-chip-name",children:v.name}),o.jsx("span",{className:"file-chip-size",children:v.size})]}),o.jsx("button",{type:"button",className:"file-chip-remove",onClick:()=>u(v.id),title:"Quitar archivo",children:o.jsx(ot,{size:16})})]},v.id))]}),o.jsx("style",{children:`
        .dropzone-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dropzone-box {
          border: 2px dashed var(--color-dorado);
          border-radius: var(--radius-md);
          background-color: #FAFBFD;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.2s ease;
        }

        .dropzone-box.dragging {
          background-color: var(--color-dorado-light);
          border-color: var(--color-dorado-hover);
          transform: scale(1.01);
        }

        .dropzone-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: var(--color-dorado-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .dropzone-title {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--color-text-dark);
          margin-bottom: 4px;
        }

        .dropzone-subtitle {
          font-size: 12.5px;
          color: var(--color-text-subtle);
          margin-bottom: 14px;
        }

        .dropzone-btn {
          cursor: pointer;
        }

        .uploaded-files-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .files-list-header {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--color-guinda-dark);
        }

        .file-chip-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }

        .file-chip-info {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }

        .file-chip-name {
          font-weight: 600;
          color: var(--color-text-dark);
          max-width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-chip-size {
          font-size: 11.5px;
          color: #64748B;
        }

        .file-chip-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: #94A3B8;
          display: flex;
          align-items: center;
          padding: 2px;
        }

        .file-chip-remove:hover {
          color: #DC2626;
        }
      `})]})}function Zm(){var d;const{data:e,activeUser:t,crearOficio:n,setActiveView:r,setSelectedOficioId:i}=we(),a=`SECTUR/DGT/2026/${(e.oficios.length+1).toString().padStart(4,"0")}`,s=new Date().toISOString().split("T")[0],c=new Date(Date.now()+14*24*60*60*1e3).toISOString().split("T")[0],[u,v]=A.useState({folio:a,tipo_documento_id:"1",asunto:"",objeto:"",destinatario:"",fecha_documento:s,fecha_recepcion:`${s} 09:00:00`,termino:c,departamento_destino_inicial_id:((d=e.departamentos[1])==null?void 0:d.id)||"1",prioridad:"NORMAL"}),[f,h]=A.useState([{id:1,name:`Oficio_${a.replaceAll("/","_")}_Original.pdf`,size:"1.8 MB",type:"application/pdf"}]),[x,j]=A.useState({}),N=p=>{const{name:y,value:E}=p.target;v(g=>({...g,[y]:E})),x[y]&&j(g=>({...g,[y]:null}))},S=()=>{const p={};return u.asunto.trim()||(p.asunto="El asunto es obligatorio."),u.destinatario.trim()||(p.destinatario="Indica el destinatario o dependencia externa."),u.termino||(p.termino="La fecha de término o vencimiento es obligatoria."),j(p),Object.keys(p).length===0},m=p=>{if(p.preventDefault(),!S())return;const y=n(u,f);i(y.id),r("oficios")};return o.jsxs("div",{className:"nuevo-oficio-container",children:[o.jsx("div",{className:"form-header-bar",children:o.jsxs("div",{children:[o.jsxs("button",{className:"btn btn-sm btn-secondary",onClick:()=>r("oficios"),style:{marginBottom:"8px"},children:[o.jsx(wm,{size:14})," Volver a la Bandeja"]}),o.jsx("div",{className:"inst-badge-gold",children:"OFICIALÍA DE PARTES • REGISTRO DE ENTRADA"}),o.jsx("h1",{className:"form-title",children:"Generar y Radicar Nuevo Oficio"}),o.jsx("p",{className:"form-subtitle",children:"Ingreso de correspondencia oficial al sistema para asignación y seguimiento de términos."})]})}),o.jsx("form",{onSubmit:m,className:"oficio-form",children:o.jsxs("div",{className:"form-layout-grid",children:[o.jsxs("div",{className:"card form-main-card",children:[o.jsxs("div",{className:"card-section-title",children:[o.jsx(ho,{size:18,className:"text-gold"}),o.jsx("span",{children:"Datos Generales del Oficio"})]}),o.jsxs("div",{className:"form-row-two",children:[o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Folio Institucional Asignado ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("input",{type:"text",name:"folio",className:"form-input font-bold text-guinda",value:u.folio,onChange:N,required:!0}),o.jsx("span",{className:"form-helper",children:"Folio oficial consecutivo de control interno."})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Tipo de Documento ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("select",{name:"tipo_documento_id",className:"form-select",value:u.tipo_documento_id,onChange:N,children:e.tiposDocumento.map(p=>o.jsx("option",{value:p.id,children:p.nombre},p.id))})]})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Asunto / Título del Oficio ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("input",{type:"text",name:"asunto",className:`form-input ${x.asunto?"input-error":""}`,value:u.asunto,onChange:N,placeholder:"Ej. Solicitud de Stand y Logística para Tianguis Turístico 2026"}),x.asunto&&o.jsx("span",{className:"error-text",children:x.asunto})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Objeto / Descripción Detallada"}),o.jsx("textarea",{name:"objeto",rows:4,className:"form-textarea",value:u.objeto,onChange:N,placeholder:"Describa los antecedentes, alcances específicos o solicitudes puntuales que contiene el oficio..."})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Destinatario Externo / Membrete ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("input",{type:"text",name:"destinatario",className:`form-input ${x.destinatario?"input-error":""}`,value:u.destinatario,onChange:N,placeholder:"Ej. H. Ayuntamiento de Cuetzalan / C. Gobernador del Estado"}),x.destinatario&&o.jsx("span",{className:"error-text",children:x.destinatario})]}),o.jsxs("div",{className:"form-group",style:{marginTop:"20px"},children:[o.jsx("label",{className:"form-label",children:"Documento Escaneado y Anexos (PDF)"}),o.jsx(Ym,{files:f,setFiles:h})]})]}),o.jsxs("div",{className:"form-sidebar-column",children:[o.jsxs("div",{className:"card form-side-card",children:[o.jsxs("div",{className:"card-section-title",children:[o.jsx(Et,{size:17,className:"text-gold"}),o.jsx("span",{children:"Enrutamiento y Destino"})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Departamento Destino Inicial ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("select",{name:"departamento_destino_inicial_id",className:"form-select",value:u.departamento_destino_inicial_id,onChange:N,children:e.departamentos.map(p=>o.jsx("option",{value:p.id,children:p.nombre},p.id))}),o.jsx("span",{className:"form-helper",children:"Define qué área recibirá y dará curso al documento."})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Prioridad del Trámite"}),o.jsxs("select",{name:"prioridad",className:"form-select",value:u.prioridad,onChange:N,children:[o.jsx("option",{value:"NORMAL",children:"Normal"}),o.jsx("option",{value:"MEDIA",children:"Media"}),o.jsx("option",{value:"ALTA",children:"Alta"}),o.jsx("option",{value:"URGENTE",children:"Urgente"})]})]})]}),o.jsxs("div",{className:"card form-side-card",children:[o.jsxs("div",{className:"card-section-title",children:[o.jsx(ea,{size:17,className:"text-gold"}),o.jsx("span",{children:"Fechas y Término"})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Fecha del Documento"}),o.jsx("input",{type:"date",name:"fecha_documento",className:"form-input",value:u.fecha_documento,onChange:N})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Fecha Límite de Término ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("input",{type:"date",name:"termino",className:`form-input ${x.termino?"input-error":""}`,value:u.termino,onChange:N}),x.termino&&o.jsx("span",{className:"error-text",children:x.termino}),o.jsx("span",{className:"form-helper",children:"Fecha perentoria para respuesta o resolución."})]})]}),o.jsxs("div",{className:"card form-side-card",style:{background:"#FAF6F0",borderColor:"var(--color-dorado)"},children:[o.jsx("div",{style:{fontSize:"13px",color:"var(--color-guinda-dark)",marginBottom:"14px",lineHeight:1.4},children:"Al guardar, se registrará el ingreso en Oficialía de Partes y quedará disponible para revisión y turno de la Directora General."}),o.jsxs("button",{type:"submit",className:"btn btn-primary btn-lg",style:{width:"100%"},children:[o.jsx(Om,{size:18}),"Guardar y Radicar Oficio"]})]})]})]})}),o.jsx("style",{children:`
        .nuevo-oficio-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .form-title {
          font-size: 24px;
          color: var(--color-guinda-dark);
        }

        .form-subtitle {
          font-size: 13.5px;
          color: var(--color-text-muted);
        }

        .form-layout-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .form-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-main-card, .form-side-card {
          padding: 24px;
        }

        .form-sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          color: var(--color-guinda-dark);
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1.5px solid var(--color-border-light);
        }

        .form-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-error {
          border-color: #DC2626 !important;
          background-color: #FEF2F2 !important;
        }

        .error-text {
          font-size: 11.5px;
          color: #DC2626;
          font-weight: 600;
        }
      `})]})}function Jm(){const{data:e,agregarDepartamento:t,activeUser:n}=we(),[r,i]=A.useState(!1),[l,a]=A.useState({nombre:"",tipo:"OPERATIVO",clave:""}),s=c=>{c.preventDefault(),l.nombre.trim()&&(t(l),a({nombre:"",tipo:"OPERATIVO",clave:""}),i(!1))};return o.jsxs("div",{className:"admin-container",children:[o.jsxs("div",{className:"page-header-row",children:[o.jsxs("div",{children:[o.jsx("div",{className:"breadcrumb-tag",children:"CATÁLOGOS INSTITUCIONALES"}),o.jsx("h1",{className:"page-title",children:"Directorio de Departamentos"}),o.jsx("p",{className:"page-desc",children:"Estructura orgánica de la Secretaría de Turismo para asignación y despacho de correspondencia."})]}),o.jsxs("button",{className:"btn btn-primary",onClick:()=>i(!0),children:[o.jsx(Rm,{size:16}),"Nuevo Departamento"]})]}),o.jsx("div",{className:"table-container card",children:o.jsxs("table",{className:"custom-table",children:[o.jsx("thead",{children:o.jsxs("tr",{children:[o.jsx("th",{children:"ID"}),o.jsx("th",{children:"Nombre del Área / Departamento"}),o.jsx("th",{children:"Tipo de Unidad"}),o.jsx("th",{children:"Clave"}),o.jsx("th",{children:"Oficios Asignados"})]})}),o.jsx("tbody",{children:e.departamentos.map(c=>{const u=e.oficios.filter(v=>v.departamento_destino_inicial_id===c.id).length;return o.jsxs("tr",{children:[o.jsxs("td",{style:{fontWeight:700,color:"var(--color-guinda-dark)"},children:["#",c.id]}),o.jsx("td",{children:o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontWeight:600},children:[o.jsx(Et,{size:16,className:"text-gold"}),c.nombre]})}),o.jsx("td",{children:o.jsx("span",{className:"badge badge-dorado font-bold",children:c.tipo})}),o.jsx("td",{children:o.jsx("code",{style:{background:"#F1F5F9",padding:"2px 6px",borderRadius:"4px",fontSize:"12px"},children:c.clave||`DEP-${c.id}`})}),o.jsxs("td",{children:[o.jsx("strong",{children:u})," en expediente"]})]},c.id)})})]})}),r&&o.jsx("div",{className:"modal-overlay",onClick:()=>i(!1),children:o.jsxs("div",{className:"modal-content",onClick:c=>c.stopPropagation(),style:{maxWidth:"500px"},children:[o.jsx("div",{className:"modal-header",children:o.jsx("h3",{style:{fontSize:"16px",color:"var(--color-guinda-dark)"},children:"Registrar Nuevo Departamento"})}),o.jsxs("form",{onSubmit:s,children:[o.jsxs("div",{className:"modal-body",children:[o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Nombre del Departamento ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("input",{type:"text",className:"form-input",value:l.nombre,onChange:c=>a(u=>({...u,nombre:c.target.value})),placeholder:"Ej. Dirección de Fomento Gastronómico",required:!0})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Tipo de Unidad"}),o.jsxs("select",{className:"form-select",value:l.tipo,onChange:c=>a(u=>({...u,tipo:c.target.value})),children:[o.jsx("option",{value:"DIRECCION_GENERAL",children:"Dirección General"}),o.jsx("option",{value:"OPERATIVO",children:"Área Operativa"}),o.jsx("option",{value:"ADMINISTRATIVO",children:"Área Administrativa"}),o.jsx("option",{value:"PROMOCION",children:"Promoción y Difusión"}),o.jsx("option",{value:"JURIDICO",children:"Asuntos Jurídicos"}),o.jsx("option",{value:"PROGRAMAS",children:"Programas Especiales"})]})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Clave Institucional"}),o.jsx("input",{type:"text",className:"form-input",value:l.clave,onChange:c=>a(u=>({...u,clave:c.target.value})),placeholder:"Ej. DFG"})]})]}),o.jsxs("div",{className:"modal-footer",children:[o.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>i(!1),children:"Cancelar"}),o.jsx("button",{type:"submit",className:"btn btn-primary",children:"Guardar Departamento"})]})]})]})}),o.jsx("style",{children:`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `})]})}function eh(){const{data:e,activeUserId:t,setActiveUserId:n,activeUser:r,crearUsuario:i,actualizarUsuario:l,toggleActivarUsuario:a,restablecerPassword:s,addToast:c}=we(),[u,v]=A.useState(""),[f,h]=A.useState(!1),[x,j]=A.useState(null),[N,S]=A.useState(null),[m,d]=A.useState(""),[p,y]=A.useState({nombre:"",email:"",cargo:"",rol_id:"3",departamento_id:"1",password:""}),E=e.usuarios.filter(w=>{if(!u.trim())return!0;const U=u.toLowerCase(),T=w.nombre.toLowerCase().includes(U),B=w.email.toLowerCase().includes(U),Z=(w.cargo||"").toLowerCase().includes(U);return T||B||Z}),g=w=>{w.preventDefault(),!(!p.nombre.trim()||!p.email.trim())&&(i({...p,password:p.password||"Sectur2026!"}),y({nombre:"",email:"",cargo:"",rol_id:"3",departamento_id:"1",password:""}),h(!1))},z=w=>{w.preventDefault(),x&&(l(x.id,{nombre:x.nombre,email:x.email,cargo:x.cargo,rol_id:x.rol_id,departamento_id:x.departamento_id}),j(null))},F=()=>{const w="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";let U="SECTUR-";for(let T=0;T<6;T++)U+=w.charAt(Math.floor(Math.random()*w.length));d(U)},P=w=>{w.preventDefault(),!(!N||!m.trim())&&(s(N.id,m),S(null),d(""))},M=w=>{navigator.clipboard.writeText(w),c("Copiado","Contraseña copiada al portapapeles","info")};return o.jsxs("div",{className:"admin-container",children:[o.jsxs("div",{className:"page-header-row",children:[o.jsxs("div",{children:[o.jsx("div",{className:"breadcrumb-tag",children:"MÓDULO DE ADMINISTRACIÓN EXCLUSIVO"}),o.jsx("h1",{className:"page-title",children:"Gestión de Usuarios y Accesos"}),o.jsx("p",{className:"page-desc",children:"Alta de personal, asignación de roles institucionales, adscripción departamental y políticas de acceso."})]}),o.jsxs("button",{className:"btn btn-primary",onClick:()=>h(!0),children:[o.jsx(Es,{size:16}),"Dar de Alta Usuario"]})]}),o.jsxs("div",{className:"card",style:{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"16px",flexWrap:"wrap"},children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[o.jsxs("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--color-text-dark)"},children:["Total Personal: ",o.jsx("strong",{children:e.usuarios.length})]}),o.jsxs("span",{className:"badge badge-concluido",children:[e.usuarios.filter(w=>w.activo).length," Activos"]}),o.jsxs("span",{className:"badge badge-vencido",children:[e.usuarios.filter(w=>!w.activo).length," Inactivos"]})]}),o.jsx("div",{style:{minWidth:"280px"},children:o.jsxs("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[o.jsx(oa,{size:15,style:{position:"absolute",left:"12px",color:"#9CA3AF"}}),o.jsx("input",{type:"text",className:"form-input",style:{paddingLeft:"34px"},placeholder:"Buscar por nombre, cargo o email...",value:u,onChange:w=>v(w.target.value)})]})})]}),o.jsx("div",{className:"table-container card",children:o.jsxs("table",{className:"custom-table",children:[o.jsx("thead",{children:o.jsxs("tr",{children:[o.jsx("th",{children:"Usuario & Contacto"}),o.jsx("th",{children:"Cargo Institucional"}),o.jsx("th",{children:"Rol de Sistema"}),o.jsx("th",{children:"Departamento Asignado"}),o.jsx("th",{children:"Estado"}),o.jsx("th",{style:{textAlign:"right"},children:"Acciones Administrativas"})]})}),o.jsx("tbody",{children:E.map(w=>{const U=e.roles.find(Z=>Z.id===w.rol_id),T=e.departamentos.find(Z=>Z.id===w.departamento_id),B=w.id===t;return o.jsxs("tr",{style:{opacity:w.activo?1:.65,backgroundColor:B?"#FAF5EE":"inherit"},children:[o.jsx("td",{children:o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[o.jsx("div",{style:{width:"38px",height:"38px",borderRadius:"50%",backgroundColor:w.activo?"var(--color-guinda-dark)":"#94A3B8",color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"13px",flexShrink:0},children:w.avatar}),o.jsxs("div",{children:[o.jsxs("div",{style:{fontWeight:700,color:"var(--color-text-dark)",fontSize:"13.5px"},children:[w.nombre,B&&o.jsx("span",{style:{marginLeft:"6px",fontSize:"11px",color:"var(--color-guinda-primary)",fontWeight:600},children:"(Tu Sesión)"})]}),o.jsxs("div",{style:{fontSize:"12px",color:"#64748B",display:"flex",alignItems:"center",gap:"4px",marginTop:"1px"},children:[o.jsx(Im,{size:12})," ",w.email]})]})]})}),o.jsx("td",{style:{fontSize:"13px",color:"var(--color-text-muted)"},children:w.cargo}),o.jsx("td",{children:o.jsxs("span",{className:"badge badge-dorado",style:{fontWeight:700},children:[o.jsx(Mm,{size:12}),U==null?void 0:U.nombre]})}),o.jsx("td",{children:o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"13px",fontWeight:500},children:[o.jsx(Et,{size:14,className:"text-gold"}),T==null?void 0:T.nombre]})}),o.jsx("td",{children:o.jsx("span",{className:`badge ${w.activo?"badge-concluido":"badge-vencido"}`,children:w.activo?"Activo":"Inactivo"})}),o.jsx("td",{style:{textAlign:"right"},children:o.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:"6px"},children:[o.jsxs("button",{className:"btn btn-sm btn-secondary",onClick:()=>j({...w}),title:"Editar rol y departamento",children:[o.jsx(Lm,{size:13}),"Editar"]}),o.jsxs("button",{className:"btn btn-sm btn-secondary",onClick:()=>{S(w),F()},title:"Restablecer contraseña",children:[o.jsx(bs,{size:13}),"Clave"]}),o.jsxs("button",{className:`btn btn-sm ${w.activo?"btn-secondary":"btn-accent"}`,onClick:()=>a(w.id),title:w.activo?"Desactivar cuenta":"Reactivar cuenta",style:{color:w.activo?"#DC2626":"#FFFFFF"},children:[w.activo?o.jsx($m,{size:13}):o.jsx(Du,{size:13}),w.activo?"Desactivar":"Activar"]}),!B&&o.jsx("button",{className:"btn btn-sm btn-outline-gold",onClick:()=>n(w.id),title:"Simular inicio de sesión como este usuario",children:"Simular"})]})})]},w.id)})})]})}),f&&o.jsx("div",{className:"modal-overlay",onClick:()=>h(!1),children:o.jsxs("div",{className:"modal-content",onClick:w=>w.stopPropagation(),style:{maxWidth:"580px"},children:[o.jsxs("div",{className:"modal-header",children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[o.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"8px",background:"var(--color-guinda-light)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-guinda-primary)"},children:o.jsx(Es,{size:18})}),o.jsxs("div",{children:[o.jsx("h3",{style:{fontSize:"16px",color:"var(--color-guinda-dark)"},children:"Dar de Alta Nuevo Funcionario"}),o.jsx("p",{style:{fontSize:"12px",color:"var(--color-text-subtle)"},children:"Módulo de Administración de Accesos SECTUR"})]})]}),o.jsx("button",{onClick:()=>h(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748B"},children:o.jsx(ot,{size:20})})]}),o.jsxs("form",{onSubmit:g,children:[o.jsxs("div",{className:"modal-body",children:[o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Nombre Completo del Servidor Público ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("input",{type:"text",className:"form-input",value:p.nombre,onChange:w=>y(U=>({...U,nombre:w.target.value})),placeholder:"Ej. Lic. Fernando Gómez Álvarez",required:!0})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Correo Electrónico Institucional ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("input",{type:"email",className:"form-input",value:p.email,onChange:w=>y(U=>({...U,email:w.target.value})),placeholder:"ejemplo@turismo.gob.mx",required:!0})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Cargo / Puesto Nominal"}),o.jsx("input",{type:"text",className:"form-input",value:p.cargo,onChange:w=>y(U=>({...U,cargo:w.target.value})),placeholder:"Ej. Jefe de Departamento de Difusión"})]}),o.jsxs("div",{className:"form-row-two",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"},children:[o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Rol en el Sistema ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("select",{className:"form-select",value:p.rol_id,onChange:w=>y(U=>({...U,rol_id:w.target.value})),children:e.roles.map(w=>o.jsx("option",{value:w.id,children:w.nombre},w.id))})]}),o.jsxs("div",{className:"form-group",children:[o.jsxs("label",{className:"form-label",children:["Departamento Adscrito ",o.jsx("span",{className:"required",children:"*"})]}),o.jsx("select",{className:"form-select",value:p.departamento_id,onChange:w=>y(U=>({...U,departamento_id:w.target.value})),children:e.departamentos.map(w=>o.jsx("option",{value:w.id,children:w.nombre},w.id))})]})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Contraseña Inicial Temporal"}),o.jsx("input",{type:"text",className:"form-input",value:p.password,onChange:w=>y(U=>({...U,password:w.target.value})),placeholder:"Por defecto: Sectur2026!"}),o.jsx("span",{className:"form-helper",children:"El usuario podrá cambiarla en su primer inicio de sesión."})]})]}),o.jsxs("div",{className:"modal-footer",children:[o.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>h(!1),children:"Cancelar"}),o.jsxs("button",{type:"submit",className:"btn btn-primary",children:[o.jsx(_m,{size:16}),"Crear Usuario"]})]})]})]})}),x&&o.jsx("div",{className:"modal-overlay",onClick:()=>j(null),children:o.jsxs("div",{className:"modal-content",onClick:w=>w.stopPropagation(),style:{maxWidth:"560px"},children:[o.jsxs("div",{className:"modal-header",children:[o.jsxs("h3",{style:{fontSize:"16px",color:"var(--color-guinda-dark)"},children:["Editar Usuario: ",x.nombre]}),o.jsx("button",{onClick:()=>j(null),style:{background:"none",border:"none",cursor:"pointer",color:"#64748B"},children:o.jsx(ot,{size:20})})]}),o.jsxs("form",{onSubmit:z,children:[o.jsxs("div",{className:"modal-body",children:[o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Nombre Completo"}),o.jsx("input",{type:"text",className:"form-input",value:x.nombre,onChange:w=>j(U=>({...U,nombre:w.target.value})),required:!0})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Correo Institucional"}),o.jsx("input",{type:"email",className:"form-input",value:x.email,onChange:w=>j(U=>({...U,email:w.target.value})),required:!0})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Cargo"}),o.jsx("input",{type:"text",className:"form-input",value:x.cargo,onChange:w=>j(U=>({...U,cargo:w.target.value}))})]}),o.jsxs("div",{className:"form-row-two",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"},children:[o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Rol en el Sistema"}),o.jsx("select",{className:"form-select",value:x.rol_id,onChange:w=>j(U=>({...U,rol_id:w.target.value})),children:e.roles.map(w=>o.jsx("option",{value:w.id,children:w.nombre},w.id))})]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Departamento"}),o.jsx("select",{className:"form-select",value:x.departamento_id,onChange:w=>j(U=>({...U,departamento_id:w.target.value})),children:e.departamentos.map(w=>o.jsx("option",{value:w.id,children:w.nombre},w.id))})]})]})]}),o.jsxs("div",{className:"modal-footer",children:[o.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>j(null),children:"Cancelar"}),o.jsx("button",{type:"submit",className:"btn btn-primary",children:"Guardar Cambios"})]})]})]})}),N&&o.jsx("div",{className:"modal-overlay",onClick:()=>S(null),children:o.jsxs("div",{className:"modal-content",onClick:w=>w.stopPropagation(),style:{maxWidth:"500px"},children:[o.jsxs("div",{className:"modal-header",children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[o.jsx(bs,{size:20,className:"text-gold"}),o.jsx("h3",{style:{fontSize:"16px",color:"var(--color-guinda-dark)"},children:"Restablecer Contraseña"})]}),o.jsx("button",{onClick:()=>S(null),style:{background:"none",border:"none",cursor:"pointer",color:"#64748B"},children:o.jsx(ot,{size:20})})]}),o.jsxs("form",{onSubmit:P,children:[o.jsxs("div",{className:"modal-body",children:[o.jsxs("p",{style:{fontSize:"13.5px",color:"var(--color-text-muted)",marginBottom:"16px"},children:["Genera una nueva contraseña temporal para ",o.jsx("strong",{children:N.nombre})," (",N.email,")."]}),o.jsxs("div",{className:"form-group",children:[o.jsx("label",{className:"form-label",children:"Nueva Contraseña Temporal"}),o.jsxs("div",{style:{display:"flex",gap:"8px"},children:[o.jsx("input",{type:"text",className:"form-input font-bold",value:m,onChange:w=>d(w.target.value),required:!0}),o.jsx("button",{type:"button",className:"btn btn-secondary",onClick:F,title:"Generar contraseña aleatoria segura",children:"Generar"}),o.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>M(m),title:"Copiar al portapapeles",children:o.jsx(Fm,{size:15})})]}),o.jsx("span",{className:"form-helper",children:"Esta acción quedará registrada en la bitácora de auditoría."})]})]}),o.jsxs("div",{className:"modal-footer",children:[o.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>S(null),children:"Cancelar"}),o.jsx("button",{type:"submit",className:"btn btn-primary",children:"Aplicar Nueva Contraseña"})]})]})]})}),o.jsx("style",{children:`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `})]})}function th(){const{data:e}=we(),[t,n]=A.useState("ALL"),[r,i]=A.useState(""),l=e.auditoria.filter(s=>{if(t!=="ALL"&&s.accion!==t)return!1;if(r.trim()){const c=r.toLowerCase(),u=s.detalle.toLowerCase().includes(c),v=s.accion.toLowerCase().includes(c),f=e.usuarios.find(x=>x.id===s.usuario_id),h=f?f.nombre.toLowerCase().includes(c):!1;if(!u&&!v&&!h)return!1}return!0}),a=Array.from(new Set(e.auditoria.map(s=>s.accion)));return o.jsxs("div",{className:"admin-container",children:[o.jsx("div",{className:"page-header-row",children:o.jsxs("div",{children:[o.jsx("div",{className:"breadcrumb-tag",children:"TRAZABILIDAD Y FISCALIZACIÓN"}),o.jsx("h1",{className:"page-title",children:"Bitácora de Auditoría del Sistema"}),o.jsx("p",{className:"page-desc",children:"Registro inmutable de todas las acciones, turnos y respuestas conforme a la tabla `auditoria` de `schema.db`."})]})}),o.jsxs("div",{className:"card",style:{padding:"16px 20px",display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap"},children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[o.jsx("label",{style:{fontSize:"12px",fontWeight:700,color:"var(--color-text-subtle)"},children:"Filtrar Acción:"}),o.jsxs("select",{className:"form-select",style:{width:"220px"},value:t,onChange:s=>n(s.target.value),children:[o.jsxs("option",{value:"ALL",children:["Todas las Acciones (",e.auditoria.length,")"]}),a.map(s=>o.jsx("option",{value:s,children:s},s))]})]}),o.jsx("div",{style:{flex:1,minWidth:"240px"},children:o.jsx("input",{type:"text",className:"form-input",placeholder:"Buscar por usuario o detalle...",value:r,onChange:s=>i(s.target.value)})})]}),o.jsx("div",{className:"table-container card",children:o.jsxs("table",{className:"custom-table",children:[o.jsx("thead",{children:o.jsxs("tr",{children:[o.jsx("th",{children:"ID"}),o.jsx("th",{children:"Fecha y Hora"}),o.jsx("th",{children:"Usuario Responsable"}),o.jsx("th",{children:"Acción"}),o.jsx("th",{children:"Entidad / Tabla"}),o.jsx("th",{children:"Detalle del Registro"})]})}),o.jsx("tbody",{children:l.map(s=>{const c=e.usuarios.find(u=>u.id===s.usuario_id);return o.jsxs("tr",{children:[o.jsxs("td",{style:{fontWeight:700,color:"#94A3B8"},children:["#",s.id]}),o.jsx("td",{style:{whiteSpace:"nowrap",fontSize:"12.5px",color:"#64748B"},children:o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[o.jsx(sr,{size:12}),s.creado_en]})}),o.jsxs("td",{children:[o.jsx("div",{style:{fontWeight:600,color:"var(--color-text-dark)",fontSize:"13px"},children:(c==null?void 0:c.nombre)||"Sistema Automatizado"}),o.jsx("div",{style:{fontSize:"11px",color:"#64748B"},children:c==null?void 0:c.cargo})]}),o.jsx("td",{children:o.jsx("span",{className:"badge badge-dorado font-bold",children:s.accion})}),o.jsx("td",{children:o.jsxs("code",{style:{background:"#F1F5F9",padding:"2px 6px",borderRadius:"4px",fontSize:"11.5px",color:"var(--color-guinda-dark)"},children:[s.entidad," (ID: ",s.entidad_id,")"]})}),o.jsx("td",{style:{fontSize:"13px",color:"var(--color-text-dark)"},children:s.detalle})]},s.id)})})]})}),o.jsx("style",{children:`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `})]})}function nh(){const{data:e,descargarCSV:t,setSelectedOficioId:n,setActiveView:r,addToast:i}=we(),[l,a]=A.useState("2026-09"),[s,c]=A.useState("ALL"),[u,v]=A.useState(!1),h=e.oficios.filter(g=>!(l!=="ALL"&&!(g.fecha_recepcion||g.creado_en||"").startsWith(l)||s!=="ALL"&&g.departamento_destino_inicial_id!==parseInt(s))).map(g=>{const z=e.departamentos.find(Q=>Q.id===g.departamento_destino_inicial_id),F=e.tiposDocumento.find(Q=>Q.id===g.tipo_documento_id),P=e.estados.find(Q=>Q.id===g.estado_id),M=e.usuarios.find(Q=>Q.id===g.remitente_usuario_id),w=e.seguimientos.find(Q=>Q.oficio_id===g.id&&Q.tipo==="RESPUESTA_FORMAL"),U=w?w.creado_en:g.estado_id===5?g.creado_en:null;let T=null,B="EN_PROCESO";const Z=new Date(g.fecha_recepcion||g.creado_en);if(U){const Q=new Date(U),b=Q-Z;if(T=Math.max(1,Math.round(b/(1e3*60*60*24))),g.termino){const k=new Date(g.termino);B=Q<=k?"EN_TIEMPO":"EXTEMPORANEO"}else B="ATENDIDO"}else g.termino&&new Date(g.termino)<new Date?B="VENCIDO_PENDIENTE":B="EN_PLAZO";return{...g,deptoNombre:z?z.nombre:"Sin Asignar",tipoNombre:F?F.nombre:"Oficio",estadoNombre:P?P.nombre:"Pendiente",remitenteNombre:M?M.nombre:"Oficialía de Partes",fechaRespuesta:U?U.split(" ")[0]:"Pendiente",tiempoRespuestaDias:T,cumplimiento:B}}),x=h.length,j=h.filter(g=>g.estado_id===4||g.estado_id===5).length,N=h.filter(g=>g.cumplimiento==="VENCIDO_PENDIENTE"||g.cumplimiento==="EXTEMPORANEO").length,S=h.map(g=>g.tiempoRespuestaDias).filter(g=>g!==null),m=S.length>0?(S.reduce((g,z)=>g+z,0)/S.length).toFixed(1):"—",d=x>0?Math.round(j/x*100):0,p=()=>{const g=["Folio","Tipo Documento","Asunto","Destinatario","Departamento Asignado","Fecha Recepción","Fecha Término","Fecha Respuesta","Tiempo de Respuesta (Días)","Estado Cumplimiento","Estatus Actual","Remitente Captura"],z=h.map(P=>[P.folio,P.tipoNombre,P.asunto,P.destinatario,P.deptoNombre,P.fecha_recepcion,P.termino||"Sin término",P.fechaRespuesta,P.tiempoRespuestaDias!==null?`${P.tiempoRespuestaDias} días`:"En trámite",P.cumplimiento,P.estadoNombre,P.remitenteNombre]),F=`Reporte_Correspondencia_SECTUR_${l}_${Date.now()}.csv`;t(F,g,z)},y=()=>{const g=["ID","Fecha y Hora","Usuario","Acción","Entidad","Detalle"],z=e.auditoria.map(P=>{const M=e.usuarios.find(w=>w.id===P.usuario_id);return[P.id,P.creado_en,M?M.nombre:"Sistema",P.accion,`${P.entidad} (ID ${P.entidad_id})`,P.detalle]}),F=`Bitacora_Auditoria_SECTUR_${Date.now()}.csv`;t(F,g,z)},E=()=>{i("Descarga Iniciada",`Se empaquetaron ${e.adjuntos.length} documentos adjuntos oficiales.`,"success")};return o.jsxs("div",{className:"reportes-container",children:[o.jsxs("div",{className:"page-header-row",children:[o.jsxs("div",{children:[o.jsx("div",{className:"breadcrumb-tag",children:"CONTROL DE GESTIÓN Y FISCALIZACIÓN"}),o.jsx("h1",{className:"page-title",children:"Módulo de Exportación y Reportes Ejecutivos"}),o.jsx("p",{className:"page-desc",children:"Consolidación mensual de correspondencia, análisis de tiempos de respuesta y descarga de expedientes."})]}),o.jsxs("div",{className:"page-header-actions",children:[o.jsxs("button",{className:"btn btn-primary",onClick:p,children:[o.jsx(ol,{size:16}),"Exportar Excel (CSV)"]}),o.jsxs("button",{className:"btn btn-secondary",onClick:()=>v(!0),children:[o.jsx(si,{size:16}),"Reporte Oficial Imprimible"]})]})]}),o.jsx("div",{className:"card report-filter-card",children:o.jsxs("div",{className:"filter-controls-row",children:[o.jsxs("div",{className:"form-group-inline",children:[o.jsxs("label",{children:[o.jsx(ea,{size:15,className:"text-gold"}),"Periodo de Evaluación:"]}),o.jsxs("select",{className:"form-select",value:l,onChange:g=>a(g.target.value),style:{width:"220px"},children:[o.jsx("option",{value:"2026-09",children:"Septiembre 2026 (Actual)"}),o.jsx("option",{value:"2026-08",children:"Agosto 2026"}),o.jsx("option",{value:"2026-07",children:"Julio 2026"}),o.jsx("option",{value:"ALL",children:"Todo el Ejercicio 2026"})]})]}),o.jsxs("div",{className:"form-group-inline",children:[o.jsxs("label",{children:[o.jsx(Et,{size:15,className:"text-gold"}),"Filtrar por Departamento:"]}),o.jsxs("select",{className:"form-select",value:s,onChange:g=>c(g.target.value),style:{width:"260px"},children:[o.jsx("option",{value:"ALL",children:"Todos los Departamentos"}),e.departamentos.map(g=>o.jsx("option",{value:g.id,children:g.nombre},g.id))]})]})]})}),o.jsxs("div",{className:"metrics-grid",children:[o.jsxs("div",{className:"metric-card card",children:[o.jsxs("div",{className:"metric-header",children:[o.jsx("span",{className:"metric-label",children:"OFICIOS EN PERIODO"}),o.jsx("div",{className:"metric-icon-box bg-gold-subtle",children:o.jsx(gt,{size:20,className:"text-gold"})})]}),o.jsx("div",{className:"metric-value",children:x}),o.jsxs("div",{className:"metric-footer",children:["Registrados en ",l==="ALL"?"2026":l]})]}),o.jsxs("div",{className:"metric-card card",children:[o.jsxs("div",{className:"metric-header",children:[o.jsx("span",{className:"metric-label",children:"TIEMPO PROMEDIO DE RESPUESTA"}),o.jsx("div",{className:"metric-icon-box bg-amber-subtle",children:o.jsx(sr,{size:20,className:"text-amber"})})]}),o.jsxs("div",{className:"metric-value text-amber",children:[m," ",o.jsx("span",{className:"metric-unit",children:"días"})]}),o.jsx("div",{className:"metric-footer",children:"Desde recepción hasta dictamen"})]}),o.jsxs("div",{className:"metric-card card",children:[o.jsxs("div",{className:"metric-header",children:[o.jsx("span",{className:"metric-label",children:"TASA DE CUMPLIMIENTO"}),o.jsx("div",{className:"metric-icon-box bg-green-subtle",children:o.jsx(ta,{size:20,className:"text-green"})})]}),o.jsxs("div",{className:"metric-value text-green",children:[d,o.jsx("span",{className:"metric-unit",children:"%"})]}),o.jsxs("div",{className:"metric-footer",children:[j," de ",x," concluidos/respondidos"]})]}),o.jsxs("div",{className:"metric-card card",children:[o.jsxs("div",{className:"metric-header",children:[o.jsx("span",{className:"metric-label",children:"CUMPLIMIENTO FUERA DE TÉRMINO"}),o.jsx("div",{className:"metric-icon-box bg-red-subtle",children:o.jsx(xo,{size:20,className:"text-red"})})]}),o.jsx("div",{className:"metric-value text-red",children:N}),o.jsx("div",{className:"metric-footer",children:"Oficios con retraso en plazo"})]})]}),o.jsxs("div",{className:"card download-center-card",children:[o.jsxs("div",{className:"download-center-header",children:[o.jsx(mo,{size:18,className:"text-guinda"}),o.jsx("h3",{children:"Centro de Descarga Masiva de Expedientes"})]}),o.jsxs("div",{className:"download-options-grid",children:[o.jsxs("div",{className:"download-box-item",onClick:p,children:[o.jsx("div",{className:"download-box-icon bg-gold-subtle",children:o.jsx(ol,{size:22,className:"text-gold"})}),o.jsxs("div",{className:"download-box-info",children:[o.jsx("div",{className:"download-box-title",children:"Listado de Correspondencia (Excel)"}),o.jsx("div",{className:"download-box-desc",children:"Descarga el reporte detallado con tiempos de respuesta en .CSV"})]})]}),o.jsxs("div",{className:"download-box-item",onClick:y,children:[o.jsx("div",{className:"download-box-icon bg-purple-subtle",children:o.jsx(_u,{size:22,className:"text-purple"})}),o.jsxs("div",{className:"download-box-info",children:[o.jsx("div",{className:"download-box-title",children:"Bitácora de Auditoría Completa"}),o.jsx("div",{className:"download-box-desc",children:"Exporta el registro inmutable de todos los movimientos del sistema"})]})]}),o.jsxs("div",{className:"download-box-item",onClick:E,children:[o.jsx("div",{className:"download-box-icon bg-green-subtle",children:o.jsx(mo,{size:22,className:"text-green"})}),o.jsxs("div",{className:"download-box-info",children:[o.jsx("div",{className:"download-box-title",children:"Paquete de Documentos y Adjuntos"}),o.jsxs("div",{className:"download-box-desc",children:["Descarga los ",e.adjuntos.length," archivos PDF originales y respuestas"]})]})]})]})]}),o.jsxs("div",{className:"table-container card",children:[o.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid var(--color-border)",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[o.jsxs("h3",{style:{fontSize:"15px",color:"var(--color-guinda-dark)"},children:["Detalle Consolidado de Correspondencia (",h.length," registros)"]}),o.jsxs("span",{style:{fontSize:"12.5px",color:"var(--color-text-subtle)"},children:["Mostrando periodo: ",o.jsx("strong",{children:l==="ALL"?"Todo 2026":l})]})]}),o.jsxs("table",{className:"custom-table",children:[o.jsx("thead",{children:o.jsxs("tr",{children:[o.jsx("th",{children:"Folio"}),o.jsx("th",{children:"Asunto"}),o.jsx("th",{children:"Área Asignada"}),o.jsx("th",{children:"Recepción"}),o.jsx("th",{children:"Término"}),o.jsx("th",{children:"Respuesta"}),o.jsx("th",{children:"Tiempo Respuesta"}),o.jsx("th",{children:"Cumplimiento"})]})}),o.jsx("tbody",{children:h.map(g=>o.jsxs("tr",{children:[o.jsx("td",{style:{fontWeight:700,color:"var(--color-guinda-dark)"},children:g.folio}),o.jsxs("td",{style:{maxWidth:"280px"},children:[o.jsx("div",{style:{fontWeight:600,color:"var(--color-text-dark)",fontSize:"13px"},children:g.asunto}),o.jsxs("div",{style:{fontSize:"11.5px",color:"#64748B"},children:["Dest: ",g.destinatario]})]}),o.jsx("td",{children:o.jsx("span",{style:{fontSize:"13px",fontWeight:500},children:g.deptoNombre})}),o.jsx("td",{style:{fontSize:"12.5px",color:"#64748B"},children:g.fecha_recepcion.split(" ")[0]}),o.jsx("td",{style:{fontSize:"12.5px",color:"#64748B"},children:g.termino||"—"}),o.jsx("td",{style:{fontSize:"12.5px"},children:g.fechaRespuesta!=="Pendiente"?o.jsx("span",{style:{color:"#059669",fontWeight:600},children:g.fechaRespuesta}):o.jsx("span",{style:{color:"#94A3B8"},children:"En trámite"})}),o.jsx("td",{children:g.tiempoRespuestaDias!==null?o.jsxs("strong",{style:{color:"var(--color-guinda-primary)"},children:[g.tiempoRespuestaDias," días"]}):o.jsx("span",{style:{color:"#94A3B8"},children:"—"})}),o.jsx("td",{children:o.jsx("span",{className:`badge ${g.cumplimiento==="EN_TIEMPO"?"badge-concluido":g.cumplimiento==="EXTEMPORANEO"||g.cumplimiento==="VENCIDO_PENDIENTE"?"badge-vencido":"badge-proceso"}`,children:g.cumplimiento==="EN_TIEMPO"?"En Tiempo":g.cumplimiento==="EXTEMPORANEO"?"Extemporáneo":g.cumplimiento==="VENCIDO_PENDIENTE"?"Vencido":"En Plazo"})})]},g.id))})]})]}),u&&o.jsx("div",{className:"modal-overlay",onClick:()=>v(!1),children:o.jsxs("div",{className:"modal-content printable-modal",onClick:g=>g.stopPropagation(),style:{maxWidth:"900px"},children:[o.jsxs("div",{className:"modal-header no-print",children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[o.jsx(si,{size:18,className:"text-guinda"}),o.jsx("h3",{style:{fontSize:"16px",color:"var(--color-guinda-dark)"},children:"Vista Previa del Reporte Oficial para Imprimir / PDF"})]}),o.jsxs("div",{style:{display:"flex",gap:"10px"},children:[o.jsxs("button",{className:"btn btn-primary btn-sm",onClick:()=>window.print(),children:[o.jsx(si,{size:14})," Imprimir / Guardar PDF"]}),o.jsx("button",{className:"btn btn-secondary btn-sm",onClick:()=>v(!1),children:"Cerrar"})]})]}),o.jsxs("div",{className:"modal-body printable-sheet",children:[o.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #691C32",paddingBottom:"14px",marginBottom:"20px"},children:[o.jsxs("div",{children:[o.jsx("h2",{style:{fontSize:"16px",fontWeight:800,color:"#691C32"},children:"SECRETARÍA DE TURISMO"}),o.jsx("div",{style:{fontSize:"12px",color:"#BC955C",fontWeight:700},children:"DIRECCIÓN GENERAL • CONTROL DE CORRESPONDENCIA"}),o.jsx("div",{style:{fontSize:"11px",color:"#64748B",marginTop:"2px"},children:"INFORME CONSOLIDADO DE GESTIÓN Y ATENCIÓN DE OFICIOS"})]}),o.jsxs("div",{style:{textAlign:"right",fontSize:"11.5px",color:"#334155"},children:[o.jsxs("div",{children:[o.jsx("strong",{children:"Periodo:"})," ",l==="ALL"?"Ejercicio 2026":l]}),o.jsxs("div",{children:[o.jsx("strong",{children:"Fecha de Emisión:"})," ",new Date().toLocaleDateString("es-MX")]}),o.jsxs("div",{children:[o.jsx("strong",{children:"Folio de Reporte:"})," INF-SECTUR-2026-09"]})]})]}),o.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"12px",marginBottom:"20px"},children:[o.jsxs("div",{style:{padding:"10px",background:"#FAF6F0",border:"1px solid #E2E8F0",borderRadius:"6px",textAlign:"center"},children:[o.jsx("div",{style:{fontSize:"10.5px",color:"#64748B",fontWeight:700},children:"TOTAL OFICIOS"}),o.jsx("div",{style:{fontSize:"18px",fontWeight:800,color:"#691C32"},children:x})]}),o.jsxs("div",{style:{padding:"10px",background:"#FAF6F0",border:"1px solid #E2E8F0",borderRadius:"6px",textAlign:"center"},children:[o.jsx("div",{style:{fontSize:"10.5px",color:"#64748B",fontWeight:700},children:"PROMEDIO ATENCIÓN"}),o.jsxs("div",{style:{fontSize:"18px",fontWeight:800,color:"#BC955C"},children:[m," días"]})]}),o.jsxs("div",{style:{padding:"10px",background:"#FAF6F0",border:"1px solid #E2E8F0",borderRadius:"6px",textAlign:"center"},children:[o.jsx("div",{style:{fontSize:"10.5px",color:"#64748B",fontWeight:700},children:"TASA CUMPLIMIENTO"}),o.jsxs("div",{style:{fontSize:"18px",fontWeight:800,color:"#059669"},children:[d,"%"]})]}),o.jsxs("div",{style:{padding:"10px",background:"#FAF6F0",border:"1px solid #E2E8F0",borderRadius:"6px",textAlign:"center"},children:[o.jsx("div",{style:{fontSize:"10.5px",color:"#64748B",fontWeight:700},children:"RESUELTOS / CERRADOS"}),o.jsx("div",{style:{fontSize:"18px",fontWeight:800,color:"#691C32"},children:j})]})]}),o.jsxs("table",{className:"custom-table",style:{fontSize:"12px"},children:[o.jsx("thead",{children:o.jsxs("tr",{children:[o.jsx("th",{children:"Folio"}),o.jsx("th",{children:"Asunto"}),o.jsx("th",{children:"Área Destino"}),o.jsx("th",{children:"Recepción"}),o.jsx("th",{children:"Término"}),o.jsx("th",{children:"Días"}),o.jsx("th",{children:"Cumplimiento"})]})}),o.jsx("tbody",{children:h.map(g=>o.jsxs("tr",{children:[o.jsx("td",{style:{fontWeight:700},children:g.folio}),o.jsx("td",{children:g.asunto}),o.jsx("td",{children:g.deptoNombre}),o.jsx("td",{children:g.fecha_recepcion.split(" ")[0]}),o.jsx("td",{children:g.termino||"—"}),o.jsx("td",{children:g.tiempoRespuestaDias!==null?`${g.tiempoRespuestaDias}d`:"—"}),o.jsx("td",{children:g.cumplimiento})]},g.id))})]}),o.jsxs("div",{style:{marginTop:"48px",display:"flex",justifyContent:"space-around",textAlign:"center"},children:[o.jsxs("div",{children:[o.jsx("div",{style:{width:"220px",height:"1px",background:"#94A3B8",margin:"0 auto 6px"}}),o.jsx("div",{style:{fontSize:"11.5px",fontWeight:700},children:"Lic. Claudia Hernández Mora"}),o.jsx("div",{style:{fontSize:"10px",color:"#64748B"},children:"Responsable de Oficialía de Partes"})]}),o.jsxs("div",{children:[o.jsx("div",{style:{width:"220px",height:"1px",background:"#94A3B8",margin:"0 auto 6px"}}),o.jsx("div",{style:{fontSize:"11.5px",fontWeight:700},children:"Mtra. Josefina Morales Ramírez"}),o.jsx("div",{style:{fontSize:"10px",color:"#64748B"},children:"Secretaria de Turismo / Directora General"})]})]})]})]})}),o.jsx("style",{children:`
        .reportes-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .report-filter-card {
          padding: 16px 24px;
        }

        .filter-controls-row {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .form-group-inline {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-group-inline label {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-dark);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .download-center-card {
          padding: 24px;
          background: linear-gradient(135deg, #FAF6F0 0%, #FFFFFF 100%);
          border: 1.5px solid var(--color-dorado-border);
        }

        .download-center-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .download-center-header h3 {
          font-size: 16px;
          color: var(--color-guinda-dark);
        }

        .download-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }

        .download-box-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .download-box-item:hover {
          border-color: var(--color-dorado);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .download-box-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .download-box-title {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--color-text-dark);
        }

        .download-box-desc {
          font-size: 11.5px;
          color: var(--color-text-subtle);
          margin-top: 2px;
        }

        .printable-sheet {
          padding: 32px 40px;
          background: #FFFFFF;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .printable-modal {
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `})]})}function rh(){const{toasts:e,removeToast:t}=we();return e.length===0?null:o.jsxs("div",{className:"toast-container",children:[e.map(n=>{const r=n.type==="success",i=n.type==="info";return o.jsxs("div",{className:`toast-card toast-${n.type}`,children:[o.jsxs("div",{className:"toast-icon",children:[r&&o.jsx(ta,{size:18,className:"text-green"}),i&&o.jsx(Dm,{size:18,className:"text-gold"}),!r&&!i&&o.jsx(Cm,{size:18,className:"text-red"})]}),o.jsxs("div",{className:"toast-content",children:[o.jsx("div",{className:"toast-title",children:n.title}),o.jsx("div",{className:"toast-message",children:n.message})]}),o.jsx("button",{className:"toast-close",onClick:()=>t(n.id),title:"Cerrar notificación",children:o.jsx(ot,{size:14})})]},n.id)}),o.jsx("style",{children:`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1000;
        }

        .toast-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-left: 4px solid var(--color-dorado);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          max-width: 420px;
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-card.toast-success {
          border-left-color: #10B981;
        }

        .toast-card.toast-info {
          border-left-color: var(--color-dorado);
        }

        .toast-content {
          flex: 1;
        }

        .toast-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-guinda-dark);
        }

        .toast-message {
          font-size: 12px;
          color: var(--color-text-muted);
        }

        .toast-close {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .toast-close:hover {
          color: var(--color-text-dark);
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `})]})}function oh(){const{activeView:e}=we();return o.jsxs("div",{className:"app-container",children:[o.jsx(Wm,{}),o.jsxs("div",{className:"main-content",children:[o.jsx(Vm,{}),o.jsxs("main",{className:"content-body",children:[e==="dashboard"&&o.jsx(Hm,{}),e==="oficios"&&o.jsx(Xm,{}),e==="nuevo"&&o.jsx(Zm,{}),e==="reportes"&&o.jsx(nh,{}),e==="departamentos"&&o.jsx(Jm,{}),e==="usuarios"&&o.jsx(eh,{}),e==="auditoria"&&o.jsx(th,{})]})]}),o.jsx(rh,{})]})}function ih(){return o.jsx(um,{children:o.jsx(oh,{})})}ci.createRoot(document.getElementById("root")).render(o.jsx(Zu.StrictMode,{children:o.jsx(ih,{})}));
