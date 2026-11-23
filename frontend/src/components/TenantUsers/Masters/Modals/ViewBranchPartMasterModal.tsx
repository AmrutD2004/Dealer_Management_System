import { getBranchPartMasterById } from "@/api/endpoints"
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
import { toast } from "@/components/ui/toast"
import { formatPartCurrency } from "@/components/TenantUsers/Masters/PartMaster/partOptions"
import { getErrorMessage } from "@/lib/utils"
import type { BranchPartMasterListType, BranchPartMasterRecordType } from "@/Types/branchPartMasterType"
import dayjs from "dayjs"
import { Loader2, PackageSearch } from "lucide-react"
import { useEffect, useState } from "react"

interface ViewBranchPartMasterModalProps {
    record: BranchPartMasterListType | null,
    open: boolean,
    onClose: () => void
}

const formatMoney = (value: string | number | null) => value == null ? '—' : formatPartCurrency(value)

function ViewBranchPartMasterModal({ record, open, onClose }: ViewBranchPartMasterModalProps) {
    const [detail, setDetail] = useState<BranchPartMasterRecordType | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadDetail = async () => {
            if (!record) return
            setDetail(null)
            setLoading(true)
            try {
                const data = await getBranchPartMasterById(record.id)
                if (data?.success) {
                    setDetail(data?.data ?? null)
                }
            } catch (err: unknown) {
                toast.add({ type: 'error', description: getErrorMessage(err) })
            } finally {
                setLoading(false)
            }
        }
        if (open) loadDetail()
    }, [open, record])

    if (!record) return null

    const view = detail ? { ...record, ...detail } : record

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm w-full md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <PackageSearch className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Branch wise Part Master Details</DialogTitle>
                            <DialogDescription>Read-only view of the part allocation in this branch.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {loading && (
                    <div className="flex items-center gap-2 py-4 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />Loading details...
                    </div>
                )}

                <div className="space-y-4 py-3">
                    <div>
                        <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Part</h3></div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Part No.</Label>
                                <span className="text-xs font-mono font-semibold">{view.part?.partNo ?? `#${view.partId}`}</span>
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Unit</Label>
                                <span className="text-xs font-medium">{view.part?.unitOfMeasure ?? '—'}</span>
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 lg:col-span-2">
                                <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                                <span className="text-xs font-medium">{view.part?.partDescription ?? '—'}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Location &amp; Stock</h3></div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Branch ID</Label>
                                <span className="text-xs font-semibold">{view.branchId}</span>
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Stock in Hand</Label>
                                <span className="text-xs font-semibold">{view.stockInHand}</span>
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Store</Label>
                                <span className="text-xs font-medium">{view.store ? `${view.store.code} - ${view.store.description}` : `#${view.storeId}`}</span>
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Bin</Label>
                                <span className="text-xs font-medium">{view.bin?.binCode ?? `#${view.binId}`}</span>
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Default Bin</Label>
                                <Badge variant={view.isDefaultBin ? 'success' : 'outline'}>{view.isDefaultBin ? 'Yes' : 'No'}</Badge>
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                                <Badge variant={view.isActive ? 'success' : 'destructive'}>{view.isActive ? 'Active' : 'Inactive'}</Badge>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Levels</h3></div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                            {[
                                { label: 'Minimum Level', value: view.minimumLevel },
                                { label: 'Maximum Level', value: view.maximumLevel },
                                { label: 'Reorder Level', value: view.reorderLevel },
                                { label: 'Safety Stock', value: view.safetyStock },
                                { label: 'Reservation Qty', value: view.reservationQty }
                            ].map((item) => (
                                <div key={item.label} className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">{item.label}</Label>
                                    <span className="text-xs font-medium">{item.value ?? '—'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Pricing</h3></div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                            {[
                                { label: 'Selling Price', value: formatMoney(view.sellingPrice) },
                                { label: 'MRP', value: formatMoney(view.mrp) },
                                { label: 'Latest Landed Cost', value: formatMoney(view.latestLandedCost) }
                            ].map((item) => (
                                <div key={item.label} className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">{item.label}</Label>
                                    <span className="text-xs font-medium">{item.value}</span>
                                </div>
                            ))}
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Updated At</Label>
                                <span className="text-xs font-medium">{dayjs(view.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewBranchPartMasterModal
