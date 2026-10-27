import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import JobCardAllocationHeader from '@/components/TenantUsers/JobCardAllocation/JobCardAllocationHeader'
import JobCardAllocationListTable from '@/components/TenantUsers/JobCardAllocation/JobCardAllocationListTable'
import { useState } from 'react'

const JobCardAllocation = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <TenantDashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <JobCardAllocationHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <JobCardAllocationListTable refreshKey={refreshKey} />
                </section>
            </div>
        </TenantDashboardLayout>
    )
}

export default JobCardAllocation
