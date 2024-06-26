export function hms_to_secs(value: string | undefined): number | undefined {
  if (!value) return undefined;
  var hms = value.split(":");
  return +hms[0] * 60 * 60 + +hms[1] * 60 + (+hms[2] || 0);
}

export function secs_to_hms(value: number | undefined): string | undefined {
  if (!value) return undefined;
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value - hours * 3600) / 60);
  const seconds = value % 60;
  return (
    String(hours) +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
}

export function date_to_str(value: Date): string {
  if (value !== null && !isNaN(value.getTime())) {
    return value.toLocaleTimeString(undefined, {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  }
  return "";
}

export function elapsed_secs(d1: Date, d2: Date): number {
  return Math.round((d1.getTime() - d2.getTime()) / 1000);
}

export function percent_completed(elapsed: number, total: number): number {
  return Math.round((elapsed / total) * 100);
}
