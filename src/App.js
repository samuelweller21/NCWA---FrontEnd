import './App.css';
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom"
import TwoPlayerGame from "./Components/TwoPlayerGame.jsx"
import ComputerGame from "./Components/ComputerGame.jsx"
import Welcome from "./Components/Welcome.jsx"
import Error from "./Components/Error.jsx"
import 'bootstrap/dist/css/bootstrap.min.css'
import AnalysisBoard from './Components/AnalysisBoard';
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import { StrictMode } from 'react';

function App() {

  return (
    <StrictMode>
    <Router>
      <Switch>
        {console.log("Finding a route")}
        <Route path="/NC/tpgames" exact component={withRouter(TwoPlayerGame)} />
        <Route path="/NC/tpgames/:id" exact component={withRouter(TwoPlayerGame)} />
        <Route path="/NC/cpgame" exact component={withRouter(ComputerGame)} />
        <Route path="/NC/analysis" exact component={withRouter(AnalysisBoard)} />
        <Route path="/NC/login" exact component={withRouter(Login)} />
        <Route path="/NC/signup" exact component={withRouter(SignUp)} />
        <Route path="/NC/" exact component={withRouter(Welcome)} />
        <Route component={withRouter(Error)} />
      </Switch>
    </Router>
    </StrictMode>

  );
}

export default App;