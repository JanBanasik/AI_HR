import {Route, Routes} from "react-router-dom"
import {ThemeProvider} from "@/components/theme-provider"
import {ModeToggle} from "@/components/mode-toggle"
import Dashboard from "@/components/Dashboard"
import CandidateDetail from "./components/CandidateDetail"

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex flex-col min-h-svh">
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">HR Platform</h1>
                    <ModeToggle/>
                </div>

                <div className="flex-1 p-4">
                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/candidate/:id" element={<CandidateDetail/>}/>
                    </Routes>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App
