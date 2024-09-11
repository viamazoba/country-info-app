import { boolean, number, object, string, array } from "valibot";

export const DraftProductSchema = object({
    name: string(),
    price: number()
})

export const AvailableCountrySchema = object({
    countryCode: string(),
    name: string(),
})

const CountriesBorderSchema = object({
    commonName: string(),
    officialName: string(),
    countryCode: string(),
})

export const CountrySchema = object({
    data: object({
        commonName: string(),
        officialName: string(),
        countryCode: string(),
        borders: array(CountriesBorderSchema)
    })
})

const PopulationsCount = object({
    year: number(),
    value: number()
})

export const CountryPopulationSchema = object({
    data: object({
        error: boolean(),
        data: object({
            country: string(),
            code: string(),
            populationCounts: array(PopulationsCount)
        })
    })
})

export const CountryFlagSchema = object({
    data: object({
        data: object({
            flag: string()
        })
    })
})

export const AvailableCountriesSchema = array(AvailableCountrySchema)
