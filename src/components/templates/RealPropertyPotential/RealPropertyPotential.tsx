import { Text } from '@/components/atoms'
import { EarningsCalculatorForm } from '@/components/organisms'


export const RealPropertyPotential = () => {
    return (

        <section className="bg-green-dark-active py-8">
            <div className="flex h-full justify-between pl-10 pr-15 ">
                <div className="mt-10">
                    <Text size="6xl" className=" text-white ">
                        Conoce el potencial real
                        <br />
                        de tu propiedad
                    </Text>

                    <Text size="xl" className="mt-8 text-grey-light" font="gilroy">
                        Ingresa algunos datos clave y obtén una estimación de ingresos anual
                        <br />
                        basada en el tipo de inmueble, su capacidad y su ubicación.
                    </Text>
                </div>

                <EarningsCalculatorForm />
            </div>
        </section>

    )
}
