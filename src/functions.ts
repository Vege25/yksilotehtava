import {
  errorModal,
  restaurantModal,
  weeklyRestaurantModal,
} from "./components";
import { Restaurant } from "./interfaces/Restaurant";
import { apiUrl } from "./variables";

const fetchData = async (url: string, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status} occured`);
  }
  const json = response.json();
  return json;
};

const addMenuEventListener = (
  dailyButton: HTMLButtonElement,
  weeklyButton: HTMLButtonElement,
  restaurant: Restaurant
) => {
  const modal = document.querySelector("dialog");
  if (!modal) {
    return;
  }
  dailyButton.addEventListener("click", async () => {
    try {
      // add restaurant data to modal
      modal.innerHTML = "";

      // fetch menu
      const menu = await fetchData(
        apiUrl + `/restaurants/daily/${restaurant._id}/fi`
      );
      console.log(menu);

      const menuHtml = restaurantModal(restaurant, menu);
      modal.innerHTML = "";
      modal.insertAdjacentHTML("beforeend", menuHtml);

      modal.showModal();
    } catch (error) {
      modal.innerHTML = errorModal((error as Error).message);
      modal.showModal();
    }
  });
  weeklyButton.addEventListener("click", async () => {
    if (!modal) {
      return;
    }
    try {
      // add restaurant data to modal
      modal.innerHTML = "";

      // fetch menu
      const menu = await fetchData(
        apiUrl + `/restaurants/weekly/${restaurant._id}/fi`
      );
      console.log(menu);

      const menuHtml = weeklyRestaurantModal(restaurant, menu);
      modal.innerHTML = "";
      modal.insertAdjacentHTML("beforeend", menuHtml);

      modal.showModal();
    } catch (error) {
      modal.innerHTML = errorModal((error as Error).message);
      modal.showModal();
    }
  });
};

export { fetchData, addMenuEventListener };
