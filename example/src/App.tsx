import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import ExamplesPage from "./components/ExamplesPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path={"/example/:schemaName"} children={<ExamplesPage />} />
        <Route>
          404 - Not found
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
