// admin_dashboard.js

async function fetchModerators() {
    try {
        const response = await fetch('/admin/getModerators');
        const moderators = await response.json();
        const moderatorsList = document.getElementById('moderators-list');
        moderatorsList.innerHTML = '';

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

async function toggleBan(moderatorId, shouldBan) {
    try {
        const response = await fetch(`/admin/toggleBan/${moderatorId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isBanned: shouldBan })
        });

        if (response.ok) {
            fetchModerators();
        } else {
            console.error('Error toggling ban status');
        }
    } catch (error) {
        console.error('Error toggling ban status:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchModerators);
