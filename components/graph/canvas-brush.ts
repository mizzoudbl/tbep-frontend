import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import type { SelectionBox } from '@/lib/interface/graph';
import type AbstractGraph from 'graphology-types';
import type { Sigma } from 'sigma';

/**
 * Draw selection box on the canvas
 * @param {Sigma} sigma instance of sigma from useSigma hook (same as sigma from sigma.js)
 * @param {HTMLCanvasElement} canvas canvas element (sigma-mouse layer) where rectangle needs to be drawn
 * @param {SelectionBox} selectionBox Coordinates where rectangle needs to be drawn
 * @returns null
 */
export function drawSelectionBox(
  sigma: Sigma<NodeAttributes, EdgeAttributes>,
  canvas: HTMLCanvasElement,
  selectionBox: SelectionBox,
) {
  const ctx = canvas.getContext('2d');

  if (ctx === null) return;

  // Convert graph coordinates to screen coordinates
  const start = sigma.graphToViewport({
    x: selectionBox.startX,
    y: selectionBox.startY,
  });
  const end = sigma.graphToViewport({
    x: selectionBox.endX,
    y: selectionBox.endY,
  });

  // Clear previous rectangle
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sigma.refresh();

  // Draw new rectangle
  ctx.beginPath();
  ctx.fillStyle = 'rgba(229,229,229,0.5)';
  ctx.fillRect(
    Math.min(start.x, end.x),
    Math.min(start.y, end.y),
    Math.abs(end.x - start.x),
    Math.abs(end.y - start.y),
  );
}

/**
 * Find nodes present in the selection box
 * @param {AbstractGraph} graph graphology graph instance
 * @param {SelectionBox} box SelectionBox coordinates
 * @returns Array of node keys present in the selection box
 */
export function findNodesInSelection(
  graph: AbstractGraph<NodeAttributes, EdgeAttributes>,
  box: SelectionBox,
  highlightedNodes: Set<string>,
): string[] {
  const selectedNodes: string[] = [];
  graph.forEachNode(node => {
    const nodePosition = graph.getNodeAttributes(node);
    if (
      nodePosition.x &&
      nodePosition.y &&
      nodePosition.x >= Math.min(box.startX, box.endX) &&
      nodePosition.x <= Math.max(box.startX, box.endX) &&
      nodePosition.y >= Math.min(box.startY, box.endY) &&
      nodePosition.y <= Math.max(box.startY, box.endY)
    ) {
      graph.setNodeAttribute(node, 'type', 'border');
      if (!graph.getNodeAttribute(node, 'hidden')) selectedNodes.push(node);
    } else {
      if (highlightedNodes.has(node)) return;
      graph.removeNodeAttribute(node, 'type');
      graph.removeNodeAttribute(node, 'borderColor');
    }
  });
  return selectedNodes;
}
