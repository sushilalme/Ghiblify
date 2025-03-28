"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RefreshCw, Download, ExternalLink } from "lucide-react"

interface User {
  _id: string
  emailAddress: string
  upiId: string
  img: string
  status: "Pending" | "Processed" | "Rejected"
  createdAt: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ghibli-admin/users")
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
    setLoading(false)
  }

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/ghibli-admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      })
      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/ghibli-admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        fetchUsers()
      } else {
        alert("Incorrect password")
        setPassword("")
      }
    } catch (error) {
      console.error("Authentication failed:", error)
      alert("Authentication error")
    }
  }

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl) // Clean up
    } catch (error) {
      console.error("Failed to download image:", error)
    }
  }

  // Password authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900">Admin Login</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input 
              type="password" 
              placeholder="Enter admin password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Main admin dashboard (rest of the previous code remains the same)
  const groupedUsers = users.reduce((acc, user) => {
    const status = user.status
    if (!acc[status]) acc[status] = []
    acc[status].push(user)
    return acc
  }, {} as Record<string, User[]>)

  const statusOrder = ["Pending", "Processed", "Rejected"]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button onClick={fetchUsers} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </Button>
          </div>
        </div>

        {statusOrder.map((status) => (
          <div key={status} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {status} ({groupedUsers[status]?.length || 0})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedUsers[status]?.map((user) => (
                <Card key={user._id} className="p-4 space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={user.img}
                      alt="User image"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Email: {user.emailAddress}</p>
                    <p className="text-sm text-gray-500">UPI ID: {user.upiId}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={user.status}
                      onValueChange={(value) => updateUserStatus(user._id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processed">Processed</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => window.open(user.img, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => downloadImage(user.img, `ghibli-image-${user._id}.jpg`)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}