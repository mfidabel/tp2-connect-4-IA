import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row} from "react-bootstrap";
import {Parametros} from "./componentes/Parametros";
import {TableroGrafico} from "./componentes/TableroGrafico";

const algoritmos = ["Minimax", "RLAgent", "Banana"]

function App() {
  // Variables


  // Handlers
  const iniciarJuego = (parametros) => {
    // Do something
  }

  const limpiarTablero = () => {
    // Do something
  }


  // Render
  return (
    <div className="App p-3">
      <Container>
        <h3 className="text-start h2 mb-3">Connect-4</h3>
        {/* Parametros*/}
        <hr/>
        <h4>Parámetros del problema</h4>
        <Row className="mt-3">
          <Parametros
              onIniciarJuego={iniciarJuego}
              onLimpiarTablero={limpiarTablero}
              algoritmos={algoritmos}/>
        </Row>
        {/* Tablero */}
        <hr/>
        <h4>Tablero</h4>
        <Row className="mt-3">
          <TableroGrafico/>
        </Row>
        {/* Resultados */}
        <hr/>
        <h4>Resultados</h4>
        <Row className="mt-3">
          {/* Aca poner los Resultados */}
        </Row>
      </Container>
    </div>
  );
}

export default App;
