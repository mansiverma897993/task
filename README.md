# AI Pipeline Builder

A **visual pipeline builder for AI workflows** that allows users to construct workflows by connecting nodes in a graphical interface.

The system validates the pipeline structure on the backend to ensure it forms a **Directed Acyclic Graph (DAG)** before execution.

This project demonstrates how visual programming can simplify the creation of complex AI workflows similar to tools like **Langflow**, **n8n**, and **Zapier**.

---

# Features

- Drag-and-drop node-based workflow editor
- Connect nodes visually using edges
- Build complex AI pipelines
- Backend pipeline validation
- Cycle detection to ensure valid DAG workflows
- Modular node architecture

---

# Demo Overview

Users can:

1. Drag nodes onto the canvas
2. Connect nodes using edges
3. Build a pipeline visually
4. Submit the pipeline for backend validation

The backend parses the pipeline graph and ensures that it **does not contain circular dependencies**.

---

# Architecture
Frontend (React + ReactFlow) <br>
             │<br>
│ Pipeline JSON (nodes + edges) <br>
▼<br>
Backend (FastAPI) <br>
│<br>
│ Graph Parsing<br>
│ Cycle Detection<br>
▼<br>
Validation Result<br>


---

# Backend Overview

The backend is built using **FastAPI**, a modern Python web framework.

The API receives pipeline data from the frontend and validates the structure.

Key tasks:

- Parse nodes and edges
- Construct a graph representation
- Run cycle detection
- Ensure the pipeline is a **Directed Acyclic Graph (DAG)**

---

# Example Pipeline

Example AI workflow built using the editor:
