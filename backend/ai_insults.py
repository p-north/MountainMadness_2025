from openai import OpenAI
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
import os
from datetime import datetime
from S3_upload import upload_S3  # Ensure this exists and works

load_dotenv()

YOUR_API_KEY = os.getenv("API_KEY_PERPLEXITY")
ELEVENLABS_API_KEY = os.getenv("API_KEY_ELEVENLABS")

async def generateAndUploadAudio():
    messages = [
        {
            "role": "system",
            "content": (
                "You are a mean artificial intelligence that will insult the user who is"
                " attempting to answer a difficult programming question"
            ),
        },
        {   
            "role": "user",
            "content": (
                "Roast the user who has begun answering a difficult programming question "
                "(keep the response under two sentences)"
            ),
        },
    ]

    # Initialize ElevenLabs API client
    clientEleven = ElevenLabs(
        api_key=ELEVENLABS_API_KEY,
    )

    # Initialize OpenAI client with your API key
    client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")
    print(YOUR_API_KEY)
    print(client.api_key)

    # Chat completion request
    response = client.chat.completions.create(
        model="sonar-pro",
        messages=messages,
    )
    
    # Extract text from OpenAI response
    response_text = response['choices'][0]['text']  # Adjusted to match expected response structure
    print(response_text)

    # Convert the text to speech using ElevenLabs
    audio = clientEleven.text_to_speech.convert(
        text=response_text,
        voice_id="zcAOhNBS3c14rBihAFp1",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )

    # Save audio to a file
    save_file_path = f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.mp3"
    with open(save_file_path, "wb") as f:
        for chunk in audio:
            if chunk:
                f.write(chunk)

    # Upload the file to S3
    with open(save_file_path, "rb") as file:
        response = await upload_S3(file, save_file_path)
    
    # Delete the file after uploading to AWS S3
    os.remove(save_file_path)
    
    return response["file_url"]

# Call the async function if necessary, for example, in an async event loop
# asyncio.run(generateAndUploadAudio())  # Uncomment this if needed
