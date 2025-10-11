import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import type { ApiResult, Page, Product } from "../../types/product";
import { Link, useSearchParams } from "react-router-dom";
// import { mockProductResult } from "../../mockData";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<Page<Product> | null>(null);
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.has("page")
    ? Number(searchParams.get("page"))
    : 0;

  // 修正 getPageParam 函数（确保页码有效）
  const getPageParam = () => {
    // 过滤非数字/无效的页码
    const validCurrentPage =
      typeof currentPage === "number" && !isNaN(currentPage) ? currentPage : 0;

    if (!pageInfo) {
      return Math.max(0, validCurrentPage); // 确保页码不小于0
    }
    return Math.max(0, Math.min(validCurrentPage, pageInfo.totalPages - 1));
  };

  // 修正 pageSize 的获取方式（关键！）
  const pageSize = searchParams.has("size")
    ? Number(searchParams.get("size"))
    : undefined;

  // 修正 getSizeParam 函数（确保无效值被过滤）
  const getSizeParam = () => {
    // 过滤非数字/无效的 size 值
    const validPageSize =
      typeof pageSize === "number" && !isNaN(pageSize) && pageSize > 0
        ? pageSize
        : undefined;

    // 优先用 URL 中的有效 size → 再用后端返回的 size → 最后用默认值 10
    const size = validPageSize ?? pageInfo?.size ?? 10;

    // 范围限制（保持原逻辑，但此时 size 已经是有效値）
    return Math.max(5, Math.min(size, 100));
  };

  const pageNumbers = [...Array(pageInfo?.totalPages || 0).keys()];

  // 删除产品的函数
  const handleDelete = async (productId: string) => {
    // 确认删除（避免误操作）
    if (!window.confirm(`确定要删除ID为 ${productId} 的产品吗？`)) {
      return;
    }

    try {
      // 发送DELETE请求到后端删除接口
      const response = await axios.post<ApiResult<string>>(
        `http://localhost:8080/api/deleteProduct/${productId}` // 假设后端接口路径是这个
      );

      // 根据后端返回的code判断是否成功（这里用200代表成功）
      if (response.data.code === 200) {
        alert("删除成功！");
        // 重新获取当前页数据，刷新列表
        fetchProducts();
      } else {
        // 后端返回业务错误（如产品不存在）
        alert(`删除失败：${response.data.message}`);
      }
    } catch (err) {
      // 网络错误或服务器异常
      console.error("删除请求失败：", err);
      alert("删除失败，请稍后重试！");
    }
  };

  const fetchProducts = async () => {
    axios
      .get<ApiResult<Page<Product>>>(
        `http://localhost:8080/api/products/lists`,
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

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);
  // useEffect(() => {
  //   setProducts(mockProductResult.data.content);
  // }, []);
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
            {/* 上一页 */}
            <li className={`page-item ${pageInfo?.first ? "disabled" : ""}`}>
              <Link
                className="page-link"
                to={`/products/lists?page=${getPageParam()}&size=${getSizeParam()}`}
                // 当为第一页时禁用链接
                onClick={(e) => pageInfo?.first && e.preventDefault()}
              >
                Previous
              </Link>
            </li>

            {/* 数字页码 */}
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

            {/* 下一页 */}
            <li className={`page-item ${pageInfo?.last ? "disabled" : ""}`}>
              <Link
                className="page-link"
                to={`/products/?page=${
                  getPageParam() + 1
                }&size=${getSizeParam()}`}
                // 当为最后一页时禁用链接
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
/*
export default ProductList;
import { useState, useEffect } from "react";
import axios from "axios";
import type { ApiResult, Page, Product } from "./product";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    axios
    .get<ApiResult<Page<Product>>>('http://127.0.0.1:8080/products/list')
    .then(res => {
      // 现在 TS 知道 res.data.data.content 才是 Product[]
      setProducts(res.data.data.content);
    })
    .catch(err => console.error(err));
  }, []);

  return (
    <>
      <table className=" table table-success table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">名称</th>
            <th scope="col">价格</th>
            <th scope="col">库存</th>
            <th scope="col">品牌</th>
            <th scope="col">状态</th>
            <th scope="col">描述</th>
            <th scope="col">头像</th>
            <th scope="col">操作</th>
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
              <td>{product.status === 1 ? "已上架" : "未上架"}</td>
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
                <button className="btn btn-primary">编辑</button>
                <button className="btn btn-danger">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ProductList;
*/
