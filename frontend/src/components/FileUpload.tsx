import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  dragText?: string;
  buttonText?: string;
  maxSize?: number; // in bytes
  onError?: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '*',
  multiple = false,
  className = '',
  dragText = 'Drag and drop files here or click to select',
  buttonText = 'Select Files',
  maxSize = 10 * 1024 * 1024, // 10MB default
  onError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    setIsUploading(true);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        onError?.(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
    
    setIsUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
        isDragOver
          ? 'border-blue-400 bg-blue-500/10'
          : 'border-white/30 hover:border-white/50'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
          {isUploading ? (
            <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-white/80 text-lg font-medium">{dragText}</p>
          <p className="text-white/60 text-sm">Maximum file size: {maxSize / (1024 * 1024)}MB</p>
        </div>
        
        <button
          onClick={triggerFileInput}
          disabled={isUploading}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;