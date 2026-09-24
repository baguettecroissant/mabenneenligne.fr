"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { measurementChoice, saveMeasurementChoice, trackMeasurementPageview } from "../_lib/phone-measurement";

type Choice = "granted" | "denied";

export function MeasurementConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const lastPage = useRef<string | null>(null);
  const rejectButton = useRef<HTMLButtonElement | null>(null);
  const focusOnOpen = useRef(false);
  const opener = useRef<HTMLElement | null>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const saved = measurementChoice();
      setChoice(saved);
      setOpen(saved === null);
      setReady(true);
    });
    const reopen = (event: Event) => {
      const source = (event as CustomEvent<HTMLElement>).detail;
      opener.current = source && typeof source.focus === "function" ? source : null;
      focusOnOpen.current = true;
      setOpen(true);
    };
    window.addEventListener("measurement-preferences-open", reopen);
    return () => { active = false; window.removeEventListener("measurement-preferences-open", reopen); };
  }, []);

  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    rejectButton.current?.focus({ preventScroll: true });
    rejectButton.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [open]);

  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    const source = opener.current;
    opener.current = null;
    if (source?.isConnected) {
      source.focus({ preventScroll: true });
      source.scrollIntoView({ block: "center", behavior: "instant" });
    } else if (typeof document !== "undefined") {
      const main = document.querySelector("main");
      if (main instanceof HTMLElement) {
        main.tabIndex = -1;
        main.focus({ preventScroll: true });
        main.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
  }, [open]);

  useEffect(() => {
    if (!ready || choice !== "granted" || !pathname || lastPage.current === pathname) return;
    lastPage.current = pathname;
    trackMeasurementPageview();
  }, [ready, choice, pathname]);

  const choose = (next: Choice) => {
    if (!saveMeasurementChoice(next)) {
      setChoice(null);
      setOpen(true);
      return;
    }
    if (next === "denied") lastPage.current = null;
    restoreFocus.current = true;
    setChoice(next);
    setOpen(false);
  };

  return <section className="measurement-panel" data-measurement-panel="" aria-label="Préférences de mesure" hidden={!ready || !open}>
    <strong>Mesure facultative de la visite</strong>
    <p>Avec votre accord, nous comptons les pages consultées et les clics sur les liens d’appel, sans transmettre le numéro appelé ni vos coordonnées. Le devis et le téléphone restent accessibles quel que soit votre choix. <a href="/politique-confidentialite">En savoir plus</a>.</p>
    <div className="measurement-actions">
      <button ref={rejectButton} type="button" data-measurement-choice="denied" onClick={() => choose("denied")}>Refuser</button>
      <button type="button" data-measurement-choice="granted" onClick={() => choose("granted")}>Accepter</button>
    </div>
  </section>;
}

export function MeasurementPreferencesButton() {
  return <button className="measurement-preferences-button" type="button" onClick={(event) => window.dispatchEvent(new CustomEvent("measurement-preferences-open", { detail: event.currentTarget }))}>Mes préférences de mesure</button>;
}
