const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

/** "4 Oct 2026": same as the web's en-GB short date, without depending on Intl locale data. */
export function formatDate(value: string | Date): string {
  const d = new Date(value);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "4 Oct 2026, 18:05" */
export function formatDateTime(value: string | Date): string {
  const d = new Date(value);
  return `${formatDate(d)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
