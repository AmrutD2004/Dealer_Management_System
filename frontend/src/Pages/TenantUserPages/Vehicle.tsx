import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import VehicleHeader from '@/components/TenantUsers/Vehicle/VehicleHeader'
import VehicleListTable from '@/components/TenantUsers/Vehicle/VehicleListTable'

const Vehicle = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <VehicleHeader />
        </section>
        <section>
          <VehicleListTable />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Vehicle
