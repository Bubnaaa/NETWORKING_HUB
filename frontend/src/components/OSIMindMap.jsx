import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, Panel, MiniMap } from '@xyflow/react';
import dagre from 'dagre';
import './OSIMindMap.css';

// Bezpečný způsob získání dagre objektu, protože Vite někdy zlobí s default exportem u CJS balíčků
const dagreInstance = dagre.graphlib ? dagre : dagre.default;

import { Handle, Position } from '@xyflow/react';

// Vlastní komponenta pro středové uzly (vrstvy), která má výstupy do všech 4 směrů
const SpineNode = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id="top" style={{ background: '#3b82f6' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#3b82f6' }} />
      <Handle type="source" position={Position.Left} id="left" style={{ background: '#3b82f6' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: '#3b82f6' }} />
      <div>{data.label}</div>
    </>
  );
};

const nodeTypes = { spine: SpineNode };

const buildGraph = (rawData, currentLevel, expandedNodes = new Set()) => {
  const newNodes = [];
  const newEdges = [];

  const SPINE_WIDTH = 350;
  const NODE_WIDTH = 220;
  const SPINE_X = 600; // Posunuto více doprava, aby levé uzly měly dost místa
  const SPINE_CENTER_X = SPINE_X + (SPINE_WIDTH / 2);
  let currentY = 50; 

  rawData.forEach((layerData) => {
    const leftChildren = [];
    const rightChildren = [];

    if (layerData.children) {
      layerData.children.forEach(child => {
        if (child.type === 'pdu' || child.type === 'hardware' || child.type === 'function') {
          leftChildren.push(child);
        } else {
          rightChildren.push(child);
        }
      });
    }

    let leftGraph = null;
    let rightGraph = null;
    let leftMinY = 0, leftMaxY = 0, leftHeight = 0;
    let rightMinY = 0, rightMaxY = 0, rightHeight = 0;

    // --- LEVÁ STRANA ---
    if (leftChildren.length > 0) {
      leftGraph = new dagreInstance.graphlib.Graph();
      leftGraph.setGraph({ rankdir: 'RL', ranksep: 120, nodesep: 60 });
      leftGraph.setDefaultEdgeLabel(() => ({}));
      // Nastavíme reálnou velikost spine nodu, aby Dagre věděl, že ho má obejít!
      leftGraph.setNode('dummy_left', { width: SPINE_WIDTH, height: 80 });

      const processLeft = (node, parentId, parentRealId) => {
        if (currentLevel === 0 && !expandedNodes.has(parentRealId)) return;
        if (currentLevel > 0 && node.level > currentLevel) return;
        
        // PDU a Funkce mají mnohem více textu, dejme jim větší box v DAGRE
        const isBig = node.type === 'function' || node.type === 'pdu';
        const nodeHeight = isBig ? 140 : 80;
        const nodeWidth = isBig ? 280 : NODE_WIDTH;
        
        leftGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        leftGraph.setEdge(parentId, node.id);
        if (node.children) node.children.forEach(c => processLeft(c, node.id, node.id));
      };

      leftChildren.forEach(child => processLeft(child, 'dummy_left', layerData.id));
      dagreInstance.layout(leftGraph);

      leftMinY = Infinity;
      leftMaxY = -Infinity;
      leftGraph.nodes().forEach(n => {
        const dNode = leftGraph.node(n);
        leftMinY = Math.min(leftMinY, dNode.y - dNode.height / 2);
        leftMaxY = Math.max(leftMaxY, dNode.y + dNode.height / 2);
      });
      leftHeight = leftMaxY - leftMinY;
    }

    // --- PRAVÁ STRANA ---
    if (rightChildren.length > 0) {
      rightGraph = new dagreInstance.graphlib.Graph();
      rightGraph.setGraph({ rankdir: 'LR', ranksep: 120, nodesep: 60 });
      rightGraph.setDefaultEdgeLabel(() => ({}));
      // Nastavíme reálnou velikost spine nodu
      rightGraph.setNode('dummy_right', { width: SPINE_WIDTH, height: 80 });

      const processRight = (node, parentId, parentRealId) => {
        if (currentLevel === 0 && !expandedNodes.has(parentRealId)) return;
        if (currentLevel > 0 && node.level > currentLevel) return;
        rightGraph.setNode(node.id, { width: NODE_WIDTH, height: 80 });
        rightGraph.setEdge(parentId, node.id);
        if (node.children) node.children.forEach(c => processRight(c, node.id, node.id));
      };

      rightChildren.forEach(child => processRight(child, 'dummy_right', layerData.id));
      dagreInstance.layout(rightGraph);

      rightMinY = Infinity;
      rightMaxY = -Infinity;
      rightGraph.nodes().forEach(n => {
        const dNode = rightGraph.node(n);
        rightMinY = Math.min(rightMinY, dNode.y - dNode.height / 2);
        rightMaxY = Math.max(rightMaxY, dNode.y + dNode.height / 2);
      });
      rightHeight = rightMaxY - rightMinY;
    }

    const layerMaxHeight = Math.max(leftHeight, rightHeight, 100);
    const spineNodeY = currentY + (layerMaxHeight / 2) - 40; // 40 je polovina výšky páteřního uzlu (80px)

    let spineLabel = layerData.label;
    let spineClass = `custom-node layer-node layer-${layerData.layerIndex}`;
    if (currentLevel === 0 && layerData.children && layerData.children.length > 0) {
      spineLabel = expandedNodes.has(layerData.id) ? `[-] ${spineLabel}` : `[+] ${spineLabel}`;
      spineClass += ' clickable-node';
    }

    newNodes.push({
      id: layerData.id,
      type: 'spine',
      data: { label: spineLabel },
      position: { x: SPINE_X, y: spineNodeY },
      className: spineClass,
    });

    if (leftGraph) {
      const processLeftNodes = (node, parentId, parentRealId) => {
        if (currentLevel === 0 && !expandedNodes.has(parentRealId)) return;
        if (currentLevel > 0 && node.level > currentLevel) return;

        let className = 'custom-node';
        if (node.type === 'pdu') className += ' pdu-node';
        else if (node.type === 'hardware') className += ' hardware-node';
        else if (node.type === 'function') className += ' function-node';
        else className += ' concept-node';

        let nodeLabel = node.label;
        let isClickable = false;
        
        if (currentLevel === 0 && node.children && node.children.length > 0) {
          nodeLabel = expandedNodes.has(node.id) ? `[-] ${nodeLabel}` : `[+] ${nodeLabel}`;
          isClickable = true;
        }
        
        if (node.description || node.image) {
          isClickable = true;
          className += ' has-popup';
        }

        if (isClickable) {
          className += ' clickable-node';
        }

        const dNode = leftGraph.node(node.id);
        const anchor = leftGraph.node('dummy_left');
        const nodeY = currentY + (dNode.y - leftMinY) - (dNode.height / 2);
        
        const isBig = node.type === 'function' || node.type === 'pdu';
        const nodeWidth = isBig ? 280 : NODE_WIDTH;

        newNodes.push({
          id: node.id,
          data: { 
            label: nodeLabel,
            description: node.description,
            image: node.image
          },
          position: { x: SPINE_CENTER_X + (dNode.x - anchor.x) - (nodeWidth / 2), y: nodeY },
          className,
          sourcePosition: 'left',
          targetPosition: 'right'
        });

        const isRootChild = parentId === 'dummy_left';
        newEdges.push({
          id: `e-L-${layerData.id}-${node.id}`,
          source: isRootChild ? layerData.id : parentId,
          target: node.id,
          type: 'smoothstep',
          sourceHandle: isRootChild ? 'left' : null,
          style: { stroke: `var(--accent-${layerData.layerIndex})`, strokeWidth: 2 }
        });

        if (node.children) node.children.forEach(c => processLeftNodes(c, node.id, node.id));
      };
      leftChildren.forEach(child => processLeftNodes(child, 'dummy_left', layerData.id));
    }

    if (rightGraph) {
      const processRightNodes = (node, parentId, parentRealId) => {
        if (currentLevel === 0 && !expandedNodes.has(parentRealId)) return;
        if (currentLevel > 0 && node.level > currentLevel) return;

        let className = 'custom-node';
        if (node.type === 'protocol') className += ' protocol-node';
        else if (node.type === 'process') className += ' process-node';
        else className += ' concept-node';

        let nodeLabel = node.label;
        let isClickable = false;
        
        if (currentLevel === 0 && node.children && node.children.length > 0) {
          nodeLabel = expandedNodes.has(node.id) ? `[-] ${nodeLabel}` : `[+] ${nodeLabel}`;
          isClickable = true;
        }
        
        if (node.description || node.image) {
          isClickable = true;
          className += ' has-popup';
        }

        if (isClickable) {
          className += ' clickable-node';
        }

        const dNode = rightGraph.node(node.id);
        const anchor = rightGraph.node('dummy_right');
        const nodeY = currentY + (dNode.y - rightMinY) - (dNode.height / 2);

        newNodes.push({
          id: node.id,
          data: { 
            label: nodeLabel,
            description: node.description,
            image: node.image
          },
          position: { x: SPINE_CENTER_X + (dNode.x - anchor.x) - (NODE_WIDTH / 2), y: nodeY },
          className,
          sourcePosition: 'right',
          targetPosition: 'left'
        });

        const isRootChild = parentId === 'dummy_right';
        newEdges.push({
          id: `e-R-${layerData.id}-${node.id}`,
          source: isRootChild ? layerData.id : parentId,
          target: node.id,
          type: 'smoothstep',
          sourceHandle: isRootChild ? 'right' : null,
          style: { stroke: `var(--accent-${layerData.layerIndex})`, strokeWidth: 2 }
        });

        if (node.children) node.children.forEach(c => processRightNodes(c, node.id, node.id));
      };
      rightChildren.forEach(child => processRightNodes(child, 'dummy_right', layerData.id));
    }

    // Bezpečná mezera mezi vrstvami, žádné překrývání!
    currentY += layerMaxHeight + 80;
  });

  for (let i = 0; i < rawData.length - 1; i++) {
    newEdges.push({
      id: `spine-${rawData[i].id}-${rawData[i+1].id}`,
      source: rawData[i].id,
      target: rawData[i+1].id,
      sourceHandle: 'bottom',
      targetHandle: 'top',
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'var(--primary)', strokeWidth: 4 }
    });
  }

  return { nodes: newNodes, edges: newEdges };
};

