import * as DateUtils from '../utils/date.js';

const date = new Date();
const formattedDate = DateUtils.getDateStrForBackend(date);
const currDate = DateUtils.getDateStrForBackend(Date.now());

// On page load, fetch data
window.addEventListener("DOMContentLoaded", async () => {
  await fetchExerciseDataWeek();
  // or fetchExerciseDataMonth(); if you want
});

async function fetchExerciseDataWeek() {
  try {
    const response = await fetch(`http://localhost:3000/exercises/1/week/${formattedDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    // Process the exercise data here
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

async function fetchExerciseDataMonth() {
  try {
    const response = await fetch(`http://localhost:3000/exercises/1/week/${formattedDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    addDataToList(data);
    // Process the exercise data here
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function splitData(data) {
  const futureData = data.filter((item) => item.startDate >= currDate);
  const pastData = data.filter((item) => item.startDate < currDate);
  pastDisplay = pastData;
}

function addDataToList(data) {
  const listElem = document.getElementById('exerciseList');
  listElem.innerHTML = '';
  data.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${item.title} - ${item.startDate}`;
    listElem.appendChild(listItem);
  });
}
