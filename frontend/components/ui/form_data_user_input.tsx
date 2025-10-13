"use client";

import { useState, useEffect } from "react";
import { useUserApi } from "../function/api_user";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { fetch_api_many_id } from "../function/api_user";
import Table_user_data from "../ui/table/table_user_data";
// กำหนด type ของ form
interface FormField {
  value: string;
  type: string;
}

interface FormData {
  firstname: FormField;
  lastname: FormField;
  birthday: FormField;
  email: FormField;
  phone: FormField;
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FormDataUserInput() {
  const [formData, setFormData] = useState<FormData>({
    firstname: { value: "", type: "text" },
    lastname: { value: "", type: "text" },
    birthday: { value: "", type: "date" },
    email: { value: "", type: "email" },
    phone: { value: "", type: "text" },
  });

    const context = useContext(UserContext);
    if (!context) return null; // ป้องกัน undefined
    const { users, setUsers } = context; // ✅ ใช้ object destructure
    const { totalRows, setTotalRows } = useContext(UserContext)!;
    const {arrayOfpage, setArrayOfpage } = useContext(UserContext)!;
    const {takePid, setTakePid } = useContext(UserContext)!;
  const [submitted, setSubmitted] = useState(false);

  const { data, loading, error, callApi } = useUserApi<any[]>();

  // ยิง API ตอน mount
  // useEffect(() => {
  //   callApi({ url: `${apiUrl}/users`, method: "GET" });
  // }, [callApi]);

  // const handleRefresh = () => {
  //   callApi({ url: `${apiUrl}/users`, method: "GET" });
  // };

  // ฟังก์ชันอัปเดตค่าในแต่ละช่อง
  const handleChange = (key: keyof FormData, newValue: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: { ...prev[key], value: newValue },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const isValid = Object.values(formData).every(
      (field) => field.value.trim() !== ""
    );

    if (!isValid) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // แปลงข้อมูลเป็น object ธรรมดา
    const formattedData: Record<string, string> = Object.fromEntries(
      Object.entries(formData).map(([key, obj]) => [key, obj.value])
    );

    console.log("ข้อมูลที่ส่ง:", formattedData);

    // ส่งข้อมูลไป API
    await callApi({
      url: `${apiUrl}/users`,
      method: "POST",
      body: formattedData,
    });


    const updatedUsers = await fetch_api_many_id(arrayOfpage,"next",takePid);
    setUsers(updatedUsers.users);
    // alert("ส่งข้อมูลสำเร็จ ✅ ดูใน console ได้เลย");
  };

  return (
    <>
    <div className="p-4 border max-w-[500px] mx-auto rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {(Object.keys(formData) as (keyof FormData)[]).map((key) => {
          const field = formData[key];
          const isError = submitted && !field.value.trim();

          return (
            <div key={key}>
              <label className="block mb-1 font-medium capitalize">
                {key}
                <span className="text-red-500">*</span>
              </label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`w-full border px-3 py-2 rounded-md outline-none ${
                  isError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={`กรอก${key}`}
              />
              {isError && (
                <p className="text-sm text-red-500 mt-1">
                  Require
                </p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          className="w-full bg-cyan-400 text-white py-2 rounded-md hover:bg-blue-700"
        >
          SUBMIT
        </button>
      </form>

      {/* <div className="mt-6">
        <button
          onClick={handleRefresh}
          className="bg-green-400 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Refresh Data
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {data && (
          <pre className="mt-2 bg-gray-100 p-2 rounded-md overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div> */}
      
    </div>
    <Table_user_data/>
    </>
  );
}
