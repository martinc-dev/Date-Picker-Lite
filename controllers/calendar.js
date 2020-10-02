class CalendarControl {
  constructor () {
    this.chart = new CalendarChartControl()
    this.nav = new CalendarNavControl()

    this.initialize = this.initialize.bind(this)
    this.onCalendarRangeUpdate = this.onCalendarRangeUpdate.bind(this)
    this.onSetCalendarRange = this.onSetCalendarRange.bind(this)
    this.onClickPrevMonth = this.onClickPrevMonth.bind(this)
    this.onClickNextMonth = this.onClickNextMonth.bind(this)
    this.setCurrentCalendarRange = this.setCurrentCalendarRange.bind(this)
  }

  setCurrentCalendarRange (year, month) {
    storeUtils.setStore('calendar', { year, month })
  }

  refresh () {
    this.chart.refresh()
  }

  initialize ({ onSetDate }) {
    this.chart.setProperty({
      anchor: '.calendarContainer',
      onCalendarRangeUpdate: this.onCalendarRangeUpdate,
      onSetDate: onSetDate,
      setCurrentCalendarRange: this.setCurrentCalendarRange
    })
    this.nav.setProperty({
      anchor: '.frameworkMainHeader',
      onSetCalendarRange: this.onSetCalendarRange,
      onClickPrevMonth: this.onClickPrevMonth,
      onClickNextMonth: this.onClickNextMonth
    })
    this.chart.refresh()
    this.nav.refresh()
  }

  onCalendarRangeUpdate (year, month) {
    this.setCurrentCalendarRange(year, month)
    this.nav.refresh()
  }

  onSetCalendarRange (date) {
    this.chart.setCalendarRange(date)
  }

  onClickPrevMonth () {
    this.chart.setPrevMonth()
  }

  onClickNextMonth () {
    this.chart.setNextMonth()
  }
}
