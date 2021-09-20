import {Estrategia} from "./estrategia";

export class ResultadoEjecucion {
    n: number;
    algoritmo: Estrategia;
    tiempo: number;
    nodos_expandidos: number;


    constructor(n: number, algoritmo: Estrategia, tiempo: number, nodos_expandidos: number) {
        this.n = n;
        this.algoritmo = algoritmo;
        this.tiempo = tiempo;
        this.nodos_expandidos = nodos_expandidos;
    }
}