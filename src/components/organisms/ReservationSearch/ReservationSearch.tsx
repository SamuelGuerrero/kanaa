'use client';

import { CircleButton, Text } from '@/components/atoms';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

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
            <div className="relative px-8" style={{ width: '283px' }}>
                <div className="absolute right-0 top-1/2 h-[85%] w-px -translate-y-1/2 bg-gray-200" />

                <Text font="gilroy" size="xs" weight="medium" className="block text-black">
                    Destino
                </Text>

                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Escribe tu destino"
                    className="w-full text-sm text-gray-600 placeholder-[#6A6A6A] outline-none bg-transparent text-gilroy"
                />
            </div>

            <div className="relative px-8" style={{ width: '142.5px' }}>
                <div className="absolute right-0 top-1/2 h-[85%] w-px -translate-y-1/2 bg-gray-200" />
                <Text font='gilroy' size='xs' weight='medium' className="block text-black">
                    Entrada
                </Text>
                <input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    placeholder="Añade fecha"
                    onFocus={(e) => e.currentTarget.type = 'date'}
                    onBlur={(e) => {
                        if (!e.currentTarget.value) e.currentTarget.type = 'text';
                    }}
                    className="w-full text-sm text-gray-600 placeholder-[#6A6A6A] outline-none bg-transparent text-gilroy"
                />
            </div>

            <div className="relative px-8" style={{ width: '142.5px' }}>
                <div className="absolute right-0 top-1/2 h-[85%] w-px -translate-y-1/2 bg-gray-200" />
                <Text font='gilroy' size='xs' weight='medium' className="block text-black">
                    Salida
                </Text>
                <input
                    type="text"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    placeholder="Añade fecha"
                    onFocus={(e) => e.currentTarget.type = 'date'}
                    onBlur={(e) => {
                        if (!e.currentTarget.value) e.currentTarget.type = 'text';
                    }}
                    className="w-full text-sm text-gray-600 placeholder-[#6A6A6A] outline-none bg-transparent text-gilroy"
                />
            </div>

            <div className="flex items-center" style={{ width: '255px' }}>
                <div className="flex-1 px-8">
                    <Text font='gilroy' size='xs' weight='medium' className="block text-black">
                        Huéspedes
                    </Text>
                    <input
                        type="text"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="Añade Huéspedes"
                        className="w-full text-sm text-gray-600 placeholder-[#6A6A6A] outline-none bg-transparent"
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