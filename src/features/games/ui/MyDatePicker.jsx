import { useState } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export function MyDatePicker({ onSelect }) {
  const [selected, setSelected] = useState();

  return (
    <DayPicker
      animate
      style={{
        "--rdp-accent-color": "var(--color-pulse-primary)",
        "--rdp-accent-background-color": "rgba(124, 58, 237, 0.1)",
        "--rdp-day_button-border-radius": "99rem",
        "--rdp-day_button-height": "2.5rem",
        "--rdp-day_button-width": "2.5rem",
        "--rdp-selected-border": "2px solid var(--color-pulse-primary)",
        "--rdp-today-color": "var(--color-pulse-primary)",
        "--rdp-outside-opacity": "0.5",
        "--rdp-disabled-opacity": "0.3",
        "--rdp-weekday-opacity": "0.8",
        "--rdp-weekday-text-align": "center",
        "border-radius": "1.5rem",
        padding: "1rem",
      }}
      className="rdp-root"
      mode="single"
      selected={selected}
      onSelect={onSelect}
    />
  );
}
