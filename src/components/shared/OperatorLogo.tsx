import Image from "next/image";

interface Props {
  name: string;
  color?: string;
  size?: number;
}

// Mapping des noms d'opérateurs vers leurs logos
const OPERATOR_LOGOS: Record<string, string> = {
  "1xBet": "/partner-logos/1xbet.png",
  Melbet: "/partner-logos/melbet.png",
  Akwabet: "/partner-logos/akwabet.png",
  Betclic: "/partner-logos/betclic.png",
  PremierBet: "/partner-logos/premierbet.png",
};

export function OperatorLogo({ name, color = "#1e40af", size = 28 }: Props) {
  const logoPath = OPERATOR_LOGOS[name];

  // Si un logo existe, l'afficher
  if (logoPath) {
    return (
      <div
        className="inline-flex shrink-0 items-center justify-center rounded-md overflow-hidden bg-white"
        style={{ width: size, height: size }}
        aria-label={name}
      >
        <Image
          src={logoPath}
          alt={`${name} logo`}
          width={size}
          height={size}
          className="object-contain p-0.5"
        />
      </div>
    );
  }

  // Sinon, afficher les initiales (fallback)
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div
      className="inline-flex shrink-0 items-center justify-center rounded-md font-semibold text-white"
      style={{ background: color, width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
