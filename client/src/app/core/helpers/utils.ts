export function getObjectKeys(arg: any): string[] {
  try {
    return Object.keys(arg);
  } catch (err) {
    return [];
  }
}
