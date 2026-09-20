"use client";

import { useEffect, useState } from "react";
import { parseActiveTerritoryContact, type ActiveTerritoryContact } from "../_lib/territory-contact";

type Props = {
  departmentCode: string;
  placement: "city_page" | "department_page" | "quote_form";
};

export function TerritoryContactCta({ departmentCode, placement }: Props) {
  const [contact, setContact] = useState<ActiveTerritoryContact | null>(null);

  useEffect(() => {
    if (departmentCode !== "67") return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    async function load() {
      try {
        const response = await fetch("/api/territory-contact?department=67", {
          credentials: "omit",
          signal: controller.signal,
          headers: { accept: "application/json" },
        });
        if (!response.ok || !/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) return;
        const value = parseActiveTerritoryContact(await response.json());
        if (!controller.signal.aborted) setContact(value);
      } catch {
        // The quote form remains available when the public contact cannot load.
      } finally {
        clearTimeout(timeout);
      }
    }
    void load();
    return () => {
      controller.abort();
      clearTimeout(timeout);
      setContact(null);
    };
  }, [departmentCode]);

  if (departmentCode !== "67" || !contact) return null;

  function trackPhoneClick() {
    try {
      // Keep the native tel navigation synchronous, even if tracking fails.
      void fetch("https://nhmvgsrwhjsjnpncpiaj.supabase.co/functions/v1/analytics-collect", {
        method: "POST",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          domain: "mabenneenligne.fr",
          pathname: window.location.pathname,
          event_name: "territory_phone_click",
          event_detail: { source_site: "mabenneenligne.fr", department: "67", placement },
        }),
      }).catch(() => {});
    } catch {
      // Some browsers and content blockers can throw before returning a promise.
    }
  }

  return <aside className="territory-contact" aria-label="Contact Alsace Recycle pour le Bas-Rhin">
    <p><strong>Alsace Recycle</strong><span>Bas-Rhin uniquement</span></p>
    <a className="button" href={`tel:${contact.phone}`} onClick={trackPhoneClick}>Appeler Alsace Recycle <span>{contact.phone}</span></a>
    {contact.hours && <p className="territory-contact-hours">Horaires : {contact.hours}</p>}
    <a className="territory-contact-form" href={placement === "quote_form" ? "#quote-project" : "/devis"}>{placement === "quote_form" ? "Ou continuer le formulaire ci-dessous" : "Ou demander un devis par formulaire"}</a>
  </aside>;
}
