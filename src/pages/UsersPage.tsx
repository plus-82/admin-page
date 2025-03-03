import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import Sidebar from '../components/Sidebar';
import '../styles/UsersPage.css';

interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  genderType: string;
  birthDate: string | null;
  email: string;
  countryId: number | null;
  countryNameEn: string | null;
  countryCode: string | null;
  countryCallingCode: string | null;
  flag: string | null;
  profileImagePath: string | null;
}

interface UsersResponse {
  data: {
    content: User[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    first: boolean;
    last: boolean;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
  };
  code: string;
  message: string;
}

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rowCount, setRowCount] = useState(5);
  
  // Search and filter states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [roleType, setRoleType] = useState('');
  const [deleted, setDeleted] = useState(false);

  const roleOptions = [
    { value: '', label: 'All' },
    { value: 'ACADEMY', label: 'Academy' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'TEACHER', label: 'Teacher' }
  ];

  const fetchUsers = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append('pageNumber', currentPage.toString());
      params.append('rowCount', rowCount.toString());
      
      if (email) params.append('email', email);
      if (name) params.append('name', name);
      if (roleType) params.append('roleType', roleType);
      params.append('deleted', deleted.toString());

      const response = await axios.get<UsersResponse>(`${API_BASE_URL}/api/v1/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.code === 'CM-001') {
        setUsers(response.data.data.content);
        
        // Set pagination info
        const { last, first, number, numberOfElements, size } = response.data.data;
        setCurrentPage(number);
        
        if (first && numberOfElements > 0) {
          const calculatedTotalPages = Math.ceil(numberOfElements / size);
          setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        } else if (last) {
          setTotalPages(number + 1);
        }
      } else {
        setError(response.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setError('Failed to fetch users. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, rowCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page on new search
    fetchUsers();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpiry');
    navigate('/login');
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages));
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      );
    }
    
    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Prev
        </button>
        
        {pages}
        
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Last
        </button>
      </div>
    );
  };

  const getFullName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return 'N/A';
  };

  return (
    <div className="page-container">
      <Sidebar />
      
      <div className="main-content">
        <div className="header">
          <h1>Users Management</h1>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="filters-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-row">
              <div className="filter-group">
                <label>Email:</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Search by email"
                  className="search-input"
                />
              </div>
              
              <div className="filter-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Search by name"
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="filter-row">
              <div className="filter-group">
                <label>User Role:</label>
                <select 
                  value={roleType} 
                  onChange={(e) => setRoleType(e.target.value)}
                  className="select-input"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Show Deleted:</label>
                <input
                  type="checkbox"
                  checked={deleted}
                  onChange={(e) => setDeleted(e.target.checked)}
                  className="checkbox-input"
                />
              </div>
              
              <div className="filter-group">
                <label>Rows per page:</label>
                <select 
                  value={rowCount} 
                  onChange={(e) => setRowCount(Number(e.target.value))}
                  className="select-input"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            
            <div className="filter-actions">
              <button type="submit" className="apply-filters-button">Search Users</button>
              <button 
                type="button" 
                onClick={() => {
                  setEmail('');
                  setName('');
                  setRoleType('');
                  setDeleted(false);
                  setCurrentPage(0);
                }} 
                className="reset-filters-button"
              >
                Reset Filters
              </button>
            </div>
          </form>
        </div>
        
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="no-results">No users found</div>
        ) : (
          <div className="users-list">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Birth Date</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{getFullName(user)}</td>
                    <td>{user.email}</td>
                    <td>{user.genderType || 'N/A'}</td>
                    <td>{formatDate(user.birthDate)}</td>
                    <td>
                      {user.countryNameEn ? (
                        <span>{user.flag || ''} {user.countryNameEn}</span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;