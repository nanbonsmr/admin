import React, { useState, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Upload, File, Video, Image, X, Check } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (fileData: {
    storageId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    type: 'image' | 'video' | 'file';
  }) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  className?: string;
}

export default function FileUpload({ 
  onFileUploaded, 
  acceptedTypes = "image/*,video/*,.pdf,.doc,.docx,.txt", 
  maxSize = 100,
  className = ""
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const storeFileMetadata = useMutation(api.fileStorage.storeFileMetadata);
  const adminUser = useQuery(api.users.getAdminUser);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.onload = async () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            const storageId = response.storageId;

            // Store file metadata
            await storeFileMetadata({
              storageId,
              originalName: file.name,
              mimeType: file.type,
              size: file.size,
              uploadedBy: adminUser?._id || 'n570p0jwdcmrhvmynm12sgdbph84q7q9' as any, // Use actual admin ID or fallback
              isPublic: true,
            });

            // Determine file type
            let fileType: 'image' | 'video' | 'file' = 'file';
            if (file.type.startsWith('image/')) {
              fileType = 'image';
            } else if (file.type.startsWith('video/')) {
              fileType = 'video';
            }

            // Notify parent component
            onFileUploaded({
              storageId,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type,
              type: fileType,
            });

            setUploadProgress(100);
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
            }, 1000);

          } catch (error) {
            console.error('Error storing file metadata:', error);
            setError('Failed to store file information');
            setIsUploading(false);
          }
        } else {
          setError('Upload failed');
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        setError('Upload failed');
        setIsUploading(false);
      };

      // Create form data and upload
      const formData = new FormData();
      formData.append('file', file);

      xhr.open('POST', uploadUrl);
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to start upload');
      setIsUploading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image size={20} />;
    if (mimeType.startsWith('video/')) return <Video size={20} />;
    return <File size={20} />;
  };

  return (
    <div className={`file-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!isUploading ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload size={16} />
          Upload File
        </button>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
          {uploadProgress === 100 && (
            <Check size={20} className="text-green-600" />
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}