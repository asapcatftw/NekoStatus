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

  // Function to update the status container with service status
  function updateStatus(statusData) {
    var statusContainer = $('#status-container');

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

    var maintenanceStatusHtml = `
      <div class="card mb-3 border-primary">
        <div class="card-header bg-primary text-white">Maintenance</div>
        <div class="card-body p-2">
          <div class="row">
            <div class="col-8">
              <h6 class="card-title mb-1 font-weight-bold">Details: ${maintenanceData.details}</h6>
            </div>
            <div class="col-4 text-end">
              <p class="card-text m-0"><span class="${statusClass}">${maintenanceData.status}</span></p>
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
  fetchMaintenanceStatus();

  var services = ['web-server', 'database', 'email-service', 'notification-service'];

  services.forEach(function (service) {
    fetchServiceStatus(service);
  });
});
