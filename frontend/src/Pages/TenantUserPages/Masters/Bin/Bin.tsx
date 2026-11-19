import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import BinHeader from '@/components/TenantUsers/Masters/Bin/BinHeader'
import BinListTable from '@/components/TenantUsers/Masters/Bin/BinListTable'

const Bin = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section><BinHeader /></section>
        <section><BinListTable /></section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Bin