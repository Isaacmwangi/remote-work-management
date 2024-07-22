import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddTask.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const AddTask = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    project_id: "",
    assigned_to: "",
    title: "",
    description: "",
    status: "Pending",
    due_date: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          axios.get("/api/projects", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }),
          axios.get("/api/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          })
        ]);
        setProjects(projectsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching projects or users", error);
      }
    };
    fetchProjectsAndUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/tasks", {
        ...task,
        project_id: parseInt(task.project_id, 10),
        assigned_to: parseInt(task.assigned_to, 10)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Task added successfully!");
      navigate("/tasks");
    } catch (error) {
      console.error("Error adding task", error.response ? error.response.data : error.message);
      toast.error("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  return (
    <div className="add-task-container">
      <h2 className="add-task-heading">Add Task</h2>
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="form-group">
          <label htmlFor="project_id">
            <i className="fas fa-briefcase"></i> Project:
          </label>
          <select
            id="project_id"
            name="project_id"
            value={task.project_id}
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
            value={task.assigned_to}
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
            value={task.title}
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
            value={task.description}
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
            value={task.status}
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
            value={task.due_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Save
              </>
            )}
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            <i className="fas fa-times"></i> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
