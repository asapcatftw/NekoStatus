document.addEventListener('DOMContentLoaded', () => {
  fetchServices();
});

function fetchServices() {
  const  serviceNames = ['web-server', 'database', 'email-service', 'payment-gateway', 'notification-service'];

  const componentsSection = document.getElementById('components');

  serviceNames.forEach(serviceName => {
    fetch(`/services/${serviceName}.json`)
      .then(response => response.json())
      .then(service => displayService(service))
      .catch(error => console.error(`Error fetching ${serviceName} data:`, error));
  });
}

function displayService(service) {
  const componentsSection = document.getElementById('components');
  const componentDiv = document.createElement('div');
  componentDiv.className = 'component';
  componentDiv.innerHTML = `
    <h2>${service.name}</h2>
    <p>Status: <span class="status-${getStatusClass(service.status)}">${service.status}</span></p>
    <p>${service.details}</p>
  `;
  componentsSection.appendChild(componentDiv);
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'operational':
      return 'okay';
    case 'degraded':
      return 'degraded';
    case 'down':
      return 'down';
    default:
      return '';
  }
}
