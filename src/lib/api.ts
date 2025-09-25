const API_BASE_URL = 'http://localhost:8080/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('current_user_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      'Accept': 'application/json'
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorText = await response.text();
      return { error: errorText || `HTTP error! status: ${response.status}` };
    }

    try {
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: null as T };
    }
  }

  // Authentication APIs
  async signIn(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await this.handleResponse(response);
      if (result.data?.token) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('current_user_token', result.data.token);
      }
      return result;
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async signUp(userData: {
    email: string;
    password: string;
    name: string;
    location: string;
    role: string;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          role: userData.role.toUpperCase()
        })
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  // Crop APIs
  async getCrops(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops`, {
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async createCrop(cropData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cropData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async updateCrop(cropId: string, cropData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cropData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async deleteCrop(cropId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async getCropsByFarmerId(farmerId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/farmer/${farmerId}`, {
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async getCropsByDistributorId(distributorId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/distributor/${distributorId}`, {
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async getCropForScanning(cropId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/scan/${cropId}`);
      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  signOut(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user_token');
  }
}

export const apiService = new ApiService();