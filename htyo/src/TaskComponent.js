import React from 'react';

export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      editing: false,
      name: this.props.name,
      contexts: this.props.contexts,
      onDelete: this.props.onDelete,
    };
    this.handleMessageChange = (event) => {
      this.setState({
        name: event.target.value,
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

  edit = () => {
    this.setState({
      editing: true,
    });
  };

  getContextButtons = () => {
    let buttons = [];
    let className = '';
    let index = 1;
    this.props.allContexts.map((context) => {
      if (this.contains(this.state.contexts, context.id)) {
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

  handleClick = () => {
    if (this.contains(this.state.contexts, this.lastClickedButtonID)) {
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
        <button onClick={this.save}>Save</button>
        {this.getContextButtons()}
      </div>
    );
  }

  renderNormal() {
    return (
      <div className="task" key={this.props.index}>
        <h2 key={this.props.index}>
          {this.state.name} {this.state.id}
        </h2>
        <button onClick={this.edit}>Edit</button>
        {this.getContexts(this.state.contexts, this.props.allContexts)}
      </div>
    );
  }

  save = () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.state.name,
        contexts: this.state.contexts,
      }),
    };
    fetch(`http://localhost:3010/tasks/${this.state.id}`, requestOptions)
      .then((response) => response.json())
      .then(async () => {
        this.setState({
          editing: false,
        });
      });
  };

  render() {
    return this.state.editing ? this.renderEditState() : this.renderNormal();
  }
}
