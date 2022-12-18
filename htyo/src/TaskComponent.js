import React from 'react';
import { contains, getContextButtons } from './utis';

export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contexts: this.props.contexts,
      editing: false,
      id: this.props.id,
      isActive: false,
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
    this.taskClasses += ' task-activated';
    this.setState({ isActive: true });
  };

  onInactivate = () => {
    this.taskClasses = 'task';
    this.setState({ isActive: false });
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
