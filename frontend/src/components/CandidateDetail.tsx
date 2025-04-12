import {useParams} from "react-router-dom"
import {useState, useEffect} from "react"
import axios from "axios"

export default function CandidateDetail() {
    const {id} = useParams()
    const [candidate, setCandidate] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/candidate/${id}`)
                setCandidate(response.data)
            } catch (error) {
                console.error("Error fetching candidate:", error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchCandidate()
        }
    }, [id])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!candidate) {
        return <div>Candidate not found.</div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{candidate.name}</h2>
            <p className="text-lg mb-4">{candidate.position}</p>
            <p className="text-sm">{candidate.summary}</p>

            <div className="mt-4">
                <h3 className="font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {candidate.tags.map((tag: string) => (
                        <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full">
              {tag}
            </span>
                    ))}
                </div>
            </div>

            {candidate.github && (
                <div className="mt-4">
                    <a href={candidate.github} target="_blank" className="text-blue-500">
                        View GitHub Profile
                    </a>
                </div>
            )}
        </div>
    )
}
