const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export async function submitPipeline(nodes, edges) {
  try {
    const response = await fetch(`${API_BASE}/pipelines/parse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nodes, edges }),
    });

    if (!response.ok) {
      const text = await response.text();
      let errMsg = `Backend error (${response.status})`;
      try {
        const json = JSON.parse(text);
        if (json.detail) errMsg += ": " + (Array.isArray(json.detail) ? json.detail.map((d) => d.msg || d).join(", ") : json.detail);
      } catch {
        if (text) errMsg += ": " + text.slice(0, 100);
      }
      window.alert(errMsg);
      return;
    }

    const data = await response.json();
    const message = `
Pipeline Analysis

Nodes: ${data.num_nodes}
Edges: ${data.num_edges}

Valid DAG: ${data.is_dag ? "Yes" : "No"}
`;
    window.alert(message);
  } catch (error) {
    console.error("Pipeline submission failed:", error);
    window.alert("Error connecting to backend. Is the server running at " + API_BASE + "?");
  }
}