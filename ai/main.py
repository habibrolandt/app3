from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os

app = FastAPI()

class PredictRequest(BaseModel):
    message: str

@app.post("/api/predict")
async def predict(request: PredictRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for an intelligent irrigation system."},
                {"role": "user", "content": request.message}
            ]
        )
        return {"message": response.choices[0].message.content}
    except openai.error.RateLimitError:
        # Réponse de repli en cas de dépassement de quota
        return {"message": "Je suis désolé, je ne peux pas répondre pour le moment en raison de limitations techniques. Veuillez réessayer plus tard."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

