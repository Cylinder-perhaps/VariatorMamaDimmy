import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge, marketStatusVariant, orderStatusVariant } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<Badge variant="active">Active</Badge>);
    // We check if the class string contains "active" (due to CSS modules, exact class names might vary)
    expect(container.firstChild).toHaveClass(/active/);
  });

  it('exports correct status mappings', () => {
    expect(marketStatusVariant.ACTIVE).toBe('active');
    expect(orderStatusVariant.PENDING).toBe('pending');
    expect(orderStatusVariant.CANCELLED).toBe('cancelled');
  });
});
