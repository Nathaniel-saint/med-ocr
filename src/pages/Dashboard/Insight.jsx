import React, { useState } from "react";
import '../../styles/Insight.css';

function Insight() {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const raw_history = localStorage.getItem('medicine_history');
    const historyList = raw_history ? JSON.parse(raw_history) : [];

    const handleGenerateInsights = async () => {
        if (historyList.length === 0) {
            setError("Your medicine log history is completely empty. Scan a package file first to provide AI context.");
            return;
        }

        setLoading(true);
        setError("");
        setInsights(null);

        try {
            const response = await fetch("http://localhost:8000/api/analyze-history/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ history_records: historyList }),
            });

            if (!response.ok) {
                throw new Error("Failed to process profile data. Check your backend server logs.");
            }

            const data = await response.json();
            setInsights(data);
        } catch (err) {
            setError(err.message || "An error occurred while generating insights.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="insight-container">
            <h2 className="insight-title">Automatic Medication Timeline Insights</h2>
            <p className="insight-subtitle">
                The AI will analyze your <strong>{historyList.length}</strong> logged package scans to synthesize clinical observations and preparation items for your next physician encounter.
            </p>

            <button 
                onClick={handleGenerateInsights} 
                disabled={loading || historyList.length === 0} 
                className={`insight-btn ${loading ? 'btn-loading' : ''}`}
            >
                {loading ? "Analyzing Scan Ledger..." : "Generate History Insights"}
            </button>
            
            {insights && (
                <div className="insights-results-wrapper">
                    
                    <div className="safety-disclaimer-banner">
                        <h5>Medical Disclaimer</h5>
                        <p>{insights.safety_disclaimer}</p>
                    </div>

                    <div className="insight-card">
                        <h3>Educational History Observations</h3>
                        <ul className="insight-list">
                            {insights.observations.map((obs, idx) => (
                                <li key={idx}>{obs}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="insight-card doctor-prep">
                        <h3>Suggested Questions for Your Physician</h3>
                        <ul className="insight-list">
                            {insights.suggested_questions_for_doctor.map((quest, idx) => (
                                <li key={idx} className="question-item">{quest}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Insight;