"use client";

import { useState } from "react";
import { User, BookHeart, Bell, Palette } from "lucide-react";
import type { Genre } from "@prisma/client";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GENRE_LABEL } from "@/lib/genres";
import { cn } from "@/lib/utils";
import type { UserSettings } from "@/lib/data";

/** 설정에서 선택 가능한 장르 (자주 쓰는 항목 위주) */
const SELECTABLE_GENRES: Genre[] = [
  "NOVEL", "SELF_HELP", "ESSAY", "FANTASY", "ADVENTURE", "MYSTERY",
  "SCIENCE_FICTION", "ROMANCE", "ECONOMICS", "BUSINESS", "HISTORY",
  "HUMANITIES", "YOUNG_ADULT", "CHILDREN", "CLASSIC", "SCIENCE",
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

interface SettingsViewProps {
  initial: UserSettings;
}

/** 설정 페이지 본문 (초기값은 서버에서 주입, 저장은 PUT /api/settings) */
export function SettingsView({ initial }: SettingsViewProps) {
  const [nickname, setNickname] = useState(initial.nickname);
  const [goal, setGoal] = useState(initial.monthlyReadingGoal);
  const [genres, setGenres] = useState<Genre[]>(initial.genres);
  const [notif, setNotif] = useState(initial.notifications);
  const [darkMode, setDarkMode] = useState(initial.darkMode);
  const [fontSize, setFontSize] = useState(initial.fontSize);
  const [saving, setSaving] = useState(false);

  const toggleGenre = (g: Genre) =>
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          genres,
          monthlyReadingGoal: goal,
          notifications: notif,
          darkMode,
          fontSize,
        }),
      });
      if (!res.ok) throw new Error("저장에 실패했어요.");
      alert("설정이 저장되었어요! ⚙️");
    } catch (e) {
      alert(e instanceof Error ? e.message : "저장 중 문제가 발생했어요.");
    } finally {
      setSaving(false);
    }
  };

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
          {SELECTABLE_GENRES.map((g) => {
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
                #{GENRE_LABEL[g]}
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
      <Button fullWidth onClick={handleSave} disabled={saving}>
        {saving ? "저장 중..." : "설정 저장하기"}
      </Button>
    </div>
  );
}
