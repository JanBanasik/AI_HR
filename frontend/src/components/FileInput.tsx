import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type FileInputProps = {
  id: string;
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
};

const FileInput: React.FC<FileInputProps> = ({ id, label, accept, onChange }) => {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileName(file ? file.name : '');
    onChange(file); // Pass the selected file back to parent component
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-4">
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          className="text-xs px-2 py-1"
          onClick={() => document.getElementById(id)?.click()}
        >
          Choose File
        </Button>
        {fileName && (
          <span className="text-sm text-muted-foreground">{fileName}</span>
        )}
      </div>
    </div>
  );
};

export default FileInput;
