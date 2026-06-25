const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface UserProfile {
  id: number;
  username: string;
  roles: string[];
}

export interface AppReview {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Store {
  id: number;
  user_id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('seapedia_token');
}

export function setAuthToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('seapedia_token', token);
    } else {
      localStorage.removeItem('seapedia_token');
    }
  }
}

export function getActiveRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('seapedia_active_role');
}

export function setActiveRole(role: string | null) {
  if (typeof window !== 'undefined') {
    if (role) {
      localStorage.setItem('seapedia_active_role', role);
    } else {
      localStorage.removeItem('seapedia_active_role');
    }
  }
}

export function getUserRoles(): string[] {
  if (typeof window === 'undefined') return [];
  const rolesStr = localStorage.getItem('seapedia_user_roles');
  return rolesStr ? JSON.parse(rolesStr) : [];
}

export function setUserRoles(roles: string[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('seapedia_user_roles', JSON.stringify(roles));
  }
}

export function clearAuth() {
  setAuthToken(null);
  setActiveRole(null);
  setUserRoles([]);
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const activeRole = getActiveRole();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (activeRole) {
    headers['X-Active-Role'] = activeRole;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errData = await response.json();
      errorMessage = errData.error || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  // Handle empty or text responses safely
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

// Authentication API
export const authApi = {
  async register(username: string, password: string, roles: string[]): Promise<any> {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, roles }),
    });
  },

  async login(username: string, password: string): Promise<{ token: string; roles: string[] }> {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setAuthToken(data.token);
    setUserRoles(data.roles);
    if (data.roles.length > 0) {
      // Pick first role by default
      setActiveRole(data.roles[0]);
    }
    return data;
  },

  async getProfile(): Promise<UserProfile> {
    return apiFetch('/auth/profile');
  },
};

// Reviews API
export const reviewsApi = {
  async getReviews(): Promise<AppReview[]> {
    // Review endpoint is at /api/reviews
    const response = await fetch('http://localhost:8080/api/reviews');
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  async submitReview(reviewerName: string, rating: number, comment: string): Promise<any> {
    const response = await fetch('http://localhost:8080/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer_name: reviewerName, rating, comment }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit review');
    }
    return response.json();
  },
};

// Public Catalog API
export const catalogApi = {
  async getCatalog(): Promise<Product[]> {
    const response = await fetch('http://localhost:8080/api/catalog');
    if (!response.ok) throw new Error('Failed to fetch catalog');
    return response.json();
  },

  async getProductDetail(id: number): Promise<Product> {
    const response = await fetch(`http://localhost:8080/api/catalog/${id}`);
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  },
};

// Seller Store & Product API
export const sellerApi = {
  async getStore(): Promise<Store> {
    return apiFetch('/seller/store');
  },

  async createStore(name: string, description: string): Promise<Store> {
    return apiFetch('/seller/store', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  async getProducts(): Promise<Product[]> {
    return apiFetch('/seller/products');
  },

  async createProduct(name: string, description: string, price: number, stock: number): Promise<Product> {
    return apiFetch('/seller/products', {
      method: 'POST',
      body: JSON.stringify({ name, description, price, stock }),
    });
  },

  async updateProduct(id: number, name: string, description: string, price: number, stock: number): Promise<Product> {
    return apiFetch(`/seller/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description, price, stock }),
    });
  },

  async deleteProduct(id: number): Promise<any> {
    return apiFetch(`/seller/products/${id}`, {
      method: 'DELETE',
    });
  },
};
