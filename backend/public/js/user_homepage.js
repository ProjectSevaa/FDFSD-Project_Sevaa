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
                const statusMessage = request.isAccepted ? 
                    'You\'ve got a Deal!' : 
                    'Pending request, waiting to be accepted by donor';

                mainContent.innerHTML += `
                    <div class="request-box">
                        <p>Available Food: ${foodItems} ${request.isAccepted ? '✔️' : ''}</p>
                        ${request.location ? `<p>Location: ${request.location}</p>` : ''}
                        <p><small>Timestamp: ${new Date(request.timestamp).toLocaleString()}</small></p>
                        <p><strong>Status: ${statusMessage}</strong></p>
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

