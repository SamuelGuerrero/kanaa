/**
 * Renders a JSON-LD <script> tag for structured data (schema.org).
 * Use in Server Components — no "use client" needed.
 *
 * @example
 *   <StructuredData data={organizationSchema()} />
 *   <StructuredData data={[schema1, schema2]} />
 */

type StructuredDataProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Record<string, any>[];
};

export const StructuredData = ({ data }: StructuredDataProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data, null, 0),
    }}
  />
);
