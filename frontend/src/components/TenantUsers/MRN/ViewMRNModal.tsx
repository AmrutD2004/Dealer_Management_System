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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { mrnListType } from "@/Types/mrnType"
import { ClipboardList } from "lucide-react"
import { formatCurrency, formatDate, formatEnumLabel } from "./mrnForm"

interface ViewMRNModalProps {
    mrn: mrnListType | null
    open: boolean
    onClose: () => void
}

const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <span className="text-xs font-medium">{value ?? "—"}</span>
    </div>
)

export function ViewMRNModal({ mrn, open, onClose }: ViewMRNModalProps) {
    if (!mrn) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm w-full md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <ClipboardList className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">{mrn.mrnNo}</DialogTitle>
                            <DialogDescription>Read-only view of the MRN record.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-3">
                    <div>
                        <div className="mb-2 bg-muted/40 px-2 py-1">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">MRN Details</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                            <Detail label="MRN No" value={<span className="font-mono">{mrn.mrnNo}</span>} />
                            <Detail label="Date" value={formatDate(mrn.mrnDate)} />
                            <Detail label="Store" value={mrn.store ? `${mrn.store.code} - ${mrn.store.description}` : "—"} />
                            <Detail label="Status" value={<Badge variant="secondary">{formatEnumLabel(mrn.status)}</Badge>} />
                            <Detail label="MRN Type" value={formatEnumLabel(mrn.mrnType)} />
                            <Detail label="Purchase Type" value={formatEnumLabel(mrn.purchaseType)} />
                            <Detail label="Created By" value={mrn.createdBy ? `${mrn.createdBy.firstName} ${mrn.createdBy.lastName ?? ""}`.trim() : "—"} />
                            <Detail label="Updated By" value={mrn.updatedBy ? `${mrn.updatedBy.firstName} ${mrn.updatedBy.lastName ?? ""}`.trim() : "—"} />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 bg-muted/40 px-2 py-1">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Party &amp; Document</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                            <Detail label="Party Type" value={mrn.partyType ? formatEnumLabel(mrn.partyType) : "—"} />
                            <Detail label="Party Code" value={mrn.partyCode} />
                            <Detail label="Party Name" value={mrn.partyName} />
                            <Detail label="DC No" value={mrn.dcNo} />
                            <Detail label="DC Date" value={formatDate(mrn.dcDate)} />
                            <Detail label="Invoice No" value={mrn.invoiceNo} />
                            <Detail label="Invoice Date" value={formatDate(mrn.invoiceDate)} />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 bg-muted/40 px-2 py-1">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Parts ({mrn.mrnDetails.length})</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Sr No.</TableHead>
                                    <TableHead className="text-xs">Part</TableHead>
                                    <TableHead className="text-xs">Branch Part ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mrn.mrnDetails.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-xs text-muted-foreground">No parts recorded</TableCell>
                                    </TableRow>
                                ) : (
                                    mrn.mrnDetails.map((detail, index) => {
                                        const branchPart = detail.branchPart
                                        const label = branchPart?.part
                                            ? `${branchPart.part.partNo} - ${branchPart.part.partDescription}`
                                            : branchPart?.id != null
                                                ? `Part #${branchPart.id}`
                                                : "—"
                                        return (
                                            <TableRow key={detail.id}>
                                                <TableCell className="text-xs">{index + 1}</TableCell>
                                                <TableCell className="text-xs">{label}</TableCell>
                                                <TableCell className="text-xs font-mono">{detail.branchPartId ?? branchPart?.id}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div>
                        <div className="mb-2 bg-muted/40 px-2 py-1">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Totals</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                            <Detail label="Taxable Value" value={formatCurrency(mrn.totalTaxableValue)} />
                            <Detail label="Discount Value" value={formatCurrency(mrn.totalDiscountValue)} />
                            <Detail label="Invoice Value" value={formatCurrency(mrn.totalInvoiceValue)} />
                            <Detail label="MRN Value" value={<span className="font-semibold">{formatCurrency(mrn.totalMRNValue)}</span>} />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose} variant="outline">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}