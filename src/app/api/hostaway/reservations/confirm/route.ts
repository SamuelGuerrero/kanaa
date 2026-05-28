import { NextResponse } from "next/server";

import { env } from "@/env";
import { buildReservationConfirmationHtml } from "@/server/email/templates/reservation-confirmation";
import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";
import { fakeSandboxReservationId, isSandboxMode } from "@/server/sandbox";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";
const SITE_URL = "https://kanaa.house";

interface CreateReservationBody {
  listingMapId: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  phone: string;
  guestCountry: string;
  arrivalDate: string;
  departureDate: string;
  numberOfGuests: number;
  adults: number;
  children: number | null;
  infants: number | null;
  totalPrice: number;
  paymentIntentId?: string;
  propertyName?: string;
  locale?: "es" | "en";
}

interface HostawayReservationResponse {
  status: string;
  result?: {
    id?: number;
    [key: string]: unknown;
  };
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateReservationBody;

    const {
      listingMapId,
      guestFirstName,
      guestLastName,
      guestEmail,
      phone,
      guestCountry,
      arrivalDate,
      departureDate,
      numberOfGuests,
      adults,
      children,
      infants,
      totalPrice,
      paymentIntentId,
      propertyName,
      locale,
    } = body;

    if (
      !listingMapId ||
      !guestFirstName ||
      !guestLastName ||
      !guestEmail ||
      !arrivalDate ||
      !departureDate ||
      !totalPrice
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos para crear la reservación" },
        { status: 400 },
      );
    }

    // ── Sandbox short-circuit ─────────────────────────────────────────────
    // In sandbox mode we don't touch Hostaway or Resend so the tracking team
    // can complete the booking flow with Stripe test cards without polluting
    // the production calendar or sending guest emails.
    if (isSandboxMode()) {
      const mockReservationId = fakeSandboxReservationId();
      console.info("[sandbox] mocked Hostaway reservation:", mockReservationId);
      return NextResponse.json({
        success: true,
        sandbox: true,
        reservationId: mockReservationId,
        reservation: {
          id: mockReservationId,
          listingMapId,
          arrivalDate,
          departureDate,
          totalPrice,
          currency: "MXN",
          guestName: `${guestFirstName} ${guestLastName}`,
        },
      });
    }

    const authorization = await getHostawayAuthorizationHeader();

    const reservationData = {
      channelId: 2000,
      listingMapId,
      isManuallyChecked: 0,
      isInitial: 0,
      guestName: `${guestFirstName} ${guestLastName}`,
      guestFirstName,
      guestLastName,
      guestEmail,
      guestCountry: guestCountry || null,
      phone: phone ? phone.replace(/[\s\-()]/g, "") : null,
      numberOfGuests,
      adults,
      children: children ?? null,
      infants: infants ?? null,
      arrivalDate,
      departureDate,
      totalPrice,
      currency: "MXN",
      isPaid: 1,
      source: "kanaa-website",
      comment: paymentIntentId
        ? `Stripe PaymentIntent: ${paymentIntentId}`
        : undefined,
    };

    const response = await fetch(`${HOSTAWAY_API_URL}/reservations`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    const data = (await response.json()) as HostawayReservationResponse;

    if (!response.ok) {
      console.error("Hostaway reservation error:", data);
      return NextResponse.json(
        {
          error: "Error creando la reservación en Hostaway",
          details: data.message ?? `HTTP ${response.status}`,
        },
        { status: response.status },
      );
    }

    const reservationId = data.result?.id;

    // Register the Stripe payment as an offline charge so Hostaway marks it as paid
    if (reservationId) {
      try {
        await fetch(
          `${HOSTAWAY_API_URL}/guestPayments/charges/${reservationId}`,
          {
            method: "POST",
            headers: {
              Authorization: authorization,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "Pago con tarjeta — Stripe",
              description: paymentIntentId
                ? `Stripe PaymentIntent: ${paymentIntentId}`
                : "Pago procesado via Stripe desde kanaa.house",
              amount: totalPrice,
              paymentMethod: "credit_card",
              status: "paid",
              scheduledDate: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            }),
          },
        );
      } catch (chargeError) {
        console.error(
          "Failed to register charge in Hostaway (reservation still created):",
          chargeError,
        );
      }
    }

    // Send confirmation email to guest
    if (reservationId && guestEmail) {
      try {
        const formatDate = (dateStr: string) => {
          const [year, month, day] = dateStr.split("-");
          return `${day}/${month}/${year}`;
        };

        const guestParts: string[] = [];
        if (locale === "en") {
          guestParts.push(`${adults} ${adults === 1 ? "Adult" : "Adults"}`);
          if ((children ?? 0) > 0)
            guestParts.push(
              `${children} ${children === 1 ? "Child" : "Children"}`,
            );
          if ((infants ?? 0) > 0)
            guestParts.push(
              `${infants} ${infants === 1 ? "Infant" : "Infants"}`,
            );
        } else {
          guestParts.push(`${adults} ${adults === 1 ? "Adulto" : "Adultos"}`);
          if ((children ?? 0) > 0)
            guestParts.push(`${children} ${children === 1 ? "Niño" : "Niños"}`);
          if ((infants ?? 0) > 0)
            guestParts.push(`${infants} ${infants === 1 ? "Bebé" : "Bebés"}`);
        }
        const guestsLabel = guestParts.join(", ");
        const formattedAmount = new Intl.NumberFormat("es-MX").format(
          totalPrice,
        );

        const html = buildReservationConfirmationHtml({
          guestName: `${guestFirstName} ${guestLastName}`.trim(),
          reservationId,
          paidAmount: `$${formattedAmount}`,
          propertyName: propertyName ?? "Propiedad Kanaa",
          checkIn: formatDate(arrivalDate),
          checkOut: formatDate(departureDate),
          guestsTotal: guestsLabel,
          reservationTrackingUrl: `${SITE_URL}/${locale ?? "es"}/reservation-tracking`,
          year: new Date().getFullYear(),
          supportEmail: env.RESEND_FROM_EMAIL,
          locale: locale ?? "es",
        });

        await fetch(env.RESEND_API_BASE_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: env.RESEND_FROM_EMAIL,
            to: [guestEmail],
            subject:
              locale === "en"
                ? `Kanaa | Booking Confirmation #${reservationId}`
                : `Kanaa | Confirmación de reserva #${reservationId}`,
            html,
          }),
        });
      } catch (emailError) {
        // Non-critical — reservation is already created, just log the error
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      reservationId: reservationId ?? null,
      reservation: data.result ?? null,
    });
  } catch (error) {
    console.error("Error creando reservación:", error);
    return NextResponse.json(
      {
        error: "Error interno al crear la reservación",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
