import { NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@/env";

const contactanosSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  reason: z.string().min(1),
  textArea: z.string().optional(),
});

type ContactanosPayload = z.infer<typeof contactanosSchema>;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:180px;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">${escapeHtml(value)}</td>
  </tr>
`;

const buildTemplate = (lead: ContactanosPayload) => `
  <div style="margin:0;padding:40px 16px;background:#f4f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
      
      <!-- HEADER -->
      <tr>
        <td style="background:#2c3728;padding:32px 24px;text-align:center;">
          <img 
            src="https://i.postimg.cc/h4651wVz/logo.png" 
            alt="Kanaa Logo" 
            width="140" 
            style="display:block;margin:0 auto 18px auto;"
          />
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:600;">
            Nuevo Lead - Contáctanos
          </h1>
          <p style="margin:8px 0 0;font-size:14px;color:#a59973;">
            Solicitud recibida desde el formulario /contactanos
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:36px 32px;">
          
          <p style="margin:0 0 24px 0;font-size:15px;color:#374151;">
            Se ha recibido un nuevo mensaje desde el sitio web. 
            A continuación los datos del contacto:
          </p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            
            ${row("Nombre", lead.firstName)}
            ${row("Apellidos", lead.lastName)}
            ${row("Email", lead.email)}
            ${row("WhatsApp", lead.phone?.trim() ?? "No especificado")}
            ${row("Motivo", lead.reason)}
          
          </table>

          <!-- MENSAJE DESTACADO -->
          <div style="margin-top:32px;">
            <h3 style="margin:0 0 12px 0;font-size:15px;color:#2c3728;font-weight:600;">
              Mensaje
            </h3>

            <div style="padding:20px;background:#faf9f6;border-radius:14px;border:1px solid #e5e7eb;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
                ${escapeHtml(lead.textArea?.trim() ?? "Sin mensaje")}
              </p>
            </div>
          </div>

          <div style="margin-top:36px;padding:18px;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;">
            <p style="margin:0;font-size:13px;color:#6b7280;">
              Este mensaje fue generado automáticamente desde el formulario 
              <strong style="color:#2c3728;">Contáctanos</strong>.
            </p>
          </div>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding:20px 24px;background:#fafafa;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            © ${new Date().getFullYear()} Kanaa. Todos los derechos reservados.
          </p>
        </td>
      </tr>

    </table>
  </div>
`;

export async function POST(req: Request) {
  try {
    const resendApiBaseUrl = z.string().url().parse(env.RESEND_API_BASE_URL);
    const body = (await req.json().catch(() => ({}))) as unknown;
    const parsed = contactanosSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Revisa los campos obligatorios e intenta nuevamente.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const resendResponse = await fetch(resendApiBaseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: [env.LEADS_TO_EMAIL],
        subject: "Kanaa | Nuevo lead de contactanos",
        headers: {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          Importance: "high",
          Priority: "urgent",
        },
        html: buildTemplate(parsed.data),
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return NextResponse.json(
        { ok: false, error: errorText },
        { status: resendResponse.status },
      );
    }

    const result = (await resendResponse.json()) as { id?: string };
    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    console.error("Contactanos lead email error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error sending email" },
      { status: 500 },
    );
  }
}
