import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import PartMasterHeader from '@/components/TenantUsers/Masters/PartMaster/PartMasterHeader'
import PartMasterListTable from '@/components/TenantUsers/Masters/PartMaster/PartMasterListTable'
import { useState } from 'react'

const PartMaster = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <TenantDashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <PartMasterHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <PartMasterListTable refreshKey={refreshKey} />
                </section>
            </div>
        </TenantDashboardLayout>
    )
}

export default PartMaster
