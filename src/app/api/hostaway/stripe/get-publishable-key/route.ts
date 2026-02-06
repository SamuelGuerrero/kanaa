import { NextResponse } from 'next/server';

import { env } from '@/env';

const HOSTAWAY_API_URL = 'https://api.hostaway.com/v1';

interface HostawayPublishableKeyResponse {
  result?: {
    stripePublishableApiKey?: string;
  };
  status?: string;
  message?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingMapId = searchParams.get('listingMapId');

  if (!listingMapId) {
    return NextResponse.json(
      { error: 'listingMapId es requerido' },
      { status: 400 }
    );
  }

  if (!env.HOSTAWAY_TOKEN) {
    return NextResponse.json(
      { error: 'Token de API no configurado' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${HOSTAWAY_API_URL}/stripe/publishableKey/${listingMapId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `${env.HOSTAWAY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Hostaway API error: ${response.status}`);
    }

    const data = await response.json() as HostawayPublishableKeyResponse;
    
    return NextResponse.json({
      publishableKey: data?.result?.stripePublishableApiKey ?? null,
    });
  } catch (error) {
    console.error('Error obteniendo publishable key:', error);
    return NextResponse.json(
      { 
        error: 'Error obteniendo key de Stripe',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
