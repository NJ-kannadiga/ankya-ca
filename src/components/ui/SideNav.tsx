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
  const [collapsed, setCollapsed] = useState(true)

  return (
    <aside
      className={`h-screen bg-[#f9faf7] border-l transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* TOGGLE BUTTON (INSIDE, LEFT EDGE) */}
      <div className="flex justify-start px-2 py-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-green-100"
        >
          {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* NAV ITEMS */}
      <nav className="mt-4 space-y-2 px-2">
        <NavItem
          to="/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Overview"
          collapsed={collapsed}
          end
        />

         <NavItem
          to="/dashboard/opex"
          icon={<TrendingUp size={18} />}
          label="OPEX"
          collapsed={collapsed}
        />

        <NavItem
          to="/dashboard/capex"
          icon={<Wallet size={18} />}
          label="CAPEX"
          collapsed={collapsed}
        />

        <NavItem
          to="/dashboard/adhoc"
          icon={<MoreHorizontal size={18} />}
          label="Ad Hoc"
          collapsed={collapsed}
        />
      </nav>
    </aside>
  )
}

function NavItem({
  to,
  icon,
  label,
  collapsed,
  end = false,
}: {
  to: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  end?: boolean
}) {
  return (
  <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition
        ${
          isActive
            ? "bg-green-100 text-green-800"
            : "text-slate-700 hover:bg-green-50 hover:text-green-800"
        }`
      }
    >
      {icon}
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap">
          {label}
        </span>
      )}
    </NavLink>
    
  )
}
