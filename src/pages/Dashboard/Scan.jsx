import React from "react";
import { useOutletContext } from "react-router-dom";
import { useState, useRef } from 'react';
import { AiFillPicture } from "react-icons/ai";
import '../../styles/Scan.css';
// import goes up there
const REGISTERED_DRUGS_DB = [
  {
    brandName: "Amoxicillin",
    activeIngredient: "Amoxicillin Trihydrate",
    manufacturer: "Kinapharma Ltd",
    dosage: "500mg"
  },
  {
    brandName: "Paracetamol",
    activeIngredient: "Acetaminophen",
    manufacturer: "M&G Pharmaceuticals",
    dosage: "500mg"
  },
  {
    brandName: "Artesunate",
    activeIngredient: "Artesunate 50mg / Amodiaquine 153mg",
    manufacturer: "Danadams Pharmaceuticals",
    dosage: "Composite"
  },
  {
    brandName: "Wormplex",
    activeIngredient: "Albendazole",
    manufacturer: "Pharma Nova Ltd",
    dosage: "400mg"
  },
  {
    brandName: "Gebedol",
    activeIngredient: "Paracetamol 325mg / Diclofenac Potassium 50mg / Caffeine 30mg",
    manufacturer: "Gokals Laborex Ltd",
    dosage: "Composite"
  },
  {
    brandName: "Koflyn",
    activeIngredient: "Diphenhydramine HCl / Ammonium Chloride / Sodium Citrate",
    manufacturer: "Kinapharma Ltd",
    dosage: "Composite"
  },
  {
    brandName: "Lonart",
    activeIngredient: "Artemether 20mg / Lumefantrine 120mg",
    manufacturer: "Bliss GVS Pharma Ltd",
    dosage: "Composite"
  },
  {
    brandName: "Cipro-Med",
    activeIngredient: "Ciprofloxacin",
    manufacturer: "Medreich Ltd",
    dosage: "500mg"
  },
  {
    brandName: "Ganda Plus",
    activeIngredient: "Metronidazole",
    manufacturer: "Ernest Chemists Ltd",
    dosage: "400mg"
  },
  {
    brandName: "Zinnat",
    activeIngredient: "Cefuroxime Axetil",
    manufacturer: "GlaxoSmithKline",
    dosage: "250mg"
  },
  {
    brandName: "Amlodipine",
    activeIngredient: "Amlodipine Besylate",
    manufacturer: "Letap Pharmaceuticals Ltd",
    dosage: "5mg"
  },
  {
    brandName: "Metformin",
    activeIngredient: "Metformin Hydrochloride",
    manufacturer: "M&G Pharmaceuticals",
    dosage: "500mg"
  },
  {
    brandName: "Ventolin",
    activeIngredient: "Salbutamol",
    manufacturer: "GlaxoSmithKline",
    dosage: "100mcg/dose"
  }
];

function Scan() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [medicineData, setMedicineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [verdict, setVerdict] = useState(null)
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); 
      setMedicineData(null);
      setError('');
    }
  };

  const startCamera = async () => {
    setImagePreview(null);
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch (err) {
      console.error("Camera access denied or unavailable:", err);
      setError("Unable to open camera. Please check your browser's permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const fileFromCanvas = new File([blob], "captured_medicine.jpg", { type: "image/jpeg" });
        setSelectedFile(fileFromCanvas);
        setImagePreview(URL.createObjectURL(fileFromCanvas));
      }
    }, "image/jpeg");

    stopCamera();
};

