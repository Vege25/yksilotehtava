import "./style.css";

import {
  errorModal,
  restaurantModal,
  restaurantRow,
  firstRestaurantRow,
  formModal,
  updateForm,
  addUserDataToModal,
} from "./components";
import {
  addDarkModeSwitchListener,
  addFormModeListener,
  addLogOutListener,
  addModalCloseListener,
  addUpdateListener,
  fetchData,
} from "./functions";
import { Restaurant } from "./interfaces/Restaurant";
import { apiUrl, positionOptions } from "./variables";
import { LoginUser, User } from "./interfaces/User";

const navTitle = document.querySelector(".nav-title");
const profileButtons = document.querySelectorAll("#loginButton");
const hamburgerMenuButton = document.querySelector("#hamburgerMenuButton");
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

hamburgerMenuButton?.addEventListener("click", () => {
  openNav();
});
const modal = document.querySelector("dialog");
if (!modal) {
  throw new Error("Modal not found");
}
profileButtons.forEach((profileButton) => {
  //TODO check if user is logged in then give true and show profile
  //TODO if not give false and login menu will be rendered
  let isLogin: boolean | null;
  profileButton.addEventListener("click", () => {
    renderForms(isLogin);
    checkToken();
  });
});

export const renderForms = (isLogin: boolean | null): void => {
  let authDialog;
  if (isLogin === null || isLogin === undefined) {
    authDialog = formModal(true);
    modal.innerHTML = "";
    modal.insertAdjacentHTML("beforeend", authDialog);
    const form = document.querySelector("#authForm");

    form?.addEventListener("submit", (evt) => {
      evt.preventDefault();
      formLogin();
    });
  } else {
    updateForm(isLogin);
    console.log("update: " + isLogin);
    const form = document.querySelector("#authForm");
    form?.addEventListener("submit", (evt) => {
      evt.preventDefault();
      if (isLogin) {
        formLogin();
      } else {
        formRegister();
      }
    });
  }
  addFormModeListener();
  addModalCloseListener(modal);
  (modal as any)?.showModal();
};
const updateTextContent = () => {
  if (!navTitle) {
    return;
  }
  if (window.innerWidth <= 900) {
    navTitle.textContent = "R";
  } else {
    navTitle.textContent = "Ravintolat";
  }
};
updateTextContent();
window.addEventListener("resize", updateTextContent);

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

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const createTable = (restaurants: Restaurant[]) => {
  const menuContainer = document.querySelector(".menu-container");
  if (!menuContainer) {
    throw new Error("Table not found");
  }
  menuContainer.innerHTML = "";
  let isFirstRestaurant = true;
  restaurants.forEach((restaurant: Restaurant, index) => {
    // if it is the first restaurant give make different html for it
    const menuItem = isFirstRestaurant
      ? (() => {
          isFirstRestaurant = false;
          return firstRestaurantRow(restaurant);
        })()
      : restaurantRow(restaurant, index);
    menuContainer.appendChild(menuItem);
  });
};

const error = (err: GeolocationPositionError) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos: GeolocationPosition) => {
  try {
    const crd = pos.coords;
    const restaurants = await fetchData(apiUrl + "/restaurants");
    console.log(restaurants);
    restaurants.sort((a: any, b: any) => {
      const x1 = crd.latitude;
      const y1 = crd.longitude;
      const x2a = a.location.coordinates[1];
      const y2a = a.location.coordinates[0];
      const distanceA = calculateDistance(x1, y1, x2a, y2a);
      const x2b = b.location.coordinates[1];
      const y2b = b.location.coordinates[0];
      const distanceB = calculateDistance(x1, y1, x2b, y2b);
      return distanceA - distanceB;
    });
    createTable(restaurants);
    // buttons for filtering
    const sodexoBtn = document.querySelector("#sodexo");
    const compassBtn = document.querySelector("#compass");
    const resetBtn = document.querySelector("#reset");
    const menuFilterTitle = document.querySelector("#menuFilterTitle");

    if (!sodexoBtn) {
      throw new Error("compassBtn not found");
    }
    sodexoBtn.addEventListener("click", () => {
      if (menuFilterTitle) {
        menuFilterTitle.textContent = "Sodexo ravintolat";
      }
      const sodexoRestaurants = restaurants.filter(
        (restaurant: Restaurant) => restaurant.company === "Sodexo"
      );
      console.log(sodexoRestaurants);
      createTable(sodexoRestaurants);
    });

    if (!compassBtn) {
      throw new Error("compassBtn not found");
    }
    compassBtn.addEventListener("click", () => {
      if (menuFilterTitle) {
        menuFilterTitle.textContent = "Compass Group ravintolat";
      }
      const compassRestaurants: Restaurant[] = restaurants.filter(
        (restaurant: Restaurant) => restaurant.company === "Compass Group"
      );
      console.log(compassRestaurants);
      createTable(compassRestaurants);
    });

    if (!resetBtn) {
      throw new Error("resetBtn not found");
    }
    resetBtn.addEventListener("click", () => {
      if (menuFilterTitle) {
        menuFilterTitle.textContent = "Kaikki ravintolat";
      }
      createTable(restaurants);
    });
  } catch (error) {
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }
};

const formRegister = async () => {
  const username = (
    document.querySelector("#usernameInput") as HTMLInputElement
  ).value;
  const email = (document.querySelector("#emailInput") as HTMLInputElement)
    .value;
  const password = (
    document.querySelector("#passwordInput") as HTMLInputElement
  ).value;
  const formData = {
    username: username,
    password: password,
    email: email,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  const loginOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  };
  const postData = await fetchData(apiUrl + "/users", options);
  console.log(postData);
  const loginData = await fetchData(apiUrl + "/auth/login", loginOptions);
  localStorage.setItem("token", loginData.token);
  checkToken();
};
const formLogin = async () => {
  const username = (
    document.querySelector("#usernameInput") as HTMLInputElement
  ).value;
  const password = (
    document.querySelector("#passwordInput") as HTMLInputElement
  ).value;
  const formData = {
    username: username,
    password: password,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  const loginData = await fetchData(apiUrl + "/auth/login", options);
  localStorage.setItem("token", loginData.token);
  checkToken();
  console.log(loginData);
};
export const formUpdate = async () => {
  const username = (
    document.querySelector("#usernameInput") as HTMLInputElement
  ).value;
  const email = (document.querySelector("#emailInput") as HTMLInputElement)
    .value;
  const token = localStorage.getItem("token");
  const formData = {
    username: username,
    password: email,
  };
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(formData),
  };
  const updateData = await fetchData(apiUrl + "/users", options);
  checkToken();
  console.log(updateData);
};
const getUserData = async (token: string): Promise<User> => {
  const options: RequestInit = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return await fetchData(apiUrl + "/users/token", options);
};
const checkToken = async (): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("token not found");
    return;
  }
  const userData = await getUserData(token);
  const profileModal = addUserDataToModal(userData);
  modal.innerHTML = "";
  modal.insertAdjacentHTML("beforeend", profileModal);
  addModalCloseListener(modal);
  addLogOutListener(modal);
  addUpdateListener();
};
checkToken();
addModalCloseListener(modal);
addDarkModeSwitchListener();

navigator.geolocation.getCurrentPosition(success, error, positionOptions);
