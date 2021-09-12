export default class Tablero {
    posiciones: number[][]

    constructor() {
        // Crear la matrix llena de ceros
        this.posiciones = Array(6).fill(0).map( () => Array(7).fill(0));
    }

    vaciarTablero(): void {
        // Vacia el tablero
        this.posiciones = Array(6).fill(0).map( () => Array(7).fill(0));
    }
}