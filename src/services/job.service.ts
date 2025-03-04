import api from './api';
import { JobResponse, JobFilters } from '../types/job';

export const jobService = {
  async getJobs(
    pageNumber: number = 0,
    rowCount: number = 10,
    filters: JobFilters = {}
  ): Promise<JobResponse> {
    // Create URL search params
    const params = new URLSearchParams();
    params.append('pageNumber', pageNumber.toString());
    params.append('rowCount', rowCount.toString());
    
    // Add any other job filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get<JobResponse>(`/api/v1/job-posts?${params.toString()}`);
    return response.data;
  },
  
  async getJobById(id: number): Promise<any> {
    const response = await api.get(`/api/v1/job-posts/${id}`);
    return response.data;
  },
  
  async createJob(jobData: any): Promise<any> {
    const response = await api.post('/api/v1/job-posts', jobData);
    return response.data;
  },
  
  async updateJob(id: number, jobData: any): Promise<any> {
    const response = await api.put(`/api/v1/job-posts/${id}`, jobData);
    return response.data;
  },
  
  async deleteJob(id: number): Promise<any> {
    const response = await api.delete(`/api/v1/job-posts/${id}`);
    return response.data;
  }
};

export default jobService;