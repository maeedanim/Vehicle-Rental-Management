export function calculateRentalDays(
  startDate: string,
  endDate: string,
): number {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.floor(
    (end.getTime() - start.getTime()) / millisecondsPerDay,
  ) + 1;
}