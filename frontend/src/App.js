import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "https://shop-backend-p7t6.onrender.com/api"; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const config = {
    headers: { 'x-auth-token': token }
  };

  const getTasks = async () => {
  if (!token) return;
  setLoading(true); // Turn it on
  try {
    const response = await axios.get(`${API_URL}/tasks`, config);
    setTasks(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  setLoading(false); // Turn it off
};

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    try {
      
      const res = await axios.post(`${API_URL}/auth/${endpoint}`, { email, password });
      if (!isRegistering) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      } else {
        alert("Registered successfully! Now please login.");
        setIsRegistering(false);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Auth failed");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTasks([]);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await axios.post(`${API_URL}/tasks`, { name }, config);
      setName('');
      getTasks();
    } catch (error) { console.error(error); }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/tasks/${id}`, { completed: !currentStatus }, config);
      getTasks();
    } catch (error) { console.error(error); }
  };

  const deleteTask = async (id) => {
    try {
      
      await axios.delete(`${API_URL}/tasks/${id}`, config);
      getTasks();
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (token) {
      getTasks();
    }
  }, [token]);
   const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="container">
      {!token ? (
        <div className="auth-box">
          <h1>{isRegistering ? 'Create Account' : 'Login'}</h1>
          <form onSubmit={handleAuth}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="add-btn">{isRegistering ? 'Sign Up' : 'Login'}</button>
          </form>
             
          <p onClick={() => setIsRegistering(!isRegistering)} style={{cursor:'pointer', marginTop: '10px', color: 'blue'}}>
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </p>
        </div>
      ) : (
        <>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h1>Task Manager</h1>
            <button onClick={logout} className="delete-btn" style={{height:'30px'}}>Logout</button>
          </div>
          <div className="input-group">
            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ marginBottom: '10px', backgroundColor: '#f9f9f9' }}/>
            </div>
          <form onSubmit={addTask} className="input-group">
            <input type="text" placeholder="New Task..." value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit" className="add-btn">Add</button>
          </form>

{loading ? (
  <div className="loading-container">
    <div className="loader"></div>
    <p>Waking up the server...</p>
  </div>
) : (
  <>
    {/* Change tasks.map to filteredTasks.map */}
{filteredTasks.length === 0 ? (
  <p style={{ textAlign: 'center' }}>No matching tasks found!</p>
) : (
  <ul>
    {filteredTasks.map((task) => (
      <li key={task._id}>
        <span
          onClick={() => toggleComplete(task._id, task.completed)}
          style={{
            textDecoration: task.completed ? 'line-through' : 'none',
            cursor: 'pointer',
          }}
        >
          {task.name}
        </span>
        <button onClick={() => deleteTask(task._id)} className="delete-btn">
          Delete
        </button>
      </li>
    ))}
  </ul>
)}
            <button onClick={() => deleteTask(task._id)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
      </ul>
    )}
  </>
)}
</>
)}
</div>
      
      );
    }
export default App;