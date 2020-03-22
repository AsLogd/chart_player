/*import {
	Song
} from "./Song.def"*/

import {
	parse as parseChart
} from "./chart"

export function parse(text: string): any {
	parseChart(text)
}