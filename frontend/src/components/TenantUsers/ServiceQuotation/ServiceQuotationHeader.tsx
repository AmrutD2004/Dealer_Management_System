import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { useNavigate, useParams } from 'react-router-dom'

const ServiceQuotationHeader = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    return (
        <div className='flex w-full items-center text-foreground'>
            <div className='flex flex-col items-start gap-2'>
                <div className='flex items-center gap-2'>
                    <FileText /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Service Quotation Management</h1>
                </div>
                <p className='text-sm text-muted-foreground'>Create and manage service quotations for vehicles.</p>
            </div>
            <div className='ms-auto'>
                <Button className={cn('flex items-center gap-2')} onClick={() => navigate(`/tenant/${id}/service-quotation/create`)}>
                    <Plus />Create Service Quotation
                </Button>
            </div>
        </div>
    )
}

export default ServiceQuotationHeader
