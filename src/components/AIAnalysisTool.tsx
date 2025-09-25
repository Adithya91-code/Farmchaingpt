import React, { useState } from 'react';
import { X, Upload, Brain, Camera, AlertCircle, CheckCircle, Clock, Leaf } from 'lucide-react';

interface AIAnalysisToolProps {
  onClose: () => void;
}

const AIAnalysisTool: React.FC<AIAnalysisToolProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [cropType, setCropType] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState('');

  const cropTypes = [
    'Apple', 'Banana', 'Orange', 'Tomato', 'Potato', 'Carrot', 'Lettuce', 'Broccoli',
    'Strawberry', 'Grapes', 'Cucumber', 'Bell Pepper', 'Onion', 'Spinach', 'Cabbage'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
      setAnalysisResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage || !cropType) {
      setError('Please select both an image and crop type');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      // Simulate AI analysis with realistic results based on crop type
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate realistic results based on crop type
      const isFruit = ['Apple', 'Banana', 'Orange', 'Strawberry', 'Grapes'].includes(cropType);
      
      // Generate more realistic conditions - bias towards good/fair
      const randomValue = Math.random();
      const baseCondition = randomValue > 0.3 ? (randomValue > 0.7 ? 0.9 : 0.6) : 0.3;
      
      const mockResults = {
        condition: baseCondition > 0.8 ? 'Excellent' : baseCondition > 0.6 ? 'Good' : baseCondition > 0.4 ? 'Fair' : 'Poor',
        freshness: Math.floor(baseCondition * 30) + 70, // 70-100% based on condition
        ripeness: isFruit ? 
          Math.floor(baseCondition * 40) + 60 : 
          Math.floor(baseCondition * 20) + 80,
        shelfLife: isFruit ? 
          Math.floor(baseCondition * 7) + 3 : 
          Math.floor(baseCondition * 12) + 5,
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        defects: baseCondition < 0.4 ? 
          ['Minor bruising', 'Surface blemishes', 'Some soft spots'] : 
          baseCondition < 0.6 ? 
            ['Slight discoloration', 'Minor surface marks'] : 
            baseCondition < 0.8 ? 
              ['Very minor blemishes'] : 
              [],
        recommendations: []
      };

      // Add specific recommendations based on condition
      if (mockResults.condition === 'Excellent') {
        mockResults.recommendations = [
          'Premium quality - perfect for high-end markets',
          'Store in optimal conditions to maintain quality',
          `Expected shelf life: ${mockResults.shelfLife} days`,
          isFruit ? 'Perfect for fresh consumption and export' : 'Ideal for premium cooking and processing',
          'Consider premium pricing strategy'
        ];
      } else if (mockResults.condition === 'Good') {
        mockResults.recommendations = [
          'Very good quality - suitable for premium pricing',
          'Store in cool, dry place',
          `Expected shelf life: ${mockResults.shelfLife} days`,
          isFruit ? 'Great for fresh consumption' : 'Excellent for cooking and processing'
        ];
      } else if (mockResults.condition === 'Fair') {
        mockResults.recommendations = [
          'Good for immediate sale or processing',
          'Monitor closely for deterioration',
          'Consider 10-15% price reduction',
          isFruit ? 'Best used within 2-3 days' : 'Suitable for cooking applications'
        ];
      } else {
        mockResults.recommendations = [
          'Not recommended for direct sale',
          'Consider processing or composting',
          'Inspect nearby produce for quality issues',
          'Implement better storage conditions'
        ];
      }

      setAnalysisResult(mockResults);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'text-emerald-600 bg-emerald-100';
      case 'Good': return 'text-green-600 bg-green-100';
      case 'Fair': return 'text-yellow-600 bg-yellow-100';
      case 'Poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'Excellent': return <CheckCircle className="h-5 w-5" />;
      case 'Good': return <CheckCircle className="h-5 w-5" />;
      case 'Fair': return <Clock className="h-5 w-5" />;
      case 'Poor': return <AlertCircle className="h-5 w-5" />;
      default: return <Leaf className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>AI Crop Condition Analysis</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="inline h-4 w-4 mr-1" />
                  Upload Crop Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview}
                        alt="Crop preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <button
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Click to upload
                        </button>
                        <p className="text-gray-500 text-sm">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Leaf className="inline h-4 w-4 mr-1" />
                  Crop Type
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={analyzeImage}
                disabled={!selectedImage || !cropType || analyzing}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    <span>Analyze Condition</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {analysisResult ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Results</h3>
                  
                  <div className="space-y-4">
                    {/* Overall Condition */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getConditionIcon(analysisResult.condition)}
                        <span className="font-medium">Overall Condition</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(analysisResult.condition)}`}>
                        {analysisResult.condition}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Freshness</div>
                        <div className="text-lg font-semibold text-green-600">{analysisResult.freshness}%</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Ripeness</div>
                        <div className="text-lg font-semibold text-blue-600">{analysisResult.ripeness}%</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Shelf Life</div>
                        <div className="text-lg font-semibold text-orange-600">{analysisResult.shelfLife} days</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Confidence</div>
                        <div className="text-lg font-semibold text-purple-600">{analysisResult.confidence}%</div>
                      </div>
                    </div>

                    {/* Defects */}
                    {analysisResult.defects.length > 0 && (
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">Detected Issues</div>
                        <ul className="text-sm text-red-600 space-y-1">
                          {analysisResult.defects.map((defect: string, index: number) => (
                            <li key={index}>• {defect}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">Recommendations</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Ready for Analysis</h3>
                  <p className="text-gray-500">Upload an image and select crop type to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisTool;