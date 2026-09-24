"use client";

import { useState } from "react";
import { FiImage } from "react-icons/fi";

interface Props {
  src?: string | null;
  alt: string;
  className?: string;
}

export default function ProjectImage({ src, alt, className = "" }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div className={`flex items-center justify-center bg-surface-muted text-subtle ${className}`}>
        <FiImage aria-hidden />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote images from the API
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  );
}
