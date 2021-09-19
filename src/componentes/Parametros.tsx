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
    const [estrategia, setEstrategia] = useState(Estrategia.Minimax);
    const [nivel, setNivel] = useState(3);
    const [qRate, setRate] = useState(0.5);
    const [trainN, setTrainN] = useState(10000);

    // Handlers
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

    // Render
    return (
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
    )
}