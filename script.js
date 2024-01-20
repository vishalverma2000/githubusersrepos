const profileDiv = document.getElementById("profileDiv");
const avatarContainer = document.getElementById("avatar-container");
const repoContainer = document.getElementById("repo-container");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const loader = document.getElementById("loader");

let currentPage = 1;
const reposPerPage = 100;

async function loadProfile(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const user = await response.json();
    profileDiv.innerHTML = `
      <h1 id="name">${user.name}</h1>
      <p>${user.bio}</p>
      <span>${user.location}</span><br />
      <a href="${user.blog}" target="_blank">${user.blog}</a>
    `;

    avatarContainer.innerHTML = `
      <img
        src="${user.avatar_url}"
        alt=""
        style="height: 200px; width: 200px"
        class="rounded-circle"
      />
      <span class="">${user.html_url}</span>
    `;
  } catch (error) {
    console.error("Error fetching user data", error);
  }
}

async function loadRepo(username) {
  try {
    loader.style.display = "block";
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${reposPerPage}&page=${currentPage}`
    );
    const repos = await response.json();

    // Clear previous content
    repoContainer.innerHTML = "";

    repos.map(repo => {
      repoContainer.innerHTML += `
        <div class="border border-black p-2">
          <h2 class="name">${repo.name}</h2>
          <p class="description">${
            repo.description || "No description available"
          }</p>
          <div class="stack_container">
            <span class="stack">${repo.language || "Unknown language"}</span>
          </div>
        </div>
      `;
    });

    loader.style.display = "none";
  } catch (error) {
    console.error("Error fetching user data", error);
  }
}

function searchUser() {
  const username = searchInput.value.trim();
  if (username !== "") {
    currentPage = 1; // Reset page when searching a new user
    loadProfile(username);
    loadRepo(username);
  }
}

searchButton.addEventListener("click", searchUser);

// Load default user on page load
loadProfile("johnpapa");
loadRepo("johnpapa");
