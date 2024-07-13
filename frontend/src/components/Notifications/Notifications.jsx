import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    await axios.put(`/api/notifications/${id}/read`);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-container">
      <h2 className="notifications-header">Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} className="notification-item">
            <div className="notification-message">{notification.message}</div>
            <div className="notification-actions">
              <button onClick={() => handleMarkAsRead(notification.id)}>Mark as read</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
