import Image from "next/image";

import { Text } from "@/components/atoms";
import { EarningsCalculatorForm } from "@/components/organisms";
import calculadoraHeroBg from "@assets/images/Home/calculadoraHeroBg.png";

export const EarningsCalculator = () => {
    return (
        <section className="relative h-200 w-full overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src={calculadoraHeroBg}
                    alt="BecomeHostBG"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div
                    className="bg-beige-normal absolute inset-0 opacity-40"
                    style={{ mixBlendMode: "hue" }}
                />
            </div>

            <div className="relative z-10 flex h-full items-center justify-between pl-10 pr-20">
                <div className="mb-55 max-w-183.25">
                    <Text size="6xl" className="leading-17.5 text-white mt-20" weight="medium">
                        Descubre cuánto
                        <br />
                        puede generar
                        <br />
                        tu  propiedad
                    </Text>

                    <Text size="xl" className="mt-5 text-grey-light" font="gilroy" weight="medium">
                        Calcula el potencial de ingresos de tu inmueble en minutos
                        <br />
                        y recibe una estimación anual personalizada, clara y
                        <br />
                        transparente.
                    </Text>
                </div>

                <EarningsCalculatorForm />
            </div>
        </section>
    )
}
