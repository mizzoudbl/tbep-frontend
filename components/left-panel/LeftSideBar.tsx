'use client';

import { useLazyQuery } from '@apollo/client';
import { SquareDashedMousePointerIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  DISEASE_DEPENDENT_PROPERTIES,
  DISEASE_INDEPENDENT_PROPERTIES,
  type DiseaseDependentProperties,
  type DiseaseIndependentProperties,
} from '@/lib/data';
import { GENE_UNIVERSAL_QUERY, GET_HEADERS_QUERY } from '@/lib/gql';
import { useStore } from '@/lib/hooks';
import type {
  GeneUniversalData,
  GeneUniversalDataVariables,
  GetDiseaseData,
  GetHeadersData,
  GetHeadersVariables,
  OtherSection,
  RadioOptions,
} from '@/lib/interface';
import { envURL } from '@/lib/utils';
import { Export, FileSheet, MouseControlMessage } from '../app';
import { DiseaseMapCombobox } from '../DiseaseMapCombobox';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Spinner } from '../ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { GeneSearch, NodeColor, NodeSize } from '.';

export function LeftSideBar() {
  const diseaseName = useStore(state => state.diseaseName);
  const geneIDs = useStore(useShallow(state => state.geneNames.map(g => state.geneNameToID.get(g) ?? g)));
  const bringCommon = useRef<boolean>(true);
  const [diseaseData, setDiseaseData] = React.useState<GetDiseaseData | undefined>(undefined);
  const [diseaseMap, setDiseaseMap] = React.useState<string>('MONDO_0004976');

  useEffect(() => {
    const graphConfig = localStorage.getItem('graphConfig');
    if (!graphConfig) redirect('/');
    const diseaseMap = JSON.parse(graphConfig).diseaseMap;
    useStore.setState({
      diseaseName: diseaseMap || 'MONDO_0004976',
    });
    setDiseaseMap(diseaseMap);
    (async () => {
      const response = await fetch(`${envURL(process.env.NEXT_PUBLIC_BACKEND_URL)}/diseases`);
      const data = await response.json();
      setDiseaseData(data);
    })();
  }, []);

  const [fetchHeader, { loading, called }] = useLazyQuery<GetHeadersData, GetHeadersVariables>(
    GET_HEADERS_QUERY(bringCommon.current),
    { returnPartialData: true },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Fetchdata dependency is redundant
  useEffect(() => {
    if (!diseaseName) return;
    fetchHeader({
      query: GET_HEADERS_QUERY(bringCommon.current),
      variables: {
        disease: diseaseName,
      },
    })
      .then(val => {
        const data = val.data?.headers;
        if (!data) return;
        const radioOptions: RadioOptions = {
          database: {
            ...useStore.getState().radioOptions.database,
            DEG: [],
            // OpenTargets: [],
          },
          user: useStore.getState().radioOptions.user,
        };
        if (bringCommon.current) {
          for (const { name, description } of data.common ?? []) {
            for (const field of DISEASE_INDEPENDENT_PROPERTIES) {
              if (new RegExp(`^${field}_`, 'i').test(name)) {
                radioOptions.database[field].push({
                  description,
                  name: name.replace(new RegExp(`^${field}_`, 'i'), ''),
                });
              }
            }
          }
        }
        bringCommon.current = false;
        for (const { name, description } of data.disease ?? []) {
          for (const field of DISEASE_DEPENDENT_PROPERTIES) {
            if (field === 'OpenTargets') continue;
            if (new RegExp(`^${diseaseName}_${field}_`, 'i').test(name)) {
              radioOptions.database[field].push({
                description,
                name: name.replace(new RegExp(`^${diseaseName}_${field}_`, 'i'), ''),
              });
            }
          }
        }
        useStore.setState({ radioOptions });
      })
      .catch(err => {
        console.error(err);
      });
  }, [diseaseName]);

  useEffect(() => {
    if (!geneIDs) return;
    const universalData = useStore.getState().universalData;
    for (const gene of geneIDs) {
      if (universalData[gene] === undefined) {
        universalData[gene] = {
          common: {
            Custom_Color: {},
            OT_Prioritization: {},
            Druggability: {},
            Pathway: {},
            TE: {},
          },
          user: {
            DEG: {},
            OpenTargets: {},
            Custom_Color: {},
            Druggability: {},
            Pathway: {},
            TE: {},
            OT_Prioritization: {},
          },
        };
      }
    }
  }, [geneIDs]);

  const [fetchUniversal, { loading: universalLoading }] = useLazyQuery<GeneUniversalData, GeneUniversalDataVariables>(
    GENE_UNIVERSAL_QUERY(),
  );
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const radioOptions = useStore(state => state.radioOptions);
  const queriedFieldSet = useRef<Set<string>>(new Set());

  async function handlePropChange(val: string | Set<string>, type: 'color' | 'size') {
    const selectedRadio = type === 'color' ? selectedRadioNodeColor : selectedRadioNodeSize;
    if (!selectedRadio) return;
    const ddp = DISEASE_DEPENDENT_PROPERTIES.includes(selectedRadio as DiseaseDependentProperties);
    const keys = (val instanceof Set ? Array.from(val) : [val]).reduce<string[]>((acc, v) => {
      const key = `${ddp ? `${diseaseName}_` : ''}${selectedRadio}_${v}`;
      if (!queriedFieldSet.current.has(key) && !radioOptions.user[selectedRadio].includes(key)) {
        acc.push(ddp ? key.slice(diseaseName.length + 1) : key);
      }
      return acc;
    }, []);
    if (keys.length === 0) {
      useStore.setState({
        [type === 'color' ? 'selectedNodeColorProperty' : 'selectedNodeSizeProperty']: val,
      });
    } else {
      const result = await fetchUniversal({
        variables: {
          geneIDs,
          config: [
            {
              properties: keys,
              ...(ddp && { disease: diseaseName }),
            },
          ],
        },
      });
      if (result.error) {
        console.error(result.error);
        return;
      }
      const data = result.data?.genes;
      queriedFieldSet.current = new Set([...queriedFieldSet.current, ...keys]);
      const universalData = useStore.getState().universalData;
      for (const gene of data ?? []) {
        for (const prop in gene.common) {
          universalData[gene.ID].common[selectedRadio as DiseaseIndependentProperties][
            prop.replace(new RegExp(`^${selectedRadio}_`), '')
          ] = gene.common[prop];
        }
        for (const prop in gene.disease?.[diseaseName]) {
          const geneRecord = universalData[gene.ID];
          if (geneRecord[diseaseName] === undefined) {
            geneRecord[diseaseName] = {
              DEG: {},
              OpenTargets: {},
            } as OtherSection;
          }
          (universalData[gene.ID][diseaseName] as OtherSection)[selectedRadio as DiseaseDependentProperties][
            prop.replace(new RegExp(`^${selectedRadio}_`), '')
          ] = gene.disease[diseaseName][prop];
        }
      }
      useStore.setState({
        universalData,
        [type === 'color' ? 'selectedNodeColorProperty' : 'selectedNodeSizeProperty']: val,
      });
    }
  }

  async function handleDiseaseChange(disease: string) {
    setDiseaseMap(disease);
    useStore.setState({ diseaseName: disease });
  }

  return (
    <ScrollArea className='border-r p-2 flex flex-col h-[calc(96vh-1.5px)]'>
      <Export />
      <Tooltip>
        <TooltipTrigger className='relative'>
          <MouseControlMessage />
          <SquareDashedMousePointerIcon className='h-4 w-4' />
        </TooltipTrigger>
        <TooltipContent align='start' className='max-w-96 text-sm'>
          <ol>
            <li>
              • To select multiple genes and export details or perform GSEA analysis, use the mouse to select the genes
              <br />
              <b>
                <i>Shortcut: </i>
              </b>
              <kbd className='border rounded-md px-1'> Shift(⇧) + Click</kbd> & Drag
            </li>
            <br />
            <li>
              • To highlight neighbors of a gene, either check Highlight Neighbor Genes on Network Style section and
              then hover/click the gene
              <br />
              <b>
                <i>Shortcut: </i>
              </b>
              <kbd className='border rounded-md px-1'>Cmd/Ctrl(⌘) + Hover</kbd>
            </li>
            <br />
            <li>
              • To highlight a gene via appending it to search textbox, click the gene while holding the Cmd/Ctrl(⌘) key
              <br />
              <b>
                <i>Shortcut: </i>
              </b>
              <kbd className='border rounded-md px-1'>Cmd/Ctrl(⌘) + Click</kbd>
            </li>
          </ol>
        </TooltipContent>
      </Tooltip>
      <div className='flex flex-col'>
        <Label className='font-bold mb-2'>Disease Map</Label>
        <div className='flex items-center gap-2'>
          <motion.div layout transition={{ duration: 0.1, ease: 'easeInOut' }} initial={{ width: '100%' }} animate>
            <DiseaseMapCombobox
              value={diseaseMap}
              onChange={d => typeof d === 'string' && handleDiseaseChange(d)}
              data={diseaseData}
              className='w-full'
            />
          </motion.div>
          <AnimatePresence>
            {(!called || (called && loading) || diseaseData === undefined || universalLoading) && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Spinner size='small' />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <NodeColor onPropChange={val => handlePropChange(val, 'color')} />
      <NodeSize onPropChange={val => handlePropChange(val, 'size')} />
      <div className='flex flex-col space-y-2 mb-2'>
        <GeneSearch />
        <FileSheet />
      </div>
    </ScrollArea>
  );
}
