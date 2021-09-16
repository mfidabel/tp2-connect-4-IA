import React, {useState} from "react";
import configuracionParametros from "../modelos/configuracionParametros";
import {Button, Col, Form, Row} from "react-bootstrap";

type ParametrosProps = {
    algoritmos: string[],
    onIniciarJuego: (parametros: configuracionParametros) => void,
    onLimpiarTablero: () => void
}

export const Parametros = ({algoritmos, onIniciarJuego, onLimpiarTablero}: ParametrosProps) => {
    // Variables
    const [rojo, setRojo] = useState('');
    const [amarillo, setAmarillo] = useState('');

    // Handlers
    const clickIniciarJuego = () => {
        // Iniciar el juego
        onIniciarJuego({
            jugadorAmarillo: amarillo,
            jugadorRojo: rojo
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
                        <Form.Label>Jugador Rojo</Form.Label>
                        <Form.Select
                            value={rojo}
                            onChange={ (event) => setRojo(event.currentTarget.value) }>
                            {
                                algoritmos.map(value => <option key={value}>{value}</option>)
                            }
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Jugador Amarillo</Form.Label>
                        <Form.Select value={amarillo} onChange={ event => setAmarillo(event.currentTarget.value) }>
                            {
                                algoritmos.map(value => <option key={value}>{value}</option>)
                            }
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary"
                            onClick={clickIniciarJuego}>Iniciar Juego</Button>
                    <Button variant="secondary"
                            onClick={clickLimpiarTablero}
                            className="ms-3">Limpiar Tablero</Button>
                </Col>
            </Row>
        </Form>
    )
}