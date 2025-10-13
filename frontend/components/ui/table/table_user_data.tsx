"use client";

import { useState,useEffect } from "react";
import { HiTrash, HiPencil, HiCheck, HiX } from "react-icons/hi";
import Button_for_table from "./button_for_table";
import { UserContext } from "../../../context/UserContext";
import { useContext } from "react";
import { fetch_api_many_id } from "../../function/api_user";
import { ApiError } from "next/dist/server/api-utils";


type User = {
  id: number;
  firstname: string;
  lastname: string;
  birthday: string;
  email: string;
  phone: string;
  uuid?: string;
};



export default function Table_user_data() {
    const [loading, setLoading] = useState(false);
    const context = useContext(UserContext);

    if (!context) return null; // ป้องกัน undefined

    const { users, setUsers } = context; // ✅ ใช้ object destructure
    const { totalRows, setTotalRows } = useContext(UserContext)!;
    const {arrayOfpage, setArrayOfpage } = useContext(UserContext)!;

    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<User>>({});
    const [rowsPerPage, setRowsPerPage] = useState(5); // ✅ rows per page

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditFormData({ ...user }); // เตรียมค่าปัจจุบันไว้แก้
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof User) => {
    setEditFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // console.log( "handleChangRow",editFormData)
  };

  const handleSave = async(id: number) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://back-worktest-for-phachara-mai.onrender.com";
    const res = await fetch(`${apiBase}/users/${id}`, {
    method: "PATCH",
    headers: {
      "accept": "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editFormData),
  });

  // ถ้าอยากดูว่า response เป็นอะไร
  const data = await res.json();
  console.log("Response from server handleSave:", data);  
  const updatedUsers = await fetch_api_many_id(arrayOfpage,"next");
  // console.log("updatedUsers:", updatedUsers);
  setEditingUserId(null);
  setUsers(updatedUsers.users);
  
  };

  const handleCancel = () => {
    
    setEditingUserId(null);
    setEditFormData({});
  };

  const handleDelete = async(id: number) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://back-worktest-for-phachara-mai.onrender.com";
    const res = await fetch(`${apiBase}/users/${id}`, {
    method: "DELETE",
    headers: {
      "accept": "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editFormData),
  });
    const updatedUsers = await fetch_api_many_id(arrayOfpage,"next");
    setUsers(updatedUsers.users);
    setEditingUserId(null);
  };



  return (
    <div className="p-4 space-y-6">


      <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 w-3/4 mx-auto">
        <table className="min-w-full border-collapse ">
          <thead>
            <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left w-[15%]">Firstname</th>
                <th className="p-3 text-left w-[15%]">Lastname</th>
                <th className="p-3 text-left w-[15%]">Birthday</th>
                <th className="p-3 text-left w-[25%]">Email</th>
                <th className="p-3 text-left w-[20%]">Phone</th>
                <th className="p-3 text-center w-[10%]">Actions</th>
            </tr>
            </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors`}
              >
                {["firstname", "lastname", "birthday", "email", "phone"].map((field) => (
                  <td key={field} className="p-3 text-left">
                    {editingUserId === user.id ? (
                      <input
                        type={field === "birthday" ? "date" : "text"}
                        value={(editFormData as any)[field] || ""}
                        onChange={(e) =>
                          handleEditChange(e, field as keyof User)
                        }
                        className="border border-gray-300 rounded-md p-1 w-full"
                      />
                    ) : (
                      (user as any)[field]
                    )}
                  </td>
                ))}

                <td className="p-3 text-center">
                  {editingUserId === user.id ? (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleSave(user.id)}>
                        <HiCheck className="text-green-600 w-5 h-5" />
                      </button>
                      <button onClick={handleCancel}>
                        <HiX className="text-gray-500 w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditClick(user)}>
                        <HiPencil className="text-blue-500 w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(user.id)}>
                        <HiTrash className="text-red-500 w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <Button_for_table/>
        </div>
      </div>
    </div>
  );
}
