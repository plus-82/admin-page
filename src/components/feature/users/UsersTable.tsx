import React, { useMemo } from 'react';
import Table, { Column } from '../../common/Table/Table';
import Pagination from '../../common/Pagination/Pagination';
import { User } from '../../../types/user';
import './UsersTable.css';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
}) => {
  const columns: Column<User>[] = useMemo(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessor: (user) => user.id,
      },
      {
        id: 'name',
        header: 'Name',
        accessor: (user) => {
          const firstName = user.firstName || '';
          const lastName = user.lastName || '';
          return `${firstName} ${lastName}`.trim() || '-';
        },
      },
      {
        id: 'email',
        header: 'Email',
        accessor: (user) => user.email,
      },
      {
        id: 'roleType',
        header: 'Role',
        accessor: (user) => (
          <span className={`role-badge role-${user.roleType.toLowerCase()}`}>
            {user.roleType}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessor: (user) => (
          <span className={`status-badge ${user.deleted ? 'status-deleted' : 'status-active'}`}>
            {user.deleted ? 'Deleted' : 'Active'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        accessor: (user) => (
          <div className="action-buttons">
            <button className="action-button action-view">View</button>
            <button className="action-button action-edit">Edit</button>
          </div>
        ),
      },
    ],
    []
  );

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="users-table-container">
      <Table<User>
        columns={columns}
        data={users}
        keyExtractor={(user) => user.id}
        isLoading={loading}
        emptyMessage="No users found"
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default UsersTable;