import { FieldName } from "./types";
/**
 * Makes the proper `name` attribute for an input element, given a fully qualified path.
 */
export function makeElementName(parts: FieldName[]): string {
  return parts.reduce((fqn: string, part): string => {
    if (typeof part === "number") {
      return `${fqn}[${part}]`;
    }
    if (fqn === "") {
      return part.toString();
    }
    return `${fqn}.${part}`;
  }, "");
}

/**
 * Makes the proper `id` attribute for an input element, given a fully qualified path.
 */
export function makeElementId(parts: FieldName[]): string {
  return parts.map((p) => p.toString()).join("-");
}

/**
 * Makes a translation key for an element, given a fully qualified path, and a prefix.
 */
export function makeElementLabel(parts: FieldName[], prefix: string): string {
  return prefix + "." + parts.filter((p) => typeof p === "string").join(".");
}

/**
 * Dummy translation function.
 * @param key
 */
export function neverTranslate(key: string): string {
  return key;
}
