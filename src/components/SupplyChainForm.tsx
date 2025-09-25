import React, { useState } from 'react';
import { X, Truck, Store, User, MapPin, Calendar } from 'lucide-react';
import { Crop } from '../types';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../lib/storage';

interface SupplyChainFormProps {
  crop: Crop;
  onClose: () => void;
  onSave: () => void;
}

const SupplyChainForm: React.FC<SupplyChainFormProps> = ({ crop, onClose, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Distributor form state
  const [farmerIdInput, setFarmerIdInput] = useState('');
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sentToRetailer, setSentToRetailer] = useState('');
  const [retailerLocation, setRetailerLocation] = useState('');

  // Retailer form state
  const [receivedFromDistributor, setReceivedFromDistributor] = useState('');
  const [distributorIdInput, setDistributorIdInput] = useState('');
  const [distributorLocation, setDistributorLocation] = useState('');
  const [retailerReceivedDate, setRetailerReceivedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (user?.role === 'distributor') {
        // Validate farmer ID
        const farmer = storage.getFarmerByFarmerId(farmerIdInput);
        if (!farmer) {
          setError('Invalid Farmer ID. Please check and try again.');
          setLoading(false);
          return;
        }

        // Update crop with distributor and farmer info
        const updatedCrop = {
          ...crop,
          farmer_info: {
            farmer_id: farmer.farmer_id!,
            name: farmer.name || farmer.email,
            location: farmer.location || 'Location not specified'
          },
          distributor_info: {
            name: user.name || user.email,
            location: user.location || 'Location not specified',
            received_date: receivedDate,
            sent_to_retailer: sentToRetailer,
            retailer_location: retailerLocation
          }
        };

        storage.updateCrop(crop.id, updatedCrop);

        // Add supply chain entry
        storage.addSupplyChainEntry({
          id: Math.random().toString(36).substr(2, 9),
          crop_id: crop.id,
          user_id: user.id,
          user_role: user.role,
          entry_date: new Date().toISOString(),
          details: {
            farmer_id: farmerIdInput,
            received_date: receivedDate,
            sent_to_retailer: sentToRetailer,
            retailer_location: retailerLocation
          }
        });

      } else if (user?.role === 'retailer') {
        // Validate distributor ID
        const distributor = storage.getDistributorByDistributorId(distributorIdInput);
        if (!distributor) {
          setError('Invalid Distributor ID. Please check and try again.');
          setLoading(false);
          return;
        }

        // Update crop with retailer info
        const updatedCrop = {
          ...crop,
          retailer_info: {
            name: user.name || user.email,
            location: user.location || 'Location not specified',
            received_date: retailerReceivedDate,
            received_from_distributor: distributor.name || distributor.email,
            distributor_location: distributor.location || 'Location not specified',
            distributor_id: distributorIdInput
          }
        };

        storage.updateCrop(crop.id, updatedCrop);

        // Add supply chain entry
        storage.addSupplyChainEntry({
          id: Math.random().toString(36).substr(2, 9),
          crop_id: crop.id,
          user_id: user.id,
          user_role: user.role,
          entry_date: new Date().toISOString(),
          details: {
            received_date: retailerReceivedDate,
            distributor_id: distributorIdInput,
            action: 'received_from_distributor'
          }
        });
      }

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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            {user?.role === 'distributor' ? (
              <>
                <Truck className="h-6 w-6 text-blue-600" />
                <span>Distributor Information</span>
              </>
            ) : (
              <>
                <Store className="h-6 w-6 text-purple-600" />
                <span>Retailer Information</span>
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

        <div className="p-6">
          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Crop Information</h3>
            <p><strong>Name:</strong> {crop.name}</p>
            <p><strong>Type:</strong> {crop.crop_type}</p>
            <p><strong>Harvest Date:</strong> {new Date(crop.harvest_date).toLocaleDateString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {user?.role === 'distributor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Farmer ID (3-digit)
                  </label>
                  <input
                    type="text"
                    value={farmerIdInput}
                    onChange={(e) => setFarmerIdInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 3-digit farmer ID"
                    maxLength={3}
                    pattern="[0-9]{3}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date Received from Farmer
                  </label>
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Store className="inline h-4 w-4 mr-1" />
                    Retailer Name
                  </label>
                  <input
                    type="text"
                    value={sentToRetailer}
                    onChange={(e) => setSentToRetailer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Name of retailer you sent crops to"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Retailer Location
                  </label>
                  <input
                    type="text"
                    value={retailerLocation}
                    onChange={(e) => setRetailerLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Retailer's location (city, state)"
                    required
                  />
                </div>
              </>
            )}

            {user?.role === 'retailer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Truck className="inline h-4 w-4 mr-1" />
                    Distributor ID (3-digit)
                  </label>
                  <input
                    type="text"
                    value={distributorIdInput}
                    onChange={(e) => setDistributorIdInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter 3-digit distributor ID"
                    maxLength={3}
                    pattern="[0-9]{3}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date Received from Distributor
                  </label>
                  <input
                    type="date"
                    value={retailerReceivedDate}
                    onChange={(e) => setRetailerReceivedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-white rounded-lg transition-colors ${
                  user?.role === 'distributor'
                    ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
                    : 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400'
                }`}
              >
                {loading ? 'Saving...' : 'Save Information'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainForm;