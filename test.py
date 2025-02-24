import json

def parseLLMOutput(input:str):
    try:
        response = json.loads(input)
    except json.JSONDecodeError as e:
        print(e)
    print(response)
    return response

parseLLMOutput("```json\n{\n  \"jsonrpc\": \"2.0\",\n  \"method\": \"ask_clarify\",\n  \"id\": 1,\n  \"error\": {\n    \"code\": -32602,\n    \"message\": \"The action 'delete_note' is not supported.  Please specify a supported action such as 'create_note' or 'open_note'.\"\n  }\n}\n```\n")