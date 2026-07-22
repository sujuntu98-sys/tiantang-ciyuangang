"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * 页面过渡模板
 * 每次路由切换时触发入场动画，实现丝滑的页面跳转体验
 */
export default function PageTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      // 路由变化，先隐藏再显示触发动画
      setIsVisible(false);
      const timer = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      prevPathname.current = pathname;
      return () => cancelAnimationFrame(timer);
    } else {
      // 首次加载
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3"
      }`}
    >
      {children}
    </div>
  );
}
