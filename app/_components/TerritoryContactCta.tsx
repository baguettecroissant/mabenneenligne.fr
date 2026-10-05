"use client";

import { useEffect, useState } from "react";
import { isDepartmentCode, parseActiveTerritoryContact, type ActiveTerritoryContact } from "../_lib/territory-contact";
import { canMeasure, safeMeasurementPath } from "../_lib/phone-measurement";

type Props = {
  departmentCode: string;
  departmentName: string;
  placement: "city_page" | "department_page" | "quote_form";
  /** Contact already loaded by the parent (quote form); otherwise the CTA loads it itself. */
  contact?: ActiveTerritoryContact | null;
};

/** Loads the partner holding the exclusivity of a department, or null when there is none. */
export function useTerritoryContact(departmentCode: string | undefined): ActiveTerritoryContact | null {
  const [contact, setContact] = useState<ActiveTerritoryContact | null>(null);

  useEffect(() => {
    if (!isDepartmentCode(departmentCode)) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    async function load(department: string) {
      try {
        const response = await fetch(`/api/territory-contact?department=${department}`, {
          credentials: "omit",
          referrerPolicy: "no-referrer",
          signal: controller.signal,
          headers: { accept: "application/json" },
        });
        if (!response.ok || !/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) return;
        const value = parseActiveTerritoryContact(await response.json(), department);
        if (!controller.signal.aborted) setContact(value);
      } catch {
        // The quote form remains available when the public contact cannot load.
      } finally {
        clearTimeout(timeout);
      }
    }
    void load(departmentCode);
    return () => {
      controller.abort();
      clearTimeout(timeout);
      setContact(null);
    };
  }, [departmentCode]);

  return contact?.department === departmentCode ? contact : null;
}

export function TerritoryContactCta({ departmentCode, departmentName, placement, contact: providedContact }: Props) {
  const loadedContact = useTerritoryContact(providedContact === undefined ? departmentCode : undefined);
  const contact = providedContact === undefined ? loadedContact : providedContact;

  if (!contact || contact.department !== departmentCode) return null;
  const territory = `${departmentName} (${departmentCode})`;

  function trackPhoneClick() {
    try {
      if (!canMeasure()) return;
      // Keep the native tel navigation synchronous, even if tracking fails.
      void fetch("https://nhmvgsrwhjsjnpncpiaj.supabase.co/functions/v1/analytics-collect", {
        method: "POST",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          domain: "mabenneenligne.fr",
          pathname: safeMeasurementPath(window.location.pathname),
          event_name: "territory_phone_click",
          event_detail: { source_site: "mabenneenligne.fr", department: departmentCode, placement },
        }),
      }).catch(() => {});
    } catch {
      // Some browsers and content blockers can throw before returning a promise.
    }
  }

  return <aside className="territory-contact" aria-label={`Contact ${contact.display_name} — ${territory}`}>
    <p><strong>{contact.display_name}</strong><span>{territory} uniquement</span></p>
    <a className="button" href={`tel:${contact.phone_e164}`} onClick={trackPhoneClick}>Appeler {contact.display_name} <span>{contact.phone_display}</span></a>
    {contact.hours && <p className="territory-contact-hours">Horaires : {contact.hours}</p>}
    <a className="territory-contact-form" href={placement === "quote_form" ? "#quote-project" : "/devis"}>{placement === "quote_form" ? "Ou continuer le formulaire ci-dessous" : "Ou demander un devis par formulaire"}</a>
  </aside>;
}
