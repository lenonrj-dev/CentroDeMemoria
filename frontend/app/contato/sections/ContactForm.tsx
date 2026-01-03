"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, ShieldCheck } from "lucide-react";
import type { ContactFormContent } from "../../../lib/content-types";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type ContactFormProps = {
  content: ContactFormContent;
};

export default function ContactForm({ content }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrar com /api/contact ou serviço de formulários.
    setSent(true);
  };

  return (
    <section id="form" className="relative w-full py-8 sm:py-12 lg:py-14">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{content.heading}</h2>
        <p className="mt-2 text-sm text-white/70">{content.description}</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {content.fields.map((field) =>
              field.type === "select" ? (
                <Select
                  key={field.id}
                  label={field.label}
                  id={field.id}
                  required={field.required}
                  options={field.options}
                  placeholder={content.selectPlaceholder}
                />
              ) : (
                <Field
                  key={field.id}
                  label={field.label}
                  id={field.id}
                  type={field.type}
                  required={field.required}
                />
              )
            )}
          </div>

          <Textarea
            label={content.textarea.label}
            id={content.textarea.id}
            rows={content.textarea.rows}
            required={content.textarea.required}
          />

          <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-white/70" />
            <p className="text-xs text-white/60">
              {content.consent.text}
              <a className="underline hover:text-white" href={content.consent.linkHref}>
                {content.consent.linkLabel}
              </a>
              {content.consent.suffix}
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <Send className="h-4 w-4" />
            {content.buttonLabel}
          </button>

          {sent && (
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/80">
              {content.successMessage}
            </div>
          )}
        </form>
      </motion.div>
    </section>
  );
}

type FieldProps = { label: string; id: string; type?: string; required?: boolean };
type SelectProps = { label: string; id: string; options?: string[]; required?: boolean; placeholder?: string };
type TextareaProps = { label: string; id: string; rows?: number; required?: boolean };
function Field({ label, id, type = "text", required = false }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/80">
        {label}
        {required && " *"}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        placeholder=""
      />
    </label>
  );
}

function Select({ label, id, options = [], required = false, placeholder }: SelectProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/80">
        {label}
        {required && " *"}
      </span>
      <select
        id={id}
        name={id}
        required={required}
        defaultValue=""
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({ label, id, rows = 5, required = false }: TextareaProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/80">
        {label}
        {required && " *"}
      </span>
      <textarea
        id={id}
        name={id}
        rows={rows}
        required={required}
        className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        placeholder=""
      />
    </label>
  );
}
