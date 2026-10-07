import DashboardLayout from '@/components/layout/PlatformLayout/DashboardLayout'
import KpiCards from '@/components/PlatformUsers/Overview/KpiCards'
import OverviewHeader from '@/components/PlatformUsers/Overview/OverviewHeader'
import RecentTenants from '@/components/PlatformUsers/Overview/RecentTenants'

const Overview = () => {
  return (
    <DashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <OverviewHeader />
        </section>
        <section className='mt-7'>
          <KpiCards />
        </section>
        <section>
          <RecentTenants />
        </section>
      </div>
    </DashboardLayout>
  )
}

export default Overview
