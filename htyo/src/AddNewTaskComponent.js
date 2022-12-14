import React from 'react';
import { contains, getContextButtons } from './utis';

export default class AddNewTaskComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingNewContext: false,
      newContextName: '',
      selectedContexts: [],
      newTaskName: '',
      onAddNewTask: this.props.onAddNewTask,
      onDelete: this.props.onDelete,
    };
    this.handleNewContextMessageChange = (event) => {
      this.setState({
        newContextName: event.target.value,
      });
    };
    this.handleNewTaskMessageChange = (event) => {
      this.setState({
        newTaskName: event.target.value,
      });
    };
  }
  lastClickedButtonID = -1;

  clearTextBox = () => {
    this.setState({ newTaskName: '' });
  };

  createNewTask = () => {
    this.state.onAddNewTask(
      this.state.newTaskName,
      this.state.selectedContexts,
      this.clearTextBox
    );
    this.setState({ selectedContexts: [] });
  };

  editNewContext = () => {
    this.setState({
      editingNewContext: true,
    });
  };

  getContextElements = () => {
    let elements = getContextButtons(
      this.props.allContexts,
      this.state.selectedContexts,
      this.handleClick
    );

    if (this.state.editingNewContext) {
      elements.push(
        <textarea
          key={'contextTextarea'}
          value={this.state.newContextName}
          onChange={this.handleNewContextMessageChange}
        ></textarea>
      );
      elements.push(
        <button key={'saveNewContextBtn'} onClick={this.saveNewContext}>
          Add new Context
        </button>
      );
    } else {
      elements.push(
        <button key={'editNewContextBtn'} onClick={this.editNewContext}>
          Create new Context
        </button>
      );
      elements.push(
        <button key={'deleteContextBtn'} onClick={this.handleDelete}>
          Delete selected contexts
        </button>
      );
    }
    return elements;
  };

  handleClick = (clickedID) => {
    this.lastClickedButtonID = clickedID;
    if (contains(this.state.selectedContexts, this.lastClickedButtonID)) {
      this.setState({
        selectedContexts: this.state.selectedContexts.filter((context) => {
          return context !== this.lastClickedButtonID;
        }),
      });
    } else {
      this.state.selectedContexts.push(this.lastClickedButtonID);
    }
    this.lastClickedButtonID = -1;
    this.setState({});
  };

  handleDelete = () => {
    this.state.onDelete(this.state.selectedContexts);
    this.setState({ selectedContexts: [] });
  };

  render() {
    return (
      <div>
        <textarea
          value={this.state.newTaskName}
          onChange={this.handleNewTaskMessageChange}
        ></textarea>
        <button onClick={this.createNewTask}>Add new task</button>
        <br></br>
        {this.getContextElements()}
      </div>
    );
  }

  saveNewContext = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.props.allContexts.at(-1).id + 1,
        name: this.state.newContextName,
      }),
    };
    fetch(`http://localhost:3010/contexts/`, requestOptions)
      .then((response) => response.json())
      .then(async () => {
        this.props.initContexts();
        this.setState({
          editingNewContext: false,
          newContextName: '',
          selectedContexts: [],
        });
      });
  };
}
