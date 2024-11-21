"use client"

import { cookies } from "next/headers"

export function login() {
  document.cookie = "authenticated=true; path=/"
}

export function logout() {
  document.cookie = "authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}
