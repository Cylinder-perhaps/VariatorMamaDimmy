import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<ProgressBar yesPercent={60} />);
    expect(screen.getByText('Да 60%')).toBeInTheDocument();
    expect(screen.getByText('Нет 40%')).toBeInTheDocument();
  });

  it('clamps values below 0', () => {
    render(<ProgressBar yesPercent={-10} />);
    expect(screen.getByText('Да 0%')).toBeInTheDocument();
    expect(screen.getByText('Нет 100%')).toBeInTheDocument();
  });

  it('clamps values above 100', () => {
    render(<ProgressBar yesPercent={150} />);
    expect(screen.getByText('Да 100%')).toBeInTheDocument();
    expect(screen.getByText('Нет 0%')).toBeInTheDocument();
  });

  it('hides labels when showLabels is false', () => {
    render(<ProgressBar yesPercent={50} showLabels={false} />);
    expect(screen.queryByText('Да 50%')).not.toBeInTheDocument();
  });


});
