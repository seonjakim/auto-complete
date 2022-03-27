import Component from './core/Component.js'
import Autocomplete from './components/Autocomplete.js'

const cache = new Map()
class App extends Component {
  template() {
    return `
    <div class='auto-complete-input'>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="css-1emtzzi"><path fill="currentColor" fill-rule="evenodd" d="M16.173 16.43a7.5 7.5 0 11.257-.257.749.749 0 00-.257.257zm.639 1.442a9 9 0 111.06-1.06l3.88 3.88a.75.75 0 11-1.06 1.06l-3.88-3.88z" clip-rule="evenodd"></path></svg>
      <input type='text' id='auto-complete'/>
      <button id='clear-button'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="css-1orrb02-IcClear"><path fill="currentColor" fill-rule="evenodd" d="M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-8.12-3.96a.764.764 0 011.08 1.08L13.08 12l2.88 2.88a.764.764 0 01-1.08 1.08L12 13.08l-2.88 2.88a.764.764 0 01-1.08-1.08L10.92 12 8.04 9.12a.764.764 0 011.08-1.08L12 10.92l2.88-2.88z" clip-rule="evenodd"></path></svg>
      </button>
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
      clearButton.style.visibility = 'hidden'
    })
    input.addEventListener('keyup', (e) => {
      if (e.target.value !== '')
        return (clearButton.style.visibility = 'visible')
      clearButton.style.visibility = 'hidden'
    })
  }
}

export default App
