import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import HSNMasterHeader from '@/components/TenantUsers/Masters/HSNMaster/HSNMasterHeader'
import HSNMasterListTable from '@/components/TenantUsers/Masters/HSNMaster/HSNMasterListTable'
import { useState } from 'react'

const HSNMaster = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <TenantDashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <HSNMasterHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <HSNMasterListTable refreshKey={refreshKey} />
                </section>
            </div>
        </TenantDashboardLayout>
    )
}

export default HSNMaster
