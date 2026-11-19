import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import StorageHeader from '@/components/TenantUsers/Masters/Storage/StorageHeader'
import StorageListTable from '@/components/TenantUsers/Masters/Storage/StorageListTable'

const Storage = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section><StorageHeader /></section>
        <section><StorageListTable /></section>
      </div>
    </TenantDashboardLayout>
  )
}

export default Storage