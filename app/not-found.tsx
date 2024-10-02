import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center flex-col">
      <Image src="/image/404.png" alt="404" width={500} height={500} />
      <Link href="/" className={buttonVariants({variant: "default", className: ""})}>
            Back to home
      </Link>
    </div>
  );
}
