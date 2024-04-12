export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function verifyValidTimeFormat(time: string): boolean {
  // verify that the input is a valid time
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time || "")) {
    return false;
  } else {
    return true;
  }
}

export function isLightTimeBeforeDarkTime(lightTime: string, darkTime: string): boolean {
  const lightTimeInMinutes = timeToMinutes(lightTime);
  const darkTimeInMinutes = timeToMinutes(darkTime);
  return lightTimeInMinutes < darkTimeInMinutes;
}
