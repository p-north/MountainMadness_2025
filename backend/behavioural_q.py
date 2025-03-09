from openai import OpenAI

def generate_q(difficulty):
    YOUR_API_KEY = "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"

    messages = [
        {
            "role": "system",
            "content": (
                "You are an artificial intelligence designed to help those who would like to become software developers."
                "You only generate the question. Do not add anything other than the question"
                "An example of an easy question would be a question like tell me about a programming language that you like"
                "An example of a medium question would be a question like tell me about a time you had a tight schedule"
                "An example of a hard question would be a question like tell me about a time you had to communicate with a teammate"
                "who was hard to deal with"
            ),
        },
        {   
            "role": "user",
            "content": (
                f"Generate a unique and thought-provoking question based on the given difficulty level." 
                "The question should be engaging, well-structured, and suitable for critical thinking." 
                "Ensure that the question aligns question asked during technical interviews."
                "You can try being more creative."
                "Difficulty: {difficulty}"
                "Only the question should be generated, do not add aything else!"
            ),
        },
    ]

    client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

    response = client.chat.completions.create(
        model="sonar-pro",
        messages=messages,
    )

    response_text = response.choices[0].message.content
    return response_text