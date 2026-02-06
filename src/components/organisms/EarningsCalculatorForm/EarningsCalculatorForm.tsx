"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

import { CircleButton, SelectForm, InputForm } from "@/components/atoms";
import { Button } from "@/components/molecules";

type PropertyDetails = {
    propertyAddress: string;
    guestCount: number;
    propertyType: string;
    bedroomCount: number;
    bathroomCount: number;
    yearsOwned: number;
};


export const EarningsCalculatorForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<PropertyDetails>();

    const onSubmit = async (data: PropertyDetails) => {
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
                <div className="col-span-2">
                    <InputForm
                        className="h-13.75 w-full"
                        placeholder="Dirección de propiedad"
                        type="text"
                        required
                        {...register("propertyAddress")}
                    />
                </div>

                <SelectForm
                    required
                    className="h-13.75 w-full"
                    defaultOptionLabel="Cantidad de huéspedes"
                    options={[
                        { value: "1", label: "1 huésped" },
                        { value: "2", label: "2 huéspedes" },
                        { value: "3", label: "3 huéspedes" },
                        { value: "4", label: "4 huéspedes" },
                        { value: "5", label: "5 huéspedes" },
                        { value: "6", label: "6+ huéspedes" },
                    ]}
                    {...register("guestCount", { required: true })}
                />

                <SelectForm
                    required
                    className="h-13.75 w-full"
                    defaultOptionLabel="Tipo de propiedad"
                    options={[
                        { value: "apartment", label: "Departamento" },
                        { value: "house", label: "Casa" },
                        { value: "loft", label: "Loft" },
                        { value: "studio", label: "Estudio" },
                        { value: "townhouse", label: "Townhouse" },
                        { value: "other", label: "Otro" },
                    ]}
                    {...register("propertyType", { required: true })}
                />


                <SelectForm
                    required
                    className="h-13.75 w-full"
                    defaultOptionLabel="No. de habitaciones"
                    options={[
                        { value: "studio", label: "Studio (sin habitación)" },
                        { value: "1", label: "1 habitación" },
                        { value: "2", label: "2 habitaciones" },
                        { value: "3", label: "3 habitaciones" },
                        { value: "4", label: "4 habitaciones" },
                        { value: "5", label: "5+ habitaciones" },
                    ]}
                    {...register("bedroomCount")}
                />

                <SelectForm
                    required
                    className="h-13.75 w-full"
                    defaultOptionLabel="No. de baños"
                    options={[
                        { value: "1", label: "1 baño" },
                        { value: "1.5", label: "1.5 baños" },
                        { value: "2", label: "2 baños" },
                        { value: "2.5", label: "2.5 baños" },
                        { value: "3", label: "3 baños" },
                        { value: "4", label: "4+ baños" },
                    ]}
                    {...register("bathroomCount", { required: true })}
                />

                <div className="col-span-2">
                    <SelectForm
                        required
                        className="h-13.75 w-full"
                        defaultOptionLabel="Años de propiedad"
                        options={[
                            { value: "less1", label: "Menos de 1 año" },
                            { value: "1-3", label: "1 a 3 años" },
                            { value: "3-5", label: "3 a 5 años" },
                            { value: "5-10", label: "5 a 10 años" },
                            { value: "10+", label: "Más de 10 años" },
                        ]}
                        {...register("yearsOwned", { required: true })}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    textWeight="bold"
                    className={`text-gold-darker w-fit mt-5 ${isSubmitting && "cursor-not-allowed opacity-60"} `}
                    icon={
                        <CircleButton>
                            <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
                        </CircleButton>
                    }
                >
                    Calcular precio
                </Button>
            </form>
        </div>
    );
};
