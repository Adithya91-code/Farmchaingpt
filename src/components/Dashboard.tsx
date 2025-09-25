import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CreditCard as Edit, Trash2, Calendar, Wheat, Package, QrCode, ScanLine, Truck, Store, User, ShoppingCart, Brain } from 'lucide-react';
import { Crop } from '../types';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';
import CropForm from './CropForm';
import SupplyChainForm from './SupplyChainForm';
import FarmerCropSelector from './FarmerCropSelector';
import QRCodeModal from './QRCodeModal';
import QRScannerModal from './QRScannerModal';
import AIAnalysisTool from './AIAnalysisTool';

const Dashboard: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showQRCode, setShowQRCode] = useState<Crop | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showSupplyChainForm, setShowSupplyChainForm] = useState<Crop | null>(null);
  const [showFarmerCropSelector, setShowFarmerCropSelector] = useState(false);
  const [showAITool, setShowAITool] = useState(false);

  const { user } = useAuth();


  useEffect(() => {
    loadCrops();
  }, [user]);

  const loadCrops = async () => {
    if (!user) return;

    try {
      const result = await apiService.getCrops();
      if (result.error) {
        console.error('Error loading crops:', result.error);
        setCrops([]);
      } else {
        console.log('Loaded crops from backend:', result.data);
        setCrops(result.data || []);
      }
    } catch (error) {
      console.error('Network error loading crops:', error);
      setCrops([]);
    }
    setLoading(false);
  };


  const handleAddCrop = async (cropData: any) => {
    if (!user) return;

    try {
      const result = await apiService.createCrop({
        name: cropData.name,
        cropType: cropData.crop_type,
        harvestDate: cropData.harvest_date,
        expiryDate: cropData.expiry_date,
        soilType: cropData.soil_type,
        pesticidesUsed: cropData.pesticides_used,
        imageUrl: cropData.image_url
      });

      if (result.error) {
        console.error('Error creating crop:', result.error);
        alert('Error creating crop: ' + result.error);
      } else {
        console.log('Crop created successfully:', result.data);
        loadCrops(); // Reload crops from backend
      }
    } catch (error) {
      console.error('Network error creating crop:', error);
      alert('Network error creating crop. Please check your connection.');
    }
  };

  const handleUpdateCrop = async (cropId: string, cropData: any) => {
    try {
      const result = await apiService.updateCrop(cropId, {
        name: cropData.name,
        cropType: cropData.crop_type,
        harvestDate: cropData.harvest_date,
        expiryDate: cropData.expiry_date,
        soilType: cropData.soil_type,
        pesticidesUsed: cropData.pesticides_used,
        imageUrl: cropData.image_url
      });

      if (result.error) {
        console.error('Error updating crop:', result.error);
        alert('Error updating crop: ' + result.error);
      } else {
        console.log('Crop updated successfully:', result.data);
        loadCrops(); // Reload crops from backend
      }
    } catch (error) {
      console.error('Network error updating crop:', error);
      alert('Network error updating crop. Please check your connection.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crop?')) return;

    try {
      const result = await apiService.deleteCrop(id);
      
      if (result.error) {
        console.error('Error deleting crop:', result.error);
        alert('Error deleting crop: ' + result.error);
      } else {
        console.log('Crop deleted successfully');
        loadCrops(); // Reload crops from backend
      }
    } catch (error) {
      console.error('Network error deleting crop:', error);
      alert('Network error deleting crop. Please check your connection.');
    }
  };

  const handleScanResult = async (cropId: string) => {
    // Navigate to the scan page
    window.open(`/scan/${cropId}`, '_blank');
    
    try {
      const result = await apiService.getCropForScanning(cropId);
      
      if (result.error) {
        alert('Crop not found in the system records. This QR code may be from a different user or invalid.');
      } else if (result.data) {
        const crop = result.data;
        const cropInfo = `Crop Found!

Name: ${crop.name}
Type: ${crop.cropType}
Harvest Date: ${new Date(crop.harvestDate).toLocaleDateString()}
Expiry Date: ${new Date(crop.expiryDate).toLocaleDateString()}
Soil Type: ${crop.soilType}
Pesticides: ${crop.pesticidesUsed || 'None'}`;
        
        alert(cropInfo);
      }
    } catch (error) {
      console.error('Network error scanning crop:', error);
      alert('Network error occurred while scanning. Please check your connection.');
    }
  };

  // Convert backend crop format to frontend format
  const convertCropFormat = (backendCrop: any): Crop => {
    return {
      id: backendCrop.id?.toString() || '',
      name: backendCrop.name || '',
      crop_type: backendCrop.cropType || '',
      harvest_date: backendCrop.harvestDate || '',
      expiry_date: backendCrop.expiryDate || '',
      soil_type: backendCrop.soilType || '',
      pesticides_used: backendCrop.pesticidesUsed || '',
      image_url: backendCrop.imageUrl || '',
      user_id: backendCrop.user?.id?.toString() || '',
      created_at: backendCrop.createdAt || '',
      farmer_info: backendCrop.farmerId ? {
        farmer_id: backendCrop.farmerId,
        name: backendCrop.farmerName || 'Unknown',
        location: backendCrop.farmerLocation || 'Unknown'
      } : undefined,
      distributor_info: backendCrop.distributorId ? {
        name: backendCrop.distributorName || 'Unknown',
        location: backendCrop.distributorLocation || 'Unknown',
        received_date: backendCrop.distributorReceivedDate || '',
        sent_to_retailer: backendCrop.sentToRetailer || '',
        retailer_location: backendCrop.retailerLocation || ''
      } : undefined,
      retailer_info: backendCrop.retailerName ? {
        name: backendCrop.retailerName,
        location: backendCrop.retailerLocation || 'Unknown',
        received_date: backendCrop.retailerReceivedDate || '',
        received_from_distributor: backendCrop.receivedFromDistributor || '',
        distributor_location: backendCrop.distributorLocationRetailer || ''
      } : undefined
    };
  };

  // Update loadCrops to convert format
  const loadCropsConverted = async () => {
    if (!user) return;

    try {
      const result = await apiService.getCrops();
      if (result.error) {
        console.error('Error loading crops:', result.error);
        setCrops([]);
      } else {
        console.log('Loaded crops from backend:', result.data);
        const convertedCrops = (result.data || []).map(convertCropFormat);
        setCrops(convertedCrops);
      }
    } catch (error) {
      console.error('Network error loading crops:', error);
      setCrops([]);
    }
    setLoading(false);
  };

  // Use the converted version
  useEffect(() => {
    loadCropsConverted();
  }, [user]);

  const handleAddCropConverted = async (cropData: Omit<Crop, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    console.log('Adding crop with data:', cropData);

    try {
      const result = await apiService.createCrop({
        name: cropData.name,
        cropType: cropData.crop_type,
        harvestDate: cropData.harvest_date,
        expiryDate: cropData.expiry_date,
        soilType: cropData.soil_type,
        pesticidesUsed: cropData.pesticides_used,
        imageUrl: cropData.image_url
      });

      if (result.error) {
        console.error('Error creating crop:', result.error);
        // Show a more user-friendly error message
        setError('Failed to add crop. Please check your connection and try again.');
      } else {
        console.log('Crop created successfully:', result.data);
        // Reload crops to show the new one
        loadCropsConverted(); // Reload crops from backend
      }
    } catch (error) {
      console.error('Network error creating crop:', error);
      setError('Network error. Please check your connection and try again.');
    }
  };

  const handleUpdateCropConverted = async (cropId: string, cropData: Omit<Crop, 'id' | 'user_id' | 'created_at'>) => {
    console.log('Updating crop:', cropId, 'with data:', cropData);
    
    try {
      const result = await apiService.updateCrop(cropId, {
        name: cropData.name,
        cropType: cropData.crop_type,
        harvestDate: cropData.harvest_date,
        expiryDate: cropData.expiry_date,
        soilType: cropData.soil_type,
        pesticidesUsed: cropData.pesticides_used,
        imageUrl: cropData.image_url
      });

      if (result.error) {
        console.error('Error updating crop:', result.error);
        alert('Error updating crop: ' + result.error);
      } else {
        console.log('Crop updated successfully:', result.data);
        loadCropsConverted(); // Reload crops from backend
      }
    } catch (error) {
      console.error('Network error updating crop:', error);
      alert('Network error updating crop. Please check your connection.');
    }
  };

  const handleDeleteConverted = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crop?')) return;

    try {
      const result = await apiService.deleteCrop(id);
      if (result.error) {
        console.error('Error deleting crop:', result.error);
        alert('Error deleting crop: ' + result.error);
      } else {
        console.log('Crop deleted successfully');
        loadCropsConverted(); // Reload crops from backend
      }
    } catch (error) {
      console.error('Network error deleting crop:', error);
      alert('Network error deleting crop. Please check your connection.');
    }
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCrop(null);
  };

  const handleGenerateQR = (crop: Crop) => {
    setShowQRCode(crop);
  };

  const handleSupplyChainUpdate = (crop: Crop) => {
    setShowSupplyChainForm(crop);
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = (crop.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (crop.crop_type || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || (crop.crop_type || '').toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const cropTypes = ['all', ...Array.from(new Set(crops.map(crop => crop.crop_type)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Crop Management</h1>
            <p className="text-gray-600">Manage your crops and track your harvest</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAITool(true)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Brain className="h-4 w-4" />
              <span>AI Analysis</span>
            </button>
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ScanLine className="h-4 w-4" />
              <span>Scan QR</span>
            </button>
            {user?.role === 'distributor' && (
              <button
                onClick={() => setShowFarmerCropSelector(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add Crops from Farmer</span>
              </button>
            )}
            {user?.role === 'retailer' && (
              <button
                onClick={() => setShowFarmerCropSelector(true)}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add Crops from Distributor</span>
              </button>
            )}
            {user?.role === 'farmer' && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Crop</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Crops</p>
              <p className="text-2xl font-bold text-gray-800">{crops.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Wheat className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Crop Types</p>
              <p className="text-2xl font-bold text-gray-800">{new Set(crops.map(c => c.crop_type)).size}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Harvests</p>
              <p className="text-2xl font-bold text-gray-800">
                {crops.filter(c => new Date(c.harvest_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              {cropTypes.map(type => (
                <option key={type} value={type} className="capitalize">
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-12 text-center">
          <Wheat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No crops found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first crop'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Your First Crop
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
              {crop.image_url && (
                <img
                  src={crop.image_url}
                  alt={crop.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{crop.name}</h3>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      {crop.crop_type}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGenerateQR(crop)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Generate QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                    {(user?.role === 'distributor' || user?.role === 'retailer') && (
                      <button
                        onClick={() => handleSupplyChainUpdate(crop)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Update Supply Chain"
                      >
                        {user.role === 'distributor' ? <Truck className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                      </button>
                    )}
                    {user?.role === 'farmer' && crop.user_id === user.id && (
                      <>
                        <button
                          onClick={() => handleEdit(crop)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConverted(crop.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Harvest: {new Date(crop.harvest_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Expires: {new Date(crop.expiry_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <strong>Soil Type:</strong> {crop.soil_type}
                  </div>
                  <div>
                    <strong>Pesticides:</strong> {crop.pesticides_used || 'None'}
                  </div>
                  
                  {/* Supply Chain Information */}
                  {crop.farmer_info && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-1 text-green-600 font-semibold mb-1">
                        <User className="h-4 w-4" />
                        <span>Farmer: {crop.farmer_info.name} (ID: {crop.farmer_info.farmer_id})</span>
                      </div>
                      <div className="text-xs text-gray-500">📍 {crop.farmer_info.location}</div>
                    </div>
                  )}
                  
                  {crop.distributor_info && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-1 text-blue-600 font-semibold mb-1">
                        <Truck className="h-4 w-4" />
                        <span>Distributor: {crop.distributor_info.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">📍 {crop.distributor_info.location}</div>
                    </div>
                  )}
                  
                  {crop.retailer_info && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-1 text-purple-600 font-semibold mb-1">
                        <Store className="h-4 w-4" />
                        <span>Retailer: {crop.retailer_info.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">📍 {crop.retailer_info.location}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeModal
          crop={showQRCode}
          onClose={() => setShowQRCode(null)}
        />
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScannerModal
          onClose={() => setShowScanner(false)}
          onScanResult={handleScanResult}
        />
      )}

      {/* Crop Form Modal */}
      {showForm && (
        <CropForm
          crop={editingCrop}
          onClose={handleFormClose}
          onSave={editingCrop ? handleUpdateCropConverted : handleAddCropConverted}
        />
      )}

      {/* Supply Chain Form Modal */}
      {showSupplyChainForm && (
        <SupplyChainForm
          crop={showSupplyChainForm}
          onClose={() => setShowSupplyChainForm(null)}
          onSave={loadCropsConverted}
        />
      )}

      {/* Farmer Crop Selector Modal */}
      {showFarmerCropSelector && (
        <FarmerCropSelector
          userRole={user?.role || 'farmer'}
          onClose={() => setShowFarmerCropSelector(false)}
          onSave={loadCropsConverted}
        />
      )}

      {/* AI Analysis Tool Modal */}
      {showAITool && (
        <AIAnalysisTool
          onClose={() => setShowAITool(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;