import {useState, useEffect} from "react"
import axios from "axios"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {useNavigate} from "react-router-dom"

type Candidate = {
    id: string
    name: string
    position: string
    summary: string
    tags: string[]
    github?: string
}

export default function Dashboard() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/candidates")
                setCandidates(response.data)
            } catch (error) {
                console.error("Error fetching candidates:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCandidates()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
                <p className="text-muted-foreground">List of imported and analyzed candidates.</p>
            </div>

            <Separator className="mb-6"/>

            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {candidates.map((candidate) => (
                        <Card
                            key={candidate.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => navigate(`/candidate/${candidate.id}`)}
                        >
                            <CardHeader>
                                <CardTitle className="text-xl">{candidate.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{candidate.position}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm">{candidate.summary}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {candidate.tags.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                {candidate.github && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs px-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(candidate.github, "_blank")
                                        }}
                                    >
                                        View GitHub
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
