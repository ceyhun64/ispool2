// Ana kategorilerin EKRANDA gösterim sırası. Veritabanındaki sıra, kategori
// adları, id'ler ve URL'ler değişmez; yalnızca listelenirken bu sıra uygulanır.
export const CATEGORY_DISPLAY_ORDER = [
  "İş Güvenlik Ekipmanları",
  "İş Elbiseleri",
  "Koruyucu Teknik Kıyafet",
  "İş Eldivenleri",
  "İş Ayakkabıları ve Ayak Koruma",
  "Outdoor",
] as const;

const TR_FOLD: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
};

// Büyük/küçük harf, Türkçe karakter ve boşluk farklarına dayanıklı anahtar.
export function normalizeCategoryName(name: string): string {
  return name
    .toLocaleLowerCase("tr")
    .normalize("NFC")
    .replace(/[çğıöşü]/g, (ch) => TR_FOLD[ch] ?? ch)
    .replace(/\s+/g, " ")
    .trim();
}

const ORDER_INDEX = new Map<string, number>(
  CATEGORY_DISPLAY_ORDER.map((name, i) => [normalizeCategoryName(name), i]),
);

// Listede adı geçenler yukarıdaki sırayla öne alınır; geçmeyenler (ya da adı
// eşleşmeyenler) sona, KENDİ ORİJİNAL SIRASIYLA eklenir. Girdi dizisi
// değiştirilmez, kararlı bir kopya döner.
export function sortCategoriesByDisplayOrder<T>(
  items: readonly T[],
  getName: (item: T) => string,
): T[] {
  const rank = (item: T): number => {
    const idx = ORDER_INDEX.get(normalizeCategoryName(getName(item) ?? ""));
    return idx === undefined ? Number.MAX_SAFE_INTEGER : idx;
  };
  return items
    .map((item, original) => ({ item, original, r: rank(item) }))
    .sort((a, b) => a.r - b.r || a.original - b.original)
    .map(({ item }) => item);
}
