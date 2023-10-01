import { Menu } from "./interfaces/Menu";
import { Restaurant } from "./interfaces/Restaurant";

const restaurantRow = (restaurant: Restaurant) => {
  const { name, address, company } = restaurant;
  /*const tr = document.createElement("tr");
  const nameCell = document.createElement("td");
  nameCell.innerText = name;
  const addressCell = document.createElement("td");
  addressCell.innerText = address;
  const companyCell = document.createElement("td");
  companyCell.innerText = company;
  tr.appendChild(nameCell);
  tr.appendChild(addressCell);
  tr.appendChild(companyCell);
  return tr;*/
  const itemContainer = document.createElement("div");
  itemContainer.classList.add("menu-item-container");

  const img = document.createElement("img");
  img.alt = "restaurant image";
  img.classList.add("menu-food-image");
  img.src = getCompanyImageSource(company);

  const title = document.createElement("h3");
  title.classList.add("menu-food-title");
  title.textContent = name;
  const description = document.createElement("p");
  description.classList.add("menu-ingredients");
  description.textContent = address;
  itemContainer.appendChild(img);
  itemContainer.appendChild(title);
  itemContainer.appendChild(description);
  return itemContainer;
};
const firstRestaurantRow = (restaurant: Restaurant) => {
  const firstItemContainer = document.createElement("div");
  firstItemContainer.classList.add("first-menu-item-container");

  const info = document.createElement("div");
  info.classList.add("first-restaurant-info");
  const h2 = document.createElement("h2");
  h2.textContent = "Lähimpänä sinua";
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
  let html = `<h3>${name}</h3>
      <p>${company}</p>
      <p>${address} ${postalCode} ${city}</p>
      <p>${phone}</p>
      <table>
        <tr>
          <th>Course</th>
          <th>Diet</th>
          <th>Price</th>
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
  html += "</table>";
  return html;
};

const errorModal = (message: string) => {
  const html = `
          <h3>Error</h3>
          <p>${message}</p>
          `;
  return html;
};

export { restaurantRow, firstRestaurantRow, restaurantModal, errorModal };
