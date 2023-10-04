import "./style.css";

import {
  errorModal,
  restaurantModal,
  restaurantRow,
  firstRestaurantRow,
  formModal,
} from "./components";
import { addFormModeListener, fetchData } from "./functions";
import { Menu } from "./interfaces/Menu";
import { Restaurant } from "./interfaces/Restaurant";
import { apiUrl, positionOptions } from "./variables";

const dialog = document.querySelector("dialog");
const navTitle = document.querySelector(".nav-title");
const profileButtons = document.querySelectorAll("#loginButton");
const hamburgerMenuButton = document.querySelector("#hamburgerMenuButton");
const navButtons = document.querySelectorAll(".nav-link");

navButtons.forEach((navButton) => {
  navButton.addEventListener("click", () => {
    const miniNav = document.querySelector(".mini-nav");
    const restaurantMap = document.querySelector("#restaurantMap");
    if (!miniNav || !restaurantMap) {
      return;
    }
    let navElement;
    if (navButton.id === "restaurants") {
      navElement = miniNav;
    } else if (navButton.id === "map") {
      navElement = restaurantMap;
    } else {
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
      (menuItem as HTMLElement).style.display = "block";
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
  //TODO check if user is logged in then give true
  //TODO if not give false and register menu will be rendered
  let isLogin = false;
  profileButton.addEventListener("click", () => {
    renderForms(isLogin);
  });
});

export const renderForms = (isLogin: boolean): void => {
  const authDialog = formModal(isLogin);
  modal.innerHTML = "";
  modal.insertAdjacentHTML("beforeend", authDialog);
  addFormModeListener();
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
    /*menuItem.addEventListener("click", async () => {
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
    });*/
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

navigator.geolocation.getCurrentPosition(success, error, positionOptions);
