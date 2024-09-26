// admin_dashboard.js

async function fetchModerators() {
    try {
        const response = await fetch('/admin/getModerators');
        const data = await response.json();
        const moderators = data.moderators;
        
        const moderatorsList = document.getElementById('moderators-list');
        moderatorsList.innerHTML = ''; // Clear the list

        moderators.forEach(moderator => {
            const listItem = document.createElement('li');
            listItem.textContent = `${moderator.username} (Role: ${moderator.role})`;

            const banButton = document.createElement('button');
            banButton.textContent = moderator.isBanned ? 'Unban' : 'Ban';
            banButton.onclick = () => toggleBan(moderator._id, !moderator.isBanned);

            listItem.appendChild(banButton);
            moderatorsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching moderators:', error);
    }
}



async function fetchAdmins() {
    try {
        const response = await fetch('/admin/getAdmins');
        const data = await response.json();
        const admins = data.admins;
        
        const adminsList = document.getElementById('admins-list');
        adminsList.innerHTML = ''; // Clear the list

        admins.forEach(admin => {
            const listItem = document.createElement('li');
            listItem.textContent = `${admin.username} (Role: ${admin.role})`;

            const banButton = document.createElement('button');
            banButton.textContent = admin.isBanned ? 'Unban' : 'Ban';
            banButton.onclick = () => toggleBan(admin._id, !admin.isBanned);

            listItem.appendChild(banButton);
            adminsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
    }
}


async function fetchDonors() {
    try {
        const response = await fetch('/admin/getDonors');
        const data = await response.json();
        const donors = data.donors;
        
        const donorsList = document.getElementById('donors-list');
        donorsList.innerHTML = ''; // Clear the list

        donors.forEach(donor => {
            const listItem = document.createElement('li');
            listItem.textContent = `${donor.username}`;

            const banButton = document.createElement('button');
            banButton.textContent = donor.isBanned ? 'Unban' : 'Ban';
            banButton.onclick = () => toggleBan(donor._id, !donor.isBanned);

            listItem.appendChild(banButton);
            donorsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching donors:', error);
    }
}

async function toggleBan(modId, shouldBan) {
    try {
        const response = await fetch(`/admin/toggleBan/${modId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isBanned: shouldBan })
        });

        if (response.ok) {
            fetchModerators();
            fetchAdmins();
            fetchDonors();
        } else {
            console.error('Error toggling ban status');
        }
    } catch (error) {
        console.error('Error toggling ban status:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchModerators);
document.addEventListener('DOMContentLoaded', fetchAdmins);
document.addEventListener('DOMContentLoaded', fetchDonors);
