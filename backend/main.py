from ai_insults import generateAndUploadAudio
from S3_upload import get_S3_Url
from fastapi import FastAPI, Request, HTTPException, Body
from database import get_db_connection
from models import Behaviour_LD, Audio, Leetcode_LD
from typing import List
from behavioural_q import generate_q, respond_to_answer, generate_lc
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
# Create table if it doesn't exist

@asynccontextmanager
async def lifespan(app: FastAPI):
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
        # behaviour table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS behaviourLD (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                score INT NOT NULL,
                `rank` INT
            )
        """)
        # leetcode leaderboard table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS leetcodeLD (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                score INT NOT NULL,
                `rank` INT
            )
        """)
        connection.commit()
        cursor.close()
        connection.close()
        yield

app = FastAPI(lifespan=lifespan)
# CMD: uvicorn main:app --host 0.0.0.0 --port 3000 --reload

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow only this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.post("/audio")
async def upload_audio():
    fileUrl = await generateAndUploadAudio()
    # Add the URL to the database
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = connection.cursor()
    
    # insert the URL into database
    try:
        query = "INSERT INTO audio (audio_url) VALUES(%s)"
        cursor.execute(query, (fileUrl,))
        entry_id = cursor.lastrowid
        connection.commit()
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str("Error uploading to database: ", e))
    finally:
        cursor.close()
        connection.close()
    return {"message": "File generated successfully", "file_url": fileUrl, "status":201}
    
    


# Upload to S3, then retrieve from S3
@app.get("/get-audio")
async def getAudio():
    # get the links
    fileUrl =  await get_S3_Url()
    return {"message": "File generated successfully", "fileUrl": fileUrl, "status":200}
    
    
    

@app.get("/questions/behaviour/{difficultyLevel}")
async def get_questions(difficultyLevel: str):
    return {"question": generate_q(difficultyLevel)}

@app.get("/questions/leetcode/{difficultyLevel}")
async def get_question_lc(difficultyLevel: str):
    return {"question": generate_lc(difficultyLevel)}

# Inserts new entries into behaviour
@app.post("/leaderboard/behaviour", response_model=Behaviour_LD)
def create_behaviour_leaderboard_entry(entry: Behaviour_LD):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = connection.cursor(dictionary=True)  # Use dictionary cursor for easier mapping
    
    try:
        # Insert the new entry without rank
        query = "INSERT INTO behaviourLD  (name, score) VALUES (%s, %s)"
        cursor.execute(query, (entry.name, entry.score))
        entry_id = cursor.lastrowid
        connection.commit()

        # Update ranks for all entries based on score
        update_query = """
            UPDATE behaviourLD  l
            JOIN (
                SELECT id, RANK() OVER (ORDER BY score DESC) AS new_rank
                FROM leaderboard
            ) ranked ON l.id = ranked.id
            SET l.`rank` = ranked.new_rank
        """
        cursor.execute(update_query)
        connection.commit()

        # Fetch the updated entry
        cursor.execute("SELECT * FROM behaviourLD  WHERE id = %s", (entry_id,))
        updated_entry = cursor.fetchone()
        if not updated_entry:
            raise HTTPException(status_code=404, detail="Entry not found after update")
        
        return Behaviour_LD (**updated_entry)

    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating behaviourLD entry: {str(e)}")
    
    finally:
        cursor.close()
        connection.close()
# Inserts noew entries into leetcodeLD
@app.post("/leaderboard/leetcode", response_model=Leetcode_LD)
def create_leetcode_leaderboard_entry(entry: Leetcode_LD):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = connection.cursor(dictionary=True)  # Use dictionary cursor for easier mapping
    
    try:
        # Insert the new entry without rank
        query = "INSERT INTO leetcodeLD (name, score) VALUES (%s, %s)"
        cursor.execute(query, (entry.name, entry.score))
        entry_id = cursor.lastrowid
        connection.commit()

        # Update ranks for all entries based on score
        update_query = """
            UPDATE leetcodeLD  l
            JOIN (
                SELECT id, RANK() OVER (ORDER BY score DESC) AS new_rank
                FROM leaderboard
            ) ranked ON l.id = ranked.id
            SET l.`rank` = ranked.new_rank
        """
        cursor.execute(update_query)
        connection.commit()

        # Fetch the updated entry
        cursor.execute("SELECT * FROM leetcodeLD  WHERE id = %s", (entry_id,))
        updated_entry = cursor.fetchone()
        if not updated_entry:
            raise HTTPException(status_code=404, detail="Entry not found after update")
        
        return Leetcode_LD (**updated_entry)

    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating leetcodeLD entry: {str(e)}")
    
    finally:
        cursor.close()
        connection.close()

@app.get("/leaderboard/behaviour", response_model=List[Behaviour_LD])
def get_behaviour_leaderboard():
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        # Get leaderboard ordered by score descending
        cursor.execute("SELECT * FROM behaviourLD ORDER BY score DESC")
        leaderboard = cursor.fetchall()
        return leaderboard
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        connection.close()
@app.get("/leaderboard/leetcode", response_model=List[Leetcode_LD])
def get_leetcode_leaderboard():
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        # Get leaderboard ordered by score descending
        cursor.execute("SELECT * FROM leetcodeLD ORDER BY score DESC")
        leaderboard = cursor.fetchall()
        return leaderboard
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        connection.close()

@app.post("/response")
async def get_response(request: Request):
    body = await request.json()
    answer = body.get("Answer")
    question = body.get("Question")
    return {"AI_answer": respond_to_answer(question, answer)}
