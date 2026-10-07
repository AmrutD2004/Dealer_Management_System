import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface CreateBranchModalProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export function CreateBranchModal({ open, setOpen }: CreateBranchModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        branchCode: "",
        branchName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        locality: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <Dialog open={open}>
            <form>
                <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                    <DialogHeader>
                        <DialogTitle>Create New Branch</DialogTitle>
                        <DialogDescription>Add a new branch to the tenant.</DialogDescription>
                    </DialogHeader>

                    <form id="branch-form" onSubmit={handleSubmit}>
                        <div className="space-y-6 py-4">
                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-foreground">Branch Details</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field>
                                        <FieldLabel>Branch Code <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='branchCode' placeholder="BR-001" required onChange={handleChange} value={formData.branchCode} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Branch Name <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='branchName' placeholder="Branch Name" required onChange={handleChange} value={formData.branchName} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Email <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='email' type='email' placeholder="branch@redogroup.com" required onChange={handleChange} value={formData.email} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Phone <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='phone' placeholder="+91 00000 00000" required onChange={handleChange} value={formData.phone} />
                                        </FieldContent>
                                    </Field>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-foreground">Address</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field className="sm:col-span-2">
                                        <FieldLabel>Address Line 1 <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='address1' placeholder="Address Line 1" required onChange={handleChange} value={formData.address1} />
                                        </FieldContent>
                                    </Field>
                                    <Field className="sm:col-span-2">
                                        <FieldLabel>Address Line 2</FieldLabel>
                                        <FieldContent>
                                            <Input name='address2' placeholder="Address Line 2" onChange={handleChange} value={formData.address2} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Locality <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='locality' placeholder="Locality" required onChange={handleChange} value={formData.locality} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>City <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='city' placeholder="City" required onChange={handleChange} value={formData.city} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>State <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='state' placeholder="State" required onChange={handleChange} value={formData.state} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Country <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='country' placeholder="Country" required onChange={handleChange} value={formData.country} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Pincode <span className="text-red-500">*</span></FieldLabel>
                                        <FieldContent>
                                            <Input name='pincode' placeholder="Pincode" required onChange={handleChange} value={formData.pincode} />
                                        </FieldContent>
                                    </Field>
                                </div>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                        <Button form="branch-form" type="submit" disabled={loading}>
                            {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating....</span>}
                            Create Branch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
