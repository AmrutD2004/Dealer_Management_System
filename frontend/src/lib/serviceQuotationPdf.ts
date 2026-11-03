import type { serviceQuotationListType } from "@/Types/serviceQuotationType"
import dayjs from "dayjs"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import {
  formatDiscountPercent,
  sourceLabels,
  statusLabels,
} from "@/components/TenantUsers/ServiceQuotation/serviceQuotationUtils"

const money = (value: string | number) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const text = (value?: string | number | null) =>
  value === null || value === undefined || value === "" ? "-" : String(value)

const getFinalY = (doc: jsPDF) =>
  (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
    ?.finalY ?? 0

export function downloadServiceQuotationPdf(quotation: serviceQuotationListType) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 14

  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("SERVICE QUOTATION", marginX, 18)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(text(quotation.branch?.branchName), marginX, 25)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text(text(quotation.quotationNo), pageWidth - marginX, 18, {
    align: "right",
  })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text(`Status: ${statusLabels[quotation.status]}`, pageWidth - marginX, 24, {
    align: "right",
  })
  doc.text(
    `Date: ${quotation.createdAt ? dayjs(quotation.createdAt).format("DD MMM YYYY") : "-"}`,
    pageWidth - marginX,
    29,
    { align: "right" }
  )

  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.6)
  doc.line(marginX, 33, pageWidth - marginX, 33)

  const customerName = quotation.customer
    ? `${quotation.customer.title ? `${quotation.customer.title} ` : ""}${quotation.customer.firstName} ${quotation.customer.lastName}`
    : "-"
  const vehicleName = quotation.vehicle
    ? `${quotation.vehicle.vehicleNumber || quotation.vehicle.chassisNumber || "-"} - ${quotation.vehicle.brand?.brandName ?? ""} ${quotation.vehicle.model?.modelName ?? ""} ${quotation.vehicle.variant?.variantName ?? ""}`.trim()
    : "-"
  const address = quotation.customer
    ? [
        quotation.customer.address1,
        quotation.customer.address2,
        quotation.customer.city,
        quotation.customer.state,
        quotation.customer.pincode,
      ]
        .filter(Boolean)
        .join(", ")
    : ""

  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  let infoY = 40
  const infoLeft = [
    ["Customer", customerName],
    ["Mobile", text(quotation.customer?.mobileNo)],
    ["Address", address || "-"],
  ]
  const infoRight = [
    ["Vehicle", vehicleName || "-"],
    ["Current Reading", text(quotation.currentReading)],
    ["Service Category", text(quotation.serviceCategory?.name)],
    ["Service Type", text(quotation.serviceType?.name)],
    ["Repair Order Type", text(quotation.repairOrderType?.name)],
    ["Insurance Party", text(quotation.insurancePartyName)],
  ]

  infoLeft.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold")
    doc.text(`${label}:`, marginX, infoY)
    doc.setFont("helvetica", "normal")
    doc.text(doc.splitTextToSize(value, 75), marginX + 26, infoY)
    infoY += value.length > 45 ? 10 : 5
  })

  let rightY = 40
  infoRight.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold")
    doc.text(`${label}:`, pageWidth / 2 + 4, rightY)
    doc.setFont("helvetica", "normal")
    doc.text(doc.splitTextToSize(value, 62), pageWidth / 2 + 30, rightY)
    rightY += value.length > 40 ? 10 : 5
  })

  let startY = Math.max(infoY, rightY) + 4

  if (quotation.serviceQuotationParts?.length) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    doc.text("Parts", marginX, startY)
    startY += 3

    autoTable(doc, {
      startY,
      head: [
        [
          "Part No.",
          "Description",
          "Qty",
          "Rate",
          "Disc %",
          "Discount",
          "Tax",
          "Total",
        ],
      ],
      body: quotation.serviceQuotationParts.map((part) => [
        text(part.partNo),
        text(part.partDescription),
        String(part.quantity),
        money(part.rate),
        formatDiscountPercent(
          part.discountType,
          part.discountRate,
          part.discountAmount,
          part.basicAmount
        ),
        money(part.discountAmount),
        money(part.taxAmount),
        money(part.totalAmount),
      ]),
      theme: "grid",
      styles: { fontSize: 7.5, cellPadding: 2, textColor: [40, 40, 40] },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      columnStyles: {
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
      },
      margin: { left: marginX, right: marginX },
    })
    startY = getFinalY(doc) + 8
  }

  if (quotation.serviceQuotationLabours?.length) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    doc.text("Labours", marginX, startY)
    startY += 3

    autoTable(doc, {
      startY,
      head: [["Labour", "Rate", "Disc %", "Discount", "Tax", "Total"]],
      body: quotation.serviceQuotationLabours.map((labour) => [
        `${text(labour.labourCode)} - ${text(labour.labourName)}`,
        money(labour.rate),
        formatDiscountPercent(
          labour.discountType,
          labour.discountRate,
          labour.discountAmount,
          labour.basicAmount
        ),
        money(labour.discountAmount),
        money(labour.taxAmount),
        money(labour.totalAmount),
      ]),
      theme: "grid",
      styles: { fontSize: 7.5, cellPadding: 2, textColor: [40, 40, 40] },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
      margin: { left: marginX, right: marginX },
    })
    startY = getFinalY(doc) + 8
  }

  if (quotation.serviceQuotationCustomerVoices?.length) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    doc.text("Customer Voice", marginX, startY)
    startY += 3

    autoTable(doc, {
      startY,
      head: [["Customer Voice", "Source"]],
      body: quotation.serviceQuotationCustomerVoices.map((voice) => [
        voice.customerVoice,
        sourceLabels[voice.source] ?? voice.source,
      ]),
      theme: "grid",
      styles: { fontSize: 7.5, cellPadding: 2, textColor: [40, 40, 40] },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      columnStyles: { 1: { cellWidth: 45 } },
      margin: { left: marginX, right: marginX },
    })
    startY = getFinalY(doc) + 8
  }

  if (startY > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage()
    startY = 20
  }

  autoTable(doc, {
    startY,
    head: [["Amount Summary", ""]],
    body: [
      ["Parts Basic", money(quotation.partsBasicAmount)],
      ["Parts Discount", money(quotation.partsDiscountAmount)],
      ["Parts Tax", money(quotation.partsTaxAmount)],
      ["Parts Total", money(quotation.partsTotalAmount)],
      ["Labour Basic", money(quotation.labourBasicAmount)],
      ["Labour Discount", money(quotation.labourDiscountAmount)],
      ["Labour Tax", money(quotation.labourTaxAmount)],
      ["Labour Total", money(quotation.labourTotalAmount)],
      ["Grand Total", money(quotation.grandTotal)],
    ],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2, textColor: [40, 40, 40] },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { fontStyle: "bold" },
      1: { halign: "right" },
    },
    tableWidth: 80,
    margin: { left: pageWidth - marginX - 80 },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index === 8) {
        data.cell.styles.fontStyle = "bold"
        data.cell.styles.fillColor = [235, 241, 255]
        data.cell.styles.textColor = [15, 23, 42]
      }
    },
  })

  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(130, 130, 130)
    doc.text(
      `Generated on ${dayjs().format("DD MMM YYYY, hh:mm A")}`,
      marginX,
      doc.internal.pageSize.getHeight() - 8
    )
    doc.text(
      `Page ${page} of ${pageCount}`,
      pageWidth - marginX,
      doc.internal.pageSize.getHeight() - 8,
      { align: "right" }
    )
  }

  const fileName = `${(quotation.quotationNo || "service-quotation").replace(/[^\w-]+/g, "_")}.pdf`
  doc.save(fileName)
}
