import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('does not render if totalPages <= 1', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all pages when totalPages <= 7', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('renders ellipsis when totalPages > 7', () => {
    render(<Pagination page={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText('…')).toHaveLength(1); // Only right ellipsis when page is 1
  });

  it('renders two ellipsis when page is in the middle', () => {
    render(<Pagination page={5} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getAllByText('…')).toHaveLength(2);
  });

  it('handles prev and next buttons', () => {
    const handleChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={handleChange} />);
    
    const prevBtn = screen.getByLabelText('Предыдущая страница');
    const nextBtn = screen.getByLabelText('Следующая страница');
    
    fireEvent.click(prevBtn);
    expect(handleChange).toHaveBeenCalledWith(1);
    
    fireEvent.click(nextBtn);
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('disables prev/next buttons on edges', () => {
    const { rerender } = render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Предыдущая страница')).toBeDisabled();
    
    rerender(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Следующая страница')).toBeDisabled();
  });
});
