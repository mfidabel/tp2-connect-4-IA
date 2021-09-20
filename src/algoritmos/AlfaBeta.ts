import Tablero from "../modelos/tablero";
import {Ficha} from "../modelos/ficha";
import {Resultado} from "../modelos/resultado";

export default class AlfaBeta {
    n: number
    tablero: Tablero = new Tablero();
    jugadorAgente = Ficha.Rojo;
    turnosMaximos = 42;
    gameResult: Resultado = Resultado.SinGanador;
    expansiones: number = 0;

    constructor(n: number) {
        this.n = n;
    }

    reset() {
        this.tablero = new Tablero();
        this.gameResult = Resultado.SinGanador;
    }

    calcularF(tablero: Tablero, jugador: Ficha): number {
        let count: number[] = Array(3).fill(0);

        // Recorre el tablero horizontalmente
        for (let i = 0; i < tablero.posiciones.length; i++) {
            let libre = false;
            let conecta = 0;
            let anterior = -1;
            for (let j = 0; j < tablero.posiciones[0].length; j++) {
                let actual = tablero.posiciones[i][j];
                if (actual === anterior && actual !== Ficha.Vacio) {
                    conecta++;
                } else {
                    if ((libre || actual === Ficha.Vacio) && conecta > 0) {
                        if (actual === jugador) {
                            if (conecta > 3) return Number.MAX_SAFE_INTEGER;
                            count[conecta - 1]++;
                        } else {
                            if (conecta > 3) return Number.MIN_SAFE_INTEGER;
                            count[conecta - 1]--;
                        }
                    }
                    libre = actual === Ficha.Vacio;
                    conecta = 0;
                }
                anterior = actual;
            }
        }

        // Recorre el tablero verticalmente
        for (let i = 0; i < tablero.posiciones[0].length; i++) {
            let libre = false;
            let conecta = 0;
            let anterior = -1;
            for (let j = 0; j < tablero.posiciones.length; j++) {
                let actual = tablero.posiciones[j][i];
                if (actual === anterior && actual !== Ficha.Vacio) {
                    conecta++;
                } else {
                    if ((libre || actual === Ficha.Vacio) && conecta > 0) {
                        if (actual === jugador) {
                            if (conecta > 3) return Number.MAX_SAFE_INTEGER;
                            count[conecta - 1]++;
                        } else {
                            if (conecta > 3) return Number.MIN_SAFE_INTEGER;
                            count[conecta - 1]--;
                        }
                    }
                    libre = (actual === Ficha.Vacio);
                    conecta = 0;
                }
                anterior = actual;
            }
        }

        // Recorre la diagonal secundaria
        for (let i = 3; i < tablero.posiciones.length + tablero.posiciones[0].length - 4; i++) {
            let libre = false;
            let conecta = 0;
            let anterior = -1;
            for (let j = Math.max(0, i - tablero.posiciones.length + 1); j < Math.min(i + 1, tablero.posiciones[0].length); j++) {
                let actual = tablero.posiciones[i - j][j];
                if (actual === anterior && actual !== Ficha.Vacio) {
                    conecta++;
                } else {
                    if ((libre || actual === Ficha.Vacio) && conecta > 0) {
                        if (actual === jugador) {
                            if (conecta > 3) return Number.MAX_SAFE_INTEGER;
                            count[conecta - 1]++;
                        } else {
                            if (conecta > 3) return Number.MIN_SAFE_INTEGER;
                            count[conecta - 1]--;
                        }
                    }
                    libre = (actual === Ficha.Vacio);
                    conecta = 0;
                }
                anterior = actual;
            }
        }

        // Recorre la diagonal primaria
        for (let i = 3; i < tablero.posiciones.length + tablero.posiciones[0].length - 4; i++) {
            let libre = false;
            let conecta = 0;
            let anterior = -1;
            for (let j = Math.max(0, i - tablero.posiciones.length + 1); j < Math.min(i + 1, tablero.posiciones[0].length); j++) {
                let actual = tablero.posiciones[tablero.posiciones.length - 1 - i + j][j];
                if (actual === anterior && actual !== Ficha.Vacio) {
                    conecta++;
                } else {
                    if ((libre || actual === Ficha.Vacio) && conecta > 0) {
                        if (actual === jugador) {
                            if (conecta > 3) return Number.MAX_SAFE_INTEGER;
                            count[conecta - 1]++;
                        } else {
                            if (conecta > 3) return Number.MIN_SAFE_INTEGER;
                            count[conecta - 1]--;
                        }
                    }
                    libre = (actual === Ficha.Vacio);
                    conecta = 0;
                }
                anterior = actual;
            }
        }

        // calcula la suma ponderada
        let pesos = [0.25, 0.5, 1.0];
        return count.reduce((r, a, i) => r + a * pesos[i], 0);
    }

