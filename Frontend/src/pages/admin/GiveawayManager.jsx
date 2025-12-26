import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API_HOST from '../../config';
import '../../styles/DiscountManager.css'; // Reuse table styles

const GiveawayManager = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [winner, setWinner] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_HOST}/api/giveaway/entries`, {
                headers: { 'Authorization': token }
            });
            const data = await response.json();
            if (response.ok) {
                setEntries(data);
                // Check if there's already a winner
                const existingWinner = data.find(e => e.isWinner);
                if (existingWinner) setWinner(existingWinner);
            }
        } catch (error) {
            console.error("Error fetching entries:", error);
        } finally {
            setLoading(false);
        }
    };

    const pickWinner = async () => {
        if (!window.confirm("Are you sure you want to pick a random winner?")) return;
        await executeWinnerSelection({});
    };

    const declareManualWinner = async () => {
        if (!selectedId) return alert("Please select a participant first.");
        if (!window.confirm("Are you sure you want to declare this user as the winner?")) return;
        await executeWinnerSelection({ id: selectedId });
    };

    const executeWinnerSelection = async (payload) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_HOST}/api/giveaway/select-winner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                alert(`Winner Selected: ${data.winner.firstName} ${data.winner.lastName}`);
                setWinner(data.winner);
                fetchEntries();
                setSelectedId(null);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error selecting winner:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="discount-manager"> {/* Reuse styles */}
                <div className="dm-header">
                    <h2>Giveaway Entries ({entries.length})</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="add-btn" onClick={declareManualWinner} disabled={!selectedId} style={{ backgroundColor: '#007bff', opacity: !selectedId ? 0.6 : 1 }}>
                            Declare Selected
                        </button>
                        <button className="add-btn" onClick={pickWinner} style={{ backgroundColor: '#28a745' }}>
                            🏆 Pick Random
                        </button>
                    </div>
                </div>

                {winner && (
                    <div style={{
                        margin: '20px 0',
                        padding: '20px',
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#155724', margin: 0 }}>🎉 Winner: {winner.firstName} {winner.lastName} 🎉</h3>
                        <p style={{ margin: '5px 0' }}>{winner.email} | {winner.contactNo} | {winner.instagramId}</p>
                    </div>
                )}

                <div className="discounts-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Instagram</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => (
                                <tr key={entry._id} style={entry.isWinner ? { backgroundColor: '#e8f5e9' } : {}}>
                                    <td>
                                        <input
                                            type="radio"
                                            name="winnerSelect"
                                            checked={selectedId === entry._id}
                                            onChange={() => setSelectedId(entry._id)}
                                        />
                                    </td>
                                    <td>{entry.firstName} {entry.lastName}</td>
                                    <td>{entry.email}</td>
                                    <td>{entry.contactNo}</td>
                                    <td>{entry.instagramId}</td>
                                    <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                                    <td>{entry.isWinner ? '🏆 WINNER' : 'Participant'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default GiveawayManager;
