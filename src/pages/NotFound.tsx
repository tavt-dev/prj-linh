import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-28 pb-12 text-center">
      <h1 className="text-9xl font-black text-zinc-100">404</h1>
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mt-4 mb-2">Không tìm thấy trang</h2>
      <p className="text-zinc-500 max-w-md mx-auto mb-8">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tên đã bị thay đổi.
      </p>
      <Link to="/">
        <Button size="lg">
          Quay lại trang chủ
        </Button>
      </Link>
    </div>
  );
}
