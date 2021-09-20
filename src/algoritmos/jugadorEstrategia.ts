import Tablero from "../modelos/tablero";
import {Estrategia} from "../modelos/estrategia";
import {Ficha} from "../modelos/ficha";
import configuracionParametros from "../modelos/configuracionParametros";
import MinMax from "./MinMax";
import AlfaBeta from "./AlfaBeta";
import RLAgent from "./RLAgent";

export const jugarEstrategia = (tablero: Tablero, parametros: configuracionParametros, jugador: Ficha): Tablero => {
    const nuevoTablero = new Tablero();
    nuevoTablero.posiciones = JSON.parse(JSON.stringify(tablero.posiciones)); // Copiar posiciones

    // Seleccionar estrategia
    let agente: MinMax | AlfaBeta | RLAgent;

	switch (parametros.estrategia) {
		case Estrategia.Minimax:
			agente = new MinMax(parametros.nivel);
			break
		case Estrategia.Alfabeta:
			agente = new AlfaBeta(parametros.nivel);
			break
		case Estrategia.RLAgent:
			agente = RLAgent.Agente;
			agente.reset(false);
			break
		default:
			agente = new MinMax(parametros.nivel);
			break
	}

    // Configurar agente
    agente.tablero = nuevoTablero;

    // Realizar jugada elitista / validación
    agente.jugarElitista(jugador);

    return agente.tablero;
}