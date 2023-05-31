"use server";
import { cookies } from "next/headers";

export async function setCookieToken(token: string) {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
  });
}

export async function getCookie(name: string) {
  const cookieStore = cookies();
  const cookieVal = cookieStore.get(name);
  return cookieVal;
}
