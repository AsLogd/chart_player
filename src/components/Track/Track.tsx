import * as React from "react"
import {Chart} from "chart2json"
import Song from "../../Song"
type GuitarTrack = Chart.Track<Chart.StringNote<Chart.GuitarLane>>
type GuitarNote = Chart.StringNote<Chart.GuitarLane>


function formatSeconds(insecs: number) {
	const mins = Math.floor(insecs/60)
	const seconds = (insecs%60).toFixed(2)
	return `${mins}:${seconds}`
}

//TODO:
// -TrackEvents subtypes need a discriminator
// -Add NoteEvent and add trackEventKind to all TrackEvent subtypes

interface TrackProps {
	song: Song
	track: Chart.Track<any>
	instrument: Chart.Instrument
}

export default class Track extends React.Component<TrackProps, {}>{
	root = "Track-component"

	renderGuitarNoteEvent(tick: number, note: GuitarNote) {
		const {root} = this
		return(
			<div className={`${root}__note`}>

			</div>
		)
	}

	renderSingleTrack(track: GuitarTrack) {
		const {root} = this
		const {song} = this.props
		return(
			<div className={`${root} ${root}--single`}>
				{
					Object.keys(track).map((tick) =>{
						const tn = Number(tick)
						const events = track[tn]
						const eventTime = song.tickToTime(tn) + 1.86 //hardcoded offset
						const asdf: string[] = []
						for(const ev of events) {
							if((ev as any).value || (ev as any).type) {
								continue
							}
							const nev = ev as Chart.StringNote<Chart.GuitarLane>
							console.log("nev", nev)
							asdf.push(nev.lanes.map(x => x.lane).join(", "))
						}
						return <div>
							{formatSeconds(eventTime)} = {asdf.join("|")}
						</div>
					})
				}
			</div>
		)
	}

	render() {
		const {track, instrument} = this.props
		switch(instrument) {
			case Chart.Instrument.SINGLE:
				return this.renderSingleTrack(track as GuitarTrack)
		}
		return null
	}
}