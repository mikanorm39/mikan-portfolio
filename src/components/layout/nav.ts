/**
 * ページの一覧。label はヘッダーのナビ、menuLabel はメニュー（☰）での表示名。
 * ink は選択中・カーソルに出すインクの色（globals.css の --ink-○○）。
 */
export const navItems = [
  { href: "/", label: "Home", menuLabel: "Home", ink: "yellow" },
  { href: "/work", label: "Work", menuLabel: "Work", ink: "pink" },
  { href: "/about", label: "About", menuLabel: "About", ink: "mint" },
] as const;

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
