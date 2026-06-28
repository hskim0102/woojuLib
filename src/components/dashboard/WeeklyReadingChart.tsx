"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/Card";
import type { WeeklyReadingStat } from "@/types/dashboard";

interface WeeklyReadingChartProps {
  data: WeeklyReadingStat[];
}

/** 구성원별 막대 색상 + 표시 이름 */
const SERIES = [
  { key: "mom", name: "샛별", color: "#FB7185" },
  { key: "dad", name: "호섭", color: "#3B82F6" },
  { key: "son", name: "우주", color: "#8B5CF6" },
  { key: "daughter", name: "유주", color: "#F472B6" },
] as const;

/**
 * [하단] 주간 독서 시간 통계 (요일별 구성원 누적 막대 그래프)
 * Recharts 기반, 클라이언트 컴포넌트
 */
export function WeeklyReadingChart({ data }: WeeklyReadingChartProps) {
  return (
    <Card>
      <SectionTitle
        icon={<BarChart3 size={22} className="text-primary" />}
        title="이번 주 독서 시간"
        action={
          <span className="text-sm text-stone-400">단위: 분</span>
        }
      />
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#78716C", fontSize: 13 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#A8A29E", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(245, 158, 11, 0.06)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E7E5E4",
                fontSize: 13,
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
            />
            {SERIES.map((s, idx) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                stackId="reading"
                fill={s.color}
                radius={idx === SERIES.length - 1 ? [6, 6, 0, 0] : 0}
                maxBarSize={48}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
