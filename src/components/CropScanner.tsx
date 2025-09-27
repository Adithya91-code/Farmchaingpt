import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Wheat, Calendar, User, Truck, Store, MapPin, ArrowLeft, AlertCircle } from 'lucide-react';
import { apiService } from '../lib/api';
import { Crop } from '../types';

const CropScanner: React.FC = () => {
  const { cropId } = useParams<{ cropId: string }>();
  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCrop = async () => {
      if (cropId) {
        try {
          const result = await apiService.getCropForScanning(cropId);
          if (result.error) {
            setError('Crop not found. This QR code may be invalid or from a different system.');
          } else if (result.data) {
            // Convert backend format to frontend format
            const backendCrop = result.data;
            const convertedCrop: Crop = {
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
            setCrop(convertedCrop);
          } else {
            setError('Crop not found. This QR code may be invalid or from a different system.');
          }
        } catch (error) {
          console.error('Network error loading crop:', error);
          setError('Network error occurred while loading crop information.');
        }
      }
      setLoading(false);
    };

    loadCrop();
  }, [cropId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crop information...</p>
        </div>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Crop Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to FarmChainX</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wheat className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">FarmChainX</h1>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 text-orange-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to App</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Crop Information Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {crop.image_url && (
            <img
              src={crop.image_url}
              alt={crop.name}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Wheat className="h-8 w-8 text-orange-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{crop.name}</h2>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                  {crop.crop_type}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    <strong>Harvest Date:</strong> {new Date(crop.harvest_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    <strong>Expiry Date:</strong> {new Date(crop.expiry_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <strong className="text-gray-700">Soil Type:</strong> {crop.soil_type}
                </div>
                <div>
                  <strong className="text-gray-700">Pesticides:</strong> {crop.pesticides_used || 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supply Chain Journey */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Supply Chain Journey</h3>
          
          <div className="space-y-6">
            {/* Farmer Info */}
            {crop.farmer_info && (
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-green-800">Farmer</h4>
                  <p className="text-green-700"><strong>Name:</strong> {crop.farmer_info.name}</p>
                  <p className="text-green-700"><strong>ID:</strong> {crop.farmer_info.farmer_id}</p>
                  <div className="flex items-center space-x-1 text-green-600">
                    <MapPin className="h-4 w-4" />
                    <span>{crop.farmer_info.location}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Distributor Info */}
            {crop.distributor_info && (
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-blue-800">Distributor</h4>
                  <p className="text-blue-700"><strong>Name:</strong> {crop.distributor_info.name}</p>
                  <p className="text-blue-700"><strong>Received:</strong> {new Date(crop.distributor_info.received_date).toLocaleDateString()}</p>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <MapPin className="h-4 w-4" />
                    <span>{crop.distributor_info.location}</span>
                  </div>
                  {crop.distributor_info.sent_to_retailer && (
                    <p className="text-blue-700"><strong>Sent to:</strong> {crop.distributor_info.sent_to_retailer}</p>
                  )}
                </div>
              </div>
            )}

            {/* Retailer Info */}
            {crop.retailer_info && (
              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Store className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-purple-800">Retailer</h4>
                  <p className="text-purple-700"><strong>Name:</strong> {crop.retailer_info.name}</p>
                  <p className="text-purple-700"><strong>Received:</strong> {new Date(crop.retailer_info.received_date).toLocaleDateString()}</p>
                  <div className="flex items-center space-x-1 text-purple-600">
                    <MapPin className="h-4 w-4" />
                    <span>{crop.retailer_info.location}</span>
                  </div>
                  {crop.retailer_info.received_from_distributor && (
                    <p className="text-purple-700"><strong>From:</strong> {crop.retailer_info.received_from_distributor}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Trust Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
              <Wheat className="h-5 w-5" />
              <span className="font-semibold">Verified by FarmChainX</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              This information is tracked and verified through our blockchain-based supply chain system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropScanner;