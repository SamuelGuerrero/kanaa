"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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

type CnbvRow = {
  id: string;
  codigo: string;
  clave_estado: string;
  estado: string;
  clave_mnpio: string;
  mnpio: string;
  clave_asenta: string;
  asenta: string;
};

type PredictionResponse = {
  prediction?: number[];
  raw_prediction?: number[];
  success?: boolean;
};

type LeadEmailPayload = PropertyDetails & {
  estimatedMonthlyRevenue?: number | null;
};

const DEFAULT_OCCUPANCY = 70;
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
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<PropertyDetails>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const [catalogRows, setCatalogRows] = useState<CnbvRow[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [predictionError, setPredictionError] = useState("");
  const [leadStatusMessage, setLeadStatusMessage] = useState("");
  const [leadStatusError, setLeadStatusError] = useState(false);

  const postalCode = watch("postalCode");
  const selectedState = watch("state");
  const selectedCity = watch("city");

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
    setLeadStatusError(false);

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
        ocupacion_promedio: DEFAULT_OCCUPANCY,
      },
    };

    let estimatedMonthlyRevenue: number | null = null;

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
      estimatedMonthlyRevenue = predictedValue * 0.8;
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPredictionError(
        "No pudimos calcular el precio en este momento. Inténtalo nuevamente.",
      );
    }

    try {
      const leadPayload: LeadEmailPayload = {
        ...data,
        estimatedMonthlyRevenue,
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
      setLeadStatusMessage(
        "Recibimos tus datos. Un asesor de Kanaa te contactará pronto.",
      );
    } catch (error) {
      console.error("Error sending lead email:", error);
      setLeadStatusError(true);
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
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="col-span-2">
            <InputForm
              className="h-11 w-full md:h-13.75"
              placeholder={t("Dirección de propiedad")}
              type="text"
              error={errors.propertyAddress?.message}
              {...register("propertyAddress")}
            />
          </div>
          <div className="col-span-1">
            <InputForm
              className="h-11 w-full md:h-13.75"
              placeholder={t("Código postal")}
              type="text"
              inputMode="numeric"
              maxLength={5}
              error={errors.postalCode?.message}
              {...register("postalCode")}
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
              defaultOptionLabel="Estado"
              options={stateOptions}
              disabled={stateOptions.length === 0}
              error={errors.state?.message}
              {...register("state")}
            />
          </div>
          <div className="col-span-2">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel="Ciudad"
              options={cityOptions}
              disabled={cityOptions.length === 0}
              error={errors.city?.message}
              {...register("city")}
            />
          </div>
          <div className="col-span-2">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel="Colonia"
              options={neighborhoodOptions}
              disabled={neighborhoodOptions.length === 0}
              error={errors.neighborhood?.message}
              {...register("neighborhood")}
            />
          </div>
          <div className="col-span-1">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel="Cantidad de huéspedes"
              options={[
                { value: "1", label: "1 huésped" },
                { value: "2", label: "2 huéspedes" },
                { value: "3", label: "3 huéspedes" },
                { value: "4", label: "4 huéspedes" },
                { value: "5", label: "5 huéspedes" },
                { value: "6", label: "6+ huéspedes" },
              ]}
              error={errors.guestCount?.message}
              {...register("guestCount")}
            />
          </div>

          <div className="col-span-1">
            <SelectForm
              className="md:h-13.755 h-11 w-full"
              defaultOptionLabel="Tipo de propiedad"
              options={[
                { value: "Departamento", label: "Departamento" },
                { value: "Casa", label: "Casa" },
                { value: "Loft", label: "Loft" },
                { value: "Estudio", label: "Estudio" },
                { value: "Townhouse", label: "Townhouse" },
                { value: "Otro", label: "Otro" },
              ]}
              error={errors.propertyType?.message}
              {...register("propertyType")}
            />
          </div>

          <div className="col-span-1">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel="No. de habitaciones"
              options={[
                { value: "studio", label: "Studio (sin habitación)" },
                { value: "1", label: "1 habitación" },
                { value: "2", label: "2 habitaciones" },
                { value: "3", label: "3 habitaciones" },
                { value: "4", label: "4 habitaciones" },
                { value: "5", label: "5+ habitaciones" },
              ]}
              error={errors.bedroomCount?.message}
              {...register("bedroomCount")}
            />
          </div>

          <div className="col-span-1">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel="No. de baños"
              options={[
                { value: "1", label: "1 baño" },
                { value: "1.5", label: "1.5 baños" },
                { value: "2", label: "2 baños" },
                { value: "2.5", label: "2.5 baños" },
                { value: "3", label: "3 baños" },
                { value: "4", label: "4+ baños" },
              ]}
              error={errors.bathroomCount?.message}
              {...register("bathroomCount")}
            />
          </div>

          <div className="col-span-2">
            <SelectForm
              className="h-11 w-full md:h-13.75"
              defaultOptionLabel="Años de propiedad"
              options={[
                { value: "less1", label: "Menos de 1 año" },
                { value: "1-3", label: "1 a 3 años" },
                { value: "3-5", label: "3 a 5 años" },
                { value: "5-10", label: "5 a 10 años" },
                { value: "10+", label: "Más de 10 años" },
              ]}
              error={errors.yearsOwned?.message}
              {...register("yearsOwned")}
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
            Calcular ingreso
          </Button>
        </form>
      )}

      {showLoadingState && (
        <div className="relative z-10 h-106.25 px-4 text-center md:px-10">
          <div className="mx-auto flex w-full max-w-138.5 flex-col items-center gap-5 pt-17">
            <Text size="3xl" weight="medium" className="text-white">
              Espera unos momentos
            </Text>
            <Text font="gilroy" size="lg" className="text-white">
              Estamos calculando el precio aproximado de tu propiedad
            </Text>
          </div>

          <Loader className="top-60" />
        </div>
      )}

      {showResultState && (
        <div className="relative z-10 h-106.25 px-0 pt-14 text-center md:px-0">
          <Text size="3xl" weight="medium" className="text-white">
            Tu propiedad podría generar hasta:
          </Text>

          <div className="w-max-content">
            {" "}
            <div className="mx-auto mt-7 w-fit rounded-[20px] bg-white px-3 py-4">
              <div className="flex flex-wrap items-end justify-center space-x-2">
                <Text size="6xl" className="text-green-normal">
                  ${formatAmount((prediction ?? 0) * 0.8)}
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
              Basado en propiedades similares en tu zona y niveles promedio de
              ocupación.
            </Text>
          </div>

          <Button
            variant="primary"
            textWeight="bold"
            className="mt-8"
            icon={
              <span className="text-gold-dark flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-white leading-none">
                <ArrowRightIcon className="h-5 w-5 text-[#A19574]" />
              </span>
            }
          >
            Recibir mi análisis personalizado
          </Button>
          {leadStatusMessage ? (
            <Text
              size="sm"
              font="gilroy"
              weight="semibold"
              className={`mx-auto mt-4 max-w-90 ${
                leadStatusError ? "text-red-200" : "text-white"
              }`}
            >
              {leadStatusMessage}
            </Text>
          ) : null}
        </div>
      )}
    </div>
  );
};
