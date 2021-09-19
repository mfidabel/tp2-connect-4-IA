import {Ficha} from "./ficha";
import {Resultado} from "./resultado";

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

    calcularResultado(): Resultado {
        let conecta = 0;
        let anterior;

        // Recorre el tablero horizontalmente
        for (let i = 0; i < this.posiciones.length; i++) {
            anterior = 0;
            for (let j = 0; j < (this.posiciones)[0].length; j++) {
                let actual = (this.posiciones)[i][j];
                if (actual === anterior) conecta++;
                else conecta = 1;
                if (conecta === 4 && (actual === Ficha.Rojo || actual === Ficha.Amarillo)) {
                    // Retornamos el Ganador
                    return actual === Ficha.Rojo ? Resultado.GanadorRojo : Resultado.GanadorAmarillo;
                }
                anterior = actual;
            }
        }

        // Recorre el tablero verticalmente
        for (let i = 0; i < this.posiciones[0].length; i++) {
            anterior = 0;
            for (let j = 0; j < this.posiciones.length; j++) {
                let actual = this.posiciones[j][i];
                if (actual === anterior) conecta++;
                else conecta = 1;
                if (conecta === 4 && (actual === Ficha.Rojo || actual === Ficha.Amarillo)) {
                    // Retornamos el ganador
                    return actual === Ficha.Rojo ? Resultado.GanadorRojo : Resultado.GanadorAmarillo;
                }
                anterior = actual;
            }
        }

        // Recorre la diagonal secundaria
        for (let i = 3; i < this.posiciones.length + this.posiciones[0].length - 4; i++) {
            anterior = 0;
            for (let j = Math.max(0, i - this.posiciones.length + 1); j < Math.min(i+1, this.posiciones[0].length); j++) {
                let actual = this.posiciones[i-j][j];
                if (actual === anterior) conecta++;
                else conecta = 1;
                if (conecta === 4 && (actual === Ficha.Rojo || actual === Ficha.Amarillo)) {
                    return actual === Ficha.Rojo ? Resultado.GanadorRojo : Resultado.GanadorAmarillo;
                }
                anterior = actual;
            }
        }

        // Recorre la diagonal primaria
        for (let i = 3; i < this.posiciones.length + this.posiciones[0].length - 4; i++) {
            anterior = 0;
            for (let j = Math.max(0, i - this.posiciones.length + 1); j < Math.min(i+1, this.posiciones[0].length); j++) {
                let actual = this.posiciones[this.posiciones.length-1-i+j][j];
                if (actual === anterior) conecta++;
                else conecta = 1;
                if (conecta === 4 && (actual === Ficha.Rojo || actual === Ficha.Amarillo)) {
                    return actual === Ficha.Rojo ? Resultado.GanadorRojo : Resultado.GanadorAmarillo;
                }
                anterior = actual;
            }
        }

        // Quedan espacios vacios, no hay ganador
        for (let i = 0; i < this.posiciones[0].length; i++) {
            if (this.posiciones[0][i] === 0 || this.posiciones[this.posiciones.length-1][i] === 0)
                return Resultado.SinGanador;
        }

        // Empate
        return Resultado.Empate;
    }

    imprimirTablero() {
        for (let i = this.posiciones.length-1; i >= 0; i--) {
            let line = "|";
            for (let j = 0; j < this.posiciones[0].length; j++) {
                line = line.concat(`${this.posiciones[i][j].valueOf()}`).concat("|");
            }
            console.log(line);
        }
    }

    tirarFicha(columna: number, jugador: Ficha) {
        if (columna > this.posiciones[0].length) {
            console.error("No existe la columna");
            return;
        }

        if (!this.verificarColumnaLibre(columna)) {
            console.error("No se puede colocar aca")
            return;
        }

        // Encontrar primera fila donde se pueda tirar la ficha
        let idxFila = this.posiciones.findIndex( fila => fila[columna] === Ficha.Vacio )

        this.posiciones[idxFila][columna] = jugador; // Asignar
    }

    verificarColumnaLibre(columna: number): Boolean {
        if (columna > this.posiciones[0].length) {
            console.error("No existe la columna");
            return false;
        }

        return this.posiciones[this.posiciones.length-1][columna] === Ficha.Vacio;
    }
}