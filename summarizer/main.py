from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer
import torch

# Model with 1024-token capacity
MODEL_NAME = "facebook/bart-large-cnn"
device = 0 if torch.cuda.is_available() else -1

# Initialize pipeline and tokenizer
summarizer = pipeline(
    "summarization",
    model=MODEL_NAME,
    device=device,
    tokenizer=MODEL_NAME
)
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

app = FastAPI()

class TextIn(BaseModel):
    text: str

@app.post("/summarize")
def summarize(input: TextIn):
    # Enforce 1024-token limit
    tokens = tokenizer.encode(input.text)
    if len(tokens) > 1024:
        raise HTTPException(
            status_code=400,
            detail=f"Input exceeds 1024 tokens (got {len(tokens)}). Trim your text."
        )

    try:
        summary = summarizer(
            input.text,
            max_length=150,  # Adjust as needed
            min_length=50,
            do_sample=False,
            truncation=True  # Force truncation to model max (1024)
        )
        return {"summary": summary[0]['summary_text']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))