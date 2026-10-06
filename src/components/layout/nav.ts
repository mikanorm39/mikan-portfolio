export const navItems = [
  { href: "/", label: "Top" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
