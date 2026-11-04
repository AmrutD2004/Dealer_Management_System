import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import { Download, FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'

export interface ImportColumn {
    key: string
    label: string
    required?: boolean
    aliases?: string[]
    example?: string
}

export interface ImportExcelConfig {
    entityLabel: string
    description?: string
    templateFileName: string
    columns: ImportColumn[]
    mapRow: (row: Record<string, string>) => { payload?: Record<string, unknown>; error?: string }
    createRecord: (payload: Record<string, unknown>) => Promise<{ success?: boolean; message?: string }>
}

interface ImportExcelModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    config: ImportExcelConfig
    onImported?: () => void
}

interface ImportRowResult {
    rowNumber: number
    success: boolean
    message?: string
}

const PREVIEW_ROWS = 5

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const getErrorMessage = (err: unknown) => {
    const responseMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    if (responseMessage) return responseMessage
    return err instanceof Error ? err.message : 'Unknown error'
}

export function ImportExcelModal({ open, setOpen, config, onImported }: ImportExcelModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState('')
    const [rows, setRows] = useState<Record<string, string>[]>([])
    const [fileErrors, setFileErrors] = useState<string[]>([])
    const [results, setResults] = useState<ImportRowResult[]>([])
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState({ done: 0, total: 0 })

    const closeModal = () => {
        setFileName('')
        setRows([])
        setFileErrors([])
        setResults([])
        setLoading(false)
        setProgress({ done: 0, total: 0 })
        if (fileInputRef.current) fileInputRef.current.value = ''
        setOpen(false)
    }

    const handleDownloadTemplate = () => {
        const templateRow = Object.fromEntries(
            config.columns.map((column) => [column.label, column.example ?? ''])
        )
        const sheet = XLSX.utils.json_to_sheet([templateRow])
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, sheet, 'Template')
        XLSX.writeFile(workbook, config.templateFileName)
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setRows([])
        setFileErrors([])
        setResults([])

        try {
            const buffer = await file.arrayBuffer()
            const workbook = XLSX.read(buffer, { type: 'array' })
            const firstSheetName = workbook.SheetNames[0]
            if (!firstSheetName) {
                setFileErrors(['The selected file does not contain any sheets.'])
                return
            }

            const sheet = workbook.Sheets[firstSheetName]
            const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
                defval: '',
                raw: false,
            })

            if (!rawRows.length) {
                setFileErrors(['The selected sheet does not contain any data rows.'])
                return
            }

            const headers = Object.keys(rawRows[0])
            const normalizedHeaders = new Map<string, string>()
            headers.forEach((header) => normalizedHeaders.set(normalizeHeader(header), header))

            const headerByColumn = new Map<string, string>()
            const missingColumns: string[] = []

            config.columns.forEach((column) => {
                const candidates = [column.label, column.key, ...(column.aliases ?? [])].map(normalizeHeader)
                const matchedHeader = candidates
                    .map((candidate) => normalizedHeaders.get(candidate))
                    .find((header) => header !== undefined)

                if (matchedHeader) {
                    headerByColumn.set(column.key, matchedHeader)
                } else if (column.required) {
                    missingColumns.push(column.label)
                }
            })

            if (missingColumns.length) {
                setFileErrors([`Missing required column(s): ${missingColumns.join(', ')}`])
                return
            }

            const parsedRows = rawRows
                .map((rawRow) => {
                    const mappedRow: Record<string, string> = {}
                    config.columns.forEach((column) => {
                        const header = headerByColumn.get(column.key)
                        const value = header ? rawRow[header] : ''
                        mappedRow[column.key] = value === null || value === undefined ? '' : String(value)
                    })
                    return mappedRow
                })
                .filter((row) => Object.values(row).some((value) => value.trim() !== ''))

            if (!parsedRows.length) {
                setFileErrors(['The selected sheet does not contain any data rows.'])
                return
            }

            setRows(parsedRows)
        } catch (err) {
            setFileErrors([`Unable to read the selected file. ${getErrorMessage(err)}`])
        }
    }

    const handleImport = async () => {
        if (!rows.length) return

        setLoading(true)
        setResults([])
        setProgress({ done: 0, total: rows.length })

        const importResults: ImportRowResult[] = []
        let successCount = 0

        for (let index = 0; index < rows.length; index += 1) {
            const rowNumber = index + 2
            const mapped = config.mapRow(rows[index])

            if (mapped.error || !mapped.payload) {
                importResults.push({
                    rowNumber,
                    success: false,
                    message: mapped.error ?? 'Invalid row data',
                })
            } else {
                try {
                    const data = await config.createRecord(mapped.payload)
                    const success = Boolean(data?.success)
                    if (success) successCount += 1
                    importResults.push({
                        rowNumber,
                        success,
                        message: data?.message,
                    })
                } catch (err) {
                    importResults.push({
                        rowNumber,
                        success: false,
                        message: getErrorMessage(err),
                    })
                }
            }

            setProgress({ done: index + 1, total: rows.length })
        }

        const failureCount = importResults.length - successCount
        setResults([...importResults].sort((a, b) => a.rowNumber - b.rowNumber))
        setLoading(false)

        if (successCount > 0) {
            toast.add({
                type: 'success',
                description: `${successCount} ${config.entityLabel.toLowerCase()} record(s) imported successfully`,
            })
            onImported?.()
        }

        if (failureCount > 0) {
            toast.add({
                type: 'error',
                description: `${failureCount} ${config.entityLabel.toLowerCase()} record(s) failed to import`,
            })
        }
    }

    const handleChooseFile = () => {
        fileInputRef.current?.click()
    }

    const successCount = results.filter((result) => result.success).length
    const failedResults = results.filter((result) => !result.success)
    const requiredColumns = config.columns.filter((column) => column.required)

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-h-[90vh] overflow-y-auto scrollbarHide" style={{ width: '50vw', maxWidth: '90vw' }}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Import {config.entityLabel} from Excel
                    </DialogTitle>
                    <DialogDescription>
                        {config.description ?? `Upload an Excel file to add ${config.entityLabel.toLowerCase()} records in bulk.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="min-w-0 space-y-4 py-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" variant="outline" onClick={handleChooseFile} disabled={loading}>
                            <Upload />Choose File
                        </Button>
                        <Button type="button" variant="ghost" onClick={handleDownloadTemplate}>
                            <Download />Download Template
                        </Button>
                    </div>

                    {requiredColumns.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Required columns: {requiredColumns.map((column) => column.label).join(', ')}
                        </p>
                    )}

                    {fileName && (
                        <p className="text-xs font-medium text-foreground">Selected file: {fileName}</p>
                    )}

                    {fileErrors.length > 0 && (
                        <div className="rounded-none border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                            {fileErrors.map((error) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}

                    {rows.length > 0 && results.length === 0 && (
                        <div className="min-w-0 space-y-2">
                            <p className="text-xs font-medium text-foreground">
                                {rows.length} row(s) found. Showing first {Math.min(PREVIEW_ROWS, rows.length)}:
                            </p>
                            <div className="max-h-72 w-full min-w-0 max-w-full overflow-x-auto overflow-y-auto border border-border">
                                <table className="min-w-max text-left text-xs">
                                    <thead className="bg-muted/40">
                                        <tr>
                                            {config.columns.map((column) => (
                                                <th key={column.key} className="whitespace-nowrap px-2 py-1 font-semibold">
                                                    {column.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.slice(0, PREVIEW_ROWS).map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-t border-border">
                                                {config.columns.map((column) => (
                                                    <td key={column.key} className="whitespace-nowrap px-2 py-1">
                                                        {row[column.key] || '—'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <p className="flex items-center gap-2 text-xs font-medium text-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Importing {progress.done} of {progress.total}...
                        </p>
                    )}

                    {results.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-foreground">
                                {successCount} imported, {failedResults.length} failed.
                            </p>
                            {failedResults.length > 0 && (
                                <div className="max-h-40 overflow-auto rounded-none border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                                    {failedResults.map((result, index) => (
                                        <p key={`${result.rowNumber}-${index}`}>
                                            Row {result.rowNumber}: {result.message ?? 'Failed to import'}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={closeModal} disabled={loading}>
                        Close
                    </Button>
                    <Button
                        type="button"
                        onClick={handleImport}
                        disabled={loading || rows.length === 0 || fileErrors.length > 0 || results.length > 0}
                    >
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload />}
                        Import
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
