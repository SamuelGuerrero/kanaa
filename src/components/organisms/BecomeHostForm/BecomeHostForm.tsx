"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CircleButton, SelectForm, InputForm, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import { useI18n } from "@/i18n";
import { zodResolver } from "@/lib/forms/zodResolver";

const formSchema = z.object({
  firstName: z.string().min(2, "Escribe tu nombre."),
  lastName: z.string().min(2, "Escribe tus apellidos."),
  email: z.string().email("Escribe un correo valido."),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || value.trim().length >= 8, {
      message: "Escribe un telefono valido.",
    }),
  estado: z.string().min(1, "Selecciona un estado"),
  buildingName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
const MEXICO_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de Mexico",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de Mexico",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacan",
  "Morelos",
  "Nayarit",
  "Nuevo Leon",
  "Oaxaca",
  "Puebla",
  "Queretaro",
  "Quintana Roo",
  "San Luis Potosi",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatan",
  "Zacatecas",
];

type BecomeHostFormProps = {
  className?: string;
};

export const BecomeHostForm = ({ className }: BecomeHostFormProps) => {
  const { t } = useI18n();
  const [submitError, setSubmitError] = useState("");
  const [isSuccessView, setIsSuccessView] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError("");
    try {
      const response = await fetch("/api/leads/become-host", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseBody = (await response.json().catch(() => ({}))) as {
        id?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(responseBody.error ?? `HTTP ${response.status}`);
      }

      reset();
      setIsSuccessView(true);
    } catch (error) {
      console.error("Error sending become host lead:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar tu solicitud. Intenta de nuevo.",
      );
    }
  };

  return (
    <div
      className={`relative w-full rounded-lg p-3.5 py-8 backdrop-blur-[22.39px] md:w-160.25 md:px-8 md:pb-8 ${className}`}
      style={{
        background: `
          radial-gradient(
            90.16% 143.01% at 15.32% 21.04%, 
            rgba(255, 255, 255, 0.2) 0%, 
            rgba(255, 255, 255, 0.045) 77.08%, 
            rgba(255, 255, 255, 0) 100%
          )
        `,
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(235deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {isSuccessView ? (
        <div className="relative z-10 min-h-105 px-3 pt-20 text-center md:px-6 md:pt-24">
          <Text
            as="h2"
            font="gilroy"
            size="3xl"
            weight="bold"
            className="text-white"
          >
            Solicitud enviada con éxito
          </Text>
          <Text
            as="p"
            font="gilroy"
            size="lg"
            weight="medium"
            className="mx-auto mt-6 max-w-3xl text-white/90"
          >
            Gracias por escribirnos. Nuestro equipo se pondrá en contacto
            contigo a la brevedad.
          </Text>
        </div>
      ) : (
        <form
          className="relative z-10 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="col-span-2 md:col-span-1">
            <InputForm
              placeholder={t("Nombre(s)")}
              className="h-12 w-full md:h-13.75"
              type="text"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <InputForm
              placeholder={t("Apellidos")}
              className="h-12 w-full md:h-13.75"
              type="text"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <InputForm
              placeholder={t("Email*")}
              className="h-12 w-full md:h-13.75"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <InputForm
              placeholder={t("Número telefónico")}
              className="h-12 w-full md:h-13.75"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <div className="col-span-2">
            <SelectForm
              className="h-12 w-full md:h-13.75"
              defaultOptionLabel="¿Dónde se encuentra tu propiedad?"
              options={MEXICO_STATES.map((state) => ({
                value: state,
                label: state,
              }))}
              error={errors.estado?.message}
              {...register("estado")}
            />
          </div>

          <div className="col-span-2">
            <InputForm
              placeholder={t("Nombre del edificio (si aplica)")}
              className="h-12 w-full md:h-13.75"
              type="text"
              error={errors.buildingName?.message}
              {...register("buildingName")}
            />
          </div>
          {submitError ? (
            <Text
              as="p"
              font="gilroy"
              size="sm"
              weight="semibold"
              className="col-span-2 mt-2 text-center text-red-200"
            >
              {submitError}
            </Text>
          ) : null}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            textWeight="bold"
            className={`text-gold-darker mt-5 flex w-[80%] justify-center space-x-2 md:w-min md:text-start ${isSubmitting ? "cursor-not-allowed opacity-60" : ""} `}
            icon={
              <CircleButton>
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      )}
    </div>
  );
};
