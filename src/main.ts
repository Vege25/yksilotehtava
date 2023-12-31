import "./style.css";
import {
  errorModal,
  restaurantRow,
  firstRestaurantRow,
  formModal,
  updateForm,
} from "./components";
import {
  addFormModeListener,
  addModalCloseListener,
  calculateDistance,
  changeButtonTextToWait,
  checkToken,
  fetchData,
  runAppStartListeners,
  updateTextContent,
} from "./functions";
import { Restaurant } from "./interfaces/Restaurant";
import { apiUrl, positionOptions } from "./variables";

declare const L: any;

const modal = document.querySelector("dialog");
if (!modal) {
  throw new Error("Modal not found");
}

export const renderForms = (isLogin: boolean | null): void => {
  if (isLogin === null || isLogin === undefined) {
    const authDialog: string = formModal(true);
    modal.innerHTML = "";
    modal.insertAdjacentHTML("beforeend", authDialog);
    const form = document.querySelector("#authForm");

    form?.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const formButton = document.querySelector(
        ".form-button"
      ) as HTMLInputElement;
      if (formButton) {
        changeButtonTextToWait(formButton);
      }
      formLogin();
    });

    addFormModeListener();
    addModalCloseListener();
    (modal as any)?.showModal();
  } else {
    updateForm(isLogin);
    console.log("update: " + isLogin);
    const form = document.querySelector("#authForm");
    form?.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const formButton = document.querySelector(
        ".form-button"
      ) as HTMLInputElement;
      if (formButton) {
        changeButtonTextToWait(formButton);
      }
      if (isLogin) {
        formLogin();
      } else {
        formRegister();
      }
    });
  }
};

const createTable = (restaurants: Restaurant[]): void => {
  const menuContainer = document.querySelector(".menu-container");
  if (!menuContainer) {
    throw new Error("Table not found");
  }
  menuContainer.innerHTML = "";
  let isFirstRestaurant = true;
  restaurants.forEach((restaurant: Restaurant, index) => {
    const menuItem = isFirstRestaurant
      ? (() => {
          isFirstRestaurant = false;
          return firstRestaurantRow(restaurant);
        })()
      : restaurantRow(restaurant, index);
    menuContainer.appendChild(menuItem);

    //add marker
    const x1 = restaurant.location.coordinates[0];
    const x2 = restaurant.location.coordinates[1];
    const marker = L.marker([x2, x1]).addTo(map);
    console.log(marker);
    marker.bindPopup(`<h3>${restaurant.name}</h3><p>${restaurant.address}</p>`);
  });
};

const error = (err: GeolocationPositionError): void => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos: GeolocationPosition): Promise<void> => {
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
    (modal as any).showModal();
  }
};

const formRegister = async (): Promise<void> => {
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
const formLogin = async (): Promise<void> => {
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
export const formUpdate = async (): Promise<void> => {
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
export const uploadPfp = async (pfp: File): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  const formData = new FormData();
  formData.append("avatar", pfp);

  const options: RequestInit = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  };
  await fetchData(apiUrl + "/users/avatar", options);
  checkToken();
};

// create map
const map = L.map("map").setView([60.1699, 24.9384], 8);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

runAppStartListeners();
checkToken();

window.addEventListener("resize", updateTextContent);
navigator.geolocation.getCurrentPosition(success, error, positionOptions);
