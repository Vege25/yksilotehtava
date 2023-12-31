import { Menu, WeekMenu } from "./interfaces/Menu";
import { Restaurant } from "./interfaces/Restaurant";
import { addMenuEventListener } from "./functions";
import { User } from "./interfaces/User";

const restaurantRow = (
  restaurant: Restaurant,
  index: number
): HTMLDivElement => {
  const { name, address, company } = restaurant;
  const itemContainer = document.createElement("div");
  itemContainer.classList.add("menu-item-container");
  if (index >= 7) {
    itemContainer.style.display = "none";
  }

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
const firstRestaurantRow = (restaurant: Restaurant): HTMLDivElement => {
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

  const restaurantRowElement = restaurantRow(restaurant, 0);

  firstItemContainer.appendChild(info);
  firstItemContainer.appendChild(restaurantRowElement);
  return firstItemContainer;
};

const getCompanyImageSource = (company: string): string => {
  if (company === "Sodexo") {
    return "./images/sodexo.png";
  } else if (company === "Compass Group") {
    return "./images/compass.png";
  } else {
    return "./images/burger.png";
  }
};

const restaurantModal = (restaurant: Restaurant, menu: Menu): string => {
  const { name, address, city, postalCode, phone, company } = restaurant;
  const url = getCompanyImageSource(company);
  let html = `
  <div class="dialog-company-container">
      <div class="dialog-left-info">
        <img src="${url}" alt="company logo"/>
        <h3>${name}</h3>
      </div>
      <div class="dialog-company-info">
      <h3>Tiedot:</h3>
      <p>${address} ${postalCode} ${city}</p>
      <p>${phone}</p>
      </div>
      <button class="dialog-close-button" id="dialogCloseButton">X</button>
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

const weeklyRestaurantModal = (
  restaurant: Restaurant,
  menu: WeekMenu
): string => {
  const { name, address, city, postalCode, phone, company } = restaurant;
  const url = getCompanyImageSource(company);
  let html = `
  <div class="dialog-company-container">
      <div class="dialog-left-info">
        <img src="${url}" alt=""company logo/>
        <h3>${name}</h3>
      </div>
      <div class="dialog-company-info">
      <h3>Tiedot:</h3>
      <p>${address} ${postalCode} ${city}</p>
      <p>${phone}</p>
      </div>
      <button class="dialog-close-button" id="dialogCloseButton">X</button>
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

const errorModal = (message: string): string => {
  const html = `
          <h3>Error</h3>
          <p>${message}</p>
          `;
  return html;
};

const formModal = (isLoginForm: boolean): string => {
  let html = `
  <div class="forms-container">
    <div class="forms-top-container">
    <h2 id="loginH2">${isLoginForm ? "Kirjaudu" : "Luo käyttäjä"}</h2>
    <button class="dialog-close-button" id="dialogCloseButton">X</button>
    </div>
    <div class="slider-container">
      <input type="checkbox" id="formModeCheckbox" class="slider-checkbox">
      <label id="login-label" for="formModeCheckbox" class="slider-label">Kirjaudu</label>
      <label id="register-label" for="formModeCheckbox" class="slider-label">Rekisteröidy</label>
    </div>
    <form method="dialog" id="authForm">
      <input type="text" id="usernameInput" name="username" class="modal-input" autocomplete="name" placeholder="Käyttäjätunnus" minlenght="3" required><br>
      ${
        isLoginForm
          ? ""
          : `<input type="email" id="emailInput" name="email" class="modal-input" autocomplete="email" placeholder="Sähköposti" required><br>`
      }
      <input type="password" id="passwordInput" name="password" class="modal-input" placeholder="Salasana" required><br>
      <button class="form-button" type="submit" value="submit" id="${
        isLoginForm ? "loginButton" : "registerButton"
      }">${isLoginForm ? "Kirjaudu" : "Luo käyttäjä"}</button>
    </form>
  </div> `;
  return html;
};
const updateForm = (isLoginForm: boolean): void => {
  const form = document.querySelector("#authForm");
  if (!form) {
    return;
  }
  form.innerHTML = "";
  const newForm = `
      <input type="text" id="usernameInput" name="username" class="modal-input" autocomplete="name" placeholder="Käyttäjätunnus" minlenght="3" required><br>
      ${
        isLoginForm
          ? ""
          : `<input type="email" id="emailInput" name="email"  class="modal-input" autocomplete="email" placeholder="Sähköposti" required><br>`
      }
      <input type="password" id="passwordInput" name="password" class="modal-input" placeholder="Salasana"  required><br>
      <button class="form-button" type="submit" value="submit" id="${
        isLoginForm ? "loginButton" : "registerButton"
      }">${isLoginForm ? "Kirjaudu" : "Luo käyttäjä"}</button>`;
  form.insertAdjacentHTML("beforeend", newForm);
  const loginH2 = document.querySelector("#loginH2");
  if (!loginH2) {
    return;
  }
  loginH2.textContent = `${isLoginForm ? "Kirjaudu" : "Luo Käyttäjä"}`;
};
const addUserDataToModal = (user: User): string => {
  let imageSrc: string;
  if (user.avatar != null) {
    imageSrc =
      "https://student-restaurants.azurewebsites.net/uploads/" + user.avatar;
  } else {
    imageSrc = "./images/defaultIcon.jpeg";
  }
  return `
  <div class="dialog-profile-container">
  <div class="dialog-profile-main profile-item-container">
    <div class="profile-pfp-update-container">
      <input id="profilePicUploadInput" type="file" name="pfp">
      <div class="pfp-container">
        <label for="profilePicUploadInput" >
          <div id="profileImage" for="pfp" style="background-image: url(${imageSrc})"></div>
          <i class="fa-solid fa-camera" for="pfp"></i>
        </label>
      </div>
    </div>
    <h2 class="profile-username">${user.username} profiili</h2>
    <form method="dialog" id="updateForm">
      <input type="text" name="username" id="usernameInput" class="modal-input" autocomplete="name" placeholder="${user.username}" minlenght="3" required></input><br>
      <input type="email" name="email" id="emailInput" name="email" class="modal-input" autocomplete="email" placeholder="${user.email}" required></input>
      <button class="form-button" type="submit" value="submit" id="saveProfileButton">Tallenna</button>
    </form>
  </div>
  <div class="dialog-profile-settings profile-side profile-item-container">
    <div class="profile-setting-top profile-top">
      <h3>Sivusto asetukset</h3>
      <button class="dialog-close-button" id="dialogCloseButton">X</button>
    </div><hr>
    <div class="profile-setting-main">
      <button class="form-button" id="logOutButton">Kirjaudu ulos</button>
    </div>
  </div>
  <div class="dialog-profile-favourite profile-side profile-item-container">
    <div class="profile-favourite-top profile-top">
      <h3>Suosikki ravintola</h3>
    </div><hr>
    <div class="profile-favourite-main"  id="favouriteMain">
      <p>Ei suosikkia</p>
    </div>
  </div>
  </div>
  `;
};

export {
  restaurantRow,
  firstRestaurantRow,
  restaurantModal,
  errorModal,
  formModal,
  updateForm,
  weeklyRestaurantModal,
  addUserDataToModal,
};
