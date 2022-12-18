import React from 'react';
import { contains, getContextButtons } from './utis';

/**
 * This is a single task component (blue box).
 */
export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contexts: this.props.contexts,
      editing: false,
      id: this.props.id,
      isActive: this.props.isActive,
      name: this.props.name,
      onDelete: this.props.onDelete,
      onSave: this.props.onSave,
    };
    this.handleMessageChange = (event) => {
      this.setState({
        name: event.target.value,
      });
    };
  }
  lastClickedButtonID = -1;
  taskClasses = 'task';

  edit = () => {
    this.setState({
      editing: true,
    });
  };

  getContexts(taskContexts, allContexts) {
    let output = [];
    taskContexts.map((contextID) => {
      allContexts.map((context) => {
        if (context.id === contextID) {
          output.push(
            <p className="context" key={contextID}>
              {context.name}
            </p>
          );
        }
      });
    });
    return output;
  }

  handleClick = (clickedID) => {
    this.lastClickedButtonID = clickedID;
    if (contains(this.state.contexts, this.lastClickedButtonID)) {
      this.setState({
        contexts: this.state.contexts.filter((context) => {
          return context !== this.lastClickedButtonID;
        }),
      });
    } else {
      this.state.contexts.push(this.lastClickedButtonID);
    }
    this.lastClickedButtonID = -1;
    this.setState({});
  };

  handleDelete = () => {
    this.state.onDelete(this.state.id);
  };

  onActivate = () => {
    this.setState({ isActive: true });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().valueOf(),
        taskID: this.state.id,
        status: 'START',
      }),
    };
    fetch('http://localhost:3010/tasksActivityLog/', requestOptions).then(
      (response) => response.json()
    );
  };

  onInactivate = () => {
    this.taskClasses = 'task';
    this.setState({ isActive: false });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().valueOf(),
        taskID: this.state.id,
        status: 'STOP',
      }),
    };
    fetch('http://localhost:3010/tasksActivityLog/', requestOptions).then(
      (response) => response.json()
    );
  };

  renderEditState() {
    return (
      <div className={this.taskClasses} key={this.props.index}>
        <textarea
          defaultValue={this.state.name}
          onChange={this.handleMessageChange}
        ></textarea>
        <button onClick={this.handleDelete}>Delete</button>
        <button
          onClick={() => {
            this.props.onSave(
              this.state.name,
              this.state.contexts,
              this.state.id,
              this.props.orderNumer
            );
            this.setState({
              editing: false,
            });
          }}
        >
          Save
        </button>
        {getContextButtons(
          this.props.allContexts,
          this.state.contexts,
          this.handleClick
        )}
      </div>
    );
  }

  renderNormalState() {
    if (this.state.isActive) {
      this.taskClasses += ' task-activated';
    }
    return (
      <div className={this.taskClasses}>
        <h2 key={this.props.index}>{this.state.name}</h2>
        {this.state.isActive ? (
          <button
            style={{ backgroundColor: 'red' }}
            onClick={this.onInactivate}
          >
            Inactivate
          </button>
        ) : (
          <button
            style={{ backgroundColor: 'lightgreen' }}
            onClick={this.onActivate}
          >
            Activate
          </button>
        )}
        <button onClick={this.edit}>Edit</button>
        <div className="contexts">
          {this.getContexts(this.state.contexts, this.props.allContexts)}
        </div>
      </div>
    );
  }

  render() {
    return this.state.editing
      ? this.renderEditState()
      : this.renderNormalState();
  }
}
