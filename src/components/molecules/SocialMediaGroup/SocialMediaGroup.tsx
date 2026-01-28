import { SocialMediaIcon } from "@/components/atoms";

export type SocialLink = {
  href: string;
  icon: "fa-square-facebook" | "fa-instagram";
  ariaLabel: string;
  hoverColor: string;
};

export type SocialMediaGroupProps = {
  links: SocialLink[];
  className?: string;
};

export const SocialMediaGroup = ({
  links,
  className,
}: SocialMediaGroupProps) => {
  return (
    <div className={`mt-50 flex space-x-4 ${className}`}>
      {links.map((link) => (
        <SocialMediaIcon
          key={link.ariaLabel}
          href={link.href}
          icon={link.icon}
          ariaLabel={link.ariaLabel}
          hoverColor={link.hoverColor}
        />
      ))}
    </div>
  );
};
