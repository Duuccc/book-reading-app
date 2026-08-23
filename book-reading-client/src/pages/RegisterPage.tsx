import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import api from '../api/axios';
import { useAuthStore } from '../stores/auth.store';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate  = useNavigate();
  const { setAuth } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email:    '',
    username: '',
    password: '',
    confirm:  '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.email)    errs.email    = 'Email không được trống';
    if (!form.username) errs.username = 'Username không được trống';
    if (form.username.length < 3)
      errs.username = 'Username tối thiểu 3 ký tự';
    if (form.password.length < 8)
      errs.password = 'Mật khẩu tối thiểu 8 ký tự';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password = 'Mật khẩu cần chữ hoa, chữ thường và số';
    if (form.password !== form.confirm)
      errs.confirm = 'Mật khẩu xác nhận không khớp';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        email:    form.email,
        username: form.username,
        password: form.password,
      });
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Đăng ký thành công!');
      navigate('/');
    } catch {
      // Error toast handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    // Xóa lỗi khi user bắt đầu nhập lại
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600/20 rounded-2xl mb-4">
            <BookOpen size={28} className="text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
          <p className="text-gray-400 mt-1">Miễn phí, không cần thẻ tín dụng</p>
        </div>

        <form onSubmit={handleSubmit}
          className="space-y-4 bg-gray-900 p-6 rounded-2xl border border-gray-800">

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={handleChange('email')}
              className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-sm
                         focus:outline-none transition
                         ${errors.email
                           ? 'border-red-500 focus:border-red-500'
                           : 'border-gray-700 focus:border-primary-500'}`}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Username</label>
            <input
              type="text" required
              value={form.username}
              onChange={handleChange('username')}
              className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-sm
                         focus:outline-none transition
                         ${errors.username
                           ? 'border-red-500 focus:border-red-500'
                           : 'border-gray-700 focus:border-primary-500'}`}
              placeholder="username"
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Mật khẩu</label>
            <input
              type="password" required
              value={form.password}
              onChange={handleChange('password')}
              className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-sm
                         focus:outline-none transition
                         ${errors.password
                           ? 'border-red-500 focus:border-red-500'
                           : 'border-gray-700 focus:border-primary-500'}`}
              placeholder="Tối thiểu 8 ký tự"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Xác nhận mật khẩu</label>
            <input
              type="password" required
              value={form.confirm}
              onChange={handleChange('confirm')}
              className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-sm
                         focus:outline-none transition
                         ${errors.confirm
                           ? 'border-red-500 focus:border-red-500'
                           : 'border-gray-700 focus:border-primary-500'}`}
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirm && (
              <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>
            )}
          </div>

          <Button type="submit" loading={loading} className="w-full mt-2">
            Tạo tài khoản
          </Button>
        </form>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}