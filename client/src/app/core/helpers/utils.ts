export function getObjectKeys(arg: any): string[] {
  try {
    return Object.keys(arg);
  } catch (err) {
    return [];
  }
}

export function changeStatus(status: boolean) {
  return !status;
}
