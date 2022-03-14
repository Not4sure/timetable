import express from "express";
import ApiError from '../exceptions/api-error'

export default function (err: ApiError | Error, req: express.Request, res: express.Response) {
  console.error(err)
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message })
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка' })
}
