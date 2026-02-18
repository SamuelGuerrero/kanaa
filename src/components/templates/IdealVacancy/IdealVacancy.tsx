import { Text } from '@/components/atoms'
import { Button } from '@/components/molecules'


export const IdealVacancy = () => {
    return (
        <section className='bg-green-dark items-center text-center px-1 justify-cente  text-white py-15 md:py-20'>
            <Text size="5xl" weight="medium" >
                ¿No ves la vacante ideal?
            </Text>

            <Text size="lg" className="md:mt-8 mt-5" font="gilroy" weight="medium">
                Siempre estamos buscando personas con propósito, talento y visión. Únete a nuestro equipo y construye el futuro con nosotros.
            </Text>

            <Text size="lg" className="md:mt-15 mt-10" font="gilroy" weight="medium">
                Envía tu Curruculum a
            </Text>
            <Button
                variant="secondary"
                textClassName="text-base font-bold text-gold-normal!"
                className="w-fit bg-gold-light-hover! rounded-[10px] mt-2"

                href="mailto:talento@kanna.com"
            >
                talento@kanna.com
            </Button>
        </section>
    )
}

