// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
	const response = await axios.get('http://jservice.io/api/categories', {
		params: {
			count: 6,
			offset: Math.floor(Math.random() * 999)
		}
	});
	// Do i need this map method below? maybe take it out later to see.
	const categories = response.data.map((category) => ({
		id: category.id
	}));
	return categories;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
	const response = await axios.get('http://jservice.io/api/category', {
		params: {
			id: catId
		}
	});
	const cluesArr = response.data.clues.map((clues) => ({
		question: clues.question,
		answer: clues.answer,
		showing: null
	}));
	const catObject = {
		title: response.data.title,
		clues: cluesArr
	};
	return catObject;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
	createTable();

	const catHead = document.querySelector('#jeopardyTable').tHead.firstElementChild.children;
	for (let i = 0; i < 6; i++) {
		catHead[i].innerText = categories[i].title;
	}
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
	let clickedItem = evt.target.id;

	let tableSpot = document.querySelector(`#${clickedItem}`);

	if (categories[clickedItem[1]].clues[clickedItem[3]].showing === null) {
		categories[clickedItem[1]].clues[clickedItem[3]].showing = 'question';
		tableSpot.innerHTML = categories[clickedItem[1]].clues[clickedItem[3]].question;
	} else if (categories[clickedItem[1]].clues[clickedItem[3]].showing === 'question') {
		categories[clickedItem[1]].clues[clickedItem[3]].showing = 'answer';
		tableSpot.innerHTML = categories[clickedItem[1]].clues[clickedItem[3]].answer;
	} else {
		return;
	}
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids (maybe I don't do this here)
 * - get data for each category (maybe I don't do this here)
 * - create HTML table
 * */

async function setupAndStart() {
	let catIds = await getCategoryIds();

	categories = [];

	for (let catId of catIds) {
		categories.push(await getCategory(catId.id));
	}

	const bodyCheck = document.body;
	if (bodyCheck.firstElementChild.tagName === 'TABLE') {
		bodyCheck.firstElementChild.innerHTML = '';
	}
	fillTable();
	$('#jeopardyTable').on('click', 'td', handleClick);
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

function shuffleArray(array) {
	let newArr = array;
	for (let i = newArr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ newArr[i], newArr[j] ] = [ newArr[j], newArr[i] ];
	}
	return newArr;
}

// create start button that will initiate setupAndStart() and setup event listener for start button
function pageLoad() {
	const selectBody = document.body;
	const titleDiv = document.createElement('div');
	titleDiv.setAttribute('id', 'titleDiv');
	const jeopLogo = document.createElement('img');
	jeopLogo.setAttribute('src', 'https://www.c2cnt.com/wp-content/uploads/jeopardy-logo.png');
	jeopLogo.setAttribute('width', '400');
	jeopLogo.setAttribute('height', '150');
	titleDiv.appendChild(jeopLogo);
	const secondDiv = document.createElement('div');
	secondDiv.setAttribute('id', 'secondDiv');
	const buttonDiv = document.createElement('div');
	buttonDiv.setAttribute('id', 'buttonDiv');
	const startBtn = document.createElement('BUTTON');
	startBtn.innerText = 'Start New Game';
	startBtn.setAttribute('id', 'startButton');
	buttonDiv.append(startBtn);
	selectBody.prepend(buttonDiv);
	selectBody.prepend(secondDiv);
	selectBody.prepend(titleDiv);

	const selectBtn = document.querySelector('#startButton');
	selectBtn.addEventListener('click', function(e) {
		e.preventDefault();
		setupAndStart();
	});
}

pageLoad();

function createTable() {
	const selectSecondDiv = document.querySelector('div').nextSibling;
	const tbl = document.createElement('table');
	tbl.setAttribute('id', 'jeopardyTable');
	const tblHead = document.createElement('thead');
	tblHead.setAttribute('id', 'tableHead');
	tbl.appendChild(tblHead);
	const tblHeadRow = document.createElement('tr');
	tblHead.appendChild(tblHeadRow);
	for (let i = 0; i < 6; i++) {
		let head = document.createElement('th');
		tblHeadRow.appendChild(head);
	}
	const tblBody = document.createElement('tbody');
	tblBody.setAttribute('id', 'tableBody');
	tbl.appendChild(tblBody);
	for (let i = 0; i < 5; i++) {
		let tblBodyRow = document.createElement('tr');
		for (let j = 0; j < 6; j++) {
			let tblBodyTD = document.createElement('td');
			tblBodyTD.setAttribute('id', `p${j}-${i}`);
			tblBodyTD.innerText = '?';
			tblBodyRow.appendChild(tblBodyTD);
		}
		tblBody.appendChild(tblBodyRow);
	}

	selectSecondDiv.prepend(tbl);
}
