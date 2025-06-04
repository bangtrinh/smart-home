import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUsersByContractId } from '../../../api/contractApi';
import { useTranslation } from 'react-i18next';

function ContractUsers() {
  const { t } = useTranslation();
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
        <h2>{t('contractUsersTitle', { id })}</h2>
        <Link className="link-button" to="/contracts">← {t('back')}</Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>{t('userId')}</th>
            <th>{t('username')}</th>
            <th>{t('email')}</th>
            <th>{t('role')}</th>
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
              <td colSpan="4" style={{ textAlign: 'center' }}>{t('noUsersLinked')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ContractUsers;
