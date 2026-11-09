// tests/iyzicoEnv.test.ts
//
// iyzico ortam değişkeni doğrulamasının birim testleri.
//
// Çalıştırmak için: npm test
//
// Kapsanan davranışlar:
//   - eksik IYZICO_API_KEY / IYZICO_SECRET_KEY ayrı ayrı raporlanır
//   - IYZICO_BASE_URL tanımsızsa sandbox varsayılanı korunur (hata değil)
//   - geçersiz/iyzico dışı IYZICO_BASE_URL hata üretir
//   - canlı ödeme koruması production dışı ortamda devrede kalır
//   - rapor hiçbir gizli DEĞER taşımaz

import test from "node:test";
import assert from "node:assert/strict";
import { checkIyzicoEnv } from "../lib/iyzico";

const SANDBOX = "https://sandbox-api.iyzipay.com";
const LIVE = "https://api.iyzipay.com";

/** Testler process.env'e dokunmaz; env her zaman parametreyle verilir. */
const env = (over: Record<string, string | undefined> = {}) =>
  ({
    IYZICO_API_KEY: "sandbox-apikey-placeholder",
    IYZICO_SECRET_KEY: "sandbox-secret-placeholder",
    IYZICO_BASE_URL: SANDBOX,
    NODE_ENV: "production",
    ...over,
  }) as NodeJS.ProcessEnv;

const codes = (e: NodeJS.ProcessEnv) =>
  checkIyzicoEnv(e).issues.map((i) => i.code);

test("tam yapılandırma sorunsuz raporlanır", () => {
  const report = checkIyzicoEnv(env());
  assert.equal(report.ok, true);
  assert.deepEqual(report.issues, []);
  assert.equal(report.environment, "sandbox");
  assert.equal(report.usingDefaultBaseUrl, false);
});

test("eksik API key ayırt edici kodla raporlanır", () => {
  assert.deepEqual(codes(env({ IYZICO_API_KEY: undefined })), [
    "IYZICO_CONFIG_API_KEY_MISSING",
  ]);
});

test("eksik secret key ayırt edici kodla raporlanır", () => {
  assert.deepEqual(codes(env({ IYZICO_SECRET_KEY: undefined })), [
    "IYZICO_CONFIG_SECRET_KEY_MISSING",
  ]);
});

test("yalnızca boşluktan oluşan değer tanımsız sayılır", () => {
  assert.deepEqual(codes(env({ IYZICO_API_KEY: "   " })), [
    "IYZICO_CONFIG_API_KEY_MISSING",
  ]);
});

test("iki anahtar da eksikse ikisi de tek raporda listelenir", () => {
  assert.deepEqual(
    codes(env({ IYZICO_API_KEY: undefined, IYZICO_SECRET_KEY: undefined })),
    ["IYZICO_CONFIG_API_KEY_MISSING", "IYZICO_CONFIG_SECRET_KEY_MISSING"],
  );
});

test("IYZICO_BASE_URL tanımsızsa sandbox varsayılanı korunur", () => {
  const report = checkIyzicoEnv(env({ IYZICO_BASE_URL: undefined }));
  assert.equal(report.ok, true);
  assert.equal(report.environment, "sandbox");
  assert.equal(report.usingDefaultBaseUrl, true);
});

test("iyzico dışı veya bozuk BASE_URL hata üretir", () => {
  for (const bad of ["not-a-url", "https://example.com", "http://api.iyzipay.com"]) {
    assert.deepEqual(
      codes(env({ IYZICO_BASE_URL: bad })),
      ["IYZICO_CONFIG_BASE_URL_INVALID"],
      `beklenen hata alınamadı: ${bad}`,
    );
  }
});

test("canlı endpoint production'da serbesttir", () => {
  const report = checkIyzicoEnv(env({ IYZICO_BASE_URL: LIVE }));
  assert.equal(report.ok, true);
  assert.equal(report.environment, "production");
});

test("canlı endpoint production dışı ortamda engellenir", () => {
  assert.deepEqual(
    codes(env({ IYZICO_BASE_URL: LIVE, NODE_ENV: "development" })),
    ["IYZICO_CONFIG_LIVE_BLOCKED_IN_DEV"],
  );
});

test("koruma yalnızca açık izinle devre dışı kalır", () => {
  const report = checkIyzicoEnv(
    env({
      IYZICO_BASE_URL: LIVE,
      NODE_ENV: "development",
      IYZICO_ALLOW_PRODUCTION_IN_DEV: "1",
    }),
  );
  assert.equal(report.ok, true);
  assert.equal(report.environment, "production");
});

test("rapor hiçbir gizli değer içermez", () => {
  const secret = "cok-gizli-secret-degeri";
  const report = checkIyzicoEnv(
    env({ IYZICO_SECRET_KEY: secret, IYZICO_BASE_URL: "https://example.com" }),
  );
  const serialized = JSON.stringify(report);
  assert.equal(serialized.includes(secret), false);
  assert.equal(serialized.includes("example.com"), false);
});