    jugarElitista(jugador: Ficha): void {
        let prob = 0, columna = 0, columnas: number[] = [];
        let maxProb = Number.MIN_SAFE_INTEGER;

        // Elegir fila disponible con max reward
        for (let j = 0; j < this.tablero.posiciones[0].length; j++) {
            if (this.tablero.posiciones[this.tablero.posiciones.length - 1][j] !== Ficha.Vacio) continue;
            let i = this.tablero.posiciones.length - 1;
            while (i > 0 && this.tablero.posiciones[i - 1][j] === Ficha.Vacio) i--;

            this.expansiones++;
            this.tablero.posiciones[i][j] = jugador;
            prob = this.minValue(this.tablero, jugador, this.n, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

            if (prob > maxProb) {
                maxProb = prob;
                columnas = [j];
            } else if (prob === maxProb) {
                columnas.push(j);
            }
            this.tablero.posiciones[i][j] = 0;
        }

        // Rompe empates entre columnas
        if (columnas.length === 1) {
            columna = columnas[0];
        } else {
            if (columnas.length === 0) {
                for (let i = 0; i < this.tablero.posiciones[0].length; i++) {
                    if (this.tablero.posiciones[this.tablero.posiciones.length-1][i] === 0) {
                        columnas.push(i);
                    }
                }
            }
            columna = columnas[Math.floor(Math.random() * columnas.length)];
        }

        // Aplicar jugada
        let fila = this.tablero.posiciones.length - 1;
        while (fila > 0 && this.tablero.posiciones[fila - 1][columna] === Ficha.Vacio) fila--;
        this.tablero.posiciones[fila][columna] = jugador;
    }

    maxValue(tablero: Tablero, jugador: Ficha, n: number, alfa: number, beta: number): number {
        if (n === 0) return this.calcularF(tablero, jugador);
        let resultado = tablero.calcularResultado();
        if (resultado.valueOf() === jugador.valueOf()) return Number.MAX_SAFE_INTEGER;
        else if (resultado.valueOf() === (jugador % 2) + 1) return Number.MIN_SAFE_INTEGER;

        let prob;
        let maxProb = Number.MIN_SAFE_INTEGER;

        // elegir fila disponible con max reward
        for (let j = 0; j < this.tablero.posiciones[0].length; j++) {
            if (this.tablero.posiciones[this.tablero.posiciones.length - 1][j] !== Ficha.Vacio) continue;
            let i = this.tablero.posiciones.length - 1;
            while (i > 0 && this.tablero.posiciones[i - 1][j] === Ficha.Vacio) i--;

            if (n > 1) this.expansiones++; // Los nodos objetivos no se expanden
            this.tablero.posiciones[i][j] = jugador;
            prob = this.minValue(this.tablero, jugador, n - 1, alfa, beta);
            if (prob > maxProb) {
                maxProb = prob;
                //columna = j;
            }
            this.tablero.posiciones[i][j] = Ficha.Vacio;

            // Podar
            if (maxProb >= beta) return maxProb;
            if (maxProb > alfa) alfa = maxProb;
        }

        return maxProb;
    }

    minValue(tablero: Tablero, jugador: Ficha, n: number, alfa: number, beta: number): number {
        if (n === 0) return this.calcularF(tablero, jugador);
        let resultado = tablero.calcularResultado();
        if (resultado.valueOf() === jugador.valueOf()) return Number.MAX_SAFE_INTEGER;
        else if (resultado === (jugador % 2) + 1) return Number.MIN_SAFE_INTEGER;

        let prob = 0;
        let minProb = Number.MAX_SAFE_INTEGER;

        // elegir fila disponible con min reward
        for (let j = 0; j < this.tablero.posiciones[0].length; j++) {
            if (this.tablero.posiciones[this.tablero.posiciones.length - 1][j] !== Ficha.Vacio) continue;
            let i = this.tablero.posiciones.length - 1;
            while (i > 0 && this.tablero.posiciones[i - 1][j] === Ficha.Vacio) i--;

            if (n > 1) this.expansiones++; // Los nodos objetivos no se expanden
            this.tablero.posiciones[i][j] = (jugador % 2) + 1;
            prob = this.maxValue(this.tablero, jugador, n - 1, alfa, beta);
            if (prob < minProb) {
                minProb = prob;
                //columna = j;
            }
            this.tablero.posiciones[i][j] = Ficha.Vacio;

            if (minProb <= alfa) return minProb;
            if (minProb < beta) beta = minProb;
        }

        return minProb;
    }

    jugarHumano(jugador: Ficha): void {
        // lee una casilla disponible
        this.tablero.imprimirTablero();
        let columnas = [];
        for (let i = 0; i < this.tablero.posiciones[0].length; i++) {
            if (this.tablero.posiciones[this.tablero.posiciones.length-1][i] === Ficha.Vacio) {
                columnas.push(i);
            }
        }
        let columna;
        do {
            const prompt = require('prompt-sync')();
            console.log(columnas);
            columna = parseInt(prompt('Cual es su jugada? '));
        } while (!(columna in columnas));

        // aplicar jugada
        let fila = this.tablero.posiciones.length - 1;
        while (fila > 0 && this.tablero.posiciones[fila-1][columna] === Ficha.Vacio) fila--;
        this.tablero.posiciones[fila][columna] = jugador;
    }

    jugarVsHumano(): void {
        let jugador = this.jugadorAgente;
        let contrario = (jugador % 2) + 1;
        let turno = 1;
        let jugadas = this.turnosMaximos;

        do {
            if (turno === jugador) {
                this.jugarElitista(jugador);
            } else {
                this.jugarHumano(contrario);
            }

            //actualizar resultado
            this.gameResult = this.tablero.calcularResultado();
            if (this.gameResult > 0) { //ya hay resultado
                if (this.gameResult.valueOf() !== jugador.valueOf()) //perdimos, actualizar tablero
                {
                    console.log("Felicidades! Usted ha ganado.");
                } else if (this.gameResult.valueOf() === jugador.valueOf()) {
                    this.tablero.imprimirTablero();
                    console.log("Felicidades! Su agente ha ganado.");
                }
                break;
            }

            turno = 2 - turno + 1;
            jugadas--;
        } while (jugadas > 0);
    }
}