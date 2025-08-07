'use client';

// MOCK DATA
// import { data } from '@/mock-data.json';
import { type TargetDiseaseAssociationRow, associationColumns, prioritizationColumns } from '@/lib/data';
import { OPENTARGET_HEATMAP_QUERY } from '@/lib/gql';
import { useStore } from '@/lib/hooks';
import { type OpenTargetsTableData, type OpenTargetsTableVariables, OrderByEnum } from '@/lib/interface';
import { type EventMessage, Events, eventEmitter } from '@/lib/utils';
import { useQuery } from '@apollo/client';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useMemo } from 'react';
import { VirtualizedCombobox } from '../VirtualizedCombobox';
import { AssociationScoreLegend, PrioritizationIndicatorLegend } from '../legends';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { HeatmapTable } from './HeatmapTable';
import { assocColorScale, prioritizationColorScale } from './colorScales';

export function OpenTargetsHeatmap() {
  const geneNames = useStore(state => state.geneNames);

  const geneIds = useMemo(() => {
    const geneNameToID = useStore.getState().geneNameToID;
    return geneNames.map(g => geneNameToID.get(g) ?? g);
  }, [geneNames]);

  const diseaseId = useStore(state => state.diseaseName);
  const [sortingColumn, setSortingColumn] = useState<string | null>('Association Score');
  const [pagination, setPagination] = useState({ page: 0, limit: 25 });
  const [geneIdsToQuery, setGeneIdsToQuery] = useState<Set<string>>(new Set());

  const orderByStringToEnum = useCallback((orderBy: string): OrderByEnum => {
    const mapping: Record<string, OrderByEnum> = {
      'Association Score': OrderByEnum.SCORE,
      'GWAS associations': OrderByEnum.GWAS_ASSOCIATIONS,
      'Gene Burden': OrderByEnum.GENE_BURDEN,
      ClinVar: OrderByEnum.CLINVAR,
      'GEL PanelApp': OrderByEnum.GEL_PANEL_APP,
      Gene2phenotype: OrderByEnum.GENE2PHENOTYPE,
      'UniProt literature': OrderByEnum.UNIPROT_LITERATURE,
      'UniProt curated variants': OrderByEnum.UNIPROT_CURATED_VARIANTS,
      Orphanet: OrderByEnum.ORPHANET,
      ClinGen: OrderByEnum.CLINGEN,
      'Cancer Gene Census': OrderByEnum.CANCER_GENE_CENSUS,
      IntOGen: OrderByEnum.INTOGEN,
      'ClinVar (somatic)': OrderByEnum.CLINVAR_SOMATIC,
      'Cancer Biomarkers': OrderByEnum.CANCER_BIOMARKERS,
      ChEMBL: OrderByEnum.CHEMBL,
      'CRISPR Screens': OrderByEnum.CRISPR_SCREENS,
      'Project Score': OrderByEnum.PROJECT_SCORE,
      SLAPenrich: OrderByEnum.SLAPENRICH,
      PROGENy: OrderByEnum.PROGENY,
      Reactome: OrderByEnum.REACTOME,
      'Gene signatures': OrderByEnum.GENE_SIGNATURES,
      'Europe PMC': OrderByEnum.EUROPE_PMC,
      'Expression Atlas': OrderByEnum.EXPRESSION_ATLAS,
      IMPC: OrderByEnum.IMPC,
    };
    return mapping[orderBy] || OrderByEnum.SCORE;
  }, []);

  /** Comment these out when mocking results to avoid API call */
  const {
    loading,
    error,
    data: queryData,
    refetch,
  } = useQuery<OpenTargetsTableData, OpenTargetsTableVariables>(OPENTARGET_HEATMAP_QUERY, {
    variables: {
      geneIds,
      diseaseId,
      orderBy: OrderByEnum.SCORE,
      page: pagination,
    },
    skip: !geneIds.length || !diseaseId,
  });

  if (error) console.error('Error fetching OpenTargets heatmap data:', error);

  const tableData: TargetDiseaseAssociationRow[] =
    queryData?.targetDiseaseAssociationTable.map(row => {
      const prioritization: Record<string, number> = {};
      if (Array.isArray(row.target.prioritization)) {
        for (const item of row.target.prioritization) {
          prioritization[item.key] = item.score;
        }
      }
      const datasources: Record<string, number> = {};
      if (Array.isArray(row.datasourceScores)) {
        for (const item of row.datasourceScores as { key: string; score: number }[]) {
          datasources[item.key] = item.score;
        }
      }
      return {
        target: row.target.name,
        'Association Score': row.overall_score,
        ...datasources,
        ...prioritization,
      };
    }) || [];
  /***** End Commenting Out API Call *****/

  /***** Mock Data Fetching *****/
  // const refetch = useCallback((variables: OpenTargetsTableVariables) => {
  //   console.log('Refetching with variables:', variables);
  // }, []);
  // const loading = false; // Mock loading state

  // const tableData: TargetDiseaseAssociationRow[] = Array.from({ length: 3 }, () => [
  //   ...data.targetDiseaseAssociationTable.map(row => {
  //     const prioritization: Record<string, number> = {};
  //     if (Array.isArray(row.target.prioritization)) {
  //       for (const item of row.target.prioritization) {
  //         prioritization[item.key] = item.score;
  //       }
  //     }
  //     const datasources: Record<string, number> = {};
  //     if (Array.isArray(row.datasourceScores)) {
  //       for (const item of row.datasourceScores as { key: string; score: number }[]) {
  //         datasources[item.key] = item.score;
  //       }
  //     }
  //     return {
  //       target: row.target.name,
  //       'Association Score': row.overall_score,
  //       ...datasources,
  //       ...prioritization,
  //     };
  //   }),
  // ]).flat();
  /***** End Mock Data Fetching *****/

  const toggleOnlyVisible = (checked: CheckedState) => {
    if (checked !== true) {
      refetch({
        geneIds: geneIdsToQuery.size ? Array.from(geneIdsToQuery).sort() : geneIds,
        diseaseId,
        orderBy: orderByStringToEnum(sortingColumn ?? 'Association Score'),
        page: pagination,
      });
    } else {
      eventEmitter.emit(Events.VISIBLE_NODES);
    }
  };

  const handleSearchSelection = (value: Set<string>) => {
    setGeneIdsToQuery(value);
    refetch({
      geneIds: Array.from(value).sort(),
      diseaseId,
      orderBy: orderByStringToEnum(sortingColumn ?? 'Association Score'),
      page: pagination,
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    eventEmitter.on(Events.VISIBLE_NODES_RESULTS, (data: EventMessage[Events.VISIBLE_NODES_RESULTS]) => {
      refetch({
        geneIds: Array.from(
          geneIdsToQuery.size ? geneIdsToQuery.intersection(data.visibleNodeGeneIds) : data.visibleNodeGeneIds,
        ).sort(),
        diseaseId,
        orderBy: orderByStringToEnum(sortingColumn ?? 'Association Score'),
        page: pagination,
      });
    });

    return () => {
      eventEmitter.removeAllListeners(Events.VISIBLE_NODES_RESULTS);
    };
  }, []);

  return (
    <div className='h-full'>
      <div className='flex items-center gap-4 p-4'>
        <div className='flex text-nowrap font-semibold items-center gap-2'>
          <Checkbox defaultChecked={false} onCheckedChange={toggleOnlyVisible} className='shrink-0' />
          Show only visible
        </div>
        <VirtualizedCombobox
          loading={geneIds.length === 0}
          data={geneNames}
          placeholder='Search genes...'
          value={geneIdsToQuery}
          onChange={value => typeof value !== 'string' && handleSearchSelection(value)}
          multiselect
          showSelectedAsChip
          width='full'
          className='w-full'
        />
      </div>
      <Tabs defaultValue='tda' className='flex flex-col items-center px-4'>
        <TabsList className='my-4 w-[95%]'>
          <TabsTrigger className='w-full' value='tda'>
            Target-disease Association
          </TabsTrigger>
          <TabsTrigger className='w-full' value='tpf'>
            Target prioritization factors
          </TabsTrigger>
        </TabsList>
        <TabsContent className='w-full' value='tda'>
          <div className='flex flex-col items-center pr-12'>
            <HeatmapTable
              columns={associationColumns}
              data={tableData}
              sortingColumn={sortingColumn}
              onSortChange={setSortingColumn}
              colorScale={value => assocColorScale(typeof value === 'number' ? value : 0)}
              loading={loading}
            />
            <div className='mt-2'>
              <AssociationScoreLegend />
            </div>
          </div>
        </TabsContent>
        <TabsContent className='w-full' value='tpf'>
          <div className='flex flex-col items-center pr-12'>
            <HeatmapTable
              columns={prioritizationColumns}
              data={tableData}
              sortingColumn={sortingColumn}
              onSortChange={setSortingColumn}
              colorScale={(value, columnId) =>
                columnId === 'Association Score'
                  ? assocColorScale(typeof value === 'number' ? value : 0.1)
                  : prioritizationColorScale(typeof value === 'number' ? value : 0.1)
              }
              loading={loading}
            />
            <div className='mt-2'>
              <PrioritizationIndicatorLegend />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {/* Pagination controls */}
      <div className='flex flex-col items-center w-full mt-2 gap-2'>
        <div className='flex items-center justify-center gap-2 w-full'>
          <Button variant='outline' size='sm' onClick={() => {}} disabled={!tableData.length}>
            <ChevronLeftIcon size={18} />
          </Button>
          <span className='text-sm'>Page 1 of 3</span>
          <Button variant='outline' size='sm' onClick={() => {}} disabled={!tableData.length}>
            <ChevronRightIcon size={18} />
          </Button>
          <div className='ml-2'>
            <Select
              defaultValue='25'
              onValueChange={value => {
                // Update page size
              }}
            >
              <SelectTrigger className='w-[110px]'>
                <SelectValue placeholder='Page size' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>Show 10</SelectItem>
                <SelectItem value='25'>Show 25</SelectItem>
                <SelectItem value='100'>Show 100</SelectItem>
                <SelectItem value='500'>Show 500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
