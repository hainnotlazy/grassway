export function getObjectKeys(arg: any): string[] {
  try {
    return Object.keys(arg);
  } catch (err) {
    return [];
  }
}

export function getObjectValues(arg: any): any[] {
  try {
    return Object.values(arg);
  } catch (err) {
    return [];
  }
}

export function changeStatus(status: boolean) {
  return !status;
}

export function camelCaseToSnackCase(text: string) {
  return text.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function getValueInNumber(value: string | number) {
  return typeof value === "string" ? parseInt(value) : value;
}
