document.addEventListener('DOMContentLoaded', fetchAcceptedRequests);

async function fetchAcceptedRequests() {
    try {
        const response = await fetch('/request/getAcceptedRequests', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user_jwt')}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const acceptedRequests = data.acceptedRequests;

        const topRightSection = document.querySelector('.top-right-section');
        topRightSection.innerHTML = '';

        // Sample delivery boy names
        const deliveryBoys = ['John Doe', 'Jane Smith', 'Alex Johnson'];

        // Check if acceptedRequests is an array and has items
        if (Array.isArray(acceptedRequests) && acceptedRequests.length > 0) {
            acceptedRequests.forEach(request => {
                topRightSection.innerHTML += `
                    <div class="accepted-request">
                        <p>Donor: ${request.donorUsername}</p>
                        <p>Available Food: ${request.availableFood.join(', ')}</p>
                        <p>Location: ${request.location || 'N/A'}</p>
                        <p><small>Timestamp: ${new Date(request.timestamp).toLocaleString()}</small></p>
                        <label for="delivery-boy-${request._id}">Assign Delivery Boy:</label>
                        <select id="delivery-boy-${request._id}">
                            ${deliveryBoys.map(boy => `<option value="${boy}">${boy}</option>`).join('')}
                        </select>
                    </div>
                `;
            });
        } else {
            topRightSection.innerHTML = '<p>No accepted requests found.</p>';
        }
    } catch (error) {
        console.error('Error fetching accepted requests:', error);
    }
}
