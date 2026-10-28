import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { ModelListType } from "@/Types/modelMasterType"
import dayjs from "dayjs"
import { Car } from "lucide-react"
import { getBodyTypeLabel } from "../bodyTypeOptions"

type props = {
    model: ModelListType | null
    brandName: string
    open: boolean
    onClose: () => void
}

const Detail = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <span className="text-xs font-medium">{value}</span>
    </div>
)

export function ViewModelModal({ model, brandName, open, onClose }: props) {
    if (!model) return null

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Car className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Model Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the model record.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-3">
                    <div>
                        <div className="mb-2 bg-muted/40 px-2 py-1">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Model Details</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                            <Detail label="Model ID" value={<span className="font-mono">{model.id}</span>} />
                            <Detail label="Model Code" value={<span className="font-mono">{model.modelCode}</span>} />
                            <Detail label="Status" value={<Badge variant={model.isActive ? "success" : "destructive"}>{model.isActive ? "Active" : "Inactive"}</Badge>} />
                            <Detail label="Model Name" value={model.modelName} />
                            <Detail label="Brand" value={brandName || ("#" + model.brandId)} />
                            <Detail label="Body Type" value={getBodyTypeLabel(model.bodyType)} />
                            <Detail label="Created At" value={dayjs(model.createdAt).format('DD MMM YYYY')} />
                            <Detail label="Updated At" value={dayjs(model.updatedAt).format('DD MMM YYYY')} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline"  >Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
