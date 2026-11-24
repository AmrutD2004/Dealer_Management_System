import { getMRNList } from "@/api/endpoints"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import SortableTableHead from "@/components/ui/sortable-table-head"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { useTableSort } from "@/hooks/useTableSort"
import { getVisiblePageIndices } from "@/lib/pagination"
import { getErrorMessage } from "@/lib/utils"
import type { mrnListType } from "@/Types/mrnType"
import { Eye, Loader2, MoreHorizontal, Pencil } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { formatCurrency, formatDate, formatEnumLabel, isMrnEditable } from "./mrnForm"
import { ViewMRNModal } from "./ViewMRNModal"

const TAKE = 9

const MRNListTable = ({ refreshKey = 0 }: { refreshKey?: number }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [mrns, setMrns] = useState<mrnListType[]>([])
    const [totalMrns, setTotalMrns] = useState(0)
    const [skip, setSkip] = useState(0)
    const [loading, setLoading] = useState(false)
    const [selectedMrn, setSelectedMrn] = useState<mrnListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort<mrnListType>(mrns)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoading(true)
            try {
                const mrnData = await getMRNList()
                if (cancelled) return
                const list: mrnListType[] = Array.isArray(mrnData?.data) ? mrnData.data : []
                setMrns(list)
                setTotalMrns(typeof mrnData?.count === "number" ? mrnData.count : list.length)
                setSkip((prev) => (prev < list.length ? prev : 0))
            } catch (err: unknown) {
                if (!cancelled) {
                    toast.add({ type: "error", description: getErrorMessage(err) })
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [refreshKey])

    const noOfPages = Math.ceil(totalMrns / TAKE)
    const pagedMrns = useMemo(() => sortedData.slice(skip, skip + TAKE), [sortedData, skip])

    const handleOpenView = (mrn: mrnListType) => {
        setSelectedMrn(mrn)
        setViewOpen(true)
    }

    const handleOpenEdit = (mrn: mrnListType) => {
        navigate(`/tenant/${id}/mrn/edit/${mrn.id}`)
    }

    const closeViewModal = () => {
        setViewOpen(false)
        setSelectedMrn(null)
    }

    return (
        <div className="w-full">
            {loading && (
                <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />Loading MRNs...
                </div>
            )}
            <Table className="w-full mt-5">
                <TableCaption>A list of material receipt notes in your branch.</TableCaption>
                <TableHeader>
                    <TableRow className="w-full">
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="MRN No" sortKey="mrnNo" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Date" sortKey="mrnDate" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Store" sortKey="storeId" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="MRN Type" sortKey="mrnType" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Purchase Type" sortKey="purchaseType" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Party" sortKey="partyName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <TableHead className="text-center text-muted-foreground">Items</TableHead>
                        <SortableTableHead label="MRN Value" sortKey="totalMRNValue" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-right" />
                        <SortableTableHead label="Status" sortKey="status" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pagedMrns.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center text-muted-foreground">
                                {loading ? "Loading..." : "No MRNs recorded yet"}
                            </TableCell>
                        </TableRow>
                    ) : (
                        pagedMrns.map((mrn, index) => (
                            <TableRow key={mrn.id}>
                                <TableCell className="text-left font-medium">{skip + index + 1}</TableCell>
                                <TableCell className="text-left font-mono font-medium">{mrn.mrnNo}</TableCell>
                                <TableCell className="text-left font-medium">{formatDate(mrn.mrnDate)}</TableCell>
                                <TableCell className="text-left font-medium max-w-[160px] truncate" title={mrn.store?.description ?? ""}>
                                    {mrn.store?.code ?? `#${mrn.storeId}`}
                                </TableCell>
                                <TableCell className="text-left font-medium">{formatEnumLabel(mrn.mrnType)}</TableCell>
                                <TableCell className="text-left font-medium">{formatEnumLabel(mrn.purchaseType)}</TableCell>
                                <TableCell className="text-left font-medium max-w-[160px] truncate" title={mrn.partyName ?? ""}>
                                    {mrn.partyName ?? "—"}
                                </TableCell>
                                <TableCell className="text-center font-medium">{mrn.mrnDetails.length}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(mrn.totalMRNValue)}</TableCell>
                                <TableCell className="text-center font-medium">
                                    <Badge variant="secondary">{formatEnumLabel(mrn.status)}</Badge>
                                </TableCell>
                                <TableCell className="flex items-center justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button variant="ghost" size="icon" aria-label={`Actions for ${mrn.mrnNo}`} />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleOpenView(mrn)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>
                                            {isMrnEditable(mrn) && (
                                                <DropdownMenuItem onClick={() => handleOpenEdit(mrn)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="w-full flex items-center justify-center gap-4 mt-10">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Button variant="outline" disabled={skip === 0} onClick={() => setSkip((prev) => Math.max(prev - TAKE, 0))}>
                                <PaginationPrevious />
                            </Button>
                        </PaginationItem>
                        {getVisiblePageIndices(skip, TAKE, noOfPages).map((page) => (
                            <PaginationItem key={page}>
                                <Button
                                    variant={skip === page * TAKE ? "default" : "outline"}
                                    onClick={() => setSkip(page * TAKE)}
                                >
                                    {page + 1}
                                </Button>
                            </PaginationItem>
                        ))}
                        <PaginationItem><PaginationEllipsis /></PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={skip + TAKE >= totalMrns}
                                onClick={() => setSkip((prev) => prev + TAKE)}
                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <ViewMRNModal
                mrn={selectedMrn}
                open={viewOpen}
                onClose={closeViewModal}
            />
        </div>
    )
}

export default MRNListTable