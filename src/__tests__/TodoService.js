let data = {
  todos: [
    {
      title: 'Clean the toilettes',
      description: 'Clean the toilettes',
      dueDate: new Date(),
    },
    {
      title: 'Clean the bathroom',
      description: 'Clean the bathroom',
      dueDate: new Date(),
    },
    {
      title: 'Clean the kitchen',
      description: 'Clean the kitchen',
      dueDate: new Date(),
    },
    {
      title: 'Clean the bedroom',
      description: 'Clean the bedroom',
      dueDate: new Date(),
    },
    {
      title: 'Clean the garage',
      description: 'Clean the garage',
      dueDate: new Date(),
    },
    {
      title: 'Clean the dining room',
      description: 'Clean the dining room',
      dueDate: new Date(),
    },
    {
      title: 'Clean the living room',
      description: 'Clean the living room',
      dueDate: new Date(),
    },
  ],
};

export function getTodos() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data.todos);
    }, 2000);
  });
}

export function addTodo(todo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      data.todos = [...data.todos, todo];
      resolve(data.todos);
    }, 2000);
  });
}
