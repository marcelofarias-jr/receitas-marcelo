const unsafeChars = /[^a-z0-9]+/g;

const charMap: Record<string, string> = {
  a: "a",
  á: "a",
  à: "a",
  ã: "a",
  â: "a",
  ä: "a",
  e: "e",
  é: "e",
  è: "e",
  ê: "e",
  ë: "e",
  i: "i",
  í: "i",
  ì: "i",
  î: "i",
  ï: "i",
  o: "o",
  ó: "o",
  ò: "o",
  ô: "o",
  õ: "o",
  ö: "o",
  u: "u",
  ú: "u",
  ù: "u",
  û: "u",
  ü: "u",
  c: "c",
  ç: "c",
};

export function slugify(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => charMap[char] ?? char)
    .join("")
    .replace(unsafeChars, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "receita";
}
