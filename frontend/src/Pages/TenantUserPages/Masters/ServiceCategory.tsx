import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import ServiceCategoryHeader from '@/components/TenantUsers/Masters/ServiceCategory/ServiceCategoryHeader'
import ServiceCategoryListTable from '@/components/TenantUsers/Masters/ServiceCategory/ServiceCategoryListTable'
import { useState } from 'react'

const ServiceCategory = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <ServiceCategoryHeader onCreated={() => setRefreshKey(key => key + 1)} />
        </section>
        <section>
          <ServiceCategoryListTable refreshKey={refreshKey} />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default ServiceCategory
