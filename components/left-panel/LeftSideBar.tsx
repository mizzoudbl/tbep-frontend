'use client';

import { type DiseaseType, diseaseMap, diseaseTooltip } from '@/lib/data';
import { GENE_UNIVERSAL_QUERY } from '@/lib/gql';
import type { Gene, GeneUniversalData, GeneUniversalDataVariables, RadioOptions, UniversalData } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useLazyQuery } from '@apollo/client';
import { Info } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { NodeColor, NodeSize } from '.';
import { Combobox } from '../ComboBox';
import FileSheet from '../FileSheet';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { GeneSearch } from './GeneSearch';

export function LeftSideBar() {
  const diseaseName = useStore(state => state.diseaseName);
  const geneIDs = useStore(state => state.geneIDs);
  const bringCommon = useRef<boolean>(true);

  const [fetchData] = useLazyQuery<GeneUniversalData, GeneUniversalDataVariables>(
    GENE_UNIVERSAL_QUERY(diseaseName, bringCommon.current ?? true),
    {
      returnPartialData: true,
    },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Fetchdata dependency is redundant
  useEffect(() => {
    if (!diseaseName || !geneIDs.length) return;
    fetchData({
      variables: {
        geneIDs: geneIDs,
      },
    })
      .then(val => {
        if (!val.data?.getGenes) return;
        const radioOptions: RadioOptions = {
          None: [],
          logFC: [],
          GDA: [],
          Genetics: [],
          Pathways: [],
          Druggability: [],
          TE: [],
          Database: [],
          Custom: [],
        };
        const gene = val.data.getGenes[0];
        for (const key in gene) {
          // using case insensitive regexp filter keys starting with pathway_ and extract the rest of the string
          if (key === 'ID') continue;
          if (key === 'common' && bringCommon.current) {
            for (const prop in gene.common) {
              if (/^pathway_/i.test(prop)) {
                radioOptions.Pathways.push(prop.replace(/^pathway_/i, ''));
              } else if (/^druggability_/i.test(prop)) {
                radioOptions.Druggability.push(prop.replace(/^druggability_/i, ''));
              } else if (/^TE_/i.test(prop)) {
                radioOptions.TE.push(prop.replace(/^TE_/i, ''));
              } else if (/^database_/i.test(prop)) {
                radioOptions.Database.push(prop.replace(/^database_/i, ''));
              }
            }
          } else {
            for (const prop in gene[key as keyof Gene] as Record<string, string>) {
              if (/^logFC_/i.test(prop)) {
                radioOptions.logFC.push(prop.replace(/^logFC_/i, ''));
              } else if (/^GDA_/i.test(prop)) {
                radioOptions.GDA.push(prop.replace(/^GDA_/i, ''));
              } else if (/^GWAS_/i.test(prop)) {
                radioOptions.Genetics.push(prop.replace(/^GWAS_/i, ''));
              }
            }
          }
        }

        const universalData: UniversalData = {};
        for (const gene of val.data?.getGenes || []) {
          universalData[gene.ID] = {
            common: {
              Pathways: {},
              Druggability: {},
              TE: {},
              Database: {},
              Custom: {},
            },
            [diseaseName]: {
              logFC: {},
              GDA: {},
              Genetics: {},
              TE: {},
              Database: {},
              None: {},
              Pathways: {},
              Druggability: {},
              Custom: {},
            },
          };
          for (const key in gene.common) {
            if (/^pathway_/i.test(key)) {
              universalData[gene.ID].common.Pathways[key.replace(/^pathway_/i, '')] = gene.common[key];
            } else if (/^druggability_/i.test(key)) {
              universalData[gene.ID].common.Druggability[key.replace(/^druggability_/i, '')] = gene.common[key];
            } else if (/^TE_/i.test(key)) {
              universalData[gene.ID].common.TE[key.replace(/^TE_/i, '')] = gene.common[key];
            } else if (/^database_/i.test(key)) {
              universalData[gene.ID].common.Database[key.replace(/^database_/i, '')] = gene.common[key];
            }
          }
          for (const key in gene[diseaseName]) {
            if (/^logFC_/i.test(key)) {
              universalData[gene.ID][diseaseName]!.logFC[key.replace(/^logFC_/i, '')] = gene[diseaseName][key];
            } else if (/^GDA_/i.test(key)) {
              universalData[gene.ID][diseaseName]!.GDA[key.replace(/^GDA_/i, '')] = gene[diseaseName][key];
            } else if (/^GWAS_/i.test(key)) {
              universalData[gene.ID][diseaseName]!.Genetics[key.replace(/^GWAS_/i, '')] = gene[diseaseName][key];
            }
          }
        }
        useStore.setState({
          initialUniversalData: JSON.parse(JSON.stringify(universalData)),
          initialRadioOptions: JSON.parse(JSON.stringify(radioOptions)),
        });
        useStore.setState({ universalData, radioOptions }, false);
        if (bringCommon.current) bringCommon.current = false;
      })
      .catch(err => {
        console.error(err);
      });
  }, [diseaseName, geneIDs]);

  return (
    <ScrollArea className='border-r p-2 flex flex-col h-[98vh]'>
      <div>
        <div className='flex flex-col'>
          <Label className='font-bold mb-2'>Disease Map</Label>
          <div className='flex items-center gap-2'>
            <Combobox
              value={diseaseName}
              onChange={value => useStore.setState({ diseaseName: value as DiseaseType })}
              data={diseaseMap}
              className='w-full'
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={20} />
              </TooltipTrigger>
              <TooltipContent>{diseaseTooltip[diseaseName]}</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <NodeColor />
      </div>
      <NodeSize />
      <div className='mt-auto'>
        <div className='flex flex-col space-y-2 mb-2'>
          <GeneSearch />
          <FileSheet />
        </div>
      </div>
    </ScrollArea>
  );
}
