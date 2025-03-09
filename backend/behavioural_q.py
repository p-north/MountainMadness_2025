from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import re

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
                f"Difficulty: {difficulty}"
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
def generate_lc(difficulty):

    messages = [
    {
        "role": "system",
        "content": (
            "You are an artificial intelligence designed to help those who would like to become software developers. "
            "You only generate LeetCode-style problems. Do not add anything other than the problem structure. "
            "The problem should contain a title, description, and function signature."
            "An example of an easy problem might involve basic array manipulation or string comparison. "
            "An example of a medium problem might require dynamic programming or tree traversal. "
            "An example of a hard problem might involve advanced algorithms like graph theory or advanced DP techniques."
        ),
    },
    {
        "role": "user",
        "content": (
            "Generate a LeetCode-style problem based on the given difficulty level. "
            "The problem should include the following keys: "
            "`title`, `description`, and `functionSignature`."
            "The problem should be engaging, well-structured, and suitable for technical interviews."
            "Ensure the problem aligns with common coding challenges."
            f"Difficulty: {difficulty} "
            "Return the problem as an object with the structure: "
            "`{ 'title': 'string', 'description': 'string', 'functionSignature': 'string' }."
            "Only return the problem structure, nothing else!"
        ),
    }
]


    client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

    response = client.chat.completions.create(
        model="sonar-pro",
        messages=messages,
    )

    response_text = response.choices[0].message.content
    try:
        # Parse response text into a Python dictionary
        response_dict = json.loads(response_text)
        
        # Extract the function signature and get only the input variables
        func_signature = response_dict['functionSignature']
        
        # Use regex to extract the input variables between the parentheses
        match = re.search(r'\((.*?)\)', func_signature)
        if match:
            # Extract only the input parameters as a string
            input_variables = match.group(1)
            response_dict['functionSignature'] = input_variables
        else:
            response_dict['functionSignature'] = ""

        return response_dict  # Return the structured JSON object directly
    except json.JSONDecodeError:
        # Handle case if the response is not valid JSON
        return {"error": "Failed to parse response to JSON"}
    
   




def respond_to_answer(question, answer):
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