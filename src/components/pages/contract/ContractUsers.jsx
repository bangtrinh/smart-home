import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUsersByContractId } from '../../../api/contractApi';

function ContractUsers() {
  const { id } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [id]);

  const fetchUsers = async () => {
    const data = await getUsersByContractId(id);
    setUsers(data);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>👥 Danh sách người dùng của hợp đồng #{id}</h2>
        <Link className="link-button" to="/contracts">← Quay lại</Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.roles.join(', ')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Không có người dùng liên kết.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ContractUsers;
