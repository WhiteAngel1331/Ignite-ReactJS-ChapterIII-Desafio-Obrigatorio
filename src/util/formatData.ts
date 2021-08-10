export function formatData(time: string): string {
  const date = new Date(time);

  if (date.getMinutes() < 60) {
    return `${date.getMinutes()} min`;
  }

  if (date.getHours() < 24) {
    return `${date.getHours()} hours`;
  }

  if (date.getDay() < 28) {
    return `${date.getDay()} days`;
  }

  return 'a long ago';
}
