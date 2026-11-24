import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ClipboardList, Plus } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

const MRNHeader = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    return (
        <div className="flex w-full items-center text-foreground">
            <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                    <ClipboardList />
                    <h1 className="font-semibold tracking-tight text-2xl text-foreground">MRN Management</h1>
                </div>
                <p className="text-sm text-muted-foreground">Create and view material receipt notes for incoming parts.</p>
            </div>
            <div className="ms-auto">
                <Button
                    className={cn("flex items-center gap-2")}
                    onClick={() => navigate(`/tenant/${id}/mrn/create`)}
                >
                    <Plus />Create MRN
                </Button>
            </div>
        </div>
    )
}

export default MRNHeader
