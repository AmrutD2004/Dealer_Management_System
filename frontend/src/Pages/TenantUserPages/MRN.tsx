import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import MRNHeader from '@/components/TenantUsers/MRN/MRNHeader'
import MRNListTable from '@/components/TenantUsers/MRN/MRNListTable'

const MRN = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <MRNHeader />
        </section>
        <section>
          <MRNListTable />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default MRN
