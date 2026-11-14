import { permanentRedirect } from "next/navigation";

// Asıl yönlendirme next.config.ts içindeki 301 redirect ile yapılır;
// bu, o kural devre dışı kalırsa devreye giren yedektir.
export default function SalesAgreementRedirectPage() {
  permanentRedirect("/help/distance-sales");
}
