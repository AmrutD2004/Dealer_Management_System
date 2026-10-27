import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import DealerBayHeader from '@/components/TenantUsers/Masters/DealerBay/DealerBayHeader'
import DealerBayListTable from '@/components/TenantUsers/Masters/DealerBay/DealerBayListTable'
import { useState } from 'react'

const DealerBay = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <TenantDashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <DealerBayHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <DealerBayListTable refreshKey={refreshKey} />
                </section>
            </div>
        </TenantDashboardLayout>
    )
}

export default DealerBay
