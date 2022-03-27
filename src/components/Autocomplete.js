function Autocomplete(settings) {
  let input = settings.input
  let container = document.createElement('ul')
  let isSelected = false
  let items = []
  let selected
  container.style.position = 'absolute'

  function attachList() {
    if (!container.parentNode) {
      document.body.appendChild(container)
    }
  }
  function clear() {
    items = []
    selected = undefined
    const parent = container.parentNode
    if (parent) {
      parent.removeChild(container)
    }
  }
  function update() {
    while (container.firstChild) container.removeChild(container.firstChild)
    const render = function (item) {
      const itemContainer = document.createElement('li')
      itemContainer.textContent = item || ''
      return itemContainer
    }
    var fragment = document.createDocumentFragment()
    items.forEach((item) => {
      const content = render(item)
      content.addEventListener('click', () => {
        settings.onSelect(item)
        isSelected = true
        clear()
      })
      if (item === selected) content.className += ' selected'
      fragment.appendChild(content)
    })
    container.appendChild(fragment)
    attachList()
  }

  function startFetch() {
    if (isSelected) return (isSelected = false)
    settings.fetch(input.value, (elements) => {
      items = elements
      update()
    })
  }
  function selectPrev() {
    if (selected === items[0]) return (selected = items[items.length - 1])
    for (let i = items.length - 1; i > 0; i--) {
      if (selected === items[i] || i === 1) return (selected = items[i - 1])
    }
  }
  function selectNext() {
    if (!selected || selected === items[items.length - 1])
      return (selected = items[0])
    for (let i = 0; i < items.length - 1; i++) {
      if (selected === items[i]) return (selected = items[i + 1])
    }
  }
  function keydownEventHandler(e) {
    let keyCode = e.which || e.keyCode || 0
    if (keyCode === 38 || keyCode === 40) {
      let hasContainerElement = !!container.parentNode
      if (!hasContainerElement || items.length < 1) return
      keyCode === 38 ? selectPrev() : selectNext()
      update()
      e.preventDefault()
      return
    }
    if (keyCode === 13) {
      settings.onSelect(selected)
      isSelected = true
      clear()
    }
  }
  input.addEventListener('keyup', startFetch)
  input.addEventListener('keydown', keydownEventHandler)
}
export default Autocomplete
