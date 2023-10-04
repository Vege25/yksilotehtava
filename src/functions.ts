import {
  errorModal,
  formModal,
  restaurantModal,
  weeklyRestaurantModal,
} from "./components";
import { Restaurant } from "./interfaces/Restaurant";
import { renderForms } from "./main";
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
      addModalCloseListener(modal);
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
      addModalCloseListener(modal);
      modal.showModal();
    } catch (error) {
      modal.innerHTML = errorModal((error as Error).message);
      modal.showModal();
    }
  });
};

const addModalCloseListener = (modal: HTMLDialogElement) => {
  const modalCloseButton = document.querySelector("#dialogCloseButton");
  modalCloseButton?.addEventListener("click", () => {
    console.log("close");
    modal.close();
  });
};

const addFormModeListener = () => {
  const formModeCheckbox = document.querySelector(
    "#formModeCheckbox"
  ) as HTMLInputElement;

  formModeCheckbox?.addEventListener("change", () => {
    if (formModeCheckbox.checked) {
      renderForms(false); // send FALSE if REGISTER form
    } else {
      renderForms(true); // send TRUE if LOGIN form
    }
  });
};

export { fetchData, addMenuEventListener, addFormModeListener };
