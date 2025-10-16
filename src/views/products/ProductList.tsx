import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import type { ApiResult, Page, Product } from "../../types/product";
import { Link, useSearchParams } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<Page<Product> | null>(null);
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.has("page")
    ? Number(searchParams.get("page"))
    : 0;
// Correct the getPageParam function (ensure page numbers are valid)
  const getPageParam = () => {
  // Filter non-numeric/invalid page numbers
    const validCurrentPage =
      typeof currentPage === "number" && !isNaN(currentPage) ? currentPage : 0;

    if (!pageInfo) {
      return Math.max(0, validCurrentPage); // Ensure page number is not less than 0
    }
    return Math.max(0, Math.min(validCurrentPage, pageInfo.totalPages - 1));
  };

  // Correct the pageSize retrieval logic (ensure valid values)
  const pageSize = searchParams.has("size")
    ? Number(searchParams.get("size"))
    : undefined;

  // Correct the getSizeParam function (ensure invalid values are filtered)
  const getSizeParam = () => {
    // Filter non-numeric/invalid size values
    const validPageSize =
      typeof pageSize === "number" && !isNaN(pageSize) && pageSize > 0
        ? pageSize
        : undefined;
    // Prioritize valid size from URL → backend size → default size 10
    const size = validPageSize ?? pageInfo?.size ?? 10;

    // Range limit (ensure size is within valid range [5-100])
    return Math.max(5, Math.min(size, 100));
  };

  const pageNumbers = [...Array(pageInfo?.totalPages || 0).keys()];

  // Delete the function of the product
  const handleDelete = (productId: string) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete the product with ID ${productId}?`)) {
      return;
    }
    // Send DELETE request to backend delete interface
    axios
      .post<ApiResult<string>>(`http://localhost:8080/api/deleteProduct/${productId}`)
      .then((response) => {
        // Determine whether it was successful based on the code returned from the back end
        if (response.data.code === 200) {
          alert("Deleted successfully!");
          // Re-obtain the current page data and refresh the list
          fetchProducts();
        } else {
          // Back-end returns business errors
          alert(`Fail to delete：${response.data.message}`);
        }
      })
      .catch((err) => {
        // Network errors or server exceptions
        console.error("Delete request failed：", err);
        alert("Delete failed, please try again later!");
      });
  };
// Function to obtain product list data
const fetchProducts = () => {
    axios
      .get<ApiResult<Page<Product>>>(
        `/api/products/lists`,
        {
          params: {
            page: currentPage,
            size: pageSize,
          },
        }
      )
      .then((response) => {
        setProducts(response.data.data.content);
        setPageInfo(response.data.data);
      })
      .catch((err) => console.error(err));
  };
  // Obtain product list data when component mounts or page parameters change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);
  return (
    <Fragment>
      <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <table className="table table-primary table-bordered text-center align-middle">
        <colgroup>
          <col style={{ width: "8%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "13%" }} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">ProductName</th>
            <th scope="col">Price</th>
            <th scope="col">Stock</th>
            <th scope="col">Brand</th>
            <th scope="col">Status</th>
            <th scope="col">Description</th>
            <th scope="col">Image</th>
            <th scope="col">Operation</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.productName}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.brand}</td>
              <td>{product.status === 1 ? "Enabled" : "Disabled"}</td>
              <td>{product.description}</td>
              <td>
                <img
                  src={product.mainImage}
                  alt={product.productName}
                  width="50"
                  height="50"
                />
              </td>
              <td>
                <Link to={`/products/${product.productId}`}>
                  <button className="btn btn-primary me-2">Edit</button>
                </Link>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(product?.productId ?? "")}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
        </div>
      {pageInfo && pageInfo.totalPages > 1 && (
        <nav className="mt-5">
          <ul className="pagination justify-content-center">
            {/* Previous page */}
            <li className={`page-item ${pageInfo?.first ? "disabled" : ""}`}>
              <Link
                className="page-link"
                to={`/products/lists?page=${getPageParam()}&size=${getSizeParam()}`}
                // Disable link when on the first page
                onClick={(e) => pageInfo?.first && e.preventDefault()}
              >
                Previous
              </Link>
            </li>

            {/* Numeric page numbers */}
            {pageNumbers.map((i) => (
              <li
                key={i}
                className={`page-item ${
                  i === pageInfo?.number ? "active" : ""
                }`}
              >
                <Link
                  className="page-link"
                  to={`/products/?page=${i}&size=${getSizeParam()}`}
                >
                  {i + 1}
                </Link>
              </li>
            ))}

            {/* Next page */}
            <li className={`page-item ${pageInfo?.last ? "disabled" : ""}`}>
              <Link
                className="page-link"
                to={`/products/?page=${
                  getPageParam() + 1
                }&size=${getSizeParam()}`}
                // Disable link when on the last page
                onClick={(e) => pageInfo?.last && e.preventDefault()}
              >
                Next
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </Fragment>
  );
}
export default ProductList;
