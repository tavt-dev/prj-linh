import React, { useState } from 'react';
import { Search, Edit2, Trash2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useUserManagement, AdminUser } from '../../context/UserManagementContext';
import { UserModal } from '../../components/admin/UserModal';

export function AdminUsers() {
  const { users, addUser, updateUser, deleteUser } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.phone.includes(searchQuery);
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const handleSaveUser = (userData: Partial<AdminUser>) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      addUser({
        ...userData,
        id: Date.now().toString(),
        joinDate: new Date().toLocaleDateString('vi-VN'),
      } as AdminUser);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Quản lý người dùng</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
        >
          <UserIcon className="h-4 w-4" /> Thêm người dùng
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              className="w-full sm:w-auto px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Người dùng</th>
                <th className="px-6 py-4 font-semibold">Liên hệ</th>
                <th className="px-6 py-4 font-semibold">Vai trò</th>
                <th className="px-6 py-4 font-semibold">Ngày tham gia</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-900">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          user.name.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase()
                        )}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-900">{user.email}</span>
                      <span className="text-zinc-500 text-xs mt-0.5">{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.role === 'admin' ? (
                        <><ShieldCheck className="h-4 w-4 text-emerald-600" /> <span className="font-medium text-emerald-700">Quản trị viên</span></>
                      ) : (
                        <><UserIcon className="h-4 w-4 text-zinc-400" /> <span className="text-zinc-600">Người dùng</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingUser(user);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100" 
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                              deleteUser(user.id);
                            }
                          }}
                          className="p-2 text-zinc-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" 
                          title="Khóa/Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
          <span>Hiển thị {filteredUsers.length > 0 ? 1 : 0}-{filteredUsers.length} của {filteredUsers.length} người dùng</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-zinc-200 rounded-md hover:bg-zinc-100 disabled:opacity-50">Trước</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-md bg-zinc-900 text-white">1</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-md hover:bg-zinc-100 disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </div>
  );
}
