// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Background, MiniMap, ConnectionLineType } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { submitPipeline } from './submit';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { TemplateNode } from './nodes/templateNode';
import { BranchNode } from './nodes/branchNode';
import { MemoryNode } from './nodes/memoryNode';
import { HttpNode } from './nodes/httpNode';
import { LoggerNode } from './nodes/loggerNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  template: TemplateNode,
  branch: BranchNode,
  memory: MemoryNode,
  http: HttpNode,
  logger: LoggerNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function BottomLeftPanel({ reactFlowInstance }) {
  const { nodes, edges } = useStore(
    (s) => ({ nodes: s.nodes, edges: s.edges }),
    shallow
  );
  const handleSubmit = () => submitPipeline(nodes, edges);
  if (!reactFlowInstance) return null;
  return (
    <div className="bottom-left-panel">
      <div className="zoom-controls">
        <button
          type="button"
          className="zoom-btn"
          onClick={() => reactFlowInstance.zoomIn()}
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="zoom-btn"
          onClick={() => reactFlowInstance.zoomOut()}
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          className="zoom-btn"
          onClick={() => reactFlowInstance.fitView({ padding: 0.2 })}
          title="Fit view"
          aria-label="Fit view"
        >
          ⊡
        </button>
      </div>
      <button type="button" className="submit-button" onClick={handleSubmit}>
        Submit Pipeline
      </button>
    </div>
  );
}

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const isValidConnection = useCallback((connection) => {
        if (connection.source === connection.target) return false;
        return true;
    }, []);

    return (
      <>
        <div
          ref={reactFlowWrapper}
          style={{
            width: "100vw",
            height: "100vh",
            background:
              "radial-gradient(circle at top, #0f172a, #020617 52%, #020617 100%)",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            isValidConnection={isValidConnection}
            connectOnClick={false}
            nodesConnectable={true}
            elementsSelectable={true}
            connectionLineStyle={{ stroke: 'rgba(59, 130, 246, 0.9)', strokeWidth: 2 }}
            nodeTypes={nodeTypes}
            proOptions={proOptions}
            snapGrid={[gridSize, gridSize]}
            connectionLineType={ConnectionLineType.Bezier}
            defaultEdgeOptions={{ type: 'default' }}
          >
            <Background color="#1f2937" gap={gridSize} />
            <BottomLeftPanel reactFlowInstance={reactFlowInstance} />
            <MiniMap
              style={{ backgroundColor: "rgba(15,23,42,0.95)", borderRadius: 12 }}
              nodeColor="#3b82f6"
              maskColor="rgba(15,23,42,0.55)"
            />
          </ReactFlow>
        </div>
      </>
    )
}
