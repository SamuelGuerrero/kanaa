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
  } = data;

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Confirmación de Reserva | Kanaa</title>
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
              <img src="https://i.postimg.cc/h4651wVz/logo.png" alt="Kanaa" width="140" style="display:block;margin:0 auto 20px auto;" />
              <!-- Gold divider -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-top:1px solid #d2c7aa;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
              <p style="margin:16px 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#d2c7aa;">Confirmación de pago</p>
              <h1 style="margin:6px 0 0 0;font-family:Georgia,serif;font-size:26px;font-weight:normal;color:#ffffff;line-height:1.3;">Reserva Confirmada</h1>
            </td>
          </tr>

          <!-- Gold accent bar -->
          <tr>
            <td style="background-color:#d2c7aa;height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 0 40px;">
              <p style="margin:0 0 10px 0;font-family:Georgia,serif;font-size:16px;color:#1f291d;line-height:1.5;">Estimado/a <strong>${guestName}</strong>,</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4b5563;line-height:1.7;">Su pago fue procesado exitosamente. Le recomendamos conservar este correo como comprobante oficial de su reservación.</p>
            </td>
          </tr>

          <!-- Section: Resumen de pago -->
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#d2c7aa;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Resumen de pago</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;width:50%;">Número de reserva</td>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1f291d;font-weight:bold;text-align:right;">#${reservationId}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">Estado</td>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#15803d;font-weight:bold;text-align:right;">Procesado exitosamente</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">Monto pagado</td>
                  <td style="padding:9px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1f291d;font-weight:bold;text-align:right;">${paidAmount} MXN</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section: Detalle de estancia -->
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#d2c7aa;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Detalle de la estancia</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;width:50%;">Propiedad</td>
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
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">Huéspedes</td>
                  <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1f291d;text-align:right;">${guestsTotal}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f291d;font-weight:bold;">Total</td>
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
                    <p style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:15px;color:#1f291d;">Gestión de su reserva</p>
                    <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#4b5563;line-height:1.6;">Para cancelaciones o modificaciones, acceda al panel de seguimiento con su número de reserva y correo electrónico.</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background-color:#1f291d;text-align:center;">
                          <a href="${reservationTrackingUrl}" style="display:inline-block;padding:12px 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#d2c7aa;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">Ver mi reserva</a>
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
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9ca3af;line-height:1.6;">Este correo electrónico confirma que su pago fue procesado correctamente y puede utilizarse como comprobante oficial ante cualquier solicitud relacionada con su reservación.</p>
            </td>
          </tr>

          <!-- Gold divider before footer -->
          <tr>
            <td style="background-color:#d2c7aa;height:1px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1f291d;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#d2c7aa;">© ${year} Kanaa. Todos los derechos reservados.</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8a9487;">Soporte: ${supportEmail}</p>
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
