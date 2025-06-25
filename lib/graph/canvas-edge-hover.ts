import type { Settings } from 'sigma/settings';
import { interactionTypeMap } from '../data/graphConfig';
import type { EdgeAttributes, NodeAttributes } from '../interface';
import { drawRoundRect } from './utils';

export default function drawEdgeHover(
  context: CanvasRenderingContext2D,
  data: EdgeAttributes & { x: number; y: number },
  settings: Settings<NodeAttributes, EdgeAttributes>,
) {
  if (data.hidden) return;

  const baseFontSize = settings.edgeLabelSize || 12;
  const font = settings.edgeLabelFont || 'Inter, system-ui, sans-serif';
  const weight = settings.edgeLabelWeight || '500';

  // Prepare content based on data structure
  const hasMultipleScores = data.typeScores && Object.keys(data.typeScores).length > 1;
  const validTypeScores = data.typeScores
    ? Object.entries(data.typeScores).map(([k, v]) => ({
        label: interactionTypeMap[k] || k,
        value: Number(v).toFixed(2),
      }))
    : [];

  let headerText: string;
  let scoreLines: Array<{ label: string; value: string }> = [];

  if (hasMultipleScores) {
    headerText = `Total score: ${(data.score || 0).toFixed(2)}`;
    scoreLines = validTypeScores;
  } else {
    // Single score - show the type name if available, otherwise "Score"
    const singleType = validTypeScores[0];
    if (singleType) {
      headerText = `${singleType.label} score: ${singleType.value}`;
    } else {
      headerText = `Score: ${(data.score || 0).toFixed(2)}`;
    }
  }

  // Typography setup
  const headerFontSize = baseFontSize;
  const scoreFontSize = baseFontSize - 1;
  const lineHeight = 1.4;

  context.textAlign = 'left';
  context.textBaseline = 'top';

  // Measure content dimensions
  context.font = `${weight} ${headerFontSize}px ${font}`;
  const headerWidth = context.measureText(headerText).width;

  context.font = `400 ${scoreFontSize}px ${font}`;
  const maxScoreWidth =
    scoreLines.length > 0
      ? Math.max(...scoreLines.map(line => context.measureText(`${line.label}: ${line.value}`).width))
      : 0;

  const contentWidth = Math.max(headerWidth, maxScoreWidth);

  // Layout calculations
  const padding = 12;
  const radius = 8;
  const headerHeight = headerFontSize * lineHeight;
  const scoreHeight = scoreFontSize * lineHeight;
  const separatorHeight = hasMultipleScores ? 8 : 0;

  const totalHeight = headerHeight + separatorHeight + scoreLines.length * scoreHeight;
  const boxWidth = contentWidth + padding * 2;
  const boxHeight = totalHeight + padding * 1.2;

  // Positioning
  const x = data.x + 12;
  const y = data.y;

  // Draw shadow
  context.save();
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.shadowBlur = 8;
  context.shadowColor = 'rgba(0, 0, 0, 0.12)';

  // Main container
  context.fillStyle = '#ffffff';
  drawRoundRect(context, x, y, boxWidth, boxHeight, radius);
  context.fill();

  context.restore();

  // Subtle border
  context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  context.lineWidth = 1;
  drawRoundRect(context, x, y, boxWidth, boxHeight, radius);
  context.stroke();

  // Content rendering
  let currentY = y + padding;

  // Header text
  context.font = `${weight} ${headerFontSize}px ${font}`;
  context.fillStyle = '#1a1a1a';
  context.fillText(headerText, x + padding, currentY);
  currentY += headerHeight;

  // Separator for multiple scores
  if (hasMultipleScores && scoreLines.length > 0) {
    currentY += 4;
    context.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    context.lineWidth = 1;
    context.setLineDash([3, 2]);
    context.beginPath();
    context.moveTo(x + padding, currentY);
    context.lineTo(x + boxWidth - padding, currentY);
    context.stroke();
    context.setLineDash([]);
    currentY += 4;
  }

  // Score lines
  context.font = `400 ${scoreFontSize}px ${font}`;
  context.fillStyle = '#666666';

  for (const line of scoreLines) {
    context.fillText(`${line.label}: ${line.value}`, x + padding, currentY);
    currentY += scoreHeight;
  }
}
