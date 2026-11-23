import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import BranchPartMasterHeader from '@/components/TenantUsers/Masters/BranchPartMaster/BranchPartMasterHeader'
import BranchPartMasterListTable from '@/components/TenantUsers/Masters/BranchPartMaster/BranchPartMasterListTable'
import { useState } from 'react'

const BranchPartMaster = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <TenantDashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <BranchPartMasterHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <BranchPartMasterListTable refreshKey={refreshKey} />
                </section>
            </div>
        </TenantDashboardLayout>
    )
}

export default BranchPartMaster
