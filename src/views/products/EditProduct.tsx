import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { ApiResult, Product } from "../../types/product";

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  // Status Management
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading status
  const [error, setError] = useState<string | null>(null); // Error message
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("Product ID does not exist");
      return;
    }
    const fetchProduct = async () => {
      setIsLoading(true);
      axios
        .get<ApiResult<Product>>(`/api/products/${id}`)
        .then((response) => {
          if (response.data.code === 200) {
            setProduct(response.data.data);
          } else {
            setError("Failed to obtain the product");
          }
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) {
            setError(`Request failed: ${err.message || "Network error"}`);
          } else {
            setError("Unknown error, please try again later");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchProduct();
  }, [id]);

  // Handle changes in form input and synchronize them in real time to the "product" state
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!product) return; // If product data is not loaded, do not process

    const { name, value } = e.target;
    setProduct((prev) => {
      if (!prev) return prev;
      // For numeric fields (price, stock, status), convert them to numbers
      return {
        ...prev,
        [name]: ["price", "stock", "status"].includes(name)
          ? Number(value)
          : value,
      };
    });
    setError(null); // Clear the error prompt when inputting
  };
  // Handle form submission and send the product data to the backend API
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Front-end basic validation
    if (!product?.productName.trim()) {
      setError("Please enter the product name");
      return;
    }
    if (product.price <= 0) {
      setError("Please enter a valid price (greater than 0)");
      return;
    }
    if (product.stock < 0) {
      setError("Stock cannot be negative");
      return;
    }

    setIsLoading(true);// Start loading
    setError(null);// Clear the previous errors

   // Send POST requests
    axios
      .post("/api/updateProduct", product, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        //Determine whether it is successful based on the back-end business code
        if (response.data.code === 200) {
          alert("Product updated successfully!");
          navigate("/products");// Redirect to the product list page
        } else {
          setError("Update failed：" + (response.data.message || "Unknown error"));
        }
      })
      .catch((err) => {
        //Network or interface anomaly
        if (axios.isAxiosError(err)) {
          setError(`Request failed: ${err.message || "Network error"}`);
        } else {
          setError("Unknown error, please try again later");
        }
      })
      .finally(() => {
        setIsLoading(false); // End loading
      });
  };
  if (isLoading) {
    return <div className="container mt-4">Loading product data...</div>;
  }
// product is null (and not loading) : Display an error prompt
  if (!product) {
    return (
      <div className="container mt-4 alert alert-warning">
        {error || "Product data failed to load, please return to the list and try again"}
        <button
          className="btn btn-secondary ms-3"
          onClick={() => navigate("/products")}
        >
          Return to the list
        </button>
      </div>
    );
  }
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit Product</h2>

      {/* Error prompt */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Product ID (read-only, displayed only) */}
        <div className="mb-3">
          <label className="form-label">Product ID</label>
          <input
            type="text"
            className="form-control"
            value={product.productId}
            readOnly
            disabled
          />
        </div>

        {/* Product Name */}
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Product Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            name="productName"
            value={product.productName}
            onChange={handleInputChange}
            disabled={isLoading} // Disable input when loading
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price（S&#36;）<span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        {/* Stock Quantity */}
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">
            库存数量 <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleInputChange}
            min="0"
            disabled={isLoading}
          />
        </div>

        {/* Product Image URL */}
        <div className="mb-3">
          <label htmlFor="mainImage" className="form-label">
            Product Image URL
          </label>
          <input
            type="text"
            className="form-control"
            id="mainImage"
            name="mainImage"
            value={product.mainImage}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <div className="form-text">
            Supports HTTP/HTTPS image links, recommended size 500x500px
          </div>
        </div>

        {/* Brand */}
        <div className="mb-3">
          <label htmlFor="brand" className="form-label">
            Brand
          </label>
          <input
            type="text"
            className="form-control"
            id="brand"
            name="brand"
            value={product.brand}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {/* Status */}
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={product.status}
            onChange={handleInputChange}
            disabled={isLoading}
          >
            <option value={1}>Enabled (Visible)</option>
            <option value={0}>Disabled (Not Visible)</option>
          </select>
        </div>

        {/* Product Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Product Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            rows={5}
            disabled={isLoading}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="mb-3">
          <button
            type="submit"
            className="btn btn-primary me-3"
            disabled={isLoading}
          >
            {isLoading ? "Submission in progress..." : "Save the product"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/products")}
            disabled={isLoading}
          >
            Cancel (Return to Product List)
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
