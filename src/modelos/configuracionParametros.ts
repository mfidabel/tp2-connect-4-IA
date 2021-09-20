import {Estrategia} from "./estrategia";

export default class configuracionParametros {
    estrategiaA: Estrategia = Estrategia.Minimax;
    nivelA: number = 3;
    qRateA: number = 0.5;
	estrategiaB: Estrategia = Estrategia.Minimax;
    nivelB: number = 3;
    qRateB: number = 0.5;
}