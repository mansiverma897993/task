import { Handle, Position } from "reactflow"
import { motion } from "framer-motion"

export default function BaseNode({
  title,
  inputs = [],
  outputs = [],
  children,
  style = {},
  contentStyle = {},
}) {
  const baseStyle = {
    background: "linear-gradient(145deg,#020617,#111827)",
    borderRadius: "16px",
    border: "1px solid #334155",
    padding: "16px 18px",
    color: "white",
    minWidth: "210px",
    boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
    backdropFilter: "blur(10px)",
    position: "relative",
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.04, y: -2 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ ...baseStyle, ...style }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: "10px",
          textAlign: "center",
          letterSpacing: "0.08em",
          fontSize: "13px",
          textTransform: "uppercase",
          color: "#e2e8f0",
        }}
      >
        {title}
      </div>

      {inputs.map((id, i) => (
        <Handle
          key={id}
          type="target"
          position={Position.Left}
          id={id}
          style={{ top: 44 + i * 22 }}
          className="node-handle node-handle--target"
        />
      ))}

      <div style={{ ...contentStyle }}>{children}</div>

      {outputs.map((id, i) => (
        <Handle
          key={id}
          type="source"
          position={Position.Right}
          id={id}
          style={{ top: 44 + i * 22 }}
          className="node-handle node-handle--source"
        />
      ))}
    </motion.div>
  )
}