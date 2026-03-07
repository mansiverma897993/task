from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    nodes:list
    edges:list


@app.get("/")
def root():
    return {"Ping":"Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline:Pipeline):

    nodes = pipeline.nodes
    edges = pipeline.edges

    num_nodes = len(nodes)
    num_edges = len(edges)

    graph = {}

    for n in nodes:
        graph[n["id"]] = []

    for e in edges:
        graph[e["source"]].append(e["target"])


    visited=set()
    stack=set()

    def dfs(node):

        if node in stack:
            return False

        if node in visited:
            return True

        visited.add(node)
        stack.add(node)

        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False

        stack.remove(node)

        return True


    is_dag=True

    for node in graph:
        if not dfs(node):
            is_dag=False
            break


    return {
        "num_nodes":num_nodes,
        "num_edges":num_edges,
        "is_dag":is_dag
    }