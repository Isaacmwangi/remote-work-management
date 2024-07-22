import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setCompletedTasks(response.data);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      }
    };

    fetchCompletedTasks();
  }, []);

  return (
    <div>
      <h1>Completed Tasks</h1>
      <ul>
        {completedTasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTasks;
