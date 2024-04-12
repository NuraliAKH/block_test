export function pascalToCamelCase(input: string): string {
  if (!input) {
    return '';
  }

  return input.charAt(0).toLowerCase() + input.slice(1);
}
