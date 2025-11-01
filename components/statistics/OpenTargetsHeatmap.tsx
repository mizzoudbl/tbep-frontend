'use client';
import { useLazyQuery } from '@apollo/client/react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { associationColumns, prioritizationColumns, type TargetDiseaseAssociationRow } from '@/lib/data';
import { OPENTARGET_HEATMAP_QUERY } from '@/lib/gql';
import { useStore } from '@/lib/hooks';
import type { OpenTargetsTableData, OpenTargetsTableVariables } from '@/lib/interface';
import { type EventMessage, Events, eventEmitter, orderByStringToEnum } from '@/lib/utils';
import { AssociationScoreLegend, PrioritizationIndicatorLegend } from '../legends';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { VirtualizedCombobox } from '../VirtualizedCombobox';
import { assocColorScale, prioritizationColorScale } from './colorScales';
import { HeatmapTable } from './HeatmapTable';

export function OpenTargetsHeatmap() {
  const geneNames = useStore(state => state.geneNames);
  const geneNameToID = useStore(state => state.geneNameToID);
  const showOnlyVisible = useStore(state => state.showOnlyVisible);
  const candidatePrioritizationCutOff = useStore(state => state.radialAnalysis.candidatePrioritizationCutOff);
  const pagination = useStore(state => state.heatmapPagination);
  const sortingColumn = useStore(state => state.heatmapSortingColumn);
  const diseaseId = useStore(state => state.diseaseName);

  const geneIds = useMemo(() => geneNames.map(g => geneNameToID.get(g) ?? g).sort(), [geneNames, geneNameToID]);
  const [geneIdsToQuery, setGeneIdsToQuery] = useState<string[]>([]);
  const [selectedGeneNames, setSelectedGeneNames] = useState<Set<string>>(new Set());

  const [runQuery, { data: queryData, previousData, loading }] = useLazyQuery<
    OpenTargetsTableData,
    OpenTargetsTableVariables
  >(OPENTARGET_HEATMAP_QUERY);

  const maxPage = Math.max(
    1,
    Math.ceil(((queryData ?? previousData)?.targetDiseaseAssociationTable.totalCount ?? 0) / pagination.limit),
  );

  const tableData: TargetDiseaseAssociationRow[] =
    queryData?.targetDiseaseAssociationTable.rows.map(row => {
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: I won't write reason
  useEffect(() => {
    eventEmitter.on(Events.VISIBLE_NODES_RESULTS, (data: EventMessage[Events.VISIBLE_NODES_RESULTS]) => {
      const selectedGeneIds = new Set<string>();
      for (const geneName of selectedGeneNames) {
        const id = geneNameToID.get(geneName);
        if (id) selectedGeneIds.add(id);
      }

      const geneIdsToQuery = Array.from(
        selectedGeneIds.size ? selectedGeneIds.intersection(data.visibleNodeGeneIds) : data.visibleNodeGeneIds,
      ).sort();

      setGeneIdsToQuery(geneIdsToQuery);
      runQuery({
        variables: {
          geneIds: geneIdsToQuery,
          diseaseId,
          orderBy: orderByStringToEnum(sortingColumn),
          page: pagination,
        },
      });
    });
    return () => {
      eventEmitter.removeAllListeners(Events.VISIBLE_NODES_RESULTS);
    };
  }, [diseaseId]);

  const isFirstMount = useRef(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: I won't write reason
  useEffect(() => {
    if (!showOnlyVisible) return;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      eventEmitter.emit(Events.VISIBLE_NODES);
    }, 500);
    return () => clearTimeout(timer);
  }, [candidatePrioritizationCutOff]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: I won't write reason
  useEffect(() => {
    if (showOnlyVisible) {
      eventEmitter.emit(Events.VISIBLE_NODES);
    } else if (diseaseId && geneIds.length) {
      runQuery({
        variables: {
          geneIds,
          diseaseId,
          orderBy: orderByStringToEnum(sortingColumn),
          page: pagination,
        },
      });
      setGeneIdsToQuery(geneIds);
    }
  }, [diseaseId, geneIds]);

  const toggleOnlyVisible = (checked: CheckedState) => {
    const value = checked === true;
    useStore.setState({ showOnlyVisible: value });

    if (value) {
      eventEmitter.emit(Events.VISIBLE_NODES);
    } else {
      const geneIdsToQuery = selectedGeneNames.size
        ? Array.from(selectedGeneNames)
            .reduce<string[]>((acc, geneName) => {
              const id = geneNameToID.get(geneName);
              if (id) acc.push(id);
              return acc;
            }, [])
            .sort()
        : geneIds;
      setGeneIdsToQuery(geneIdsToQuery);

      runQuery({
        variables: {
          geneIds: geneIdsToQuery,
          diseaseId,
          orderBy: orderByStringToEnum(sortingColumn),
          page: pagination,
        },
      });
    }
  };

  const handleSearchSelection = (value: Set<string>) => {
    setSelectedGeneNames(value);
    const tmpGeneIdsToQuery = value.size
      ? Array.from(value)
          .reduce<string[]>((acc, geneName) => {
            const id = geneNameToID.get(geneName);
            if (id) acc.push(id);
            return acc;
          }, [])
          .sort()
      : geneIds;
    const updatedPagination = { ...pagination, page: 1 };
    useStore.setState({ heatmapPagination: updatedPagination });
    runQuery({
      variables: {
        geneIds: tmpGeneIdsToQuery,
        diseaseId,
        orderBy: orderByStringToEnum(sortingColumn),
        page: updatedPagination,
      },
    });
  };

  const handlePaginationChange = (next: { page: number; limit: number }) => {
    useStore.setState({ heatmapPagination: next });
    runQuery({
      variables: {
        geneIds: geneIdsToQuery,
        diseaseId,
        orderBy: orderByStringToEnum(sortingColumn),
        page: next,
      },
    });
  };

  const handleSortingChange = (columnId: string) => {
    useStore.setState({ heatmapSortingColumn: columnId });
    runQuery({
      variables: {
        geneIds: geneIdsToQuery,
        diseaseId,
        orderBy: orderByStringToEnum(columnId),
        page: pagination,
      },
    });
  };

  return (
    <div className='h-full'>
      <div className='flex items-center gap-4 p-4'>
        <div className='flex items-center gap-2 text-nowrap font-semibold'>
          <Checkbox checked={showOnlyVisible} onCheckedChange={toggleOnlyVisible} className='shrink-0' />
          Show only visible
        </div>
        <VirtualizedCombobox
          loading={geneIds.length === 0}
          data={geneNames}
          placeholder='Search genes...'
          value={selectedGeneNames}
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
              onSortChange={handleSortingChange}
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
              onSortChange={handleSortingChange}
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
      <div className='mt-2 mb-4 flex w-full items-center justify-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePaginationChange({ ...pagination, page: Math.max(pagination.page - 1, 1) })}
          disabled={pagination.page === 1 || !geneNames.length}
        >
          <ChevronLeftIcon size={18} />
        </Button>
        <span className='text-sm'>
          Page {pagination.page} of {maxPage}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePaginationChange({ ...pagination, page: Math.min(pagination.page + 1, maxPage) })}
          disabled={pagination.page >= maxPage || !geneNames.length}
        >
          <ChevronRightIcon size={18} />
        </Button>
        <div className='ml-2'>
          <Select
            defaultValue='25'
            onValueChange={value => handlePaginationChange({ page: 1, limit: Number.parseInt(value, 10) })}
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
  );
}
