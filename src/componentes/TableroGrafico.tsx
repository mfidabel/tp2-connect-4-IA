// Basado en https://github.com/Cono52/connect-four-react
import React, {useEffect, useState} from "react";
import {Ficha} from "../modelos/ficha";
import Tablero from "../modelos/tablero";
import {Modo} from "../modelos/modo";
import {Resultado} from "../modelos/resultado";
import configuracionParametros from "../modelos/configuracionParametros";
import {jugarEstrategia} from "../algoritmos/jugadorEstrategia";
import {ResultadoEjecucion} from "../modelos/ResultadoEjecucion";

type AgujeroProps = {
    fichaValor: Ficha
};

type ColumnaProps = {
    handleClick: () => void,
    agujeros: Ficha[]
};

type TableroProps = {
    parametros: configuracionParametros,
    grabarResultado: (resultado: ResultadoEjecucion) => void
}

const Agujero = ({fichaValor}: AgujeroProps) => {
    return (
        <div className="Agujero">
            <div className={Ficha[fichaValor]}>

            </div>
        </div>
    );
};

const Columna = ({handleClick, agujeros}: ColumnaProps) => {
    return (
        <div className="Columna" onClick={() => handleClick()}>
            {
                [...Array(agujeros.length)].map((_, j) =>
                    (<Agujero fichaValor={agujeros[j]} key={j}/>)
                ).reverse()
            }
        </div>
    );
};


export const TableroGrafico = ({parametros, grabarResultado}: TableroProps) => {
    // Constantes
    const FICHA_ESTRATEGIA = Ficha.Amarillo;
    const FICHA_HUMANO = Ficha.Rojo;

    // Estados
    const [tablero, setTablero] = useState(new Tablero());
    const [turno, setTurno] = useState(Ficha.Rojo);
    const [modo, setModo] = useState(Modo.SinSeleccionar);
    const [ganador, setGanador] = useState('');

    // Función para seleccionar modo
    const seleccionarModo = (modo: Modo) => {
        setModo(modo);
        setTablero(new Tablero());
        setTurno(Ficha.Rojo);
    }

    // Función para hacer un movimiento
    const hacerMovimiento = (idxColumna: number) => {
        if (tablero.verificarColumnaLibre(idxColumna) && tablero.calcularResultado() === Resultado.SinGanador) {
            const copiaTablero = new Tablero();
            copiaTablero.posiciones = JSON.parse(JSON.stringify(tablero.posiciones));
            copiaTablero.tirarFicha(idxColumna, turno);
            setTablero(copiaTablero);
            setTurno(turno === Ficha.Rojo ? Ficha.Amarillo : Ficha.Rojo);
        } else {
            console.log("Movimiento invalido");
        }
    }

    // Crear las columnas
    let columnas = [...Array(tablero.posiciones[0].length)].map((_, i) => (
        <Columna handleClick={() => hacerMovimiento(i)}
                 agujeros={tablero.posiciones.map(value => value[i])}
                 key={i}/>
    ));

    // Crear estilo del ganador
    let estiloGanador = ganador !== '' ? "mensajeGanador aparecer" : "mensajeGanador";

    // Ejecutar cuando se cambia de turno
    useEffect(() => {
        let ganadorTentador = tablero.calcularResultado();
        switch (ganadorTentador) {
            case Resultado.Empate:
                setGanador("ninguno");
                break;
            case Resultado.GanadorRojo:
                setGanador("Rojo");
                break;
            case Resultado.GanadorAmarillo:
                setGanador("Amarillo");
                break;
            case Resultado.SinGanador:
            // El juego continua, el siguiente jugador hace su movimiento si es una estrategia
            // TODO: Jugar estrategia
                if (modo === Modo.Estrategia && turno === FICHA_ESTRATEGIA) {
                    // Jugar estrategia
                    const [nuevoTablero, res] = jugarEstrategia(tablero, parametros, turno, modo);
                    setTablero(nuevoTablero);
                    setTurno(FICHA_HUMANO);
                    grabarResultado(res);
                }
				
				if (modo === Modo.CPU) {
					if (turno === FICHA_ESTRATEGIA){
						// Jugar estrategia
						const [nuevoTablero, res] = jugarEstrategia(tablero, parametros, turno, modo);
						setTablero(nuevoTablero);
						setTurno(FICHA_HUMANO);
                        grabarResultado(res);
					}else{
						const [nuevoTablero, res] = jugarEstrategia(tablero, parametros, turno, modo);
						setTablero(nuevoTablero);
						setTurno(FICHA_ESTRATEGIA);
                        grabarResultado(res);
					}
                }

        }
        // eslint-disable-next-line
    }, [turno, tablero]);

    return (
        <div className="TableroGrafico">
            {modo !== Modo.SinSeleccionar &&
            <div className="Tablero">
                {columnas}
            </div>
            }
            {(modo === Modo.SinSeleccionar) &&
            <div>
                <button className="btn btn-primary mx-3" onClick={() => seleccionarModo(Modo.Humano)}>Jugar Humano</button>
                <button className="btn btn-primary mx-3" onClick={() => seleccionarModo(Modo.Estrategia)}>Jugar Estrategia</button>
				<button className="btn btn-primary mx-3" onClick={() => seleccionarModo(Modo.CPU)}>Estrategia contra Estrategia</button>
            </div>
            }
            <div className={estiloGanador}>Gana {ganador}!</div>
        </div>
    );
};