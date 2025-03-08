from openai import OpenAI

YOUR_API_KEY = "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"

messages = [
    {
        "role": "system",
        "content": (
            "You are an artificial intelligence assistant and you need to "
            "engage in a helpful, detailed, polite conversation with a user."
        ),
    },
    {   
        "role": "user",
        "content": (
            "What is a hackathon?"
        ),
    },
]

client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

# chat completion without streaming
response = client.chat.completions.create(
    model="sonar-pro",
    messages=messages,
)
print(response.choices[0].message.content)

# chat completion with streaming
response_stream = client.chat.completions.create(
    model="sonar-pro",
    messages=messages,
    stream=True,
)
for response in response_stream:
    print(response.choices[0].message.content)

