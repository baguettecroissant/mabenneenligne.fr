"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 180;

export function MobileStickyCta() {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > SCROLL_THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setFooterVisible(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: "0px 0px 72px 0px" },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (pathname === "/devis" || pathname.startsWith("/devis/")) return null;
  const hidden = !hasScrolled || footerVisible;

  return <>
    <div className="mobile-sticky-cta-spacer" aria-hidden="true" hidden={hidden} />
    <nav className="mobile-sticky-cta" aria-label="Accès rapide au devis" hidden={hidden}>
      <Link href="/devis" aria-label="Obtenir mon devis gratuit">Obtenir mon devis gratuit <span aria-hidden="true">→</span></Link>
    </nav>
  </>;
}
