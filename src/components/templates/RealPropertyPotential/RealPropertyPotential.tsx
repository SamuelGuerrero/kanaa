import React from "react";

import { Text } from '@/components/atoms'
import { EarningsCalculatorForm } from '@/components/organisms'


type RealPropertyPotentialProps = {
    title: string;
    description: string;
}
export const RealPropertyPotential = ({ title, description }: RealPropertyPotentialProps) => {
    return (
        <section className="bg-green-dark-hover py-8">
            <div className="flex h-full justify-between pl-10 pr-15 ">
                <div className="mt-10">
                    <Text size="6xl" className=" text-white "
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    <Text size="xl" className="mt-8 text-grey-light" font="gilroy"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>

                <EarningsCalculatorForm />
            </div>
        </section>

    )
}
