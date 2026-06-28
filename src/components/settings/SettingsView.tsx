"use client";

import { useState } from "react";
import { User, BookHeart, Bell, Palette } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** 선택 가능한 장르 (design_system / schema 기준 일부) */
const GENRES = [
  "소설", "자기계발", "에세이", "판타지", "모험", "추리",
  "SF", "로맨스", "경제", "비즈니스", "역사", "인문학",
  "청소년", "어린이", "고전", "과학",
];

/** 토글 스위치 */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-2.5">
      <span className="text-sm text-stone-700 dark:text-stone-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-stone-300 dark:bg-stone-600",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </label>
  );
}

/** 설정 페이지 본문 (클라이언트 상태) */
export function SettingsView() {
  const [nickname, setNickname] = useState("샛별");
  const [goal, setGoal] = useState(5);
  const [genres, setGenres] = useState<string[]>(["소설", "자기계발", "에세이"]);
  const [notif, setNotif] = useState({
    activity: true,
    comment: true,
    recommendation: false,
    goal: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("normal");

  const toggleGenre = (g: string) =>
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  const inputClass =
    "w-full rounded-button border border-stone-200 px-4 py-2.5 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100";

  return (
    <div className="flex flex-col gap-6">
      {/* 프로필 */}
      <Card>
        <SectionTitle
          icon={<User size={20} className="text-primary" />}
          title="프로필"
        />
        <label className="mb-1 block text-sm font-medium text-stone-600 dark:text-stone-300">
          닉네임
        </label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={inputClass}
        />
      </Card>

      {/* 독서 습관 */}
      <Card>
        <SectionTitle
          icon={<BookHeart size={20} className="text-primary" />}
          title="독서 습관"
        />
        <label className="mb-2 block text-sm font-medium text-stone-600 dark:text-stone-300">
          월 독서 목표: <span className="font-bold text-primary">{goal}권</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          className="w-full accent-primary"
        />

        <p className="mb-2 mt-4 text-sm font-medium text-stone-600 dark:text-stone-300">
          선호 장르
        </p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const active = genres.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300",
                )}
              >
                #{g}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 알림 */}
      <Card>
        <SectionTitle
          icon={<Bell size={20} className="text-primary" />}
          title="알림"
        />
        <div className="divide-y divide-stone-100 dark:divide-stone-700">
          <Toggle
            label="가족 활동 알림"
            checked={notif.activity}
            onChange={(v) => setNotif({ ...notif, activity: v })}
          />
          <Toggle
            label="댓글 알림"
            checked={notif.comment}
            onChange={(v) => setNotif({ ...notif, comment: v })}
          />
          <Toggle
            label="추천 도서 알림"
            checked={notif.recommendation}
            onChange={(v) => setNotif({ ...notif, recommendation: v })}
          />
          <Toggle
            label="목표 달성 알림"
            checked={notif.goal}
            onChange={(v) => setNotif({ ...notif, goal: v })}
          />
        </div>
      </Card>

      {/* 화면 설정 */}
      <Card>
        <SectionTitle
          icon={<Palette size={20} className="text-primary" />}
          title="화면 설정"
        />
        <Toggle label="다크 모드" checked={darkMode} onChange={setDarkMode} />

        <p className="mb-2 mt-3 text-sm font-medium text-stone-600 dark:text-stone-300">
          글자 크기
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: "small", label: "작게" },
            { key: "normal", label: "보통" },
            { key: "large", label: "크게" },
            { key: "xlarge", label: "아주 크게" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFontSize(opt.key)}
              className={cn(
                "rounded-button border-2 py-2 text-sm font-medium transition-colors",
                fontSize === opt.key
                  ? "border-primary bg-primary-50 text-primary-700 dark:bg-primary/10"
                  : "border-stone-200 text-stone-500 dark:border-stone-600",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 저장 */}
      <Button fullWidth onClick={() => alert("설정이 저장되었어요! ⚙️")}>
        설정 저장하기
      </Button>
    </div>
  );
}
