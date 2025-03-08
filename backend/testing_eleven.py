from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import os

ELEVENLABS_API_KEY = "sk_20a4e12df9eedb168742fcf5387fda80394016740a088060"

load_dotenv()

client = ElevenLabs(
  api_key=ELEVENLABS_API_KEY,
)

audio = client.text_to_speech.convert(
    text="The first move is what sets everything in motion.",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

play(audio)
