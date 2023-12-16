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
        <p>Status: <span class="${getStatusColorClass(component.status)}">${component.status}</span></p>
        <p>${component.details}</p>
        <p>Last Updated: ${new Date(component.lastUpdated).toLocaleString()}</p>
      `;
      componentsSection.appendChild(componentDiv);
    });
  }
  
  function getStatusColorClass(status) {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'status-green';
      case 'degraded':
        return 'status-yellow';
      case 'down':
        return 'status-red';
      default:
        return 'status-gray';
    }
  }
  