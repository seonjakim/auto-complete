class Component {
  $target
  $state
  $props
  constructor($target, $props) {
    this.$target = $target
    this.$props = $props
    this.setup()
    this.render()
    this.setEvent()
  }
  setup() {}
  mounted() {}
  template() {
    return ''
  }
  render() {
    this.$target.innerHTML = this.template()
    this.mounted()
  }
  onClick() {}
  setEvent() {}
  setState(newState) {
    this.$state = { ...this.$state, ...newState }
    this.render()
  }
}

export default Component
