import React from "react";

export type IconName =
  | "microphone"
  | "camera"
  | "phone"
  | "speak"
  | "brain"
  | "trophy"
  | "sparkles"
  | "radar"
  | "clapperboard"
  | "lightning"
  | "bulb"
  | "user"
  | "arrowRight"
  | "check"
  | "elf"
  | "sun"
  | "moon";

interface IconProps {
  name: IconName;
  className?: string;
  colorClass?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  className = "w-5 h-5 sm:w-6 sm:h-6",
  colorClass = "bg-current",
}) => {
  // Use public mask icons for microphone, camera, phone, speak
  if (["microphone", "camera", "phone", "speak"].includes(name)) {
    const iconPath = `${import.meta.env.BASE_URL}icons/${name}.svg`;
    return (
      <span
        className={`inline-block transition-colors ${className} ${colorClass}`}
        aria-hidden="true"
        style={{
          maskImage: `url(${iconPath})`,
          WebkitMaskImage: `url(${iconPath})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }

  // Inline SVG rendering for additional icons
  const svgClassName = `inline-block fill-current ${className}`;

  switch (name) {
    case "brain":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M12 3a4.5 4.5 0 0 0-4.38 3.48A4 4 0 0 0 4 10.5c0 1.5.8 2.8 2 3.5a4 4 0 0 0 1.5 5.5A4.5 4.5 0 0 0 12 21a4.5 4.5 0 0 0 4.5-1.5 4 4 0 0 0 1.5-5.5 4 4 0 0 0 2-3.5 4 4 0 0 0-3.62-4.02A4.5 4.5 0 0 0 12 3zm-1 2.08V11H6.18A2.5 2.5 0 0 1 5.5 7.5a2.5 2.5 0 0 1 2.27-2.48l.42-.04A2.5 2.5 0 0 1 11 5.08zM13 5.08A2.5 2.5 0 0 1 15.81 5a2.5 2.5 0 0 1 2.69 2.5 2.5 0 0 1 -0.68 3.5H13V5.08zM6 13h5v6.92A2.5 2.5 0 0 1 8.5 18a2.5 2.5 0 0 1-2.5-2.5c0-.85.43-1.6 1.08-2.05L6 13zm12 0c.65.45 1.08 1.2 1.08 2.05A2.5 2.5 0 0 1 16.5 18a2.5 2.5 0 0 1-2.5 1.92V13h4z" />
        </svg>
      );

    case "trophy":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V18H8v2h8v-2h-3v-2.1c1.86-.46 3.27-1.93 3.61-3.96C19.08 11.63 21 9.55 21 7V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        </svg>
      );

    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M12 2L9.5 7.5 4 10l5.5 2.5L12 18l2.5-5.5L20 10l-5.5-2.5L12 2zm-7 14l-1.25 2.75L1 20l2.75 1.25L5 24l1.25-2.75L9 20l-2.75-1.25L5 16zm14 0l-1.25 2.75L15 20l2.75 1.25L19 24l1.25-2.75L23 20l-2.75-1.25L19 16z" />
        </svg>
      );

    case "radar":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6.2l4.5 2.7-1 1.6-5.5-3.3V7z" />
        </svg>
      );

    case "clapperboard":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
        </svg>
      );

    case "lightning":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M7 2v11h3v9l7-12h-4l4-8z" />
        </svg>
      );

    case "bulb":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-3.3l-.85-.6C8.77 11.16 8 10.15 8 9c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.15-.77 2.16-2.15 3.1z" />
        </svg>
      );

    case "user":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      );

    case "arrowRight":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </svg>
      );

    case "check":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      );

    case "sun":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zm-12.37 12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z" />
        </svg>
      );

    case "moon":
      return (
        <svg viewBox="0 0 24 24" className={svgClassName}>
          <path d="M12.3 2a10 10 0 0 0-1.9 20 10 10 0 0 0 9.8-7.7 1 1 0 0 0-1.2-1.2 8 8 0 1 1-7.9-9.9 1 1 0 0 0 1.2-1.2z" />
        </svg>
      );

    default:
      return null;
  }
};
