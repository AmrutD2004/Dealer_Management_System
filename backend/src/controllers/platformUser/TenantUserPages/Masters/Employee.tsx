import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import EmployeeHeader from '@/components/TenantUsers/Masters/Employee/EmployeeHeader'
import EmployeeListTable from '@/components/TenantUsers/Masters/Employee/EmployeeListTable'

const Employee = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <EmployeeHeader />
        </section>
        <section>
          <EmployeeListTable />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Employee
