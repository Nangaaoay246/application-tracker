"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";
import { signUp } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";


export default function SignUp(){

    // Inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Error & Loading State
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Router
    const router = useRouter();

    // Submit Function
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        setError("");
        setLoading(true);

        try{
            const result = await signUp.email({
                name,
                email,
                password,
            });

            if (result.error){
                setError(result.error.message ?? "Failed to Sign Up")
            } else {
                router.push("/dashboard");
            }
        } catch (err){
            setError("An Unexpected Error Occured");
        } finally {
            setLoading(false);
        }
    }
 
    return(
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                {/* Header */}
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Create an Account to Start Tracking Your Applications
                    </CardDescription>
                </CardHeader>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        { error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-muted-foreground">
                                Name
                            </Label>
                            <Input 
                            id="name" 
                            type="text" 
                            placeholder="Juan Dela Cruz"
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                            required
                            className="border-gray-300 focus:border-primary focus:ring-primary"/>
                        </div>
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-muted-foreground">
                                Email
                            </Label>
                            <Input 
                            id="email" 
                            type="email" 
                            placeholder="juandelacruz@gmail.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                            className="border-gray-300 focus:border-primary focus:ring-primary"/>
                        </div>
                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-muted-foreground">
                                Password
                            </Label>
                            <Input 
                            id="password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            minLength={8}
                            className="border-gray-300 focus:border-primary focus:ring-primary"/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button 
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={loading}>
                            {loading? "Creating Account..." : "Sign Up"}
                        </Button>
                        <p className="text-center text-sm text-gray-600">
                            Already Have an Account? {" "}
                            <Link href="/sign-in" className="font-medium text-primary hover:underline">
                                Sign In.
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}