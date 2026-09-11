export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

/** 목표 시각까지 남은 시간을 일/시/분/초로 쪼갭니다 (실시간, 밀리초 단위 diff 기준). */
export function getCountdownParts(target: Date, now: Date = new Date()): CountdownParts {
  const diffMs = target.getTime() - now.getTime();
  const isPast = diffMs <= 0;
  const abs = Math.abs(diffMs);

  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((abs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((abs / (1000 * 60)) % 60);
  const seconds = Math.floor((abs / 1000) % 60);

  return { days, hours, minutes, seconds, isPast };
}

/**
 * 자정 기준 날짜 차이(시간 제외)로 "OO일 남았습니다" 문구에 쓸 숫자를 계산합니다.
 * (DAYS 카운터는 정확히 24시간 단위라 0시가 되기 전까진 실제 D-day 보다 1 작게 보일 수 있어,
 *  문구용 숫자는 달력 날짜 기준으로 따로 계산합니다.)
 */
export function getCalendarDaysRemaining(target: Date, now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export { pad2 };
