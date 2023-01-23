"use strict";

const addBtn = document.querySelector(".add");
const saveBtn = document.querySelector(".save");
const clearBtn = document.querySelector(".clear");

const boxLabel = document.querySelector(".box-label");
const boxBody = document.querySelector(".box-body");
const showGPA = document.querySelector(".show-GPA");

let selection = [];
let gpa;

const addCourse = function () {
	const html = `<div class="box-label">
    <label>Course:</label>
    <input class="courseName" placeholder="Course Name" />
    <label>Grade:</label>
    <input class="courseGrade" value="A" />
    <label>Credits:</label>
    <input class="courseCredits" value="1" />
	<span class="close">x</span>
</div>`;
	boxBody.insertAdjacentHTML("beforeend", html);
};

const saveSelection = function () {
	//for each box-label, store the name, grade, and credits
	selection = [];
	const boxLabels = document.querySelectorAll(".box-label");
	boxLabels.forEach(function (label) {
		let contents = {};
		const course = label.querySelector(".courseName").value;
		const grade = label.querySelector(".courseGrade").value;
		const credit = label.querySelector(".courseCredits").value;
		if (!course || !grade || !credit) return;
		contents.course = course;
		contents.grade = grade;
		contents.credit = credit;
		selection.push(contents);
	});
	calculateGPA();
	setLocalStorage();
};

const deleteCourse = function (event) {
	const el = event.target;
	const label = el.closest("div");
	label.innerHTML = "";
	label.remove();
};

const setLocalStorage = function () {
	localStorage.setItem("grades", JSON.stringify(selection));
	console.log(localStorage);
};

const calculateGPA = function () {
	const letterGrade = {
		"A+": 4,
		A: 4,
		"A-": 3.7,
		"B+": 3.3,
		B: 3,
		"B-": 2.7,
		"C+": 2.3,
		C: 2,
		"C-": 1.7,
		"D+": 1.3,
		D: 1,
		"D-": 0.7,
		F: 0,
	};
	let sumCredit = 0;
	let score = 0;
	const credits = document.querySelectorAll(".courseCredits");
	const grades = document.querySelectorAll(".courseGrade");
	for (let i = 0; i < credits.length; i++) {
		sumCredit += Number(credits[i].value);
		score += letterGrade[grades[i].value] * Number(credits[i].value);
	}
	const GPA = (score / sumCredit).toFixed(1);
	showGPA.textContent = `GPA: ${GPA}`;
};

const reset = function () {
	localStorage.removeItem("grades");
	location.reload();
};

const getLocalStorage = function () {
	const data = JSON.parse(localStorage.getItem("grades"));

	if (!data) return;

	selection = data;

	selection.forEach((contents) => {
		renderCoursework(contents);
	});
};

const renderCoursework = function (content) {
	const html = `<div class="box-label">
    <label>Course:</label>
    <input class="courseName" value="${content.course}"/>
    <label>Grade:</label>
    <input class="courseGrade" value="${content.grade}" />
    <label>Credits:</label>
    <input class="courseCredits" value="${content.credit}" />
	<span class="close">x</span>
</div>`;
	boxBody.insertAdjacentHTML("beforeend", html);
};

const init = function () {
	getLocalStorage();
	calculateGPA();
};

init();
//Event Listeners
addBtn.addEventListener("click", addCourse);
saveBtn.addEventListener("click", saveSelection);
clearBtn.addEventListener("click", reset);
boxBody.addEventListener("click", function (e) {
	//console.log(e.target);
	if (
		e.target.classList.contains("box-label") ||
		e.target.classList.contains("courseGrade") ||
		e.target.classList.contains("courseCredits")
	) {
		calculateGPA();
	}

	if (e.target.classList.contains("close")) {
		deleteCourse(e);
		console.log("1");
	}
});
