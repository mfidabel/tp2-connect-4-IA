import {Ficha} from "../modelos/ficha";
import Tablero from "../modelos/tablero";
import {ficha2Resultado, Resultado} from "../modelos/resultado";

export default class RLAgent {
    // Agente
    static Agente: RLAgent = new RLAgent(10000)

    // Variables
    n: number;
    tablero: Tablero = new Tablero();
    lastTablero: Tablero = new Tablero();
    entrenar: boolean = false;
    jugadorAgente: Ficha = Ficha.Rojo;
    alpha: number = 0.7;
    turnosMaximos: number = 42;
    gameResult: Resultado = Resultado.SinGanador;
    lookupTable: Map<string, number> = new Map<string, number>();
    qRate: number = 0.5;
    expansiones: number = 0;

    constructor(n: number) {
        this.n = n;
    }

    reset(entrenar: boolean) {
        this.tablero = new Tablero();
        this.lastTablero = new Tablero();
        this.entrenar = entrenar;
        this.gameResult = Resultado.SinGanador;
    }

    resetLearning() {
        this.lookupTable = new Map<string, number>();
    }

    calcularR(tablero: Tablero, jugador: Ficha) {
        let contrario = jugador === Ficha.Rojo ? Ficha.Amarillo : Ficha.Rojo;

        let result = tablero.calcularResultado();

        switch (result) {
            case ficha2Resultado(jugador):
                // Gana el jugador
                return 1.0;
            case ficha2Resultado(contrario):
                // Gana el contrario
                return 0.0;
            case Resultado.Empate:
                // Sale empate
                return 0.0;
            default:
                // No hay ganador
                return this.getProbability(tablero);
        }
    }

    getProbability(tablero: Tablero): number {
        this.expansiones++;
        let tableroSerializado = tablero.posiciones.toString();

        if (!this.lookupTable.has(tableroSerializado)) {
            this.lookupTable.set(tableroSerializado, 0.5);
        }

        return this.lookupTable.get(tableroSerializado)!;
    }

    updateProbability(tablero: Tablero, nextStateProb: number, jugador: Ficha) {
        let prob = this.calcularR(tablero, jugador);
        prob = prob + this.alpha * (nextStateProb - prob);

        let tableroSerializado = tablero.toString();
        this.lookupTable.set(tableroSerializado, prob);
    }

    jugarElitista(jugador: Ficha) {
        let prob, columna = 0;
        let maxProb = Number.MIN_SAFE_INTEGER;

        // elegir fila disponible con max reward
        for (let j = 0; j < this.tablero.posiciones[0].length; j++) {
            if (this.tablero.posiciones[this.tablero.posiciones.length-1][j] !== Ficha.Vacio) continue;
            let i = this.tablero.posiciones.length-1;
            while (i > 0 && this.tablero.posiciones[i-1][j] === Ficha.Vacio) i--;

            this.tablero.posiciones[i][j] = jugador;
            prob = this.calcularR(this.tablero, jugador);
            if (prob > maxProb) {
                maxProb = prob;
                columna = j;
            }
            this.tablero.posiciones[i][j] = 0;
        }

        // entrenar
        if (this.entrenar) {
            this.updateProbability(this.lastTablero, maxProb, jugador);
        }

        // aplicar jugada
        let fila = this.tablero.posiciones.length - 1;
        while (fila > 0 && this.tablero.posiciones[fila-1][columna] === Ficha.Vacio) fila--;
        this.tablero.posiciones[fila][columna] = jugador;

        // actualizar ultimo tablero
        this.copiarTablero(this.tablero, this.lastTablero);
    }

    jugarRandom(jugador: Ficha) { // Diversificación
        // Elegir casillas disponibles al azar
        let columnas = [];
        for (let i = 0; i < this.tablero.posiciones[0].length; i++) {
            if (this.tablero.posiciones[this.tablero.posiciones.length-1][i] === Ficha.Vacio) {
                columnas.push(i);
            }
        }
        let columna = columnas[Math.floor(Math.random() * columnas.length)];

        // aplicar jugada
        let fila = this.tablero.posiciones.length - 1;
        while (fila > 0 && this.tablero.posiciones[fila-1][columna] === Ficha.Vacio) fila--;
        this.tablero.posiciones[fila][columna] = jugador;

        //si es el agente, actualizar ultimo tablero
        if (jugador === this.jugadorAgente) {
            this.copiarTablero(this.tablero, this.lastTablero);
        }
    }

    jugarHumano(jugador: Ficha) {
        // lee una casilla disponible
        this.tablero.imprimirTablero()
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
            console.log(columna);
        } while (!(columna in columnas));

        // aplicar jugada
        let fila = this.tablero.posiciones.length - 1;
        while (fila > 0 && this.tablero.posiciones[fila-1][columna] === Ficha.Vacio) fila--;
        this.tablero.posiciones[fila][columna] = jugador;

        // si es el agente, actualizar ultimo tablero
        if (jugador === this.jugadorAgente) {
            this.copiarTablero(this.tablero, this.lastTablero);
        }
    }

    copiarTablero(tableroOrigen: Tablero, tableroDestino: Tablero) {
        for (let i = 0; i < tableroOrigen.posiciones.length; i++) {
            for (let j = 0; j < tableroOrigen.posiciones[0].length; j++) {

                tableroDestino.posiciones[i][j] = tableroOrigen.posiciones[i][j];
            }
        }
    }

    updateAlpha(currentGame: number) {

        this.alpha = 0.5 - 0.49 * currentGame / this.n;
    }

    jugarVsRandom() {

        let jugador = this.jugadorAgente;
        let contrario = (jugador % 2) + 1;
        let turno = 1;
        let jugadas = this.turnosMaximos;
        let q;
        do {
            if (turno === jugador) {
                q = Math.random();
                if (q <= this.qRate || !this.entrenar) { // en train, juega basado en qrate
                    this.jugarElitista(jugador);         // en validation, juega siempre elitista
                } else {
                    this.jugarRandom(jugador);
                }
            } else {
                this.jugarRandom(contrario);
            }

            // actualizar resultado
            this.gameResult = this.tablero.calcularResultado();
            if (this.gameResult > 0) { // ya hay resultado
                if (this.gameResult !== ficha2Resultado(jugador) && this.entrenar) { // perdimos, actualizar tablero
                    this.updateProbability(this.lastTablero, this.calcularR(this.tablero, jugador), jugador);
                }
                break;
            }

            turno = 2 - turno + 1;
            jugadas--;
        } while (jugadas > 0);

    }

    jugarVsHumano() {

        let jugador = this.jugadorAgente;
        let contrario = (jugador % 2) + 1;
        let turno = 1;
        let jugadas = this.turnosMaximos;
        do {
            if (turno === jugador) {
                this.jugarRandom(jugador);
            } else {
                this.jugarHumano(contrario);
            }

            //actualizar resultado
            this.gameResult = this.tablero.calcularResultado();
            if (this.gameResult > 0) { //ya hay resultado
                if (this.gameResult !== ficha2Resultado(jugador) && this.entrenar) //perdimos, actualizar tablero
                {
                    this.updateProbability(this.lastTablero, this.calcularR(this.tablero, jugador), jugador);
                    console.log("Felicidades! Usted ha ganado.");
                } else if (this.gameResult === ficha2Resultado(jugador)) {
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