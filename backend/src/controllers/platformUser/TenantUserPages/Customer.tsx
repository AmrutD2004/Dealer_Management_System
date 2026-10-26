import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import CustomerHeader from '@/components/TenantUsers/Customer/CustomerHeader'
import CustomerListTable from '@/components/TenantUsers/Customer/CustomerListTable'
import { useState } from 'react'

const Customer = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <CustomerHeader onCreated={() => setRefreshKey(key => key + 1)} />
        </section>
        <section>
          <CustomerListTable refreshKey={refreshKey} />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Customer