"use client";

import { Briefcase, Ghost } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { getSession, signOut } from "@/lib/auth/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutButton from "./sign-out-button";
import { useSession } from "@/lib/auth/auth-client";

export default function Navbar(){

    const {data: session} = useSession();

    return (
        <nav className="border-b border-gray-200">
            <div className="justify-between container mx-auto flex h-16 items-center px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
                    <Briefcase/>
                    Applyd
                </Link>
                {/* Links */}
                {session?.user 
                ? (<>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground">
                                Dashboard
                            </Button>
                        </Link>
                        <DropdownMenu>
                             <DropdownMenuTrigger render={
                                <Button variant="ghost" className="text-background relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-accent-foreground">
                                            {session.user.name?.[0]?.toUpperCase() ?? "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            }/>
                    
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-foreground">{session.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <SignOutButton/>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </>)
                : (<>
                    <div className="flex items-center gap-4">
                        <Link href="/sign-in" className="text-gray-700 hover:text-black">
                            <Button 
                            variant="ghost"
                            className="text-gray-700 hover:text-black">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/sign-up" className="text-gray-700 hover:text-black">
                            <Button
                            className="bg-primary hover:bg-primary/80">
                                Sign Up
                            </Button>
                        </Link>
                    
                    </div>
                </>)}
            </div>
        </nav>
    );
}