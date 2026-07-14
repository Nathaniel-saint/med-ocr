
import mimetypes
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import Optional

load_dotenv()

client = genai.Client()

class MedicineData(BaseModel):
    name: Optional[str] = Field(None, description="The brand name or trade name of the medicine")
    active_ingredient: Optional[str] = Field(None, description="The chemical or active compound name")
    manufacturer: Optional[str] = Field(None, description="The pharmaceutical company that made it")
    dosage: Optional[str] = Field(None, description="The strength per unit, e.g., 500mg, 10mg/ml")
    route: Optional[str] = Field(None, description="How the medicine is taken, e.g., Oral, Topical, Injection")

@api_view(['POST'])
def scan_medicine(request):
    if 'file' not in request.FILES:
        return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
    uploaded_file = request.FILES['file']
    
    try:
        image_bytes = uploaded_file.read()
        mime_type = uploaded_file.content_type or "image/jpeg"
        
        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type,
        )

        prompt = "Perform high-accuracy OCR on this medicine package and extract the required structured data."

        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=[image_part, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=MedicineData,
                temperature=0.1,
            ),
        )
        
        parsed_data = MedicineData.model_validate_json(response.text).model_dump()
        
        return Response(parsed_data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"!!! OCR Error Breakdown: {str(e)}") 
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)