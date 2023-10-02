interface Menu {
  courses: Course[];
}
interface Course {
  price: string;
  name: string;
  diets: string[];
}

interface WeekMenu {
  days: Day[];
}
interface Day {
  date: string;
  courses: Course[];
}
export type { Menu, WeekMenu };
