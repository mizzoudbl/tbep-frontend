import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import type { Settings } from 'sigma/settings';
import type { NodeDisplayData, PartialButFor } from 'sigma/types';
import { drawRoundRect } from '../utils';

const TEXT_COLOR = '#000000';

/**
 * Custom hover renderer
 * @param context - The canvas 2D context in which the hover will be drawn.
 * @param data - The node data to be displayed in the hover.
 * @param settings - The settings for the hover.
 */
export function drawHover(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, 'x' | 'y' | 'size' | 'label' | 'color'>,
  settings: Settings<NodeAttributes, EdgeAttributes>,
  // sizePropertyText?: string,
  // colorPropertyText?: string,
): void {
  const size = 14;
  const font = settings.labelFont;
  const weight = settings.labelWeight;
  const subLabelSize = size - 2;
  const geneName = `Gene Name: ${data.label || ''}`;
  const geneID = `ENSG ID: ${data.ID}`;
  const description = `Description: ${data.description}`;

  // Then we draw the label background
  context.beginPath();
  context.fillStyle = '#fff';
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.shadowBlur = 8;
  context.shadowColor = '#000';

  context.font = `${weight} ${size}px ${font}`;
  const geneNameWidth = context.measureText(geneName).width;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  const geneIDWidth = geneID ? context.measureText(geneID).width : 0;
  const descriptionWidth = description ? context.measureText(description).width : 0;
  const textWidth = Math.max(geneNameWidth, geneIDWidth, descriptionWidth);

  const x = Math.round(data.x);
  const y = Math.round(data.y);
  const w = Math.round(textWidth + size / 2 + data.size + 3);
  const hGenename = Math.round(size / 2 + 4);
  const hGeneID = geneID ? Math.round(subLabelSize / 2 + 9) : 0;
  const hDescription = Math.round(subLabelSize / 2 + 9);

  drawRoundRect(context, x, y - hGeneID - 12, w, hDescription + hGenename + hGeneID + 12, 5);
  context.closePath();
  context.fill();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // And finally we draw the labels
  context.fillStyle = data.color;
  context.font = `${weight} ${size}px ${font}`;
  context.fillText(geneName, data.x + data.size + 3, data.y + size / 3);

  context.fillStyle = TEXT_COLOR;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  context.fillText(geneID, data.x + data.size + 3, data.y - (2 * size) / 3 - 2);

  context.fillText(description, data.x + data.size + 3, data.y + size / 3 + 3 + subLabelSize);
}
