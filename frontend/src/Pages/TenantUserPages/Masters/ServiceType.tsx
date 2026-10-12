import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import ServiceTypeHeader from '@/components/TenantUsers/Masters/ServiceType/ServiceTypeHeader'
import ServiceTypeListTable from '@/components/TenantUsers/Masters/ServiceType/ServiceTypeListTable'
import { useState } from 'react'

const ServiceType = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <ServiceTypeHeader onCreated={() => setRefreshKey(key => key + 1)} />
        </section>
        <section>
          <ServiceTypeListTable refreshKey={refreshKey} />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default ServiceType
