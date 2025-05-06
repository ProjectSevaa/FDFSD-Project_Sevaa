"use client";

import { useEffect, useState } from "react";
import {
    Shield,
    Users,
    UserCheck,
    UserX,
    RefreshCcw,
    Search,
    UserCog,
    Activity,
    FileText,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { BASE_URL } from "@/constants";

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

type LogEntry = {
    timestamp: string;
    method: string;
    path: string;
    status: number;
    responseTime: string;
};

// Fixed type for LogData to match the expected structure
type LogData = {
    [key: string]: string[];
};

type DonorDetails = {
    username: string;
    email: string;
    mobileNumber: string;
    address: {
        doorNo: string;
        street: string;
        landmarks?: string;
        townCity: string;
        state: string;
        pincode: string;
    };
    donationsCount: number;
    rating: number;
};

export function AdminDashboard() {
    const [adminData, setAdminData] = useState<AdminData | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [logs, setLogs] = useState<LogData>({});
    const [selectedLogType, setSelectedLogType] = useState("all");
    const [logTimeframe, setLogTimeframe] = useState("24");
    const [logTypes, setLogTypes] = useState<string[]>([]);
    const [selectedDonor, setSelectedDonor] = useState<DonorDetails | null>(
        null
    );
    const [isDonorDialogOpen, setIsDonorDialogOpen] = useState(false);

    useEffect(() => {
        fetchAdminData();
        fetchLogTypes();
        fetchLogs();
    }, []);

    useEffect(() => {
        console.log("Fetching logs with type:", selectedLogType, "timeframe:", logTimeframe);
        fetchLogs();
    }, [selectedLogType, logTimeframe]);

    async function fetchAdminData() {
        try {
            const [
                dashboardResponse,
                moderatorsResponse,
                adminsResponse,
                donorsResponse,
            ] = await Promise.all([
                fetch(`${BASE_URL}/admin/admin_dashboard`, {
                    credentials: "include",
                }),
                fetch(`${BASE_URL}/admin/getModerators`, {
                    credentials: "include",
                }),
                fetch(`${BASE_URL}/admin/getAdmins`, {
                    credentials: "include",
                }),
                fetch(`${BASE_URL}/admin/getDonors`, {
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

    async function fetchLogs() {
        try {
            console.log("Fetching logs from:", `${BASE_URL}/admin/logs?type=${selectedLogType}&username=all&hours=${logTimeframe}`);
            const response = await fetch(
                `${BASE_URL}/admin/logs?type=${selectedLogType}&username=all&hours=${logTimeframe}`,
                { credentials: "include" }
            );
            if (!response.ok) throw new Error("Failed to fetch logs");
            const data = await response.json();
            console.log("Received logs data:", data);
            setLogs(data.logs || {}); // Ensure logs is always an object
        } catch (error) {
            console.error("Error fetching logs:", error);
            toast({
                title: "Error",
                description: "Failed to fetch logs",
                variant: "destructive",
            });
        }
    }

    async function fetchLogTypes() {
        try {
            console.log("Fetching log types...");
            const response = await fetch(`${BASE_URL}/admin/log-types`, {
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch log types");
            const data = await response.json();
            console.log("Received log types:", data);
            setLogTypes(data.types || []);
        } catch (error) {
            console.error("Error fetching log types:", error);
            toast({
                title: "Error",
                description: "Failed to fetch log types",
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
                ? `${BASE_URL}/donor/toggleBan/${userId}`
                : `${BASE_URL}/admin/toggleBan/${userId}`;

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
                description: `User ${
                    shouldBan ? "banned" : "unbanned"
                } successfully.`,
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
                `${BASE_URL}/admin/changeRole/${userId}`,
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

    async function fetchDonorDetails(username: string) {
        try {
            const response = await fetch(
                `${BASE_URL}/admin/donor/${username}`,
                { credentials: "include" }
            );
            if (!response.ok) throw new Error("Failed to fetch donor details");
            const data = await response.json();
            setSelectedDonor(data.donor);
            setIsDonorDialogOpen(true);
        } catch (error) {
            console.error("Error fetching donor details:", error);
            toast({
                title: "Error",
                description: "Failed to fetch donor details",
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
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">
                        <UserCog className="mr-2 h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="users">
                        <Users className="mr-2 h-4 w-4" />
                        User Management
                    </TabsTrigger>
                    <TabsTrigger value="logs">
                        <Activity className="mr-2 h-4 w-4" />
                        System Logs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-3xl">
                                Welcome, {adminData.mod.username}
                            </CardTitle>
                            <CardDescription>
                                Role: {adminData.mod.role}
                            </CardDescription>
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
                                    icon={
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    }
                                />
                                <DashboardCard
                                    title="Moderators"
                                    value={adminData.moderators.length}
                                    icon={
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                    }
                                />
                                <DashboardCard
                                    title="Admins"
                                    value={adminData.admins.length}
                                    icon={
                                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                                    }
                                />
                                <DashboardCard
                                    title="Donors"
                                    value={adminData.donors.length}
                                    icon={
                                        <UserX className="h-4 w-4 text-muted-foreground" />
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>
                                Search and manage user accounts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="search">Search Users</Label>
                                    <Input
                                        id="search"
                                        placeholder="Enter username"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <Button className="mt-8" variant="secondary">
                                    <Search className="mr-2 h-4 w-4" />
                                    Search
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {adminData.mod.role === "superuser" && (
                        <UserListCard
                            title="Moderators"
                            description="Manage moderator accounts and permissions"
                            users={adminData.moderators.filter((user) =>
                                user.username
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
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
                                user.username
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            )}
                            onToggleBan={toggleBan}
                            onChangeRole={changeRole}
                        />
                    )}

                    <UserListCard
                        title="Donors"
                        description="Manage donor accounts"
                        users={adminData.donors.filter((user) =>
                            user.username
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                        )}
                        onToggleBan={toggleBan}
                        onChangeRole={changeRole}
                        isDonorList
                        onDonorClick={fetchDonorDetails}
                    />
                </TabsContent>

                <TabsContent value="logs">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Logs</CardTitle>
                            <CardDescription>
                                View and analyze system activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-4 mb-4">
                                <Select
                                    value={selectedLogType}
                                    onValueChange={setSelectedLogType}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select log type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {logTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={logTimeframe}
                                    onValueChange={setLogTimeframe}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select timeframe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6">
                                            Last 6 hours
                                        </SelectItem>
                                        <SelectItem value="12">
                                            Last 12 hours
                                        </SelectItem>
                                        <SelectItem value="24">
                                            Last 24 hours
                                        </SelectItem>
                                        <SelectItem value="48">
                                            Last 48 hours
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button onClick={fetchLogs}>
                                    <RefreshCcw className="mr-2 h-4 w-4" />
                                    Refresh Logs
                                </Button>
                            </div>

                            <ScrollArea className="h-[600px] rounded-md border p-4">
                                {Object.entries(logs).map(
                                    ([username, entries]) => (
                                        <div key={username} className="mb-6">
                                            <h4 className="font-semibold mb-2 flex items-center">
                                                <FileText className="mr-2 h-4 w-4" />
                                                {username}
                                            </h4>
                                            <div className="space-y-2">
                                                {entries.map((entry, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-sm bg-muted p-2 rounded"
                                                    >
                                                        <code>{entry}</code>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog
                open={isDonorDialogOpen}
                onOpenChange={setIsDonorDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-center">
                            Donor Details
                        </DialogTitle>
                        <DialogDescription>
                            {selectedDonor ? (
                                <div className="space-y-6 p-4 rounded-md shadow-md">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="w-16 h-16">
                                            <AvatarImage
                                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedDonor.username}`}
                                            />
                                            <AvatarFallback>
                                                {selectedDonor.username
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-lg font-semibold">
                                                {selectedDonor.username}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedDonor.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Mobile Number
                                            </p>
                                            <p className="text-base">
                                                {selectedDonor.mobileNumber}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Donations Count
                                            </p>
                                            <p className="text-base">
                                                {selectedDonor.donationsCount}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Rating
                                            </p>
                                            <p className="text-base">
                                                {selectedDonor.rating} / 5
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Address
                                            </p>
                                            <p className="text-base">
                                                {`${
                                                    selectedDonor.address.doorNo
                                                }, ${
                                                    selectedDonor.address.street
                                                }, ${
                                                    selectedDonor.address
                                                        .landmarks || ""
                                                }, ${
                                                    selectedDonor.address
                                                        .townCity
                                                }, ${
                                                    selectedDonor.address.state
                                                }, ${
                                                    selectedDonor.address
                                                        .pincode
                                                }`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-32">
                                    <p className="text-sm text-muted-foreground">
                                        Loading donor details...
                                    </p>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function DashboardCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: JSX.Element;
}) {
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
    onDonorClick,
}: {
    title: string;
    description: string;
    users: User[];
    onToggleBan: (userId: string, shouldBan: boolean, isDonor: boolean) => void;
    onChangeRole: (userId: string, newRole: string) => void;
    isDonorList?: boolean;
    onDonorClick?: (username: string) => void;
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
                            <div
                                className="flex items-center space-x-4 cursor-pointer"
                                onClick={() =>
                                    isDonorList && onDonorClick?.(user.username)
                                }
                            >
                                <Avatar>
                                    <AvatarImage
                                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                                    />
                                    <AvatarFallback>
                                        {user.username
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {user.username}
                                    </p>
                                    {!isDonorList && (
                                        <p className="text-sm text-muted-foreground">
                                            Role: {user.role}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant={
                                        user.isBanned
                                            ? "destructive"
                                            : "outline"
                                    }
                                >
                                    {user.isBanned ? "Banned" : "Active"}
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        onToggleBan(
                                            user._id,
                                            !user.isBanned,
                                            isDonorList
                                        )
                                    }
                                >
                                    {user.isBanned ? "Unban" : "Ban"}
                                </Button>
                                {!isDonorList && (
                                    <Select
                                        defaultValue={user.role}
                                        onValueChange={(newRole) =>
                                            onChangeRole(user._id, newRole)
                                        }
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="moderator">
                                                Moderator
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                            <SelectItem value="superuser">
                                                Superuser
                                            </SelectItem>
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
