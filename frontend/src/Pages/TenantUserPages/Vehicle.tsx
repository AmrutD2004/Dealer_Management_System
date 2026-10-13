import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import VehicleHeader from '@/components/TenantUsers/Vehicle/VehicleHeader'
import VehicleListTable from '@/components/TenantUsers/Vehicle/VehicleListTable'
import { useState } from 'react'

const Vehicle = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <VehicleHeader onCreated={() => setRefreshKey(key => key + 1)} />
        </section>
        <section>
          <VehicleListTable refreshKey={refreshKey} />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Vehicle