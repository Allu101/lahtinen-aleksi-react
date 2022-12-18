import React from 'react';
import TasksComponent from './TaskComponent';
import { TasksHeaderComponent } from './TasksHeaderComponent';
import { contains, getContextButtons } from './utis';

export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allContexts: [],
      showContextsMenu: false,
      tasks: [],
      visibleContexts: [],
    };
  }
  currentDragID = -1;
  nextTaskID = 1;
  tasksActivityLog = {};

  /**
   * (Next 4 methods)
   * First of all, get all data from db
   */
  componentDidMount = function () {
    this.initTasksActivityLog();
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

  async initTasksActivityLog() {
    await fetch('http://localhost:3010/tasksActivityLog')
      .then((response) => response.json())
      .then((data) => {
        data.forEach((d) => {
          this.tasksActivityLog[d.taskID] = { id: d.taskID, status: d.status };
        });
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
        orderNumber: this.state.tasks.length,
      }),
    };
    fetch('http://localhost:3010/tasks/', requestOptions)
      .then((response) => response.json())
      .then(async () => {
        this.initTasks();
        clearTextBoxValues();
      });
  };

  /**
   * Delete context(s) with given id(s) from db and update task contexts (if task have deleted contexts)
   * @param {*} idList
   */
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

  /**
   * Return Filter task and contexts buttons in list.
   * @returns
   */
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

  /**
   * Create task components and return all in list.
   */
  getTasks() {
    const { tasks, allContexts, visibleContexts } = this.state;
    let tasksList = [...tasks];
    if (allContexts === null) return;
    let taskComponents = [];
    tasksList = tasksList.sort((a, b) =>
      a.orderNumber < b.orderNumber ? -1 : 1
    );
    tasksList.forEach((task) => {
      let show = false;
      task.contexts.forEach(function (c) {
        if (contains(visibleContexts, c)) {
          show = true;
        }
      });
      if (show) {
        taskComponents.push(
          <div
            key={task.id}
            draggable
            onDragStart={() => this.onDragStart(task.id)}
            onDragOver={(event) => this.onDragOver(event)}
            onDrop={() => {
              this.onDrop(task.id);
            }}
          >
            <TasksComponent
              allContexts={this.state.allContexts}
              contexts={task.contexts}
              id={task.id}
              isActive={
                this.tasksActivityLog[task.id] !== undefined &&
                this.tasksActivityLog[task.id].status === 'START'
                  ? true
                  : false
              }
              key={task.id}
              name={task.name}
              onDelete={this.deleteTask}
              onSave={this.saveTask}
              orderNumber={task.orderNumber}
            />
          </div>
        );
      }
      this.nextTaskID = task.id + 1;
    });
    return taskComponents;
  }

  /**
   * Handle isible and hidden clicked contexts on the filter menu
   * @param {*} clickedID
   */
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

  onDragOver = (event) => {
    event.preventDefault();
  };

  onDragStart = (id) => {
    this.currentDragID = id;
  };

  /**
   * Call when drop task to over other task. Swap tasks ids and update new order numbers to db.
   */
  onDrop = (id) => {
    let targetTaskIndex;
    let targetTask;
    let currentDragTaskIndex;
    let currentDragTask;
    this.state.tasks.forEach((t, index) => {
      if (t.id === id) {
        targetTaskIndex = index;
        targetTask = t;
      } else if (t.id === this.currentDragID) {
        currentDragTaskIndex = index;
        currentDragTask = t;
      }
    });
    const copyListItems = [...this.state.tasks];
    [copyListItems[targetTaskIndex], copyListItems[currentDragTaskIndex]] = [
      copyListItems[currentDragTaskIndex],
      copyListItems[targetTaskIndex],
    ];

    [targetTask['orderNumber'], currentDragTask['orderNumber']] = [
      currentDragTask['orderNumber'],
      targetTask['orderNumber'],
    ];

    this.saveTask(
      targetTask.name,
      targetTask.context,
      targetTask.id,
      targetTask.orderNumber
    );
    this.saveTask(
      currentDragTask.name,
      currentDragTask.context,
      currentDragTask.id,
      currentDragTask.orderNumber
    );
    this.setState({ tasks: copyListItems });
    this.currentDragID = -1;
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

  /**
   * Update tasks propertys to db
   * @param {*} name
   * @param {*} contexts
   * @param {*} id
   * @param {*} orderNumber
   */
  saveTask = (name, contexts, id, orderNumber) => {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        contexts: contexts,
        orderNumber: orderNumber,
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
