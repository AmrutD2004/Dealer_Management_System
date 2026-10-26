import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import BranchHeader from '@/components/TenantUsers/Masters/Branch/BranchHeader'
import BranchListTable from '@/components/TenantUsers/Masters/Branch/BranchListTable'

const Branch = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <BranchHeader />
                </section>
                <section>
                    <BranchListTable />
                </section>
            </div>
    </TenantDashboardLayout>
  )
}

export default Branch
