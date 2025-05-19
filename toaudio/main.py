from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from PyPDF2 import PdfReader
from gtts import gTTS
import os
import uuid

app = FastAPI()

@app.post("/pdf-to-audio/")
async def pdf_to_audio(file: UploadFile = File(...)):
    # Save uploaded PDF temporarily
    temp_pdf_path = f"temp_{uuid.uuid4().hex}.pdf"
    with open(temp_pdf_path, "wb") as f:
        f.write(await file.read())

    # Extract text from PDF
    reader = PdfReader(temp_pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    # Clean up empty or bad input
    if not text.strip():
        os.remove(temp_pdf_path)
        return {"error": "No readable text found in the PDF."}

    # Convert text to audio
    audio_filename = f"audio_{uuid.uuid4().hex}.mp3"
    tts = gTTS(text)
    tts.save(audio_filename)

    # Remove temp PDF
    os.remove(temp_pdf_path)

    return FileResponse(audio_filename, media_type="audio/mpeg", filename="output.mp3")
