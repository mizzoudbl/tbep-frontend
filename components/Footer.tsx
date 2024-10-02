import React from "react";
import { Button } from "./ui/button";

export default function Footer() {
    return (
        <footer className="bg-teal-800 text-white p-4 relative bottom-0">
        <div className="container mx-auto flex justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Drug Target Discovery Platform</p>
        </div>
        </footer>
    );
    }