from openai import OpenAI

YOUR_API_KEY = "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"

messages = [
    {
        "role": "system",
        "content": (
            "You are an artificial intelligence designed to help those who would like to become software developers"
        ),
    },
    {   
        "role": "user",
        "content": (
            "Generate a behavioural question that might be asked during a technical interview. "
            "Only the question should be generated"
        ),
    },
]

client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

response = client.chat.completions.create(
    model="sonar-pro",
    messages=messages,
)

response_text = response.choices[0].message.content
print(response_text)