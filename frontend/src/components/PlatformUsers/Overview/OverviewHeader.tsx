import { LayoutDashboard } from 'lucide-react'

const OverviewHeader = () => {
    return (
        <div className='flex w-full items-center text-foreground'>
            <div className='flex flex-col items-start gap-2'>
                <div className='flex items-center gap-2'>
                    <LayoutDashboard />
                    <h1 className='font-semibold tracking-tight text-2xl text-foreground'>Overview</h1>
                </div>
                <p className='text-muted-foreground font-medium text-sm'>Quick snapshot of the DMS platform.</p>
            </div>
        </div>
    )
}

export default OverviewHeader
