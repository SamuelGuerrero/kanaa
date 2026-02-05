import Image from 'next/image'
import React from 'react'

import { Text } from '@/components/atoms'
import HeroNosotrosBg from "@assets/images/Home/HeroNosotrosBg.png";
export const HeroNosotros = () => {
    return (
        <section className="relative h-200 w-full">
            <Image
                src={HeroNosotrosBg}
                alt="Hero background"
                fill
                priority
                className="object-cover"
            />

            <div className="relative z-10 flex min-h-screen flex-col items-center my-45 justify-center text-white">
                <Text size="6xl" weight="medium">
                    Alquileres vacacionales fáciles
                </Text>

                <Text size="xl" className="mt-5 mb-18" font="gilroy" weight="medium">
                    Agilizamos la gestión del alquiler vacacional para garantizar
                    <br />
                    la tranquilidad y experiencias inolvidables a los huéspedes.
                </Text>

            </div>
        </section>
    )
}
