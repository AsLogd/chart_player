import React from 'react'
import { render } from 'react-dom'

//import * as Song from "./song"

import "./style.scss"

interface AppState {
	fileContent: string | null
}

class App extends React.Component<{}, AppState> {
	fileRef: React.RefObject<HTMLInputElement> = React.createRef()
	state: AppState = {
		fileContent: null
	}
	////////
	//// Handlers
	////////

	handleFileChange = (ev: React.FormEvent<HTMLInputElement>) => {
		const files = ev.currentTarget.files
		if (!files || files.length === 0) {
			console.log("No file!")
			return
		}
		console.log(files)
		files[0].text().then((content) => {
			this.setState({
				fileContent: content
			})
		})

	}

	////////
	//// Render
	////////

	renderFileInput() {
		console.log("Render file input")
		return (
			<input
				type="file"
				ref={this.fileRef}
				onChange={this.handleFileChange}
			/>
		)
	}

	render() {
		console.log("Render")
		const {fileContent} = this.state
		if (!fileContent) {
			return this.renderFileInput()
		}

		//const song = Song.parse(fileContent)
		console.log(song)
		return (
			<div className="App-component">
				{/*<Fretboard song={song}/>*/}
				Ttesting
			</div>
		)
	}
}

render(<App />, document.getElementById('app'));