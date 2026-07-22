import { Bookmark, Compass, Luggage } from "lucide-react";

export type NavigationItem = "explore" | "saved" | "trip";

interface BottomNavigationProps {
  activeItem: NavigationItem;
  onChange: (item: NavigationItem) => void;
}

const items = [
  { id: "explore" as const, label: "Explore", Icon: Compass },
  { id: "saved" as const, label: "Saved", Icon: Bookmark },
  { id: "trip" as const, label: "Trip", Icon: Luggage },
];

export function BottomNavigation({
  activeItem,
  onChange,
}: BottomNavigationProps) {
  return (
    <nav className="bottom-navigation" aria-label="Primary navigation">
      {items.map(({ id, label, Icon }) => {
        const isActive = activeItem === id;

        return (
          <button
            className={`bottom-navigation__item ${isActive ? "is-active" : ""}`}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(id)}
            key={id}
          >
            <Icon
              aria-hidden="true"
              fill={id === "saved" && isActive ? "currentColor" : "none"}
              size={23}
              strokeWidth={1.7}
            />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
