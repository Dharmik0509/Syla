import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API_HOST from '../../config';
import { useAdminUI } from '../../context/AdminUIContext';
import '../../styles/DiscountManager.css'; // Reuse table styles

const GiveawayManager = () => {
    const { showToast, confirmAction } = useAdminUI();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [winner, setWinner] = useState(null);
    const [selectedId, setSelectedId] = useState(null); // For winner selection
    const [selectedIds, setSelectedIds] = useState([]); // For bulk deletion

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
        confirmAction("Are you sure you want to pick a random winner?", async () => {
            await executeWinnerSelection({});
        });
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(entries.map(e => e._id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const deleteSelected = async () => {
        if (selectedIds.length === 0) {
            showToast("Please select entries to delete", "error");
            return;
        }

        confirmAction(`Are you sure you want to delete ${selectedIds.length} entries?`, async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_HOST}/api/giveaway/bulk-delete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': token },
                    body: JSON.stringify({ ids: selectedIds })
                });
                const data = await response.json();
                if (response.ok) {
                    showToast(data.message, "success");
                    setSelectedIds([]);
                    if (selectedIds.includes(selectedId)) setSelectedId(null);
                    fetchEntries();
                } else {
                    showToast(data.message, "error");
                }
            } catch (error) {
                console.error("Error deleting entries:", error);
                showToast("Error deleting entries", "error");
            }
        });
    };

    const deleteSingle = async (id) => {
        confirmAction("Are you sure you want to delete this entry?", async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_HOST}/api/giveaway/delete-entry`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': token },
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                if (response.ok) {
                    showToast(data.message, "success");
                    if (selectedId === id) setSelectedId(null);
                    setSelectedIds(prev => prev.filter(pid => pid !== id));
                    fetchEntries();
                } else {
                    showToast(data.message, "error");
                }
            } catch (error) {
                console.error("Error deleting entry:", error);
                showToast("Error deleting entry", "error");
            }
        });
    };

    const declareManualWinner = async () => {
        if (!selectedId) {
            showToast("Please select a participant first.", "error");
            return;
        }
        confirmAction("Are you sure you want to declare this user as the winner?", async () => {
            await executeWinnerSelection({ id: selectedId });
        });
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
                showToast(`Winner Selected: ${data.winner.firstName} ${data.winner.lastName}`, "success");
                setWinner(data.winner);
                fetchEntries();
                setSelectedId(null);
            } else {
                showToast(data.message, "error");
            }
        } catch (error) {
            console.error("Error selecting winner:", error);
            showToast("Error processing request", "error");
        }
    };

    return (
        <AdminLayout>
            <div className="discount-manager"> {/* Reuse styles */}
                <div className="dm-header">
                    <h2>Giveaway Entries ({entries.length})</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {selectedIds.length > 0 && (
                            <button className="add-btn" onClick={deleteSelected} style={{ backgroundColor: '#dc3545', whiteSpace: 'nowrap' }}>
                                Delete Selected ({selectedIds.length})
                            </button>
                        )}
                        <button className="add-btn" onClick={declareManualWinner} disabled={!selectedId} style={{ backgroundColor: '#007bff', opacity: !selectedId ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                            Declare Winner
                        </button>
                        <button className="add-btn" onClick={pickWinner} style={{ backgroundColor: '#28a745', whiteSpace: 'nowrap' }}>
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
                        <p style={{ margin: '5px 0' }}>
                            {winner.email} | {winner.contactNo} |{' '}
                            <a
                                href={winner.instagramId.includes('instagram.com') ? (winner.instagramId.startsWith('http') ? winner.instagramId : `https://${winner.instagramId}`) : `https://instagram.com/${winner.instagramId.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#007bff', textDecoration: 'underline' }}
                            >
                                Instagram Profile
                            </a>
                        </p>
                    </div>
                )}

                <div className="discounts-table" style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={entries.length > 0 && selectedIds.length === entries.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>Winner</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Instagram</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => (
                                <tr key={entry._id} style={entry.isWinner ? { backgroundColor: '#e8f5e9' } : {}}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(entry._id)}
                                            onChange={() => toggleSelectOne(entry._id)}
                                        />
                                    </td>
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
                                    <td>
                                        <a
                                            href={entry.instagramId.includes('instagram.com') ? (entry.instagramId.startsWith('http') ? entry.instagramId : `https://${entry.instagramId}`) : `https://instagram.com/${entry.instagramId.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#007bff', textDecoration: 'underline' }}
                                        >
                                            View Profile
                                        </a>
                                    </td>
                                    <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                                    <td>{entry.isWinner ? '🏆 WINNER' : 'Participant'}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteSingle(entry._id)}
                                            style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
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
