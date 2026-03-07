// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ConnectionLineType } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
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
            nodeTypes={nodeTypes}
            proOptions={proOptions}
            snapGrid={[gridSize, gridSize]}
            connectionLineType={ConnectionLineType.Bezier}
            defaultEdgeOptions={{ type: 'default' }}
          >
            <Background color="#1f2937" gap={gridSize} />
            <Controls position="bottom-left" />
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
