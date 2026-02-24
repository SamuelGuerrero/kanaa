"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

import { CircleButton, SelectForm, InputForm } from "@/components/atoms";
import { Button } from "@/components/molecules";
import { useI18n } from "@/i18n";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  Reason: string;
  textArea?: string;
};

export const ContactanosForm = () => {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("DATA:", data);
      reset();
    } catch (error) {
      console.error(error);
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

      <form
        className="relative z-10 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2 md:col-span-1">
          <InputForm
            placeholder="Nombre(s)"
            className="h-12 w-full md:h-13.75"
            type="text"
            required
            {...register("firstName")}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <InputForm
            placeholder="Apellidos"
            className="h-12 w-full md:h-13.75"
            type="text"
            required
            {...register("lastName")}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <InputForm
            placeholder="Email*"
            className="h-12 w-full md:h-13.75"
            type="email"
            required
            {...register("email")}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <InputForm
            placeholder="WhatsApp"
            className="h-12 w-full md:h-13.75"
            type="tel"
            {...register("phone")}
          />
        </div>

        <div className="col-span-2">
          <SelectForm
            required
            className="h-12 w-full md:h-13.75"
            defaultOptionLabel="Motivo de contacto"
            options={[
              { value: "cdmx", label: "CDMX" },
              { value: "gdl", label: "Guadalajara" },
            ]}
            {...register("Reason", { required: true })}
          />
        </div>

        <div className="col-span-2">
          <textarea
            className="font-gilroy h-24 w-full rounded-[10px] border border-white/20 bg-white/10 px-4 pt-3 text-[16.33px] font-semibold text-white placeholder-white/75 transition outline-none focus:border-[#CBBE99] focus:bg-white/20 focus:ring-2 focus:ring-[#CBBE99]/25 md:h-30"
            placeholder={t("Cuéntanos brevemente qué necesitas")}
            {...register("textArea")}
          />
        </div>
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
          Enviar
        </Button>
      </form>
    </div>
  );
};
