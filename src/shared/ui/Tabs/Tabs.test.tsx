import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  const tabs = [
    { key: 'tab1', label: 'Tab One' },
    { key: 'tab2', label: 'Tab Two' },
  ];

  it('renders all tabs', () => {
    render(<Tabs tabs={tabs} activeTab="tab1" onChange={() => {}} />);
    expect(screen.getByText('Tab One')).toBeInTheDocument();
    expect(screen.getByText('Tab Two')).toBeInTheDocument();
  });

  it('applies active class and aria-selected to active tab', () => {
    render(<Tabs tabs={tabs} activeTab="tab2" onChange={() => {}} />);
    const tab1 = screen.getByText('Tab One');
    const tab2 = screen.getByText('Tab Two');
    
    expect(tab1).toHaveAttribute('aria-selected', 'false');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(tab2).toHaveClass(/active/);
  });

  it('calls onChange when clicking a tab', () => {
    const handleChange = vi.fn();
    render(<Tabs tabs={tabs} activeTab="tab1" onChange={handleChange} />);
    
    fireEvent.click(screen.getByText('Tab Two'));
    expect(handleChange).toHaveBeenCalledWith('tab2');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
