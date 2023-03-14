import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import '../../App.css'

const Ajv = require('ajv')

const ajv = new Ajv()

const Time = () => {
    const intervalRef = useRef() as any
    const [mount, setMount] = useState<boolean>(false)
    const [stopWatch, setStopWatch] = useState<string>('00:00:00')
    const [loading, setLoading] = useState<boolean | 'invalid schema'>(false)

    useEffect(() => {
        if (!mount) {
            setMount(true)
        }
    }, [])

    useEffect(() => {
        if (mount) {
            getTime()
            setInterval(() => {
                getTime()
            }, 30000)
        }
    }, [mount])

    const schema = {
        properties: {
            epoch: {
                description:
                    'The current server time, in epoch seconds, at time of processing the request.',
                type: 'number',
            },
        },
        required: ['epoch'],
        type: 'object',
    }

    // set and clear interval before and after api call

    const getTime = async () => {
        try {
            clearInterval(intervalRef.current)
            setLoading(true)
            const time = await axios.get('http://localhost:3001/time', {
                headers: {
                    Authorization: 'Bearer mysecrettoken',
                },
            })

            const validate = ajv.compile(schema)
            const valid = validate(time.data)
            console.log({ valid })
            if (!valid) {
                console.log(validate.errors)
                setLoading('invalid schema')
            } else {
                intervalRef.current = setInterval(() => {
                    setStopWatch(timeDiff(time.data.epoch))
                }, 1000)
            }
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } catch (error) {
            console.log(error)
        }
    }

    // The difference between current client machine time and the most recently-fetched
    // value for server time in epoch seconds,

    const timeDiff = (serverTime: number): string => {
        const clientTime = new Date().getTime()
        const clientEpoch = clientTime / 1000
        const diff = serverTime - clientEpoch
        const absDiff = Math.abs(diff)

        const time = moment.utc(absDiff * 1000).format('HH:mm:ss')
        return time
    }

    return (
        <div className="time">
            {loading ? (
                <div className="loading">LOADING</div>
            ) : (
                <div>{stopWatch}</div>
            )}
        </div>
    )
}

export default Time
