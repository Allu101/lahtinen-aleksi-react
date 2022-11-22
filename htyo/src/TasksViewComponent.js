import React from 'react';

export default class TasksViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      contexts: null,
    };
  }

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

  getTasks() {
    const { tasks, contexts } = this.state;
    if (contexts === null) return;
    return tasks.map((task, index) => (
      <div className="task" key={index}>
        <h1 key={index}>{task.name}</h1>
        {this.getContexts(task.contexts, contexts)}
      </div>
    ));
  }

  getContexts(taskContexts, contexts) {
    return taskContexts.map((contextId, index) => (
      <p key={index}>{contexts[contextId].name}</p>
    ));
  }
}
