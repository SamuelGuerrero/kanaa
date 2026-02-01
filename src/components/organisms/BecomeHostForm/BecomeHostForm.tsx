"use client";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

import { CircleButton } from '@/components/atoms'
import { InputForm } from '@/components/atoms/InputForm'
import { SelectForm } from '@/components/atoms/SelectForm'
import { Button } from '@/components/molecules'

type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    city: string;
    buildingName?: string;
};

export const BecomeHostForm = () => {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            console.log("DATA:", data);
            reset();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <form
            className="grid grid-cols-2 gap-4"
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
                placeholder="Número telefónico"
                type="tel"
                {...register("phone")}
            />


            <div className="col-span-2">
                <SelectForm
                    required
                    defaultOptionLabel="¿Dónde se encuntra tu propiedad?"
                    options={[
                        { value: "cdmx", label: "CDMX" },
                        { value: "gdl", label: "Guadalajara" },
                    ]}
                    {...register("city", { required: true })}
                />
            </div>

            <div className="col-span-2">
                <SelectForm
                    defaultOptionLabel="Nombre del edificio (si aplica)"
                    options={[
                        { value: "ninguno", label: "No aplica" },
                        { value: "edificio-a", label: "Edificio A" },
                        { value: "edificio-b", label: "Edificio B" },
                    ]}
                    {...register("buildingName")}
                />

            </div>
            <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                textWeight="bold"
                className={`
                    w-min mt-5 text-gold-darker
                    ${isSubmitting && "opacity-60 cursor-not-allowed"}
                  `}
                icon={
                    <CircleButton>
                        <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
                    </CircleButton>
                }
            >
                Enviar
            </Button>

        </form>

    )
}
