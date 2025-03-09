from fastapi import FastAPI, Body
from database import get_db_connection
from models import Leaderboard, Audio
from typing import List
from ai_insults import gennerateAndUploadAudio
from S3_upload import get_S3_Url


app = FastAPI()

# Create table if it doesn't exist
@app.on_event("startup")
def startup():
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        # audio table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audio (
                id INT AUTO_INCREMENT PRIMARY KEY,
                audio_url VARCHAR(255) NOT NULL
            )
        """)
        # leaderboard table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                score INT NOT NULL,
                `rank` INT
            )
        """)
        connection.commit()
        cursor.close()
        connection.close()



@app.get("/")
def root():
    return {"message": "Hello World"}

@app.post("/upload-audio")
async def upload_audio():
    fileUrl = await gennerateAndUploadAudio()
    return {"message": "File generated successfully", "file_url": fileUrl, "status":201}
    
    

# Upload to S3, then retrieve from S3
@app.get("/get-audio")
async def getAudio(fileName: str = Body(...)):
    fileUrl = get_S3_Url(fileName)
    return {"message": "File generated successfully", "file_url": fileUrl, "status":200}
    
    
    
    

# CMD: uvicorn main:app --host 0.0.0.0 --port 5000 --reload