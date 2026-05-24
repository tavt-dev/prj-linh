import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập đăng nhập
    const defaultAddresses = [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901 234 567',
        address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
        isDefault: true,
        type: 'Nhà riêng'
      },
      {
        id: '2',
        name: 'Nguyễn Văn A',
        phone: '0901 234 567',
        address: 'Tòa nhà Bitexco, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        isDefault: false,
        type: 'Công ty'
      }
    ];

    if (email === 'admin@tennispro.vn' && password === 'admin123') {
      login({
        id: '1',
        name: 'Admin',
        email: 'admin@tennispro.vn',
        phone: '0901234567',
        role: 'admin',
        addresses: defaultAddresses,
      });
      addToast('Đăng nhập quản trị viên thành công', 'success');
      navigate('/admin');
    } else if (email === 'user@example.com' && password === 'user123') {
      login({
        id: '2',
        name: 'Nguyễn Văn A',
        email: email,
        phone: '0901234567',
        role: 'user',
        addresses: defaultAddresses,
      });
      addToast('Đăng nhập thành công', 'success');
      navigate('/');
    } else {
      addToast('Email hoặc mật khẩu không đúng', 'error');
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-medium text-zinc-900 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
            />
            <Input
              label="Mật khẩu"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-900">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-zinc-900 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Đăng nhập
          </Button>
          
          <div className="mt-4 text-center text-sm text-zinc-500">
            <p className="font-medium mb-2">Tài khoản dùng thử:</p>
            <div className="space-y-1">
              <p>Admin: <span className="font-mono text-zinc-900">admin@tennispro.vn</span> / <span className="font-mono text-zinc-900">admin123</span></p>
              <p>User: <span className="font-mono text-zinc-900">user@example.com</span> / <span className="font-mono text-zinc-900">user123</span></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
