// script.js

// Function to fetch service status from JSON file
function fetchServiceStatus(service) {
  $.ajax({
    url: 'services/' + service + '.json',
    dataType: 'json',
    success: function(data) {
      updateStatus(data);
    },
    error: function() {
      console.error('Error fetching service status for ' + service + '.');
    }
  });
}

// Function to fetch maintenance status from JSON file
function fetchMaintenanceStatus() {
  $.ajax({
    url: 'maintenance.json', // Adjust the file name as needed
    dataType: 'json',
    success: function(data) {
      updateMaintenanceStatus(data);
    },
    error: function() {
      console.error('Error fetching maintenance status.');
    }
  });
}

// Function to update the status container with service status
function updateStatus(statusData) {
  var statusContainer = $('#status-container');

  // Map the status to Bootstrap text color class
  var statusClass = getStatusClass(statusData.status);

  var serviceCardHtml = `
    <div class="card mb-3">
      <div class="card-body p-2">
        <div class="row">
          <div class="col-8">
            <h6 class="card-title mb-1 font-weight-bold">${statusData.name}</h6>
          </div>
          <div class="col-4 text-end">
            <p class="card-text m-0"><span class="${statusClass}">${statusData.status}</span></p>
          </div>
        </div>
      </div>
    </div>
  `;

  statusContainer.append(serviceCardHtml);
}

// Function to update the maintenance status
function updateMaintenanceStatus(maintenanceData) {
  var maintenanceStatusContainer = $('#maintenance-status');

  // Map the status to Bootstrap text color class
  var statusClass = getStatusClass(maintenanceData.status);

  var maintenanceStatusHtml = `
  <div class="card mb-3">
    <div class="card-body p-2">
      <div class="row">
        <div class="col-8">
          <h6 class="card-title mb-1 font-weight-bold">Maintenance</h6>
        </div>
        <div class="col-4 text-end">
          <p class="card-text m-0"><span class="${statusClass}">${maintenanceData.status}</span></p>
        </div>
      </div>
    </div>
  </div>
`;

  maintenanceStatusContainer.append(maintenanceStatusHtml);
}

// Function to map status to Bootstrap text color class
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'operational':
      return 'text-success';
    case 'degraded':
      return 'text-warning';
    case 'down':
      return 'text-danger';
    default:
      return '';
  }
}

// Fetch maintenance status and service status for each service on page load
$(document).ready(function() {
  fetchMaintenanceStatus();

  var services = ['web-server', 'database', 'email-service', 'notification-service'];

  services.forEach(function(service) {
    fetchServiceStatus(service);
  });
});
