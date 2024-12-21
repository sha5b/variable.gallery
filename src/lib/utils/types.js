/**
 * Base Types
 */

/**
 * @typedef {Object} Media
 * @property {number} id
 * @property {string} source_url
 */

/**
 * @typedef {Object} MetaTag
 * @property {string} [name]
 * @property {string} [property]
 * @property {string} content
 */

/**
 * @typedef {Object} Image
 * @property {string} src
 * @property {string} [alt]
 * @property {number} [width]
 * @property {number} [height]
 */

/**
 * Content Types
 */

/**
 * @typedef {Object} Tag
 * @property {string} name
 * @property {string} [slug]
 */

/**
 * @typedef {Object} Category
 * @property {string} name
 * @property {string} [slug]
 * @property {string} [description]
 */

/**
 * @typedef {Object} Attribute
 * @property {string} name
 * @property {string[]} options
 * @property {string} [type]
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} type
 * @property {string} price
 * @property {string} [short_description]
 * @property {string} [description]
 * @property {string} [regular_price]
 * @property {string} [sale_price]
 * @property {number} [stock_quantity]
 * @property {string} [stock_status]
 * @property {string} [weight]
 * @property {{length: string, width: string, height: string}} [dimensions]
 * @property {Image[]} images
 * @property {Category[]} categories
 * @property {Tag[]} tags
 * @property {Attribute[]} attributes
 * @property {string} date_created
 * @property {string} date_modified
 * @property {number[]} [variations]
 */

/**
 * @typedef {Object} Variation
 * @property {number} id
 * @property {string} name
 * @property {string} regular_price
 * @property {number} stock_quantity
 * @property {string} stock_status
 */

/**
 * @typedef {Object} Exhibition
 * @property {string} date
 * @property {Object} title
 * @property {string} title.rendered
 * @property {string} description
 * @property {string} [slug]
 * @property {Object} acf
 * @property {boolean} acf.virtual
 * @property {number} acf.fingerprint
 * @property {string[]} [acf.artist]
 * @property {string} [acf.location]
 * @property {string} [acf.date]
 * @property {{url: string}} [acf.link]
 */

/**
 * @typedef {Object} Artist
 * @property {number} id
 * @property {Object} title
 * @property {string} title.rendered
 * @property {string} slug
 * @property {Object} [acf]
 * @property {string} [acf.description]
 * @property {string} [acf.location]
 * @property {string} [acf.yearsActive]
 * @property {string} [acf.specialties]
 * @property {string} [acf.profileImage]
 * @property {Array<{platform: string, url: string}>} [acf.socialMedia]
 */

/**
 * SEO & Schema Types
 */

/**
 * @typedef {Object} SeoConfig
 * @property {string} title
 * @property {string} description
 * @property {string[]} keywords
 * @property {Object} openGraph
 * @property {string} [openGraph.image]
 * @property {string} [openGraph.url]
 * @property {string} [openGraph.title]
 * @property {string} [openGraph.description]
 * @property {string} [openGraph.type]
 */

/**
 * @typedef {Object} SchemaData
 * @property {Product[]} [products]
 * @property {Artist[]} [artists]
 * @property {Product} [product]
 * @property {Exhibition[]} [exhibitions]
 */

/**
 * @typedef {Object} PageConfig
 * @property {string} title
 * @property {string} description
 * @property {string[]} keywords
 * @property {Object} openGraph
 * @property {string} openGraph.url
 * @property {string} [schemaType]
 */

/**
 * Page Data Types
 */

/**
 * @typedef {Object} PageData
 * @property {Product[]} [products]
 * @property {Artist[]} [artists]
 * @property {Exhibition[]} [exhibitions]
 * @property {any[]} [media]
 * @property {Product} [product]
 * @property {any} [variation]
 */

export {};
