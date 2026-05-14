import Button from './Button';
export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  return <div className="mt-6 flex items-center justify-between"><Button variant="secondary" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>Prev</Button><span>Page {pagination.page} of {pagination.pages}</span><Button variant="secondary" disabled={pagination.page >= pagination.pages} onClick={() => onPageChange(pagination.page + 1)}>Next</Button></div>;
}
