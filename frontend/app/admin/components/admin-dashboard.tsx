"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Users,
  UserCheck,
  UserX,
  RefreshCcw,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type User = {
  _id: string;
  username: string;
  role: string;
  isBanned: boolean;
};

type AdminData = {
  mod: {
    username: string;
    role: string;
  };
  moderators: User[];
  admins: User[];
  donors: User[];
};

export function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    try {
      const [
        dashboardResponse,
        moderatorsResponse,
        adminsResponse,
        donorsResponse,
      ] = await Promise.all([
        fetch("http://localhost:9500/admin/admin_dashboard", {
          credentials: "include",
        }),
        fetch("http://localhost:9500/admin/getModerators", {
          credentials: "include",
        }),
        fetch("http://localhost:9500/admin/getAdmins", {
          credentials: "include",
        }),
        fetch("http://localhost:9500/admin/getDonors", {
          credentials: "include",
        }),
      ]);

      if (
        !dashboardResponse.ok ||
        !moderatorsResponse.ok ||
        !adminsResponse.ok ||
        !donorsResponse.ok
      ) {
        throw new Error("Failed to fetch admin data");
      }

      const dashboardData = await dashboardResponse.json();
      const moderatorsData = await moderatorsResponse.json();
      const adminsData = await adminsResponse.json();
      const donorsData = await donorsResponse.json();

      setAdminData({
        mod: dashboardData.mod,
        moderators: moderatorsData.moderators,
        admins: adminsData.admins,
        donors: donorsData.donors,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function toggleBan(
    userId: string,
    shouldBan: boolean,
    isDonor: boolean = false
  ) {
    try {
      const url = isDonor
        ? `http://localhost:9500/donor/toggleBan/${userId}`
        : `http://localhost:9500/admin/toggleBan/${userId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBanned: shouldBan }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle ban status");
      }

      await fetchAdminData();
      toast({
        title: "Success",
        description: `User ${shouldBan ? "banned" : "unbanned"} successfully.`,
      });
    } catch (error) {
      console.error("Error toggling ban status:", error);
      toast({
        title: "Error",
        description: "Failed to update ban status. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function changeRole(userId: string, newRole: string) {
    try {
      const response = await fetch(
        `http://localhost:9500/admin/changeRole/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change role");
      }

      await fetchAdminData();
      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (!adminData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl">
            Welcome, {adminData.mod.username}
          </CardTitle>
          <CardDescription>Role: {adminData.mod.role}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Total Users"
              value={
                adminData.moderators.length +
                adminData.admins.length +
                adminData.donors.length
              }
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard
              title="Moderators"
              value={adminData.moderators.length}
              icon={<Shield className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard
              title="Admins"
              value={adminData.admins.length}
              icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard
              title="Donors"
              value={adminData.donors.length}
              icon={<UserX className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Search and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="search">Search Users</Label>
              <Input
                id="search"
                placeholder="Enter username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="mt-8" variant="secondary">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {adminData.mod.role === "superuser" && (
        <UserListCard
          title="Moderators"
          description="Manage moderator accounts and permissions"
          users={adminData.moderators.filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onToggleBan={toggleBan}
          onChangeRole={changeRole}
        />
      )}

      {(adminData.mod.role === "superuser" ||
        adminData.mod.role === "moderator") && (
        <UserListCard
          title="Admins"
          description="Manage admin accounts and permissions"
          users={adminData.admins.filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onToggleBan={toggleBan}
          onChangeRole={changeRole}
        />
      )}

      <UserListCard
        title="Donors"
        description="Manage donor accounts"
        users={adminData.donors.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        onToggleBan={toggleBan}
        onChangeRole={changeRole}
        isDonorList
      />

      <Card>
        <CardContent className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={fetchAdminData}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
          <Button variant="destructive" asChild>
            <a href="/admin/admin_login">Logout</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function UserListCard({
  title,
  description,
  users,
  onToggleBan,
  onChangeRole,
  isDonorList = false,
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                  />
                  <AvatarFallback>
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.username}</p>
                  {!isDonorList && (
                    <p className="text-sm text-muted-foreground">
                      Role: {user.role}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={user.isBanned ? "destructive" : "outline"}>
                  {user.isBanned ? "Banned" : "Active"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onToggleBan(user._id, !user.isBanned, isDonorList)
                  }
                >
                  {user.isBanned ? "Unban" : "Ban"}
                </Button>
                {!isDonorList && (
                  <Select
                    defaultValue={user.role}
                    onValueChange={(newRole) => onChangeRole(user._id, newRole)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superuser">Superuser</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
