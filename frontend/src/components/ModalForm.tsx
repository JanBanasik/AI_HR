import {useState} from "react";
import axios from "axios";

const ModalForm = ({onClose}: { onClose: () => void }) => {
    const [xProfile, setXProfile] = useState("");
    const [githubProfile, setGithubProfile] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false); // State to track if processing is ongoing

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!xProfile && !githubProfile && !pdfFile) {
            setError("At least one field must be provided.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        if (xProfile) formData.append("x_profile_username", xProfile);
        if (githubProfile) formData.append("github_username", githubProfile);
        if (pdfFile) formData.append("file", pdfFile);

        try {
            await axios.post("http://localhost:8000/analysis", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Listening for server-side events (SSE)
            const eventSource = new EventSource("http://localhost:8000/analysis-events");
            eventSource.onmessage = function () {
                setProcessing(false); // Stop the processing spinner
                setLoading(false); // Stop the submit spinner
                alert("Data processing completed!");
                eventSource.close(); // Close the connection once data is received
                onClose(); // Close the modal after processing is complete
            };
        } catch (error) {
            setLoading(false);
            setProcessing(false);
            setError("An error occurred while submitting the form.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                <h3 className="text-xl font-semibold">Submit Profile Information</h3>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">User X Profile Name</label>
                        <input
                            type="text"
                            value={xProfile}
                            onChange={(e) => setXProfile(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block">GitHub Profile Name</label>
                        <input
                            type="text"
                            value={githubProfile}
                            onChange={(e) => setGithubProfile(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block">Upload PDF</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            disabled={loading || processing} // Disable the button during loading or processing
                        >
                            {loading ? "Submitting..." : processing ? "Processing..." : "Submit"}
                        </button>
                    </div>
                </form>

                {/* Display a spinner when processing is ongoing */}
                {processing && (
                    <div className="flex justify-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalForm;
