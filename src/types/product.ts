export interface Product {
    productId?: string
    productName: string;
    price: number;
    stock: number;
    mainImage: string;
    brand: string;
    status: 0 | 1;
    description: string;
  }

// Pagination and sorting information interface
export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// Pagination parameters interface
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Pagination result interface
export interface Page<T> {
  content: T[];
  pageable: Pageable; // Replace with the actual Pageable interface
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort; // Add sort field definition
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number; // Add this field
}

  
  export interface ApiResult<T> {
    code: number;
    message: string;
    data: T;
  }