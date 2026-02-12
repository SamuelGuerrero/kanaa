"use client";

import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";

import Image from "next/image";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

interface PropertyImage {
  url: string;
  caption?: string;
}

type PropertyImagesProps = {
  images: PropertyImage[];
  propertyName: string;
};

export const PropertyImages = ({
  images,
  propertyName,
}: PropertyImagesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const lightboxSlides = images.map((img) => ({
    src: img.url,
    alt: img.caption ?? propertyName,
    title: img.caption,
  }));

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!isGalleryOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGalleryOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryOpen]);

  if (images.length === 0) return null;

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const handleImageClick = (index: number) => {
    if (isMobile) {
      openLightbox(index);
      return;
    }
    setPhotoIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-4 grid-rows-2 gap-2 2xl:grid-cols-5">
        {images[0] && (
          <div
            className="relative col-span-2 row-span-2 h-full min-h-100 cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            <Image
              src={images[0].url}
              alt={images[0].caption ?? propertyName}
              fill
              className="rounded-[10px] object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        )}

        {images[1] && (
          <div
            className="relative h-full min-h-49 cursor-pointer"
            onClick={() => handleImageClick(1)}
          >
            <Image
              src={images[1].url}
              alt={images[1].caption ?? propertyName}
              fill
              className="rounded-[10px] object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        )}

        {images[2] && (
          <div
            className="relative h-full min-h-49 cursor-pointer"
            onClick={() => handleImageClick(2)}
          >
            <Image
              src={images[2].url}
              alt={images[2].caption ?? propertyName}
              fill
              className="rounded-[10px] object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        )}

        {images[3] && (
          <div
            className="relative h-full min-h-49 cursor-pointer"
            onClick={() => handleImageClick(3)}
          >
            <Image
              src={images[3].url}
              alt={images[3].caption ?? propertyName}
              fill
              className="rounded-[10px] object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        )}

        {images[4] && (
          <div
            className="relative h-full min-h-49 cursor-pointer"
            onClick={() => handleImageClick(4)}
          >
            <Image
              src={images[4].url}
              alt={images[4].caption ?? propertyName}
              fill
              className="rounded-[10px] object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        )}

        {images[5] && (
          <div
            className="relative hidden h-full min-h-49 cursor-pointer 2xl:block"
            onClick={() => handleImageClick(5)}
          >
            <Image
              src={images[5].url}
              alt={images[5].caption ?? propertyName}
              fill
              className="rounded-[10px] object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        )}

        {images[6] && (
          <div
            className="relative hidden h-full min-h-49 cursor-pointer 2xl:block"
            onClick={() => handleImageClick(6)}
          >
            <Image
              src={images[6].url}
              alt={images[6].caption ?? propertyName}
              fill
              className="rounded-[10px] object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        )}
      </div>

      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <button
            type="button"
            onClick={() => setIsGalleryOpen(false)}
            aria-label="Cerrar galería"
            className="fixed top-6 right-6 z-50 cursor-pointer rounded-full bg-black/80 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            X
          </button>

          <div className="h-full w-full overflow-y-auto px-6 py-10">
            <div className="mx-auto w-full max-w-5xl">
              {Array.from({
                length: Math.ceil(images.length / 5),
              }).map((_, groupIndex) => {
                const baseIndex = groupIndex * 5;
                const group = images.slice(baseIndex, baseIndex + 5);

                return (
                  <div key={`group-${baseIndex}`} className="mt-4">
                    <div className="grid grid-cols-3 gap-2.5">
                      {group[0] && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsGalleryOpen(false);
                            openLightbox(baseIndex);
                          }}
                          className="relative col-span-2 row-span-2 h-130 cursor-pointer overflow-hidden"
                        >
                          <Image
                            src={group[0].url}
                            alt={group[0].caption ?? propertyName}
                            fill
                            className="object-cover"
                          />
                        </button>
                      )}

                      {group[1] && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsGalleryOpen(false);
                            openLightbox(baseIndex + 1);
                          }}
                          className="relative h-62.5 cursor-pointer overflow-hidden"
                        >
                          <Image
                            src={group[1].url}
                            alt={group[1].caption ?? propertyName}
                            fill
                            className="object-cover"
                          />
                        </button>
                      )}

                      {group[2] && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsGalleryOpen(false);
                            openLightbox(baseIndex + 2);
                          }}
                          className="relative h-62.5 cursor-pointer overflow-hidden"
                        >
                          <Image
                            src={group[2].url}
                            alt={group[2].caption ?? propertyName}
                            fill
                            className="object-cover"
                          />
                        </button>
                      )}

                      {group[3] && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsGalleryOpen(false);
                            openLightbox(baseIndex + 3);
                          }}
                          className="relative col-span-2 h-80 cursor-pointer overflow-hidden"
                        >
                          <Image
                            src={group[3].url}
                            alt={group[3].caption ?? propertyName}
                            fill
                            className="object-cover"
                          />
                        </button>
                      )}

                      {group[4] && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsGalleryOpen(false);
                            openLightbox(baseIndex + 4);
                          }}
                          className="relative h-80 cursor-pointer overflow-hidden"
                        >
                          <Image
                            src={group[4].url}
                            alt={group[4].caption ?? propertyName}
                            fill
                            className="object-cover"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={lightboxSlides}
        plugins={[Zoom, Thumbnails]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          border: 0,
          borderRadius: 4,
          padding: 4,
          gap: 16,
        }}
        on={{
          view: ({ index }) => setPhotoIndex(Number(index)),
        }}
        carousel={{
          finite: true,
        }}
        animation={{
          fade: 250,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
        render={{
          slideHeader: () => (
            <div className="absolute top-4 left-1/2 z-50 -translate-x-1/2 text-sm text-white">
              {photoIndex + 1} / {images.length}
            </div>
          ),
          slideContainer: ({ children }) => (
            <div
              style={{
                height: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {children}
            </div>
          ),
        }}
      />
    </>
  );
};
