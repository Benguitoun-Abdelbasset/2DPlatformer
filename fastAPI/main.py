from fastapi import FastAPI

app = FastAPI()

@app.get("/test")
def test_endpoint():
    return {"message": "Hello from FastAPI!", "status": "success"}

@app.post("/process")
def process_data(data: dict):
    return {
        "message": "Data processed successfully",
        "received_data": data,
        "processed_by": "FastAPI"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)