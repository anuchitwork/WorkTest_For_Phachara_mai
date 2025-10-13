"use client";

import { useState,useContext , useEffect, useMemo } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { UserContext} from "../../../context/UserContext";
import {fetch_api_many_id} from "../../function/api_user";

export default function ButtonForTable() {

  const { users, setUsers } = useContext(UserContext)!;
  const { totalRows, setTotalRows } = useContext(UserContext)!;
  const {arrayOfpage, setArrayOfpage } = useContext(UserContext)!;
  const {takePid, setTakePid } = useContext(UserContext)!;

  const [visibleCount, setVisibleCount] = useState(5);
  const [page, setPage] = useState(0);
  // totalPages derived from totalRows and visibleCount
  const totalPages = Math.max(1, Math.ceil(totalRows / visibleCount));

  // ถ้า page เกินเมื่อ totalPages ลดให้ cap ลง
  useEffect(() => {
    if (page >= totalPages) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, page]);



  const handleNext = async () => {
    setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
    
      const maxId =
        users.length > 0
          ? Math.max(...users.map(u => Number(u.pid)))
          : 0;
        const arr = [maxId]
          console.log("arr:", arr);
        setArrayOfpage(arr);
        try {
              const users = await fetch_api_many_id(arr,"next",takePid); // รอผลลัพธ์ API
              setUsers(users.users); // อัพเดต context
              setTotalRows(users.totalCount); // อัพเดต totalRows ใน context
              
              console.log("handleChangeCount users on handleNext:", users);
            } catch (error) {
              console.error("Failed to fetch users on handleNext:", error);
            }
        };

    const handleBack = async () => {
      setPage((prev) => (prev > 0 ? prev - 1 : prev));

      const minId =
  users.length > 0
    ? Math.min(...users.map(u => Number(u.pid)))
    : 1; // ถ้าไม่มี users ให้เริ่มที่ 1
        // สร้าง array ลดลงจาก minId
      const arr = [minId]
      console.log("arr (decreasing):", arr); 
      setArrayOfpage(arr);
      try {
            const users = await fetch_api_many_id(arr,"back",takePid); // รอผลลัพธ์ API
            setUsers(users.users); // อัพเดต context
            setTotalRows(users.totalCount); // อัพเดต totalRows ใน context
            console.log("handleBack users on handleBack:", users);
          } catch (error) {
            console.error("Failed to fetch users on handleBack:", error);
          }
  };

  const handleChangeCount = async (
      eOrValue: React.ChangeEvent<HTMLSelectElement> | number
    ) => {
      // แปลงเป็น number
      const value =
        typeof eOrValue === "number" ? eOrValue : Number(eOrValue.target.value);
      
      // สร้าง array [1..value]
      const arr = !isNaN(value) && value > 0 ? Array.from({ length: value }, (_, i) => i + 1) : [];
      
      setVisibleCount(value);
      setPage(0);
      setArrayOfpage([0]);
      try {
        const users = await fetch_api_many_id([0],"next",value); // รอผลลัพธ์ API
        setTakePid(value);
         setUsers(users.users); // อัพเดต context
         setTotalRows(users.totalCount); // อัพเดต totalRows ใน context
         console.log("handleChangeCount users on handleChangeCount:", users);
      } catch (error) {
        console.error("Failed to fetch users on handleChangeCount:", error);
      }
    };

    useEffect(() => {
    handleChangeCount(3); // ใส่ค่า default เริ่มต้น เช่น 3
    setTakePid(3);
  }, []);



  return (
    <div className="p-2 border border-gray-300 rounded-lg shadow-md w-full  mx-auto flex items-center">
  {/* Dropdown */}
  <div className="flex  gap-2 ml-auto">
  <div className="flex items-center gap-2  ">
    <label className="font-medium">Row per page:</label>
    <select
      value={visibleCount}
      onChange={handleChangeCount}
      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {[ 3, 5, 10].map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  </div>

  {/* Status + Back/Next */}
  <div className="ml-auto flex items-center gap-4 ">
    <div className="text-gray-600">
      Page <span className="font-semibold">{page + 1}</span> of{" "}
      <span className="font-semibold">{totalPages}</span>
    </div>

    <div className="flex items-center gap-2">
  <button
    className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full transition disabled:opacity-50"
    onClick={handleBack}
    disabled={page === 0}
  >
    <HiArrowLeft className="w-5 h-5" />
  </button>

  <button
    className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full transition disabled:opacity-50"
    onClick={handleNext}
    disabled={page + 1 >= totalPages}
  >
    <HiArrowRight className="w-5 h-5" />
  </button>
</div>

  </div>
  </div>
</div>

  );
}
