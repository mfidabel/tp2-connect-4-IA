const prompt = require('prompt-sync')();

class RLAgent {
    constructor(n) {
        this.n = n;
        this.lookupTable = {};
        this.reset(true);
        this.jugadorAgente = 1;
        this.alpha = 0.7;
        this.turnosMaximos = 42;
    }

    reset(entrenar) {
        this.tablero = Array(6).fill().map(()=>Array(7).fill(0));
        this.lastTablero = Array(6).fill().map(()=>Array(7).fill(0));
        this.entrenar = entrenar;
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
        
        let contrario = (jugador % 2) + 1;

        let result = this.calculateResult(tablero);
        if (result == jugador) {

            return 1.0;
        } else if (result == contrario) {

            return 0.0;
        } else if (result == 3) { //empate

            return 0.0;
        } else { //no hay ganador

            return this.getProbability(tablero);
        }
    }

    getProbability(tablero) {
        let tableroSerializado = tablero.toString();
        
        if (!(tableroSerializado in this.lookupTable)) {
            this.lookupTable[tableroSerializado] = 0.5;
        }

        return this.lookupTable[tableroSerializado];
    }

    updateProbability(tablero, nextStateProb, jugador) {

        let prob = this.calculateReward(tablero, jugador);
        prob = prob + this.alpha * (nextStateProb - prob);

        let tableroSerializado = tablero.toString();
        this.lookupTable[tableroSerializado] = prob;
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
            prob = this.calculateReward(this.tablero, jugador);
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

        // entrenar
        if (this.entrenar) {
            this.updateProbability(this.lastTablero, maxProb, jugador);
        }

        // aplicar jugada
        let fila = this.tablero.length - 1;
        while (fila > 0 && this.tablero[fila-1][columna] == 0) fila--;
        this.tablero[fila][columna] = jugador;

        // actualizar ultimo tablero
        this.copiarTablero(this.tablero, this.lastTablero);
    }

    jugarRandom(jugador) { // diversificación

        // elegir casilla disponible al azar
        let columnas = [];
        for (let i = 0; i < this.tablero[0].length; i++) {
            if (this.tablero[this.tablero.length-1][i] == 0) {
                columnas.push(i);
            }
        }
        let columna = columnas[Math.floor(Math.random() * columnas.length)];
        
        // aplicar jugada
        let fila = this.tablero.length - 1;
        while (fila > 0 && this.tablero[fila-1][columna] == 0) fila--;
        this.tablero[fila][columna] = jugador;

        //si es el agente, actualizar ultimo tablero
        if (jugador == this.jugadorAgente) {
            this.copiarTablero(this.tablero, this.lastTablero);
        }
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
            console.log(columna);
        } while (!(columna in columnas));
        
        // aplicar jugada
        let fila = this.tablero.length - 1;
        while (fila > 0 && this.tablero[fila-1][columna] == 0) fila--;
        this.tablero[fila][columna] = jugador;

        // si es el agente, actualizar ultimo tablero
        if (jugador == this.jugadorAgente) {
            this.copiarTablero(this.tablero, this.lastTablero);
        }
    }

    copiarTablero(tableroOrigen, tableroDestino) {

        for (let i = 0; i < tableroOrigen.length; i++) {
            for (let j = 0; j < tableroOrigen[0].length; j++) {

                tableroDestino[i][j] = tableroOrigen[i][j];
            }
        }
    }

    updateAlpha(currentGame) {

        this.alpha = 0.5 - 0.49 * currentGame / this.n;
    }

    printTable() {
        for (const key in this.lookupTable) {
            let value = this.lookupTable[key];
            if (value != 0.5) {

                let tablero = key.split(",").reduce(function (rows, key, index) { 
                    return (index % 7 == 0 ? rows.push([key]) 
                      : rows[rows.length-1].push(key)) && rows;
                  }, []);
                this.printTablero(tablero);
                console.log(value);
                console.log();
            }
        }
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

    jugarVsRandom() {

        let jugador = this.jugadorAgente;
        let contrario = (jugador % 2) + 1;
        let turno = 1;
        let jugadas = this.turnosMaximos;
        let q;
        do {
            if (turno == jugador) {
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
            this.gameResult = this.calculateResult(this.tablero);
            if (this.gameResult > 0) { // ya hay resultado
                if (this.gameResult != jugador && this.entrenar) { // perdimos, actualizar tablero
                    this.updateProbability(this.lastTablero, this.calculateReward(this.tablero, jugador), jugador);
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
            if (turno == jugador) {
                this.jugarRandom(jugador);
            } else {
                this.jugarHumano(contrario);
            }
    
            //actualizar resultado
            this.gameResult = this.calculateResult(this.tablero);
            if (this.gameResult > 0) { //ya hay resultado
                if (this.gameResult != jugador && this.entrenar) //perdimos, actualizar tablero
                {
                    this.updateProbability(this.lastTablero, this.calculateReward(this.tablero, jugador), jugador);
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

let trainingCount = 0; //train
let humanTrainingCount = 1; //train
let totalGamesCount = 0; //validation
let totalExperiments = 1;
//let qRates[] = [0.1, 0.2, 0.3, 0.4, 0.5];
let qRates = [0.5];
for (let q = 0; q < qRates.length; q++) {

    let winsRatioAcum = 0;
    let lossesRatioAcum = 0;
    let drawsRatioAcum = 0;
    for (let k = 0; k < totalExperiments; k++) {

        //TRAIN
        ag = new RLAgent(trainingCount);
        ag.qRate = qRates[q];
        for (let i = 0; i < ag.n; i++) {
            ag.reset(true);
            ag.updateAlpha(i);
            ag.jugarVsRandom();
        }

        //human train
        ag.n = humanTrainingCount;
        ag.alpha = 0.7; //suponemos que el humano juega bien (explotación)
        for (let i = 0; i < ag.n; i++) {
            ag.reset(true);
            //ag.updateAlpha(i);
            ag.jugarVsHumano();
        }

        if (totalGamesCount == 0) break;
        console.log(">>>>>>>>>>>>>>> AFTER TRAINING ");
        //ag.printTable();

        //VALIDATION
        let wins = 0;
        let losses = 0;
        let draws = 0;
        let contrario = 2 - ag.jugadorAgente + 1;
        for (let i = 0; i < totalGamesCount; i++) {

            ag.reset(false);
            ag.jugarVsRandom();

            if (ag.gameResult == ag.jugadorAgente) {
                wins++;
            } else if (ag.gameResult == contrario) {
                losses++;
            } else {
                draws++;
            }
        }

        winsRatioAcum += wins / totalGamesCount;
        lossesRatioAcum += losses / totalGamesCount;
        drawsRatioAcum += draws / totalGamesCount;
    }
    console.log(">>>>>>>>>>>>>>> RATIO AVG, Q RATE: " + qRates[q]);
    console.log("Ratio Avg W/T: " + winsRatioAcum / totalExperiments);
    console.log("Ratio Avg L/T: " + lossesRatioAcum / totalExperiments);
    console.log("Ratio Avg D/T: " + drawsRatioAcum / totalExperiments);
}