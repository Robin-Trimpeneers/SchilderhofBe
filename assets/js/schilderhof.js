// Attach the event listener to the input field on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');

    // Listen for the keydown event
    searchInput.addEventListener('keydown', checkEnter);

    // Optional: Disable autocorrect, autocomplete, and autocapitalize on mobile
    searchInput.setAttribute('autocorrect', 'off');
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('autocapitalize', 'off');
});

// Function to check for Enter key press
function checkEnter(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault(); // Prevent default form submission (if inside a form)
        searchTotems();  // Call your function here
    }
}

// Define the search function
async function searchTotems() {
    const queryElement = document.getElementById('search');
    const query = queryElement.value.trim();

    if (!query) {
        displayResultsInTable([]); // Clear results if query is empty
        return;
    }

    try {
        // Fetch the JSON data from the given URL
        const response = await fetch('./totems.JSON');

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter the data based on the query
        const lowerQuery = query.toLowerCase();
        const results = data.filter(item =>
            item.naam.toLowerCase().includes(lowerQuery) ||
            item.totem.toLowerCase().includes(lowerQuery) ||
            item.datum.toLowerCase().includes(lowerQuery)
        );

        // Return or display the matching results
        displayResultsInTable(results);

    } catch (error) {
        console.error('Error fetching or processing data:', error);
        displayResultsInTable([]);
    }
}

// Function to display the results in an HTML table
function displayResultsInTable(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous content

    if (results.length > 0) {
        // Create a table element
        const table = document.createElement('table');
        table.classList.add('table');
        table.border = '1';

        // Create the table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Define the headers
        const headers = ['Naam', 'Totem', 'Datum'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText; // Use textContent to prevent XSS
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create the table body
        const tbody = document.createElement('tbody');

        // Populate the table rows with the search results
        results.forEach(result => {
            const row = document.createElement('tr');

            ['naam', 'totem', 'datum'].forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = result[field] || ''; // Use textContent to prevent XSS
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        resultsDiv.appendChild(table);
    } else {
        resultsDiv.textContent = 'No results found'; // Use textContent to prevent XSS
    }
}
