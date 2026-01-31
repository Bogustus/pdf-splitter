import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className={`upload-zone ${isDragActive ? 'active' : ''}`}
        >
            <input {...getInputProps()} />
            <div className="icon-wrapper">
                <UploadCloud size={64} />
            </div>
            <div className="text-content">
                <h3>{isDragActive ? "Drop the PDF here" : "Drag & drop your PDF here"}</h3>
                <p>or click to browse files</p>
            </div>
            <style>{`
        .upload-zone {
            border: 2px dashed var(--border-color);
            border-radius: var(--radius-xl);
            padding: 4rem 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: var(--surface-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            min-height: 400px;
        }
        .upload-zone:hover, .upload-zone.active {
            border-color: var(--primary-color);
            background: rgba(79, 70, 229, 0.03);
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }
        .icon-wrapper {
            color: var(--primary-color);
            background: var(--bg-color);
            padding: 1.5rem;
            border-radius: 50%;
            display: inline-flex;
            box-shadow: var(--shadow-sm);
        }
        .text-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-main);
        }
        .text-content p {
            color: var(--text-muted);
        }
      `}</style>
        </div>
    );
};
