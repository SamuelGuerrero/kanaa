"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

import { CircleButton, SelectForm, InputForm } from "@/components/atoms";
import { Button } from "@/components/molecules";

type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    Reason: string;
    textArea?: string;
};

export const ContactanosForm = () => {
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
            className="relative w-160.25 rounded-lg p-8 backdrop-blur-[22.39px]"
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
                className="relative z-10 grid grid-cols-2 gap-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <InputForm
                    placeholder="Nombre(s)"
                    type="text"
                    required
                    {...register("firstName")}
                />
                <InputForm
                    placeholder="Apellidos"
                    type="text"
                    required
                    {...register("lastName")}
                />
                <InputForm
                    placeholder="Email*"
                    type="email"
                    required
                    {...register("email")}
                />
                <InputForm
                    placeholder="WhatsApp"
                    type="tel"
                    {...register("phone")}
                />

                <div className="col-span-2">
                    <SelectForm
                        required
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
                        className="h-13.5 w-full  pt-3  font-gilroy font-bold text-[16.33px] px-4 text-white placeholder-white outline-none transition bg-white/10"
                        placeholder="Cuéntanos brevemente qué necesitas"
                        {...register("textArea")}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    textWeight="bold"
                    className={`text-gold-dark mt-5 bg-gold-light-hover! w-min ${isSubmitting && "cursor-not-allowed opacity-60"} `}
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
}
