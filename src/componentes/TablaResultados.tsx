import React from "react";
import {ResultadoEjecucion} from "../modelos/ResultadoEjecucion";
import {Table} from "react-bootstrap";
import {Estrategia} from "../modelos/estrategia";

type ResultadosProps = {
    resultados: ResultadoEjecucion[]
}

export const TablaResultados = ({ resultados }: ResultadosProps) => {
    return (
        <Table striped bordered hover variant="dark">
            <thead>
            <tr>
                <th>Nº Jugada</th>
                <th>N</th>
                <th>Algoritmo</th>
                <th>Tiempo de Ejecución (ms)</th>
                <th>Nodos Expandidos</th>
            </tr>
            </thead>
            <tbody>
            {
                resultados.map( (resultado, idx) =>
                    <tr key={idx}>
                        <td>{idx}</td>
                        <td>{resultado.n}</td>
                        <td>{Estrategia[resultado.algoritmo]}</td>
                        <td>{resultado.tiempo}</td>
                        <td>{resultado.nodos_expandidos}</td>
                    </tr>)
            }
            </tbody>
        </Table>
    )
}