const store = {
  calendar: { year: 0, month: 0 },
  selectedDate: { year: 0, month: 0, day: 0 }
}

const storeUtils = {
  getStore: key => store[key],
  setStore: (key, state) => (store[key] = { ...store[key], ...state })
}

const timeUtils = {
  getMonthName: function ({ year, month, day, isShortName }) {
    const name = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ][new Date(year, month - 1, day).getMonth()]

    return isShortName ? name.slice(0, 3) : name
  },
  getStartDayOfWeek: function ({ year, month, day }) {
    const d = new Date(year, month - 1, day)
    const f = new Date(d.setDate(d.getDate() - d.getDay()))

    return { year: f.getFullYear(), month: f.getMonth() + 1, day: f.getDate() }
  },
  getEndDayOfWeek: function ({ year, month, day }) {
    const d = new Date(year, month - 1, day)

    d.setDate(d.getDate() - d.getDay())

    const l = new Date(d.setDate(d.getDate() + 6))

    return { year: l.getFullYear(), month: l.getMonth() + 1, day: l.getDate() }
  },
  getFebDayCountOfYear: function (year) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) return 29

    return 28
  },
  getWeeksListOfYearMonth: function ({ year, month }) {
    const monthDayCount = [31, this.getFebDayCountOfYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const currentMonthDayCount = monthDayCount[month - 1]

    const startDate = this.getStartDayOfWeek({ year, month, day: 1 })
    const endDate = this.getEndDayOfWeek({ year, month, day: currentMonthDayCount })
    const daylist = []
    const result = []

    if (startDate.month !== month) {
      for (let i = 0; i <= monthDayCount[startDate.month - 1] - startDate.day; i++) {
        daylist.push({
          year: startDate.year,
          month: startDate.month,
          day: startDate.day + i
        })
      }
    }
    for (let i = 1; i <= currentMonthDayCount; i++) {
      daylist.push({ year, month, day: i })
    }
    if (endDate.month !== month) {
      for (let i = 1; i <= endDate.day; i++) {
        daylist.push({
          year: endDate.year,
          month: endDate.month,
          day: i
        })
      }
    }

    for (let i = 0, j = daylist.length; i < j; i += 7) {
      result.push(daylist.slice(i, i + 7))
    }

    return result
  },
  getNextMonth: function ({ year, month }) {
    const isOverlap = month + 1 > 12

    return {
      year: isOverlap ? year + 1 : year,
      month: isOverlap ? 1 : month + 1
    }
  },
  getPrevMonth: function ({ year, month }) {
    const isOverlap = month === 1

    return {
      year: isOverlap ? year - 1 : year,
      month: isOverlap ? 12 : month - 1
    }
  }
}

const elementUtils = {
  getElement: (cssQuery, dom = document) => dom.querySelector(cssQuery),
  getElements: (cssQuery, dom = document) => [...dom.querySelectorAll(cssQuery)],
  setInnerHtml: (htmlString, element) => (element.innerHTML = htmlString),
  removeElement: element => element.parentNode.removeChild(element)
}

const templates = {
  getDayHTMLOfDay: function getDayHTMLOfDay({ year, month, day, isCurrentMonth, isActive }) {
    return `<div class="dayCell${isCurrentMonth ? ' dayCell--enabled' : ' dayCell--disabled'}${
      isActive ? ' dayCell--active' : ''
    }">
  <div class="dayCell__content" data-timestamp="${year}-${month}-${day}">${isCurrentMonth ? day : ''}</div>
</div>`
  },
  getWeekHTMLOfDaysHTML: function getWeekHTMLOfDaysHTML(dayHtmlList) {
    return `<div class="weekRow">${dayHtmlList.join('')}</div>`
  },
  getWeekHeaderHTML: function getWeekHeaderHTML() {
    const headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      .map(t => `<div class="weekRowHeader__dayCell">${t}</div>`)
      .join('')

    return `<div class="weekRowHeader">${headers}</div>`
  },
  getCalendarHtml: function getCalendarHtml({ year, month, selectedDate }) {
    const weekList = timeUtils.getWeeksListOfYearMonth({ year, month })

    return `${this.getWeekHeaderHTML()}${weekList
      .map(week =>
        this.getWeekHTMLOfDaysHTML(
          week.map(weekDay =>
            this.getDayHTMLOfDay({
              year: weekDay.year,
              month: weekDay.month,
              day: weekDay.day,
              isCurrentMonth: weekDay.month === month,
              isActive:
                selectedDate.year === weekDay.year &&
                selectedDate.month === weekDay.month &&
                selectedDate.day === weekDay.day
            })
          )
        )
      )
      .join('')}`
  },
  getCalendarNavHtml: function getCalendarNavHtml({ year, month }) {
    return `<div class="datePickerNav__content">
<button type="button" class="datePickerNav__monthButton datePickerNav__monthButton--prev">${timeUtils.getMonthName({
      ...timeUtils.getPrevMonth({ year, month }),
      day: 1,
      isShortName: true
    })}</button><div class="datePickerNav__current"><div class="datePickerNav__currentMonth">${timeUtils.getMonthName({
      year,
      month,
      day: 1
    })}</div><div class="datePickerNav__currentYear">
<div class="datePickerNav__yearText">${year}</div>
<div class="datePickerNav__yearButtons">
  <button type="button" class="datePickerNav__yearButton datePickerNav__yearButton--next">&bigtriangleup;</button>
  <button type="button" class="datePickerNav__yearButton datePickerNav__yearButton--prev">&bigtriangledown;</button>
</div>
</div></div><button type="button" class="datePickerNav__monthButton datePickerNav__monthButton--next">${timeUtils.getMonthName(
      {
        ...timeUtils.getNextMonth({ year, month }),
        day: 1,
        isShortName: true
      }
    )}</button></div>`
  },
  getDatePickerHTML: () => {
    return `<div class="datePickerNav"></div><div class="datePickerCal"></div>`
  }
}

