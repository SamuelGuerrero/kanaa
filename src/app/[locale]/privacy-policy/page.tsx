import { Text } from "@/components/atoms";
import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Política de privacidad | Kanaa",
  description:
    "Conoce cómo Kanaa recopila, usa y protege tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
  path: "/privacy-policy",
  keywords: [
    "política de privacidad",
    "aviso de privacidad",
    "protección de datos",
    "datos personales",
    "Kanaa",
  ],
});

type Props = {
  params: Promise<{ locale: string }>;
};

const esContent = {
  title: "Aviso de Privacidad",
  lastUpdated: "Última actualización: 10 de marzo de 2026",
  sections: [
    {
      heading: "1. Identidad y domicilio del Responsable",
      content: `Kanaa (en adelante "Kanaa"), en su calidad de responsable del tratamiento de datos personales ("Responsable"), pone a su disposición el presente Aviso de Privacidad en cumplimiento de las disposiciones de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y los Lineamientos del Aviso de Privacidad. Para cualquier cuestión relativa al tratamiento de sus datos, puede contactarnos en: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
    {
      heading: "2. Datos Personales Recabados",
      content: `Kanaa, en su calidad de Responsable, podrá recabar uno o más de los siguientes Datos Personales:

<strong>a. Datos de identificación:</strong> nombre, domicilio, fecha de nacimiento, edad, nacionalidad, CURP, RFC, número de teléfono fijo o móvil, correo electrónico, copia de identificación oficial y copia de comprobante de domicilio.

<strong>b. Datos Financieros o Patrimoniales:</strong> información de cuentas bancarias y tarjetas de crédito, información de valores e inmuebles, y cualquier información financiera necesaria para cumplir con las finalidades de tratamiento establecidas en el presente Aviso de Privacidad.`,
    },
    {
      heading: "3. Finalidades Primarias del Tratamiento",
      content: `<strong>a. Usuarios / Clientes:</strong> Los datos personales podrán ser utilizados para: (i) identificación y verificación de identidad; (ii) envío de información sobre uso de inmuebles, hospedaje, adquisición de productos y/o contratación de servicios; (iii) entrega de información sobre productos y servicios; (iv) mostrar publicidad y anuncios relacionados con servicios y productos; (v) atención a dudas, quejas y sugerencias; (vi) procesamiento de pagos; (vii) facturación de pagos por cualquier medio; (viii) comunicación de ofertas a través de la cuenta; (ix) realización de pagos en línea autorizados por teléfono u otros medios; y (x) solicitar, contratar, cambiar o cancelar servicios ofrecidos por Kanaa o por terceros.

<strong>b. Propietarios:</strong> Los datos personales podrán ser utilizados para: (i) realización de auditorías en los inmuebles; (ii) elaboración de un catálogo inmobiliario dentro de una plataforma tecnológica; (iii) reproducción de fotografías, videos, planos, diagramas, bocetos, renders y cualquier material de los inmuebles; (iv) publicidad y/o oferta de inmuebles para renta o uso; y (v) cumplimiento de obligaciones regulatorias, incluyendo la prevención de lavado de dinero y financiamiento al terrorismo.`,
    },
    {
      heading: "4. Finalidades Secundarias del Tratamiento",
      content: `Los Datos Personales podrán ser utilizados para: (i) ofrecer promociones y eventos; (ii) realizar estudios e investigaciones de mercado; (iii) conocer patrones o tendencias de consumo; (iv) recibir publicidad impresa o a través de medios electrónicos, incluyendo comunicaciones de marketing en línea o telemarketing; y (v) participar en encuestas.

Para oponerse al tratamiento de sus datos para finalidades secundarias, puede enviar su solicitud a: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
    {
      heading: "5. Datos Personales Sensibles",
      content: `El Responsable no recaba ni trata Datos Personales Sensibles en el curso ordinario de sus actividades. En caso de que se recaben y traten Datos Personales Sensibles, dichos datos serán recopilados, mantenidos y tratados con estricta seguridad y confidencialidad.`,
    },
    {
      heading: "6. Transferencia de Datos Personales",
      content: `Al aceptar el presente Aviso de Privacidad, el Titular consiente para que el Responsable transfiera Datos Personales a cualquier tercero, ya sea nacional o extranjero. Los terceros están obligados a mantener la confidencialidad y a cumplir con el presente Aviso de Privacidad. El Responsable podrá transferir Datos Personales a empresas del mismo grupo empresarial. No se requiere autorización para transferencias encuadradas en el Artículo 37 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.

Para oponerse a la transferencia de sus datos, puede contactarnos en: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
    {
      heading: "7. Uso y Limitaciones de Divulgación",
      content: `Se implementan procedimientos físicos, electrónicos y administrativos para limitar el uso o divulgación de los datos. Los Datos Personales serán tratados exclusivamente por personas que realicen actividades que requieran conocimiento de dichos datos. Todos los datos son salvaguardados bajo los más altos estándares de seguridad.

Para limitar el uso de sus datos, puede contactarnos en: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>. Los Titulares también pueden registrarse en el REPEP (registro de PROFECO).`,
    },
    {
      heading: "8. Derechos ARCO",
      content: `Los Titulares tienen el derecho de Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales, así como de revocar su consentimiento. Las solicitudes deben incluir: nombre completo, domicilio, documentos que acrediten identidad y una descripción clara de los datos personales en cuestión.

Kanaa responderá en un plazo de 20 días naturales; los cambios serán efectivos dentro de los 15 días naturales posteriores a la notificación. Kanaa podrá denegar el acceso en los siguientes casos: (i) el solicitante no es el Titular o su representante; (ii) los datos no se encuentran en la base de datos; (iii) se lesionan los derechos de un tercero; (iv) existe impedimento legal o resolución de autoridad competente; (v) la rectificación, cancelación u oposición ya se ha realizado anteriormente.

Los Titulares pueden iniciar procedimientos de protección ante el INAI dentro de los 15 días calendarios siguientes a una respuesta insatisfactoria.

Envíe su solicitud a: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
    {
      heading: "9. Revocación del Consentimiento",
      content: `Para revocar su consentimiento, envíe un correo electrónico a: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>. Los terceros con acceso a los datos también serán informados de la revocación.`,
    },
    {
      heading: "10. Unidad de Protección de Datos Personales",
      content: `Puede contactar a nuestra Unidad de Protección de Datos Personales en: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>. Para consultas ante el INAI: <a href="http://inicio.inai.org.mx" target="_blank" rel="noopener noreferrer" class="text-green-normal underline">http://inicio.inai.org.mx</a>`,
    },
    {
      heading: "11. Modificaciones al Aviso de Privacidad",
      content: `Las modificaciones al presente Aviso de Privacidad se pondrán a disposición del público en el sitio web de Kanaa. Los Titulares son responsables de revisar periódicamente el Aviso de Privacidad.`,
    },
    {
      heading: "12. Uso de Cookies",
      content: `El correcto funcionamiento de los sitios, aplicaciones y plataformas del Responsable requiere el uso de cookies. Las cookies son pequeños archivos de datos que se almacenan en el disco duro del equipo del usuario cuando navega por un sitio de Internet específico, y permiten el intercambio de información de estado entre el sitio y el navegador del usuario, incluyendo identificación de sesión, autenticación, preferencias del usuario y cualquier dato almacenado por el navegador.

En la mayoría de los navegadores, las cookies son aceptadas automáticamente de forma predeterminada, aunque los Titulares pueden ajustar las preferencias de su navegador para aceptar o rechazar cookies. Deshabilitar las cookies puede deshabilitar diversas funciones o causar una visualización incorrecta. La información de las cookies puede eliminarse al final de cada sesión del navegador.`,
    },
    {
      heading: "13. Píxeles y Cookies de Terceros",
      content: `Cuando visita nuestro sitio web, inicia sesión, se registra o abre un correo electrónico, socios o proveedores de datos en línea pueden utilizar cookies, balizas publicitarias y tecnologías similares para asociar estas actividades con información que ellos u otros tienen sobre usted, incluyendo su dirección de correo electrónico. Posteriormente, pueden enviarse comunicaciones y marketing a estas direcciones de correo electrónico.

Puede optar por no participar visitando: <a href="https://www.smartrecognition.com/database-opt-out/" target="_blank" rel="noopener noreferrer" class="text-green-normal underline">https://www.smartrecognition.com/database-opt-out/</a>. Para darse de baja del marketing por correo electrónico de una marca específica, haga clic en el enlace "cancelar suscripción" en el pie de página de cualquier correo electrónico de marketing.`,
    },
  ],
};

const enContent = {
  title: "Privacy Notice",
  lastUpdated: "Last updated: March 10, 2026",
  sections: [
    {
      heading: "1. Identity and Address of the Controller",
      content: `Kanaa (hereinafter "Kanaa"), in its capacity as responsible for the processing of personal data ("Controller"), makes available to you this Privacy Notice in compliance with the provisions of the Federal Law of Personal Data in Possession of Individuals, its Regulations and the Guidelines of the Privacy Notice. For any questions regarding the processing of your data, please contact us at: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
    {
      heading: "2. Personal Data Collected",
      content: `Kanaa, in its capacity as Controller, may collect one or more of the following Personal Data:

<strong>a. Identification Data:</strong> name, home address, date of birth, age, nationality, CURP, RFC, telephone number (landline or mobile), email, copy of official identification and copy of proof of address.

<strong>b. Financial or Property Data:</strong> bank account and credit card information, securities and real estate information, and any financial information necessary to fulfill the processing purposes set forth in this Privacy Notice.`,
    },
    {
      heading: "3. Primary Purposes of Data Processing",
      content: `<strong>a. Users / Customers:</strong> Personal data may be used for: (i) identification and verification of identity; (ii) sending information on use of real estate, lodging, acquisition of products and/or contracting of services; (iii) delivering information on products and services; (iv) showing advertising and announcements related to services and products; (v) attending to doubts, complaints and suggestions; (vi) processing payments; (vii) invoicing payments by any means; (viii) communicating offers through the account; (ix) making online payments authorized by telephone or other means; and (x) requesting, contracting, changing or canceling services offered by Kanaa or by third parties.

<strong>b. Property Owners:</strong> Personal data may be used for: (i) performing audits on properties; (ii) preparation of a real estate catalog within a technology platform; (iii) reproducing photographs, videos, plans, diagrams, sketches, renderings and any material of the properties; (iv) advertising and/or offering properties for rent or use; and (v) complying with regulatory obligations, including the prevention of money laundering and financing of terrorism.`,
    },
    {
      heading: "4. Secondary Purposes of Data Processing",
      content: `Personal data may be used for: (i) offering promotions and events; (ii) conducting market research and analysis; (iii) understanding consumption patterns or trends; (iv) receiving printed advertising or through electronic media, including online marketing or telemarketing communications; and (v) participating in surveys.

To opt out of secondary processing, contact: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
    {
      heading: "5. Sensitive Personal Data",
      content: `The Controller does not collect or process Sensitive Personal Data in the ordinary course of its activities. In the event that Sensitive Personal Data is collected and processed, such data will be collected, maintained and processed with strict security and confidentiality.`,
    },
    {
      heading: "6. Transfer of Personal Data",
      content: `By accepting this Privacy Notice, the Data Subject consents to the Controller transferring Personal Data to any third party, whether domestic or foreign. Third parties are obliged to maintain confidentiality and comply with this Privacy Notice. The Controller may transfer Personal Data to companies in the same business group. No authorization is required for transfers falling under Article 37 of the Federal Law on Personal Data in Possession of Individuals.

To refuse transfer, contact: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
    {
      heading: "7. Use and Disclosure Limitations",
      content: `Physical, electronic and administrative procedures limit the use or disclosure of data. Personal Data will be processed exclusively by persons who perform activities requiring knowledge of such data. All data is safeguarded under the highest security standards.

To limit the use of your data, contact: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>. Data Subjects may also register with REPEP (PROFECO's registry).`,
    },
    {
      heading: "8. ARCO Rights",
      content: `Data Subjects have the right to Access, Rectify, Cancel or Object to the processing of their personal data, and to revoke consent. Requests must include: full name, address, documents proving identity, and a clear description of the personal data in question.

Kanaa will respond within 20 calendar days; changes will be effective within 15 calendar days of notification. Kanaa may deny access in the following cases: (i) the applicant is not the Data Subject or their representative; (ii) data is not found in the database; (iii) the rights of a third party are injured; (iv) there is a legal impediment or resolution of a competent authority; (v) rectification, cancellation or opposition has been previously made.

Data Subjects may initiate protection procedures before INAI within 15 calendar days of an unsatisfactory response.

Submit your request to: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>`,
    },
    {
      heading: "9. Revocation of Consent",
      content: `To revoke your consent, send an email to: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>. Third parties with access to the data will also be informed of the revocation.`,
    },
    {
      heading: "10. Personal Data Protection Unit",
      content: `You may contact our Personal Data Protection Unit at: <a href="mailto:legal@kanaa.mx" class="text-green-normal underline">legal@kanaa.mx</a>. For INAI inquiries: <a href="http://inicio.inai.org.mx" target="_blank" rel="noopener noreferrer" class="text-green-normal underline">http://inicio.inai.org.mx</a>`,
    },
    {
      heading: "11. Modifications to the Privacy Notice",
      content: `Modifications to this Privacy Notice will be made available on the Kanaa website. Data Subjects are responsible for periodically reviewing the Privacy Notice.`,
    },
    {
      heading: "12. Use of Cookies",
      content: `The correct functioning of the Controller's sites, applications and platforms requires the use of cookies. Cookies are small data files stored on the user's hard drive when browsing a specific Internet site, and allow the exchange of status information between the site and the user's browser, including session identification, authentication, user preferences, and any data stored by the browser.

In most browsers, cookies are automatically accepted by default, although Data Subjects can adjust their browser preferences to accept or reject cookies. Disabling cookies may disable various functions or cause incorrect display. Cookie information can be deleted at the end of each browser session.`,
    },
    {
      heading: "13. Third-Party Pixels and Cookies",
      content: `When you visit our website, log in, register or open an email, online data partners or vendors may use cookies, ad beacons, and similar technologies to associate these activities with information they or others have about you, including your email address. Marketing communications may then be sent to these email addresses.

You may opt out by visiting: <a href="https://www.smartrecognition.com/database-opt-out/" target="_blank" rel="noopener noreferrer" class="text-green-normal underline">https://www.smartrecognition.com/database-opt-out/</a>. To opt out of email marketing from a specific brand, click the "unsubscribe" link in the footer of any marketing email.`,
    },
  ],
};

export default async function PoliticaPrivacidadPage({ params }: Props) {
  const { locale } = await params;
  const content = locale === "en" ? enContent : esContent;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-green-dark-active px-6 pt-36 pb-16 text-center md:pt-44 md:pb-24">
        <Text as="h1" size="5xl" weight="bold" className="text-white">
          {content.title}
        </Text>
        <Text size="sm" className="text-green-light-active mt-4">
          {content.lastUpdated}
        </Text>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-6 py-14 md:py-20">
        <div className="space-y-10">
          {content.sections.map((section, index) => (
            <div key={index}>
              <Text
                as="h2"
                size="2xl"
                weight="semibold"
                className="text-green-normal mb-3"
              >
                {section.heading}
              </Text>
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
