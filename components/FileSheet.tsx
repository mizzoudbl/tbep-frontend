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
import { Link } from 'next-view-transitions';
import Papa from 'papaparse';
import React, { type ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles, fileRejections) => {
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
      const filesToAdd: File[] = [];
      const newCheckedOptions: Record<string, boolean> = {};

      for (const file of acceptedFiles) {
        const request = store.put(file, file.name);
        request.onerror = ev => console.error(ev);
        request.onsuccess = () => {
          filesToAdd.push(file);
          newCheckedOptions[file.name] = true;

          // Check if all files have been processed
          if (filesToAdd.length === acceptedFiles.length) {
            setUploadedFiles(prev => [...prev, ...filesToAdd]);
            setCheckedOptions(prev => ({ ...prev, ...newCheckedOptions }));
          }
        };
      }
      if (fileRejections.length > 0) {
        const rejectedFiles = fileRejections.map(r => r.file.name).join(', ');
        toast.error(`Files rejected: ${rejectedFiles}`, {
          cancel: { label: 'Close', onClick() {} },
          position: 'top-center',
          richColors: true,
          description: 'Please make sure files are in CSV format',
        });
      }
    },
    accept: { 'text/csv': ['.csv'] },
  });

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
    store.delete(name).onerror = ev => console.error(ev);
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

              // LogFC alias of DEG
              if (/^LogFC_/i.test(prop)) {
                (universalData.user[geneID][diseaseName] as OtherSection).DEG[prop.replace(/^LogFC_/i, '')] = row[prop];
                continue;
              }

              // P_Val alias of DEG
              if (/^P_Val/i.test(prop)) {
                (universalData.user[geneID][diseaseName] as OtherSection).DEG[prop] = row[prop];
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

            // LogFC alias of DEG
            if (/^LogFC_/i.test(prop)) {
              radioOptions.user.DEG.push(prop.replace(/^LogFC_/i, ''));
              continue;
            }

            // P_Val alias of DEG
            if (/^P_Val/i.test(prop)) {
              radioOptions.user.DEG.push(prop);
              continue;
            }

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
            <SheetDescription>
              Manage your uploaded files here. <br />
              To know more about the file format, click{' '}
              <Link
                className='font-semibold underline'
                href='/docs/network-visualization/left-panel#file-format'
                target='_blank'
              >
                here ↗
              </Link>
              .
            </SheetDescription>
          </SheetHeader>
          <div className='py-4'>
            {/* <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4'> */}
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4 cursor-pointer'
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
            <ScrollArea className='h-[200px]'>
              {uploadedFiles.map(file => (
                <div
                  key={file.name}
                  className='flex justify-between items-center mb-2 p-2 bg-primary-foreground shadow rounded'
                >
                  <div>
                    <div className='text-sm font-medium flex gap-4'>
                      <Checkbox
                        id={file.name}
                        checked={checkedOptions[file.name] || false}
                        onCheckedChange={() => handleCheckboxChange(file.name)}
                      />
                      {file.name}
                    </div>
                    <span className='text-xs text-gray-500 ml-8'>
                      Date: {new Date(file.lastModified).toLocaleString()} | Size: {formatBytes(file.size)}
                    </span>
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