class BaseComponent {
  constructor() {
    this.state = { html: '' }
    this.refresh = this.refresh.bind(this)
  }

  setProperty = (property = { anchor: '' }) => {
    this.property = property
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState)
  }

  setHandler(selector, eventType, handler) {
    const { anchor } = this.property
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement && mountingElement.childNodes) {
      ;[...mountingElement.childNodes].map(childNode => {
        if (childNode.nodeType !== Node.TEXT_NODE) {
          const targetElement = elementUtils.getElement(selector, childNode)

          if (targetElement) targetElement.addEventListener(eventType, handler)
        }
      })
    }
  }

  setHandlers(selector, eventType, handler) {
    const { anchor } = this.property
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement && mountingElement.childNodes) {
      ;[...mountingElement.childNodes].map(childNode => {
        if (childNode.nodeType !== Node.TEXT_NODE) {
          ;[...elementUtils.getElements(selector, childNode)].map(targetElement =>
            targetElement.addEventListener(eventType, handler)
          )
        }
      })
    }
  }

  getElement(selector) {
    const { anchor } = this.property
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement && mountingElement.childNodes) {
      const [targetElement] = [...mountingElement.childNodes]
        .map(childNode => childNode.nodeType !== Node.TEXT_NODE && elementUtils.getElement(selector, childNode))
        .filter(t => t)

      if (targetElement) return targetElement
    }

    return {}
  }

  mount = () => {
    const { anchor } = this.property
    const { html } = this.state
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement) {
      elementUtils.setInnerHtml(html, mountingElement)
    }
  }

  unmount = () => {
    const { anchor } = this.property
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement && mountingElement.childNodes) [...mountingElement.childNodes].map(elementUtils.removeElement)
  }

  refresh() {
    this.unmount()
    this.render()
    this.mount()
    this.bindHandlers()
  }

  render() {}
  bindHandlers() {}
}

class CalendarComponent extends BaseComponent {
  constructor() {
    super()

    this.state = { ...this.state, year: 0, month: 0 }
  }

  refresh = () => {
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
    onCalendarRangeUpdate({ year, month })
  }

  setCalendarRange = date => {
    const { year: yearCurrent, month: monthCurrent } = this.state
    let { year, month } = date

    year = parseInt(year || yearCurrent)
    month = parseInt(month || monthCurrent)
    this.setState({ year, month })
    this.refresh()
  }

  setNextMonth = () => {
    const { year, month } = this.state

    this.setState(timeUtils.getNextMonth({ year, month }))
    this.refresh()
  }

  setPrevMonth = () => {
    const { year, month } = this.state

    this.setState(timeUtils.getPrevMonth({ year, month }))
    this.refresh()
  }

  render() {
    const { year, month } = this.state

    this.setState({
      html: templates.getCalendarHtml({
        year,
        month,
        selectedDate: storeUtils.getStore('selectedDate')
      })
    })
  }

  bindHandlers = () => {
    const { onSetDate } = this.property
    const { refresh } = this

    this.setHandlers('.dayCell--enabled .dayCell__content', 'click', event => {
      const { timestamp } = event.target.dataset
      const regex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/

      if (timestamp && regex.test(timestamp)) {
        const [, year, month, day] = timestamp.match(regex)
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

class NavComponent extends BaseComponent {
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
    const { onClickPrevMonth, onClickNextMonth } = this.property

    this.setHandler('.datePickerNav__monthButton--prev', 'click', onClickPrevMonth)
    this.setHandler('.datePickerNav__monthButton--next', 'click', onClickNextMonth)

    this.setHandler('.datePickerNav__yearButton--prev', 'click', () => {
      this.handleDateSelectorChange({ isNext: false })
    })
    this.setHandler('.datePickerNav__yearButton--next', 'click', () => {
      this.handleDateSelectorChange({ isNext: true })
    })
  }
}

class Main {
  constructor() {
    this.calendar = new CalendarComponent()
    this.nav = new NavComponent()
  }

  onCalendarRangeUpdate = ({ year, month }) => {
    storeUtils.setStore('calendar', { year, month })
    this.nav.refresh()
  }

  refresh = () => this.calendar.refresh()

  initialize = ({ onSetDate }) => {
    this.calendar.setProperty({
      anchor: '.datePickerCal',
      onCalendarRangeUpdate: this.onCalendarRangeUpdate,
      onSetDate: onSetDate
    })
    this.nav.setProperty({
      anchor: '.datePickerNav',
      onSetCalendarRange: date => this.calendar.setCalendarRange(date),
      onClickPrevMonth: () => this.calendar.setPrevMonth(),
      onClickNextMonth: () => this.calendar.setNextMonth()
    })
    this.calendar.refresh()
    this.nav.refresh()
  }
}

;(function () {
  const datePicker = new Main()

  elementUtils.setInnerHtml(templates.getDatePickerHTML(), elementUtils.getElement('.datePicker'))
  datePicker.initialize({ onSetDate: console.log })
  datePicker.refresh()
})()
