"use client";

import { useId, type ReactNode } from "react";

type BaseProps = {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
  /** Valeur de départ (utile pour modifier un élément existant) */
  defaultValue?: string;
};

type InputProps = BaseProps & {
  as?: "input";
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  min?: string;
};

type TextareaProps = BaseProps & {
  as: "textarea";
  rows?: number;
  placeholder?: string;
};

type SelectProps = BaseProps & {
  as: "select";
  options: readonly string[];
};

const control =
  "w-full rounded-2xl border border-line-strong bg-white/70 px-5 py-3.5 text-[15px] outline-hidden transition placeholder:text-ink-mute/60 focus:border-bloom focus:ring-4 focus:ring-bloom/15";

/** Champ de formulaire avec label : input, textarea ou select. */
export function Field(props: InputProps | TextareaProps | SelectProps) {
  const id = useId();
  const { label, name, required, className = "" } = props;

  let control_: ReactNode;

  if (props.as === "textarea") {
    control_ = (
      <textarea
        id={id}
        name={name}
        required={required}
        rows={props.rows ?? 5}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        className={`${control} resize-y`}
      />
    );
  } else if (props.as === "select") {
    control_ = (
      <select id={id} name={name} required={required} defaultValue="" className={control}>
        <option value="" disabled>
          Choisir…
        </option>
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  } else {
    control_ = (
      <input
        id={id}
        name={name}
        type={props.type ?? "text"}
        required={required}
        autoComplete={props.autoComplete}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        min={props.min}
        className={control}
      />
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-[14px] font-medium text-ink-soft"
      >
        {label}
        {required && <span className="text-bloom"> *</span>}
      </label>
      {control_}
    </div>
  );
}
