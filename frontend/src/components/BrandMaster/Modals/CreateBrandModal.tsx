import { createBrand } from "@/api/endpoints"
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
import type { BrandCreateType } from "@/Types/brandMasterType"
import { cn } from "cn"
import { Loader2, Plus, Tag } from "lucide-react"
import { useState } from "react"

interface CreateBrandModalProps {
    onCreated?: () => void
}

const initialFormData: BrandCreateType = {
    brandCode: "",
    brandName: "",
}

export function CreateBrandModal({ onCreated }: CreateBrandModalProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<BrandCreateType>(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                brandCode: formData.brandCode,
                brandName: formData.brandName,
            }
            const data = await createBrand(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData(initialFormData)
                onCreated?.()
                setTimeout(() => {
                    setOpen(false)
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

    return (
        <Dialog open={open}>
            <Button onClick={() => setOpen(true)} className={cn('flex items-center gap-2 shadow')}>
                <Plus /> Create Brand
            </Button>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Tag className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Create Brand</DialogTitle>
                            <DialogDescription>
                                Add a new vehicle brand to the DMS platform.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form id="brand-create-form" onSubmit={handleSubmit}>
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
                    <Button onClick={() => setOpen(false)} variant="outline" size="sm" className="h-7 px-3 text-xs">Cancel</Button>
                    <Button form="brand-create-form" type="submit" disabled={loading} size="sm" className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create Brand
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
