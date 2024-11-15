document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // Helper to read the db.json file (mocking a database read)
  async function fetchLinks() {
    const response = await fetch('db.json');
    const data = await response.json();
    return data.links;
  }

  async function saveLink(shortnerName, originalUrl) {
    const response = await fetch('db.json', {
      method: 'POST',
      body: JSON.stringify({ shortner_name: shortnerName, shortner_url: originalUrl }),
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  }

  // Render Home Page (URL Form)
  function renderHome() {
    app.innerHTML = `
      <h1 class="text-3xl font-bold mb-4">URL Shortener</h1>
      <form id="shorten-form" class="space-y-4">
        <div>
          <label for="original-url" class="block text-lg">Original URL:</label>
          <input id="original-url" type="url" class="w-full p-2 border rounded" required />
        </div>
        <div>
          <label for="short-name" class="block text-lg">Short Name:</label>
          <input id="short-name" type="text" class="w-full p-2 border rounded" required />
        </div>
        <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Generate Short URL</button>
      </form>
      <div id="message" class="mt-4 text-lg text-center"></div>
      <div id="short-url" class="mt-4 text-center"></div>
    `;

    document.getElementById('shorten-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalUrl = document.getElementById('original-url').value;
      const shortName = document.getElementById('short-name').value;
      const messageElement = document.getElementById('message');
      const shortUrlElement = document.getElementById('short-url');

      // Check if the short name exists
      const links = await fetchLinks();
      const existingLink = links.find(link => link.shortner_name === shortName);

      if (existingLink) {
        messageElement.textContent = 'URL Shortener name already exists!';
        shortUrlElement.textContent = '';
        return;
      }

      // Save the new shortened link
      await saveLink(shortName, originalUrl);
      messageElement.textContent = 'URL Shortener generated successfully!';
      shortUrlElement.innerHTML = `Short URL: <a href="/${shortName}" class="text-blue-500">${window.location.origin}/${shortName}</a>`;
    });
  }

  // Render Redirect Page (to handle short URL)
  async function renderRedirect(shortName) {
    const links = await fetchLinks();
    const link = links.find(link => link.shortner_name === shortName);

    if (!link) {
      app.innerHTML = `<h2 class="text-xl text-red-500">Short URL Not Found!</h2>`;
      return;
    }

    window.location.href = link.shortner_url;
  }

  // Handle URL Redirects
  const path = window.location.pathname;
  if (path === '/') {
    renderHome();
  } else {
    const shortName = path.substring(1); // Extract short name from the URL
    renderRedirect(shortName);
  }
});
