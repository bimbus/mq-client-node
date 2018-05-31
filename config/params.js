import path from 'path'

export const params = {
  projectId: 'anapurna-172709',
  keyFilename: path.join(__dirname, 'gcp-credentials.json'),
  topic: 'pim',
  subscription: 'test',
  maxMessages: 10,
}
