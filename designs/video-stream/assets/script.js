;(() => {
  const dateElements = document.querySelectorAll('.comment-date')
  const now = Date.now()
  const sixHours = 6 * 60 * 60 * 1000
  dateElements.forEach(function (el) {
    const randomOffset = Math.floor(Math.random() * sixHours * 2) - sixHours
    const date = new Date(now - randomOffset)

    const months = [
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
      'December',
    ]
    const month = months[date.getMonth()]
    const day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? '0' + minutes : minutes

    el.textContent = month + ' ' + day + ', ' + hours + ':' + minutes + ' ' + ampm
  })
})()
