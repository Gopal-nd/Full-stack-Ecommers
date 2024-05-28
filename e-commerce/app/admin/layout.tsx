import Nav, { NavLink } from "@/components/Nav";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Nav>
        <NavLink href="/admin">Dashbord</NavLink>
        <NavLink href="/admin/users">Users</NavLink>
        <NavLink href="/admin/products">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </div>
  );
}
