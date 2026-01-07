import { useState } from "react"
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { NavLink } from "react-router-dom"

export function SideNav() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      // h-screen + sticky top-0 ensures it stays fixed while scrolling
      // w-min ensures the container only takes the minimum width required by its children
      className={`h-screen sticky top-0 bg-[#f9faf7] border-r transition-all duration-300 ease-in-out flex flex-col z-50
        ${collapsed ? "w-16" : "w-min"}`}
    >
      {/* TOGGLE BUTTON */}
      <div className={`flex py-3 px-4 ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-green-100 text-slate-500 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* NAV ITEMS */}
      {/* whitespace-nowrap is key here to prevent text wrapping and force the parent w-min to expand */}
      <nav className="mt-4 space-y-2 px-2 flex flex-col">
        <NavItem
          to="/"
          icon={<LayoutDashboard size={20} />}
          label="Overview"
          collapsed={collapsed}
          end
        />

        <NavItem
          to="/dashboard/opex"
          icon={<TrendingUp size={20} />}
          label="OPEX"
          collapsed={collapsed}
        />

        <NavItem
          to="/dashboard/capex"
          icon={<Wallet size={20} />}
          label="CAPEX"
          collapsed={collapsed}
        />

        <NavItem
          to="/dashboard/adhoc"
          icon={<MoreHorizontal size={20} />}
          label="Ad Hoc"
          collapsed={collapsed}
        />
      </nav>
    </aside>
  )
}

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  end?: boolean
}

function NavItem({ to, icon, label, collapsed, end = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200
        ${
          isActive
            ? "bg-green-100 text-green-800"
            : "text-slate-600 hover:bg-green-50 hover:text-green-800"
        }`
      }
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap pr-4">
          {label}
        </span>
      )}
    </NavLink>
  )
}