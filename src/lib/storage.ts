interface StorageData {
  users: Array<{
    id: string;
    email: string;
    password: string;
    role: string;
    created_at: string;
    farmer_id?: string;
    name?: string;
    location?: string;
  }>;
  crops: Array<{
    id: string;
    name: string;
    crop_type: string;
    harvest_date: string;
    expiry_date: string;
    soil_type: string;
    pesticides_used: string;
    image_url?: string;
    user_id: string;
    created_at: string;
    farmer_info?: any;
    distributor_info?: any;
    retailer_info?: any;
  }>;
  supply_chain: Array<{
    id: string;
    crop_id: string;
    user_id: string;
    user_role: string;
    entry_date: string;
    details: any;
  }>;
  currentUser: {
    id: string;
    email: string;
    role: string;
    created_at: string;
    farmer_id?: string;
    name?: string;
    location?: string;
  } | null;
}

class JSONStorage {
  private data: StorageData;
  private readonly STORAGE_KEY = 'farmchainx_data';

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      } else {
        this.data = {
          users: [],
          crops: [],
          supply_chain: [],
          currentUser: null
        };
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = {
        users: [],
        crops: [],
        supply_chain: [],
        currentUser: null
      };
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // User methods
  getUsers() {
    return this.data.users;
  }

  addUser(user: any) {
    this.data.users.push(user);
    this.saveData();
  }

  findUser(email: string, password: string) {
    return this.data.users.find(u => u.email === email && u.password === password);
  }

  userExists(email: string) {
    return this.data.users.some(u => u.email === email);
  }

  // Current user methods
  getCurrentUser() {
    return this.data.currentUser;
  }

  setCurrentUser(user: any) {
    this.data.currentUser = user;
    this.saveData();
  }

  clearCurrentUser() {
    this.data.currentUser = null;
    this.saveData();
  }

  // Crop methods
  getCrops(userId: string) {
    const userCrops = this.data.crops.filter(crop => crop.user_id === userId);
    console.log('Getting crops for user:', userId, 'Found:', userCrops.length);
    return userCrops;
  }

  addCrop(crop: any) {
    this.data.crops.push(crop);
    console.log('Crop added to storage:', crop);
    console.log('Total crops in storage:', this.data.crops.length);
    this.saveData();
  }

  updateCrop(cropId: string, updatedCrop: any) {
    const index = this.data.crops.findIndex(crop => crop.id === cropId);
    if (index !== -1) {
      this.data.crops[index] = { ...this.data.crops[index], ...updatedCrop };
      console.log('Crop updated in storage:', this.data.crops[index]);
      this.saveData();
    } else {
      console.error('Crop not found for update:', cropId);
    }
  }

  deleteCrop(cropId: string) {
    this.data.crops = this.data.crops.filter(crop => crop.id !== cropId);
    this.saveData();
  }

  findCrop(cropId: string) {
    return this.data.crops.find(crop => crop.id === cropId);
  }

  // Supply chain methods
  addSupplyChainEntry(entry: any) {
    this.data.supply_chain.push(entry);
    this.saveData();
  }

  getSupplyChainByCrop(cropId: string) {
    return this.data.supply_chain.filter(entry => entry.crop_id === cropId);
  }

  // Farmer methods
  generateFarmerId(): string {
    let farmerId;
    do {
      farmerId = Math.floor(100 + Math.random() * 900).toString(); // 3-digit number
    } while (this.data.users.some(u => u.farmer_id === farmerId));
    return farmerId;
  }

  generateDistributorId(): string {
    let distributorId;
    do {
      distributorId = Math.floor(100 + Math.random() * 900).toString(); // 3-digit number
    } while (this.data.users.some(u => u.distributor_id === distributorId));
    return distributorId;
  }

  getFarmerByFarmerId(farmerId: string) {
    return this.data.users.find(u => u.farmer_id === farmerId && u.role === 'farmer');
  }

  getDistributorByDistributorId(distributorId: string) {
    return this.data.users.find(u => u.distributor_id === distributorId && u.role === 'distributor');
  }

  getCropsByFarmerId(farmerId: string) {
    const farmer = this.getFarmerByFarmerId(farmerId);
    if (!farmer) return [];
    return this.data.crops.filter(crop => crop.user_id === farmer.id);
  }

  getCropsByDistributorId(distributorId: string) {
    const distributor = this.getDistributorByDistributorId(distributorId);
    if (!distributor) return [];
    return this.data.crops.filter(crop => crop.user_id === distributor.id);
  }

  updateUser(userId: string, updates: any) {
    const userIndex = this.data.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.data.users[userIndex] = { ...this.data.users[userIndex], ...updates };
      this.saveData();
    }
  }

  // Export data as JSON
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  // Import data from JSON
  importData(jsonData: string) {
    try {
      const imported = JSON.parse(jsonData);
      this.data = imported;
      this.saveData();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const storage = new JSONStorage();