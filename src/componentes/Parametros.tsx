import React, {useState} from "react";
import configuracionParametros from "../modelos/configuracionParametros";
import {Button, Col, Form, Row} from "react-bootstrap";
import {Estrategia} from "../modelos/estrategia";
import RLAgent from "../algoritmos/RLAgent";

type ParametrosProps = {
    onElegirEstrategia: (parametros: configuracionParametros) => void,
    onLimpiarTablero: () => void
}

export const Parametros = ({onElegirEstrategia, onLimpiarTablero}: ParametrosProps) => {
    // Variables
    const [estrategiaA, setEstrategiaA] = useState(Estrategia.Minimax);
    const [nivelA, setNivelA] = useState(3);
    const [qRateA, setRateA] = useState(0.5);
    const [trainNA, setTrainNA] = useState(10000);
	const [estrategiaB, setEstrategiaB] = useState(Estrategia.Minimax);
    const [nivelB, setNivelB] = useState(3);
    const [qRateB, setRateB] = useState(0.5);
    const [trainNB, setTrainNB] = useState(10000);

    // Handlers
    const elegirEstrategia = () => {
        // Iniciar el juego
        onElegirEstrategia({
            estrategiaA: estrategiaA,
            nivelA: nivelA,
            qRateA: qRateA,
			estrategiaB: estrategiaB,
            nivelB: nivelB,
            qRateB: qRateB,
        });
    }

    const clickEntrenarAgenteA = () => {
        // Entrenar al agente
        RLAgent.Agente = new RLAgent(trainNA);
        RLAgent.Agente.qRate = qRateA;

        for (let i=0; i < trainNA; i++) {
            RLAgent.Agente.reset(true);
            RLAgent.Agente.updateAlpha(i);
            RLAgent.Agente.jugarVsRandom();
        }
    }
	
	const clickEntrenarAgenteB = () => {
        // Entrenar al agente
        RLAgent.Agente = new RLAgent(trainNB);
        RLAgent.Agente.qRate = qRateB;

        for (let i=0; i < trainNB; i++) {
            RLAgent.Agente.reset(true);
            RLAgent.Agente.updateAlpha(i);
            RLAgent.Agente.jugarVsRandom();
        }
    }

    // Render
    return (
		<>
		<h1>Jugador amarillo</h1>
        <Form>
            <Row>
                <Col>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Estrategia</Form.Label>
                            <Form.Select
                                value={estrategiaA}
                                onChange={ (event) => setEstrategiaA(parseInt(event.currentTarget.value)) }>
                                <option value={Estrategia.Minimax}>Minimax</option>
                                <option value={Estrategia.Alfabeta}>Poda Alfa-beta</option>
                                <option value={Estrategia.RLAgent}>Agente RL</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>N Entrenamiento (Solo para RL)</Form.Label>
                            <Form.Control value={trainNA}
                                          type="number"
                                          disabled={estrategiaA !== Estrategia.RLAgent}
                                          onChange={ event => setTrainNA(parseInt(event.currentTarget.value))}/>
                        </Form.Group>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Nivel de búsqueda</Form.Label>
                            <Form.Control value={nivelA}
                                          type="number"
                                          onChange={ event => setNivelA(parseInt(event.currentTarget.value))}/>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Q Rate (Solo para RL)</Form.Label>
                            <Form.Control value={qRateA}
                                          type="number"
                                          max={1.0}
                                          disabled={estrategiaA !== Estrategia.RLAgent}
                                          onChange={ event => setRateA(parseFloat(event.currentTarget.value))}/>
                        </Form.Group>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="secondary"
                            onClick={clickEntrenarAgenteA}
                            disabled={estrategiaA !== Estrategia.RLAgent}
                            className="ms-3">Entrenar RL</Button>
                </Col>
            </Row>
        </Form>
		<h1>Jugador rojo</h1>
		<Form>
            <Row>
                <Col>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Estrategia</Form.Label>
                            <Form.Select
                                value={estrategiaB}
                                onChange={ (event) => setEstrategiaB(parseInt(event.currentTarget.value)) }>
                                <option value={Estrategia.Minimax}>Minimax</option>
                                <option value={Estrategia.Alfabeta}>Poda Alfa-beta</option>
                                <option value={Estrategia.RLAgent}>Agente RL</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>N Entrenamiento (Solo para RL)</Form.Label>
                            <Form.Control value={trainNB}
                                          type="number"
                                          disabled={estrategiaB !== Estrategia.RLAgent}
                                          onChange={ event => setTrainNB(parseInt(event.currentTarget.value))}/>
                        </Form.Group>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Nivel de búsqueda</Form.Label>
                            <Form.Control value={nivelB}
                                          type="number"
                                          onChange={ event => setNivelB(parseInt(event.currentTarget.value))}/>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Q Rate (Solo para RL)</Form.Label>
                            <Form.Control value={qRateB}
                                          type="number"
                                          max={1.0}
                                          disabled={estrategiaB !== Estrategia.RLAgent}
                                          onChange={ event => setRateB(parseFloat(event.currentTarget.value))}/>
                        </Form.Group>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="secondary"
                            onClick={clickEntrenarAgenteB}
                            disabled={estrategiaB !== Estrategia.RLAgent}
                            className="ms-3">Entrenar RL</Button>
                </Col>
            </Row>
        </Form>
		</>
    )
}