"use client";

import { useState } from "react";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="font-gilroy text-gold-light/80 text-base">
        ¡Gracias por suscribirte! Te escribiremos pronto.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="mx-auto flex max-w-[460px] rounded-full border border-white/10 p-1.5"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <input
        type="email"
        placeholder="tu@correo.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-gilroy text-gold-light placeholder:text-gold-light/50 flex-1 bg-transparent px-5 py-3 text-[15px] focus:outline-none"
      />
      <button
        type="submit"
        className="bg-gold-normal font-gilroy text-gold-light hover:bg-gold-dark rounded-full px-7 py-3 text-sm font-medium transition-colors duration-200"
      >
        Suscribirme
      </button>
    </form>
  );
};
