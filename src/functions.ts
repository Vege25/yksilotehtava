import {
  errorModal,
  formModal,
  restaurantModal,
  weeklyRestaurantModal,
} from "./components";
import { Restaurant } from "./interfaces/Restaurant";
import { formUpdate, renderForms } from "./main";
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
  const modalCloseButtons = document.querySelectorAll("#dialogCloseButton");
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("close");
      modal.close();
    });
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

const addDarkModeSwitchListener = () => {
  console.log("change");
  const checkboxes = document.querySelectorAll("#checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      document.body.classList.toggle("dark");
    });
  });
};

const addLogOutListener = (modal: HTMLDialogElement) => {
  const logOutBtns = document.querySelectorAll("#logOutButton");
  logOutBtns.forEach((logOutBtn) => {
    logOutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      const newForm = formModal(true);
      modal.innerHTML = "";
      modal.insertAdjacentHTML("beforeend", newForm);
      addFormModeListener();
      addModalCloseListener(modal);
    });
  });
};

const addUpdateListener = () => {
  const updateForm = document.querySelector("#updateForm");
  updateForm?.addEventListener("submit", (evt) => {
    evt.preventDefault();
    formUpdate();
  });
};

export {
  fetchData,
  addMenuEventListener,
  addFormModeListener,
  addModalCloseListener,
  addDarkModeSwitchListener,
  addLogOutListener,
  addUpdateListener,
};
