
import { addDays, addMonths, endOfMonth, endOfWeek, format, getDay, getMonth, getWeek, getYear, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';

export type CalendarDay = {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  weekNumber: number;
  quarter: number;
  dayOfYear: number;
};

export type CalendarWeek = {
  weekNumber: number;
  days: CalendarDay[];
};

// Calculate day of year (1-365/366)
export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const getDaysInMonth = (date: Date): CalendarWeek[] => {
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);
  const startWeek = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday
  const endWeek = endOfWeek(endDate, { weekStartsOn: 1 });
  
  const today = new Date();
  const weeksInMonth: CalendarWeek[] = [];
  
  let currentDay = startWeek;
  
  while (currentDay <= endWeek) {
    const week: CalendarDay[] = [];
    const weekNumber = getWeek(currentDay, { weekStartsOn: 1 });
    
    let weekObj: CalendarWeek = {
      weekNumber,
      days: []
    };
    
    // Create 7 days for this week (Monday through Sunday)
    for (let i = 0; i < 7; i++) {
      const dayOfMonth = currentDay.getDate();
      const month = getMonth(currentDay) + 1; // 0-indexed to 1-indexed
      const quarter = Math.ceil(month / 3);
      const dayOfYear = getDayOfYear(currentDay);
      
      const day: CalendarDay = {
        date: new Date(currentDay),
        dayOfMonth,
        isCurrentMonth: isSameMonth(currentDay, date),
        isToday: isSameDay(currentDay, today),
        weekNumber,
        quarter,
        dayOfYear
      };
      
      week.push(day);
      currentDay = addDays(currentDay, 1);
    }
    
    weekObj.days = week;
    weeksInMonth.push(weekObj);
  }
  
  return weeksInMonth;
};

export const getMonthData = (date: Date) => {
  return {
    weeks: getDaysInMonth(date),
    monthName: format(date, 'MMMM'),
    year: getYear(date)
  };
};

export const getQuarterColor = (quarter: number): string => {
  switch (quarter) {
    case 1:
      return 'bg-quarter-q1';
    case 2:
      return 'bg-quarter-q2';
    case 3:
      return 'bg-quarter-q3';
    case 4:
      return 'bg-quarter-q4';
    default:
      return 'bg-background';
  }
};

export const getQuarterName = (quarter: number): string => {
  return `Q${quarter}`;
};

export const navigateMonth = (date: Date, direction: 'prev' | 'next'): Date => {
  if (direction === 'prev') {
    return subMonths(date, 1);
  } else {
    return addMonths(date, 1);
  }
};