const handleScanClick = async () => {
  if (!selectedFile) {
    setError('Please choose a medicine package image or take a photo first.');
    return;
  }

  const allowedFileExt = ["jpg", "jpeg", "png", "webp", "bmp", "heic", "heif", "avif"];
  const fileExt = selectedFile.name.split(".").pop().toLowerCase();

  if (!allowedFileExt.includes(fileExt)) {
    setError('Invalid format. Accepted filetypes include: jpg, jpeg, png, webp');
    return;
  }

  setLoading(true);
  setError('');
  setVerdict(null);

  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    const response = await fetch('http://localhost:8000/api/scan-medicine/', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Server returned an error. Check backend logs.');
    }

    const data = await response.json();
    setMedicineData(data);

    let finalStatus = "UNREGISTERED";
    let finalMessage = "Warning: This product is not found in the registered medicine database list.";

    const scannedNames = data.name?.toLowerCase().trim() || "";
    const scannedManufacturer = data.manufacturer?.toLowerCase().trim() || "";

    if (scannedNames|| scannedManufacturer) {
      const matchedDrug = REGISTERED_DRUGS_DB.find((drug) =>{
        const baseDB = drug.brandName.toLowerCase().trim();

        return scannedNames && (scannedNames.includes(baseDB) || baseDB.includes(scannedNames));
      });

      if (matchedDrug) {
        finalStatus = "REGISTERED";
        finalMessage = `Verified: This product matches a registered entry by ${matchedDrug.manufacturer}.`;
      }
    } else {
      finalMessage = "Could not safely determine the brand name from the scan profile.";
    }

    setVerdict({
      status: finalStatus,
      message: finalMessage,
    });

  
    const rawHistory = localStorage.getItem('medicine_history');
    const historyArray = rawHistory ? JSON.parse(rawHistory) : [];

    const newEntry = {
      id: Date.now(),
      name: data.name || 'Unknown Medicine',
      active_ingredient: data.active_ingredient || 'Not found',
      manufacturer: data.manufacturer || 'Not found',
      dosage: data.dosage || 'Not found',
      route: data.route || 'Not found',
      verdict: finalStatus,
      scannedAt: new Date().toLocaleString(),
    };

    historyArray.unshift(newEntry); 
    localStorage.setItem('medicine_history', JSON.stringify(historyArray));

  } catch (err) {
    setError(err.message || 'Something went wrong during the scan.');
  } finally {
    setLoading(false);
  }
};


return (
  <div className="scanner-container">
    <div className="image-scan">

        <h2 className="scanner-title">Medicine OCR Scanner</h2>
        
        <div className="medi-placeholder">
            {isCameraActive ? (
                <div className="camera-view">
                    <video ref={videoRef} autoPlay playsInline className="video-stream" />
                    <div className="camera-controls">
                        <button onClick={capturePhoto} className="btn btn-capture">Capture Snap</button>
                        <button onClick={stopCamera} className="btn btn-cancel">Cancel Camera</button>
                    </div>
                </div>
            ) : imagePreview ? (
                <div className="preview-view">
                    <p className="preview-label">Selected Image Preview:</p>
                    <img src={imagePreview} alt="Medicine preview" className="image-preview" />
                </div>
            ) : (
                <div className="empty-placeholder-text">
                    No image selected or camera active
                </div>
            )}
        </div>

        <div className="input-controls">
        <input type="file" id="file-upload" accept="image/*" onChange={handleFileChange} className="file-input" />
        <label htmlFor="file-upload" className="btn btn-upload">Choose File<AiFillPicture /></label>
        
        {!isCameraActive && (
            <button onClick={startCamera} className="btn btn-camera">Open Device Camera</button>
        )}
        </div>

        <button 
        onClick={handleScanClick} 
        disabled={loading || !selectedFile} 
        className={`btn btn-submit ${loading ? 'btn-loading' : ''}`}
        >
        {loading ? 'Scanning via AI...' : 'Scan Package'}
        </button>
    </div>

      <div className="results-wrapper">
                
         {!verdict &&( <p className="result-placeholder-text">Result Placeholder</p>)}
            {medicineData && (
                <div className="data-card">
                <h3 className="card-title">Extracted Information</h3>
                <ul className="info-list">
                    <li className="info-item"><strong>Name:</strong> {medicineData.name || 'Not found'}</li>
                    <li className="info-item"><strong>Active Ingredient:</strong> {medicineData.active_ingredient || 'Not found'}</li>
                    <li className="info-item"><strong>Manufacturer:</strong> {medicineData.manufacturer || 'Not found'}</li>
                    <li className="info-item"><strong>Dosage:</strong> {medicineData.dosage || 'Not found'}</li>
                    <li className="info-item"><strong>Route of Administration:</strong> {medicineData.route || 'Not found'}</li>
                </ul>
                </div>
            )}

            {verdict && (
                <div className={`verdict-card ${verdict.status.toLowerCase()}`}>
                <h3 className="card-title">Database Verification Status</h3>
                <p className="verdict-status">
                    <strong>Status:</strong>{' '}
                    <span className="status-badge">{verdict.status}</span>
                </p>
                <p className="verdict-message">{verdict.message}</p>
                </div>
            )}
            
        </div>
  </div>
);
}
export default Scan;