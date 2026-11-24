import { getMRNList } from '@/api/endpoints'
import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import { MRNEditForm } from '@/components/TenantUsers/MRN/MRNEditForm'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/utils'
import type { mrnListType } from '@/Types/mrnType'
import { ArrowLeft, Loader2, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const MRNEdit = () => {
    const navigate = useNavigate()
    const { id, mrnId } = useParams()
    const [mrn, setMrn] = useState<mrnListType | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const goBack = () => navigate(`/tenant/${id}/mrn`)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                const mrnData = await getMRNList()
                const list: mrnListType[] = Array.isArray(mrnData?.data) ? mrnData.data : []
                const found = list.find((item) => String(item.id) === String(mrnId)) ?? null
                if (!cancelled) {
                    setMrn(found)
                    if (!found) setError('MRN not found')
                }
            } catch (err: unknown) {
                if (!cancelled) setError(getErrorMessage(err))
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [mrnId])

    return (
        <TenantDashboardLayout>
            <div className='min-h-screen'>
                <div className='mx-auto max-w-7xl space-y-6'>
                    <div className='flex items-start justify-between gap-4 px-7 py-5'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <Pencil />
                                <h1 className='text-2xl font-semibold tracking-tight text-foreground'>Edit MRN</h1>
                            </div>
                            <p className='mt-1 text-sm text-muted-foreground'>Update the MRN details and save changes. Store, date and MRN type cannot be changed.</p>
                        </div>
                        <Button variant='outline' onClick={goBack} className='mt-1 gap-2'>
                            <ArrowLeft className='h-4 w-4' />
                            Back
                        </Button>
                    </div>

                    <div className='rounded-2xl border px-6 shadow-sm mx-5 mb-5'>
                        {loading ? (
                            <div className='flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground'>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                Loading MRN...
                            </div>
                        ) : error ? (
                            <div className='py-10 text-center text-sm text-destructive'>{error}</div>
                        ) : mrn ? (
                            <MRNEditForm key={mrn.id} mrn={mrn} onCancel={goBack} onUpdated={goBack} />
                        ) : null}
                    </div>
                </div>
            </div>
        </TenantDashboardLayout>
    )
}

export default MRNEdit
