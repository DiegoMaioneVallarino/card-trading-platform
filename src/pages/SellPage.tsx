import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import type { CardCategory } from "../features/cards/card.types";
import type {
  CardCondition,
  CardListing,
} from "../features/listings/listing.types";

import { useListingStore } from "../features/listings/listing.store";
import { DEMO_SELLER_ID } from "../features/listings/listing.data";

import { ImageUploader } from "../features/listings/components/ImageUploader/ImageUploader";
import { saveImage, deleteImage } from "../services/imageStorage";

import { cards } from "../features/cards/card.data";


import "./SellPage.css";

export function SellPage() {
  const navigate = useNavigate();
  const addListing = useListingStore(
    (state) => state.addListing
  );

  const [name, setName] = useState("");
  const [collection, setCollection] = useState("");
  const [category, setCategory] =
    useState<CardCategory>("pokemon");

  const [rarity, setRarity] = useState("");
  const [condition, setCondition] =
    useState<CardCondition>("Near Mint");

  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

const [files, setFiles] = useState<File[]>([]);
const [isSaving, setIsSaving] = useState(false);
const [saveError, setSaveError] = useState("");

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (isSaving) return;

  const parsedPrice = Number(price);
  const parsedQuantity = Number(quantity);

  if (
    !name.trim() ||
    !collection.trim() ||
    !Number.isFinite(parsedPrice) ||
    parsedPrice <= 0 ||
    !Number.isSafeInteger(parsedQuantity) ||
    parsedQuantity < 1
  ) {
    return;
  }

  setIsSaving(true);
  setSaveError("");

  const savedKeys: string[] = [];

  try {
    const images = [];

    for (const file of files) {
      const storageKey = await saveImage(file);
      savedKeys.push(storageKey);

      images.push({
        id: crypto.randomUUID(),
        storageKey,
      });
    }

    const listing: CardListing = {
      id: crypto.randomUUID(),
      name: name.trim(),
      collection: collection.trim(),
      category,
      rarity: rarity.trim() || "Unspecified",
      condition,
      price: parsedPrice,
      quantity: parsedQuantity,
      description: description.trim(),
      image: image.trim(),
      images,
      sellerId: DEMO_SELLER_ID,
      sellerName: "You",
      createdAt: new Date().toISOString(),
      status: "active",
    };

    addListing(listing);
    navigate("/my-listings");
  } catch {
    await Promise.allSettled(
      savedKeys.map((key) => deleteImage(key))
    );

    setSaveError(
      "Unable to save the photos. Please try again."
    );
  } finally {
    setIsSaving(false);
  }
}

  return (
    <main className="sell-page">
      <div className="sell-page__intro">
        <span>SELL ON CARDMARKET</span>
        <h1>List your card.</h1>
        <p>
          Share your collectibles with the community.
          Create a listing in just a few steps.
        </p>
      </div>

      <form
        className="sell-page__form"
        onSubmit={handleSubmit}
      >
        <div className="sell-page__section">
          <h2>Card information</h2>
<label>
  Select from catalog (optional)
  <select
    defaultValue=""
    onChange={(event) => {
      const card = cards.find(
        (item) => item.id === event.target.value
      );

      if (!card) return;

      setName(card.name);
      setCollection(card.collection);
      setCategory(card.category);
      setRarity(card.rarity);
      setImage(card.image);
    }}
  >
    <option value="">Select a card...</option>

    {cards.map((card) => (
      <option key={card.id} value={card.id}>
        {card.name} — {card.collection}
      </option>
    ))}
  </select>
</label>
          <label>
            Card name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Charizard"
            />
          </label>

          <label>
            Collection / Set
            <input
              required
              value={collection}
              onChange={(e) =>
                setCollection(e.target.value)
              }
              placeholder="e.g. Base Set"
            />
          </label>

          <div className="sell-page__row">
            <label>
              Category
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as CardCategory
                  )
                }
              >
                <option value="pokemon">Pokémon</option>
                <option value="yugioh">Yu-Gi-Oh!</option>
                <option value="magic">Magic</option>
                <option value="sports">Sports</option>
              </select>
            </label>

            <label>
              Rarity
              <input
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                placeholder="e.g. Holo Rare"
              />
            </label>
          </div>
        </div>

        <div className="sell-page__section">
          <h2>Condition & pricing</h2>

          <label>
            Card condition
            <select
              value={condition}
              onChange={(e) =>
                setCondition(
                  e.target.value as CardCondition
                )
              }
            >
              <option>Mint</option>
              <option>Near Mint</option>
              <option>Excellent</option>
              <option>Lightly Played</option>
              <option>Played</option>
              <option>Damaged</option>
            </select>
          </label>

          <div className="sell-page__row">
            <label>
              Price (MXN)
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                required
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />
            </label>
          </div>
        </div>
<div className="sell-page__section">
  <h2>Card photography</h2>

  <ImageUploader
    files={files}
    onChange={setFiles}
  />
</div>
        <div className="sell-page__section">
          <h2>Additional details</h2>

          <label>
            Image URL
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/my-card.png"
            />
          </label>

          <label>
            Description
            <textarea
              rows={5}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe your card..."
            />
          </label>
        </div>

       <button
  className="sell-page__submit"
  type="submit"
  disabled={isSaving}
>
  {isSaving ? "Publishing..." : "Publish listing"}
</button>

        {saveError && (
  <p role="alert" className="image-uploader__error">
    {saveError}
  </p>
)}
      </form>
    </main>
  );
}