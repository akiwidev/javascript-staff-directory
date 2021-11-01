// data structure - an array of objects - for staff
const staff = JSON.parse(localStorage.getItem('staff')) || [];

// helper functions
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const addEditAndDeleteEventListeners = () => {
  const editStaff = Array.from(document.querySelectorAll(".edit"));
  editStaff.forEach((edit) => {
    edit.addEventListener("click", editStaffMember);
  });

  const deleteStaff = Array.from(document.querySelectorAll(".delete"));
  deleteStaff.forEach((del) => {
    del.addEventListener("click", deleteStaffMember);
  });
};

const getStaffMemberIndex = (first, last) => {
  const index = staff.findIndex(
    (staffMember) =>
      staffMember.firstName === first && staffMember.lastName === last
  );
  return index;
};

const insertStaff = (staff) => {
  staffList.insertAdjacentHTML(
    "beforeend",
    `<div class="staff-card">
      <h1 class="full-name">${capitalizeFirstLetter(
      staff.firstName
    )} ${capitalizeFirstLetter(staff.lastName)}</h1>
      <p class="role">${capitalizeFirstLetter(staff.position)}</p>
      <div>
        <a href="" class="delete white-to-green-btn">Delete</a>
        <a href="" class="edit white-to-green-btn">Edit</a>
      </div>
    </div>`
  );
};

const updateStaffDetails = (event) => {
  event.preventDefault();
  let currentFullName = event.currentTarget.parentElement.parentElement.querySelector(
    ".full-name"
  );
  let currentFirst = event.currentTarget.parentElement.parentElement
    .querySelector(".full-name")
    .innerText.split(" ")[0]
    .toLowerCase();
  let currentLast = event.currentTarget.parentElement.parentElement
    .querySelector(".full-name")
    .innerText.split(" ")[1]
    .toLowerCase();
  let currentRole = event.currentTarget.parentElement.parentElement.querySelector(
    ".role"
  );

  let newFirst = currentFirst;
  let newLast = currentLast;
  let newRole = currentRole.innerText;

  if (document.getElementById("new-first").value) {
    newFirst = document.getElementById("new-first").value;
  }

  if (document.getElementById("new-last").value) {
    newLast = document.getElementById("new-last").value;
  }

  if (document.querySelector('input[name="role"]:checked')) {
    newRole = document.querySelector('input[name="role"]:checked').value;
  }

  const staffIndex = getStaffMemberIndex(currentFirst, currentLast);
  staff[staffIndex].firstName = newFirst;
  staff[staffIndex].lastName = newLast;
  staff[staffIndex].position = newRole;

  currentFullName.remove();
  currentRole.remove();
  event.currentTarget.parentElement.parentElement.insertAdjacentHTML(
    "afterbegin",
    `<h1 class="full-name">${capitalizeFirstLetter(
      newFirst
      )} ${capitalizeFirstLetter(newLast)}</h1>
      <p class="role">${capitalizeFirstLetter(newRole)}</p>`
      );
  localStorage.setItem('staff', JSON.stringify(staff));
  document.querySelector(".edit-form").remove();
};

// functions
const validateForm = () => {
  const first = document.forms["addStaffForm"]["first"].value;
  const last = document.forms["addStaffForm"]["last"].value;
  const position = document.forms["addStaffForm"]["position"].value;
  if (first === "" || last === "" || position === "") {
    alert("Please fill out all the options");
    return false;
  } else {
    return true;
  }
};

const displayStaff = (staff) => {
    staff.forEach((staff) => insertStaff(staff));
};

const addStaffMember = (event) => {
  event.preventDefault();
  const result = validateForm();
  if (result) {
    const first = document.getElementById("first").value;
    const last = document.getElementById("last").value;
    const pos = document.getElementById("position").value;
    const newStaff = { firstName: first, lastName: last, position: pos };
    staff.push(newStaff);
    insertStaff(newStaff);
    localStorage.setItem('staff', JSON.stringify(staff));
    document.querySelector(".add-staff-form").reset();
    addEditAndDeleteEventListeners();
  }
};

const deleteStaffMember = (event) => {
  event.preventDefault();
  const fullName = event.currentTarget.parentElement.parentElement.querySelector(
    ".full-name"
  ).innerText;
  const first = fullName.split(" ")[0].toLowerCase();
  const last = fullName.split(" ")[1].toLowerCase();
  const index = getStaffMemberIndex(first, last);
  const result = window.confirm(`Really delete ${fullName}?`);
  if (result) {
    staff.splice(index, 1);
    localStorage.setItem('staff', JSON.stringify(staff));
    event.currentTarget.parentElement.parentElement.remove();
  }
};

const editStaffMember = (event) => {
  event.preventDefault();
  const collapsibleFormHTML = `<form action="#" class="edit-form">
    <label for="update-first-name" class="edit-label">New first name: </label>
    <input type="text" id="new-first" class="edit-input" /><br />
    <label for="update-last-name" class="edit-label">New last name: </label>
    <input type="text" id="new-last" class="edit-input"/><br />
    <label for="update-position" class="edit-label">Role: </label>
    <input type="radio" name="role" value="employee"/> Employee
    <input type="radio" name="role" value="manager" /> Manager<br />
    <input type="submit" value="Update" id="update" class="white-to-green-btn" />
    <input type="submit" value="Close" id="close" class="white-to-green-btn" />
  </form>`;
  event.currentTarget.parentElement.insertAdjacentHTML(
    "afterend",
    collapsibleFormHTML
  );
  const closeBtn = document.getElementById("close");
  closeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.currentTarget.parentElement.remove();
  });

  const updateBtn = document.getElementById("update");
  updateBtn.addEventListener("click", updateStaffDetails);
};

const sortStaffMembers = () => {
  staff.sort((a, b) =>
    a.firstName > b.firstName ? 1 : b.firstName > a.firstName ? -1 : 0
  );
  staffList.innerHTML = "";
  displayStaff();
  addEditAndDeleteEventListeners();
};

// event listeners
const staffList = document.querySelector(".staff");
displayStaff(staff);

const addStaff = document.querySelector(".green-to-white-btn");
addStaff.addEventListener("click", addStaffMember);

addEditAndDeleteEventListeners();

const sortStaff = document.querySelector(".sort-btn");
sortStaff.addEventListener("click", sortStaffMembers);
