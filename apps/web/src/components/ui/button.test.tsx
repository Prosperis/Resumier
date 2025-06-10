import { render } from '@testing-library/react'
import { Button } from './button'
import { describe, it, expect } from 'vitest'

describe('Button', () => {
  it('renders children', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })
})
