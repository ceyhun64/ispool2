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

function sanitizeAttributes(tag: string, attrString: string): string {
  const allowed = new Set<string>([
    ...(ALLOWED_ATTRS[tag] ?? []),
    ...(ALLOWED_ATTRS["*"] ?? []),
  ]);
  if (allowed.size === 0 || !attrString) return "";

  const attrPattern = /([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let out = "";
  let match: RegExpExecArray | null;
  while ((match = attrPattern.exec(attrString))) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? match[5] ?? "";
    if (!allowed.has(name)) continue;
    if ((name === "href" || name === "src") && /^\s*(javascript|vbscript|data):/i.test(value)) {
      continue;
    }
    out += ` ${name}="${value.replace(/"/g, "&quot;")}"`;
  }
  return out;
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  let clean = dirty;

  // Tehlikeli pattern'leri kaldır
  for (const pattern of DANGEROUS_PATTERNS) {
    clean = clean.replace(pattern, "");
  }

  // İzin verilmeyen tag'leri sil, izin verilenlerin ise yalnızca izin
  // verilen özniteliklerini (ALLOWED_ATTRS) koru.
  clean = clean.replace(
    /<(\/)?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g,
    (_match, closingSlash: string | undefined, tag: string, attrs: string) => {
      const lowerTag = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(lowerTag)) return "";
      if (closingSlash) return `</${lowerTag}>`;

      const selfClosing = /\/\s*$/.test(attrs);
      const cleanAttrs = sanitizeAttributes(lowerTag, attrs);
      return `<${lowerTag}${cleanAttrs}${selfClosing ? " /" : ""}>`;
    },
  );

  return clean;
}
