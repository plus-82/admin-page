import React, { useEffect, useState } from 'react';
import UserFilters from '../components/feature/users/UserFilters';
import UsersTable from '../components/feature/users/UsersTable';
import { User, UserFilters as UserFiltersType, Paginated } from '../types/user';
import userService from '../services/user.service';
import usePagination from '../hooks/usePagination';
import '../styles/UsersPage.css';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFiltersType>({});

  const { 
    page, 
    rowsPerPage, 
    setTotal, 
    totalPages, 
    goToPage 
  } = usePagination({
    initialPage: 0,
    initialRowsPerPage: 10
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUsers(page, rowsPerPage, filters);
      
      if (response && response.data) {
        setUsers(response.data.content);
        setTotal(response.data.totalElements);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, filters]);

  const handleFilterChange = (newFilters: UserFiltersType) => {
    setFilters(newFilters);
    goToPage(0); // Reset to first page when filters change
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>User Management</h1>
      </div>
      
      <UserFilters onFilter={handleFilterChange} loading={loading} />
      
      <UsersTable
        users={users}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
};

export default UsersPage;