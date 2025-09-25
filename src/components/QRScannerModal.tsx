import React, { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRScannerModalProps {
  onClose: () => void;
  onScanResult: (cropId: string) => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose, onScanResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [error, setError] = useState<string>('');
  const [hasCamera, setHasCamera] = useState<boolean>(true);

  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          try {
            // Handle both direct crop ID and full crop data
            let cropData;
            try {
              cropData = JSON.parse(result.data);
            } catch {
              // If parsing fails, treat as direct crop ID
              cropData = { id: result.data };
            }
            
            if (cropData.id) {
              onScanResult(cropData.id);
            } else {
              setError('Invalid QR code format - no crop ID found');
            }
          } catch (err) {
            setError('Could not process QR code data');
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScanner.start().catch((err) => {
        console.error('Failed to start camera:', err);
        setHasCamera(false);
        setError('Camera access denied or not available');
      });

      setScanner(qrScanner);

      return () => {
        qrScanner.stop();
        qrScanner.destroy();
      };
    }
  }, [onScanResult]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && scanner) {
      QrScanner.scanImage(file)
        .then((result) => {
          try {
            // Handle both direct crop ID and full crop data
            let cropData;
            try {
              cropData = JSON.parse(result);
            } catch {
              // If parsing fails, treat as direct crop ID
              cropData = { id: result };
            }
            
            if (cropData.id) {
              onScanResult(cropData.id);
            } else {
              setError('Invalid QR code format - no crop ID found');
            }
          } catch (err) {
            setError('Could not process QR code data');
          }
        })
        .catch(() => {
          setError('No QR code found in image');
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Scan QR Code</h2>
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

          {hasCamera ? (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-orange-500 rounded-lg"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Position the QR code within the frame to scan
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Camera className="h-16 w-16 text-gray-300 mx-auto" />
              <p className="text-gray-600">Camera not available</p>
              <p className="text-sm text-gray-500">Please use the file upload option below</p>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {hasCamera ? 'Or upload QR code image:' : 'Upload QR code image:'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;