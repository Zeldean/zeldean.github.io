import { calculateAge } from './utils.js';

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('./assets/dean_data.json');
    const data = await res.json();

    populateAbout(data.personal, data.bio, data.contacts.sosials);
    populateSkills(data.skills);
    populateEducation(data.education);
    populateProjects(data.projects);
    populateExperience(data.experience);
    populateExtracurricular(data.extracurricular);
    populateContact(data.contacts);
  } catch (err) {
    console.error('Failed to load data:', err);
  }
});

function populateAbout(personal, bio, socials) {
  const details = document.querySelector('.about-details');
  details.innerHTML = `
    <li><strong>Full Name:</strong> ${personal.first_name} ${personal.middle_names} ${personal.surname}</li>
    <li><strong>Nationality:</strong> South African</li>
    <li><strong>Languages:</strong> ${[personal.home_language, ...personal.other_languages].join(', ')}</li>
    <li><strong>Location:</strong> ${personal.city}, ${personal.country}</li>
    <li><strong>Timezone:</strong> ${personal.timezone}</li>
    <li><strong>Age:</strong> ${calculateAge(personal.dob)}</li>
    <li><strong>Gender:</strong> ${personal.gender}</li>
  `;

  document.querySelector('.about-bio').textContent = bio.summary;

  const socialLinks = document.querySelector('.social-links');
  const iconMap = {
    github: 'icon_github.png',
    linkedin: 'icon_linkedin.png',
    reddit: 'icon_reddit.png',
    website: 'icon_globe.png'
  };
  socialLinks.innerHTML = Object.entries(socials).map(([key, link]) => `
    <a href="${link}" target="_blank" aria-label="${key} profile">
      <img src="assets/icons/${iconMap[key] || 'icon_link.png'}" alt="${key} logo">
    </a>
  `).join('');
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
    <p><strong>${e.degree}</strong> — ${e.institution} (${e.start_year}–${e.expected_grad})</p>
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
      <h3>${e.role} @ ${e.company} (${e.start_date}–${e.end_date})</h3>
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
