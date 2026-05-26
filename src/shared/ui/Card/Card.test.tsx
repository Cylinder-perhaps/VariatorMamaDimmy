import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies compact and noPadding classes', () => {
    const { container } = render(<Card compact noPadding>Content</Card>);
    expect(container.firstChild).toHaveClass(/compact/);
    expect(container.firstChild).toHaveClass(/noPadding/);
  });
});
