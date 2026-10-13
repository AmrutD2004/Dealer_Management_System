import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import RepairOrderHeader from '@/components/TenantUsers/Masters/RepairOrder/RepairOrderHeader'
import RepairOrderListTable from '@/components/TenantUsers/Masters/RepairOrder/RepairOrderListTable'
import { useState } from 'react'

const RepairOrder = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <RepairOrderHeader onCreated={() => setRefreshKey(key => key + 1)} />
        </section>
        <section>
          <RepairOrderListTable refreshKey={refreshKey} />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default RepairOrder