import React from 'react';
import TasksComponent from './TaskComponent';
import { TasksHeaderComponent } from './TasksHeaderComponent';
import { contains, getContextButtons } from './utis';

export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allContexts: [],
      tasks: [],
      visibleContexts: [],
      showContextsMenu: false,
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
        this.state.allContexts.forEach((c) => {
          if (!contains(this.state.visibleContexts, c.id)) {
            this.state.visibleContexts.push(c.id);
          }
        });
      });
  };

  async initTasks() {
    await fetch('http://localhost:3010/tasks')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ tasks: data });
      });
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

  getDisplaySettingsElements = () => {
    let list = [];
    list.push(
      <button
        key={'filterBtn'}
        onClick={() => {
          this.setState({ showContextsMenu: !this.state.showContextsMenu });
        }}
      >
        Filter tasks
      </button>
    );
    if (this.state.showContextsMenu) {
      list.push(
        getContextButtons(
          this.state.allContexts,
          this.state.visibleContexts,
          this.handleFilterClick
        )
      );
    }
    return list;
  };

  getTasks() {
    const { tasks, allContexts, visibleContexts } = this.state;
    if (allContexts === null) return;
    let taskComponents = [];
    tasks.forEach((task) => {
      let show = false;
      task.contexts.forEach(function (c) {
        if (contains(visibleContexts, c)) {
          show = true;
        }
      });
      if (show) {
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
      }
      this.nextTaskID = task.id + 1;
    });
    return taskComponents;
  }

  handleFilterClick = (clickedID) => {
    if (contains(this.state.visibleContexts, clickedID)) {
      this.setState({
        visibleContexts: this.state.visibleContexts.filter((context) => {
          return context !== clickedID;
        }),
      });
    } else {
      if (!contains(this.state.visibleContexts, clickedID)) {
        this.state.visibleContexts.push(clickedID);
      }
    }
    this.forceUpdate();
  };

  render() {
    return (
      <div>
        <h1>Tasks</h1>
        {this.TasksHeaderComponent()}
        <div className="main"></div>
        <div className="tasks">{this.getTasks()}</div>
      </div>
    );
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

  TasksHeaderComponent() {
    if (this.state.allContexts.length === 0) return;

    return (
      <TasksHeaderComponent
        onAddNewTask={this.createTask}
        allContexts={this.state.allContexts}
        onDelete={this.deleteContexts}
        initContexts={this.initContexts}
        visibleContexts={this.state.visibleContexts}
        getDisplaySettingsElements={this.getDisplaySettingsElements}
      ></TasksHeaderComponent>
    );
  }
}
