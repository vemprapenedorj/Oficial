/** Normalizes user text so searches do not depend on accents or capitalization. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

export function searchIncludes(value: string, normalizedQuery: string): boolean {
  return normalizeSearchText(value).includes(normalizedQuery);
}
