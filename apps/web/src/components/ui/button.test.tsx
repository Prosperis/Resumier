import { render } from '@testing-library/react'
import { Button } from './button'
import { describe, it, expect } from 'vitest'

describe('Button', () => {
  it('renders children', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })

  it('forwards className from variants', () => {
    const { getByText } = render(
      <Button variant="destructive">Delete</Button>
    )
    expect(getByText('Delete').className).toContain('bg-destructive')
  })

  it('supports rendering as child element', () => {
    const { container } = render(
      <Button asChild>
        <a href="#">A</a>
      </Button>
    )
    const anchor = container.querySelector('a')
    expect(anchor).not.toBeNull()
    expect(anchor?.getAttribute('data-slot')).toBe('button')
  })
})
