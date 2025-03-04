import { ApiResponse } from './auth';

export type RoleType = 'ACADEMY' | 'ADMIN' | 'TEACHER';

export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  roleType: RoleType;
  deleted: boolean;
  // Add other user fields as needed
}

export interface Paginated<T> {
  content: T[];
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
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface UserFilters {
  email?: string | null;
  name?: string | null;
  roleType?: RoleType | null;
  deleted?: boolean;
}

export type UserResponse = ApiResponse<Paginated<User>>;