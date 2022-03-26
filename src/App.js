import Component from './core/Component.js'
import Autocomplete from './components/Autocomplete.js'

const cache = new Map()
class App extends Component {
  template() {
    return `
      <div class='auto-complete-input'>
        <input type='text' id='auto-complete'/>
        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/OOjs_UI_icon_clear.svg/20px-OOjs_UI_icon_clear.svg.png?20180609125725' alt='clear-button' id='clear-button' />
      </div>
    `
  }

  mounted() {
    const input = this.$target.querySelector('#auto-complete')
    Autocomplete({
      input: input,
      fetch: async (text, update) => {
        const cached = cache.get(text[0])
        let titles = []
        if (cached) titles = cached
        else {
          const movies = await this.fetchMovieList(text)
          if (movies.length) {
            titles = movies.map((movie) => movie.text)
            cache.set(text[0], titles)
          }
        }
        update(titles)
      },
      onSelect: (item) => {
        input.value = item
      },
    })
  }

  async fetchMovieList(inputVal) {
    // debounce 여기서 주면 될듯
    const response = await fetch(
      `https://5qfov74y3c.execute-api.ap-northeast-2.amazonaws.com/web-front/autocomplete?value=${inputVal}`
    )
    return response.json()
  }

  setEvent() {
    const input = this.$target.querySelector('#auto-complete')
    const clearButton = this.$target.querySelector('#clear-button')
    clearButton.addEventListener('click', () => {
      input.value = ''
      clearButton.style.display = 'none'
    })
    input.addEventListener('keyup', (e) => {
      if (e.target.value !== '')
        return (clearButton.style.display = 'inline-block')
      clearButton.style.display = 'none'
    })
  }
}

export default App
