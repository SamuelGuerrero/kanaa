
import { NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@/env";

const leadSchema = z.object({
  propertyAddress: z.string().min(1),
  postalCode: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  neighborhood: z.string().min(1),
  guestCount: z.string().min(1),
  propertyType: z.string().min(1),
  bedroomCount: z.string().min(1),
  bathroomCount: z.string().min(1),
  yearsOwned: z.string().min(1),
  estimatedMonthlyRevenue: z.number().nonnegative().nullable().optional(),
});

type LeadPayload = z.infer<typeof leadSchema>;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:210px;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">${escapeHtml(value)}</td>
  </tr>
`;

const buildLeadTemplate = (lead: LeadPayload) => {
  const estimated =
    typeof lead.estimatedMonthlyRevenue === "number"
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
          maximumFractionDigits: 2,
        }).format(lead.estimatedMonthlyRevenue)
      : "No disponible";

  return `
    <div style="margin:0;padding:24px;background:#f3f5f7;font-family:Arial,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr>
          <td style="padding:18px 24px;background:#154734;color:#ffffff;">
            <h1 style="margin:0;font-size:20px;line-height:1.2;">Nuevo lead: Gestion de propiedades</h1>
            <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Formulario /gestion-propiedades</p>
          </td>
        </tr>
        <tr>
          <td style="padding:22px 24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              ${row("Direccion de propiedad", lead.propertyAddress)}
              ${row("Codigo postal", lead.postalCode)}
              ${row("Estado", lead.state)}
              ${row("Ciudad", lead.city)}
              ${row("Colonia", lead.neighborhood)}
              ${row("Cantidad de huespedes", lead.guestCount)}
              ${row("Tipo de propiedad", lead.propertyType)}
              ${row("No. de habitaciones", lead.bedroomCount)}
              ${row("No. de banos", lead.bathroomCount)}
              ${row("Anos de propiedad", lead.yearsOwned)}
              ${row("Estimado mensual", estimated)}
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
};

export async function POST(req: Request) {
  try {
    const resendApiBaseUrl = z.string().url().parse(env.RESEND_API_BASE_URL);
    const body = (await req.json().catch(() => ({}))) as unknown;
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Revisa los campos del formulario e intenta nuevamente.",
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
        subject: "Kanaa | Nuevo lead de gestion de propiedades",
        html: buildLeadTemplate(parsed.data),
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
    console.error("Gestion propiedades lead email error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error sending email" },
      { status: 500 },
    );
  }
}
