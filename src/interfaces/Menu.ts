interface Menu {
  courses: Course[];
}
interface Course {
  price: string;
  name: string;
  diets: string[];
}
export type { Menu };
