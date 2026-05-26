import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    // In our implementation, children are still rendered even when loading, along with a spinner
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders with different variants and sizes without crashing', () => {
    render(
      <>
        <Button variant="danger" size="sm">Danger Small</Button>
        <Button variant="ghost" size="lg">Ghost Large</Button>
        <Button fullWidth>Full Width</Button>
      </>
    );
    expect(screen.getByText('Danger Small')).toBeInTheDocument();
    expect(screen.getByText('Ghost Large')).toBeInTheDocument();
    expect(screen.getByText('Full Width')).toBeInTheDocument();
  });
});
