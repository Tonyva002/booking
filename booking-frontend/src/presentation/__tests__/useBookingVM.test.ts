import { renderHook } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { useBookingVM } from "../viewmodels/useBookingsVM"

describe("useBookingVM", () => {

  it("should load bookings", async () => {

    const { result } = renderHook(() => useBookingVM())

    expect(result.current.bookings).toBeDefined()

  })

})