
import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import MiniCalendar from './MiniCalendar';
import { getMonthData, navigateMonth, getDayOfYear } from '@/utils/calendarUtils';
import { getQuarterName, getQuarterColor } from '@/utils/calendarUtils';
import { addMonths, subMonths, getWeek } from 'date-fns';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Today's date is selected by default
  const { weeks, monthName, year } = getMonthData(currentDate);
  const dayOfYear = selectedDate ? getDayOfYear(selectedDate) : '--';
  const weekNumber = selectedDate ? getWeek(selectedDate, { weekStartsOn: 1 }) : '--';
  
  const prevMonthDate = subMonths(currentDate, 1);
  const nextMonthDate = addMonths(currentDate, 1);
  
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => navigateMonth(prevDate, 'prev'));
  };
  
  const handleNextMonth = () => {
    setCurrentDate((prevDate) => navigateMonth(prevDate, 'next'));
  };
  
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };
  
  const handleSelectDay = (date: Date) => {
    // If the clicked date is already selected, unselect it
    setSelectedDate(prevDate => 
      prevDate && prevDate.getTime() === date.getTime() ? null : date
    );
  };
  
  // Get all quarters for the legend (1-4)
  const allQuarters = [1, 2, 3, 4];
  
  // Find visible quarters in the current view (for highlighting current quarters)
  const visibleQuarters = [...new Set(weeks.flatMap(week => 
    week.days.map(day => day.quarter)
  ))].sort();
  
  return (
    <div className="calendar-container">
      <CalendarHeader
        monthName={monthName}
        year={year}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 animate-slide-up">
        <div className="flex items-center flex-wrap gap-3 mb-2 md:mb-0">
          <span className="text-sm font-medium">Quarters:</span>
          {allQuarters.map((quarter) => {
            const isVisible = visibleQuarters.includes(quarter);
            return (
              <div key={quarter} className="flex items-center">
                <div 
                  className={`${getQuarterColor(quarter)} w-4 h-4 rounded mr-1 ${!isVisible ? 'opacity-40' : ''}`}
                  aria-hidden="true"
                ></div>
                <span className={`text-sm ${!isVisible ? 'text-muted-foreground' : ''}`}>
                  {getQuarterName(quarter)}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="flex gap-4 text-sm font-medium">
          <div>
            Week: <span className="font-bold">{weekNumber}</span>
          </div>
          <div>
            Day of Year: <span className="font-bold">{dayOfYear}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
        <CalendarGrid 
          weeks={weeks} 
          selectedDate={selectedDate}
          onSelectDay={handleSelectDay}
        />
      </div>
      
      {/* Mini Calendars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <MiniCalendar 
          date={prevMonthDate} 
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDay={(date) => {
            setCurrentDate(prevMonthDate);
            handleSelectDay(date);
          }}
        />
        <MiniCalendar 
          date={nextMonthDate} 
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDay={(date) => {
            setCurrentDate(nextMonthDate);
            handleSelectDay(date);
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
