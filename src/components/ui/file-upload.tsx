'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onChange: (files: File[]) => void;
}

export const FileUpload = ({ onChange }: FileUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  
  // Initialize useDropzone hook properly
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      const files = acceptedFiles.slice(0, 5);
      onChange(files);
      
      // Create preview URLs
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }, [onChange]),
    accept: {'image/*': ['.jpeg', '.jpg', '.png', '.gif']},
    multiple: true,
    maxFiles: 5
  });

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-white dark:bg-opacity-10 backdrop-blur-lg border-neutral-200 dark:border-neutral-800 rounded-lg">
      <div 
        {...getRootProps()}
        className="h-full p-8 flex flex-col items-center justify-center cursor-pointer"
      >
        <input {...getInputProps()} />
        
        {previews.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="w-32 h-32 relative">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {isDragActive ? (
              <p className="text-blue-500">Drop the files here...</p>
            ) : (
              <>
                <span className="text-4xl">📁</span>
                <p className="text-center text-neutral-500">
                  Drag & drop up to 5 images here, or click to select files
                </p>
                <em className="text-xs text-neutral-400">
                  (Only *.jpeg, *.jpg, *.png, *.gif images will be accepted)
                </em>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};