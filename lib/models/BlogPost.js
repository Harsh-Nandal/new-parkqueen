import mongoose from 'mongoose'

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    excerpt: { type: String },
    content: { type: String },
    category: { type: String, default: 'Hospitality' },
    tags: { type: [String], default: [] },
    image: { url: String, public_id: String },
    author: { type: String, default: 'Admin' },
    publishedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    // CTA button (optional — shown at end of article)
    ctaText: { type: String },
    ctaLink: { type: String },
    // SEO
    seo: {
      title: String,
      description: String,
      keywords: String,
      ogImage: { url: String, public_id: String },
    },
  },
  { timestamps: true }
)

BlogPostSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  next()
})

BlogPostSchema.index({ status: 1, publishedAt: -1 })
BlogPostSchema.index({ slug: 1 })

export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)
