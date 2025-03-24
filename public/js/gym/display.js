export function addDataToTable(item, section) {
  // Find the correct table based on the section
  const table = document.querySelector(`#${section}-workout .logs`);

  // Create a new row
  const row = document.createElement('tr');

  console.log("item: ", item)
  console.log("details: ", item.details)
  console.log("details data type: ", typeof(item.details))
  // Populate the row with data
  row.innerHTML = `
    <td>${item.date}</td>
    <td>${item.exerciseName}</td>
    <td>${item.exerciseStructure}</td>
    <td>${item.notes}</td>
    <input id=exerciseId${item.exerciseId} type="submit" name="edit" value="Edit" />
    <input id=exerciseId${item.exerciseId} type="submit" name="delete" value="Delete" />
  `;

  // Remove the default message if it exists
  const defaultRow = table.querySelector('.default');
  if (defaultRow) {
    defaultRow.remove();
  }

  // Append the new row to the table
  table.appendChild(row);
}

