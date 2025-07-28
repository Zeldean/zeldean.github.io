# Dean van Zyl — Personal CV Website

This is the source for my personal website, built as a dynamic single-page portfolio using HTML, CSS, and JavaScript.

## 📦 Structure

The project is organized as follows:

```

.
├── assets/              # Images, icons, fonts, data, PDF
├── css/                 # Modular stylesheets
├── js/                  # JavaScript modules (DOM logic, injection)
├── index.html           # Main HTML structure (sections hardcoded)
└── README.md

```

## 🚀 How It Works

- The `index.html` contains static HTML section structure for:
  - About
  - Skills
  - Education
  - Projects
  - Experience
  - Extracurricular
  - Contact
  - CV Download

- The content inside these sections is dynamically injected using JavaScript.

### 🔧 Dynamic Data Loading

- All personal and project data is stored in `assets/dean_data.json`.
- On page load, `js/dataLoader.js`:
  - Fetches the JSON file
  - Parses the data
  - Populates the corresponding DOM elements inside each section
- Utility functions (like age calculation) are defined in `js/utils.js`.

### 📁 Key Scripts

- `dataLoader.js` — handles all dynamic injection
- `cvDownloadHandler.js` — triggers PDF CV download
- `splashHeaderController.js` — manages splash overlay and scroll behavior
- `navController.js` — controls side navigation and scroll visibility

### 📡 Deployment

This site is hosted via GitHub Pages.

---

### 🙋‍♂️ Author

**Dean van Zyl**  
[zeldean.me](https://zeldean.me)  
