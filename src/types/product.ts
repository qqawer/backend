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

// 分页排序信息接口
export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// 分页参数接口
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// 分页结果接口完善
export interface Page<T> {
  content: T[];
  pageable: Pageable; // 替换为具体的Pageable接口
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort; // 补充sort字段定义
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number; // 补充该字段
}

  
  export interface ApiResult<T> {
    code: number;
    message: string;
    data: T;
  }