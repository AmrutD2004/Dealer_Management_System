import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import CustomerHeader from '@/components/TenantUsers/Customer/CustomerHeader'
import CustomerListTable from '@/components/TenantUsers/Customer/CustomerListTable'

const Customer = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <CustomerHeader />
        </section>
        <section>
          <CustomerListTable />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Customer
