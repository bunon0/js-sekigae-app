'use strict';

/**
 * 数字の席番号ブロックを表示するための元データになる配列を作成
 * 関数内で、欠席者を取り除く処理も行う
 * @param {Number} studentNumber 生徒の人数を表示
 * @return {Array} 席番号ブロックに表示するための元データとなる配列（欠席者取り除き済）
 */
const setTargetStudents = (studentNumber) => {
	let studentNumberList = [];
	for (let i = 1; i <= studentNumber; i++) {
		studentNumberList.push(i);
	}
	const absenteeNumbers = document.querySelector('#absence').value;
	const splitAbsenteeNumbers = absenteeNumbers.split(',').map(function (item, index) {
		return parseInt(item);
	});
	studentNumberList = studentNumberList.filter((student) => {
		return !splitAbsenteeNumbers.includes(student);
	});

	return studentNumberList;
};

/**
 * 席番号ブロックの元データが入った配列をシャッフルさせる
 * @type {Array} studentNumberList・・・画面に表示対象となる生徒の学生番号が格納されたもの
 * @return {Array} studentNumberListを元に中身の数字がシャッフルされた配列
 */
const shuffleArray = (studentNumberList) => {
	for (let i = studentNumberList.length; i > 0; i--) {
		const randomNum = Math.floor(Math.random() * i);
		let tmp = studentNumberList[i - 1];
		studentNumberList[i - 1] = studentNumberList[randomNum];
		studentNumberList[randomNum] = tmp;
	}

	return studentNumberList;
};

/**
 * 数字がシャッフルされた席番号ブロックの元データとなる配列を画面上部に表示させる
 * @type {Array} shuffleStudent・・・生徒の学生番号がシャッフルされた状態で格納されたもの
 */
const showSeatBoxes = (shuffleStudent) => {
	let insertHtml = '';
	shuffleStudent.forEach(function (num) {
		insertHtml += `<div class="seat__item">${num}</div>`;
	});

	document.querySelector('#seat').innerHTML = insertHtml;
};

/**
 * @type {Function} timer・・・setInterval関数が格納されている
 * @type {Object}　audioElement・・・音声データとなるもの
 */
const soundPlay = (timer) => {
	const audioElement = new Audio();
	// jsファイルを読み込んでいるHTMLからの相対pathで記述する必要がある
	audioElement.src = './assets/audio/drum.mp3';
	audioElement.volume = 0.1;
	audioElement.play();

	// soundの終了を検知
	audioElement.addEventListener('ended', function () {
		clearInterval(timer);
	});
};

/**
 * モーダル内のスタートボタンが押された際の動作を記述\
 * @type {Number} studentNumber・・・入力欄に入力された人数
 * @type {Number} studentUpperLimit・・・人数の入力欄の上限値
 * @type {Boolean} studentNumberlsEmpty・・・人数の入力欄に数値が入力されたかどうか
 */
document.querySelector('#btnStart').addEventListener('click', () => {
	const studentNumber = document.querySelector('#studentNumber').value;
	const studentUpperLimit = 50;
	const studentNumberlsEmpty = studentNumber === '';

	if (studentNumberlsEmpty) {
		alert('人数が未入力です！入力してからスタートボタンを押してください。');
		return false;
	}

	if (studentNumber > studentUpperLimit) {
		alert(`人数は${studentUpperLimit}人以内に設定してください！`);
		return false;
	}

	document.querySelector('.c-overlay').classList.add('is-closed');

	const studentNumberList = setTargetStudents(studentNumber);

	const timer = setInterval(() => {
		const shuffleStudent = shuffleArray(studentNumberList);
		showSeatBoxes(shuffleStudent);
	}, 50);

	soundPlay(timer);
});
