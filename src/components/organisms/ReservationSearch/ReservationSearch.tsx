'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useState } from 'react';

import { CircleButton } from '@/components/atoms';
import { Input } from '@/components/molecules';

type SearchData = {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: string;
}

type ReservationSearchProps = {
    onSearch?: (data: SearchData) => void;
}

export const ReservationSearch = ({ onSearch }: ReservationSearchProps) => {
    const [destination, setDestination] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('');

    const handleSubmit = () => {
        if (onSearch) {
            onSearch({ destination, checkIn, checkOut, guests });
        }
    };

    return (
        <div className="bg-white rounded-full shadow-2xl flex items-center overflow-hidden h-16" style={{ width: '823px' }}>
            <div className="relative px-6" style={{ width: '283px' }}>
                <div className="absolute right-0 top-1/2 h-[85%] w-px -translate-y-1/2 bg-gray-200" />

                <Input
                    label='Destino'
                    value={destination}
                    onChange={setDestination}
                    placeholder="Escribe tu destino"
                />
            </div>

            <div className="relative px-6" style={{ width: '142.5px' }}>
                <div className="absolute right-0 top-1/2 h-[85%] w-px -translate-y-1/2 bg-gray-200" />
                <Input
                    label='Entrada'
                    value={checkIn}
                    onChange={setCheckIn}
                    placeholder="Añade fecha"
                    variant='date-dynamic'
                />
            </div>

            <div className="relative px-6" style={{ width: '142.5px' }}>
                <div className="absolute right-0 top-1/2 h-[85%] w-px -translate-y-1/2 bg-gray-200" />
                <Input
                    label='Salida'
                    value={checkOut}
                    onChange={setCheckOut}
                    placeholder="Añade fecha"
                    variant='date-dynamic'
                />
            </div>

            <div className="flex items-center" style={{ width: '255px' }}>
                <div className="flex-1 px-6">
                    <Input
                        label='Huéspedes'
                        value={guests}
                        onChange={setGuests}
                        placeholder="Añade Huéspedes"
                    />
                </div>

                <CircleButton
                    className='h-12 w-12 bg-green-normal! mx-3 transition-colors duration-200'
                    onClick={handleSubmit}
                >
                    <MagnifyingGlassIcon className="w-5 text-white drop-shadow-[0_0_0.5px_currentColor]" />
                </CircleButton>
            </div>
        </div>
    );
};