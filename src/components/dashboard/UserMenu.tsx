"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { Logout01Icon, Settings02Icon, MoreVerticalIcon, Loading02Icon } from "hugeicons-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface UserMenuProps {
    user: User;
}

export function UserMenu({ user }: UserMenuProps) {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isSignOutLoading, setIsSignOutLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSignOut = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSignOutLoading(true);

        try {
            await signOut({
                callbackUrl: "/login",
            });
            toast({
                title: "Signed out successfully",
            });
        } catch {
            toast({
                title: "Error signing out",
                description: "Please try again.",
                variant: "destructive",
            });
            setIsSignOutLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full h-auto p-2 justify-start hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={user.image!} alt={user.name || "User"} />
                                <AvatarFallback className="bg-muted text-foreground">
                                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1 truncate text-left">
                                <span className="text-sm font-semibold text-foreground truncate">
                                    {user.name}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                </span>
                            </div>
                            <MoreVerticalIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" side="top" sideOffset={12}>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none text-foreground">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground truncate">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
                        <Settings02Icon className="mr-2 h-4 w-4 stroke-[1.5]" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                        onSelect={(e) => {
                            e.preventDefault();
                            setShowLogoutDialog(true);
                        }}
                    >
                        <Logout01Icon className="mr-2 h-4 w-4 stroke-[1.5]" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be signed out of Medio on this device.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSignOutLoading}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={handleSignOut}
                            disabled={isSignOutLoading}
                        >
                            {isSignOutLoading && <Loading02Icon className="mr-2 h-4 w-4 animate-spin stroke-[1.5]" />}
                            Log out
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
