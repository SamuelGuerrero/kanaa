import { useEffect, useState } from "react";

export const useItemsPerPage = (
  mobileItems: number,
  tabletVerticalItems: number,
  tabletHorizontalItems: number,
  desktopItems: number,
) => {
  const [itemsPerPage, setItemsPerPage] = useState(desktopItems);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setItemsPerPage(mobileItems);
      } else if (width < 768) {
        setItemsPerPage(tabletVerticalItems);
      } else if (width < 1024) {
        setItemsPerPage(tabletHorizontalItems);
      } else {
        setItemsPerPage(desktopItems);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileItems, tabletVerticalItems, tabletHorizontalItems, desktopItems]);

  return itemsPerPage;
};
