import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import Label from './Label.vue'

describe('test label functionalities', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should pass axe accessibility tests', async () => {
    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h(Label, { for: 'input' }, { default: () => 'Label' }),
              h('input', { id: 'input' }),
            ])
        },
      }),
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('should render without crashing', async () => {
    const label = render(Label)
    expect(label.html()).toBe('<label></label>')
  })

  it('should render with a default slot', async () => {
    const label = render(Label, { slots: { default: 'Label' } })
    expect(label.html()).toBe('<label>Label</label>')
  })

  it('should render with a `for` attribute', async () => {
    const label = render(Label, { props: { for: 'input' } })
    expect(label.html()).toBe('<label for="input"></label>')
  })

  it('should render with a `for` attribute and a default slot', async () => {
    const label = render(Label, {
      props: { for: 'input' },
      slots: { default: 'Label' },
    })
    expect(label.html()).toBe('<label for="input">Label</label>')
  })

  // disable this test as the focus event it will all be handle by the browser itself
  // it('should focus the input when the label is clicked', async () => {
  //   const wrapper = mount(
  //     defineComponent({
  //       setup() {
  //         return () =>
  //           h('div', [
  //             h(Label, { for: 'test' }, 'Label'),
  //             h('input', { id: 'test' }),
  //           ])
  //       },
  //     }), {
  //       attachTo: document.body,
  //     },
  //   )

  //   // wrapper.find('label').element.click()
  //   // expect(wrapper.find('input').element).toBe(document.activeElement)
  // })

  it('should not focus the input when click on the label without a `for` attribute', async () => {
    const { container } = render(
      defineComponent({
        setup() {
          return () => h('div', [h(Label), h('input', { id: 'input' })])
        },
      }),
    )

    container.getElementsByTagName('label')[0].click()
    await nextTick()
    expect(container.querySelector('input')).not.toBe(document.activeElement)
  })

  it('should not focus the input when click on the label with a `for` attribute that does not match any input', async () => {
    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h('div', [h(Label, { for: 'input' }), h('input', { id: 'input2' })])
        },
      }),
    )

    container.getElementsByTagName('label')[0].click()
    await nextTick()
    expect(container.querySelector('input')).not.toBe(document.activeElement)
  })
})
