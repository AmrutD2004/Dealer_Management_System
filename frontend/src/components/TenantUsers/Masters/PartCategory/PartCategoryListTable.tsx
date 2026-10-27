import { getPartCategoryList } from '@/api/endpoints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import type { PartCategoryConfirmActionType, PartCategoryListType } from '@/Types/partCategoryType'
import dayjs from 'dayjs'
import { Check, Eye, MoreHorizontal, Package, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmPartCategoryActionModal } from '../Modals/ConfirmPartCategoryActionModal'
import { EditPartCategoryModal } from '../Modals/EditPartCategoryModal'
import { ViewPartCategoryModal } from '../Modals/ViewPartCategoryModal'

interface PartCategoryListTableProps {
    refreshKey?: number
}

const PartCategoryListTable = ({ refreshKey = 0 }: PartCategoryListTableProps) => {
    const [categoryList, setCategoryList] = useState<PartCategoryListType[]>([])
    const [selectedCategory, setSelectedCategory] = useState<PartCategoryListType | null>(null)
    const [confirmAction, setConfirmAction] = useState<PartCategoryConfirmActionType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPartCategoryList()
                if (data?.success) {
                    setCategoryList(data?.data ?? [])
                }
            } catch (err: unknown) {
                const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                toast.add({
                    type: 'error',
                    description: message
                })
            }
        }
        load()
    }, [refreshKey, localRefresh])

    const getParentName = (category: PartCategoryListType) => {
        if (category.parent) {
            return `${category.parent.code} - ${category.parent.name}`
        }
        return category.parentId ? `#${category.parentId}` : '—'
    }

    const openView = (category: PartCategoryListType) => {
        setSelectedCategory(category)
        setViewOpen(true)
    }

    const openEdit = (category: PartCategoryListType) => {
        setSelectedCategory(category)
        setEditOpen(true)
    }

    const openConfirmAction = (type: 'deactivate' | 'activate', category: PartCategoryListType) => {
        setConfirmAction({
            type,
            categoryId: category.id,
            categoryName: category.name,
        })
        setConfirmOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setConfirmOpen(false)
        setSelectedCategory(null)
        setConfirmAction(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of part categories.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Category Code</TableHead>
                        <TableHead className="text-left text-muted-foreground">Category Name</TableHead>
                        <TableHead className="text-left text-muted-foreground">Parent Category</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-center text-muted-foreground">Created</TableHead>
                        <TableHead className="text-center text-muted-foreground">Updated</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {categoryList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No part categories created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        categoryList.map((category: PartCategoryListType, idx: number) => (
                            <TableRow key={category.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono'>{category.code}</TableCell>
                                <TableCell className='text-left flex items-center gap-3'>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                        <Package className="h-4 w-4" />
                                    </span>
                                    {category.name}
                                </TableCell>
                                <TableCell className='text-left font-medium'>{getParentName(category)}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={category.isActive ? 'success' : 'destructive'}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center whitespace-nowrap">{dayjs(category.createdAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className="text-center whitespace-nowrap">{dayjs(category.updatedAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${category.name}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(category)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(category)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => openConfirmAction(category.isActive ? 'deactivate' : 'activate', category)}
                                                className={category.isActive ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                            >
                                                {category.isActive ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                                {category.isActive ? "Deactivate" : "Activate"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <ViewPartCategoryModal category={selectedCategory} open={viewOpen} onClose={closeModals} />
            <EditPartCategoryModal
                key={selectedCategory?.id ?? 'none'}
                category={selectedCategory}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
            <ConfirmPartCategoryActionModal
                confirmAction={confirmAction}
                open={confirmOpen}
                onClose={closeModals}
                onDone={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default PartCategoryListTable
