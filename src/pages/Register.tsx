import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useUserManagement } from '../context/UserManagementContext';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();
  const { addUser } = useUserManagement();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Mật khẩu không khớp', 'error');
      return;
    }

    const newUser = register({ name, email, password });
    if (!newUser) {
      addToast('Email đã được sử dụng', 'error');
      return;
    }

    addUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: 'Hoạt động',
      joinDate: new Date().toLocaleDateString('vi-VN'),
    });
    addToast('Đăng ký thành công', 'success');
    navigate('/');
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-zinc-900 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              label="Họ và tên"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên"
            />
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
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận lại mật khẩu"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Đăng ký
          </Button>
        </form>
      </div>
    </div>
  );
}
