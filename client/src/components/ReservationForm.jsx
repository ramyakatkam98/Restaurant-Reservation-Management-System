import React, { useState } from 'react';

export default function ReservationForm({ onCreate }) {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [guests, setGuests] = useState(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      // client-side validation
      const errs = {};
      
      if (!date) {
        errs.date = 'Please select a date';
      } else {
        // Validate date is not in the past
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          errs.date = 'Cannot make reservations for past dates';
        }
      }
      
      if (!timeSlot) {
        errs.timeSlot = 'Please select a time';
      }
      
      if (!guests || guests < 1) {
        errs.guests = 'Number of guests must be at least 1';
      } else if (guests > 50) {
        errs.guests = 'Number of guests cannot exceed 50';
      } else if (!Number.isInteger(guests)) {
        errs.guests = 'Number of guests must be a whole number';
      }
      
      if (Object.keys(errs).length) {
        setFieldErrors(errs);
        setBusy(false);
        return;
      }
      
      setFieldErrors({});
      await onCreate({ date, timeSlot, guests });
      setDate('');
      setTimeSlot('');
      setGuests(2);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="reservation-form-container">
      <form className="reservation-form" onSubmit={submit} noValidate>
        <div className="form-header">
          <h2>Reserve a Table</h2>
          <p>Book your dining experience</p>
        </div>
      <div className="field-row">
        <label className="field-label" htmlFor="guests">Guests</label>
        <div className="field-input">
          <input 
            id="guests" 
            aria-invalid={!!fieldErrors.guests} 
            aria-describedby={fieldErrors.guests ? 'guests-error' : undefined} 
            type="number" 
            min="1" 
            max="50"
            value={guests} 
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 1) {
                setGuests(value);
              } else if (e.target.value === '') {
                setGuests('');
              }
            }} 
          />
          {fieldErrors.guests && <div id="guests-error" role="alert" className="helper">{fieldErrors.guests}</div>}
        </div>
      </div>

      <div className="field-row">
        <label className="field-label" htmlFor="date">Date</label>
        <div className="field-input">
          <input 
            id="date" 
            aria-invalid={!!fieldErrors.date} 
            aria-describedby={fieldErrors.date ? 'date-error' : undefined} 
            type="date" 
            min={new Date().toISOString().split('T')[0]}
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
          {fieldErrors.date && <div id="date-error" role="alert" className="helper">{fieldErrors.date}</div>}
        </div>
      </div>

      <div className="field-row">
        <label className="field-label" htmlFor="time">Time</label>
        <div className="field-input">
          <input id="time" aria-invalid={!!fieldErrors.timeSlot} aria-describedby={fieldErrors.timeSlot ? 'time-error' : undefined} type="time" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} />
          {fieldErrors.timeSlot && <div id="time-error" role="alert" className="helper">{fieldErrors.timeSlot}</div>}
        </div>
      </div>

      {error && <div className="error" style={{marginTop: '16px', marginBottom: '8px'}}>{error}</div>}
      <button className="btn" disabled={busy} style={{marginTop: '8px'}}>
        {busy ? 'Reserving…' : 'Reserve Table'}
      </button>
    </form>
    </div>
  );
}
