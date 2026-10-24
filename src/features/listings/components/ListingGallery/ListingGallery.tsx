import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { CardListing } from "../../listing.types";
import { getImage } from "../../../../services/imageStorage";

import "./ListingGallery.css";
import { Link } from "react-router-dom";
interface ListingGalleryProps {
  listing: CardListing;
}

export function ListingGallery({
  listing,
}: ListingGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    async function loadImages() {
      const loaded: string[] = [];

      for (const image of listing.images ?? []) {
        try {
          const blob = await getImage(image.storageKey);

          if (!blob) continue;

          const url = URL.createObjectURL(blob);
          objectUrls.push(url);
          loaded.push(url);
        } catch {
          // Continue loading other images.
        }
      }

      if (loaded.length === 0 && listing.image) {
        loaded.push(listing.image);
      }

      if (!cancelled) {
        setImages(loaded);
        setActiveIndex(0);
      }
    }

    setImages([]);
    void loadImages();

    return () => {
      cancelled = true;
      objectUrls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [listing]);

  const currentImage = images[activeIndex];

  function nextImage() {
    setActiveIndex((index) =>
      (index + 1) % images.length
    );
  }

  function previousImage() {
    setActiveIndex((index) =>
      (index - 1 + images.length) % images.length
    );
  }

  return (
    <div className="listing-gallery">
      <div className="listing-gallery__main">
        {currentImage ? (
          <img
            src={currentImage}
            alt={listing.name}
          />
        ) : (
          <div className="listing-gallery__placeholder">
            No image available
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              className="listing-gallery__previous"
              onClick={previousImage}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              className="listing-gallery__next"
              onClick={nextImage}
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="listing-gallery__thumbnails">
          {images.map((src, index) => (
            <button
              key={src}
              className={
                activeIndex === index ? "active" : ""
              }
              onClick={() => setActiveIndex(index)}
              aria-label={`View photo ${index + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}