"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

type SelectedCity = {
  name: string;
  slug: string;
  zip: string;
  departmentName: string;
  departmentCode: string;
  region: string;
};

type QuoteData = {
  typeClient: "particulier" | "professionnel";
  typeDechet: string;
  volume: string;
  dateLivraison: string;
  dateRetrait: string;
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  societe: string;
  message: string;
  consent: boolean;
  website: string;
};

const wasteOptions = [
  { value: "gravats", icon: "▰", label: "Gravats", detail: "Béton, briques, tuiles" },
  { value: "dib", icon: "▦", label: "DIB / tout-venant", detail: "Bois, plâtre, plastiques" },
  { value: "dechets-verts", icon: "⌁", label: "Déchets verts", detail: "Branches, tailles, feuilles" },
  { value: "bois", icon: "▥", label: "Bois", detail: "Palettes, charpente, chutes" },
  { value: "encombrants", icon: "▣", label: "Encombrants", detail: "Mobilier, débarras" },
  { value: "mixte", icon: "⇄", label: "Déchets mélangés", detail: "Plusieurs flux à préciser" },
];

const volumeOptions = [
  ["8", "Petit chantier"], ["10", "Une pièce"], ["15", "Rénovation"], ["20", "Maison"], ["30", "Gros volume"], ["a-definir", "À définir"],
] as const;

function CityAutocomplete({ initialCity, onSelect }: { initialCity?: SelectedCity; onSelect: (city: SelectedCity | null) => void }) {
  const [query, setQuery] = useState(initialCity ? `${initialCity.name} (${initialCity.zip})` : "");
  const [results, setResults] = useState<SelectedCity[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const selectedRef = useRef<SelectedCity | null>(initialCity ?? null);

  useEffect(() => {
    const raw = query.trim();
    if (raw.length < 2 || selectedRef.current && raw === `${selectedRef.current.name} (${selectedRef.current.zip})`) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cities/search?q=${encodeURIComponent(raw)}`, { signal: controller.signal });
        const data = await response.json() as { cities?: SelectedCity[] };
        setResults(data.cities ?? []);
        setOpen(true);
        setActive(-1);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [query]);

  function select(city: SelectedCity) {
    selectedRef.current = city;
    setQuery(`${city.name} (${city.zip})`);
    setOpen(false);
    setResults([]);
    onSelect(city);
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
    if (event.key === "Enter" && active >= 0) { event.preventDefault(); select(results[active]); }
    if (event.key === "Escape") setOpen(false);
  }

  return <div className="city-autocomplete">
    <div className="field-with-icon"><span aria-hidden="true">⌖</span><input aria-label="Ville ou code postal" aria-autocomplete="list" aria-expanded={open} aria-controls="city-results" role="combobox" value={query} onKeyDown={keyDown} onChange={(event) => { selectedRef.current = null; onSelect(null); setQuery(event.target.value); }} onFocus={() => results.length && setOpen(true)} placeholder="Saisissez une ville ou un code postal" autoComplete="off" /><i>{loading ? "Recherche…" : "France"}</i></div>
    {open && results.length > 0 && <div className="city-results" id="city-results" role="listbox">{results.map((city, index) => <button type="button" role="option" aria-selected={active === index} className={active === index ? "active" : ""} key={city.slug} onMouseDown={(event) => event.preventDefault()} onClick={() => select(city)}><span><strong>{city.name}</strong><small>{city.departmentName} · {city.region}</small></span><b>{city.zip}</b></button>)}</div>}
  </div>;
}

export function QuoteForm({ initialCity }: { initialCity?: SelectedCity }) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(initialCity ?? null);
  const [data, setData] = useState<QuoteData>({ typeClient: "particulier", typeDechet: "", volume: "", dateLivraison: "", dateRetrait: "", prenom: "", nom: "", telephone: "", email: "", adresse: "", societe: "", message: "", consent: false, website: "" });
  const change = <K extends keyof QuoteData>(name: K, value: QuoteData[K]) => setData((current) => ({ ...current, [name]: value }));

  function next() {
    if (!selectedCity || !data.typeDechet || !data.volume) {
      setError("Sélectionnez une ville dans la liste, un type de déchet et un volume.");
      return;
    }
    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    if (!selectedCity) { setStep(1); setError("Sélectionnez une ville dans la liste proposée."); return; }
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, ville: selectedCity.name, citySlug: selectedCity.slug, codePostal: selectedCity.zip }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "L’envoi n’a pas abouti.");
      setStatus("done");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "L’envoi n’a pas abouti.");
      setStatus("error");
    }
  }

  if (status === "done") return <div className="quote-success"><span>✓</span><small>Demande enregistrée</small><h2>Merci, votre projet est entre de bonnes mains.</h2><p>Les informations ont bien été transmises à MaBenneEnLigne. Un conseiller vérifie maintenant la disponibilité autour de {selectedCity?.name}.</p><div><Link className="button" href="/">Retour à l’accueil</Link><Link className="button button-secondary" href="/guides">Préparer mon chantier</Link></div></div>;

  return <form className="quote-card" onSubmit={submit} noValidate>
    <div className="quote-progress" aria-label={`Étape ${step} sur 2`}><div className={step >= 1 ? "active" : ""}><span>{step > 1 ? "✓" : "1"}</span><p><strong>Votre projet</strong><small>Lieu, déchets et volume</small></p></div><i /><div className={step >= 2 ? "active" : ""}><span>2</span><p><strong>Vos coordonnées</strong><small>Dates et contact</small></p></div></div>
    <div className="quote-card-body">
      {step === 1 && <div className="quote-step">
        <header><span>Étape 1 sur 2</span><h2>Décrivez votre besoin</h2><p>Ces éléments permettent de solliciter le bon transporteur avec un tarif cohérent.</p></header>
        <fieldset><legend>Vous êtes</legend><div className="profile-switch"><button type="button" aria-pressed={data.typeClient === "particulier"} className={data.typeClient === "particulier" ? "selected" : ""} onClick={() => change("typeClient", "particulier")}><span>♙</span><strong>Particulier</strong></button><button type="button" aria-pressed={data.typeClient === "professionnel"} className={data.typeClient === "professionnel" ? "selected" : ""} onClick={() => change("typeClient", "professionnel")}><span>▤</span><strong>Professionnel</strong></button></div></fieldset>
        <fieldset><legend>Lieu de livraison <b>*</b></legend><CityAutocomplete initialCity={initialCity} onSelect={setSelectedCity} /></fieldset>
        <fieldset><legend>Type de déchet <b>*</b></legend><div className="waste-choice-grid">{wasteOptions.map((option) => <button type="button" aria-pressed={data.typeDechet === option.value} className={data.typeDechet === option.value ? "selected" : ""} key={option.value} onClick={() => change("typeDechet", option.value)}><span>{option.icon}</span><strong>{option.label}</strong><small>{option.detail}</small></button>)}</div></fieldset>
        <fieldset><legend>Volume estimé <b>*</b></legend><div className="volume-choice-grid">{volumeOptions.map(([value, label]) => <button type="button" aria-pressed={data.volume === value} className={data.volume === value ? "selected" : ""} key={value} onClick={() => change("volume", value)}><strong>{value === "a-definir" ? "?" : `${value} m³`}</strong><small>{label}</small></button>)}</div><p className="field-help">Un doute ? <Link href="/guides/choisir-taille-benne">Consultez notre guide des volumes →</Link></p></fieldset>
        {error && <p className="quote-error" role="alert">{error}</p>}
        <button className="button quote-next" type="button" onClick={next}>Continuer vers mes coordonnées <span>→</span></button>
      </div>}

      {step === 2 && <div className="quote-step">
        <header><span>Étape 2 sur 2</span><h2>Quand et comment vous joindre ?</h2><p>Vos coordonnées servent uniquement à traiter cette demande de location.</p></header>
        <div className="quote-recap"><div><small>Projet sélectionné</small><strong>{selectedCity?.name} ({selectedCity?.zip}) · {wasteOptions.find((option) => option.value === data.typeDechet)?.label} · {data.volume === "a-definir" ? "volume à définir" : `${data.volume} m³`}</strong></div><button type="button" onClick={() => { setStep(1); setError(""); }}>← Modifier</button></div>
        <div className="quote-fields two"><label>Date de livraison souhaitée<input type="date" value={data.dateLivraison} onChange={(event) => change("dateLivraison", event.target.value)} /></label><label>Date de retrait souhaitée<input type="date" min={data.dateLivraison || undefined} value={data.dateRetrait} onChange={(event) => change("dateRetrait", event.target.value)} /></label></div>
        <div className="quote-fields two"><label>Prénom <b>*</b><input required autoComplete="given-name" value={data.prenom} onChange={(event) => change("prenom", event.target.value)} /></label><label>Nom <b>*</b><input required autoComplete="family-name" value={data.nom} onChange={(event) => change("nom", event.target.value)} /></label></div>
        <div className="quote-fields two"><label>Téléphone <b>*</b><input required type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={data.telephone} onChange={(event) => change("telephone", event.target.value)} /></label><label>Email <b>*</b><input required type="email" autoComplete="email" placeholder="vous@exemple.fr" value={data.email} onChange={(event) => change("email", event.target.value)} /></label></div>
        <div className="quote-fields"><label>Adresse de livraison <b>*</b><input required autoComplete="street-address" placeholder="Numéro, voie, complément utile" value={data.adresse} onChange={(event) => change("adresse", event.target.value)} /></label>{data.typeClient === "professionnel" && <label>Entreprise<input autoComplete="organization" value={data.societe} onChange={(event) => change("societe", event.target.value)} /></label>}<label>Précisions pour le transporteur<textarea rows={3} placeholder="Accès, portail, pente, nature exacte des déchets…" value={data.message} onChange={(event) => change("message", event.target.value)} /></label></div>
        <label className="privacy-check"><input required type="checkbox" checked={data.consent} onChange={(event) => change("consent", event.target.checked)} /><span>J’accepte que mes informations soient utilisées pour traiter ma demande, conformément à la <Link href="/politique-confidentialite">politique de confidentialité</Link>.</span></label>
        <label className="website-field" aria-hidden="true">Site web<input tabIndex={-1} autoComplete="off" value={data.website} onChange={(event) => change("website", event.target.value)} /></label>
        {error && <p className="quote-error" role="alert">{error}</p>}
        <div className="quote-submit-row"><button className="button button-secondary" type="button" onClick={() => setStep(1)}>← Retour</button><button className="button" disabled={status === "sending"} type="submit">{status === "sending" ? "Enregistrement…" : "Envoyer ma demande gratuite →"}</button></div>
      </div>}
    </div>
    <div className="quote-privacy">▣ Connexion sécurisée · Données transmises uniquement à MaBenneEnLigne et aux partenaires nécessaires au devis</div>
  </form>;
}
