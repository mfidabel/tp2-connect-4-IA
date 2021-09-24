import React from "react";
import {RLvsRL} from "../experimentos/RLvsRL";
import {MiniMaxVsAlfaBeta} from "../experimentos/MiniMaxVsAlfaBeta";
import {MiniMaxVsRL} from "../experimentos/MiniMaxVsRL";
import {Estrategia} from "../modelos/estrategia";

export const Experimento = () => {

    return (
        <>
            <button onClick={() => RLvsRL()}>RLvsRL</button>
            <button onClick={() => MiniMaxVsAlfaBeta(100, 3, 3)}>
                Minimax(3)vsAlfaBeta(3)
            </button>
            <button onClick={() => MiniMaxVsAlfaBeta(100, 4, 2)}>
                Minimax(4)vsAlfaBeta(2)
            </button>
            <button onClick={() => MiniMaxVsAlfaBeta(100, 2, 4)}>
                Minimax(2)vsAlfaBeta(4)
            </button>
            <button onClick={() => MiniMaxVsRL()}>
                Minimax(2)vsRL
            </button>
            <button onClick={() => MiniMaxVsRL(10000,
                100, 10, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], 2,
                Estrategia.Alfabeta)}>
                Alfabeta(2)vsRL
            </button>
        </>
    )
}