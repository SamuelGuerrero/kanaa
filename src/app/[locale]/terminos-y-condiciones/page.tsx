import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Términos y condiciones | Kanaa",
  description:
    "Lee los términos y condiciones de uso de la plataforma y servicios de Kanaa, incluyendo reservas, cancelaciones, reglas de la casa y responsabilidades.",
  path: "/terminos-y-condiciones",
  keywords: [
    "términos y condiciones",
    "condiciones de uso",
    "reservas",
    "política de cancelación",
    "Kanaa",
  ],
});

type Props = {
  params: Promise<{ locale: string }>;
};

const esContent = {
  title: "Términos y Condiciones",
  lastUpdated: "Última actualización: 10 de marzo de 2026",
  intro:
    "Al registrarse, visitar el sitio, usar la plataforma, hospedarse en las propiedades o adquirir servicios adicionales, el Usuario acepta estos Términos y Condiciones como vinculantes.",
  sections: [
    {
      heading: "1. Elegibilidad",
      content: `El Usuario debe tener al menos 18 años de edad para usar el Servicio, o contar con el consentimiento de sus padres. Los Usuarios no pueden haber sido suspendidos previamente del servicio. El registro y el uso de las propiedades deben cumplir con las leyes mexicanas aplicables.`,
    },
    {
      heading: "2. Uso del Sitio y la Plataforma",
      content: `<strong>2.1 Propiedad Intelectual de Kanaa.</strong> Las marcas registradas y todo el contenido del sitio están protegidos legalmente. Copiar, publicar o distribuir contenido sin consentimiento escrito está prohibido.

<strong>2.2 Licencia Limitada.</strong> Los Usuarios reciben licencias no exclusivas, no transferibles para acceder al sitio y la plataforma únicamente para uso personal. No se permite la reproducción, modificación ni el uso comercial.

<strong>2.3 Limitación de Responsabilidad.</strong> Kanaa no asume ninguna obligación en cuanto al mantenimiento de cuentas, precisión de la información o funcionamiento del sitio. Los servicios se ofrecen "en el estado en que se encuentran" sin garantías sobre calidad, funcionamiento o compatibilidad.

<strong>2.4 Enlaces a Terceros.</strong> Kanaa no es responsable de sitios independientes de terceros ni de productos o servicios adicionales. Los enlaces no constituyen respaldo.

<strong>2.5 Ausencia de Recomendaciones.</strong> Nada en el Sitio y/o la Plataforma constituye sugerencia, recomendación, instrucción, consejo o asesoramiento dirigido a ninguna persona.`,
    },
    {
      heading: "3. Registro de Usuario",
      content: `<strong>3.1</strong> Los Usuarios declaran que toda la información proporcionada es correcta y veraz.

<strong>3.2</strong> Los Usuarios son responsables de mantener la confidencialidad de su cuenta y contraseña. El acceso a través de la cuenta de un Usuario constituye firma electrónica, y los Usuarios asumen responsabilidad por todas las actividades de la cuenta.

<strong>3.3</strong> Los mensajes enviados a través de correo electrónico, teléfono o la plataforma son expresiones vinculantes y pueden ser retenidos por Kanaa.`,
    },
    {
      heading: "4. Publicidad",
      content: `Los anuncios están sujetos a disponibilidad de propiedades, productos y servicios. Las confirmaciones pueden ser modificadas sin responsabilidad. La responsabilidad se limita al reembolso o créditos en cuenta.

Kanaa no garantiza la exactitud de las descripciones de propiedades o servicios. Las fotografías son únicamente indicativas. Si las propiedades no se ajustan a las descripciones, el único recurso disponible es rechazar la propiedad con reembolso dentro de los cinco días hábiles al método de pago original.

Solo son válidas las promociones listadas en el sitio y la plataforma.`,
    },
    {
      heading: "5. Reservas",
      content: `<strong>5.1 Confirmación del Pedido.</strong> Incluye identidad del Usuario, descripción de la propiedad, precios, métodos de pago, disponibilidad y número de confirmación. Las confirmaciones no constituyen aceptación.

<strong>5.2 Precios.</strong> Las tarifas son precios de referencia y no son reembolsables salvo que se indique expresamente lo contrario. Los Usuarios revisan y aceptan las tarifas en la Confirmación del Pedido.

<strong>5.3 Autorización de Cobro.</strong> Los Usuarios autorizan a Kanaa a cobrar todas las sumas aplicables, incluyendo hospedaje, depósitos y cargos.

<strong>5.4 Impuestos.</strong> Pueden aplicarse IVA, impuesto de ocupación, impuesto turístico y otros impuestos indirectos.

<strong>5.5 Cancelación de Reservas.</strong> Kanaa puede rechazar o cancelar reservas por falta de disponibilidad, condición de la propiedad, tarifas impagadas o casos de fuerza mayor.

<strong>5.6 Licencia Limitada de Uso de Propiedad.</strong> Los Usuarios reciben una licencia limitada, exclusiva, no transferible y revocable para ocupar las propiedades reservadas por períodos específicos únicamente para fines personales y no comerciales.`,
    },
    {
      heading: "6. Restricciones y Responsabilidades del Usuario",
      content: `<strong>Cumplimiento Legal:</strong> Kanaa puede tomar medidas requeridas por la ley y puede ingresar a las propiedades para fines de cumplimiento sin responsabilidad.

<strong>Prohibición de Subarrendamiento:</strong> En ningún caso el Usuario podrá subarrendar, ceder el uso, alojar ni dar la Propiedad en comodato gratuito.

<strong>Conducta Prohibida:</strong> Los Usuarios no pueden usar las propiedades de manera ilegal, participar en conductas fraudulentas, discriminación, acoso, violencia o actividades restringidas.

<strong>Obligación de Mantenimiento:</strong> Los Usuarios deben mantener las propiedades en buenas condiciones e informar inmediatamente de cualquier componente que no funcione.

<strong>Inspecciones:</strong> Kanaa puede realizar auditorías de las propiedades durante y después de la ocupación.`,
    },
    {
      heading: "7. Políticas de la Casa",
      content: `<strong>7.1 Política de No Fiestas / No Eventos.</strong>
Está prohibido celebrar cualquier tipo de evento, celebración o fiesta de cualquier tipo dentro de la Propiedad o en cualquiera de las áreas comunes de los edificios. En caso de incumplimiento, Kanaa tendrá derecho a cobrar una penalización de USD $250.00 más IVA por evento.

<strong>7.2 Política de No Fumar.</strong>
Las propiedades de Kanaa son 100% libres de humo, por lo que está prohibido fumar en cualquier lugar de la propiedad, incluidos los balcones. En caso de incumplimiento, Kanaa tendrá derecho a cobrar una penalización de USD $250.00 más IVA.

<strong>7.3 Política de Mascotas.</strong>
A menos que se especifique explícitamente en la confirmación correspondiente, no se permiten animales y/o mascotas en las Propiedades. En caso de incumplimiento, Kanaa tendrá derecho a cobrar una penalización de USD $250.00.

<strong>7.4 Política de Ruido / Horas de Silencio.</strong>
Existe un horario de silencio entre las 10:00 p.m. y las 8:00 a.m., durante el cual el límite máximo de nivel de sonido permitido es de 50 decibeles (dB). En caso de incumplimiento, Kanaa tendrá derecho a cobrar una penalización de USD $250.00.

<strong>7.5 Fotografía y Video.</strong>
Está prohibida la grabación con fines ilícitos, publicitarios o comerciales. En caso de incumplimiento, Kanaa tendrá derecho a cobrar una penalización de USD $250.00 más IVA.`,
    },
    {
      heading: "8. Reglas de la Casa",
      content: `<ol class="list-decimal list-inside space-y-3">
<li>Las propiedades no pueden ser utilizadas por más personas de las registradas. Penalización: $500 USD, sujeto a desalojo.</li>
<li>Los huéspedes deben proporcionar identificación válida, nombres completos, edades, correos electrónicos e información de contacto. El incumplimiento puede resultar en cancelación inmediata sin reembolso.</li>
<li>Los huéspedes deben respetar la privacidad de sus vecinos, evitar actividades ilícitas y seguir las regulaciones del edificio.</li>
<li>Horas de silencio: 10 PM a 8 AM. Penalización: $250 USD, sujeto a desalojo.</li>
<li>No se permiten fiestas o reuniones. Penalización: $250 USD, sujeto a desalojo.</li>
<li>Mascotas prohibidas salvo indicación expresa en la reserva. Penalización por mascota no autorizada: $300 USD. Tarifa de limpieza por mascota autorizada: $30 USD.</li>
<li>No se permite fumar en las instalaciones ni en áreas comunes. Penalización: $250 USD.</li>
<li>Los Usuarios son responsables de los daños a la propiedad. Penalización: monto del daño más $50 USD.</li>
<li>Check-in: 3:00 PM o más tarde. Check-out: 11:00 AM o antes. Salida tardía de menos de 2 horas: $50 USD. Salida tardía de más de 2 horas: costo de una noche adicional.</li>
<li>Las tarifas incluyen uso razonable de electricidad. El uso excesivo puede resultar en cargos adicionales.</li>
</ol>`,
    },
    {
      heading: "9. Políticas de Cancelación",
      content: `<strong>KANAA FIRM:</strong>
Todos los depósitos y pagos son completamente reembolsables si se cancelan al menos 30 días antes del check-in. Si la cancelación ocurre entre 7 y 30 días antes del check-in, los huéspedes recibirán un reembolso del 50%. Si la cancelación ocurre menos de 7 días antes del check-in, los pagos no son reembolsables. Los huéspedes también pueden recibir un reembolso completo si cancelan dentro de las 48 horas posteriores a la reserva, siempre que la cancelación ocurra al menos 14 días antes del check-in.

<strong>KANAA FLEXIBLE:</strong>
Los huéspedes pueden cancelar hasta 5 días antes del check-in para obtener un reembolso completo. Si la cancelación ocurre dentro de los 5 días previos al check-in, se cobrará por cada noche utilizada más una noche completa adicional, más el 50% de las noches no utilizadas.

<strong>KANAA ESTRICTA:</strong>
Todos los depósitos y pagos son reembolsables en un 50% si se cancelan 30 días antes del check-in. Después de ese plazo, no son reembolsables. Si se encuentra un huésped de reemplazo, el huésped recibirá el 75% del valor de la reserva de reemplazo.

<strong>DEPÓSITO NO REEMBOLSABLE:</strong>
Todos los depósitos y pagos no son reembolsables después de 48 horas de la reserva original. Si se cancela una reserva y se encuentra un reemplazo, el huésped recibirá el 75% del valor de la reserva de reemplazo.`,
    },
    {
      heading: "10. Terminación",
      content: `La violación de los Términos y Condiciones, la terminación del contrato de administración de la propiedad o el vencimiento de los derechos sobre la propiedad resultan en la terminación automática de la licencia. Kanaa puede terminar el servicio o las cuentas en cualquier momento con o sin previo aviso. Los Usuarios deben cesar todo uso de la plataforma y la ocupación de la propiedad al momento de la terminación y permanecen responsables de los cargos acumulados.`,
    },
    {
      heading: "11. Otras Disposiciones",
      content: `<strong>Limitación de Responsabilidad:</strong> Kanaa no asume responsabilidad por pérdida de propiedad, robo, desastres naturales e incidentes similares. Los Usuarios liberan a Kanaa de reclamaciones relacionadas.

<strong>Indemnización:</strong> Los Usuarios indemnizan a Kanaa por el incumplimiento de obligaciones, incluyendo honorarios legales.

<strong>Privacidad:</strong> Los Usuarios consienten el tratamiento de datos personales conforme al Aviso de Privacidad de Kanaa bajo la ley federal mexicana.

<strong>Modificaciones:</strong> Kanaa puede modificar los Términos y Condiciones sin previo aviso. Las modificaciones aplican únicamente a operaciones futuras después de su publicación.

<strong>Ley Aplicable y Jurisdicción:</strong> Kanaa y el Usuario acuerdan que estos Términos y Condiciones se regirán por las leyes de los Estados Unidos Mexicanos. Kanaa y el Usuario se someten expresamente a la jurisdicción de los tribunales competentes de la Ciudad de México, renunciando a cualquier otra jurisdicción que les pudiera corresponder.

<strong>Aceptación Irrevocable:</strong> Hacer clic en "Acepto" constituye una aceptación vinculante.`,
    },
  ],
};

