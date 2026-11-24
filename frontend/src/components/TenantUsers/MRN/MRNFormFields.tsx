import { Button } from "@/components/ui/button"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { binListType, storageListType } from "@/Types/tenantCreateType"
import type { BranchPartMasterListType } from "@/Types/branchPartMasterType"
import type { mrnFormType } from "@/Types/mrnType"
import { Plus, Trash2 } from "lucide-react"
import {
    calculateLineTotal,
    calculateTaxAmount,
    calculateTaxRate,
    emptyMrnPart,
    formatCurrency,
    MRN_TYPE_OPTIONS,
    PARTY_TYPE_OPTIONS,
    PURCHASE_TYPE_OPTIONS,
    toNumberInputValue,
} from "./mrnForm"

interface MRNFormFieldsProps {
    formData: mrnFormType
    setFormData: React.Dispatch<React.SetStateAction<mrnFormType>>
    stores: storageListType[]
    bins: binListType[]
    parts: BranchPartMasterListType[]
    lockIdentity?: boolean
}

const partLabel = (part: BranchPartMasterListType) =>
    part.part
        ? `${part.part.partNo} - ${part.part.partDescription}`
        : `Part #${part.id}`

function MRNFormFields({ formData, setFormData, stores, bins, parts, lockIdentity = false }: MRNFormFieldsProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const updatePart = (index: number, patch: Partial<mrnFormType["parts"][number]>) => {
        setFormData((prev) => ({
            ...prev,
            parts: prev.parts.map((part, partIndex) => {
                if (partIndex !== index) return part
                const updatedPart = { ...part, ...patch }
                if ("taxAmount" in patch) {
                    return {
                        ...updatedPart,
                        taxSource: "amount" as const,
                        taxRate: toNumberInputValue(calculateTaxRate(updatedPart)),
                    }
                }
                if ("taxRate" in patch) {
                    return {
                        ...updatedPart,
                        taxSource: "rate" as const,
                        taxAmount: toNumberInputValue(calculateTaxAmount(updatedPart)),
                    }
                }
                if ("invoiceQty" in patch || "rate" in patch || "discount" in patch) {
                    return updatedPart.taxSource === "amount"
                        ? { ...updatedPart, taxRate: toNumberInputValue(calculateTaxRate(updatedPart)) }
                        : { ...updatedPart, taxAmount: toNumberInputValue(calculateTaxAmount(updatedPart)) }
                }
                return updatedPart
            }),
        }))
    }

    const handlePartChange = (index: number, value: string) => {
        const selectedPart = parts.find((part) => String(part.id) === value)
        const partBins = bins.filter(
            (bin) => String(bin.storeId) === String(selectedPart?.storeId)
        )
        const defaultBin = partBins.some(
            (bin) => String(bin.id) === String(selectedPart?.binId)
        )
            ? String(selectedPart?.binId)
            : ""
        updatePart(index, {
            branchPartId: value,
            binId: defaultBin,
            taxRate : selectedPart?.part?.taxRate !=null ? String(selectedPart?.part?.taxRate) : "",
            rate: selectedPart?.latestLandedCost != null
                ? String(selectedPart.latestLandedCost)
                : "",
        })
    }

    return (
        <div className="space-y-4 py-3">
            <div>
                <div className="mb-2 bg-muted/40 px-2 py-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">MRN Details</h3>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">Store <span className="text-red-500">*</span></FieldLabel>
                        <div className="min-w-0">
                            <Select
                                items={stores.map((store) => ({ value: String(store.id), label: `${store.code} - ${store.description}` }))}
                                value={formData.storeId || null}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, storeId: value ?? "" }))}
                                required
                                disabled={lockIdentity}
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select store" />
                                </SelectTrigger>
                                <SelectContent align="start" alignItemWithTrigger={false}>
                                    {stores.map((store) => (
                                        <SelectItem key={store.id} value={String(store.id)}>
                                            {store.code} - {store.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">MRN Date <span className="text-red-500">*</span></FieldLabel>
                        <div className="min-w-0">
                            <Input name="mrnDate" type="date" required disabled={lockIdentity} value={formData.mrnDate} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                    </div>
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">MRN Type <span className="text-red-500">*</span></FieldLabel>
                        <div className="min-w-0">
                            <Select
                                items={MRN_TYPE_OPTIONS}
                                value={formData.mrnType || null}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, mrnType: (value ?? "") as mrnFormType["mrnType"] }))}
                                required
                                disabled={lockIdentity}
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select MRN type" />
                                </SelectTrigger>
                                <SelectContent align="start" alignItemWithTrigger={false}>
                                    {MRN_TYPE_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">Purchase Type <span className="text-red-500">*</span></FieldLabel>
                        <div className="min-w-0">
                            <Select
                                items={PURCHASE_TYPE_OPTIONS}
                                value={formData.purchaseType || null}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, purchaseType: (value ?? "") as mrnFormType["purchaseType"] }))}
                                required
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select purchase type" />
                                </SelectTrigger>
                                <SelectContent align="start" alignItemWithTrigger={false}>
                                    {PURCHASE_TYPE_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-2 bg-muted/40 px-2 py-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Party Details</h3>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">Party Type</FieldLabel>
                        <div className="min-w-0">
                            <Select
                                items={PARTY_TYPE_OPTIONS}
                                value={formData.partyType || null}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, partyType: (value ?? "") as mrnFormType["partyType"] }))}
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select party type" />
                                </SelectTrigger>
                                <SelectContent align="start" alignItemWithTrigger={false}>
                                    {PARTY_TYPE_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">Party Code</FieldLabel>
                        <div className="min-w-0">
                            <Input name="partyCode" placeholder="Party code" value={formData.partyCode} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                    </div>
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                        <FieldLabel className="text-xs font-medium">Party Name</FieldLabel>
                        <div className="min-w-0">
                            <Input name="partyName" placeholder="Party name" value={formData.partyName} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-2 bg-muted/40 px-2 py-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Invoice / DC Details</h3>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">DC No</FieldLabel>
                        <div className="min-w-0">
                            <Input name="dcNo" placeholder="DC number" value={formData.dcNo} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                    </div>
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">DC Date</FieldLabel>
                        <div className="min-w-0">
                            <Input name="dcDate" type="date" value={formData.dcDate} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                    </div>
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">Invoice No</FieldLabel>
                        <div className="min-w-0">
                            <Input name="invoiceNo" placeholder="Invoice number" value={formData.invoiceNo} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                    </div>
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                        <FieldLabel className="text-xs font-medium">Invoice Date</FieldLabel>
                        <div className="min-w-0">
                            <Input name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between bg-muted/40 px-2 py-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Parts</h3>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setFormData((prev) => ({ ...prev, parts: [...prev.parts, { ...emptyMrnPart }] }))}
                    >
                        <Plus className="mr-1 h-3 w-3" />Add Part
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <Table className="min-w-[1100px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[180px] text-xs">Part</TableHead>
                                <TableHead className="min-w-[120px] text-xs">Bin</TableHead>
                                <TableHead className="w-20 text-xs">Invoice Qty</TableHead>
                                <TableHead className="w-20 text-xs">Received</TableHead>
                                <TableHead className="w-20 text-xs">Short</TableHead>
                                <TableHead className="w-20 text-xs">Damage</TableHead>
                                <TableHead className="w-20 text-xs">Excess</TableHead>
                                <TableHead className="w-20 text-xs">Rate</TableHead>
                                <TableHead className="w-20 text-xs">Discount</TableHead>
                                <TableHead className="w-20 text-xs">Tax %</TableHead>
                                <TableHead className="w-20 text-xs">Tax Amount</TableHead>
                                <TableHead className="w-20 text-xs">Total</TableHead>
                                <TableHead className="w-10 text-xs" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formData.parts.map((part, index) => {
                                const selectedPart = parts.find((item) => String(item.id) === part.branchPartId)
                                const partBins = bins.filter(
                                    (bin) => String(bin.storeId) === String(selectedPart?.storeId)
                                )
                                return (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Select
                                                items={parts.map((item) => ({ value: String(item.id), label: partLabel(item) }))}
                                                value={part.branchPartId || null}
                                                onValueChange={(value) => handlePartChange(index, value ?? "")}
                                                required
                                            >
                                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                    <SelectValue placeholder="Select part" />
                                                </SelectTrigger>
                                                <SelectContent align="start" alignItemWithTrigger={false}>
                                                    {parts.map((item) => (
                                                        <SelectItem key={item.id} value={String(item.id)}>{partLabel(item)}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                items={partBins.map((bin) => ({ value: String(bin.id), label: bin.binCode }))}
                                                value={part.binId || null}
                                                onValueChange={(value) => updatePart(index, { binId: value ?? "" })}
                                                disabled={!part.branchPartId}
                                                required
                                            >
                                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                    <SelectValue placeholder="Select bin" />
                                                </SelectTrigger>
                                                <SelectContent align="start" alignItemWithTrigger={false}>
                                                    {partBins.map((bin) => (
                                                        <SelectItem key={bin.id} value={String(bin.id)}>{bin.binCode}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        {(["invoiceQty", "receivedQty", "shortQty", "damageQty", "excessQty", "rate", "discount", "taxRate", "taxAmount"] as const).map((field) => (
                                            <TableCell key={field}>
                                                <Input
                                                    name={field}
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    required={field === "invoiceQty" || field === "rate"}
                                                    value={part[field]}
                                                    onChange={(e) => updatePart(index, { [field]: e.target.value })}
                                                    className="h-7 w-full rounded-none px-1 text-xs"
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-xs font-medium">{formatCurrency(calculateLineTotal(part))}</TableCell>
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive"
                                                aria-label={`Remove part ${index + 1}`}
                                                disabled={formData.parts.length === 1}
                                                onClick={() => setFormData((prev) => ({
                                                    ...prev,
                                                    parts: prev.parts.filter((_, partIndex) => partIndex !== index),
                                                }))}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-2 flex justify-end gap-6 text-xs">
                    <span className="text-muted-foreground">Grand Total</span>
                    <span className="font-semibold">
                        {formatCurrency(formData.parts.reduce((total, part) => total + calculateLineTotal(part), 0))}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default MRNFormFields
