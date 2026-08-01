import { useEffect, useState } from 'react'

function pad(n) {
  return (n < 10 ? '0' : '') + n
}

function getTimeLeft(target) {
  const diff = Math.max(0, target.getTime() - Date.now())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return {
    days: String(days),
    hours: pad(hours),
    mins: pad(mins),
    secs: pad(secs),
  }
}

export function useCountdown(targetDate) {
  const target = targetDate instanceof Date ? targetDate : new Date(targetDate)
  const targetTime = target.getTime()
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target))

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(new Date(targetTime)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetTime])

  return timeLeft
}
