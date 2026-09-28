document.addEventListener("DOMContentLoaded", async () => {
    const assignments = await getAssignments();
    displayAssignments(assignments);
});
async function getAssignments() {
    const result = await chrome.storage.local.get(
        "assignments"
    );

    return result.assignments || [];
}

function displayAssignments(assignments) {
    const container = document.getElementById("assignmentList");

    container.innerHTML = "";

    if (assignments.length === 0) {
        container.textContent = "No upcoming assignments!";
        return;
    }

    for (const assignment of assignments) {
        const div = document.createElement("div");

        div.classList.add("assignment");

        div.innerHTML = `
                <h3>${assignment.course}</h3>
                <p><a href="${assignment.url}">${assignment.assignment}</a></p>
                <small>${assignment.dueDate}</small>
            `;

        container.appendChild(div);
    }
}

document.getElementById('refreshButton').addEventListener('click', async () => {

    const url = "https://campusweb.cofo.edu/ICS/api/ical/7dae0f5e-47fd-46c7-8f14-90a0d402605d";
    const container = document.getElementById('assignmentList');
    container.innerHTML = 'Loading...';

    chrome.runtime.sendMessage({
            type: "fetchICS",
            url: url
        },
        response => {
            console.log("Received response:", response);

            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            }
        });
});