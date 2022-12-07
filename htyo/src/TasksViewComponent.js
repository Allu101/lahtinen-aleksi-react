import React from 'react';
import TasksComponent from './TaskComponent';
import AddNewTaskComponent from './AddNewTaskComponent';

export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allContexts: [],
      tasks: [],
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
        this.setState({ allContexts: data });
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
          <h1>Tasks</h1>
          {this.addNewTaskComponent()}
          {this.getTasks()}
        </nav>
      </div>
    );
  }

  addNewTaskComponent() {
    if (this.state.allContexts.length === 0) return;

    return (
      <AddNewTaskComponent
        onAddNewTask={this.createTask}
        allContexts={this.state.allContexts}
      ></AddNewTaskComponent>
    );
  }

  createTask = (name, contexts, clearTextBoxValues) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.nextID,
        name: name,
        contexts: contexts,
      }),
    };
    fetch('http://localhost:3010/tasks/', requestOptions)
      .then((response) => response.json())
      .then(async () => {
        this.initTasks();
        clearTextBoxValues();
      });
  };

  deleteTask = (id) => {
    fetch(`http://localhost:3010/tasks/${id}`, {
      method: 'DELETE',
    }).then(async () => this.initTasks());
  };

  getTasks() {
    const { tasks, allContexts } = this.state;
    if (allContexts === null) return;
    let taskComponents = [];
    tasks.forEach((task) => {
      taskComponents.push(
        <TasksComponent
          key={task.id}
          id={task.id}
          name={task.name}
          contexts={task.contexts}
          onDelete={this.deleteTask}
          allContexts={this.state.allContexts}
        />
      );
      this.nextID = task.id + 1;
    });
    return taskComponents;
  }
}
