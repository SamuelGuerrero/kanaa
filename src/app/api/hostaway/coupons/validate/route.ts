import { type NextRequest, NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

interface ValidateCouponBody {
  couponName: string;
  listingMapId: number;
  startingDate: string;
  endingDate: string;
}

interface HostawayCoupon {
  id: number;
  name: string;
  type: "percentage" | "fixed";
  amount: number;
  isActive: number;
  isExpired: number;
  lengthOfStayCondition:
    | "moreThanOrEqualTo"
    | "lessThanOrEqualTo"
    | "exactly"
    | "between"
    | null;
  lengthOfStayValue: number | null;
  lengthOfStayMaxValue: number | null;
  checkInDateStart: string | null;
  checkInDateEnd: string | null;
  validityDateStart: string | null;
  validityDateEnd: string | null;
  numberOfUsesInitial: number;
  numberOfUsesUsed: number;
  listingMapIds: number[];
}

interface HostawayCouponListResponse {
  status: string;
  result?: HostawayCoupon[];
}

interface HostawayReservationCouponResponse {
  status: string;
  result?: { reservationCouponId: number };
  message?: string;
}

const formatDateDisplay = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const calcNights = (start: string, end: string) => {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};

const validateCouponConditions = (
  coupon: HostawayCoupon,
  listingMapId: number,
  startingDate: string,
  endingDate: string,
): string | null => {
  if (!coupon.isActive || coupon.isExpired) {
    return "Este cupón ha expirado o no está activo.";
  }

  if (
    coupon.numberOfUsesInitial > 0 &&
    coupon.numberOfUsesUsed >= coupon.numberOfUsesInitial
  ) {
    return "Este cupón ha alcanzado su límite de usos.";
  }

  if (
    coupon.listingMapIds?.length &&
    !coupon.listingMapIds.includes(listingMapId)
  ) {
    return "Este cupón no aplica para esta propiedad.";
  }

  const checkIn = startingDate;

  if (coupon.validityDateStart && checkIn < coupon.validityDateStart) {
    return `Este cupón aplica a partir del ${formatDateDisplay(coupon.validityDateStart)}.`;
  }
  if (coupon.validityDateEnd && checkIn > coupon.validityDateEnd) {
    return `Este cupón venció el ${formatDateDisplay(coupon.validityDateEnd)}.`;
  }

  if (coupon.checkInDateStart && checkIn < coupon.checkInDateStart) {
    return `Este cupón solo aplica para llegadas a partir del ${formatDateDisplay(coupon.checkInDateStart)}.`;
  }
  if (coupon.checkInDateEnd && checkIn > coupon.checkInDateEnd) {
    return `Este cupón no aplica para esta fecha de llegada (válido hasta el ${formatDateDisplay(coupon.checkInDateEnd)}).`;
  }

  if (coupon.lengthOfStayCondition && coupon.lengthOfStayValue != null) {
    const nights = calcNights(startingDate, endingDate);
    const min = coupon.lengthOfStayValue;
    const max = coupon.lengthOfStayMaxValue;

    if (coupon.lengthOfStayCondition === "moreThanOrEqualTo" && nights < min) {
      return `Este cupón requiere una estancia mínima de ${min} ${min === 1 ? "noche" : "noches"}.`;
    }
    if (coupon.lengthOfStayCondition === "lessThanOrEqualTo" && nights > min) {
      return `Este cupón aplica solo para estancias de máximo ${min} ${min === 1 ? "noche" : "noches"}.`;
    }
    if (coupon.lengthOfStayCondition === "exactly" && nights !== min) {
      return `Este cupón aplica solo para estancias de exactamente ${min} ${min === 1 ? "noche" : "noches"}.`;
    }
    if (
      coupon.lengthOfStayCondition === "between" &&
      max != null &&
      (nights < min || nights > max)
    ) {
      return `Este cupón aplica solo para estancias de entre ${min} y ${max} noches.`;
    }
  }

  return null;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ValidateCouponBody;
    const { couponName, listingMapId, startingDate, endingDate } = body;

    if (!couponName || !listingMapId || !startingDate || !endingDate) {
      return NextResponse.json(
        {
          error:
            "couponName, listingMapId, startingDate y endingDate son requeridos",
        },
        { status: 400 },
      );
    }

    const authorization = await getHostawayAuthorizationHeader();

    // Fetch coupon list and find by exact name — Hostaway's ?name= filter
    // is unreliable; fetching all and matching client-side is the safe approach.
    const couponInfoRes = await fetch(
      `${HOSTAWAY_API_URL}/coupons?limit=100`,
      {
        headers: { Authorization: authorization, "Cache-Control": "no-cache" },
      },
    );

    if (!couponInfoRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "El código de cupón no existe o no es válido.",
        },
        { status: 400 },
      );
    }

    const couponInfo =
      (await couponInfoRes.json()) as HostawayCouponListResponse;
    const coupon = couponInfo.result?.find(
      (c) => c.name.toUpperCase() === couponName.toUpperCase(),
    );

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          error: "El código de cupón no existe o no es válido.",
        },
        { status: 400 },
      );
    }

    const conditionError = validateCouponConditions(
      coupon,
      listingMapId,
      startingDate,
      endingDate,
    );
    if (conditionError) {
      return NextResponse.json(
        { success: false, error: conditionError },
        { status: 400 },
      );
    }

    // Conditions pass — create the reservation coupon
    const reservationCouponRes = await fetch(
      `${HOSTAWAY_API_URL}/reservationCoupons`,
      {
        method: "POST",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          couponName,
          listingMapId,
          startingDate,
          endingDate,
        }),
      },
    );

    const reservationData =
      (await reservationCouponRes.json()) as HostawayReservationCouponResponse;

    if (
      !reservationCouponRes.ok ||
      reservationData.status !== "success" ||
      !reservationData.result
    ) {
      return NextResponse.json(
        { success: false, error: "Cupón no valido. Intenta de nuevo." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      reservationCouponId: reservationData.result.reservationCouponId,
      ...(coupon.type === "percentage" &&
        coupon.amount > 0 && { discountPercent: coupon.amount }),
    });
  } catch (error) {
    console.error("Error validando cupón:", error);
    return NextResponse.json(
      { success: false, error: "Error al validar el cupón." },
      { status: 500 },
    );
  }
}
