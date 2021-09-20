import Tablero from "../modelos/tablero";
import {Estrategia} from "../modelos/estrategia";
import {Ficha} from "../modelos/ficha";
import {Modo} from "../modelos/modo";
import configuracionParametros from "../modelos/configuracionParametros";
import MinMax from "./MinMax";
import AlfaBeta from "./AlfaBeta";
import RLAgent from "./RLAgent";
import {ResultadoEjecucion} from "../modelos/ResultadoEjecucion";

export const jugarEstrategia = (tablero: Tablero,
								parametros: configuracionParametros,
								jugador: Ficha,
								modo: Modo): [Tablero, ResultadoEjecucion] => {
    const nuevoTablero = new Tablero();
    nuevoTablero.posiciones = JSON.parse(JSON.stringify(tablero.posiciones)); // Copiar posiciones

    // Seleccionar estrategia
    let agente: MinMax | AlfaBeta | RLAgent;
	let estrategia: Estrategia;

	if (modo === Modo.Humano || modo === Modo.Estrategia || jugador === Ficha.Amarillo){
		estrategia = parametros.estrategiaA;
		switch (parametros.estrategiaA) {
			case Estrategia.Minimax:
				agente = new MinMax(parametros.nivelA);
				break
			case Estrategia.Alfabeta:
				agente = new AlfaBeta(parametros.nivelA);
				break
			case Estrategia.RLAgent:
				agente = RLAgent.Agente;
				agente.reset(false);
				break
			default:
				agente = new MinMax(parametros.nivelA);
				break
		}
	} else {
		estrategia = parametros.estrategiaB;
		switch (parametros.estrategiaB) {
			case Estrategia.Minimax:
				agente = new MinMax(parametros.nivelB);
				break
			case Estrategia.Alfabeta:
				agente = new AlfaBeta(parametros.nivelB);
				break
			case Estrategia.RLAgent:
				agente = RLAgent.AgenteB;
				agente.reset(false);
				break
			default:
				agente = new MinMax(parametros.nivelB);
				break
		}
	}

    // Configurar agente
    agente.tablero = nuevoTablero;

    // Realizar jugada elitista / validación
	let t0 = performance.now();
    agente.jugarElitista(jugador);
	let t1 = performance.now();

	let res = new ResultadoEjecucion(agente.n, estrategia, t1-t0, agente.expansiones);

    return [agente.tablero, res];
}