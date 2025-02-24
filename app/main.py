from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
from app.llm.aiFunctions import invoke_agent

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "Everyone"}

@app.get("/agent/{query}")
def talk_to_agent(query:str):
    return {"action":invoke_agent(query)}