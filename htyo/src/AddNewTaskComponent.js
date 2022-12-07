import React from 'react';

export default class AddNewTaskComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allContexts: this.props.allContexts,
      newTaskContexts: [],
      newTaskName: '',
      onAddNewTask: this.props.onAddNewTask,
    };
    this.handleNewTaskMessageChange = (event) => {
      this.setState({
        newTaskName: event.target.value,
      });
    };
  }

  lastClickedButtonID = -1;

  contains(list, value) {
    let contains = false;
    list.map((id) => {
      if (Number(id) === Number(value)) {
        contains = true;
      }
    });
    return contains;
  }

  clearTextBox = () => {
    this.setState({ newTaskName: '' });
  };

  createNewTask = () => {
    this.state.onAddNewTask(
      this.state.newTaskName,
      this.state.newTaskContexts,
      this.clearTextBox
    );
    this.setState({ newTaskContexts: [] });
  };

  getContextButtons = () => {
    let buttons = [];
    let className = '';
    let index = 1;
    this.state.allContexts.map((context) => {
      if (this.contains(this.state.newTaskContexts, context.id)) {
        className = 'context';
      } else {
        className = 'context unselected-context';
      }
      buttons.push(
        <button
          key={index}
          className={className}
          onClick={() => {
            this.lastClickedButtonID = context.id;
            this.handleClick();
          }}
        >
          {context.name}
        </button>
      );
      index++;
    });
    return buttons;
  };

  handleClick = () => {
    if (this.contains(this.state.newTaskContexts, this.lastClickedButtonID)) {
      this.setState({
        newTaskContexts: this.state.newTaskContexts.filter((context) => {
          return context !== this.lastClickedButtonID;
        }),
      });
    } else {
      this.state.newTaskContexts.push(this.lastClickedButtonID);
    }
    this.lastClickedButtonID = -1;
    this.setState({});
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
        {this.getContextButtons()}
      </div>
    );
  }
}
