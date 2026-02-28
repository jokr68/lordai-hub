'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  maxImages?: number;
}

export default function ImageUpload({ onImageUpload, maxImages = 5 }: ImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedImages.length + files.length > maxImages) {
      alert(`يمكنك رفع ${maxImages} صور كحد أقصى`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`الملف ${file.name} ليس صورة`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`الصورة ${file.name} كبيرة جداً (الحد الأقصى 5MB)`);
        return false;
      }
      return true;
    });

    setSelectedImages([...selectedImages, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) return;

    setUploading(true);

    try {
      // In a real application, you would upload to a server or cloud storage
      // For now, we'll use the data URLs directly
      previews.forEach(preview => {
        onImageUpload(preview);
      });

      // Clear selections
      setSelectedImages([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('فشل في رفع الصور');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">📷 إرسال صور</h3>
        <span className="text-gray-300 text-sm">
          {selectedImages.length}/{maxImages}
        </span>
      </div>

      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-purple-500 transition"
        >
          <div className="text-3xl">📁</div>
          <div className="text-white">
            <p className="font-medium">اختر صوراً</p>
            <p className="text-sm text-gray-400">أو اسحبها هنا</p>
          </div>
        </label>
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {previews.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {uploading ? 'جاري الرفع...' : 'إرسال الصور'}
        </button>
      )}

      {/* Instructions */}
      <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">💡 معلومات:</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• الصيغ المدعومة: JPG, PNG, GIF, WEBP</li>
          <li>• الحد الأقصى: 5 صور في المرة الواحدة</li>
          <li>• حجم الصورة: 5MB كحد أقصى</li>
          <li>• سيتم تحجيم الصور تلقائياً</li>
        </ul>
      </div>
    </div>
  );
}