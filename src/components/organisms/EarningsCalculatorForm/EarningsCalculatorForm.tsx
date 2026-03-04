"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import {
  CircleButton,
  SelectForm,
  InputForm,
  Text,
  Loader,
} from "@/components/atoms";
import { Button } from "@/components/molecules";
import { useI18n } from "@/i18n";
import { zodResolver } from "@/lib/forms/zodResolver";

const formSchema = z.object({
  postalCode: z.string().regex(/^\d{5}$/, "Ingresa un codigo postal valido."),
  state: z.string().min(1, "Selecciona un estado."),
  city: z.string().min(1, "Selecciona una ciudad."),
  neighborhood: z.string().min(1, "Selecciona una colonia."),
  propertyAddress: z.string().min(5, "Ingresa la direccion de la propiedad."),
  guestCount: z.string().min(1, "Selecciona cantidad de huespedes."),
  propertyType: z.string().min(1, "Selecciona tipo de propiedad."),
  bedroomCount: z.string().min(1, "Selecciona cantidad de habitaciones."),
  bathroomCount: z.string().min(1, "Selecciona cantidad de banos."),
  yearsOwned: z.string().min(1, "Selecciona anos de propiedad."),
});

type PropertyDetails = z.infer<typeof formSchema>;
const leadContactSchema = z.object({
  contactEmail: z.string().email("Ingresa un correo valido."),
  contactPhone: z
    .string()
    .min(8, "Ingresa un telefono valido.")
    .max(20, "Ingresa un telefono valido."),
  contactFullName: z
    .string()
    .min(3, "Ingresa tu nombre completo.")
    .max(120, "Ingresa un nombre valido."),
});

type LeadContactValues = z.infer<typeof leadContactSchema>;

type CnbvRow = {
  id: string;
  codigo: string;
  clave_estado: string;
  estado: string;
  clave_mnpio: string;
  mnpio: string;
  clave_asenta: string;
  asenta: string;
  ocupacion_promedio: number | null;
};

type PredictionResponse = {
  prediction?: number[];
  raw_prediction?: number[];
  success?: boolean;
};

type LeadEmailPayload = PropertyDetails & {
  estimatedMonthlyRevenue?: number | null;
  estimatedAnnualRevenue?: number | null;
  contactEmail?: string;
  contactPhone?: string;
  contactFullName?: string;
};

const PRICE_PREDICTION_ENDPOINT =
  "https://tbc2lqdcqh.execute-api.us-east-1.amazonaws.com/predict";

const toNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatAmount = (value: number) => {
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const EarningsCalculatorForm = () => {
  const { t } = useI18n();
  const {
    register: registerProperty,
    handleSubmit: handlePropertySubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<PropertyDetails>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });
  const {
    control: leadContactControl,
    handleSubmit: handleLeadContactSubmit,
    reset: resetLeadContactForm,
    formState: {
      isSubmitting: isLeadContactSubmitting,
      errors: leadContactErrors,
    },
  } = useForm<LeadContactValues>({
    resolver: zodResolver(leadContactSchema),
    mode: "onBlur",
  });

  const [catalogRows, setCatalogRows] = useState<CnbvRow[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [predictionError, setPredictionError] = useState("");
  const [leadStatusMessage, setLeadStatusMessage] = useState("");
  const [showLeadCaptureStep, setShowLeadCaptureStep] = useState(false);
  const [hasSubmittedLead, setHasSubmittedLead] = useState(false);
  const [propertyLeadPayload, setPropertyLeadPayload] =
    useState<PropertyDetails | null>(null);

  const postalCode = watch("postalCode");
  const selectedState = watch("state");
  const selectedCity = watch("city");
  const selectedNeighborhood = watch("neighborhood");

  useEffect(() => {
    const trimmed = (postalCode ?? "").trim();
    if (trimmed.length !== 5) {
      setCatalogRows([]);
      setCatalogError("");
      setValue("state", "");
      setValue("city", "");
      setValue("neighborhood", "");
      return;
    }

    let cancelled = false;
    const run = async () => {
      setCatalogLoading(true);
      setCatalogError("");
      try {
        const res = await fetch(`/api/cnbv-catalog?codigo=${trimmed}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as { rows: CnbvRow[] };
        if (cancelled) return;
        setCatalogRows(Array.isArray(data.rows) ? data.rows : []);
        if (!data.rows || data.rows.length === 0) {
          setCatalogError("No encontramos datos para ese código postal.");
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Error fetching catalog:", error);
        setCatalogError("No se pudo consultar el catálogo.");
        setCatalogRows([]);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [postalCode, setValue]);

  const stateOptions = useMemo(() => {
    const states = Array.from(new Set(catalogRows.map((row) => row.estado)));
    return states.map((state) => ({ value: state, label: state }));
  }, [catalogRows]);

  const cityOptions = useMemo(() => {
    if (!selectedState) return [];
    const cities = Array.from(
      new Set(
        catalogRows
          .filter((row) => row.estado === selectedState)
          .map((row) => row.mnpio),
      ),
    );
    return cities.map((city) => ({ value: city, label: city }));
  }, [catalogRows, selectedState]);

  const neighborhoodOptions = useMemo(() => {
    if (!selectedState || !selectedCity) return [];
    const neighborhoods = Array.from(
      new Set(
        catalogRows
          .filter(
            (row) => row.estado === selectedState && row.mnpio === selectedCity,
          )
          .map((row) => row.asenta),
      ),
    );
    return neighborhoods.map((neighborhood) => ({
      value: neighborhood,
      label: neighborhood,
    }));
  }, [catalogRows, selectedState, selectedCity]);

  const ocupacionPromedio = useMemo(() => {
    if (!selectedState || !selectedCity || !selectedNeighborhood) return null;
    const row = catalogRows.find(
      (r) =>
        r.estado === selectedState &&
        r.mnpio === selectedCity &&
        r.asenta === selectedNeighborhood,
    );
    return row?.ocupacion_promedio ?? null;
  }, [catalogRows, selectedState, selectedCity, selectedNeighborhood]);

  const annualEstimate = useMemo(() => {
    if (prediction === null || ocupacionPromedio === null) return null;
    return prediction * 0.8 * (ocupacionPromedio / 100) * 365;
  }, [prediction, ocupacionPromedio]);

  useEffect(() => {
    if (stateOptions.length === 1) {
      setValue("state", stateOptions[0]?.value ?? "");
    }
  }, [stateOptions, setValue]);

  useEffect(() => {
    if (!selectedState) {
      setValue("city", "");
      setValue("neighborhood", "");
      return;
    }
    if (cityOptions.length === 1) {
      setValue("city", cityOptions[0]?.value ?? "");
    }
  }, [selectedState, cityOptions, setValue]);

  useEffect(() => {
    if (!selectedCity) {
      setValue("neighborhood", "");
      return;
    }
    if (neighborhoodOptions.length === 1) {
      setValue("neighborhood", neighborhoodOptions[0]?.value ?? "");
    }
  }, [selectedCity, neighborhoodOptions, setValue]);

  const onSubmit = async (data: PropertyDetails) => {
    setPrediction(null);
    setPredictionError("");
    setLeadStatusMessage("");
    setShowLeadCaptureStep(false);
    setHasSubmittedLead(false);
    setPropertyLeadPayload(null);

    const payload = {
      features: {
        estado: data.state,
        ciudad: data.city,
        colonia_municipio: data.neighborhood,
        tipo_alojamiento: data.propertyType,
        num_cuartos:
          data.bedroomCount === "studio" ? 0 : toNumber(data.bedroomCount, 1),
        num_banos: toNumber(data.bathroomCount, 1),
        num_huespedes: toNumber(data.guestCount, 1),
      },
    };

    try {
      const response = await fetch(PRICE_PREDICTION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = (await response.json()) as PredictionResponse;
      const predictedValue = result.prediction?.[0];

      if (typeof predictedValue !== "number" || Number.isNaN(predictedValue)) {
        throw new Error("Prediction not found");
      }

      setPrediction(predictedValue);
      setPropertyLeadPayload(data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPredictionError(
        "No pudimos calcular el precio en este momento. Inténtalo nuevamente.",
      );
    }
  };

  const onSubmitLeadContact = async (data: LeadContactValues) => {
    if (!propertyLeadPayload) {
      setLeadStatusMessage("No encontramos los datos de la propiedad.");
      return;
    }

    setLeadStatusMessage("");

    try {
      const leadPayload: LeadEmailPayload = {
        ...propertyLeadPayload,
        estimatedMonthlyRevenue:
          typeof prediction === "number" ? prediction * 0.8 : null,
        estimatedAnnualRevenue: annualEstimate,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactFullName: data.contactFullName,
      };

      const leadResponse = await fetch("/api/leads/gestion-propiedades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadPayload),
      });

      const leadResponseBody = (await leadResponse
        .json()
        .catch(() => ({}))) as {
        id?: string;
        error?: string;
      };

      if (!leadResponse.ok) {
        throw new Error(
          leadResponseBody.error ?? `HTTP ${leadResponse.status}`,
        );
      }

      setHasSubmittedLead(true);
      resetLeadContactForm();
      setLeadStatusMessage(
        "Gracias, te enviaremos tu análisis personalizado y nuestro equipo te contactará pronto.",
      );
    } catch (error) {
      console.error("Error sending lead email:", error);
      setLeadStatusMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron enviar tus datos. Intenta nuevamente.",
      );
    }
  };

  const showLoadingState = isSubmitting;
  const showResultState = !showLoadingState && prediction !== null;

  return (
    <div
      className="relative w-full rounded-lg border border-white/20 p-3.5 backdrop-blur-[22.39px] md:w-160.25 md:border-white/0 md:p-8"
      style={{
        background: `
          radial-gradient(
            90.16% 143.01% at 15.32% 21.04%, 
            rgba(255, 255, 255, 0.2) 0%, 
            rgba(255, 255, 255, 0.045) 77.08%, 
            rgba(255, 255, 255, 0) 100%
          )
        `,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="bg-green-dark/65 absolute inset-0 rounded-lg md:hidden" />

      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(235deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {!showLoadingState && !showResultState && (
        <form
          className="relative z-10 grid grid-cols-2 gap-2 md:gap-4"
          onSubmit={handlePropertySubmit(onSubmit)}
        >
          <div className="col-span-2">
            <InputForm
              className="h-11 w-full md:h-13.75"
              placeholder={t("Dirección de propiedad")}
              type="text"
              error={errors.propertyAddress?.message ? t(errors.propertyAddress.message) : undefined}
              {...registerProperty("propertyAddress")}
            />
          </div>
          <div className="col-span-1">
            <InputForm
              className="h-11 w-full md:h-13.75"
              placeholder={t("Código postal")}
              type="text"
              inputMode="numeric"
              maxLength={5}
              error={errors.postalCode?.message ? t(errors.postalCode.message) : undefined}
              {...registerProperty("postalCode")}
            />
            {catalogLoading && (
              <p className="mt-1 text-xs text-white/80">
                {t("Buscando código postal...")}
              </p>
            )}
            {catalogError && (
              <p className="mt-1 text-xs text-red-200">{t(catalogError)}</p>
            )}
          </div>
          <div className="col-span-1">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel={t("Estado")}
              options={stateOptions}
              disabled={stateOptions.length === 0}
              error={errors.state?.message ? t(errors.state.message) : undefined}
              {...registerProperty("state")}
            />
          </div>
          <div className="col-span-2">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel={t("Ciudad")}
              options={cityOptions}
              disabled={cityOptions.length === 0}
              error={errors.city?.message ? t(errors.city.message) : undefined}
              {...registerProperty("city")}
            />
          </div>
          <div className="col-span-2">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel={t("Colonia")}
              options={neighborhoodOptions}
              disabled={neighborhoodOptions.length === 0}
              error={errors.neighborhood?.message ? t(errors.neighborhood.message) : undefined}
              {...registerProperty("neighborhood")}
            />
          </div>
          <div className="col-span-1">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel={t("Cantidad de huéspedes")}
              options={[
                { value: "1", label: t("1 huésped") },
                { value: "2", label: t("2 huéspedes") },
                { value: "3", label: t("3 huéspedes") },
                { value: "4", label: t("4 huéspedes") },
                { value: "5", label: t("5 huéspedes") },
                { value: "6", label: t("6+ huéspedes") },
              ]}
              error={errors.guestCount?.message ? t(errors.guestCount.message) : undefined}
              {...registerProperty("guestCount")}
            />
          </div>

          <div className="col-span-1">
            <SelectForm
              className="md:h-13.755 h-11 w-full"
              defaultOptionLabel={t("Tipo de propiedad")}
              options={[
                { value: "Departamento", label: t("Departamento") },
                { value: "Casa", label: t("Casa") },
                { value: "Loft", label: t("Loft") },
                { value: "Estudio", label: t("Estudio") },
                { value: "Townhouse", label: t("Townhouse") },
                { value: "Otro", label: t("Otro") },
              ]}
              error={errors.propertyType?.message ? t(errors.propertyType.message) : undefined}
              {...registerProperty("propertyType")}
            />
          </div>

          <div className="col-span-1">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel={t("No. de habitaciones")}
              options={[
                { value: "studio", label: t("Studio (sin habitación)") },
                { value: "1", label: t("1 habitación") },
                { value: "2", label: t("2 habitaciones") },
                { value: "3", label: t("3 habitaciones") },
                { value: "4", label: t("4 habitaciones") },
                { value: "5", label: t("5+ habitaciones") },
              ]}
              error={errors.bedroomCount?.message ? t(errors.bedroomCount.message) : undefined}
              {...registerProperty("bedroomCount")}
            />
          </div>

          <div className="col-span-1">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel={t("No. de baños")}
              options={[
                { value: "1", label: t("1 baño") },
                { value: "1.5", label: t("1.5 baños") },
                { value: "2", label: t("2 baños") },
                { value: "2.5", label: t("2.5 baños") },
                { value: "3", label: t("3 baños") },
                { value: "4", label: t("4+ baños") },
              ]}
              error={errors.bathroomCount?.message ? t(errors.bathroomCount.message) : undefined}
              {...registerProperty("bathroomCount")}
            />
          </div>

          <div className="col-span-2">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel={t("Años de propiedad")}
              options={[
                { value: "less1", label: t("Menos de 1 año") },
                { value: "1-3", label: t("1 a 3 años") },
                { value: "3-5", label: t("3 a 5 años") },
                { value: "5-10", label: t("5 a 10 años") },
                { value: "10+", label: t("Más de 10 años") },
              ]}
              error={errors.yearsOwned?.message ? t(errors.yearsOwned.message) : undefined}
              {...registerProperty("yearsOwned")}
            />
          </div>

          {predictionError && (
            <p className="col-span-2 mt-1 text-sm text-red-200">
              {t(predictionError)}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            textWeight="bold"
            className={`text-gold-darker col-span-2 mx-auto mt-3 flex h-11.5 w-[80%] justify-center md:mt-5 md:w-fit md:text-start ${isSubmitting ? "cursor-not-allowed opacity-60" : ""}`}
            icon={
              <CircleButton>
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            {t("Calcular ingreso")}
          </Button>
        </form>
      )}

      {showLoadingState && (
        <div className="relative z-10 h-106.25 px-4 text-center md:px-10">
          <div className="mx-auto flex w-full max-w-138.5 flex-col items-center gap-5 pt-17">
            <Text size="3xl" weight="medium" className="text-white">
              {t("Espera unos momentos")}
            </Text>
            <Text font="gilroy" size="lg" className="text-white">
              {t("Estamos calculando el precio aproximado de tu propiedad")}
            </Text>
          </div>

          <Loader className="top-60" />
        </div>
      )}

      {showResultState && (
        <div className="relative z-10 min-h-106.25 px-0 pt-14 text-center md:px-0">
          {showLeadCaptureStep ? (
            hasSubmittedLead ? (
              <div className="mx-auto max-w-4xl px-4 pt-10 md:px-0">
                <Text size="3xl" weight="medium" className="text-white">
                  {t("Solicitud enviada con éxito")}
                </Text>
                <Text
                  font="gilroy"
                  size="lg"
                  className="mx-auto mt-4 max-w-3xl text-white/90"
                >
                  {leadStatusMessage ? t(leadStatusMessage) : ""}
                </Text>
              </div>
            ) : (
              <div className="mx-auto w-full px-4 md:px-0">
                <Text size="3xl" weight="medium" className="text-white">
                  {t("Obtén tu análisis completo")}
                </Text>
                <Text
                  font="gilroy"
                  size="lg"
                  className="mx-auto mt-4 max-w-3xl text-white"
                >
                  {t("Te enviaremos una proyección mensual personalizada.")}
                </Text>

                <form
                  className="mx-auto mt-10 grid w-full gap-4"
                  onSubmit={handleLeadContactSubmit(onSubmitLeadContact)}
                >
                  <Controller
                    control={leadContactControl}
                    name="contactEmail"
                    render={({ field }) => (
                      <InputForm
                        type="email"
                        placeholder={t("Correo electrónico")}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        className="font-gilroy w-[90%] text-[16.33px] font-semibold text-white placeholder-white/75 focus:text-white focus:placeholder-white/60"
                      />
                    )}
                  />
                  {leadContactErrors.contactEmail?.message ? (
                    <Text
                      size="xs"
                      font="gilroy"
                      className="-mt-2 text-left text-red-200"
                    >
                      {t(leadContactErrors.contactEmail.message)}
                    </Text>
                  ) : null}

                  <Controller
                    control={leadContactControl}
                    name="contactPhone"
                    render={({ field }) => (
                      <InputForm
                        type="tel"
                        placeholder={t("Teléfono")}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        className="font-gilroy w-[90%] text-[16.33px] font-semibold text-white placeholder-white/75 focus:text-white focus:placeholder-white/60"
                      />
                    )}
                  />
                  {leadContactErrors.contactPhone?.message ? (
                    <Text
                      size="xs"
                      font="gilroy"
                      className="-mt-2 text-left text-red-200"
                    >
                      {t(leadContactErrors.contactPhone.message)}
                    </Text>
                  ) : null}

                  <Controller
                    control={leadContactControl}
                    name="contactFullName"
                    render={({ field }) => (
                      <InputForm
                        type="text"
                        placeholder={t("Nombre Completo")}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        className="font-gilroy w-[90%] text-[16.33px] font-semibold text-white placeholder-white/75 focus:text-white focus:placeholder-white/60"
                      />
                    )}
                  />
                  {leadContactErrors.contactFullName?.message ? (
                    <Text
                      size="xs"
                      font="gilroy"
                      className="-mt-2 text-left text-red-200"
                    >
                      {t(leadContactErrors.contactFullName.message)}
                    </Text>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isLeadContactSubmitting}
                    variant="primary"
                    textWeight="bold"
                    className={`mx-auto mt-8 w-full max-w-120 justify-center ${
                      isLeadContactSubmitting
                        ? "cursor-not-allowed opacity-60"
                        : ""
                    }`}
                    icon={
                      <span className="text-gold-dark flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-white leading-none">
                        <ArrowRightIcon className="h-5 w-5 text-[#A19574]" />
                      </span>
                    }
                  >
                    {isLeadContactSubmitting
                      ? t("Enviando...")
                      : t("Recibir mi análisis")}
                  </Button>
                </form>
              </div>
            )
          ) : (
            <>
              <Text size="3xl" weight="medium" className="text-white">
                {t("Tu propiedad podría generar hasta:")}
              </Text>

              <div className="w-max-content">
                <div className="mx-auto mt-7 w-fit rounded-[20px] bg-white px-3 py-4">
                  <div className="flex flex-wrap items-end justify-center space-x-2">
                    <Text size="6xl" className="text-green-normal">
                      ${formatAmount(annualEstimate ?? (prediction ?? 0) * 0.8)}
                    </Text>
                    <Text size="3xl" className="text-gold-normal">
                      MXN
                    </Text>
                  </div>
                </div>
                <Text
                  size="base"
                  font="gilroy"
                  className="mx-auto mt-6 max-w-100 text-white"
                >
                  {t("Basado en propiedades similares en tu zona y niveles promedio de ocupación.")}
                </Text>
              </div>

              <Button
                variant="primary"
                textWeight="bold"
                className="mt-8"
                onClick={() => setShowLeadCaptureStep(true)}
                icon={
                  <span className="text-gold-dark flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-white leading-none">
                    <ArrowRightIcon className="h-5 w-5 text-[#A19574]" />
                  </span>
                }
              >
                {t("Recibir mi análisis personalizado")}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
