import React from 'react';
import './App.css';

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import SomeViewComponent from './SomeViewComponent';
import InfoViewComponent from './InfoViewComponent';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <nav className={'navClass'}>
            <ul>
              <li className="nav-item">
                <Link to="/">Kotisivu</Link>
              </li>
              <li className="nav-item">
                <Link to="/something">Something</Link>
              </li>
              <li className="last-nav-item">
                <Link to="/info">Tietoja</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <nav className={'homepage'}>
                  <h2>Etusivu</h2>
                </nav>
              }
            />
            <Route path="something/*" element={<SomeViewComponent />} />
            <Route path="info/*" element={<InfoViewComponent />} />
            <Route path="*" element={<h1>This page not found</h1>} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
