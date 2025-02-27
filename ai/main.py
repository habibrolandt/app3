from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

app = FastAPI()

class PredictRequest(BaseModel):
    prompt: str
    userMessage: str

@app.post("/api/predict")
async def predict(request: PredictRequest):
    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        if not openai.api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not found")

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": request.prompt},
                {"role": "user", "content": request.userMessage},
            ],
            max_tokens=150,
        )
        return {"message": response.choices[0].message['content'].strip()}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))