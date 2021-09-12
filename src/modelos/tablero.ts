import { Ficha } from "./ficha";

export default class Tablero {
    posiciones: Ficha[][]

    constructor() {
        // Crear la matrix llena de espacios vacios
        this.posiciones = Array(6).fill(undefined).map( () => Array(7).fill(Ficha.Vacio));
    }

    vaciarTablero(): void {
        // Vacia el tablero
        this.posiciones = Array(6).fill(undefined).map( () => Array(7).fill(Ficha.Vacio));
    }
}