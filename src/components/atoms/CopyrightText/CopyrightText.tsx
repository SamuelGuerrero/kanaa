import { Text } from "../Text";

export const CopyrightText = () => {
  return (
    <Text size="sm" className="mt-50 text-white" weight="medium" font="gilroy">
      © {new Date().getFullYear()} — KANAA All Rights Reserved
    </Text>
  );
};
