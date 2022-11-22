import React from 'react';
import './App.css';

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import TasksViewComponent from './TasksViewComponent';
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
                <Link to="/tasks">Tasks</Link>
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
            <Route path="tasks/*" element={<TasksViewComponent />} />
            <Route path="info/*" element={<InfoViewComponent />} />
            <Route path="*" element={<h1>This page not found</h1>} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
