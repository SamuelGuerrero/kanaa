import { useEffect, useState } from "react";

export const useItemsPerPage = (mobileItems: number, desktopItems: number) => {
  const [itemsPerPage, setItemsPerPage] = useState(desktopItems);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? mobileItems : desktopItems);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileItems, desktopItems]);

  return itemsPerPage;
};
