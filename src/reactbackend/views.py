import mimetypes
import logging
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import Optional
from typing import List

load_dotenv()

logger = logging.getLogger(__name__)
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

    except Exception:
        logger.exception("OCR processing failed in scan_medicine")
        return Response(
            {"error": "An internal error occurred while scanning the medicine image."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class AIInsightsResponse(BaseModel):
    observations: List[str] = Field(description="Educational observations detailing potential therapy groups or schedule overlaps based on logs.")
    suggested_questions_for_doctor: List[str] = Field(description="Actionable, safe questions to guide their next clinic visit.")
    safety_disclaimer: str = Field(description="A clear non-diagnostic statement emphasizing that this does not constitute medical advice.")

@api_view(['POST'])
def analyze_patient_history(request):
    history_records = request.data.get('history_records', [])
    
    if not history_records:
        return Response({"error": "No timeline history data provided."}, status=status.HTTP_400_BAD_REQUEST)
        
    formatted_history_text = ""
    for entry in history_records:
        formatted_history_text += (
            f"- Drug: {entry.get('name')}\n"
            f"  Active Compound: {entry.get('active_ingredient')}\n"
            f"  Manufacturer: {entry.get('manufacturer')}\n"
            f"  Dosage Profile: {entry.get('dosage')}\n"
            f"  Route: {entry.get('route')}\n"
            f"  Verification Status: {entry.get('verdict')}\n"
            f"  Scanned At: {entry.get('scannedAt')}\n\n"
        )

    system_instruction = (
        "You are an expert pharmaceutical analyst and medical education assistant. "
        "Analyze the provided list of scanned medicine packages. Highlight general education info "
        "about these classes of drugs, list any potential therapeutic overlaps (e.g., if multiple items "
        "contain paracetamol/acetaminophen), and organize items for discussion.\n"
        "CRITICAL RULE: NEVER diagnose a condition, evaluate disease states, or prescribe therapy alterations. "
        "Keep insights objective, educational, and structural."
    )
    
    prompt = f"Review this drug timeline and generate structured insights:\n\n{formatted_history_text}"

    try:
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=AIInsightsResponse,
                temperature=0.1,
            ),
        )
        
        parsed_insights = AIInsightsResponse.model_validate_json(response.text).model_dump()
        return Response(parsed_insights, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"!!! Timeline Insight Error: {str(e)}")
        return Response({"error": "Failed to analyze timeline data."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)