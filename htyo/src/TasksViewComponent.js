import React from 'react';
import TasksComponent from './TaskComponent';
import AddNewTaskComponent from './AddNewTaskComponent';
import { contains } from './utis';

export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allContexts: [],
      tasks: [],
    };
  }
  nextTaskID = 1;

  componentDidMount = function () {
    this.initContexts();
    this.initTasks();
  };

  initContexts = async () => {
    await fetch('http://localhost:3010/contexts')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ allContexts: data });
      });
  };

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
        onDelete={this.deleteContexts}
        initContexts={this.initContexts}
      ></AddNewTaskComponent>
    );
  }

  createTask = (name, contexts, clearTextBoxValues) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.nextTaskID,
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

  deleteContexts = async (idList) => {
    await idList.forEach(async (id) => {
      await fetch(`http://localhost:3010/contexts/${id}`, {
        method: 'DELETE',
      });
      this.state.tasks.forEach((task) => {
        if (contains(task.contexts, id)) {
          const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: task.name,
              contexts: task.contexts.filter((context) => {
                return context !== id;
              }),
            }),
          };
          fetch(`http://localhost:3010/tasks/${task.id}`, requestOptions).then(
            (response) => response.json()
          );
        }
      });
      this.initContexts();
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
          onSave={this.saveTask}
        />
      );
      this.nextTaskID = task.id + 1;
    });
    return taskComponents;
  }

  saveTask = (name, contexts, id) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        contexts: contexts,
      }),
    };
    fetch(`http://localhost:3010/tasks/${id}`, requestOptions)
      .then((response) => response.json())
      .then(async () => {
        this.initTasks();
      });
  };
}
