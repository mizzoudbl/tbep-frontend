'use client';

import {
  DISEASE_DEPENDENT_PROPERTIES,
  DISEASE_INDEPENDENT_PROPERTIES,
  type DiseaseDependentProperties,
  type DiseaseIndependentProperties,
} from '@/lib/data';
import { GENE_UNIVERSAL_QUERY, GET_STATS_QUERY } from '@/lib/gql';
import { useStore } from '@/lib/hooks';
import type {
  GeneUniversalData,
  GeneUniversalDataVariables,
  GetDiseaseData,
  GetStatsData,
  GetStatsVariables,
  OtherSection,
  RadioOptions,
} from '@/lib/interface';
import { envURL } from '@/lib/utils';
import { useLazyQuery } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';
import { redirect } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { NodeColor, NodeSize } from '.';
import FileSheet from '../FileSheet';
import { VirtualizedCombobox } from '../VirtualizedCombobox';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Spinner } from '../ui/spinner';
import { GeneSearch } from './GeneSearch';

export function LeftSideBar() {
  const diseaseName = useStore(state => state.diseaseName);
  const geneIDs = useStore(state => state.geneIDs);
  const bringCommon = useRef<boolean>(true);
  const [diseaseData, setDiseaseData] = React.useState<GetDiseaseData | null>(null);
  const [diseaseMap, setDiseaseMap] = React.useState<string>('amyotrophic lateral sclerosis (ALS)');

  useEffect(() => {
    const graphConfig = localStorage.getItem('graphConfig');
    if (!graphConfig) redirect('/');
    const diseaseMap = JSON.parse(graphConfig).diseaseMap;
    useStore.setState({
      diseaseName: diseaseMap?.split(' ')?.at(-1)?.slice(1, -1),
    });
    setDiseaseMap(diseaseMap);
    (async () => {
      const response = await fetch(`${envURL(process.env.NEXT_PUBLIC_BACKEND_URL)}/diseases`);
      const data = await response.json();
      setDiseaseData(data);
    })();
  }, []);

  const [fetchHeader, { loading, called }] = useLazyQuery<GetStatsData, GetStatsVariables>(
    GET_STATS_QUERY(bringCommon.current),
    { returnPartialData: true },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Fetchdata dependency is redundant
  useEffect(() => {
    if (!diseaseName) return;
    fetchHeader({
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
            OpenTargets: [],
          },
          user: useStore.getState().radioOptions.user,
        };
        bringCommon.current = false;
        for (const prop of data.common ?? []) {
          for (const field of DISEASE_INDEPENDENT_PROPERTIES) {
            if (new RegExp(`^${field}_`, 'i').test(prop)) {
              radioOptions.database[field].push(prop.replace(new RegExp(`^${field}_`, 'i'), ''));
            }
          }
        }
        for (const prop of data.disease ?? []) {
          for (const field of DISEASE_DEPENDENT_PROPERTIES) {
            if (new RegExp(`^${diseaseName}_${field}_`, 'i').test(prop)) {
              radioOptions.database[field].push(prop.replace(new RegExp(`^${diseaseName}_${field}_`, 'i'), ''));
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
      if (universalData.database[gene] === undefined) {
        universalData.database[gene] = {
          common: {
            Custom_Color: {},
            OT_Prioritization: {},
            Druggability: {},
            Pathway: {},
            TE: {},
          },
        };
      }
    }
  }, [geneIDs]);

  const [fetchUniversal, { loading: universalLoading }] = useLazyQuery<GeneUniversalData, GeneUniversalDataVariables>(
    GENE_UNIVERSAL_QUERY,
  );
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const radioOptions = useStore(state => state.radioOptions);
  const queriedFieldSet = useRef<Set<string>>(new Set());

  async function handlePropChange(val: string, type: 'color' | 'size') {
    const selectedRadio = type === 'color' ? selectedRadioNodeColor : selectedRadioNodeSize;
    if (!selectedRadio) return;
    const ddp = DISEASE_DEPENDENT_PROPERTIES.includes(selectedRadio as DiseaseDependentProperties);
    const key = `${ddp ? diseaseName : ''}_${selectedRadio}_${val}`;
    if (queriedFieldSet.current.has(key) || radioOptions.user[selectedRadio].includes(val)) {
      useStore.setState({
        [type === 'color' ? 'selectedNodeColorProperty' : 'selectedNodeSizeProperty']: val,
      });
    } else {
      const result = await fetchUniversal({
        variables: {
          geneIDs,
          config: [
            {
              properties: [`${selectedRadio}_${val}`],
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
      queriedFieldSet.current.add(key);
      const universalData = useStore.getState().universalData;
      for (const gene of data ?? []) {
        for (const prop in gene.common) {
          universalData.database[gene.ID].common[selectedRadio as DiseaseIndependentProperties][
            prop.replace(new RegExp(`^${selectedRadio}_`), '')
          ] = gene.common[prop];
        }
        for (const prop in gene.disease?.[diseaseName]) {
          const geneRecord = universalData.database[gene.ID];
          if (geneRecord[diseaseName] === undefined) {
            geneRecord[diseaseName] = {
              DEG: {},
              OpenTargets: {},
            } as OtherSection;
          }
          (universalData.database[gene.ID][diseaseName] as OtherSection)[selectedRadio as DiseaseDependentProperties][
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
    useStore.setState({ diseaseName: disease.split(' ').at(-1)?.slice(1, -1) });
  }

  return (
    <ScrollArea className='border-r p-2 flex flex-col h-[98vh]'>
      <div className='flex flex-col'>
        <Label className='font-bold mb-2'>Disease Map</Label>
        <div className='flex items-center gap-2'>
          <motion.div layout transition={{ duration: 0.1, ease: 'easeInOut' }} initial={{ width: '100%' }} animate>
            <VirtualizedCombobox
              value={diseaseMap}
              searchPlaceholder='Search Disease...'
              setValue={handleDiseaseChange}
              data={diseaseData?.map(val => `${val.name} (${val.ID})`)}
              loading={diseaseData === null}
              className='w-full'
            />
          </motion.div>
          <AnimatePresence>
            {(!called || (called && loading) || diseaseData === null || universalLoading) && (
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
