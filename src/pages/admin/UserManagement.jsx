import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add User form state
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "user",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState("");
  const [addError, setAddError] = useState("");

  // Edit User
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    username: "",
    role: "user",
    password: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(data || []); // Ensure we always have an array
      setLoading(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to load users"
      );
      setLoading(false);
      setUsers([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Add User input change
  const handleAddChange = (e) => {
    setAddForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  // Add User submit
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        addForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAddSuccess("User added successfully!");
      setAddForm({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "user",
      });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setAddError(
        err?.response?.data?.message || err?.message || "Failed to add user"
      );
    } finally {
      setAddLoading(false);
    }
  };

  // Edit click
  const startEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      password: "",
    });
    setEditError("");
    setEditSuccess("");
  };

  // Edit change
  const handleEditChange = (e) => {
    setEditForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  // Save Edit
  const handleEditUser = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    try {
      const updateObj = {
        ...editForm,
      };
      if (!updateObj.password) delete updateObj.password;
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${editingUser}`,
        updateObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditSuccess("User updated successfully!");
      setEditingUser(null);
      fetchUsers(); // Refresh user list
    } catch (err) {
      setEditError(
        err?.response?.data?.message || err?.message || "Failed to update user"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUsers(); // Refresh user list
    } catch (err) {
      alert(
        err?.response?.data?.message || err?.message || "Failed to delete user"
      );
    }
  };

  return (
    <div className="admin-container user-management">
      <h2 className="admin-title">User Management</h2>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="user-form">
        <h3>Add User</h3>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={addForm.name}
              onChange={handleAddChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={addForm.username}
              onChange={handleAddChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={addForm.email}
              onChange={handleAddChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={addForm.password}
              onChange={handleAddChange}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <select
              name="role"
              value={addForm.role}
              onChange={handleAddChange}
              required
            >
              <option value="user">User</option>
              <option value="superuser">Superuser</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="btn-submit"
          disabled={addLoading}
        >
          {addLoading ? "Adding..." : "Add User"}
        </button>
        {addError && <div className="error-message">{addError}</div>}
        {addSuccess && <div className="success-message">{addSuccess}</div>}
      </form>

      {/* Users Table */}
      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : users.length === 0 ? (
        <div className="no-data-message">No users found</div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) =>
                editingUser === user._id ? (
                  <tr key={user._id} className="editing-row">
                    <td>
                      <input
                        name="username"
                        value={editForm.username}
                        onChange={handleEditChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        required
                      />
                    </td>
                    <td>
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="user">User</option>
                        <option value="superuser">Superuser</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="actions">
                      <button
                        onClick={handleEditUser}
                        disabled={editLoading}
                        className="btn-save"
                      >
                        {editLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        disabled={editLoading}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                      {editError && (
                        <div className="error-message">{editError}</div>
                      )}
                      {editSuccess && (
                        <div className="success-message">{editSuccess}</div>
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                    <td className="actions">
                      <button onClick={() => startEdit(user)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)} className="btn-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}