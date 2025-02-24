import os
import json
from pydantic import BaseModel
from typing import Literal
import dotenv
from openai import OpenAI, pydantic_function_tool

from app.llm.prompts import AGENT_PROMPT

dotenv.load_dotenv()

API_KEY = os.getenv("LLM_KEY")

client = OpenAI(
    api_key=API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

class Action(BaseModel):
    jsonrpc: str
    action: Literal["create_note", "open_note","ask_clarify"]
    payload: str
    id: int

def invoke_agent(input:str):
    chat_completion = client.beta.chat.completions.parse(
        model="gemini-1.5-flash",
        n=1,
        messages=[
            {   
                "role":"system",
                "content":AGENT_PROMPT
            },
            {
                "role": "user",
                "content": input,
            }
        ],
        response_format=Action
    )
    print(chat_completion.choices[0].message.parsed)
    return chat_completion.choices[0].message.parsed