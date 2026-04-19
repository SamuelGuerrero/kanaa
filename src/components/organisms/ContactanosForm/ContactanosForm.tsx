"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  CircleButton,
  SelectForm,
  InputForm,
  Text,
  Loader,
} from "@/components/atoms";
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
  reason: z.string().min(1, "Selecciona un motivo."),
  textArea: z
    .string()
    .optional()
    .refine((value) => !value || value.trim().length >= 10, {
      message: "Escribe al menos 10 caracteres.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export const ContactanosForm = () => {
  const { t } = useI18n();
  const [isSuccessView, setIsSuccessView] = useState(false);
  const [submitError, setSubmitError] = useState("");
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
      const response = await fetch("/api/leads/contactanos", {
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
      console.error("Error sending contactanos lead:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar tu solicitud. Intenta de nuevo.",
      );
    }
  };

  return (
    <div
      className="relative w-full rounded-lg p-3.5 py-8 backdrop-blur-[22.39px] md:w-160.25 md:px-8 md:pb-8"
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

      {isSubmitting ? (
        <div className="relative z-10 min-h-130 px-3 pt-14 text-center md:px-6 md:pt-18">
          <Text
            as="h2"
            font="gilroy"
            size="3xl"
            weight="bold"
            className="text-white"
          >
            Espera unos momentos
          </Text>
          <Text
            as="p"
            font="gilroy"
            size="lg"
            weight="medium"
            className="mx-auto mt-6 max-w-3xl text-white/90"
          >
            Estamos enviando tu solicitud. En breve te mostraremos la
            confirmación.
          </Text>
          <Loader className="top-2/3 -translate-y-1/2" />
        </div>
      ) : isSuccessView ? (
        <div className="relative z-10 min-h-130 px-3 pt-20 text-center md:px-6 md:pt-26">
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
              placeholder="Nombre(s)"
              className="h-12 w-full md:h-13.75"
              type="text"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <InputForm
              placeholder="Apellidos"
              className="h-12 w-full md:h-13.75"
              type="text"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <InputForm
              placeholder="Email*"
              className="h-12 w-full md:h-13.75"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <InputForm
              placeholder="WhatsApp"
              className="h-12 w-full md:h-13.75"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <div className="col-span-2">
            <SelectForm
              className="h-12 w-full md:h-13.75"
              defaultOptionLabel="Motivo de contacto"
              options={[
                {
                  value: "gestion-propiedades",
                  label: "Gestion de propiedades",
                },
                { value: "renta-vacacional", label: "Renta vacacional" },
                { value: "alianzas", label: "Alianzas" },
                { value: "soporte", label: "Soporte" },
                { value: "otro", label: "Otro" },
              ]}
              error={errors.reason?.message}
              {...register("reason")}
            />
          </div>

          <div className="col-span-2">
            <textarea
              className={`font-gilroy h-24 w-full rounded-[10px] border bg-white/10 px-4 pt-3 text-[16.33px] font-semibold text-white placeholder-white/75 transition outline-none focus:border-[#CBBE99] focus:bg-white/20 focus:ring-2 focus:ring-[#CBBE99]/25 md:h-30 ${errors.textArea ? "border-red-300" : "border-white/20"}`}
              placeholder={t("Cuéntanos brevemente qué necesitas")}
              {...register("textArea")}
            />
            {errors.textArea?.message ? (
              <Text font="gilroy" size="xs" className="mt-1 text-red-200">
                {errors.textArea.message}
              </Text>
            ) : null}
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
            className={`text-gold-darker bg-gold-light-hover! col-span-2 mx-auto mt-3 flex h-11.5 w-[80%] justify-center space-x-2 md:mt-5 md:w-fit md:text-start ${isSubmitting ? "cursor-not-allowed opacity-60" : ""} `}
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
