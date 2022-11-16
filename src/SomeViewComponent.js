import React from 'react';
import { connect } from 'react-redux';

function SomeViewComponent(props) {
  const navClass = 'colors' + props.colorModeFromReduxStore;
  return (
    <div>
      <nav className={navClass}>
        <h1>css Zen Garden</h1>
        <p>
          A demonstration of what can be accomplished visually through CSS-based
          design. Select any style sheet from the list to load it into this
          page.
        </p>
        <p>
          Littering a dark and dreary road lay the past relics of
          browser-specific tags, incompatible DOMs, and broken CSS support.
        </p>
      </nav>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    colorModeFromReduxStore: state['general']['colorMode'],
  };
};

const someViewComponent = connect(mapStateToProps, null)(SomeViewComponent);

export default someViewComponent;
