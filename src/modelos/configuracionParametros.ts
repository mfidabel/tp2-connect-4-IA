import {Estrategia} from "./estrategia";

export default class configuracionParametros {
    estrategia: Estrategia = Estrategia.Minimax;
    nivel: number = 3;
    qRate: number = 0.5;
}