'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function Tasks() {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // Load tasks from localStorage when component mounts
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    setTasks([...tasks, {
      id: Date.now(),
      text: newTask,
      completed: false
    }]);
    setNewTask('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 text-white z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        type="button"
      >
        {isOpen ? '×' : '📋'}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-black/50 backdrop-blur-md rounded-lg p-4 w-[300px] z-50">
          <h3 className="text-xl font-light mb-4">Tasks</h3>
          
          <form onSubmit={addTask} className="mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="w-full bg-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </form>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-2 bg-white/5 rounded p-2"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="rounded"
                />
                <span className={task.completed ? 'line-through text-white/50' : ''}>
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-auto text-white/50 hover:text-white"
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 