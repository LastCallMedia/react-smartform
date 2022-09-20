import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import ExamplesPage from "./components/ExamplesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/example/:schemaName"} element={<ExamplesPage />} />
        <Route>
          404 - Not found
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
