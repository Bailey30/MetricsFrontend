import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Metrics = () => {
    const [mount, setMount] = useState<boolean>(false)
    const [metrics, setMetrics] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!mount) {
            setMount(true)
        }
    }, [])

    useEffect(() => {
        if (mount) {
            // call function on mount then every 30 seconds
            getMetrics()
            setInterval(() => {
                getMetrics()
            }, 30000)
        }
    }, [mount])

    const getMetrics = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:3001/metrics', {
                headers: {
                    Authorization: 'Bearer mysecrettoken',
                },
            })

            setMetrics(response.data)
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="metrics">
            {loading ? (
                <div className="loading">LOADING</div>
            ) : (
                <pre>{metrics}</pre>
            )}
        </div>
    )
}

export default Metrics