const enContent = {
  title: "Terms and Conditions",
  lastUpdated: "Last updated: March 10, 2026",
  intro:
    "By registering, visiting the site, using the platform, staying at properties, or purchasing additional services, users accept these Terms and Conditions as binding.",
  sections: [
    {
      heading: "1. Eligibility",
      content: `Users must be at least 18 years old to use the Service, or have parental consent. Users cannot have been previously suspended from the service. Registration and property use must comply with applicable Mexican laws.`,
    },
    {
      heading: "2. Use of the Site and Platform",
      content: `<strong>2.1 Intellectual Property.</strong> Kanaa's trademarks and all site content are legally protected. Copying, publishing, or distributing content without written consent is prohibited.

<strong>2.2 Limited License.</strong> Users receive non-exclusive, non-transferable licenses to access the site and platform for personal use only. No reproduction, modification, or commercial use is permitted.

<strong>2.3 Liability Limitations.</strong> Kanaa assumes no obligation regarding account maintenance, information accuracy, or site operation. Services are provided "as is" without warranties regarding quality, operation, or compatibility.

<strong>2.4 Third-Party Links.</strong> Kanaa is not responsible for independent third-party sites or additional products or services. Links do not constitute endorsement.

<strong>2.5 No Recommendations.</strong> Nothing on the Site and/or Platform constitutes a suggestion, recommendation, instruction, advice or counsel directed at any person.`,
    },
    {
      heading: "3. User Registration",
      content: `<strong>3.1</strong> Users declare that all submitted information is correct and truthful.

<strong>3.2</strong> Users are responsible for maintaining account confidentiality and password security. Access through a user's account constitutes an electronic signature, and users assume liability for all account activities.

<strong>3.3</strong> Messages sent through email, phone, or the platform are binding expressions of will and may be retained by Kanaa.`,
    },
    {
      heading: "4. Advertising",
      content: `Advertisements are subject to property, product, and service availability. Confirmations may be modified without liability. Liability is limited to reimbursement or account credits.

Kanaa does not warrant accuracy of property or service descriptions. Photographs are for indicative purposes only. If properties don't conform to descriptions, the sole remedy is refusal with reimbursement within five business days to the original payment method.

Only promotions listed on the site and platform are valid.`,
    },
    {
      heading: "5. Reservations",
      content: `<strong>5.1 Order Confirmation.</strong> Includes user identity, property description, pricing, payment methods, availability, and confirmation number. Confirmations do not constitute acceptance.

<strong>5.2 Pricing.</strong> Rates are reference prices and are non-refundable unless expressly stated otherwise. Users review and accept rates in the Order Confirmation.

<strong>5.3 Payment Authorization.</strong> Users authorize Kanaa to collect all applicable sums including lodging, deposits, and fees.

<strong>5.4 Taxes.</strong> VAT, occupancy tax, tourist tax, and other indirect taxes may apply.

<strong>5.5 Cancellation of Reservations.</strong> Kanaa may refuse or cancel reservations due to unavailability, property condition, unpaid fees, or force majeure events.

<strong>5.6 Limited License to Use Property.</strong> Users receive limited, exclusive, non-transferable, revocable licenses to occupy reserved properties for specified periods for personal, non-commercial purposes only.`,
    },
    {
      heading: "6. User Restrictions and Responsibilities",
      content: `<strong>Legal Compliance:</strong> Kanaa may perform acts required by law and may enter properties for compliance purposes without liability.

<strong>Subletting Prohibition:</strong> Under no circumstances may the User sublease, assign the use, lodge or give the Property in gratuitous bailment.

<strong>Prohibited Conduct:</strong> Users cannot use properties unlawfully, engage in fraudulent conduct, discrimination, harassment, violence, or restricted activities.

<strong>Maintenance Obligation:</strong> Users must maintain properties in good condition and immediately report non-working components.

<strong>Inspections:</strong> Kanaa may conduct property audits during and after occupancy.`,
    },
    {
      heading: "7. House Policies",
      content: `<strong>7.1 No Parties / No Events Policy.</strong>
It is prohibited to hold any type of event, celebration or party inside the Property or in any of the common areas of the buildings. Violation: $250 USD penalty plus VAT per event.

<strong>7.2 No Smoking Policy.</strong>
Kanaa properties are 100% smoke-free. Smoking is prohibited anywhere in the property, including balconies. Violation: $250 USD penalty plus VAT.

<strong>7.3 Pet Policy.</strong>
Unless explicitly specified in the confirmation, animals and/or pets are not allowed in the Properties. Violation: $250 USD penalty.

<strong>7.4 Noise / Quiet Hours Policy.</strong>
There is a quiet period between 10:00 PM and 8:00 AM, during which the maximum sound level allowed is 50 decibels (dB). Violation: $250 USD penalty.

<strong>7.5 Photography and Video.</strong>
Recording for illicit, advertising, or commercial purposes is prohibited. Violation: $250 USD penalty plus VAT.`,
    },
    {
      heading: "8. House Rules",
      content: `<ol class="list-decimal list-inside space-y-3">
<li>Properties cannot exceed registered guest capacity. Penalty: $500 USD, subject to eviction.</li>
<li>Guests must provide valid identification, full names, ages, emails, and contact information. Failure may result in immediate cancellation without refund.</li>
<li>Guests must respect neighbor privacy, avoid unlawful activities, and follow building regulations.</li>
<li>Quiet hours: 10 PM to 8 AM. Penalty: $250 USD, subject to eviction.</li>
<li>No parties or gatherings allowed. Penalty: $250 USD, subject to eviction.</li>
<li>Pets prohibited unless noted in reservation. Unauthorized pet penalty: $300 USD. Authorized pet cleaning fee: $30 USD.</li>
<li>No smoking on premises or common areas. Penalty: $250 USD.</li>
<li>Users are liable for property damage. Penalty: damage amount plus $50 USD.</li>
<li>Check-in: 3 PM or later. Check-out: 11 AM or earlier. Late check-out under 2 hours: $50 USD. Late check-out over 2 hours: cost of additional night.</li>
<li>Rates include reasonable electricity usage. Excessive use may result in additional charges.</li>
</ol>`,
    },
    {
      heading: "9. Cancellation Policies",
      content: `<strong>KANAA FIRM:</strong>
Full refund if cancelled at least 30 days before check-in. 50% refund if cancelled between 7–30 days before check-in. Non-refundable if cancelled less than 7 days before check-in. Full refund if cancelled within 48 hours of booking, provided the check-in is at least 14 days away.

<strong>KANAA FLEXIBLE:</strong>
Full refund if cancelled at least 5 days before check-in. If cancelled within 5 days, the guest pays for used nights plus 1 additional night plus 50% of unused nights.

<strong>KANAA STRICT:</strong>
50% refund if cancelled 30+ days before check-in. Non-refundable after that. If a replacement is found, the guest receives 75% of the replacement booking value.

<strong>NON-REFUNDABLE DEPOSIT:</strong>
Non-refundable after 48 hours of the original booking. If a replacement is found, the guest receives 75% of the replacement booking value.`,
    },
    {
      heading: "10. Termination",
      content: `Violation of Terms and Conditions, property management agreement termination, or expired property rights result in automatic license termination. Kanaa may terminate service or accounts at any time with or without notice. Users must cease all platform use and property occupancy upon termination and remain liable for accrued charges.`,
    },
    {
      heading: "11. Other Provisions",
      content: `<strong>Liability Limitations:</strong> Kanaa disclaims liability for property loss, theft, natural disasters, and other incidents. Users release Kanaa from related claims.

<strong>Indemnity:</strong> Users indemnify Kanaa for breach of obligations, including legal fees.

<strong>Privacy:</strong> Users consent to personal data processing per Kanaa's Privacy Notice under Mexican federal law.

<strong>Modifications:</strong> Kanaa may modify Terms and Conditions without notice. Modifications apply only to future operations after posting.

<strong>Governing Law and Jurisdiction:</strong> Kanaa and the User agree that these Terms and Conditions shall be governed by the laws of the United Mexican States. Kanaa and the User expressly submit to the jurisdiction of the competent courts of Mexico City, waiving any other jurisdiction to which they may be entitled.

<strong>Irrevocable Acceptance:</strong> Clicking "I Accept" constitutes binding acceptance.`,
    },
  ],
};

export default async function TerminosCondicionesPage({ params }: Props) {
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

      {/* Intro */}
      <section className="bg-grey-light px-6 py-8">
        <p className="mx-auto max-w-4xl text-center text-base leading-relaxed text-gray-700">
          {content.intro}
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
