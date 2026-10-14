import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import LabourHeader from '@/components/TenantUsers/Masters/Labour/LabourHeader'
import LabourListTable from '@/components/TenantUsers/Masters/Labour/LabourListTable'
import { useState } from 'react'

const Labour = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <LabourHeader onCreated={() => setRefreshKey(key => key + 1)} />
        </section>
        <section>
          <LabourListTable refreshKey={refreshKey} />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Labour
