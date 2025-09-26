import React, { useState } from 'react';
import { X, Upload, Calendar, Wheat, Beaker, Image as ImageIcon } from 'lucide-react';
import { Crop } from '../types';

interface CropFormProps {
  crop?: Crop | null;
  onClose: () => void;
  onSave: (cropId: string, cropData: Omit<Crop, 'id' | 'user_id' | 'created_at'>) => void;
}

const CropForm: React.FC<CropFormProps> = ({ crop, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: crop?.name || '',
    crop_type: crop?.crop_type || '',
    harvest_date: crop?.harvest_date || '',
    expiry_date: crop?.expiry_date || '',
    soil_type: crop?.soil_type || '',
    pesticides_used: crop?.pesticides_used || '',
    image_url: crop?.image_url || ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(crop?.image_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cropTypes = [
    'Fruits', 'Vegetables', 'Grains', 'Pulses', 'Spices', 'Herbs', 'Nuts', 'Flowers'
  ];

  const soilTypes = [
    'Clay', 'Sandy', 'Silty', 'Loamy', 'Chalky', 'Peaty', 'Saline'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Crop name is required');
      setLoading(false);
      return;
    }
    if (!formData.crop_type) {
      setError('Crop type is required');
      setLoading(false);
      return;
    }
    if (!formData.harvest_date) {
      setError('Harvest date is required');
      setLoading(false);
      return;
    }
    if (!formData.expiry_date) {
      setError('Expiry date is required');
      setLoading(false);
      return;
    }
    if (!formData.soil_type) {
      setError('Soil type is required');
      setLoading(false);
      return;
    }

    try {
      let finalImageUrl = formData.image_url;
      
      // If a file was selected, convert to base64 for local storage
      if (imageFile) {
        finalImageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (e) => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(imageFile);
        });
      }

      const cropDataToSave = { 
        ...formData, 
        image_url: finalImageUrl,
        pesticides_used: formData.pesticides_used || '' // Ensure it's never null
      };

      // Always pass crop ID (empty string for new crops)
      onSave(crop?.id || '', cropDataToSave);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the crop');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {crop ? 'Edit Crop' : 'Add New Crop'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Wheat className="inline h-4 w-4 mr-1" />
                Crop Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Organic Tomatoes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Type
              </label>
              <select
                name="crop_type"
                value={formData.crop_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select crop type</option>
                {cropTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Harvest Date
              </label>
              <input
                type="date"
                name="harvest_date"
                value={formData.harvest_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Expiry Date
              </label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil Type
              </label>
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select soil type</option>
                {soilTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Beaker className="inline h-4 w-4 mr-1" />
              Pesticides Used
            </label>
            <textarea
              name="pesticides_used"
              value={formData.pesticides_used}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="List any pesticides or chemicals used, or enter 'Organic' if none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="inline h-4 w-4 mr-1" />
              Crop Image
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              <div className="text-center text-gray-500 text-sm">or</div>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter image URL"
              />
            </div>
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Crop preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

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
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition-colors"
            >
              {loading ? (crop ? 'Updating...' : 'Adding...') : (crop ? 'Update Crop' : 'Add Crop')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CropForm;