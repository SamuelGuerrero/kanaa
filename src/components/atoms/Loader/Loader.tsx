import type { DetailedHTMLProps, HTMLAttributes } from "react";

type LoaderProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

export const Loader = ({ className, ...rest }: LoaderProps) => {
  return (
    <figure
      className={`absolute left-1/2 h-30 w-30 -translate-x-1/2 ${className}`}
      {...rest}
    >
      <div className="absolute top-1/2 left-1/2 h-[5.14px] w-[5.14px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E3DFD4]" />
      <div className="absolute top-1/2 left-1/2 h-[64.29px] w-[64.29px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#E3DFD4]" />
      <div className="absolute top-1/2 left-1/2 h-22.5 w-22.5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-[#E3DFD4]/70" />
    </figure>
  );
};
