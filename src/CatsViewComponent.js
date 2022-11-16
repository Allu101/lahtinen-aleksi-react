import React from 'react';
import { connect } from 'react-redux';
import n2 from './n2_small.png';

function CatsViewComponent(props) {
  const navClass = 'colors' + props.colorModeFromReduxStore;
  return (
    <div>
      <nav className={navClass}>
        <div className="bg1">
          <img src={n2} alt="cat" style={{ width: '40%' }} />
        </div>
      </nav>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    modeFromReduxStore: state['general']['mode'],
    colorModeFromReduxStore: state['general']['colorMode'],
  };
};

const catsview = connect(mapStateToProps, null)(CatsViewComponent);

export default catsview;
