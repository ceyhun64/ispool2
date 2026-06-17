/**
 * Sunucu taraflı HTML sanitizasyon utility'si.
 * Bağımlılık gerektirmez; izin verilenler listesiyle çalışır.
 * dangerouslySetInnerHTML kullanmadan önce admin'in girdiği HTML'i temizler.
 */

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "del",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "a", "span", "div",
  "img",
  "hr",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "width", "height"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan"]),
  "*": new Set(["class", "id", "style"]),
};

const DANGEROUS_PATTERNS = [
  /javascript:/gi,
  /vbscript:/gi,
  /data:/gi,
  /on\w+\s*=/gi, // onclick=, onload= vs.
  /<script[\s\S]*?<\/script>/gi,
  /<iframe[\s\S]*?>/gi,
  /<object[\s\S]*?>/gi,
  /<embed[\s\S]*?>/gi,
  /<form[\s\S]*?>/gi,
  /<input[\s\S]*?>/gi,
];

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  let clean = dirty;

  // Tehlikeli pattern'leri kaldır
  for (const pattern of DANGEROUS_PATTERNS) {
    clean = clean.replace(pattern, "");
  }

  // İzin verilmeyen tag'leri kaldır (içeriklerini koruyarak)
  clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (match, tag) => {
    const lowerTag = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lowerTag)) {
      return ""; // izin verilmeyen tag'i tamamen sil
    }
    return match;
  });

  return clean;
}
