import { useEffect, useState } from "react";
import type { CardListing } from "../listing.types";
import { getImage } from "../../../services/imageStorage";

interface ListingImageProps {
  listing: CardListing;
}

export function ListingImage({ listing }: ListingImageProps) {
  const [src, setSrc] = useState(listing.image);

  const storageKey = listing.images?.[0]?.storageKey;

  useEffect(() => {
    if (!storageKey) {
      return;
    }

    let active = true;
    let objectUrl: string | undefined;

    getImage(storageKey)
      .then((blob) => {
        if (!blob || !active) return;

        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (active) setSrc(listing.image);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [storageKey, listing.image]);

  return (
    <img
      src={src || "/images/placeholder.png"}
      alt={listing.name}
    />
  );
}