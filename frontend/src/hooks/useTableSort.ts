import { useState } from 'react'

export type SortDirection = 'asc' | 'desc'

export type SortAccessors<T> = Record<string, (row: T) => unknown>

export const useTableSort = <T,>(data: T[], accessors: SortAccessors<T> = {}) => {
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

    const toggleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            return
        }
        setSortKey(key)
        setSortDirection('asc')
    }

    const sortedData = sortKey
        ? [...data].sort((a, b) => {
            const accessor = accessors[sortKey] ?? ((row: T) => (row as Record<string, unknown>)[sortKey])
            const aValue = accessor(a)
            const bValue = accessor(b)

            if (aValue === null || aValue === undefined) return bValue === null || bValue === undefined ? 0 : 1
            if (bValue === null || bValue === undefined) return -1

            let result: number
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                result = aValue - bValue
            } else if (aValue instanceof Date && bValue instanceof Date) {
                result = aValue.getTime() - bValue.getTime()
            } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                result = Number(aValue) - Number(bValue)
            } else {
                result = String(aValue).localeCompare(String(bValue), undefined, { numeric: true, sensitivity: 'base' })
            }
            return sortDirection === 'asc' ? result : -result
        })
        : data

    return { sortedData, sortKey, sortDirection, toggleSort }
}
