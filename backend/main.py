from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import openai
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/api/analyze")
async def analyze_face(request: Request):
    data = await request.json()
    prompt = f"""
    あなたは顔のトラッキング補正AIです。
    次のランドマークが正常か判定し、ズレていれば補正案を出してください：
    {data}
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )
    return {"message": response.choices[0].message["content"]}
