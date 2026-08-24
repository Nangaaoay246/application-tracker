"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function ImageTabs(){
    
    const [activeTab, setActiveTab] = useState("organize");

    return(
        <section>
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              {/* Tabs */}
              <div className="flex gap-2 justify-center mb-8">
                <Button
                onClick={() => setActiveTab("organize")}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors
                ${activeTab === "organize" 
                ? "bg-primary text-white" 
                : "bg-secondary text-gray-700 hover:bg-primary/20"}`}>
                Organize Applications
                </Button>
                <Button
                onClick={() => setActiveTab("hired")}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors
                ${activeTab === "hired" 
                ? "bg-primary text-white" 
                : "bg-secondary text-gray-700 hover:bg-primary/20"}`}>
                  Get Hired
                </Button>
                <Button
                onClick={() => setActiveTab("boards")}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors
                ${activeTab === "boards" 
                ? "bg-primary text-white" 
                : "bg-secondary text-gray-700 hover:bg-primary/20"}`}>
                  Manage Boards
                </Button>
              </div>
              {/* Images */}
              <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
                {activeTab === "organize" && (<Image 
                src="/hero-images/Hero1.png" 
                alt="Organize Application"
                width={1200}
                height={800}/>)}
                {activeTab === "hired" && (<Image 
                src="/hero-images/Hero2.png" 
                alt="Get Hired"
                width={1200}
                height={800}/>)}
                {activeTab === "boards" && (<Image 
                src="/hero-images/Hero3.png" 
                alt="Manage Boards"
                width={1200}
                height={800}/>)}
              </div>
            </div>
          </div>
        </section>
    );
}