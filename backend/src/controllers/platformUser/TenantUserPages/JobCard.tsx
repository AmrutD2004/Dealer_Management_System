import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import JobCardHeader from '@/components/TenantUsers/JobCard/JobCardHeader'
import JobCardListTable from '@/components/TenantUsers/JobCard/JobCardListTable'
import { useState } from 'react'

const JobCard = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <JobCardHeader onCreated={() => setRefreshKey(key => key + 1)} />
        </section>
        <section>
          <JobCardListTable refreshKey={refreshKey} />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default JobCard
