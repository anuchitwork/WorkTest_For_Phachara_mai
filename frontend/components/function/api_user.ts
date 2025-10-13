"use client";

import { useState, useCallback } from "react";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE;

interface CallApiOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

// generic T สำหรับ type ของ data
export function useUserApi<T = any>() {



  const apiBase = process.env.NEXT_PUBLIC_API_BASE;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | any | null>(null); // รองรับทุกชนิด
  const [error, setError] = useState<Error | null>(null);

  const callApi = useCallback(async ({ url , method = "GET", body = null, headers = {} }: CallApiOptions) => {
    setLoading(true);
    setError(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      };

      if (body && ["POST", "PUT", "PATCH"].includes(method)) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // ตรวจสอบ Content-Type ก่อน parse
      const contentType = response.headers.get("content-type");
      let result: any;

      if (contentType?.includes("application/json")) {
        result = await response.json();
      } else {
        // ถ้าไม่ใช่ JSON เอามาเป็น text เลย
        result = await response.text();
      }

      setData(result); // เก็บอะไรก็ได้ที่ได้จาก backend
      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Something went wrong"));
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, callApi };
}



export async function fetch_api_many_id(ids: number[],type:string,takePid:number=3) {



  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://back-worktest-for-phachara-mai.onrender.com";
  // แปลง array [4,5] -> "4%2C5"
  const idString = encodeURIComponent(ids.join(','));
  
  const url = `${apiBase}/users/many/${idString}?type=${type}&take=${takePid}`;
  console.log("Fetching from URL:", url);
  try {
    const res = await fetch(url, {
      method: 'GET', // ถ้า API ใช้ GET
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Fetched users:", data);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

// console.log(fetch_api_many_id([5,6,7,8,9,10]));