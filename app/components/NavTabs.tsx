"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Camera, Clock, Calendar } from "lucide-react";

const tabs = [
	{ name: "Welcome", href: "/welcome", icon: <User className="h-5 w-5" /> },
	{
		name: "Register Attendance",
		href: "/register-attendance",
		icon: <Camera className="h-5 w-5" />,
	},
	{ name: "Periods", href: "/periods", icon: <Clock className="h-5 w-5" /> },
	{ name: "Your Data", href: "/your-data", icon: <Calendar className="h-5 w-5" /> },
];

export default function NavTabs() {
	const pathname = usePathname();
	return (
		<nav className="flex gap-2 mb-8 border-b-4 border-indigo-300 bg-transparent shadow-lg backdrop-blur-xl glass-panel">
			{tabs.map(tab => {
				const isActive = pathname === tab.href;
				return (
					<Link
						key={tab.href}
						href={tab.href}
						className={`flex items-center gap-2 px-6 py-3 font-semibold text-lg rounded-t-xl transition border-b-4 duration-200 glass-panel ${
							isActive
								? "border-indigo-600 text-indigo-800 bg-white/40 shadow-md backdrop-blur-xl"
								: "border-transparent text-gray-500 hover:text-indigo-500 hover:bg-white/20 backdrop-blur-xl"
						}`}
						aria-current={isActive ? "page" : undefined}
					>
						{tab.icon}
						{tab.name}
					</Link>
				);
			})}
		</nav>
	);
}