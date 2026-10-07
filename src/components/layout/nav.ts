/** ページの一覧。label はヘッダーのナビ、menuLabel はメニュー（☰）での表示名 */
export const navItems = [
  { href: "/", label: "Top", menuLabel: "Home" },
  { href: "/work", label: "Work", menuLabel: "Work" },
  { href: "/about", label: "About", menuLabel: "About" },
] as const;

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
