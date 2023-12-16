document.addEventListener('DOMContentLoaded', () => {
    fetch('status.json')
      .then(response => response.json())
      .then(data => displayStatus(data.components))
      .catch(error => console.error('Error fetching status:', error));
  });
  
  function displayStatus(components) {
    const componentsSection = document.getElementById('components');
    components.forEach(component => {
      const componentDiv = document.createElement('div');
      componentDiv.className = 'component';
      componentDiv.innerHTML = `
        <h2>${component.name}</h2>
        <p>Status: ${component.status}</p>
        <p>${component.details}</p>
        <p>Last Updated: ${new Date(component.lastUpdated).toLocaleString()}</p>
      `;
      componentsSection.appendChild(componentDiv);
    });
  }
  