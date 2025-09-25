import React, { useState } from 'react';
import { X, User, Wheat, Calendar, ShoppingCart, Truck } from 'lucide-react';
import { Crop } from '../types';
import { UserRole } from '../types';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../lib/storage';

interface FarmerCropSelectorProps {
  userRole: UserRole;
  onClose: () => void;
  onSave: () => void;
}

const FarmerCropSelector: React.FC<FarmerCropSelectorProps> = ({ userRole, onClose, onSave }) => {
  const [supplierId, setSupplierId] = useState('');
  const [supplierCrops, setSupplierCrops] = useState<Crop[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supplierInfo, setSupplierInfo] = useState<any>(null);

  const { user } = useAuth();

  const isDistributor = userRole === 'distributor';
  const supplierType = isDistributor ? 'farmer' : 'distributor';
  const supplierLabel = isDistributor ? 'Farmer' : 'Distributor';

  const handleSupplierIdSearch = () => {
    if (!supplierId || supplierId.length !== 3) {
      setError(`Please enter a valid 3-digit ${supplierType} ID`);
      return;
    }

    let supplier;
    let crops;

    if (isDistributor) {
      supplier = storage.getFarmerByFarmerId(supplierId);
      crops = supplier ? storage.getCropsByFarmerId(supplierId) : [];
    } else {
      supplier = storage.getDistributorByDistributorId(supplierId);
      crops = supplier ? storage.getCropsByDistributorId(supplierId) : [];
    }

    if (!supplier) {
      setError(`${supplierLabel} not found with this ID`);
      setSupplierCrops([]);
      setSupplierInfo(null);
      return;
    }

    setSupplierCrops(crops);
    setSupplierInfo(supplier);
    setError('');
    setSelectedCrops([]);
  };

  const handleCropSelection = (cropId: string) => {
    setSelectedCrops(prev => 
      prev.includes(cropId) 
        ? prev.filter(id => id !== cropId)
        : [...prev, cropId]
    );
  };

  const handleAddSelectedCrops = async () => {
    if (selectedCrops.length === 0) {
      setError('Please select at least one crop');
      return;
    }

    setLoading(true);
    setError('');

    try {
      selectedCrops.forEach(cropId => {
        const originalCrop = supplierCrops.find(c => c.id === cropId);
        if (originalCrop && user) {
          // Create a new crop entry for the current user
          const newCrop: Crop = {
            ...originalCrop,
            id: Math.random().toString(36).substr(2, 9), // New ID for the copy
            user_id: user.id, // Assign to current user
            created_at: new Date().toISOString()
          };

          if (isDistributor) {
            // Distributor receiving from farmer
            newCrop.farmer_info = {
              farmer_id: supplierInfo.farmer_id,
              name: supplierInfo.name || supplierInfo.email,
              location: supplierInfo.location || 'Location not specified'
            };
            newCrop.distributor_info = {
              distributor_id: user.distributor_id!,
              name: user.name || user.email,
              location: user.location || 'Location not specified',
              received_date: new Date().toISOString().split('T')[0],
              sent_to_retailer: '',
              retailer_location: ''
            };
          } else {
            // Retailer receiving from distributor
            newCrop.retailer_info = {
              name: user.name || user.email,
              location: user.location || 'Location not specified',
              received_date: new Date().toISOString().split('T')[0],
              received_from_distributor: supplierInfo.name || supplierInfo.email,
              distributor_location: supplierInfo.location || 'Location not specified'
            };
          }

          storage.addCrop(newCrop);

          // Add supply chain entry
          storage.addSupplyChainEntry({
            id: Math.random().toString(36).substr(2, 9),
            crop_id: newCrop.id,
            user_id: user.id,
            user_role: user.role,
            entry_date: new Date().toISOString(),
            details: {
              supplier_id: supplierId,
              supplier_type: supplierType,
              action: `received_from_${supplierType}`
            }
          });
        }
      });

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            {isDistributor ? (
              <>
                <ShoppingCart className="h-6 w-6 text-purple-600" />
                <span>Add Crops from Farmer</span>
              </>
            ) : (
              <>
                <Truck className="h-6 w-6 text-indigo-600" />
                <span>Add Crops from Distributor</span>
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Supplier ID Search */}
          <div className={`p-4 rounded-lg ${isDistributor ? 'bg-orange-50' : 'bg-indigo-50'}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Enter {supplierLabel} ID (3-digit)
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${
                  isDistributor ? 'focus:ring-purple-500' : 'focus:ring-indigo-500'
                }`}
                placeholder={`Enter 3-digit ${supplierType} ID`}
                maxLength={3}
                pattern="[0-9]{3}"
              />
              <button
                onClick={handleSupplierIdSearch}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  isDistributor 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Search
              </button>
            </div>
          </div>

          {/* Supplier Info */}
          {supplierInfo && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">{supplierLabel} Information</h3>
              <p><strong>Name:</strong> {supplierInfo.name || supplierInfo.email}</p>
              <p><strong>Location:</strong> {supplierInfo.location || 'Not specified'}</p>
              <p><strong>{supplierLabel} ID:</strong> {isDistributor ? supplierInfo.farmer_id : supplierInfo.distributor_id}</p>
            </div>
          )}

          {/* Available Crops */}
          {supplierCrops.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Crops ({supplierCrops.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supplierCrops.map((crop) => (
                  <div
                    key={crop.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedCrops.includes(crop.id)
                        ? `${isDistributor ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500' : 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'} ring-opacity-20`
                        : `border-gray-300 ${isDistributor ? 'hover:border-purple-300' : 'hover:border-indigo-300'}`
                    }`}
                    onClick={() => handleCropSelection(crop.id)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedCrops.includes(crop.id)}
                        onChange={() => handleCropSelection(crop.id)}
                        className={isDistributor ? 'text-purple-600 focus:ring-purple-500' : 'text-indigo-600 focus:ring-indigo-500'}
                      />
                      <Wheat className="h-4 w-4 text-orange-600" />
                      <h4 className="font-semibold text-gray-800">{crop.name}</h4>
                    </div>
                    
                    {crop.image_url && (
                      <img
                        src={crop.image_url}
                        alt={crop.name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    )}
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Type:</strong> {crop.crop_type}</p>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Harvest: {new Date(crop.harvest_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Expires: {new Date(crop.expiry_date).toLocaleDateString()}</span>
                      </div>
                      <p><strong>Soil:</strong> {crop.soil_type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {supplierCrops.length === 0 && supplierId && !error && (
            <div className="text-center py-8">
              <Wheat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No crops found for this {supplierType}</p>
            </div>
          )}

          {/* Action Buttons */}
          {selectedCrops.length > 0 && (
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {selectedCrops.length} crop{selectedCrops.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSelectedCrops}
                  disabled={loading}
                  className={`px-6 py-2 text-white rounded-lg transition-colors ${
                    isDistributor 
                      ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400'
                      : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400'
                  }`}
                >
                  {loading ? 'Adding...' : `Add Selected Crops (${selectedCrops.length})`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerCropSelector;