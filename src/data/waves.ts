export interface Wave {
  id: string;
  name: string;
  period: string;
  startMonth: number;
  endMonth: number;
  budgetSplit: number;
  objective: string;
  focus: string;
  isHoliday: boolean;
}

export const waves: Record<string, Wave> = {
  preLaunch: {
    id: "preLaunch",
    name: "Pre-Launch",
    period: "Feb-Apr 2026",
    startMonth: 2,
    endMonth: 4,
    budgetSplit: 0,
    objective: "Seed & Build",
    focus: "Content creation, creator partnerships, research",
    isHoliday: false
  },
  wave1: {
    id: "wave1",
    name: "Smyths Launch",
    period: "May-Aug 2026",
    startMonth: 5,
    endMonth: 8,
    budgetSplit: 0.25,
    objective: "Retail Presence + Proof Building",
    focus: "UK-heavy, Smyths exclusive, review generation",
    isHoliday: false
  },
  wave2: {
    id: "wave2",
    name: "Holiday 2026",
    period: "Sept-Dec 2026",
    startMonth: 9,
    endMonth: 12,
    budgetSplit: 0.75,
    objective: "Mass Awareness + Conversion",
    focus: "Full EU3 rollout, gift-giver targeting, Q4 push",
    isHoliday: true
  }
};

export const waveList = Object.values(waves);

export const getWaveColor = (waveId: string): string => {
  const colors: Record<string, string> = {
    preLaunch: "#a855f7",
    wave1: "#00C0E8",
    wave2: "#E91E8C"
  };
  return colors[waveId] || "#333";
};

export const months = [
  { id: 1, name: "Jan", short: "J" },
  { id: 2, name: "Feb", short: "F" },
  { id: 3, name: "Mar", short: "M" },
  { id: 4, name: "Apr", short: "A" },
  { id: 5, name: "May", short: "M" },
  { id: 6, name: "Jun", short: "J" },
  { id: 7, name: "Jul", short: "J" },
  { id: 8, name: "Aug", short: "A" },
  { id: 9, name: "Sep", short: "S" },
  { id: 10, name: "Oct", short: "O" },
  { id: 11, name: "Nov", short: "N" },
  { id: 12, name: "Dec", short: "D" },
];
