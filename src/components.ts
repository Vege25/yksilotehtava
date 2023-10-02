import { Menu, WeekMenu } from "./interfaces/Menu";
import { Restaurant } from "./interfaces/Restaurant";
import { addMenuEventListener } from "./functions";

const restaurantRow = (restaurant: Restaurant) => {
  const { name, address, company } = restaurant;
  const itemContainer = document.createElement("div");
  itemContainer.classList.add("menu-item-container");

  const imgBg = document.createElement("div");
  imgBg.classList.add("restaurant-image-background");

  const img = document.createElement("img");
  img.alt = "restaurant image";
  img.classList.add("menu-food-image");
  img.src = getCompanyImageSource(company);

  const companyContainer = document.createElement("div");
  companyContainer.classList.add("company-container");

  const title = document.createElement("h3");
  title.classList.add("menu-food-title");
  title.textContent = name;
  const description = document.createElement("p");
  description.classList.add("menu-ingredients");
  description.textContent = address;
  companyContainer.appendChild(title);
  companyContainer.appendChild(description);

  const courseContainer = document.createElement("div");
  courseContainer.classList.add("course-container");

  const menuText = document.createElement("h4");
  menuText.classList.add("menu-text");
  menuText.textContent = "Katso Menut";

  const courseNav = document.createElement("div");
  courseNav.classList.add("course-nav");

  const courseButton1 = document.createElement("button");
  const courseButton2 = document.createElement("button");
  courseButton1.id = "dailyMenuButton";
  courseButton2.id = "weeklyMenuButton";
  courseButton1.textContent = "Päivä";
  courseButton2.textContent = "Viikko";
  courseNav.appendChild(courseButton1);
  courseNav.appendChild(courseButton2);
  courseContainer.appendChild(menuText);
  courseContainer.appendChild(courseNav);

  imgBg.appendChild(img);
  itemContainer.appendChild(imgBg);
  itemContainer.appendChild(companyContainer);
  itemContainer.appendChild(courseContainer);

  addMenuEventListener(courseButton1, courseButton2, restaurant);

  return itemContainer;
};
const firstRestaurantRow = (restaurant: Restaurant) => {
  const firstItemContainer = document.createElement("div");
  firstItemContainer.classList.add("first-menu-item-container");

  const info = document.createElement("div");
  info.classList.add("first-restaurant-info");
  const goldenPick = document.createElement("h3");
  goldenPick.textContent = "Tähti valinta";

  const h2 = document.createElement("h2");
  h2.textContent = "Lähimpänä sinua";
  info.appendChild(goldenPick);
  info.appendChild(h2);

  const restaurantRowElement = restaurantRow(restaurant);

  firstItemContainer.appendChild(info);
  firstItemContainer.appendChild(restaurantRowElement);
  return firstItemContainer;
};

const getCompanyImageSource = (company: string) => {
  if (company === "Sodexo") {
    return "../images/sodexo.png";
  } else if (company === "Compass Group") {
    return "../images/compass.png";
  } else {
    return "../images/burger.png";
  }
};

const restaurantModal = (restaurant: Restaurant, menu: Menu) => {
  const { name, address, city, postalCode, phone, company } = restaurant;
  const url = getCompanyImageSource(company);
  let html = `<div class="dialog-company-container">
      <div class="dialog-left-info">
        <img src="${url}" alt=""company logo/>
        <h3>${name}</h3>
      </div>
      <div class="dialog-company-info">
      <h3>Tiedot:</h3>
      <p>${address} ${postalCode} ${city}</p>
      <p>${phone}</p>
      </div>
      </div>
      <div class="table-container">
      <table>
        <tr class="sticky-row">
          <th>Ruokalaji</th>
          <th>Ruokavalio</th>
          <th>Hinta</th>
        </tr>
      `;
  menu.courses.forEach((course) => {
    const { name, diets, price } = course;
    html += `
            <tr>
              <td>${name}</td>
              <td>${diets ?? " - "}</td>
              <td>${price ?? " - "}</td>
            </tr>
            `;
  });
  html += `</table></div>`;
  return html;
};

const weeklyRestaurantModal = (restaurant: Restaurant, menu: WeekMenu) => {
  const { name, address, city, postalCode, phone, company } = restaurant;
  const url = getCompanyImageSource(company);
  let html = `<div class="dialog-company-container">
      <div class="dialog-left-info">
        <img src="${url}" alt=""company logo/>
        <h3>${name}</h3>
      </div>
      <div class="dialog-company-info">
      <h3>Tiedot:</h3>
      <p>${address} ${postalCode} ${city}</p>
      <p>${phone}</p>
      </div>
      </div>
      <div class="table-container">
      <table>
        <tr class="sticky-row">
          <th>Ruokalaji</th>
          <th>Ruokavalio</th>
          <th>Hinta</th>
        </tr>
      `;
  menu.days.forEach((day) => {
    const { courses, date } = day;
    html += `
            <tr class="date-tr">
              <td>${date}</td>
              <td></td>
              <td></td>
            </tr>
            `;
    courses.forEach((course) => {
      const { name, diets, price } = course;
      html += `
      <tr>
        <td>${name}</td>
        <td>${diets ?? " - "}</td>
        <td>${price ?? " - "}</td>
      </tr>`;
    });
  });

  html += `</table></div>`;
  return html;
};

const errorModal = (message: string) => {
  const html = `
          <h3>Error</h3>
          <p>${message}</p>
          `;
  return html;
};

const loginModal = () => {
  let html = `<div>LOGIN</div> `;
  return html;
};

export {
  restaurantRow,
  firstRestaurantRow,
  restaurantModal,
  errorModal,
  loginModal,
  weeklyRestaurantModal,
};
