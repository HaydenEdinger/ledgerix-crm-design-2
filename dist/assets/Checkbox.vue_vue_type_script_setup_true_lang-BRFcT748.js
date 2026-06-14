import{c as t,d,o as i,a as r,n as y,u as o,B as u,j as a,D as m,z as x}from"./index-C4g-v5bP.js";/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=t("MinusIcon",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=t("SlidersHorizontalIcon",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]),k=["aria-checked","disabled"],v=d({__name:"Checkbox",props:{modelValue:{type:Boolean},indeterminate:{type:Boolean},disabled:{type:Boolean},class:{}},emits:["update:modelValue"],setup(e,{emit:s}){const n=e,l=s;function c(){n.disabled||l("update:modelValue",!n.modelValue)}return(f,h)=>(i(),r("button",{type:"button",role:"checkbox","aria-checked":e.indeterminate?"mixed":e.modelValue,disabled:e.disabled,class:y(o(u)("flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",e.modelValue||e.indeterminate?"border-accent bg-accent text-accent-foreground":"border-input bg-card hover:border-foreground/40",n.class)),onClick:c},[e.indeterminate?(i(),a(o(b),{key:0,class:"size-3.5"})):e.modelValue?(i(),a(o(m),{key:1,class:"size-3.5"})):x("",!0)],10,k))}});export{V as S,v as _};
