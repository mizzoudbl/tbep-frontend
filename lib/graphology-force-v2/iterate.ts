import { type QuadtreeInternalNode, type QuadtreeLeaf, quadtree } from 'd3-quadtree';
import type AbstractGraph from 'graphology-types';
import type { EdgeAttributes, NodeAttributes } from '../interface';
import type { NodeStates, State } from './ForceSupervisor';
import type { WorkerLayoutForceSettings } from './hook';
import { jiggle, lcgRandom } from './utils';

export function forceIterate(
  graph: AbstractGraph<NodeAttributes, EdgeAttributes>,
  settings: Required<WorkerLayoutForceSettings>,
  nodeStates: NodeStates,
) {
  settings.alpha += (settings.alphaTarget - settings.alpha) * settings.alphaDecay;

  let state: State;
  const random = lcgRandom();
  {
    // Center of the graph
    const cx = 0;
    const cy = 0;

    // Sum of x and y for center force
    let sx = 0,
      sy = 0;
    // Iterate over each node in the graph [Test: Whether keeping an array will be good or not as it's from a map]
    graph.forEachNode((node, attr) => {
      state = nodeStates[node] ?? {
        x: attr.x ?? 0,
        y: attr.y ?? 0,
        vx: 0,
        vy: 0,
      };
      (sx += state.x), (sy += state.y);
      nodeStates[node] = state;
    });

    // Apply various forces on the nodes
    // 1. Apply Centering Force
    (sx = (sx / graph.order - cx) * settings.centeringForce), (sy = (sy / graph.order - cy) * settings.centeringForce);
    for (const node in nodeStates) {
      const state = nodeStates[node];
      state.x -= sx;
      state.y -= sy;
    }
  }

  // 2. Apply Collide Force
  {
    const tree = quadtree<State>(
      Object.values(nodeStates).map((d, idx) => ({ ...d, index: idx })),
      d => d.x + d.vx,
      d => d.y + d.vy,
    );

    tree.visitAfter(quad => {
      if (quad.length) {
        for (let i = 0; i < 4; i++) {
          if (
            quad[i] &&
            (quad[i] as QuadtreeInternalNode<State> & { r: number }).r >
              (quad as QuadtreeInternalNode<State> & { r: number }).r
          ) {
            (quad as QuadtreeInternalNode<State> & { r: number }).r = (
              quad[i] as QuadtreeInternalNode<State> & { r: number }
            ).r;
          }
        }
      } else {
        return ((quad as QuadtreeLeaf<State> & { r: number }).r = settings.collideRadius);
      }
    });
    let xi: number, yi: number, rj: number, r: number, x: number, y: number, l: number;
    const collideRadius2 = settings.collideRadius * settings.collideRadius;

    for (const node in nodeStates) {
      state = nodeStates[node];
      xi = state.x + state.vx;
      yi = state.y + state.vy;
      tree.visit((quad, x1, y1, x2, y2) => {
        (rj = (quad as QuadtreeLeaf<State> & { r: number }).r), (r = settings.collideRadius + rj);
        if (!quad.length) {
          if (quad.data.index! > state.index!) {
            x = xi - quad.data.x - (quad as QuadtreeLeaf<State>).data.vx;
            y = yi - quad.data.y - (quad as QuadtreeLeaf<State>).data.vy;
            l = x * x + y * y;
            if (l < r * r) {
              if (x === 0) (x = jiggle(random)), (l += x * x);
              if (y === 0) (y = jiggle(random)), (l += y * y);
              l = ((r - (l = Math.sqrt(l))) / l) * settings.collideForce;
              state.vx += (x *= l) * (r = (rj *= rj) / (collideRadius2 + rj));
              state.vy += (y *= l) * r;
              quad.data.vx -= x * (r = 1 - r);
              quad.data.vy -= y * r;
            }
          }
          return;
        }
        return x1 > xi + r || x2 < xi - r || y1 > yi + r || y2 < yi - r;
      });
    }
  }

  // 3. Apply Link Force
  {
    let bias: number,
      x: number,
      y: number,
      l: number,
      srcDegree: number,
      tgtDegree: number,
      srcState: State,
      tgtState: State;
    graph.forEachEdge((__, _, source, target) => {
      (srcState = nodeStates[source]), (srcDegree = graph.degree(source));
      (tgtState = nodeStates[target]), (tgtDegree = graph.degree(target));

      x = tgtState.x + tgtState.vx - srcState.x - srcState.vx || jiggle(random);
      y = tgtState.y + tgtState.vy - srcState.y - srcState.vy || jiggle(random);
      l = Math.sqrt(x * x + y * y);
      // linkForce = 1 / Math.min(srcDegree, tgtDegree)
      l = ((l - settings.linkDistance) / l) * settings.alpha * (1 / Math.min(srcDegree, tgtDegree)); // Maybe only indegree or outdegree to be calculated
      (x *= l), (y *= l);
      tgtState.vx -= x * (bias = srcDegree / (srcDegree + tgtDegree));
      tgtState.vy -= y * bias;
      srcState.vx += x * (bias = 1 - bias);
      srcState.vy += y * bias;
    });
  }

  // // 4. Apply Many Body Force
  // {
  //   let xi: number, yi: number, xj: number, yj: number, l: number, q: number, k: number, x: number, y: number;
  //   const tree = quadtree<State>(
  //     Object.values(nodeStates),
  //     d => d.x,
  //     d => d.y,
  //   ).visitAfter(quad => {
  //     let strength = 0,
  //       weight = 0,
  //       q: QuadtreeInternalNode<State> | QuadtreeLeaf<State> | undefined,
  //       c: number,
  //       x = 0,
  //       y = 0;
  //     if (quad.length) {
  //       for (let i = 0; i < 4; i++) {
  //         if ((q = quad[i]) && (c = Math.abs((quad as QuadtreeInternalNode<State> & { value: number }).value))) {
  //           (strength += (q as QuadtreeInternalNode<State> & { value: number }).value),
  //             (weight += c),
  //             (x += c * (q as QuadtreeInternalNode<State> & { x: number }).x),
  //             (y += c * (q as QuadtreeInternalNode<State> & { y: number }).y);
  //         }
  //       }
  //       (quad as QuadtreeInternalNode<State> & { x: number }).x = x / weight;
  //       (quad as QuadtreeInternalNode<State> & { y: number }).y = y / weight;
  //     } else {
  //       q = quad;
  //       (quad as QuadtreeLeaf<State> & { x: number }).x = (quad as QuadtreeLeaf<State>).data.x;
  //       (quad as QuadtreeLeaf<State> & { y: number }).y = (quad as QuadtreeLeaf<State>).data.y;
  //       do strength += settings.chargeStrength;
  //       while ((q = (q as QuadtreeLeaf<State>).next));
  //     }
  //     (quad as QuadtreeInternalNode<State> & { value: number }).value = strength;
  //   });

  //   for (const node in nodeStates) {
  //     state = nodeStates[node];
  //     tree.visit((quad, x1, _, x2) => {
  //       if (!(quad as QuadtreeInternalNode<State> & { value: number }).value) return true;
  //       let x = (quad as QuadtreeInternalNode<State> & { x: number }).x - state.x,
  //         y = (quad as QuadtreeInternalNode<State> & { y: number }).y - state.y,
  //         l = x * x + y * y,
  //         w = x2 - x1;

  //       // Barnes-Hut criterion
  //       if ((w * w) / settings.theta2 < l) {
  //         if (l < settings.distanceMax2) {
  //           if (x === 0) (x = jiggle(random)), (l += x * x);
  //           if (y === 0) (y = jiggle(random)), (l += y * y);
  //           if (l < settings.distanceMin2) l = Math.sqrt(settings.distanceMin2 * l);
  //           state.vx += (x * (quad as QuadtreeInternalNode<State> & { value: number }).value * settings.alpha) / l;
  //           state.vy += (y * (quad as QuadtreeInternalNode<State> & { value: number }).value * settings.alpha) / l;
  //         }
  //         return true;
  //       }
  //       if (quad.length || l >= settings.distanceMax2) return;
  //       if (quad.data !== state || quad.next) {
  //         if (x === 0) (x = jiggle(random)), (l += x * x);
  //         if (y === 0) (y = jiggle(random)), (l += y * y);
  //         if (l < settings.distanceMin2) l = Math.sqrt(settings.distanceMin2 * l);
  //       }
  //       do
  //         if (!quad.length && quad.data !== state) {
  //           w = (settings.chargeStrength * settings.alpha) / l;
  //           state.vx += x * w;
  //           state.vy += y * w;
  //         }
  //       while ((quad = (quad as QuadtreeLeaf<State>).next as QuadtreeInternalNode<State> | QuadtreeLeaf<State>));
  //     });
  //   }
  // }

  // // 5. Apply Radial Force
  // {
  //   let dx: number,
  //     dy: number,
  //     l: number,
  //     r: number,
  //     k: number,
  //     x = 0,
  //     y = 0;
  //   for (const node in nodeStates) {
  //     state = nodeStates[node];
  //     (dx = state.x - x || 1e-6), (dy = state.y - y || 1e-6);
  //     r = Math.sqrt(dx * dx + dy * dy);
  //     k = ((settings.radialRadius - r) * settings.radialStrength * settings.alpha) / r;
  //     state.vx += dx * k;
  //     state.vy += dy * k;
  //   }
  // }

  // // 6. Position Forces
  // for (const node in nodeStates) {
  //   state = nodeStates[node];
  //   state.vx += (0 - state.x) * 0.1 * settings.alpha;
  //   state.vy += (0 - state.y) * 0.1 * settings.alpha;
  // }
}
