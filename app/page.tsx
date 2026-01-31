import { createServerSupabaseClient } from '../lib/supabase/server';

export default async function HomePage() {
  const supabase = createServerSupabaseClient();
  const [{ data: bars }, { data: posts }] = await Promise.all([
    supabase.from('bars').select('id, name, neighborhood, description').order('name'),
    supabase.from('posts').select('id, title, body, published_at').order('published_at', {
      ascending: false
    })
  ]);

  return (
    <section>
      <h2>Public Bars</h2>
      {bars?.length ? (
        bars.map((bar) => (
          <article key={bar.id} className="card">
            <h3>{bar.name}</h3>
            <p>{bar.neighborhood}</p>
            <p>{bar.description}</p>
          </article>
        ))
      ) : (
        <p className="notice">No bars found yet. Run the seed script to load data.</p>
      )}

      <h2>Latest Posts</h2>
      {posts?.length ? (
        posts.map((post) => (
          <article key={post.id} className="card">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <small>Published {new Date(post.published_at).toLocaleDateString()}</small>
          </article>
        ))
      ) : (
        <p className="notice">No posts available yet.</p>
      )}
    </section>
  );
}
