import { randomUUID } from 'node:crypto'; 
import { buildRoutePath } from './utils/build-route-path.js'   
import { Database } from './middlewares/database.js';

const database =  new Database()

function validateTask(task){
    if(!task){
        return res.writeHead(404).end()
    }
}

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
           const { search } = req.query

           const tasks = database.select('tasks', {
                title: search,
                description: search,
              })
           
            return res.end(JSON.stringify(tasks))
           
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            
            database.insert('tasks', task)

            return res.writeHead(201).end(JSON.stringify(task))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body


            if(!title && !description) {
                return res.writeHead(400).end(JSON.stringify("Error: title or description is required"))
            }

            const [task] = database.select('tasks', { id })

            validateTask(task)

            database.update('tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                updated_at: new Date().toISOString()
            })
            

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const [task] = database.select('tasks', { id })

            validateTask(task)

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/completed'),
        handler: (req, res) => {
            const { id } = req.params


            const [task] = database.select('tasks', { id })

            validateTask(task)

            const isTaskCompleted = !!task.completed_at
            const completed_at = isTaskCompleted ? null : new Date().toISOString()
            
            database.update('tasks', id, {completed_at  })

            return res.writeHead(204).end()
        }
    },
]