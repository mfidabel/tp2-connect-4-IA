import RLAgent from "../algoritmos/RLAgent";
import {ficha2Resultado} from "../modelos/resultado";
import {Estrategia} from "../modelos/estrategia";

export const MiniMaxVsRL = (trainingCount = 10000,
                            totalGamesCount = 100,
                            totalExperiments = 10,
                            qRates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
                            nivel = 2,
                            estrategia: Estrategia.Minimax | Estrategia.Alfabeta = Estrategia.Minimax) => {

    for (let q = 0; q < qRates.length; q++) {

        let winsRatioAcum = 0;
        let lossesRatioAcum = 0;
        let drawsRatioAcum = 0;
        let tiempoPromAcum = 0;
        for (let k = 0; k < totalExperiments; k++) {

            //TRAIN
            let ag = new RLAgent(trainingCount);
            ag.qRate = qRates[q];
            for (let i = 0; i < ag.n; i++) {
                ag.reset(true);
                ag.updateAlpha(i);
                ag.selfPlay();
            }

            if (totalGamesCount === 0) break;
            console.log(">>>>>>>>>>>>>>> AFTER TRAINING ");

            //VALIDATION
            let wins = 0;
            let losses = 0;
            let draws = 0;
            let tiempo = 0;
            let contrario = 2 - ag.jugadorAgente + 1;

            for (let i = 0; i < totalGamesCount; i++) {
                let t0 = performance.now();
                ag.reset(false);
                ag.jugarVsMinimax(nivel, estrategia);
                let t1 = performance.now();

                tiempo += t1-t0;

                if (ag.gameResult === ficha2Resultado(ag.jugadorAgente)) {
                    wins++;
                } else if (ag.gameResult === contrario) {
                    losses++;
                } else {
                    draws++;
                }
            }

            winsRatioAcum += wins / totalGamesCount;
            lossesRatioAcum += losses / totalGamesCount;
            drawsRatioAcum += draws / totalGamesCount;
            tiempoPromAcum += tiempo / totalGamesCount;
        }
        console.log(">>>>>>>>>>>>>>> RATIO AVG, Q RATE: " + qRates[q]);
        console.log("Ratio Avg RL W/T: " + winsRatioAcum / totalExperiments);
        console.log("Ratio Avg MIN/AB W/T: " + lossesRatioAcum / totalExperiments);
        console.log("Ratio Avg D/T: " + drawsRatioAcum / totalExperiments);
        console.log("Ratio Avg Tiempo: " + tiempoPromAcum / totalExperiments);
    }
}