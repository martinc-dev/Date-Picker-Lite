class CalendarChartControl extends BaseControl {
  constructor() {
    super()

    this.state = Object.assign({}, this.state, { year: 0, month: 0 })
    this.refresh = this.refresh.bind(this)
    this.setCalendarRange = this.setCalendarRange.bind(this)
    this.setNextMonth = this.setNextMonth.bind(this)
    this.setPrevMonth = this.setPrevMonth.bind(this)
  }

  refresh() {
    let { year, month } = this.state
    const { onCalendarRangeUpdate } = this.property

    if (!year || !month) {
      const today = new Date()
      year = today.getFullYear()
      month = today.getMonth() + 1

      this.setState({ year, month })
    }

    this.unmount()
    this.render()
    this.mount()
    this.bindHandlers()
    onCalendarRangeUpdate(year, month)
  }

  setCalendarRange(date) {
    const { year: yearCurrent, month: monthCurrent } = this.state
    let { year, month } = date

    year = parseInt(year || yearCurrent)
    month = parseInt(month || monthCurrent)

    this.setState({ year, month })
    this.refresh()
  }

  setNextMonth() {
    const { year, month } = this.state

    this.setState(timeUtils.getNextMonth({ year, month }))
    this.refresh()
  }

  setPrevMonth() {
    const { year, month } = this.state

    this.setState(timeUtils.getPrevMonth({ year, month }))
    this.refresh()
  }

  render() {
    const { year, month } = this.state

    this.setState({ html: templates.getCalendarHtml({ year, month, selectedDate: storeUtils.getStore('selectedDate') }) })
  }

  bindHandlers = () => {
    const { onSetDate } = this.property
    const refresh = this.refresh

    this.setHandlers('.calendarDayCell--enabled .calendarDayCellBody', 'click', event => {
      const { timestamp } = event.target.dataset
      const regex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/

      if (timestamp && regex.test(timestamp)) {
        const [_, year, month, day] = timestamp.match(regex)
        const selectedDate = {
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day)
        }

        storeUtils.setStore('selectedDate', selectedDate)
        onSetDate(selectedDate)
        refresh()
      }
    })
  }
}