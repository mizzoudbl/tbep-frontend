'use client';

import {
  DISEASE_DEPENDENT_PROPERTIES,
  DISEASE_INDEPENDENT_PROPERTIES,
  type DiseaseDependentProperties,
  type DiseaseIndependentProperties,
  diseaseTooltip,
} from '@/lib/data';
import { GENE_UNIVERSAL_QUERY, GET_DISEASES_QUERY, GET_STATS_QUERY } from '@/lib/gql';
import type {
  GeneUniversalData,
  GeneUniversalDataVariables,
  GetStatsData,
  GetStatsVariables,
  OtherSection,
  RadioOptions,
} from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Info } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { NodeColor, NodeSize } from '.';
import FileSheet from '../FileSheet';
import { VirtualizedCombobox } from '../VirtualizedCombobox';
import { Combobox } from '../ui/combobox';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Spinner } from '../ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { GeneSearch } from './GeneSearch';

export function LeftSideBar() {
  const diseaseName = useStore(state => state.diseaseName);
  const geneIDs = useStore(state => state.geneIDs);
  const bringCommon = useRef<boolean>(true);

  useEffect(() => {
    useStore.setState({
      diseaseName: JSON.parse(localStorage.getItem('graphConfig') || '{}').diseaseMap,
    });
  }, []);

  const [fetchHeader, { loading, called }] = useLazyQuery<GetStatsData, GetStatsVariables>(
    GET_STATS_QUERY(bringCommon.current),
    { returnPartialData: true },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Fetchdata dependency is redundant
  useEffect(() => {
    if (diseaseName === '') return;
    fetchHeader({
      variables: {
        disease: diseaseName,
      },
    })
      .then(val => {
        const data = val.data?.getHeaders;
        if (!data) return;
        const radioOptions: RadioOptions = {
          database: {
            ...useStore.getState().radioOptions.database,
            DEG: [],
            GDA: [],
            Genetics: [],
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
            Custom: {},
            Database: {},
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
  const queryiedFields = useRef<Set<string>>(new Set());
  const { data: diseaseData, loading: diseaseLoading } = useQuery<{
    getDiseases: string[];
  }>(GET_DISEASES_QUERY);

  async function handlePropChange(val: string, type: 'color' | 'size') {
    const selectedRadio = type === 'color' ? selectedRadioNodeColor : selectedRadioNodeSize;
    const ddp = DISEASE_DEPENDENT_PROPERTIES.includes(selectedRadio as DiseaseDependentProperties);
    const key = `${ddp ? diseaseName : ''}_${selectedRadio}_${val}`;
    if (selectedRadio === 'None' || queryiedFields.current.has(key) || radioOptions.user[selectedRadio].includes(val)) {
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
      const data = result.data?.getGenes;
      queryiedFields.current.add(key);
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
              GDA: {},
              Genetics: {},
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

  return (
    <ScrollArea className='border-r p-2 flex flex-col h-[98vh]'>
      <div className='flex flex-col'>
        <Label className='font-bold mb-2'>Disease Map</Label>
        <div className='flex items-center gap-2'>
          <VirtualizedCombobox
            value={diseaseName}
            setValue={value => useStore.setState({ diseaseName: value })}
            data={diseaseData?.getDiseases ?? []}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              {!called || (called && loading) || diseaseLoading || universalLoading ? (
                <Spinner size='small' />
              ) : (
                <Info size={20} />
              )}
            </TooltipTrigger>
            <TooltipContent>{diseaseTooltip[diseaseName] ?? 'No info available'}</TooltipContent>
          </Tooltip>
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
