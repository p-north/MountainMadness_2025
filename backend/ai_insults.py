from openai import OpenAI
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import os
from datetime import datetime
import mysql.connector
from S3_upload import upload_S3

load_dotenv()

YOUR_API_KEY = os.getenv("API_KEY_PERPLEXITY")
ELEVENLABS_API_KEY = os.getenv("API_KEY_ELEVENLABS")

async def gennerateAndUploadAudio():
    messages = [
        {
            "role": "system",
            "content": (
                "You are a mean artificial intelligence that will insult the user who is"
                "attempting to answer a difficult programming question"
            ),
        },
        {   
            "role": "user",
            "content": (
                "Roast the user who has begun answering a difficult programming question ("
                "keep the response under two sentences)"
            ),
        },
    ]

    clientEleven = ElevenLabs(
        api_key=ELEVENLABS_API_KEY,
        )

    client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

        # chat completion without streaming
    response = client.chat.completions.create(
            model="sonar-pro",
            messages=messages,
        )
    response_text = response.choices[0].message.content

    audio = clientEleven.text_to_speech.convert(
            text=response_text,
            voice_id="zcAOhNBS3c14rBihAFp1",
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
    )

    save_file_path = f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.mp3"
    with open(save_file_path, "wb") as f:
            for chunk in audio:
                if chunk:
                    f.write(chunk)
    # Upload to S3 by opening the file in binary mode and passing it to upload_S3
    with open(save_file_path, "rb") as file:
            response = await upload_S3(file, save_file_path)
        

                    
    # Delete the file after uploading to AWS S3
    os.remove(save_file_path)
         
    return response["file_url"]

 ### Add the output file to the cloud

