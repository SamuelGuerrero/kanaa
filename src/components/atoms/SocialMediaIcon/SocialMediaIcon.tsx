export type SocialMediaIconProps = {
  href: string;
  icon: "fa-square-facebook" | "fa-instagram";
  ariaLabel: string;
  hoverColor?: string;
};

export const SocialMediaIcon = ({
  href,
  icon,
  ariaLabel,
  hoverColor = "blue-500",
}: SocialMediaIconProps) => {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={`flex h-[36.18px] w-[51.11px] items-center justify-center rounded-full border border-[#FFFFFF20] text-white transition hover:border-${hoverColor} hover:text-${hoverColor}`}
    >
      <i className={`fa-brands ${icon} text-xl`}></i>
    </a>
  );
};
