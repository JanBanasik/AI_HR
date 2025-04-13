import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Candidate} from "@/types/candidate";

const CandidateDetail = () => {
    const {id} = useParams();
    const [candidateData, setCandidateData] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/candidates/${id}`);
                setCandidateData(response.data);
            } catch (error) {
                console.error("Error fetching candidate data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidateData();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!candidateData) {
        return <p>Candidate not found</p>;
    }

    const {github, x, cv} = candidateData;

    return (
        <div className="p-6 space-y-6">
            {/* Profile Card */}
            {cv ? (
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h1 className="text-3xl font-semibold">{cv.name}</h1>
                    <p className="text-lg text-gray-600">{cv.contact.email}</p>
                    <p className="text-lg text-gray-600">{cv.contact.phone}</p>
                </div>
            ) : (
                <p>No CV data available</p>
            )}

            {/* GitHub Profile */}
            {github && Object.keys(github).length > 0 && (
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-semibold">GitHub Profile</h2>
                    <ul>
                        {Object.entries(github).map(([language, repositories], index) => (
                            <li key={index}>
                                <strong>{language}</strong>: {repositories}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* X Profile Sentiment */}
            {x && (
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-semibold">X Profile Sentiment</h2>
                    <p><strong>Fit Score:</strong> {x.fit_score}</p>
                    <p><strong>Classification:</strong> {x.classification}</p>
                    <p><strong>Stability:</strong> {x.stability_score}</p>
                    <p><strong>Aggression:</strong> {x.aggression_score}</p>
                    <p><strong>Political:</strong> {x.political_score}</p>
                    <p><strong>Controversial:</strong> {x.controversial_score}</p>
                    <p><strong>Explanation:</strong> {x.political_explanation}</p>
                    <p><strong>Summary:</strong> {x.summary}</p>
                </div>
            )}

            {/* CV Details */}
            {cv && (
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-semibold">CV Details</h2>
                    {cv.education.length > 0 && (
                        <>
                            <p><strong>Education:</strong> {cv.education[0]?.university}</p>
                            <p><strong>Degree:</strong> {cv.education[0]?.degree}</p>
                        </>
                    )}

                    {cv.languages && (
                        <p><strong>Languages:</strong> {cv.languages.English} | {cv.languages.Polish}</p>
                    )}

                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">Technical Skills:</h3>
                        {cv.tech_skills.length > 0 ? (
                            <ul className="list-disc pl-6">
                                {cv.tech_skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No technical skills available.</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">Soft Skills:</h3>
                        {cv.soft_skills.length > 0 ? (
                            <ul className="list-disc pl-6">
                                {cv.soft_skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No soft skills available.</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">Projects:</h3>
                        {cv.projects.length > 0 ? (
                            cv.projects.map((project, index) => (
                                <div key={index} className="mt-4">
                                    <h4 className="text-lg font-semibold">{project.title}</h4>
                                    <p>{project.description}</p>
                                    <p><strong>Technologies:</strong> {project.technologies.join(", ")}</p>
                                    <p><strong>Role:</strong> {project.role}</p>
                                    {project.result && <span className="bg-green-500 text-white px-2 py-1 rounded">{project.result}</span>}
                                </div>
                            ))
                        ) : (
                            <p>No projects available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateDetail;
