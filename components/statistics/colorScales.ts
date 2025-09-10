import { scaleLinear } from 'd3-scale';

// Blue color scale for association/datasource columns
export const assocColorScale = scaleLinear<string>().domain([0.1, 1.0]).range(['#e3f0fa', '#1565c0']).clamp(true);

// Multi-stop prioritization color scale (from legend)
const prioritizationStops = [
  'rgb(160, 24, 19)',
  'rgb(188, 58, 25)',
  'rgb(214, 90, 31)',
  'rgb(224, 129, 69)',
  'rgb(227, 167, 114)',
  'rgb(230, 202, 156)',
  'rgb(236, 234, 218)',
  'rgb(197, 210, 193)',
  'rgb(158, 186, 168)',
  'rgb(120, 162, 144)',
  'rgb(82, 139, 120)',
  'rgb(47, 115, 95)',
  'rgb(46, 89, 67)',
];
const prioritizationDomain = Array.from(
  { length: prioritizationStops.length },
  (_, i) => 0.1 + (i / (prioritizationStops.length - 1)) * 0.9,
);
export const prioritizationColorScale = scaleLinear<string>()
  .domain(prioritizationDomain)
  .range(prioritizationStops)
  .clamp(true);
