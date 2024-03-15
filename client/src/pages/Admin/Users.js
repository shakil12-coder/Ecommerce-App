import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import '../../style/AdminUser.css';

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`);
      setAllUsers(data.users);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="header">
              <h2>All Users</h2>
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <div className="table-container">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col" className="table-heading">#</th>
                      <th scope="col" className="table-heading">Name</th>
                      <th scope="col" className="table-heading">Email</th>
                      <th scope="col" className="table-heading">Phone</th>
                      <th scope="col" className="table-heading">Address</th>
                      <th scope="col" className="table-heading">Admin/User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user, i) => (
                      <tr key={i}>
                        <td className="table-cell">{i + 1}</td>
                        <td className="table-cell">{user.name}</td>
                        <td className="table-cell">{user.email}</td>
                        <td className="table-cell">{user.phone}</td>
                        <td className="table-cell">{user.address}</td>
                        <td className={`table-cell role ${user.role === 0 ? 'user' : 'admin'}`}>
                          {user.role === 0 ? 'User' : 'Admin'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
