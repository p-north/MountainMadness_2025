from openai import OpenAI
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import os
import mysql.connector

YOUR_API_KEY = "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"
ELEVENLABS_API_KEY = "sk_20a4e12df9eedb168742fcf5387fda80394016740a088060"

load_dotenv()

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
            "keep the response under three sentences)"
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

save_file_path = "output.mp3"
with open(save_file_path, "wb") as f:
    for chunk in audio:
        if chunk:
            f.write(chunk)

### Add the output file to the cloud

