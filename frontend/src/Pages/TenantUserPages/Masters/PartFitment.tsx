import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import PartFitmentHeader from '@/components/TenantUsers/Masters/PartFitment/PartFitmentHeader'
import PartFitmentListTable from '@/components/TenantUsers/Masters/PartFitment/PartFitmentListTable'
import { useState } from 'react'

const PartFitment = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <TenantDashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <PartFitmentHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <PartFitmentListTable refreshKey={refreshKey} />
                </section>
            </div>
        </TenantDashboardLayout>
    )
}

export default PartFitment
