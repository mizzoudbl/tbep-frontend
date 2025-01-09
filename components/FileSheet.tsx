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
import { DISEASE_DEPENDENT_PROPERTIES, DISEASE_INDEPENDENT_PROPERTIES } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import type { OtherSection, RadioOptions, UniversalData } from '@/lib/interface';
import { formatBytes, openDB } from '@/lib/utils';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Trash2, Upload } from 'lucide-react';
import Papa from 'papaparse';
import React, { type ChangeEvent } from 'react';
import { toast } from 'sonner';

export default function FileSheet() {
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [checkedOptions, setCheckedOptions] = React.useState<Record<string, boolean>>({});
  const diseaseName = useStore(state => state.diseaseName);
  const geneNameToID = useStore(state => state.geneNameToID);

  React.useEffect(() => {
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
        const checkedOptions: Record<string, boolean> = {};
        for (const file of request.result) {
          checkedOptions[file.name] = false;
        }
        setCheckedOptions(checkedOptions);
      };
    });
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
        setUploadedFiles([...uploadedFiles, file]);
        setCheckedOptions({ ...checkedOptions, [file.name]: true });
      };
    }
  };

  const handleCheckboxChange = (fileName: string) => {
    const updatedCheckedOptions = {
      ...checkedOptions,
      [fileName]: !checkedOptions[fileName],
    };
    setCheckedOptions(updatedCheckedOptions);
    sessionStorage.setItem('checkedOptions', JSON.stringify(updatedCheckedOptions));
  };

  const removeFile = async (name: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.name !== name));
    setShowConfirmDialog(false);
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
    const universalData: UniversalData = {
      database: useStore.getState().universalData.database,
      user: {},
    };
    const radioOptions: RadioOptions = {
      database: useStore.getState().radioOptions.database,
      user: {
        DEG: [],
        OpenTargets: [],
        OT_Prioritization: [],
        Pathway: [],
        Druggability: [],
        TE: [],
        Custom_Color: [],
      },
    };
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
        const parsedData = Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
        });
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
            const geneID = row[IDHeaderName].startsWith('ENSG')
              ? row[IDHeaderName]
              : geneNameToID.get(row[IDHeaderName]);
            if (!geneID || !universalData.database[geneID]) continue;
            if (universalData.user[geneID] === undefined) {
              universalData.user[geneID] = {
                common: {
                  Custom_Color: {},
                  Druggability: {},
                  Pathway: {},
                  TE: {},
                  OT_Prioritization: {},
                },
              };
            }
            if (universalData.user[geneID][diseaseName] === undefined) {
              universalData.user[geneID][diseaseName] = {
                DEG: {},
                OpenTargets: {},
              };
            }

            outer: for (const prop in row) {
              if (prop === IDHeaderName) continue;

              for (const field of DISEASE_DEPENDENT_PROPERTIES) {
                if (new RegExp(`^${field}_`, 'i').test(prop)) {
                  (universalData.user[geneID][diseaseName] as OtherSection)[field][
                    prop.replace(new RegExp(`^${field}_`, 'i'), '')
                  ] = row[prop];
                  continue outer;
                }
              }

              for (const field of DISEASE_INDEPENDENT_PROPERTIES) {
                if (new RegExp(`^${field}_`, 'i').test(prop)) {
                  universalData.user[geneID].common[field][prop.replace(new RegExp(`^${field}_`, 'i'), '')] = row[prop];
                  break;
                }
              }
            }
          }

          for (const prop of parsedData.meta.fields ?? []) {
            if (prop === IDHeaderName) continue;

            for (const field of [...DISEASE_DEPENDENT_PROPERTIES, ...DISEASE_INDEPENDENT_PROPERTIES]) {
              if (new RegExp(`^${field}_`, 'i').test(prop)) {
                radioOptions.user[field].push(prop.replace(new RegExp(`^${field}_`, 'i'), ''));
                break;
              }
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
    toast.success('Data updated successfully', {
      cancel: { label: 'Close', onClick() {} },
      position: 'top-center',
      richColors: true,
      description: 'You can now play your uploaded data!',
    });
  };

  const handleReset = () => {
    setCheckedOptions(value => {
      const updatedCheckedOptions = { ...value };
      for (const key in updatedCheckedOptions) {
        updatedCheckedOptions[key] = false;
      }
      return updatedCheckedOptions;
    });
    useStore.setState({
      universalData: {
        database: useStore.getState().universalData.database,
        user: {},
      },
      radioOptions: {
        database: useStore.getState().radioOptions.database,
        user: {
          DEG: [],
          OpenTargets: [],
          OT_Prioritization: [],
          Pathway: [],
          Druggability: [],
          TE: [],
          Custom_Color: [],
        },
      },
    });
    toast.info('Data reset successfully', {
      cancel: { label: 'Close', onClick() {} },
      position: 'top-center',
      richColors: true,
    });
  };

  return (
    <div className='flex flex-col lg:flex-row gap-2 justify-between'>
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
                  <AlertDialog open={showConfirmDialog}>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        if (sessionStorage.getItem('showConfirmDialog') === 'false') {
                          removeFile(file.name);
                        } else {
                          setShowConfirmDialog(true);
                        }
                      }}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
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
                        <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeFile(file.name)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </ScrollArea>
          </div>
          <SheetFooter>
            <SheetTrigger asChild>
              <Button onClick={handleUniversalUpdate} className='w-full'>
                Submit
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
