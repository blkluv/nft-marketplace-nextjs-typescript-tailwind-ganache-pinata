import { v4 as uuidv4 } from 'uuid'
import { FileRequest } from '@_types/nft'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-iron-session'
import {
  addressCheckMiddleware,
  pinataApiKey,
  pinataSecretApiKey,
  withSession,
} from './utils'
import FormData from 'form-data'
import axios from 'axios'

debugger
export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    debugger
    if (req.method === 'POST') {
      debugger
      const { bytes, fileName, contentType } = req.body.data as FileRequest

      if (!bytes || !fileName || !contentType) {
        return res.status(422).send({ message: 'Image data are missing' })
      }

      await addressCheckMiddleware(req, res)

      const buffer = Buffer.from(Object.values(bytes))
      const formData = new FormData()

      formData.append('file', buffer, {
        contentType,
        filename: fileName + '-' + uuidv4(),
      })

      debugger
      const fileRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      )

      return res.status(200).send(fileRes.data)
    } else {
      return res.status(422).send({ message: 'Invalid endpoint' })
    }
  }
)
