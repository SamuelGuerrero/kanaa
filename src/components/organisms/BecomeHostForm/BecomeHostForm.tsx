import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { CircleButton } from '@/components/atoms'
import { InputForm } from '@/components/atoms/InputForm'
import { SelectForm } from '@/components/atoms/SelectForm'
import { Button } from '@/components/molecules'


export const BecomeHostForm = () => {
    return (
        <form className="grid grid-cols-2 gap-4">

            <InputForm
                label="Nombre"
                name="firstName"
                placeholder="Ingresa tu nombre"
                type="text"
                required
            />
            <InputForm
                label="Apellidos"
                name="lastName"
                placeholder="Ingresa tus apellidos"
                type="text"
                required
            />
            <InputForm
                label="Email*"
                name="email"
                placeholder="correo@ejemplo.com"
                type="email"
                required
            />
            <InputForm
                label="Número telefónico"
                name="phone"
                placeholder="Ej. 55 1234 5678"
                type="tel"
            />

            {/* Select 1 (ocupa toda la fila) */}
            <div className="col-span-2">
                <SelectForm
                    label="Ciudad"
                    name="city"
                    required
                    defaultOptionLabel="Selecciona una ciudad"
                    options={[
                        { value: "cdmx", label: "CDMX" },
                        { value: "gdl", label: "Guadalajara" },
                    ]}
                />
            </div>

            <div className="col-span-2">
                <SelectForm
                    label="Nombre del edificio (si aplica)"
                    name="buildingName"
                    defaultOptionLabel="Selecciona una opción"
                    options={[
                        { value: "ninguno", label: "No aplica" },
                        { value: "edificio-a", label: "Edificio A" },
                        { value: "edificio-b", label: "Edificio B" },
                    ]}
                />

            </div>
            <Button
                variant="primary"
                textWeight="bold"
                className="text-gold-normal-hover! font-bold w-min"
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
