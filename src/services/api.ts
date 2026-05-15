import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Phone {
  id: number;
  model: string;
  brand: string;
  price: number;
  condition: string;
  description: string;
  specification: {
    ram: string;
    storage: string;
    battery: string;
    camera: string;
    screen?: string;
    [key: string]: string | undefined;
  };
  stockQuantity: number;
  images: string[];
}

export interface ContactInfo {
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  facebookLink: string;
  instagramLink: string;
  twitterLink: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  page?: {
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getPhones = async (
  page = 0,
  size = 12,
  searchTerm?: string,
  condition?: string,
  minPrice?: number,
  maxPrice?: number,
  sortBy = 'createdAt',
  sortDirection = 'desc'
) => {
  const hasSearch = !!searchTerm && searchTerm.trim().length > 0;
  const response = await api.get<ApiResponse<PageResponse<Phone>>>('/phones', {
    params: {
      page,
      size,
      ...(hasSearch && { brand: searchTerm?.trim() }),
      ...(condition && { condition }),
      ...(minPrice !== undefined && { minPrice }),
      ...(maxPrice !== undefined && { maxPrice }),
      sortBy,
      sortDirection,
    },
  });
  const payload = response.data.data;
  const pageMeta = payload.page;
  return {
    ...payload,
    totalPages: payload.totalPages ?? pageMeta?.totalPages ?? 0,
    totalElements: payload.totalElements ?? pageMeta?.totalElements ?? 0,
    size: payload.size ?? pageMeta?.size ?? size,
    number: payload.number ?? pageMeta?.number ?? page,
  };
};

export const getPhoneById = async (id: string) => {
  const response = await api.get<ApiResponse<Phone>>(`/phones/${id}`);
  return response.data.data;
};

export const createPhone = async (formData: FormData) => {
  const response = await api.post<ApiResponse<Phone>>('/phones', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const updatePhone = async (id: number, formData: FormData) => {
  const response = await api.put<ApiResponse<Phone>>(`/phones/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const deletePhone = async (id: number) => {
  const response = await api.delete<ApiResponse<void>>(`/phones/${id}`);
  return response.data;
};

export const getContactInfo = async () => {
  const response = await api.get<ApiResponse<ContactInfo>>('/public/contact-info');
  return response.data.data;
};

export const login = async (data: any) => {
  const response = await api.post<ApiResponse<any>>('/auth/login', data);
  return response.data.data;
};

export const register = async (data: any) => {
  const response = await api.post<ApiResponse<any>>('/auth/register', data);
  return response.data;
};

export const updateProfile = async (data: any) => {
  const response = await api.put<ApiResponse<any>>('/auth/me/profile', data);
  return response.data;
};

export const getReviews = async (phoneId: number) => {
  const response = await api.get<ApiResponse<any[]>>(`/reviews/${phoneId}`);
  return response.data.data;
};

export const addReview = async (phoneId: number, data: { rating: number, comment: string }) => {
  const response = await api.post<ApiResponse<any>>(`/reviews/${phoneId}`, data);
  return response.data.data;
};

export default api;