export default function OSIMindMap({ currentLevel }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNodeData, setSelectedNodeData] = useState(null);

  const onNodeClick = useCallback((event, node) => {
    // Rozbalovat strom šipek kliknutím chceme pouze v režimu Freemove
    if (currentLevel === 0) {
      setExpandedNodes(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
    }

    if (node.data && (node.data.description || node.data.image)) {
      setSelectedNodeData({
        label: node.data.label.replace(/^\[[+-]\]\s*/, ''), // odstranit [+] a [-]
        description: node.data.description,
        image: node.data.image
      });
    }
  }, [currentLevel]);

  useEffect(() => {
    fetch('http://localhost:3001/api/osi-model')
      .then(res => {
        if (!res.ok) throw new Error("Chyba HTTP: " + res.status);
        return res.json();
      })
      .then(data => setRawData(data))
      .catch(err => {
        console.error("Error fetching data:", err);
        setError("Nepodařilo se připojit k backendu.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!rawData) return;

    try {
      const layouted = buildGraph(rawData, currentLevel, expandedNodes);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      setLoading(false);
    } catch (err) {
      console.error("Chyba při výpočtu grafu:", err);
      setError("Při generování mapy došlo k chybě (pravděpodobně chyba Dagre).");
      setLoading(false);
    }
  }, [rawData, currentLevel, expandedNodes]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  if (loading) return <div className="loading-map">Sestavuji síťovou topologii...</div>;
  if (error) return <div className="loading-map" style={{color: 'var(--accent-1)'}}>{error}</div>;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        attributionPosition="bottom-right"
        minZoom={0.1}
      >
        <Background color="var(--text-secondary)" gap={20} size={1} />
        <Controls />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'spine') return 'var(--primary)';
            return 'var(--node-border)';
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="glass-card"
        />
        <Panel position="top-right" className="map-panel glass-card">
          Statický diagram (L1 dole, L7 nahoře). Můžete přibližovat plátno. Informace jdou do stran.
        </Panel>
      </ReactFlow>

      {selectedNodeData && (
        <div className="popup-overlay" onClick={() => setSelectedNodeData(null)}>
          <div className="popup-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setSelectedNodeData(null)}>✖</button>
            <h3>{selectedNodeData.label}</h3>
            {selectedNodeData.image && (
              <img src={selectedNodeData.image} alt={selectedNodeData.label} className="popup-image" />
            )}
            {selectedNodeData.description && (
              <div className="popup-text" dangerouslySetInnerHTML={{ __html: selectedNodeData.description.replace(/\n/g, '<br/>') }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
