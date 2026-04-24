"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="font-gilroy text-base text-gold-light/80">
        ¡Gracias por suscribirte! Te escribiremos pronto.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-[460px] rounded-full border border-white/10 bg-white/8 p-1.5"
    >
      <input
        type="email"
        placeholder="tu@correo.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent px-5 py-3 font-gilroy text-[15px] text-gold-light placeholder:text-gold-light/50 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-gold-normal px-7 py-3 font-gilroy text-sm font-medium text-gold-light transition-colors duration-200 hover:bg-gold-dark"
      >
        Suscribirme
      </button>
    </form>
  );
}
