import express from 'express'
import { Request, Response, NextFunction } from 'express'
import request from 'request'
import bodyParser from 'body-parser'
import { PORT, SOLANA_RPC_URL } from './config'

const app = express()
var jsonParser = bodyParser.json()

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Content-Type', 'application/json')
  next()
})

app.post('/', jsonParser, (req: Request, res: Response) => {
  const options = {
    url: SOLANA_RPC_URL,
    method: 'post',
    headers: req.headers,
    body: JSON.stringify(req.body),
  }
  const callback = (error: Error, response: any, body: any) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({
        ok: false,
        error: String(error?.message),
      })
    }
    return res.json(JSON.parse(body))
  }
  return request(options, callback)
})

app.listen(PORT, () => {
  console.log(`🦾 (solana-rpc-proxy) started on ${PORT}`)
})
