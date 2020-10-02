class CalendarNavControl extends BaseControl {
  handleDateSelectorChange = ({ isNext }) => {
    const { year, month } = storeUtils.getStore('calendar')
    const { onSetCalendarRange } = this.property

    onSetCalendarRange({ year: isNext ? year + 1 : year - 1, month })
  }

  render() {
    const { year, month } = storeUtils.getStore('calendar')

    this.setState({ html: templates.getCalendarNavHtml({ year, month }) })
  }

  bindHandlers() {
    const { onSetCalendarRange, onClickPrevMonth, onClickNextMonth } = this.property

    this.setHandler('.calendarControlMonthButtonPrev', 'click', onClickPrevMonth)
    this.setHandler('.calendarControlMonthButtonNext', 'click', onClickNextMonth)

    this.setHandler('.calendarYearSelector__prevYearButton', 'click', () =>
      this.handleDateSelectorChange({ isNext: false })
    )
    this.setHandler('.calendarYearSelector__nextYearButton', 'click', () =>
      this.handleDateSelectorChange({ isNext: true })
    )
  }
}
