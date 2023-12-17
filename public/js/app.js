// script.js

$(document).ready(function () {
  // Toggle Switch Theme
  $('#themeToggle').change(function () {
    if ($(this).is(':checked')) {
      $('html').attr('data-bs-theme', 'dark');
    } else {
      $('html').removeAttr('data-bs-theme');
    }
  });

  // Function to fetch service status from JSON file
  function fetchServiceStatus(service) {
    $.ajax({
      url: 'services/' + service + '.json',
      dataType: 'json',
      success: function (data) {
        updateStatus(data);
      },
      error: function () {
        console.error('Error fetching service status for ' + service + '.');
      }
    });
  }

  // Function to fetch maintenance status from JSON file
  function fetchMaintenanceStatus() {
    $.ajax({
      url: 'maintenance.json',
      dataType: 'json',
      success: function (data) {
        updateMaintenanceStatus(data);
      },
      error: function () {
        console.error('Error fetching maintenance status.');
      }
    });
  }

  // Function to fetch incidents from JSON file
  function fetchIncidents() {
    $.ajax({
      url: 'incidents/incidents.json',
      dataType: 'json',
      success: function (data) {
        updateIncidents(data);
      },
      error: function () {
        console.error('Error fetching incidents.');
      }
    });
  }
// Function to update the status container with service status
function updateStatus(statusData) {
  var statusContainer = $('#status-container');

  var statusClass = getStatusClass(statusData.status);

  var badgeClass = getBadgeClass(statusData.status);

  var serviceCardHtml = `
    <div class="card mb-3 ${statusClass} ${getHoverClass(statusData.status)}">
      <div class="card-body p-2">
        <div class="row">
          <div class="col-8">
            <h6 class="card-title mb-1 font-weight-bold"><strong>${statusData.name}</strong></h6>
          </div>
          <div class="col-4 text-end">
            <span class="badge ${badgeClass}">${statusData.status}</span>
          </div>
        </div>
        <p class="card-text pt-1">${statusData.details}</p>
      </div>
    </div>
  `;

  if (statusData.status.toLowerCase() === 'down' || statusData.status.toLowerCase() === 'degraded') {
    statusContainer.prepend(serviceCardHtml);
  } else {
    statusContainer.append(serviceCardHtml);
  }
}
  // Function to update the maintenance status
  function updateMaintenanceStatus(maintenanceData) {
    var maintenanceStatusContainer = $('#maintenance-status');

    var statusClass = getStatusClass(maintenanceData.status);
    var badgeClass = getBadgeClass(maintenanceData.status);

    var maintenanceStatusHtml = `
      <div class="card mb-3 ${statusClass} border-primary">
        <div class="card-header bg-primary text-white">Maintenance</div>
        <div class="card-body p-2">
          <div class="row">
            <div class="col-8">
              <h6 class="card-title mb-1 font-weight-bold">Details: ${maintenanceData.details}</h6>
            </div>
            <div class="col-4 text-end">
              <span class="badge ${badgeClass}">${maintenanceData.status}</span>
            </div>
          </div>
          <p class="card-text"><strong>Start Time:</strong> ${new Date(maintenanceData.startTime).toLocaleString()}</p>
          <p class="card-text"><strong>End Time:</strong> ${new Date(maintenanceData.endTime).toLocaleString()}</p>
          <div id="countdown"></div>
        </div>
      </div>
    `;

    maintenanceStatusContainer.append(maintenanceStatusHtml);

    initializeCountdownTimer(maintenanceData.startTime, maintenanceData.endTime);
  }

  // Function to update incidents
  function updateIncidents(incidentsData) {
    var incidentsContainer = $('#incidents-container');

    incidentsData.forEach(function (incident) {
      var incidentHtml = `
        <div class="card mb-3 border-secondary">
          <div class="card-header bg-secondary text-white">Incident</div>
          <div class="card-body p-2">
            <h6 class="card-title mb-1 font-weight-bold">Details: ${incident.details}</h6>
            <p class="card-text"><strong>Start Time:</strong> ${new Date(incident.startTime).toLocaleString()}</p>
            <p class="card-text"><strong>End Time:</strong> ${new Date(incident.endTime).toLocaleString()}</p>
          </div>
        </div>
      `;

      incidentsContainer.append(incidentHtml);
    });
  }

  // Function to initialize the countdown timer
  function initializeCountdownTimer(startTime, endTime) {
    var countdownElement = $('#countdown');

    var countdownInterval = setInterval(function () {
      var now = new Date().getTime();
      var distanceToStart = new Date(startTime).getTime() - now;
      var distanceToEnd = new Date(endTime).getTime() - now;

      if (distanceToStart > 0) {
        var countdownText = 'Maintenance starts in ' + formatCountdownTime(distanceToStart);
        countdownElement.text(countdownText);
      } else if (distanceToEnd > 0) {
        var countdownText = 'Maintenance ongoing. Time remaining: ' + formatCountdownTime(distanceToEnd);
        countdownElement.text(countdownText);
      } else {
        clearInterval(countdownInterval);
        countdownElement.text('Maintenance has ended.');
      }
    }, 1000);
  }

  // Function to format the countdown time
  function formatCountdownTime(distance) {
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
  }

  // Function to map status to Bootstrap text color class
  function getStatusClass(status) {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'operational';
      case 'maintenance':
        return 'maintenance';
      case 'degraded':
        return 'degraded';
      case 'down':
        return 'down';
      default:
        return '';
    }
  }

  // Function to add hover class based on status
  function getHoverClass(status) {
    return 'card-hover-' + status.toLowerCase();
  }

  // Function to map status to badge color class
  function getBadgeClass(status) {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-success-subtle border-success-subtle text-success-emphasis';
      case 'maintenance':
        return 'bg-info-subtle border-info-subtle text-info-emphasis';
      case 'degraded':
        return 'bg-warning-subtle border-warning-subtle text-warning-emphasis';
      case 'down':
        return 'bg-danger-subtle border-danger-subtle text-danger-emphasis';
      default:
        return '';
    }
  }

  // Fetch maintenance status and service status for each service on page load
  fetchMaintenanceStatus();

  var services = ['web-server', 'database', 'email-service', 'notification-service'];

  services.forEach(function (service) {
    fetchServiceStatus(service);
  });
  fetchIncidents();
});
