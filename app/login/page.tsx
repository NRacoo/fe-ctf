"use client"
import LoginScreen from "@/components/layout/auth/login";
import { useRouter } from "next/navigation";


export default function login(){
    const router = useRouter()
    const handleLogin = () => {
        router.push("/")
    }
    return (
       <LoginScreen onLogin={handleLogin}/>
    )
}