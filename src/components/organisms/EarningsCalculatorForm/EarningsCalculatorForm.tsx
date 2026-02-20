"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { CircleButton, SelectForm, InputForm } from "@/components/atoms";
import { Button } from "@/components/molecules";

type PropertyDetails = {
  postalCode: string;
  state: string;
  city: string;
  neighborhood: string;
  propertyAddress: string;
  guestCount: number;
  propertyType: string;
  bedroomCount: number;
  bathroomCount: number;
  yearsOwned: number;
};

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

export const EarningsCalculatorForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<PropertyDetails>();

  const [catalogRows, setCatalogRows] = useState<CnbvRow[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");

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
    try {
      console.log("DATA:", data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="relative w-full rounded-lg p-3.5 backdrop-blur-[22.39px] md:w-160.25 md:p-8"
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

      <form
        className="relative z-10 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <InputForm
            className="h-11 w-full md:h-13.75"
            placeholder="Dirección de propiedad"
            type="text"
            required
            {...register("propertyAddress")}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <InputForm
            className="h-11 w-full md:h-13.75"
            placeholder="Código postal"
            type="text"
            inputMode="numeric"
            maxLength={5}
            required
            {...register("postalCode")}
          />
          {catalogLoading && (
            <p className="mt-1 text-xs text-white/80">
              Buscando código postal...
            </p>
          )}
          {catalogError && (
            <p className="mt-1 text-xs text-red-200">{catalogError}</p>
          )}
        </div>
        <div className="col-span-2 md:col-span-1">
          <SelectForm
            required
            className="h-11 w-full md:h-13.75"
            defaultOptionLabel="Estado"
            options={stateOptions}
            disabled={stateOptions.length === 0}
            {...register("state", { required: true })}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <SelectForm
            required
            className="h-11 w-full md:h-13.75"
            defaultOptionLabel="Ciudad"
            options={cityOptions}
            disabled={cityOptions.length === 0}
            {...register("city", { required: true })}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <SelectForm
            required
            className="h-11 w-full md:h-13.75"
            defaultOptionLabel="Colonia"
            options={neighborhoodOptions}
            disabled={neighborhoodOptions.length === 0}
            {...register("neighborhood", { required: true })}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <SelectForm
            required
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
            {...register("guestCount", { required: true })}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <SelectForm
            required
            className="md:h-13.755 h-11 w-full"
            defaultOptionLabel="Tipo de propiedad"
            options={[
              { value: "apartment", label: "Departamento" },
              { value: "house", label: "Casa" },
              { value: "loft", label: "Loft" },
              { value: "studio", label: "Estudio" },
              { value: "townhouse", label: "Townhouse" },
              { value: "other", label: "Otro" },
            ]}
            {...register("propertyType", { required: true })}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <SelectForm
            required
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
            {...register("bedroomCount")}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <SelectForm
            required
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
            {...register("bathroomCount", { required: true })}
          />
        </div>

        <div className="col-span-2">
          <SelectForm
            required
            className="h-11 w-full md:h-13.75"
            defaultOptionLabel="Años de propiedad"
            options={[
              { value: "less1", label: "Menos de 1 año" },
              { value: "1-3", label: "1 a 3 años" },
              { value: "3-5", label: "3 a 5 años" },
              { value: "5-10", label: "5 a 10 años" },
              { value: "10+", label: "Más de 10 años" },
            ]}
            {...register("yearsOwned", { required: true })}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          textWeight="bold"
          className={`text-gold-darker mt-3 flex h-11.5 w-[80%] justify-center md:mt-5 md:w-fit md:text-start ${isSubmitting && "cursor-not-allowed opacity-60"} `}
          icon={
            <CircleButton>
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Calcular ingreso
        </Button>
      </form>
    </div>
  );
};
