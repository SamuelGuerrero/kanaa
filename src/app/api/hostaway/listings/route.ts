import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';

import type { Property, ApiResponse } from '@/types/property';

const HOSTAWAY_API_URL = 'https://api.hostaway.com/v1';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
                
        const hostawayParams = new URLSearchParams();
                
        const limit = searchParams.get('limit') ?? '10';
        hostawayParams.append('limit', limit);
                
        if (searchParams.get('city')) {
            hostawayParams.append('city', searchParams.get('city')!);
        }
        
        if (searchParams.get('match')) {
            hostawayParams.append('match', searchParams.get('match')!);
        }
        
        if (searchParams.get('country')) {
            hostawayParams.append('country', searchParams.get('country')!);
        }
                
        if (searchParams.get('availabilityDateStart')) {
            hostawayParams.append('availabilityDateStart', searchParams.get('availabilityDateStart')!);
        }
        
        if (searchParams.get('availabilityDateEnd')) {
            hostawayParams.append('availabilityDateEnd', searchParams.get('availabilityDateEnd')!);
        }
        
        if (searchParams.get('availabilityGuestNumber')) {
            hostawayParams.append('availabilityGuestNumber', searchParams.get('availabilityGuestNumber')!);
        }

        if (!env.HOSTAWAY_TOKEN) {
            return NextResponse.json(
                { error: 'Token de API no configurado' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `${HOSTAWAY_API_URL}/listings?${hostawayParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `${env.HOSTAWAY_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 3600 }
            }
        );

        if (!response.ok) {
            throw new Error(`Error de Hostaway API: ${response.status}`);
        }

        const data = await response.json() as ApiResponse<Property[]>;
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error al obtener listings:', error);
        return NextResponse.json(
            { error: 'Error al cargar propiedades' },
            { status: 500 }
        );
    }
}
