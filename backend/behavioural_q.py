from google import genai
from dotenv import load_dotenv
import os
import json
import re

# Load API key from environment variables
load_dotenv()
YOUR_API_KEY = os.getenv("GEMENI_KEY")

# Initialize the Gemini client
client = genai.Client(api_key=YOUR_API_KEY)

def generate_q(difficulty):
    # Define the system message for generating a question
    messages = (
        f"You are an artificial intelligence designed to help those who would like to become software developers. "
        "You only generate the question. Do not add anything other than the question."
        f"An example of an easy question would be a question like tell me about a programming language that you like."
        f"An example of a medium question would be a question like tell me about a time you had a tight schedule."
        f"An example of a hard question would be a question like tell me about a time you had to communicate with a teammate "
        "who was hard to deal with."
        f"Difficulty: {difficulty}."
        "Only the question should be generated, do not add anything else!"
    )

    # Initialize Gemini API client
    client = genai.Client(api_key=YOUR_API_KEY)

    try:
        # Call Gemini API to generate the question
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=messages
        )
        
        response_text = response.text
        
        return response_text
    
    except Exception as e:
        # Catch any other exceptions
        return {"error": str(e)}


def generate_lc(difficulty):
    # Define the system message for LeetCode-style problem
    messages = (
        f"You are an artificial intelligence designed to help those who would like to become software developers. "
        "You only generate LeetCode-style problems. Do not add anything other than the problem structure. "
        "The problem should contain a title, description, and function signature."
        f"An example of an easy problem might involve basic array manipulation or string comparison. "
        f"An example of a medium problem might require dynamic programming or tree traversal. "
        f"An example of a hard problem might involve advanced algorithms like graph theory or advanced DP techniques."
        f"Difficulty: {difficulty}."
        "Return the problem as an object with the structure: "
        "`{ 'title': 'string', 'description': 'string', 'functionSignature': 'string' }."
        "Only return the problem structure, nothing else!"
    )


    try:
        # Call Gemini API to generate LeetCode problem
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=messages
        )
        
        response_text = response.text
        
        # Remove the code block markers from the response text
        clean_response_text = re.sub(r"```json\n|\n```", "", response_text).strip()
        
        # Parse response text into a Python dictionary
        response_dict = json.loads(clean_response_text)
        
        # Check if the necessary fields are present in the response
        if 'functionSignature' in response_dict:
            func_signature = response_dict['functionSignature']

            # Use regex to extract the input variables between the parentheses
            match = re.search(r'\((.*?)\)', func_signature)
            if match:
                # Extract only the input parameters as a string
                input_variables = match.group(1)
                response_dict['functionSignature'] = input_variables
            else:
                # If no input variables, set function signature as empty
                response_dict['functionSignature'] = ""
        
        # Return the structured JSON object directly
        return response_dict
    
    except json.JSONDecodeError:
        # Handle case if the response is not valid JSON
        return {"error": "Failed to parse response to JSON", "response": response_text}
    
    except Exception as e:
        # Catch any other exceptions
        return {"error": str(e)}



def respond_to_answer(question, answer):
    # Define the prompt for the Gemini API
    prompt = f"""
    You are an AI designed to evaluate responses to software development-related questions. 
    You will be given a question and an answer as input. Your task is to assess whether the answer is accurate, clear, and helpful. 
    Provide constructive feedback in exactly 2-3 sentences. You must return a JSON object formatted as follows:
    {{
        "feedback": "<your feedback here>", 
        "score": <integer score out of 10>
    }}. 
    Ensure the response is always a valid JSON object with these exact keys.

    Question: {question}
    Response: {answer}
    """

    # Call Gemini API to generate the response
    response = client.models.generate_content(
        model='gemini-2.0-flash', 
        contents=prompt
    )


    # Clean the response by removing any code block delimiters
    cleaned_response = response.text.strip("```json\n").strip("`")

    # Parse the cleaned response into a JSON object
    try:
        response_data = json.loads(cleaned_response)
        return response_data
    except json.JSONDecodeError as e:
        # Handle the error if JSON parsing fails
        print(f"Failed to parse response into JSON: {e}")
        return {"error": "Failed to parse response into JSON", "raw_response": response.text}


