"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Service = readonly [string, string];

export function ServicesMenu({ services }: { services: readonly Service[] }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return <div className="services-menu" ref={menuRef}>
    <button type="button" aria-expanded={open} aria-controls="services-menu-panel" onClick={() => setOpen((value) => !value)}>Nos services <span>⌄</span></button>
    {open && <div className="services-menu-panel" id="services-menu-panel" role="menu">{services.map(([label, href]) => <Link key={href} href={href} role="menuitem" onClick={() => setOpen(false)}>{label}</Link>)}</div>}
  </div>;
}
