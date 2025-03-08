from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World"}

# CMD: uvicorn main:app --host 0.0.0.0 --port 5000 --reload


