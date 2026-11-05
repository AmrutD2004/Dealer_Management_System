import {
  getLabourList,
  getPartMasterList,
  getRepairOrderList,
  getServiceCategoryList,
  getServiceTypeList,
  getVehicleList,
  updateServiceQuotation,
} from "@/api/endpoints"
import { ServiceQuotationCreateForm } from "@/components/TenantUsers/ServiceQuotation/ServiceQuotationCreateForm"
import type { serviceQuotationListType } from "@/Types/serviceQuotationType"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/api/endpoints", () => ({
  createServiceQuotation: vi.fn(),
  findCustomer: vi.fn(),
  getLabourList: vi.fn(),
  getPartMasterList: vi.fn(),
  getRepairOrderList: vi.fn(),
  getServiceCategoryList: vi.fn(),
  getServiceTypeList: vi.fn(),
  getVehicleList: vi.fn(),
  searchedServiceQuotation: vi.fn(),
  updateServiceQuotation: vi.fn(),
}))

vi.mock("@/components/ui/toast", () => ({
  toast: { add: vi.fn() },
}))

const mockedGetVehicleList = vi.mocked(getVehicleList)
const mockedGetServiceCategoryList = vi.mocked(getServiceCategoryList)
const mockedGetServiceTypeList = vi.mocked(getServiceTypeList)
const mockedGetRepairOrderList = vi.mocked(getRepairOrderList)
const mockedGetPartMasterList = vi.mocked(getPartMasterList)
const mockedGetLabourList = vi.mocked(getLabourList)
const mockedUpdateServiceQuotation = vi.mocked(updateServiceQuotation)

const quotation = {
  id: 42,
  tenantId: 1,
  branchId: 1,
  quotationNo: "Q-1001",
  originalQuotationId: null,
  action: "NEW",
  status: "DRAFT",
  vehicleId: 7,
  customerId: 3,
  currentReading: 15000,
  serviceCategoryId: 2,
  serviceTypeId: 4,
  repairOrderTypeId: 5,
  insurancePartyName: null,
  partsBasicAmount: 0,
  partsDiscountAmount: 0,
  partsTaxAmount: 0,
  partsTotalAmount: 0,
  labourBasicAmount: 0,
  labourDiscountAmount: 0,
  labourTaxAmount: 0,
  labourTotalAmount: 0,
  grandTotal: 0,
  closeAt: null,
  createdBy: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  customer: null,
  originalQuotation: null,
  vehicle: null,
  serviceCategory: null,
  serviceType: null,
  repairOrderType: null,
  branch: null,
  createdByEmployee: null,
  serviceQuotationParts: [],
  serviceQuotationLabours: [],
  serviceQuotationCustomerVoices: [],
} as serviceQuotationListType

describe("ServiceQuotationCreateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedGetVehicleList.mockResolvedValue({ success: true, data: [] })
    mockedGetServiceCategoryList.mockResolvedValue({ success: true, data: [] })
    mockedGetServiceTypeList.mockResolvedValue({ success: true, data: [] })
    mockedGetRepairOrderList.mockResolvedValue({ success: true, data: [] })
    mockedGetPartMasterList.mockResolvedValue({ success: true, data: [] })
    mockedGetLabourList.mockResolvedValue({ success: true, data: [] })
    mockedUpdateServiceQuotation.mockResolvedValue({
      success: true,
      message: "Quotation updated",
    })
  })

  it("submits the quotation payload when updating an existing quotation", async () => {
    const user = userEvent.setup()
    const onUpdated = vi.fn()

    render(
      <ServiceQuotationCreateForm
        quotation={quotation}
        onCancel={vi.fn()}
        onUpdated={onUpdated}
      />
    )

    await waitFor(() => expect(mockedGetVehicleList).toHaveBeenCalled())

    await user.click(
      screen.getByRole("button", { name: /update service quotation/i })
    )

    await waitFor(() => {
      expect(mockedUpdateServiceQuotation).toHaveBeenCalledWith(
        {
          action: "NEW",
          status: "DRAFT",
          vehicleId: 7,
          customerId: 3,
          currentReading: 15000,
          serviceCategoryId: 2,
          serviceTypeId: 4,
          repairOrderTypeId: 5,
          insurancePartyName: null,
          originalQuotationId: null,
          parts: [],
          labours: [],
          customerVoices: [],
        },
        42
      )
    })
    expect(onUpdated).toHaveBeenCalled()
  })
})
