import DashboardLayout from '@/components/layout/PlatformLayout/DashboardLayout'
import TenantListTable from '@/components/PlatformUsers/Tables/TenantListTable'
import TenantHeader from '@/components/PlatformUsers/TenantHeader'

const Tenant = () => {
  return (
    <DashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <TenantHeader />
                </section>
                <section>
                    <TenantListTable />
                </section>
            </div>
    </DashboardLayout>
  )
}

export default Tenant
