import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  varchar,
  integer,
  primaryKey,
  index
} from 'drizzle-orm/pg-core'

export const role = pgEnum('role', ['admin', 'manager', 'team'])

export type Role = (typeof role.enumValues)[number]

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: varchar('name').notNull(),
  email: text('email').notNull().unique(),
  role: role('role').default('admin').notNull(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
})
export type User = typeof user.$inferSelect

export const userRelations = relations(user, ({ many }) => ({
  book_categories: many(book_categories),
  borrowings: many(borrowings)
}))

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
})

export const book_categories = pgTable('book_categories', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
  name: varchar('name').notNull()
})
export type BookCategories = typeof book_categories.$inferSelect

export const books = pgTable('books', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  bookCategoriesId: text('categories_id')
    .notNull()
    .references(() => book_categories.id, { onDelete: 'cascade' }),
  isbn: varchar('isbn').notNull(),
  name: varchar('name').notNull(),
  author: varchar('author').notNull(),
  is_active: boolean('active').notNull().default(true),
  no_of_copies: integer('no_of_copies'),
  publish_year: integer('publish_year'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
})
export type Books = typeof books.$inferSelect

// Join table for Books and Categories. A book can have many categories. A category can have many books
export const books_to_categories = pgTable(
  'books_to_categories',
  {
    bookId: text('book_id').references(() => books.id, {
      onDelete: 'restrict'
    }),
    categoriesId: text('categories_id').references(() => book_categories.id, {
      onDelete: 'restrict'
    })
  },
  table => ({
    pk: primaryKey({ columns: [table.bookId, table.categoriesId] }),
    bookIdIndex: index('bookIdIndex').on(table.bookId)
  })
)
// a category belongs to one user. Each category can have many books
export const bookCategoryRelations = relations(
  book_categories,
  ({ one, many }) => ({
    user: one(user, {
      fields: [book_categories.userId],
      references: [user.id]
    }),
    books: many(books)
  })
)

export const borrowings = pgTable('borrowings', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  bookId: text('books_id')
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
  borrow_date: timestamp({ withTimezone: true }),
  due_date: timestamp({ withTimezone: true }),
  return_date: timestamp({ withTimezone: true })
})

// BORROWINGS RELATIONS
export const borrowingsRelations = relations(borrowings, ({ one }) => ({
  user: one(user, {
    fields: [borrowings.userId],
    references: [user.id]
  })
}))

export const schema = {
  user,
  userRelations,
  account,
  session,
  verification,
  book_categories,
  books_to_categories,
  bookCategoryRelations,
  books,
  borrowings,
  borrowingsRelations
}
