import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Product } from '../../types/product';



const AddProduct = () => {
  // 表单状态
  const [formData, setFormData] = useState<Product>({
    productName: '',
    price: 0,
    stock: 0,
    mainImage: '',
    brand: '',
    status: 1, // Enabled by default
    description: ''
  });
  
// Status Management
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading status
  const [error, setError] = useState<string | null>(null); // Error message
  const navigate = useNavigate();

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'stock') {
      setFormData(prev => ({ ...prev, [name]: Number(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // 清除错误提示
    if (error) setError(null);
  };

  // Handle form submission and send the product data to the backend API
   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Front-end basic validation
    if (!formData.productName.trim()) {
      setError('Please enter the product name');
      return;
    }
    if (formData.price <= 0) {
      setError('Please enter a valid price (greater than 0)');
      return;
    }
    if (formData.stock < 0) {
      setError('Stock cannot be negative');
      return;
    }
    setIsLoading(true);// Start loading
    setError(null);// Clear the previous errors


 // Send POST requests
    axios.post(
        '/api/addProduct',
        formData, 
        {
            headers: { "Content-Type": "application/json" },
        }
      ).then((response) => {
        //Determine whether it is successful based on the back-end business code
        if (response.data.code === 200) {
          alert('Product added successfully!');
          navigate('/products'); // Redirect to the product list page
        } else {
          setError('Add failed：' + (response.data.message || 'Unknown error'));
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Product</h2>
      
      {/* Error Prompt */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="Please enter product name"
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
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Please enter the product price"
            min="0.01"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        {/* Stock */}
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">
            Stock Quantity <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="Please enter the stock quantity"
            min="0"
            disabled={isLoading}
          />
        </div>

        {/* Product Image URL */}
        <div className="mb-3">
          <label htmlFor="mainImage" className="form-label">Product Image URL</label>
          <input
            type="text"
            className="form-control"
            id="mainImage"
            name="mainImage"
            value={formData.mainImage}
            onChange={handleInputChange}
            placeholder="For example: https://example.com/product.jpg"
            disabled={isLoading}
          />
          <div className="form-text"> Supports HTTP/HTTPS image links, recommended size 500x500px</div>
        </div>

        {/* Brand */}
        <div className="mb-3">
          <label htmlFor="brand" className="form-label">Brand</label>
          <input
            type="text"
            className="form-control"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Please enter the brand name"
            disabled={isLoading}
          />
        </div>

        {/* Status */}
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            disabled={isLoading}
          >
            <option value={1}>Enabled (Visible)</option>
            <option value={0}>Disabled (Not Visible)</option>
          </select>
        </div>

        {/* Product Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Product Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please enter the product detailed description"
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
            {isLoading ? 'Submitting...' : 'Save Product'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/products')}
            disabled={isLoading}
          >
             Cancel (Return to Product List)
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;