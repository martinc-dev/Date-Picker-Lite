const store = {
  calendar: {
    year: 0,
    month: 0
  },
  selectedDate: {
    year: 0,
    month: 0,
    day: 0
  }
}

const storeUtils = {
  getStore: key => store[key],
  setStore: (key, newState) => {
    store[key] = Object.assign({}, store[key] || {}, newState)
  }
}

const stringUtils = {
  numberToString: (number, fillToLen) => {
    let result = `${number}`

    if (result.length < fillToLen) {
      result = `${'0'.repeat(fillToLen - result.length)}${result}`
    }

    return result
  }
}

const timeUtils = {
  getWeekday: function (year, month, day) {
    return new Date(year, month - 1, day).getDay()
  },
  getWeekdayName: function (year, month, day) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
      new Date(year, month - 1, day).getDay()
    ]
  },
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

    return isShortName ? name.slice(0,3): name
  },
  getStartDayOfWeek: function (year, month, day) {
    const d = new Date(year, month - 1, day)
    const f = new Date(d.setDate(d.getDate() - d.getDay()))

    return { year: f.getFullYear(), month: f.getMonth() + 1, day: f.getDate() }
  },
  getEndDayOfWeek: function (year, month, day) {
    const d = new Date(year, month - 1, day)

    d.setDate(d.getDate() - d.getDay())

    const l = new Date(d.setDate(d.getDate() + 6))

    return { year: l.getFullYear(), month: l.getMonth() + 1, day: l.getDate() }
  },
  getTimestamp: function () {
    return `${new Date().getTime()}`
  },
  getFebDayCountOfYear: function (year) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) return 29

    return 28
  },
  getWeeksListOfYearMonth: function (year, month) {
    const monthDayCount = [31, this.getFebDayCountOfYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const currentMonthDayCount = monthDayCount[month - 1]

    const startDate = this.getStartDayOfWeek(year, month, 1)
    const endDate = this.getEndDayOfWeek(year, month, currentMonthDayCount)
    const daylist = []

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

    const result = []

    for (let i = 0, j = daylist.length; i < j; i += 7) {
      result.push(daylist.slice(i, i + 7))
    }

    return result
  },
  getDateNextNDays: function ({ year, month, day }, n) {
    const d = new Date(new Date(year, month - 1, day).getTime() + n * 24 * 60 * 60 * 1000)

    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
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
  },
}

const elementUtils = {
  getElement: (cssQuery, dom = document) => dom.querySelector(cssQuery),
  getElements: (cssQuery, dom = document) => [...dom.querySelectorAll(cssQuery)],
  removeClassFromElement: (classString, element) => {
    if (element.classList.contains(classString)) element.classList.remove(classString)
  },
  addClassToElement: (classString, element) => {
    if (!element.classList.contains(classString)) element.classList.add(classString)
  },
  getTextInElement: element => element.textContent,
  setTextInElement: (textContent, element) => element.textContent = textContent,
  setInnerHtml: (htmlString, element) => element.innerHTML = htmlString,
  removeElement: element => element.parentNode.removeChild(element),
}
