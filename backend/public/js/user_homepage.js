async function fetchRequests(donorUsername) {
    try {
        console.log('Fetching requests');
        const response = await fetch(`/request/getRequests?donor=${donorUsername}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Check if requests exist in the response
        if (data.requests && Array.isArray(data.requests)) {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = '';

            // Iterate over requests and add them to the main content
            data.requests.forEach(request => {
                const foodItems = request.availableFood.join(', '); // Join array items into a string
            
                // Determine the status message based on isAccepted and isRejected flags
                let statusMessage;
                let statusColor; // Add color for the status button
                if (request.isRejected) {
                    statusMessage = "Your request has been rejected";
                    statusColor = "bg-red-600 hover:bg-red-500";
                } else if (request.isAccepted) {
                    statusMessage = "You've got a Deal!";
                    statusColor = "bg-green-600 hover:bg-green-500";
                } else {
                    statusMessage = "Pending request, waiting to be accepted by donor";
                    statusColor = "bg-yellow-600 hover:bg-yellow-500";
                }
            
                // Display the request details using the Meraki UI component
                mainContent.innerHTML += `
                    <div class="max-w-2xl px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 mb-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-light text-gray-600 dark:text-gray-400">${new Date(request.timestamp).toLocaleDateString()}</span>
                            <a class="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform ${statusColor} rounded cursor-pointer" tabindex="0" role="button">${statusMessage}</a>
                        </div>
            
                        <div class="mt-2">
                            <p class="text-xl font-bold text-gray-700 dark:text-white" tabindex="0">Available Food: ${foodItems} ${request.isAccepted ? '✔️' : ''}</p>
                            ${request.location ? `<p class="mt-2 text-gray-600 dark:text-gray-300">Location: ${request.location}</p>` : ''}
                        </div>
            
                        <div class="flex items-center justify-between mt-4">
                            <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline" tabindex="0">View Details</a>
            
                            <div class="flex items-center">
                                <a class="font-bold text-gray-700 cursor-pointer dark:text-gray-200" tabindex="0">Donor: ${request.donorUsername}</a>
                            </div>
                        </div>
                    </div>`;
            });
            


            // data.requests.forEach(request => {
            //     const foodItems = request.availableFood.join(', '); // Join array items into a string
            //     const statusMessage = request.isAccepted ? 
            //         'You\'ve got a Deal!' : 
            //         'Pending request, waiting to be accepted by donor';

            //     mainContent.innerHTML += `
            //         <div class="request-box">
            //             <p>Available Food: ${foodItems} ${request.isAccepted ? '✔️' : ''}</p>
            //             ${request.location ? `<p>Location: ${request.location}</p>` : ''}
            //             <p><small>Timestamp: ${new Date(request.timestamp).toLocaleString()}</small></p>
            //             <p><strong>Status: ${statusMessage}</strong></p>
            //             <button onclick="${request.isAccepted ? `cancelRequest('${request._id}', '${donorUsername}')` : `acceptRequest('${request._id}', '${donorUsername}')`}">
            //                 ${request.isAccepted ? 'Cancel' : 'Accept'}
            //             </button>
            //         </div>`;
            // });

            // Scroll to the bottom of the main content
            mainContent.scrollTop = mainContent.scrollHeight;
        } else {
            console.error('No requests found for this donor.');
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = `<p>No requests found for ${donorUsername}.</p>`;
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `<p>Error fetching requests: ${error.message}</p>`;
    }
}


function showChat(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    
    const mainContent = document.getElementById('main-content');
    const accountsContainer = document.querySelector('.accounts-container');
    // Clear main content before displaying chat
    mainContent.innerHTML = ''; 

    // Create chat HTML
    const chatHTML = `
        <h3>Chat with a Donor</h3>
        <p>Start your conversation here...</p>
    `;
     // Show the accounts container again
    accountsContainer.style.display = 'block';
    // Set mainContent to display chat
    mainContent.innerHTML = chatHTML; 
}


// async function acceptRequest(requestId , donorUsername) {
//     try {
//         const response = await fetch(`/request/acceptRequest/${requestId}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Request accepted:', data);
//             // Optionally, refresh the requests after accepting
//             fetchRequests(donorUsername); // Make sure to store the current donor username
//             fetchAcceptedRequests(); 
//         } else {
//             console.error('Failed to accept request');
//         }
//     } catch (error) {
//         console.error('Error accepting request:', error);
//     }
// }

// async function cancelRequest(requestId, donorUsername) {
//     try {
//         const response = await fetch(`/request/cancelRequest/${requestId}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Request cancelled:', data);
//             // Optionally, refresh the requests after cancelling
//             fetchRequests(donorUsername); // Make sure to store the current donor username
//             fetchAcceptedRequests()
//         } else {
//             console.error('Failed to cancel request');
//         }
//     } catch (error) {
//         console.error('Error cancelling request:', error);
//     }
// }



function initMap() {
    // Define map options
    var mapOptions = {
        center: { lat: 0, lng: 0 }, // Default coordinates
        zoom: 8
    };
    // Create the map
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

let map, selectedLatLng;
      
        function loadGoogleMapsScript(callback) {
          const existingScript = document.getElementById('googleMaps');
          
          if (!existingScript) {
            const script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=GOOGLE_MAPS_API_KEY&loading=async&libraries=maps&v=beta";
            script.id = 'googleMaps';
            document.head.appendChild(script);
      
            // Ensure the script is loaded before executing callback
            script.onload = () => {
              if (callback) callback();
            };
          } else {
            // If the script is already loaded, immediately call the callback
            if (callback) callback();
          }
        }
      
        function initMap() {
          try {
            // Create a new map instance
            map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 37.42, lng: -122.1 },  // Set your desired coordinates
              zoom: 14,
              mapId: "4504f8b37365c3d0",  // Optional map styling ID
            });
      
            // Create a marker (optional)
            const marker = new google.maps.Marker({
              position: { lat: 37.42, lng: -122.1 },
              map: map,
            });
      
            // Listen for clicks on the map to get coordinates
            map.addListener("click", (e) => {
              selectedLatLng = e.latLng;
              console.log("Location selected:", selectedLatLng.lat(), selectedLatLng.lng());
      
              // Update marker position on map click
              marker.setPosition(selectedLatLng);
            });
      
          } catch (error) {
            console.error('Error initializing the map:', error);
          }
        }
      
        function showLocationPicker(event) {
          event.preventDefault();
          document.getElementById('location-modal').classList.remove('hidden');
          if (!map) {
            // Load the Google Maps script and initialize the map
            loadGoogleMapsScript(initMap);
          }
        }
      
        function saveLocation() {
          if (selectedLatLng) {
            console.log("Selected location:", selectedLatLng.lat(), selectedLatLng.lng());
          } else {
            console.log("No location selected.");
          }
        }
      
        function closeModal() {
          document.getElementById('location-modal').classList.add('hidden');
        }
