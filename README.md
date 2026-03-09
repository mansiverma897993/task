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
 # How to start :
#1️⃣ Clone the Repository
git clone https://github.com/<your-username>/assessment.git<br>
cd assessment<br>
#2️⃣ Run the Frontend <br>
Navigate to the frontend directory: <br>
cd frontend<br>
Install dependencies:<br>
npm install<br>
Start the React development server:<br>
npm start<br>
#The frontend will start at:
http://localhost:3000
---

#3️⃣ Run the Backend
Open a new terminal and navigate to the backend directory:
cd backend
Install backend dependencies:<br>
pip install -r requirements.txt<br>
Start the FastAPI server:<br>
python3 -m uvicorn main:app --reload<br>
The backend will start at:<br>
http://127.0.0.1:8000 <br>
Test the backend by opening: <br>
http://127.0.0.1:8000<br>

#You should see:
{"Ping":"Pong"}

# Example Pipeline

Example AI workflow built using the editor:
