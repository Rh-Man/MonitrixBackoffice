import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  Filter,
  Sparkles,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const filterConfig = {
  kyc: {
    title: "Filtres KYC & Limites",
    dateLabel: "Date de soumission",
    amountLabel: "Limite journalière (XOF)",
    amountMin: 100000,
    amountMax: 5000000,
    amountStep: 100000,
    select1Label: "Type de Document",
    select1Placeholder: "Tous les documents",
    select1Options: [
      { value: "all", label: "Tous les documents" },
      { value: "CNI", label: "CNI (Identité)" },
      { value: "Passeport", label: "Passeport" },
      { value: "Permis", label: "Permis de conduire" },
    ],
    select2Label: "Statut KYC",
    select2Placeholder: "Tous les statuts",
    select2Options: [
      { value: "all", label: "Tous les statuts" },
      { value: "Vérifié", label: "Vérifié" },
      { value: "En attente", label: "En attente" },
      { value: "Rejeté", label: "Rejeté" },
    ],
  },
  betting: {
    title: "Filtres Paris & Mises",
    dateLabel: "Date de la mise",
    amountLabel: "Montant du pari (XOF)",
    amountMin: 500,
    amountMax: 1000000,
    amountStep: 1000,
    select1Label: "Opérateur",
    select1Placeholder: "Tous les opérateurs",
    select1Options: [
      { value: "all", label: "Tous les opérateurs" },
      { value: "1xbet", label: "1xBet" },
      { value: "melbet", label: "Melbet" },
      { value: "akwabet", label: "Akwabet" },
      { value: "betclic", label: "Betclic" },
      { value: "premierbet", label: "PremierBet" },
    ],
    select2Label: "Statut du Pari",
    select2Placeholder: "Tous les statuts",
    select2Options: [
      { value: "all", label: "Tous les statuts" },
      { value: "Won", label: "Gagné (Won)" },
      { value: "Lost", label: "Perdu (Lost)" },
      { value: "Pending", label: "En attente" },
      { value: "Cancelled", label: "Annulé" },
      { value: "Cashout", label: "Cashout" },
    ],
  },
  payments: {
    title: "Filtres Transactions & Flux",
    dateLabel: "Date de transaction",
    amountLabel: "Montant transaction (XOF)",
    amountMin: 1000,
    amountMax: 5000000,
    amountStep: 5000,
    select1Label: "Prestataire / Plateforme",
    select1Placeholder: "Tous les prestataires",
    select1Options: [
      { value: "all", label: "Tous les prestataires" },
      { value: "freewan", label: "Freewan" },
      { value: "intouch", label: "InTouch" },
      { value: "paymetrust", label: "Paymetrust" },
      { value: "hub2", label: "Hub2" },
    ],
    select2Label: "Statut Transaction",
    select2Placeholder: "Tous les statuts",
    select2Options: [
      { value: "all", label: "Tous les statuts" },
      { value: "Réussie", label: "Réussie" },
      { value: "Échouée", label: "Échouée" },
      { value: "En attente", label: "En attente" },
      { value: "Annulée", label: "Annulée" },
    ],
  },
  taxes: {
    title: "Filtres Fiscaux & Reversements",
    dateLabel: "Période Fiscale",
    amountLabel: "Montant de taxe (XOF)",
    amountMin: 10000,
    amountMax: 250000000,
    amountStep: 100000,
    select1Label: "Opérateur imposable",
    select1Placeholder: "Tous les opérateurs",
    select1Options: [
      { value: "all", label: "Tous les opérateurs" },
      { value: "1xbet", label: "1xBet" },
      { value: "melbet", label: "Melbet" },
      { value: "akwabet", label: "Akwabet" },
      { value: "betclic", label: "Betclic" },
      { value: "premierbet", label: "PremierBet" },
    ],
    select2Label: "Statut Fiscal",
    select2Placeholder: "Tous les statuts",
    select2Options: [
      { value: "all", label: "Tous les statuts" },
      { value: "payée", label: "Payée" },
      { value: "en_attente", label: "En attente" },
      { value: "en_retard", label: "En retard" },
    ],
  },
  default: {
    title: "Filtres Généraux",
    dateLabel: "Période",
    amountLabel: "Montant (XOF)",
    amountMin: 1000,
    amountMax: 1000000,
    amountStep: 5000,
    select1Label: "Opérateur",
    select1Placeholder: "Tous les opérateurs",
    select1Options: [
      { value: "all", label: "Tous les opérateurs" },
      { value: "1xbet", label: "1xBet" },
      { value: "melbet", label: "Melbet" },
      { value: "betclic", label: "Betclic" },
    ],
    select2Label: "Statut",
    select2Placeholder: "Tous les statuts",
    select2Options: [
      { value: "all", label: "Tous les statuts" },
      { value: "validated", label: "Validé" },
      { value: "pending", label: "En attente" },
    ],
  },
};

