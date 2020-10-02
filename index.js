function initialize () {
  const calendar = new CalendarControl()

  elementUtils.setInnerHtml(templates.getFrameworkHTML(), elementUtils.getElement('.root'))
  calendar.initialize({
    onSetDate: console.log
  })
  calendar.refresh()
}

initialize()