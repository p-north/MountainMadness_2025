import boto3
from fastapi import File, UploadFile
from botocore.exceptions import NoCredentialsError
from boto3 import logging

# boto3.set_stream_logger(name="botocore", level=logging.DEBUG)

s3_client = boto3.client('s3', region_name='us-east-1')

BUCKET_NAME = 'minesweep-audio-bucket-2025'
async def upload_S3(file, file_name):
    try:
        
        # upload the file to S3
        s3_client.upload_fileobj(file, BUCKET_NAME, file_name)

        print("uploaded to s3")
        
        # Generate the URL
        file_url = f"https://{BUCKET_NAME}.s3.{s3_client.meta.region_name}.amazonaws.com/{file_name}"
        
        print("file url generated after upload")
        
        return {"message": "File uploaded successfully", "file_url": file_url}
    except NoCredentialsError:
        return{"error":"credentials not available"}
    
async def get_S3_Url(file_name):
    try:
        
        # Generate the URL
        file_url = f"https://{BUCKET_NAME}.s3.{s3_client.meta.region_name}.amazonaws.com/{file_name}"

        print("File Url generated from get_url function")
        
        return {"file_url": file_url}
    except NoCredentialsError:
        return{"error":"credentials not available"}
       
        