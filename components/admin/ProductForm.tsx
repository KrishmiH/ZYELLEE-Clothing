"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProductImage = {
  url: string;
  publicId: string | null;
  file?: File;
};

type ProductData = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  images: {
    url: string;
    publicId: string | null;
  }[];
  sizes: string[];
  colors: string[];
  isNew: boolean;
};

type ProductFormProps = {
  product?: ProductData;
};

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

export default function ProductForm({
  product,
}: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(
    product?.category || "Tops"
  );
  const [price, setPrice] = useState(
    product ? String(product.price) : ""
  );
  const [description, setDescription] = useState(
    product?.description || ""
  );

  const [images, setImages] = useState<ProductImage[]>(
    product?.images.map((image) => ({ ...image })) || []
  );

  const [sizes, setSizes] = useState(
    product?.sizes.join(", ") || "S, M, L, XL"
  );

  const [colors, setColors] = useState(
    product?.colors.join(", ") || ""
  );

  const [isNew, setIsNew] = useState(product?.isNew || false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.file) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setError("You can upload a maximum of 5 images.");
      event.target.value = "";
      return;
    }

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(
          "Only JPG, PNG, WEBP and AVIF images are allowed."
        );
        event.target.value = "";
        return;
      }

      if (file.size === 0 || file.size > MAX_FILE_SIZE) {
        setError(
          "Each image must be smaller than 5 MB."
        );
        event.target.value = "";
        return;
      }
    }

    const newImages = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      publicId: null,
      file,
    }));

    setError("");
    setImages((previous) => [...previous, ...newImages]);

    event.target.value = "";
  }

  function removeImage(index: number) {
    setImages((previous) => {
      const image = previous[index];

      if (image?.file) {
        URL.revokeObjectURL(image.url);
      }

      return previous.filter(
        (_, imageIndex) => imageIndex !== index
      );
    });
  }

  function moveImage(index: number, direction: number) {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= images.length) {
      return;
    }

    setImages((previous) => {
      const updated = [...previous];

      [updated[index], updated[newIndex]] = [
        updated[newIndex],
        updated[index],
      ];

      return updated;
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (images.length === 0) {
      setError("Please keep or upload at least one product image.");
      return;
    }

    setLoading(true);

    try {
      // Upload only newly selected images.
      const newFiles = images.filter(
        (image) => image.file
      );

      let uploadedImages: UploadedImage[] = [];

      if (newFiles.length > 0) {
        const formData = new FormData();

        newFiles.forEach((image) => {
          formData.append("images", image.file!);
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
          setError(
            uploadData.message || "Image upload failed."
          );
          return;
        }

        uploadedImages = uploadData.images;
      }

      // Preserve the order of existing and newly uploaded images.
      let uploadIndex = 0;

      const finalImages = images.map((image) => {
        if (image.file) {
          return uploadedImages[uploadIndex++];
        }

        return {
          url: image.url,
          publicId: image.publicId,
        };
      });

      const productData = {
        name,
        category,
        price: Number(price),
        description,
        images: finalImages,
        sizes: sizes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        colors: colors
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        isNew,
      };

      const response = await fetch(
        product
          ? `/api/admin/products/${product.id}`
          : "/api/admin/products",
        {
          method: product ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            (product
              ? "Unable to update product."
              : "Unable to add product.")
        );
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

  const isEditing = Boolean(product);

  return (
    <form
      className="admin-product-form"
      onSubmit={handleSubmit}
    >
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
          <label htmlFor="product-description">
            Description
          </label>
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
        <p>
          Keep, remove, reorder or upload up to 5 product photos.
        </p>

        <label
          className="admin-image-upload-area"
          htmlFor="product-images"
        >
          <span className="admin-image-upload-icon">+</span>
          <strong>Choose product photos</strong>
          <span>Click to browse files from your computer</span>
          <small>
            JPG, PNG, WEBP or AVIF · Maximum 5 MB per image
          </small>
        </label>

        <input
          id="product-images"
          className="admin-image-file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleFileChange}
          disabled={images.length >= MAX_IMAGES || loading}
        />

        {images.length > 0 && (
          <div className="admin-image-preview-grid">
            {images.map((image, index) => (
              <div
                className="admin-image-preview"
                key={`${image.url}-${index}`}
              >
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                />

                {index === 0 && (
                  <span className="admin-primary-image-label">
                    Main image
                  </span>
                )}

                <div className="admin-image-actions">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0 || loading}
                    aria-label="Move image left"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={
                      index === images.length - 1 || loading
                    }
                    aria-label="Move image right"
                  >
                    →
                  </button>

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
              </div>
            ))}
          </div>
        )}

        <small className="admin-image-count">
          {images.length} of {MAX_IMAGES} images selected
        </small>
      </div>

      <div className="admin-form-section">
        <h2>Sizes and Colours</h2>
        <p>Specify the available product variations.</p>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="product-sizes">
              Available Sizes
            </label>
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
            <label htmlFor="product-colors">
              Available Colours
            </label>
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

      {error && (
        <p className="admin-form-error">{error}</p>
      )}

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
          {loading
            ? "PLEASE WAIT..."
            : isEditing
              ? "SAVE CHANGES"
              : "ADD PRODUCT"}
        </button>
      </div>
    </form>
  );
}
