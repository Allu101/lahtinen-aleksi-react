import React from 'react';
import './App.css';

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import SomeViewComponent from './SomeViewComponent';
import CatsViewComponent from './CatsViewComponent';

import { connect } from 'react-redux';
import ChangeText from './ChangeText';

class App extends React.Component {
  render() {
    const navClass = 'colors' + this.props.colorModeFromReduxStore;
    return (
      <BrowserRouter>
        <div className="App">
          <nav className={navClass}>
            <ul>
              <li className="nav-item">
                <Link to="/">Main Page</Link>
              </li>
              <li className="nav-item">
                <Link to="/something">Something</Link>
              </li>
              <li className="last-nav-item">
                <Link to="/cats">Cats</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <nav className={navClass}>
                  <ChangeText />
                </nav>
              }
            />
            <Route path="something/*" element={<SomeViewComponent />} />
            <Route path="cats/*" element={<CatsViewComponent />} />
            <Route path="*" element={<h1>This page not found</h1>} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    colorModeFromReduxStore: state['general']['colorMode'],
  };
};

const app = connect(mapStateToProps, null)(App);

export default app;
