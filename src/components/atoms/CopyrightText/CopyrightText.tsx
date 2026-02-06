import { Text } from "../Text";

type CopyrightTextProps = {
  className?: string;
};

export const CopyrightText = ({ className }: CopyrightTextProps) => {
  return (
    <Text
      size="sm"
      className={`text-white ${className}`}
      weight="medium"
      font="gilroy"
    >
      © {new Date().getFullYear()} — KANAA All Rights Reserved
    </Text>
  );
};
