export function addDataToTable(item, section) {
  // Find the correct table based on the section
  const table = document.querySelector(`#${section}-workout .logs`);

  // Create a new row
  const row = document.createElement('tr');

  // Populate the row with data
  row.innerHTML = `
    <td>${item.date}</td>
    <td>${item.exerciseName}</td>
    <td>${item.details}</td>
    <td>${item.notes}</td>
  `;

  // Remove the default message if it exists
  const defaultRow = table.querySelector('.default');
  if (defaultRow) {
    defaultRow.remove();
  }

  // Append the new row to the table
  table.appendChild(row);
}