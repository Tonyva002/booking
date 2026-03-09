export function generateDateRange(days: number) {

  const dates: string[] = []

  const today = new Date()

  for (let i = 0; i < days; i++) {

    const d = new Date(today)

    d.setDate(today.getDate() + i)

    dates.push(d.toISOString().split("T")[0])

  }

  return dates
}