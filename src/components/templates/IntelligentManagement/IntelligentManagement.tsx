import Image from 'next/image'

import { Text } from '@/components/atoms'
import IntelligentManagement1 from '@assets/images/Home/IntelligentManagement1.png'
import IntelligentManagement2 from '@assets/images/Home/IntelligentManagement2.png'
import IntelligentManagement3 from '@assets/images/Home/IntelligentManagement3.png'

export const IntelligentManagement = () => {
    return (
        <section className="text-center pt-15 pb-10 bg-gold-light">
            <Text size="5xl" weight="medium" className="text-green-normal">
                Gestión inteligente de propiedades
            </Text>

            <div className="grid gap-2 my-10">
                <Text
                    font="gilroy"
                    size="lg"
                    weight="medium"
                    className="text-grey-darker"
                >
                    Ayudamos a propietarios a maximizar el potencial de sus inmuebles a
                    través de un modelo de gestión profesional,
                </Text>

                <Text
                    font="gilroy"
                    size="lg"
                    weight="medium"
                    className="text-grey-darker"
                >
                    transparente y respaldado por datos. Desde la estrategia de renta hasta
                    la operación diaria, nos ocupamos de todo.
                </Text>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-6 w-full">
                <Image
                    src={IntelligentManagement1}
                    alt="Left Value Proposition"
                    className="w-full h-full object-cover row-span-2"
                    priority
                />

                <Image
                    src={IntelligentManagement2}
                    alt="Right Value Proposition"
                    className="w-full h-full object-cover"
                    priority
                />

                <Image
                    src={IntelligentManagement3}
                    alt="Right Value Proposition"
                    className="w-full h-full object-cover"
                    priority
                />
            </div>
        </section>
    )
}
