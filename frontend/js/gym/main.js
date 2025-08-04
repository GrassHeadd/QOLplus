import * as DateUtils from '../utils/date.js';
import { addDataToTable } from './display.js';

const date = new Date();
const currDate = DateUtils.getDateStrForBackend(date);
const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
const nextMonth = DateUtils.getDateStrForBackend(nextMonthDate);
const prevMonth = DateUtils.getDateStrForBackend(prevMonthDate);

// On page load, fetch data
window.addEventListener("DOMContentLoaded", async () => {
  await fetchExerciseDataMonth(currDate);
  await fetchExerciseDataMonth(nextMonth);
  await fetchExerciseDataMonth(prevMonth);
  // or fetchExerciseDataWeek(); if you want
});

async function fetchExerciseDataWeek(date) {
    try {
        const response = await fetch(`http://localhost:3000/exercises/1/week/${date}`, {
        //https://qo-lplus.vercel.app/exercises/1/week/${date}
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        });
        const data = await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function fetchExerciseDataMonth(date) {
    try {
        const response = await fetch(`http://localhost:3000/exercises/1/month/${date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        });
        const data= await response.json();
        console.log(data);  
        console.log("it did fetch");
        data.data.forEach((item) => {
        const exerciseDate = new Date(item.date);
        // Convert currDate to a Date object for proper comparison if needed
        if(exerciseDate < new Date(currDate)) {
            addDataToTable(item, 'past');
        } else {
            addDataToTable(item, 'upcoming');
        }
        });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function postExerciseData(data) {
    console.log("postExerciseData called");
    try {
        await fetch('http://localhost:3000/exercises', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
        }).then(async (response) => {
                await response.json().then(jsonData => {
                    console.log("data type: ", typeof(jsonData.data[0].exerciseStructure));
                    
            });
        });
        return responseData;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


const submitButton = document.querySelector('#postBtn');

submitButton.addEventListener('click', async () => {
    const dateVal = document.getElementById('date').value;
    const exerciseVal = document.getElementById('exercise').value;
    const exerciseStructure = document.getElementById('details').value;
    const notesVal = document.getElementById('notes').value;


    const dataToPost = {
        userId: 1,            
        date: dateVal,
        exerciseName: exerciseVal,
        exerciseStructure: exerciseStructure,   
        notes: notesVal
      };

    console.log("POST data:", dataToPost);

    const result = await postExerciseData(dataToPost);
    console.log("POST response:", result);
});

async function deleteButton(exerciseId, row) {
    const deleteButton = document.querySelector("#exerciseId" + exerciseId);
    deleteButton.addEventListener("click", () => {
  
    })
  
  }