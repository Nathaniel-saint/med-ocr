import React , {useState}from "react";
import { useOutletContext } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import '../../styles/History.css'
// import goes up there

function History(){
    const raw_history = localStorage.getItem('medicine_history');
    const history = raw_history ? JSON.parse(raw_history) : [];

    const [searchQuery, setSearchQuery] = useState("");

    const sumHistory = history.map((item)=>{
        return{
        id: item.id,
        brandName: item.name || 'Unknown Brand',
        manufacturer: item.manufacturer || 'Unknown Manufacturer',
        time: item.scannedAt ||'Time Unavailable',
        verdict: item.verdict,
        }
    });

    const filteredHistory = sumHistory.filter((item)=>{
    const query = searchQuery.trim().toLowerCase();
    
        return (
            item.brandName.toLowerCase().includes(query) ||
            item.manufacturer.toLowerCase().includes(query)
        );
    });

    return(
        <div className="table-container">
            <div className="search-container">
                <label>Search <CiSearch size="1.2em"/></label>
                <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="search by name or manufacturer..." />
            </div>
            <div className="table-cont">

            <table className="table">
                <thead className="table-head">
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>MANUFACTURER</th>
                        <th>STATUS</th>
                        <th>TIME</th>
                    </tr>
                </thead>
                <tbody className="tbody">
                    {filteredHistory.length===0?
                    <tr>
                        <td colSpan={5} className="empty-table-alert">
                            {searchQuery ? "No matching records found." : "No scanned medicine yet."}
                        </td>
                    </tr>
                        :(filteredHistory.map((item, index)=>
                        <tr key={item.id}>
                            <td>{index+1}</td>
                            <td>{item.brandName}</td>
                            <td>{item.manufacturer}</td>
                            <td>
                                <span className={`status-badge ${item.verdict?.toLowerCase()}`}>
                                    {item.verdict}
                                </span>
                            </td>
                            <td>{item.time}</td>
                        </tr>
                        )
                    )}
                </tbody>
            </table>
            </div>

        </div>
    );
}


export default History;