from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
YOUR_API_KEY = os.getenv("API_KEY_PERPLEXITY")

def generate_q(difficulty):

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

def responsd_to_answer(question, answer):
    messages = [
        {
            "role": "system",
            "content": (
                "You are an artificial intelligence designed to help those who would like to become software developers."
                "You will be given a question and a response as input"
                "You are to evaluate whether the response was a good answer to the question"
                "You are to give a response that is thre sentences or less"
                "The responses must contain a score out of 10"
            ),
        },
        {   
            "role": "user",
            "content": (
                f"Question: {question}, response: {answer}"
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