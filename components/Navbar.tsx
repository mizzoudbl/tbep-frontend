import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Menu, HelpCircle, Info, MessageCircle, Download } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <header className="bg-teal-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Target Discovery Platform</h1>
          <nav className="hidden md:flex space-x-4">
            <Button variant="ghost" className="hover:bg-teal-700">Help</Button>
            <Button variant="ghost" className="hover:bg-teal-700">About</Button>
            <Button variant="ghost" className="hover:bg-teal-700">FAQ</Button>
            <Button variant="ghost" className="hover:bg-teal-700">Contact</Button>
            <Button variant="ghost" className="hover:bg-teal-700">Download</Button>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Info className="mr-2 h-4 w-4" />
                <span>About</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>FAQ</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Contact</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
  );
}
