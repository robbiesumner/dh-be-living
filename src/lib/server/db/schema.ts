import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const profiles = sqliteTable('profiles', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	role: text('role', { enum: ['tenant', 'landlord', 'both'] })
		.notNull()
		.default('tenant'),
	phone: text('phone'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const apartments = sqliteTable('apartments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	landlordId: integer('landlord_id')
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	address: text('address').notNull(),
	size: integer('size').notNull(),
	rentPrice: real('rent_price').notNull(),
	availableFrom: integer('available_from', { mode: 'timestamp' }).notNull(),
	availableTo: integer('available_to', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const requests = sqliteTable('requests', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	tenantId: integer('tenant_id')
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),
	apartmentId: integer('apartment_id')
		.notNull()
		.references(() => apartments.id, { onDelete: 'cascade' }),
	status: text('status', { enum: ['pending', 'accepted', 'rejected'] })
		.notNull()
		.default('pending'),
	message: text('message').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const profilesRelations = relations(profiles, ({ many }) => ({
	apartments: many(apartments), // If they are a landlord
	requests: many(requests) // If they are a tenant
}));

export const apartmentsRelations = relations(apartments, ({ one, many }) => ({
	landlord: one(profiles, {
		fields: [apartments.landlordId],
		references: [profiles.id]
	}),
	requests: many(requests)
}));

export const requestsRelations = relations(requests, ({ one }) => ({
	tenant: one(profiles, {
		fields: [requests.tenantId],
		references: [profiles.id]
	}),
	apartment: one(apartments, {
		fields: [requests.apartmentId],
		references: [apartments.id]
	})
}));
