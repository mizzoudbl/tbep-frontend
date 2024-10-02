'use client';
import React, { type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import uploadFileFormatImage from '@/public/image/uploadFormat.png';
import { toast } from 'sonner';

export default function UploadFile() {
  const [file, setFile] = React.useState<File | null>(null);
  const [fileType, setFileType] = React.useState<'csv' | 'json'>('csv');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file?.name.split('.').pop() !== fileType) {
      toast.error('Invalid file type', {
        cancel: { label: 'Close', onClick() {} },
        position: 'top-center',
        richColors: true,
        description: `Please upload a ${fileType.toUpperCase()} file`,
      });
      return;
    }
    setFile(file);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please upload a file', {
        cancel: { label: 'Close', onClick() {} },
        position: 'top-center',
        richColors: true,
      });
      return;
    }
    const db = await openDB('network');
    if (!db) {
      toast.error('Failed to open IndexedDB database', {
        cancel: { label: 'Close', onClick() {} },
        position: 'top-center',
        richColors: true,
        description: 'Please make sure you have enabled IndexedDB in your browser',
      });
      return;
    }
    const tx = db.transaction('network', 'readwrite');
    const store = tx.objectStore('network');
    console.log(file);
    store.put(file, 'custom_network_file');
    toast.success('File uploaded successfully', {
      cancel: { label: 'Close', onClick() {} },
      position: 'top-center',
      richColors: true,
    });
    window.open('/network', '_blank','noopener,noreferrer');
  };

  const openDB = async (name: string) => {
    return new Promise<IDBDatabase | null>((resolve, reject) => {
      const request = indexedDB.open(name, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(null);
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore('network');
      };
    });
  }

  return (
    <div className='mx-auto bg-white rounded-lg shadow-md p-4'>
      <h2 className='text-2xl font-semibold mb-6'>Upload your Network</h2>
      <form action={handleSubmit}>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='fileType'>Select File Type</Label>
            <Select value={fileType} onValueChange={val => setFileType(val as 'csv' | 'json')}>
              <SelectTrigger id='fileType'>
                <SelectValue placeholder='Select file type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='csv'>CSV</SelectItem>
                <SelectItem value='json'>JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='fileUpload'>Upload {fileType.toUpperCase()}</Label>
            <Input
              id='fileUpload'
              type='file'
              accept='.csv,.json'
              onChange={handleFileChange}
              className='border-2 hover:border-dashed cursor-pointer'
            />
          </div>
          <Button type='submit' className='w-full bg-teal-600 hover:bg-teal-700 text-white'>
            Submit
          </Button>
        </div>
      </form>
      <div className='mt-6'>
        <h3 className='text-lg font-semibold mb-2'>File Format</h3>
        <Image src={uploadFileFormatImage} alt='CSV file format example' className='w-full max-w-3xl mx-auto' />
      </div>
    </div>
  );
}
