import { ArrowRightIcon } from "@heroicons/react/24/solid"

import { CircleButton, KanaaLogo, Text } from "@/components/atoms"
import { Button, TextLink } from "@/components/molecules"

export const Footer = () => {
    return (
        <section className="bg-green-dark-active mt-6 flex flex-row justify-center gap-30 pt-15 pl-30 items-start pb-15 w-full">
            <div>
                <KanaaLogo />
                <div className="flex  mt-50 ">
                    <a
                        href="#"
                        aria-label="Facebook"
                        className="w-[51.11px] h-[36.18px] flex items-center justify-center rounded-full border border-[#FFFFFF20] text-white hover:border-blue-500 hover:text-blue-500 transition"
                    >
                        <i className="fa-brands fa-facebook text-xl"></i>
                    </a>

                    <a
                        href="#"
                        aria-label="Instagram"
                        className="w-[51.11px] h-[36.18px] flex items-center justify-center rounded-full border border-[#FFFFFF20] text-white hover:border-pink-500 hover:text-pink-500 transition"
                    >
                        <i className="fa-brands fa-instagram text-xl"></i>
                    </a>
                </div>
            </div>

            <div className="flex flex-row gap-40 text-green-light-active " >
                <div className="flex flex-col space-y-4" >
                    <Text size="lg" className="mb-8" weight="bold" font="gilroy" >
                        KANNA
                    </Text>
                    <TextLink href="" variant="primary" textWeight="medium" >
                        Sobre nosotros
                    </TextLink>
                    <TextLink href="" variant="primary" textWeight="medium" >
                        Nuestro equipo
                    </TextLink>
                    <TextLink href="" variant="primary" textWeight="medium" >
                        Experiencia & Historia
                    </TextLink>
                </div>

                <div className="flex flex-col space-y-4">
                    <Text size="lg" className="mb-8" weight="bold" font="gilroy">
                        Propiedades
                    </Text>
                    <TextLink href="" variant="primary" textWeight="medium" >
                        Listado de propiedades
                    </TextLink>
                    <TextLink href="" variant="primary" textWeight="medium" >
                        Destacadas
                    </TextLink>
                    <TextLink href="" variant="primary" textWeight="medium" >
                        Guías y tips de viaje
                    </TextLink>
                </div>

                <div className="flex flex-col space-y-4">
                    <Text size="lg" className="mb-8" weight="bold" font="gilroy">
                        Properity Managment
                    </Text>
                    <TextLink href="" variant="primary" textWeight="medium" >
                        Únete como propietario
                    </TextLink>
                    <TextLink href="" variant="primary" textWeight="medium" >
                        Property Management
                    </TextLink>
                    <TextLink href="" variant="primary" textWeight="medium" >
                        Calculadora de ingresos
                    </TextLink>
                </div>

                <div className="flex flex-col space-y-4">
                    <Text size="lg" className="mb-8" weight="bold" font="gilroy">
                        Legal
                    </Text>
                    <TextLink href="" variant="primary" textWeight="medium">
                        Política de privacidad
                    </TextLink>
                    <TextLink href="" variant="primary" textWeight="medium">
                        Términos y condiciones
                    </TextLink>
                    <TextLink href="" variant="primary" textWeight="medium">
                        Política de cookies
                    </TextLink>
                </div>
            </div>

            <div className="ml-20 ">
                <Button
                    variant="primary"
                    textWeight="bold"
                    className="text-gold-normal-hover! font-bold"
                    icon={
                        <CircleButton>
                            <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
                        </CircleButton>
                    }
                >
                    Contáctanos
                </Button>

                <Text size="sm" className="mt-50 text-white" weight="medium" font="gilroy">
                    © {new Date().getFullYear()} — KANAA All Rights Reserved
                </Text>
            </div>
        </section>
    )
}
