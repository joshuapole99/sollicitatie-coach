'use client';

export default function CheckoutButton({ plan, label, highlight }: { plan: string; label: string; highlight: boolean }) {
  function handleClick() {
    let sid = localStorage.getItem('sol_session_id') || '';
    if (!sid || sid.includes('{') || sid.length < 10) {
      sid = crypto.randomUUID();
      localStorage.setItem('sol_session_id', sid);
    }
    window.location.href = `/api/checkout?plan=${plan}&sessionId=${encodeURIComponent(sid)}`;
  }

  return (
    <button
      onClick={handleClick}
      className={`btn ${highlight ? 'btn-primary' : 'btn-secondary'} w-full`}
      style={{ justifyContent: 'center' }}
    >
      {label}
    </button>
  );
}
