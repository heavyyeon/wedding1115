import { wedding } from "@/data/wedding";

/**
 * 자정 기준 날짜 차이로 D-Day를 계산합니다 (시간 포함하지 않음).
 * diff > 0 → "D-N", diff === 0 → "D-Day", diff < 0 → "D+N"
 */
export function getDDayLabel(now: Date = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weddingDay = new Date(wedding.year, wedding.month - 1, wedding.day);
  const diff = Math.round(
    (weddingDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}
