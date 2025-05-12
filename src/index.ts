import { startServer } from "./server";

process.on('unhandledRejection', (err) => {
    console.error(err)
    process.exit(1)
})
process.on('uncaughtException', (err) => {
    console.error(err)
    process.exit(1)
})

startServer().catch(err => {
    console.error(err)
    process.exit(1)
})