import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row} from "react-bootstrap";
import {Parametros} from "./componentes/Parametros";
import {TableroGrafico} from "./componentes/TableroGrafico";
import {useState} from "react";
import configuracionParametros from "./modelos/configuracionParametros";
import {TablaResultados} from "./componentes/TablaResultados";
import {Experimento} from "./componentes/Experimento";

const algoritmos = ["Minimax", "RLAgent", "Banana"]

function App() {
  // Variables
  const [parametros, setParametros] = useState(new configuracionParametros());
  const [resultados, setResultados] = useState([]);


  // Handlers
  const cambiarParametros = parametros => {
    // Do something
    setParametros(parametros);
  }

  const limpiarTablero = () => {
    // Do something
  }

  const grabarResultado = (resultado) => {
    setResultados( prevState => {
      const newState = JSON.parse(JSON.stringify(prevState));
      newState.push(resultado);
      return newState;
    });
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
              onElegirEstrategia={cambiarParametros}
              onLimpiarTablero={limpiarTablero}
              algoritmos={algoritmos}/>
        </Row>
        {/* Tablero */}
        <hr/>
        <h4>Tablero</h4>
        <Row className="mt-3">
          <TableroGrafico parametros={parametros} grabarResultado={grabarResultado}/>
        </Row>
        {/* Resultados */}
        <hr/>
        <h4>Resultados</h4>
        <Row className="mt-3">
          <TablaResultados resultados={resultados}/>
        </Row>
        {/* Experimentos */}
        <hr/>
        <h4>Experimentos</h4>
        <Row className="mt-3">
          <Experimento/>
        </Row>
      </Container>
    </div>
  );
}

export default App;
