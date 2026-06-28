"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/** 비밀번호 변경 카드 (현재 → 새 비밀번호) */
export function PasswordChangeCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full rounded-button border border-stone-200 px-4 py-2.5 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100";

  const handleSave = async () => {
    if (next.length < 4) {
      alert("새 비밀번호는 4자 이상이어야 해요.");
      return;
    }
    if (next !== confirm) {
      alert("새 비밀번호가 서로 일치하지 않아요.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        throw new Error(error || "변경에 실패했어요.");
      }
      alert("비밀번호가 변경되었어요! 🔒");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (e) {
      alert(e instanceof Error ? e.message : "변경 중 문제가 발생했어요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <SectionTitle
        icon={<KeyRound size={20} className="text-primary" />}
        title="비밀번호 변경"
      />
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-600 dark:text-stone-300">
            현재 비밀번호
          </label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-600 dark:text-stone-300">
            새 비밀번호
          </label>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            placeholder="4자 이상"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-600 dark:text-stone-300">
            새 비밀번호 확인
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !current || !next || !confirm}
          className="mt-1 self-start"
        >
          {saving ? "변경 중..." : "비밀번호 변경"}
        </Button>
      </div>
    </Card>
  );
}
