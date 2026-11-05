import { createPartCategory } from "@/api/endpoints"
import { CreatePartCategoryModal } from "@/components/TenantUsers/Masters/Modals/CreatePartCategoryModal"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/api/endpoints", () => ({
  createPartCategory: vi.fn(),
}))

vi.mock("@/components/ui/toast", () => ({
  toast: { add: vi.fn() },
}))

const mockedCreatePartCategory = vi.mocked(createPartCategory)

describe("CreatePartCategoryModal", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("creates a part category and closes the modal", async () => {
    const user = userEvent.setup()
    const setOpen = vi.fn()
    const onCreated = vi.fn()
    mockedCreatePartCategory.mockResolvedValue({
      success: true,
      message: "Category created",
    })

    render(
      <CreatePartCategoryModal
        open
        setOpen={setOpen}
        onCreated={onCreated}
      />
    )

    await user.type(screen.getByPlaceholderText("e.g. ENGINE"), "  ENGINE  ")
    await user.type(
      screen.getByPlaceholderText("e.g. Engine Parts"),
      "  Engine Parts  "
    )
    await user.click(screen.getByRole("button", { name: /create category/i }))

    await waitFor(() => {
      expect(mockedCreatePartCategory).toHaveBeenCalledWith({
        code: "ENGINE",
        name: "Engine Parts",
      })
    })
    expect(onCreated).toHaveBeenCalled()
    await waitFor(() => expect(setOpen).toHaveBeenCalledWith(false))
  })

  it("does not call the API when required fields are missing", async () => {
    const user = userEvent.setup()
    const setOpen = vi.fn()

    render(<CreatePartCategoryModal open setOpen={setOpen} />)

    await user.click(screen.getByRole("button", { name: /create category/i }))

    expect(mockedCreatePartCategory).not.toHaveBeenCalled()
  })
})
