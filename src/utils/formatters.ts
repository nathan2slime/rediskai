/**
 * Format an ISO date string using the en-US locale.
 * @example
 * formatDateTime('2026-02-14T12:00:00.000Z')
 */
export const formatDateTime = (dateIso?: string) => {
  if (!dateIso) return 'never tested'
  return new Date(dateIso).toLocaleString('en-US')
}
