import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import ServiceAppointmentHeader from '@/components/TenantUsers/ServiceAppointment/ServiceAppointmentHeader'
import ServiceAppointmentListTable from '@/components/TenantUsers/ServiceAppointment/ServiceAppointmentListTable'

const ServiceAppointment = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <ServiceAppointmentHeader />
        </section>
        <section>
          <ServiceAppointmentListTable />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default ServiceAppointment
