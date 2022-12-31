import moment, { Duration, Moment } from 'moment'
import { number } from 'prop-types'

export type RemoteDay = {
    date: Date
    weekSequence: number
}

export function getRemoteDays(
    queryDate: string,
    group: string,
    initialState: number[],
    initialWeek: Date,
    remoteWeeks: number[][]
): RemoteDay[] {
    const inputDate = new Date(queryDate)
    const remoteDays: RemoteDay[] = []
    const firstDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1)
    console.log('First day:', firstDay)
    const lastDay = moment(inputDate).add(1, 'month').weekday(5).toDate();

    let inputMoment: Moment
    let initialMoment: Moment
    let diff: Duration
    let diffWeeks: number
    let weekType: number
    let daysOfWeek: number[]
    let weekSequence = 1
    const aux = firstDay
    while (aux < lastDay && aux !== lastDay) {
        inputMoment = moment(aux).startOf('week')
        initialMoment = moment(initialWeek)
        diff = moment.duration(inputMoment.diff(initialMoment))
        diffWeeks = Math.floor(diff.asWeeks())
        weekType = (diffWeeks + initialState[+group - 1]) % remoteWeeks.length
        weekType = weekType === 0 ? remoteWeeks.length : weekType
        daysOfWeek = remoteWeeks[weekType - 1]
        weekSequence = 1
        for (const dayOfWeek of daysOfWeek) {
            remoteDays.push({ date: inputMoment.day(dayOfWeek).toDate(), weekSequence })
            ++weekSequence
        }
        aux.setDate(aux.getDate() + 7)
    }
    return remoteDays
}

export function extractRemoteDaysParams(date: string | string[], group: string | string[]) {
    let queryDate: string
    let queryGroup: string

    if (Array.isArray(date)) {
        queryDate = date[0]
    } else {
        queryDate = date
    }

    if (Array.isArray(group)) {
        queryGroup = group[0]
    } else {
        queryGroup = group
    }

    return { queryDate, queryGroup }
}

export function validateRemoteDaysParams(queryDate: string, queryGroup: string) {
    if (!moment(queryDate, 'YYYY-MM-DD', true).isValid()) {
        return false
    }
    const groupNumber = +queryGroup

    if (!groupNumber || groupNumber < 1 || groupNumber > 5) {
        return false
    }
    return true
}

function getMonday(d: Date) {
    const day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1)
    return new Date(d.setDate(diff))
}
