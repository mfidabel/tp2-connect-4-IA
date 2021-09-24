import React from "react";
import {RLvsRL} from "../experimentos/RLvsRL";
import {MiniMaxVsAlfaBeta} from "../experimentos/MiniMaxVsAlfaBeta";

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
        </>
    )
}