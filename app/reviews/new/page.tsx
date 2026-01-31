'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';

interface Bar {
  id: string;
  name: string;
}

export default function NewReviewPage() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [barId, setBarId] = useState('');
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBars = async () => {
      const { data } = await supabase.from('bars').select('id, name').order('name');
      setBars(data ?? []);
      if (data && data.length > 0) {
        setBarId(data[0].id);
      }
    };
    loadBars();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      setLoading(false);
      setMessage('You must be logged in to create a review.');
      return;
    }

    let imagePath: string | null = null;

    if (imageFile) {
      const filePath = `${session.user.id}/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('review-images')
        .upload(filePath, imageFile, { upsert: false });

      if (uploadError) {
        setLoading(false);
        setMessage(uploadError.message);
        return;
      }
      imagePath = filePath;
    }

    const { error } = await supabase.from('reviews').insert({
      bar_id: barId,
      user_id: session.user.id,
      rating,
      body,
      image_path: imagePath
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setBody('');
    setImageFile(null);
    setMessage('Review submitted successfully.');
  };

  return (
    <section>
      <h2>Create a Review</h2>
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="bar">Bar</label>
          <select
            id="bar"
            value={barId}
            onChange={(event) => setBarId(event.target.value)}
            required
          >
            {bars.map((bar) => (
              <option key={bar.id} value={bar.id}>
                {bar.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="body">Notes</label>
          <textarea
            id="body"
            rows={4}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Share your impressions..."
          />
        </div>
        <div className="form-row">
          <label htmlFor="image">Upload Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
      {message ? <p className="notice">{message}</p> : null}
    </section>
  );
}
