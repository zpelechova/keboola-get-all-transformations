import Apify from 'apify'
import { gotScraping } from 'got-scraping'
import { config } from 'dotenv'

config()

Apify.main(async () => {
    const getUrl =
        'https://connection.eu-central-1.keboola.com/v2/storage/components/transformation/configs'
    const getMethod = 'GET'
    const getHeaders = {
        'content-type': 'application/json',
        'x-storageapi-token': process.env.KEBOOLA_TOKEN
    }

    const { body: getBody } = await gotScraping({
        useHeaderGenerator: false,
        url: getUrl,
        method: getMethod,
        headers: getHeaders
    })

    const info = JSON.parse(getBody)

    const allBuckets = []

    for (const i of info) {
        const bucketName = i.name
        if (bucketName.startsWith('#0')) {
            const transformations = i.rows
            const allTranformations = []
            for (const t in transformations) {
                const output = transformations[t].configuration.output
                const allOutput = []
                for (const o in output) {
                    const outputData = {
                        destination: output[o].destination,
                        source: output[o].source,
                        incremental: output[o].incremental
                    }
                    allOutput.push(outputData)
                }
                const input = transformations[t].configuration.input
                const allInput = []
                for (const i in input) {
                    const inputData = {
                        source: input[i].source,
                        destination: input[i].destination
                    }
                    allInput.push(inputData)
                }
                const transData = {
                    transformationId: transformations[t].id,
                    transformationName: transformations[t].name,
                    transformationDescription: transformations[t].description,
                    transformationIsDisabled: transformations[t].isDisabled,
                    transformationQueries:
                        transformations[t].configuration.queries
                }
                allTranformations.push(transData)
            }
            const data = {
                bucketName,
                bucketId: i.id,
                bucketDescription: i.description,
                transformations: allTranformations
            }
            allBuckets.push(data)
        }
    }

    await Apify.pushData(allBuckets)
})
