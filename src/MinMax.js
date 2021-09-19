const prompt = require('prompt-sync')();

class MinMax {
    constructor(n) {
        this.n = n;
        this.reset();
        this.jugadorAgente = 1;
        this.turnosMaximos = 42;
    }

    reset() {
        this.tablero = Array(6).fill().map(()=>Array(7).fill(0));
        this.gameResult = 0;
    }

    calculateResult(tablero) {
        // 1: gana jugador x
        // 2: gana jugador o
        // 3: empate
        // 0: no hay ganador

        let conecta = 0;
        let anterior;

        // recorre el tablero horizonalmente
        for (let i = 0; i < tablero.length; i++) {
            anterior = 0;
            for (let j = 0; j < tablero[0].length; j++) {
                let actual = tablero[i][j];
                if (actual == anterior) conecta++;
                else conecta = 1;
                if (conecta == 4 && (actual == 1 || actual == 2)) return actual;
                anterior = actual;
            }
        }

        // recorre el tablero verticalmente
        for (let i = 0; i < tablero[0].length; i++) {
            anterior = 0;
            for (let j = 0; j < tablero.length; j++) {
                let actual = tablero[j][i];
                if (actual == anterior) conecta++;
                else conecta = 1;
                if (conecta == 4 && (actual == 1 || actual == 2)) return actual;
                anterior = actual;
            }
        }

        // recorre la diagonal secundaria
        for (let i = 3; i < tablero.length + tablero[0].length - 4; i++) {
            anterior = 0;
            for (let j = Math.max(0, i - tablero.length + 1); j < Math.min(i+1, tablero[0].length); j++) {
                let actual = tablero[i-j][j];
                if (actual == anterior) conecta++;
                else conecta = 1;
                if (conecta == 4 && (actual == 1 || actual == 2)) return actual;
                anterior = actual;
            }
        }

        // recorre la diagonal primaria
        for (let i = 3; i < tablero.length + tablero[0].length - 4; i++) {
            anterior = 0;
            for (let j = Math.max(0, i - tablero.length + 1); j < Math.min(i+1, tablero[0].length); j++) {
                let actual = tablero[tablero.length-1-i+j][j];
                if (actual == anterior) conecta++;
                else conecta = 1;
                if (conecta == 4 && (actual == 1 || actual == 2)) return actual;
                anterior = actual;
            }
        }

        // quedan espacios vacios, no hay ganador
        for (let i = 0; i < tablero[0].length; i++) {
            if (tablero[0][i] == 0 || tablero[tablero.length-1][i] == 0)
                return 0;
        }

        // empate
        return 3;
    }

    calculateReward(tablero, jugador) {
        let count = Array(3).fill(0);

        // recorre el tablero horizonalmente
        for (let i = 0; i < tablero.length; i++) {
            let libre = false;
            let conecta = 0;
            let anterior = -1;
            for (let j = 0; j < tablero[0].length; j++) {
                let actual = tablero[i][j];
                if (actual == anterior && actual != 0) {
                    conecta++;
                } else {
                    if ((libre || actual == 0) && conecta > 0) {
                        if (actual == jugador) {
                            if (conecta > 3) return Number.MAX_SAFE_INTEGER;
                            count[conecta-1]++;
                        } else {
                            if (conecta > 3) return Number.MIN_SAFE_INTEGER;
                            count[conecta-1]--;
                        }
                    }
                    libre = actual == 0;
                    conecta = 0;
                }
                anterior = actual;
            }
        }

        // recorre el tablero verticalmente
        for (let i = 0; i < tablero[0].length; i++) {
            let libre = false;
            let conecta = 0;
            let anterior = -1;
            for (let j = 0; j < tablero.length; j++) {
                let actual = tablero[j][i];
                if (actual == anterior && actual != 0) {
                    conecta++;
                } else {
                    if ((libre || actual == 0) && conecta > 0) {
                        if (actual == jugador) {
                            if (conecta > 3) return Number.MAX_SAFE_INTEGER;
                            count[conecta-1]++;
                        } else {
                            if (conecta > 3) return Number.MIN_SAFE_INTEGER;
                            count[conecta-1]--;
                        }
                    }
                    libre = actual == 0;
                    conecta = 0;
                }
                anterior = actual;
            }
        }

        // recorre la diagonal secundaria
        for (let i = 3; i < tablero.length + tablero[0].length - 4; i++) {
            let libre = false;
            let conecta = 0;
            let anterior = -1;
            for (let j = Math.max(0, i - tablero.length + 1); j < Math.min(i+1, tablero[0].length); j++) {
                let actual = tablero[i-j][j];
                if (actual == anterior && actual != 0) {
                    conecta++;
                } else {
                    if ((libre || actual == 0) && conecta > 0) {
                        if (actual == jugador) {
                            if (conecta > 3) return Number.MAX_SAFE_INTEGER;
                            count[conecta-1]++;
                        } else {
                            if (conecta > 3) return Number.MIN_SAFE_INTEGER;
                            count[conecta-1]--;
                        }
                    }
                    libre = actual == 0;
                    conecta = 0;
                }
                anterior = actual;
            }
        }

        // recorre la diagonal primaria
        for (let i = 3; i < tablero.length + tablero[0].length - 4; i++) {
            let libre = false;
            let conecta = 0;
            let anterior = -1;
            for (let j = Math.max(0, i - tablero.length + 1); j < Math.min(i+1, tablero[0].length); j++) {
                let actual = tablero[tablero.length-1-i+j][j];
                if (actual == anterior && actual != 0) {
                    conecta++;
                } else {
                    if ((libre || actual == 0) && conecta > 0) {
                        if (actual == jugador) {
                            if (conecta > 3) return Number.MAX_SAFE_INTEGER;
                            count[conecta-1]++;
                        } else {
                            if (conecta > 3) return Number.MIN_SAFE_INTEGER;
                            count[conecta-1]--;
                        }
                    }
                    libre = actual == 0;
                    conecta = 0;
                }
                anterior = actual;
            }
        }

        // calcula la suma ponderada
        let pesos = [0.25, 0.5, 1.0];
        return count.reduce((r, a, i) => r+a*pesos[i], 0);
    }

