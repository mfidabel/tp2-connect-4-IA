import {ficha2Resultado, Resultado} from "../modelos/resultado";
import Tablero from "../modelos/tablero";
import {Ficha} from "../modelos/ficha";
import MinMax from "../algoritmos/MinMax";
import AlfaBeta from "../algoritmos/AlfaBeta";

export const MiniMaxVsAlfaBeta = (totalGamesCount = 100, n_minimax = 3, n_alfabeta = 3,
                                  inicia = Ficha.Amarillo) => {
    let winsMinimax = 0;
    let winsAlfaBeta = 0;
    let draws = 0;
    let FICHA_MINIMAX = Ficha.Rojo;
    let FICHAS_ALFABETA = Ficha.Amarillo;

    for (let i = 0; i < totalGamesCount; i++) {
        let tablero = new Tablero();
        let resultado = tablero.calcularResultado();
        let turno = inicia
        let agente: MinMax | AlfaBeta;

        do {
            if (turno === FICHA_MINIMAX) {
                agente = new MinMax(n_minimax);
            } else {
                agente = new AlfaBeta(n_alfabeta);
            }

            agente.tablero = tablero;
            agente.jugarElitista(turno);
            tablero = agente.tablero;

            turno = turno === Ficha.Rojo ? Ficha.Amarillo : Ficha.Rojo;

            resultado = tablero.calcularResultado();
        } while (resultado === Resultado.SinGanador); // Hasta que termine

        switch (resultado) {
            case ficha2Resultado(FICHA_MINIMAX):
                winsMinimax++;
                break
            case ficha2Resultado(FICHAS_ALFABETA):
                winsAlfaBeta++;
                break
            default:
                draws++;
        }
    }

    console.log(`>>>>>>>>>>>>>>> Minimax(${n_minimax}) vs Alfabeta(${n_alfabeta})`);
    console.log("Minimax W/T: " + winsMinimax / totalGamesCount);
    console.log("Alfabeta W/T: " + winsAlfaBeta / totalGamesCount);
    console.log("D/T: " + draws / totalGamesCount);
}
