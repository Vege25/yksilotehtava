import {
  addUserDataToModal,
  errorModal,
  restaurantModal,
  weeklyRestaurantModal,
} from "./components";
import { Restaurant } from "./interfaces/Restaurant";
import { User } from "./interfaces/User";
import { formUpdate, renderForms, uploadPfp } from "./main";
import { apiUrl } from "./variables";

const fetchData = async (url: string, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status} occured`);
  }
  const json = response.json();
  return json;
};
const checkToken = async (): Promise<void> => {
  const modal = document.querySelector("dialog");
  const token = localStorage.getItem("token");
  if (!token || !modal) {
    console.log("token not found");
    return;
  }
  const userData = await getUserData(token);
  const profileModal = addUserDataToModal(userData);
  modal.innerHTML = "";
  modal.insertAdjacentHTML("beforeend", profileModal);
  addModalCloseListener();
  addLogOutListener();
  addUpdateListener();
};

const getUserData = async (token: string): Promise<User> => {
  const options: RequestInit = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return await fetchData(apiUrl + "/users/token", options);
};
const openNav = () => {
  const links = document.getElementById("myLinks");
  if (links) {
    if (links.style.display === "block") {
      links.style.display = "none";
    } else {
      links.style.display = "block";
    }
  }
};
const updateTextContent = () => {
  const navTitle = document.querySelector(".nav-title");
  if (!navTitle) {
    return;
  }
  if (window.innerWidth <= 900) {
    navTitle.textContent = "R";
  } else {
    navTitle.textContent = "Ravintolat";
  }
};
const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

// Listeners ---------------------

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
      modal.innerHTML = "";

      const menu = await fetchData(
        apiUrl + `/restaurants/daily/${restaurant._id}/fi`
      );
      console.log(menu);

      const menuHtml = restaurantModal(restaurant, menu);
      modal.innerHTML = "";
      modal.insertAdjacentHTML("beforeend", menuHtml);
      addModalCloseListener();
      (modal as any).showModal();
    } catch (error) {
      modal.innerHTML = errorModal((error as Error).message);
      (modal as any).showModal();
    }
  });
  weeklyButton.addEventListener("click", async () => {
    if (!modal) {
      return;
    }
    try {
      modal.innerHTML = "";
      const menu = await fetchData(
        apiUrl + `/restaurants/weekly/${restaurant._id}/fi`
      );
      console.log(menu);

      const menuHtml = weeklyRestaurantModal(restaurant, menu);
      modal.innerHTML = "";
      modal.insertAdjacentHTML("beforeend", menuHtml);
      addModalCloseListener();
      (modal as any).showModal();
    } catch (error) {
      modal.innerHTML = errorModal((error as Error).message);
      (modal as any).showModal();
    }
  });
};

const addModalCloseListener = () => {
  const modal = document.querySelector("dialog");
  if (!modal) {
    return;
  }
  const modalCloseButtons = document.querySelectorAll("#dialogCloseButton");
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("close");
      (modal as any).close();
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

const addLogOutListener = () => {
  const logOutBtns = document.querySelectorAll("#logOutButton");
  logOutBtns.forEach((logOutBtn) => {
    logOutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      renderForms(null);
    });
  });
};

const addUpdateListener = () => {
  const updateForm = document.querySelector("#updateForm");
  const profileImage = document.querySelector("#profileImage");
  const fileInput = document.querySelector("#profilePicUploadInput");
  updateForm?.addEventListener("submit", (evt) => {
    evt.preventDefault();
    formUpdate();
  });

  profileImage?.addEventListener("click", () => {
    (fileInput as any)?.click();
  });
  fileInput?.addEventListener("change", (evt: Event) => {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      uploadPfp(file);
    }
  });
};
const addProfileButtonListener = () => {
  const profileButtons = document.querySelectorAll("#loginButton");
  profileButtons.forEach((profileButton) => {
    let isLogin: boolean | null;
    profileButton.addEventListener("click", () => {
      renderForms(isLogin);
      checkToken();
    });
  });
};

const addNavButtonsListener = () => {
  const navButtons = document.querySelectorAll(".nav-link");
  navButtons.forEach((navButton) => {
    navButton.addEventListener("click", () => {
      const miniNav = document.querySelector(".mini-nav");
      const restaurantMap = document.querySelector("#restaurantMap");
      const body = document.querySelector("body");
      if (!miniNav || !restaurantMap || !body) {
        return;
      }
      let navElement;
      switch (navButton.id) {
        case "restaurants":
          navElement = miniNav;
          break;
        case "map":
          navElement = restaurantMap;
          break;
        case "frontPage" || "navTitleLink":
          navElement = body;
          break;
        default:
          console.log("no nav elements");
          return;
      }

      window.scrollTo({
        behavior: "smooth",
        top:
          navElement.getBoundingClientRect().top -
          document.body.getBoundingClientRect().top -
          20,
      });
      openNav();
    });
  });
};
const addHamburgerMenuListener = () => {
  const hamburgerMenuButton = document.querySelector("#hamburgerMenuButton");
  hamburgerMenuButton?.addEventListener("click", () => {
    openNav();
  });
};

const addShowMoreListener = () => {
  const showMoreButton = document.querySelector("#showAllRestaurantsBtn");
  showMoreButton?.addEventListener("click", () => {
    const menuItems = document.querySelectorAll(".menu-item-container");

    menuItems.forEach((menuItem: Element) => {
      const menuItemDisplayValue = window
        .getComputedStyle(menuItem as HTMLElement)
        .getPropertyValue("display");
      if (menuItemDisplayValue === "none") {
        (menuItem as HTMLElement).style.display = "flex";
      }
    });
  });
};
const runAppStartListeners = () => {
  addModalCloseListener();
  addDarkModeSwitchListener();
  addProfileButtonListener();
  addNavButtonsListener();
  addHamburgerMenuListener();
  addShowMoreListener();
};

export {
  fetchData,
  addMenuEventListener,
  addFormModeListener,
  addModalCloseListener,
  addDarkModeSwitchListener,
  addLogOutListener,
  addUpdateListener,
  addProfileButtonListener,
  checkToken,
  addNavButtonsListener,
  addHamburgerMenuListener,
  updateTextContent,
  addShowMoreListener,
  runAppStartListeners,
  calculateDistance,
};
