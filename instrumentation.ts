// instrumentation.ts
// Next.js sunucu ayağa kalkarken bir kez çalışır (App Router `register` hook'u).
// Amaç: iyzico ortam değişkenlerindeki eksikleri ilk ödeme denemesini
// beklemeden, tek seferde ve konsolide biçimde log'a düşürmek. Deploy sonrası
// "Vercel'de değişken tanımlamayı unuttum" durumu build log'unun hemen ardından
// görünür olur. DEĞERLER LOGLANMAZ — yalnızca değişken adı ve durumu.
export async function register() {
  // Edge runtime'da process.env alt kümesi gelir ve ödeme yalnızca Node.js
  // runtime'ında çalışır; gereksiz uyarı üretmemek için sınırla.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { logIyzicoEnvReport } = await import("./lib/iyzico");
  logIyzicoEnvReport("sunucu başlangıcı");
}
