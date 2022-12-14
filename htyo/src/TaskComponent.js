import React from 'react';
import { contains, getContextButtons } from './utis';

export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      editing: false,
      name: this.props.name,
      contexts: this.props.contexts,
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

  renderEditState() {
    return (
      <div className="task" key={this.props.index}>
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
              this.state.id
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

  renderNormal() {
    return (
      <div className="task" key={this.props.index}>
        <h2 key={this.props.index}>{this.state.name}</h2>
        <button onClick={this.edit}>Edit</button>
        {this.getContexts(this.state.contexts, this.props.allContexts)}
      </div>
    );
  }

  render() {
    return this.state.editing ? this.renderEditState() : this.renderNormal();
  }
}
