import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'

const JobCard = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <h1 className='text-2xl font-semibold'>Job Card</h1>
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default JobCard