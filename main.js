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

    const data = JSON.parse(getBody);
        await Apify.pushData(data)
})
