import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../Users/Context/ContextPro";
import api from "../service/api";

const AdminUsers = () => {
  const { users, setUsers, triggerNotification } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const totalUsers = users.filter((u) => u.role !== "admin").length;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/User");
        setUsers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        triggerNotification("Failed to fetch users.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [setUsers]);

  
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch && user.role !== "admin";
  });

 
  const handleBlockUnblockUser = async (userId, currentStatus) => {
    const userToUpdate = users.find((u) => u.id === userId);
    if (!userToUpdate) return;

    const action = currentStatus ? "block" : "unblock";

    if (
      !window.confirm(
        `Are you sure you want to ${action} "${userToUpdate.name}"?`
      )
    ) {
      return;
    }

    try {
      await api.put(`/User/block-unblock/${userId}`);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isBlocked: !currentStatus } : u
        )
      );

      triggerNotification(
        `User "${userToUpdate.name}" ${action}ed successfully.`,
        "success"
      );

      
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, isBlocked: !currentStatus }));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      triggerNotification(`Failed to ${action} user.`, "error");
    }
  };

  
  const handleSoftDeleteUser = async (userId) => {
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return;

    if (
      !window.confirm(
        `Are you sure you want to soft-delete "${userToDelete.name}"?`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/User/${userId}`);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isDeleted: true, isBlocked: true } : u
        )
      );

      triggerNotification(
        `User "${userToDelete.name}" soft-deleted successfully.`,
        "success"
      );

      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, isDeleted: true }));
      }
    } catch (error) {
      console.error("Error soft-deleting user:", error);
      triggerNotification("Failed to delete user.", "error");
    }
  };

  
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

 
  const UserSkeleton = () => (
    <div className="animate-pulse">
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="border-b border-gray-200">
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </td>
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
              <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
              <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
            </div>
          </td>
        </tr>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-7xl mx-auto p-8">
       
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            User Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage user accounts, permissions, and access controls
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {
                    users.filter((u) => !u.isBlocked && u.role !== "admin")
                      .length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">
                  Blocked Users
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {users.filter((u) => u.isBlocked).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⛔</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Filtered</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {filteredUsers.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search users by email or name..."
                  className="pl-10 pr-4 py-4 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-0.5 rounded-xl">
                <div className="bg-white px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">
                    {filteredUsers.length} users
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-purple-600 to-blue-600">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <UserSkeleton />
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <p className="text-lg font-medium text-gray-900">
                          {user.email}
                        </p>
                        <p className="text-sm text-gray-500">Registered User</p>
                      </td>

                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                            user.isBlocked
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-green-100 text-green-700 border border-green-200"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              user.isBlocked ? "bg-red-500" : "bg-green-500"
                            }`}
                          ></span>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </button>

                          <button
                            onClick={() =>
                              handleBlockUnblockUser(user.id, user.isBlocked)
                            }
                            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${
                              user.isBlocked
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                : "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
                            }`}
                          >
                            {user.isBlocked ? (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Unblock
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                                Block
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center">
                      <div className="text-6xl mb-4">👥</div>
                      <p className="text-xl text-gray-500 font-semibold mb-2">
                        No users found
                      </p>
                      <p className="text-gray-400">
                        Try adjusting your search criteria
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">User Profile</h2>
                <button
                  onClick={() => setShowUserDetailsModal(false)}
                  className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center mt-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-purple-200">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-2">
                    Role
                  </label>
                  <p className="text-lg font-medium text-gray-900 capitalize">
                    {selectedUser.role}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-2">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedUser.isBlocked
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        selectedUser.isBlocked ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></span>
                    {selectedUser.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">
                  User ID
                </label>
                <p className="text-lg font-mono text-gray-900 bg-gray-50 p-3 rounded-xl">
                  {selectedUser.id}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowUserDetailsModal(false)}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
