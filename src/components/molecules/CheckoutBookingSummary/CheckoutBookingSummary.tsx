import { Text } from "@/components/atoms";

import type { BookingData } from "@/components/molecules/BookingWidget";

type CheckoutBookingSummaryProps = {
  bookingData: BookingData;
};

const formatDateLong = (date: Date | null) => {
  if (!date) return "N/A";
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const CheckoutBookingSummary = ({
  bookingData,
}: CheckoutBookingSummaryProps) => {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Text font="gilroy" size="sm" className="mb-1 text-gray-600">
            Check-in
          </Text>
          <Text font="gilroy" size="base" weight="semibold">
            {formatDateLong(bookingData.startDate)}
          </Text>
        </div>
        <div className="mx-4 h-12 w-px bg-gray-300" />
        <div className="flex-1">
          <Text font="gilroy" size="sm" className="mb-1 text-gray-600">
            Check-out
          </Text>
          <Text font="gilroy" size="base" weight="semibold">
            {formatDateLong(bookingData.endDate)}
          </Text>
        </div>
        <div className="mx-4 h-12 w-px bg-gray-300" />
        <div className="flex-1">
          <Text font="gilroy" size="sm" className="mb-1 text-gray-600">
            Huéspedes
          </Text>
          <Text font="gilroy" size="base" weight="semibold">
            {bookingData.guests.adults + bookingData.guests.children}
          </Text>
        </div>
        <div className="mx-4 h-12 w-px bg-gray-300" />
        <div className="flex-1 text-right">
          <Text font="gilroy" size="sm" className="mb-1 text-gray-600">
            Total
          </Text>
          <Text
            font="gilroy"
            size="xl"
            weight="bold"
            className="text-green-normal"
          >
            ${new Intl.NumberFormat("es-MX").format(bookingData.totalPrice)} MXN
          </Text>
        </div>
      </div>
    </div>
  );
};

