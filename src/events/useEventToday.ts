import { useEffect, useState } from 'react';
import { getPenedoDate } from './eventUtils';

export function useEventToday(): string {
  const [today, setToday] = useState(() => getPenedoDate(new Date()));
  useEffect(() => {
    const refresh = () => setToday(getPenedoDate(new Date()));
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  return today;
}
