import Image from "next/image";
import React from 'react'

import { Text } from "@/components/atoms";
import { BecomeHostForm } from "@/components/organisms";
import BecomeHostBG from "@assets/images/Home/BecomeHostBG.png";



export const BecomeHost = () => {
    return (
        <section className="relative min-h-screen w-full">
            <Image
                src={BecomeHostBG}
                alt="Hero background"
                fill
                priority
                className="object-cover"
            />

            <div className="relative z-10 flex min-h-screen  items-center justify-center text-white">
                <div>
                    <Text size="6xl" className=" mt-30">
                        Convierte tu propiedad
                        <br />
                        en un activo rentable
                    </Text>

                    <Text size="xl" className="mt-5 mb-18" font="gilroy">
                        Encuentra tu próximo casa de descanso ideal.
                    </Text>
                </div>
                <BecomeHostForm />

            </div>
        </section>
    )
}
