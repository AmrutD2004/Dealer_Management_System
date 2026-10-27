import { editBrand } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import type { BrandCreateType, BrandListType } from "@/Types/brandMasterType"
import { Loader2, Tag } from "lucide-react"
import { useState } from "react"

interface EditBrandModalProps {
    brand: BrandListType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

export function EditBrandModal({ brand, open, onClose, onUpdated }: EditBrandModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<BrandCreateType>({
        brandCode: brand?.brandCode ?? "",
        brandName: brand?.brandName ?? "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!brand) return
        setLoading(true)
        try {
            const payload = {
                brandCode: formData.brandCode,
                brandName: formData.brandName,
            }
            const data = await editBrand(payload, brand.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                onUpdated?.()
                setTimeout(() => {
                    onClose()
                }, 2000)
            }
            if (!data?.success) {
                toast.add({
                    type: 'error',
                    description: data?.message
                })
            }
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.add({
                type: 'error',
                description: message
            })
        } finally {
            setLoading(false)
        }
    }

    if (!brand) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Tag className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Edit Brand</DialogTitle>
                            <DialogDescription>
                                Update the brand information. All required fields must be filled.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form id="brand-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1">
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Brand Details</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Brand Code <span className="text-red-500">*</span></FieldLabel>
                                    <Input
                                        name='brandCode'
                                        type='text'
                                        placeholder="e.g. HONDA"
                                        required
                                        onChange={handleChange}
                                        value={formData.brandCode}
                                        className="h-7 rounded-none px-2 text-xs"
                                    />
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Brand Name <span className="text-red-500">*</span></FieldLabel>
                                    <Input
                                        name='brandName'
                                        type='text'
                                        placeholder="e.g. Honda"
                                        required
                                        onChange={handleChange}
                                        value={formData.brandName}
                                        className="h-7 rounded-none px-2 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button onClick={onClose} variant="outline" size="sm" className="h-7 px-3 text-xs" disabled={loading}>Cancel</Button>
                    <Button form="brand-edit-form" type="submit" disabled={loading} size="sm" className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
