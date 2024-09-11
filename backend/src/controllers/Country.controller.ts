import type { Request, Response } from "express"
import axios from "axios"
import { AvailableCountriesSchema, CountryFlagSchema, CountryPopulationSchema, CountrySchema } from '../types'
import { safeParse }  from 'valibot'


export class CountryController {

  static getAllAvailableCountries = async( _: Request, res: Response) => {
    try {
      const url = `${process.env.API_NAGER_URL}v3/AvailableCountries`
      const { data } = await axios.get(url)
      const countries = safeParse(AvailableCountriesSchema, data)

      if(countries.success) {
        return res.status(200).json({
          status: 'success',
          results: countries.output.length,
          data: [ ...countries.output ]
        });

      } else {
          throw new Error('The external API failed in its response')
      }
      
    } catch (error) {

      const err = {...error}

      if(err.message === 'The external API failed in its response') {
        err.statusCode = 404
      }

      res.status(error.statusCode || 500).json({
        status: 'fail',
        message: error.message || 'An error occurred'
      })
    }
    
  }

  static promiseBordersByCode = (code: string) => {
    const url = `${process.env.API_NAGER_URL}v3/CountryInfo/${code}`
    return axios.get(url)
    
  }

  static promisePopulationByCode = (country:string) => {
    const name = country.toLowerCase()
    const url = `${process.env.API_NAGER_POPULATION}v0.1/countries/population`
    const data = {
      country: name
    }
    
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
  }

  static promiseFlagByCode = (code:string) => {
    const name = code.toUpperCase()
    const url = `${process.env.API_NAGER_POPULATION}v0.1/countries/flag/images`
    const data = {
      iso2: name
    }
    
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
  }

  static parseAndProcessPromises = async(
    [populationPromise, flagPromise, borderPromise]: Promise<axios.AxiosResponse<any, any>>[]
  ) => {

    const [responsePopulation, responseFlag, responseBorders] = await Promise.all([populationPromise, flagPromise, borderPromise])
    const responseTypePopulation = safeParse(CountryPopulationSchema,responsePopulation)
    const responseTypeFlag = safeParse(CountryFlagSchema, responseFlag)
    const responseTypeBorders = safeParse(CountrySchema, responseBorders)
    

    let populationsCounts, bordersCode, countryFlag, borders


    if(responseTypePopulation.success && responseTypeFlag.success && responseTypeBorders.success ) {
      populationsCounts = responseTypePopulation.output.data.data.populationCounts
      bordersCode = responseTypeBorders.output.data.countryCode
      countryFlag = responseTypeFlag.output.data.data.flag
      borders = responseTypeBorders.output.data.borders

      return {
        populationsCounts,
        bordersCode,
        countryFlag,
        borders
      }

    } else {

      throw new Error('The external API failed in its response')
    }
  }

  static getCountryByCode = async(req: Request, res: Response) => {
    
    const { country, code } = req.query

    try {
      const populationPromise = this.promisePopulationByCode(country.toString())
      const flagPromise = this.promiseFlagByCode(code.toString())
      const countriesBorderPromise = this.promiseBordersByCode(code.toString())

      const data = await this.parseAndProcessPromises([populationPromise, flagPromise, countriesBorderPromise])

      if(data.bordersCode != code ) {
        throw new Error('The Country code and name did not matched')
      }

      return res.status(200).json({
        status: 'success',
        data
      });

      
    } catch (error) {

      res.status(error.statusCode || 500).json({
        status: 'fail',
        message: error.message || 'An error occurred'
      })
    }
    
  }

}