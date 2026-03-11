import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Política de cookies | Kanaa",
  description:
    "Información sobre el uso de cookies en el sitio web de Kanaa, incluyendo tipos de cookies, finalidades y cómo gestionarlas o desactivarlas.",
  path: "/politica-de-cookies",
  keywords: [
    "política de cookies",
    "cookies",
    "privacidad",
    "seguimiento",
    "Kanaa",
  ],
});

type Props = {
  params: Promise<{ locale: string }>;
};

const esContent = {
  title: "Política de Cookies",
  lastUpdated: "Última actualización: 10 de marzo de 2026",
  sections: [
    {
      heading: "¿Qué son las cookies?",
      content: `Las cookies son pequeños ficheros de datos que se almacenan en el disco duro del equipo del usuario cuando navega por un sitio de Internet específico. Permiten el intercambio de información de estado entre el sitio y el navegador del usuario, incluyendo:

• Identificación de sesión
• Autenticación
• Preferencias del usuario
• Cualquier dato almacenado por el navegador para mantener la experiencia de navegación

El correcto funcionamiento del sitio web, las aplicaciones y las plataformas de Kanaa requieren el uso de cookies.`,
    },
    {
      heading: "¿Cómo usamos las cookies?",
      content: `Kanaa utiliza cookies para:

<strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio web. Permiten funciones como la navegación entre páginas y el acceso a áreas seguras del sitio. Sin estas cookies, el sitio no puede funcionar correctamente.

<strong>Cookies de rendimiento:</strong> Recopilan información sobre cómo los visitantes usan el sitio, como qué páginas visitan con más frecuencia y si reciben mensajes de error. Esta información se usa para mejorar el funcionamiento del sitio.

<strong>Cookies de funcionalidad:</strong> Permiten al sitio recordar las elecciones del Usuario (como su nombre de usuario, idioma o región) y proporcionar funciones mejoradas y más personalizadas.

<strong>Cookies de publicidad:</strong> Se utilizan para mostrar anuncios relevantes para el Usuario y sus intereses, así como para limitar el número de veces que se muestra un anuncio y para medir la efectividad de las campañas publicitarias.`,
    },
    {
      heading: "Cookies de Terceros",
      content: `Cuando visita nuestro sitio web, inicia sesión, se registra o abre un correo electrónico, socios o proveedores de datos en línea pueden utilizar cookies, balizas publicitarias (píxeles de seguimiento) y tecnologías similares para:

• Asociar estas actividades con información que ellos u otros tienen sobre usted
• Enviar comunicaciones de marketing a su correo electrónico
• Reorientar publicidad (retargeting) en otras plataformas

Estos terceros operan bajo sus propias políticas de privacidad, que le recomendamos revisar.`,
    },
    {
      heading: "Control de Cookies",
      content: `En la mayoría de los navegadores, las cookies son aceptadas automáticamente de forma predeterminada. Sin embargo, el Usuario puede ajustar las preferencias de su navegador para:

• <strong>Aceptar todas las cookies</strong>
• <strong>Rechazar todas las cookies</strong>
• <strong>Recibir una notificación</strong> cuando se envía una cookie

<strong>Importante:</strong> Deshabilitar las cookies puede deshabilitar diversas funciones del sitio o causar una visualización incorrecta. Algunas secciones de la plataforma pueden no estar disponibles si las cookies están desactivadas.

La información de las cookies puede eliminarse al final de cada sesión del navegador o de forma manual en la configuración de su navegador.`,
    },
    {
      heading: "Cómo gestionar cookies en su navegador",
      content: `Puede gestionar o deshabilitar las cookies directamente en la configuración de su navegador:

• <strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
• <strong>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio
• <strong>Safari:</strong> Preferencias → Privacidad → Cookies y datos de sitios web
• <strong>Microsoft Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies

Para más información sobre cómo gestionar cookies, visite <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" class="text-green-normal underline">www.allaboutcookies.org</a>`,
    },
    {
      heading: "Exclusión de Publicidad Basada en Intereses",
      content: `Puede optar por no participar en la recopilación de datos para publicidad basada en intereses visitando:

<a href="https://www.smartrecognition.com/database-opt-out/" target="_blank" rel="noopener noreferrer" class="text-green-normal underline">https://www.smartrecognition.com/database-opt-out/</a>

Para darse de baja del marketing por correo electrónico de Kanaa, haga clic en el enlace "cancelar suscripción" en el pie de página de cualquier correo electrónico de marketing que reciba de nuestra parte.`,
    },
    {
      heading: "Actualizaciones a esta Política",
      content: `Kanaa puede actualizar esta Política de Cookies en cualquier momento. Le notificaremos sobre cambios significativos publicando la nueva política en nuestro sitio web. Le recomendamos revisar esta política periódicamente.

Para cualquier pregunta sobre nuestra Política de Cookies, contáctenos en: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
  ],
};

const enContent = {
  title: "Cookie Policy",
  lastUpdated: "Last updated: March 10, 2026",
  sections: [
    {
      heading: "What are cookies?",
      content: `Cookies are small data files stored on the user's hard drive when browsing a specific Internet site. They allow the exchange of status information between the site and the user's browser, including:

• Session identification
• Authentication
• User preferences
• Any data stored by the browser to maintain the browsing experience

The correct functioning of Kanaa's website, applications, and platforms requires the use of cookies.`,
    },
    {
      heading: "How do we use cookies?",
      content: `Kanaa uses cookies for:

<strong>Essential cookies:</strong> Necessary for the basic functioning of the website. They enable features such as page navigation and access to secure areas of the site. Without these cookies, the site cannot function properly.

<strong>Performance cookies:</strong> Collect information about how visitors use the site, such as which pages they visit most frequently and whether they receive error messages. This information is used to improve site performance.

<strong>Functionality cookies:</strong> Allow the site to remember the User's choices (such as username, language or region) and provide enhanced, more personalized features.

<strong>Advertising cookies:</strong> Used to show ads relevant to the User and their interests, limit the number of times an ad is shown, and measure the effectiveness of advertising campaigns.`,
    },
    {
      heading: "Third-Party Cookies",
      content: `When you visit our website, log in, register or open an email, online data partners or vendors may use cookies, ad beacons (tracking pixels) and similar technologies to:

• Associate these activities with information they or others have about you
• Send marketing communications to your email address
• Retarget advertising on other platforms

These third parties operate under their own privacy policies, which we recommend you review.`,
    },
    {
      heading: "Cookie Control",
      content: `In most browsers, cookies are automatically accepted by default. However, Users can adjust their browser preferences to:

• <strong>Accept all cookies</strong>
• <strong>Reject all cookies</strong>
• <strong>Receive a notification</strong> when a cookie is sent

<strong>Important:</strong> Disabling cookies may disable various site features or cause incorrect display. Some sections of the platform may not be available if cookies are disabled.

Cookie information can be deleted at the end of each browser session or manually in your browser settings.`,
    },
    {
      heading: "How to manage cookies in your browser",
      content: `You can manage or disable cookies directly in your browser settings:

• <strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data
• <strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
• <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
• <strong>Microsoft Edge:</strong> Settings → Privacy, search, and services → Cookies

For more information on how to manage cookies, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" class="text-green-normal underline">www.allaboutcookies.org</a>`,
    },
    {
      heading: "Opt-Out of Interest-Based Advertising",
      content: `You may opt out of data collection for interest-based advertising by visiting:

<a href="https://www.smartrecognition.com/database-opt-out/" target="_blank" rel="noopener noreferrer" class="text-green-normal underline">https://www.smartrecognition.com/database-opt-out/</a>

To unsubscribe from Kanaa's email marketing, click the "unsubscribe" link in the footer of any marketing email you receive from us.`,
    },
    {
      heading: "Updates to this Policy",
      content: `Kanaa may update this Cookie Policy at any time. We will notify you of significant changes by posting the new policy on our website. We recommend reviewing this policy periodically.

For any questions about our Cookie Policy, contact us at: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
  ],
};

export default async function PoliticaCookiesPage({ params }: Props) {
  const { locale } = await params;
  const content = locale === "en" ? enContent : esContent;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-green-dark-active px-6 py-16 text-center md:py-24">
        <h1 className="text-3xl font-bold text-white md:text-5xl">
          {content.title}
        </h1>
        <p className="text-green-light-active mt-4 text-sm">
          {content.lastUpdated}
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-6 py-14 md:py-20">
        <div className="space-y-10">
          {content.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-green-normal mb-3 text-xl font-semibold md:text-2xl">
                {section.heading}
              </h2>
              <div
                className="text-grey-darker leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
