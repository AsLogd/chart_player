import {Chart} from "chart2json"

interface BPMCheckpoint {
	tick: number
	startSecond: number
	bpm: number
}

export default class Song {
	chart: Chart.Chart
	bpmCheckpoints: BPMCheckpoint[]
	constructor(chart: Chart.Chart) {
		this.chart = chart
		this.bpmCheckpoints = []
		this.computeBpmCheckpoints(chart.syncTrack)
	}

	computeBpmCheckpoints(st: Chart.SyncTrackSection) {
		Object.keys(st).forEach(tick => {
			const tn = Number(tick)
			st[tn].forEach(event => {
				if(event.kind === Chart.SyncTrackEventType.BPM) {
					if (this.bpmCheckpoints.length === 0) {
						console.assert(tn === 0, "First BPM doesn't happen at tick 0")
						this.bpmCheckpoints.push({
							tick: 0,
							startSecond: 0,
							bpm: event.bpm
						})
					} else {
						this.bpmCheckpoints.push({
							tick: tn,
							startSecond: this.tickToTime(tn),
							bpm: event.bpm
						})
					}
				}

			})
		})
	}

	getBPM(tick: number): BPMCheckpoint {
		for (let i = this.bpmCheckpoints.length-1; i >= 0; i--) {
			const cp = this.bpmCheckpoints[i]
			if (cp.tick <= tick) {
				return cp
			}
		}
		console.assert(true, `BPM not found for tick ${tick}!`)
		return {tick: 0, startSecond: 0, bpm: 1}
	}

	tickToTime(tick: number): number {
		const {resolution} = this.chart.song
		const cp = this.getBPM(tick)
		// Last bpm start time + the time between the bpm start and the
		// input tick
		return cp.startSecond + (tick - cp.tick)/resolution * 60/cp.bpm
	}
}