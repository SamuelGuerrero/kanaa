import { Text } from "@/components/atoms";
import { TextLink } from "@/components/molecules";

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterColumnProps = {
  title: string;
  links: FooterLink[];
};

export const FooterColumn = ({ title, links }: FooterColumnProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <Text size="lg" className="sm:mb-8" weight="bold" font="gilroy">
        {title}
      </Text>
      {links.map((link) => (
        <TextLink
          key={link.label}
          href={link.href}
          variant="primary"
          textWeight="medium"
        >
          {link.label}
        </TextLink>
      ))}
    </div>
  );
};
