import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import DesignationHeader from '@/components/TenantUsers/Masters/Designation/DesignationHeader'
import DesignationListTable from '@/components/TenantUsers/Masters/Designation/DesignationListTable'

const Designation = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <DesignationHeader />
        </section>
        <section>
          <DesignationListTable />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Designation
