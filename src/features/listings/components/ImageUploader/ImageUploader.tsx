import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import "./ImageUploader.css";

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ImageUploader({
  files,
  onChange,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const urls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = Array.from(event.target.files ?? []);

    const valid = selected.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(
          file.type
        ) &&
        file.size <= MAX_FILE_SIZE
    );

    if (valid.length !== selected.length) {
      setError("Only JPG, PNG or WebP images up to 5 MB are allowed.");
    } else {
      setError("");
    }

    onChange([...files, ...valid].slice(0, MAX_IMAGES));
    event.target.value = "";
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="image-uploader">
      <div className="image-uploader__grid">
        {previews.map((src, index) => (
          <div
            className="image-uploader__preview"
            key={src}
          >
            <img src={src} alt={`Card photo ${index + 1}`} />

            <button
              type="button"
              onClick={() => removeFile(index)}
              aria-label="Remove image"
            >
              <X size={15} />
            </button>
          </div>
        ))}

        {files.length < MAX_IMAGES && (
          <label className="image-uploader__add">
            <ImagePlus size={25} />
            <span>Add photos</span>
            <small>{files.length}/{MAX_IMAGES}</small>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFiles}
            />
          </label>
        )}
      </div>

      {error && <p className="image-uploader__error">{error}</p>}

      <p className="image-uploader__hint">
        Upload up to 6 photos. JPG, PNG or WebP, max 5 MB each.
      </p>
    </div>
  );
}