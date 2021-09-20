import Tablero from "../modelos/tablero";
import {Estrategia} from "../modelos/estrategia";
import {Ficha} from "../modelos/ficha";
import {Modo} from "../modelos/modo";
import configuracionParametros from "../modelos/configuracionParametros";
import MinMax from "./MinMax";
import AlfaBeta from "./AlfaBeta";
import RLAgent from "./RLAgent";

export const jugarEstrategia = (tablero: Tablero, parametros: configuracionParametros, jugador: Ficha, modo: Modo): Tablero => {
    const nuevoTablero = new Tablero();
    nuevoTablero.posiciones = JSON.parse(JSON.stringify(tablero.posiciones)); // Copiar posiciones

    // Seleccionar estrategia
    let agente: MinMax | AlfaBeta | RLAgent;
	
	if (modo === Modo.Humano || modo === Modo.Estrategia || jugador === Ficha.Amarillo){
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
	}else{
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
    agente.jugarElitista(jugador);

    return agente.tablero;
}