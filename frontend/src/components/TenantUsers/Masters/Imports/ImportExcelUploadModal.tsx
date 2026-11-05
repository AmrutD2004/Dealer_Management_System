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

export interface ImportUploadColumn {
    key: string
    header: string
    label: string
    required?: boolean
    aliases?: string[]
    example?: string
}

export interface ImportUploadResult {
    success?: boolean
    message?: string
    existingCodes?: string[]
    result?: {
        brandsInserted?: number
        modelsInserted?: number
        variantsInserted?: number
    }
}

export interface ImportExcelUploadConfig {
    entityLabel: string
    description?: string
    templateFileName: string
    columns: ImportUploadColumn[]
    mapRow: (row: Record<string, string>) => { row?: Record<string, unknown>; error?: string }
    validateRows?: (rows: Record<string, string>[]) => string[]
    importFile: (file: File) => Promise<ImportUploadResult>
}

interface ImportExcelUploadModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    config: ImportExcelUploadConfig
    onImported?: () => void
}

const PREVIEW_ROWS = 5

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const getErrorMessage = (err: unknown) => {
    const responseMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    if (responseMessage) return responseMessage
    return err instanceof Error ? err.message : 'Unknown error'
}

const getErrorResponse = (err: unknown): ImportUploadResult => {
    const responseData = (err as { response?: { data?: ImportUploadResult } })?.response?.data
    return {
        ...responseData,
        success: false,
        message: responseData?.message ?? getErrorMessage(err),
    }
}

export function ImportExcelUploadModal({ open, setOpen, config, onImported }: ImportExcelUploadModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState('')
    const [rows, setRows] = useState<Record<string, string>[]>([])
    const [fileErrors, setFileErrors] = useState<string[]>([])
    const [rowErrors, setRowErrors] = useState<string[]>([])
    const [result, setResult] = useState<ImportUploadResult | null>(null)
    const [loading, setLoading] = useState(false)

    const resetState = () => {
        setFileName('')
        setRows([])
        setFileErrors([])
        setRowErrors([])
        setResult(null)
        setLoading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const closeModal = () => {
        resetState()
        setOpen(false)
    }

    const handleDownloadTemplate = () => {
        const templateRow = Object.fromEntries(
            config.columns.map((column) => [column.header, column.example ?? ''])
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
        setRowErrors([])
        setResult(null)

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
                const candidates = [column.header, column.key, column.label, ...(column.aliases ?? [])].map(
                    normalizeHeader
                )
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

        const normalizedRows: Record<string, unknown>[] = []
        const errors: string[] = []

        rows.forEach((row, index) => {
            const mapped = config.mapRow(row)
            if (mapped.error || !mapped.row) {
                errors.push(`Row ${index + 2}: ${mapped.error ?? 'Invalid row data'}`)
                return
            }
            normalizedRows.push(mapped.row)
        })

        errors.push(...(config.validateRows?.(rows) ?? []))

        if (errors.length) {
            setRowErrors(errors)
            return
        }

        setLoading(true)
        setRowErrors([])
        setResult(null)

        try {
            const sheet = XLSX.utils.json_to_sheet(normalizedRows, {
                header: config.columns.map((column) => column.header),
            })
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1')
            const data = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
            const uploadFile = new File([data], config.templateFileName, {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const response = await config.importFile(uploadFile)
            setResult(response)

            if (response.success) {
                toast.add({
                    type: 'success',
                    description: response.message ?? `${config.entityLabel} imported successfully`,
                })
                onImported?.()
            } else {
                toast.add({
                    type: 'error',
                    description: response.message ?? `Unable to import ${config.entityLabel.toLowerCase()}`,
                })
            }
        } catch (err) {
            const errorResponse = getErrorResponse(err)
            setResult(errorResponse)
            toast.add({
                type: 'error',
                description: errorResponse.message ?? `Unable to import ${config.entityLabel.toLowerCase()}`,
            })
        } finally {
            setLoading(false)
        }
    }

    const handleChooseFile = () => {
        fileInputRef.current?.click()
    }

    const requiredColumns = config.columns.filter((column) => column.required)
    const importedSummary = result?.result
        ? [
              result.result.brandsInserted !== undefined ? `${result.result.brandsInserted} brand(s)` : null,
              result.result.modelsInserted !== undefined ? `${result.result.modelsInserted} model(s)` : null,
              result.result.variantsInserted !== undefined
                  ? `${result.result.variantsInserted} variant(s)`
                  : null,
          ]
              .filter(Boolean)
              .join(', ')
        : ''

    return (
        <Dialog open={open}>
            <DialogContent
                showCloseButton={false}
                className="max-h-[90vh] overflow-y-auto scrollbarHide"
                style={{ width: '50vw', maxWidth: '90vw' }}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Import {config.entityLabel} from Excel
                    </DialogTitle>
                    <DialogDescription>
                        {config.description ??
                            `Upload an Excel file to add ${config.entityLabel.toLowerCase()} records in bulk.`}
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

                    {rows.length > 0 && !result && rowErrors.length === 0 && (
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
                            Importing {rows.length} row(s)...
                        </p>
                    )}

                    {rowErrors.length > 0 && (
                        <div className="max-h-40 overflow-auto rounded-none border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                            {rowErrors.map((error) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}

                    {result && (
                        <div
                            className={
                                result.success
                                    ? 'space-y-1 rounded-none border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800'
                                    : 'space-y-1 rounded-none border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800'
                            }
                        >
                            <p>{result.message ?? (result.success ? 'Import completed' : 'Import failed')}</p>
                            {importedSummary && <p>{importedSummary} imported.</p>}
                            {result.existingCodes && result.existingCodes.length > 0 && (
                                <p>Existing codes: {result.existingCodes.join(', ')}</p>
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
                        disabled={loading || rows.length === 0 || fileErrors.length > 0 || Boolean(result)}
                    >
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload />}
                        Import
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
