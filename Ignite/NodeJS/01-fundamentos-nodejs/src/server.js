import http from 'node:http';

// CommonJS => require
// ESModules => import/export

//HTTP 
// - Método HTTP
// - URL 

// Statefull -> Stateless
// Statefull depende de informações na memoria
// Stateless independente de parar a aplicação ou não, se manterá a mesma

// Cabeçalhos == (Req, Res) => Metadados

const users = []

const server = http.createServer((req, res) => {
    const { method, url } = req

    if (method === 'GET' && url === '/users') {
        return res
        .setHeader('Content-Type', 'application/json')
        .end(JSON.stringify(users))
    }
    if (method === 'POST' && url === '/users') {
        users.push({
            id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
        })

        return res.writeHead(201).end()
    }


    return res.writeHead(404).end()
})

server.listen(3333)