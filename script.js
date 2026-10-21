const githubUsername = "MmabathoT";
const excludedProjectSlugs = new Set([
  "octocat_supply-template_",
  "SmartDesk-Azure-Lab",
]);

const featuredProjects = [
  {
    name: "Kinetix",
    slug: "Kinetix--The-study-of-motion-App-NEW",
    icon: "KX",
    category: "Fitness · Web & Android",
    description:
      "A fitness-tracking app for logging activities, exploring workout history, and optionally sharing a live route.",
    technologies: ["JavaScript", "Node.js", "Capacitor"],
  },
  {
    name: "Tally",
    slug: "Calculator-App-Purple",
    icon: "T",
    category: "Productivity · Web app",
    description:
      "A responsive calculator with scientific, graphing, programmer, date, and unit-conversion tools.",
    technologies: ["JavaScript", "HTML", "CSS"],
  },
  {
    name: "Reabetswe Technologies",
    slug: "Reabetswe-Technologies",
    icon: "RT",
    category: "Education · Multi-page website",
    description:
      "A coding and IT learning website for young people, with programme, curriculum, lesson, and profile pages.",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
];

const projectGrid = document.querySelector("#project-grid");
const projectStatus = document.querySelector("#project-status");
const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function renderProjects(repositories) {
  const featuredBySlug = new Map(
    featuredProjects.map((project, index) => [
      project.slug,
      { ...project, order: index },
    ]),
  );

  const projects = repositories
    .filter(
      (repository) =>
        repository.owner.login.toLowerCase() === githubUsername.toLowerCase() &&
        !excludedProjectSlugs.has(repository.name),
    )
    .map((repository) => {
      const featured = featuredBySlug.get(repository.name);

      return {
        name: featured?.name ?? repository.name.replaceAll("-", " "),
        slug: repository.name,
        icon: featured?.icon ?? repository.name.slice(0, 2).toUpperCase(),
        category:
          featured?.category ??
          (repository.language ? `${repository.language} · GitHub project` : "GitHub project"),
        description:
          featured?.description ??
          repository.description ??
          "A public project from my GitHub portfolio.",
        technologies:
          featured?.technologies ??
          (repository.language ? [repository.language, "GitHub"] : ["GitHub"]),
        url: repository.html_url,
        language: repository.language,
        stars: repository.stargazers_count,
        order: featured?.order ?? featuredProjects.length + repository.name.toLowerCase().charCodeAt(0),
      };
    })
    .sort((first, second) => first.order - second.order);

  projectGrid.innerHTML = projects
    .map((project, index) => {
      const tags = project.technologies
        .map((technology) => `<span>${escapeHtml(technology)}</span>`)
        .join("");
      const language = project.language
        ? `<span>${escapeHtml(project.language)}</span>`
        : "<span>GitHub project</span>";
      const stars = project.stars > 0 ? `<span>★ ${project.stars}</span>` : "";

      return `
        <article class="project-card project-${index % 5}">
          <div class="project-card-top">
            <span class="project-icon" aria-hidden="true">${escapeHtml(project.icon)}</span>
            <a
              class="project-link"
              href="${escapeHtml(project.url)}"
              target="_blank"
              rel="noreferrer"
              aria-label="View ${escapeHtml(project.name)} on GitHub"
            >↗</a>
          </div>
          <p class="project-type">${escapeHtml(project.category)}</p>
          <h3>${escapeHtml(project.name)}</h3>
          <p class="project-description">${escapeHtml(project.description)}</p>
          <div class="project-tags">${tags}</div>
          <div class="project-meta">${language}${stars}</div>
        </article>
      `;
    })
    .join("");

  projectGrid.setAttribute("aria-busy", "false");
  observeProjectCards();
}

let revealObserver;

function observeProjectCards() {
  if (!revealObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  projectGrid.querySelectorAll(".project-card").forEach((card, index) => {
    card.classList.add("reveal-on-scroll");
    card.style.setProperty("--reveal-delay", `${index * 100}ms`);
    revealObserver.observe(card);
  });
}

function enableScrollReveals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.body.classList.add("motion-ready");

  if (!("IntersectionObserver" in window)) {
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
  );

  const revealTargets = document.querySelectorAll(
    ".about-section > .section-heading, .about-content, .projects-heading, .projects-intro, " +
      ".timeline-item, .learning-layout > .section-heading, .learning-item, .contact-card",
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-on-scroll");
    target.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
    revealObserver.observe(target);
  });

  observeProjectCards();
}

async function loadPublicProjects() {
  const fallbackRepositories = featuredProjects.map((project) => ({
    name: project.slug,
    owner: { login: githubUsername },
    html_url: `https://github.com/${githubUsername}/${encodeURIComponent(project.slug)}`,
    language: project.technologies[0] ?? null,
    stargazers_count: 0,
    description: project.description,
  }));

  renderProjects(fallbackRepositories);

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?type=owner&per_page=100&sort=updated`,
      {
        headers: { Accept: "application/vnd.github+json" },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status} ${response.statusText}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("GitHub returned an unexpected repository list.");
    }

    renderProjects(repositories);
    projectStatus.textContent = "Showing public repositories from GitHub. Private repositories are not displayed.";
  } catch (error) {
    console.error("Unable to refresh public GitHub repositories.", error);
    projectStatus.textContent =
      "Live GitHub data is unavailable right now. Showing the latest featured projects instead.";
    projectGrid.setAttribute("aria-busy", "false");
  }
}

function closeNavigation() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  siteNavigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNavigation.classList.toggle("is-open", !isOpen);
});

siteNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeNavigation();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

enableScrollReveals();
loadPublicProjects();
