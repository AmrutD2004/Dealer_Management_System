import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import RoleHeader from '@/components/TenantUsers/Masters/Role/RoleHeader'
import RoleListTable from '@/components/TenantUsers/Masters/Role/RoleListTable'

const Role = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <RoleHeader />
        </section>
        <section>
          <RoleListTable />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Role
