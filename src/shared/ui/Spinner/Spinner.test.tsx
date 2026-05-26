import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders correctly', () => {
    const { container } = render(<Spinner />);
    // Just ensuring it renders an element
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container } = render(<Spinner size="lg" />);
    // Testing the size class applied to the div
    expect(container.firstChild).toHaveClass(/lg/);
  });

  it('renders centered wrapper when centered is true', () => {
    const { container } = render(<Spinner centered />);
    expect(container.firstChild).toHaveClass(/center/);
    expect(container.firstChild?.firstChild).toHaveClass(/spinner/);
  });
});
