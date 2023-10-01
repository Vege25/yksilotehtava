import "./style.css";

import {
  errorModal,
  restaurantModal,
  restaurantRow,
  firstRestaurantRow,
} from "./components";
import { fetchData } from "./functions";
import { Menu } from "./interfaces/Menu";
import { Restaurant } from "./interfaces/Restaurant";
import { apiUrl, positionOptions } from "./variables";

const dialog = document.querySelector("#loginDialog");
const modalCloseButton = document.querySelector("#modal-close-button");
const navTitle = document.querySelector(".nav-title");
const loginButtons = document.querySelectorAll("#loginButton");
loginButtons.forEach((loginButton) => {
  loginButton.addEventListener("click", () => {
    dialog?.showModal();
  });
});
modalCloseButton?.addEventListener("click", (event) => {
  event.preventDefault();
  dialog?.close();
  console.log("closed");
});

function updateTextContent() {
  if (!navTitle) {
    return;
  }
  if (window.innerWidth <= 900) {
    navTitle.textContent = "R";
  } else {
    navTitle.textContent = "Ravintolat";
  }
}
updateTextContent();
window.addEventListener("resize", updateTextContent);

export function openNav() {
  var links = document.getElementById("myLinks");
  if (links) {
    if (links.style.display === "block") {
      links.style.display = "none";
    } else {
      links.style.display = "block";
    }
  }
}
document
  .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
  .forEach((anchor) => {
    anchor.addEventListener("click", function (evt: Event) {
      evt.preventDefault();

      const targetId = this.getAttribute("href")?.substring(1);
      const targetElement = document.getElementById(targetId!);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

const modal = document.querySelector("dialog");
if (!modal) {
  throw new Error("Modal not found");
}
modal.addEventListener("click", () => {
  modal.close();
});

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const createTable = (restaurants: Restaurant[]) => {
  const menuContainer = document.querySelector(".menu-container");
  if (!menuContainer) {
    throw new Error("Table not found");
  }
  menuContainer.innerHTML = "";
  let isFirstRestaurant = true;
  restaurants.forEach((restaurant: Restaurant) => {
    // if it is the first restaurant give make different html for it
    const tr = isFirstRestaurant
      ? (() => {
          isFirstRestaurant = false;
          return firstRestaurantRow(restaurant);
        })()
      : restaurantRow(restaurant);
    menuContainer.appendChild(tr);
    tr.addEventListener("click", async () => {
      try {
        // remove all highlights
        const allHighs = document.querySelectorAll(".highlight");
        allHighs.forEach((high) => {
          high.classList.remove("highlight");
        });
        // add highlight
        tr.classList.add("highlight");
        // add restaurant data to modal
        modal.innerHTML = "";

        // fetch menu
        const menu = await fetchData(
          /*<Menu>*/ apiUrl + `/restaurants/daily/${restaurant._id}/fi`
        );
        console.log(menu);

        const menuHtml = restaurantModal(restaurant, menu);
        modal.insertAdjacentHTML("beforeend", menuHtml);

        modal.showModal();
      } catch (error) {
        modal.innerHTML = errorModal((error as Error).message);
        modal.showModal();
      }
    });
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

    if (!sodexoBtn) {
      throw new Error("compassBtn not found");
    }
    sodexoBtn.addEventListener("click", () => {
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
      createTable(restaurants);
    });
  } catch (error) {
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }
};

navigator.geolocation.getCurrentPosition(success, error, positionOptions);
