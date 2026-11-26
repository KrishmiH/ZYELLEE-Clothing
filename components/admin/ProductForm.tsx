"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UploadedImage = {
  url: string;
  publicId: string;
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export default function ProductForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tops");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sizes, setSizes] = useState("S, M, L, XL");
  const [colors, setColors] = useState("");
  const [isNew, setIsNew] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(event.target.files || []);

    if (files.length + selectedFiles.length > MAX_IMAGES) {
      setError("You can upload a maximum of 5 images.");
      event.target.value = "";
      return;
    }

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Only JPG, PNG, WEBP and AVIF images are allowed.");
        event.target.value = "";
        return;
      }

      if (file.size === 0 || file.size > MAX_FILE_SIZE) {
        setError("Each image must be smaller than 5 MB.");
        event.target.value = "";
        return;
      }
    }

    setError("");
    setFiles((previous) => [...previous, ...selectedFiles]);
    event.target.value = "";
  }

  function removeImage(index: number) {
    setFiles((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (files.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }

    setLoading(true);

    try {
      // First upload the selected images to Cloudinary.
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      const uploadResponse = await fetch(
        "/api/admin/products/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        setError(uploadData.message || "Image upload failed.");
        return;
      }

      const uploadedImages: UploadedImage[] = uploadData.images;

      // Then save the product and its image records.
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          price: Number(price),
          description,
          images: uploadedImages,
          sizes: sizes.split(",").map((item) => item.trim()).filter(Boolean),
          colors: colors.split(",").map((item) => item.trim()).filter(Boolean),
          isNew,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to add product.");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <div className="admin-form-section">
        <h2>Product Information</h2>
        <p>Enter the basic details of your clothing item.</p>

        <div className="admin-form-group">
          <label htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Elegant Summer Dress"
            required
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="product-category">Category</label>
            <select
              id="product-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Tops">Tops</option>
              <option value="Dresses">Dresses</option>
              <option value="Bottoms">Bottoms</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="product-price">Price (LKR)</label>
            <input
              id="product-price"
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="3500"
              required
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description for your product..."
            rows={4}
            required
          />
        </div>
      </div>

      <div className="admin-form-section">
        <h2>Product Photos</h2>
        <p>Upload up to 5 photos from your computer.</p>

        <label className="admin-image-upload-area" htmlFor="product-images">
          <span className="admin-image-upload-icon">+</span>
          <strong>Choose product photos</strong>
          <span>Click to browse files from your computer</span>
          <small>JPG, PNG, WEBP or AVIF · Maximum 5 MB per image</small>
        </label>

        <input
          id="product-images"
          className="admin-image-file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleFileChange}
          disabled={files.length >= MAX_IMAGES || loading}
        />

        {previews.length > 0 && (
          <div className="admin-image-preview-grid">
            {previews.map((preview, index) => (
              <div className="admin-image-preview" key={`${preview.file.name}-${index}`}>
                <img src={preview.url} alt={`Product preview ${index + 1}`} />

                {index === 0 && (
                  <span className="admin-primary-image-label">
                    Main image
                  </span>
                )}

                <button
                  type="button"
                  className="admin-remove-image"
                  onClick={() => removeImage(index)}
                  disabled={loading}
                  aria-label={`Remove image ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <small className="admin-image-count">
          {files.length} of {MAX_IMAGES} images selected
        </small>
      </div>

      <div className="admin-form-section">
        <h2>Sizes and Colours</h2>
        <p>Specify the available product variations.</p>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="product-sizes">Available Sizes</label>
            <input
              id="product-sizes"
              type="text"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="S, M, L, XL"
              required
            />
            <small>Separate sizes with commas.</small>
          </div>

          <div className="admin-form-group">
            <label htmlFor="product-colors">Available Colours</label>
            <input
              id="product-colors"
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="Black, Beige, White"
              required
            />
            <small>Separate colours with commas.</small>
          </div>
        </div>

        <label className="admin-product-checkbox">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
          />
          Mark as New Arrival
        </label>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      <div className="admin-form-actions">
        <button
          type="button"
          className="admin-form-cancel"
          onClick={() => router.push("/admin/products")}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="admin-form-submit"
          disabled={loading}
        >
          {loading ? "UPLOADING AND SAVING..." : "ADD PRODUCT"}
        </button>
      </div>
    </form>
  );
}
