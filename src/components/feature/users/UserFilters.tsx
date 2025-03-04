import React, { useState } from 'react';
import Input from '../../common/FormElements/Input';
import Button from '../../common/Button/Button';
import { UserFilters as UserFiltersType } from '../../../types/user';
import './UserFilters.css';

interface UserFiltersProps {
  onFilter: (filters: UserFiltersType) => void;
  loading: boolean;
}

const UserFilters: React.FC<UserFiltersProps> = ({ onFilter, loading }) => {
  const [filters, setFilters] = useState<UserFiltersType>({
    email: null,
    name: null,
    roleType: null,
    deleted: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value || null, // Convert empty string to null
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters: UserFiltersType = {
      email: null,
      name: null,
      roleType: null,
      deleted: false,
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="user-filters">
      <h3>Filter Users</h3>
      <form onSubmit={handleSubmit}>
        <div className="filter-row">
          <Input
            name="email"
            label="Email"
            value={filters.email || ''}
            onChange={handleInputChange}
            placeholder="Filter by email"
          />
          
          <Input
            name="name"
            label="Name"
            value={filters.name || ''}
            onChange={handleInputChange}
            placeholder="Filter by name"
          />
        </div>
        
        <div className="filter-row">
          <div className="form-control">
            <label htmlFor="roleType" className="form-label">Role</label>
            <select
              id="roleType"
              name="roleType"
              className="form-input"
              value={filters.roleType || ''}
              onChange={handleInputChange}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Teacher</option>
              <option value="ACADEMY">Academy</option>
            </select>
          </div>
          
          <div className="form-control checkbox-control">
            <label htmlFor="deleted" className="form-label checkbox-label">
              <input
                type="checkbox"
                id="deleted"
                name="deleted"
                checked={filters.deleted}
                onChange={handleCheckboxChange}
              />
              Include Deleted Users
            </label>
          </div>
        </div>
        
        <div className="filter-actions">
          <Button type="submit" variant="primary" isLoading={loading}>
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Reset Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserFilters;