import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import './style.css';

export type DaySchedule = {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
};

export type FuseauHoraireRef = {
  getSchedule: () => DaySchedule[];
  setSchedule: (newSchedule: DaySchedule[]) => void;
};

const initialSchedule: DaySchedule[] = [
  { day: "Lundi", open: "09:00", close: "17:00", isOpen: true },
  { day: "Mardi", open: "09:00", close: "17:00", isOpen: true },
  { day: "Mercredi", open: "09:00", close: "17:00", isOpen: true },
  { day: "Jeudi", open: "09:00", close: "17:00", isOpen: true },
  { day: "Vendredi", open: "09:00", close: "17:00", isOpen: true },
  { day: "Samedi", open: "10:00", close: "14:00", isOpen: false },
  { day: "Dimanche", open: "00:00", close: "00:00", isOpen: false },
];

const FuseauHoraireForm = forwardRef<FuseauHoraireRef>((_, ref) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);

  // Expose des méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    getSchedule: () => schedule,
    setSchedule: (newSchedule: DaySchedule[]) => setSchedule(newSchedule),
  }));

  const handleToggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].isOpen = !newSchedule[index].isOpen;
    setSchedule(newSchedule);
  };

  const handleTimeChange = (
    index: number,
    field: "open" | "close",
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  return (
    <div className="fuseau-form">
      <h3>Planning d’ouverture</h3>
      {schedule.map((day, index) => (
        <div key={day.day} className="day-row">
          <label>
            <input
              type="checkbox"
              checked={day.isOpen}
              onChange={() => handleToggleDay(index)}
            />{" "}
            {day.day}
          </label>

          <input
            type="time"
            value={day.open}
            disabled={!day.isOpen}
            onChange={(e) => handleTimeChange(index, "open", e.target.value)}
          />
          <span>à</span>
          <input
            type="time"
            value={day.close}
            disabled={!day.isOpen}
            onChange={(e) => handleTimeChange(index, "close", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
});

export default FuseauHoraireForm;
