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
import { Field, FieldGroup } from "@/components/ui/field"
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
                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Model ID</Label>
                            <span className="text-md font-semibold font-mono">{model.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Model Code</Label>
                            <span className="text-md font-semibold font-mono">{model.modelCode}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <span>
                                <Badge variant={model.isActive ? "success" : "destructive"}>
                                    {model.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Model Name</Label>
                            <span className="text-md font-semibold">{model.modelName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Brand</Label>
                            <span className="text-md font-medium">{brandName || `#${model.brandId}`}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Body Type</Label>
                            <span className="text-md font-medium">{getBodyTypeLabel(model.bodyType)}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                            <span className="text-md font-medium">{dayjs(model.createdAt).format('DD MMM YYYY')}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-md font-medium">{dayjs(model.updatedAt).format('DD MMM YYYY')}</span>
                        </Field>
                    </FieldGroup>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
