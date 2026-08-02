
import { calculateAge } from './utils/ageCalc.js';
const prefix = window.__assetPrefix || './';

const ICON_MAP = {
  github: 'icon_github.png',
  linkedin: 'icon_linkedin.png',
  reddit: 'icon_reddit.png',
  website: 'icon_globe.png'
};

window.addEventListener('DOMContentLoaded', async () => {
  try {
    await populateAbout();
    // populateSkills(data.skills);
    // populateEducation(data.education);
    // populateProjects(data.projects);
    // populateExperience(data.experience);
    // populateContact(data.contacts);
    
  } catch (err) {
    console.error('1 - Failed to load data:', err);
  }
});

async function populateAbout() {
  console.info("START populateAbout")

  try {
    
    // Parallel fetch all data
    const [{about}, {bio: {summary}}, {contacts: {socials}}] = await Promise.all([
      fetch(`${prefix}data/about.json`).then(r => r.json()),
      fetch(`${prefix}data/bio.json`).then(r => r.json()),
      fetch(`${prefix}data/contacts.json`).then(r => r.json())
    ]);

    document.querySelector('.about-details').innerHTML = `
      <li><strong>Full Name:</strong> ${about.first_name} ${about.middle_names} ${about.surname}</li>
      <li><strong>Nationality:</strong> ${about.nationality}</li>
      <li><strong>Languages:</strong> ${about.languages.join(", ")}</li>
      <li><strong>Location:</strong> ${about.city}, ${about.country}</li>
      <li><strong>Timezone:</strong> ${about.timezone}</li>
      <li><strong>Age:</strong> ${calculateAge(about.dob)}</li>
      <li><strong>Gender:</strong> ${about.gender}</li>
    `;

    document.querySelector('.about-bio').textContent = summary;

    const socialLinks = Object.entries(socials).map(([key, {url}]) => `
      <a href="${url}" target="_blank" aria-label="${key} profile">
        <img src="${prefix}assets/icons/${ICON_MAP[key] || 'icon_link.png'}" alt="${key} logo">
      </a>
    `).join('');
    document.querySelector('.social-links').innerHTML = socialLinks;

  } catch (err) {
    console.error('11 - Failed to load data:', err);
  }

  console.info("END populateAbout")
}

function populateSkills(skills) {
  const grid = document.querySelector('.skills-grid');
  const map = {
    languages: 'Programming Languages',
    frameworks: 'Frameworks & Libraries',
    databases: 'Databases',
    tools: 'Tools & Platforms'
  };
  grid.innerHTML = Object.entries(skills).map(([key, list]) => `
    <div class="skills-category">
      <h3>${map[key] || key}</h3>
      <ul>${list.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
  `).join('');
}

function populateEducation(eduArr) {
  const container = document.getElementById('education-list');
  container.innerHTML = eduArr.map(e => `
    <p><strong>${e.degree}</strong> — ${e.institution} (${e.start_year}-${e.expected_grad})</p>
    ${e.awards ? `<ul>${e.awards.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
  `).join('');
}

function populateProjects(projects) {
  const list = document.querySelector('.project-list');
  list.innerHTML = projects.map(p => `
    <li>
      <strong>${p.name}</strong> — <em>${p.date}</em><br/>
      <span>${p.description}</span><br/>
      <small>Tech: ${p.tech.join(', ')}</small><br/>
      ${['private', 'offline'].includes(p.link) ? `<em>${p.link}</em>` : `<a href="${p.link}" target="_blank">View Project</a>`}
    </li>
  `).join('');
}

function populateExperience(exp) {
  const container = document.getElementById('experience-list');
  container.innerHTML = exp.map(e => `
    <div class="experience-item">
      <h3>${e.role} @ ${e.company} (${e.start_date}-${e.end_date})</h3>
      <p>${e.location}</p>
      <p>${e.description}</p>
    </div>
  `).join('');
}

function populateExtracurricular(list) {
  const ul = document.getElementById('extracurricular-list');
  ul.innerHTML = list.map(item => `<li>${item}</li>`).join('');
}

function populateContact(c) {
  const container = document.getElementById('contact-info');
  container.innerHTML = `
    <p><strong>Phone:</strong> ${c.phone}</p>
    <p><strong>Email:</strong> <a href="mailto:${c.email}">${c.email}</a></p>
    <p><strong>LinkedIn:</strong> <a href="${c.sosials.linkedin}" target="_blank">${c.sosials.linkedin}</a></p>
    <p><strong>GitHub:</strong> <a href="${c.sosials.github}" target="_blank">${c.sosials.github}</a></p>
    <p><strong>Reddit:</strong> <a href="${c.sosials.reddit}" target="_blank">${c.sosials.reddit}</a></p>
    <p><strong>Website:</strong> <a href="${c.sosials.website}" target="_blank">${c.sosials.website}</a></p>
  `;
}
