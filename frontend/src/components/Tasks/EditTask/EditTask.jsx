import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditTask.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EditTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState({});
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const [taskRes, projectsRes, usersRes] = await Promise.all([
          axios.get(`/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('/api/projects', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('/api/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setTask({
          ...taskRes.data,
          due_date: taskRes.data.due_date.split('T')[0],
        });
        setProjects(projectsRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task or related data', error);
        toast.error('Error fetching task details');
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/tasks/${id}`, {
        ...task,
        due_date: new Date(task.due_date).toISOString(), 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Task updated successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error('Error updating task', error);
      toast.error('Failed to update task.');
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <div className="edit-task-container">
      <h2 className="edit-task-heading">Edit Task</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="edit-task-form">
          <div className="form-group">
            <label htmlFor="project_id">
              <i className="fas fa-briefcase"></i> Project:
            </label>
            <select
              id="project_id"
              name="project_id"
              value={task.project_id || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="assigned_to">
              <i className="fas fa-user"></i> Assigned To:
            </label>
            <select
              id="assigned_to"
              name="assigned_to"
              value={task.assigned_to || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="title">
              <i className="fas fa-tag"></i> Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={task.title || ''}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">
              <i className="fas fa-align-left"></i> Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={task.description || ''}
              onChange={handleChange}
              placeholder="Enter task description"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">
              <i className="fas fa-tachometer-alt"></i> Status:
            </label>
            <select
              id="status"
              name="status"
              value={task.status || ''}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="due_date">
              <i className="fas fa-calendar-alt"></i> Due Date:
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={task.due_date || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-button">
              <i className="fas fa-save"></i> Save
            </button>
            <button type="button" className="cancel-button" onClick={handleCancel}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditTask;
