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
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { binListType, storageListType } from "@/Types/tenantCreateType"
import type { BranchPartMasterListType } from "@/Types/branchPartMasterType"
import type { mrnFormType } from "@/Types/mrnType"
import { ChevronsUpDown, Plus, Trash2 } from "lucide-react"
import {
    calculateLineTotal,
    emptyMrnPart,
    formatCurrency,
    MRN_TYPE_OPTIONS,
    PARTY_TYPE_OPTIONS,
    PURCHASE_TYPE_OPTIONS,
} from "./mrnForm"
import { useEffect, useState } from "react";
import { getSearchedBranchPart } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";

interface MRNFormFieldsProps {
    formData: mrnFormType
    setFormData: React.Dispatch<React.SetStateAction<mrnFormType>>
    stores: storageListType[]
    bins: binListType[]
    parts: BranchPartMasterListType[]
}

const partLabel = (part: BranchPartMasterListType) =>
    part.part
        ? `${part.part.partNo} - ${part.part.partDescription}`
        : `Part #${part.id}`

function MRNFormFields({ formData, setFormData, stores, bins, parts }: MRNFormFieldsProps) {
    const [openPartRow, setOpenPartRow] = useState<number | null>(null)
    const [searchPartByRow, setSearchPartByRow] = useState<Record<number, string>>({})
    const [searchedPartsByRow, setSearchedPartsByRow] = useState<Record<number, BranchPartMasterListType[]>>({})
    const [selectedPartByRow, setSelectedPartByRow] = useState<Record<number, BranchPartMasterListType>>({})
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const updatePart = (index: number, patch: Partial<mrnFormType["parts"][number]>) => {
        setFormData((prev) => ({
            ...prev,
            parts: prev.parts.map((part, partIndex) =>
                partIndex === index ? { ...part, ...patch } : part
            ),
        }))
    }

    const handlePartChange = (index: number, value: string, selectedRecord?: BranchPartMasterListType) => {
        const selectedPart = selectedRecord ?? parts.find((part) => String(part.id) === value)
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


    useEffect(() => {
        let cancelled = false
        Object.entries(searchPartByRow).forEach(async ([rowKey, query]) => {
            const rowIndex = Number(rowKey)
            if (!query.trim()) {
                setSearchedPartsByRow((prev) => ({ ...prev, [rowIndex]: [] }))
                return
            }
            const data = await getSearchedBranchPart(formData.storeId, query)
            if (!cancelled) {
                setSearchedPartsByRow((prev) => ({
                    ...prev,
                    [rowIndex]: data?.success ? data.data ?? [] : [],
                }))
            }
        })
        return () => { cancelled = true }
    }, [searchPartByRow, formData.storeId])

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
                            <Input name="mrnDate" type="date" required value={formData.mrnDate} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
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
                                const selectedPart = selectedPartByRow[index] ?? parts.find((item) => String(item.id) === part.branchPartId)
                                const searchedParts = searchedPartsByRow[index] ?? []
                                const partBins = bins.filter(
                                    (bin) => String(bin.storeId) === String(selectedPart?.storeId)
                                )
                                return (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Popover open={openPartRow === index} onOpenChange={
                                                (open) => {
                                                    setOpenPartRow(open ? index : null)}} >
                                <PopoverTrigger disabled={!formData.storeId}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        disabled={!formData.storeId}
                                        className="h-7 w-full justify-between rounded-none px-2 text-xs font-normal"
                                    >
                                        {selectedPart
                                            ? `${selectedPart.part?.partNo ?? "Part"}`
                                            : "Select Part"}

                                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    align="center"
                                    className="p-0 "
                                    
                                >
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Enter Part No..."
                                            value={searchPartByRow[index] ?? ""}
                                            onValueChange={(value) => setSearchPartByRow((prev) => ({ ...prev, [index]: value }))}
                                            className="h-8 text-xs"
                                        />

                                        <CommandList>
                                            {searchedParts.length === 0 ? (
                                                <CommandEmpty className="py-3 text-xs">
                                                    No parts found.
                                                </CommandEmpty>
                                            ) : (
                                                <CommandGroup>
                                                    {searchedParts.map((c) => (
                                                        <CommandItem
                                                            key={c.id}
                                                            value={String(c.id)}
                                                            onSelect={() => {
                                                                handlePartChange(index, String(c.id), c)
                                                                setSelectedPartByRow((prev) => ({ ...prev, [index]: c }))
                                                                setOpenPartRow(null)
                                                                setSearchPartByRow((prev) => ({ ...prev, [index]: "" }))
                                                            }}
                                                            className="text-xs"
                                                        >
                                                            {c.part?.partNo}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
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
