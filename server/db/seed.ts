import { sql } from '@vercel/postgres'
import {
  NewPayment,
  NewUser,
  Payment,
  PaymentTable,
  User,
  UsersTable,
} from '@/server/db/schema'
import { db } from '@/server/db/drizzle'

const newUsers: NewUser[] = [
  {
    name: 'john',
    email: 'abc@mail.com',
    token: '',
    image:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAAAAAAD/7AARRHVja3kAAQAEAAAAHgAA/+EAGEV4aWYAAElJKgAIAAAAAAAAAAAAAAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTIxRjY4NjQ4Q0Y5MTFFM0E4QjE5Q0EzQTYzQkM3N0MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTIxRjY4NjU4Q0Y5MTFFM0E4QjE5Q0EzQTYzQkM3N0MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MjFGNjg2MjhDRjkxMUUzQThCMTlDQTNBNjNCQzc3QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MjFGNjg2MzhDRjkxMUUzQThCMTlDQTNBNjNCQzc3QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/bAEMACgcHCQcGCgkICQsLCgwPGRAPDg4PHhYXEhkkICYlIyAjIigtOTAoKjYrIiMyRDI2Oz1AQEAmMEZLRT5KOT9APf/AAAsIADAAMAEBEQD/xAAaAAACAwEBAAAAAAAAAAAAAAAEBwMFBgIA/8QAMBAAAQMDAQYEBQUBAAAAAAAAAQIDBAAFEQYHEhMhMUFRYYGRFBUiQsEjMlJicbH/2gAIAQEAAD8A70FoNO4iTKR5gEUzJDtu0/blSJrrTDLaScqOM4BOB4nl0pTag21yJTpYsLAiNJWDx3RlagO2OgzQto2xXhmbv3B5qWwo7vCLYQfEkEe3hTgt0uBqa0NzoZ32XRyyMEHuDS813oVLjbkiO3z6kAUz7bFTGjJSkAYFKnbO/Nut9tlhhYWnh8ZSQfuJIBP+AGurJsUgPQC5cZzqpDieQaACUH160Fe9iCosJ+RbLkXHEc0MuIxvDw3vGrLYjPfjuXWxygoKbIfbBGMfaof8ppTYyZDCkqGcip2xhArEa2tCUajtd9QgEstOsOjHMjGQfT6qIsWsI0yUiGm3y2klQQHig8PeIyAe4yCPepbxrGBAnKgvR5alZKS6lvDeQMkb3fA8Kg0VaOFf79dFICfiFtNtY/iG0qV7kj2rZqGRUbKstg1W6ieRGhNPucwh5IwenPI/NBXKU1BiQ3CClkvJClIbKtwdc8h0ru2S49xjy3UfqNJeUApSFJ3u/cCrW1FC4QdRyDiir8fii1HANVdonokxkkKByK9qG3qullfjtLSh3AW2pX7QpJyM+VZm1TJN3t8d6FJW3u5S43hGUqHYlQOKnkSZcBpSH3+M9IIaZaIQneWeQGR19q1NsiqhW1iO4oKcQnCyOm91OPLNemyUx2VKJxypC2rac5ZIISlr4l7olJVgDzJqive0XUV+cPxM9bTGQRHY+hv/AAgc1epNby2PNXyAi52K7fL5e4Eym8BQzjun80FeFOwYr9wud0E18JIayndAHknzql0ttdvlgSiPMV8yhp5BD6jxED+q+voc1o71tVh3a3kwy404RzbcGCPXoa//2Q==',
    memberno: 12345,
  },
]

const newPayments: NewPayment[] = [
  {
    memberno: 12345,
    amount: 500000,
  },
]

export async function seedUsers() {
  const createTable = await sql.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        token VARCHAR(255) NOT NULL,
        memberno INT NOT NULL,
        image VARCHAR(2280) NOT NULL
      );
  `)

  const insertedUsers: User[] = await db
    .insert(UsersTable)
    .values(newUsers)
    .returning()

  console.log(`Created "users" table`)
  console.log(`Seeded ${insertedUsers.length} users`)

  return {
    createTable,
    insertedUsers,
  }
}

export async function seedPayments() {
  const createTable = await sql.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        memberno INT NOT NULL,
        amount INT NOT NULL
      );
  `)

  const insertedPayments: Payment[] = await db
    .insert(PaymentTable)
    .values(newPayments)
    .returning()

  console.log(`Created "payments" table`)
  console.log(`Seeded ${insertedPayments.length} payments`)

  return {
    createTable,
    insertedPayments,
  }
}
