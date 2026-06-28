import {
  LayoutDashboard,
  Library,
  PenLine,
  MessageSquare,
  Sparkles,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** 모바일 하단 네비게이션에 표시할지 여부 */
  inBottomNav?: boolean;
}

/**
 * 전역 네비게이션 항목 (wireframes.md 공통 레이아웃 기준)
 * - 사이드바(데스크탑): 전체 노출
 * - 하단 네비(모바일): inBottomNav === true 인 항목만
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard, inBottomNav: true },
  { label: "내 서재", href: "/library", icon: Library, inBottomNav: true },
  { label: "기록하기", href: "/reading-log/new", icon: PenLine, inBottomNav: true },
  { label: "리뷰", href: "/reviews", icon: MessageSquare, inBottomNav: true },
  { label: "추천", href: "/recommendations", icon: Sparkles },
  { label: "가족", href: "/family", icon: Users, inBottomNav: true },
  { label: "설정", href: "/settings", icon: Settings },
];

export const BOTTOM_NAV_ITEMS = NAV_ITEMS.filter((item) => item.inBottomNav);
