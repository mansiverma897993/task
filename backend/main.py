import logging
from typing import Any, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    nodes: List[Any] = []
    edges: List[Any] = []


@app.get("/")
def root():
    return {"Ping":"Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    try:
        nodes = pipeline.nodes if pipeline.nodes is not None else []
        edges = pipeline.edges if pipeline.edges is not None else []

        if not isinstance(nodes, list):
            nodes = []
        if not isinstance(edges, list):
            edges = []

        num_nodes = len(nodes)
        num_edges = len(edges)

        graph = {}
        for n in nodes:
            try:
                node_id = n.get("id") if isinstance(n, dict) else getattr(n, "id", None)
                if node_id is not None:
                    graph[str(node_id)] = []
            except (TypeError, AttributeError):
                continue

        for e in edges:
            try:
                src = e.get("source") if isinstance(e, dict) else getattr(e, "source", None)
                tgt = e.get("target") if isinstance(e, dict) else getattr(e, "target", None)
                if src is None or tgt is None:
                    continue
                src, tgt = str(src), str(tgt)
                graph.setdefault(src, []).append(tgt)
                graph.setdefault(tgt, [])
            except (TypeError, AttributeError):
                continue

        visited = set()
        stack = set()

        def dfs(node):
            if node in stack:
                return False
            if node in visited:
                return True
            visited.add(node)
            stack.add(node)
            for neighbor in graph.get(node, []):
                if not dfs(neighbor):
                    return False
            stack.remove(node)
            return True

        is_dag = True
        for node in graph:
            if not dfs(node):
                is_dag = False
                break

        return {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag,
        }
    except Exception as exc:
        logger.exception("parse_pipeline failed: %s", exc)
        return {
            "num_nodes": 0,
            "num_edges": 0,
            "is_dag": False,
            "error": str(exc),
        }