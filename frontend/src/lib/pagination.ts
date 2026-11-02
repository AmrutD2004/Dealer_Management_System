export const getVisiblePageIndices = (
    offset: number,
    pageSize: number,
    totalPages: number
): number[] => {
    if (totalPages <= 0 || pageSize <= 0) return []

    const current = Math.min(
        Math.max(Math.floor(offset / pageSize), 0),
        totalPages - 1
    )

    const indices = new Set([current, current + 1, totalPages - 1])

    return [...indices]
        .filter((index) => index >= 0 && index < totalPages)
        .sort((a, b) => a - b)
}
