import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useSigma } from '@react-sigma/core';
import { useEffect, useRef, useState } from 'react';

// Define types
interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const SelectionControl: React.FC = () => {
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSelectedNodes = (selectedNodes: string[]) => {
    useStore.setState({ selectedNodes });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const canvas = sigma.getCanvases().nodes;
    canvasRef.current = canvas;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.shiftKey) {
        console.log(e);

        setIsSelecting(true);
        const camera = sigma.getCamera();
        const mousePosition = sigma.viewportToGraph({
          x: e.offsetX,
          y: e.offsetY,
        });

        setSelectionBox({
          startX: mousePosition.x,
          startY: mousePosition.y,
          endX: mousePosition.x,
          endY: mousePosition.y,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isSelecting && selectionBox) {
        const mousePosition = sigma.viewportToGraph({
          x: e.offsetX,
          y: e.offsetY,
        });

        setSelectionBox({
          ...selectionBox,
          endX: mousePosition.x,
          endY: mousePosition.y,
        });

        // Draw selection rectangle
        drawSelectionBox();

        // Find nodes within selection
        const selectedNodes = findNodesInSelection(selectionBox);
        handleSelectedNodes(selectedNodes);
      }
    };

    const handleMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
        setSelectionBox(null);

        // Clear the selection rectangle
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        sigma.refresh();
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sigma, isSelecting, selectionBox]);

  const drawSelectionBox = () => {
    if (!selectionBox || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
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
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    sigma.refresh();

    // Draw new rectangle
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(73, 156, 255, 0.8)';
    ctx.fillStyle = 'rgba(73, 156, 255, 0.2)';
    ctx.rect(Math.min(start.x, end.x), Math.min(start.y, end.y), Math.abs(end.x - start.x), Math.abs(end.y - start.y));
    ctx.stroke();
    ctx.fill();
  };

  const findNodesInSelection = (box: SelectionBox): string[] => {
    const selectedNodes: string[] = [];
    const nodes = sigma.getGraph().forEachNode(node => {
      const nodePosition = sigma.getGraph().getNodeAttributes(node);
      if (
        nodePosition.x &&
        nodePosition.y &&
        nodePosition.x >= Math.min(box.startX, box.endX) &&
        nodePosition.x <= Math.max(box.startX, box.endX) &&
        nodePosition.y >= Math.min(box.startY, box.endY) &&
        nodePosition.y <= Math.max(box.startY, box.endY)
      ) {
        selectedNodes.push(node);
      }
    });

    return selectedNodes;
  };

  return null; // This is a controller component, no UI needed
};
