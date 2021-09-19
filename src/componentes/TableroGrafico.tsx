// Basado en https://github.com/Cono52/connect-four-react
import React, {useState} from "react";
import {Ficha} from "../modelos/ficha";
import Tablero from "../modelos/tablero";
import {Modo} from "../modelos/modo";
import {Resultado} from "../modelos/resultado";

type AgujeroProps = {
    fichaValor: Ficha
};

type ColumnaProps = {
    handleClick: () => void,
    agujeros: Ficha[]
};

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


export const TableroGrafico = () => {
    const [tablero, setTablero] = useState(new Tablero());
    const [turno, setTurno] = useState(Ficha.Rojo);
    const [modo, setModo] = useState(Modo.SinSeleccionar);

    // Función para seleccionar modo
    const seleccionarModo = (modo: Modo) => {
        setTablero(new Tablero());
        setModo(modo);
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

    return (
        <div className="TableroGrafico">
            {modo !== Modo.SinSeleccionar &&
            <div className="Tablero">
                {columnas}
            </div>
            }
            {(modo === Modo.SinSeleccionar) &&
            <div>
                <button onClick={() => seleccionarModo(Modo.Humano)}>Jugar Humano</button>
                <button>Jugar Estrategia</button>
            </div>
            }
            {
                // TODO: Poner algo para cuando termine el juego
            }
        </div>
    );
};