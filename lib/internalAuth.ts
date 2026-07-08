// lib/internalAuth.ts
// Sunucu-içi (server-to-server) route çağrıları için paylaşılan gizli anahtar.
// Tarayıcıdan gelen isteklerde session çerezi taşınırken, bir route handler'ın
// başka bir route handler'ı fetch ile çağırdığı durumlarda (order -> payment,
// order -> send-mail, banner -> upload vb.) çerez otomatik iletilmez. Bu header
// söz konusu iç çağrıları, halihazırda kendi oturum/rol kontrolünü yapmış olan
// çağıran route adına doğrulamak için kullanılır.
const INTERNAL_SECRET = process.env.NEXTAUTH_SECRET;

export const INTERNAL_HEADER = "x-internal-secret";

export function internalHeaders(
  extra?: Record<string, string>,
): Record<string, string> {
  return {
    ...(extra ?? {}),
    ...(INTERNAL_SECRET ? { [INTERNAL_HEADER]: INTERNAL_SECRET } : {}),
  };
}

export function isInternalRequest(req: Request): boolean {
  if (!INTERNAL_SECRET) return false;
  return req.headers.get(INTERNAL_HEADER) === INTERNAL_SECRET;
}
