import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import JobCardHeader from '@/components/TenantUsers/JobCard/JobCardHeader'
import JobCardListTable from '@/components/TenantUsers/JobCard/JobCardListTable'

const JobCard = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <JobCardHeader />
        </section>
        <section>
          <JobCardListTable />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default JobCard
