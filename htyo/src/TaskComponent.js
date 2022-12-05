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

  edit = () => {
    this.setState({
      editing: true,
    });
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
        {this.state.contexts}
      </div>
    );
  }

  renderNormal() {
    return (
      <div className="task" key={this.props.index}>
        <h1 key={this.props.index}>
          {this.state.name} {this.state.id}
        </h1>
        <button onClick={this.edit}>Edit</button>
        {this.state.contexts}
      </div>
    );
  }

  save = () => {
    this.setState({
      editing: false,
    });
  };

  render() {
    return this.state.editing ? this.renderEditState() : this.renderNormal();
  }
}
