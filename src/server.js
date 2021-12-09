const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')
const server = jsonServer.create()

const faker = require('faker')
const data = { users: [] }
for (let i = 0; i < 50; i++) {
  data.users.push({
    id: i,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    dob: faker.date.past()
  })
}
fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(data, null, 2))

const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()


server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use('/api/v1', router)

server.listen(3000, () => {
  console.log('Server is running')
})

