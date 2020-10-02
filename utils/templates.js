const templates = {
  getDayHTMLOfDay: function getDayHTMLOfDay({ yearS, monthS, dayS, isCurrentMonth, isActive }) {
    return `<div class="calendarDayCell${isCurrentMonth ? ' calendarDayCell--enabled' : ' calendarDayCell--disabled'}${
      isActive ? ' calendarDayCell--active' : ''
    }">
  <div class="calendarDayCellBody" data-timestamp="${yearS}-${monthS}-${dayS}">${isCurrentMonth ? dayS : ''}</div>
</div>`
  },
  getWeekHTMLOfDaysHTML: function getWeekHTMLOfDaysHTML(dayHtmlList) {
    return `<div class="calendarWeekRow">${dayHtmlList.join('')}</div>`
  },
  getWeekHeaderHTML: function getWeekHeaderHTML() {
    return `<div class="calendarWeekHeaderRow"><div class="calendarHeaderDayCell">Su</div><div class="calendarHeaderDayCell">Mo</div><div class="calendarHeaderDayCell">Tu</div><div class="calendarHeaderDayCell">We</div><div class="calendarHeaderDayCell">Th</div><div class="calendarHeaderDayCell">Fr</div><div class="calendarHeaderDayCell">Sa</div></div>`
  },
  getMonthTableHTMLOfWeeksList: function getMonthTableHTMLOfWeeksList(weekHeaderHtml, weekHtmlList) {
    return `<div class="calendarTable">${weekHeaderHtml}${weekHtmlList.join('')}</div>`
  },
  getCalendarYearSelectorHTML: function getCalendarYearSelectorHTML(year) {
    return `<div class="calendarYearSelector">
    <div class="calendarYearSelector__year">${year}</div>
    <div class="calendarYearSelector__buttons">
      <button type="button" class="calendarYearSelector__nextYearButton">&bigtriangleup;</button>
      <button type="button" class="calendarYearSelector__prevYearButton">&bigtriangledown;</button>
    </div>
</div>`
  },
  getCalendarHtml: function getCalendarHtml({ year, month, selectedDate }) {
    const weekList = timeUtils.getWeeksListOfYearMonth(year, month)
    const nts4 = num => stringUtils.numberToString(num, 4)
    const nts2 = num => stringUtils.numberToString(num, 2)

    return this.getMonthTableHTMLOfWeeksList(
      this.getWeekHeaderHTML(),
      weekList.map(week =>
        this.getWeekHTMLOfDaysHTML(
          week.map(weekDay =>
            this.getDayHTMLOfDay({
              yearS: nts4(weekDay.year),
              monthS: `${weekDay.month}`,
              dayS: `${weekDay.day}`,
              isCurrentMonth: weekDay.month === month,
              isActive: selectedDate.year === weekDay.year && selectedDate.month === weekDay.month && selectedDate.day === weekDay.day
            })
          )
        )
      )
    )
  },
  getCalendarNavHtml: function getCalendarNavHtml({ year, month }) {
    return `<div class="calendarControl">
    <button type="button" class="calendarControlMonthButton calendarControlMonthButtonPrev">${timeUtils.getMonthName({
      ...timeUtils.getPrevMonth({ year, month }),
      day: 1,
      isShortName: true
    })}</button>
    <div class="calendarControlRangeSelectorBlock"><div class="calendarMonth">${timeUtils.getMonthName({
      year,
      month,
      day: 1
    })}</div>${this.getCalendarYearSelectorHTML(year)}
    </div>
    <button type="button" class="calendarControlMonthButton calendarControlMonthButtonNext">${timeUtils.getMonthName({
      ...timeUtils.getNextMonth({ year, month }),
      day: 1,
      isShortName: true
    })}</button>
  </div>`
  },
  getFrameworkHTML: () => {
    return `<div class="framework">
    <div class="frameworkBody">
      <div class="frameworkMainBlock">
        <div class="frameworkMainHeader"></div>
        <div class="frameworkMainBody calendarContainer"></div>
      </div>
    </div>
  </div>`
  }
}