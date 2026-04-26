import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
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
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getPhones = async (
  page = 0,
  size = 12,
  brand?: string,
  condition?: string,
  minPrice?: number,
  maxPrice?: number,
  sortBy = 'createdAt',
  sortDirection = 'desc'
) => {
  const response = await api.get<ApiResponse<PageResponse<Phone>>>('/phones', {
    params: {
      page,
      size,
      ...(brand && { brand }),
      ...(condition && { condition }),
      ...(minPrice !== undefined && { minPrice }),
      ...(maxPrice !== undefined && { maxPrice }),
      sortBy,
      sortDirection,
    },
  });
  return response.data.data;
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
