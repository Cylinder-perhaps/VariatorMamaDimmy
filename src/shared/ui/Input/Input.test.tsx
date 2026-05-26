import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders input element correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders label and links it to input', () => {
    render(<Input label="Username" />);
    const input = screen.getByLabelText('Username');
    expect(input).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Input error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('handles user typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input placeholder="Type here" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'hello');
    
    expect(input).toHaveValue('hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders left icon', () => {
    render(<Input leftIcon={<span data-testid="icon">Icon</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('handles custom id correctly', () => {
    render(<Input label="Email Address" id="custom-email-id" />);
    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveAttribute('id', 'custom-email-id');
  });
});
