# KANAA

Plataforma web de KANAA para captación de propietarios, cálculo de ingresos potenciales y operación comercial de renta vacacional.

![Hero Kanaa](src/assets/images/home/HeroBackground.png)

## ¿Qué es este proyecto?

Este repositorio contiene el sitio de KANAA:

- Landing comercial.
- Secciones de propiedades y contenido.
- Formularios de leads (`/contactanos`, `/gestion-propiedades`, `/unete`).
- Flujo de cálculo para estimar ingreso mensual de una propiedad.
- Integraciones backend para enviar leads por correo y consumir servicios externos.

Páginas principales:

- `/` Inicio.
- `/gestion-propiedades` Captación de propietarios.
- `/calculadora` Herramienta de estimación.
- `/contactanos` Formulario de contacto.
- `/nosotros`, `/unete`, `/vacantes`, `/propiedades`, `/blog`.

## Modelo de negocio

KANAA opera en el segmento de renta vacacional y administración de propiedades.

### Propuesta de valor

- Optimización de ingresos para propietarios.
- Gestión operativa integral de propiedades.
- Atracción de huéspedes con enfoque en ocupación y rentabilidad.

![Revenue Optimization](src/assets/images/home/RevenueOptimization.png)

### Adquisición comercial

- Formularios para captación de leads calificados.
- Calculadora de ingresos para convertir tráfico en oportunidades comerciales.
- Contacto directo de equipo comercial con prospectos.

![Rent Property](src/assets/images/home/RentProperty.png)

### Conversión y operación

- Recepción automática de leads por correo.
- Seguimiento comercial de propietarios interesados.
- Integración con servicios de inventario/listings para operación.

![Property Management](src/assets/images/home/PropertyManagement.png)

## Puesta en marcha local

### Requisitos

- Node.js 20+
- npm 11+

### Instalación

```bash
npm install
```

### Variables de entorno

Usa `.env.example` como base:

```bash
cp .env.example .env.local
```

Variables importantes:

- `DATABASE_URL`
- `AUTH_SECRET`
- `RESEND_API_BASE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LEADS_TO_EMAIL`
- `HOSTAWAY_CLIENT_ID`
- `HOSTAWAY_CLIENT_SECRET`

### Desarrollo

```bash
npm run dev
```

### Calidad

```bash
npm run lint
npm run typecheck
```

## APIs relevantes

Endpoints de leads:

- `POST /api/leads/become-host`
- `POST /api/leads/contactanos`
- `POST /api/leads/gestion-propiedades`

Otros endpoints:

- `GET /api/cnbv-catalog`
- `GET /api/hostaway/listings`
- `GET/POST /api/auth/[...nextauth]`

## Sección técnica

### Herramientas incluidas

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- React Hook Form + Zod
- NextAuth v5
- Prisma
- ESLint + Prettier

### Servicios e integraciones

- Resend: envío de correos de leads.
- Hostaway: datos de listings/operación.
- Base de datos SQL vía Prisma (`better-sqlite3` y `@libsql/client` en dependencias).
- Stripe SDK en frontend/backend para flujos de pago.

## Estructura general

- `src/app`: rutas y API routes.
- `src/components`: átomos, moléculas, organismos y templates.
- `src/assets/images`: recursos visuales de marca.
- `src/lib`: utilidades compartidas.
- `prisma`: configuración y esquema de base de datos.
