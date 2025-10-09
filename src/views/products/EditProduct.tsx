import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import type { ApiResult, Product } from '../../types/product';



function EditProduct() {
  const { id } = useParams(); // id 就是 "550e8400-e29b-41d4-a716-446655440000"
  console.log(id); // 打印确认
  const [product, setProduct] = useState<Product | null>(null);
    // 状态管理
  const [isLoading, setIsLoading] = useState<boolean>(false); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息
  const navigate = useNavigate();

   useEffect(() => {
    if (!id) {
      setError('产品ID不存在');
      return;
    }
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResult<Product>>(`http://localhost:8080/api/products/${id}`);
        if (response.data.code === 200) {
          setProduct(response.data.data); // 请求成功后，product 从 null 变为具体数据
        } else {
          setError('获取产品失败');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
        setError(`请求失败：${err.message || '网络错误'}`);
      } else {
        setError('发生未知错误，请稍后重试');
      }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

// 处理表单输入变化：直接修改 product 状态中的对应字段
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!product) return; // 产品数据未加载时不处理

    const { name, value } = e.target;
    setProduct(prev => {
      if (!prev) return prev;
      // 针对数字类型字段（price、stock、status）做类型转换
      return {
        ...prev,
        [name]: ['price', 'stock', 'status'].includes(name) 
          ? Number(value) 
          : value
      };
    });
    setError(null); // 输入时清空错误提示
  };
  // 提交表单到接口
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 前端基础验证
    if (!product?.productName.trim()) {
      setError('请输入产品名称');
      return;
    }
    if (product.price <= 0) {
      setError('请输入有效的价格（大于0）');
      return;
    }
    if (product.stock < 0) {
      setError('库存不能为负数');
      return;
    }

    try {
      setIsLoading(true); // 开始加载
      setError(null); // 清除之前的错误

      // 发送 POST 请求（JSON 格式）
       const response = await axios.post(
         'http://127.0.0.1:8080/api/updateProduct',
        product, // 直接使用 product 作为请求体
        { headers: { 'Content-Type': 'application/json' } }
      );

      // 假设接口返回成功状态（根据实际接口调整判断逻辑）
      if (response.data.code === 200) {
        alert('产品添加成功！');
        navigate('/products'); // 跳转回产品列表
      } else {
        setError('添加失败：' + (response.data.message || '未知错误'));
      }
    } catch (err) {
      // 捕获网络错误或接口异常
      if (axios.isAxiosError(err)) {
        setError(`请求失败：${err.message || '网络错误'}`);
      } else {
        setError('发生未知错误，请稍后重试');
      }
    } finally {
      setIsLoading(false); // 结束加载
    }
  };
if (isLoading) {
    return <div className="container mt-4">加载产品数据中...</div>;
  }
  // product 为 null（且不在加载中）：显示错误提示
  if (!product) {
    return (
      <div className="container mt-4 alert alert-warning">
        {error || '产品数据未加载，请返回列表重试'}
        <button 
          className="btn btn-secondary ms-3"
          onClick={() => navigate('/products')}
        >
          返回列表
        </button>
      </div>
    );
  }
  return (
    <div className="container mt-4">
      <h2 className="mb-4">编辑产品</h2>
      
      {/* 错误提示 */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* 产品ID（只读，展示用） */}
        <div className="mb-3">
          <label className="form-label">产品ID</label>
          <input
            type="text"
            className="form-control"
            value={product.productId}
            readOnly // ID 通常不允许修改
            disabled
          />
        </div>

        {/* 产品名称 */}
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            产品名称 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            name="productName"
            value={product.productName}
            onChange={handleInputChange}
            disabled={isLoading} // 加载时禁用输入
          />
        </div>

        {/* 价格 */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            价格（元）<span className="text-danger">*</span>
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

        {/* 库存 */}
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

        {/* 主图URL */}
        <div className="mb-3">
          <label htmlFor="mainImage" className="form-label">主图URL</label>
          <input
            type="text"
            className="form-control"
            id="mainImage"
            name="mainImage"
            value={product.mainImage}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <div className="form-text">支持HTTP/HTTPS图片链接，建议尺寸500x500px</div>
        </div>

        {/* 品牌 */}
        <div className="mb-3">
          <label htmlFor="brand" className="form-label">品牌</label>
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

        {/* 状态 */}
        <div className="mb-3">
          <label htmlFor="status" className="form-label">状态</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={product.status}
            onChange={handleInputChange}
            disabled={isLoading}
          >
            <option value={1}>启用（可展示）</option>
            <option value={0}>禁用（不展示）</option>
          </select>
        </div>

        {/* 产品描述 */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">产品描述</label>
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

        {/* 提交按钮 */}
        <div className="mb-3">
          <button 
            type="submit" 
            className="btn btn-primary me-3"
            disabled={isLoading}
          >
            {isLoading ? '提交中...' : '保存产品'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/products')}
            disabled={isLoading}
          >
            取消（返回列表）
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
