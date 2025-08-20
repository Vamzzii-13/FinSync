# utils/gemini_client.py

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

gemini_model = genai.GenerativeModel("gemini-1.5-flash")

def generate_response_with_file(prompt, file_path):
    try:
        from pathlib import Path
        
        # Determine mime type based on file extension
        ext = Path(file_path).suffix.lower()
        if ext == '.pdf':
            mime_type = "application/pdf"
        elif ext in ['.png', '.jpg', '.jpeg']:
            mime_type = f"image/{ext[1:]}" if ext != '.jpg' else "image/jpeg"
        else:
            mime_type = "application/pdf"  # default
        
        with open(file_path, "rb") as f:
            file_data = f.read()

        parts = [
            {"mime_type": mime_type, "data": file_data},
            {"text": prompt}
        ]

        response = gemini_model.generate_content(parts)
        return response.text

    except Exception as e:
        print(f"[Gemini Client] ❌ Error in generate_response_with_file: {e}")
        return ""