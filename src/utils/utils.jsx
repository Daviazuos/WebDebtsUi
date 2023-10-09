
export function refreshPage() {
    window.location.reload();
  }

export function getMonthYear() {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  return {'month': mm, 'year': yyyy}
}