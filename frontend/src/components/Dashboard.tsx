import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import CandidateCard from "./CandidateCard";
import {Candidate} from "@/types/candidate.ts";
import ModalForm from "./ModalForm"; // Import the ModalForm component

const Dashboard = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get("http://localhost:8000/candidates/");
                setCandidates(response.data);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    if (loading) {
        return <div className="text-center">Loading candidates...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-semibold">Candidate Dashboard</h2>
            <button
                onClick={handleOpenModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Submit New Profile Data
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {candidates.map((candidate, index) => (
                    <CandidateCard
                        key={index}
                        name={candidate.cv.name}
                        onClick={() => navigate(`/candidate/${candidate.id}`)}
                    />
                ))}
            </div>

            {/* Modal form component */}
            {showModal && <ModalForm onClose={handleCloseModal}/>}
        </div>
    );
};

export default Dashboard;
