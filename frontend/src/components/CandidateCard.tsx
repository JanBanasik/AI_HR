// CandidateCard.tsx
import React from "react";

// Define the prop types for CandidateCard
interface CandidateCardProps {
    name: string;
    onClick: () => void;  // Define onClick here
}

const CandidateCard: React.FC<CandidateCardProps> = ({name, onClick}) => {
    return (
        <div className="p-4 border rounded-lg shadow hover:bg-gray-100" onClick={onClick}>
            <h3 className="text-xl font-semibold">{name}</h3>
        </div>
    );
};

export default CandidateCard;
