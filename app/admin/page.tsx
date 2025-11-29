"use client"
import LoginScreenAdmin from "@/components/layout/auth/adminLogin";
import { useRouter } from "next/navigation";


export default function AdminPage(){
    const router = useRouter()
    const handleLoginAdmin = () => {
        router.push("/admin/dashboard")
    } 
    return (
        <div className="min-h-screen">
            <LoginScreenAdmin onLogin={handleLoginAdmin}/>
        </div>
    )
}