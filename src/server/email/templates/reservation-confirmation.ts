export type ReservationConfirmationData = {
  guestName: string;
  reservationId: number;
  paidAmount: string; // e.g. "$12,500"
  propertyName: string;
  checkIn: string; // e.g. "15/06/2025"
  checkOut: string; // e.g. "20/06/2025"
  guestsTotal: string; // e.g. "2 Adultos"
  reservationTrackingUrl: string;
  year: number;
  supportEmail: string;
  locale?: "es" | "en";
};

const i18n = {
  es: {
    htmlLang: "es",
    title: "Confirmación de Reserva | Kanaa",
    paymentConfirmation: "Confirmación de pago",
    bookingConfirmed: "Reserva Confirmada",
    greeting: (name: string) => `Estimado/a <strong>${name}</strong>,`,
    greetingBody:
      "Su pago fue procesado exitosamente. Le recomendamos conservar este correo como comprobante oficial de su reservación.",
    paymentSummary: "Resumen de pago",
    reservationNumber: "Número de reserva",
    status: "Estado",
    statusValue: "Procesado exitosamente",
    amountPaid: "Monto pagado",
    stayDetail: "Detalle de la estancia",
    property: "Propiedad",
    guests: "Huéspedes",
    total: "Total",
    ctaTitle: "Gestión de su reserva",
    ctaBody:
      "Para cancelaciones o modificaciones, acceda al panel de seguimiento con su número de reserva y correo electrónico.",
    ctaButton: "Ver mi reserva",
    note: "Este correo electrónico confirma que su pago fue procesado correctamente y puede utilizarse como comprobante oficial ante cualquier solicitud relacionada con su reservación.",
    rights: (year: number) => `© ${year} Kanaa. Todos los derechos reservados.`,
    support: (email: string) => `Soporte: ${email}`,
  },
  en: {
    htmlLang: "en",
    title: "Booking Confirmation | Kanaa",
    paymentConfirmation: "Payment confirmation",
    bookingConfirmed: "Booking Confirmed",
    greeting: (name: string) => `Dear <strong>${name}</strong>,`,
    greetingBody:
      "Your payment has been successfully processed. We recommend keeping this email as the official proof of your reservation.",
    paymentSummary: "Payment summary",
    reservationNumber: "Reservation number",
    status: "Status",
    statusValue: "Successfully processed",
    amountPaid: "Amount paid",
    stayDetail: "Stay details",
    property: "Property",
    guests: "Guests",
    total: "Total",
    ctaTitle: "Manage your reservation",
    ctaBody:
      "For cancellations or modifications, access the tracking panel with your reservation number and email address.",
    ctaButton: "View my booking",
    note: "This email confirms that your payment was processed correctly and can be used as official proof for any request related to your reservation.",
    rights: (year: number) => `© ${year} Kanaa. All rights reserved.`,
    support: (email: string) => `Support: ${email}`,
  },
};

export function buildReservationConfirmationHtml(
  data: ReservationConfirmationData,
): string {
  const {
    guestName,
    reservationId,
    paidAmount,
    propertyName,
    checkIn,
    checkOut,
    guestsTotal,
    reservationTrackingUrl,
    year,
    supportEmail,
    locale = "es",
  } = data;

  const t = i18n[locale];

  return `<!DOCTYPE html>
<html lang="${t.htmlLang}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${t.title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f0f2ef;font-family:Georgia,serif;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f0f2ef;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #d2c7aa;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1f291d;padding:36px 40px 28px 40px;text-align:center;">
              <img src="https://kanaa-media.s3.us-east-1.amazonaws.com/logo.svg" alt="Kanaa" width="140" style="display:block;margin:0 auto 20px auto;" />
              <!-- Gold divider -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-top:1px solid #d2c7aa;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
              <p style="margin:16px 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#d2c7aa;">${t.paymentConfirmation}</p>
              <h1 style="margin:6px 0 0 0;font-family:Georgia,serif;font-size:26px;font-weight:normal;color:#ffffff;line-height:1.3;">${t.bookingConfirmed}</h1>
            </td>
          </tr>

          <!-- Gold accent bar -->
          <tr>
            <td style="background-color:#d2c7aa;height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 0 40px;">
              <p style="margin:0 0 10px 0;font-family:Georgia,serif;font-size:16px;color:#1f291d;line-height:1.5;">${t.greeting(guestName)}</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4b5563;line-height:1.7;">${t.greetingBody}</p>
            </td>
          </tr>

          <!-- Section: Payment summary -->
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#d2c7aa;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">${t.paymentSummary}</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;width:50%;">${t.reservationNumber}</td>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1f291d;font-weight:bold;text-align:right;">#${reservationId}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">${t.status}</td>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#15803d;font-weight:bold;text-align:right;">${t.statusValue}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">${t.amountPaid}</td>
                  <td style="padding:9px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1f291d;font-weight:bold;text-align:right;">${paidAmount} MXN</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section: Stay details -->
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#d2c7aa;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">${t.stayDetail}</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;width:50%;">${t.property}</td>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1f291d;text-align:right;">${propertyName}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">Check-in</td>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1f291d;text-align:right;">${checkIn}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">Check-out</td>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1f291d;text-align:right;">${checkOut}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">${t.guests}</td>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1f291d;text-align:right;">${guestsTotal}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f291d;font-weight:bold;">${t.total}</td>
                  <td style="padding:12px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1f291d;font-weight:bold;text-align:right;">${paidAmount} MXN</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f7f5ef;border:1px solid #e1d9c8;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:15px;color:#1f291d;">${t.ctaTitle}</p>
                    <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#4b5563;line-height:1.6;">${t.ctaBody}</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background-color:#1f291d;text-align:center;">
                          <a href="${reservationTrackingUrl}" style="display:inline-block;padding:12px 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#d2c7aa;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">${t.ctaButton}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Note -->
          <tr>
            <td style="padding:24px 40px 28px 40px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9ca3af;line-height:1.6;">${t.note}</p>
            </td>
          </tr>

          <!-- Gold divider before footer -->
          <tr>
            <td style="background-color:#d2c7aa;height:1px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1f291d;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#d2c7aa;">${t.rights(year)}</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8a9487;">${t.support(supportEmail)}</p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>`;
}
