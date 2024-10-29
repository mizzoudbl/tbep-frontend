'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useStore } from '@/lib/store';
import { formatBytes, openDB } from '@/lib/utils';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Loader, Trash2, Upload } from 'lucide-react';
import Papa from 'papaparse';
import React, { type ChangeEvent } from 'react';
import { toast } from 'sonner';

export default function FileSheet() {
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(true);
  const [checkedOptions, setCheckedOptions] = React.useState<Record<string, boolean>>({});
  const diseaseName = useStore(state => state.diseaseName);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    const storedShowConfirmDialog = sessionStorage.getItem('showConfirmDialog');
    if (storedShowConfirmDialog !== null) {
      setShowConfirmDialog(JSON.parse(storedShowConfirmDialog));
    }

    openDB('files', 'readonly').then(store => {
      if (!store) {
        toast.error('Failed to open IndexedDB database', {
          cancel: { label: 'Close', onClick() {} },
          position: 'top-center',
          richColors: true,
          description: 'Please make sure you have enabled IndexedDB in your browser',
        });
        return;
      }
      const request = store.getAll();
      request.onsuccess = () => {
        setUploadedFiles(request.result);
      };
    });

    const storedOptions = sessionStorage.getItem('checkedOptions');
    if (storedOptions) {
      setCheckedOptions(JSON.parse(storedOptions));
    }
  }, []);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const store = await openDB('files', 'readwrite');
      if (!store) {
        toast.error('Failed to open IndexedDB database', {
          cancel: { label: 'Close', onClick() {} },
          position: 'top-center',
          richColors: true,
          description: 'Please make sure you have enabled IndexedDB in your browser',
        });
        return;
      }
      const request = store.put(file, file.name);
      request.onerror = ev => console.error(ev);
      request.onsuccess = () => {
        toast.success('File uploaded successfully', {
          cancel: { label: 'Close', onClick() {} },
          position: 'top-center',
          richColors: true,
        });
        setUploadedFiles([...uploadedFiles, file]);
      };
    }
  };

  const handleCheckboxChange = (fileName: string) => {
    const updatedCheckedOptions = { ...checkedOptions, [fileName]: !checkedOptions[fileName] };
    setCheckedOptions(updatedCheckedOptions);
    sessionStorage.setItem('checkedOptions', JSON.stringify(updatedCheckedOptions));
  };

  const removeFile = async (name: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.name !== name));

    const store = await openDB('files', 'readwrite');
    if (!store) {
      toast.error('Failed to open IndexedDB database', {
        cancel: { label: 'Close', onClick() {} },
        position: 'top-center',
        richColors: true,
        description: 'Please make sure you have enabled IndexedDB in your browser',
      });
      return;
    }
    const request = store.delete(name);
    request.onerror = ev => console.error(ev);
    request.onsuccess = () => {
      toast.info('File removed successfully', {
        cancel: { label: 'Close', onClick() {} },
        position: 'top-center',
        richColors: true,
      });
    };
  };

  const handleConfirmDialogChange = (checked: CheckedState) => {
    sessionStorage.setItem('showConfirmDialog', JSON.stringify(!checked));
  };

  const handleUniversalUpdate = async () => {
    setIsProcessing(true);
    const universalData = useStore.getState().initialUniversalData ?? {};
    const radioOptions = useStore.getState().initialRadioOptions ?? {};
    for (const file of uploadedFiles) {
      if (!checkedOptions[file.name]) continue;
      const store = await openDB('files', 'readonly');
      if (!store) {
        toast.error('Failed to open IndexedDB database', {
          cancel: { label: 'Close', onClick() {} },
          position: 'top-center',
          richColors: true,
          description: 'Please make sure you have enabled IndexedDB in your browser',
        });
        return;
      }
      const request = store.get(file.name);
      request.onsuccess = async () => {
        const data = await (request.result as File).text();
        const parsedData = Papa.parse(data, { header: true, skipEmptyLines: true });
        const IDHeaderName = parsedData.meta.fields?.[0];
        if (!IDHeaderName) {
          toast.error(`Invalid file: ${file.name}`, {
            cancel: { label: 'Close', onClick() {} },
            position: 'top-center',
            richColors: true,
            description: 'Please check the file and try again',
          });
          return;
        }
        try {
          // biome-ignore lint/suspicious/noExplicitAny: TODO: Make this type-safe
          for (const row of parsedData.data as any[]) {
            if (!(row[IDHeaderName] in universalData)) continue;
            for (const prop in row) {
              if (prop === IDHeaderName) continue;
              if (/^logFC_/i.test(prop)) {
                universalData[row[IDHeaderName]][diseaseName]!.logFC[prop.replace(/^logFC_/i, '')] = row[prop];
              } else if (/^GDA_/i.test(prop)) {
                universalData[row[IDHeaderName]][diseaseName]!.GDA[prop.replace(/^GDA_/i, '')] = row[prop];
              } else if (/^GWAS_/i.test(prop)) {
                universalData[row[IDHeaderName]][diseaseName]!.Genetics[prop.replace(/^GWAS_/i, '')] = row[prop];
              } else if (/^pathway_/i.test(prop)) {
                universalData[row[IDHeaderName]].common.Pathways[prop.replace(/^pathway_/i, '')] = row[prop];
              } else if (/^druggability_/i.test(prop)) {
                universalData[row[IDHeaderName]].common.Druggability[prop.replace(/^druggability_/i, '')] = row[prop];
              } else if (/^custom_color_/i.test(prop)) {
                universalData[row[IDHeaderName]].common.Custom[prop.replace(/^custom_color_/i, '')] = row[prop];
              }
            }
          }

          for (const prop of parsedData.meta.fields ?? []) {
            if (prop === IDHeaderName) continue;
            if (/^logFC_/i.test(prop)) {
              radioOptions.logFC.push(prop.replace(/^logFC_/i, ''));
            } else if (/^GDA_/i.test(prop)) {
              radioOptions.GDA.push(prop.replace(/^GDA_/i, ''));
            } else if (/^GWAS_/i.test(prop)) {
              radioOptions.Genetics.push(prop.replace(/^GWAS_/i, ''));
            } else if (/^TE_/i.test(prop)) {
              radioOptions.TE.push(prop.replace(/^TE_/i, ''));
            } else if (/^database_/i.test(prop)) {
              radioOptions.Database.push(prop.replace(/^database_/i, ''));
            } else if (/^pathway_/i.test(prop)) {
              radioOptions.Pathways.push(prop.replace(/^pathway_/i, ''));
            } else if (/^druggability_/i.test(prop)) {
              radioOptions.Druggability.push(prop.replace(/^druggability_/i, ''));
            } else if (/^custom_color_/i.test(prop)) {
              radioOptions.Custom.push(prop.replace(/^custom_color_/i, ''));
            }
          }
        } catch (error) {
          console.error(error);
          toast.error('Error updating universal data', {
            cancel: { label: 'Close', onClick() {} },
            position: 'top-center',
            richColors: true,
          });
          return;
        }
      };
    }

    useStore.setState({ universalData, radioOptions });
    setIsProcessing(false);
  };

  const handleReset = () => {
    setCheckedOptions({});
    sessionStorage.removeItem('checkedOptions');
    useStore.setState({
      universalData: useStore.getState().initialUniversalData,
      radioOptions: useStore.getState().initialRadioOptions,
    });
    toast.info('Data reset successfully', {
      cancel: { label: 'Close', onClick() {} },
      position: 'top-center',
      richColors: true,
    });
  };

  return (
    <div className='flex flex-col gap-2 justify-between'>
      <Sheet>
        <SheetTrigger asChild>
          <Button size='sm' className='text-xs w-full'>
            <Upload className='h-3 w-3 mr-1' />
            Upload Files
          </Button>
        </SheetTrigger>
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>Uploaded Files</SheetTitle>
            <SheetDescription>Manage your uploaded files here.</SheetDescription>
          </SheetHeader>
          <div className='py-4'>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4'>
              <Input type='file' className='hidden' id='file-upload' accept='*.csv' onChange={handleFileUpload} />
              <Label htmlFor='file-upload' className='cursor-pointer text-sm text-gray-600'>
                Drop files here or click to upload
              </Label>
            </div>
            <ScrollArea className='h-[200px]'>
              {uploadedFiles.map(file => (
                <div key={file.name} className='flex justify-between items-center mb-2 p-2 bg-gray-100 rounded'>
                  <div>
                    <div className='text-sm font-medium'>
                      <div className='flex gap-4'>
                        <Checkbox
                          id={file.name}
                          checked={checkedOptions[file.name] || false}
                          onCheckedChange={() => handleCheckboxChange(file.name)}
                        />
                        {file.name}
                      </div>
                    </div>
                    <div className='text-xs text-gray-500 ml-8'>
                      Date: {new Date(file.lastModified).toLocaleString()} | Size: {formatBytes(file.size)}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                    {showConfirmDialog && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className='text-black'>
                            This action cannot be undone. This will permanently delete the file.
                          </AlertDialogDescription>
                          <div className='flex items-center space-x-2 mt-4'>
                            <Checkbox id='terms' onCheckedChange={handleConfirmDialogChange} />
                            <Label
                              htmlFor='terms'
                              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                              Do not show again
                            </Label>
                          </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeFile(file.name)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    )}
                  </AlertDialog>
                </div>
              ))}
            </ScrollArea>
          </div>
          <SheetFooter>
            <SheetTrigger asChild>
              <Button onClick={handleUniversalUpdate} className='w-full'>
                {isProcessing ? (
                  <div className='flex'>
                    <Loader className='animate-spin mr-2' />
                    Processing...
                  </div>
                ) : (
                  'Submit'
                )}
              </Button>
            </SheetTrigger>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Button variant={'destructive'} size={'sm'} className='text-xs' onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}
