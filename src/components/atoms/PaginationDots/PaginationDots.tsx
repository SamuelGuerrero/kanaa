type PaginationDotsProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const PaginationDots = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationDotsProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={`h-3.75 w-3.75 cursor-pointer rounded-full transition-all ${
            currentPage === index
              ? "bg-gold-normal w-[37.5px]"
              : "bg-gold-light-active hover:bg-gold-light-active"
          }`}
          aria-label={`Ir a página ${index + 1}`}
        />
      ))}
    </div>
  );
};
