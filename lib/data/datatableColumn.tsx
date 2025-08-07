import { Button } from '@/components/ui/button';
import type { Gsea, SelectedNodeProperty } from '@/lib/interface';
import type { CellContext, Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';

function headerHelper<TData>(columnName: string) {
  return ({ column }: { column: Column<TData> }) => {
    return (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {columnName}
        <ArrowUpDownIcon className='ml-2 h-4 w-4' />
      </Button>
    );
  };
}

export const columnLeidenResults: ColumnDef<Record<string, string>>[] = [
  {
    accessorKey: 'name',
    header: headerHelper('Cluster'),
    cell: ({ cell }: CellContext<Record<string, string>, string>) => (
      <div className='inline-flex gap-2 items-center'>
        <span
          className='rounded-full w-4 h-4 border'
          style={{ backgroundColor: cell.row.original.color, borderColor: cell.row.original.color }}
        />
        {cell.getValue()}
      </div>
    ),
    meta: { width: '8rem' },
  },
  {
    accessorKey: 'numberOfGenes',
    header: headerHelper('Number of Genes'),
    sortingFn: (a, b) => Number(a.original.numberOfGenes) - Number(b.original.numberOfGenes),
    meta: { textAlign: 'center' },
  },
  {
    accessorKey: 'percentage',
    header: headerHelper('Percentage'),
    sortingFn: (a, b) => Number(a.original.percentage) - Number(b.original.percentage),
    meta: { textAlign: 'center' },
  },
  {
    accessorKey: 'averageDegree',
    header: headerHelper('Average Degree'),
    sortingFn: (a, b) => Number(a.original.averageDegree) - Number(b.original.averageDegree),
    meta: { textAlign: 'center' },
  },
  {
    accessorKey: 'degreeCentralGene',
    header: headerHelper('Degree Central Gene'),
    meta: { textAlign: 'center' },
  },
  {
    accessorKey: 'genes',
    header: headerHelper('Genes'),
    meta: { wordBreak: 'break-word' },
  },
];

export const columnSelectedNodes: ColumnDef<SelectedNodeProperty>[] = [
  {
    accessorKey: 'Gene_Name',
    header: headerHelper('Gene Name'),
  },
  {
    accessorKey: 'ID',
    header: headerHelper('ENSG ID'),
  },
  {
    accessorKey: 'Description',
    header: headerHelper('Description'),
  },
];

export const columnGseaResults: ColumnDef<Gsea>[] = [
  {
    accessorKey: 'Pathway',
    header: headerHelper('Pathway'),
  },
  {
    accessorKey: 'Overlap',
    header: headerHelper('Overlap'),
  },
  {
    accessorKey: 'P-value',
    header: headerHelper('P-Value'),
    sortingFn: (a, b) => Number(a.original['P-value']) - Number(b.original['P-value']),
  },
  {
    accessorKey: 'Adjusted P-value',
    header: headerHelper('Adjusted P-Value'),
    sortingFn: (a, b) => Number(a.original['Adjusted P-value']) - Number(b.original['Adjusted P-value']),
  },
  {
    accessorKey: 'Odds Ratio',
    header: headerHelper('Odds Ratio'),
    sortingFn: (a, b) => Number(a.original['Odds Ratio']) - Number(b.original['Odds Ratio']),
  },
  {
    accessorKey: 'Combined Score',
    header: headerHelper('Combined Score'),
    sortingFn: (a, b) => Number(a.original['Combined Score']) - Number(b.original['Combined Score']),
  },
  {
    accessorKey: 'Genes',
    header: headerHelper('Genes'),
    meta: { wordBreak: 'break-word' },
  },
];

export const columnTop10ByDegree: ColumnDef<Record<string, string>>[] = [
  {
    accessorKey: 'ID',
    header: headerHelper('ENSG ID'),
  },
  {
    accessorKey: 'geneName',
    header: headerHelper('Gene Name'),
  },
  {
    accessorKey: 'description',
    header: headerHelper('Description'),
  },
  {
    accessorKey: 'degree',
    header: headerHelper('Degree'),
    sortingFn: (a, b) => Number(a.original.Degree) - Number(b.original.Degree),
    meta: { textAlign: 'center' },
  },
];

export const columnTop10ByBetweenness: ColumnDef<Record<string, string>>[] = [
  {
    accessorKey: 'ID',
    header: headerHelper('ENSG ID'),
  },
  {
    accessorKey: 'geneName',
    header: headerHelper('Gene Name'),
  },
  {
    accessorKey: 'description',
    header: headerHelper('Description'),
  },
  {
    accessorKey: 'betweenness',
    header: headerHelper('Betweenness'),
    sortingFn: (a, b) => Number(a.original.Betweenness) - Number(b.original.Betweenness),
    meta: { textAlign: 'center' },
  },
];

export const columnTop10ByCloseness: ColumnDef<Record<string, string>>[] = [
  {
    accessorKey: 'ID',
    header: headerHelper('ENSG ID'),
  },
  {
    accessorKey: 'geneName',
    header: headerHelper('Gene Name'),
  },
  {
    accessorKey: 'description',
    header: headerHelper('Description'),
  },
  {
    accessorKey: 'closeness',
    header: headerHelper('Closeness'),
    sortingFn: (a, b) => Number(a.original.Closeness) - Number(b.original.Closeness),
    meta: { textAlign: 'center' },
  },
];

export const columnTop10ByEigenvector: ColumnDef<Record<string, string>>[] = [
  {
    accessorKey: 'ID',
    header: headerHelper('ENSG ID'),
  },
  {
    accessorKey: 'geneName',
    header: headerHelper('Gene Name'),
  },
  {
    accessorKey: 'description',
    header: headerHelper('Description'),
  },
  {
    accessorKey: 'eigenvector',
    header: headerHelper('Eigenvector'),
    sortingFn: (a, b) => Number(a.original.Eigenvector) - Number(b.original.Eigenvector),
    meta: { textAlign: 'center' },
  },
];

export const columnTop10ByPageRank: ColumnDef<Record<string, string>>[] = [
  {
    accessorKey: 'ID',
    header: headerHelper('ENSG ID'),
  },
  {
    accessorKey: 'geneName',
    header: headerHelper('Gene Name'),
  },
  {
    accessorKey: 'description',
    header: headerHelper('Description'),
  },
  {
    accessorKey: 'pagerank',
    header: headerHelper('PageRank'),
    sortingFn: (a, b) => Number(a.original.PageRank) - Number(b.original.PageRank),
    meta: { textAlign: 'center' },
  },
];

const prioritizationKeys = [
  'Target in clinic',
  'Membrane protein',
  'Secreted protein',
  'Ligand binder',
  'Small molecule binder',
  'Predicted pockets',
  'Mouse ortholog identity',
  'Chemical probes',
  'Genetic constraint',
  'Mouse models',
  'Gene essentiality',
  'Known safety events',
  'Cancer driver gene',
  'Paralogues',
  'Tissue specificity',
  'Tissue distribution',
];

const datasourceKeys = [
  'GWAS associations',
  'Gene Burden',
  'ClinVar',
  'GEL PanelApp',
  'Gene2phenotype',
  'UniProt literature',
  'UniProt curated variants',
  'Orphanet',
  'ClinGen',
  'Cancer Gene Census',
  'IntOGen',
  'ClinVar (somatic)',
  'Cancer Biomarkers',
  'ChEMBL',
  'CRISPR Screens',
  'Project Score',
  'SLAPenrich',
  'PROGENy',
  'Reactome',
  'Gene signatures',
  'Europe PMC',
  'Expression Atlas',
  'IMPC',
];

export type TargetDiseaseAssociationRow = {
  target: string;
  [key: string]: string | number;
};

// Association columns: Target, overall_score, all datasources
export const associationColumns: ColumnDef<TargetDiseaseAssociationRow, string | number | undefined>[] = [
  {
    accessorKey: 'target',
    header: 'Target',
    cell: info => <span className='font-semibold'>{info.getValue()}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'Association Score',
    header: 'Association Score',
    enableSorting: true,
  },
  ...datasourceKeys.map<ColumnDef<TargetDiseaseAssociationRow, string | number | undefined>>(key => ({
    accessorKey: key,
    header: key,
    enableSorting: true,
  })),
];

// Prioritization columns: Target, overall_score, all prioritization keys
export const prioritizationColumns: ColumnDef<TargetDiseaseAssociationRow, string | number | undefined>[] = [
  {
    accessorKey: 'target',
    header: 'Target',
    cell: info => <span className='font-semibold'>{info.getValue()}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'Association Score',
    header: 'Association Score',
    enableSorting: true,
  },
  ...prioritizationKeys.map<ColumnDef<TargetDiseaseAssociationRow, string | number | undefined>>(key => ({
    accessorKey: key,
    header: key,
    enableSorting: false,
  })),
];
