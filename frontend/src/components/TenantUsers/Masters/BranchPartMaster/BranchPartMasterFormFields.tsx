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
import { Switch } from "@/components/ui/switch"
import type { BranchPartMasterFormType } from "@/Types/branchPartMasterType"
import type { PartMasterListType } from "@/Types/partMasterType"
import type { binListType, storageListType } from "@/Types/tenantCreateType"
import { Plus, Trash2 } from "lucide-react"

interface BranchPartMasterFormFieldsProps {
    formData: BranchPartMasterFormType,
    setFormData: React.Dispatch<React.SetStateAction<BranchPartMasterFormType>>,
    parts: PartMasterListType[],
    stores: storageListType[],
    bins: binListType[],
    lockIdentity?: boolean,
    allowMultipleStores?: boolean
}

const numericFields = [
    { name: 'sellingPrice', label: 'Selling Price', placeholder: '0.00' },
    { name: 'mrp', label: 'MRP', placeholder: '0.00' },
    { name: 'latestLandedCost', label: 'Latest Landed Cost', placeholder: '0.00' },
    { name: 'minimumLevel', label: 'Minimum Level', placeholder: '0' },
    { name: 'maximumLevel', label: 'Maximum Level', placeholder: '0' },
    { name: 'reorderLevel', label: 'Reorder Level', placeholder: '0' },
    { name: 'safetyStock', label: 'Safety Stock', placeholder: '0' },
    { name: 'reservationQty', label: 'Reservation Qty', placeholder: '0' }
] as const

function BranchPartMasterFormFields({
    formData,
    setFormData,
    parts,
    stores,
    bins,
    lockIdentity = false,
    allowMultipleStores = false
}: BranchPartMasterFormFieldsProps) {
    const handleTopLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const updateStoreRow = (index: number, patch: Partial<BranchPartMasterFormType['stores'][number]>) => {
        setFormData(prev => ({
            ...prev,
            stores: prev.stores.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row)
        }))
    }

    const addStoreRow = () => {
        setFormData(prev => ({
            ...prev,
            stores: [...prev.stores, { storeId: '', binId: '', stockInHand: '0', isDefaultBin: false, isActive: true }]
        }))
    }

    const removeStoreRow = (index: number) => {
        setFormData(prev => ({
            ...prev,
            stores: prev.stores.filter((_, rowIndex) => rowIndex !== index)
        }))
    }

    return (
        <div className="space-y-4 py-3">
            <div>
                <div className="mb-2 bg-muted/40 px-2 py-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Part Details</h3>
                </div>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                    <FieldLabel className="text-xs font-medium">Part <span className="text-red-500">*</span></FieldLabel>
                    <div className="min-w-0">
                        <Select
                            items={parts.map((part) => ({ value: String(part.id), label: `${part.partNo} - ${part.partDescription}` }))}
                            value={formData.partId || null}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, partId: value ?? '' }))}
                            disabled={lockIdentity}
                            required
                        >
                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                <SelectValue placeholder="Select part" />
                            </SelectTrigger>
                            <SelectContent align="start" alignItemWithTrigger={false}>
                                {parts.map((part) => (
                                    <SelectItem key={part.id} value={String(part.id)}>
                                        {part.partNo} - {part.partDescription}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between bg-muted/40 px-2 py-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Store wise Stock</h3>
                    {allowMultipleStores && (
                        <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={addStoreRow}>
                            <Plus className="mr-1 h-3 w-3" />Add Store
                        </Button>
                    )}
                </div>
                <div className="space-y-3">
                    {formData.stores.map((row, index) => {
                        const storeBins = bins.filter((bin) => String(bin.storeId) === row.storeId)
                        return (
                            <div key={index} className="rounded-md border p-2">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-muted-foreground">Store {index + 1}</span>
                                    {allowMultipleStores && formData.stores.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive"
                                            aria-label={`Remove store ${index + 1}`}
                                            onClick={() => removeStoreRow(index)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Store <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Select
                                                items={stores.map((store) => ({ value: String(store.id), label: `${store.code} - ${store.description}` }))}
                                                value={row.storeId || null}
                                                onValueChange={(value) => updateStoreRow(index, { storeId: value ?? '', binId: '' })}
                                                disabled={lockIdentity}
                                                required
                                            >
                                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                    <SelectValue placeholder="Select store" />
                                                </SelectTrigger>
                                                <SelectContent align="start" alignItemWithTrigger={false}>
                                                    {stores.map((store) => (
                                                        <SelectItem key={store.id} value={String(store.id)}>
                                                            {store.code} - {store.description}{store.IsActive ? '' : ' (Inactive)'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Bin <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Select
                                                items={storeBins.map((bin) => ({ value: String(bin.id), label: bin.binCode }))}
                                                value={row.binId || null}
                                                onValueChange={(value) => updateStoreRow(index, { binId: value ?? '' })}
                                                disabled={lockIdentity || !row.storeId}
                                                required
                                            >
                                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                    <SelectValue placeholder={row.storeId ? 'Select bin' : 'Select store first'} />
                                                </SelectTrigger>
                                                <SelectContent align="start" alignItemWithTrigger={false}>
                                                    {storeBins.map((bin) => (
                                                        <SelectItem key={bin.id} value={String(bin.id)}>
                                                            {bin.binCode}{bin.binDescription ? ` - ${bin.binDescription}` : ''}{bin.isActive ? '' : ' (Inactive)'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Stock in Hand</FieldLabel>
                                        <div className="min-w-0">
                                            <Input
                                                name="stockInHand"
                                                type="number"
                                                min="0"
                                                step="0.001"
                                                value={row.stockInHand}
                                                onChange={(e) => updateStoreRow(index, { stockInHand: e.target.value })}
                                                className="h-7 rounded-none px-2 text-xs"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Status</FieldLabel>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={row.isActive}
                                                onCheckedChange={(checked: boolean) => updateStoreRow(index, { isActive: checked })}
                                            />
                                            <span className="text-xs text-muted-foreground">{row.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 lg:col-span-2">
                                        <FieldLabel className="text-xs font-medium">Default Bin</FieldLabel>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={row.isDefaultBin}
                                                onCheckedChange={(checked: boolean) => updateStoreRow(index, { isDefaultBin: checked })}
                                            />
                                            <span className="text-xs text-muted-foreground">{row.isDefaultBin ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div>
                <div className="mb-2 bg-muted/40 px-2 py-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Levels &amp; Pricing</h3>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                    {numericFields.map((field) => (
                        <div key={field.name} className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">{field.label}</FieldLabel>
                            <div className="min-w-0">
                                <Input
                                    name={field.name}
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder={field.placeholder}
                                    value={formData[field.name]}
                                    onChange={handleTopLevelChange}
                                    className="h-7 rounded-none px-2 text-xs"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BranchPartMasterFormFields
