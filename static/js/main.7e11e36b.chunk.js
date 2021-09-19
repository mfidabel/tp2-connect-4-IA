(this["webpackJsonpconnect-4-ia"]=this["webpackJsonpconnect-4-ia"]||[]).push([[0],{25:function(e,i,a){},26:function(e,i,a){},40:function(e,i,a){"use strict";a.r(i);var o,t=a(1),s=a.n(t),r=a(17),n=a.n(r),l=(a(25),a(6)),c=(a(26),a(27),a(42)),h=a(41),u=a(43),b=a(19),f=a(44);!function(e){e[e.Minimax=0]="Minimax",e[e.Alfabeta=1]="Alfabeta",e[e.RLAgent=2]="RLAgent"}(o||(o={}));var p,g,m=a(7),j=a(8);!function(e){e[e.Vacio=0]="Vacio",e[e.Rojo=1]="Rojo",e[e.Amarillo=2]="Amarillo"}(p||(p={})),function(e){e[e.SinGanador=0]="SinGanador",e[e.GanadorRojo=1]="GanadorRojo",e[e.GanadorAmarillo=2]="GanadorAmarillo",e[e.Empate=3]="Empate"}(g||(g={}));var v=function(e){switch(e){case p.Rojo:return g.GanadorRojo;case p.Amarillo:return g.GanadorAmarillo;default:return g.SinGanador}},d=function(){function e(){Object(m.a)(this,e),this.posiciones=void 0,this.posiciones=Array(6).fill(void 0).map((function(){return Array(7).fill(p.Vacio)}))}return Object(j.a)(e,[{key:"vaciarTablero",value:function(){this.posiciones=Array(6).fill(void 0).map((function(){return Array(7).fill(p.Vacio)}))}},{key:"calcularResultado",value:function(){for(var e,i=0,a=0;a<this.posiciones.length;a++){e=0;for(var o=0;o<this.posiciones[0].length;o++){var t=this.posiciones[a][o];if(t===e?i++:i=1,4===i&&(t===p.Rojo||t===p.Amarillo))return t===p.Rojo?g.GanadorRojo:g.GanadorAmarillo;e=t}}for(var s=0;s<this.posiciones[0].length;s++){e=0;for(var r=0;r<this.posiciones.length;r++){var n=this.posiciones[r][s];if(n===e?i++:i=1,4===i&&(n===p.Rojo||n===p.Amarillo))return n===p.Rojo?g.GanadorRojo:g.GanadorAmarillo;e=n}}for(var l=3;l<this.posiciones.length+this.posiciones[0].length-4;l++){e=0;for(var c=Math.max(0,l-this.posiciones.length+1);c<Math.min(l+1,this.posiciones[0].length);c++){var h=this.posiciones[l-c][c];if(h===e?i++:i=1,4===i&&(h===p.Rojo||h===p.Amarillo))return h===p.Rojo?g.GanadorRojo:g.GanadorAmarillo;e=h}}for(var u=3;u<this.posiciones.length+this.posiciones[0].length-4;u++){e=0;for(var b=Math.max(0,u-this.posiciones.length+1);b<Math.min(u+1,this.posiciones[0].length);b++){var f=this.posiciones[this.posiciones.length-1-u+b][b];if(f===e?i++:i=1,4===i&&(f===p.Rojo||f===p.Amarillo))return f===p.Rojo?g.GanadorRojo:g.GanadorAmarillo;e=f}}for(var m=0;m<this.posiciones[0].length;m++)if(0===this.posiciones[0][m]||0===this.posiciones[this.posiciones.length-1][m])return g.SinGanador;return g.Empate}},{key:"imprimirTablero",value:function(){for(var e=this.posiciones.length-1;e>=0;e--){for(var i="|",a=0;a<this.posiciones[0].length;a++)i=i.concat("".concat(this.posiciones[e][a].valueOf())).concat("|");console.log(i)}}},{key:"tirarFicha",value:function(e,i){if(e>this.posiciones[0].length)console.error("No existe la columna");else if(this.verificarColumnaLibre(e)){var a=this.posiciones.findIndex((function(i){return i[e]===p.Vacio}));this.posiciones[a][e]=i}else console.error("No se puede colocar aca")}},{key:"verificarColumnaLibre",value:function(e){return e>this.posiciones[0].length?(console.error("No existe la columna"),!1):this.posiciones[this.posiciones.length-1][e]===p.Vacio}}]),e}(),E=function(){function e(i){Object(m.a)(this,e),this.n=void 0,this.tablero=new d,this.lastTablero=new d,this.entrenar=!1,this.jugadorAgente=p.Rojo,this.alpha=.7,this.turnosMaximos=42,this.gameResult=g.SinGanador,this.lookupTable=new Map,this.qRate=.5,this.n=i}return Object(j.a)(e,[{key:"reset",value:function(e){this.tablero=new d,this.lastTablero=new d,this.entrenar=e,this.gameResult=g.SinGanador}},{key:"resetLearning",value:function(){this.lookupTable=new Map}},{key:"calcularR",value:function(e,i){var a=i===p.Rojo?p.Amarillo:p.Rojo;switch(e.calcularResultado()){case v(i):return 1;case v(a):case g.Empate:return 0;default:return this.getProbability(e)}}},{key:"getProbability",value:function(e){var i=e.posiciones.toString();return this.lookupTable.has(i)||this.lookupTable.set(i,.5),this.lookupTable.get(i)}},{key:"updateProbability",value:function(e,i,a){var o=this.calcularR(e,a);o+=this.alpha*(i-o);var t=e.toString();this.lookupTable.set(t,o)}},{key:"jugarElitista",value:function(e){for(var i,a=0,o=Number.MIN_SAFE_INTEGER,t=0;t<this.tablero.posiciones[0].length;t++)if(this.tablero.posiciones[this.tablero.posiciones.length-1][t]===p.Vacio){for(var s=this.tablero.posiciones.length-1;s>0&&this.tablero.posiciones[s-1][t]===p.Vacio;)s--;this.tablero.posiciones[s][t]=e,(i=this.calcularR(this.tablero,e))>o&&(o=i,a=t),this.tablero.posiciones[s][t]=0}this.entrenar&&this.updateProbability(this.lastTablero,o,e);for(var r=this.tablero.posiciones.length-1;r>0&&this.tablero.posiciones[r-1][a]===p.Vacio;)r--;this.tablero.posiciones[r][a]=e,this.copiarTablero(this.tablero,this.lastTablero)}},{key:"jugarRandom",value:function(e){for(var i=[],a=0;a<this.tablero.posiciones[0].length;a++)this.tablero.posiciones[this.tablero.posiciones.length-1][a]===p.Vacio&&i.push(a);for(var o=i[Math.floor(Math.random()*i.length)],t=this.tablero.posiciones.length-1;t>0&&this.tablero.posiciones[t-1][o]===p.Vacio;)t--;this.tablero.posiciones[t][o]=e,e===this.jugadorAgente&&this.copiarTablero(this.tablero,this.lastTablero)}},{key:"jugarHumano",value:function(e){this.tablero.imprimirTablero();for(var i,o=[],t=0;t<this.tablero.posiciones[0].length;t++)this.tablero.posiciones[this.tablero.posiciones.length-1][t]===p.Vacio&&o.push(t);do{var s=a(14)();console.log(o),i=parseInt(s("Cual es su jugada? ")),console.log(i)}while(!(i in o));for(var r=this.tablero.posiciones.length-1;r>0&&this.tablero.posiciones[r-1][i]===p.Vacio;)r--;this.tablero.posiciones[r][i]=e,e===this.jugadorAgente&&this.copiarTablero(this.tablero,this.lastTablero)}},{key:"copiarTablero",value:function(e,i){for(var a=0;a<e.posiciones.length;a++)for(var o=0;o<e.posiciones[0].length;o++)i.posiciones[a][o]=e.posiciones[a][o]}},{key:"updateAlpha",value:function(e){this.alpha=.5-.49*e/this.n}},{key:"jugarVsRandom",value:function(){var e=this.jugadorAgente,i=e%2+1,a=1,o=this.turnosMaximos;do{if(a===e?Math.random()<=this.qRate||!this.entrenar?this.jugarElitista(e):this.jugarRandom(e):this.jugarRandom(i),this.gameResult=this.tablero.calcularResultado(),this.gameResult>0){this.gameResult!==v(e)&&this.entrenar&&this.updateProbability(this.lastTablero,this.calcularR(this.tablero,e),e);break}a=2-a+1,o--}while(o>0)}},{key:"jugarVsHumano",value:function(){var e=this.jugadorAgente,i=e%2+1,a=1,o=this.turnosMaximos;do{if(a===e?this.jugarRandom(e):this.jugarHumano(i),this.gameResult=this.tablero.calcularResultado(),this.gameResult>0){this.gameResult!==v(e)&&this.entrenar?(this.updateProbability(this.lastTablero,this.calcularR(this.tablero,e),e),console.log("Felicidades! Usted ha ganado.")):this.gameResult===v(e)&&(this.tablero.imprimirTablero(),console.log("Felicidades! Su agente ha ganado."));break}a=2-a+1,o--}while(o>0)}}]),e}();E.Agente=new E(1e4);var R,N=a(0),A=function(e){var i=e.onElegirEstrategia,a=(e.onLimpiarTablero,Object(t.useState)(o.Minimax)),s=Object(l.a)(a,2),r=s[0],n=s[1],c=Object(t.useState)(3),p=Object(l.a)(c,2),g=p[0],m=p[1],j=Object(t.useState)(.5),v=Object(l.a)(j,2),d=v[0],R=v[1],A=Object(t.useState)(1e4),O=Object(l.a)(A,2),x=O[0],S=O[1];return Object(N.jsxs)(u.a,{children:[Object(N.jsxs)(h.a,{children:[Object(N.jsxs)(b.a,{children:[Object(N.jsx)(h.a,{children:Object(N.jsxs)(u.a.Group,{className:"mb-3",children:[Object(N.jsx)(u.a.Label,{children:"Estrategia"}),Object(N.jsxs)(u.a.Select,{value:r,onChange:function(e){return n(parseInt(e.currentTarget.value))},children:[Object(N.jsx)("option",{value:o.Minimax,children:"Minimax"}),Object(N.jsx)("option",{value:o.Alfabeta,children:"Poda Alfa-beta"}),Object(N.jsx)("option",{value:o.RLAgent,children:"Agente RL"})]})]})}),Object(N.jsx)(h.a,{children:Object(N.jsxs)(u.a.Group,{className:"mb-3",children:[Object(N.jsx)(u.a.Label,{children:"N Entrenamiento (Solo para RL)"}),Object(N.jsx)(u.a.Control,{value:x,type:"number",disabled:r!==o.RLAgent,onChange:function(e){return S(parseInt(e.currentTarget.value))}})]})})]}),Object(N.jsxs)(b.a,{children:[Object(N.jsx)(h.a,{children:Object(N.jsxs)(u.a.Group,{className:"mb-3",children:[Object(N.jsx)(u.a.Label,{children:"Nivel de b\xfasqueda"}),Object(N.jsx)(u.a.Control,{value:g,type:"number",onChange:function(e){return m(parseInt(e.currentTarget.value))}})]})}),Object(N.jsx)(h.a,{children:Object(N.jsxs)(u.a.Group,{className:"mb-3",children:[Object(N.jsx)(u.a.Label,{children:"Q Rate (Solo para RL)"}),Object(N.jsx)(u.a.Control,{value:d,type:"number",max:1,disabled:r!==o.RLAgent,onChange:function(e){return R(parseFloat(e.currentTarget.value))}})]})})]})]}),Object(N.jsx)(h.a,{children:Object(N.jsxs)(b.a,{children:[Object(N.jsx)(f.a,{variant:"primary",onClick:function(){i({estrategia:r,nivel:g,qRate:d})},children:"Elegir Estrategia"}),Object(N.jsx)(f.a,{variant:"secondary",onClick:function(){E.Agente=new E(x),E.Agente.qRate=d;for(var e=0;e<x;e++)E.Agente.reset(!0),E.Agente.updateAlpha(e),E.Agente.jugarVsRandom()},disabled:r!==o.RLAgent,className:"ms-3",children:"Entrenar RL"})]})})]})},O=a(15);!function(e){e[e.SinSeleccionar=0]="SinSeleccionar",e[e.Humano=1]="Humano",e[e.Estrategia=2]="Estrategia"}(R||(R={}));var x=function(){function e(i){Object(m.a)(this,e),this.n=void 0,this.tablero=new d,this.jugadorAgente=p.Rojo,this.turnosMaximos=42,this.gameResult=g.SinGanador,this.n=i}return Object(j.a)(e,[{key:"reset",value:function(){this.tablero=new d,this.gameResult=g.SinGanador}},{key:"calcularF",value:function(e,i){for(var a=Array(3).fill(0),o=0;o<e.posiciones.length;o++)for(var t=!1,s=0,r=-1,n=0;n<e.posiciones[0].length;n++){var l=e.posiciones[o][n];if(l===r&&l!==p.Vacio)s++;else{if((t||l===p.Vacio)&&s>0)if(l===i){if(s>3)return Number.MAX_SAFE_INTEGER;a[s-1]++}else{if(s>3)return Number.MIN_SAFE_INTEGER;a[s-1]--}t=l===p.Vacio,s=0}r=l}for(var c=0;c<e.posiciones[0].length;c++)for(var h=!1,u=0,b=-1,f=0;f<e.posiciones.length;f++){var g=e.posiciones[f][c];if(g===b&&g!==p.Vacio)u++;else{if((h||g===p.Vacio)&&u>0)if(g===i){if(u>3)return Number.MAX_SAFE_INTEGER;a[u-1]++}else{if(u>3)return Number.MIN_SAFE_INTEGER;a[u-1]--}h=g===p.Vacio,u=0}b=g}for(var m=3;m<e.posiciones.length+e.posiciones[0].length-4;m++)for(var j=!1,v=0,d=-1,E=Math.max(0,m-e.posiciones.length+1);E<Math.min(m+1,e.posiciones[0].length);E++){var R=e.posiciones[m-E][E];if(R===d&&R!==p.Vacio)v++;else{if((j||R===p.Vacio)&&v>0)if(R===i){if(v>3)return Number.MAX_SAFE_INTEGER;a[v-1]++}else{if(v>3)return Number.MIN_SAFE_INTEGER;a[v-1]--}j=R===p.Vacio,v=0}d=R}for(var N=3;N<e.posiciones.length+e.posiciones[0].length-4;N++)for(var A=!1,O=0,x=-1,S=Math.max(0,N-e.posiciones.length+1);S<Math.min(N+1,e.posiciones[0].length);S++){var V=e.posiciones[e.posiciones.length-1-N+S][S];if(V===x&&V!==p.Vacio)O++;else{if((A||V===p.Vacio)&&O>0)if(V===i){if(O>3)return Number.MAX_SAFE_INTEGER;a[O-1]++}else{if(O>3)return Number.MIN_SAFE_INTEGER;a[O-1]--}A=V===p.Vacio,O=0}x=V}var T=[.25,.5,1];return a.reduce((function(e,i,a){return e+i*T[a]}),0)}},{key:"jugarElitista",value:function(e){for(var i=0,a=0,o=Number.MIN_SAFE_INTEGER,t=0;t<this.tablero.posiciones[0].length;t++)if(this.tablero.posiciones[this.tablero.posiciones.length-1][t]===p.Vacio){for(var s=this.tablero.posiciones.length-1;s>0&&this.tablero.posiciones[s-1][t]===p.Vacio;)s--;this.tablero.posiciones[s][t]=e,(i=this.minValue(this.tablero,e,this.n))>o&&(o=i,a=t),this.tablero.posiciones[s][t]=0}for(var r=this.tablero.posiciones.length-1;r>0&&this.tablero.posiciones[r-1][a]===p.Vacio;)r--;this.tablero.posiciones[r][a]=e}},{key:"maxValue",value:function(e,i,a){if(0===a)return this.calcularF(e,i);var o,t=e.calcularResultado();if(t.valueOf()===i.valueOf())return Number.MAX_SAFE_INTEGER;if(t.valueOf()===i%2+1)return Number.MIN_SAFE_INTEGER;for(var s=Number.MIN_SAFE_INTEGER,r=0;r<this.tablero.posiciones[0].length;r++)if(this.tablero.posiciones[this.tablero.posiciones.length-1][r]===p.Vacio){for(var n=this.tablero.posiciones.length-1;n>0&&this.tablero.posiciones[n-1][r]===p.Vacio;)n--;this.tablero.posiciones[n][r]=i,(o=this.minValue(this.tablero,i,a-1))>s&&(s=o),this.tablero.posiciones[n][r]=p.Vacio}return s}},{key:"minValue",value:function(e,i,a){if(0===a)return this.calcularF(e,i);var o=e.calcularResultado();if(o.valueOf()===i.valueOf())return Number.MAX_SAFE_INTEGER;if(o===i%2+1)return Number.MIN_SAFE_INTEGER;for(var t=0,s=Number.MAX_SAFE_INTEGER,r=0;r<this.tablero.posiciones[0].length;r++)if(this.tablero.posiciones[this.tablero.posiciones.length-1][r]===p.Vacio){for(var n=this.tablero.posiciones.length-1;n>0&&this.tablero.posiciones[n-1][r]===p.Vacio;)n--;this.tablero.posiciones[n][r]=i%2+1,(t=this.maxValue(this.tablero,i,a-1))<s&&(s=t),this.tablero.posiciones[n][r]=p.Vacio}return s}},{key:"jugarHumano",value:function(e){this.tablero.imprimirTablero();for(var i,o=[],t=0;t<this.tablero.posiciones[0].length;t++)this.tablero.posiciones[this.tablero.posiciones.length-1][t]===p.Vacio&&o.push(t);do{var s=a(14)();console.log(o),i=parseInt(s("Cual es su jugada? "))}while(!(i in o));for(var r=this.tablero.posiciones.length-1;r>0&&this.tablero.posiciones[r-1][i]===p.Vacio;)r--;this.tablero.posiciones[r][i]=e}},{key:"jugarVsHumano",value:function(){var e=this.jugadorAgente,i=e%2+1,a=1,o=this.turnosMaximos;do{if(a===e?this.jugarElitista(e):this.jugarHumano(i),this.gameResult=this.tablero.calcularResultado(),this.gameResult>0){this.gameResult.valueOf()!==e.valueOf()?console.log("Felicidades! Usted ha ganado."):this.gameResult.valueOf()===e.valueOf()&&(this.tablero.imprimirTablero(),console.log("Felicidades! Su agente ha ganado."));break}a=2-a+1,o--}while(o>0)}}]),e}(),S=function(){function e(i){Object(m.a)(this,e),this.n=void 0,this.tablero=new d,this.jugadorAgente=p.Rojo,this.turnosMaximos=42,this.gameResult=g.SinGanador,this.n=i}return Object(j.a)(e,[{key:"reset",value:function(){this.tablero=new d,this.gameResult=g.SinGanador}},{key:"calcularF",value:function(e,i){for(var a=Array(3).fill(0),o=0;o<e.posiciones.length;o++)for(var t=!1,s=0,r=-1,n=0;n<e.posiciones[0].length;n++){var l=e.posiciones[o][n];if(l===r&&l!==p.Vacio)s++;else{if((t||l===p.Vacio)&&s>0)if(l===i){if(s>3)return Number.MAX_SAFE_INTEGER;a[s-1]++}else{if(s>3)return Number.MIN_SAFE_INTEGER;a[s-1]--}t=l===p.Vacio,s=0}r=l}for(var c=0;c<e.posiciones[0].length;c++)for(var h=!1,u=0,b=-1,f=0;f<e.posiciones.length;f++){var g=e.posiciones[f][c];if(g===b&&g!==p.Vacio)u++;else{if((h||g===p.Vacio)&&u>0)if(g===i){if(u>3)return Number.MAX_SAFE_INTEGER;a[u-1]++}else{if(u>3)return Number.MIN_SAFE_INTEGER;a[u-1]--}h=g===p.Vacio,u=0}b=g}for(var m=3;m<e.posiciones.length+e.posiciones[0].length-4;m++)for(var j=!1,v=0,d=-1,E=Math.max(0,m-e.posiciones.length+1);E<Math.min(m+1,e.posiciones[0].length);E++){var R=e.posiciones[m-E][E];if(R===d&&R!==p.Vacio)v++;else{if((j||R===p.Vacio)&&v>0)if(R===i){if(v>3)return Number.MAX_SAFE_INTEGER;a[v-1]++}else{if(v>3)return Number.MIN_SAFE_INTEGER;a[v-1]--}j=R===p.Vacio,v=0}d=R}for(var N=3;N<e.posiciones.length+e.posiciones[0].length-4;N++)for(var A=!1,O=0,x=-1,S=Math.max(0,N-e.posiciones.length+1);S<Math.min(N+1,e.posiciones[0].length);S++){var V=e.posiciones[e.posiciones.length-1-N+S][S];if(V===x&&V!==p.Vacio)O++;else{if((A||V===p.Vacio)&&O>0)if(V===i){if(O>3)return Number.MAX_SAFE_INTEGER;a[O-1]++}else{if(O>3)return Number.MIN_SAFE_INTEGER;a[O-1]--}A=V===p.Vacio,O=0}x=V}var T=[.25,.5,1];return a.reduce((function(e,i,a){return e+i*T[a]}),0)}},{key:"jugarElitista",value:function(e){for(var i=0,a=0,o=Number.MIN_SAFE_INTEGER,t=0;t<this.tablero.posiciones[0].length;t++)if(this.tablero.posiciones[this.tablero.posiciones.length-1][t]===p.Vacio){for(var s=this.tablero.posiciones.length-1;s>0&&this.tablero.posiciones[s-1][t]===p.Vacio;)s--;this.tablero.posiciones[s][t]=e,(i=this.minValue(this.tablero,e,this.n,Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER))>o&&(o=i,a=t),this.tablero.posiciones[s][t]=0}for(var r=this.tablero.posiciones.length-1;r>0&&this.tablero.posiciones[r-1][a]===p.Vacio;)r--;this.tablero.posiciones[r][a]=e}},{key:"maxValue",value:function(e,i,a,o,t){if(0===a)return this.calcularF(e,i);var s,r=e.calcularResultado();if(r.valueOf()===i.valueOf())return Number.MAX_SAFE_INTEGER;if(r.valueOf()===i%2+1)return Number.MIN_SAFE_INTEGER;for(var n=Number.MIN_SAFE_INTEGER,l=0;l<this.tablero.posiciones[0].length;l++)if(this.tablero.posiciones[this.tablero.posiciones.length-1][l]===p.Vacio){for(var c=this.tablero.posiciones.length-1;c>0&&this.tablero.posiciones[c-1][l]===p.Vacio;)c--;if(this.tablero.posiciones[c][l]=i,(s=this.minValue(this.tablero,i,a-1,o,t))>n&&(n=s),this.tablero.posiciones[c][l]=p.Vacio,n>=t)return n;n>o&&(o=n)}return n}},{key:"minValue",value:function(e,i,a,o,t){if(0===a)return this.calcularF(e,i);var s=e.calcularResultado();if(s.valueOf()===i.valueOf())return Number.MAX_SAFE_INTEGER;if(s===i%2+1)return Number.MIN_SAFE_INTEGER;for(var r=0,n=Number.MAX_SAFE_INTEGER,l=0;l<this.tablero.posiciones[0].length;l++)if(this.tablero.posiciones[this.tablero.posiciones.length-1][l]===p.Vacio){for(var c=this.tablero.posiciones.length-1;c>0&&this.tablero.posiciones[c-1][l]===p.Vacio;)c--;if(this.tablero.posiciones[c][l]=i%2+1,(r=this.maxValue(this.tablero,i,a-1,o,t))<n&&(n=r),this.tablero.posiciones[c][l]=p.Vacio,n<=o)return n;n<t&&(t=n)}return n}},{key:"jugarHumano",value:function(e){this.tablero.imprimirTablero();for(var i,o=[],t=0;t<this.tablero.posiciones[0].length;t++)this.tablero.posiciones[this.tablero.posiciones.length-1][t]===p.Vacio&&o.push(t);do{var s=a(14)();console.log(o),i=parseInt(s("Cual es su jugada? "))}while(!(i in o));for(var r=this.tablero.posiciones.length-1;r>0&&this.tablero.posiciones[r-1][i]===p.Vacio;)r--;this.tablero.posiciones[r][i]=e}},{key:"jugarVsHumano",value:function(){var e=this.jugadorAgente,i=e%2+1,a=1,o=this.turnosMaximos;do{if(a===e?this.jugarElitista(e):this.jugarHumano(i),this.gameResult=this.tablero.calcularResultado(),this.gameResult>0){this.gameResult.valueOf()!==e.valueOf()?console.log("Felicidades! Usted ha ganado."):this.gameResult.valueOf()===e.valueOf()&&(this.tablero.imprimirTablero(),console.log("Felicidades! Su agente ha ganado."));break}a=2-a+1,o--}while(o>0)}}]),e}(),V=function(e){var i=e.fichaValor;return Object(N.jsx)("div",{className:"Agujero",children:Object(N.jsx)("div",{className:p[i]})})},T=function(e){var i=e.handleClick,a=e.agujeros;return Object(N.jsx)("div",{className:"Columna",onClick:function(){return i()},children:Object(O.a)(Array(a.length)).map((function(e,i){return Object(N.jsx)(V,{fichaValor:a[i]},i)})).reverse()})},G=function(e){var i=e.parametros,a=p.Amarillo,s=p.Rojo,r=Object(t.useState)(new d),n=Object(l.a)(r,2),c=n[0],h=n[1],u=Object(t.useState)(p.Rojo),b=Object(l.a)(u,2),f=b[0],m=b[1],j=Object(t.useState)(R.SinSeleccionar),v=Object(l.a)(j,2),A=v[0],V=v[1],G=Object(t.useState)(""),M=Object(l.a)(G,2),_=M[0],I=M[1],k=function(e){V(e),h(new d),m(p.Rojo)},y=Object(O.a)(Array(c.posiciones[0].length)).map((function(e,i){return Object(N.jsx)(T,{handleClick:function(){return function(e){if(c.verificarColumnaLibre(e)&&c.calcularResultado()===g.SinGanador){var i=new d;i.posiciones=JSON.parse(JSON.stringify(c.posiciones)),i.tirarFicha(e,f),h(i),m(f===p.Rojo?p.Amarillo:p.Rojo)}else console.log("Movimiento invalido")}(i)},agujeros:c.posiciones.map((function(e){return e[i]}))},i)})),F=""!==_?"mensajeGanador aparecer":"mensajeGanador";return Object(t.useEffect)((function(){switch(c.calcularResultado()){case g.Empate:I("ninguno");break;case g.GanadorRojo:I("Rojo");break;case g.GanadorAmarillo:I("Amarillo");break;case g.SinGanador:if(A===R.Estrategia&&f===a){var e=function(e,i,a){var t,s=new d;switch(s.posiciones=JSON.parse(JSON.stringify(e.posiciones)),i.estrategia){case o.Minimax:t=new x(i.nivel);break;case o.Alfabeta:t=new S(i.nivel);break;case o.RLAgent:(t=E.Agente).reset(!1);break;default:t=new x(i.nivel)}return t.tablero=s,t.jugarElitista(a),t.tablero}(c,i,f);h(e),m(s)}}}),[f,c]),Object(N.jsxs)("div",{className:"TableroGrafico",children:[A!==R.SinSeleccionar&&Object(N.jsx)("div",{className:"Tablero",children:y}),A===R.SinSeleccionar&&Object(N.jsxs)("div",{children:[Object(N.jsx)("button",{className:"btn btn-primary mx-3",onClick:function(){return k(R.Humano)},children:"Jugar Humano"}),Object(N.jsx)("button",{className:"btn btn-primary mx-3",onClick:function(){return k(R.Estrategia)},children:"Jugar Estrategia"})]}),Object(N.jsxs)("div",{className:F,children:["Gana ",_,"!"]})]})},M=function e(){Object(m.a)(this,e),this.estrategia=o.Minimax,this.nivel=3,this.qRate=.5},_=["Minimax","RLAgent","Banana"];var I=function(){var e=Object(t.useState)(new M),i=Object(l.a)(e,2),a=i[0],o=i[1];return Object(N.jsx)("div",{className:"App p-3",children:Object(N.jsxs)(c.a,{children:[Object(N.jsx)("h3",{className:"text-start h2 mb-3",children:"Connect-4"}),Object(N.jsx)("hr",{}),Object(N.jsx)("h4",{children:"Par\xe1metros del problema"}),Object(N.jsx)(h.a,{className:"mt-3",children:Object(N.jsx)(A,{onElegirEstrategia:function(e){o(e)},onLimpiarTablero:function(){},algoritmos:_})}),Object(N.jsx)("hr",{}),Object(N.jsx)("h4",{children:"Tablero"}),Object(N.jsx)(h.a,{className:"mt-3",children:Object(N.jsx)(G,{parametros:a})}),Object(N.jsx)("hr",{}),Object(N.jsx)("h4",{children:"Resultados"}),Object(N.jsx)(h.a,{className:"mt-3"})]})})},k=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,45)).then((function(i){var a=i.getCLS,o=i.getFID,t=i.getFCP,s=i.getLCP,r=i.getTTFB;a(e),o(e),t(e),s(e),r(e)}))};n.a.render(Object(N.jsx)(s.a.StrictMode,{children:Object(N.jsx)(I,{})}),document.getElementById("root")),k()}},[[40,1,2]]]);
//# sourceMappingURL=main.7e11e36b.chunk.js.map