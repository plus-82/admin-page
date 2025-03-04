import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import Sidebar from '../components/Sidebar';
import '../styles/JobPostsPage.css';

interface JobPost {
  id: number;
  title: string;
  dueDate: string;
  academyId: number;
  academyName: string;
  locationType: string;
  forKindergarten: boolean;
  forElementary: boolean;
  forMiddleSchool: boolean;
  forHighSchool: boolean;
  forAdult: boolean;
  imageUrls: string[];
}

interface JobPostsResponse {
  data: {
    content: JobPost[];
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

const JobPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rowCount, setRowCount] = useState(5);
  
  // Search and filter states
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [orderType, setOrderType] = useState('DESC');
  const [locationTypeList, setLocationTypeList] = useState<string[]>([]);
  const [forKindergarten, setForKindergarten] = useState(false);
  const [forElementary, setForElementary] = useState(false);
  const [forMiddleSchool, setForMiddleSchool] = useState(false);
  const [forHighSchool, setForHighSchool] = useState(false);
  const [forAdult, setForAdult] = useState(false);
  const [fromDueDate, setFromDueDate] = useState('');
  const [toDueDate, setToDueDate] = useState('');

  const locationOptions = [
    { value: 'SEOUL', label: 'Seoul' },
    { value: 'INCHEON', label: 'Incheon' },
    { value: 'ULSAN', label: 'Ulsan' },
    { value: 'BUSAN', label: 'Busan' },
    { value: 'DAEGU', label: 'Daegu' },
    { value: 'DAEJEON', label: 'Daejeon' },
    { value: 'GWANGJU', label: 'Gwangju' },
    { value: 'GYEONGGI', label: 'Gyeonggi' }
  ];

  const fetchJobPosts = async () => {
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
      params.append('orderType', orderType);
      params.append('sortBy', sortBy);
      
      if (searchText) params.append('searchText', searchText);
      if (locationTypeList.length > 0) params.append('locationTypeList', locationTypeList.join(','));
      if (forKindergarten) params.append('forKindergarten', 'true');
      if (forElementary) params.append('forElementary', 'true');
      if (forMiddleSchool) params.append('forMiddleSchool', 'true');
      if (forHighSchool) params.append('forHighSchool', 'true');
      if (forAdult) params.append('forAdult', 'true');
      if (fromDueDate) params.append('fromDueDate', fromDueDate);
      if (toDueDate) params.append('toDueDate', toDueDate);

      const response = await axios.get<JobPostsResponse>(`${API_BASE_URL}/api/v1/job-posts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.code === 'CM-001') {
        setJobPosts(response.data.data.content);
        // Use last and first flags to determine pagination info
        const { last, first, number, numberOfElements, size } = response.data.data;
        setCurrentPage(number);
        
        // If this is the first page and there are elements, set totalPages based on numberOfElements
        if (first && numberOfElements > 0) {
          // Calculate totalPages, assuming numberOfElements is the total across all pages
          const calculatedTotalPages = Math.ceil(numberOfElements / size);
          setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        } else if (last) {
          // If this is the last page, set totalPages to current page + 1
          setTotalPages(number + 1);
        }
      } else {
        setError(response.data.message || 'Failed to fetch job posts');
      }
    } catch (err) {
      console.error('Error fetching job posts:', err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setError('Failed to fetch job posts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowCount, orderType, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page on new search
    fetchJobPosts();
  };

  const handleLocationChange = (location: string) => {
    if (locationTypeList.includes(location)) {
      setLocationTypeList(locationTypeList.filter(loc => loc !== location));
    } else {
      setLocationTypeList([...locationTypeList, location]);
    }
  };

  const formatDate = (dateString: string) => {
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

  return (
    <div className="page-container">
      <Sidebar />
      
      <div className="main-content">
        <div className="header">
          <h1>Job Posts</h1>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
      
      <div className="filters-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-row">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by title or content"
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="select-input"
              >
                <option value="dueDate">Due Date</option>
                <option value="createdAt">Created Date</option>
                <option value="title">Title</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Order:</label>
              <select 
                value={orderType} 
                onChange={(e) => setOrderType(e.target.value)}
                className="select-input"
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
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
          
          <div className="filter-row">
            <div className="filter-group date-filter">
              <label>Due Date Range:</label>
              <input
                type="date"
                value={fromDueDate}
                onChange={(e) => setFromDueDate(e.target.value)}
                className="date-input"
              />
              <span>to</span>
              <input
                type="date"
                value={toDueDate}
                onChange={(e) => setToDueDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label>Locations:</label>
              <div className="checkbox-group">
                {locationOptions.map(option => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={locationTypeList.includes(option.value)}
                      onChange={() => handleLocationChange(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label>Target Audience:</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={forKindergarten}
                    onChange={() => setForKindergarten(!forKindergarten)}
                  />
                  Kindergarten
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={forElementary}
                    onChange={() => setForElementary(!forElementary)}
                  />
                  Elementary
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={forMiddleSchool}
                    onChange={() => setForMiddleSchool(!forMiddleSchool)}
                  />
                  Middle School
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={forHighSchool}
                    onChange={() => setForHighSchool(!forHighSchool)}
                  />
                  High School
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={forAdult}
                    onChange={() => setForAdult(!forAdult)}
                  />
                  Adult
                </label>
              </div>
            </div>
          </div>
          
          <div className="filter-actions">
            <button type="submit" className="apply-filters-button">Apply Filters</button>
            <button 
              type="button" 
              onClick={() => {
                setSearchText('');
                setLocationTypeList([]);
                setForKindergarten(false);
                setForElementary(false);
                setForMiddleSchool(false);
                setForHighSchool(false);
                setForAdult(false);
                setFromDueDate('');
                setToDueDate('');
                setSortBy('dueDate');
                setOrderType('DESC');
              }} 
              className="reset-filters-button"
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <div className="loading">Loading job posts...</div>
      ) : jobPosts.length === 0 ? (
        <div className="no-results">No job posts found</div>
      ) : (
        <div className="job-posts-list">
          <table className="job-posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Due Date</th>
                <th>Target Audience</th>
                <th>Academy</th>
              </tr>
            </thead>
            <tbody>
              {jobPosts.map(post => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.locationType}</td>
                  <td>{formatDate(post.dueDate)}</td>
                  <td>
                    {[
                      post.forKindergarten ? 'Kindergarten' : null,
                      post.forElementary ? 'Elementary' : null,
                      post.forMiddleSchool ? 'Middle School' : null,
                      post.forHighSchool ? 'High School' : null,
                      post.forAdult ? 'Adult' : null
                    ].filter(Boolean).join(', ')}
                  </td>
                  <td>{post.academyName}</td>
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

export default JobPostsPage;