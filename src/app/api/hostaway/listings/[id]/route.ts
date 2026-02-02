import { type NextRequest, NextResponse } from 'next/server';

import type { Property, ApiResponse } from '@/types/property';

const HOSTAWAY_API_URL = 'https://api.hostaway.com/v1';
const HOSTAWAY_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMzMyMjgiLCJqdGkiOiI4YTcxN2QyMmMzYjI2MTY4NTliMmY3YzhjNDRlODdhZGUyNWRlZWNhOWYxMTM2MjYxMzk2ZDA1YzE4YTM2M2U1YTk2ZDk3OTk5Nzc2NmU3OSIsImlhdCI6MTc2NzcxODUyMi45NjA1NzcsIm5iZiI6MTc2NzcxODUyMi45NjA1NzksImV4cCI6MjA4MzI1MTMyMi45NjA1ODIsInN1YiI6IiIsInNjb3BlcyI6WyJnZW5lcmFsIl0sInNlY3JldElkIjo3OTIzM30.jW55fQkZgpszs0b1fUxskHZRQrmRGz_TbLq2qwkPobD1WM05kjCZ-SVygt8VeDZ_GwI6QR6OPQm94r2ngGRCxaHM3dx6maPGdlBwHsZrfsClorX6D7cgTPuJEvVkxU0bFWxeWNa-8XcGuftdk8nclAT99AZ7_qGf8NzZTTAlHRiUvUAwFoNrDJD9zB_F-eWGAiVWcdQgU2gzE5Id4myRQKVNRu34vJk-7zg9yNpBi4ZXmXQIDmZhvGYL3-U7zdldpzAgzDHqC729wRjbqYfD-AWVJofrTXev3c30b8P4Y6RsmX1j0388H2oM0Ry9KH_7rBoAizTvHPHOIQSwAde5Qw';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!HOSTAWAY_TOKEN) {
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
                    'Authorization': HOSTAWAY_TOKEN,
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