    jugarElitista(jugador) { // max value

        let prob, columna = [];
        let maxProb = Number.MIN_SAFE_INTEGER;
        
        // elegir fila disponible con max reward
        for (let j = 0; j < this.tablero[0].length; j++) {
            if (this.tablero[this.tablero.length-1][j] != 0) continue;
            let i = this.tablero.length-1;
            while (i > 0 && this.tablero[i-1][j] == 0) i--;

            this.tablero[i][j] = jugador;
            prob = this.minValue(this.tablero, jugador, this.n);

            if (prob > maxProb) {
                maxProb = prob;
                columna = [j];
            } else if (prob == maxProb) {
                columna.push(j);
            }
            this.tablero[i][j] = 0;
        }

        // rompe empates entre columnas
        if (columna.length == 1) {
            columna = columna[0];
        } else {
            if (columna.length == 0) {
                for (let i = 0; i < this.tablero[0].length; i++) {
                    if (this.tablero[this.tablero.length-1][i] == 0) {
                        columna.push(i);
                    }
                }
            }
            columna = columna[Math.floor(Math.random() * columna.length)];
        }

        // aplicar jugada
        let fila = this.tablero.length - 1;
        while (fila > 0 && this.tablero[fila-1][columna] == 0) fila--;
        this.tablero[fila][columna] = jugador;
    }

    maxValue(tablero, jugador, n) {

        if (n == 0) return this.calculateReward(tablero, jugador);
        let resultado = this.calculateResult(this.tablero);
        if (resultado == jugador) return Number.MAX_SAFE_INTEGER;
        else if (resultado == (jugador % 2) + 1) return Number.MIN_SAFE_INTEGER;

        let prob, columna;
        let maxProb = Number.MIN_SAFE_INTEGER;
        
        // elegir fila disponible con max reward
        for (let j = 0; j < this.tablero[0].length; j++) {
            if (this.tablero[this.tablero.length-1][j] != 0) continue;
            let i = this.tablero.length-1;
            while (i > 0 && this.tablero[i-1][j] == 0) i--;

            this.tablero[i][j] = jugador;
            prob = this.minValue(this.tablero, jugador, n-1);
            if (prob > maxProb) {
                maxProb = prob;
                columna = j;
            }
            this.tablero[i][j] = 0;
        }

        return maxProb;
    }

    minValue(tablero, jugador, n) {

        if (n == 0) return this.calculateReward(tablero, jugador);
        let resultado = this.calculateResult(this.tablero);
        if (resultado == jugador) return Number.MAX_SAFE_INTEGER;
        else if (resultado == (jugador % 2) + 1) return Number.MIN_SAFE_INTEGER;

        let prob, columna;
        let minProb = Number.MAX_SAFE_INTEGER;
        
        // elegir fila disponible con min reward
        for (let j = 0; j < this.tablero[0].length; j++) {
            if (this.tablero[this.tablero.length-1][j] != 0) continue;
            let i = this.tablero.length-1;
            while (i > 0 && this.tablero[i-1][j] == 0) i--;

            this.tablero[i][j] = (jugador % 2) + 1;
            prob = this.maxValue(this.tablero, jugador, n-1);
            if (prob < minProb) {
                minProb = prob;
                columna = j;
            }
            this.tablero[i][j] = 0;
        }

        return minProb;
    }

    jugarHumano(jugador) {

        // lee una casilla disponible
        this.printTablero(this.tablero);
        let columnas = [];
        for (let i = 0; i < this.tablero[0].length; i++) {
            if (this.tablero[this.tablero.length-1][i] == 0) {
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
        let fila = this.tablero.length - 1;
        while (fila > 0 && this.tablero[fila-1][columna] == 0) fila--;
        this.tablero[fila][columna] = jugador;
    }

    printTablero(tablero) {
        for (let i = tablero.length-1; i >= 0; i--) {
            let line = "|";
            for (let j = 0; j < tablero[0].length; j++) {
                line = line.concat(tablero[i][j]).concat("|");
            }
            console.log(line);
        }
    }

    jugarVsHumano() {
    
        let jugador = this.jugadorAgente;
        let contrario = (jugador % 2) + 1;
        let turno = 1;
        let jugadas = this.turnosMaximos;
        do {
            if (turno == jugador) {
                this.jugarElitista(jugador);
            } else {
                this.jugarHumano(contrario);
            }
    
            //actualizar resultado
            this.gameResult = this.calculateResult(this.tablero);
            if (this.gameResult > 0) { //ya hay resultado
                if (this.gameResult != jugador) //perdimos, actualizar tablero
                {
                    console.log("Felicidades! Usted ha ganado.");
                } else if (this.gameResult == jugador) {
                    this.printTablero(this.tablero)
                    console.log("Felicidades! Su agente ha ganado.");
                }
                break;
            }
    
            turno = 2 - turno + 1;
            jugadas--;
        } while (jugadas > 0);
    }
}

let profundidad = 4;
let ag = new MinMax(profundidad);
ag.reset();
ag.jugarVsHumano();