export function PageHeader({ title, description, actions }: Props) {
  const pathname = usePathname() || "";
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [amountRange, setAmountRange] = useState([1000, 1000000]);
  const [operator, setOperator] = useState("all");
  const [status, setStatus] = useState("all");

  // Determine active config based on pathname
  let pageType: "kyc" | "betting" | "payments" | "taxes" | "default" | "none" = "default";
  if (pathname.includes("/dashboard/kyc")) {
    pageType = "kyc";
  } else if (pathname.includes("/dashboard/betting")) {
    pageType = "betting";
  } else if (pathname.includes("/dashboard/payments")) {
    pageType = "payments";
  } else if (pathname.includes("/dashboard/taxes")) {
    pageType = "taxes";
  } else if (
    pathname.includes("/dashboard/settings") ||
    pathname.includes("/dashboard/profil") ||
    pathname.includes("/dashboard/alerts") ||
    pathname.includes("/dashboard/audit") ||
    pathname === "/dashboard"
  ) {
    pageType = "none";
  }

  const config = filterConfig[pageType === "none" ? "default" : pageType];

  useEffect(() => {
    // Reset and align values when page changes
    if (pageType === "kyc") {
      setAmountRange([100000, 5000000]);
    } else if (pageType === "betting") {
      setAmountRange([500, 1000000]);
    } else if (pageType === "payments") {
      setAmountRange([1000, 5000000]);
    } else if (pageType === "taxes") {
      setAmountRange([10000, 250000000]);
    } else {
      setAmountRange([1000, 1000000]);
    }
    setDateRange({ from: undefined, to: undefined });
    setOperator("all");
    setStatus("all");
    setIsFiltersOpen(false);
  }, [pageType, pathname]);

  const handleApply = () => {
    const formattedFrom = dateRange?.from ? format(dateRange.from, "dd/MM/yyyy") : "début";
    const formattedTo = dateRange?.to ? format(dateRange.to, "dd/MM/yyyy") : "fin";

    toast.success("Filtres appliqués avec succès !", {
      description: `Période: ${formattedFrom} au ${formattedTo} | ${config.amountLabel}: ${amountRange[0].toLocaleString()} à ${amountRange[1].toLocaleString()} XOF | ${config.select1Label}: ${operator} | ${config.select2Label}: ${status}`,
      duration: 5000,
    });
  };

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined });
    if (pageType === "kyc") {
      setAmountRange([100000, 5000000]);
    } else if (pageType === "betting") {
      setAmountRange([500, 1000000]);
    } else if (pageType === "payments") {
      setAmountRange([1000, 5000000]);
    } else if (pageType === "taxes") {
      setAmountRange([10000, 250000000]);
    } else {
      setAmountRange([1000, 1000000]);
    }
    setOperator("all");
    setStatus("all");
    toast.info("Filtres réinitialisés.");
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0 sm:flex-row sm:items-center">
          {pageType !== "none" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={cn(
                "h-9 rounded-xl border-border/50 gap-2 font-semibold shadow-sm transition-all hover:scale-[1.02]",
                isFiltersOpen
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "glass-card hover:bg-muted",
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-300",
                  isFiltersOpen && "rotate-180",
                )}
              />
            </Button>
          )}
          {actions && <div className="flex flex-col gap-2 sm:flex-row sm:items-center">{actions}</div>}
        </div>
      </div>

      {/* Collapsible Advanced Filters Section */}
      {pageType !== "none" && (
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out overflow-hidden",
            isFiltersOpen ? "grid-rows-[1fr] opacity-100 mb-2" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="glass-card border-border/50 rounded-2xl p-4 shadow-xl sm:p-5 shadow-primary/5 mt-2 relative overflow-hidden">
              {/* Ambient Background highlight */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-primary live-pulse" />
                <p className="text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {config.title}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {/* Date Range Picker Popover */}
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="text-xs font-bold text-foreground/80">{config.dateLabel}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-full h-10 justify-start text-left font-semibold text-xs rounded-xl bg-background/50 border-border/50 hover:bg-background/80 transition-colors shadow-sm",
                          !dateRange?.from && !dateRange?.to && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "dd LLL y", { locale: fr })} -{" "}
                              {format(dateRange.to, "dd LLL y", { locale: fr })}
                            </>
                          ) : (
                            format(dateRange.from, "dd LLL y", { locale: fr })
                          )
                        ) : (
                          <span>Sélectionner la période</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-2xl border-border/50 glass-card shadow-2xl"
                      align="start"
                    >
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Amount Range Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-foreground/80">
                      {config.amountLabel}
                    </Label>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {amountRange[0].toLocaleString()} - {amountRange[1].toLocaleString()} XOF
                    </span>
                  </div>
                  <div className="pt-4 px-1">
                    <Slider
                      defaultValue={[config.amountMin, config.amountMax]}
                      max={config.amountMax}
                      min={config.amountMin}
                      step={config.amountStep}
                      value={amountRange}
                      onValueChange={setAmountRange}
                      className="py-2"
                    />
                  </div>
                </div>

                {/* Select 1 */}
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="text-xs font-bold text-foreground/80">
                    {config.select1Label}
                  </Label>
                  <Select value={operator} onValueChange={setOperator}>
                    <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold focus:ring-primary/50">
                      <SelectValue placeholder={config.select1Placeholder} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 glass-card">
                      {config.select1Options.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="font-semibold text-xs rounded-lg"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select 2 */}
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="text-xs font-bold text-foreground/80">
                    {config.select2Label}
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold focus:ring-primary/50">
                      <SelectValue placeholder={config.select2Placeholder} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 glass-card">
                      {config.select2Options.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="font-semibold text-xs rounded-lg"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-col gap-2 border-t border-border/50 pt-4 mt-5 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-9 rounded-xl gap-1.5 font-semibold text-xs hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Réinitialiser
                </Button>
                <Button
                  size="sm"
                  onClick={handleApply}
                  className="h-9 rounded-xl gap-1.5 font-semibold text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/10"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
