import { departments } from './tones.js';
import './App.css';

const audioCtx = new AudioContext();
const silentAudio = new Audio('./silent.mp3');
let cancelCurrent;

function playTone(frequency, delay, duration) {
	silentAudio.play(); // allow sound on iOS when ringer is on silent
	const { destination, currentTime } = audioCtx;
	const oscillator = new OscillatorNode(audioCtx, {
		type: 'sine',
		frequency: frequency
	});
	oscillator.connect(destination);
	oscillator.start(currentTime + delay);
	oscillator.stop(currentTime + delay + duration);
	return () => oscillator.disconnect();
}

function twoTone(frequency1, frequency2) {
	if (cancelCurrent) cancelCurrent(); 
	const cancelTone1 = playTone(frequency1, 0, 1);
	const cancelTone2 = playTone(frequency2, 1, 3);
	cancelCurrent = () => {
		cancelTone1();
		cancelTone2();
	};
}

function allCall(frequency) {
 	if (cancelCurrent) cancelCurrent();
 	cancelCurrent = playTone(frequency, 0, 8);
}

function createRow ({ name, pager, siren, siren2 }) {
	return (
		<tr key={name}>
			<td>{name}</td>
			{/* <td>{pager?.c && <button onClick={() => twoTone(pager.a, pager.c)}>Chief</button>}</td> */}
			<td>{pager && <button onClick={() => twoTone(pager.a, pager.b)}>Pager</button>}</td>
			<td>{siren && <button onClick={() => twoTone(siren.a, siren.b)}>Siren</button>}</td>
			<td>{siren2 && <button onClick={() => twoTone(siren2.a, siren2.b)}>Siren</button>}</td>
		</tr>
	);
};

function App() {
	return (
		<main>
			<table>
				<tbody>
					{departments.map(createRow)}
				</tbody>
			</table>
		</main>
	);
}

export default App;