export function downloadWeddingIcs() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Diogo e Amanda//Save the Date//PT',
    'BEGIN:VEVENT',
    'UID:diogo-amanda-2026@savethedate',
    'DTSTAMP:20260801T120000Z',
    'DTSTART:20261024T190000Z',
    'DTEND:20261024T230000Z',
    'SUMMARY:Casamento de Diogo & Amanda',
    'LOCATION:Garden 821 - Tv. Nove de Janeiro, 821, Belém - PA',
    'DESCRIPTION:Reserve a data! Mais informações em breve.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'diogo-e-amanda.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
