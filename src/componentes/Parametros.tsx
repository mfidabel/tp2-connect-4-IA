import React, {useState} from "react";
import configuracionParametros from "../modelos/configuracionParametros";
import {Button, Col, Form, Row} from "react-bootstrap";
import {Estrategia} from "../modelos/estrategia";

type ParametrosProps = {
    onElegirEstrategia: (parametros: configuracionParametros) => void,
    onLimpiarTablero: () => void
}

export const Parametros = ({onElegirEstrategia, onLimpiarTablero}: ParametrosProps) => {
    // Variables
    const [estrategia, setEstrategia] = useState(Estrategia.Minimax);
    const [nivel, setNivel] = useState(3);

    // Handlers
    const elegirEstrategia = () => {
        // Iniciar el juego
        onElegirEstrategia({
            estrategia: estrategia,
            nivel: nivel,
        });
    }

    const clickLimpiarTablero = () => {
        // Limpiar el tablero
        onLimpiarTablero();
    }

    // Render
    return (
        <Form>
            <Row>
                <Col>
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
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Nivel de búsqueda</Form.Label>
                        <Form.Control value={nivel}
                                      type="number"
                                      onChange={ event => setNivel(parseInt(event.currentTarget.value))}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary"
                            onClick={elegirEstrategia}>Elegir Estrategia</Button>
                    <Button variant="secondary"
                            onClick={clickLimpiarTablero}
                            className="ms-3">Limpiar Tablero</Button>
                </Col>
            </Row>
        </Form>
    )
}