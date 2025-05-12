import { Server } from '@hapi/hapi'
import { registerItemRoutes } from './item/interfaces/http/routes'

export const defineRoutes = (server: Server) => {
    server.route({
        method: 'GET',
        path: '/ping',
        handler: async () => ({ ok: true }),
    })

    registerItemRoutes(server)
}