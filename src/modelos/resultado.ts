import {Ficha} from "./ficha";

export enum Resultado {
    SinGanador = 0,
    GanadorRojo = 1,
    GanadorAmarillo = 2,
    Empate = 3,
}

export const ficha2Resultado = (ficha: Ficha): Resultado => {
    switch (ficha){
        case Ficha.Rojo:
            return Resultado.GanadorRojo;
        case Ficha.Amarillo:
            return Resultado.GanadorAmarillo;
        default:
            return Resultado.SinGanador;
    }
}