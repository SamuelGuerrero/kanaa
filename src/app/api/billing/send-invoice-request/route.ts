import { NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@/env";

const BILLING_TO_EMAIL = "Contabilidad@kanaa.house";

const schema = z.object({
  billing: z.object({
    rfc: z.string().min(1),
    razonSocial: z.string().min(1),
    regimenFiscal: z.string().min(1),
    codigoPostal: z.string().min(1),
    usoCFDI: z.string().min(1),
    direccion: z.string().min(1),
    emailFacturacion: z.string().email(),
  }),
  guest: z.object({
    // Airbnb bookings arrive with the name intact but the email/phone
    // stripped for privacy. We accept nulls/blanks so the invoice team
    // can still receive the request — the PDF gets delivered to
    // `billing.emailFacturacion` anyway, and the guest row in the
    // template just prints "No especificado" for missing values.
    firstName: z.string().nullish(),
    lastName: z.string().nullish(),
    email: z
      .string()
      .email()
      .nullish()
      .or(z.literal("")),
    phone: z.string().nullish(),
  }),
  reservation: z.object({
    propertyName: z.string(),
    arrivalDate: z.string(),
    departureDate: z.string(),
    totalNights: z.number(),
    totalPrice: z.number(),
    guests: z.object({
      adults: z.number(),
      children: z.number(),
      infants: z.number(),
    }),
    reservationId: z.number().optional(),
  }),
});

type Payload = z.infer<typeof schema>;

const escapeHtml = (value: string) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:220px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:500;">${escapeHtml(value)}</td>
  </tr>
`;

const buildTemplate = (p: Payload) => {
  const { billing, guest, reservation } = p;
  const guestCount =
    `${reservation.guests.adults} adulto${reservation.guests.adults !== 1 ? "s" : ""}` +
    (reservation.guests.children > 0
      ? `, ${reservation.guests.children} niño${reservation.guests.children !== 1 ? "s" : ""}`
      : "") +
    (reservation.guests.infants > 0
      ? `, ${reservation.guests.infants} bebé${reservation.guests.infants !== 1 ? "s" : ""}`
      : "");

  const totalFormatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(reservation.totalPrice);

  // `||` (not `??`) is intentional: blank Airbnb fields arrive as `""`,
  // not just null/undefined, and must also fall back to "No especificado".
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const guestEmail = guest.email || "No especificado";
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const guestPhone = guest.phone || "No especificado";

  return `
  <div style="margin:0;padding:40px 16px;background:#f4f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 10px 30px rgba(0,0,0,0.05);">

      <!-- HEADER -->
      <tr>
        <td style="background:#2c3728;padding:32px 24px;text-align:center;">
          <img src="https://kanaa-media.s3.us-east-1.amazonaws.com/logo.svg" alt="Kanaa Logo" width="140" style="display:block;margin:0 auto 18px auto;" />
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:600;">
            Solicitud de Facturación
          </h1>
          <p style="margin:8px 0 0;font-size:14px;color:#a59973;">
            Nueva solicitud de factura recibida desde el sitio web
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:36px 32px;">

          <!-- RESERVACIÓN -->
          <h2 style="margin:0 0 16px 0;font-size:17px;color:#2c3728;font-weight:700;border-bottom:2px solid #a59973;padding-bottom:8px;">
            Datos de la Reservación
          </h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            ${reservation.reservationId ? row("ID de reservación", String(reservation.reservationId)) : ""}
            ${row("Propiedad", reservation.propertyName)}
            ${row("Llegada", reservation.arrivalDate)}
            ${row("Salida", reservation.departureDate)}
            ${row("Noches", String(reservation.totalNights))}
            ${row("Huéspedes", guestCount)}
            ${row("Total pagado", totalFormatted)}
          </table>

          <!-- DATOS DEL HUÉSPED -->
          <h2 style="margin:32px 0 16px 0;font-size:17px;color:#2c3728;font-weight:700;border-bottom:2px solid #a59973;padding-bottom:8px;">
            Datos del Huésped
          </h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            ${row(
              "Nombre",
              `${guest.firstName ?? ""} ${guest.lastName ?? ""}`.trim() ||
                "No especificado",
            )}
            ${row("Correo", guestEmail)}
            ${row("Teléfono", guestPhone)}
          </table>

          <!-- DATOS DE FACTURACIÓN -->
          <h2 style="margin:32px 0 16px 0;font-size:17px;color:#2c3728;font-weight:700;border-bottom:2px solid #a59973;padding-bottom:8px;">
            Datos Fiscales
          </h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            ${row("RFC", billing.rfc)}
            ${row("Nombre / Razón social", billing.razonSocial)}
            ${row("Régimen Fiscal", billing.regimenFiscal)}
            ${row("Código Postal", billing.codigoPostal)}
            ${row("Uso de CFDI", billing.usoCFDI)}
            ${row("Dirección", billing.direccion)}
            ${row("Correo para PDF y XML", billing.emailFacturacion)}
          </table>

          <div style="margin-top:36px;padding:18px;background:#faf9f6;border-radius:12px;border:1px solid #e5e7eb;">
            <p style="margin:0;font-size:13px;color:#6b7280;">
              Esta solicitud fue generada automáticamente tras una reservación confirmada en <strong style="color:#2c3728;">kanaa.house</strong>.
              Por favor emite la factura y envíala al correo del huésped indicado arriba.
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
};

export async function POST(req: Request) {
  try {
    const resendApiBaseUrl = z.string().url().parse(env.RESEND_API_BASE_URL);
    const body = (await req.json().catch(() => ({}))) as unknown;
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Datos inválidos",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { reservation, guest } = parsed.data;
    const subject = `Kanaa | Solicitud de Factura — ${reservation.propertyName} (${reservation.arrivalDate} → ${reservation.departureDate}) — ${guest.firstName} ${guest.lastName}`;

    const resendResponse = await fetch(resendApiBaseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: [BILLING_TO_EMAIL],
        subject,
        headers: {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          Importance: "high",
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
    console.error("Billing invoice email error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error sending billing email" },
      { status: 500 },
    );
  }
}
