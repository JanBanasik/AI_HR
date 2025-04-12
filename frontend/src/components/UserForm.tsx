import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@shadcn/ui/input';
import { Label } from '@shadcn/ui/label';
import { Button } from '@shadcn/ui/button';
import { FileInput } from '@shadcn/ui/file-input';
import { toast } from 'react-hot-toast';

interface FormData {
  userXProfile: string;
  githubProfile: string;
  pdfFile: FileList | null;
}

const UserForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  const onSubmit = (data: FormData) => {
    // Handle form submission logic here
    toast.success('Form submitted successfully!');
    console.log(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type === 'application/pdf') {
      setPdfPreview(URL.createObjectURL(file));
    } else {
      setPdfPreview(null);
      toast.error('Please upload a valid PDF file.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {/* User X Profile Link */}
      <div className="space-y-2">
        <Label htmlFor="userXProfile">User X Profile Link</Label>
        <Input
          id="userXProfile"
          type="url"
          placeholder="Enter User X Profile URL"
          {...register('userXProfile', { required: false })}
          className="w-full"
        />
        {errors.userXProfile && <span className="text-red-500">This field is required</span>}
      </div>

      {/* GitHub Profile Link */}
      <div className="space-y-2">
        <Label htmlFor="githubProfile">GitHub Profile Link</Label>
        <Input
          id="githubProfile"
          type="url"
          placeholder="Enter GitHub Profile URL"
          {...register('githubProfile', { required: false })}
          className="w-full"
        />
        {errors.githubProfile && <span className="text-red-500">This field is required</span>}
      </div>

      {/* PDF File Upload */}
      <div className="space-y-2">
        <Label htmlFor="pdfFile">Upload PDF File</Label>
        <FileInput
          id="pdfFile"
          accept=".pdf"
          {...register('pdfFile', { required: false })}
          onChange={handleFileChange}
        />
        {pdfPreview && (
          <div className="mt-2 text-sm">
            <p>PDF Preview:</p>
            <iframe src={pdfPreview} width="100%" height="300px" />
          </div>
        )}
        {errors.pdfFile && <span className="text-red-500">PDF file is required</span>}
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="solid" className="mt-4">Submit</Button>
    </form>
  );
};

export default UserForm;
