'use client';
import { useLazyQuery } from '@apollo/client/react';
import { SquareDashedMousePointerIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DISEASE_DEPENDENT_PROPERTIES, type DiseaseDependentProperties } from '@/lib/data';
import { GENE_PROPERTIES_QUERY, GET_HEADERS_QUERY } from '@/lib/gql';
import { useStore } from '@/lib/hooks';
import type {
  GenePropertiesData,
  GenePropertiesDataVariables,
  GetDiseaseData,
  GetHeadersData,
  GetHeadersVariables,
  OtherSection,
  RadioOptions,
} from '@/lib/interface';
import { envURL, genePropertyCategoryEnumToString, selectedRadioStringToEnum } from '@/lib/utils';
import { Export, FileSheet, MouseControlMessage } from '../app';
import { DiseaseMapCombobox } from '../DiseaseMapCombobox';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Spinner } from '../ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { GeneSearch, NodeColor, NodeSize } from '.';

export function LeftSideBar() {
  const diseaseName = useStore(state => state.diseaseName);
  const geneIds = useStore(useShallow(state => state.geneNames.map(g => state.geneNameToID.get(g) ?? g)));
  const skipCommon = useRef<boolean>(false);
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

  const [fetchHeader, { loading, called }] = useLazyQuery<GetHeadersData, GetHeadersVariables>(GET_HEADERS_QUERY, {
    returnPartialData: true,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Fetchdata dependency is redundant
  useEffect(() => {
    if (!diseaseName) return;
    fetchHeader({
      variables: {
        diseaseId: diseaseName,
        skipCommon: skipCommon.current,
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
        if (!skipCommon.current) {
          radioOptions.database.OpenTargets = data.openTargets ?? [];
          radioOptions.database.OT_Prioritization = data.targetPrioritization ?? [];
          radioOptions.database.Druggability = data.druggability ?? [];
          radioOptions.database.Pathway = data.pathway ?? [];
          radioOptions.database.TE = data.tissueSpecificity ?? [];
        }
        skipCommon.current = true;

        // Currently all of it is same for OpenTargets
        // radioOptions.database.OpenTargets = data.openTargets ?? [];
        radioOptions.database.DEG = data.differentialExpression ?? [];
        useStore.setState({ radioOptions });
      })
      .catch(err => {
        console.error(err);
      });
  }, [diseaseName]);

  useEffect(() => {
    if (!geneIds) return;
    const universalData = useStore.getState().universalData;
    for (const gene of geneIds) {
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
  }, [geneIds]);

  const [fetchUniversal, { loading: universalLoading }] = useLazyQuery<GenePropertiesData, GenePropertiesDataVariables>(
    GENE_PROPERTIES_QUERY,
  );
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const radioOptions = useStore(state => state.radioOptions);
  const queriedFieldSet = useRef<Set<string>>(new Set());

  async function handlePropChange(val: string | Set<string>, type: 'color' | 'size') {
    const selectedRadio = type === 'color' ? selectedRadioNodeColor : selectedRadioNodeSize;
    if (!selectedRadio) return;
    const ddp = DISEASE_DEPENDENT_PROPERTIES.includes(selectedRadio as DiseaseDependentProperties);
    const properties = (val instanceof Set ? Array.from(val) : [val]).reduce<string[]>((acc, property) => {
      const key = `${ddp ? `${diseaseName}_` : ''}${selectedRadio}_${property}`;
      if (!queriedFieldSet.current.has(key) && !radioOptions.user[selectedRadio].includes(property)) {
        acc.push(property);
      }
      return acc;
    }, []);
    if (properties.length === 0) {
      useStore.setState({
        [type === 'color' ? 'selectedNodeColorProperty' : 'selectedNodeSizeProperty']: val,
      });
    } else {
      const result = await fetchUniversal({
        variables: {
          geneIds,
          config: [
            {
              category: selectedRadioStringToEnum(selectedRadio),
              properties: properties,
              ...(ddp && { diseaseId: diseaseName }),
            },
          ],
        },
      });
      if (result.error) {
        console.error(result.error);
        return;
      }
      properties.forEach(p => {
        queriedFieldSet.current.add(`${ddp ? `${diseaseName}_` : ''}${selectedRadio}_${p}`);
      });
      const universalData = useStore.getState().universalData;
      for (const { ID, data } of result.data?.geneProperties ?? []) {
        const geneRecord = universalData[ID];

        for (const { key, score, category: categoryEnum, diseaseId } of data) {
          const category = genePropertyCategoryEnumToString(categoryEnum);
          if (diseaseId) {
            if (category !== 'DEG' && category !== 'OpenTargets') continue;
            if (geneRecord[diseaseId] === undefined) {
              geneRecord[diseaseId] = {
                DEG: {},
                OpenTargets: {},
              } as OtherSection;
            }
            (geneRecord[diseaseId] as OtherSection)[category][key] = score;
          } else {
            if (category === 'DEG' || category === 'OpenTargets') continue;
            geneRecord.common[category][key] = score;
          }
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
    <ScrollArea className='flex h-[calc(96vh-1.5px)] flex-col border-r p-2'>
      <Export />
      <Tooltip>
        <TooltipTrigger className='relative'>
          <MouseControlMessage />
          <SquareDashedMousePointerIcon className='size-4' />
        </TooltipTrigger>
        <TooltipContent align='start' className='max-w-96 text-sm'>
          <ol>
            <li>
              • To select multiple genes and export details or perform GSEA analysis, use the mouse to select the genes
              <br />
              <b>
                <i>Shortcut: </i>
              </b>
              <kbd className='rounded-md border px-1'> Shift(⇧) + Click</kbd> & Drag
            </li>
            <br />
            <li>
              • To highlight neighbors of a gene, either check Highlight Neighbor Genes on Network Style section and
              then hover/click the gene
              <br />
              <b>
                <i>Shortcut: </i>
              </b>
              <kbd className='rounded-md border px-1'>Cmd/Ctrl(⌘) + Hover</kbd>
            </li>
            <br />
            <li>
              • To highlight a gene via appending it to search textbox, click the gene while holding the Cmd/Ctrl(⌘) key
              <br />
              <b>
                <i>Shortcut: </i>
              </b>
              <kbd className='rounded-md border px-1'>Cmd/Ctrl(⌘) + Click</kbd>
            </li>
          </ol>
        </TooltipContent>
      </Tooltip>
      <div className='flex flex-col'>
        <Label className='mb-2 font-bold'>Disease Map</Label>
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
      <div className='mb-2 flex flex-col space-y-2'>
        <GeneSearch />
        <FileSheet />
      </div>
    </ScrollArea>
  );
}
