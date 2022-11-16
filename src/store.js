// DISCLAIMER: this code should not be treated as any "model example"
// of code of high quality. This has been written simply to demonstrate
// some points discussed during the remote session.

import { combineReducers, createStore } from 'redux';

function general(state = {mode: 0, colorMode: 0}, action) {
  let newState = {...state};
  if (action.type === 'CHANGE_MODE') {
    newState['mode'] = (state['mode'] + 1) % 2;
  }
  else if (action.type === 'CHANGE_COLOR_MODE') {
    newState['colorMode'] = (state['colorMode'] + 1) % 2;
  }
  return newState
}

function squares(state = {}, action) {
  let newState = {...state};
  if (action.type === 'CHANGE_SQUARE_COLOR') {
    if (!newState[action.squareId]){
      newState[action.squareId] = {};
    }
    if (action.mode === 0) {
      newState[action.squareId]['color'] = action.currentColor === 'light' ? 'dark' : 'light';
    }
    else {
      newState[action.squareId]['color'] = action.currentColor;
    }      
  }
  return newState
}

const rootReducer = combineReducers({squares, general});
const store = createStore(rootReducer);
export default store;