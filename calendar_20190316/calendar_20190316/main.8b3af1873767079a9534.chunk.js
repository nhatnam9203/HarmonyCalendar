(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{0:function(n,e){},"0785de3f40b134973d35":function(n,e,t){var r=t("ab039aecd4a1d4fedc0e").addLocaleData,o=t("58d82b287428be065a42"),a=t("529d37966b19afdce782");r(o),r(a);var i=function n(e,t){var r="en"!==e?n("en",{}):{};return Object.keys(t).reduce(function(n,o){var a=t[o]||"en"===e?t[o]:r[o];return Object.assign(n,function(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}({},o,a))},{})},d={en:i("en",{}),de:i("de",{})};e.appLocales=["en","de"],e.formatTranslationMessages=i,e.translationMessages=d,e.DEFAULT_LOCALE="en"},"0cbc23df16a5c6ceec4d":function(n,e,t){n.exports=t.p+".htaccess"},1:function(n,e,t){t("5b15df55c1316f23e9d0"),n.exports=t("8b703812aa8ae3c41814")},"1d45a4e9b75d9860c87c":function(n,e,t){n.exports=t.p+"5b838b00736ea2f7108a8479a6ea6a6a.otf"},"491cc2e27aa2b4221847":function(n,e,t){"use strict";var r=t("4e2e9348dad8fe460c1d"),o=t("accfe20dac886d57b695"),a=t("5e98cee1846dbfd41421"),i=t("54f683fcda7806277002"),d=Object(i.fromJS)({});var c=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d;return(arguments.length>1?arguments[1]:void 0).type,n};function f(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function l(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=Object(r.combineReducers)(function(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{},r=Object.keys(t);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),r.forEach(function(e){f(n,e,t[e])})}return n}({global:c},n));return Object(o.connectRouter)(a.a)(e)}t.d(e,"a",function(){return l})},"5e98cee1846dbfd41421":function(n,e,t){"use strict";var r=t("89fa59dfd48f288c4600"),o=t.n(r)()();e.a=o},"72110207b6499adb0ff6":function(n,e){n.exports=moment},"7fa3d1d0596e1f2a0f74":function(n,e,t){"use strict";var r=t("0b3cb19af78752326f59"),o=t("1d45a4e9b75d9860c87c"),a=t.n(o);function i(){var n=function(n,e){e||(e=n.slice(0));return Object.freeze(Object.defineProperties(n,{raw:{value:Object.freeze(e)}}))}(["\n\n    @font-face {\n    font-family: 'Open Sans';\n    src: url(",");\n    font-weight: 400;\n    font-style: normal;\n  }\n\n  html,\n  body {\n    height: 100%;\n    width: 100%;\n    position: fixed;\n    overflow: hidden;\n}\n  }\n\n  body {\n    font-family: 'Helvetica Neue'\n  }\n\n  body.fontLoaded {\n    font-family: 'Open Sans', 'Helvetica Neue'\n  }\n\n  #app {\n    background-color: #fafafa;\n    min-height: 100%;\n    min-width: 100%;\n  }\n\n  p,\n  label {\n    font-family: Georgia, Times, 'Times New Roman', serif;\n    line-height: 1.5em;\n  }\n  \n  :focus {\n    outline: none;\n  }\n  \n  table {\n    border-collapse: collapse;\n    width: 100%;\n  }\n\n  thead {\n    background: #585858;\n    color: #ffffff;\n  }\n  \n  td, th {\n    border: 1px solid #dddddd;\n    text-align: left;\n    padding: 0.5rem;\n  }\n\n  // ############################################\n  // Main calendar - Fullcalendar\n  // ############################################\n  .fc-unthemed td.fc-today {\n    background: #ffffff;\n}\n  .fc-unthemed th, .fc-unthemed td {\n    border-color: #1484c0;\n    border-width: 1px;\n  }\n  .fc-unthemed th:first-child, .fc-unthemed td:first-child {\n    border-left: none;\n  }\n  .fc-unthemed th:last-child, .fc-unthemed td:last-child {\n    border-right: none;\n  }\n  .fc-unthemed .fc-widget-content {\n    border-color: #ddd;\n    border-width: 1px;\n  }\n  .fc-unthemed .fc-axis {\n    border-right: 1px solid #1484c0;\n  }\n  .fc-axis { \n    width: 71px !important;\n    font-size : 1rem;\n  }\n  .fc th {\n    border-width: 1px;\n  }\n  .fc-resource-cell {\n    position: relative;\n  }\n  .fc-event {\n    border: none;\n    padding: 0;\n    background: #00b4f7;\n    color: #ffffff;\n  }\n\n  .event-block-temp{\n    overflow : hidden;\n  }\n  \n  .fc-ltr .fc-time-grid .fc-now-indicator-arrow {\n    left: 50px;\n    background: #ffffff;\n    color: #f00;\n    border: none;\n    box-shadow: 0 0 10px #949494;\n    border-radius: 10px;\n    font-size: 12px;\n    margin-top: -10px;\n    padding: 1px 10px;\n    z-index: 9;\n  }\n\n  .fc-time-grid-container::-webkit-scrollbar { width: 0 !important }\n  \n  // ############################################\n  // Main calendar - App Event\n  // ############################################\n  .app-event {\n    border-radius: 4px;\n    margin: 1px 1px 4px 1px;\n    padding: 4px;\n    text-align: left;\n    cursor: move;\n  }\n  .app-event__id-number {\n    font-size: 11px;\n    font-weight: bold;\n    margin-bottom: 2px;\n  }\n  .app-event__full-name {\n    font-size: 18px;\n    font-weight: 600;\n    margin-left: 8px;\n    margin-bottom: 4px;\n    line-height: 1.3;\n  }\n  .app-event__phone-number {\n    font-size: 13px;\n    margin-left: 0px;\n    margin-bottom: 4px;\n    line-height: 1.8;\n    font-style: italic;\n    font-weight : 500;\n    word-wrap: break-word;\n  }\n  .app-event__option {\n    font-size: 13px;\n    margin-left: 16px;\n    line-height: 1.2;\n    font-style: italic;\n  }\n\n  .timeline {\n    position: absolute;    \n    border-top: 2px dashed red;\n    width: 100%;\n    margin: 0;\n    padding: 0;\n    z-index: 999;\n  }\n\n  .fc-event {\n    border: 1px solid ;\n}\n.event-assigned, .event-confirmed{\n  font-weight : 500;\n  color : #333;\n  letter-spacing : 0.6;\n}\n.event-checkin,.event-confirmed,.event-paid{\n  border : 1px solid #ffffff !important;\n}\n\n\n.event-assigned{\n  background: linear-gradient(\n        to right,\n        #873f72,\n        #ed3144,\n        #f20920,\n        #b9ce2b,\n        #873f72\n      )\n      160%\n      0\n      repeat-x,\n    linear-gradient(to top, #873f72, #ed3144, #f20920, #b9ce2b, #873f72)\n      100%\n      20%\n      repeat-y,\n    linear-gradient(to left, #873f72, #ed3144, #f20920, #b9ce2b, #873f72)\n      10%\n      100%\n      repeat-x,\n    linear-gradient(to bottom, #873f72, #ed3144, #f20920, #b9ce2b, #873f72)\n      0%\n      10%\n      repeat-y;\n\n  background-size: 300% 2px, 2px 300%;/* increase size to show at once the bit from 2 gradient colors */\n  animation: bd 5s infinite linear;\n}\n\n.timePicker{\n  border : 10px !important;\n  margin-top : 5px;\n}\n\n.rc-time-picker-input{\n  border : 0 !important;\n}\n.rc-time-picker-clear{\n  display : none;\n\n}\n.rc-time-picker-input{\n  font-size : 1rem !important;\n  color : #333;\n  padding-left : 10px !important;\n}\n\n.event-assigned:hover ,.event-confirmed:hover{\n  font-weight : 500;\n  color : #333;\n}\n.DayPickerInput input{\n  color : #333 !important;\n}\n.DayPickerInput{\n  padding-top : 1rem !important;\n}\n\n.fc-highlight{\n  background : #b0e7ff;\n  opacity : 0.7;\n}\n.rc-time-picker-panel{\n  width : 300px !important;\n}\n.rc-time-picker-panel-narrow{\n  max-width : 300px !important;\n}\n.rc-time-picker-panel-select{\n  width : 80px !important;\n}\n\n.headerRefPhone{\n    width: 4rem !important;\n    height : 2.14rem !important;\n    background: #ffffff !important;\n    border: 1px solid #dddddd !important;\n    border-radius: 4px;\n    margin-right: 0.5rem;\n    padding-left: 1.2rem;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n}\n\n.rc-time-picker-panel-select ul li{\n  height : 43px !important;\n}\n\n.txtTimeChange{\n  color : #919191;\n  font-size : 0.9rem;\n}\n\n.am-picker{\n  width:60%;\n  margin:auto;\n}\n.am-picker-popup{\n  left : 25% !important;\n  width : 50% !important;\n  border-top-left-radius : 10px;\n  border-top-right-radius : 10px;\n}\n#full-calendar{\n\n}\n.App-pages {\n    height: 100%;\n    width: calc(((100vw - 5.05rem) / 7) * 6 + 4.75rem);\n    perspective: 960px;\n}\n.am-picker-popup-header{\n  background : #1073C2;\n  border-top-left-radius : 15px;\n  border-top-right-radius : 15px;\n}\n.am-picker-popup{\n  border-top-left-radius : 15px;\n  border-top-right-radius : 15px; \n}\n.am-picker-popup-item{\n  color : #ffffff !important;\n}\n.popup-overlay{\n\n}\n\n::-webkit-scrollbar { \n    display: none; \n}\n\n@keyframes bd {\n  50% {\n    background-position: 460% 0, 100% 320%, 310% 100%, 0% 310%;/* average reset of bg-position , tune it to desired effect */\n  }\n}\n"]);return i=function(){return n},n}var d=Object(r.a)(i(),a.a);e.a=d},"8b703812aa8ae3c41814":function(n,e,t){"use strict";t.r(e);t("8c8e4f08a118a28666b0"),t("8af190b70a6bc55c6f1b");var r,o=t("63f14ac74ce296f77f4d"),a=t.n(o),i=t("d7dd51e1bf6bfc2c9c3d"),d=t("accfe20dac886d57b695"),c=t("260f3680b921ede7f717"),f=t.n(c),l=t("5e98cee1846dbfd41421"),p=(t("6735bdf1a3a541ab43fd"),t("72110207b6499adb0ff6"),t("802cdb4f0b591dfd1229"),t("6b9686a008052f335047"),t("d3a6c215c5219d79ee1a"),t("6c396da9300c3f6a0bf2"),t("d6c6cff19b2609629d5e"),t("afacb0b57b240655f572"),t("e5059ac3cfebcf44942c"),t("0d7f0986bcd2f33d8a2a")),b=t("0b3cb19af78752326f59"),u=t("e95a63b25fb92ed15721"),s=t("be49ece3c9ac38c7621f"),m=t("8e4c85c29cdef1bf8a5f"),h=Object(s.a)(function(){return Promise.all([t.e(0),t.e(3)]).then(t.bind(null,"a089d5de5d5c1c06e185"))},{LoadingComponent:m.a}),g=(Object(s.a)(function(){return t.e(4).then(t.bind(null,"8937ca26cad1b574ef33"))},{LoadingComponent:m.a}),t("7fa3d1d0596e1f2a0f74"));function v(n,e,t,o){r||(r="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=n&&n.defaultProps,i=arguments.length-3;if(e||0===i||(e={children:void 0}),e&&a)for(var d in a)void 0===e[d]&&(e[d]=a[d]);else e||(e=a||{});if(1===i)e.children=o;else if(i>1){for(var c=new Array(i),f=0;f<i;f++)c[f]=arguments[f+3];e.children=c}return{$$typeof:r,type:n,key:void 0===t?null:""+t,ref:null,props:e,_owner:null}}var y=b.c.div.withConfig({displayName:"App__AppWrapper",componentId:"sc-1vkr63w-0"})(["margin:0 auto;display:flex;min-height:100%;flex-direction:column;width:100vw;height:100vh;overflow:hidden;"]),w=v(p.Helmet,{titleTemplate:"%s - React App",defaultTitle:"Appointment App"},void 0,v("meta",{name:"description",content:"React App"})),x=v(u.Switch,{},void 0,v(u.Route,{path:"",component:h})),k=v(g.a,{});t("0cbc23df16a5c6ceec4d");var O=t("ab4cb61bcb2dc161defb"),j=t("54f683fcda7806277002"),S=t("74431d47afb6248fcb69"),P=t("491cc2e27aa2b4221847");var _=Object(S.a)();var z,A=t("0785de3f40b134973d35");function C(n,e,t,r){z||(z="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var o=n&&n.defaultProps,a=arguments.length-3;if(e||0===a||(e={children:void 0}),e&&o)for(var i in o)void 0===e[i]&&(e[i]=o[i]);else e||(e=o||{});if(1===a)e.children=r;else if(a>1){for(var d=new Array(a),c=0;c<a;c++)d[c]=arguments[c+3];e.children=d}return{$$typeof:z,type:n,key:void 0===t?null:""+t,ref:null,props:e,_owner:null}}t.d(e,"store",function(){return L}),new f.a("Open Sans",{}).load().then(function(){document.body.classList.add("fontLoaded")});var L=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0,t=[_,Object(d.routerMiddleware)(e)],r=[O.applyMiddleware.apply(void 0,t)],o=O.compose,a=Object(O.createStore)(Object(P.a)(),Object(j.fromJS)(n),o.apply(void 0,r));return a.runSaga=_.run,a.injectedReducers={},a.injectedSagas={},a}({},l.a),R=document.getElementById("app"),M=C(i.Provider,{store:L},void 0,C(d.ConnectedRouter,{history:l.a},void 0,C(function(){return v(y,{},void 0,w,x,k)},{}))),$=function(){a.a.render(M,R)};window.Intl?$(A.translationMessages):new Promise(function(n){n(Promise.all([t.e(0),t.e(5)]).then(t.t.bind(null,"97694e21b72f8e9351c4",7)))}).then(function(){return Promise.all([t.e(0).then(t.t.bind(null,"f030ad8f70186ef5cb63",7)),t.e(0).then(t.t.bind(null,"14584c41c196d3540f41",7))])}).then(function(){return $(A.translationMessages)}).catch(function(n){throw n}),t("30d14b3a3295666f3aba").install()},"8e4c85c29cdef1bf8a5f":function(n,e,t){"use strict";t("8af190b70a6bc55c6f1b"),t("8a2d1b95e05b6a321e74");var r,o=t("0b3cb19af78752326f59");var a,i=Object(o.d)(["0%,39%,100%{opacity:0;}40%{opacity:1;}"]),d=Object(o.b)([""," 1.2s infinite ease-in-out both;"],i),c=function(n){return function(n,e,t,o){r||(r="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=n&&n.defaultProps,i=arguments.length-3;if(e||0===i||(e={children:void 0}),e&&a)for(var d in a)void 0===e[d]&&(e[d]=a[d]);else e||(e=a||{});if(1===i)e.children=o;else if(i>1){for(var c=new Array(i),f=0;f<i;f++)c[f]=arguments[f+3];e.children=c}return{$$typeof:r,type:n,key:void 0===t?null:""+t,ref:null,props:e,_owner:null}}(o.c.div.withConfig({displayName:"Circle__CirclePrimitive",componentId:"sc-16mmxuh-0"})(["width:100%;height:100%;position:absolute;left:0;top:0;"," &:before{content:'';display:block;margin:0 auto;width:15%;height:15%;background-color:#999;border-radius:100%;animation:",";",";}"],n.rotate&&"\n      -webkit-transform: rotate(".concat(n.rotate,"deg);\n      -ms-transform: rotate(").concat(n.rotate,"deg);\n      transform: rotate(").concat(n.rotate,"deg);\n    "),d,n.delay&&"\n        -webkit-animation-delay: ".concat(n.delay,"s;\n        animation-delay: ").concat(n.delay,"s;\n      ")),{})};function f(n,e,t,r){a||(a="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var o=n&&n.defaultProps,i=arguments.length-3;if(e||0===i||(e={children:void 0}),e&&o)for(var d in o)void 0===e[d]&&(e[d]=o[d]);else e||(e=o||{});if(1===i)e.children=r;else if(i>1){for(var c=new Array(i),f=0;f<i;f++)c[f]=arguments[f+3];e.children=c}return{$$typeof:a,type:n,key:void 0===t?null:""+t,ref:null,props:e,_owner:null}}var l=f(o.c.div.withConfig({displayName:"Wrapper",componentId:"ay9nom-0"})(["margin:0.5em auto;width:40px;height:40px;position:relative;"]),{},void 0,f(c,{}),f(c,{rotate:30,delay:-1.1}),f(c,{rotate:60,delay:-1}),f(c,{rotate:90,delay:-.9}),f(c,{rotate:120,delay:-.8}),f(c,{rotate:150,delay:-.7}),f(c,{rotate:180,delay:-.6}),f(c,{rotate:210,delay:-.5}),f(c,{rotate:240,delay:-.4}),f(c,{rotate:270,delay:-.3}),f(c,{rotate:300,delay:-.2}),f(c,{rotate:330,delay:-.1}));e.a=function(){return l}}},[[1,2,0]]]);