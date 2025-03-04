import { ApiResponse } from './auth';
import { Paginated } from './user';

export interface Job {
  id: number;
  title: string;
  description: string;
  // Add other job fields as needed
}

export interface JobFilters {
  // Define job-specific filters here
  title?: string;
  status?: string;
  // Add other filters as needed
}

export type JobResponse = ApiResponse<Paginated<Job>>;