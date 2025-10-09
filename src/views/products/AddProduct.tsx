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
    status: 1, // 默认启用
    description: ''
  });
  
  // 状态管理
  const [isLoading, setIsLoading] = useState<boolean>(false); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息
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

  // 提交表单到接口
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 前端基础验证
    if (!formData.productName.trim()) {
      setError('请输入产品名称');
      return;
    }
    if (formData.price <= 0) {
      setError('请输入有效的价格（大于0）');
      return;
    }
    if (formData.stock < 0) {
      setError('库存不能为负数');
      return;
    }

    try {
      setIsLoading(true); // 开始加载
      setError(null); // 清除之前的错误

      // 发送 POST 请求（JSON 格式）
      const response = await axios.post(
        'http://127.0.0.1:8080/api/addProduct',
        formData, // 请求体（自动转为 JSON）
        {
          headers: {
            'Content-Type': 'application/json' // 明确指定 JSON 格式
          }
        }
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">添加新产品</h2>
      
      {/* 错误提示 */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="请输入产品名称"
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
            value={formData.price}
            onChange={handleInputChange}
            placeholder="请输入产品价格"
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
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="请输入库存数量"
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
            value={formData.mainImage}
            onChange={handleInputChange}
            placeholder="例如：https://example.com/product.jpg"
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
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="请输入品牌名称"
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
            value={formData.status}
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
            value={formData.description}
            onChange={handleInputChange}
            placeholder="请输入产品详细描述"
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

export default AddProduct;