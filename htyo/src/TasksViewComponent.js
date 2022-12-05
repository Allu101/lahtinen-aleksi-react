import React from 'react';
import TasksComponent from './TaskComponent';

export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      contexts: null,
    };
  }
  nextID = 1;

  componentDidMount = function () {
    this.initContexts();
    this.initTasks();
  };

  async initContexts() {
    await fetch('http://localhost:3010/contexts')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ contexts: data });
      });
  }

  async initTasks() {
    await fetch('http://localhost:3010/tasks')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ tasks: data });
      });
  }

  render() {
    return (
      <div>
        <nav className="something">
          <h2>Tasks</h2>
          {this.getTasks()}
        </nav>
      </div>
    );
  }

  delete = (id) => {
    fetch(`http://localhost:3010/tasks/${id}`, {
      method: 'DELETE',
    }).then(async () => this.initTasks());
  };

  getTasks() {
    const { tasks, contexts } = this.state;
    if (contexts === null) return;
    let taskComponents = [];
    tasks.forEach((task) => {
      taskComponents.push(
        <TasksComponent
          key={task.id}
          id={task.id}
          name={task.name}
          contexts={this.getContexts(task.contexts, contexts)}
          onDelete={this.delete}
        />
      );
      this.nextID = task.id + 1;
    });
    console.log('next id: ' + this.nextID);
    return taskComponents;
  }

  getContexts(taskContexts, contexts) {
    return taskContexts.map((contextId, index) => (
      <p key={index}>{contexts[contextId].name}</p>
    ));
  }
}
