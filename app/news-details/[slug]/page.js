import BlogDetailContent from './_content'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'

async function getPost(slug) {
  try {
    const { connectDB } = await import('@/lib/db')
    const { BlogPost } = await import('@/lib/models/BlogPost')
    await connectDB()
    const post = await BlogPost.findOne({
      $or: [
        { slug },
        ...(slug.match(/^[a-f\d]{24}$/i) ? [{ _id: slug }] : []),
      ],
    }).lean()
    return post
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'This blog post could not be found.',
    }
  }

  const seoTitle = post.seo?.title || post.title
  const seoDesc = post.seo?.description || post.excerpt || `Read ${post.title} on The ParkQueen Hotel blog.`
  const seoKeywords = post.seo?.keywords
  const ogImage = post.seo?.ogImage?.url || post.image?.url || `${SITE_URL}/assets/images/og-image.jpg`
  const canonical = `${SITE_URL}/news-details/${post.slug || params.slug}`

  return {
    title: seoTitle,
    description: seoDesc,
    ...(seoKeywords ? { keywords: seoKeywords.split(',').map(k => k.trim()) } : {}),
    openGraph: {
      type: 'article',
      title: seoTitle,
      description: seoDesc,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630, alt: seoTitle }],
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      authors: [post.author || 'The ParkQueen Hotel'],
      tags: post.tags || [],
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: [ogImage],
    },
    alternates: { canonical },
  }
}

export default async function BlogDetailPage({ params }) {
  const post = await getPost(params.slug)

  const jsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.seo?.title || post.title,
        description: post.seo?.description || post.excerpt,
        image: post.seo?.ogImage?.url || post.image?.url,
        author: {
          '@type': 'Person',
          name: post.author || 'The ParkQueen Hotel',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The ParkQueen Hotel',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/images/logo.png` },
        },
        datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/news-details/${post.slug || params.slug}` },
        keywords: post.seo?.keywords || (post.tags || []).join(', '),
        articleSection: post.category,
        url: `${SITE_URL}/news-details/${post.slug || params.slug}`,
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogDetailContent slug={params.slug} />
    </>
  )
}
