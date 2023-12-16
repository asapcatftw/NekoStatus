document.addEventListener('DOMContentLoaded', () => {
    fetchServices();
  });
  
  function fetchServices() {
    fetch('services')
      .then(response => response.json())
      .then(services => {
        services.forEach(service => {
          fetch(`services/${service}.json`)
            .then(response => response.json())
            .then(data => displayService(data))
            .catch(error => console.error(`Error fetching ${service} data:`, error));
        });
      })
      .catch(error => console.error('Error fetching services list:', error));
  }
  
  function displayService(service) {
    const componentsSection = document.getElementById('components');
    const componentDiv = document.createElement('div');
    componentDiv.className = 'component';
    componentDiv.innerHTML = `
      <h2>${service.name}</h2>
      <p>Status: <span class="${getStatusColorClass(service.status)}">${service.status}</span></p>
      <p>${service.details}</p>
      <p>Last Updated: ${new Date(service.lastUpdated).toLocaleString()}</p>
    `;
    componentsSection.appendChild(componentDiv);
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
  