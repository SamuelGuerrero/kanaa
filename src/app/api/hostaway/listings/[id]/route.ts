import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';

import type { Property, ApiResponse } from '@/types/property';

const HOSTAWAY_API_URL = 'https://api.hostaway.com/v1';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }  // ← Cambio aquí
) {
    try {
        const { id } = await params;  // ← Y aquí

        if (!env.HOSTAWAY_TOKEN) {
            return NextResponse.json(
                { error: 'Token de API no configurado' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `${HOSTAWAY_API_URL}/listings/${id}?includeResources=1`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${env.HOSTAWAY_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 3600 }
            }
        );

        if (!response.ok) {
            throw new Error(`Error de Hostaway API: ${response.status}`);
        }

        const data = await response.json() as ApiResponse<Property>;
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error al obtener propiedad:', error);
        return NextResponse.json(
            { error: 'Error al cargar propiedad' },
            { status: 500 }
        );
    }
}