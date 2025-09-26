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
      try {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        return { error: errorText || `HTTP error! status: ${response.status}` };
      } catch (e) {
        return { error: `HTTP error! status: ${response.status}` };
      }
    }

    try {
      const data = await response.json();
      return { data };
    } catch (error) {
      // If response is successful but no JSON content (like 204 No Content)
      return { data: {} as T };
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
      console.log('Getting crops with headers:', this.getAuthHeaders());
      const response = await fetch(`${API_BASE_URL}/crops`, {
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Network error in getCrops:', error);
      return { error: 'Network error occurred' };
    }
  }

  async createCrop(cropData: any): Promise<ApiResponse<any>> {
    try {
      // Ensure all required fields are present and properly formatted
      const formattedCropData = {
        name: cropData.name || '',
        cropType: cropData.cropType || cropData.crop_type || '',
        harvestDate: cropData.harvestDate || cropData.harvest_date || '',
        expiryDate: cropData.expiryDate || cropData.expiry_date || '',
        soilType: cropData.soilType || cropData.soil_type || '',
        pesticidesUsed: cropData.pesticidesUsed || cropData.pesticides_used || '',
        imageUrl: cropData.imageUrl || cropData.image_url || ''
      };

      console.log('Creating crop with formatted data:', formattedCropData);
      console.log('Using headers:', this.getAuthHeaders());
      
      const response = await fetch(`${API_BASE_URL}/crops`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(formattedCropData)
      });

      console.log('Create crop response status:', response.status);
      const responseText = await response.text();
      console.log('Create crop response:', responseText);
      
      if (!response.ok) {
        return { error: responseText || `HTTP error! status: ${response.status}` };
      }
      
      try {
        const data = JSON.parse(responseText);
        return { data };
      } catch (e) {
        return { data: responseText };
      }
    } catch (error) {
      console.error('Network error in createCrop:', error);
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