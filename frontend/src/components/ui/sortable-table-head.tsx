import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { TableHead } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { SortDirection } from '@/hooks/useTableSort'

interface SortableTableHeadProps {
    label: string
    sortKey: string
    activeKey: string | null
    direction: SortDirection
    onSort: (key: string) => void
    className?: string
}

const SortableTableHead = ({ label, sortKey, activeKey, direction, onSort, className }: SortableTableHeadProps) => {
    const isActive = activeKey === sortKey
    return (
        <TableHead className={cn('text-left text-muted-foreground', className)}>
            <button
                type="button"
                onClick={() => onSort(sortKey)}
                className="inline-flex items-center gap-1 font-medium transition-colors hover:text-foreground"
            >
                {label}
                {isActive ? (
                    direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                )}
            </button>
        </TableHead>
    )
}

export default SortableTableHead
