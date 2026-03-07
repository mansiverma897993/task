const API_BASE = process.env.REACT_APP_API_URL || "";

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
      let errMsg = `Backend error (${response.status}). `;
      if (response.status === 500 && (text.includes("proxy") || text.includes("ECONNREFUSED"))) {
        errMsg += "Start the backend: in the backend folder run 'uvicorn main:app --reload' (or 'python -m uvicorn main:app --reload').";
      } else {
        try {
          const json = JSON.parse(text);
          if (json.detail) errMsg += Array.isArray(json.detail) ? json.detail.map((d) => d.msg || d).join(", ") : json.detail;
          else if (json.error) errMsg += json.error;
        } catch {
          if (text) errMsg += text.slice(0, 120);
        }
      }
      window.alert(errMsg);
      return;
    }

    const data = await response.json();
    let message = `Pipeline Analysis\n\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\n\nValid DAG: ${data.is_dag ? "Yes" : "No"}`;
    if (data.error) message += `\n\n(Backend note: ${data.error})`;
    window.alert(message);
  } catch (error) {
    console.error("Pipeline submission failed:", error);
    const hint = API_BASE ? " at " + API_BASE : " (run backend: uvicorn main:app --reload from backend folder)";
  window.alert("Error connecting to backend." + hint);
  }
}