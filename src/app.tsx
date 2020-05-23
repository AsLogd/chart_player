import React from 'react'
import { render } from 'react-dom'
import Parser, {Chart} from "chart2json"

//import * as Song from "./song"
import Track from "./components/Track/Track"
import Song from "./Song"


import "./style.scss"

interface AppState {
	fileContent: string | null
	selectedDifficulty?: Chart.Difficulty
	selectedInstrument?: Chart.Instrument
}

class App extends React.Component<{}, AppState> {
	fileRef: React.RefObject<HTMLInputElement> = React.createRef()
	state: AppState = {
		fileContent: null
	}
	////////
	//// Handlers
	////////

	handleFileChange = async (ev: React.FormEvent<HTMLInputElement>) => {
		const files = ev.currentTarget.files
		if (!files || files.length === 0) {
			console.log("No file!")
			return
		}
		const content = await files[0].text()
		this.setState({
			fileContent: content
		})


	}

	handleSelectDifficulty = (dif: Chart.Difficulty) => () => {
		this.setState({
			selectedDifficulty: dif
		})
	}

	handleSelectInstrument = (instrument: Chart.Instrument) => () => {
		this.setState({
			selectedInstrument: instrument
		})
	}

	////////
	//// Render
	////////

	renderFileInput() {
		return (
			<input
				type="file"
				ref={this.fileRef}
				onChange={this.handleFileChange}
			/>
		)
	}

	renderDifficultyList(chart: Chart.Chart) {
		return (
			<div className="App-component">
				Select a difficulty:
				{
					Object.keys(chart.difficulties).map(dif =>
						<div
							className="difficulty"
							onClick={this.handleSelectDifficulty(dif as Chart.Difficulty)}
						>
							{dif}
						</div>
					)
				}
			</div>
		)
	}

	renderInstrumentList(chart: Chart.Chart, dif: Chart.Difficulty) {

		const instruments = chart.difficulties[dif]
		if(!instruments) {
			console.assert(false, "No instruments found in this difficulty")
			return null
		}
		return (
			<div className="App-component">
				Select an instrument:
				{
					Object.keys(instruments).map(instrument =>
						<div
							className="instrument"
							onClick={this.handleSelectInstrument(instrument as Chart.Instrument)}
						>
							{instrument}
						</div>
					)
				}
			</div>
		)
	}

	render() {
		const {
			fileContent,
			selectedDifficulty,
			selectedInstrument
		} = this.state
		if (!fileContent) {
			return this.renderFileInput()
		}

		const result = Parser.parse(fileContent)
		if (!result.ok) {
			console.log(result.reason)
			return <div className="error">Error: {result.reason.toString()}</div>
		}
		console.log("Result ok")
		console.log(result.value)
		if(!selectedDifficulty) {
			return this.renderDifficultyList(result.value)
		}
		console.log("difficulty selected")
		if(!selectedInstrument) {
			return this.renderInstrumentList(result.value, selectedDifficulty)
		}
		console.log("Instrument selected")
		const tracks = result.value.difficulties[selectedDifficulty] as Chart.InstrumentTracks
		console.assert(!!(tracks), "Selected difficulty is wrong")
		console.log("Result:")
		console.log(tracks[selectedInstrument])
		const track = tracks[selectedInstrument]
		const song = new Song(result.value)
		if(!track)
			return null
		return <Track song={song} track={track} instrument={selectedInstrument} />

	}
}

render(<App />, document.getElementById('app'));