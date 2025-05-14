import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Art
    await knex.schema.createTable('art', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('title_Bangla');
        table.string('year');
        table.string('year_Bangla');
        table.string('type');
        table.text('description');
        table.string('measurement');
        table.string('measurement_Bangla');
        table.string('medium');
        table.string('medium_Bangla');
        table.string('publication');
        table.string('imageUrl');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // BookCover
    await knex.schema.createTable('book_covers', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('author');
        table.string('publisher');
        table.string('date');
        table.string('type');
        table.string('type_Bangla');
        table.string('imageUrl');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // Poster
    await knex.schema.createTable('posters', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('imageUrl');
        table.string('category');
        table.string('year');
        table.string('year_Bangla');
        table.string('for_whom');
        table.string('measurement');
        table.string('measurement_Bangla');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // Logo
    await knex.schema.createTable('logos', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('imageUrl');
        table.string('date');
        table.string('medium');
        table.string('medium_Bangla');
        table.string('measurement');
        table.string('measurement_Bangla');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // MasterHead
    await knex.schema.createTable('master_heads', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('editor');
        table.string('link');
        table.string('imageUrl');
        table.string('date');
        table.string('medium');
        table.string('medium_Bangla');
        table.string('measurement');
        table.string('measurement_Bangla');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // Calligraphy
    await knex.schema.createTable('calligraphies', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('organization');
        table.string('link');
        table.string('imageUrl');
        table.string('date');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // Portrait
    await knex.schema.createTable('portraits', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('link');
        table.string('imageUrl');
        table.string('date');
        table.string('where_used');
        table.string('author');
        table.string('organization');
        table.string('measurement');
        table.string('measurement_Bangla');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // CrestDesign
    await knex.schema.createTable('crest_designs', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('subtitle');
        table.string('date');
        table.string('organization');
        table.string('collector');
        table.string('imageUrl');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // Textile
    await knex.schema.createTable('textiles', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('type');
        table.string('measurement');
        table.string('measurement_Bangla');
        table.string('medium');
        table.string('medium_Bangla');
        table.string('material');
        table.string('imageUrl');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // IllustrationCard
    await knex.schema.createTable('illustrations_cards', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('subtitle');
        table.string('publisher');
        table.string('year');
        table.string('year_Bangla');
        table.string('imageUrl');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // Photograph
    await knex.schema.createTable('photographs', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('subtitle');
        table.string('date');
        table.string('link');
        table.string('details');
        table.string('publisher');
        table.string('measurement');
        table.string('measurement_Bangla');
        table.string('imageUrl');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // WritingByQC
    await knex.schema.createTable('writings_by_qc', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('subtitle');
        table.string('publisher');
        table.string('link');
        table.string('category');
        table.string('date');
        table.string('date_Bangla');
        table.string('imageUrl');
        table.string('imageAlt');
        table.text('text');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // WritingOnQC
    await knex.schema.createTable('writings_on_qc', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('subtitle');
        table.string('author');
        table.string('publisher');
        table.string('link');
        table.string('date');
        table.string('date_Bangla');
        table.string('imageUrl');
        table.string('imageAlt');
        table.text('text');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // TaheraArt
    await knex.schema.createTable('tahera_arts', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('title_Bangla');
        table.string('year');
        table.string('year_Bangla');
        table.string('imageUrl');
        table.string('description');
        table.string('measurement');
        table.string('measurement_Bangla');
        table.string('medium');
        table.string('medium_Bangla');
        table.string('publication');
        table.string('type');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

    // WritingByTC
    await knex.schema.createTable('writings_by_tc', table => {
        table.uuid('id').primary();
        table.string('title');
        table.string('subtitle');
        table.string('publisher');
        table.string('link');
        table.string('category');
        table.string('date');
        table.string('date_Bangla');
        table.string('imageUrl');
        table.string('imageAlt');
        table.text('text');
        table.specificType('tags', 'text[]');
        table.specificType('tags_Bangla', 'text[]');
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
    });

}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("arts");
    await knex.schema.dropTable("book_covers");
    await knex.schema.dropTable("posters");
    await knex.schema.dropTable("logos");
    await knex.schema.dropTable("master_heads");
    await knex.schema.dropTable("calligraphies");
    await knex.schema.dropTable("portraits");
    await knex.schema.dropTable("crest_designs");
    await knex.schema.dropTable("textiles");
    await knex.schema.dropTable("illustrations_cards");
    await knex.schema.dropTable("photographs");
    await knex.schema.dropTable("writings_by_qc");
    await knex.schema.dropTable("writings_on_qc");
    await knex.schema.dropTable("tahera_arts");
    await knex.schema.dropTable("writings_by_tc");
}