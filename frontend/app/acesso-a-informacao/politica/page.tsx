// app/acesso-a-informacao/politica/page.js
import { redirect } from "next/navigation";

// Mantém compatibilidade com links antigos, apontando para a política de transparência.
export default function Page() {
  redirect("/transparencia/politica");
}
