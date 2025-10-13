"use client";


import { createContext, useState, ReactNode, useEffect } from "react";

// type ของ User ตามที่ใช้จริง
type User = {
  id: number;
  firstname: string;
  lastname: string;
  birthday: string;
  email: string;
  phone: string;
  pid: number;
};

// type ของ context
type UserContextType = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  totalRows: number;
  setTotalRows: React.Dispatch<React.SetStateAction<number>>;
  arrayOfpage: number[];
  setArrayOfpage: React.Dispatch<React.SetStateAction<number[]>>;
  takePid: number;
  setTakePid: React.Dispatch<React.SetStateAction<number>>;
};


// สร้าง context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// สร้าง provider
export function UserProvider({ children }: { children: ReactNode }) {

  

    const mock_data_test: User[] = [
      // { id: 1, firstname: "สมชาย", lastname: "ใจดี", birthday: "1999-01-01", email: "test1@gmail.com", phone: "0900000001"},
      // { id: 2, firstname: "ฟหกฟฟ", lastname: "ฟหกฟหก", birthday: "2025-10-22", email: "AA@gmail.com", phone: "649194616464"},
      // { id: 3, firstname: "A", lastname: "B", birthday: "2000-01-01", email: "a@b.com", phone: "0123456789" },
      // { id: 4, firstname: "C", lastname: "D", birthday: "2001-02-02", email: "c@d.com", phone: "0123456789" },
      // { id: 5, firstname: "E", lastname: "F", birthday: "2002-03-03", email: "e@f.com", phone: "0123456789" },
      // { id: 6, firstname: "G", lastname: "H", birthday: "2003-04-04", email: "g@h.com", phone: "0123456789" },
    ];

  const [users, setUsers] = useState<User[]>(mock_data_test);
  const [totalRows, setTotalRows] = useState(3);
  const [arrayOfpage, setArrayOfpage] = useState([1,2,3]);
  const [takePid, setTakePid] = useState(3);

  useEffect(() => {
    console.log("UserContext update = ", users, totalRows, arrayOfpage);
  }, [users, totalRows, arrayOfpage]);
    
  return (
    <UserContext.Provider value={{ users, setUsers, totalRows, setTotalRows, arrayOfpage, setArrayOfpage, takePid, setTakePid }}>
      {children}
    </UserContext.Provider>
  );
}
