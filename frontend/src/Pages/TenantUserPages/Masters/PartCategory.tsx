import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import PartCategoryHeader from '@/components/TenantUsers/Masters/PartCategory/PartCategoryHeader'
import PartCategoryListTable from '@/components/TenantUsers/Masters/PartCategory/PartCategoryListTable'
import { useState } from 'react'

const PartCategory = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <TenantDashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <PartCategoryHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <PartCategoryListTable refreshKey={refreshKey} />
                </section>
            </div>
        </TenantDashboardLayout>
    )
}

export default PartCategory
