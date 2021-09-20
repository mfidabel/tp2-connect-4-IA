// Basado en https://github.com/Cono52/connect-four-react
import React, {useEffect, useState} from "react";
import {Ficha} from "../modelos/ficha";
import Tablero from "../modelos/tablero";
import {Modo} from "../modelos/modo";
import {Resultado} from "../modelos/resultado";
import {Button, Col, Form, Row} from "react-bootstrap";
import {Estrategia} from "../modelos/estrategia";
import RLAgent from "../algoritmos/RLAgent";
import configuracionParametros from "../modelos/configuracionParametros";
import {jugarEstrategia} from "../algoritmos/jugadorEstrategia";

type AgujeroProps = {
    fichaValor: Ficha
};

type ColumnaProps = {
    handleClick: () => void,
    agujeros: Ficha[]
};

type TableroProps = {
    parametros: configuracionParametros,
	onElegirEstrategia: (parametros: configuracionParametros) => void,
    onLimpiarTablero: () => void
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


export const TableroGrafico = ({parametros, onElegirEstrategia, onLimpiarTablero}: TableroProps) => {
    // Constantes
    const FICHA_ESTRATEGIA = Ficha.Amarillo;
    const FICHA_HUMANO = Ficha.Rojo;
	
	const [estrategia, setEstrategia] = useState(Estrategia.Minimax);
    const [nivel, setNivel] = useState(3);
    const [qRate, setRate] = useState(0.5);
    const [trainN, setTrainN] = useState(10000);
	
	const elegirEstrategia = () => {
        // Iniciar el juego
        onElegirEstrategia({
            estrategia: estrategia,
            nivel: nivel,
            qRate: qRate,
        });
    }

    const clickEntrenarAgente = () => {
        // Entrenar al agente
        RLAgent.Agente = new RLAgent(trainN);
        RLAgent.Agente.qRate = qRate;

        for (let i=0; i < trainN; i++) {
            RLAgent.Agente.reset(true);
            RLAgent.Agente.updateAlpha(i);
            RLAgent.Agente.jugarVsRandom();
        }
    }

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
                    const nuevoTablero = jugarEstrategia(tablero, parametros, turno, modo, estrategia, nivel);
                    setTablero(nuevoTablero);
                    setTurno(FICHA_HUMANO);
                }
				
				if (modo === Modo.CPU) {
					if (turno === FICHA_ESTRATEGIA){
						// Jugar estrategia
						const nuevoTablero = jugarEstrategia(tablero, parametros, turno, modo, estrategia, nivel);
						setTablero(nuevoTablero);
						setTurno(FICHA_HUMANO);
					}else{
						const nuevoTablero = jugarEstrategia(tablero, parametros, turno, modo, estrategia, nivel);
						setTablero(nuevoTablero);
						setTurno(FICHA_ESTRATEGIA);
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
				<Form>
				<Row>
					<Col>
						<Row>
							<Form.Group className="mb-3">
								<Form.Label>Estrategia</Form.Label>
								<Form.Select
									value={estrategia}
									onChange={ (event) => setEstrategia(parseInt(event.currentTarget.value)) }>
									<option value={Estrategia.Minimax}>Minimax</option>
									<option value={Estrategia.Alfabeta}>Poda Alfa-beta</option>
									<option value={Estrategia.RLAgent}>Agente RL</option>
								</Form.Select>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-3">
								<Form.Label>N Entrenamiento (Solo para RL)</Form.Label>
								<Form.Control value={trainN}
											type="number"
											disabled={estrategia !== Estrategia.RLAgent}
											onChange={ event => setTrainN(parseInt(event.currentTarget.value))}/>
							</Form.Group>
						</Row>
					</Col>
					<Col>
						<Row>
							<Form.Group className="mb-3">
								<Form.Label>Nivel de búsqueda</Form.Label>
								<Form.Control value={nivel}
											type="number"
											onChange={ event => setNivel(parseInt(event.currentTarget.value))}/>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-3">
								<Form.Label>Q Rate (Solo para RL)</Form.Label>
								<Form.Control value={qRate}
											type="number"
											max={1.0}
											disabled={estrategia !== Estrategia.RLAgent}
											onChange={ event => setRate(parseFloat(event.currentTarget.value))}/>
							</Form.Group>
						</Row>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button variant="primary"
								onClick={elegirEstrategia}>Elegir Estrategia</Button>
						<Button variant="secondary"
								onClick={clickEntrenarAgente}
								disabled={estrategia !== Estrategia.RLAgent}
								className="ms-3">Entrenar RL</Button>
					</Col>
				</Row>
			</Form>
			<p></p>
			<p></p>
                <button className="btn btn-primary mx-3" onClick={() => seleccionarModo(Modo.Humano)}>Jugar Humano</button>
                <button className="btn btn-primary mx-3" onClick={() => seleccionarModo(Modo.Estrategia)}>Jugar Estrategia</button>
				<button className="btn btn-primary mx-3" onClick={() => seleccionarModo(Modo.CPU)}>Estrategia contra Estrategia</button>
            </div>
            }
            <div className={estiloGanador}>Gana {ganador}!</div>
        </div>
    );
};