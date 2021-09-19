import Tablero from "../modelos/tablero";
import {Estrategia} from "../modelos/estrategia";
import {Ficha} from "../modelos/ficha";
import configuracionParametros from "../modelos/configuracionParametros";
import MinMax from "./MinMax";

export const jugarEstrategia = (tablero: Tablero, parametros: configuracionParametros, jugador: Ficha): Tablero => {
    const nuevoTablero = new Tablero();
    nuevoTablero.posiciones = JSON.parse(JSON.stringify(tablero.posiciones)); // Copiar posiciones

    // Seleccionar estrategia
    let agente: MinMax;

    switch (parametros.estrategia) {
        case Estrategia.Minimax:
            agente = new MinMax(parametros.nivel);
            break
        case Estrategia.Alfabeta:
            // TODO: Alfabeta
            agente = new MinMax(parametros.nivel);
            break
        case Estrategia.RLAgent:
            // TODO: RL Agent
            agente = new MinMax(parametros.nivel);
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