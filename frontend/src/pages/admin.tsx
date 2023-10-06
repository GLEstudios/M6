// pages/admin.tsx

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  // At the beginning of the AdminDashboard component

const ADMIN_PASSWORD = "1";  // Change this to your desired password

if (typeof window !== 'undefined') {  // Ensure this runs only in the browser
  const password = prompt("Enter admin password:");
  if (password !== ADMIN_PASSWORD) {
    alert("Incorrect password!");
    window.location.href = "/";  // Redirect to the homepage
  }
}

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend
    fetch('/api/users')  // Assuming you have an endpoint to fetch all users
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Enterprise</th>
            <th>Phone</th>
            <th>Attendance</th>
            <th>Wallet Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.enterprise}</td>
              <td>{user.phone}</td>
              <td>{user.attendance}</td>
              <td>{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
