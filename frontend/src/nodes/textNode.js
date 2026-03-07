import { useState, useEffect } from "react"
import { useUpdateNodeInternals } from "reactflow"
import BaseNode from "./BaseNode"

export const TextNode = ({ id }) => {
  const updateNodeInternals = useUpdateNodeInternals()
  const [text, setText] = useState("")
  const [variables, setVariables] = useState([])
  const [dimensions, setDimensions] = useState({
    width: 230,
    minHeight: 110,
  })

  useEffect(() => {
    const matches = Array.from(
      text.matchAll(/\{\{\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\}\}/g)
    )
    const vars = [...new Set(matches.map((v) => v[1]))]
    setVariables(vars)
  }, [text])

  useEffect(() => {
    updateNodeInternals(id)
  }, [variables, id, updateNodeInternals])

  useEffect(() => {
    const lines = text.split("\n")
    const longestLine = lines.reduce(
      (max, line) => Math.max(max, line.length),
      0
    )

    const dynamicWidth = Math.min(460, 230 + longestLine * 6)
    const dynamicHeight = Math.min(320, 110 + lines.length * 22)

    setDimensions({
      width: dynamicWidth,
      minHeight: dynamicHeight,
    })
  }, [text])

  return (
    <BaseNode
      title="Text"
      inputs={variables.length > 0 ? variables.map((v) => `${id}-${v}`) : [`${id}-in`]}
      outputs={[`${id}-out`]}
      style={{
        minWidth: dimensions.width,
        minHeight: dimensions.minHeight,
      }}
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          minHeight: dimensions.minHeight - 70,
          resize: "none",
          borderRadius: "10px",
          padding: "8px 10px",
          fontSize: "12px",
          border: "1px solid #1f2937",
          background:
            "radial-gradient(circle at 0 0, rgba(148,163,184,0.28), transparent 55%), #020617",
          color: "#e5e7eb",
          outline: "none",
          boxShadow: "0 0 0 1px rgba(148,163,184,0.25)",
        }}
      />
    </BaseNode>
  )
}